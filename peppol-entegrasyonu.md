---
layout: page
title: Peppol Entegrasyonu ve Mimari
permalink: /peppol-entegrasyonu/
lang: tr-TR
alternate_url: /en/peppol-integration/
description: Fatih Mehmet Arslan (fmarslan) ile Peppol entegrasyonu; regüle belge akışları, DNS keşfi, doğrulama, denetim izleri ve veri konumuna ilişkin mimari kararlar.
---

## Regüle sistemlerde belge alışverişi

Avrupa'da Peppol üzerinden belge taşıyan regüle entegrasyonlar üzerinde çalıştım. Bu akışlarda teslimatı doğrulama, denetim izleri, kiracı izolasyonu ve veri konumuyla birlikte ele alıyorum.

Keşif mekanizmasını anlamak, entegrasyonu anlamanın bir parçası. Başarısız bir belge akışını yalnızca uygulama hatası olarak incelemeden önce ağın katılımcıları nasıl bulduğunu ve sorgunun hangi altyapıya bağlı olduğunu bilmek gerekir.

## Keşif mekanizması ve mimari

Aşağıdaki ilk yazı Peppol keşfinin arkasındaki DNS mantığını açıklıyor. İkinci yazı ise regülasyonun sistem sınırlarını ve yerleşim kararlarını nasıl etkilediğini ele alıyor:

- [Peppol ağının DNS mantığıyla çalışma prensibi]({% post_url tr/2025-12-25-peppol-aginin-dns-mantikla-calisma-prensibi %})
- [Regülasyon odaklı sovereign cell mimarisi]({% post_url tr/2026-04-27-sovereign-cell-architecture-regulation-driven-design %})

## Diğer mühendislik alanlarıyla bağlantısı

Peppol entegrasyonu; sahiplik, hata davranışı ve işletim açısından [dağıtık sistemler]({{ '/dagitik-sistemler/' | relative_url }}) ve [yazılım mimarisi]({{ '/yazilim-mimarisi/' | relative_url }}) ile aynı soruları paylaşır. Bu yazıların arkasındaki deneyimi [Hakkımda sayfasında]({{ '/about/' | relative_url }}) bulabilirsiniz.
