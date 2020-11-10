---
layout: post
title: "Batch File ile winrar kullanarak dosya sıkıştırma işlemi"
categories: shell
---
Batch file ile winrar kullanarak klasör sıkıştırma işlemi yapmak için aşağıdaki komutlar işinizi görebilir dosya adreslerin kendinize göre düzenleyin

C:
```shell
cd\

cd C:\Program Files (x86)\WinRAR

rar a  -r "D:\test\Backup_%DATE:~7,2%-%DATE:~4,2%-%DATE:~-4%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~-5,2% .rar"  "D:\test\testdirectory"

```