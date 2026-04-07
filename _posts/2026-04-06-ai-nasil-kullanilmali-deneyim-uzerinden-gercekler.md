---
layout: post
title: "AI Nasıl Kullanılmamalı? Deneyim Üzerinden Gerçekler"
date: 2026-04-07 14:00:00 +0300
description: "AI kullanımı üzerine gerçek deneyimler: kod yazma, research ve riskler. Kontrol sende değilse AI seni yönetir."
image: /assets/images/posts/ai-kullanimi.jpg
tags: [ai, software, engineering, architecture, productivity]
---

AI kullanımı herkes için farklıdır. Bu yazı bir “doğru” anlatmaz; sadece benim gözlemlerimi ve yaşadıklarımı içerir.

Bugün AI genelde 3 amaçla kullanılıyor:
1. Kod yazma  
2. Research  
3. Eğlence  

![AI Nasıl Kullanılmalı? Deneyim Üzerinden Gerçekler?](/assets/img/Kontrol%20sende%20mi%2C%20AI’da%20mı_.png)

## 1. Kod Yazma

AI ile proje başlatmak çok kolaylaştı.  
Scaffold, yapı kurma, ilk deployment → ciddi hız kazandırıyor.

Ama asıl problem **revizyon sonrası başlıyor.**

### Problem

İki kritik senaryo var:

### a) Projeyi sıfırdan AI ile başlatmak

İlk versiyon:
- Güzel çalışır  
- Döküman düzgündür  
- Deploy edilir  

Ama sonra:
- Yeni ihtiyaçlar gelir  
- Revizyonlar başlar  
- Context kaybolur  

Sonuç:
- Kod dağılır  
- Tekrarlar oluşur  
- Kodun sahibi kalmaz  
- Yönetilemez hale gelir  

### Çözüm yaklaşımı

- Büyük projeyi parçala  
- Küçük servisler yap  
- Her servisi ayrı AI context ile yönet  

Bu sayede:
- Context küçük kalır  
- Müdahale edilebilir olur  
- Kod bozulmaz  

> Omurga sağlam değilse bu yaklaşım da çalışmaz.

### b) Mevcut temiz projeyi AI ile bozmak

En tehlikeli senaryo.

Özellikle:
- Custom framework varsa  
- Internal library varsa  

AI:
- Senin yapını bilmez  
- Eski versiyon bilgisi kullanır  
- Deprecated config üretir  
- Kod tekrarları ekler  

Bir süre sonra:
> Kendi kodunu tanıyamaz hale gelirsin.

### Kritik risk

Eğer koda hakim değilsen:

AI sana “yaptım” der ama:
- ORM yerine raw query yazmış olabilir  
- Güvenlik açığı bırakmış olabilir  
- Performansı bozmuş olabilir  

Ve sen farkında olmazsın.

Bu noktada:
> AI değil, sen risk haline gelirsin.

## 2. Research

Burada risk daha büyük.

AI:
- Eski bilgi verebilir  
- Yanlış bilgi verebilir  
- Uydurabilir  

Sen doğrulamazsan:

Gerçek hayatta:
- Yanlış savunma yaparsın  
- Tecrübeli insanlarla çatışırsın  
- Güven kaybedersin  

### Kritik hata

AI’yi:
> “Cevap veren sistem” gibi kullanmak

Doğrusu:
> “Arama motoru gibi kullanmak”

Yani:
- Sorgula  
- Karşılaştır  
- Kaynak ara  
- Kanıt iste  

### Gerçek dünya problemi

AI sana der ki:
- “Bunu böyle yapabilirsin”

Ama:
- Servis çalışmaz  
- Veri doğru değildir  
- Sistem POC seviyesindedir  

Sen bunun üstüne ürün kurarsın → patlarsın.

## 3. Eğlence

Burada sorun yok 🙂  
Hatta en sağlıklı kullanım alanı.

## Sonuç

AI, sınır koymazsan:

- Kendi kararlarını verir  
- Senin yerine mimari kurar  
- Senin bilmediğin şeyleri üretir  

Ve çoğu zaman:
> Senin ihtiyacınla uyuşmaz

### En net çıkarım

Eğer:
- Ne yaptığını bilmiyorsan  
- Kontrol sende değilse  

> AI ile çalışmıyorsun, AI seni kullanıyor.

### Son söz

Masada değilsen:

> Oyunun parçası değilsin, kumarın içindesin.


## Referans

Bu yazıyı tamamlayan önceki düşünce yazım:  [Müşteri mi Operatör mü](https://fmarslan.com/2026/01/30/ai-gercegiyle-yuzlesmek-musteri-mi-operator-mu.html)
