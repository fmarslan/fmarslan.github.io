---
layout: post
title: "Installing cert-manager on Kubernetes (Step by Step Guide)"
date: 2025-08-20
description: "A short technical note outlining the basic approach and applicable steps on Installing cert-manager on Kubernetes (Step by Step Guide)."
categories: kubernetes
lang: en-US
translation_key: "kubernetes-cert-manager-kurulum-c1b2fc8c"
permalink: /en/2025/08/20/installing-cert-manager-on-kubernetes-step-by-step-guide.html
image: "/assets/img/cert-manager.png"
---

**Manually managing TLS certificates** in applications running on Kubernetes is a process that is both time-consuming and error-prone. This is where cert-manager comes into play, making the platform much more secure and sustainable by automating the certificate generation, renewal and verification processes.

The following guide explains the installation of cert-manager from start to finish in a clear and practical way.

## Prerequisites

It is recommended that the following requirements are met in the environment before you start:

* Kubernetes v1.24+ (recommended)
* `kubectl` installed
* `cluster-admin` authority on the cluster
* Internet access (required for Jetstack and Let's Encrypt)
* (Optional) NGINX Ingress Controller or Gateway API

## Creating Namespace

```bash
kubectl create namespace cert-manager
```

This step can be skipped if the namespace already exists.

## Installation Methods

### 1) Installation with Helm

Helm is the most recommended method as it makes CRD management and component updates more streamlined.

Official documentation:
👉 [https://cert-manager.io/docs/installation/helm/](https://cert-manager.io/docs/installation/helm/)

### 2) Manual Installation with Kubectl Apply

For those who do not want to use Helm, it is possible to implement cert-manager components directly with YAML files.

Example installation steps:

#### Namespace

```bash
kubectl apply -f 00-namespace.yaml
```

#### CRDs

```bash
kubectl apply -f 01-crd.yaml
```

#### Secret (for providers like Cloudflare)

```bash
kubectl apply -f 01-secret.yaml
```

> Confidential information in this file is masked. You need to enter values ​​appropriate to your environment.

#### cert-manager Components

```bash
kubectl apply -f 02-certmanager.yaml
```

## Verify Installation

```bash
kubectl get pods -n cert-manager
```

Must-see pods:

* `cert-manager`
* `cert-manager-cainjector`
* `cert-manager-webhook`

Optional verification:

```bash
cmctl check api
```

## ACME Configuration with Let's Encrypt

### Cloudflare (DNS-01 Challenge)

If you use Cloudflare, it is recommended that you create an **API Token** with minimum authority.

**Secret Definition**

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

**Wildcard Certificate Sample**

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

HTTP-01 challenge can be used in environments that do not support DNS.

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

## Best Practices

* Test in staging environment first
* Generate **minimum authorized token** for Cloudflare
* You can make the scope namespace specific by using `Issuer` instead of `ClusterIssuer`
* Track certification expirations with Prometheus + Alertmanager

## Troubleshooting

Common problems and checks:

* **DNS-01:** Token authority, zone selection, DNS propagation
* **HTTP-01:** `.well-known` path, ingressClassName, port redirects
* Error analysis with `kubectl describe certificate <name>`

## Uninstall Process

If you did a manual installation:

```bash
kubectl delete -f 02-certmanager.yaml
kubectl delete -f 01-secret.yaml
kubectl delete -f 01-crd.yaml
kubectl delete -f 00-namespace.yaml
```

If you installed via Helm:

```bash
helm uninstall cert-manager -n cert-manager
```

By following the installation step by step, you can ensure reliable and automatic TLS management in your Kubernetes environment.

**Source:**

* [https://cert-manager.io](https://cert-manager.io)
