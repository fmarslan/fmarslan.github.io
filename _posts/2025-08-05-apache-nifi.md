---
title: "Apache NiFi ile Veri Akışı Otomasyonu"
layout: post
date: 2025-08-05
categories: [apache, nifi]
tags: [nifi, dataflow, apache, iot, kafka, postgres]
summary: "Apache NiFi ile görsel veri akışı yönetimi, düşük kodlu dönüşüm ve aktarım işlemleri üzerine profesyonel bir inceleme"
---

Apache NiFi, farklı kaynaklardan gelen verilerin otomatik olarak toplanması, dönüştürülmesi ve hedef sistemlere aktarılması için geliştirilmiş güçlü bir **veri akışı otomasyon platformudur**. Görsel tasarım arayüzü sayesinde karmaşık veri hatlarını kod yazmadan oluşturmayı mümkün kılar.

<img src="/assets/img/596f2bf2-a150-4f92-9693-e34f771adcd9.png" alt="cover" style="max-width: 50%; max-height:20%">



## 🔍 NiFi Nedir ve Neden Kullanılır?

NiFi aşağıdaki işlemleri uçtan uca yönetebilmesiyle öne çıkar:

* Farklı veri kaynaklarından okuma (Kafka, HTTP, FTP vb.)
* Veri dönüştürme (temizleme, zenginleştirme, format değişimi)
* Yönlendirme ve hedefe aktarım (S3, PostgreSQL, API, MinIO)
* Gerçek zamanlı izleme (Provenance, Bulletin Board)

Dağınık veri kaynaklarının toplandığı yapılarda; tutarsız formatlarla uğraşan, izlenebilirlik isteyen ekipler için NiFi büyük kolaylık sağlar.



## 📊 NiFi'nin Sağladığı Çözüm

Tipik veri mimarisi sorunları:

* Kaynakların dağınık olması
* Veri formatlarının tutarsızlığı
* Şeffaf ve güvenli bir veri hattı kurma zorluğu

NiFi, bu sorunlara **görsel sürükle-bırak tabanlı akış modeliyle** çözüm getirir.



## 🚀 Örnek Senaryo: IoT Veri Hatlarının Otomasyonu

IoT cihazlarından gelen JSON mesajları önce Kafka’ya, ardından NiFi’ye ulaşır. NiFi bu verileri işleyerek PostgreSQL’e kaydeder.

### Akış Adımları:

1. **ConsumeKafkaRecord_2_0** → JSON mesajların alınması
2. **UpdateRecord** → `data` içindeki alanların düzleştirilmesi
3. **ExecuteScript** → SHA256 imzalama ve trace zenginleştirmesi
4. **PutS3Object** → MinIO’ya dosya kaydı
5. **PutDatabaseRecord** → PostgreSQL’e yazım

### Docker Compose Örneği

```yaml
db:
  image: postgres:15
  environment:
    POSTGRES_DB: nifi_demo
    POSTGRES_USER: nifi
    POSTGRES_PASSWORD: nifi123
  ports:
    - "5432:5432"
  volumes:
    - ./pgdata:/var/lib/postgresql/data

nifi:
  image: apache/nifi:2.5.0
  ports:
    - "8080:8080"
  environment:
    NIFI_WEB_HTTP_PORT: 8080
  volumes:
    - ./nifi_conf:/opt/nifi/nifi-current/conf
  hostname: nifi.fmarslan.com
```



## 📈 Performans ve Güvenlik

NiFi'nin güçlü yönleri aynı zamanda dikkatli yönetilmesi gereken alanlardır.

* **EncryptContent** ile hassas veriler şifrelenebilir
* **Provenance** tüm işlemlerin kim tarafından ne zaman yapıldığını kaydeder
* **Site-to-Site** kullanımında TLS zorunlu olmalıdır
* FlowFile kuyrukları için **backpressure limitleri** mutlaka ayarlanmalıdır



## ⚠️ Deneyim Bazlı Uyarılar

NiFi IoT senaryolarında sık kullanılsa da; ETL, veri senkronizasyonu, API-to-API akışları ve log işleme gibi çok farklı alanlarda da etkilidir.

### 🧠 Tasarım Prensipleri

* Çok dallanan karmaşık akışlar yönetimi zorlaştırır.
* **NiFi bir orchestration aracıdır; iş mantığı motoru değildir.**
* Ağır işlem ve karmaşık hesaplamalar ayrı mikroservislerde yapılmalı, NiFi bu servislerle iletişim kurmalıdır.
* Üretim ortamlarında mutlaka şu başlıklar düşünülmelidir:

  * Backpressure yapılandırması
  * Provenance rotasyonu
  * CPU, RAM limitleri
  * Cluster yapısı (load balancing, failover)

### 🧪 Performans Notu

NiFi Java tabanlıdır ve JVM üzerinde çalışır. Bu nedenle büyük veri akışlarında bellek kullanımı hızla yükselebilir.

> 💡 **Tavsiye:** FlowFile içeriğini mümkün olduğunca küçük tutun. Büyük verileri işlemciler arasında taşımak yerine MinIO gibi harici depolara yönlendirin.



## 🤖 Alternatifler

| Araç       | Lisans     | Not                                 |
| - | - | -- |
| NiFi       | Apache 2.0 | Görsel, sürükle-bırak akış tasarımı |
| Talend     | Ticari     | Enterprise ETL                      |
| StreamSets | Freemium   | UI odaklı veri hattı yönetimi       |
| Airbyte    | MIT        | Modern, connector tabanlı           |



## ✨ Sonuç

NiFi, IoT gibi hızlı veri üreten sistemlerde; veriyi şematik hale getirmek, izlenebilir yapmak ve güvenli şekilde işleyip yönlendirmek için ideal bir çözüm sunar. Kod yazmadan güçlü veri hatları oluşturmak isteyen ekipler için oldukça etkili bir araçtır.

[https://nifi.apache.org/](https://nifi.apache.org/)
