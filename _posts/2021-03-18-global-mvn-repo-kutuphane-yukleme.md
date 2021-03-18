---
layout: post
title: "Global Maven Repository' e kendi kütüphanenizi nasıl yüklersiniz?"
categories: maven
---

İnsan benim gibi bazen hep tüketici konumda olmaktan sıkılıp birazda üretici olayım bende kendimce belki birşeyler katarım diye düşünebiliyor böyle bir durumda sürekli faydalandığımız open source dünyasına merhaba diyoruz. Bu yazıda open soruce nedir vs anlatmayacağım böyle bir yola girdik kütüphanemizi hazırladık github veya benzeri başka bir platformda kaynak kodları yayınladık ama isteyen kolay bi şekilde kullanamıyor global repoda yer almıyoruz bu durumda bizim senaryomuzda bi domain adresimiz var bunu packet name olarak kullanıyoruz ve global maven repoya bu package name ile bu group adı ile yüklemek istiyoruz.

1. Adım kaynak kodlarımız açık bir ortamda open source olarak yer alıyor *(bu kısım hazır elimizde)*
2. Domain adresimizin dns kaydı nasıl yönetiliyor öğreniyoruz bir txt kaydı eklememiz gerekecek.
3. https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134 buradan bir issue açıyoruz derdimizi meramımızı anlatıyoruz. *(Örnek oalrka diğer issuelara bakarsınız)*
4. Oluşan issue numarasını domain adresinize txt kaydı olarak ekliyorsunuz
5. issue ya txt kaydı oalrka eklediğinizi belirtir bir comment yazıyorsunuz
6. aşağıdakine benzer bir cevap gelecek ve paket adı sizin hesabınıza tanımlanmış olacaktır. ve bu gelen commentte nasıl deploy yacağınız detaylı olarak anlatılmış durumdadır.

``
{{your group name}} has been prepared, now user(s) {{your username}} can:
Publish snapshot and release artifacts to https://s01.oss.sonatype.org
Have a look at this section of our official guide for deployment instructions:
https://central.sonatype.org/pages/ossrh-guide.html#deployment

Please comment on this ticket when you've released your first component(s), so we can activate the sync to Maven Central.
Depending on your build configuration, this might happen automatically. If not, you can follow the steps in this section of our guide:
https://central.sonatype.org/pages/releasing-the-deployment.html

``

Artık sizinde bir global repoda yeriniz var tüm repolar için benzer şekilde yöntemler mevcuttur.

[Kaynak](https://central.sonatype.org/pages/ossrh-guide.html)
