---
layout: post
title: "JQuery Ajax File Upload"
date: 2014-10-23
description: "A brief technical note outlining the basic approach and applicable steps on jQuery Ajax File Upload."
categories: javascript
lang: en-US
translation_key: "jquery-ajax-file-upload-cf292745"
permalink: /en/2014/10/23/jquery-ajax-file-upload.html
---

If you want to upload a file with JQuery ajax one day, you can do it by running a code like the one below in the change method of the input file object.

```javascript
var data = new FormData();
    data.append('uploadFile', item.files[0]);
    jQuery.ajax({
        type : 'post',
        url : /upload?name=' + item.files[0].name,
        data : data,
        cache : false,
        contentType : false,
        processData : false,
        success : function(d) {

        },
        xhrFields : {
            onprogress : function(progress) {
                var percentage = Math
                        .floor((progress.total / progress.totalSize) * 100);
                console.log('progress', percentage);
                if (percentage === 100) {
                    console.log('Yükleme Tamamlandı');
                }
            }
        },
        error : function(d) {
            console.log("Dosya yüklenemedi");
            console.log(d);
        }     });
```
