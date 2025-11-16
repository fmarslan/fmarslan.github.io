---
layout: post
title: "Dockerize Edilmiş Mimari: App, Database, Proxy"
categories: Docker
---

Bu mimari, bir web uygulaması (app), bir veritabanı (db) ve bir ters proxy (nginx) gibi üç temel bileşenden oluşan kompakt bir Docker-Compose yapısıdır. Hem geliştirme hem de üretim ortamları için sade, yönetilebilir ve genişletilebilir bir altyapı sunar.

<img src="/assets/img/image.png" alt="cover" style="max-width: 50%; max-height:20%">



## 1. **Mimari Tasarım**

Bu yapı üç ana container etrafında şekillenir:

### **1. App Container**

* Node.js, Python veya istediğiniz başka bir runtime üzerinde çalışabilir.
* Uygulamanın tüm iş mantığını üstlenir.
* Yapılandırma değerlerini environment değişkenleri üzerinden alır.

### **2. Database Container**

* PostgreSQL / MySQL gibi klasik bir RDBMS kullanılabilir.
* `volumes` sayesinde veriler kalıcı hale getirilir.
* Şifre ve bağlantı bilgileri `.env` dosyasından okunur.

### **3. Proxy Container (nginx)**

* Reverse proxy görevi görür.
* Dış dünyadan gelen tüm trafiği App container'ına yönlendirir.
* HTTPS desteği ve istek yönlendirme kuralları burada yönetilir.

### **İletişim Modeli**

* App → DB erişimi **sadece dahili Docker ağı** üzerinden yapılır.
* Proxy → App yönlendirmesi üzerinden dış trafik kontrol edilir.



## 2. **Dosya Yapısı**

```plaintext
project/
├── docker-compose.yml
├── app/
│   ├── Dockerfile
│   ├── src/
│   └── requirements.txt
├── nginx/
│   ├── nginx.conf
├── db/
│   └── init.sql
├── .env
└── README.md
```



## 3. **Docker-Compose Yapılandırması**

```yaml
version: '3.9'
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
    networks:
      - backend

  db:
    image: postgres:latest
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    networks:
      - backend

  proxy:
    image: nginx:latest
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
      - "443:443"
    networks:
      - backend
      - frontend

volumes:
  db_data:

networks:
  backend:
  frontend:
```



## 4. **App Dockerfile**

```dockerfile
FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```



## 5. **Nginx Yapılandırması**

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://app:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```



## 6. **Üretim Ortamı İçin Öneriler**

### **Güvenlik**

* .env dosyasında hassas bilgileri şifreli tutun.
* DB kullanıcı izinlerini minimum seviyede tanımlayın.
* HTTPS için nginx + Let's Encrypt yapısını ekleyin.

### **Performans**

* App container'ını çoğaltarak ölçeklendirin.
* Nginx üzerinde basit load balancer kuralları tanımlayın.
* DB bağlantıları için `connection pooling` kullanın.

### **Kalıcılık**

* Veriler ve loglar için `volumes` zorunlu olmalı.
* Otomatik yedekleme mekanizmaları ekleyin.

### **İzleme ve Loglama**

* ELK, Loki veya Prometheus gibi merkezi izleme araçları kullanın.
* Healthcheck ekleyerek container durumunu kontrol edin.

### **Yedeklilik**

* Daha geniş yapılar için Docker Swarm veya Kubernetes’e geçiş düşünün.



## 7. **Başlatma ve Test**

### **.env dosyasını oluşturun**

```env
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
```

### **Yapıyı başlatın**

```bash
docker-compose up --build
```

### **Test**

* App: `http://localhost:5000`
* Proxy: `http://localhost`



## 8. **Sonuç**

Bu mimari, hem geliştirme hem de canlı ortamlar için stabil ve kolay yönetilebilir bir Docker altyapısı sağlar. Üretim tarafında güvenlik, izleme, yedeklilik ve performans ayarları eklendiğinde oldukça sağlam bir temel oluşur.
