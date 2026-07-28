---
layout: post
title: "Web Sayfasının Resmini Çekme"
categories: javascript
lang: tr-TR
description: "Web Sayfasının Resmini Çekme konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "web-sayfasinin-resmini-cekme-46bc0598"
---

Html2Canvas kütüphanesini ve jQuery kütüphanesini sitenize ekleyin sonrasında aşağıdaki kod ile ekran görünütüsünü yakalayabilirsiniz.

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
