---
layout: post
title: "javascript ile base64"
categories: javascript
---

Sayfanızda bulunan resim üzerine tıklayınca resim değiştirip yeni resmi ajax ile sunucuya kaydetmek isterseniz aşağıdaki kod işinizi görecektir.

Html
```html
<img id="image" src="" style="min-width:100px;min-height:100px;">
<input type="file id="update"/>
```
Script
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
