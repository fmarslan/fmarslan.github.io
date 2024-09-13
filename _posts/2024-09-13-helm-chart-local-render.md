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

### Helm’i Doğrudan Kubernetes Üzerine Kurmanın Riskleri (Şahsi Görüş)

Helm chart'larını doğrudan Kubernetes’e kurmak bazı riskler barındırır. Özellikle production ortamında, hatalı yapılandırmalar ciddi sorunlara yol açabilir. Bu yüzden şahsi görüşüm, chart’ları Kubernetes’e uygulamadan önce localde test edip gözden geçirmenin daha güvenli olduğudur. Yanlış yapılandırılmış bir chart, Kubernetes kümesinde hatalı kaynaklar oluşturabilir ve istenmeyen sonuçlar doğurabilir.

Bu nedenle, Helm chart'larını önce **localde render etmek** ve Kubernetes’e göndermeden önce oluşacak kaynakları incelemek en iyi uygulama olacaktır.

### Helm Template Komutu ile Localde Render Etme

Helm chart'larını Kubernetes’e yüklemeden önce localde manifest dosyalarını görmek için `helm template` komutunu kullanabilirsiniz. Bu komut, Kubernetes'e uygulanacak şablonları localde oluşturur ve dosyalara kaydeder.

#### `helm template` Komutu:
```bash
helm template release-name ./chart-directory --output-dir ./output-directory
```

Bu komut:
- **`release-name`**: Helm release’in adı.
- **`./chart-directory`**: Helm chart’ın bulunduğu yerel dizin veya **OCI tabanlı bir chart deposu** olabilir. Örneğin, Docker Hub'daki chart için şu şekilde kullanabilirsiniz:

  ```bash
  helm template release-name oci://registry-1.docker.io/bitnami/nginx --output-dir ./output-directory
  ```

- **`--output-dir`**: Oluşturulan manifest dosyalarının kaydedileceği dizin.

### Çevresel Değerler ve Parametreler Geçme

`helm template` komutuna çevresel değişkenler (environment variables) ve parametreler verebilirsiniz. Bu, chart'ları belirli bir ortam için (örneğin `production` ya da `development`) özelleştirmenize olanak tanır.

#### Komut Satırında Parametre Geçme:
```bash
helm template release-name ./chart-directory --set env=production --output-dir ./output-directory
```

Bu komut, `env` değişkenini `production` olarak ayarlar ve manifest dosyalarını bu çevreye göre render eder.

#### Değer Dosyası ile Parametre Geçme:
```bash
helm template release-name ./chart-directory --values ./values.yaml --output-dir ./output-directory
```

Bu komut, `values.yaml` dosyasındaki değerleri kullanarak chart'ı render eder.

### OCI Tabanlı Chart'ları Kullanma

Helm, Docker Registry gibi **OCI (Open Container Initiative)** tabanlı container registry'lerinden chart indirip kullanmanızı sağlar. Bu özelliği kullanarak, Docker Hub'daki chart'ları aşağıdaki gibi alabilirsiniz.

#### Helm Chart'ı OCI'den İndirme:
```bash
helm chart pull oci://registry-1.docker.io/bitnamicharts/nginx
```

Bu komut, Docker Hub'dan Nginx chart'ını indirir.

#### Chart'ı Export Etme:
```bash
helm chart export oci://registry-1.docker.io/bitnamicharts/nginx --destination ./my-nginx-chart
```

Bu komut, indirilen chart'ı yerel bir dizine çıkarır.

### Helm Chart Deposu Kurulumu ve Kullanımı

Helm chart’larını depolardan alıp kullanmak oldukça kolaydır. Örneğin, **Bitnami** chart deposunu kullanarak Nginx chart’ını nasıl yükleyeceğimizi görelim:

#### Bitnami Chart Deposu Ekleme:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Bu komut, Bitnami chart deposunu Helm'e ekler.

#### Depodaki Chart’ları Güncelleme:
```bash
helm repo update
```

#### Nginx Chart’ını Localde Render Etme:
```bash
helm template my-release bitnami/nginx --output-dir ./nginx-manifests
```

Bu komut, Nginx chart'ını render eder ve çıktı dosyalarını `./nginx-manifests` klasörüne kaydeder.

### Çıktıyı Tek Bir Dosyaya Kaydetme

Render edilen şablonları tek bir YAML dosyasına kaydetmek için PowerShell veya Bash'de `>` operatörünü kullanabilirsiniz. Örneğin:

```bash
helm template my-release ./my-nginx-chart --namespace my-namespace > a.yaml
```

Bu komut, `my-namespace` adlı bir namespace içinde çalışacak şekilde Nginx chart'ını render eder ve çıktıyı `a.yaml` dosyasına kaydeder. Bu dosyayı daha sonra `kubectl apply -f a.yaml` komutuyla Kubernetes'e uygulayabilirsiniz.

### Sonuç

Helm, Kubernetes uygulamalarını şablonlayarak dağıtmak için güçlü bir araçtır. Ancak, chart'ları doğrudan Kubernetes'e yüklemek bazı riskler barındırdığı için önce localde render edip manifest dosyalarını gözden geçirmek her zaman daha güvenlidir. Bu sayede, olası yanlış yapılandırmaları fark edebilir ve daha güvenli bir uygulama süreci sağlayabilirsiniz.

Detaylı bilgi için Helm’in [resmi dokümantasyonuna](https://helm.sh/docs/) göz atabilirsiniz.
