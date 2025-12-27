---
layout: post
title: "Peppol Ağı Teknik Olarak Nasıl Çalışır? (DNS Mantığıyla)"
date: 2025-12-25 09:00:00 +0300
description: Peppol ağındaki SML, SMP, Participant ID ve Access Point rollerini DNS çözümleme mantığıyla birebir karşılaştırarak açıklayan teknik rehber.
image: /assets/img/peppol-network-cover.png
tags:
  - peppol
  - e-invoice
  - networking
  - dns
categories:
  - networking
---

Peppol'u anlamaya çalışırken SML, SMP, Access Point, Participant ID gibi onlarca terim ezberlenmesi gereken karmaşık başlıklar gibi görünebilir. Oysa işin özü şu soruya dayanıyor: **“Bir elektronik belgeyi doğru kuruma, doğru teknik uç noktaya, güvenli şekilde nasıl ulaştırırım?”** Bu, internette yıllardır DNS'in çözdüğü problemin aynısı. Peppol mimarisi de DNS'ten öğrendiğimiz yetki devri ve çözümleme zincirini kurumlar ve e-belgeler için yeniden kuruyor.

![Peppol ağının kapak görseli](/assets/img/peppol-network-cover.png)

DNS'in nasıl katman katman çalıştığını merak edersen önce şu yazıya bakmanı öneririm: [ICANN, DNS Çözme Zinciri ve Yetki Haritası](/networking/2025/12/20/icann-dns-cozme-ve-yetki-zinciri.html). Buradaki anlatım, o zinciri bildiğin varsayımıyla ilerliyor.

## Peppol Network nedir?

Peppol ne merkezi bir platform ne de tek bir yazılım ürünüdür. İnternet gibi düşünebilirsin: Kurallar, roller, teknik standartlar ve güven çerçevesi tanımlıdır; herkes bu kurallara uygun sistemini inşa eder. Hiç kimse “Peppol'u işletmiyor” ama herkes Peppol uyumlu çalışarak aynı ağda belge alışverişi yapabiliyor.

## DNS ile birebir örtüşen ana fikir

DNS için temel soru “Bu isimli şey ağda nerede?” Peppol'da soru aynıdır: **“Bu Participant ID'ye sahip kurumun belge alma noktası nerede?”** Participant ID, `0088:5790000435968` formatında bir kimliktir ve DNS'teki `example.com` neyse Peppol'da odur. Kimse IP düşünmez; herkes “Bu kuruma gönder” der, geri kalan çözüm zinciri tarafından tamamlanır.

## SML: Kök dizin (Root DNS gibi)

Bir Participant ID geldiğinde ilk cevaplanacak soru şudur: “Bu kurumun teknik kayıtları hangi SMP'de duruyor?” SML bu dizin bilgisini tutar. Hiçbir belgeyi, Access Point'i, formatı bilmez; sadece “Bu participant'ın kayıtları şu SMP'de” der. DNS'teki root zone → TLD yönlendirmesinin birebir karşılığıdır.

## SMP: Yetkili teknik gerçek (Authoritative DNS gibi)

SMP, belirli bir participant için yetkili kayıtların bulunduğu yerdir. Burada şunlar tutulur:

* Hangi belge tipleri ve süreçler destekleniyor
* Hangi format (örn. UBL)
* Hangi Access Point'e gidilecek
* Teknik endpoint adresi ve protokol bilgileri

DNS'te IP/MX/SRV kayıtları neyse Peppol'da SMP içeriği odur. Merkezi değildir; her kurum veya servis sağlayıcı kendi SMP'sini barındırabilir.

## Endpoint ve Access Point

Çözümleme zincirinin sonunda gelen bilgi “Bu participant şu Access Point üzerinden, şu endpoint'e AS4 ile bağlanarak belge alır” şeklindedir. Buraya ulaşmadan hiçbir veri gönderilmez. Access Point katmanı gerçek iletişimi yapar: AS4 mesajlaşması, sertifika doğrulaması, imzalama, şifreleme, retry, teslim kanıtı üretme… Gönderen ve alıcı sistemler asla direkt konuşmaz, tıpkı e-posta sunucularının birbirleriyle konuşması gibi daima Access Point → Access Point iletişimi gerçekleşir.

## Peppol akışı (DNS zinciri gibi)

1. Sistem “Bu belge şu participant'a gidecek” der.
2. Gönderen Access Point SML'e bakar.
3. SML ilgili SMP'yi döner.
4. SMP Access Point + endpoint bilgisini verir.
5. Gönderen Access Point, alıcı Access Point'e bağlanır ve mesajı iletir.

Bu akış, DNS çözümlemesi yapılmadan HTTP isteği atılmamasının birebir karşılığıdır.

## Birden fazla Access Point & SMP ayrımı

DNS nasıl aynı domain için birden fazla IP'yi (yük dengeleme / failover) destekliyorsa, Peppol da aynı participant için birden fazla Access Point veya bölgesel dağıtım kurgusuna izin verir. Ayrıca SMP ile Access Point'in aynı sağlayıcıda olması zorunlu değildir. DNS'te başka bir firma authoritative DNS'i barındırabilir, web sunucusunu başka bir firma çalıştırabilir; Peppol'da da bu ayrım yaygındır.

## Neden böyle tasarlanmış?

Amaç tek bir ülkenin, şirketin veya platformun çökmesiyle ağın durmamasıdır. Merkezi bir sistem yok, tek hata noktası yok; herkes kendi parçasından sorumludur. Öğrenmesi ilk bakışta zor, kurulumu zahmetli ama uzun vadede güvenilir bir yapı sağlar.

## Kısa teknik özet

* Peppol = e-belgeler için DNS benzeri çözümleme + güvenli taşıma
* Participant ID = domain name
* SML = root dizin
* SMP = yetkili teknik kayıt
* Access Point = gerçek iletişim sunucusu
* Çözümleme bitmeden veri asla gönderilmez

Bu gözle baktığında Peppol'un neden bu kadar “katı” ve katmanlı olduğunu net biçimde görüyorsun: Amaç, küresel ölçekte güvenilir ve dağıtık bir belge dağıtım ağı kurmak.
