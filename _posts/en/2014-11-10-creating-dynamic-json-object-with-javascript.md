---
layout: post
title: "Creating dynamic json object with Javascript"
date: 2014-11-10
description: "A short technical note outlining the basic approach and applicable steps for creating a dynamic json object with javascript."
categories: javascript
lang: en-US
translation_key: "javascript-ile-dinamik-json-objesi-olusturma-b5a6f986"
permalink: /en/2014/11/10/creating-dynamic-json-object-with-javascript.html
---

While programming in Javascript, you may want to create a json object according to the data during the run, the following code will help you.

```javascript

var jsonData = {}; //Json Object

//jsonData objesine erişebildiğiniz her yerde doğrudan

jsonData["SutunAdi"] = "deneme";

//şeklinde yeni bir sütun ve değer ekleyebilirsiniz

```
