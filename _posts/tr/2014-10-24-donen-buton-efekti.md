---
layout: post
title: "Dönen buton efekti"
categories: javascript
lang: tr-TR
description: "Dönen buton efekti konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "donen-buton-efekti-dd40eafa"
permalink: /javascript/2014/10/24/donen-buton-efekti.html
---

Mouse button üzerine gelince dönme efekti vermek için aşağıdaki kod işe yarayabilir

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
