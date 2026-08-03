---
layout: post
title: "Spinning button effect"
date: 2014-10-24
description: "A brief technical note outlining the basic approach and applicable steps for the carousel button effect."
categories: javascript
lang: en-US
translation_key: "donen-buton-efekti-dd40eafa"
permalink: /en/2014/10/24/spinning-button-effect.html
---

The following code may be useful to give a rotation effect when the mouse button is hovered over.

```javascript
// Internet Explorer versyonunu öğrenmek için
function getIntenrnetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

//Efekt içi
jQuery("div#button").mouseleave(function() {
    if ((getInternetExplorerVersion() == -1) || (getInternetExplorerVersion() > 8)) {
        jQuery(this).find("div.image").stop(true, true).delay(300).animate({
            rotate: '0deg'
        }, 400, "easeOutCubic");
    }
}).mouseenter(function() {
    if ((getInternetExplorerVersion() == -1) || (getInternetExplorerVersion() > 8)) {
        jQuery(this).find("div.image").stop(true, true).delay(300).animate({
            rotate: '50deg'
        }, 400, "easeOutCubic");
    }

});
```
