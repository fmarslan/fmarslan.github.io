---
layout: post
title: "Json Object merge"
categories: java
---
Elinizde bulunan iki json objeyi karsılastırmak icin jQuery.extends metodunu kullanabilirsiniz
```java
jQuery.extend(true/false,object1,object2);
```
ilk parametre olan true/false degerini alabilen parametre true verilirse object2 uzerindeki fark property leri kalıcı olarak object1 uzerine ekler false verilirse ikisini birlestirip sonucu verir
