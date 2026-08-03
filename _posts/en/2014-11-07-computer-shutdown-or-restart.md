---
layout: post
title: "Computer Shutdown or restart"
date: 2014-11-07
description: "A brief technical note outlining the basic approach and applicable steps for shutting down or restarting a computer."
categories: Windows
lang: en-US
translation_key: "bilgisayari-kapatma-veya-yeniden-baslatma-34ace1f4"
permalink: /en/2014/11/07/computer-shutdown-or-restart.html
---

To restart and shut down the computer via command line or software

You need to run Shutdown.exe with the following parameters according to your needs.

Parameters

```sh
Shutdown.exe = komut
-s => Kapat
-r => Yeniden Başlat
-t 00 => 00 işlem başlamadan geçecek süreyi belirtiyor. Bu parametreyi hiç yazmazsak 30 saniye sonra işlem başlar
```
