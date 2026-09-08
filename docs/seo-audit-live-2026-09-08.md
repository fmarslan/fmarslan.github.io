# fmarslan.com canlı SEO taraması — 8 Eylül 2026

Canlı HTTP yanıtları ve sunucunun döndürdüğü HTML üzerinden tarandı. Sitemap’teki 249 URL (248 HTML, 1 PDF), bunlara ek 127 benzersiz iç bağlantı/görsel adresi, robots.txt, alan adı varyantları ve bulunmayan sayfa yanıtı kontrol edildi. Dört eşzamanlı istek kullanıldı. Site dosyaları değiştirilmedi.

## Genel sonuç

Ana alan adında temel taranabilirlik sağlıklı. En yüksek öncelik www HTTPS sertifikası ve büyük görseller; ardından kırık iç bağlantı ve içerik başlık düzeni geliyor.

| Kontrol | Sonuç |
|---|---|
| Sitemap URL yanıtları | 249/249 HTTP 200 |
| HTML title / description | 248/248 mevcut; tam eşleşen description tekrarı yok |
| Canonical | 248/248 kendi sitemap URL’siyle eşleşiyor |
| Hreflang | 248/248 mevcut; x-default dışındaki hedefler sitemap’te ve karşılıklı |
| HTML dili | 124 tr, 124 en |
| Meta noindex | Bulunmadı |
| Robots.txt | HTTP 200; Allow: /; sitemap adresi doğru |
| JSON-LD | 248/248 mevcut ve JSON olarak ayrıştırılabiliyor; rich-result uygunluğu doğrulanmadı |
| Sosyal önizleme | 248/248 og:image mevcut |
| Görsel alt niteliği | Eksik alt niteliği bulunmadı; açıklama kalitesi ayrıca incelenmeli |
| Olmayan URL | Gerçek HTTP 404 |
| HTTP ana alan ve HTTP www | https://fmarslan.com/ adresine ulaşıyor |

## Öncelikli bulgular

### 1. Yüksek: www HTTPS sertifikası geçersiz

`https://www.fmarslan.com/` Python TLS doğrulamasında hostname mismatch, Windows curl doğrulamasında SEC_E_WRONG_PRINCIPAL hatası verdi. HTTPS bağlantısı yönlendirmeye ulaşamadan kesiliyor. www için DNS/hosting özel alan adı ve sertifika kapsamı düzeltilmeli; sonra ana alan adına kalıcı yönlendirme doğrulanmalı. Ana alan adı HTTPS erişimi başarılı.

### 2. Yüksek: çok büyük görseller

36 benzersiz görsel 1 MB üzerinde. En büyüğü [coding-man.jpg](https://fmarslan.com/assets/img/coding-man.jpg): 17.846.457 bayt (17,85 MB). Türkçe/İngilizce 2021 yazılım sektörü makaleleri ile her iki blog listesinde kullanılıyor. Blog listelerinin her birinde 52 img öğesi var. Dosya boyutları ölçüldü; gerçek tarayıcı yüklemesi, lazy loading etkisi ve Core Web Vitals ölçülmedi.

Görselleri gösterim boyutuna küçültmek, WebP/AVIF üretmek, blog kartlarında küçük türev ve srcset kullanmak öncelikli. 106 sayfada en az bir görselin width/height niteliği eksik; CSS alan ayırmıyorsa yerleşim kaymasına neden olabilir.

### 3. Orta: kırık iç bağlantı

Hedef: https://fmarslan.com/networking/2025/12/20/icann-dns-cozme-ve-authority-chain.html — HTTP 404

Bağlantıyı içeren sayfalar:
- https://fmarslan.com/en/2025/12/25/how-does-peppol-network-work-technically-with-dns-logic.html

Sitemap’teki çalışan Türkçe hedef: https://fmarslan.com/networking/2025/12/20/icann-dns-cozme-ve-yetki-zinciri.html . İngilizce makaledeki bağlantı için İngilizce eşdeğer de değerlendirilmeli: https://fmarslan.com/en/2025/12/20/icann-dns-resolution-chain-and-authority-map.html .

### 4. Orta: 13 sayfada birden fazla H1

Makale ana başlığı H1 olarak kalmalı; gövdedeki bölüm başlıkları H2/H3 yapılmalı, yinelenen makale başlığı kaldırılmalı. Bu tek başına indekslenme engeli veya otomatik ceza değildir.

- https://fmarslan.com/cosmos,/net6/2023/09/29/cosmos-db-net-connection-ve-nested-sorgular.html — 3 H1
- https://fmarslan.com/en/2025/10/10/8-lessons-i-learned-while-redesigning-a-platform.html — 2 H1
- https://fmarslan.com/architecture/2025/10/10/bir-platform-tasarlarken-ogrendigim-8-ders.html — 2 H1
- https://fmarslan.com/en/2025/10/25/misconceptions-about-integration-architectures.html — 2 H1
- https://fmarslan.com/entegrasyon/architecture/2025/10/25/entegrasyon-mimarilerinde-yanlis-bilinen-dogrular.html — 2 H1
- https://fmarslan.com/en/2025/11/26/versioning-and-releasing-management-on-kubernetes.html — 2 H1
- https://fmarslan.com/2025/11/26/kubernetes-uzerinde-versioning-ve-releasing-yonetimi.html — 2 H1
- https://fmarslan.com/en/2025/11/27/npm-supply-chain-threats-shai-hulud-case-and-modern-security-approach.html — 5 H1
- https://fmarslan.com/2025/11/27/npm-supply-chain-tehditleri-shai-hulud-ornegi-ve-modern-guvenlik-yaklasimi.html — 5 H1
- https://fmarslan.com/tr/2026/03/07/net-te-genel-ve-dahili-api-belgelerini-ayrma.html — 2 H1
- https://fmarslan.com/en/software/dotnet/api/2026/03/10/separating-public-and-internal-swagger-docs-dotnet.html — 2 H1
- https://fmarslan.com/en/2026/05/16/we-are-at-the-beginning-of-a-new-layer-of-intelligence.html — 2 H1
- https://fmarslan.com/2026/05/16/yeni-bir-zeka-katmaninin-baslangicindayiz.html — 2 H1

### 5. Düşük/orta: arama sonucu metinleri

84 title 65 karakterden, 24 description 160 karakterden uzun. Bunlar editoryal inceleme eşikleridir; Google için sabit karakter sınırı ya da doğrudan hata değildir. 7 title grubu iki dilde aynı; kişi adı/teknik terim ortaklığı nedeniyle otomatik olarak kopya içerik sayılmamalı. Türkçe ana sayfa description metninde “platformlarıve” yazım hatası ve kesilmiş cümle bulunuyor.

83 Türkçe açıklama “konusunda temel yaklaşımı ve uygulanabilir adımları” şablonunu içeriyor. Her yazının somut problemi, çözümü ve okura katkısını anlatan özgün açıklamalar daha yararlı olur.

### 6. Düşük: HTTP görsel adresleri

2 görsel URL’si 6 sayfada toplam 8 img öğesinde HTTP ile çağrılıyor. HTTPS’e yönlendirilseler de doğrudan HTTPS veya kökten göreli yol kullanılmalı.

## Büyük görseller

| URL | MB (ondalık) |
|---|---|
| https://fmarslan.com/assets/img/coding-man.jpg | 17.85 |
| https://fmarslan.com/assets/img/dlq2azuredevops.png | 3.22 |
| https://fmarslan.com/assets/img/1c8df5c1-0eba-48ae-8bea-a0c895ae5407.png | 3.22 |
| https://fmarslan.com/assets/img/258f48f7-8297-4ca3-b0c7-dda1df84b119.png | 2.82 |
| https://fmarslan.com/assets/img/harici-araclardan-dogru-sekilde-faydalanma.png | 2.80 |
| https://fmarslan.com/assets/img/8404d81f-465b-449a-a9a3-c4ab95e41276.png | 2.71 |
| https://fmarslan.com/assets/img/kubernetes-delivery-layers-cover.png | 2.66 |
| https://fmarslan.com/assets/img/dynamic-flow-engine-cover.png | 2.58 |
| https://fmarslan.com/assets/img/test-centric-development.png | 2.55 |
| https://fmarslan.com/assets/img/13431c72-3ebd-447b-aab9-6836653d12da.png | 2.37 |
| https://fmarslan.com/assets/img/403d882b-7907-47f5-9d06-098b3c873539.png | 2.31 |
| https://fmarslan.com/assets/img/sdasvfdw.png | 2.30 |
| https://fmarslan.com/assets/img/242c6430-9d74-463e-993d-6fb7d47266e9.png | 2.27 |
| https://fmarslan.com/assets/img/20b9c292-816b-43cc-a652-1de9cc4ca2f2.png | 2.26 |
| https://fmarslan.com/assets/img/31579b3a-c863-48da-937e-ba17cce39009.png | 2.25 |
| https://fmarslan.com/assets/img/02bb2a47-c4ed-4c80-8ff0-d1e460a468ff.png | 2.25 |
| https://fmarslan.com/assets/img/ee03c2f2-9c67-4873-9774-ffe63459eff4.png | 2.15 |
| https://fmarslan.com/assets/img/managing-domain-values-cover.png | 2.13 |
| https://fmarslan.com/assets/img/22c51fd6-862b-4813-8877-1c5ce692ab76.png | 2.08 |
| https://fmarslan.com/assets/img/9ee28aab-30b5-47d1-aca5-460f78acef4b.png | 2.08 |
| https://fmarslan.com/assets/img/mariadb-maxscale.png | 2.04 |
| https://fmarslan.com/assets/img/npm-supply-chain-shai-hulud-cover.png | 1.98 |
| https://fmarslan.com/assets/img/596f2bf2-a150-4f92-9693-e34f771adcd9.png | 1.91 |
| https://fmarslan.com/assets/img/image.png | 1.88 |
| https://fmarslan.com/assets/img/8839b539-b011-4bc1-adff-8a69afb65f8c.png | 1.87 |
| https://fmarslan.com/assets/img/saas-faas.png | 1.84 |
| https://fmarslan.com/assets/img/cert-manager.png | 1.79 |
| https://fmarslan.com/assets/img/kubernetes-release-default.png | 1.79 |
| https://fmarslan.com/assets/img/5198cfa0-de03-4bb5-b637-e100abef9ab1.png | 1.79 |
| https://fmarslan.com/assets/img/ai-operations-decision-authority-cover.png | 1.78 |
| https://fmarslan.com/assets/img/7f100c91-2ecb-40ad-b64e-e54e08778f34.png | 1.78 |
| https://fmarslan.com/assets/img/microservice-dependency-boundaries.png | 1.67 |
| https://fmarslan.com/assets/img/7fbabe90-a44c-4ae1-868d-7f31948feaee.png | 1.25 |
| https://fmarslan.com/assets/img/modern-bulut-mimarisi-cover.png | 1.23 |
| https://fmarslan.com/assets/img/packaged-distributed-application.png | 1.14 |
| https://fmarslan.com/assets/img/b792ab8e-af1d-4c65-a787-c4d73c41d6d3.png | 1.07 |

## Kapsam sınırları

Search Console erişimi kullanılmadı: Google’ın gerçek indeksleme durumu, seçtiği canonical, sorgu/sıralama/tıklama verileri doğrulanmadı. Lighthouse, PageSpeed Insights ve CrUX çalıştırılmadı: mobil performans veya Core Web Vitals puanı verilmedi. Dış alan adı bağlantıları, JavaScript sonrası DOM, CSS/script kaynakları ve tüm URL fragment hedefleri taranmadı. Bu bir canlı teknik SEO taramasıdır; sıralama garantisi veya tam içerik kalite denetimi değildir.

## Referanslar

- [Canlı sitemap](https://fmarslan.com/sitemap.xml)
- [Canlı robots.txt](https://fmarslan.com/robots.txt)
- [Google: yerelleştirilmiş sayfa sürümleri](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: arama sonucu başlıkları](https://developers.google.com/search/docs/appearance/title-link)

Ham kanıtlar: tmp/seo-audit/crawl.json, resources.json ve sitemap.xml.
