---
layout: post
title: "Kubernetes Üzerinde cert-manager Kurulumu (Adım Adım Rehber)"
categories: kubernetes
---

Kubernetes üzerinde çalışan uygulamalarda **TLS sertifikalarını manuel yönetmek**, hem zaman alan hem de hata yapmaya açık bir süreç. İşte tam bu noktada devreye giren cert-manager, sertifika üretme, yenileme ve doğrulama işlemlerini otomatikleştirerek platformu çok daha güvenli ve sürdürülebilir hale getiriyor.

Aşağıdaki rehber, cert-manager kurulumunu baştan sona açık ve pratik bir şekilde anlatır.

<img src="/assets/img/cert-manager.png" alt="cover" style="max-width: 50%; max-height:10%">



## Önkoşullar

Başlamadan önce ortamda aşağıdaki gereksinimlerin karşılanmış olması önerilir:

* Kubernetes v1.24+ (önerilir)
* `kubectl` yüklü
* Küme üzerinde `cluster-admin` yetkisi
* İnternet erişimi (Jetstack ve Let’s Encrypt için gerekli)
* (Opsiyonel) NGINX Ingress Controller veya Gateway API



## Namespace Oluşturma

```bash
kubectl create namespace cert-manager
```

Namespace zaten mevcutsa bu adım atlanabilir.



## Kurulum Yöntemleri

### 1) Helm ile Kurulum

Helm, CRD yönetimini ve bileşen güncellemelerini daha düzenli hale getirdiği için en önerilen yöntemdir.

Resmi dökümantasyon:
👉 [https://cert-manager.io/docs/installation/helm/](https://cert-manager.io/docs/installation/helm/)

### 2) Kubectl Apply ile Manuel Kurulum

Helm kullanmak istemeyenler için cert-manager bileşenlerini doğrudan YAML dosyalarıyla uygulamak mümkündür.

Örnek kurulum adımları:

#### Namespace

```bash
kubectl apply -f 00-namespace.yaml
```

#### CRD’ler

```bash
kubectl apply -f 01-crd.yaml
```

#### Secret (Cloudflare gibi sağlayıcılar için)

```bash
kubectl apply -f 01-secret.yaml
```

> Bu dosyadaki gizli bilgiler maskelenmiştir. Ortamınıza uygun değerleri girmeniz gerekir.

#### cert-manager Bileşenleri

```bash
kubectl apply -f 02-certmanager.yaml
```



## Kurulumu Doğrulama

```bash
kubectl get pods -n cert-manager
```

Görülmesi gereken pod’lar:

* `cert-manager`
* `cert-manager-cainjector`
* `cert-manager-webhook`

Opsiyonel doğrulama:

```bash
cmctl check api
```



## Let’s Encrypt ile ACME Yapılandırması

### Cloudflare (DNS-01 Challenge)

Cloudflare kullanıyorsanız, minimum yetkiye sahip bir **API Token** oluşturmanız önerilir.

**Secret Tanımı**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token-secret
  namespace: cert-manager
type: Opaque
stringData:
  api-token: REDACTED
```

**ClusterIssuer (Production)**

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: admin@tarsolution.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-api-token-secret
              key: api-token
```

**Wildcard Sertifika Örneği**

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: wildcard-tarsolution-com
  namespace: default
spec:
  secretName: wildcard-tarsolution-com-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - tarsolution.com
    - "*.tarsolution.com"
```

### HTTP-01 (NGINX Ingress)

DNS desteklemeyen ortamlarda HTTP-01 challenge kullanılabilir.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-http01
  namespace: default
spec:
  acme:
    email: admin@tarsolution.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-http01-account-key
    solvers:
      - http01:
          ingress:
            ingressClassName: nginx
```



## En İyi Uygulamalar

* Önce staging ortamında test edin
* Cloudflare için **minimum yetkili token** oluşturun
* `ClusterIssuer` yerine `Issuer` kullanarak kapsamı namespace’e özel yapabilirsiniz
* Sertifika sürelerini Prometheus + Alertmanager ile takip edin



## Sorun Giderme

Sık karşılaşılan sorunlar ve kontroller:

* **DNS-01:** Token yetkisi, zone seçimi, DNS propagasyonu
* **HTTP-01:** `.well-known` yolu, ingressClassName, port yönlendirmeleri
* `kubectl describe certificate <name>` ile hata analizi



## Kaldırma İşlemi

Manuel kurulum yaptıysanız:

```bash
kubectl delete -f 02-certmanager.yaml
kubectl delete -f 01-secret.yaml
kubectl delete -f 01-crd.yaml
kubectl delete -f 00-namespace.yaml
```

Helm üzerinden kurulum yaptıysanız:

```bash
helm uninstall cert-manager -n cert-manager
```



Kurulumu adım adım uygulayarak Kubernetes ortamınızda güvenilir ve otomatik bir TLS yönetimi sağlayabilirsiniz.



**Kaynak:**

* [https://cert-manager.io](https://cert-manager.io)