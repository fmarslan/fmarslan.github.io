---
layout: post
title: "CAP Yaklaşımı ve Event-Driven Tasarım: Modern Sistemlerin Görünmeyen Omurgası"
categories: [CAP, Event-Driven]
mermaid: true
---

Dağıtık sistemler hızla büyürken, uygulamaların tek bir makinede çalıştığı dönem çok geride kaldı. Artık yüzlerce bileşenin eşzamanlı çalıştığı, farklı bölgelerde dağılmış, hata toleransının yüksek olması beklenen yapılarla uğraşıyoruz. Bu dönüşüm, beraberinde temel bir soruyu getiriyor:

> **“Tutarlılık mı daha önemli, erişilebilirlik mi, yoksa kesinti anında bile çalışabilirlik mi?”**

Bu soruya akademik cevap → **CAP Teoremi**
Pratik karşılığı → **Event-Driven Tasarım**

<img src="/assets/img/5198cfa0-de03-4bb5-b637-e100abef9ab1.png" alt="cover" style="max-width: 50%; max-height:10%">


## 1. Dağıtık Sistemlerde Büyük Resim

Modern sistemler:

* yüksek trafik altında ayakta kalmak,
* bölünme (partition) senaryolarında çalışmaya devam etmek,
* veriyi mümkün olduğunca tutarlı şekilde sunmak

zorundadır.

Monolitik yapılardan dağıtık sistemlere geçildiğinde, sistemi yönlendiren ilkelerden biri **CAP Teoremidir**.

<div class="mermaid">
graph TD
    A[Dağıtık Sistem] --> B(C: Tutarlılık)
    A --> C(A: Erişilebilirlik)
    A --> D(P: Bölünme Toleransı)
</div>


## 2. CAP Teoremi (Consistency – Availability – Partition Tolerance)

### 2.1 Tanım

CAP Teoremi, bir dağıtık sistemin **aynı anda C + A + P üçlüsünü tam olarak sağlayamayacağını** söyler.

Bir ağ bölünmesi yaşandığında sistem şu tercihle karşı karşıya kalır:

* **C (Consistency)** → Verinin her yerde güncel olması
* **A (Availability)** → Sistemin her isteğe yanıt verebilmesi
* **P (Partition Tolerance)** → Ağ bölünmelerinde bile çalışmaya devam etmesi

> Bölünme kaçınılmaz olduğundan, asıl seçim **C mi A mı öne çıkacak?** sorusudur.



## 3. CAP Kavramları Basitçe

### **Consistency (Tutarlılık)**

Tüm istemciler aynı veriyi görür. Örneğin: "Bankadaki bakiyenin tüm şubelerde aynı görünmesi."

### **Availability (Erişilebilirlik)**

Sistem her isteğe yanıt verir – bu yanıt hata da olabilir.

### **Partition Tolerance (Bölünme Toleransı)**

Ağ kopsa bile sistemin işlemeye devam etmesidir.



## 4. “Üçünden İkisi” Yanılgısının Gerçeği

CAP, bir menüden iki seçenek seçmek değildir; **bölünme yaşandığında verilen tepkidir**.

Aşağıdaki tablo bu davranışı özetler:

| Tip | Sağladığı                 | Feda Ettiği     | Kullanım Alanı                     |
|  | - |  | - |
| CP  | Tutarlılık + Bölünme      | Erişilebilirlik | Bankacılık, lider seçim sistemleri |
| AP  | Erişilebilirlik + Bölünme | Tutarlılık      | Event-driven, log işleme, IoT      |



## 5. CAP’e Göre Sistem Tipleri

<div class="mermaid">
    graph LR
    CP[CP Sistemleri]  C1(Tutarlı)
    CP  C2(Bölünme Toleranslı)
    CP -.->|Feda: Erişilebilirlik| CX
    AP[AP Sistemleri]  A1(Erişilebilir)
    AP  A2(Bölünme Toleranslı)
    AP -.->|Feda: Anlık Tutarlılık| AX
</div>

### **CP Sistemleri**

* Her zaman doğru veri üretir.
* Bölünme anında bazı istekler reddedilebilir.
  Örnek: Zookeeper, Etcd.

### **AP Sistemleri**

* Her durumda yanıt verir.
* Tutarlılık **gecikmeli** sağlanır.
  Örnek: IoT veri toplayıcıları, log sistemleri, event-driven pipeline.



## 6. Event-Driven Mimarinin Doğuşu

Senkron REST çağrılarının tipik sorunları:

* yüksek gecikme,
* zincirleme bağımlılıklar,
* tek hata noktasının tüm sistemi etkilemesi,
* ölçeklemenin zorlaşması.

Bu nedenle modern yapılar **asenkron – loosely coupled – message-driven** kurgulara yönelir.

Aşağıdaki sequence diyagramı örnek bir süreci anlatır:

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



## 7. Event-Driven = Doğal Bir AP Yaklaşımı

Event-driven mimari bekleme gerektirmez; herkes işini bağımsız yürütür.

Bu nedenle:

* **Erişilebilirlik yüksektir (A)**
* **Ağ bölünmelerine toleranslıdır (P)**
* Tutarlılık ise çoğu zaman **eventual consistency** şeklindedir

> 500 ms gecikmiş stok güncellemesi genellikle kritik değildir; ancak erişilebilirlik çoğu sistem için hayati önem taşır.



## 8. CAP Odaklı Mimari Seçim Örnekleri

| Senaryo              | Tercih | Sebep                              |
| -- |  | - |
| Para transferi       | CP     | Tutarsızlık kabul edilemez         |
| Log işleme, bildirim | AP     | Tutarlılık gecikmeli olabilir      |
| IoT veri toplama     | AP     | Sürekli cevap vermek daha önemli   |
| Config yönetimi      | CP     | Tüm node'lar aynı config'i görmeli |



## 9. Event-Driven Mimarinin Teknik Avantajları

### ✔ Ölçeklenebilirlik

Her servis kendi yüküne göre büyüyebilir.

### ✔ Dayanıklılık

Bir servis durduğunda bile kuyruğun ayakta kalması işlem sürekliliğini korur.

### ✔ Performans

İstekler bloklanmaz; mesajlaşma sistemi yükü dengeler.

### ✔ Gevşek Bağlılık

Servis bağımlılıklarını minimuma indirir.

### ✔ Genişletilebilirlik

Yeni bir servis eklemek çoğu zaman yalnızca bir “event listener” yazmak demektir.



## 10. Diyagram: Event-Driven Sistemin Akışı

<div class="mermaid">
flowchart LR
    A[Producer Service] -->|Event gönderir| K((Event Bus))
    B[Worker Service] -->|Event tüketir| K
    C[Notification Service] -->|Event tüketir| K
    D[Analytics Service] -->|Event tüketir| K

K --> E[(Event Store)]

</div>



## 11. Dikkat Edilmesi Gerekenler

Event-driven mimari güçlüdür ancak kötü tasarlanırsa karmaşaya dönüşebilir:

* Event sınırlarının doğru belirlenmesi
* **İdempotent tüketiciler** (bir event tekrar gelse bile sonuç aynı olmalı)
* Retry + DLQ kurgusu
* Event versiyonlama
* Correlation ID ile uçtan uca izleme
* Gereksiz event üretmekten kaçınma (event storming)

### Örnek: İdempotency Kontrolü

```pseudo
if event.id in processed_events:
    ignore
else:
    process(event)
    save(event.id)
```



## 12. Serverless Bağlamında CAP + Event-Driven

Serverless sistemlerde (AWS Lambda, Azure Functions) ayrıca şunlar dikkate alınmalıdır:

* timeout
* cold start
* ordering
* retry politikaları

Bu nedenle:

* tutarlı input/output kuralları,
* merkezi loglama,
* dağıtık izleme,
* ölçülebilirlik

büyük önem taşır.



## 13. Sonuç

CAP Teoremi bize şunu hatırlatır:

> **Dağıtık sistemlerde tutarlılık ve erişilebilirlik arasında her zaman bir denge vardır.**

Event-driven mimari ise:

> **Bu dengeyi AP yönünde çözerek güçlü, esnek ve ölçeklenebilir yapılar kurmayı sağlar.**

Modern mimarilerin çoğu şu üç prensibi bir arada kullanır:

* **AP yaklaşımı**
* **Eventual Consistency**
* **Event-Driven Architecture**

Yeni bir sistem tasarlarken kendinize şu soruyu sorun:

> "Bu senaryoda asıl kritik olan nedir: Tutarlılık mı, erişilebilirlik mi?"

Bu soru, doğru mimariyi seçmenizi sağlar.



## Kaynaklar

* Arslan, F. M.: *“Serverless Bir Mimari Hazırlarken Dikkat Edilmesi Gereken Önemli Noktalar”*, Ekim 202
