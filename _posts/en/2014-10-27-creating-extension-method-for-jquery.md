---
layout: post
title: "Creating extension method for jquery"
date: 2014-10-27
description: "A brief technical note outlining the basic approach and applicable steps for creating extension methods for jquery."
categories: javascript
lang: en-US
translation_key: "jquery-icin-extension-method-olusturma-861114ff"
permalink: /en/2014/10/27/creating-extension-method-for-jquery.html
---

To create your own custom methods for jQuery, you can write a function as follows:

```javascript
jQuery.fn.icerik = function (options) {
            var defaultSettings = {
                 etiket:"Test Metni"
                },

            var options1= jQuery.extend({}, defaultSettings, options);

            alert(options1.etiket + " : " jQuery(this).text());
        }

```
Usage:
```javascript
jQuery("#testDiv").icerik();


```

Note: If you use it as "jQuery.fn.functionName", it will be called after the selector (jQuery("#testDiv").functionName()), if you use it as jQuery.functionName, it will be called directly as jQuery.functionName().
