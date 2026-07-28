---
layout: post
title: "Dockerized Architecture: App, Database, Proxy"
date: 2024-12-01
description: "A short technical note summarizing the basic approach and applicable steps on Dockerized Architecture: App, Database, Proxy."
categories: Docker
lang: en-US
translation_key: "docker-compose-ile-uretim-icin-olceklenebilir-uygulama-mimarisi-app-database-ve-proxy-591e6099"
permalink: /en/2024/12/01/dockerized-architecture-app-database-proxy.html
image: "/assets/img/image.png"
---

This architecture is a compact Docker-Compose structure consisting of three basic components: a web application (app), a database (db) and a reverse proxy (nginx). It offers a simple, manageable and extensible infrastructure for both development and production environments.

## 1. **Architectural Design**

This structure is shaped around three main containers:

### **1. App Container**

* Can run on Node.js, Python or any other runtime you want.
* Takes over all business logic of the application.
* Gets configuration values ​​through environment variables.

### **2. Database Container**

* A classic RDBMS such as PostgreSQL / MySQL can be used.
* Thanks to `volumes`, the data is made permanent.
* Password and connection information is read from the `.env` file.

### **3. Proxy Container (nginx)**

* Acts as a reverse proxy.
* Directs all traffic from the outside world to the App container.
* HTTPS support and request routing rules are managed here.

### **Communication Model**

* App → DB access is via **internal Docker network only**.
* External traffic is controlled via Proxy → App redirection.

## 2. **File Structure**

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

## 3. **Docker-Compose Configuration**

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

## 5. **Nginx Configuration**

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

## 6. **Recommendations for the Production Environment**

### **Security**

* Keep sensitive information encrypted in the .env file.
* Define DB user permissions at a minimum level.
* Add nginx + Let's Encrypt build for HTTPS.

### **Performance**

* Scale by replicating the app container.
* Define simple load balancer rules on Nginx.
* Use `connection pooling` for DB connections.

### **Persistence**

* `volumes` should be mandatory for data and logs.
* Add automatic backup mechanisms.

### **Monitoring and Logging**

* Use central monitoring tools like ELK, Loki or Prometheus.
* Check the container status by adding Healthcheck.

### **Redundancy**

* For larger builds, consider moving to Docker Swarm or Kubernetes.

## 7. **Initialization and Testing**

### **Create the .env file**

```env
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
```

### **Start build**

```bash
docker-compose up --build
```

### **Test**

* App: `http://localhost:5000`
* Proxy: `http://localhost`

## 8. **Conclusion**

This architecture provides a stable and easily manageable Docker infrastructure for both development and live environments. Adding security, monitoring, redundancy and performance settings on the production side creates a very solid foundation.
