---
layout: post
title: "Bir Platformu Baştan Tasarlarken Öğrendiğim 8 Ders"
categories: Architecture
mermaid: true
---

Bir platformu sıfırdan tasarlamak, insana sadece teknik değil, düşünsel anlamda da çok şey öğretiyor. Aşağıdaki maddeler, bu süreç boyunca gerçekten yaşayarak edindiğim ve bugün hâlâ işimi şekillendiren en değerli dersler.

<img src="/assets/img/sdasvfdw.png" alt="cover" style="max-width: 50%; max-height:10%">



## **1. En Baştaki Soru: Aslında Ne Yapmaya Çalışıyoruz?**

Geçmişte yaptığım en büyük hatalardan biri, projeye **teknolojiyi seçerek** başlamak olmuştu. Oysa önce yanıtlanması gereken sorular çok daha basitmiş:

* Bu sistemde tutarlılık ne kadar kritik?
* Erişilebilirlik hangi seviyede olmalı?
* Hangi adımlarda gecikme tolere edilebilir?
* Hangi alanlar anlık doğru veri gerektiriyor?

Bu sorular netleştiğinde teknoloji kararı da, mimari şekli de kendiliğinden ortaya çıkıyor.



## **2. Kod Yazmaya Değil, Alanları Ayırmaya Başlamak Gerek**

Başlarda doğrudan kod yazmaya odaklanıyordum. Zamanla anladım ki esas mesele kod değil, **anlamı doğru bölmek**.

Platformu anlamlı parçalara böldüğünde:

* ekip rahatça paralel çalışıyor,
* karmaşıklık azalıyor,
* sorumluluk sınırları netleşiyor.

Önce şunu çözmek gerekiyor: “Hangi iş, hangi alana ait?”



## **3. Asenkron Akış Gerçek Performansın Temeli**

Senkron çağrılar (örneğin REST), trafik arttığında kırılgan bir hale geliyor. Bir servis geciktiğinde tüm zincir bundan etkileniyor.

Asenkron yapıda ise akış çok daha sağlıklı işliyor:

* servis görevini tamamlar,
* bir event üretir,
* diğer servisler uygun olduğunda o event’i işler.

Bu model hem hızlı hem dayanıklı bir yapı sunuyor.



## **4. Hataları Gizlemek Değil, Yönetmek Gerek**

Bir dönem hataların görünmemesini “başarı” sanıyordum. Yanılmışım.

> Saklanan her hata, günün birinde daha büyük bir şekilde geri dönüyor.

Bu yüzden sağlam bir mimaride üç temel yapı şart:

* **idempotency:** aynı event tekrar gelse de sonuç değişmemeli
* **retry:** geçici sorunlar mutlaka tekrar denenmeli
* **DLQ:** çözülemeyen event’ler ayrı bir kuyruğa alınmalı

Hata gizlenmez; **yönetilir, izlenir, sınıflandırılır.**



## **5. Kuralları Koda Gömersen, Her Değişiklik Bir İşkenceye Döner**

Platform büyüdükçe gördüm ki:

* müşteri kuralları değişiyor,
* ülke kuralları değişiyor,
* formatlar değişiyor,
* süreçler evriliyor.

Bu kurallar koda gömülü olduğunda:

* her değişiklik deploy gerektiriyor,
* varyasyonlar artıyor,
* süreçler kırılganlaşıyor.

Doğru yaklaşım basit:

> **“Kural config’te, davranış kodda olmalı.”**

Böyle olunca platform esnekleşiyor ve yönetmesi çok daha kolay oluyor.



## **6. Her Şeyi Sıfırdan Yazmak Kahramanlık Değil, Teknik Borç**

Başlarda “en iyisini ben yazarım” yaklaşımındaydım. Sonra fark ettim ki:

* her problemi kendin çözemezsin,
* çözsen bile sürdürülebilir olmaz,
* zaten mükemmel çözümler yıllardır var.

Doğru soru şuymuş:

> “Bu sorunu çözmek için en iyi açık kaynak veya yerleşik araç hangisi?”

Kafka, Redis, Postgres, S3, NATS, XSLT, OpenSearch… Her biri bir alanın uzmanı. Doğru aracı seçmek, platformu hem sağlamlaştırıyor hem hız kazandırıyor.



## **7. Ekip Ne Yapabiliyor? Mimari Karar Kadar Önemli**

Mükemmel mimari, ancak ekibin taşıyabildiği mimaridir.

Bu nedenle artık şunlara daha çok dikkat ediyorum:

* ekip hangi dili iyi biliyor?
* hangi araçlarla daha rahat çalışıyorlar?
* bilgi birikimleri sürdürülebilir mi?
* öğrenme eğrisi ne kadar yüksek?

Teknik seçim kadar ekip uyumu da platformun uzun ömürlü olmasını sağlıyor.



## **8. Bir Aracı Eleştirmek Kolay; Onun Kültürünü Anlamak Değerli**

Her aracın bir çalışma kültürü, bir dünya görüşü var.

Kafka’yı RabbitMQ gibi, Redis’i Postgres gibi kullanmaya kalkarsanız doğal olarak sorun yaşarsınız.

O yüzden artık önce şunu soruyorum:

* “Bu araç neden böyle çalışıyor?”
* “Hangi problemi çözmek için tasarlanmış?”
* “Hangi durumda uygun, hangi durumda değil?”

Bir aracı anlamadan eleştirmek, yanlış mimari kararların en hızlı yoludur.



# **Sonuç**

Bu süreç bana sekiz önemli gerçeği öğretti:

* Önce doğru soruyu sor,
* İş alanlarını netleştir,
* Asenkron düşün,
* Hataları yönet,
* Kuralları koddan çıkar,
* Ekosistemi kullan,
* Ekibe göre tasarla,
* Kullandığın aracın kültürünü öğren.

Platform tasarlamak; teknoloji seçmekten çok, **doğru kararları doğru zamanda verebilmek** demek.
