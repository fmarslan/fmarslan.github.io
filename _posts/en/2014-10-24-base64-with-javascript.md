---
layout: post
title: "base64 with javascript"
date: 2014-10-24
description: "A short technical note outlining the basic approach and applicable steps regarding base64 with javascript."
categories: javascript
lang: en-US
translation_key: "javascript-ile-base64-7a64b70e"
permalink: /en/2014/10/24/base64-with-javascript.html
---

If you want to change the image when you click on the image on your page and save the new image to the server with Ajax, the code below will work for you.

html
```html
<img id="image" src="" style="min-width:100px;min-height:100px;">
<input type="file id="update"/>
```
script
```javascript
  jQuery("input[type=file]#upload").change(function() {
    var container = this;
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("img#image").attr('src', e.target.result).show();
            $.ajax({
                    url: "/uploadImage",
                    cache: false,
                    data: {
                        icon: e.target.result.split(',')[1]
                    },
                    dataType: "json",
                    error: function(err) {
                        alert("Yükleme Tamamlanamadı");
                        console.log(err)
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
    }
}
});
jQuery("img#image").click(function() {
            jQuery(input[type = file]# update ").click();
            }); 
```
