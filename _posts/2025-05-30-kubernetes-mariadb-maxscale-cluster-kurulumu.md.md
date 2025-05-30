---
layout: post
title: "Kubernetes ile MariaDB MaxScale Cluster Kurulumu"
date: 2025-05-30
categories: kubernetes mariadb maxscale veritabanı
author: fmarslan.com
---
<img src="/assets/img/mariadb-maxscale.png" alt="cover" style="max-width: 50%; max-height:20%">

Kubernetes üzerinde yüksek erişilebilirlik sağlayan bir **MariaDB replikasyon kümesi** ve bu küme üzerine kurulu **MaxScale** ile bir **read-write split** proxy yapısı kurmak, kurumsal uygulamalar için oldukça işlevseldir. Bu rehberde, **Kubernetes YAML tanımlarını kullanarak** adım adım bir **MariaDB + MaxScale cluster** kurulumunu ele alacağız.

> Bu döküman [fmarslan.com](https://fmarslan.com) tarafından sağlanmıştır. Tüm içerikler açık kaynak altyapılar kullanılarak örneklenmiştir.

---

## 1. Ön Hazırlık

### Gerekli Kaynaklar:
- Kubernetes (v1.21+)
- Bir Container Registry (örneğin Docker Hub veya özel bir ACR/ECR)
- Helm veya `kubectl` CLI

---

## 2. ConfigMap'ler ile Başlayın

YAML yapılandırmaları içerisinde birçok davranış `ConfigMap`'ler üzerinden yönetilir. Bu dosyada, MariaDB için `liveness.sh`, `readiness.sh`, `primary.cnf`, `replica.cnf`, `primary.sql` ve `secondary.sql` gibi dosyalar barındırılır.

```yaml
# Kubernetes ConfigMap - Örnek parçalar
apiVersion: v1
kind: ConfigMap
metadata:
  name: mariadb-configmap
data:
  primary.cnf: |
    [mariadb]
    log-bin
    report_host=mariadb-0.mariadb-headless.default.svc
  ...
````

Her pod (örneğin `mariadb-0`, `mariadb-1`) kendi rolüne göre (`primary` veya `replica`) farklı `.cnf` ve `.sql` dosyaları ile başlatılır.

---

## 3. MariaDB StatefulSet

MariaDB, **StatefulSet** ile deploy edilmelidir çünkü her instance'ın kalıcı bir kimliği (hostname, PVC) olmalıdır.

### Öne Çıkanlar:

* `initContainers` kullanılarak her pod başlatılmadan önce uygun ayar dosyaları (`primary.cnf`, `replica.cnf`) ve SQL scriptleri (`primary.sql`, `secondary.sql`) yerleştirilir.
* Persistent Volume Claim (`volumeClaimTemplates`) ile veri kalıcılığı sağlanır.
* `hostnames` sayesinde Master–Replica ayrımı yapılır.

```yaml
# Kubernetes StatefulSet - Başlangıç kısmı
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mariadb
spec:
  replicas: 2
  serviceName: mariadb-headless
  podManagementPolicy: Parallel
```

Her pod’un davranışı, `initContainer` içinde `bash` script ile tanımlanmıştır. Örneğin:

```bash
if [[ $ordinal -eq 0 ]]; then
  cp /mnt/config-map/primary.cnf ...
  sed -e ... /mnt/config-map/primary.sql > /docker-entrypoint-initdb.d/primary.sql
else
  cp /mnt/config-map/replica.cnf ...
  sed -e ... /mnt/config-map/secondary.sql > /docker-entrypoint-initdb.d/secondary.sql
fi
```

---

## 4. Secrets – Güvenlik

MariaDB kullanıcı bilgileri, replication şifreleri ve admin parolaları **Kubernetes Secret** objelerinde tutulur. Bu sayede pod içinde doğrudan kullanılabilir:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mariadb-secret
type: Opaque
data:
  MARIADB_ROOT_PASSWORD: <base64-secret>
  MARIADB_REPLICATION_USER: <base64-user>
  MARIADB_REPLICATION_PASSWORD: <base64-password>
```

---

## 5. MaxScale Deployment

MaxScale, MariaDB podlarının üzerinde bir katman olarak çalışır ve gelen istekleri yönlendirir.

### MaxScale’in işlevi:

* Primary node’a write istekleri gönderir.
* Replica node’lara read isteklerini dağıtır.
* Arızalı bir node tespit edildiğinde devre dışı bırakır (auto\_failover).
* Read/write ayrımını `readwritesplit` servisi ile yönetir.

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

ConfigMap içindeki `maxscale.cnf` dosyasında `SplitterService`, `Monitor`, ve `Listeners` tanımlıdır:

```ini
[SplitterService]
type=service
router=readwritesplit
servers=server1,server2
user=maxscale
password=maxscale_secret
```

---

## 6. Giriş ve Test

Cluster kurulumunun ardından şu adımlarla test edebilirsiniz:

1. MaxScale GUI’sine bağlanın: `http://<NodeIP>:8989`

2. MariaDB istemcisi ile bağlantı kurun:

   ```bash
   mysql -h <maxscale-service> -P 3306 -u admin -p
   ```

3. `SELECT @@hostname;` komutu ile işlemin hangi node üzerinden geçtiğini gözlemleyin.

---

## Sonuç

Bu içerikte Kubernetes üzerinde bir MariaDB + MaxScale cluster kurulumu için temel yapı taşlarını ve örnek YAML bölümlerini inceledik. Bu kurulum ile yüksek erişilebilirlik ve yük dengeleme sağlanabilir. Her bir yapılandırma ortamınıza göre özelleştirilebilir.
