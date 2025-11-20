---
layout: post
title: "Modern bulut mimarisi için temel kavram listesi"
date: 2025-11-19 10:00:00 +0300
description: Bulut tabanlı platform kurarken en çok karşılaşacağınız kavramları kısa ve sade açıklamalarla derledim.
image: /assets/img/modern-bulut-mimarisi-cover.png
tags:
  - architecture
  - cloud
  - devops
  - kubernetes
---

Bulut tabanlı bir ürün kurarken aynı anda birçok kavram ve araçla uğraşmak gerekiyor. Üstelik tüm bunlar, ekipler arasında ortak bir dil gerektiriyor. Aşağıdaki liste, zaman içinde biriken bu kavramları daha düzenli ve tekrar kullanılabilir bir sözlüğe dönüştürmek için hazırladığım kısa notlardan oluşuyor.

<img src="/assets/img/modern-bulut-mimarisi-cover.png" alt="Modern bulut mimarisi kapak görseli" width="500">

## Konteyner ve Kubernetes Temelleri

* **Kubernetes core concepts** → Pod, Deployment/StatefulSet, Service, Ingress, ConfigMap, Secret ve Namespace; kümedeki workload’ların nerede çalışacağını ve nasıl iletişim kuracağını belirler. Bu bileşenlere doğru access, security ve resource tanımları yapıldığında küme davranışı öngörülebilir hâle gelir.

* **Node & NodePool management** → Workload performansı büyük ölçüde node donanımına, bölge/zone seçimine ve node pool stratejisine bağlıdır. Autoscaling kuralları dayanıklılığı belirler.

* **Horizontal Pod Autoscaler (HPA)** → CPU, memory veya custom metric’lere göre Pod sayısını otomatik ölçeklendirir. Doğru threshold ve min/max ayarları ani yük artışlarında servis kesintisini önler.

* **Liveness / Readiness / Startup Probes** → Uygulamanın gerçekten healthy durumda olup olmadığını kubelet’e bildirir. Yanlış probe değerleri gereksiz restart’lara yol açabilir.

* **Container image & Docker fundamentals** → Layered image yapısı, entrypoint/command, multi-stage build teknikleri daha küçük ve hızlı imajlar üretmenizi sağlar. Image versioning stratejileri CI/CD zincirinde şeffaflık sağlar.

* **Resource requests & limits** → CPU/memory değerlerini doğru belirlemek yalnızca maliyeti değil, cluster içindeki adil paylaşımı da etkiler. Yanlış limit’ler throttling veya node crash ile sonuçlanabilir.

## Event-Driven Architecture ve Mesajlaşma

* **Apache Kafka** → Topic, partition ve consumer group yapısı ile yüksek hacimli veri akışlarını güvenilir şekilde taşır. Offset ve commit stratejileri, veri kaybı olmadan geri dönüş yapmayı mümkün kılar.

* **Topic & partition design** → Doğru key seçimi kritik işlemler için ordering garantisini korur. Yanlış dağıtım latency ve hotspot oluşturabilir.

* **Consumer group scaling** → Aynı consumer group yükü paylaşırken farklı gruplar aynı veriyi bağımsız işler. Bu, hem güvenlik hem de paralel işleme senaryolarına esneklik sağlar.

* **Retry, DLQ ve back-pressure** → Retry politikaları, DLQ yapıları ve consumer hız kontrolü üretici–tüketici dengesini sağlar. İyi tasarlanmış idempotent işlemler tekrar eden veriyi güvenle absorbe eder.

* **Kafka UI / monitoring tools** → Lag, throughput ve partition health görünürlüğü erken uyarı sağlar. Görsel araçlar, operatörlerin gözden kaçırdığı paternleri ortaya çıkarır.

## Data Flow ve Orkestrasyon

* **Apache NiFi** → Processor, FlowFile, Connection ve Queue yapıları ile veri akışlarını görsel olarak yönetmenizi sağlar. Back-pressure threshold’ları ve Provenance takibi uçtan uca şeffaflık sağlar.

* **NiFi Registry** → Flow versiyonlama sayesinde farklı ortamlar arasında tutarlılığı korur. Rollback ve promotion işlemleri CLI yerine görsel olarak yapılabilir.

* **Serverless function steps** → Olayları stateless fonksiyonlara bölmek bağımsız ölçeklendirme ve hızlı deployment sağlar. Payload + context modeli fonksiyonlar arası gereksiz bağımlılığı azaltır.


## API Gateway ve TLS/Sertifika Yönetimi

* **API Gateway (Kong, KIC)** → Routing, authentication, rate limiting, logging gibi ortak ihtiyaçları tek entrypoint altında toplar. gRPC/REST desteği karma servisleri tek kapıdan sunmayı kolaylaştırır.

* **cert-manager** → ACME, Issuer/ClusterIssuer ve DNS challenge mekanizmaları TLS otomasyonunu insan müdahalesinden kurtarır. Internal–external CA yönetimi hibrit ortamlarda bile tutarlı güven zinciri sağlar.

## Observability ve Operasyon

* **Prometheus metrics** → Counter, gauge, histogram ve summary türleri sistem davranışını ölçer. ServiceMonitor ve scrape interval ayarları otomatik discovery sağlar. İyi label dizaynı sorguların okunabilirliğini artırır.

* **Grafana dashboards** → Metrikleri görsel anlatıya dönüştürür, alert kurallarını tek yerden yönetmenizi sağlar. Paylaşılan dashboard kütüphaneleri ekip içi ortak dil oluşturur.

* **Fluent Bit pipeline** → Input → Filter → Output hattında logları zenginleştirip Elasticsearch/OpenSearch gibi hedeflere yönlendirir. Trace-id / customer-id eklemek debugging süresini ciddi biçimde kısaltır.

* **OpenTelemetry** → Metrics, logs ve traces için unified bir standart sağlar. Vendor lock-in riskini azaltır, auto-instrumentation ile ajan yönetimini sadeleştirir.

* **SLO / SLI / Error Budget** → Servis hedeflerini erken belirlemek dashboard ve alert gürültüsünü azaltır. Takımlar, müşteri deneyimini gösteren metriklerde ortaklaşır.

## Storage ve Veritabanları

* **Amazon S3** → Bucket, prefix, lifecycle policy tasarımı maliyet ve dayanıklılığa doğrudan etki eder. Pre-signed URL hassas dosyalar için kontrollü paylaşım sunar.

* **PostgreSQL multi-tenant patterns** → Schema separation, search_path ve Row Level Security ile tenant izolasyonu sağlanır. Doğru index tasarımı ve pgBouncer yoğun trafikte kararlılık sağlar.

* **Redis caching** → Key/value yapısı, TTL, rate-limit token’ları ve persistence seçenekleri performans kritik veriler için idealdir. Yanlış eviction policy cache erimesine sebep olabilir.

## CI/CD ve DevOps

* **GitOps & Argo CD** → Manifestlerin Git üzerinden yönetilmesi güçlü bir audit trail oluşturur. Health check kuralları ve dal filtreleri ortam tutarlılığını sağlar.

* **CI pipeline (Build → Scan → Deploy)** → Code → image → security scan → deploy zincirinin standartlaştırılması sürprizleri azaltır. Quality gate’ler prod hatalarını minimuma indirir.

* **Helm Charts** → Template yapısı sayesinde aynı servis birçok ortamda tekrar kullanılabilir. Values dosyaları secrets ve resource değerlerinin ortama göre uyarlanmasını sağlar.

* **Environment separation & secret management** → dev/test/prod sınırlarının net tutulması ve secrets yönetiminin (Secrets, External Secrets, Vault) merkezi yapılması güvenlik için kritiktir.

## Service Mesh (Opsiyonel)

* **Istio / Linkerd** → mTLS, traffic shifting, policy enforcement ve daha zengin observability sağlar. Trafiği uygulama kodu değiştirmeden yönetme kabiliyeti sunar.

## Scaling ve Performans Pratikleri

* **Back-pressure & async patterns** → Producer–consumer hız farkını, queue depth ve throughput yöneterek dengelemek sistemi kararlı tutar. Blocking operasyonlardan kaçınmak akışı hızlandırır.

* **Node disk I/O & storage class seçimi** → Özellikle NiFi repository veya temporary object depolama senaryolarında disk IOPS gerçek darboğazı belirler.

* **Retry patterns & idempotency** → Her yeniden denemenin aynı sonucu üretmesi persistence katmanında veri tutarlılığı sağlar. Idempotent key mekanizmaları kritik işlemlerde güvence sunar.

* **Delivery guarantees** → Uygulama gereksinimlerinize göre at-least-once veya exactly-once modeli seçilir. Compensation flow’lar ve audit log’lar yanlış senaryoları geri almayı kolaylaştırır.

## Uygulama İpuçları

* **CNCF Trail Map** → Container → orchestration → service mesh → observability gibi teknolojilerin hangi sırayla ele alınacağını gösteren kılavuzdur. Ekiplerin aynı sırayla ilerlemesi kavram karmaşasını azaltır.

* **Cloud Well-Architected Frameworks** → Güvenlik, maliyet, operasyon gibi alanlarda checklist yaklaşımıyla değerlendirme yapmayı kolaylaştırır. AWS, Azure, GCP için ayrı framework’ler mevcuttur.

* **Cross-team glossary** → Temel kavramların kısa tanımlarını Confluence/Notion gibi ortak alanlarda tutmak, yeni katılan ekip üyelerinin ilk günden aynı dili konuşmasını sağlar.
