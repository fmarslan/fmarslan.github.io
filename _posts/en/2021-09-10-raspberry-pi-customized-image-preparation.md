---
layout: post
title: "Raspberry pi Customized Image Preparation"
date: 2021-09-10
description: "A brief technical note outlining the basic approach and applicable steps for Raspberry pi Customized Image Preparation."
categories: raspberry
lang: en-US
translation_key: "raspberry-custom-image-hazirlama-5ca7180d"
permalink: /en/2021/09/10/raspberry-pi-customized-image-preparation.html
---

Sometimes, in the software we make or for another reason, we may intervene in the operating system installation images and request that some settings be configured or applications come ready-installed. In this case, I will explain the steps we need to follow in this article for Raspberry, the same or similar methods will be valid for many Linux images. We will use Linux operating system for operations.


**1. Step**
We download the image file we will correct and save it as an .img file.

**2. Step**
If the kpartx application is not installed, we install it

**3. Step**
```sh 
sudo kpartx -av 2021-03-04-raspios-buster-armhf-lite.img
```
**4. Step**
```sh 
sudo mkdir /newimage
```

**5. Step**
```sh 
sudo mount -t ext4 -o loop /dev/mapper/loop8p2 /newimage/
```

**6. Step**
```sh 
sudo chroot /newimage
```

We are inside now :) we can work on the image as we wish. You can add all the configurations you need for the operating system in this opened terminal image as if you were actively using it.

After completing the process, it would be appropriate to close the img file as follows.

```sh 
apt clean all & apt cache clear
```
Then let's close the terminal with the key combination ``CTRL`` + ``D`` 

```sh 
sudo umount /newimage
```

If our processes are completed, our image file is ready and we can use it.


**Important note!!**
The operating system you are using and the operating system you are using must be compiled on the same processor type. In this example, I did not have any problems because I did it on another Raspberry, but if I had done it on a Linux desktop, the methods would not work this way.
