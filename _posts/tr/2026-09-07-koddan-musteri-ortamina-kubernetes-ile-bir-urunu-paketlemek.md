---
layout: post
date: 2026-09-07
image: /assets/img/packaged-distributed-application.png
image_alt: 'Tek bir çerçevede birbirine bağlı bağımsız modülleri gösteren geometrik kapak'
permalink: /tr/2026/09/07/koddan-musteri-ortamina-kubernetes-ile-bir-urunu-paketlemek.html
title: "Koddan Müşteri Ortamına: Kubernetes ile Bir Ürünü Paketlemek"
description: "Monolitik tadında geliştirme ve tek paketle on-premise teslim: Dağıtık çalışan bir üründe sınırlar, kazanımlar, maliyetler ve tercih ölçütleri."
tags: [kubernetes, platform-engineering, developer-experience, yazılım-mimarisi, dağıtık-sistemler]
lang: tr-TR
translation_key: "koddan-musteri-ortamina-kubernetes-ile-bir-urunu-paketlemek"
published: true
---

Farklı müşterilerin kendi ortamlarına kurulacak bir uygulamada, geliştirme bütünlüğünü ve tek paketle teslim kolaylığını dağıtık çalışma yetenekleriyle birleştirmek istiyorum. Özelliklerin birbiriyle ilişkisini takip etmek, ortamı açıp çalışmaya başlamak ve geliştirdiğim şeyi tek bir ürün olarak teslim etmek benim için değerli. Çalışma anında ise her parçanın kendi ihtiyacına göre yönetilebilmesini istiyorum.

Yakın zamanda üzerinde çalıştığım bir üründe bu beklentiler aynı tasarımda buluştu. Uygulama Kubernetes üzerinde ayrı iş yükleriyle çalışıyor; müşteriye kendi ekosistemiyle birlikte tek bir kurulum paketi olarak gidiyordu.

Bu deneyimi anlatırken aklıma gelen ifade, **monolitik tadında geliştirilen ve kurulan, dağıtık çalışan bir ürün** oldu. Bu bütünlüğü korurken bileşenlerin sınırlarını da doğru çizebilirsek, geliştirme rahatlığının üzerine önemli çalışma ve işletim yetenekleri ekleyebiliyoruz. Bunun için üstlenmemiz gereken bir maliyet de var.

## Neden böyle bir yapıya ihtiyaç duydum?

Bu çalışmanın teslim modeli on-premise. Merkezi olarak işlettiğimiz ve müşterilere hesap açtığımız bir SaaS hizmetinden farklı olarak, her müşterinin kendi altyapısına kurulacak bir ürün geliştiriyoruz. Uygulama, ihtiyaç duyduğu çalışma ortamıyla birlikte müşteriye gidiyor.

Bu ortamda veritabanı, kimlik yönetimi, mesajlaşma ve izleme gibi bileşenler var. Bunların her biri uygulamanın çalışmasında bir rol üstleniyor. Her müşteri kurulumunda bu araçları yeniden seçmek, elle bağlamak ve başlangıç ayarlarını ayrı ayrı yapmak, teslimatı tekrar eden bir entegrasyon işine dönüştürebilir.

Ben kurulum bilgisini ürünün içine almak istedim. Bir müşteride hazırladığımız sistemin, başka bir müşteride de o ortama ait ayarlarla aynı tarif üzerinden kurulabilmesi gerekiyordu. Müşterinin gördüğü deneyim tek bir ürün kurulumu olmalıydı.

Çalışma ihtiyaçları ise ayrı bileşenleri anlamlı kılıyordu. Kullanıcıya cevap veren bölümle arka planda işleyen görevler aynı yük profiline sahip olmayabilir. Kimlik yönetimi veya veri saklama için açık kaynak ekosistemindeki araçlardan yararlanabiliriz. Bu parçaları birlikte teslim etmek, hepsinin aynı şekilde çalışmasını ve büyümesini gerektirmiyor.

## Geliştirirken bir bütün, teslim ederken tek paket

Monolitik uygulama geliştirmenin sevdiğim tarafı, ürünün zihnimde bir bütün olarak kalması. Projeyi açıyorum, parçaların birbiriyle ilişkisini görüyorum ve geliştirdiğim özelliği bu bütünün içinde değerlendirebiliyorum. Dağıtık çalışan bir sistemde de bu deneyimi korumak mümkün.

Burada “monolitik tadında” ifadesiyle geliştirme ve kurulum deneyimini tarif ediyorum. **Kodun organizasyonu, teslimat paketi ve çalışma topolojisi farklı tasarım kararları.** Birlikte geliştirdiğimiz ve tek paketle teslim ettiğimiz ürün, Kubernetes üzerinde ayrı süreçlerde ve gerektiğinde farklı node'larda çalışabilir.

Müşterinin gördüğü giriş noktası, temsili bir isimle şöyle:

```bash
urun install
```

Paket hedef ortama alındığında, desteklenen sunucu ön koşulları ve gerekli bağlantı bilgileri sağlandığında, bu komut bütün kurulum akışını başlatıyor. K3s ile Kubernetes hazırlanıyor; Helm üzerinden platform servisleri ve uygulama kuruluyor. Veritabanının başlangıç tanımları, uygulamanın erişim ayarları ve bileşenlerin hazır olma kontrolleri de aynı akışta ele alınıyor.

Böylece müşteri her servis için ayrı kurulum adımları yürütmüyor. Ortama ait ayarlar ayrı tutuluyor, bileşenlerin nasıl bir araya geleceğinin bilgisi paketle birlikte taşınıyor.

Bu çalışmada uygulamanın imaj üretimini de hedef ortamın içine aldım. BuildKit, uygulama imajını çalışacağı platformda üretiyor; derleme gerektiren parçalar desteklenen işlemci mimarisine uygun araç zinciri ve taban imajlarla hazırlanıyor. İmaj yerel registry olan Zot'a aktarılıp aynı platformda çalıştırılıyor. Ortama ait çalışma ayarları kurulumda uygulanırken gizli bilgiler imaja gömülmeden sağlanıyor.

Müşteri açısından kaynak koddan çalışan uygulamaya uzanan bu süreç, ürünün kurulum davranışının bir parçası oluyor.

## Bütünlük nerede bitmeli, sınırlar nerede başlamalı?

Bu yaklaşımın başarısını belirleyen nokta bence burası. Tek ürün deneyimi oluştururken her parçayı birbirinin iç yapısına bağımlı hale getirirsek, dağıtık çalışmanın getirisini azaltırız.

**Paketin sınırı ürünün sınırıdır. Bileşenlerin sorumluluk sınırları ise ayrıca tasarlanmalıdır.**

Bir bileşenin hangi veriyi yönettiği, diğerlerine hangi API veya mesaj sözleşmesiyle ulaştığı ve değiştiğinde kimleri etkilediği anlaşılır olmalı. Her bileşenin başka bir bileşenin iç tablolarını, ayrıntılı uygulama davranışını veya özel yapılandırmasını bilmesi, değişikliklerin etki alanını büyütür.

Aynı ayrım güncelleme için de geçerli. Birlikte test edilmiş bileşenleri tek ürün sürümünde paketleyebiliriz. Bu, her uygulama değişikliğinde veritabanını, kimlik servisini ve bütün platformu yeniden kurmamız gerektiği anlamına gelmez. Uyumlu değişikliklerin yalnızca ilgili bileşene uygulanabilmesini tasarlamak gerekir. Veri şeması veya servis sözleşmesi değiştiğinde ise koordinasyon ihtiyacı ayrıca ele alınır.

Ortak geliştirme ortamı, açık sorumluluk sınırlarıyla birlikte rahatlık sağlar. Aksi durumda tek paket içindeki her değişiklik, bütün ürünün yeniden değerlendirilmesini gerektiren bir işe dönüşebilir.

[Cloud-native ve monolit üzerine yazımda](/2026/04/08/monolith-vs-cloud-native-gercek-dunya-karsilastirma.html) bahsettiğim karmaşıklığın nerede yönetildiği konusu burada da belirleyici. Bütünlüğü geliştiriciye ve müşteriye sunarken, parçalar arasındaki ilişkileri platform tasarımında görünür tutmak gerekiyor.

## Karşılığında ne kazanıyoruz?

İlk kazanım, teslimatın tekrarlanabilir hale gelmesi. Yeni bir müşteri ortamına giderken hangi bileşenin önce kurulacağı ve hangi başlangıç ayarlarının uygulanacağı ürünle birlikte geliyor. Kurulumun mevcut sürüm, yapılandırma ve sağlık durumunu dikkate alması da bu deneyimin parçası. Böylece kurulum ve güncelleme, tanımlı ürün işlemleri olarak ele alınabiliyor.

İkinci kazanım, çalışma anındaki görünürlük ve müdahale esnekliği. Loglar, metrikler ve sağlık bilgileri bileşenlerle ilişkilendirildiğinde, incelemeyi ilgili noktaya yönlendirebiliyoruz. Sınırları doğru kurulmuş bir sistemde belirli bir bileşeni yeniden başlatmak, güncellemek veya kapasitesini değiştirmek mümkün oluyor. Müdahalenin etki alanını daraltarak ürünün diğer işlevlerini koruyabiliyoruz.

Bu ayrım performans yönetiminde de değerli. Yoğunlaşan bir arka plan işine daha fazla tüketici ayırabilir, istek karşılayan servisleri kendi yüklerine göre ölçekleyebiliriz. Uygun metrikler ve autoscaling politikaları tanımlandığında bu kapasite değişiklikleri otomatik yürütülebilir. Bütün ürünü aynı oranda büyütmek yerine, ihtiyaç duyulan parçayı büyütme imkânı elde ederiz.

Bu, mimarinin üzerine kurulabilen bir yetenektir. Uygulamanın paralel çalışmaya uygunluğu, veri katmanının kapasitesi ve kümenin kullanılabilir kaynakları sonucu belirler. On-premise ortamda otomatik ölçekleme de müşterinin mevcut donanım kapasitesi ve tanımlanan sınırlar içinde gerçekleşir.

Bir diğer kazanım, açık kaynak ekosisteminden daha geniş yararlanabilmek. Kimlik yönetimi, mesajlaşma veya izleme için belirli bir işi iyi yapan araçları ortak ürün düzenine dahil edebiliyoruz. Her bileşenin aynı dilde yazılması da gerekmiyor. Temsili olarak bir API .NET ile, arka plan görevi Python ile geliştirilebilir; müşteri ikisini aynı ürünün parçaları olarak kurar.

Lego benzetmesi burada anlamlı. Parçaları bir arada tutan bağlantı noktaları; servis sözleşmeleri, veri sahipliği ve sürüm uyumudur. Bunları doğru tanımladığımızda, mevcut araçların birikiminden yararlanıp kendi emeğimizi ürünün özgün işlevlerine yönlendirebiliriz.

## Bu tasarımın bir meyvesi: Aynı ortamda geliştirmek

Müşteriye kurulabilir bir ekosistem hazırladığınızda, aynı paketi geliştirme için de kurabiliyorsunuz. Benim için lokal geliştirme kolaylığı, bu teslim modelinin doğal kazanımlarından biri.

Docker Compose veya .NET ekosisteminden tanıdığımız [Aspire](https://aspire.dev/get-started/faq/) gibi araçlarla da servisleri ortak bir geliştirme deneyiminde buluşturabiliyoruz. Burada korumak istediğim özellik, müşteriye teslim edilen platformun kendi kurulum tarifiyle geliştirme ortamında da çalışması.

Aynı Kubernetes dağıtımı, aynı veritabanı, aynı mesajlaşma ve kimlik servisleri kullanılıyor. Uygulama gerçek bileşenlerle iletişim kuruyor; geliştirme için onların yerine muadil araçlar koymuyorum. Arka plan görevini yazarken ürünün mesajlaşma servisine, giriş akışını geliştirirken ürünün kimlik servisine bağlanıyorum.

Bu anlamda üretim ortamının ayrı bir örneğinde geliştirme yapıyorum. Müşterinin canlı sisteminden ve verilerinden ayrı olan bu ortam, yerel bir sanal makinede veya geliştirme sunucularında kurulabilir. Donanım kapasitesi, node sayısı ve ortam ayarları değişse de kullanılan bileşenler ve çalışma tarifi korunur. Performans ve yüksek erişilebilirlik değerlendirmeleri için ise hedef kapasiteye uygun testler gerekir.

**Ürünü çalışacağı ekosistemin içinde geliştirebilmek, teslimata hazırlanırken taşıdığımız belirsizliklerden bir bölümünü daha erken ele almamızı sağlıyor.**

## Bu rahatlığın bedelini nerede ödüyoruz?

Müşterinin tek komutla kurulum yapabilmesi için o komutun arkasındaki işleri bizim tasarlamamız gerekiyor. Bileşenlerin sürüm uyumu, başlangıç sırası, erişim kuralları ve veri ilişkileri ürünün bakım kapsamına giriyor. Açık kaynak araçların güncellemelerini ve güvenlik düzeltmelerini de bu bütün içinde değerlendirmeliyiz.

Kurulum, yaşam döngüsünün başlangıcı. Yedekleme ve geri yükleme, veri şeması geçişleri, uygulama güncellemeleri ve destek süreçleri ayrıca tasarlanmalı. Bunların sorumluluğunun ürün ekibi ile müşteri arasında nasıl paylaşılacağı da açık olmalı. Tek kurulum, tek başına kolay işletim garantisi vermiyor.

On-premise teslimatta farklı müşteriler farklı sürümlerde kalabilir. Ağ erişimi, sertifika düzeni, depolama ve donanım kapasitesi değişebilir. Desteklenen ortamların sınırını tanımlamak ve güncelleme yollarını doğrulamak için sürekli emek gerekiyor.

Çevrimdışı kurulum üzerinde çalışırken de bu teslim sorumluluğu belirginleşti. Gerekli imajları ve build bağımlılıklarını önceden hazırlamak, paket bütünlüğünü kontrol etmek ve hedef platformun ön koşullarını belirlemek gerekiyor. İnternet erişimi kısıtlı ortamlara teslim imkânı kazanırken, dağıtım paketinin hazırlanmasına daha fazla sorumluluk ekliyoruz.

Kaynak maliyeti de var. Küçük bir uygulamanın yanında bütün bir platform çalıştırmak; bellek, disk ve işletim bilgisi gerektiriyor. Hedef ortamda imaj üretmeyi seçiyorsak build işlemlerinin kapasitesini ve yetkilerini de hesaba katmalıyız. Geliştirme ve kurulumdaki sadeliğin karşılığında, platform mühendisliğine yatırım yapıyoruz.

## Ne zaman tercih ederim, ne zaman etmem?

Bu yaklaşımı, farklı müşterilerin kendi altyapılarına tekrar tekrar kurulacak ve zaman içinde geliştirilecek ürünlerde değerlendiririm. Birden fazla çalışma ihtiyacı olan bileşenler, kısmi müdahale veya ayrı ölçekleme gereksinimi ve açık kaynak servislerden yararlanma isteği varsa, kurulum ekosistemini ürünleştirmek anlamlı hale gelir.

Ekibin bu platformu sürdürebilmesi de kararın parçası. Kurulum tarifini bir kez hazırlamak yeterli olmaz; sürümler, güvenlik güncellemeleri ve müşteri ortamlarıyla birlikte yaşatabilmek gerekir.

| Bu yaklaşımı güçlendiren ihtiyaç | Daha sade bir çözümü öne çıkaran durum |
| --- | --- |
| Farklı müşteri ortamlarına tekrarlanan kurulum | Az bağımlılıkla karşılanabilen sınırlı kurulum ihtiyacı |
| Bileşenlere ayrı kapasite ve müdahale gereksinimi | Tek süreç veya birkaç container ile yeterli işletim |
| Ortak platformu sürdürebilecek ekip ve ürün ömrü | Platform bakım maliyetini karşılamayan kapsam ve ekip kapasitesi |
| Tanımlanabilir, desteklenebilir hedef ortamlar | Ürünün kaynak ihtiyacını karşılamayan müşteri altyapısı |

Müşterinin zaten standartlaştırılmış bir Kubernetes platformu varsa, kendi kümemi de pakete dahil etme kararını yeniden değerlendiririm. O durumda uygulama ve bağımlılıklarını mevcut platforma uyarlamak daha uygun olabilir. Merkezi bir SaaS teslim modelinde de müşteri başına kurulum ihtiyacı aynı olmadığı için bu paketleme yatırımının gerekçesi değişir.

Benim için tercih ölçütü, ürünün nasıl teslim edileceği ve yıllar içinde nasıl işletileceği. Tek ürün deneyimini korurken parçaların çalışma özgürlüğünü anlamlı biçimde kullanabiliyorsak, bu tasarım güçlü bir karşılık veriyor.

Geliştirme ve danışmanlık çalışmalarında değer ürettiğim alanlardan biri de bu kararları birlikte ele almak: geliştiricinin ürünü anlayabilmesi, müşterinin kurabilmesi ve operasyon ekibinin yönetebilmesi. Bu üçünü aynı tasarımda buluşturmak, uygulamayı sürdürülebilir biçimde teslim edilebilir bir ürüne dönüştürüyor.
