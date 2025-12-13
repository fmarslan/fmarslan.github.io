---
layout: post
title: "Chrome / Edge'de 'unknown address space' CORS hatası: Neden oldu, nasıl tespit edildi, neyi koruyor ve nasıl çözülür?"
date: 2025-12-12 09:00:00 +0300
description: Chrome 142+ sürümlerinde ortaya çıkan "unknown address space" CORS hatasının arkasındaki Local Network Access güvenlik modelini, gerçek senaryolardaki etkilerini ve kalıcı çözümleri inceleyen rehber.
image: /assets/img/7f100c91-2ecb-40ad-b64e-e54e08778f34.png
tags:
  - chrome
  - edge
  - cors
  - security
  - private-network-access
---

Modern tarayıcılar artık sadece klasik CORS (Cross-Origin Resource Sharing) kurallarını uygulamakla kalmıyor; aynı zamanda kaynağın **adres alanına** (public / private IP farkı) göre yeni güvenlik denetimleri getiriyor. Bu yüzden özellikle **Chrome 142+ ve Edge (Chromium)** sürümlerinde aşağıdaki gibi bir hatayla daha sık tanışıyoruz:

```
Access to fetch at '...private IP...' from origin '...public domain...' has been blocked by CORS policy: Permission was denied for this request to access the `unknown` address space.
```

Bu yazıda hatanın nedenlerini, hangi sürümle devreye girdiğini, neyi koruduğunu, gerçek dünyada tetiklediği sorunları ve kesin çözüm yollarını özetliyorum.

![Local Network Access hata görseli](/assets/img/7f100c91-2ecb-40ad-b64e-e54e08778f34.png)

---

## 🔹 1) Bu hata neden ortaya çıkıyor?

Tarayıcılar geçmişte sadece same-origin kurallarına göre erişim denetimi yaparken, son yıllarda **yerel ağ güvenliği** için yeni modeller tanımladılar.

### 📍 Local Network Access (LNA) / Private Network Access (PNA)

[Chrome ekibi Private Network Access modelini](https://developer.chrome.com/blog/private-network-access-update/) tanımlarken ana hedef şuydu:

> "HTTPS üzerinden yayın yapan *public-origin* bir sayfanın, kullanıcının yerel ağındaki IP adreslerine (10.x, 192.168.x.x vb.) tarayıcı üzerinden doğrudan fetch/HTTP isteği yapmasını engelleyen ek bir güvenlik katmanı."

Chrome 142 ve sonrası sürümlerde:

* Local network'e giden istekler **explicit izin** gerektiriyor,
* Aksi halde tarayıcı **adres alanı (address space)** temelli engelleme yapıyor,
* Bu engelleme klasik CORS hatası gibi görünse de aslında "IP alanı güvenliği" politikasıdır. ([Chrome 142 beta notları](https://developer.chrome.com/blog/chrome-142-beta/))

Dolayısıyla:

➡️ Public bir site (ör. `portal.azure.com`)  
➡️ Private IP'ye (`10.1.x.x` gibi çözümlenen bir AKS private endpoint) fetch atarsa  
➡️ Tarayıcı adres alanı farkından dolayı isteği keser  
➡️ Konsolda "unknown address space" CORS hatasını görürsünüz. ([PNA preflight detayları](https://developer.chrome.com/blog/private-network-access-preflight/))

---

## 🔹 2) Bu özellik ne zaman devreye girdi?

PNA kontrolleri birkaç yıldır kademeli geliyor ancak kritik kırılım **Chromium 142** oldu.

### 📅 Tarihsel süreç

* 🎯 **2022 ve öncesi:** CORS-RFC1918 olarak anılan ilk özel ağ kontrolleri Chrome flag'leriyle denendi.
* 🚀 **2023:** [Private Network Access preflight sürecinin zorunluluğu duyuruldu](https://developer.chrome.com/blog/private-network-access-preflight/) ve üretime hazırlanması istendi.
* 🧱 **2025, Chrome 142+ sürümleri:** Beta notlarında public → private erişimlerin izin istemeden yapılamayacağı resmen açıklandı. ([Chrome 142 beta](https://developer.chrome.com/blog/chrome-142-beta/))

Bu sürümden itibaren tarayıcı, yerel IP adreslerine (ör. AKS private endpoint'leri) yapılan erişimi otomatik engelliyor; yalnızca kullanıcı onayı veya kurumsal politika varsa izin veriyor.

---

## 🔹 3) Peki bu kısıtlama neyi koruyor?

Bu modelin arkasında gerçek bir güvenlik ihtiyacı var:

### ⚠️ Yerel ağ saldırılarını önleme

Public bir web sitesi, kullanıcı farkında olmadan yerel ağındaki cihazlara ya da yönetim API'lerine istek gönderebilir. Bu:

* CSRF tarzı saldırılara zemin hazırlıyor,
* Yerel ağ cihazlarından bilgi sızdırabiliyor,
* Yönetim API'lerine yetkisiz erişim açabiliyor.

### 🔒 Tarayıcı politikalarının rolü

Bu nedenle Chrome ve Edge gibi Chromium tabanlı tarayıcılar:

* Public → private IP erişimini varsayılan olarak **engelliyor**,
* Kullanıcıdan **Local Network Access izni** çıkmadıkça isteği durduruyor,
* Konsolda "unknown address space" mesajı veriyor.

Bu durum klasik CORS politika ihlalinden farklı; çünkü problem header değil, adres alanı eşleşmemesi. ([Chrome güvenlik duyuruları](https://developer.chrome.com/blog/private-network-access-update/))

---

## 🔹 4) Bu sorun hangi senaryolarda ortaya çıkıyor?

Yeni politika aşağıdaki örneklerde özellikle görünür hale geliyor.

### 🚧 A) Cloud portal UI'larında erişim blokları

* Azure AKS gibi private cluster'larda portal UI (`portal.azure.com`) Kubernetes API'lerine (`*.azmk8s.io`) fetch atarken LNA engeline takılabiliyor.
* Kullanıcı tarayıcıya izin verene kadar istekler `unknown address space` hatasıyla dönüyor.
* Edge / Chrome bu davranışı sıkı uygular; Firefox gibi tarayıcılar daha esnek bırakabiliyor.

### 🚧 B) Yerel geliştirme ve localhost istemcileri

Local'de çalışan bir React ya da Next.js uygulaması, aynı makinedeki backend'e istek atarken bile şu hatayı alabiliyor:

```
Access to fetch at … blocked by CORS policy: Permission was denied for this request to access the `unknown` address space.
```

Klasik `Access-Control-Allow-Origin` header'ı yeterli değil çünkü tarayıcı önce adres alanını doğruluyor. [Dynamsoft'ın Chromium 142 notlarında](https://www.dynamsoft.com/web-twain/docs/faq/chromium-142-local-network-access-issue.html) bu durum ayrıntılı olarak anlatıldı.

### 🚧 C) Kurumsal uygulamalarda SSO token exchange sorunları

* Bazı kimlik sağlayıcı akışlarında (MSAL, silent SSO) tarayıcı hatası "LocalNetworkAccessPermissionDenied" olarak dönüyor.
* [Microsoft Authentication Library için açılan GitHub issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/8100) ve [ASP.NET Core tarafındaki tartışmalar](https://github.com/dotnet/aspnetcore/issues/64699) bu problemleri doğruluyor.

---

## 🔹 5) Kesin çözüm ve alınacak önlemler

Bu politika yalnızca CORS header'ıyla çözülemiyor; aşağıdaki adımlar gerekiyor.

### ✅ 1) Tarayıcıda Local Network Access izni verin

Edge veya Chrome adres çubuğuna:

```
chrome://settings/content/localNetworkAccess
```

ya da

```
edge://settings/content/localNetworkAccess
```

yazarak ilgili site için LNA iznini **Allow** konumuna alın. Bu işlem, tarayıcının private IP'lere fetch yapmasına izin verir. [Jamf Trust'ın destek makalesi](https://support.jamf.com/en/articles/12894739-chrome-local-network-access-prompts-with-jamf-trust-ztna) bu adımı ekran görüntüleriyle anlatıyor.

### ✅ 2) Tarayıcı izin istemiyorsa manuel açın

1. Settings → Privacy & Security → Site Settings  
2. Local Network Access  
3. Portal ya da uygulama domain'ini "Allow" listesine ekleyin.

Bu yol, otomatik prompt çıkmadığında en hızlı çözüm.

### ✅ 3) Sunucu tarafında PNA uyumlu header'lar ekleyin

İstekleriniz preflight aşamasında `Access-Control-Request-Private-Network: true` header'ı taşıyorsa backend tarafında:

```
Access-Control-Allow-Private-Network: true
Access-Control-Allow-Origin: https://example.com
```

gibi yanıt header'larını döndürerek tarayıcıya "private ağa erişime izin veriyorum" bilgisini verin. Bu, Local Network Access ön kontrolünü geçmenin tek teknik yoludur. ([PNA preflight rehberi](https://developer.chrome.com/blog/private-network-access-preflight/))

### ✅ 4) Reverse proxy / public endpoint kullanın

Özellikle VPN + private cluster senaryolarında:

➡️ API'yı public bir hostname üzerinden servis edin,  
➡️ Browser / portal UI aynı domain üzerinden fetch atsın.

Böylece public → private IP atlaması ortadan kalkar ve tarayıcı LNA katmanını devreye sokmaz.

---

## 🧠 Sonuç

Chrome / Edge'in yeni CORS hatası aslında klasik bir CORS problemi değil:

> **Public-origin bir sayfanın private IP'lere doğrudan erişimi tarayıcı tarafından engelleniyor.**

Bu politika:

* Kullanıcıların yerel ağ güvenliğini artırıyor,
* CSRF ve local network saldırılarını zorlaştırıyor,
* Fakat cloud portal arayüzleri, lokal geliştirme ortamları ve silent SSO gibi akışlarda yeni uyumluluk görevleri doğuruyor.

Doğru izin ve header kombinasyonuyla bu engeli aşabilir, aynı zamanda tarayıcıların beklediği güvenlik modeline uyum sağlayabilirsiniz. 👌

---

## 📚 Kaynaklar

1. [Private Network Access update: Introducing a deprecation trial — Chrome for Developers](https://developer.chrome.com/blog/private-network-access-update/)
2. [Chrome 142 beta release notes — Chrome for Developers](https://developer.chrome.com/blog/chrome-142-beta/)
3. [Private Network Access: introducing preflights — Chrome for Developers](https://developer.chrome.com/blog/private-network-access-preflight/)
4. [Chrome Local Network Access prompts with Jamf Trust ZTNA — Jamf Support](https://support.jamf.com/en/articles/12894739-chrome-local-network-access-prompts-with-jamf-trust-ztna)
5. [Chromium 142 Local Network Access issue and "unknown address space" error — Dynamsoft](https://www.dynamsoft.com/web-twain/docs/faq/chromium-142-local-network-access-issue.html)
6. [ssoSilent fails in Chrome 142 (LocalNetworkAccessPermissionDenied) — AzureAD / MSAL JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/8100)
7. [Blazor WASM silent logins blocked by Chrome 142 LocalNetworkAccessPermissionDenied — dotnet/aspnetcore](https://github.com/dotnet/aspnetcore/issues/64699)
