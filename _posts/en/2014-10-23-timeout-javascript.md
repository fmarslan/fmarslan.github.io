---
layout: post
title: "timeout javascript"
date: 2014-10-23
description: "A short technical note on Timeout Javascript, outlining the basic approach and actionable steps."
categories: javascript
lang: en-US
translation_key: "timeout-javascript-51168349"
permalink: /en/2014/10/23/timeout-javascript.html
---

Those who want to put a timer on your page for time out can edit the code below. 

```javascript
var c = 0;
var maxC = 6000;
var waitingMaxC = 18000;
function timedCount() {
    c = c + 1;
    if (c == maxC) {
        if (confirm("Uzun süre işlem yapmadığınız için oturumunuz kapatılacaktır. <br/>Oturumu sürdürmek istiyormusunuz ?")) {
            c = 0;
        } else {
            location.href = "/";
        }
    }
    if (c == waitingMaxC) {
        location.href = "/";
    }
    t = setTimeout("timedCount()", 1000);
}
```
