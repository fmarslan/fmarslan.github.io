---
layout: post
title: "Event-Driven Mimaride Debug Neden Yetmez? Tracing, Replay ve Gerçek Gözlemlenebilirlik Üzerine"
date: 2025-11-29 12:00:00 +0300
description: Monolitten dağıtık sistemlere geçerken debug yaklaşımının nasıl değiştiğine dair kişisel ve pratik gözlemler.
image: /assets/img/20b9c292-816b-43cc-a652-1de9cc4ca2f2.png
tags:
  - debugging
  - event-driven
  - distributed-tracing
  - observability
  - system-design
---

Event-driven mimariye geçtiğim dönemde yaşadığım en belirgin duygu, akışın bütününü bir türlü görememekti.  
API log’una bakıyorum, worker log’una bakıyorum, Kafka’da mesaj duruyor mu ona bakıyorum…  
Ama parçaları bir araya getirmek pek mümkün olmuyordu. Ne olduğunu biliyorum ama “nasıl” olduğunu görmek zordu.

Monolit günlerinde işler daha sade gelirdi.  
Tek proses, tek thread, tek call stack…  
F5’e bastığında sistem seninle birlikte ilerlerdi.  
Event-driven yapıya geçince o düzen kayboluyor.  
Event sıraya giriyor, worker değişiyor, dış API gecikiyor, retry devreye giriyor, DLQ’da yeni bir yol açılıyor… derken akış düz bir çizgi olmaktan çıkıyor.

Tam bu karmaşanın içindeyken distributed tracing ile tanıştım.  
Trace ID’yi ekleyince, sistemde dolaşan her adım birbirine bağlanmaya başladı.  
Ne zaman süre uzamış, hangi servis beklemiş, dış API ne kadar gecikmiş… hepsi ekranda görünür hâle geliyor.  
Bir şeylerin “akış” olduğunu ilk kez o zaman net şekilde fark ettim.

![Trace ekran görüntüsü](/assets/img/20b9c292-816b-43cc-a652-1de9cc4ca2f2.png)

---

## Log Neyi Gösterir, Neyi Göstermez?

Log hâlâ gerekli, hatta olmazsa olmaz.  
Ama log, sadece olayın olduğu ana ışık tutuyor.  
Bağlantılar tamamen sizin yorumunuza kalıyor.

Örneğin aşağıdaki gibi bir akışı düşünelim:

<div class="mermaid">
sequenceDiagram
    participant API as API
    participant MAP as Mapper
    participant K as Kafka
    participant W as Worker
    participant EXT as External API

    API->>MAP: Input
    MAP->>K: Event oluştur
    K->>W: Worker tüketti
    W->>EXT: Dış API çağrısı
    EXT-->>W: Yanıt döndü
</div>

Bu adımların hepsi ayrı log’larda duruyor.  
Sanki birinin not defteri başka yerde, diğerinin başka yerde.  
Hepsini yan yana koyabilmek için ekstra çaba gerekiyor.

---

## Dağıtık Sistemlerde Debug Mantığı Neden Farklı?

Event-driven mimari kendiliğinden bazı karmaşıklıklar getiriyor:

- Aynı event farklı servislerden geçebiliyor  
- Queue zamanlama ekliyor  
- Retry akışı değiştiriyor  
- DLQ farklı bir iş hattı oluşturuyor  
- Dış API’lerin gecikmesi etkiliyor  
- Worker ölürse başka worker devam ediyor  

Böyle olunca “kodu durdurup bakayım” yaklaşımı doğal olarak işe yaramıyor.  
Artık mesele kodu durdurmak değil, akışı takip edebilmek.

---

## Distributed Tracing ile Akışı Netleştirmek

Tracing, sistemin tüm parçalarını ortak bir kimlik üzerinden bir araya getiriyor.  
Bu sayede bir isteğin nereden geçtiğini ve ne yaşadığını tek bir ekranda görebiliyorsunuz.

<div class="mermaid">
flowchart TD
    A[API] --> B[Event Producer]
    B --> C[Kafka]
    C --> D[Worker]
    D --> E[Dış API]
    E --> F[Worker Sonrası]
    F --> G[Final İşlem]

    subgraph TekTraceID
    A
    B
    C
    D
    E
    F
    G
    end
</div>

Bu görüntü sayesinde “şurada gecikmiş”, “burada hata almış”, “şuradan dönmüş” gibi bilgiler artık tamamen görünür oluyor.

---

## Replay: Hata Çözmenin En Basit Hâli

Bir noktadan sonra sadece tracing görmek yetmiyor.  
DLQ’ya düşen event’i alıp local’de çalıştırabilmek, hatayı olduğu gibi tekrar üretmenize izin veriyor.  
Bu da hatayı bulma ve çözme sürecini oldukça kısaltıyor.

Replay, dağıtık sistemlerde gerçekten rahatlatıcı bir yöntem.

---

## Local Ortamı Küçültmek

Başlarda tüm sistemi local’de ayağa kaldırmaya çalışıyordum.  
Kafka, PostgreSQL, Redis, worker’lar, gateway, discovery, servisler…  
Ama tracing devreye girdikten sonra, bütün sistemi local’de tekrar üretmenin çok da mantıklı olmadığını anladım.

Artık sadece ilgili parçayı local’de çalıştırıp, akışın kalanını tracing üzerinden takip ediyorum.  
Bu çok daha sakin ve sürdürülebilir bir yöntem oldu.

---

## Basit Ama İşe Yarayan Notlar

- Trace ID olmadan event-driven mimariyi takip etmek zor  
- Log formatı mümkün olduğunca standart olmalı  
- DLQ replay’i çalışma kültürünün bir parçası hâline gelmeli  
- Local debug izolasyonlu yapılmalı  
- Tracing ve gözlemlenebilirlik artık debug’un bir uzantısı gibi

---

## Sonuç

Dağıtık mimaride debug kavramı bir araçtan çok bir bakış açısına dönüşüyor.  
Artık önemli olan tek tek adımlar değil; olayın genel yolculuğu.  
Tracing ve replay, bu yolculuğu anlamayı kolaylaştırıyor ve sistemi daha tahmin edilebilir hâle getiriyor.
