---
layout: post
title: "jsDelivr ile GitHub Dosyalarını CDN Üzerinden Sunmak (Kısa ve Net Rehber)"
date: 2026-01-09 10:00:00 +0300
description: Public GitHub repo dosyalarını jsDelivr ile commit-bazlı, immutable ve cache-friendly şekilde CDN üzerinden sunmanın pratik yolu.
tags:
  - cdn
  - jsdelivr
  - github
  - performance
  - frontend
---

Public bir GitHub reposundaki tek bir dosyayı hızlı, güvenli ve cache problemi yaşamadan servis etmek istiyorsanız, çoğu senaryo için ekstra altyapıya gerek yok.
**jsDelivr**, GitHub’ı doğrudan CDN kaynağı gibi kullanmanıza izin verir.

Bu yazı “neden”den çok **“nasıl doğru kullanılır”** kısmına odaklanıyor.



## Temel URL formatı

```text
https://cdn.jsdelivr.net/gh/<user>/<repo>@<version>/<path>
```

* `<user>`: GitHub kullanıcı adı
* `<repo>`: repository adı
* `<version>`: **commit SHA**, tag veya branch
* `<path>`: repo içindeki dosya yolu

> Kritik nokta: **version olarak commit SHA kullanın.**
> Branch veya `main` kullanmak cache sürprizi üretir.



## Gerçek örnek (bu blogtaki dosya)

Kaynak dosya (GitHub):

```
https://github.com/fmarslan/fmarslan.github.io/blob/a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js
```

jsDelivr CDN URL:

```
https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js
```

HTML içinde kullanım:

```html
<script src="https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js"></script>
```

Bu URL:

* Immutable’dır
* CDN cache’i güvenle çalışır
* Dosya değiştiğinde **yeni commit = yeni URL** demektir



## CLI ve runtime örnekleri

### curl

```bash
curl -L \
"https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js"
```

### Node.js

```js
import fetch from 'node-fetch';

const url =
  'https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js';

const res = await fetch(url);
if (!res.ok) throw new Error(res.statusText);

const content = await res.text();
console.log(content);
```



## İyi uygulamalar (prod için önemli)

* **Commit SHA kullan**
  → cache invalidation derdi yok.
* Dosya güncellendiyse
  → **yeni commit, yeni URL**.
* jsDelivr **sadece public repo** sunar.
* Kimlik doğrulama, gizli veri, PII varsa
  → bu yöntem **yanlış**.
* Kritik prod yükleri için
  → S3 + CloudFront / Cloudflare gibi kendi edge çözümünü düşün.



## Sık görülen sorunlar

**404 alıyorum**

* Repo adı, path veya commit SHA yanlış.
* Dosya o commit’te gerçekten var mı kontrol et.

**Dosya eski geliyor**

* Branch kullanıyorsun.
* Commit SHA’ya geç.

**Kurumsal ağda erişim yavaş**

* jsDelivr rate-limit veya network politikası.
* Alternatif CDN gerekebilir.



## Ne zaman mantıklı, ne zaman değil?

**Mantıklı**

* Blog, dokümantasyon, statik JS/CSS
* Küçük helper script’ler
* Immutable asset’ler

**Mantıksız**

* Gizli kod
* Sık değişen runtime bağımlılıkları
* SLA gerektiren kritik prod bileşenleri



Özetle:
Eğer **public**, **küçük** ve **değiştiğinde URL’si de değişsin** diyorsan, jsDelivr yeterli.
Burada sorun teknik değil; **yanlış yerde branch URL kullanmak**.

İstersen bir sonraki adımda aynı dosyanın **S3 + CloudFront** veya **Cloudflare Workers** karşılığını yan yana koyup farklarını netleştirebiliriz.
