---
layout: post
title: "Dönen buton efekti"
categories: javascript
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
