---
layout: post
title: "Web Sayfasının Resmini Çekme"
categories: javascript
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