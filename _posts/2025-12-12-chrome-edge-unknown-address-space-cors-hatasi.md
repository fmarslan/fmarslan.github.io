---
layout: post
title: "Chrome / Edge’de 'unknown address space' CORS hatası: ne oldu, neyi koruyor, nasıl çözülür?"
date: 2025-12-12 09:00:00 +0300
description: Chrome 142+ ile birlikte ortaya çıkan 'unknown address space' CORS hatasının arkasındaki Private Network Access modelini, nedenlerini ve pratik çözüm yollarını anlatan deneyim odaklı bir yazı.
image: /assets/img/7f100c91-2ecb-40ad-b64e-e54e08778f34.png
tags:
  - chrome
  - edge
  - cors
  - security
  - private-network-access
---

Modern tarayıcıların güvenlik modeli artık sadece **origin** kavramıyla sınırlı değil.
Chrome ve Edge gibi Chromium tabanlı tarayıcılar, isteklerin **hangi IP alanına** gittiğini de dikkate alıyor.

Bu yüzden Chrome 142 ve sonrası sürümlerde aşağıdaki hatayla daha sık karşılaşır olduk:

```
Access to fetch at '...private IP...' from origin '...public domain...' 
has been blocked by CORS policy: Permission was denied for this request 
to access the `unknown` address space.
```

İlk bakışta klasik bir CORS problemi gibi görünüyor ama aslında mesele bambaşka.

Bu yazıda bu hatanın:

* neden ortaya çıktığını,
* hangi güvenlik modelinin sonucu olduğunu,
* neyi koruduğunu,
* gerçek hayatta nerelerde karşımıza çıktığını
* ve **nasıl kalıcı şekilde çözülebileceğini**

toparlamaya çalıştım.

![Local Network Access hata görseli](/assets/img/7f100c91-2ecb-40ad-b64e-e54e08778f34.png)

---

## Bu hata neden ortaya çıkıyor?

Tarayıcılar uzun süre boyunca sadece **same-origin** ve klasik CORS kurallarına göre hareket etti.
Ancak bu model, kullanıcıların **yerel ağlarını** yeterince korumuyordu.

Chrome ekibi bu boşluğu kapatmak için **Private Network Access (PNA)** ya da eski adıyla **Local Network Access (LNA)** modelini devreye aldı.

Temel fikir şu:

> Public bir web sitesi, kullanıcının tarayıcısı üzerinden yerel ağdaki IP’lere (10.x, 192.168.x.x gibi) sessizce istek atamamalı.

Bu yüzden artık tarayıcılar:

* isteğin gittiği adresin **public mi private mı** olduğuna bakıyor,
* public origin → private IP geçişlerini otomatik olarak durduruyor,
* ve bunu klasik bir CORS hatası gibi raporluyor.

Buradaki “unknown address space” ifadesi, aslında tarayıcının hedef IP alanını güvenli bulmadığını söylüyor.

---

## Ne zaman devreye girdi?

Bu mekanizma aslında yeni değil; birkaç yıldır kademeli olarak hazırlanıyordu.

Ama pratikte kırılma noktası **Chromium 142** oldu.

Özetle süreç şöyle ilerledi:

* İlk denemeler yıllar önce CORS-RFC1918 adıyla flag arkasında başladı
* 2023’te PNA için **preflight zorunluluğu** açıklandı
* 2025 itibarıyla (Chrome 142+) public → private erişimler varsayılan olarak engellenir hale geldi

Yani bugüne kadar “bir şekilde çalışan” pek çok akış, bu sürümle birlikte kırılmaya başladı.

---

## Tarayıcılar tam olarak neyi koruyor?

Bu kısıtlama keyfi değil, oldukça net bir güvenlik ihtiyacından doğuyor.

Bir düşünelim:

* Kullanıcı public bir siteyi açıyor
* O site, tarayıcı üzerinden kullanıcının yerel ağındaki cihazlara istek atabiliyor
* Router arayüzleri, admin panelleri, internal API’ler hedef haline geliyor

Bu durum:

* CSRF benzeri saldırılara,
* local network keşfine,
* hatta bazı cihazlarda yetkisiz yönetim erişimine kadar gidebiliyor.

PNA modeliyle tarayıcı şunu diyor:

> “Public bir sayfa, private ağa girmek istiyorsa bunu açıkça söylemeli ve izin almalı.”

---

## Gerçek hayatta nerelerde karşımıza çıkıyor?

Bu hata en çok şu senaryolarda ortaya çıkıyor.

### Cloud portal’lar ve private cluster’lar

Örneğin:

* Azure Portal üzerinden
* Private AKS cluster API’lerine erişmeye çalıştığınızda

Tarayıcı public bir domain’den private endpoint’e istek atıldığını fark edip isteği kesebiliyor.

Edge ve Chrome bu konuda oldukça katı davranırken, Firefox’un daha esnek olduğu durumlar görülebiliyor.

---

### Lokal geliştirme ortamları

Local’de çalışan bir frontend uygulamasının, yine local’deki backend’e istek atarken bile bu hatayı vermesi mümkün.

Bu noktada klasik:

```
Access-Control-Allow-Origin
```

header’ı hiçbir işe yaramıyor.

Çünkü tarayıcı henüz CORS aşamasına bile gelmeden, adres alanını engelliyor.

---

### SSO ve silent auth akışları

Bazı MSAL / SSO senaryolarında hata daha da kafa karıştırıcı hale geliyor:

* Silent login çalışmıyor
* Konsolda `LocalNetworkAccessPermissionDenied` benzeri hatalar görünüyor
* Sorun ilk bakışta auth tarafında sanılıyor

Oysa kök neden yine tarayıcının private network erişimini engellemesi.

---

## Peki nasıl çözülür?

Bu noktada şunu net söylemek lazım:
Bu problem **sadece CORS header’ı ekleyerek** çözülmez.

Birden fazla çözüm yolu var ve senaryoya göre seçim yapmak gerekiyor.

---

### Tarayıcıdan Local Network Access izni vermek

Chrome veya Edge’de şu adreslerden:

```
chrome://settings/content/localNetworkAccess
edge://settings/content/localNetworkAccess
```

ilgili siteyi **Allow** listesine eklemek, en hızlı çözümdür.

Özellikle portal veya admin arayüzlerinde genelde yeterli olur.

---

### Sunucu tarafında PNA uyumlu header’lar dönmek

Eğer istekleriniz preflight aşamasında:

```
Access-Control-Request-Private-Network: true
```

header’ı ile geliyorsa, backend tarafında şu header’ları açıkça döndürmeniz gerekir:

```
Access-Control-Allow-Private-Network: true
Access-Control-Allow-Origin: https://example.com
```

Bu, tarayıcıya “evet, private network erişimine bilerek izin veriyorum” demenin tek teknik yoludur.

---

### Public endpoint veya reverse proxy kullanmak

Özellikle kurumsal ortamlarda en temiz çözüm genelde budur:

* Tarayıcının konuştuğu endpoint public bir hostname olur
* Asıl private servisler arkada kalır
* Tarayıcı public → public konuştuğunu zanneder

Böylece PNA katmanına hiç takılmadan ilerlenir.

---

## Sonuç

Chrome ve Edge’de gördüğümüz bu hata, klasik anlamda bir CORS problemi değil.

Aslında tarayıcı şunu söylüyor:

> “Public bir sayfanın, private ağa erişmesine izin vermiyorum.”

Bu yaklaşım:

* yerel ağ güvenliğini ciddi şekilde artırıyor,
* eski alışkanlıklarla yazılmış uygulamaları zorluyor,
* ama uzun vadede daha güvenli bir web modeli oluşturuyor.

Doğru izinler, doğru header’lar ve doğru mimariyle bu modele uyum sağlamak mümkün.

---

## Kaynaklar

1. [Private Network Access update: Introducing a deprecation trial — Chrome for Developers](https://developer.chrome.com/blog/private-network-access-update/)
2. [Chrome 142 beta release notes — Chrome for Developers](https://developer.chrome.com/blog/chrome-142-beta/)
3. [Private Network Access: introducing preflights — Chrome for Developers](https://developer.chrome.com/blog/private-network-access-preflight/)
4. [Chrome Local Network Access prompts with Jamf Trust ZTNA — Jamf Support](https://support.jamf.com/en/articles/12894739-chrome-local-network-access-prompts-with-jamf-trust-ztna)
5. [Chromium 142 Local Network Access issue and "unknown address space" error — Dynamsoft](https://www.dynamsoft.com/web-twain/docs/faq/chromium-142-local-network-access-issue.html)
6. [ssoSilent fails in Chrome 142 (LocalNetworkAccessPermissionDenied) — AzureAD / MSAL JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/8100)
7. [Blazor WASM silent logins blocked by Chrome 142 LocalNetworkAccessPermissionDenied — dotnet/aspnetcore](https://github.com/dotnet/aspnetcore/issues/64699)
