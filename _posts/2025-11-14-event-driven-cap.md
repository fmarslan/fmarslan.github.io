---
layout: post
title: "CAP Yaklaşımı ve Event-Driven Tasarım: Modern Sistemlerin Görünmeyen Omurgası"
categories: [CAP, Event-Driven]
mermaid: true
---

<img src="/assets/img/5198cfa0-de03-4bb5-b637-e100abef9ab1.png" alt="cover" style="max-width: 50%; max-height:10%">

Dağıtık sistemler dünyası hızla büyüyor. Uygulamalar artık tek bir sunucudan ibaret değil; onlarca, yüzlerce bağımsız bileşenden oluşan karmaşık yapılara dönüştü.

Bu yeni mimari evrende kritik bir soru ortaya çıkıyor:

> **“Tutarlılık mı daha önemli, erişilebilirlik mi, yoksa her koşulda çalışabilirlik mi?”**

Bu sorunun cevabı → **CAP Teoremi**
Bu cevabın pratik karşılığı → **Event-Driven Tasarım**

---
## 1. Dağıtık Sistemlerde Büyük Resim

Modern uygulamalar:

* yüksek hacimli istekleri karşılamak zorunda,
* olası hata/bölünme senaryolarında ayakta kalmak zorunda,
* coğrafi olarak dağılmış ortamda veri bütünlüğünü korumak zorunda.

Tek makine üzerinde çalışan monolitik mimarilerden dağıtık ekosisteme geçince, sistemlerin davranışlarını yöneten **temel prensiplerden biri CAP teoremidir**.

Aşağıdaki şema bu gerçeği özetler:

<div class="mermaid">
graph TD
    A[Dağıtık Sistem] --> B(C: Tutarlılık)
    A --> C(A: Erişilebilirlik)
    A --> D(P: Bölünme Toleransı)
</div>
---

## 2. CAP Teoremi (Consistency – Availability – Partition Tolerance)

### 2.1 Tanım

CAP Teoremi, bir dağıtık sistemin **aynı anda C + A + P üçlüsünü tam olarak sağlayamayacağını** söyler.

Bir ağ bölünmesi yaşandığında sistem şu kararı vermek zorundadır:

* **C (Consistency)** → Tutarlılık
* **A (Availability)** → Erişilebilirlik
* **P (Partition Tolerance)** → Bölünme toleransı

> Bölünme kaçınılmaz olduğundan, sistem genellikle **C mi A mı öncelenecek** kararını verir.

---

## 3. CAP Kavramları Basitçe

### **Consistency (Tutarlılık)**

Her okuma en güncel veriyi döner.
“Bankadaki para her şubede aynı görünmeli.”

### **Availability (Erişilebilirlik)**

Sistem her isteğe bir cevap verir — hata bile olsa.
“Sistem cevap veriyorsa ayaktadır.”

### **Partition Tolerance (Bölünme Toleransı)**

Ağ kesintileri yaşansa bile sistem çalışmaya devam eder.

---

## 4. “Üçünden İkisi” Mitinin Gerçek Yüzü

CAP, bir seçim menüsü değil; **bir reaksiyon modelidir**.

Sistem tasarlanırken değil, **bölünme anında hangi özelliği koruduğu** önemlidir.

Aşağıdaki tablo bunu özetler:

| Tip | Sağladığı | Feda Ettiği | Kullanım Alanı |
|-----|-----------|--------------|----------------|
| CP  | Tutarlılık + Bölünme | Erişilebilirlik | Bankacılık, lider seçimli sistemler |
| AP  | Erişilebilirlik + Bölünme | Tutarlılık | Event-driven, log sistemleri, IoT |

---

## 5. CAP’e Göre Sistem Tipleri

<div class="mermaid">
    graph LR
    CP[CP Sistemleri] --- C1(Tutarlı)
    CP --- C2(Bölünme Toleranslı)
    CP -.->|Feda: Erişilebilirlik| CX
    AP[AP Sistemleri] --- A1(Erişilebilir)
    AP --- A2(Bölünme Toleranslı)
    AP -.->|Feda: Anlık Tutarlılık| AX
</div>

### **CP Sistemleri**

* Her zaman doğru veri gösterir
* Ama bölünme anında bazı istekleri reddedebilir
  Örnek: Dağıtık Config Store (Zookeeper, Etcd)

### **AP Sistemleri**

* Her durumda cevap verir
* Verinin tutarlılığı *gecikmeli* olabilir
  Örnek: Event-driven pipeline, IoT veri toplayıcılar, log sistemleri

---

## 6. Event-Driven Mimarinin Doğuşu

Senkron REST çağrılarının yarattığı problemler:

* yüksek gecikme,
* servis bağımlılıkları,
* tek hata noktasının tüm sistemi etkilemesi,
* ölçeklenebilirliğin zorlaşması.

Bu nedenle modern mimaride **asenkron – loosely coupled – message-driven** yaklaşım tercih edilir.

Aşağıdaki şema basit bir event akışını anlatır:

<div class="mermaid">
sequenceDiagram
    participant A as Sipariş Servisi
    participant B as Ödeme Servisi
    participant C as Fatura Servisi

    A->>Broker: event: OrderCreated
    Broker->>B: OrderCreated
    B->>Broker: event: PaymentCompleted
    Broker->>C: PaymentCompleted
</div>

---

## 7. Event-Driven = Doğal Bir AP Yaklaşımı

Olay tabanlı mimariler **gereksiz bekleme yapmaz**, herkes kendi işini yapar.

Bu nedenle:

* **Erişilebilirlik yüksektir (A)**
* **Ağ bölünmelerinden korkmaz (P)**
* Tutarlılık ise **eventual consistency** şeklindedir.

Bu, zayıflık değil → **tasarım tercihi**dir.

> 500 ms gecikmeli güncellenmiş bir stok bilgisi, bir e-ticaret platformu için genelde felaket değildir.
> Ama yüksek hacimli taleplerde erişilebilirlik kritik önem taşır.

---

## 8. CAP Odaklı Mimari Seçim Örnekleri


| Senaryo | Tercih | Sebep |
|---------|--------|--------|
| Gerçek zamanlı para transferi | CP | Tutarsızlık kabul edilemez |
| Log işleme, bildirim, workflow | AP | Tutarlılık gecikmeli olabilir |
| IoT sensör verisi toplama | AP | Cevap sürekliliği daha önemli |
| Config yönetimi | CP | Tüm node’lar aynı config'i görmeli |

---

## 9. Event-Driven Mimarinin Teknik Avantajları

### ✔ Ölçeklenebilirlik

Her servis kendi başına büyüyebilir.

### ✔ Dayanıklılık

Bir servis düştüğünde bile event kuyruğu ayakta kalır.

### ✔ Performans

İstekler gecikmez; kuyruk sistemleri yükü dengeler.

### ✔ Gevşek Bağlılık

Servisler arası bağımlılığı minimuma indirir.

### ✔ Genişletilebilirlik

Yeni bir servis eklemek çoğu zaman sadece bir “event listener” oluşturmaktır.

---

## 10. Akış Diyagramı: Event-Driven Bir Sistemin Çalışma Şekli

<div class="mermaid">
flowchart LR
    A[Producer Service] -->|Event gönderir| K((Event Bus))
    B[Worker Service] -->|Event tüketir| K
    C[Notification Service] -->|Event tüketir| K
    D[Analytics Service] -->|Event tüketir| K

    K --> E[(Event Store)]
</div>

---

## 11. Dikkat Edilmesi Gerekenler

Event-driven mimari güçlüdür ancak **dikkat edilmezse kaosa dönüşebilir**:

* Event sınırlarının iyi belirlenmesi
* **İdempotent tüketiciler** (event birkaç kez gelse bile aynı sonucu üretir)
* Retry + DLQ tasarımı
* Versioning (event şemasının değişmesi)
* Correlation ID ile uçtan uca izleme
* Çok fazla event üretmemek (event storming)

### Örnek: Event İdempotency Mantığı

```pseudo
if event.id in processed_events:
    ignore
else:
    process(event)
    save(event.id)
```

---

## 12. Serverless bağlamında CAP + Event-Driven

Serverless mimaride (AWS Lambda, Azure Functions):

* timeout,
* cold start,
* event ordering,
* retry politikaları
  gibi ek kurallar işin içine girer.

Bu nedenle:

* iyi tasarlanmış input / output
* izlenebilirlik
* merkezi loglama
* dağıtık trace
  hayati önem taşır.

---

## 13. Sonuç

CAP teoremi bize şunu söyler:

> **Bir dağıtık sistemde tutarlılık ile erişilebilirlik arasında her zaman bir gerilim vardır.**

Event-driven tasarım ise:

> **Bu gerilimi AP yönünde çözerek ölçeklenebilir, dayanıklı mimariler kurulmasını sağlar.**

Modern sistemlerin büyük çoğunluğu şu üçlünün kombinasyonunu kullanır:

* **AP yaklaşımı**
* **Eventual Consistency**
* **Event-Driven Architecture**

Siz de yeni bir sistem tasarlarken şu soruyu sorun:

> “Bu senaryoda tutarlılık mı daha kritik, erişilebilirlik mi?”

Cevabınız, mimarinizi şekillendirecektir.

---

## Kaynaklar

* [Arslan, F. M.: *“Serverless Bir Mimari Hazırlarken Dikkat Edilmesi Gereken Önemli Noktalar”*, Ekim 2023.](https://fmarslan.com/javascript/2023/10/20/serverless-tasar%C4%B1mlarda-dikkat-edilmesi-gereken-hususlar.html)
* [Brewer, Eric: CAP Theorem publications](https://sites.cs.ucsb.edu/~rich/class/cs293b-cloud/papers/brewer-cap.pdf)
* Dağıtık sistemler ve event-driven mimari üzerine çeşitli teknik kaynaklar

