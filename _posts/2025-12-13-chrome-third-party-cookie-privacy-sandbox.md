---
layout: post
title: "Chrome, Third-Party Cookie'ler ve Privacy Sandbox: Takip Nasıl Değişiyor?"
date: 2025-12-13 09:00:00 +0300
description: Chrome'un third-party cookie'leri kademeli olarak devre dışı bırakırken Privacy Sandbox ile reklam ve ölçümü gizlilik odaklı hale getirme planı; Topics, Protected Audience ve Attribution Reporting API'lerinin yüksek seviye özeti.
image: /assets/img/9ee28aab-30b5-47d1-aca5-460f78acef4b.png
tags:
  - chrome
  - privacy
  - third-party-cookies
  - privacy-sandbox
  - web
---

Web uzun yıllar boyunca basit bir varsayımla yürüdü: Bir siteye girdiğinizde, sizi başka sitelerde tanıyabilen **third-party cookie**'ler sessizce devreye girerdi. Reklam, analitik ve ölçüm dünyasının büyük kısmı bu yapı üzerine kuruluydu.

Artık bu model sürdürülebilir değil. Kullanıcı mahremiyeti, regülasyonlar (GDPR, ePrivacy) ve tarayıcıların yön değiştirmesiyle birlikte **takip mekanizması kökten değişiyor**. Google Chrome'un bu dönüşüme verdiği cevap ise **Privacy Sandbox**.

![Privacy Sandbox görseli](/assets/img/9ee28aab-30b5-47d1-aca5-460f78acef4b.png)

---

## Third-Party Cookie Nedir, Neden Sorun Oldu?

Third-party cookie, ziyaret ettiğiniz siteye değil, sayfaya gömülü başka bir domain'e ait çerezdir. Örneğin:

* Reklam ağları
* Analitik servisler
* Sosyal medya embed'leri

Bu çerezler sayesinde:

* Aynı kullanıcı farklı sitelerde tanınır,
* Davranış profili oluşturulur,
* Reklam hedefleme yapılır.

Sorun burada başlıyor:

* Kullanıcı çoğu zaman habersiz,
* Kontrol tamamen üçüncü taraflarda,
* Veriler siteler arasında serbestçe dolaşıyor.

Regülasyonlar ve kullanıcı beklentileri bu durumu **gizlilik ihlali** olarak konumlandırdı.

---

## Tarayıcılar Ne Yaptı?

İlk radikal hamle **Safari** ve **Firefox**'tan geldi:

* Third-party cookie'ler varsayılan olarak engellendi,
* Tracking prevention mekanizmaları devreye alındı.

Chrome ise farklı bir yol seçti. Tamamen kapatmak yerine **kontrollü ve tarayıcı merkezli** bir model önerdi. Bu noktada devreye **Privacy Sandbox** girdi.

---

## Privacy Sandbox Nedir?

Privacy Sandbox, Chrome'un şu iddiası üzerine kurulu:

> "Reklam ve ölçüm yapılabilsin, ama kullanıcı bazlı takip yapılmasın."

Bu yaklaşımın temel aksları:

* Kullanıcı tekil olarak izlenmez,
* Tarayıcı veriyi kendi içinde işler,
* Siteler arası kişisel veri paylaşımı olmaz.

Kısacası takip mantığı **sunucudan tarayıcıya** taşınıyor.

---

## Nasıl Çalışıyor? (Yüksek Seviyede)

Privacy Sandbox birkaç ana API'ye dayanıyor.

### 1. İlgi Alanı Bazlı Reklam (Topics API)

* Tarayıcı, kullanıcının ziyaret ettiği sitelere bakarak genel ilgi alanlarını çıkarır (örn. "Seyahat", "Teknoloji").
* Reklam verenler kullanıcıyı değil bu başlıkları görür.
* Kişisel profil yerine anonim segmentler oluşur.

### 2. Remarketing (Protected Audience API)

* Kullanıcı bazlı yeniden hedefleme yapmaz.
* Tarayıcı içinde tutulan gruplar üzerinden çalışır.
* Reklam açık artırmaları client-side gerçekleşir; veri tarayıcıdan çıkmaz.

### 3. Ölçüm ve Dönüşüm (Attribution Reporting)

* "Hangi reklam dönüşüm getirdi?" sorusuna cevap verir.
* Detaylı kullanıcı yolculuğu paylaşılmaz.
* Gecikmeli ve agregasyonlu raporlar üretir.

---

## Tracking Prevention ile Farkı Ne?

Tracking prevention (Safari / Firefox):

* "Bu iş tehlikeli, kapatıyorum."

Privacy Sandbox (Chrome):

* "Bu ihtiyacı kontrollü hale getiriyorum."

Chrome, ekosistemi tamamen kırmak yerine **yeni bir standart** oluşturmayı hedefliyor.

---

## Geliştiriciler ve Ürünler İçin Ne Anlama Geliyor?

Bu dönüşüm özellikle şu alanları etkiliyor:

* Analytics altyapıları,
* Reklam ölçüm sistemleri,
* Consent ve cookie yönetimi,
* Cross-site kullanıcı takibi.

Yeni gerçeklik:

* First-party data çok daha değerli,
* Server-side tracking öne çıkıyor,
* Event bazlı ve aggregate ölçüm önem kazanıyor.

**"Her kullanıcıyı her yerde tanıyayım" dönemi kapanıyor.**

---

## Bugün Ne Durumdayız?

* Chrome, third-party cookie'leri **kademeli olarak devre dışı** bırakıyor.
* Privacy Sandbox API'leri test ve rollout aşamasında.
* Regülasyonlar bu yönü destekliyor.

Geri dönüşü olan bir yol değil.

---

## Sonuç

Web daha kapalı değil; **daha kontrollü** hale geliyor. Takip tamamen bitmiyor, fakat **kullanıcı merkezli ve tarayıcı kontrollü** bir yapıya evriliyor.

Geliştiriciler için bu, sadece teknik bir değişim değil; aynı zamanda **zihniyet değişimi**. Privacy Sandbox, reklam ve ölçüm ihtiyaçlarını gizlilikle dengeleyen yeni varsayılan olarak kabul edilmek üzere kapıda.
