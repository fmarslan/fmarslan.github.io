---
layout: post
title: "MariaDB MaxScale Cluster Setup with Kubernetes"
date: 2025-05-30
description: "A brief technical note outlining the basic approach and applicable steps on MariaDB MaxScale Cluster Setup with Kubernetes."
categories: [kubernetes, mariadb, maxscale, veritabanı]
lang: en-US
translation_key: "kubernetes-mariadb-maxscale-cluster-kurulumu-708f93ef"
permalink: /en/2025/05/30/mariadb-maxscale-cluster-setup-with-kubernetes.html
image: "/assets/img/mariadb-maxscale.png"
---

Creating a highly available, scalable and centrally manageable **MariaDB cluster** on Kubernetes is an important requirement, especially in enterprise applications. In this guide; I have summarized in a simple and applicable way how you can set up the **MariaDB replication cluster** and the **MaxScale read/write split proxy** structure running on it, step by step.

## 1. Preparation

### Requirements

* Kubernetes v1.21+
* Docker Hub or private registry
* Helm or `kubectl`
* Storage provider (for PVC)

This setup can be done entirely with YAML definitions; It does not require an additional operator or CRD.

## 2. ConfigMap: Brain of the Cluster

Most of the behavior in the MariaDB cluster is defined in `ConfigMap`. Configuration files and init scripts for both primary and replica nodes are kept here.

Example ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mariadb-configmap
data:
  primary.cnf: |
    [mariadb]
    log-bin
    report_host=mariadb-0.mariadb-headless.default.svc
  replica.cnf: |
    [mariadb]
    read_only=ON
  primary.sql: |
    CREATE USER ...;
  secondary.sql: |
    CHANGE MASTER TO ...;
```

Each pod is started as primary or replica according to its own order (`ordinal` value).

## 3. MariaDB StatefulSet: Persistence + Identity

MariaDB must be deployed with **StatefulSet** to protect its data and keep the node identity constant.

Highlights:

* Persistent disk is used with `volumeClaimTemplates`.
* Thanks to `initContainers`, primary/replica distinction is made.
* The role is determined from the pod name (`mariadb-0`).

Basic StatefulSet definition:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mariadb
spec:
  replicas: 2
  serviceName: mariadb-headless
  podManagementPolicy: Parallel
```

InitContainer example:

```bash
if [[ $ordinal -eq 0 ]]; then
  cp /mnt/config-map/primary.cnf /etc/mysql/conf.d/
  cp /mnt/config-map/primary.sql /docker-entrypoint-initdb.d/
else
  cp /mnt/config-map/replica.cnf /etc/mysql/conf.d/
  cp /mnt/config-map/secondary.sql /docker-entrypoint-initdb.d/
fi
```

## 4. Secrets: User and Replication Passwords

MariaDB access information and replication users must be stored in `Secret`.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mariadb-secret
type: Opaque
data:
  MARIADB_ROOT_PASSWORD: <base64>
  MARIADB_REPLICATION_USER: <base64>
  MARIADB_REPLICATION_PASSWORD: <base64>
```

These values are passed into the pod as environment variables.

## 5. MaxScale Deployment: Read/Write Split Proxy

MaxScale stands in front of the cluster and directs queries to the correct node:

* **Write → Primary**
* **Read → Replicas**
* Automatically disables node if inaccessible

Deployment example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: maxscale
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: maxscale
        image: custom.registry.io/maxscale:latest
        volumeMounts:
        - name: maxscale-config
          mountPath: /etc/maxscale.cnf
          subPath: maxscale.cnf
```

MaxScale configuration (ConfigMap):

```ini
[SplitterService]
type=service
router=readwritesplit
servers=server1,server2
user=maxscale
password=maxscale_secret
```

## 6. Testing and Verification

After the installation is completed:

### 1) Connect to MaxScale interface

```
http://<NodeIP>:8989
```

### 2) Connect to MariaDB

```bash
mysql -h <maxscale-service> -P 3306 -u admin -p
```

### 3) Which node did the query pass through?

```sql
SELECT @@hostname;
```

You can follow Replica changes here.

## Result

In this guide, we have covered the basic building blocks for a **MariaDB + MaxScale cluster** running on Kubernetes. Thanks to this architecture:

* High accessibility
* Read/write separation
* Auto failover
* Persistent data management

You can easily access features such as.

You can create a database infrastructure that can be used on an enterprise scale by customizing YAML files according to your own environment.
