---
layout: post
title: "Projelerde Bağımlılık: Mikroservislerde Sınır Nerede Başlar?"
date: 2026-08-04
description: "Mikroservislerde bağımlılığı yok etmek değil, değişiklik ve hata etkisini sınırlamak gerekir. Peki sağlıklı ilişkinin sınırı nerede çizilir?"
image: /assets/img/microservice-dependency-boundaries.png
image_alt: "Sınırlandırılmış ve zincirleme servis bağımlılıklarını gösteren soyut geometrik çizim"
tags: [mikroservis, bağımlılık, yazılım-mimarisi, dağıtık-sistemler, entegrasyon]
lang: tr-TR
translation_key: "microservice-dependency-boundaries-2026"
permalink: /tr/2026/08/04/projelerde-bagimlilik-ve-mikroservislerde-sinirlari.html
published: true
mermaid: true
---

Yazılım projelerinde hiçbir bileşen bütünüyle yalnız değildir. Asıl mesele bağımlılığın varlığı değil; bu ilişkinin bir bileşendeki değişikliği, gecikmeyi veya hatayı sistemin geri kalanına ne ölçüde taşıdığıdır.

Mikroservis mimarisinde “servisler birbirinden bağımsız olmalıdır” cümlesini sıkça kullanıyoruz. Fakat siparişin ödemeye, ödemenin müşteriye, sevkiyatın stoğa ihtiyaç duyduğu bir sistemde mutlak bağımsızlık mümkün değildir. Bu nedenle hedef sıfır bağımlılık değil, **bağımlılığın sınırlarını bilmek ve etkisini yönetmektir**.

## Bağımlılık nedir?

Bir bileşen görevini yerine getirebilmek için başka bir bileşenin varlığına, davranışına veya ürettiği veriye ihtiyaç duyuyorsa aralarında bağımlılık vardır.

Örneğin bir sipariş servisi:

- ödeme servisinden tahsilat yapıyorsa,
- stok servisinden ürün miktarını sorguluyorsa,
- kullanıcı servisinden teslimat adresini alıyorsa,
- bir mesaj kuyruğuna veri gönderiyorsa,
- belirli bir veritabanı şemasına göre işlem yapıyorsa

bu bileşenlere farklı biçimlerde bağımlıdır.

Bağımlılık yalnızca bir servisin diğerine HTTP isteği göndermesi değildir. Paylaşılan veritabanları, ortak kütüphaneler, API ve olay sözleşmeleri, dağıtım süreçleri ve ekipler arasındaki sürekli koordinasyon ihtiyacı da bağımlılık oluşturabilir.

## Bağımlılık ile zorunluluk aynı şey değildir

İş ihtiyacı ile teknik tasarımı birbirinden ayırmak gerekir. Bir siparişin tamamlanabilmesi için ödeme alınması bir **iş zorunluluğu** olabilir. Sipariş servisinin ödeme servisine senkron HTTP isteği göndermesi ise bir **teknik tasarım kararıdır**.

Aradaki farkı aynı örnek üzerinden açalım:

| Durum | Türü |
| --- | --- |
| Ödeme alınmadan siparişin onaylanmaması | İş kuralı |
| İşlemin yasal kayıtlarının saklanması | Yasal zorunluluk |
| Ödemenin ayrı bir servis tarafından gerçekleştirilmesi | Servis bağımlılığı |
| Ödeme sonucunun aynı HTTP isteği içinde beklenmesi | Çalışma zamanı bağımlılığı |
| Sipariş ve ödeme servislerinin birlikte yayımlanması | Dağıtım bağımlılığı |

İş veya mevzuat kaynaklı zorunluluğu ortadan kaldıramayabiliriz. Ancak bu zorunluluğun belirli bir protokolle, aynı işlem zincirinde veya ortak bir veritabanıyla uygulanması çoğu zaman mimari tercihtir. Bu tercihin etkisini azaltabilir, yönünü değiştirebilir ve hata durumlarına karşı dayanıklı hâle getirebiliriz.

## Bir ilişki nerede bağımlılığa dönüşür?

Aşağıdaki sorulardan birine “evet” cevabı veriliyorsa dikkate alınması gereken bir bağımlılık vardır:

- Diğer bileşen çalışmadığında benim bileşenim de çalışamaz mı?
- Diğer bileşendeki değişiklik benim kodumu değiştirmemi gerektiriyor mu?
- İki bileşeni aynı anda yayımlamak zorunda mıyım?
- Diğer servisin iç veri modelini bilmek zorunda mıyım?
- İki servis aynı veritabanı tablolarını kullanıyor mu?
- Bir servisin performans sorunu diğerini doğrudan etkiliyor mu?
- Bir özelliği geliştirmek için sürekli başka bir ekibi bekliyor muyum?

Bu sorular bağımlılığın yalnızca kod düzeyinde olmadığını gösterir. Çalışma zamanı, veri, sözleşme, dağıtım ve organizasyon bağımlılıkları birbirinden farklı sonuçlar üretir.

### Çalışma zamanı bağımlılığı

A servisi bir işlemi tamamlamak için B servisinden anlık cevap bekler. Alternatif bir akış, önbellek veya işlemi erteleme seçeneği tanımlanmamışsa B çalışmadığında A da bu akışı tamamlayamaz. Çağrı zinciri uzadıkça toplam gecikme ve hata olasılığı artar.

### Veri bağımlılığı

Bir servis başka bir servisin yönettiği veriye ihtiyaç duyar. Bu ihtiyaç normaldir; ancak iki servisin aynı tablolara doğrudan erişmesi, veri modelindeki her değişikliği ortak bir dağıtım problemine dönüştürür.

### Sözleşme bağımlılığı

Servisler API, olay veya mesaj formatları üzerinden anlaşır. Bu sözleşmenin kontrolsüz değiştirilmesi tüketicileri bozabilir. Asenkron iletişim de bu bağımlılığı ortadan kaldırmaz; yalnızca sözleşmenin biçimini değiştirir.

### Dağıtım bağımlılığı

Bir servisin yeni sürümünü yayımlamak için diğer servislerin de aynı anda güncellenmesi gerekiyorsa servisler fiziksel olarak ayrılmış olsa bile bağımsız değildir.

### Organizasyonel bağımlılık

Bir ekip işini tamamlamak için sürekli başka bir ekibin geliştirme yapmasını veya onay vermesini bekliyorsa teknik ilişki organizasyonel darboğaza dönüşmüştür.

Ortak kütüphaneler ve altyapı bileşenleri tek başına zararlı değildir. Ancak ortak bileşendeki değişiklik birçok servisi aynı anda güncellemeye zorluyor veya ekiplerin bağımsız hareket etmesini engelliyorsa artık ayrıca yönetilmesi gereken bir bağımlılıktır.

## Mikroservislerde sınır nerede çizilir?

Mikroservis mimarisinin amacı servisler arasındaki bütün ilişkileri yok etmek değildir. Amaç, her servisin kendi iş alanında karar verebilmesi; başka servislerin iç yapısını bilmemesi ve onların geçici sorunlarından mümkün olduğunca az etkilenmesidir.

Sağlıklı bir mikroservis:

- belirli bir iş yeteneğinin sahibi olmalı,
- kendi verisini yönetmeli,
- başka bir servisin veritabanına doğrudan erişmemeli,
- açık ve geriye uyumlu sözleşmeler sunmalı,
- mümkün olduğunda bağımsız yayımlanabilmeli,
- geçici hataları belirli ölçüde tolere edebilmeli,
- diğer servislerin uygulama ayrıntılarını bilmemelidir.

Bağımlılığın kabul edilebilir sınırını, servisin **bağımsız değişebilme, yayımlanabilme ve hata verebilme kabiliyeti** üzerinden değerlendirebiliriz. Küçük bir değişiklik birçok servisin aynı anda güncellenmesini gerektiriyorsa sistem dağıtık olmasına rağmen sıkı bağlıdır.

## Senkron ve asenkron iletişim bağımlılığı nasıl değiştirir?

Senkron iletişimde çağrıyı yapan servis karşı tarafın cevabını bekler. Yöntem basit ve anlaşılırdır; kullanıcıya anlık cevap verilmesi gereken kısa işlemler için uygun olabilir. Buna karşılık gecikme ve hata doğrudan çağrı zincirine yayılır.

Asenkron iletişimde servis bir olay yayımlar ve diğer servisler bunu daha sonra işler. Böylece servislerin aynı anda çalışması gerekmeyebilir. Bunun karşılığında mesaj sıralaması, tekrar işleme, idempotency, izlenebilirlik ve gecikmeli tutarlılık yönetilmelidir.

<div class="mermaid">
flowchart LR
    subgraph S["Senkron akış"]
      O1["Sipariş"] -->|"bekler"| P1["Ödeme"]
      P1 -->|"bekler"| I1["Stok"]
    end
    subgraph A["Asenkron akış"]
      O2["Sipariş"] --> B(("Olay aracısı"))
      B --> P2["Ödeme"]
      B --> I2["Stok"]
    end
</div>

Asenkron iletişim bağımlılığı yok etmez. Mesajın güvenilir biçimde kabul edilip kalıcılaştırıldığı bir yapıda sipariş servisi, ödeme servisinin o anda erişilebilir olmasına bağımlı değildir; fakat olay sözleşmesine ve mesajlaşma altyapısına bağımlıdır. Yani bağımlılık zaman bakımından gevşer, sorumluluk ortadan kalkmaz.

## Faydalı bağımlılık ile zararlı bağlılık

Sipariş servisinin ödeme işlemini bu alanda uzmanlaşmış bir ödeme servisine bırakması doğal ve faydalı olabilir. Zararlı olan, sipariş servisinin ödeme servisinin iç tablolarını, sınıflarını veya dağıtım takvimini bilmek zorunda kalmasıdır.

| Yönetilebilir bağımlılık | Zararlı bağlılık |
| --- | --- |
| Açık bir iş sorumluluğuna dayanır | Sorumluluk sınırları belirsizdir |
| Kararlı bir sözleşme üzerinden kurulur | Diğer bileşenin iç yapısına dayanır |
| Mümkün olduğunca tek yönlüdür | Çift yönlü veya döngüseldir |
| Hata davranışı tanımlıdır | Hataları zincirleme biçimde yayar |
| Bağımsız dağıtıma izin verir | Servisleri birlikte yayımlamaya zorlar |
| Gözlemlenebilir ve test edilebilirdir | Etkisi ancak üretimde fark edilir |

Doğru kurulan bağımlılıklar sorumlulukların ayrılmasını, ekiplerin iş alanlarında uzmanlaşmasını ve bileşenlerin kendi yüklerine göre ölçeklenmesini sağlar. Kontrolsüz bağımlılıklar ise küçük değişiklikleri büyük koordinasyonlara dönüştürür, test ortamlarını zorlaştırır ve sistem performansını en yavaş bileşene bağlar.

Sonuçta mikroservislerden oluşan fakat birlikte geliştirilip birlikte yayımlanmak zorunda olan bir **dağıtık monolit** ortaya çıkar. Böyle bir sistem, monolitin sıkı bağlılık problemleriyle dağıtık sistemlerin ağ ve operasyon maliyetlerini aynı anda taşır.

## Bağımlılıklar nasıl yönetilebilir?

### Servis sınırlarını iş yeteneklerine göre belirleyin

Servisleri yalnızca teknik katmanlara göre bölmek yerine iş sorumluluklarına göre tasarlayın. Herkesin kullandığı genel amaçlı servisler zamanla merkezi darboğazlara dönüşebilir.

### Her verinin bir sahibi olsun

Bir verinin otoritatif sahibi ve yazma kurallarından sorumlu servis açıkça belirlenmelidir. Diğer servisler bu veriye tanımlı API'ler veya olaylar üzerinden erişebilir, gerektiğinde kontrollü yerel kopyalarını tutabilir; ancak asıl kaynağın yazma kurallarını sahiplenmemelidir.

### Sözleşmeleri geriye uyumlu geliştirin

API ve olay şemaları servisler arasındaki sözleşmelerdir. Sözleşme testleri ve bilinçli sürümleme, bir sağlayıcıdaki değişikliğin tüketicileri beklenmedik biçimde bozmasını engeller.

### Uzun senkron çağrı zincirlerini sorgulayın

Tek bir kullanıcı isteğinin tamamlanması için çok sayıda servisin sırayla çağrılması hem gecikmeyi hem hata olasılığını artırır. Kullanıcının sonucu gerçekten aynı anda görmesi gerekmiyorsa işin bir bölümü asenkron yürütülebilir.

### Hataları tasarımın doğal parçası kabul edin

Timeout, sınırlı retry, circuit breaker, idempotency, kuyruklama ve uygun durumlarda alternatif cevap üretme gibi yöntemler bağımlılığın etkisini sınırlar. Özellikle kontrolsüz retry, zaten zorlanan bir servise daha fazla yük göndererek sorunu büyütebilir.

### Döngüsel bağımlılıkları engelleyin

A servisi B'ye, B de A'ya bağımlıysa sorumluluk sınırları veya iş akışının sahipliği yeniden değerlendirilmelidir. Döngü bazen yeni bir iş alanının henüz açıkça tanımlanmadığını gösterir.

### Bağımlılıkları görünür kılın

Servis haritaları, dağıtık izleme, metrikler ve ilişkilendirilmiş loglar hangi servisin hangisine bağımlı olduğunu göstermelidir. Dokümantasyonda görünmeyen bir ilişki, üretimde ortadan kaybolmaz.

## Yeni bir bağımlılık oluşturmadan önce

Bir servis çağrısı, ortak kütüphane veya olay sözleşmesi eklemeden önce şu sorular yararlı bir kontrol listesi oluşturur:

1. Bu ilişki gerçek bir iş zorunluluğu mu, yoksa mevcut tasarımın sonucu mu?
2. Kullanıcı işlemin sonucunu anında almak zorunda mı?
3. Çağrılan servis çalışmadığında ne olacak?
4. Eski veya önbelleğe alınmış veriyle devam edilebilir mi?
5. İşlem daha sonra tamamlanabilir mi?
6. Sözleşmenin sahibi kim ve nasıl değiştirilecek?
7. Servisler birbirinden bağımsız yayımlanabilecek mi?
8. Bu ilişki başka bir servisin veritabanına erişmeyi gerektiriyor mu?
9. Bağımlılık iki yönlü veya döngüsel hâle geliyor mu?
10. Hata, gecikme ve değişiklik etkisini üretimde görebilecek miyiz?

## Sonuç

Mikroservislerde hedef sıfır bağımlılık değildir; birlikte çalışan bir sistem için bu gerçekçi değildir. Hedef, bağımlılıkları açık, sınırlı, mümkün olduğunca tek yönlü ve değiştirilebilir hâle getirmektir.

Bir ilişkinin sağlıklı olup olmadığını anlamak için şu soruyla başlayabiliriz:

> Bir serviste yapılan değişiklik, gecikme veya hata diğer servislerin kodunu, dağıtım zamanını ya da çalışma durumunu gereksiz yere etkiliyor mu?

Cevap sürekli olarak “evet” ise ortada yalnızca doğal bir iş ilişkisi değil, sıkı bir teknik bağlılık vardır. İyi bir mimari bağımlılıkları gizlemez veya tamamen yok etmeye çalışmaz; onları görünür kılar, sınırlarını bilinçli biçimde çizer ve etkilerinin sistem boyunca kontrolsüz yayılmasını engeller.
