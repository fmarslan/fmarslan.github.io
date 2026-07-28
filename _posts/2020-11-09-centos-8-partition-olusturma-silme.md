---
layout: post
title: "Centos 8 partition oluşturma/silme"
categories: linux
lang: tr-TR
description: "Centos 8 partition oluşturma/silme konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "centos-8-partition-olusturma-silme-16708b51"
---

Sayfanıza time out için zaman sayacı koymak isteyenler aşağıdaki kodu düzenleyebilirler 

```sh
parted /dev/sda komutu ile mevcut partitionlar görüntülenir
```


Önemli Not: Bu kısımdan aşağıdaki komutlar anında diske uyuglanacaktır o yüzdne dikkatli yapılmasını öneririm 

```sh
mkpart <name> <start> <end> ile yeni partition oluşturulur
rm <listitem> ilgili partition siler
```

dosya formatlarından msdos 4 partition destekler gpt 128 tane destekler

