---

title: "Apache NiFi ile Veri Akışı Otomasyonu"
layout: post
date: 2025-08-05
categories: \[bigdata, apache, nifi]
tags: \[nifi, dataflow, apache, iot, kafka, postgres]
summary: "Apache NiFi ile görsel veri akışı yönetimi, düşük kodlu dönüşüm ve aktarım işlemleri üzerine profesyonel bir inceleme"
--------------------------------------------------------------------------------------------------------------------------------

<img src="/assets/img/596f2bf2-a150-4f92-9693-e34f771adcd9.png" alt="cover" style="max-width: 50%; max-height:20%">

## 🔍 Apache NiFi Nedir?

Apache NiFi, veri kaynaklarından gelen farklı formatlardaki verilerin otomatik olarak işlenmesi, dönüştürülmesi ve hedef sistemlere aktarılmasını sağlayan bir veri akış yönetimi platformudur.

* Veri kaynaklarından alma (Kafka, HTTP, FTP, vs.)
* Dönüştürme (JSON to CSV, veri temizleme, zenginleştirme)
* Yönlendirme ve hedefe aktarım (S3, PostgreSQL, API, MinIO)
* Gerçek zamanlı izleme (Provenance, Bulletin Board)

## 📊 NiFi Ne İşe Yarar?

Veri mimarilerinde en çok rastlanan sorunlar:

* Kaynakların dağınık olması
* Veri şekillerinin tutarsız olması
* Güvenli, izlenebilir, şematik veri işleme zorluğu

NiFi, tüm bu sorunları **görsel akış bazlı, sürükle-bırak yapıyla** çözer.

## 🚀 Senaryo: IoT Veri Hatlarının Otomasyonu

### Amaç:

IoT cihazlarından gelen JSON verileri Kafka ile NiFi'ye aktarılıyor. Bu veriler şu adımlardan geçerek PostgreSQL'e yazılıyor:

1. `ConsumeKafkaRecord_2_0`: JSON mesajların alınması
2. `UpdateRecord`: `data` alanındaki key'lerin düzleştirilmesi
3. `ExecuteScript`: SHA256 ile imzalama ve trace güncellemesi
4. `PutS3Object`: MinIO'ya dosya kaydı
5. `PutDatabaseRecord`: PostgreSQL'e yazım

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

* `EncryptContent` ile hassas veriler şifrelenebilir
* `Provenance` ile kim, ne zaman, ne yaptı izlenebilir
* `Site-to-Site` kullanılacaksa TLS zorunlu yapılmalı
* `FlowFile` queue'ları sınırlandırılmalı (max size, count)


## ⚠️ Ek Notlar ve Deneyim Bazlı Uyarılar

Bu yazıda örnek senaryo olarak IoT verileri ele alınmıştır; ancak Apache NiFi yalnızca IoT için değil, pek çok farklı sektörde ve senaryoda (web log analizi, ETL süreçleri, veri senkronizasyonu, API gateway arası veri akışı vb.) başarıyla kullanılabilir. Buradaki örnek, NiFi’nin yeteneklerini somutlaştırmak amacıyla seçilmiştir.

### 🧠 Tasarımda Dikkat Edilmesi Gereken Noktalar

* **NiFi bir *flow orchestration* aracıdır, iş mantığı (logic) motoru değildir.** Karmaşık koşullar ve dönüşümler için NiFi üzerinde çok katmanlı, dallanmış yapılar kurmak sistemi yönetilemez hale getirebilir.

* **Ağır ve karmaşık logic'ler**, mümkünse ayrı mikroservisler olarak ele alınmalı ve NiFi’den dış servis çağrısı ile entegre edilmelidir (`InvokeHTTP`, `ExecuteScript`, `ExecuteStreamCommand` gibi işlemcilerle).

* **Tüm veri trafiği NiFi üzerinden aktığı için**, özellikle prod ortamda:

  * Backpressure yapılandırmaları
  * Provenance verilerinin rotasyonu
  * Disk, CPU, bellek limitleri
  * Cluster kurulumu (yük dengeleme, failover)

  gibi başlıklarda ciddi konfigürasyon yapılmalıdır. Aksi takdirde veri kaybı yaşanabilir veya sistem darboğaza girebilir.

### 🧪 Performans Notu

* NiFi, **Java tabanlı** bir sistemdir ve JVM üzerinde çalışır. Bu, özellikle yoğun yük altındaki sistemlerde **bellek kullanımı açısından dikkatli olunması** gerektiği anlamına gelir. Akış içinde tutulan veri boyutu ve sayısı artırıldıkça bellek tüketimi dramatik şekilde artabilir.

  > 💡 Tavsiye: FlowFile içeriğini mümkün olduğunca kısa tutun, büyük verileri işlemci içinde değil, referansla taşıyın (örneğin MinIO gibi harici objelere yönlendirin).

## 🤖 Alternatifler

| Araç       | Lisans     | Not                           |
| ---------- | ---------- | ----------------------------- |
| NiFi       | Apache 2.0 | Görsel ve akış bazlı tasarım  |
| Talend     | Ticari     | Enterprise ETL                |
| StreamSets | Freemium   | UI odaklı veri hattı yönetimi |
| Airbyte    | MIT        | Modern, connector tabanlı     |


## ✨ Sonuç

NiFi, IOT gibi sistemlerde; veri kaynaklarından gelen yapısız verileri şematik, izlenebilir ve güvenli hale getirerek ölçeklenebilir bir veri pipeline'ı sunar. Kod yazmadan, karmaşık veri operasyonlarını sadeleştirmek için birebirdir.
