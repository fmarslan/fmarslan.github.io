---
layout: post
title: "Yazılım Sektörü Nereye Gidiyor ?"
categories: yazilim
---

Bu yazımda yazılım sektörü ile alakalı naçizane kendi düşüncelerimi paylaşmak istedim farklı görüşü düşüncesi olan kişiler olabilir paylaşırlar ise onlardan da faydalanmak isterim. 

Bence önce geçmişe gidip yaşananları edinilen tecrübeleri gözlemlemekte yarar var. Bu kapsamda 2000 başlarına gidersek **ASP**, **PHP**, **JSP** gibi Front-End ile Back-End tarafının birlikte geliştirildiği doğrudan sunucuda html render işlemlerinin yapıldığı yaklaşımlar vardı, Bu yaklaşımlar da büyük projeler yapıldı mesela **PHP** için WordPress buna güzel bir örnek bence, çünkü hala beğeneni veya beğenmeyeni tarafından iyisiyle kötüsüyle kullanılıyor. Her ne kadar **PHP** için aynı şey çok geçerli olmasada **JSP**, **ASP** artık öldü bayağı da zaman geçti üzerinden. Bu yaklaşımlarda Back-End Front-End iç içe geliştirilir genellikle full stack developer denilen JavaScript, CSS'ten tutun Back-End tarafına tum teknolojilere hakim developer ihtiyacı oluşurdu,  bu da development işini bayağı zorlaştırıyordu çünkü birincisi developerların tüm aşamaları bilmesi lazım ki optimum çözümler üretilebilen uygulamalar ortaya çıksın, bu şekilde bir insandan herşeyi bilmesini beklemekte pek mümkün olmuyordu çünkü herkesin ilgisi, bilgisi farklı noktalarda olduğundan yine yapay bir Front-End Back-End ayrımı yapılmaya çalışılıyordu. Ayrıca burada yaşanan büyük projelerde yönetim zorluklarını development yükünü azaltabilmek için **JSF**, **ASP Web Form** gibi Front-End tarafının otomatik oluşturulmaya çalışıldığı sadece Back-End yazarak belki birazda html bilerek Javascript CSS ile fazla uğraşmadan yapılan geliştirmelerin olduğu bir dönem başladı bu dönemde Front-end te ki CSS, Javascript yükünü development üzerinden almak ve OOP ile yönetimi daha kolay hale getirmek amaçlanmış ve başarılmıştır. Fakat bi sorun beraberinde geldi, bu yaklaşımda arayüz tarafında ciddi kısıtlamalar yaşanmaya başlandı, en ufak işlemler icin bile yorucu yöntemlere ihtiyaç vardı bunu en iyi çözen frameworkler başarılı oldu. Bir diğer olay da sunucu üzerinde render işlemlerinin yapılması ve OOP yaklaşımları ciddi kaynak tüketimlerini beraberinde getirdi bu da tabiki maliyet demek bundan dolayı yeni yöntemlere dönük arayışlar başladı. Mesela bu dönemin ilerleyen zamanlarında çıkan **GWT** bence bunu amaçladı ama çok karmaşıktı **VAADIN** ile de bunu kolaylaştırma hedeflendi  fakat bu da kısıtlamaları daha da derinleştirdi. **MVC** yaklaşımı da bunun üzerine oluştuğu kanaatindeyim ki ben **MVC** ye geçince en çok mutlu olduğum nokta daha az sunucu kaynağı ve daha esnek bir development sağlamış, bunu sağlarken Proje yönetimini kolaylaştıran OOP den taviz verilmemiş olmasıydı.  Bu dönemde Front-End için de birçok işlemi kolaylaştırmak adına **jQuery** gibi javascript frameworkler ortalıkta yayılmaya başladı, güzelde is yaptılar. Bunlar sayesinde çok hızlı Front-end geliştirmeleri yapılabiliyordu. 

Tabiki bunun ömrü de sınırlı oldu çünkü insanlar artık sunucu maliyetlerinden sıkılmaya ve daha ekonomik çözümler için arayışlar içine girmeye başlamışlardı. Tam bu aşama da **Angular** **React** gibi client based uygulamalar çıktı ve bunlar sayesinde Back-End sunucularda html render işlemleri ortadan kalktı bu da maliyet olarak kazanç anlamına geliyordu. Bu yaklaşımın backend ve front end tarafını tamamen ayırmış olması Back-End tarafında servis based yaklaşımların artmasına sebep oldu diğer yandan client bilgisayarların kaynaklarına bağımlı olduğumuz için kullanıcının bilgisayar performansı bizim uygulama performansımızı etkiliyor ve uygulama çok yavaş şeklinde şikayetler alınıyordu. Aynı zamanda bu kullanıcı tarafında yazılımsal standardında sağlanmasını zorunlu kılıyordu mesela firefox için yaptığımız bir uygulama internet explorer da çalışmıyordu. Zaman içinde tarayıcılarda bir standartlaşma sağlandı günümüzde tek bir uygulama %80-90 oranında tüm tarayıcılarda çalışabiliyor. Durum buraya geldikten sonra artık Front-End ve Back-End developerlar tamamen ayrılmış durumda,  bu sayede ayrı ayrı performans değerlendirmeleri ve geliştirmeleri yapılabilmeye başlandı. 

Tam diyorduk ki **Angular**, **React**, **EmberJS** vb frameworkler çok güzel seo problemleri çözüldü sanki masaüstü uygulama gibi single page application yapılabilmeye başlandı hele birde bunu Electron gibi native uygulama altlıklarıyla destekleyince tek bir uygulama web veya native olarak çalışabiliyor, son noktasındayız derken yeni gelişmeler ortaya çıkmaya başladı. Günümüzde merak edip araştıranlar görmüştür **WebAssembly** diye bir söylem var hatta kullananlar var.

Tarih dersimizi bitirip günümüze geldiğimize göre şöyle bi araştıracak olursak;

### Front-End tarafında neler oluyor

- **Ecmascript** ile **Javascript** syntax **Typescript**’ e bayağı yaklaştı tarayıcıların yakında direkt **Typescript**’ e destek vereceği konuşuluyor
- **C# .Net Core** güzel bi performans yakaladı **WebAssembly** tarafına doğrudan destek veriyor yani **C#** ile yazdığın kod doğrudan frontend’ te etki oluşturabiliyor
- Async programlamanın önemi ortaya çıktı Multithread yaklaşımlardan uzaklaşılmaya başlandı hatta öyle ki **NodeJs** ile artan websocket kullanımıyla, async Client-Server haberleşmeleri başladı bu devasa CPU Thread ihtiyaçlarını ortadan kaldırdı.
- **Electron** gibi native uygulama altlıklarının chrome üzerinden web uygulamalarını native uygulama gibi kullanma imkanı sağlaması web/native uygulama kavramını ortadan kaldırmaya başladı

### Back-End tarafında neler oluyor

- **Kubernetes** ile **CAAS** mimarisi altın çağlarını yaşıyor artık fiziksel sunucu bağımlılığı ortadan kalktı bir sunucu bozulunca değiştirme maliyeti sadece sunucu maliyeti oluyor.
- **Golang** ile container içerisine İşletim Sistemi gerekliliği ortadan kalktı yazdığınız kod direkt olarak  container içinde çalışabiliyor herhangi bir base kullanmaya gerek yok
- Thread kavramı artık pek kullanılmıyor **Golang** ile async yaklaşımı iyice benimsendi bu da kaynak tüketimini minimize etti.
- **SAAS**, **FAAS** yaklaşımları ile backend atomik parçalara ayrıldı çok kolay bir şekilde ayrı ayrı monitör etme ve scale etme imkanı oluşmaya başladı (Burada mikro servisler için yazdığım [Nedir Bu Mikroservis Akımı ?](https://fmarslan.com/microservice/2021/01/22/nedir-bu-mikroservis-akimi.html) başlıklı yazımda ki uyarılar hala geçerli)
- Uygulama içerisinde dil bağımlılığı ortadan kalktı öyle ki kaydetme servisi **C#** ile yazılırken okuma servisi **Golang** ile, Güncelleme servisi **Python** ile yazılabilir
- Bakım maliyetleri düşmeye başladı.
- Çözüm değil “Ürün” kavramına daha kolay ulaşılabilmesi sağlandı.


Tüm bunlar şuan için aklıma gelenler bunları geçmişle birlikte okuduğumuzda nereye gidiyoruz diye düşünürsek benim düşüncelerime göre;

### Peki Neler Olacak ?

- **Google** ve **Microsoft** el ele vermiş piyasayı yeni bir geleceğe hazırlıyorlar, ikiside cloud servisleri, **Windows**  ve **Chrome OS** işletim sistemleri ile cloud based kişisel bilgisayar devrinin kapılarını açıyor, 
- Web tarafındaki problemleri çözerek native/web uygulama kavramlarını tamamen silmeyi yerine sadece “uygulama“ kavramını getirmeyi hedefliyorlar
- **Golang** system tarafında **C#** uygulama tarafında en güçlü dil olmayı hedefliyor
- **Amazon** bunun farkında olarak bu aralar çılgınlar gibi servis hazırlıyor
- Back-End tarafında çözüm projelerinde dahi ortak servisler kullanılabileceği için back end development yavaşlayacak gibi ama bu biteceği anlamına gelmiyor
- Front-End tarafında çok daha hızlı ve radikal değişimler olacak gibi bu da ayak uyduramayan bir çok developer’ ın  geride kalmasına dökülmesine sebep olacak
- **Microsoft** **Linux** tarafında cloud ve **C#** uyumu için ciddi katkılar veriyor ki bu da ileride kim bilir **Windows**' un tarihe karışmasına yerine sadece cloud servisleri için çok basit Thin Client gibi bir yazılımın gelmesine sebep olabilir :)
- **Open-Source** tarafında **Microsoft**’ un katkıları göz ardı edilemez maaşlı personel ile **Google** gibi yatırım yapıyor bunun sonucu **Java**' nın güçlü olduğu tek alanı da elinden alacaklar gibi

Konuşulacak daha çok nokta var belki ama daha fazla uzatmamak adına şimdilik burada bırakacağım son olarak bir noktaya dikkat çekmek istiyorum şuan **Java** çok güçlü ve yaygın kullanılan bir dil ama yukarıdan beri konuştuğumuz üzere **Java'** nın buralarda adı hiç geçmiyor kim bilir belkide artık onunda **Pascal** **VBasic** gibi tarihin tozlu sayfalarında yeri ayrılmıştır. **Python** konusuna gelince de o kolay kolay ölmez gibi henüz rakip olabilecek o kadar güçlü bi script dili yok, ama yine zamanın ne getireceği belli olmaz. Şu an belki elektriğin icadı gibi olmasa da bir çağın kapanıp başka bir çağın açıldığı dönemdeyiz hızlı olup bu değişime ayak uydurabilirsek kazananlardan aksi durumda kaybedenlerden olacağız.
