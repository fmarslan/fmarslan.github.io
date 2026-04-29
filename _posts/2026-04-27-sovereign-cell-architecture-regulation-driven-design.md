---
layout: post
title: "Sovereign Cell Architecture: Regülasyon Odaklı Sistem Tasarımı"
date: 2026-04-27
image: /assets/images/sovereign-cell-architecture-cover.jpg
tags: [architecture, distributed-systems, compliance, saas, cloud]
---

# Sovereign Cell Architecture: Regülasyon Odaklı Sistem Tasarımı

## Bu konuya teknik bir problem gibi bakmak en baştan yanlış bir çerçeve çizmek olur

Kısa bir hikâye ile başlayayım.

Avrupa’da faaliyet gösteren bir SaaS şirketi, yıllarca “multi-region” olduğunu söyleyerek büyüyor. Her şey yolunda gibi: sistem çalışıyor, müşteri geliyor, ürün büyüyor.

Ta ki bir gün audit gelene kadar.

![Sovereign Cell Architecture: Regülasyon Odaklı Sistem Tasarımı.](/assets/img/b792ab8e-af1d-4c65-a787-c4d73c41d6d3.png)

> Almanya’daki müşterinin verisi gerçekten Almanya’da mı?

Ekip “evet” diyor; çünkü Almanya’da gerçekten bir deployment var.

Ama biraz daha derine inildiğinde tablo değişiyor. Backup’lar ABD’de, loglar merkezi bir sistemde, support ekipleri farklı ülkelerden verilere erişebiliyor.

Teknik olarak sistem hâlâ çalışıyor. Ama regülasyon açısından cevap net: **uyumlu değil**.

Ve bu noktadan sonra her şey değişiyor.

Çoğu şirket sistemi scale etmek için değil, **regülasyona takıldığı için** yeniden tasarlıyor.

Yani mesele performans değil; verinin nerede durduğu, kimin erişebildiği ve bu yapının denetime girdiğinde ayakta kalıp kalamayacağı.

Bu soruların cevabı doğrudan mimarinin içinde saklı. Ve bu yüzden bu konu çok fazla açık konuşulmaz. Çünkü doğru kurarsan avantaj sağlarsın, yanlış kurarsan fark edilmesi zor ama çok pahalı hatalar üretirsin.

## Aslında burada yaptığımız şey sistemi değil, veriyi bölmek

Bu noktada çoğu kişinin yaptığı ilk hata, sistemi bölmeye çalışmak.

Oysa gerçek problem sistem değil, veri.

Aynı ürünü kullanan iki müşteri düşün. Biri Almanya’da, diğeri Türkiye’de. İkisi de aynı ürünü kullanıyor gibi hisseder; aynı login, aynı arayüz, aynı deneyim.

Ama arka planda aslında iki farklı dünyadadırlar: biri Almanya’daki sistemde, diğeri Türkiye’deki sistemde.

Sovereign cell yaklaşımı tam olarak bu ayrımı bilinçli şekilde kurmak demek.

Her cell kendi başına çalışan bir sistemdir: kendi veritabanı, kendi servisleri, kendi log ve backup yapısı, kendi key yönetimi vardır.

Global katman ise sadece yönlendirir. Kullanıcının nereye ait olduğunu bilir ve isteği doğru yere gönderir; veriye dokunmaz.

“Multi-region” ile “sovereign” en çok karıştırılan iki kavramdır. Multi-region genelde performans ve erişilebilirlik için yapılır. Sovereign yapı ise kontrol içindir.

## Asıl zor soru şu: veri gerçekten nerede duruyor?

Bu noktada konu netleşir.

Sistemin kaç region’da çalıştığı ikincildir; asıl önemli olan verinin nerede yaşadığıdır.

Çoğu sistemde gerçek tablo şudur: veri bir yerde başlar ama başka yerlere yayılır. Veritabanı bir ülkede olabilir; backup başka bir ülkede, loglar merkezi bir sistemde, cache farklı bir yerde olabilir. Üstelik support, admin ve operasyon ekipleri gibi insan erişimi de bu tabloya eklenir.

Yani veri yalnızca teknik olarak değil, organizasyonel olarak da dağılmıştır.

Regülasyonun sorduğu soru basittir:

> Veri gerçekten bulunduğu sınırların içinde kalıyor mu?

Ve çoğu sistem bu soruya net cevap veremez.

Burada kritik gerçek şu: izolasyon tek bir seviye değildir, bir spektrumdur. Paylaşımlı yapılar ucuzdur ama risklidir. Bölgesel ayrımlar daha güvenlidir. Cell bazlı izolasyon en güçlü modeldir ama maliyeti yüksektir.

En büyük hata, “en izole yapı en doğrudur” diye düşünmektir. Doğru yaklaşım, **ihtiyacın kadar izolasyon kurmaktır**.

## Bugüne kadar kullandığımız yaklaşımlar neden bu problemi çözmeye yetmiyor?

Klasik yaklaşımlar bu problemi tam çözmez.

Monolith ile başlamak kolaydır. Ancak global ölçekte monolith, her ülkeye tüm sistemi taşımak anlamına gelir: aynı kod, aynı bağımlılıklar, aynı operasyon. Sonuç: maliyet katlanır.

Microservice mimarisi esneklik getirir. Ancak servisler arası sınırlar doğru çizilmezse veri bu servisler arasında dolaşır. Dışarıdan bakınca her şey düzgün görünür, fakat veri kontrol altında değildir.

Multi-region yaklaşımı çoğu zaman yarım çözümdür. Sistemi farklı bölgelere deploy edersin ama veri dolaşmaya devam eder, erişim global kalır. Problem çözülmez, sadece ertelenir.

Birçok ekip burada durur; çünkü sistem “çalışıyor” gibi görünür. Oysa gerçek test her zaman audit anında yapılır.

## Tüm bu konunun özünde aslında tek bir şey var: boundary design

Konu sonunda tek bir noktaya gelir:

> Sınırları nasıl çiziyorsun?

Sovereign cell yaklaşımı, sistemi değil veriyi sınırlandırmaktır.

Bu yalnızca compliance için değil, aynı zamanda risk yönetimi için kritiktir. Bir şey yanlış gittiğinde tüm sistemi etkilememeli; sadece ilgili parçayı etkilemelidir.

Yani aslında yaptığın şey, **blast radius’u küçültmektir**.

## Mimariyi kurarken en zorlandığımız yer genelde burası oluyor

Teoride her şey net; pratikte zorlaşır.

İki katman vardır.

Global katman yönlendirir ve karar verir; kullanıcıyı doğru cell’e yollar ama veri tutmaz. Kullanıcı açısından tek login ve tek platform deneyimi vardır.

Cell katmanında ise gerçek sistem çalışır: API’ler, servisler, veritabanı, cache, storage, KMS, log ve backup burada ve lokaldir.

Asıl zorluk teknikten çok maliyettir.

En pahalı parçalar genelde logging, monitoring, tracing ve backup’tır. Bunları her ülkeye ayrı kurarsan maliyet katlanır; merkezde toplarsan regülasyonu ihlal edersin.

Bu mimarinin en zor kısmı teknik değil; **finansal dengeyi kurmaktır**.

Bir diğer yanılgı da “her şey lokal olmalı” yaklaşımıdır. Her şeyi lokal yapmak maliyeti artırır ve operasyonu zorlaştırır; her şeyi merkezi yapmak ise regülasyonu bozar.

Doğru yaklaşım şudur:

> Neyin lokal kalacağına bilinçli karar vermek

## Bir request sistemin içinde gerçekte nasıl hareket eder?

Bir istek sisteme geldiğinde önce global katman tarafından karşılanır. Kullanıcı çözülür, hangi ülkeye ait olduğu belirlenir ve istek ilgili cell’e yönlendirilir.

Bu noktadan sonra tüm işlem lokal olarak gerçekleşir. Veri başka bir ülkeye taşınmaz, key başka yerde kullanılmaz, log başka sisteme akmaz.

Dışarı veri çıkıyorsa bu genelde anonim veya agregasyon seviyesindedir.

Kural basittir:

> Raw veri sınır geçmez

## Peki ne zaman bu mimariye hiç girmemek daha doğru bir karar olur?

Her problem bu çözümü gerektirmez.

Küçük ölçekli, tek ülkede çalışan veya basit ürünlerde bu yaklaşım gereksiz bir komplekslik yaratır. Operasyon, maliyet ve karmaşıklık artar; karşılığında anlamlı bir kazanım elde edilmez.

## Gerçek hayatta ekiplerin en çok düştüğü hatalar genelde şunlar oluyor

Bu noktaya gelen ekipler benzer hatalar yapar: global katmanda veri tutmak, support erişimini sınırlamamak, backup’ı farklı ülkelere göndermek veya key yönetimini merkezileştirmek.

Ve çoğu ekip buna rağmen kendini compliant sanır.

Ama audit geldiğinde gerçek ortaya çıkar.

## Bu mimarinin doğru kurulup kurulmadığını anlamanın basit bir yolu var

Basit bir test yap.

Bir ülkenin sistemini tamamen kapattığını düşün.

Kendine şu soruyu sor:

> Diğer ülkeler çalışmaya devam ediyor mu?

Cevap evetse doğru yoldasın.

## Son olarak bu konudan çıkan en net sonuç

Servisleri bölmek zor değil.

Gerçek mimari, verinin sınırlarını doğru çizebilmek.

Asıl farkı yaratan da bu.

## Referanslar

* [https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data)
* [https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html)
* [https://architectelevator.com/cloud/hybrid-cloud](https://architectelevator.com/cloud/hybrid-cloud)
