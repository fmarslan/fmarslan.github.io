---
layout: post
title: "Taking a Picture of a Web Page"
date: 2015-06-12
description: "A brief technical note outlining the basic approach and applicable steps for Capturing a Web Page."
categories: javascript
lang: en-US
translation_key: "web-sayfasinin-resmini-cekme-46bc0598"
permalink: /en/2015/06/12/taking-a-picture-of-a-web-page.html
---

Add the Html2Canvas library and jQuery library to your site, then you can capture the screenshot with the code below.

```javascript

html2canvas(document.body, {
   allowTaint : true,
   logging : false,
   taintTest : false,
   onrendered : function(canvas) {
    //ekran görüntüsünü base64 olarak consola yazdırır
    console.log(canvas.toDataURL());
    });
   }
  });
```
