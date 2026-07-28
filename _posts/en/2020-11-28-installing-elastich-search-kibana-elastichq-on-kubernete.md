---
layout: post
title: "Installing Elastich Search + Kibana + ElasticHQ on Kubernete"
date: 2020-11-28
description: "A short technical note outlining the basic approach and actionable steps for installing Elastich Search + Kibana + ElasticHQ on Kubernete."
categories: kubernete
lang: en-US
translation_key: "kubernete-uzerine-elastich-search-kibana-elastichhq-kurulumu-3f029fae"
permalink: /en/2020/11/28/installing-elastich-search-kibana-elastichq-on-kubernete.html
---

***NOTE:** This document is more of a condensed translation rather than a retelling, the sources are shared below. It is also an example application **this method may not be preferred as a good method** you should determine the most appropriate method for your own production needs.*

Although there are changes between versions in the installation, this document was prepared for the 7.9.3 elastic search version. I generally do not share many details about applications and configurations, you can follow the documentation of the relevant applications for details.

First of all, let's list the objects we will create in this installation.
- Statefulset for Elastic Search
- PVC for Elastic Search
- Service for Elastic Search
- Kibana Deployment
- Kibana Service
- ElasticHQ Deployment
- ElasticHQ Service

First, let's create a namespace for all these works. You can create it either with yaml or with kubectl in the terminal. I prefer kubectl.

```sh

kubectl create namespace es

```


Then we prepare a yaml as follows. You can copy this yaml file and change it according to your needs. *[For detailed settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)*

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: es-cluster
  namespace: es
spec:
  serviceName: elasticsearch
  replicas: 3 # 3 replica kuruyoruz
  selector:
    matchLabels:
      app: elasticsearch # bu kısım template labels ile aynı olmalı
  template:
    metadata:
      labels:
        app: elasticsearch  # bu kısım selector ile aynı olmalı
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch-oss:7.9.3-amd64 # bu image ücretsiz sürümdür 
        resources:
            limits:
              cpu: 1000m
            requests:
              cpu: 100m
        ports:
        - containerPort: 9200
          name: rest
          protocol: TCP
        - containerPort: 9300
          name: inter-node
          protocol: TCP
        volumeMounts:
        - name: data
          mountPath: /usr/share/elasticsearch/data
        env:
          - name: cluster.name
            value: k8s-logs
          - name: node.name
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
          - name: discovery.seed_hosts
            value: "es-cluster-0.elasticsearch,es-cluster-1.elasticsearch,es-cluster-2.elasticsearch"
          - name: cluster.initial_master_nodes
            value: "es-cluster-0,es-cluster-1,es-cluster-2"
          - name: ES_JAVA_OPTS
            value: "-Xms2g -Xmx2g" # işlem ve veri boyutunuza göre ayarlayın
      initContainers:
      - name: fix-permissions
        image: busybox
        command: ["sh", "-c", "chown -R 1000:1000 /usr/share/elasticsearch/data"]
        securityContext:
          privileged: true
        volumeMounts:
        - name: data
          mountPath: /usr/share/elasticsearch/data
      - name: increase-vm-max-map
        image: busybox
        command: ["sysctl", "-w", "vm.max_map_count=262144"]
        securityContext:
          privileged: true
      - name: increase-fd-ulimit
        image: busybox
        command: ["sh", "-c", "ulimit -n 65536"]
        securityContext:
          privileged: true
  volumeClaimTemplates:  # PVC tanımı stateful içinde olmalı 
  - metadata:
      name: data
      labels:
        app: elasticsearch
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: {your-nfs}
      resources:
        requests:
          storage: 20Gi

```
service definition for elastic search

```yaml
kind: Service
apiVersion: v1
metadata:
  name: elasticsearch
  namespace: es
  labels:
    app: elasticsearch
spec:
  selector:
    app: elasticsearch
  clusterIP: None # ben dns kullandığım için IP yi kapattım aşağıdaki örneklerde ip açık kendinize göre konfigure edebilirsiniz.
  ports:
    - port: 9200
      name: rest
    - port: 9300
      name: inter-node
```

Kibana Yaml

```yaml
# Kibana service

apiVersion: v1
kind: Service
metadata:
  name: kibana
  namespace: es
  labels:
    app: kibana
spec:
  ports:
  - port: 5601
  selector:
    app: kibana
--- # Kibana Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kibana
  namespace: es
  labels:
    app: kibana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kibana
  template:
    metadata:
      labels:
        app: kibana
    spec:
      containers:
      - name: kibana
        image: docker.elastic.co/kibana/kibana-oss:7.9.3
        resources:
          limits:
            cpu: 1000m
          requests:
            cpu: 100m
        env:
          - name: ELASTICSEARCH_URL
            value: http://elasticsearch:9200
        ports:
        - containerPort: 5601

```

Elastic HQ yaml *[github page](https://github.com/ElasticHQ/elasticsearch-HQ)*

```yaml
#hq deployment
kind: Deployment
metadata:
  name: es-hq
  namespace: upa
  labels:
    app: es-hq
spec:
  replicas: 1
  selector:
    matchLabels:
      app: es-hq
  template:
    metadata:
      labels:
        app: es-hq
    spec:
      containers:
      - name: es-hq
        image: elastichq/elasticsearch-hq:release-v3.5.12
        env:
        - name: HQ_DEFAULT_URL
          value: http://elasticsearch:9200
        resources:
          limits:
            cpu: 0.5
        ports:
        - containerPort: 5000
          name: http
--- # hq service
apiVersion: v1
kind: Service
metadata:
  name: es
  namespace: upa
  labels:
    app: hq
spec:
  ports:
  - port: 5000
  selector:
    app: es-hq

```

to view ip addresses

```sh
kubectl -n es get services

```
It will list the services as follows.

```sh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
elasticsearch   ClusterIP   None            <none>        9200/TCP,9300/TCP   164m
es              ClusterIP   10.105.216.20   <none>        5000/TCP            14h
kibana          ClusterIP   10.98.151.53    <none>        5601/TCP            14h
```

URL Addresses

Kibana: http://{kibanaip}:5601/
hq: http://{hqip}:5000/
es: http://{esip}:9200/


[Source Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes)
