---
layout: post
title: "Javascript ile dinamik json objesi oluşturma"
categories: javascript
lang: tr-TR
description: "Javascript ile dinamik json objesi oluşturma konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "javascript-ile-dinamik-json-objesi-olusturma-b5a6f986"
---

Javasript programlama yaparken çalışma esnasında ki verilere göre json objesi oluşturmak isteyebilirsiniz bunun için aşağıdaki kod yardımcı olacaktır

```javascript

var jsonData = {}; //Json Object

//jsonData objesine erişebildiğiniz her yerde doğrudan

jsonData["SutunAdi"] = "deneme";

//şeklinde yeni bir sütun ve değer ekleyebilirsiniz

```
