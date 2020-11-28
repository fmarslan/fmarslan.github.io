---
layout: post
title: Kubernate Üzerine Elastich Search + Kibana % ElasticHQ kurulumu
categories: kubernete
---

 ***NOT:** Bu döküman yeniden anlatımdan ziyade özet bir şekilde çeviri gibidir, kaynaklar aşağıda paylaşılmıştır. Aynı zamanda örnek bir uygulamadır **bu yöntem iyi bir yöntem olarak tercih edilmeyebilir** kendi prod ihtiyaçlarınız için en uygun yöntemi belirlemelisiniz.*

Kurulumda versionlar arası değişim olmakla birlikte bu döküman 7.9.3 elastic search sürümü için hazırlandı. Çok fazla uygulamalar ve konfigurasyonlar hakkında genelde detay paylaşmıyorum detaylar için ilgili uygulamarın kendi dökümantasyonlarını takip edebilirsiniz.

Öncelikle bu kurulumda oluşturacağımız objeleri bir listeleyecek olursak
- Elastich Search için Statefulset
- Elastic Search için PVC
- Elastic Search için Service
- Kibana Deployment
- Kibana Service
- ElasticHQ Deployment
- ElasticHQ Service

İlk olarak tüm bu çalışmalar için bir namespace oluşturalım bunu ister yaml ile ister terminalde kubectl ile oluşturabilirsiniz ben kubectl i tercih ediyorum.

```sh

kubectl create namespace es

```


sonra aşağıdaki gibi bir yaml hazırlıyoruz bu yaml dosyasını kopyalayarak kendinize göre değiştirebilrisiniz. *[Detaylı ayarlar için](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)*

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
elastic search için service tanımı

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
  clusterIP: None
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

ip adreslerini görüntülemek için

```sh
kubectl -n es get services

```
aşağıdaki şekilde servisleri listeleyecektir.

```sh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
elasticsearch   ClusterIP   None            <none>        9200/TCP,9300/TCP   164m
es              ClusterIP   10.105.216.20   <none>        5000/TCP            14h
kibana          ClusterIP   10.98.151.53    <none>        5601/TCP            14h
```

URL Adresleri

Kibana: http://{kibanaip}:5601/
hq: http://{hqip}:5000/
es: http://{esip}:9200/


[Kaynak Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes)
