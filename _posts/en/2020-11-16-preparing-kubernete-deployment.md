---
layout: post
title: "Preparing Kubernete Deployment"
date: 2020-11-16
description: "A brief technical note outlining the basic approach and actionable steps on Kubernete Deployment Preparation."
categories: kubernete
lang: en-US
translation_key: "kubernete-deployment-nasil-yapilir-1109f56a"
permalink: /en/2020/11/16/preparing-kubernete-deployment.html
---

We will basically make an application on how to do deployment with Kubernete. As a first step, it is important to know the application we will deploy and perhaps master it. I chose nginx because it is simple. We will just set up an empty nginx server, we will not add the application, maybe I can include the deploy stage in another document later, here you go, let's get started.

First of all, we prepare a yaml for deployment, and I recommend that you save the yaml files we have prepared in a location such as git. This will primarily benefit you in 2 ways.

- You can follow the verisons of your configuration file.
- When you want to delete or make changes again, you will have your configuration file ready at hand. All you have to do is make the change and apply it.


We create a namespace called playground.

```sh
kubectl create ns playground

```
The nginx yaml file will be a deployment in this section, we will define the IP to access this deployment and, if necessary, we will define the service layer that will act as a load balancer in front of it. Adjust the following yaml file according to your needs and give it a name, such as nginx.yaml.

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

We apply as follows

```sh
kubectl apply -f nginx.yaml

```

now we are checking the situation

```sh
kubectl -n playground get all
```

It should give output as follows

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

Here, the deployment configuration we made started as ```deployment.```, started as ```pod/```, and worked according to this configuration. The instance started as ```service/``` is the service object, which worked according to our service configuration. The one that starts as ```replicaset.``` is the past configuration information kept here, similar to git. Now, when we have our first application, there is the first version, you can switch between them.


When you make a request to the 10.98.63.85 IP address seen against the service from a machine that has access to the Kubernete IP, you will see the nginx page.

Thanks to [Kazım Sarıkaya](https://srkykzm.com/) for the contributions
