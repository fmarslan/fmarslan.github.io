---
layout: post
title: "Windows 8 login password sıfırlama"
categories: windows
lang: tr-TR
description: "Windows 8 login password sıfırlama konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "windows-8-logi-password-sifirlama-58465306"
permalink: /windows/2014/11/09/windows-8-logi-password-sifirlama.html
---

Windows 8 login şifresini sıfırlamak istediğiniz zaman aşağıdaki adımları takip edin


Bilgisayarınızı herhangi bir NTFS komut sistemi desteği olan yazılım ile başlatınız. (Örn. Hiren Boot, Windows recovery)

Windows yüklü olan dizinde system 32 altında Utilman.exe dosyasının ismini UtilmanCopy.exe olarak değiştirin.

Cmd.exe dosyasının adını Utilman.exe olarak değiştirin.

Bilgisayarı yeniden başlatın. Windows ile açın.

Login ekranı gelince sol altta bulunan erişebilirlik butonuna tıklayın. Komut sistemi açılacaktır.

{ net user deneme  abc123 /ADD } komutunu çalıştırın

{ net users deneme /active:yes } komutunu çalıştırın

Bilgisayarı yeniden başlatın

Deneme isminde yeni bir kullanıcı eklenmiş olması gerekiyor. bu kullanıcını şifresi "abc123" şeklindedir deneme kullnıcısında oturum açın.

Mevcut kullanıcınızın şifresini istediğiniz gibi değiştirin



kolay gelsin ....
