---
layout: post
title: "Yapay Zekâ ve İnsan Zihni: Düşünmenin Erozyonu, Kodun Çürümesi ve Kontrolün Kaybı"
date: 2025-11-25 09:00:00 +0300
description: Yapay zekâ destekli geliştirmede düşünmeyi modele devretmenin hem teknik hem zihinsel sonuçlarını, gerçek örneklerle ve verilerle tartıştım.
image: /assets/img/8839b539-b011-4bc1-adff-8a69afb65f8c.png
tags:
  - artificial-intelligence
  - software-engineering
  - architecture
  - productivity
---

Yapay zekâ araçları yazılım geliştirme süreçlerine ciddi bir hız ve kolaylık getiriyor. Kod üretmek, hataları düzeltmek veya teknik taslak oluşturmak artık dakikalar değil saniyeler içinde yapılabiliyor. Ne var ki bu parlak verimlilik, insan zihninin gözle görülmeyen ama kritik bir kaybına işaret ediyor: **düşünme sorumluluğunun devreden çıkması**. Bugün internette sıkça karşımıza çıkan “AI artık yazılımı baştan sona yazıyor”, “Hiç bilmeyen proje çıkarabiliyor”, “AI yüzünden yazılımcılar işsiz kalacak” tartışmaları da tam olarak bu kaygının yansıması.

## Verimliliğin Bedeli: Düşünme Devreden Çıkınca

Yapay zekâ doğru kullanıldığında geliştiricinin iş yükünü azaltan, işleri hızlandıran ve rutinleri otomatikleştiren güçlü bir araç. Sorun, AI’ın araç olmaktan çıkıp “mühendis” rolüne yerleştirilmesi. Gereksinimler tanımlanmadan, mimarinin neden öyle olması gerektiği düşünülmeden, bağlam aktarılmadan ve parametreler eksikken modele danışıldığında AI boşlukları tahminleriyle dolduruyor. Yüzeysel olarak mantıklı görünen bu tahminler, uzun vadede teknik çürümeye dönüşüyor ve kısa vadede çalışan, büyüdükçe çöken projeler üretiyor.

## İnsan Durur, AI Tahmin Yapar

İnsan eksik bilgi gördüğünde durur, sorgular, bağlam kurar ve düşünmeye başlar. AI belirsizliği sorgulamaz; yalnızca en olası seçeneği üretir. Veri CSV iken JSON çözümü önermesi, event-driven bir senaryoya REST API tasarlaması ya da kimlik doğrulamayı kendi kurgusuyla doldurması bu yüzden şaşırtıcı değildir. Küçük projelerde tolere edilebilen bu öngörüler, kurumsal sistemlerde doğrudan **mimari bozulma** anlamına gelir; çünkü yanlış temel üzerine atılan her doğru adım bile zaman içinde yanlış çalışır.

## Zihinsel Çöküş Gerçek

Teknik risklerin ötesindeki daha derin problem ise insan zihninin zayıflamasıdır. MIT’nin EEG ölçümleri üzerine yaptığı araştırma, yapay zekâ yardımıyla metin üreten katılımcıların beyin aktivitesinin %55 oranında düştüğünü gösteriyor. Eleştirel düşünme refleksleri zayıflıyor, hafıza süreçleri bozuluyor, özgün içerik üretme kapasitesi yok oluyor ve insanlar her yeni görevde biraz daha tembelleşiyor. AI önerilerini sorgulamadan kabul eden geliştirici zamanla bağlam düşünemez hale geliyor; projedeki tasarımın neden öyle olduğunu açıklayamayan, kararların sonuçlarını öngöremeyen, uzun vadeli etkileri tartamayan bir profesyonel profili ortaya çıkıyor.

![AI düşünce yükünü üstlenirken donup kalan geliştirici illüstrasyonu](/assets/img/8839b539-b011-4bc1-adff-8a69afb65f8c.png)

## Tahminle Gelen Monolitin Bedeli

Bu tabloyu somut bir senaryoda görmek zor değil. Bir ekip müşteri verilerini işleyen bir servis tasarlarken gereksinimleri netleştirmeden AI’dan yardım alıyor. Eksik parametreler yüzünden model monolitik bir yapı öneriyor ve ekip bunu sorgulamadan projeye alıyor. Sistem büyüdükçe trafik sorunları, veri tutarsızlıkları, sürekli kırılan pipeline’lar ortaya çıkıyor. “Mimarinin neden böyle seçildiği” sorusuna kimse cevap veremiyor; çünkü karar insana değil, modelin tahminine ait. İnsan düşünmediğinde proje de düşünemiyor.

## Aynı Korkunun İki Ucu

İnternetteki tartışmaların keskinleşmesinin sebebi açık: Bir grup, hiç dokunmadan proje çıkarabildiğini söyleyerek AI’a olduğundan fazla güç atfederken; diğer grup bunun kaçınılmaz şekilde çökeceğini anlatarak mühendisliğin değerini savunuyor. Bu iki uç aslında tek bir ortak korkunun farklı yüzleri: **“Ya AI gerçekten işimizi elimizden alırsa?”** İnsan düşünme becerisini, analiz süreçlerini, tasarım kararlarını ve bağlam sorumluluğunu tamamen yapay zekâya devrederse, evet; AI o kişinin işini elinden alır. Çünkü kişi kendisini işlevsiz hâle getirir. Ama insan beyninin muazzam kapasitesini kullanır, düşünme görevini bırakmaz ve AI’ı düşünmenin değil aksiyonun aracına dönüştürürse, yapay zekâ onun yerini alamaz. AI düşünemez; yalnızca üretilmiş düşünceleri uygular.

## Şiirde ve Kodda Aynı Fark

Bu fark, bir şiir üzerinden bile görülebilir. Yapay zekânın ürettiği şiir teknik olarak düzgündür; ritmi, yapısı, kelime seçimi yerindedir:

```
Gökyüzü sessizce akarken gecenin koynuna,
Yıldızlar birer birer düşer zamanın yollarına.
Rüzgâr hafifçe okşar uyuyan şehrin yüzünü,
Her şey düzenli, sakin; tamamlanmış bir cümle gibi.
```

Ama bu dizelerde insanın iç sesi yoktur. Duygunun kaynağı, yaşanmışlığın izi, kırılmanın ağırlığı hissedilmez. Oysa Orhan Veli’nin dizelerinde insanın varlığı kendini hemen hissettirir:

```
Handan, hamamdan geçtik,
Gün ışığında hissemize razıydık;
Saadetinden geçtik,
Ümidine razıydık;
Hiçbirini bulamadık;
Kendimize hüzünler icat ettik,
Avunamadık
Yoksa biz…
Bu dünyadan değil miydik?
```

AI’nın ürettiği her şeyde eksik olan tam da budur: yaşanmışlığın sesi. Aynı eksiklik yazılımda da geçerlidir. AI kod yazabilir ama neden öyle yazdığını bilmez, senaryonun bağlamını anlamaz, kararın uzun vadeli etkisini değerlendiremez, modüllerin nasıl evrileceğini öngöremez. Bu yüzden yapay zekâ üretir ama düşünmez; insan ise düşünür ve anlam kurar. İnsan düşünmeyi bırakırsa teknoloji üretmez, yalnızca çöp biriktirir.

## Doğru Rol Tanımı: AI Aksiyonun Aracı Olmalı

Sonuç net: AI mutlaka kullanılmalıdır, fakat rolü doğru tanımlanmalıdır. Yapay zekâ düşünmenin yerine değil, düşünme sonrasında yapılacak işlerin hızlandırıcısı olmalıdır. İnsan zihnini devreden çıkarmak hem bireyin hem de projelerin çöküşü anlamına gelir. Düşünme sorumluluğunu bırakan ekipler, en parlak modeli bile kullansalar, yalnızca tahmin edilmiş kararların enkazıyla baş başa kalır.

**Referanslar**

* [https://velev.news/gorus/yapay-zeka-araclari-elestirel-dusunme-becerimizi-koreltiyor-olabilir-mi/](https://velev.news/gorus/yapay-zeka-araclari-elestirel-dusunme-becerimizi-koreltiyor-olabilir-mi/)
* [https://ogutdgn.com/blog/difference-between-human-brain-and-ai-logic](https://ogutdgn.com/blog/difference-between-human-brain-and-ai-logic)
