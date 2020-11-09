---
layout: post
title: "Timeout Javascript"
categories: javascript
---
Sayfanıza time out için zaman sayacı koymak isteyenler aşağıdaki kodu düzenleyebilirler 

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
