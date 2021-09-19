---
title: "Ubuntu Core ilk Kullanıcı oluşturma"
layout: post
categories: ubuntu
---

1. https://login.ubuntu.com/ adresinde hesap oluşturalım
2. Aşağıdaki şekilde ssh key oluşturalım
 ```sh
  mkdir ~/.ssh
  chmod 700 ~/.ssh
  ssh-keygen -t rsa
 ```
3. ~/.ssh/id_rsa.pub içeriğini kopyalayıp https://login.ubuntu.com/ssh-keys buraya ekleyelim
4. ubuntu core ekranında belirttiği şekilde adımları takip edip uzaktan ssh ile bağlantımızı sağlayalım
5. ```sudo adduser --extrausers <kullanıcı adı>``` şeklinde kullanıcımızı oluşturalım


