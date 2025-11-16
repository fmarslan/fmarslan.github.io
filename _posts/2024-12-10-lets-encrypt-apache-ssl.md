---
layout: post
title: "Let's Encrypt ile Apache için SSL Sertifikası"
categories: [SSL, Apache]
---

Bu rehber, **Docker ortamında çalışan bir Apache sunucusu için Let's Encrypt kullanarak otomatik SSL sertifikası alma ve yenileme** sürecini adım adım anlatır. Yapı tamamen pratik, gerçekçi bir senaryo üzerinden hazırlanmıştır.

<img src="/assets/img/apache-lets-encrypt.webp" alt="cover" style="max-width: 50%; max-height:20%">



## 1. Proje Dizininin Hazırlanması

Çalışma klasörünü oluşturalım:

```bash
mkdir apache-ssl
cd apache-ssl
```



## 2. Dockerfile Oluşturma

Apache sunucusunu yapılandırmak için basit bir Dockerfile yeterlidir.

```dockerfile
FROM httpd:2.4

# Gerekli dizinler
RUN mkdir -p /etc/letsencrypt/live /var/www/html

# Apache yapılandırması
COPY ./apache.conf /usr/local/apache2/conf/httpd.conf
```



## 3. Apache Yapılandırması

SSL ve ACME doğrulama dizinleri için gerekli ayarları `apache.conf` içine ekleyin:

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

**Not:** Domain adlarını kendi sitenize göre değiştirmelisiniz.



## 4. Docker Compose: Apache + Certbot

Apache ve Certbot'un birlikte çalıştığı örnek yapı:

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

Bu loop yalnızca demo amaçlıdır. Gerçek ortamda **cron tabanlı yenileme** daha uygundur:

```bash
0 0 * * * docker run --rm -v $(pwd)/certs:/etc/letsencrypt -v $(pwd)/html:/var/www/html certbot/certbot renew
```



## 5. Gerekli Klasörlerin Oluşturulması

```bash
mkdir html
echo "<h1>SSL Test Sayfası</h1>" > html/index.html
mkdir certs
```



## 6. Sunucuyu Başlatma

```bash
docker-compose up -d
```



## 7. DNS Ayarlarını Doğru Yönlendirme

Alan adı IP yönlendirmeleri:

* `fmarslan.com` → Sunucunun IP adresi
* `www.fmarslan.com` → Sunucunun IP adresi

DNS propagasyonu gerçekleşmeden sertifika üretimi başarısız olur.



## 8. Log ve Sorun Giderme

```bash
docker logs certbot
docker logs apache-server
```

Sertifika hataları genellikle:

* DNS yönlendirmesi,
* `.well-known` erişimi,
* Firewall port engellerinden kaynaklanır.



## 9. Sertifikaların Yenilenmesi

Certbot yenileme yaptığında Apache doğrudan yeni sertifikayı kullanır. Gerekirse Apache’yi yeniden yükleyebilirsiniz:

```bash
docker exec apache-server apachectl graceful
```



Bu yapı ile **Docker üzerinde Apache + Let’s Encrypt otomatik sertifika yönetimi** sorunsuz bir şekilde çalışacaktır. Hem test hem de canlı ortamlar için uyarlanabilir yapıdadır.
