---
layout: post
title: " Helm ve Kubernetes: Helm Chart'ları Localde Render Etme ve Yönetme"
categories: Helm
---

![image](/assets/img/image1-4.png.png)

*Görsel redhat blog sayfasindan alinmistir*

Helm, Kubernetes ortamında uygulamaları yönetmek ve dağıtmak için en yaygın kullanılan araçlardan biridir. Bu yazıda, **Helm'in temel kullanımı**, **chart'ları localde render etme** ve **OCI tabanlı chart'larla nasıl çalışabileceğinizi** anlatacağız. Ayrıca, Helm'i doğrudan Kubernetes'e yüklemek yerine neden önce localde test etmenin daha güvenli olduğunu açıklayacağız.

### Helm Nedir?

**Helm**, Kubernetes için bir paket yöneticisidir. Helm sayesinde Kubernetes üzerindeki uygulamaları şablonlar halinde paketleyebilir ve daha kolay bir şekilde yönetebilirsiniz. Detaylı bilgi için Helm’in [resmi dokümantasyonuna](https://helm.sh/docs/) göz atabilirsiniz.

### Chart Nedir?

**Chart**, Kubernetes uygulamaları için şablonlanmış bir paket yapısıdır. İçerisinde Deployment, Service, ConfigMap gibi Kubernetes kaynaklarının YAML dosyaları bulunur. Bu şablonlar sayesinde bir Kubernetes uygulaması kolayca dağıtılabilir ve yönetilebilir hale gelir.

### Helm’i Doğrudan Kubernetes Üzerine Kurmanın Riskleri

Helm chart'larını doğrudan Kubernetes’e kurmak bazı riskler barındırır. Özellikle production ortamında, hatalı yapılandırmalar ciddi sorunlara yol açabilir. Bu yüzden şahsi görüşüm, chart’ları Kubernetes’e uygulamadan önce localde test edip gözden geçirmenin daha güvenli olduğudur. Yanlış yapılandırılmış bir chart, Kubernetes kümesinde hatalı kaynaklar oluşturabilir ve istenmeyen sonuçlar doğurabilir.

Bu nedenle, Helm chart'larını önce **localde render etmek** ve Kubernetes’e göndermeden önce oluşacak kaynakları incelemek en iyi uygulama olacaktır.

### Helm Template Komutu ile Localde Render Etme
Helm chart'larını Kubernetes'e yüklemeden önce manifest dosyalarını localde görmek için `helm template` komutunu kullanabilirsin:

```bash
helm template release-name oci://...  --output-dir ./output-directory
```

Bu komut, chart'ın tüm Kubernetes manifest dosyalarını localde render eder ve belirtilen dizine kaydeder. Bu sayede, Kubernetes'e uygulamadan önce gözden geçirip düzeltebilirsin.

Çevresel Değerler (Environment Variables) ve Parametreler:
helm template komutuna --set ya da --values parametreleri ile çevresel değişkenler (environment variables) geçebilirsin. Örneğin, bir değer dosyası kullanarak ya da doğrudan komut satırında parametre verebilirsin.

### Çevresel değişkenlerle kullanımı:

bash
```bash
helm template release-name ./chart-directory --set env=production --output-dir ./output-directory
```

### Değer dosyasıyla kullanımı:
```bash
helm template release-name ./chart-directory --values ./values.yaml --output-dir ./output-directory
```
Bu komutlar, chart'ı farklı çevrelerde (örn. prod, dev) çalışacak şekilde özelleştirmeni sağlar.

### Çıktıyı Tek Bir Dosyaya Kaydetme
Render edilen şablonları tek bir YAML dosyasına kaydetmek için PowerShell veya Bash’de > operatörünü kullanabilirsiniz. Örneğin:
```bash
helm template my-release ./my-nginx-chart --namespace my-namespace > a.yaml
```
Bu komut, my-namespace adlı bir namespace içinde çalışacak şekilde Nginx chart’ını render eder ve çıktıyı a.yaml dosyasına kaydeder. Bu dosyayı daha sonra ``kubectl apply -f a.yaml`` komutuyla Kubernetes’e uygulayabilirsiniz.

Detaylı bilgi için Helm’in [resmi dokümantasyonuna](https://helm.sh/docs/) göz atabilirsiniz.
