---
layout: post
title: "Entegrasyon Mimarilerinde Yanlış Bilinen Doğrular"
categories: [Entegrasyon, Architecture]
mermaid: true
---

Dağıtık sistemlerin büyümesiyle birlikte entegrasyon, sadece "veriyi taşımak" olarak görülen eski anlamının çok ötesine geçti. Bugün finans, sağlık, kamu ve e-ticaret gibi hemen her sektörde mimarinin en kritik parçalarından biri. Buna rağmen, pratikte sıkça karşımıza çıkan bazı yanlış kabuller hâlâ ekiplerin teknik kararlarını olumsuz etkiliyor.

Bu yazı, entegrasyon mimarisinde doğru sanılan ama aslında ciddi mimari borçlara yol açan bu yanlış inanışları netleştirmek için hazırlandı.



<img src="/assets/img/7fbabe90-a44c-4ae1-868d-7f31948feaee.png" alt="cover" style="max-width: 50%; max-height:10%">

## **1. "REST varken mesaj kuyruğuna ne gerek var?"**

REST birçok ekip tarafından varsayılan iletişim modeli olarak görülüyor. Fakat gerçek şudur:

* REST tamamen **senkron** bir yapıya dayanır.
* Yük arttığında çağrılar zincirleme gecikmeye sebep olur.
* Tek bir servisin yanıt vermemesi tüm akışı bloke eder.

### REST ile kırılgan yapı

<div class="mermaid">
sequenceDiagram
    participant A as Servis A
    participant B as Servis B
    participant C as Servis C

```
A->>B: İstek
B->>C: İstek
C--xB: Timeout / Hata
B--xA: Gecikme / Hata
```

</div>

Doğru kullanım yaklaşımı:

* REST → hızlı cevap gerektiren kısa işlemler
* Event → uzun süreçler, yüksek hacim, sistem bağımlılığını azaltma



## **2. "Senkron daha hızlıdır, asenkron yavaştır."**

Yaygın bir yanılgıdır.

Asenkron mimari hızdan değil, **bağımlılıkları gevşetmekten** kazanır.

* Senkron: "Sen bitir, ben öyle devam edeyim."
* Asenkron: "Event gelsin, ben ilerlerim."

Sonuç: Yük arttığında senkron yapı kırılır; asenkron rahatça ölçeklenir.

<div class="mermaid">
flowchart LR
    A[Producer] --> B((Queue))
    B --> C[Worker 1]
    B --> D[Worker 2]
    B --> E[Worker 3]
</div>



## **3. "Event çok gelirse performans düşer."**

Doğru tasarlanmış bir mimaride bunun tam tersi olur.

Event sayısı arttıkça worker kapasitesi artırılır ve sistem çok daha yüksek throughput üretir.

* ❌ "Event fazlaysa sistem yavaşlar."
* ✔ "Event fazlaysa sistem genişler."



## **4. "ETL modern entegrasyon için yeterlidir."**

ETL önemli bir araçtır ancak entegrasyonun yalnızca küçük bir parçasını temsil eder.

Gerçek dünya entegrasyonlarında şunlar vardır:

* gerçek zamanlı işleme

* çift yönlü iletişim (senkron / asenkron)

* mapping ve validasyon

* yönlendirme (routing)

* dijital imzalama

* idempotency

* retry & DLQ yönetimi

* workflow orkestrasyonu

* ETL → veri taşır

* Modern entegrasyon → süreci yönetir



## **5. "Tek bir canonical format tüm problemleri çözer."**

Canonical model değerlidir ancak evrensel çözüm değildir.

* Her müşterinin ihtiyaçları farklıdır.
* Ülkelerin mevzuatları değişir.
* Bazı akışlar XML isterken bazıları JSON gerektirir.
* Dış sistemler canonical dili bilmez.

Doğru model:

* Canonical → içeride ortak dil
* Mapping → dış dünya ile iletişim



## **6. "Tüm süreçlerde tam tutarlılık zorunludur."**

Bu hem gereksiz hem maliyetli bir beklentidir.

Birçok adımın anlık tutarlılığa ihtiyacı yoktur:

* E-mail bildirimi gecikebilir.
* Log’ların birkaç saniye gecikmesi doğaldır.
* Stok güncellemesi milisaniyelik farklara toleranslıdır.

Bu yüzden modern entegrasyonlarda **eventual consistency** temel ilkedir.



## **7. "DLQ olmasa da olur, sadece hata kuyruğu."**

DLQ basit bir hata kutusu değildir; sistemin korunma katmanıdır.

DLQ yoksa:

* hatalı event akışı tıkar,
* sonsuz retry döngüsü oluşabilir,
* eventler kaybolabilir,
* veri tutarlılığı bozulur.

<div class="mermaid">
flowchart LR
    A[Main Queue] -->|Hata| B((Retry Queue))
    B -->|Hata| C((DLQ))
    C --> D[Alert + Review]
</div>



## **8. "Mapping motoruna gerek yok, kod içinde çeviririz."**

Başlangıçta pratik görünse de uzun vadede ciddi teknik borç oluşturur.

* Format değiştikçe kod kırılır.
* Müşteri talepleri yönetilemez.
* Ülke kuralları değiştikçe bakım maliyeti yükselir.
* Test yükü katlanır.

Mapping bağımsız bir katman olmalıdır.



## **9. "Webhook yerine sadece polling kullanmak daha güvenlidir."**

Polling yüksek maliyetli ve gecikmeye açıktır.

Webhook ise hafif, anlık ve olay odaklıdır.

En sağlıklı model genelde hibrittir:

* Webhook → tetikleyici
* Polling → güvence



## **10. "Entegrasyon sistemi bir kez çalıştı mı biter."**

Sağlam bir entegrasyon mimarisi:

* izlenebilir olmalı,
* tekrar çalıştırılabilir (replay),
* versiyonlanabilir,
* durum takibi yapılabilir,
* operasyona açık ve debug edilebilir olmalıdır.

Bir kere çalışması yeterli değildir; sürdürülebilir olması asıl başarıdır.



## **11. "Event yaparsak her şeyi çözeriz."**

Event-driven mimari güçlüdür ama sihirli değnek değildir.

İyi tasarlanmamışsa:

* event storming,
* duplicate event,
* döngüsel akışlar,
* sıralama problemleri,
* correlation eksikliği,
* idempotency hataları

kaçınılmaz olur.

Event bir araçtır; mimarinin kendisi değil.



# **Sonuç: Entegrasyon Bir Aktarım Değil, Bir Disiplindir**

2025 dünyasında entegrasyon, yazılım ekiplerinin en stratejik karar alanlarından biri haline geldi.

Doğru entegrasyon; iletişim modelleri, tutarlılık stratejisi, event yaklaşımı, mapping/validation katmanları, retry-DLQ politikaları, gözlemlenebilirlik ve genişleyebilir süreç tasarımıyla inşa edilir.

En büyük risk ise şudur:

> **“Doğru sandığın bir yanlış, yıllarca mimari borca dönüşebilir.”**
