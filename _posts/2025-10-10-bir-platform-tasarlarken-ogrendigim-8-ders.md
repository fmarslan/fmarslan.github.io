---
layout: post
title: "Bir Platformu Baştan Tasarlarken Öğrendiğim 8 Ders"
categories: Architecture
mermaid: true
---

Bir platformu sıfırdan kurmak, insana hem teknik hem zihinsel olarak çok şey öğretiyor.
Aşağıdaki maddeler, bu süreçte gerçekten yaşayarak öğrendiğim en değerli dersler oldu.

<img src="/assets/img/sdasvfdw.png" alt="cover" style="max-width: 50%; max-height:10%">


---

## **1. En Başta Sorulması Gereken Soru: Aslında Ne Yapmaya Çalışıyoruz?**

Her projede yaptığım ilk hata şu olmuş:

> “Teknolojiyi seçip işe girişmek.”

Meğer önce sormam gereken şey çok basitmiş:

* Bu sistemde tutarlılık mı önemli?
* Yoksa erişilebilirlik mi?
* Hangi noktada ne kadar gecikme tolere edilebilir?
* Hangi bölüm kesin doğru veri istemeli?

Bu soruları netleştirince mimari zaten kendiliğinden şekilleniyor.

---

## **2. Kod Yazmaya Değil, Alanları Ayırmaya Başlamak Lazım**

Eskiden direkt kod yazmaya başlıyordum.
Sonra fark ettim ki asıl iş kod değil, **anlamı bölmek**.

Platformu küçük anlamlı parçalara böldüğünde:

* her şey daha anlaşılır oluyor
* ekip paralel çalışabiliyor
* karmaşıklık azalıyor

Yani önce “hangi iş hangi alana ait?” sorusunu çözmek lazım.

---

## **3. Asenkron Akış, Gerçek Performansın Temeli**

Senkron çağrılar (REST gibi) yük arttıkça kırılgan oluyor.
Bir servis takılıyor → hepsi tıkanıyor.

Asenkron yapıda ise işler şöyle ilerliyor:

* servis çalışır
* event üretir
* diğer servisler uygun olduğunda o event’i işler

Bu yapı hem daha hızlı hem daha dayanıklı.

---

## **4. Hataları Gizlemek Değil, Yönetmek Gerek**

Eskiden hataları azaltmaya değil, görünmez kılmaya çalışıyordum.
Büyük hata.

Gerçek şu:

> “Sistemde sakladığın her hata, daha sonra patlayıp seni uğraştırıyor.”

O yüzden 3 şey şart:

* **idempotency:** aynı event iki kez gelse bile sorun olmamalı
* **retry:** geçici hataları tekrar denemek lazım
* **DLQ:** düzelmeyenleri özel bir kuyruğa ayırmak zorunlu

Hata saklanmaz; **takip edilir ve yönetilir.**

---

## **5. Kuralları Koda Gömersen, Her Değişiklik İşkenceye Dönüşür**

Platformu geliştirdikçe şunu fark ettim:

* müşteri kuralları değişiyor
* ülke kuralları değişiyor
* formatlar değişiyor
* workflow değişiyor

Ama bunlar **kod içinde gömülü** olunca:

* her değişiklik → yeni deploy
* her varyasyon → karmaşa
* her müşteri → özel case
* süreçler -> kırılgan

Doğru olan şu:

> “Kural = config, davranış = kod.”

Böyle olunca platform daha esnek, daha yönetilebilir oluyor.

---

## **6. Her Şeyi Sıfırdan Yazmak Kahramanlık Değil, Teknik Borç**

Zamanla fark ettim ki:

* her problemi kendim çözemem
* çözersem de sürdürülebilir olmaz
* bazı araçlar zaten yılların emeği

O yüzden şöyle düşünmeye başladım:

> “Bu sorunu çözmek için zaten var olan en iyi araç hangisi?”

Kafka’yı, Redis’i, Postgres’i, S3’ü, XSLT’yi, NATS’i, OpenSearch’ü…
Her birinin güçlü bir alanı var.

Ecosystem’i kullanmak hız kazandırıyor, kaliteyi artırıyor.

---

## **7. Ekip Ne Yapabiliyor? Bu Soru Mimari Kadar Önemli**

En mükemmel mimari, ekibin taşıyabildiği mimaridir.

Bu yüzden artık şunlara daha çok bakıyorum:

* ekip hangi dili iyi biliyor?
* hangi araçlar onlar için daha doğal?
* destek verebilecek bilgi birikimi var mı?
* öğrenme eğrisi ne kadar?

Mimarinin sürdürülebilir olmasını sağlayan şey ekip uyumu.

---

## **8. Bir Aracı Eleştirmek Kolay, Ama Onun Kültürünü Öğrenmek Daha Değerli**

Her aracın bir çalışma tarzı, bir felsefesi var.

Kafka’yı RabbitMQ gibi, Redis’i Postgres gibi kullanmaya kalkarsan sorun yaşarsın.

O yüzden:

> “Araç neden böyle tasarlanmış?”
> “Hangi problem için yapılmış?”
> “Hangi durumda doğru, hangi durumda yanlış?”

bunları bilmek çok önemli.

Araçları anlamadan eleştirmek, kötü bir mimari seçim yapmanın en hızlı yolu.

---

# **Sonuç**

Bu süreçte şu 8 şeyin çok değerli olduğunu öğrendim:

* Önce doğru soruyu sor
* İş alanlarını ayır
* Asenkron akışla düşün
* Hataları saklama, yönet
* Kuralları koddan çıkar
* Ekosistemi kullan, her şeyi yazmaya çalışma
* Ekibin gücünü dikkate al
* Kullandığın aracın kültürünü öğren

Platform tasarlamak aslında teknoloji seçmek değil;
**doğru kararları zamanında verebilme yeteneğini geliştirmek.**
