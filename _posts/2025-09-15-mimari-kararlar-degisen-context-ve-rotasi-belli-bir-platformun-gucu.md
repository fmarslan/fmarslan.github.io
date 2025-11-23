---
layout: post
title: "Mimari Kararlar, Değişen Context ve Rotası Belli Bir Platformun Gücü"
date: 2025-09-15 09:00:00 +0300
description: Context netliğinin mimariyi nasıl yönettiğini ve değişen domain karşısında rotayı nasıl koruduğumu metaforlarla anlattım.
image: /assets/img/context-rotasi.png
tags:
  - architecture
  - domain-driven-design
  - strategy
---

Bir platformu ayakta tutan şey çoğu zaman teknoloji değil; context’in kendisidir.
Context netse mimari netleşir, belirsizse hiçbir zaman yerine oturmaz.
Yıllar içerisinde fark ettiğim şey şu oldu: **Rotası olmayan gemiye hiçbir rüzgâr yardım etmez; rotası belli olan gemi ise rüzgârı arkasına aldığında durdurulamaz.**
Mimari de aynen böyle çalışıyor.



## 1. Context Yoksa Mimarinin Yönü Yoktur

Çoğu platform yanlış başlamıyor; belirsiz başlıyor.
* Ne iş yapılacağı, hangi değerin üretileceği belli değil.
* Domain sınırı nerede başlayıp nerede bitecek, kimse emin değil.
* Aynı kavram ekibin farklı noktalarında başka anlamlara geliyor.
* Kafalarda ortak bir dünya haritası bulunmuyor.

Sonuç olarak en iyi teknoloji bile rotasız gemi gibi sağa sola savruluyor.
Mimari acıların çoğu aslında context belirsizliğinden kaynaklanıyor.



## 2. Context Değişince Mimari de Değişmek Zorunda

Context zamanla büyür, şekil değiştirir, yeni veriler eklenir.
Ama mimari çoğu zaman beton blokmuş gibi sabit tutulur.
Halbuki domain esniyorsa, mimari de onunla birlikte yelkenlerini ayarlamak zorundadır.
Rüzgâr yön değiştirince yelkenini çevirmeyen gemi devrilir; context değişimini reddeden mimari de aynı akıbeti yaşar.



## 3. Mimariyi Context’e Bağlamak = Yelkene Rota Vermek

Doğru yaklaşım:
1. Önce context’i anlamak.
2. Mimarî kararları bu zeminde almak.
3. Context değiştikçe mimariyi güncellemek.

Bounded context tam da bunu sağlıyor.
Context doğru çizilince servis sınırları, veri sahipliği ve sorumluluk paylaşımı kendiliğinden ortaya çıkıyor.
Böylece platform, sağa sola çarpan tekne değil, rüzgârı fırsata çeviren gemi oluyor.



<figure>
  <img src="/assets/img/context-rotasi.png" alt="Rüzgârla hizalanan soyut gemi ve context çemberleri" loading="lazy">
  <figcaption>Context’i doğru okuyunca mimari, rüzgârı arkasına alan gemi gibi kendi rotasını buluyor.</figcaption>
</figure>



## 4. Yanlış Mimari = Yanlış Rota

Yanlış mimarinin iki temel sebebi var:
1. Context yanlış anlaşılmıştır (örneğin invoice’ın tek anlamı olduğuna inanmak, halbuki üç farklı anlamı vardır).
2. Mimarî kararlar context’ten bağımsız alınır (servisler teknik olarak bölünür ama domain olarak parçalanmamıştır).

Bu hatalar mikroservis karmaşası, kırılgan bağımlılıklar, tek context’e ait kodun başka context’ten çağrılması ve her değişikliğin tüm sistemi etkilemesiyle sonuçlanır.
Bu, rotası yokken yelken şişirmeye çalışan gemiye benzer: hareket eder ama nereye gittiği belli değildir.



## 5. Mimarinin Gücü: Değişimi Karşılayabilmesi

Bir mimariyi güçlü kılan şey kusursuz başlangıç değil; değişime açık olmasıdır.
Context genişledikçe esneyen, ölçeklenen, kararlarını domain’in sesine göre güncelleyen yapılar uzun süre ayakta kalır.
Bu yüzden tasarım masasında şu döngüyü hep canlı tutarım:

<div class="mermaid">
flowchart LR
    Context --> Karar
    Karar --> Mimari
    Mimari --> YeniContext
    YeniContext --> Karar
</div>

Bu döngü sayesinde platform yıllar boyunca sağlıklı kalır.



## 6. Doğru Context = Doğru Yelken, Doğru Rota

Context netse:
* Servis sınırları kendiliğinden belirir.
* Veri sahipliği doğal olarak dağılır.
* Trafik akışı sadeleşir, bounded context’ler çatışmaz.
* Domain büyüdükçe mimari kendini genişletir.

Rotası belli olan gemi rüzgârı fırsata çevirir; rotası belirsiz olan gemi ise en güzel rüzgârda bile savrulur.



## 7. Sonuç: Mimari Bir Çizim Değil, Canlı Organizma

Özetle:
* Domain ne diyorsa mimarî onu izlemeli.
* Context değişiyorsa mimari de değişmelidir.
* Kararlar context temelli olmalı.
* Mimari hem yön vermeli hem de esneyebilmelidir.

Rota olmadan teknoloji hiçbir işe yaramaz.
Doğru context doğru mimarinin pusulasıdır; mimarinin görevi yelkenleri doldurmak değil, rotayı korumaktır.
