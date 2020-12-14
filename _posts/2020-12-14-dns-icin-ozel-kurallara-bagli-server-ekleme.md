---
layout: post
title: DNSleriniz İçin Koşullu Sunucu Yönlendirmesi
category: DNS
---

xx.fmarslan domain adreslerini çözebilmek için sadece bu dns sorgularını kendi sunucumuza yönlendirmek isteyebiliriz. Burada önemli nokta isme özel farklı dns sunucusuna yönlendirme işlemi yapmaktır. Bu işlemleri yaptığımızda ``mywebsite.fmarslan`` domaini kendi sunucumuzda ip adres yönlendirmesi yapılarak çözülecektir.

### Windows ([Detay](https://docs.microsoft.com/en-us/powershell/module/dnsclient/?view=win10-ps))

PowerShell

```sh
# tanımlı kural listesini almak için 
Get-DnsClientNrptRule

# ekleme yapmak için
Add-DnsClientNrptRule -Namespace ".fmarslan" -NameServers "10.8.0.1"

#Silmek için Get ile önce sileceğimiz kuralın ismini buluyoruz sonra aşağıdaki komut ile siliyoruz
Remove-DnsClientNrptRule -Name "{4A9B924F-A8AD-46EB-A4D3-5B4B0E8CB044}"

```

### Mac & Linux

```sh
sudo  echo 10.8.1.1 > /etc/resolver/.fmarslan
```

