---
layout: post
title: " Kubernetes Üzerinde cert-manager Kurulumu (Adım Adım Rehber)"
categories: kubernetes
---

<img src="/assets/img/cert-manager.png" alt="cover" style="max-width: 50%; max-height:10%">


Modern uygulamalarda **TLS sertifikalarının yönetimi** manuel olarak zahmetli ve hataya açık bir süreçtir. Kubernetes ekosisteminde bu işi otomatikleştiren en popüler çözüm: **cert-manager**. Amacımız, Kubernetes üzerinde çalışan uygulamalar için TLS sertifikalarını otomatik üretmek, yenilemek ve güvenle yönetmek.

---

## Önkoşullar

* Kubernetes v1.24+ önerilir
* `kubectl` kurulu
* Küme üzerinde `cluster-admin` yetkisi
* İnternet erişimi (Jetstack registry ve Let’s Encrypt için)
* (Opsiyonel) NGINX Ingress Controller veya Gateway API

---

## Namespace Oluşturma

```bash
kubectl create namespace cert-manager
```

Namespace zaten varsa bu adımı atlayabilirsiniz.

---

## Kurulum Yöntemleri

### 1) Helm ile Kurulum

Helm kurulumu için resmi dökümanı takip etmenizi öneriyorum:
👉 [Resmi Helm Kurulum Dökümanı](https://cert-manager.io/docs/installation/helm/)

Bu yöntem, CRD’lerin ve bileşenlerin otomatik yönetimi açısından en pratik ve güvenli yoldur.

### 2) Manuel Kurulum (Kubectl Apply)

Eğer Helm kullanmak istemiyorsanız, cert-manager bileşenlerini **kubectl apply** yöntemiyle de yükleyebilirsiniz.

Benim paylaştığım örnek dosyalar (`00-namespace.yaml`, `01-crd.yaml`, `01-secret.yaml`, `02-certmanager.yaml`) bu kurulum için bir temel oluşturur. Adımlar şu şekilde:

#### Namespace

```bash
kubectl apply -f 00-namespace.yaml
```

#### CRD’ler

```bash
kubectl apply -f 01-crd.yaml
```

#### Secret (Cloudflare API Token vb.)

```bash
kubectl apply -f 01-secret.yaml
```

> Bu dosyada yer alan bilgiler **GDPR kapsamında temizlenmiştir**. Kendi ortamınıza uygun secret değerlerini girmelisiniz.

#### cert-manager Bileşenleri

```bash
kubectl apply -f 02-certmanager.yaml
```

---

## Kurulumu Doğrulama

```bash
kubectl get pods -n cert-manager
```

Beklenen Pod’lar:

* `cert-manager`
* `cert-manager-cainjector`
* `cert-manager-webhook`

Opsiyonel:

```bash
cmctl check api
```

---

## Let’s Encrypt ile ACME Kurulumu

### Cloudflare (DNS-01)

Cloudflare kullanıyorsanız, minimum yetkiye sahip bir **API Token** oluşturun. Kubernetes üzerinde şu şekilde secret tanımlayabilirsiniz:

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

Eğer DNS sağlayıcınız uygun değilse, HTTP-01 yöntemi kullanılabilir.

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

---

## En İyi Uygulamalar

* Önce staging ortamında test edin, sonra production’a geçin
* Cloudflare için **API Token** ile minimum yetki verin
* `ClusterIssuer` yerine `Issuer` kullanarak kapsamı namespace’e daraltabilirsiniz
* Sertifika bitiş tarihlerini Prometheus/Alerting ile takip edin

---

## Sorun Giderme

* **DNS-01:** Token yetkileri, doğru zone seçimi, DNS propagasyonu
* **HTTP-01:** `.well-known` erişimi, doğru ingressClassName, 80/443 yönlendirmeleri
* `kubectl describe certificate <name>` ile hata detaylarını inceleyin

---

## Kaldırma

Manuel kurulumda:

```bash
kubectl delete -f 02-certmanager.yaml
kubectl delete -f 01-secret.yaml
kubectl delete -f 01-crd.yaml
kubectl delete -f 00-namespace.yaml
```

Helm ile kurulum yaptıysanız:

```bash
helm uninstall cert-manager -n cert-manager
```

---

Örnek YAML dosyaları üzerinden ilerleyerek, ortamınıza uygun güvenli bir kurulum gerçekleştirebilirsiniz.

---

**Kaynaklar:**

* [cert-manager.io](https://cert-manager.io)
