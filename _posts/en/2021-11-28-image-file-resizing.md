---
layout: post
title: "Image file resizing"
date: 2021-11-28
description: "A brief technical note outlining the basic approach and applicable steps for image file resizing."
categories: SYS
lang: en-US
translation_key: "image-dosyas-boyutlandirma-52b3c4b3"
permalink: /en/2021/11/28/image-file-resizing.html
---

Sometimes we have an image file (such as .img) and we may need to increase its size. In these cases, we can follow the steps below. Our image file is a raspberry os image file.

We are installing the following applications. I used Raspberry Pi Lite OS while doing these steps. These steps worked without any problems.

```sh
sudo apt install qemu-utils qemu-system-arm unzip lsof

```

We make the first check and learn the size information.
```sh
kpartx -a -v <img file>
mount /dev/mapper/loop0p2 /mnt
df -h

```


We close the image file with kpartx and unmount it. 
```sh
umount /mnt
kpartx -d <img file>

```


We check if image is used
```sh

lsof <img file>
```

We are doing the resize process

```sh
qemu-img resize <img file> +1G

```
we reboot 

We open the image file with kpart

```sh
kpartx -a -v <img file>

```

We open the file with fdisk and edit the partiton.
```sh
fdisk -l <img file>
fdisk <img file>
```

we reboot and edit the file system

```sh
e2fsck -f /dev/mapper/loop0p2 ## burada kendi loop dosyanızı gösterin

resize2fs /dev/mapper/loop0p2  ## burada kendi loop dosyanızı gösterin


```

We Check the Change

```sh
mount /dev/mapper/loop0p2 /mnt
df -h
```


[Source](https://univers-libre.net/posts/extend-disk-image.html)
