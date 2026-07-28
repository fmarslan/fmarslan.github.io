---
layout: post
title: "SSL Certificate for Apache with Let's Encrypt"
date: 2024-12-10
description: "A brief technical note outlining the basic approach and applicable steps on SSL Certificate for Apache with Let's Encrypt."
categories: [SSL, Apache]
lang: en-US
translation_key: "lets-encrypt-apache-ssl-a6154cf2"
permalink: /en/2024/12/10/ssl-certificate-for-apache-with-let-s-encrypt.html
image: "/assets/img/apache-lets-encrypt.webp"
---

This guide walks you through the step-by-step process of **automatically obtaining and renewing an SSL certificate using Let's Encrypt for an Apache server running in a Docker environment**. The structure has been prepared based on a completely practical, realistic scenario.

## 1. Preparation of the Project Directory

Let's create the working folder:

```bash
mkdir apache-ssl
cd apache-ssl
```

## 2. Creating Dockerfile

A simple Dockerfile is enough to configure the Apache server.

```dockerfile
FROM httpd:2.4

# Gerekli dizinler
RUN mkdir -p /etc/letsencrypt/live /var/www/html

# Apache yapılandırması
COPY ./apache.conf /usr/local/apache2/conf/httpd.conf
```

## 3. Apache Configuration

Add the necessary settings for the SSL and ACME authentication directories in `apache.conf`:

```apache
<VirtualHost *:80>
    ServerName fmarslan.com
    ServerAlias www.fmarslan.com
    DocumentRoot /var/www/html

    <Location "/.well-known/acme-challenge/">
        AllowOverride None
        Options None
        Require all granted
    </Location>
</VirtualHost>

<VirtualHost *:443>
    ServerName fmarslan.com
    ServerAlias www.fmarslan.com

    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/fmarslan.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/fmarslan.com/privkey.pem
</VirtualHost>
```

**Note:** You must change the domain names according to your own site.

## 4. Docker Compose: Apache + Certbot

Example structure where Apache and Certbot work together:

```yaml
version: '3.7'

services:
  apache:
    build:
      context: .
    container_name: apache-server
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./html:/var/www/html
      - ./certs:/etc/letsencrypt
    depends_on:
      - certbot

  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certs:/etc/letsencrypt
      - ./html:/var/www/html
    entrypoint: >
      sh -c 'trap exit TERM;
      while :; do
        certbot certonly --webroot -w /var/www/html \
        -d fmarslan.com -d www.fmarslan.com --non-interactive --agree-tos \
        --email admin@fmarslan.com;
        sleep 12h & wait $${!};
      done'
```

This loop is for demo purposes only. In a real environment, **cron-based refresh** is more convenient:

```bash
0 0 * * * docker run --rm -v $(pwd)/certs:/etc/letsencrypt -v $(pwd)/html:/var/www/html certbot/certbot renew
```

## 5. Creating Required Folders

```bash
mkdir html
echo "<h1>SSL Test Sayfası</h1>" > html/index.html
mkdir certs
```

## 6. Starting the Server

```bash
docker-compose up -d
```

## 7. Correct DNS Settings

Domain IP redirects:

* `fmarslan.com` → IP address of the server
* `www.fmarslan.com` → IP address of the server

Certificate generation fails before DNS propagation occurs.

## 8. Log and Troubleshooting

```bash
docker logs certbot
docker logs apache-server
```

Certificate errors are usually:

* DNS redirection,
* `.well-known` access,
* It is caused by firewall port blocks.

## 9. Renewal of Certificates

When Certbot renews, Apache uses the new certificate directly. You can reinstall Apache if necessary:

```bash
docker exec apache-server apachectl graceful
```

With this structure, **Apache + Let's Encrypt automatic certificate management on Docker** will work without any problems. It is adaptable for both test and live environments.
