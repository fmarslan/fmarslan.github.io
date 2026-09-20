---
layout: post
title: "TAR Vault Sync: Kişisel Bir İhtiyaçtan 24 Saatte İlk Test Sürümüne"
date: 2026-09-20 15:00:00 +0300
description: "Çalışma ortamlarımı güvenle geri kurma ihtiyacının TAR Vault Sync'e dönüşmesi; teknoloji tercihlerim, AI agent'larla denediğim çalışma yöntemleri ve 24 saatte yayımlanan ilk test sürümü."
image: /assets/img/tar-vault-sync-24-hours-tr.png
image_alt: "TAR Vault Sync: Fikirden İlk Test Sürümüne, 24 Saat. Geliştirme klasörlerini ve bulut kaynaklarını birbirine bağlayan şifreli bir kasa."
tags:
  - software-development
  - ai-agents
  - rust
  - secret-management
  - devcontainer
lang: tr-TR
translation_key: "tar-vault-sync-fikirden-ilk-surume-24-saat"
permalink: /2026/09/20/tar-vault-sync-fikirden-ilk-surume-24-saat.html
published: true
---

Bilgisayarımda aynı anda birçok proje üzerinde çalışıyorum. Her projenin kendi klasörü, Docker yapılandırması, ortam değişkenleri, bağlantı bilgileri ve yardımcı araçları var. Zaman içinde bu klasörlerin her biri, kaynak kodun etrafında oluşmuş ayrı bir çalışma ortamına dönüşüyor.

Bir projeyi Git'ten klonlamak kolay. O projede kaldığım yerden çalışmaya devam edebilmek ise daha fazla şey gerektiriyor.

Doğru `.env` dosyası, bir servisin API anahtarı, özel bir sertifika, Git erişim bilgileri… Bunlardan biri eksik olduğunda kaynak kodun bilgisayarda bulunması yeterli olmuyor. Ortamı yeniden çalışır hâle getirmek için zaman harcamam gerekiyor.

TAR Vault Sync'in çıkış noktası buydu: Kendi çalışma ortamlarımı daha kolay ve güvenli biçimde geri kurabilmek istiyordum. Bu ihtiyacı, AI agent'larla yeni geliştirme yöntemleri denemek için de kullandım. **24 saatlik bir çalışmanın ardından fikir çalışan bir ürüne dönüştü ve ilk test sürümü yayımlandı.**

İtiraf edeyim, bu işin başlangıcında biraz tembelliğin de payı var. Bir kere çözdüğüm kurulum işini her bilgisayar değişiminde veya ortamı yeniden hazırladığımda tekrar yapmak istemiyorum. Özellikle birden fazla projeyle uğraşırken bu küçük işler birikiyor.

Geliştirme ortamımı zaten hafif ve taşınabilir tutmaya çalışıyorum. Bu yaklaşımı daha önce [geliştirme ortamımı anlattığım yazıda](https://fmarslan.com/en/2025/12/01/my-development-environment-a-lightweight-portable-and-simple-approach.html) paylaşmıştım. Ancak araçların taşınabilir olması, projelerin ihtiyaç duyduğu bütün bilgilerin de kolayca taşınabildiği anlamına gelmiyor. En hassas kısım çoğu zaman secret'lar oluyor.

İlk bakışta çözüm basit: Çalışma klasörlerini yedekle, gerektiğinde geri yükle.

Fakat bu klasörlerde parolalar, erişim anahtarları, özel anahtar dosyaları ve sertifikalar bulunabiliyor. Her şeyi olduğu gibi buluta kopyalamak, yedeğin içine taşımak istemediğim bilgileri de koymak demek. Böylece çalışma ortamını yedekleme ihtiyacı, beni secret yönetimi ve senkronizasyonu etrafında bir çözüm geliştirmeye götürdü.

İhtiyacım, bir parolayı kasada saklamanın ötesindeydi. O bilginin gerektiğinde doğru projenin doğru hedefine ulaşmasını istiyordum. Bir değer `.env` dosyasına, bir diğeri JSON içindeki belirli bir alana, başka biri sertifika dosyasına veya Git Credential Manager'a gitmeliydi.

Mevcut araçlar bu problemin farklı parçalarını çözüyordu. Kendi çalışma biçimime uyan bütünlüğü bulamayınca, ihtiyacımı daha açık tanımlayıp bir uygulamaya dönüştürmeye başladım.

Ortaya çıkan fikir şuydu: Çalışma ortamının kurulumu ve gizli bilgi içermeyen yapılandırması taşınabilsin; secret değerleri ise seçilen sağlayıcılarda veya şifreli kasalarda tutulsun. Uygulama, bu kaynaklarla yerel hedefler arasındaki eşleştirmeleri yönetsin.

Örneğin bir projenin veritabanı parolasını hangi kaynaktan alacağını ve hangi dosyada hangi alana yazacağını tanımlayabileyim. Parola değiştiğinde aynı bilgiyi farklı yerlere elle taşımak zorunda kalmayayım. Ortamı geri kurarken bu ilişkileri baştan hatırlamam gerekmesin.

Bu yaklaşım mimariyi de belirledi. Kaynaklar, hedefler ve bunları birbirine bağlayan kurallar ayrı sorumluluklar olarak ele alındı. Yeni bir secret kaynağı eklemekle yeni bir dosya biçimini desteklemek, ayrı geliştirilebilen işler hâline geldi.

Uygulama için ayrıca sunucu veya veritabanı işletmek istemiyordum. Çalışma ortamımı kolaylaştırmak amacıyla kullandığım aracın, bana yeni bir altyapı bakım yükü getirmemesi gerekiyordu. Bu yüzden yerelde çalışan, ihtiyaç duyduğunda seçilen bulut servislerine bağlanan bir yapı benimsedim.

Yerel kasa, OneDrive ve Google Drive üzerinde tutulan şifreli kasalar ve Azure Key Vault bu yaklaşımın ilk kaynakları oldu. Burada Google Drive gibi bir dosya depolama servisiyle Azure Key Vault gibi bir secret servisi farklı görevler üstleniyor. Drive tarafında taşınan şey cihazda şifrelenmiş kasa dosyası; Key Vault tarafında ise sağlayıcının yönettiği secret değerleri kullanılıyor.

Teknoloji tarafında çekirdeği Rust ile geliştirme yönünde ilerledim. Dosyalarla, hassas verilerle ve işletim sistemi entegrasyonlarıyla çalışan bir uygulamada, çekirdeği ve native masaüstü arayüzünü aynı dil etrafında tutmak istediğim yapıyla örtüşüyordu. Zamanlanmış işlemler ve eşzamansız çalışma için Tokio kullanıldı.

Arayüz yaklaşımı süreç içinde değişti. İlk tasarımda Tauri vardı; uygulanan masaüstü arayüzünde ise `eframe/egui` kullanıldı. Yönetim ekranı doğrudan Rust tarafında, tarayıcıda barındırılan bir arayüz veya yerel web sunucusu gerektirmeden çalışır hâle geldi. Bulut hesabına giriş sırasında açılan tarayıcı, uygulamanın yönetim arayüzünden ayrı bir yetkilendirme adımı olarak kaldı.

Bu tercihlerde günlük kullanım biçimi belirleyiciydi: Uygulamayı açmak, kasayı yönetmek, eşleştirmeleri görmek ve yapılan işlemleri takip edebilmek.

Geliştirme ortamında da aynı sadelik arayışı vardı. Bilgisayarıma her proje için yeni SDK'lar ve araç zincirleri kurmak istemiyordum. Bu nedenle yerel geliştirme ve çekirdek testleri için Dev Container, işletim sistemine özgü derlemeler için GitHub Actions kullanan bir düzen seçtim.

Rust, Cargo ve geliştirme araçları container içinde bulunuyor. Windows, macOS ve Linux paketleri ise ilgili native CI ortamlarında hazırlanıyor. Böylece geliştirme ortamını yeniden oluşturmak kolaylaşırken, platforma özgü davranışların doğrulanması da kendi ortamında yapılabiliyor. Mevcut Azure bağlantısının kullanım sırasında Azure CLI oturumuna ihtiyaç duyması ise geliştirme araç zincirinden ayrı, ilk sürüme ait bir entegrasyon sınırı.

Geliştirme boyunca alışık olduğum doğrulama disiplinini bu çalışma düzenine uyguladım. Derleme, otomatik testler ve gerçek kullanım senaryolarını ayrı kontrol noktaları olarak ele aldım. Linux container içinde geçen bir testi, Windows kimlik bilgisi deposunun veya macOS'taki native davranışın doğrulanmış olmasıyla eş tutmadım.

Projenin benim için diğer önemli tarafı, AI agent'larla farklı çalışma yöntemlerini sınayabileceğim somut bir alan oluşturmasıydı.

Agent'ları zaten günlük yazılım geliştirme sürecimde kullanıyorum. Bu projede yeni metodolojiler ve taktikler deneyerek, işleri nasıl daha iyi organize edebileceğimi ve kalite kontrolünü koruyarak fikirden çalışan ürüne ne kadar hızlı ulaşabileceğimi test ettim.

Gereksinimlerin hazırlanması, mimari kararların değerlendirilmesi, geliştirme adımlarının planlanması, uygulama ve bağımsız QA incelemeleri için farklı roller kullandım. İhtiyacı tarif etme, kapsamı belirleme, öncelikleri seçme ve sonucu değerlendirme sorumluluğu bende kalırken, agent'ların çalışmasını bu sınırlar içinde yönlendirdim.

İşin önemli bir kısmı, neyin geliştirileceği kadar hangi koşullarda tamamlanmış sayılacağını da açıkça tanımlamaktı. Bir secret loglara girmemeliydi. Dosya güncellenirken hata oluşursa mevcut dosya korunmalıydı. Kaynağa erişilemediğinde hedefteki çalışan yapılandırma bozulmamalıydı. Bir aşamanın tamamlandığı söylenirken bunun hangi testlerle doğrulandığı anlaşılmalıydı.

İlk aşamada gerçek bulut servisleri yerine sahte kaynak ve hedef modülleriyle çekirdeğin davranışı doğrulandı. Ardından şifreli yerel kasa, dosya hedefleri, Docker girdileri, Git kimlik bilgileri ve bulut bağlantıları geliştirildi. Böylece her adımın kapsamı ve kontrol noktaları belirli kaldı.

Bu çalışmada ayrıntıların açıkça ele alınması hız kadar önemliydi. Docker için bir ortam dosyasını güncellemek, çalışan container'ın yeni değeri kullanmaya başladığı anlamına gelmiyor. Uygulamanın yeniden başlatma gerektiğini belirtmesi gerekiyor. Bu nedenle ilk uygulamada dosya güncellemesiyle container yaşam döngüsü ayrı tutuldu.

Benzer şekilde, buluttaki bir kasayı okuyup yazabilmek yeterli değil. Başka bir cihaz kasayı değiştirmişse eski bir kopyanın yeni verinin üzerine sessizce yazılmasını engellemek gerekiyor. Bulut bağlantılarında sürüm ve çakışma kontrolleri bu yüzden işin parçası oldu.

Tarayıcı parolaları tarafında da kapsamı desteklenebilen davranışlarla sınırladım. Sürekli senkronizasyon varsaymak yerine, kullanıcı onayıyla CSV içe aktarma yönünde ilerledim. Bir özelliği yol haritasında istemek ile mevcut sürümde güvenilir biçimde sunabilmek arasındaki sınırı açık tuttum.

Windows üzerinde OneDrive ve Google Drive bağlantıları gerçek hesaplarla, test verileri kullanılarak doğrulandı. Şifreli kasa oluşturma, okuma, güncelleme, kilitleme ve yeniden açma gibi akışların yanında eski sürümle üzerine yazma girişiminin reddedilmesi de kontrol edildi. Azure tarafında da secret değişimi ve kaynak hatasında mevcut hedefin korunması gibi senaryolar sınandı.

Yayınlama sürecini GitHub üzerinden yürüttüm. GitHub Actions, Windows, macOS ve Linux için AMD64 ve ARM64 paketlerini hazırlayan akışı üstlendi. Native testler, derleme ve temel çalıştırma kontrollerinin ardından paketler sürüme eklendi; indirilen dosyaların bütünlüğünü kontrol etmek için SHA-256 sağlama toplamları da sunuldu.

İlk [`v0.1.0-rc.1` test sürümü](https://github.com/tarsolution/tarvaultsync/releases/tag/v0.1.0-rc.1), 20 Eylül 2026'da ön sürüm olarak yayımlandı. Uygulamanın kullanımını ve mevcut yeteneklerini anlatan statik dokümantasyon da dağıtımın bir parçası oldu.

**Fikirden bu ilk sürüme ulaşmak 24 saatlik bir çalışma aldı.** Bu süre içinde kişisel bir ihtiyaç tanımlandı, mimari oluşturuldu, temel akışlar geliştirildi, test edildi ve başkalarının da deneyebileceği paketlere dönüştürüldü.

İlk test sürümü, bütün yol haritasının tamamlandığı anlamına gelmiyor. İmzalı dağıtım, iki fiziksel cihazla uçtan uca kabul testleri, macOS ve Linux üzerinde gerçek hesap doğrulamaları gibi işler devam ediyor. Masaüstü uygulamasının zamanlayıcısı pencere açıkken çalışıyor; bağımsız agent modunun üretim seviyesindeki kimlik doğrulaması da ayrı bir geliştirme konusu. Sürümün bu sınırlarını, çalışan özellikleri kadar görünür tutmayı tercih ediyorum.

Benim için bu çalışmanın değeri, 24 saatte ortaya çıkan kod miktarından çok, o sürede kullanılabilir bir akışın kurulmuş olması. Yeni agent çalışma yöntemlerini gerçek bir ihtiyaç üzerinde deneyip sonucu indirilebilir bir ilk sürüme taşımak, hız hedefini ölçülebilir hâle getirdi.

Öncelikli hedefim kendi çalışma ortamlarımı daha az elle müdahaleyle geri kurabilmek. Proje sayısı arttıkça yönetimi zorlaşan gizli bilgileri, açıkça tanımlanmış kaynaklar ve hedeflerle düzenleyebilmek.

Daha uzun vadede, farklı geliştiricilerin kendi ortamlarına uyarlayabileceği bir araç oluşmasını istiyorum. Herkes aynı bulut sağlayıcısını, aynı dosya biçimlerini veya aynı geliştirme düzenini kullanmıyor. Katkıların bu farklı ihtiyaçlardan gelmesi projeyi daha kullanışlı hâle getirebilir.

AI agent'larla katkı yaklaşımı da bunun bir parçası. Kendi ihtiyacını tanımlayan, agent'ıyla geliştiren ve sonucunu doğrulayarak paylaşan insanların birlikte üretebildiği bir proje hedefliyorum. Kaynak kod ve geliştirme yol haritası [TAR Vault Sync deposunda](https://github.com/tarsolution/tarvaultsync) bulunuyor.

Ulaşmak istediğim deneyim oldukça basit: Bir çalışma ortamını geri getirdiğimde, eksik bağlantı bilgilerini aramaya başlamak yerine kaldığım işe devam edebilmek.
