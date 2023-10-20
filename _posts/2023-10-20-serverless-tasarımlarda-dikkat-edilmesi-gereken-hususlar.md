---
layout: post
title: "Serverless Bir Mimari Hazırlarken Dikkat Etmeniz Gereken Önemli Noktalar"
categories: javascript
---

![image](https://github.com/fmarslan/fmarslan.github.io/assets/12278069/d97da58d-cfb2-4878-aecb-71f9fdf85b50)
*Görsel [Bing Görüntü Oluşturucu](https://www.bing.com/images/create) ile hazırlanmıştır*

Mikro servisler, yazılım geliştirme dünyasında giderek daha fazla popülerlik kazanıyor. Büyük monolitik uygulamaların yerine, daha küçük ve bağımsız hizmetlerin bir araya getirildiği bu yaklaşım, geliştirme süreçlerini hızlandırabilir ve ölçeklenebilirliği artırabilir. Özellikle FaaS ile desteklendiğinde çok başarılı sonuçlara ulaşılabilir. Ancak, serverless mimarisi başarıyla uygulanırken dikkat edilmesi gereken bir dizi önemli nokta vardır. Bu blog yazısında, serverless mimarinizi hazırlarken dikkate almanız gereken temel konuları ele alacağız. Öncelikle serverless bir mimaride yaşayabileceğiniz potansiyel sorunları düşünecek olursak:

- Versionlama, uyumluluk dpeloyment süreçleri karmaşıktır.
- İş bütünlüğünü sağlamak zordur.
- İyi planlanmamış bir mikro servis ciddi maliyetler getirebilir.
- Döküman, developer, hazır tasarımlar bulma konusunda sıkıntılar fazladır.
- Sağlıklı bir izleme yapabilmek için çok daha fazla kaynak gerekir, eğer sağlıklı olarak izlenmez ise gece karanlıkta ışıksız yola gitmeye benzer.
- Tasarım hataları kodlamayı aşırı karmaşık hale getirebilir.
- Çok fazla kod tekrarı yapmanız gerekebilir.
- Kaynak tüketimini artırabilir.

Bu sorunların genellikle hatalı tasarımlarda yüzleşeceğiniz sorunlardır. Bunları en aza indirmek veya yaşamamak için aşağıdaki başlıklara dikkat etmemiz gerekmektedir.


  1. İyi Bir Tasarım Yapın
  Mikro servislerinizi oluşturmadan önce iyi bir tasarım yapmak, başarılı bir uygulama geliştirmenin ilk adımıdır. Servislerinizin sınırları net olmalı, bağımsız çalışabilmeli ve gerektiğinde kolayca değiştirilebilmelidir. API tasarımı da büyük önem taşır; RESTful API'ler veya GraphQL gibi standartlara uymak, servislerinizin daha kolay anlaşılabilir ve kullanılabilir olmasını sağlar.
  
  2. İyi Bir İletişim Altyapısı Kullanın
  Mikro servislerin iletişim altyapısı, tüm sistemlerinizin sorunsuz bir şekilde birbirleriyle iletişim kurabilmesi için kritik öneme sahiptir. RESTful HTTP API'ler, gRPC veya diğer uygun protokoller kullanarak servisler arasında iletişimi sağlamalısınız. Ayrıca, hata işleme ve güvenlik konularını da göz önünde bulundurmalısınız.
  
  3. İzleme ve Günlükleme (Logging) Yapın
  Her bir mikro servis, performans, hata izleme ve günlükleme açısından izlenmelidir. Uygulamanızdaki sorunları tespit etmek ve hızlı bir şekilde çözmek için uygun araçları kullanmalısınız. Bu sayede hataların izlenmesi, sorunların belirlenmesi ve servislerin performansının optimize edilmesi daha kolay olur.
  
  4. Güvenliği Unutmayın
  Mikro servislerinizi oluştururken güvenliği göz ardı etmemelisiniz. Her servisin kendi kimlik doğrulama ve yetkilendirme mekanizmalarını kullanması gerekebilir. Ayrıca, güvenli iletişim ve veri şifreleme gibi güvenlik önlemleri de alınmalıdır.
  
  5. Sürüm Kontrolünü İyi Yapın
  Mikro servislerinizi sürüm kontrolü altında tutmak, değişikliklerin takip edilmesini ve uyumsuzlukların önlenmesini sağlar. Her servis için ayrı sürüm numaraları kullanarak, güncelleme ve geriye dönük uyumluluk konularını yönetmelisiniz.
  
  6. Otomasyon Kullanın
  Otomasyon, mikro servislerinizi dağıtma, ölçeklendirme ve hata yönetimi süreçlerini kolaylaştırır. DevOps uygulamaları ve konteyner teknolojileri gibi araçları kullanarak otomasyonu entegre etmelisiniz.
  
  7. Teknoloji Yığınını İyi Seçin
  Servislerinizi geliştirirken kullanacağınız teknoloji yığını, projenizin ihtiyaçlarına ve ekibinizin uzmanlık seviyesine uygun olmalıdır. Her servis için aynı teknolojiyi kullanmak zorunda değilsiniz, ancak farklı teknolojilerin birbiriyle uyumlu çalışabilmesi önemlidir.

  8. İş Sürekliliği ve Yedekleme Stratejileri Geliştirin
  Mikro servislerinizi oluştururken, iş sürekliliği ve yedekleme stratejilerinizi iyi planlamalısınız. Servislerin herhangi birinin çökmesi durumunda sistemde kesinti yaşanmaması için bu konulara dikkat etmelisiniz.

Serverless ve FaaS konusuna gelecek olursak, FaaS veya serverless, mikro servislerin uygulanmasında önemli bir rol oynar. Bu yaklaşım, işlevleri küçük, bağımsız hizmetler olarak çalıştırmanıza olanak tanır. İşlevler, olay tetikleyicileri (trigger) tarafından başlatılır ve bu sayede sadece kullanıldıklarında kaynak tüketirler. FaaS hizmetleri, bulut sağlayıcıları tarafından sunulur ve yönetilir. İşte FaaS'ın mikro servislerle nasıl ilişkilendirildiği ve dikkate alınması gereken bazı hususlar:

   - İşlevlerin Küçük ve Bağımsız Olması: FaaS, çok küçük ve belirli görevler için tasarlanmıştır. İşlevler, tek bir işlemi gerçekleştirmeli ve diğer servislerle minimum bağımlılığa sahip olmalıdır.

   - Olay Tetikleyicileri: FaaS işlevleri, belirli olaylar gerçekleştiğinde çalıştırılır. Bu olaylar, HTTP istekleri, veritabanı güncellemeleri, zamanlayıcılar vb. gibi farklı kaynaklardan gelebilir.

   - Otomatik Ölçeklendirme: FaaS hizmetleri, talebe göre otomatik olarak ölçeklendirilir. Bu, trafik arttığında veya azaldığında kaynakların verimli bir şekilde kullanılmasını sağlar.

   - Ölçüm ve Maliyet Kontrolü: FaaS kullanımı, işlevlerin çalışma süreleri ve kullanılan kaynaklar üzerinden ücretlendirilir. Dolayısıyla, işlevlerinizi optimize ederek maliyetleri kontrol altında tutmalısınız.

   - Güvenlik: FaaS hizmetleri, güvenlik önlemleri gerektirir. İşlevlerin yetkilendirme ve kimlik doğrulama mekanizmalarını dikkatlice konfigüre etmelisiniz.

   - Lojistik ve Dağıtım: FaaS işlevlerinizi dağıtırken, işlemi kolaylaştıran otomasyon araçları ve dağıtım yöntemleri kullanmalısınız.

   - Monitöring ve İzleme: FaaS işlevlerinizin performansını izlemeli, hata günlüklerini ve metrikleri takip etmelisiniz. Bu, sorunları tespit etmek ve iyileştirmeler yapmak için gereklidir.

FaaS veya serverless yaklaşımı, mikro servislerle bir araya geldiğinde, ölçeklenebilirlik ve hızlı dağıtım avantajları sunar. Ancak, her iki yaklaşımın da benzersiz gereksinimleri ve sorumlulukları vardır, bu nedenle her ikisini birleştirirken dikkat etmeniz gereken önemli ayrıntıları göz önünde bulundurmalısınız.

Sonuç
Serverless mimari, yazılım geliştirme süreçlerini hızlandırabilir ve daha ölçeklenebilir uygulamalar oluşturmanıza yardımcı olabilir. Ancak, bu yaklaşımı başarıyla uygulamak için yukarıdaki önemli noktalara dikkat etmek çok önemlidir. İyi bir tasarım, güvenlik, izleme, otomasyon ve diğer konuları göz önünde bulundurarak, serverless mimarinizi başarılı bir şekilde hazırlayabilirsiniz.
