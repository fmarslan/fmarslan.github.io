---
layout: post
title: "Add script to your page at run time"
date: 2014-10-27
description: "A short technical note outlining the basic approach and applicable steps for adding scripts to your page at runtime."
categories: javascript
lang: en-US
translation_key: "calisma-aninda-sayfaniza-script-ekleyin-77153170"
permalink: /en/2014/10/27/add-script-to-your-page-at-run-time.html
---

You can use the following function to add scripts to your page while working on the client.

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
Usage:
```javascript
includeScriptFile("mydomain.com/script.js",function(){alert("script Yüklendi.");})
```
