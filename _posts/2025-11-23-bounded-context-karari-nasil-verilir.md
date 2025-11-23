---
layout: post
title: "Servisleri Parçalamak mı, Birleştirmek mi? Bounded Context Rehberim"
date: 2025-11-23 09:00:00 +0300
description: Servis sınırlarını belirlerken domain dilinden kopmadan nasıl karar verdiğimi günlük deneyimlerle anlattım.
image: /assets/img/bounded-context-abstract.png
tags:
  - architecture
  - domain-driven-design
  - microservices
---

Yeni bir platform tasarlarken en sık aldığım soru şu oluyor: **“Bu servisi ayrı mı yapalım, yoksa mevcut servise mi ekleyelim?”**  
Kimse artık mikroservis güzellemesi dinlemek istemiyor; herkes net, gerçek hayatta işe yarayan cevap arıyor.

Benim cevabım bugün çok net:  
**“Bu karar kodla değil, bounded context ile verilir.”**

Aşağıdaki notlar, gerçek projelerde tökezleye tökezleye öğrendiğim ve artık her mimari kararımda rehber gibi kullandığım yaklaşımların bir özeti.

## 1. Servis Parçalamak Mimari Değil, Domain Kararıdır

Eskiden “servis ne kadar küçükse o kadar iyidir” diye inanıyordum.  
Sonra gördüm ki yanlış yerden bölünmüş bir servis, hiç bölünmemiş bir monolitten çok daha fazla zarar veriyor.

Çünkü servis sınırı klasör yapısına bakarak değil, **domain’in anlamlı sınırlarına** bakarak çizilir.

<div class="mermaid">
flowchart TD
    Platform --> DogruContext
    Platform --> YanlisContext
    DogruContext --> TemizSinirlar
    YanlisContext --> Karmasa
</div>

Yanlış context’e sıkışmış servisler hem kodu, hem operasyonu, hem ekibi aynı anda yoruyor.


## 2. "Bu Veri Hangi Anlamda Yaşıyor?" Sorusu Her Şeyi Aydınlatıyor

Bounded context dediğimiz şey aslında çok basit bir sorunun cevabıdır:  
**“Bu bilgi hangi alanda, hangi anlamda yaşıyor?”**

Aynı kavram üç farklı context’te üç farklı kimliğe bürünebiliyor:

- **Finance** context’inde `invoice` → mali kayıt  
- **Logistics** context’inde `invoice` → sevkiyat tetikleyicisi  
- **CRM** context’inde `invoice` → müşteri davranışı

Bu yüzden tek bir “invoice servisi” genelde göründüğü kadar masum değil.


## 3. Servisi Bölmem Gerektiğini Bana Haber Veren İşaretler

Aşağıdaki belirtiler ortaya çıkıyorsa, servis sınırını kaçırmışım demektir:

1. Tek serviste mapping + validation + billing gibi **üç farklı iş akışı** dönüyorsa  
2. Yeni müşteri kuralları **if/else ormanına** dönüşüyorsa  
3. Kodun bir bölümü değiştiğinde hiç alakası olmayan başka bir yer kırılıyorsa  
4. Operasyon ekibi sürekli “Bu iş hangi serviste?” diye soruyorsa  

Bu işaretler geldiğinde servisleri bıçak kesiği gibi ayırıyorum.


## 4. Servisi Bölmemen Gerektiğini Bağıran Durumlar

Bazen servisleri parçalamak gerçekten gereksiz yük getirir.  
Aşağıdaki durumlarda servis tek parça bırakılmalıdır:

- Veri modeli **tek kaynaktan** besleniyorsa, iki servise bölmek sadece veri taşıma trafiği yaratır  
- İş akışı **tek nefes** gibi akıyorsa, bölmek akışı yapay şekilde dağıtır  
- Kod zaten okunabilir ve küçükse, “mikro olsun” diye bölmeye gerek yok  
- Parçalamak gereksiz yere ağ çağrısı, tracing ve gözlemleme maliyeti yaratıyorsa  

Her bölme doğru değildir. Bazen birleşik yapı daha sağlıklıdır.

<figure>
  <img src="/assets/img/bounded-context-abstract.png" alt="Bounded context soyut kapak" loading="lazy">
  <figcaption>Her renk farklı bir bounded context’i temsil ediyor. Renkler karışınca sorun başlıyor.</figcaption>
</figure>


## 5. Gerçek Sahip Kim? (En Kritik Soru)

Bir servisin sahibi başka bir servis değildir.  
**Gerçek sahip context’in ta kendisidir.**

Örnek:

- Party → Identity context  
- Invoice → Finance context  
- Mapping → Transformation context  
- Routing → Integration context  

Eğer bir kavramın anlamı context’e göre değişiyorsa, o yapıyı tek servise sıkıştırmak ileride kaçınılmaz olarak sorun çıkarır.

## 6. Bağımlılık Akışını Çizmeden Karar Vermem

Basit bir akış şeması bile servislerin gerçekten nasıl konuştuğunu gözler önüne seriyor:

<div class="mermaid">
flowchart LR
    Collect --> Prepare
    Prepare --> Validate
    Validate --> Map
    Map --> Send
</div>

Bu akışın adımları farklı context’lere aitse → parçalamak doğrudur.  
Aynı anlam kümesine aitse → tek servis kalmalıdır.


## 7. "Ne Kadar Küçük?" Değil → "Ne Kadar Anlamlı?"

Bu benim için dönüm noktası oldu.  
Eskiden servisi küçülttükçe doğruya yaklaştığımı sanıyordum.

Artık biliyorum ki:

> **Servisin boyutu değil, anlamlı bir sınır içinde olup olmaması önemlidir.**

Bazen anlamlı sınır büyük bir servis çıkarır,  
bazen de küçücük bir servis bütün işi çözer.

<div class="mermaid">
flowchart LR
    Monolith --> GereksizParcalama
    GereksizParcalama --> LatencyArtisi
    GereksizParcalama --> OperasyonMaliyeti
    GereksizParcalama --> BaglilikKarmasasi
</div>

Yanlış yerden parçalamak, teknik borcun en hızlı yoludur.


## 8. Karar Vermeden Önce Kendime Sorduğum 6 Soru

Bu sorular beni %90 doğru karara götürüyor:

1. Bu iş gerçekten **ayrı bir yaşam döngüsüne** sahip mi?  
2. Veri modeli diğerlerinden **bağımsız** mı?  
3. Bir değişiklik olduğunda **kim etkileniyor?**  
4. Bu iş akışı kendi başına **anlamlı** mı?  
5. Ayırınca aradaki **trafik artıyor mu azalıyor mu?**  
6. Ekibin bu ayrımı **operasyonel olarak taşıma kapasitesi** var mı?

Cevapların çoğu “evet” ise ayırıyorum.  
Çoğu “hayır” ise tek servis olarak bırakıyorum.


## 9. Mikroservis Bir Çıktı, Bounded Context Bir Karardır

Benim için işin özeti şu:

- Mikroservis → ortaya çıkan sonuçtur  
- Bounded context → verilmesi gereken karardır  

Önce doğru context sınırlarını çiz, gerisi zaten kendiliğinden yerine oturuyor.

Yanlış olan: her fonksiyona bir servis açmak.  
Yanlış olan: tek servise bütün fonksiyonları doldurmak.

Doğru olan: **domain’in doğal sınırlarını takip etmek.**


## 10. Parçalamak Cesaret, Birleştirmek Bilgelik

Servis sınırını belirlemek bir denge sanatı.  
Benim rehber maddelerim şöyle:

- Gerçek sınırlar domain’den gelir  
- Anlamlı sınırlar ekip verimliliğini artırır  
- Gereksiz mikroservis → karmaşa  
- Gereksiz birleşim → ileride patlayan sorunlar  
- Parçalamak cesaret ister  
- Ama birleştimek çoğu zaman daha **bilgece** bir karardır  

Son söz:

> **Servisleri bölmek bir karar değil, domain’i keşfetme sürecidir.  
> Domain’i anladığında servisler zaten kendiliğinden doğru şekli alıyor.**
