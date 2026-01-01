---
layout: post
title: "Test-Centric Development: Kodun İlk Çalıştığı Yer Test Olsun"
date: 2025-12-30 09:00:00 +0300
description: Testi geliştirme akışının doğal entry point’i haline getirerek debug hızını artıran, TDD’ye mesafeli ekipler için pratik bir yaklaşım.
image: /assets/img/test-centric-development.png
tags:
  - testing
  - debugging
  - developer-experience
  - software-architecture
  - workflow
---

_Test-first değil, test etrafında geliştirme_

Kod yazarken test çoğu zaman ikinci planda kalıyor.  
Bu tembellik değil, gerçek hayat. Bir şey çalışmıyor, debug etmek istiyorsun.  
Bir davranış kafanda net değil, “bir çalıştırayım” diyorsun.  
Bu noktada test yazmak çoğu developer için refleks değil.

![Test-Centric Development kapak görseli](/assets/img/test-centric-development.png)

Genelde olan şey şu:  
Uygulama ayağa kaldırılır, controller’dan istek atılır, log bakılır, tekrar denenir.  
Asıl görmek istediğin kod, config ve environment gürültüsünün arasında kaybolur.



## Test-Centric yaklaşım ne yapıyor?

Kimseye “TDD yap” demiyor.  
Kimseyi test yazmaya zorlamıyor.

Sadece şunu söylüyor:

> **Kodun ilk çalıştığı yer uygulama değil, test olsun.**

IDE’de Run / Debug’a bastığında ayağa kalkan şey application değil, **test**.


## Günlük hayattan basit bir örnek

Yeni bir hesaplama fonksiyonu yazıyorsun.

Normalde:
- controller ekle
- endpoint çağır
- response’a bak
- log ekle / sil

Test-centric’te:
- test yaz
- oradan çağır
- breakpoint koy
- bitti

### .NET örneği

```csharp
public class OrderService
{
    public decimal CalculateTotal(decimal price, int quantity)
    {
        return price * quantity;
    }
}
````

Bunu denemek için app kaldırmaya gerek yok.

```csharp
public class OrderServiceTests
{
    [Fact]
    public void CalculateTotal_basic_case()
    {
        var service = new OrderService();

        var result = service.CalculateTotal(10, 3);

        Assert.Equal(30, result);
    }
}
```

Burada çoğu developer şunu düşünüyor:

> “Test yazıyorum” değil,
> “Bir çalıştırayım bakayım.”

Ama sonuçta:

* Kod çalıştı
* Debug yapıldı
* Ve **bir test zaten oluştu**

Bu test mükemmel olmak zorunda değil.
Ama en azından o kod için **smoke seviyesinde** bir güvence var artık.


## In-memory araçlar devreye girince

İş biraz büyüyünce gerçek sistemleri localde ayağa kaldırmak daha da pahalı oluyor.

Bu noktada:

* in-memory DB
* in-memory message bus
* fake / lightweight dependency’ler

devreye giriyor.

Ama amaç prod’u birebir taklit etmek değil.
Amaç **developer’ın kafasındaki akışı hızlıca çalıştırmak**.

### Basit bir örnek

```csharp
public class PaymentHandler
{
    private readonly IEventBus _bus;

    public PaymentHandler(IEventBus bus)
    {
        _bus = bus;
    }

    public void Handle(Payment payment)
    {
        if (payment.Amount <= 0)
            throw new InvalidOperationException();

        _bus.Publish(new PaymentCompleted(payment.Id));
    }
}
```

Testte gerçek Kafka yok:

```csharp
[Fact]
public void Payment_should_publish_event()
{
    var bus = new InMemoryEventBus();
    var handler = new PaymentHandler(bus);

    handler.Handle(new Payment { Id = "p1", Amount = 100 });

    Assert.Single(bus.PublishedEvents);
}
```

Test burada küçük bir runtime gibi çalışıyor:

* mesaj gidiyor
* handler tetikleniyor
* sonuç görülüyor

Docker yok, network yok, config yok.
Sadece kodun davranışı var.

## Prod ↔ Local köprüsü (DLQ tarafı)

Asıl fark burada çıkıyor.

Prod’da bir hata oluyor.
Bir mesaj DLQ’ya düşüyor.

Normalde:

* log okunur
* tahmin yürütülür
* staging’e deploy edilir
* “bir daha olursa bakarız” denir

Test-centric yaklaşımda:

* DLQ mesajı alınır
* testin içine konur
* localde tekrar çalıştırılır

```csharp
[Fact]
public void DLQ_message_should_fail_same_way()
{
    var bus = new InMemoryEventBus();
    var handler = new PaymentHandler(bus);

    var faulty = new Payment { Id = "p2", Amount = 0 };

    Assert.Throws<InvalidOperationException>(() =>
        handler.Handle(faulty)
    );
}
```

Run’a basarsın.
Breakpoint düşer.
Hata oradadır.

Fix yazıldığında test kalır.
O prod hatası artık **tekrar oynatılabilir** bir senaryodur.

Bir daha gelirse yakalanır.

## Bu TDD mi?

Hayır.
Red-Green-Refactor disiplini yok.
Dogmatik bir yaklaşım değil.

Ama ortak nokta şu:

* Kodun nasıl kullanılacağı test üzerinden şekilleniyor

Burada motivasyon kalite değil.
Motivasyon **debug edebilmek**.

Test, yan ürün.

## Peki neden her yerde olmuyor?

Birincisi mimari.
Kod testten kolay çağrılabilir değilse bu yaklaşım çalışmaz.
Her şey controller’a gömülüyse, test entry point olamaz.

İkincisi alışkanlık.
Birçok ekip hâlâ debug’ı “uygulamayı kaldır, log bak” üzerinden yapıyor.
Test runner’ı debug aracı olarak görmüyor.

Üçüncüsü algı.
Test hâlâ “sonradan yazılan”, “QA işi” gibi algılanıyor.
Geliştirmenin merkezine koymak zihinsel bir eşik.

Dördüncüsü zaman baskısı.
İlk başta yavaş gibi geliyor.
Çoğu ekip o ilk eşiği geçemiyor.

## Son söz

Test-Centric Development sihirli bir çözüm değil.
Her ekipte de çalışmaz.

Ama:

* test yazmayı sevmeyen
* TDD’ye mesafeli
* ama prod hatalarından da yorulmuş

ekipler için dürüst bir ara yol.

Testi zorunluluk olmaktan çıkarıp,
**çalışma şeklinin doğal bir parçası** yapmaya çalışıyor.

Ve çoğu zaman, bu bile yeterince büyük bir kazanım.