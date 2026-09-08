---
layout: page
title: Dağıtık Sistemler ve Yazılım Mühendisliği
permalink: /dagitik-sistemler/
lang: tr-TR
alternate_url: /en/distributed-systems/
description: Fatih Mehmet Arslan (fmarslan) ile dağıtık sistemler; Java, .NET, Kafka, asenkron akışlar, veri sahipliği ve mikroservis sınırları üzerine deneyimler.
---

## Servis sayısından önce veri sahipliği

Dağıtık sistemlerde Java ve .NET servisleri, Kafka akışları, asenkron işlemler ve çok kiracılı platformlar üzerinde çalışıyorum. Mesajın geciktiği, bir bağımlılığın yanıt vermediği veya iki servisin aynı veriyi farklı yorumladığı durumlar da tasarımın parçası.

Servis sınırı, sahiplik ve hata davranışı açık olduğunda fayda sağlar. Sisteme yeni bir süreç eklemek bakımını kendiliğinden kolaylaştırmaz. Bağımlılıkların nasıl değiştiği ve ekiplerin hangi kararları bağımsız alabileceği de değerlendirilmelidir.

## Seçilmiş teknik yazılar

Bu yazılar uygulama kararlarını servis sınırları ve bağımlılık yönetimiyle birlikte ele alıyor:

- [Projelerde bağımlılık ve mikroservis sınırları]({% post_url tr/2026-08-04-projelerde-bagimlilik-ve-mikroservislerde-sinirlari %})
- [Bounded context kararı nasıl verilir?]({% post_url tr/2025-11-23-bounded-context-karari-nasil-verilir %})

## Tasarımdan üretime

Kod incelemesi, gözlemlenebilirlik ve sorun giderme bu çalışmanın devamıdır. Üretimden gelen geri bildirimle veri ve servis sınırlarına ilişkin varsayımları değerlendiriyorum. [Özgeçmişim]({{ '/cv/' | relative_url }}), [yazılım mimarisi]({{ '/yazilim-mimarisi/' | relative_url }}) ve [Peppol entegrasyonu]({{ '/peppol-entegrasyonu/' | relative_url }}) sayfalarında ilgili deneyimlere ulaşabilirsiniz.
