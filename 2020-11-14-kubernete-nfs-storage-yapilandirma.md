---
title: Kubernete nfs storage yapılandirma
layout: post
category: kubernete
---


Öncelikle elimize bir nfs sunucu olmalıdır eğer mevcutta bir nfs sunucunuz var ise bu kısım ile işiniz yok bunun için aşağıdaki gibi bir yaml hazırlıyoruz bu yaml içerisinde kullanacağı disk bölümü vs kendimize göre yapılandırıyoruz

```yaml

kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: mynamespace-nfs
  namespace: storage
provisioner: <myhost>/nfs
mountOptions:
  - vers=4.1
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-provisioner
  namespace: storage
---
kind: Service
apiVersion: v1
metadata:
  name: nfs-provisioner
  namespace: storage
  labels:
    app: nfs-provisioner
spec:
  clusterIP: <10.99.106.163> --- bu bölümü önce boş bırakıp çalıştırdıktan sonra deployment ın aldığı ip yi buraya yazabilirsiniz.
  ports:
  - name: port111-tcp
    port: 111
    protocol: TCP
  - name: port111-udp
    port: 111
    protocol: UDP
  - name: port662-tcp
    port: 662
    protocol: TCP
  - name: port662-udp
    port: 662
    protocol: UDP
  - name: port875-tcp
    port: 875
    protocol: TCP
  - name: port875-udp
    port: 875
    protocol: UDP
  - name: port2049-tcp
    port: 2049
    protocol: TCP
  - name: port2049-udp
    port: 2049
    protocol: UDP
  - name: port20048-tcp
    port: 20048
    protocol: TCP
  - name: port20048-udp
    port: 20048
    protocol: UDP
  - name: port32803-tcp
    port: 32803
    protocol: TCP
  - name: port32803-udp
    port: 32803
    protocol: UDP
  selector:
    app: nfs-provisioner
---
kind: Deployment
apiVersion: apps/v1
metadata:
  name: nfs-provisioner
  namespace: storage
spec:
  selector:
    matchLabels:
      app: nfs-provisioner
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: nfs-provisioner
    spec:
      serviceAccount: nfs-provisioner
      nodeSelector:
        kubernetes.io/hostname: <my-host-name>
      containers:
        - name: nfs-provisioner
          image: quay.io/kubernetes_incubator/nfs-provisioner:v2.3.0
          ports:
          - name: port111-tcp
            containerPort: 111
            protocol: TCP
          - name: port111-udp
            containerPort: 111
            protocol: UDP
          - name: port662-tcp
            containerPort: 662
            protocol: TCP
          - name: port662-udp
            containerPort: 662
            protocol: UDP
          - name: port875-tcp
            containerPort: 875
            protocol: TCP
          - name: port875-udp
            containerPort: 875
            protocol: UDP
          - name: port2049-tcp
            containerPort: 2049
            protocol: TCP
          - name: port2049-udp
            containerPort: 2049
            protocol: UDP
          - name: port20048-tcp
            containerPort: 20048
            protocol: TCP
          - name: port20048-udp
            containerPort: 20048
            protocol: UDP
          - name: port32803-tcp
            containerPort: 32803
            protocol: TCP
          - name: port32803-udp
            containerPort: 32803
            protocol: UDP
          securityContext:
            capabilities:
              add:
                - DAC_READ_SEARCH
                - SYS_RESOURCE
          args:
            - "-provisioner=<myhost>/nfs"
          env:
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: SERVICE_NAME
              value: nfs-provisioner
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          imagePullPolicy: "IfNotPresent"
          volumeMounts:
            - name: export-volume
              mountPath: /export
      volumes:
        - name: export-volume
          hostPath:
            path: <my-data-folder> --- fiziksel suncu üzerinde data kaydedeceğimiz path
      tolerations:
      - key: node.kubernetes.io/unschedulable
        operator: Exists
        effect: NoSchedule

```

Şimdi oluşturduğumuz nfs sunucuyu kubernate üzerinde diğer podların erişebilmesi için global olarak tanımlıyoruz`bunun için aşağıdaki yaml dosyasını kendimize göre düzenleyip apply etmeliyiz.

```yaml

kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: <myhost>-nfs
provisioner: <myhost>/nfs
mountOptions:
  - vers=4.1

```


