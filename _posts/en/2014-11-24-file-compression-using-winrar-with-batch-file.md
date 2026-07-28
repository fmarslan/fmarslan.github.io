---
layout: post
title: "File compression using winrar with Batch File"
date: 2014-11-24
description: "A brief technical note outlining the basic approach and applicable steps for compressing files using winrar with Batch File."
categories: shell
lang: en-US
translation_key: "batch-file-ile-winrar-kullanarak-dosya-sikistirma-islemi-2b54c8b5"
permalink: /en/2014/11/24/file-compression-using-winrar-with-batch-file.html
---

To compress a folder using winrar with batch file, the following commands may be useful. Arrange the file addresses according to your needs.


```shell
C:

cd\

cd C:\Program Files (x86)\WinRAR

rar a  -r "D:\test\Backup_%DATE:~7,2%-%DATE:~4,2%-%DATE:~-4%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~-5,2% .rar"  "D:\test\testdirectory"

```
