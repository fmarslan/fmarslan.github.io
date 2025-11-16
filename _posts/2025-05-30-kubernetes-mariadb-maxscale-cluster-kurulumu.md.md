---
layout: post
title: "Kubernetes ile MariaDB MaxScale Cluster Kurulumu"
date: 2025-05-30
categories: [kubernetes, mariadb, maxscale, veritabanı]
author: fmarslan.com
---

Kubernetes üzerinde yüksek erişilebilir, ölçeklenebilir ve merkezi yönetilebilir bir **MariaDB kümesi** oluşturmak, özellikle kurumsal uygulamalarda önemli bir gereksinim. Bu rehberde; **MariaDB replikasyon kümesi** ve üzerinde çalışan **MaxScale read/write split proxy** yapısını adım adım nasıl kurabileceğinizi sade ve uygulanabilir bir şekilde özetledim.

<img src="/assets/img/mariadb-maxscale.png" alt="cover" style="max-width: 50%; max-height:20%">



## 1. Ön Hazırlık

### Gereksinimler

* Kubernetes v1.21+
* Docker Hub veya özel registry
* Helm veya `kubectl`
* Depolama sağlayıcısı (PVC için)

Bu kurulum tamamen YAML tanımlarıyla yapılabilir; ek bir operator veya CRD gerektirmez.



## 2. ConfigMap: Kümenin Beyni

MariaDB kümesindeki davranışların çoğu `ConfigMap` içinde tanımlanır. Burada hem primary hem de replica nodelar için yapılandırma dosyaları ve init scriptler tutulur.

Örnek ConfigMap:

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

Her pod, kendi sırasına göre (`ordinal` değeri) primary veya replica olarak başlatılır.



## 3. MariaDB StatefulSet: Kalıcılık + Kimlik

MariaDB, verisini korumak ve node kimliğini sabit tutmak için mutlaka **StatefulSet** ile deploy edilmelidir.

Öne çıkan noktalar:

* `volumeClaimTemplates` ile kalıcı disk kullanılır.
* `initContainers` sayesinde primary/replica ayrımı yapılır.
* Pod adından (`mariadb-0`) rol belirlenir.

Temel StatefulSet tanımı:

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

InitContainer örneği:

```bash
if [[ $ordinal -eq 0 ]]; then
  cp /mnt/config-map/primary.cnf /etc/mysql/conf.d/
  cp /mnt/config-map/primary.sql /docker-entrypoint-initdb.d/
else
  cp /mnt/config-map/replica.cnf /etc/mysql/conf.d/
  cp /mnt/config-map/secondary.sql /docker-entrypoint-initdb.d/
fi
```



## 4. Secrets: Kullanıcı ve Replikasyon Şifreleri

MariaDB erişim bilgileri ve replication kullanıcıları mutlaka `Secret` içinde saklanmalıdır.

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

Bu değerler pod içine environment variable olarak geçer.



## 5. MaxScale Deployment: Read/Write Split Proxy

MaxScale, cluster’ın önünde durarak sorguları doğru node’a yönlendirir:

* **Write → Primary**
* **Read → Replicas**
* Node erişilemezse otomatik devre dışı bırakır

Deployment örneği:

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

MaxScale konfigürasyonu (ConfigMap):

```ini
[SplitterService]
type=service
router=readwritesplit
servers=server1,server2
user=maxscale
password=maxscale_secret
```



## 6. Test ve Doğrulama

Kurulum tamamlandıktan sonra:

### 1) MaxScale arayüzüne bağlanın

```
http://<NodeIP>:8989
```

### 2) MariaDB bağlantısı yapın

```bash
mysql -h <maxscale-service> -P 3306 -u admin -p
```

### 3) Query hangi node’dan geçti?

```sql
SELECT @@hostname;
```

Replica değişimlerini buradan takip edebilirsiniz.



## Sonuç

Bu rehberde, Kubernetes üzerinde çalışan bir **MariaDB + MaxScale cluster** için temel yapı taşlarını ele aldık. Bu mimari sayesinde:

* Yüksek erişilebilirlik
* Read/write ayrımı
* Otomatik failover
* Kalıcı veri yönetimi

gibi özelliklere kolayca ulaşabilirsiniz.

YAML dosyalarını kendi ortamınıza göre özelleştirerek kurumsal ölçekte kullanılabilir bir veritabanı altyapısı oluşturabilirsiniz.