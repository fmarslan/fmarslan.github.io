---
layout: post
title: "Benim Geliştirme Ortamım: Hafif, Taşınabilir ve Sade Bir Yaklaşım"
date: 2025-12-01 09:00:00 +0300
description: Nerede olursam olayım aynı verimle üretmemi sağlayan devcontainer merkezli, test odaklı ve AI destekli geliştirme düzenim.
image: /assets/img/connected-to-dev-container.png
tags:
  - devcontainer
  - developer-experience
  - workflow
  - testing
  - vs-code
---

Bir geliştirici olarak yıllar içinde fark ettim ki, benim için en iyi çalışma ortamı **hafif**, **parçalı**, **taşınabilir** ve **temiz** olan. Yerel makinemde dev ortamı kurup karmaşık bağımlılık yığınlarıyla boğuşmak istemiyorum. Bunun yerine, nerede olursam olayım aynı konforu sağlayan, sade ama güçlü bir ekosistem kurdum.

Aşağıda kullandığım yaklaşımı ve neden bana bu kadar iyi geldiğini anlattım. Her şey çok doğal bir şekilde kendi yolunu bulmuş gibi; zorlamadan, gereksiz ağırlık olmadan, sade ama verimli bir düzen.

![Devcontainer bağlantısı](/assets/img/connected-to-dev-container.png)

## Devcontainer: Olmazsa Olmazım

Artık herhangi bir projeye başlamadan önce ilk refleksim devcontainer açmak.  
Yerel makinem tertemiz kalıyor, bağımlılıklar makineye yayılmıyor, projenin kendi kutusunda yaşıyor.

* Her proje kendi dünyasında
* Makinem dağılmıyor
* Nerede olursam olayım aynı ortamı birkaç saniyede ayağa kaldırıyorum

Gerçek anlamda *mobil* bir development ortamı.

## Unit Test ile Geliştirme: Input’u Test Yazsın

Feature geliştirirken mümkün olduğunca “test driven” bir yaklaşım izlemeye çalışıyorum ama katı değil; doğal bir şekilde gelişiyor.

Ben sadece kodu yazıyorum,  
**input’u unit test veriyor**  
**çıktıyı unit test kontrol ediyor**

Ben sadece aradaki boşluğu dolduruyorum.

Bu da hem:

* daha güçlü bir mimariyi,
* regresyon derdi olmadan ilerlemeyi,
* daha güvenli kod üretmeyi

kendiliğinden getiriyor.

## IDE İçinde AI: Copilot, Codex ve Arkadaşları

Google araması, StackOverflow gezintileri…  
Eskiden gerekliydi, artık değil.

IDE içinde bir Copilot, Codex veya benzeri bir destek varsa:

* Kodu öneriyor
* Boşlukları dolduruyor
* Copy-paste işlerini sizin yerinize yapıyor

Benim için hafif ama güçlü bir “ikinci geliştirici” gibi.

## VSCode: Basit Bir Editörle Her Şey

Ağır IDE’lere ihtiyaç duymuyorum.  
Benim için VSCode tam ideal noktada:

* Hafif
* Hızlı
* Göz yormuyor
* Her yere entegre olabiliyor

Devcontainers, testler, AI araçları, uzaktan bağlantılar… hepsiyle problemsiz çalışıyor.

## Kazanımlar:

Bu yaklaşım bana kendiliğinden şu avantajları sağladı:

* **Test odaklı bir geliştirme kültürü** doğal olarak gelişti
* Bilgisayarım kirlenmiyor
* Ortamım tamamen taşınabilir
* Şifre, anahtar, token gibi güvenlik bilgileri izole ve güvenli
* Mimaride in-memory bus, queue, s3, db vb yapıları kurduysam komple CI-ready mini bir dünya oluyor

Kısacası:  
**Tek makinede dağınık bir dünya yerine; temiz, izole ve taşınabilir küçük evrenler kuruyorum.**

Bu da hem verimi artırıyor hem de geliştirmenin zevkini kaçırmadan odaklanmamı sağlıyor.

## Favori Müzik Listem

Tabii müziksiz olmaz; günün temposunu bu liste belirliyor. Bu düzenin arka planında çoğunlukla aynı liste dönüyor: [YouTube Music playlistim](https://music.youtube.com/playlist?list=PL8kybMjTGhNvAXK5AsuDEHrl0jBjFF22p&si=LamvqwFlce70ziJd). Fokus moduna geçince açıyorum ve kod bitene kadar kapatmıyorum.
