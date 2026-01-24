---
layout: post
title: "Docker Öldü mü? Hayır. Sadece “Sana Yağı” Oldu."
date: 2026-01-23 09:00:00 +0300
description: Docker gerçekten öldü mü, yoksa sadece container kavramının marka adı mı oldu? Değişen container ekosistemini ve bugünkü doğru zihinsel modeli ele alıyorum.
image: /assets/img/242c6430-9d74-463e-993d-6fb7d47266e9.png
tags:
  - docker
  - containers
  - kubernetes
  - devops
  - cloud-native
---

Son birkaç yıldır teknik sohbetlerde sık duyulan bir cümle var:  
**“Docker artık ölü.”**

Bu cümle teknik olarak yanlış, zihinsel olarak ise çok şey anlatıyor.  
Docker ölmedi; **Docker kelimesi, container kavramının yerine geçti.**  
Tıpkı bir dönem her margarinin “Sana yağı” diye anılması gibi.

![Docker Öldü mü? Hayır. Sadece “Sana Yağı” Oldu.](/assets/img/242c6430-9d74-463e-993d-6fb7d47266e9.png)

Bu yazıda şunları yapacağım:

- Docker’ın ne olduğunu değil, **ne olmadığını** anlatacağım  
- Asıl teknolojinin nerede durduğunu netleştireceğim  
- “Docker neden ölü sanılıyor?” algısının kaynağını göstereceğim  
- Bugün nasıl düşünmemiz gerektiğini özetleyeceğim  

---

## Docker Neydi, Ne Oldu?

Docker, container teknolojisini icat etmedi.  
Ama şunu çok iyi yaptı:

- Karmaşık Linux yeteneklerini tek komutla kullanılabilir hale getirdi  
- Image, registry, build, run kavramlarını tek bir modele oturttu  
- Developer deneyimini ciddi şekilde sadeleştirdi  

Sonuç şu oldu:

> **Container = Docker**

Bu noktadan sonra Docker, bir teknolojiden çok **bir marka** haline geldi.

---

## Asıl Teknoloji Ne?

Docker konuşurken genelde kaçırılan nokta şu:

Container dediğimiz şey aslında şunların birleşimi:

- Linux namespaces  
- cgroups  
- Immutable image katmanları  
- OCI (Open Container Initiative) standartları  

Yani container:

- Bir ürün değil  
- Bir firma değil  
- Bir binary değil  

**Bir mimari yaklaşım.**

Docker ise bu yaklaşımı paketleyen ilk büyük ekosistemdi.

---

## “Docker Öldü” Algısı Nereden Çıktı?

Bu algının birkaç net sebebi var.

### 1. Kubernetes Docker’ı “bıraktı” sanıldı

Kubernetes, Docker Engine’i runtime olarak kullanmayı bıraktı.  
Ama şunları bırakmadı:

- Docker image formatını  
- Container çalışma modelini  

Kubernetes bugün ağırlıklı olarak:

- containerd  
- CRI-O  

kullanıyor.

**Docker Engine gitti, container kaldı.**

---

### 2. Docker Desktop ve lisans gerçeği

Kurumsal dünyada şu başlıklar daha görünür hale geldi:

- Lisans maliyetleri  
- Root yetkisi  
- Merkezi daemon mimarisi  
- Güvenlik ve izolasyon beklentileri  

Bu da alternatif araçların önünü açtı.

---

### 3. Ekosistem olgunlaştı

Başta her şey Docker’dı:

- Build  
- Run  
- Push  
- Orchestration  

Bugün ise her parça kendi alanında uzmanlaştı.

---

## Yeni Düzen Nasıl Çalışıyor?

Bugünkü tablo net:

### Image üretimi
- Dockerfile hâlâ standart  
- Ama build şu araçlarla yapılabiliyor:
  - BuildKit
  - Podman
  - Buildah
  - Kaniko  

### Container çalıştırma
- Local ortamda:
  - Docker
  - Podman  
- Kubernetes içinde:
  - containerd
  - CRI-O  

### Orkestrasyon
- Kubernetes artık merkezde  
- Docker burada zorunlu bir bileşen değil  

Bugün daha doğru ifade şu:

> “Docker kullanıyoruz” değil  
> **“OCI uyumlu container image üretiyoruz.”**

---

## Podman Bu Hikâyede Nereye Oturuyor?

Podman devrim yapmadı, **boşluğu doldurdu**:

- Docker CLI’ye çok benzer  
- Daemon yok  
- Rootless çalışabiliyor  
- Kubernetes pod modeline zihinsel olarak daha yakın  

Bu yüzden Podman:

- Docker’ın rakibi değil  
- Docker sonrası dönemin doğal aracı  

---

## Zihinsel Modeli Değiştirme Zamanı

Sorun Docker kullanmak değil.  
Sorun **Docker’ı merkez sanmak**.

Doğru zihinsel model:

- Docker bir marka  
- Container bir mimari  
- OCI bir standart  
- Kubernetes bir gerçeklik  

Docker ölmedi.  
Ama artık **tek doğru cevap** da değil.

Tıpkı:

- “Sana yağı”nın margarin olması  
- “Selpak”ın kağıt mendil olması  

gibi.

---

## Kapanış

Bugün bir sistem tasarlarken sormamız gereken soru şu:

> “Docker var mı?” değil  
> **“Bu sistem container standartlarına ne kadar bağımlı?”**

Markalar değişir.  
Ama iyi oturmuş mimari fikirler kolay kolay ölmez.