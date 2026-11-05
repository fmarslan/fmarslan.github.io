---
layout: post
title: "AI ile daha hızlı kod yazıyoruz ama daha iyi yazılım mı geliştiriyoruz?"
seo_title: "AI ile Hızlı Kod Yazmak ve Yazılım Kalitesi"
date: 2026-11-05 15:00:00 +0200
description: "AI ile hızlanan geliştirmede gereksiz testler, eski davranışları koruyan kod ve tekrarlanan dokümantasyon teknik borcu nasıl artırıyor? Deneyimlerim ve yaklaşımım."
image: /assets/img/ai-coding-technical-debt.png
image_alt: "Düzenli bir yapıdan dengesiz bir yığına dönüşen geometrik bloklarla kod üretim hızı ve teknik borç"
tags: [ai, software-architecture, technical-debt, testing, developer-experience]
keywords: [AI destekli yazılım geliştirme, vibe coding, yazılım kalitesi, teknik borç, test kalitesi, backward compatibility]
lang: tr-TR
translation_key: ai-coding-software-quality
permalink: /tr/2026/11/05/ai-ile-hizli-kod-yazmak-ve-yazilim-kalitesi.html
x_default_url: /tr/2026/11/05/ai-ile-hizli-kod-yazmak-ve-yazilim-kalitesi.html
published: true
---

AI destekli geliştirme araçlarıyla çalışırken son dönemde aynı soruyu daha sık soruyorum: Kod üretme hızımız artıyor, peki geliştirdiğimiz yazılımın kalitesi de aynı şekilde artıyor mu?

Bir özelliği eklemek, bir entegrasyon yazmak veya mevcut kodu düzenlemek artık çok daha kolay. Ancak bu hızın içinde fark edilmeden biriken sorunlar var. Gereksiz testler, artık ihtiyaç duyulmayan uyumluluk katmanları ve kodu tekrar eden dokümantasyon bunlardan bazıları.

Kendi çalışmalarımda karşılaştığım bu örneklerin ortak bir noktası var: AI, verdiğimiz görevi tamamlamaya çalışırken her zaman sistemin bütünü için doğru kararı vermiyor.

## Daha fazla test her zaman daha fazla güven sağlamıyor

Eskiden geliştiricilere test yazdırmak zordu. Şimdi bazen AI’a bu kadar çok test yazmasına gerek olmadığını anlatmak gerekiyor. :)

Neredeyse her implementasyon ayrıntısı için ayrı bir test üretilebiliyor. Test sayısı hızla artıyor; ancak bu testlerin ne kadarının gerçek bir hatayı yakalayacağı her zaman açık olmuyor.

Örneğin aynı iş kuralını farklı katmanlarda tekrar tekrar doğrulayan testler, ek güven sağlamadan bakım yükünü artırabiliyor. Kodun iç yapısına fazla bağlı testler ise davranış değişmediği hâlde basit bir refactoring sırasında kırılabiliyor.

Sonuçta daha fazla token tüketiyoruz, build sürelerini uzatıyoruz ve gelecekte değiştirmemiz gereken daha fazla kod üretiyoruz.

Benim için temel soru şu: **Bu test, hangi önemli davranışı güvence altına alıyor?**

Kritik iş kurallarını, hata senaryolarını ve entegrasyon sınırlarını kapsayan testler değerli. Sadece yazılan kodun satırlarını başka bir biçimde tekrar eden testler için aynı şeyi söylemek zor.

## İş kuralı değiştiğinde test de değişmeli

Bir alanın daha önce opsiyonel olduğunu, artık zorunlu hâle getirildiğini düşünelim.

Yeni gereksinim açık: Alan gönderilmezse işlem reddedilecek. Fakat mevcut testlerden biri, bu alan olmadan da işlemin başarılı olmasını bekliyor.

AI bazen bu noktada eski testi sorgulamak yerine bütün testleri geçirecek bir çözüm arıyor. Eksik alan için varsayılan değer ekleyebiliyor veya belirli koşullarda eski davranışı devam ettirebiliyor. Testler yeşil görünüyor ama yeni iş kuralı tam olarak uygulanmamış oluyor.

Burada testin başarısız olması beklenen bir sonuç. Çünkü doğruladığı davranış artık geçerli değil. Testler gereksinimlerin yerine geçmez; gereksinim değiştiğinde ilgili testlerin beklentileri de gözden geçirilmelidir.

Bu, başarısız olan her testi değiştirmek anlamına gelmiyor. Önce hatanın kodda mı, yoksa artık geçerli olmayan bir beklentide mi olduğunu anlamak gerekiyor.

## Backward compatibility kendiliğinden eklenmemeli

Benzer bir durum konfigürasyon değişikliklerinde de karşıma çıkıyor.

Bir alanın adını değiştiriyoruz. Eski adı kullanan bütün yerleri güncelliyoruz. Buna rağmen AI, tedbir olarak hem eski hem yeni alanı destekleyen kod yazabiliyor.

İlk bakışta küçük bir önlem gibi görünüyor. Ancak beraberinde yeni sorular getiriyor: İki alan birlikte gönderilirse hangisi kullanılacak? Farklı değerler taşırlarsa ne olacak? Eski destek ne zaman kaldırılacak?

Basit bir isim değişikliği, ek davranışlar ve bakım sorumluluğu üretmiş oluyor.

Elbette eski sürümü kullanan müşteriler, bağımsız yayınlanan servisler veya devam eden bir geçiş süreci varsa backward compatibility gerekli olabilir. Böyle bir durumda kapsamı ve kaldırılma koşulu da belirlenmeli. Ama ortada bu ihtiyacı doğuran bir kullanıcı veya sistem yoksa, eski davranışı korumak yalnızca gereksiz kod yolları oluşturuyor.

## Dokümantasyon kodun tekrarına dönüşebiliyor

AI dokümantasyonu hızlı hazırlıyor. Fakat bazen neyin belgelenmeye değer olduğunu ayırt etmekte zorlanıyor.

Kodda `if value == 5` kontrolü varsa, dokümana da bu koşulun nasıl çalıştığını uzun uzun yazabiliyor. Koddan kolayca anlaşılabilen bir ayrıntı, ikinci bir yerde daha tutulmaya başlanıyor.

Asıl ihtiyaç duyduğumuz açıklama ise çoğu zaman eksik kalıyor: Neden 5? Bu sınır hangi gereksinimden geliyor? Değişirse hangi sistemleri etkiler?

Ben dokümantasyonda işin mantığını, sistemin sınırlarını, varsayımları ve mimari kararların gerekçesini görmek istiyorum. Koddan doğrudan okuyabileceğimiz ayrıntıların tekrar edilmesi, dokümanın zamanla güncelliğini kaybetme ihtimalini de artırıyor.

Kodun kendisi de AI için okunabilir bir kaynak. Dokümantasyon, kodu anlamlandıracak çerçeveyi vermeli.

## Biriken fazlalıklar sonraki geliştirmeyi de etkiliyor

Bu örnekler tek başına küçük görünebilir. Birkaç ek test, bir uyumluluk kontrolü, birkaç sayfa açıklama… Fakat her değişiklikte tekrarlandıklarında codebase büyüyor, build süreleri uzuyor ve bakım maliyeti artıyor.

Üstelik bu birikim, AI ile sonraki çalışmaları da zorlaştırabiliyor. Artık kullanılmayan davranışlar ve birbirini tekrar eden açıklamalar arasında, hangi bilginin güncel olduğunu ayırt etmek güçleşiyor. Sınırlı bağlamla çalışırken gereksiz içerik, asıl ihtiyaç duyulan bilgiye ayrılabilecek alanı da tüketiyor.

Bu nedenle sade bir codebase ve güncel dokümantasyon, AI destekli geliştirme sürecinin kalitesi için de değerli.

## Teknik kararların sorumluluğu hâlâ bizde

AI ile çalışırken yalnızca ortaya çıkan kodun çalışıp çalışmadığını kontrol etmek yeterli gelmiyor. Değişikliğin gereksinime uygunluğunu, eklenen karmaşıklığı ve gelecekteki bakım yükünü de değerlendirmek gerekiyor.

Bir işi incelerken şu soruların faydasını görüyorum:

- Testler önemli davranışları mı doğruluyor, implementasyonu mu tekrar ediyor?
- Değişen gereksinimle çelişen eski beklentiler kaldı mı?
- Eklenen uyumluluk desteğine gerçekten ihtiyaç var mı?
- Dokümantasyon, koddan anlaşılmayan hangi bilgiyi sağlıyor?

AI’a vereceğimiz yönlendirme de yalnızca ne ekleyeceğimizi içermemeli. Hangi davranışın değiştiğini, hangisinin kaldırıldığını ve hangi sınırların korunacağını da açıkça belirtmeliyiz.

[AI kullanım yaklaşımımı anlattığım yazıda](/tr/2026/08/07/aiyi-nasil-kullaniyorum-operasyonlar-aida-kararlar-bende.html) da aynı sorumluluk ayrımını ele almıştım: Operasyonları devredebiliriz, kararların sahipliğini değil.

Bir bakıma çok hızlı çalışan bir geliştiricinin teknik liderliğini yapıyoruz. Üretim hızından yararlanıyoruz; tasarım, kapsam ve kalite kararlarını ise gözden geçirmeye devam ediyoruz.

**AI’ın hızlı kod yazması, doğru teknik kararlar verdiği anlamına gelmiyor.**

AI kodu yazsın; biz tasarımı ve süreci yönetelim. Kod üretme hızımız artarken teknik borcumuzu da aynı hızda büyütmeyelim.
