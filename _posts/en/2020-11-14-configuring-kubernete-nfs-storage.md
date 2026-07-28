---
layout: post
title: "Configuring Kubernete nfs storage"
date: 2020-11-14
description: "A brief technical note outlining the basic approach and applicable steps for configuring Kubernete nfs storage."
lang: en-US
translation_key: "kubernete-nfs-storage-yapilandirma-37b3858a"
permalink: /en/2020/11/14/configuring-kubernete-nfs-storage.html
---

First of all, we must have an NFS server. If you already have an NFS server, you do not need to do this part. 

We need to install rbac for authorization process.

You can add rbac for authorization by preparing a yaml as follows

```yaml  

--- Cluster Role tanımı yapıyoruz

kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-provisioner-runner
  namespace: storage
rules:
  - apiGroups: [""]
    resources: ["persistentvolumes"]
    verbs: ["get", "list", "watch", "create", "delete"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "update"]
  - apiGroups: ["storage.k8s.io"]
    resources: ["storageclasses"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "update", "patch"]
  - apiGroups: [""]
    resources: ["services", "endpoints"]
    verbs: ["get"]
  - apiGroups: ["extensions"]
    resources: ["podsecuritypolicies"]
    resourceNames: ["nfs-provisioner"]
    verbs: ["use"]

--- #Servis hesabına Bind işlemini yapıyoruz hesabı aşağıda oluşturacağız

kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-provisioner
    namespace: storage
roleRef:
  kind: ClusterRole
  name: nfs-provisioner-runner
  apiGroup: rbac.authorization.k8s.io

--- #Role tanımı yapıyoruz

kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-provisioner
  namespace: storage
rules:
  - apiGroups: [""]
    resources: ["endpoints"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]

--- #Bind işlemini yapıyoruz.

kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-provisioner
    namespace: storage
roleRef:
  kind: Role
  name: leader-locking-nfs-provisioner
  apiGroup: rbac.authorization.k8s.io

```




We prepare a yaml as follows, in this yaml we configure the disk partition etc. to be used according to ourselves.

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
  clusterIP: <10.99.106.163> --- #bu bölümü önce boş bırakıp çalıştırdıktan sonra deployment ın aldığı ip yi buraya yazabilirsiniz.
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
            path: <my-data-folder> --- #fiziksel suncu üzerinde data kaydedeceğimiz path
      tolerations:
      - key: node.kubernetes.io/unschedulable
        operator: Exists
        effect: NoSchedule

```

Now we define the nfs server we created globally so that other pods can access it on Kubernate. For this, we need to edit the yaml file below and apply it.

```yaml

kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: <myhost>-nfs
provisioner: <myhost>/nfs
mountOptions:
  - vers=4.1

```

To use it in the storage-related pods we created, we can create PVC as follows and mount it in the relevant container. When this PVC is deleted, all your data will be deleted. When mounting, you can mount it with the name ```<myapp>-storage```

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: <myapp>-storage
  namespace: <mynamespace>
  annotations:
    volume.beta.kubernetes.io/storage-class: "<myhost>-nfs"
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 5Gi --- ayırmak istediğimiz bölüm

```

I would like to thank [Kazım Sarıkaya](https://srkykzm.com/) for his contributions.
