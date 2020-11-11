---
layout: post
title: "Çalışma anında sayfanıza script ekleyin"
categories: javascript
---
Client üzerinde çalışırken sayfanıza script ekleyebilmek için aşağıdaki fonksiyonu kullanabilirsiniz

```javascript
var includeScriptFile = function (url, onSuccess) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.charset = 'utf-8';
    if (onSuccess != null) {

        if (!isNaN(script.onload))
            script.onload = onSuccess;
        else {
            script.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') onSuccess();
            }
        }
    }
    head.appendChild(script);
}
```
Kullanımı :
```javascript
includeScriptFile("mydomain.com/script.js",function(){alert("script Yüklendi.");})
```
