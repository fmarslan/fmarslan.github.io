---
layout: post
title: "Batch File ile winrar kullanarak dosya sıkıştırma işlemi"
categories: shell
lang: tr-TR
description: "Batch File ile winrar kullanarak dosya sıkıştırma işlemi konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "batch-file-ile-winrar-kullanarak-dosya-sikistirma-islemi-2b54c8b5"
---

Batch file ile winrar kullanarak klasör sıkıştırma işlemi yapmak için aşağıdaki komutlar işinizi görebilir dosya adreslerin kendinize göre düzenleyin


```shell
C:

cd\

cd C:\Program Files (x86)\WinRAR

rar a  -r "D:\test\Backup_%DATE:~7,2%-%DATE:~4,2%-%DATE:~-4%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~-5,2% .rar"  "D:\test\testdirectory"

```
