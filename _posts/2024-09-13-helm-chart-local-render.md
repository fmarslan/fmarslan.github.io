---
layout: post
title: "Helm ve Kubernetes: Helm Chart'ları Localde Render Etme ve Yönetme"
categories: Helm
---

Helm, Kubernetes üzerinde uygulamaları paketlemek, dağıtmak ve yönetmek için kullanılan en güçlü araçlardan biridir. Bu yazıda, Helm’in temel çalışma mantığını, chart’ları **localde render etmenin neden önemli olduğunu** ve **OCI tabanlı chart’larla nasıl çalışılacağını** adım adım ele alıyoruz.

![image](/assets/img/image1-4.png.png)

*Görsel Red Hat blog sayfasından alınmıştır.*



## 🎯 Helm Nedir?

**Helm**, Kubernetes için bir *paket yöneticisidir*. Uygulamaları yeniden kullanılabilir şablonlar hâline getirir, versiyonlamayı kolaylaştırır ve Kubernetes manifestlerini yönetilebilir bir yapıya dönüştürür.

Daha fazla bilgi için: [Helm Resmi Dokümantasyon](https://helm.sh/docs/)



## 📦 Chart Nedir?

**Helm Chart**, Kubernetes üzerinde çalışacak bir uygulamanın tüm bileşenlerini (Deployment, Service, ConfigMap, Secret vb.) içeren paketlenmiş bir yapıdır.

Bir chart sayesinde:

* Kaynaklar şablon hâline getirilir,
* Ortam bazlı konfigürasyon yapılabilir,
* Uygulama kolayca güncellenebilir veya geri alınabilir.



## ⚠️ Helm’i Doğrudan Kubernetes’e Uygulamanın Riskleri

Bir chart’ı direkt olarak Kubernetes kümesine uygulamak, özellikle üretim ortamında risklidir.

Yanlış değerler → yanlış kaynaklar → servis kesintisi.

Bu nedenle **chart’ı önce localde render etmek**, manifestlerin ne ürettiğini kontrol etmek en doğru yaklaşımdır.

Yanlış bir `Ingress`, hatalı bir `Service`, yanlış tanımlanmış bir `volume` ya da kapalı bir namespace beklenmedik sonuçlara neden olabilir.



## 🛠 Helm Chart'ı Localde Render Etme

Helm chart’larını Kubernetes’e göndermeden önce manifestleri görmek için şu komutu kullanabilirsiniz:

```bash
helm template release-name oci://... --output-dir ./output-directory
```

Bu komut:

* Chart’ı localde işler,
* Ortaya çıkan YAML dosyalarını belirtilen klasöre yazar,
* Kubernetes’e gönderilmeden önce kontrol etme imkânı sunar.



## ⚙️ Parametre ve Değer Dosyaları ile Kullanım

Helm template komutuna değerleri iki şekilde verebilirsiniz.

### 1) **--set ile ortam değişkenleri tanımlamak**

```bash
helm template release-name ./chart-directory --set env=production --output-dir ./output-directory
```

### 2) **--values dosyası kullanmak**

```bash
helm template release-name ./chart-directory --values ./values.yaml --output-dir ./output-directory
```

Bu sayede chart’ınızı farklı ortamlarda (dev, test, prod) özelleştirebilirsiniz.



## 📄 Render Edilen Manifestleri Tek Dosyaya Aktarma

Tüm çıktıyı tek bir YAML dosyasına almak isterseniz:

```bash
helm template my-release ./my-nginx-chart --namespace my-namespace > a.yaml
```

Bu dosyayı daha sonra Kubernetes’e uygulayabilirsiniz:

```bash
kubectl apply -f a.yaml
```

Bu yöntem, CI/CD süreçlerinde validation amaçlı da sıkça tercih edilir.



## 🔍 Sonuç

Helm güçlü bir araçtır; ancak chart’ları **gönder–çalıştır** yaklaşımıyla kullanmak çoğu zaman risklidir. Bunun yerine:

* Chart’ları önce localde render ederek incelemek,
* Değer dosyalarını versiyonlamak,
* Üretim öncesi manifestleri manuel veya otomatik şekilde doğrulamak,

seni daha güvenli, yönetilebilir ve öngörülebilir bir Kubernetes altyapısına götürür.

Daha fazla detay için resmi dokümantasyona göz atabilirsin: [https://helm.sh/docs/](https://helm.sh/docs/)
