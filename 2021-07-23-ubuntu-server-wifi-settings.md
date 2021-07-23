---
layout: post
title: "Ubuntu Wifi Ayarları"
categories: system
---

1. adım da mevcut network donanımını kontrol edelim ismini öğrenelim

``` sh
$ ls /sys/class/net
  eth0 lo wlan0
```

2. network config dosyasını kontrol edelim

```sh

$ ls /etc/netplan
  50-cloud-init.yaml

```

3. wifi network kaydını yapalım


```sh

$ sudo edit /etc/netplan/50-cloud-init.yaml

```

dosya içeriğine yapılacak ekleme

```sh
network:
    wifis:
        wlan0:
            optional: true
            dhcp4: true
            access-points:
                "<WIFI SSID>":
                    password: "<WIFI Password>"
            
```

ayarları uyguluyoruz

```sh
$ sudo netplan apply
$ sudo reboot
```

yeniden başladıktan sonra eğer wifi bilgileriniz doğru ve wifi access point açık ise bağlantı sağlanacaktır.
