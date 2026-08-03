---
layout: post
title: "Json Object merge"
date: 2014-11-10
description: "A short technical note outlining the basic approach and applicable steps for Json Object merge."
categories: java
lang: en-US
translation_key: "json-object-merge-237c9e03"
permalink: /en/2014/11/10/json-object-merge.html
---

You can use the jQuery.extends method to compare the two json objects you have.
```java
jQuery.extend(true/false,object1,object2);
```
The first parameter, which can take the value true/false, if given true, will permanently add the difference properties on object2 to object1. If given false, it will combine the two and give the result.
