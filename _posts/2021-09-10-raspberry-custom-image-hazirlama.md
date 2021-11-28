---
layout: post
title: "Raspberry pi Özelleştirilmiş Image Hazırlama"
categories: raspberry
---

Bazen yaptığımız yazılımlarda veya başka bir sebepten işletim sistemi kurulum imagelarının içerisine müdahale ederek bazı ayarların yapılı gelmesi veya uygulamaların kurulu hazır bir şekilde gelmesini isteyebiliriz. Bu durumda izlememiz gereken adımları bu yazı da raspberry için anlatacağım bir çok linux image içinde aynı veya benzer yöntemler geçerli olacaktır. İşlemler için linux işletim sistemi kullanacağız.


**1. Adım**
Düzelteceğimiz image dosyasını indirip .img halinde bir dosyaya alıyoruz.

**2. Adım**
kpartx uygulaması kurulu değilse kuruyoruz

**3. Adım**
```sh 
sudo kpartx -av 2021-03-04-raspios-buster-armhf-lite.img
```
**4. Adım**
```sh 
sudo mkdir /newimage
```

**5. Adım**
```sh 
sudo mount -t ext4 -o loop /dev/mapper/loop8p2 /newimage/
```

**6. Adım**
```sh 
sudo chroot /newimage
```

artık ieçrideyiz :) istediğimiz gibi image üzerinde çalışma yapabiliriz. Bu açılan terminal image içindeki işletim sistmeine ait sanki aktif olarak kullanıyormuşsunuz gibi ihtiyacınız olan tüm yapılandırmaları ekleyebilirsiniz.

işlemimiz bittikten sonra img dosyasını aşağıdkai gibi kapatmamız yerinde olacaktır.

```sh 
apt clean all & apt cache clear
```
sonra ``CTRL`` + ``D`` tuş kombinasyonu ile terminali kapatalım 

```sh 
sudo umount /newimage
```

işlemlerimiz bittiyse image dosyamız hazır kullanabiliriz.

Eğer ihtiyaç olursa raspberry image boyutu artırmak için 

```sh
sudo apt install qemu-utils qemu-system-arm unzip lsof

# image kullanılıyormu
lsof $img

qemu-img resize $img +1G

reboot 

kpartx -a -v $img

## fdisk partition progress

reboot

```


**Önemli not!!**
Çalışılan işletim sistemi ile kullandığınız işletim sistemi aynı işlemci türünde derlenmiş olmalı bu örnekte benim yine başka bir raspberry üzerinde yaptığım için sorun yaşamadım ama bir linux desktop üzerinde yapmış olsaydım yöntemler bu şekilde çalışmayacaktır.
