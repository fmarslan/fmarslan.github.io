---
layout: post
title: Kubernete Deployment Hazırlama
categories: kubernete
---

Kubernete ile deployment nasıl yapılır temel olarak bir uygulama yapacağız. İlk adım olarak öncelikle deploy edeceğimiz uygulamayı tanımak ve belkide hakim olmak yerine göre önem arzetmektedir, ben basit olması sebebiyle nginx tercih ettim sadece boş bir nginx server ayağa kaldıracağız uygulama eklemeyeceğiz belki daha sonra başka bir dökümanda deploy aşamasını yer verebilirim buyrun başlayalım.

Deployment için öncelikle bir yaml hazırlıyoruz ve bu hazırladığımız yaml dosyalarını git gibi bir konumda saklamanızı öneririm bunun size öncelikil 2 faydası olacaktır

- konfigurasyon dosyasnızın verisonlarını takip edebilirsiniz.
- tekrardan sileceğiniz veya değşiklik yapacağınız zaman elinizin altında konfigurasyon dosyanız hazır oalcaktır sadece değişikliği yapıp apply etmeniz yeterli olacaktır.


playground isminde bir namespace oluşturuyoruz.

```sh
kubectl create ns playground

```
nginx yaml dosyası bu kısımda bir deployment olacak birde bu deployment a erişim için tanımlayacağımız ip ve gerekirse önünde loadbalancer işini görecek servis katmanını tanımlaması yapacağız. aşağıdaki yaml dosyasını kendinize göre ayarlayıp bi isim verin örnek nginx.yaml gibi.

```yaml
apiVersion: apps/v1beta2 # version bildirimi
kind: Deployment # deploy edilecek nesne tipi
metadata:
  namespace: playground  # namespace
  name: nginx-app # uygulama adı
spec:
  selector:
    matchLabels:
      app: myapp # daha kolay seçim için label ekleme bu şekilde istediğimiz obje veya deploymentları gruplayabiliriz.
  replicas: 1 # replica sayısı
  template:
    metadata:
      labels:
        app: myapp # label
    spec:
      containers:
      - name: nginx # deployment ismi
        image: nginx:1.14.2 # kullanılacak docker image
        ports:
        - containerPort: 80 # containerda çalışacak port
          name: nginx-port # port adı
---
kind: Service 
apiVersion: v1
metadata:
  name: app
  namespace: playground
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80 # uygulammızın çalışacağı port
    name: nginx-port
    targetPort: nginx-port # yukarıda tanımladığımız portadına yönlendirme işlemini yapıyoruz.

```

aşağıdaki şekilde apply ediyoruz

```sh
kubectl apply -f nginx.yaml

```

şimdi durumu kontrol ediyoruz

```sh
kubectl -n playground get all
```

aşağıdaki şekilde çıktı vermeli

```sh
NAME                             READY   STATUS    RESTARTS   AGE
pod/nginx-app-746d97db4d-cpczr   1/1     Running   0          5s

NAME          TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
service/app   ClusterIP   10.98.63.85   <none>        80/TCP    5s

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-app   1/1     1            1           5s

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-app-746d97db4d   1         1         1       5s
```

burada ```deployment.``` şeklinde başlayan bizim yaptığımız deployment configurasyonu ```pod/``` şeklinde başlayan bu konfigurasyona göre çalışmış olan instance ```service/``` şeklinde başlayan ise service configurasyonumuza göre çalışmış olan service nesnesidir. ```replicaset.``` şeklinde başlayanise git benzeri burada tutulan geçmiş konfigurasyon bilgisidir şuan ilk uygulamamız olduğunda ilk versiyonu var bunlar arasında geçiş yapılaiblir.


buradaki kubernete ipsine erişim olan bir makinadan service karşısında görülen 10.98.63.85 ip adresine istek yaptığınızda nginx sayfasını göreceksiniz.

Katkılar için [Kazım Sarıkaya'ya](https://srkykzm.com/) Teşekkürler
