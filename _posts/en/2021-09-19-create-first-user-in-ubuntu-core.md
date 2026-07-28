---
layout: post
title: "Create first User in Ubuntu Core"
date: 2021-09-19
description: "A short technical note outlining the basic approach and applicable steps for creating an Ubuntu Core initial User."
categories: ubuntu
lang: en-US
translation_key: "ubuntu-core-ilk-kullanici-olusturma-f9cca2e9"
permalink: /en/2021/09/19/create-first-user-in-ubuntu-core.html
---

1. Let's create an account at https://login.ubuntu.com/
2. Let's create ssh key as follows
 ```sh
  mkdir ~/.ssh
  chmod 700 ~/.ssh
  ssh-keygen -t rsa
 ```
3. Let's copy the content of ~/.ssh/id_rsa.pub and add https://login.ubuntu.com/ssh-keys here
4. Let's follow the steps as indicated on the Ubuntu Core screen and connect remotely via SSH.
5. Let's create our user as ```sudo adduser --extrausers <kullanıcı adı>```
