---
layout: post
title: "Docker ile container hazırlama ve docker hubta yayınlama"
categories: container

---
Docker, uygulamalarınızı hızlı ve taşınabilir bir şekilde çalıştırmanıza olanak tanıyan güçlü bir konteynerleştirme platformudur. Bu rehberde, kendi özel bir Docker konteynırı oluşturmanın temel adımlarını öğreneceksiniz ve bu konteynırı Docker Hub'a yüklemeyi öğreneceksiniz. İşte başlamanız için adım adım talimatlar:

## Adım 1: Docker'ı İndirin ve Kurun

Docker'ı bilgisayarınıza indirip kurun. Docker resmi web sitesinden indirme bağlantısını bulabilirsiniz: [Docker İndirme](https://www.docker.com/get-started)

## Adım 2: Docker Hub Hesabı Oluşturun (Opsiyonel)

[Docker Hub](https://hub.docker.com/) hesabı oluşturarak, Docker konteynırlarınızı paylaşabilir ve Docker Hub'dan konteynırları indirebilirsiniz. Ancak bu adım opsiyoneldir.

## Adım 3: Dockerfile Oluşturun

Docker konteynırınızı tanımlamak için bir Dockerfile oluşturun. Dockerfile, konteynırın nasıl inşa edileceğini adım adım belirleyen bir metin dosyasıdır. İşte basit bir örnek Dockerfile:

```Dockerfile
# Resmi bir Ubuntu 20.04 imajını temel alın
FROM ubuntu:20.04

# Bir dizin oluşturun ve çalışma dizini olarak ayarlayın
WORKDIR /app

# Uygulamanızı konteynıra kopyalayın
COPY . .

# Gerekli paketleri yükleyin (örneğin, Python)
RUN apt-get update && apt-get install -y python3

# Uygulamanızı başlatın
CMD [ "python3", "app.py" ]
```

## Adım 4: Docker İmajınızı Oluşturun

Dockerfile'ınızı kullanarak özel Docker imajınızı oluşturun:

```bash
docker build -t your-docker-username/your-image-name:latest .
```

## Adım 5: Docker Konteynırınızı Çalıştırın

Özel Docker imajınızı bir konteynır olarak çalıştırın:

```bash
docker run your-docker-username/your-image-name:latest
```

## Adım 6: Docker Hub'a Yükleyin (GitHub Actions ile)

Docker konteynırınızı otomatik olarak Docker Hub'a yüklemek için GitHub Actions kullanabilirsiniz. İşte bir GitHub Actions örneği:

```yaml
name: Build and Publish Docker Image

on:
  push:
    branches:
      - main # Varsayılan olarak sadece "main" branch'e yapılan itişleri işler

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }} # GitHub Secrets'te Docker Hub kullanıcı adınızı saklayın
          password: ${{ secrets.DOCKER_PASSWORD }} # GitHub Secrets'te Docker Hub şifrenizi saklayın

      - name: Build Docker Image
        run: docker build -t your-docker-username/your-image-name:latest .

      - name: Push Docker Image to Docker Hub
        run: docker push your-docker-username/your-image-name:latest
```

Bu GitHub Actions dosyası, her itme işlemi sonrasında Docker Hub'a Docker konteynırınızı otomatik olarak yükler.

Bu kadar! Artık özel Docker konteynırınız çalışıyor ve Docker Hub'da paylaşılmış durumda.

## Referanslar ve Kaynaklar

- Docker Resmi Web Sitesi: [Docker](https://www.docker.com/)
- Dockerfile Referansı: [Dockerfile Referansı](https://docs.docker.com/engine/reference/builder/)
- GitHub Actions Dökümantasyonu: [GitHub Actions](https://docs.github.com/en/actions)
- Docker Hub Resmi Web Sitesi: [Docker Hub](https://hub.docker.com/)

Bu kaynaklar, Docker konteynerleri oluşturmak ve yönetmek için daha fazla bilgi edinmek isteyenler için faydalıdır.
