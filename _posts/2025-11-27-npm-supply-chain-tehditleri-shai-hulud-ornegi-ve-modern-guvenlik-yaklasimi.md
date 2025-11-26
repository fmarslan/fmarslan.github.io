---
layout: post
title: "NPM Supply-Chain Tehditleri: Shai-Hulud Örneği ve Modern Güvenlik Yaklaşımı"
date: 2025-11-27 09:00:00 +0300
description: Shai-Hulud saldırısını ve NPM supply-chain risklerine karşı pratik koruma yaklaşımını özetleyen notlar.
image: /assets/img/npm-supply-chain-shai-hulud-cover.png
tags:
  - security
  - npm
  - supply-chain
  - devops
---

Yazılım geliştirme süreçleri büyüdükçe, saldırganların odak noktası uygulamalardan geliştiricilerin bilgisayarlarına, CI/CD hatlarına ve bağımlılık zincirlerine kaymaya başladı. Bu yeni nesil tehditlerin en dikkat çekici örneklerinden biri de **Shai-Hulud** sınıfı supply-chain saldırıları.

Bu yazıda saldırının temel prensiplerini, neden son derece tehlikeli olduğunu ve modern yazılım ekiplerinin bu tip risklere karşı uygulayabileceği pratik bir savunma yaklaşımını anlatıyorum. Ayrıca bu kapsamda kullanılan scriptler ve güvenlik otomasyon mekanizmaları da yazının sonunda örnek olarak paylaşılmıştır.


![NPM Supply-Chain Tehditleri: Shai-Hulud Örneği ve Modern Güvenlik Yaklaşımı](/assets/img/npm-supply-chain-shai-hulud-cover.png)



# 🎯 Shai-Hulud Saldırısı Nedir?

Shai-Hulud, bağımlılık (dependency) yükleme mekanizmasını kullanarak geliştiricilerin local ortamlarına, erişim anahtarlarına ve CI/CD süreçlerine sızan bir supply-chain saldırısıdır.

Saldırı tipik olarak şu şekilde ilerler:

### **1) Zararlı paket sürümünün yayımlanması**

Saldırgan, ele geçirilen bir NPM maintainer hesabı veya typo-squatting yöntemiyle popüler bir paketin adını taklit eder.

### **2) `npm install` sırasında zararlı script'in otomatik çalışması**

NPM paketleri kurulurken `install`, `postinstall`, `prepare` gibi lifecycle script’leri otomatik olarak tetiklenir.
Saldırgan bu doğal davranışı kullanarak sisteme kod enjekte eder.

### **3) Makinedeki kritik bilgilerin toplanması**

Kötü amaçlı script aşağıdaki verileri toplayabilir:

* Çevre değişkenleri (ENV)
* Git erişim token’ları
* SSH özel anahtarları
* Cloud provider kimlik bilgileri
* CI/CD access token’ları
* Local ayar dosyaları

### **4) Toplanan bilgilerin saldırgana iletilmesi**

Bazı varyantlarda saldırgan, kurbanın Git hesabında sıradan görünen bir repo oluşturarak verileri buraya yükler.
Örneğin `environment.json` gibi masum görünen dosyalar aslında sızdırılmış kimlik bilgilerini içerebilir.

### **5) Zincirleme etki**

Bu bilgilerle saldırgan:

* CI/CD pipeline’larını ele geçirebilir
* Docker registry’lerde push/pull yapabilir
* Kubernetes cluster yönetimine erişebilir
* Diğer paketlere zararlı sürüm yayımlayabilir
* Üretim ortamlarında kalıcı erişim elde edebilir

Bu yüzden bu saldırı tek bir geliştiriciden tüm organizasyona yayılabilen büyük bir risktir.



# ⚠️ Kritik Not: DevOps ve Sistem Yöneticilerinin Local Riskleri

Gerçekte en büyük risklerden biri şudur:

**DevOps veya sistem yöneticileri**, pratik olduğu için local makinelerinde:

* SSH anahtarları
* Deployment credential’ları
* Cloud provider sertifikaları
* Kubernetes kubeconfig dosyaları
* Admin token’ları

gibi **tam yetkili erişim bilgilerini** saklayabiliyor.

Bir lifecycle script’i bu bilgileri ele geçirirse saldırganın önünde doğrudan:

* CI/CD yönetimi
* Cloud hesap yönetimi
* Üretim altyapısı
* Registry erişimleri
* Kurumsal yönetim katmanı

açılmış olur.

Bu nedenle supply-chain saldırılarına karşı alınan önlemler, özellikle **yüksek yetkili kullanıcıların local ortamlarını** da kapsamalıdır.



# 🛡 Modern Supply-Chain Güvenlik Yaklaşımı

Aşağıdaki yaklaşım, bu tip saldırılara karşı pratik ve sürdürülebilir bir koruma sağlar.



## **1) Lifecycle Script Taraması (install / postinstall analizi)**

Bağımlılık zincirindeki tüm paketleri tarayan küçük bir script kullanıyorum:

* `preinstall`
* `install`
* `postinstall`
* `prepare`

gibi hook’ları otomatik tespit eder.
Her değişiklikte ve release öncesinde çalışır.

### **Örnek tarama script’i – `tools/check-scripts.js`**

```js
#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TARGET_SCRIPTS = new Set(['preinstall', 'install', 'postinstall', 'prepare']);
const root = path.resolve('node_modules');
const results = [];

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function inspectPackage(pkgDir) {
  const pkgPath = path.join(pkgDir, 'package.json');
  if (!(await fileExists(pkgPath))) return;

  const raw = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts || {};
  const relevant = {};

  for (const key of TARGET_SCRIPTS) {
    if (scripts[key]) {
      relevant[key] = scripts[key];
    }
  }

  if (Object.keys(relevant).length > 0) {
    const suspicious = Object.values(relevant).some(cmd =>
      /curl|wget|node\s+-e|powershell|Invoke-WebRequest/i.test(cmd)
    );

    results.push({
      name: pkg.name,
      version: pkg.version,
      path: pkgDir,
      scripts: relevant,
      suspicious
    });
  }

  const nested = path.join(pkgDir, 'node_modules');
  if (await fileExists(nested)) {
    await walk(nested);
  }
}

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('@')) {
      await walk(full);
      continue;
    }
    await inspectPackage(full);
  }
}

async function main() {
  if (!(await fileExists(root))) {
    console.error('node_modules not found. Run npm ci first.');
    process.exit(1);
  }
  await walk(root);
  console.log(JSON.stringify(results, null, 2));
}

main();
```



## **2) CI’da Lifecycle Script’lerini Devre Dışı Bırakma**

Her build şu şekilde çalıştırılır:

```bash
npm ci --ignore-scripts
```

Bu sayede hiçbir lifecycle script’i otomatik çalışmaz.
Gerekirse manuel onayla:

```bash
npm rebuild
```

komutu kullanılabilir.



## **3) Otomatik Güvenlik Pipeline’ı (Audit + Secret Scan + Lifecycle Analizi)**

Her dependency güncellemesinde ve her release’te:

1. `npm run scan:lifecycle`
2. `npm audit --production --audit-level=high`
3. `npx gitleaks detect --redact`
4. Raporlar `reports/security-check.log` dosyasına yazılır
5. Kritik durumlarda CI/CD release’i engeller

Bu mekanizma supply-chain saldırılarına karşı sürekli kontrol sağlar.



## **4) DevContainer İçinde Güvenli Geliştirme**

DevContainer ilk açıldığında:

```bash
pnpm install --ignore-scripts
npm install --ignore-scripts
npm run scan:lifecycle
```

gibi bir kural zorlanır.
Local ortamda otomatik script çalışması engellenir.



## **5) Deterministik Kurulum (lockfile disiplini)**

* Her zaman `package-lock.json` commitli
* CI yalnızca `npm ci` ile çalışıyor
* Versiyon dalgalanması engelleniyor

Bu yaklaşım supply-chain bulaşmalarının en yaygın vektörünü kapatır.



# 🎯 Sonuç

Shai-Hulud ve benzeri saldırılar, modern yazılım takımları için kritik bir uyarıdır:
**Artık sadece ürettiğimiz kod değil, kullandığımız zincir de korunmalıdır.**

Bu yazıda anlatılan yaklaşım:

* Bağımlılık zincirini tarayan lifecycle script analizi
* CI’da script çalıştırmayı engelleyen güvenli kurulum
* Audit ve secret scanning mekanizmaları
* Local ortamı da kapsayan DevContainer güvenliği
* Lockfile disiplini

sayesinde supply-chain risklerini ciddi ölçüde azaltır.

Her ekip kendi yapısına göre daha gelişmiş güvenlik politikaları ekleyebilir, ancak bu temel mimari; modern, pratik ve sürdürülebilir bir başlangıç noktasıdır.