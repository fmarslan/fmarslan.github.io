---
layout: post
title: "Preparing containers with Docker and publishing to Docker Hub"
date: 2023-10-07
description: "A short technical note outlining the basic approach and applicable steps for preparing a container with Docker and publishing to Docker Hub."
categories: container
lang: en-US
translation_key: "container-hazirlama-ve-docker-hub-ile-yayinlama-662266db"
permalink: /en/2023/10/07/preparing-containers-with-docker-and-publishing-to-docker-hub.html
image: "https://github.com/fmarslan/fmarslan.github.io/assets/12278069/49564cdf-bd96-4051-bb18-c950b74fda29"
---

Docker is a powerful containerization platform that allows you to run your applications quickly and portably. In this guide, you will learn the basic steps to create your own custom Docker container and learn how to upload it to Docker Hub. Here are step by step instructions to get you started:

## Step 1: Download and Install Docker

Download and install Docker on your computer. You can find the download link from Docker official website: [Docker Download](https://www.docker.com/get-started)

## Step 2: Create Docker Hub Account (Optional)

By creating a [Docker Hub](https://hub.docker.com/) account, you can share your Docker containers and download containers from Docker Hub. However, this step is optional.

## Step 3: Create Dockerfile

Create a Dockerfile to define your Docker container. Dockerfile is a text file that specifies step by step how to build the container. Here is a simple example Dockerfile:

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

## Step 4: Build Your Docker Image

Create your custom Docker image using your Dockerfile:

```bash
docker build -t your-docker-username/your-image-name:latest .
```

## Step 5: Run Your Docker Container

Run your private Docker image as a container:

```bash
docker run your-docker-username/your-image-name:latest
```

## Step 6: Upload to Docker Hub (via GitHub Actions)

You can use GitHub Actions to automatically upload your Docker container to Docker Hub. Here's a GitHub Actions example:

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

This GitHub Actions file automatically uploads your Docker container to Docker Hub after each push.

This much! Now your private Docker container is running and shared on Docker Hub.

## References and Resources

- Docker Official Website: [Docker](https://www.docker.com/)
- Dockerfile Reference: [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- GitHub Actions Documentation: [GitHub Actions](https://docs.github.com/en/actions)
- Docker Hub Official Website: [Docker Hub](https://hub.docker.com/)

These resources are useful for those who want to learn more about creating and managing Docker containers.
