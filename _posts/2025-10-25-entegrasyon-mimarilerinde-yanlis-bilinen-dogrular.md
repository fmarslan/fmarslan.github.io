---
layout: post
title: "Entegrasyon Mimarilerinde Yanlış Bilinen Doğrular"
categories: [Entegrasyon, Architecture]
mermaid: true
---


Dağıtık sistemlerin büyümesiyle birlikte entegrasyon mimarisi artık sadece “veriyi bir yerden bir yere taşımak” değil; sağlıktan finansa, e-ticaretten kamu projelerine kadar her alanda kritik bir disiplin hâline geldi.
Ancak hâlâ bazı yanlış bilinen doğrular mimari kararları zehirliyor.

Bu yazıda, entegrasyon mimarisinde sıkça rastlanan ama aslında yanlış olan inançların üstünü açıyoruz.

---

<img src="/assets/img/7fbabe90-a44c-4ae1-868d-7f31948feaee.png" alt="cover" style="max-width: 50%; max-height:10%">


## **1. “REST varken mesaj kuyruğuna ne gerek var?”**

Birçok ekip hâlâ “REST her şeyi çözer” yanılgısıyla hareket ediyor.

Gerçek şu ki:

* REST **senkron** bir iletişim modelidir.
* Yük altında **çöker**, çağrı zincirleri **domino etkisi** yaratır.
* Bir servisin erişilemez olması tüm sistemi **kilitler**.

### REST ile kırılgan bir yapı

<div class="mermaid">
    sequenceDiagram
        participant A as Servis A
        participant B as Servis B
        participant C as Servis C
    
        A->>B: İstek
        B->>C: İstek
        C--xB: Hata / Timeout
        B--xA: Bekleme / Hata
</div>

Doğru yaklaşım:
REST → **kısa işlemler**, **doğrudan cevap gerektiren** aksiyonlar için.
Event → **uzun süreçler**, **yüksek hacim**, **bağımlılığı azaltmak** için.

---

## **2. “Senkron daha hızlıdır, asenkron yavaştır.”**

Bu da yanlış bilinen doğrulardan biridir.

Asenkron sistemler **zaman olarak değil, bağımlılık olarak** ayrıştırılır.

Senkron sistem: “Ben işimi senin bitirmene göre yaparım.”
Asenkron sistem: “Sen işini yap, ben event’i işleyince ilerlerim.”

Sonuç: **yük artınca senkron çöker, asenkron ölçeklenir.**

<div class="mermaid">
flowchart LR
    A[Producer] --> B((Queue))
    B --> C[Worker 1]
    B --> D[Worker 2]
    B --> E[Worker 3]
</div>

---

## **3. “Event çok gelirse performans düşer.”**

Yanlış.
Doğru yapıda event artışı = daha fazla worker = daha yüksek throughput.

* ❌ “Event fazlaysa sistem yavaşlar.”
* ✔ “Event fazlaysa işleyen servisler ölçeklenir.”

---

## **4. “ETL ile entegrasyon yapmak modern mimari için yeterlidir.”**

ETL, modern entegrasyonun yalnızca **küçük bir parçasıdır**.

Bugünün entegrasyon ihtiyaçlarında:

* gerçek zamanlı veri
* çift yönlü senkron/asenkron iletişim
* mapping & validation
* routing
* digital signing
* idempotency
* DLQ + retry yönetimi
* workflow orchestration

gibi karmaşık süreçler vardır.

ETL → sadece veri taşır
Modern entegrasyon → süreç yürütür.

---

## **5. “Tek bir canonical format her şeyi çözer.”**

Canonical model değerlidir fakat evrensel bir ilaç değildir.

* Her müşteri farklı format ister
* Her ülkenin kuralı farklıdır
* Bazı akışlarda XML, bazısında JSON gerekir
* Dış sistemler canonical formatı tanımaz

Doğru yaklaşım:

* Canonical → **iç operasyon formatı**
* Mapping → **dış dünya ile konuşma katmanı**

---

## **6. “Bütünleşik bir süreçte tutarlılık şarttır.”**

Bu yanlış ve pahalı bir beklentidir.

**Her adımın aynı anda tutarlı olması gerekmiyor.**

Örnekler:

* E-mail bildiriminin gecikmesi sorun değildir
* Logların 1–2 saniye sonra indekslenmesi normaldir
* Stok güncellemesi birkaç yüz ms gecikebilir

Bu nedenle **eventual consistency** modern entegrasyonların temel modelidir.

---

## **7. “DLQ sadece hata kuyruğu, olmasa da olur.”**

DLQ bir hata kutusu değil, **sigorta sistemidir**.

DLQ yoksa:

* Hatalı event akışları kuyruğu bozar
* Sonsuz retry döngüsü sistemi çökertir
* Eventler kaybolur
* Veri bütünlüğü bozulur

Doğru mimari:

<div class="mermaid">
flowchart LR
    A[Main Queue] -->|Hata| B((Retry Queue))
    B -->|Hata| C((DLQ))
    C --> D[Alert + Review]
</div>

---

## **8. “Mapping motoruna gerek yok, kodda çeviririz.”**

Bu yaklaşım başlangıçta kolay görünür ancak:

* format değişince kod kırılır
* müşteri spesifik istekleri yönetmek zorlaşır
* ülke/entegrasyon kuralları değişir
* test maliyeti katlanır
* teknik borç büyür

Mapping **bağımsız bir katman** olmalıdır.

---

## **9. “Webhook kullanmadan sadece polling yapmak daha güvenlidir.”**

Polling:

* maliyetlidir
* gecikmelidir
* gereksiz yük oluşturur

Webhook:

* hafif
* anlık
* olay odaklı

Doğru strateji çoğu zaman hibrittir:

* Webhook → *tetikleyici*
* Polling → *garanti mekanizması*

---

## **10. “Entegrasyon sistemi bir kez çalışırsa tamamdır.”**

Gerçek entegrasyon sistemi:

* izlenebilir
* yeniden çalıştırılabilir (replay)
* version’lanabilir
* izleme/durum takibi yapılabilir
* operasyona açık (debug-friendly) olmalıdır

Çalışmak → başlangıç
Sürdürülebilir çalışmak → mimari disiplin

---

## **11. “Event yaparsak her şey çözülür.”**

Event-driven mimari sihirli değnek değildir.

Dikkat edilmezse:

* event storming
* sonsuz döngüler
* duplicated event
* ordering sorunları
* correlation ID eksikliği
* idempotency problemleri

oluşur.

Event → araçtır, amaç değil.

---

# **Sonuç: Entegrasyon Bir Aktarım Değil, Bir Disiplindir**

Entegrasyon, 2025’in yazılım dünyasında en kritik mimari tasarım alanlarından biridir.

Doğru entegrasyon:

* doğru iletişim modeli
* doğru tutarlılık beklentisi
* event bazlı düşünme
* mapping/validation katmanları
* retry & dlq
* observability
* genişletilebilir süreçler

ile inşa edilir.

En büyük risk şudur:

> **“Doğru bildiğini sandığın bir yanlış, yıllarca mimari borca dönüşebilir.”**
