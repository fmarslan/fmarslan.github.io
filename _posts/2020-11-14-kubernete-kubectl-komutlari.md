---
title: Kubectl Komutları
layout: post
categories: kubernate
---

Kubectl Config Bildirimi

```sh
export KUBECONFIG=/workspace/conf/mykube_conf
```
Pod İşlemleri

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
kubectl -n mynamespace delete pod/myapp-deployment-78495789c9-szj6p

#pod içinde bir dosyayı run etme
kubectl -n mynamespace exec -ti myapp-deployment-6fccc87578-jq2kb /mydata/mybatch.sh

#pod içine terminal bağlantısı
kubectl -n mynamespace exec -ti myapp-deployment-6fccc87578-jq2kb /bin/bash #veya /bin/sh

#pod replica sayısını değiştirme burada 0 yaparak kapatıyoruz 
kubectl -n mynamespace scale deployment/myapp-deployment --replicas=0

#PSQL poduna doğruda psql ile bağlanma
kubectl -n mynamespace exec -ti pod/mypsql-deployment-6fccc87578-jq2kb -- psql -U postgres

```
yaml dosyası veya bilgi görüntüleme
```sh

#secret yaml dosyasını görünütleme
kubectl -n mynamespace get secret/mydbdb-db-credentials   -o yaml

#pod deployment bilgisini görüntüleme
kubectl -n mynamespace describe pod/myapp-deployment-6fccc87578-jq2kb

```

Job manuel başlatma (cron job veya normla job olabilir)

```sh

kubectl -n mynamespace create job --from=cronjob/myindexer-service myindexerservice

```

yeni deployment/secret/service vs ayağa kaldırmak için önce ilgili yaml dosyası hazırlanır
```sh

#Oluşturmak için
kubectl apply -f myapp.yaml  # var olan yaml ı birdaha uygularsanız sadece değişiklikleri uygular

#Silmek için
kubectl delete -f myapp.yaml

```