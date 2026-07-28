---
layout: post
title: "Kubectl Commands"
date: 2020-11-14
description: "A short technical note on Kubectl Commands, outlining the basic approach and applicable steps."
categories: kubernate
lang: en-US
translation_key: "kubernete-kubectl-komutlari-43726dc0"
permalink: /en/2020/11/14/kubectl-commands.html
---

Kubectl Config Notification

```sh
export KUBECONFIG=/workspace/conf/mykube_conf
```

namespace operations
```sh
#oluşturmak için
kubectl create namespace mynamespace


#silmek için
kubectl delete namespace mynamespace

```


Pod Operations

```sh
#pod listesi
kubectl -n mynamespace get pod

#label a göre filtreli pod listesi
kubectl -n mynamespace get pod -l app=mylabel

#log
kubectl -n mynamespace logs -f myapp-deployment-78495789c9-szj6p

#pod silme label filtresi ile
kubectl -n mynamespace delete pod -l app=mylabel

#pod silme pod name ile
kubectl -n mynamespace delete pod/myapp-deployment-78495789c9-szj6p  #pod/ diyerek silerseniz sadece pod silinir kube yeniden otomaitk başlatır eğer deploy/ statefulset/ vb gibi silerseniz kalıcı olarak silinir.


#pod içinde bir dosyayı run etme
kubectl -n mynamespace exec -ti myapp-deployment-6fccc87578-jq2kb /mydata/mybatch.sh

#pod içine terminal bağlantısı
kubectl -n mynamespace exec -ti myapp-deployment-6fccc87578-jq2kb /bin/bash #veya /bin/sh

#pod replica sayısını değiştirme burada 0 yaparak kapatıyoruz 
kubectl -n mynamespace scale deployment/myapp-deployment --replicas=0

#PSQL poduna doğruda psql ile bağlanma
kubectl -n mynamespace exec -ti pod/mypsql-deployment-6fccc87578-jq2kb -- psql -U postgres

```
yaml file or view information
```sh

#secret yaml dosyasını görünütleme
kubectl -n mynamespace get secret/mydbdb-db-credentials   -o yaml

#pod deployment bilgisini görüntüleme
kubectl -n mynamespace describe pod/myapp-deployment-6fccc87578-jq2kb

```



Job manual start (can be cron job or norm job)

```sh

kubectl -n mynamespace create job --from=cronjob/myindexer-service myindexerservice

```

To set up new deployment/secret/service etc., first prepare the relevant yaml file.
```sh

#Oluşturmak için
kubectl apply -f myapp.yaml  # var olan yaml ı birdaha uygularsanız sadece değişiklikleri uygular

#Silmek için
kubectl delete -f myapp.yaml

```

kubernate dns

```sh
kubectl -n kube-system get cm coredns -o yaml
kubectl -n kube-system edit cm coredns --record
kubectl -n kube-system delete pod -l k8s-app=kube-dns
```

yaml check

```sh
kubectl -n <namespace> —dry-run=server apply ## server ile yaml farkını kontrol ediyor
kubectl -n <namespace> —dry-run=client apply ## yaml validate yapıyor
```


[https://kubernetes.io/docs/concepts/workloads/controllers/deployment/](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
