---
layout: post
title: "Jquery için extension method oluşturma"
categories: javascript
---
jQuery için kendi özel methodlarınızı oluşturmak için aşağıdaki şekilde fonksiyon yazabilirsiniz

```javascript
jQuery.fn.icerik = function (options) {
            var defaultSettings = {
                 etiket:"Test Metni"
                },

            var options1= jQuery.extend({}, defaultSettings, options);

            alert(options1.etiket + " : " jQuery(this).text());
        }

```
Kullanımı :
```javascript
jQuery("#testDiv").icerik();


```

Not: "jQuery.fn.functionName"  şeklinde kullanırsanız selector yazımından sonra çağrılır(jQuery("#testDiv").functionName()), jQuery.functionName şeklinde kullanırsanız doğrudan jQuery.functionName() şeklinde çağrılır.
