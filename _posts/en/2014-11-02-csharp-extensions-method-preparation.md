---
layout: post
title: "CSharp Extensions method preparation"
date: 2014-11-02
description: "A brief technical note outlining the basic approach and applicable steps for CSharp Extensions method preparation."
categories: csharp
lang: en-US
translation_key: "csharp-extensions-metod-hazirlama-3063716e"
permalink: /en/2014/11/02/csharp-extensions-method-preparation.html
---

In C#, sometimes you may want to write an extension method to your own classes or any ready-made data type to make writing code easier. For this reason, if you edit and write the following code in any class according to your own, you can use it in the namespace to which that class belongs or in all classes included in that name space. It doesn't matter what class you add, I still recommend that you collect these types of methods under the same roof.

For those who don't know, when writing Extension method code, add "." after any object. It is used to add your own method to the menu list that opens when you put

example
```csharp
int a =5;
a.Topla(6);//extension metod
//11
```

```csharp

public static int Topla(this int sayi,int eklenecekSayi)
        {
            return sayi+eklenecekSayi;
        }
```
