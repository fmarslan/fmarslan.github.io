---
layout: post
title: "Dokümantasyon Nerede Biter, Mühendislik Nerede Başlar?"
date: 2026-01-08 09:00:00 +0300
description: Bir ürünü sadece kullanım kılavuzuyla mı ele almalıyız, yoksa yeteneklerini zorlayarak yeni değer alanları mı açmalıyız? Araç seçimi, hayal gücü ve sorumluluk arasındaki denge üzerine sahadan bir anlatı.
image: /assets/img/dokumantasyon-muhendislik.png
tags:
  - engineering-culture
  - system-design
  - architecture
  - tooling
  - mindset
---

Bir kütüphane, yazılım ya da ürün kullanırken çoğumuzun ilk refleksi aynı: dokümantasyonu açmak.  
“Ne işe yarıyor, nasıl kullanılmalı, doğru yol ne?”

Bu refleks yanlış değil. Ama çoğu zaman **yetersiz**.

![Dokümantasyon Nerede Biter, Mühendislik Nerede Başlar?](/assets/img/258f48f7-8297-4ca3-b0c7-dda1df84b119.png)

Çünkü dokümantasyon sana genelde şunu anlatır:  
**en yaygın**, **en güvenli**, **en anlatılabilir** senaryo.  
Gerçek hayat ise nadiren böyle çalışır. Sistemler büyür, ekipler genişler, iş gerçek dünyaya çarpar ve sen bir noktada şunu fark edersin: sadece dokümana bakarak ilerlemek, elindeki potansiyelin yarısını görmeden geçmek demektir.

Bu yazı, “dokümantasyonu boşver” diyen bir yazı değil.  
Ama “dokümantasyonu kanun kitabı sanma” diyen bir yazı.



## Doküman Rehberdir, Sınır Çizgisi Değil

Ürünler bir amaçla yapılır. Ama bu amaç, o ürünün **kullanılabileceği tek doğru yol** olmak zorunda mı?

Bence hayır.

Doküman “buradan başla” der.  
“Burada dur” demez.

Mühendislik tam olarak bu noktada başlar:  
Ürünün **ne olduğu**ndan çok, **hangi yeteneklere sahip olduğu**na bakmaya başladığında.



## Kong’u Edge Diye Anlatıyorlardı, Ben İçeride Kullandım

Bunu ilk kez Kong kullanırken net hissettim. O dönem herkes Kong’u “edge”, yani dış dünyaya açılan kapı olarak anlatıyordu. Dışarıdan gelen trafik, auth, rate limit, routing… klasik anlatı.

Ama benim problemim dış dünya değildi.

İçeride bir sürü servis vardı ve hepsi farklı farklı 3. parti servislere bağlanıyordu.  
Her entegrasyon ayrı bir yöntem, ayrı bir header seti, ayrı bir retry mantığı demekti. Bir süre sonra entegrasyonlar “servis” olmaktan çıkıp “alışkanlık” hâline geliyordu. Kim neyi, nasıl çağırıyor takip etmek bile zorlaşıyordu.

O noktada kendime şu soruyu sordum:

Kong zaten proxy değil mi?  
Plugin çalıştırmıyor mu?  
Trafiği gözlemleyebilmiyor muyum?  
Cache koyamıyor muyum?  
Alert kuramıyor muyum?

E o zaman neden sadece dış dünyaya bakan bir kapı olsun?

Kong’u aldım, içeride 3. parti servislere giden trafiğin önüne koydum. İçerideki tüm servisler dışarıyı doğrudan çağırmak yerine **Kong üzerinden** gitmeye başladı.

Sonuç çok netti:

- İçeride herkes **standart bir arayüz** kullandı  
- 3. parti servislere giden trafik **tek yerden** izlenebilir oldu  
- Alert, cache, throttling gibi konular **merkezi** hâle geldi  
- “Kim, ne zaman, neyi çağırdı?” sorusu cevaplanabilir oldu  

Dokümantasyonda “böyle yap” yazmıyordu.  
Ama çalıştı. Hem de sorunsuz.

Bu noktada fark ettiğim şey şuydu:  
Hayal gücü dediğimiz şey rastgelelik değil.  
Doğru soruyu sorma cesareti.



## Hayal Gücü = Rastgelelik Değil, Yeteneği Yeniden Konumlandırmak

“Hayal gücü” deyince bazen yanlış anlaşılıyor.  
Bu, “şunu da deneyelim bakalım” kafası değil.

Daha çok şu soru:

> Bu araç hangi **temel problemleri** çözüyor ve ben bu çözümleri başka **hangi bağlamda** kullanabilirim?

Bu bakış açısına geçtiğinde ürün, “kullanım klavuzu olan bir şey” olmaktan çıkıp **bir yapı taşı** hâline geliyor.

Ama bunun bir bedeli var.



## Doküman Yetmediğinde Kod Okumayı Kabul Etmek

Bu yola girince şunu da kabul ediyorsun:

- Dokümante edilmemiş davranışlara yaslanabilirsin  
- Bazı şeyleri “feature gibi” kullanırsın ama aslında garanti değildir  
- Dokümantasyon yetmez, **kod okursun**  
- Issue’lara bakarsın, source’a girersin  
- Gerekirse katkı verirsin  
- Ve en önemlisi: “burada bozulursa sahiplenirim” dersin  

Riskli mi? Evet.  
Ama ilerleme dediğimiz şey zaten biraz risklidir.



## Her Şeyi Ben Yazayım mı?

Burada ikinci büyük kırılma geliyor.

Bir sistemi geliştirirken en erken fark ettiğim ama en geç kabullendiğim şey şu oldu:  
**Her şeyi kendin yazmaya çalışmak güç değil, yük.**

Başta çok cazip gelir:

- “Bu kütüphane tam istediğim gibi değil”  
- “Bunu ben daha temiz yazarım”  
- “Bağımlılık az olsun”  
- “Kontrol bende olsun”  

Ama sistem büyüdükçe ve ekip genişledikçe şu gerçekle yüzleşirsin:

**Her şeyi sen yazarsan, her şeyin bakımını da sen yaparsın.**

Bu da genelde şuna dönüşür:

- Kimsenin dokunamadığı özel çözümler  
- Güncellenmeyen internal tool’lar  
- Dokümansız “bizim framework”ler  
- Sadece bir kişinin bildiği kritik parçalar  

Ve en kötüsü:  
**Sistem büyüdükçe yavaşlayan ekip.**



## Asıl Soru: “Bu Problem Gerçekten Bana mı Ait?”

Bir noktadan sonra kendime şu soruyu sormaya başladım:

> “Bu problemi gerçekten ben mi çözmeliyim,  
> yoksa bu zaten başkalarının yıllardır çözdüğü bir konu mu?”

Loglama, queue yönetimi, retry & backoff, authentication, configuration management, observability, deployment orchestration…

Bu alanlarda “kendim yazarım” demek, çoğu zaman **ürünün ana problemini ertelemek** demek.

Kullanıcı senin logging altyapını değil,  
**işinin çalışmasını** önemsiyor.



## Araç Seçimi = Mimari Karar

Bir harici aracı projeye almak sadece teknik bir karar değildir.  
Bu doğrudan **mimari bir karardır**.

Yanlış araç:

- Sistemi karmaşıklaştırır  
- Öğrenme eğrisini yükseltir  
- Ekip içinde direnç oluşturur  

Doğru araç ise:

- Koddan yük alır  
- Ekibin hızını artırır  
- Standartlaştırır  
- Bakımı paylaşır  

Kritik çizgi şurası:  
**Araç, problemi çözmeli; yeni problem üretmemeli.**



## “En İyi Araç” Yok, “Bu Problem İçin Uygun Araç” Var

Kafka mı RabbitMQ mu?  
Redis mi PostgreSQL mi?  
Kubernetes mi Nomad mı?

Bu soruların tek doğru cevabı yok.  
Ama yanlış sorusu çok:

> “Herkes bunu kullanıyor, biz de kullanalım.”

Benim yaklaşımım zamanla şuna evrildi:

- Problem ne?  
- Yük profili ne?  
- Operasyonel karmaşıklık ne?  
- Ekip bu aracı tanıyor mu?  
- Yarın bu sistemi kim devralacak?  

Bazen en “havalı” çözüm değil,  
**en sıkıcı çözüm** en doğru olan oluyor.



## Araç Kültürünü Tanımadan Araç Eleştirilmez

Birçok araç kötü ününü yanlış kullanımdan alıyor.

- Kafka “karmaşık” deniyor ama yanlış yerde kullanılmış  
- Kubernetes “overkill” deniyor ama ekip hazır değil  
- Bazı framework’ler “yavaş” deniyor ama problem yanlış modellenmiş  

Gerçek şu:

> **Araç tek başına iyi ya da kötü değildir.  
> Onu kullanan ekibin alışkanlıkları belirleyicidir.**

Bu yüzden dokümantasyon kadar, **ekip gerçeği** de önemlidir.



## Ampul Sadece Ampul Olsaydı…

Eğer ampul sadece “ışık veren bir şey” olarak kalsaydı ve kimse çıkıp “bu aynı zamanda kontrollü bir direnç” demeseydi, bugün bildiğimiz elektronik olmazdı.

Teknoloji, çoğu zaman kullanım kılavuzunun biraz dışına taşan insanların eseridir.



## Sonuç: Mühendislik Ego Değil, Sorumluluk İşidir

Geriye dönüp baktığımda şunu net görüyorum:

- Dokümantasyon sağlam bir başlangıçtır ama son durak değildir  
- Her şeyi kendin yazmak sürdürülebilir değildir  
- Doğru araçlar seni yavaşlatmaz, hızlandırır  
- Yanlış araç yoktur, yanlış yerde kullanılan araç vardır  
- İyi mimari, kontrolü tamamen elde tutmak değil; doğru yerde paylaşabilmektir  

Belki de asıl soru şu:

**Biz araçları mı kullanıyoruz,  
yoksa araçların bize çizdiği sınırların içinde mi yaşıyoruz?**
