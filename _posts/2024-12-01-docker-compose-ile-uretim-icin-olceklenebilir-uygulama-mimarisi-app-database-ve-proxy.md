---
layout: post
title: "Dockerize Edilmiş Mimari: App, Database, Proxy"
categories: Docker
---

<img src="/assets/img/image.png" alt="cover" style="max-width: 50%; max-height:20%">

Bu mimari, bir web uygulaması (app), bir veri tabanı (db) ve bir ters proxy (nginx) içeren üç ana Docker container'ı kapsar. Bu çözüm Docker-Compose kullanılarak çalıştırılır ve üretim ortamında güvenilir bir yapı sunar.

---

### 1. **Mimari Tasarım**

**Bileşenler:**
1. **App Container**  
   - Uygulama Node.js, Python veya başka bir framework kullanabilir.  
   - Bu container yalnızca iş mantığını işler.
   - Uygulama, ortam değişkenlerini kullanarak dinamik yapılandırılır.

2. **Database Container**  
   - PostgreSQL veya MySQL gibi bir RDBMS kullanılır.  
   - Veriler `volumes` kullanılarak kalıcı hale getirilir.  
   - Gerekli yapılandırmalar için şifreler ve bağlantı bilgileri şifreli bir ortam değişkeni dosyasından (`.env`) okunur.

3. **Proxy Container (nginx)**  
   - Reverse Proxy görevi görür.  
   - Trafiği uygulamaya yönlendirir ve SSL sertifikası ile HTTPS desteği sağlar.  
   - Yük dengeleme desteği sunabilir.

**İletişim:**
- App, Database'e sadece dahili Docker ağı (`bridge network`) üzerinden erişir.
- Proxy, dış dünyadan gelen istekleri alır ve App container'ına yönlendirir.

---

### 2. **Dosya Yapısı**

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

---

### 3. **Docker-Compose Yapılandırması**

**docker-compose.yml**

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

---

### 4. **App Dockerfile**

**app/Dockerfile**

```dockerfile
FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

---

### 5. **Nginx Konfigürasyonu**

**nginx/nginx.conf**

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

---

### 6. **Üretim Ortamı İçin Öneriler**

**1. Güvenlik:**
- Ortam değişkenlerini `.env` dosyasında şifreli tutun.
- Veritabanı için kullanıcı izinlerini kısıtlayın.
- `nginx` üzerinden HTTPS sertifikası sağlayın. (Let's Encrypt kullanılabilir.)

**2. Performans:**
- Uygulama container'ını ölçeklenebilir hale getirin (`docker-compose scale` veya `replicas` ile).
- Yük dengeleme için nginx'i yapılandırın.
- Veritabanı performansı için `connection pool` kullanın.

**3. Kalıcılık:**
- Veritabanı ve loglar için `volumes` kullanın.
- Yedekleme mekanizmalarını yapılandırın.

**4. İzleme ve Loglama:**
- Loglar için bir merkezi sistem kullanın (ör. ELK Stack, Prometheus).
- Container'ların durumunu izlemek için araçlar (ör. Docker Healthchecks) ekleyin.

**5. Yedeklilik:**
- App ve DB container'larını birden fazla node'a dağıtmak için Docker Swarm veya Kubernetes kullanın.

---

### 7. **Başlatma ve Test**

1. **Ortam Değişkenlerini Ayarlayın:**
   - `.env` dosyasını oluşturun:
     ```
     DB_USER=myuser
     DB_PASSWORD=mypassword
     DB_NAME=mydatabase
     ```

2. **Docker-Compose ile Çalıştırın:**
   ```bash
   docker-compose up --build
   ```

3. **Test:**
   - Uygulama: `http://localhost:5000`
   - Proxy: `http://localhost`

---

### 8. **Sonuç**

Bu yapı, hem geliştirme hem de üretim ortamlarında kullanılabilir. Üretim için dikkat edilmesi gerekenler arasında güvenlik, performans, kalıcılık ve izleme gelir. Docker Compose ile kolayca ölçeklenebilir ve yönetilebilir bir yapı sağlanır.
