---
layout: post
title: "ICANN, DNS Çözme Zinciri ve Yetki Haritası"
date: 2025-12-20 09:00:00 +0300
description: DNS'in neden hiyerarşik olduğunu, ICANN, registry, registrar, resolver ve authoritative DNS rollerinin nasıl ayrıştığını anlatan rehber.
image: /assets/img/icann-dns-kapak.png
tags:
  - dns
  - icann
  - networking
  - registry
  - resolver
categories:
  - networking
---

DNS hakkında konuşurken çoğu anlatım root–TLD–authoritative sıralamasıyla başlar. Ben tersinden gideyim: **Bir domain'i çözmek = IP'yi bilmek** demek ama bunu yapan tek bir otorite yok. DNS kasıtlı olarak parçalı bir yapı ve tepesinde ICANN var.

![DNS hiyerarşisi kapağı](/assets/img/icann-dns-kapak.png)

## ICANN ne yapar, ne yapmaz?

ICANN

* DNS sorgusu almaz,
* IP döndürmez,
* “Bu domain şu IP” demez.

Yani kullanıcıyla doğrudan teması yoktur. ICANN'in rolü, isim alanında kimin söz hakkı olduğunu tanımlamak ve root zone'u koordine etmektir. “.com kime ait, .tr kime devredilmiş?” sorularının cevabı bu koordinasyonla belirlenir. ICANN'i sahaya inmeyen, yetki haritasını çizen merkez gibi düşünmek en doğrusu.

## DNS neden hiyerarşik?

Tek bir yerde tutulursa hem ölçeklenmez hem de güvenlik ve politika açısından yönetilemez olurdu. O yüzden yapı katmanlıdır:

```
Root (.) → TLD (.com, .tr, .eu) → Domain (example.com) → Subdomain (api.example.com)
```

Her katman bir alt katmana yetki devreder. Bu ``delegation`` mantığı DNS'in omurgasıdır.

### Root zone ve root server

Root zone “IP bilmiyorum ama hangi TLD hangi name server'a bakacak onu biliyorum.” anlamına gelir. Root server'a “example.com’un IP’si ne?” diye sormazsınız; “.com nerede?” diye sorarsınız. Cevap da “.com için şu name server’lara git”tir. Root server hiçbir zaman domain çözmez, sadece yönlendirir.

## Registry ne yapar?

Registry bir TLD'nin resmi kayıt defteridir. Örneğin .com registry'si hangi domain'lerin kayıtlı olduğunu, hangi authoritative DNS'leri kullandığını ve varsa DNSSEC DS kayıtlarını bilir. Ama “Bu domain’in IP’si şu” demez, DNS sorgusuna cevap vermez. Görevi, “Bu domain'in yetkili DNS'i şurada, ona sor” demektir. Yani registry de çözümü yapmaz; ara otoritedir.

## Registrar nereye oturuyor?

Registrar tamamen ticari tarafta durur. Kullanıcı domain satın alır, yeniler, NS değiştirir; registrar da bu bilgileri registry'ye işler. Çözüm zincirinde aktif rolü yoktur, konfigürasyon kapısının kendisidir.

## Resolver sahaya ne zaman iner?

İşin gerçekten yapıldığı yer recursive resolver'dır. Tarayıcı `api.example.com` için IP ister, resolver şu akışla çalışır:

1. Cache’e bakar, varsa direkt döner.
2. Yoksa root’a sorar: “.com nerede?”
3. TLD'ye sorar: “example.com hangi name server’da?”
4. Authoritative DNS'ye gider ve “api.example.com’un IP’si ne?” der.
5. Cevabı alır, cache’ler, kullanıcıya döner.

Resolver inatçıdır; zincirin tamamından kendi geçer, kimseye güvenmeden doğrular.

## Authoritative DNS son sözü söyler

Zincirin sonunda authoritative DNS vardır ve gerçekten `api.example.com → 172.x.x.x` gibi kayıtlar burada tutulur. Resolver bu cevabı aldıktan sonra sorgu biter, tekrar yukarı çıkmaz.

## Registry ve resolver neden karışıyor?

Her ikisi de “DNS tarafı” diyerek aynı sepete atılsa da roller farklıdır:

* **Registry:** “Bu domain'in yetkili DNS'i nerede?”
* **Resolver:** “Bu domain'in IP'si ne?”

Registry defter gibi, resolver ise araştırmacı gibi davranır.

## DNSSEC zincire nasıl ekleniyor?

DNSSEC root → TLD → domain arasında “Bu bilgi yetkili yerden mi geldi?” sorusunu kriptografik olarak yanıtlar. Güvenin başlangıç noktası ICANN/IANA tarafındaki root anahtarıdır. ICANN sahaya hâlâ inmez ama zincirin güvenini başlatır.

## Toparlarsak

* ICANN DNS çözmez; yetkiyi tanımlar.
* Registry IP tutmaz; NS tutar.
* Resolver işi yapan taraftır.
* DNS tamamen yetki devri mantığıyla çalışır.
* En sonda authoritative DNS vardır ve gerçek kayıtlar oradadır.

Merkezi değil ama dağınık da olmayan, kontrollü bir kaos. DNS'in güzelliği de tam burada.
