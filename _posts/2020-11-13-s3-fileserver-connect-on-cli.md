---
title: S3 Server Kullanımı ve Bağlantı Sağlama
category: tools, fileserver
---

### S3 Server Nasıl çalışır.

S3 server git mantığı ile çalışır her bir repo için bir bucket diyebiliriz aynı şekilde istediğiniz kadar alt altta klasör oluşturduğunuzu düşünün(sadece gösterimden ibaret)  bu kısım sadece prefix gibi çalışır. Örnek mys3 bucket oluşturdunuz altına 10 tane klasör oluşturup her birine bir dosya attınız bucket içinde 10 dosya vardır 

```
mys3/a/1
mys3/b/2
mys3/c/3
mys3/d/4
mys3/e/5
mys3/f/6
mys3/g/7
mys3/g/8
mys3/g/9
mys3/g/10
```
bu gösterim

```
mys3/a-1
mys3/b-2
mys3/c-3
mys3/d-4
mys3/e-5
mys3/f-6
mys3/g-7
mys3/g-8
mys3/g-9
mys3/g-10
```

bununla aynı anlama gelir mys3 içinde kaç dosya var dediğimizde 10 dosya vardır ama gösterime bakarsan 7 klasör var gibi görünür. bu bilgiden sonraki nokta şurasıdır özellikle prefix ile veya bucket içindeki tüm dosya listesini alacaksanız böyle bir ihtiyacınız var ise performans için bucket içinde dosya sayısını az tutmanızda fayda var bucket sayısının çok önemi yoktur. 

Her bir bcuket bir tablo gibi düşünürseniz select attığınızda tabloda kayıt ne akdar az ise o kadar performanslı sonuç alırsınız.


### Bağlantı

Bağlantı için birde fazla s3 client var istediğinizi kullanaiblirsiniz benim tercihim Minio mc şeklinde oldu [buradan](https://docs.min.io/docs/minio-client-quickstart-guide.html) kurulumuna bakabilirsiniz


```sh
$ wget https://dl.min.io/client/mc/release/linux-amd64/mc
# chmod +x mc
$ ./mc --version
  mc version RELEASE.2020-10-03T02-54-56Z

```

Kurulumdan sonra configleri kolay kullanım için alias tanımlayabiliriz

mc alias set <ALIAS> <YOUR-S3-ENDPOINT> <YOUR-ACCESS-KEY> <YOUR-SECRET-KEY> --api <API-SIGNATURE> --path <BUCKET-LOOKUP-TYPE>

```sh
$ mc alias set mys3 https://s3.fmarslan.com
```

bucket create ***mb*** command

```sh
./mc mb mys3/firstBucket
```
file upload ***cp*** command

```sh
$ ./mc cp ./{uploadfilepath} mys3/firstbucket
```

file list ***ls*** command

```sh
$ ./mc ls mys3/firstbucket
```

file remove ***rm*** command

```sh
$  ./mc rm mys3/firstbucket/mc
```

bucket remove ***rb*** command

```sh
$  ./mc rb mys3/firstbucket/
```
