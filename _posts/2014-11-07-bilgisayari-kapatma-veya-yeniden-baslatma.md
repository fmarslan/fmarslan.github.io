---
layout: post
title: "Bilgisayar Kapatma veya yeniden başlatma"
categories: Windows
lang: tr-TR
description: "Bilgisayar Kapatma veya yeniden başlatma konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "bilgisayari-kapatma-veya-yeniden-baslatma-34ace1f4"
---

Bilgisayarı command line üzerinden veya yazılımla yeniden başlatıp kapatabilmek için

Shutdown.exe yi aşağıdaki parametreler ile ihtiyacınıza göre çalıştırmanız gerekmektedir

Parametreler

```sh
Shutdown.exe = komut
-s => Kapat
-r => Yeniden Başlat
-t 00 => 00 işlem başlamadan geçecek süreyi belirtiyor. Bu parametreyi hiç yazmazsak 30 saniye sonra işlem başlar
```
