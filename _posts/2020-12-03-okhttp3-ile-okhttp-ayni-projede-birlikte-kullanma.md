---
title: OkHttp3 ile Okhttp aynı projede birlikte kullanma
layout: post
category: java
---

Bazen javada uygulama geliştirirken kullandığımız kütüphaneler arasında uyumsuzluk yaşarız bir çok kişi bunula karşılaşmıştır. Burada bir örnek üzerinden genel olarak bu tip problemler nasıl çözülür onu yapacağız.

Örneğimiz bir projede aşağıdaki gibi dependencylerimiz olsun bu iki dependency içinde okio kütüphanesinin versionları çakışıyor.


```xml
...

    <dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-hdfs-client</artifactId>
			<version>3.3.0</version>
		</dependency>
    <dependency>
			<groupId>io.minio</groupId>
			<artifactId>minio</artifactId>
			<version>8.0.3</version>
		</dependency>
....

```
resimde çakışan versionları görebilrisiniz.

![Okio Version](http://fmarslan.com/assets/img/Screenshot%20from%202020-12-03%2014-43-04.png)


*1. Adım* burada asıl çakışan okhttp ile okhttp3 olduğunu farketmişsinizdir bunların arasında log4j de olduğu gibi bir interface yok o yüzden mecbur uyumlu versionlarını bulmayı ümit edeceğiz :) Log4j ve log4j2 kütüphanelerini arada bir interface olduğu için sorunsuz bir birleri yerine kullanabiliyoruz.
*2. Adım* [okhttp için buradan](https://mvnrepository.com/artifact/com.squareup.okhttp/okhttp) [okhttp3 için buradan](https://mvnrepository.com/artifact/com.squareup.okhttp3/okhttp) versionları kontrol ettiğimizde 2.7.5 ten sonra okhttp çıkmamış o yüzden orada hareket şansımız yok bu yüzden okhttp3 üzerinden gideceğiz. okhttp3 için geriye doğru geliyoruz verionlarda 4 major bir version olduğundan 3 e geçmeyi tavsiye etmem genelde sorun çıkar o yüzden *4.x.x* version grubundan en düşük *okio* versionunu bulmaya çalışıyoruz bunun için her bir versionun sayfasına girdiğimizde aşağıda bağımlıklık versionları yer alır oradan görebiliriz.

![Bağımlılıklar](http://fmarslan.com/assets/img/Screenshot%20from%202020-12-03%2014-53-20.png)

*3. Adım* olarak bu okio versionları arasındaki [change logları](https://square.github.io/okio/changelog/#version-222) izleyerek değpişkliklerden problem çıkarmayacak version bulmaya çalışıyoruz

*4. Adım* ben burada 4.0.0 ile okio:2.2.2  de uygun sürümü yakaladım şimdi bunu maven pomda uyguluyorum

```xml
...
		<dependency>
			<groupId>io.minio</groupId>
			<artifactId>minio</artifactId>
			<version>8.0.3</version>
      <!-- minio içinden http3 kütüphanesini çıkarıyoruz -->
			<exclusions>
				<exclusion>
					<groupId>com.squareup.okhttp3</groupId>
					<artifactId>okhttp</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
    <!-- yeni http3 kütüphanemizi ekliyoruz -->
		<dependency>
			<groupId>com.squareup.okhttp3</groupId>
			<artifactId>okhttp</artifactId>
			<version>4.0.0</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-hdfs-client</artifactId>
			<version>3.3.0</version>
      <!-- okio kütüphanesi http3ten geldiği için buradna çıkarıyoruz. -->
			<exclusions>
				<exclusion>
					<groupId>com.squareup.okio</groupId>
					<artifactId>okio</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
...

```

*Son not olarak* kütüphaneleir kullanırken uyumlulukalrına dikakt ederek kullanırsak genel bu tip şeyler ile karşılaşmayız ayrıca özellikle böyle kütüphane yayınlıyorsak spesific versionlar kullanmazsak, böyle durumlar için interface eklersek(örnek: http ile http3 arasında interface olsaydı büyük ihtimal bu sorun yaşanmayacaktı.) 

