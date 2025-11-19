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

Bulut tabanlı ürün kurarken onlarca kavram ve araçla aynı anda uğraşmak gerekiyor; üstelik her biri farklı takımların üzerinde uzlaştığı ortak bir dil istiyor. Aşağıdaki liste, üst üste yığılan bu kavramları temiz ve tekrar kullanılabilir bir sözlüğe dönüştürmek için hazırladığım kısa notlardan oluşuyor.

<img src="/assets/img/modern-bulut-mimarisi-cover.png" alt="Modern bulut mimarisi kapak görseli" width="500">

## Konteyner ve Kubernetes Temelleri

- **Kubernetes çekirdek kavramları** [(kubernetes.io)](https://kubernetes.io/docs/concepts/) → Pod, Deployment/StatefulSet, Service, Ingress, ConfigMap, Secret ve Namespace; hepsi küme içindeki iş yükünü nerede, nasıl ve kiminle konuşacağını belirler. Her biri için erişim, güvenlik ve kaynak tüketimini tanımladığınızda küme davranışı öngörülebilir olur.
- **Node ve NodePool yönetimi** [(kubernetes.io)](https://kubernetes.io/docs/concepts/architecture/nodes/) → Çalışan iş yükülerinin performansı doğrudan düğümlerin donanımına ve havuz stratejisine bağlıdır. Bölge/az seçimleri ve otomatik ölçeklendirme kuralları dayanıklılığı belirler.
- **Yatay otomatik ölçeklendirme (HPA)** [(kubernetes.io)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) → CPU, bellek veya özel metrikleri izleyerek Pod sayısını otomatik değiştirir. Doğru metrik ve minimum/maximum sınır seçimi anlık yüklerde hizmet kesintisini engeller.
- **Liveness & Readiness Probes** [(kubernetes.io)](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) → Uygulamanızın gerçekten ayakta olup olmadığını kubelet’e kanıtlayan sağlık kontrolleridir. Yanlış yapılandırılmış prob değerleri gereksiz yeniden başlatmalara yol açar.
- **Konteyner imajı ve Docker** [(docker.com)](https://www.docker.com/resources/what-container) → Çok katmanlı imaj yapısı, entrypoint/command ve multi-stage build gibi konular üretim ortamında daha küçük ve hızlı imajlar demektir. İmajların sürüm kuralları CI/CD zincirinde şeffaflığı artırır.
- **Kaynak istekleri ve limitleri** [(kubernetes.io)](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) → CPU/bellek sınırlarını ayarlamak yalnızca maliyeti değil kümedeki adil paylaşımı da etkiler. Yanlış limitler throttling veya node çökmesine sebep olabilir.

## Olay Tabanlı Mimariler ve Mesajlaşma

- **Apache Kafka** [(kafka.apache.org)](https://kafka.apache.org/documentation/) → Konu/partisyon/consumer group kurgusu ile yüksek hacimli veri akışını kesintisiz yönlendirir. Offset yönetimi ve commit stratejisi, durumu kaybetmeden geri dönüşleri mümkün kılar.
- **Topic ve Partition tasarımı** → Kategorileri uygun anahtarlarla bölerseniz sıralı mesaj garantisini kritik işlemler için korursunuz. Yanlış dağıtım gecikme ve hotspot oluşturur.
- **Consumer Group ve ölçek** → Aynı gruptaki tüketiciler yükü paylaşırken farklı gruplar aynı veriyi bağımsız işler. Grup ayırımı güvenlik ve çoklanmış senaryolar için esneklik kazandırır.
- **Retry, DLQ ve back-pressure** → Hata yönetimini ayrı kuyruklar ve dengeleyici hız kontrolleriyle yapmak, üretici ve tüketici hızı arasındaki farkı güvenle absorbe eder. Otomatik retry politikaları idempotent işlemlerle birleşince veri tekrarları kaybolur.
- **Kafka UI / gözlem araçları** [(conduktor.io)](https://www.conduktor.io/kafka-console/) → Lag, throughput ve partition durumunu izlemek erken uyarı sağlar. Görsel arayüzler operatörün gözden kaçırdığı paternleri hızlıca ortaya çıkarır.

## Veri Akışı ve Orkestrasyon

- **Apache NiFi** [(nifi.apache.org)](https://nifi.apache.org/docs.html) → Processor, FlowFile, Connection ve Queue kavramları ile veri taşıma/transform işlerini görsel olarak yönetirsiniz. Back-pressure eşikleri ve Provenance takibi, veri yolculuğunu baştan sona şeffaf hale getirir.
- **NiFi Registry** [(nifi.apache.org)](https://nifi.apache.org/registry.html) → Akış tanımlarını versiyonlayarak ortam farklarını kontrol altında tutar. Geri alma ve taşıma süreçleri bu sayede komut satırı yerine tıklamalarla çözülür.
- **Sunucusuz fonksiyon adımları** [(cncf.io)](https://www.cncf.io/projects/serverless-workflow/) → Belgeleri ya da olayları küçük, stateless fonksiyonlara böldüğünüzde bağımsız ölçek ve hızlı dağıtım elde edersiniz. Payload + context yaklaşımı fonksiyonların birbirine sıkı sıkıya bağlanmasını engeller.

## API Ağ Geçitleri ve Sertifika Otomasyonu

- **API Gateway (Kong, KIC)** [(konghq.com)](https://konghq.com/products/kong-gateway) → Trafik yönlendirme, kimlik doğrulama, oran sınırlama ve günlükleme gibi kesişim ihtiyaçlarını tek noktada toplar. gRPC ve REST desteği karma hizmetlerin tek kapıdan sunulmasını sağlar.
- **Sertifika otomasyonu (cert-manager)** [(cert-manager.io)](https://cert-manager.io/docs/) → Issuer/ClusterIssuer, ACME ve DNS challenge kavramları TLS süreçlerini insan müdahalesinden kurtarır. İç ve dış CA yönetimi sayesinde hibrit ağlarda bile güven zinciri kurulabilir.

## Gözlemlenebilirlik ve Operasyon

- **Prometheus metrikleri** [(prometheus.io)](https://prometheus.io/docs/introduction/overview/) → Sayaç, gauge, histogram ve summary türleri ile sistem davranışını rakamlaştırır; ServiceMonitor ve scrape interval ayarları küme kaynak keşfini otomatiğe bağlar. Sağlam etiket düzeni, sorguların anlaşılır kalmasını sağlar.
- **Grafana panoları** [(grafana.com)](https://grafana.com/oss/grafana/) → Metrikleri görsel anlatıya dönüştürür ve alarm kurallarını aynı yerden yönetmenizi sağlar. Paylaşılan pano kütüphaneleri ekip içi ortak dil oluşturur.
- **Fluent Bit log boru hattı** [(fluentbit.io)](https://fluentbit.io/) → Input→Filter→Output sırası ile logları zenginleştirip Elasticsearch/OpenSearch gibi hedeflere yollar. Trace-id veya müşteri kimliği ekleme işlemleri sonradan sorun izlemeyi ciddi biçimde hızlandırır.
- **OpenTelemetry** [(opentelemetry.io)](https://opentelemetry.io/) → Metrik, log ve iz sürümlerini tek standartta toplar, böylece farklı APM ürünlerine geçiş esnekliği sağlar. Otomatik enstrümantasyon desteğiyle servis başına ayrı ajan yönetme yükü azalır.
- **Hizmet seviyeleri** [(sre.google)](https://sre.google/sre-book/service-level-objectives/) → SLO, SLI ve hata bütçesi kavramlarını erken tanımlamak dashboard ve alarm yükünü azaltır. Takımlar hangi metriğin müşteri deneyimini temsil ettiğini netleştirince uyarı fırtınaları durulur.

## Depolama ve Veritabanları

- **Amazon S3 nesne depolama** [(aws.amazon.com/s3)](https://aws.amazon.com/s3/) → Bucket, prefix ve lifecycle policy kavramları, maliyeti ve dayanıklılığı doğrudan etkiler. Pre-signed URL’ler hassas dosyalar için kontrollü paylaşım kapısı sunar.
- **PostgreSQL çoklu kiracı desenleri** [(postgresql.org)](https://www.postgresql.org/docs/current/ddl-schemas.html) → Schema ayrımı, search_path ayarları ve Row Level Security ile müşteri verilerini aynı cluster içinde izole edebilirsiniz. Sağlam indeksleme ve pgBouncer gibi connection pool’lar yüksek trafikte nefes sağlar.
- **Redis önbellekleri** [(redis.io)](https://redis.io/docs/latest/) → Anahtar/değer yapısı, TTL, oran sınırlama token’ları ve persistance seçenekleriyle performans kritik veri için vazgeçilmezdir. Doğru eviction politikası olmadan cache erimesi kaçınılmazdır.

## CI/CD ve DevOps

- **GitOps & Argo CD** [(argo-cd.readthedocs.io)](https://argo-cd.readthedocs.io/) → Deklaratif manifestleri Git’te tutup küme ile otomatik senkron etmek, prod ortamı için audit trail sağlar. Sağlık kuralları ve dal filtreleri ortam ayrımını korur.
- **CI hattı (Build → Scan → Deploy)** → Koddan imaja, güvenlik taramasından dağıtıma kadar zinciri standartlaştırmak sürprizleri azaltır. Her adımda kalite kapıları koymak üretim kazalarını minimuma indirir.
- **Helm Chart yönetimi** [(helm.sh)](https://helm.sh/docs/topics/charts/) → Şablonlama sayesinde aynı hizmet birçok ortamda tekrar kullanılabilir. Values dosyaları ile giz bilgi ve kaynak sınırları kaynağa göre düzenlenir.
- **Ortam ayrımı ve gizli yönetimi** → dev/test/prod çizgilerini korumak, Kubernetes Secrets/External Secrets/Vault kombinasyonu ile mümkün olur. Gizli bilgileri rota içinde tutmadan erişmek sızıntı riskini düşürür.

## Servis Mesh (İsteğe Bağlı)

- **Istio veya Linkerd** [(istio.io)](https://istio.io/latest/docs/) / [(linkerd.io)](https://linkerd.io/2.15/overview/) → mTLS, sıfır güven ağı, yönlendirme kuralları ve gözlemlenebilir proxy katmanı sunar. Trafiği kod dokunmadan yönlendirme, hata enjeksiyonu gibi kabiliyetleri getirir.

## Ölçekleme ve Performans Pratikleri

- **Back-pressure ve asenkron desenler** → Üretici/tüketici hızlarını mesaj broker’ları veya sıra uzunlukları ile dengelemek sistemin nefes almasını sağlar. Engelleyici operasyonlardan kaçınmak akışın tepkisini hızlandırır.
- **Node disk I/O ve depolama seçimi** → Özellikle NiFi repository veya geçici nesne depolama senaryolarında disk IOPS değeri darboğazı belirler. Doğru storage class seçimi, veri akışının beklenmedik şekilde yığılmasını engeller.
- **Retry kalıpları ve idempotency** → Her yeniden deneme davranışının aynı çıktıyı üretmesi, mesaj garantilerini “en az bir kez” veya “tam olarak bir kez” modelleriyle uyumlu hale getirir. Kimlik bazlı kilitler veya idempotent anahtarlar bu güvenceyi verir.
- **Teslimat garantileri** → İş yükünüze göre at-least-once ya da exactly-once sözünü seçmek veri modelinizin geri kalanını şekillendirir. Kompansasyon akışları ve audit log’ları yanlış senaryoları geri almayı kolaylaştırır.

## Uygulama İpuçları

- **CNCF Trail Map** [(cncf.io)](https://www.cncf.io/people/trailmap/) → Konteynerden servis mesh’e kadar hangi teknolojiyi önceleyeceğinizi aşamalı olarak gösteren yol haritası sağlar. Takım yeni araçları aynı sırayla öğrenince kavram karmaşası azalır.
- **Bulut iyi mimari çerçeveleri** [(aws.amazon.com/well-architected)](https://aws.amazon.com/well-architected/) → Güvenlik, maliyet ve operasyon sütunlarını checklist şeklinde sunarak değerlendirme yapmanızı kolaylaştırır. Benzer çerçeveleri Azure veya GCP’de de bulup çapraz karşılaştırma yapabilirsiniz.
- **Çapraz takım sözlükleri** → Kavramların kısa tanımını Confluence/Notion gibi paylaşılmış alanlarda tutup bu yazıya bağlarsanız yeni katılan ekip arkadaşları ilk gününden aynı dili konuşur. Standartlaştırılmış sözlükler, iş gereksinimlerinin teknik mimariye dönüşmesini hızlandırır.
