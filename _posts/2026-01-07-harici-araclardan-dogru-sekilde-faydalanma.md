---
layout: post
title: "Her Şeyi Ben Yazayım mı? Harici Araçlardan Doğru Şekilde Faydalanma Üzerine"
date: 2026-01-07 10:30:00 +0300
description: Bir sistemi geliştirirken her problemi kendimiz çözmeye çalışmanın neden sürdürülemez olduğunu ve doğru araçları doğru yerde kullanmanın mimariye nasıl güç kattığını anlatıyorum.
image: /assets/img/tooling-ecosystem.png
tags:
  - engineering-culture
  - system-design
  - architecture
  - tooling
---

Bir sistemi geliştirirken en erken fark ettiğim ama en geç kabullendiğim şey şu oldu:  
**Her şeyi kendin yazmaya çalışmak güç değil, yük.**

![Her Şeyi Ben Yazayım mı? Harici Araçlardan Doğru Şekilde Faydalanma Üzerine](/assets/img/harici-araclardan-dogru-sekilde-faydalanma.png)


Başta çok cazip geliyor.  
“Bu kütüphane tam istediğim gibi değil.”  
“Bunu ben daha temiz yazarım.”  
“Bağımlılık az olsun.”  
“Kontrol bende olsun.”

Ama sistem büyüdükçe, ekip genişledikçe ve iş gerçek dünyaya çarptıkça şu gerçekle yüzleşiyorsun:  
**Her şeyi sen yazarsan, her şeyin bakımını da sen yaparsın.**

Bu yazı, harici araçlardan neden kaçmamak gerektiğini değil;  
**nasıl ve ne zaman faydalanmak gerektiğini** anlatıyor.



## Her Şeyi Kendin Yazma Refleksi Nereden Geliyor?

Çoğu mühendislik ekibinde bu refleks doğal.  
Özellikle genç ekiplerde veya erken aşama projelerde sık görülüyor.

Sebebi basit:

- Kontrol hissi  
- Hızlı ilerleme algısı  
- “Bağımlılık risklidir” düşüncesi  
- Dış araca güvenmeme  

Ama bu refleks uzun vadede şuna dönüşüyor:

- Kimsenin dokunamadığı özel çözümler  
- Güncellenmeyen internal tool’lar  
- Dokümansız “bizim framework”ler  
- Sadece bir kişinin bildiği kritik parçalar  

Ve en kötüsü:  
**Sistem geliştikçe yavaşlayan ekip.**



## Asıl Soru Şu: “Bu Problem Gerçekten Bana mı Ait?”

Bir noktadan sonra kendime şu soruyu sormaya başladım:

> “Bu problemi gerçekten ben mi çözmeliyim,  
> yoksa bu zaten başkalarının yıllardır çözdüğü bir konu mu?”

Örnekler çok tanıdık:

- Loglama  
- Queue yönetimi  
- Retry & backoff  
- Authentication  
- Configuration management  
- Observability  
- Deployment orchestration  

Bu alanlarda “kendim yazarım” demek,  
**ürünün ana problemini ertelemek** demek.

Çünkü kullanıcı senin logging altyapını değil,  
**işinin çalışmasını** önemsiyor.



## Araç Seçimi = Mimari Karar

Bir harici aracı projeye almak, sadece teknik değil **mimari bir karardır**.

Yanlış araç:

- Sistemi karmaşıklaştırır  
- Öğrenme eğrisini yükseltir  
- Ekip içinde direnç oluşturur  

Doğru araç ise:

- Koddan yük alır  
- Ekibin hızını artırır  
- Standartlaştırır  
- Bakımı paylaşır  

Buradaki kritik nokta şu:  
**Araç, problemi çözmeli; yeni problem üretmemeli.**



## “En İyi Araç” Yok, “Bu Problem İçin Uygun Araç” Var

Kafka mı RabbitMQ mu?  
Redis mi PostgreSQL mi?  
Kubernetes mi Nomad mı?  
C# mı Python mı Java mı?

Bu soruların tek doğru cevabı yok.  
Ama yanlış sorusu çok:

> “Herkes bunu kullanıyor, biz de kullanalım.”

Benim yaklaşımım zamanla şuna evrildi:

- **Problem ne?**
- **Yük profili ne?**
- **Operasyonel karmaşıklık ne?**
- **Ekip bu aracı tanıyor mu?**
- **Yarın bu sistemi kim devralacak?**

Bazen en “havalı” çözüm değil,  
**en sıkıcı çözüm** en doğru olan oluyor.



## Araçtan Korkmamak, Ekosistemi Renklendirmek

Bir dönem şunu fark ettim:  
Aynı problemleri çözmek için sürekli aynı araçlara abanıyoruz.

Oysa ekosistem geniş.  
Ve bu bir tehdit değil, avantaj.

- Bazı işler için managed servis kullanmak  
- Bazı işleri açık kaynak projelere bırakmak  
- Bazı yerlerde “as a service” yaklaşımını benimsemek  

Bunlar mimariyi zayıflatmaz.  
Aksine, **odaklanmanı sağlar.**

Odak şu olmalı:

> “Benim gerçekten katma değer ürettiğim yer neresi?”



## Ekip Gerçeği: Araç Kültürünü Tanımadan Karar Vermek Hata

Bir diğer büyük yanılgı:  
**Aracı eleştirmek ama kültürünü tanımamak.**

Birçok araç, yanlış kullanıldığı için kötü ün yapıyor.

- Kafka “karmaşık” deniyor ama aslında yanlış yerde kullanılmış  
- Kubernetes “overkill” deniyor ama ekip hazır değil  
- Bazı framework’ler “yavaş” deniyor ama problem yanlış modelleme  

Burada önemli olan şu:

> **Araç tek başına iyi ya da kötü değildir.  
> Onu kullanan ekibin alışkanlıkları belirleyicidir.**

Bu yüzden bir aracı seçerken sadece teknik dokümana değil,  
**ekibin gerçek yetkinliğine** bakmak gerekiyor.



## Maksimum Fayda = Mevcut Yapıyla Barışmak

Bir sistemi geliştirirken her şeyi baştan yıkıp yeniden yapmak cazip gelebilir.  
Ama çoğu zaman bu gerçekçi değildir.

Benim öğrendiğim en değerli derslerden biri şuydu:

> **Elindeki yapı neyse, onunla maksimum faydayı üretmeye çalış.**

Bu şu anlama geliyor:

- Kullanılan dili küçümseme  
- Mevcut tool’ları karalama  
- “Biz olsak baştan böyle yapmazdık” demek yerine  
- “Bu yapıdan nasıl daha iyi sonuç çıkarırım?” diye düşün  

Bu yaklaşım hem sistemi hem ekibi büyütüyor.



## Sonuç: Mühendislik Ego Değil, Seçim İşidir

Bugün geriye dönüp baktığımda şunu net görüyorum:

- Her şeyi kendin yazmak sürdürülebilir değil  
- Doğru araçlar seni yavaşlatmaz, hızlandırır  
- Yanlış araç değil, yanlış yerde kullanılan araç vardır  
- Ekip gerçeğini yok sayan mimari kağıt üzerinde kalır  

Ve belki de en önemlisi:

> **İyi mimari, her şeyi kontrol etmek değil;  
> doğru yerlerde kontrolü paylaşabilmektir.**

Bu denge kurulduğunda, sistem sadece çalışmaz;  
**yaşar, büyür ve devredilebilir hâle gelir.**
