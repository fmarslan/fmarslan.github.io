---
layout: post
title: "Patroni Komutlar"
categories: patroni
lang: tr-TR
description: "Patroni Komutlar konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "patroni-replica-reinit-a33ebe95"
permalink: /patroni/2021/11/26/patroni-replica-reinit.html
---

Patroni kümesindeki replikaları listelemek ve sorunlu bir replikayı yeniden başlatmak için aşağıdaki kısa komutları kullanabilirsiniz.

Önce küme durumunu kontrol edin, ardından küme ve düğüm adını belirterek `reinit` komutunu çalıştırın:

```sh

patronictl list

patronictl reinit clustername nodename

```
