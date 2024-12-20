---
layout: post
title: "Let's Encrypt ile Apache için SSL Sertifikası"
categories: SSL,Apache
---
![cover](/assets/img/apache-lets-encrypt.webp)
Bu rehber, Let's Encrypt kullanarak otomatik SSL sertifikası yenileyen bir Apache sunucusunu Docker ile nasıl hazırlayacağınızı gösterir. Örnekler gerçekçi bir senaryo üzerinden sunulmuştur.

---

#### 1. Proje Dizini Oluşturma

Önce bir klasör oluşturup içine gerekli dosyaları ekleyelim:

```bash
mkdir apache-ssl
cd apache-ssl
```

---

#### 2. Dockerfile Hazırlama

Apache'yi çalıştıracak bir `Dockerfile` oluşturun:

```dockerfile
FROM httpd:2.4

# Gerekli dizinleri oluştur
RUN mkdir -p /etc/letsencrypt/live /var/www/html

# Apache yapılandırmasını ekle
COPY ./apache.conf /usr/local/apache2/conf/httpd.conf
```

---

#### 3. Apache Ayarları

`apache.conf` dosyasını oluşturun ve sertifikalarla çalışacak şekilde ayarlayın:

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

Alan adını kendi sitenize göre güncellemeyi unutmayın.

---

#### 4. Docker Compose Dosyası

Hem Apache’yi hem de Certbot’u yönetecek bir `docker-compose.yml` dosyası hazırlayın:

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

**Not:** Yukarıdaki `while` döngüsü yalnızca test ortamı içindir. Gerçek kullanım için daha sağlam yöntemler tercih edilmelidir. Örneğin:

```bash
0 0 * * * docker run --rm -v $(pwd)/certs:/etc/letsencrypt -v $(pwd)/html:/var/www/html certbot/certbot renew
```

---

#### 5. Gerekli Klasörler

HTML içerikleri ve sertifikalar için dizinler oluşturun:

```bash
mkdir html
echo "<h1>SSL Test Sayfası</h1>" > html/index.html
mkdir certs
```

---

#### 6. Sunucuyu Çalıştırma

Konteynerleri başlatmak için aşağıdaki komutu çalıştırın:

```bash
docker-compose up -d
```

---

#### 7. DNS Ayarları

Alan adınızı doğru IP’ye yönlendirdiğinizden emin olun. Örnek DNS kayıtları:

- `fmarslan.com` → Sunucu IP adresiniz
- `www.fmarslan.com` → Sunucu IP adresiniz

---

#### 8. Sorun Giderme

Bir sorun çıkarsa loglara bakarak kontrol edin:

```bash
docker logs certbot
docker logs apache-server
```

---

#### 9. Sertifikaların Yenilenmesi

Certbot, sertifikaları yeniledikçe Apache bunu otomatik olarak kullanır. Eğer manuel bir çözüm tercih ederseniz, yenileme sonrası Apache’yi yeniden başlatmanız gerekebilir:

```bash
docker exec apache-server apachectl graceful
```

---

Bu yapılandırma ile otomatik sertifika yenilemeyi çalışır hale getirmiş olacaksınız. Test ortamı ve gerçek projeler için uygundur.
