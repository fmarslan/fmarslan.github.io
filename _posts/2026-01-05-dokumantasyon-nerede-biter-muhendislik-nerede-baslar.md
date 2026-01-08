---
layout: post
title: "Dokümantasyon Nerede Biter, Mühendislik Nerede Başlar?"
date: 2026-01-05 09:00:00 +0300
description: Dokümana bakıp “doğru kullanım”la mı ilerliyoruz, yoksa aracın yeteneklerini zorlayıp yeni kullanım alanları mı açıyoruz? Kong örneği üzerinden sahadan bir anlatı.
tags: [engineering, documentation, kong, architecture, devops, mindset]
image: /assets/img/dokumantasyon-muhendislik.png
---

Bazen bir kütüphane / ürün / servis kullanırken ilk refleks şu oluyor: dokümanı aç, örneği kopyala, “best practice” neyse onu uygula.

Bu yanlış değil. Ama bir yerden sonra şunu fark ediyorsun: sadece dokümana bakarak ilerlersen, aslında sana sunulan potansiyelin yarısını hiç görmeden geçiyorsun.

![Dokümantasyon Nerede Biter, Mühendislik Nerede Başlar?](/assets/img/258f48f7-8297-4ca3-b0c7-dda1df84b119.png)

Çünkü dokümantasyon çoğu zaman şunu anlatır: **en yaygın senaryo**.  
Gerçek hayat ise çoğu zaman “yaygın” değil. Dağınık. Kirli. Garip. Ve acil.

## Doküman rehberdir, kanun kitabı değil

Ürünler bir amaçla yapılır. Ama o amaç, ürünün kullanılabileceği tek doğru yol olmak zorunda mı?

Bence değil.

Doküman “buradan başla” der.  
“Burada dur” demez.

Asıl mesele şu: ürüne **ne olduğu** üzerinden değil, **hangi yeteneklere sahip olduğu** üzerinden bakmaya başladığında, yeni kapılar açılıyor.

## Kong’u edge diye anlatıyorlardı, ben içeride kullandım

Kong’u ilk kullandığım zamanlardı. Herkes Kong için “edge, dış dünyaya açılan kapı” diyordu. Dışarıdan gelen trafik, auth, rate limit falan.

Ama benim derdim dışarıdan gelen trafik değildi.

İçeride bir sürü servis vardı ve hepsi farklı farklı 3. parti servislere bağlanıyordu. Her ekip ayrı yöntem, ayrı header seti, ayrı retry mantığı… Bir noktada entegrasyonlar “servis” değil “alışkanlık” olmaya başlıyor. Kim neyi nasıl çağırıyor takip etmek bile zorlaşıyor.

O sırada şunu düşündüm:

Kong zaten proxy.  
Plugin var.  
Trafiği gözlemleyebiliyorum.  
Cache koyabiliyorum.  
Alert kurabiliyorum.  
Hatta gerektiğinde küçük davranışları orada standartlayabiliyorum.

E o zaman neden sadece dış dünyaya bakan bir kapı olsun?

Kong’u aldım, içeride 3. parti servislere giden trafiğin önüne koydum. İçerideki tüm servisler, dışarıdaki servisleri doğrudan çağırmak yerine **Kong üzerinden** gitmeye başladı.

Sonuç?

- İçeride herkes **standart bir arayüz** kullandı.
- 3\. parti servislere giden trafiği **tek yerden** izledim.
- Alert, cache, throttling gibi şeyleri **merkezi** kurdum.
- “Kim, ne zaman, neyi çağırdı?” sorusu bir anda cevaplanabilir hale geldi.

Dokümanda “böyle yap” diye yazmıyordu. Ama çalıştı. Hem de sorunsuz.

## “Hayal gücü” rastgelelik değil

Buradaki hayal gücü, “şunu da deneriz belki” gibi bir şey değil.

Daha çok şu soru:

> Bu araç hangi temel problemleri çözebiliyor ve ben bunu başka hangi probleme uygularım?

Bu bakış, seni “ürün nasıl kullanılır”dan çıkarıp “ürünle neler yapılabilir”e sokuyor.

## Bedeli var: artık sadece doküman yetmez

Bu yola girince şunu da kabul ediyorsun:

- Dokümante edilmemiş davranışlara yaslanabilirsin.
- Bazı noktalarda “feature gibi” kullanmaya başlarsın ama aslında o şey bir **garanti** değildir.
- Doküman yetmez, **kod okursun**.
- Issue’ları takip edersin.
- Gerekirse katkı verirsin.
- Ve en önemlisi: “bozulursa sahiplenirim” dersin.

Riskli mi? Evet.  
Ama ilerleme dediğimiz şey zaten biraz riskli.

## Ampul ampul olarak kalsaydı…

Eğer ilk ampul sadece “ışık veren şey” olarak kalsaydı ve kimse çıkıp “bu aynı zamanda kontrollü bir direnç” diye düşünmeseydi, teknoloji muhtemelen bugün olduğu yere gelemezdi.

Bazen bir şeyin değerini artıran şey, onu “tasarlandığı amaç” içinde daha iyi kullanmak değil; **o amacın dışına taşıyabilmek**.

## Kapanış: biz mi aracı kullanıyoruz, araç mı bizi?

Benim kafamdaki çizgi şu:

- Dokümantasyon: güvenli başlangıç
- Mühendislik: sınırları anlayıp, gerektiğinde genişletmek

Asıl soru belki de şu:

Biz araçları mı kullanıyoruz, yoksa araçların bize çizdiği sınırların içinde mi yaşıyoruz?

