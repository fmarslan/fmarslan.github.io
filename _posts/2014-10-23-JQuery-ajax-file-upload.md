Eğer birgün JQuery ajax ile dosya upload etmek isterseniz aşağıdaki gibi bir kodu input file nesnesinin change metodunda çalıştırarak yapabilirsiniz

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
