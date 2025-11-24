---
layout: post
title: "Jekyll, GitHub Pages ve Statik Siteler: Basit Bir Siteyi Sıfırdan Yayına Almak"
date: 2025-11-24 21:00:00 +0200
description: Statik site oluşturucuların (özellikle Jekyll) ne olduğunu, GitHub Pages üzerinde nasıl yayın yapabileceğinizi ve alternatif barındırma çözümlerini adım adım anlatan pratik bir rehber.
image: /assets/img/jekyll-github-pages-cover.png
tags:
  - jekyll
  - github-pages
  - static-site
  - jamstack
  - devops
---

Son yıllarda **WordPress gibi dinamik sistemler** yerini yavaş yavaş daha sade, daha hızlı ve daha bakımı kolay yapılara bırakmaya başladı: **statik site oluşturucularına**.

Bu yazıda:

- Statik site ve statik site oluşturucu kavramını,
- Jekyll başta olmak üzere bazı popüler alternatifleri,
- Jekyll ile **tek sayfalık basit bir siteyi** nasıl hazırlayacağınızı,
- Bu siteyi **GitHub Pages** üzerinde nasıl yayınlayabileceğinizi,
- Ve GitHub Pages’e alternatif barındırma çözümlerini

pratik bir dille özetleyeceğim.

---

## Statik site nedir, statik site oluşturucu nedir?

**Statik site**: Sunucuda PHP, Node.js, veritabanı gibi bir arka uç çalıştırmadan, doğrudan **HTML, CSS ve JS** dosyalarının CDN üzerinden servis edildiği basit yapılardır.

**Statik site oluşturucuları (Static Site Generator – SSG)** ise:

- Markdown, HTML, veri dosyaları (YAML/JSON) ve şablonları alıp,
- Bunları build sırasında işleyerek,
- Sonuçta tamamen statik bir HTML çıktısı üretir.

Performans açısından avantajlıdır; çünkü sayfa her istekte dinamik olarak üretilmez, önceden build edilmiştir.

---

## Popüler statik site oluşturucular

Bugün piyasada çok sayıda SSG var. Öne çıkanlardan bazıları:

- **Jekyll (Ruby)** — Klasik, blog odaklı, dosya tabanlı bir yapı. GitHub Pages’in de motoru.
- **Hugo (Go)** — Çok hızlı build süreleriyle biliniyor, binlerce sayfalık siteleri saniyeler içinde üretebiliyor.
- **Eleventy (JavaScript)** — “Basit olsun, ne yapacağımı ben belirleyeyim” diyenlere yönelik minimalist bir SSG.
- **Astro (JavaScript)** — İçerik odaklı siteler için modern bir yaklaşım, bileşen tabanlı, son dönemin yükselen yıldızlarından.

Bu yazıda özellikle **Jekyll** üzerine odaklanacağız; çünkü:

- Basit blog ve kişisel siteler için çok uygun,
- Dosya tabanlı, öğrenmesi görece kolay,
- GitHub Pages ile native entegre çalışıyor.

---

## Jekyll’e biraz yakından bakalım

Jekyll:

- İçeriği genelde **Markdown** olarak yazmanızı,
- Şablonlama için **Liquid** ve HTML kullanmanızı,
- Sonuçta statik bir site üretmenizi sağlar.  
- Tek komutla yeni bir site oluşturabilir, build alabilir, yerelde bir development sunucusu çalıştırabilirsiniz.

Jekyll’in en güzel yanlarından biri, **“dosya tabanlı CMS”** gibi davranması: _posts klasörü, sayfalar, layout’lar vs. hepsi birer dosya. Veritabanı yok, admin panel yok; sadece Git ve dosyalar.

---

## Ortamı hazırlama: Ruby + Jekyll kurulumu

Jekyll çalıştırmak için temel gereksinimler:

- Ruby 2.7 veya üzeri
- RubyGems
- GCC ve Make (çoğu *nix ortamında hazır geliyor)

Jekyll ve Bundler kurulum komutu:

```bash
gem install bundler jekyll
```

Kurulumdan sonra `jekyll -v` komutuyla versiyonu kontrol edebilirsiniz.

---

## Adım adım: Tek sayfalık Jekyll sitesi

Şimdi sıfırdan **tek sayfalık basit bir site** oluşturalım.

### 1. Yeni proje oluştur

Terminalde:

```bash
cd ~/Projects
jekyll new my-first-jekyll-site
cd my-first-jekyll-site
```

### 2. Gerekli gem’leri yükle

```bash
bundle install
```

### 3. Varsayılan içerikleri tek sayfaya sadeleştirme

* `_posts` klasörünü şimdilik silebilir veya boş bırakabilirsiniz.
* `about.markdown` dosyasına ihtiyacınız yoksa kaldırabilirsiniz.

`index.markdown` (veya `index.md`) dosyasını açıp içeriği şöyle sadeleştirebilirsiniz:

```markdown
---
layout: default
title: "Merhaba Jekyll"
---

# Merhaba Jekyll

Bu, Jekyll ile hazırlanmış **tek sayfalık** basit bir sitedir.

- İçeriği Markdown ile yazıyorum.
- Jekyll bunu HTML'e çeviriyor.
- Sonucu GitHub Pages üzerinde yayınlayacağım.

Alt tarafta bir bölüm daha:

## Hakkımda

Kısaca kendimden bahsettiğim bir alan burası olabilir.
```

### 4. Basit bir layout ayarlama (isteğe bağlı ama tavsiye edilir)

`_layouts/default.html` dosyasını açın ve şuna benzer sade bir HTML iskeleti oluşturun:

{% raw %}
```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }} - {{ site.title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { max-width: 720px; margin: 2rem auto; font-family: system-ui, sans-serif; line-height: 1.6; padding: 0 1rem; }
      h1, h2, h3 { margin-top: 2rem; }
      a { text-decoration: none; }
    </style>
  </head>
  <body>
    <header>
      <h1>{{ site.title }}</h1>
      <p>{{ site.description }}</p>
      <hr>
    </header>

    <main>
      {{ content }}
    </main>
  </body>
</html>
```
{% endraw %}

Ve `_config.yml` dosyasına:

```yaml
title: "Benim İlk Jekyll Sitem"
description: "Jekyll ve GitHub Pages ile hazırlanmış basit bir tek sayfa"
```

şeklinde bir “site bilgisi” ekleyin.

### 5. Yerelde çalıştır ve kontrole başla

Terminalde:

```bash
bundle exec jekyll serve
```

genelde `http://localhost:4000` adresinden siteyi görebilirsiniz.

---

## GitHub Pages nedir?

**GitHub Pages**, GitHub’daki bir repository’den statik dosyaları alıp otomatik olarak bir web sitesine dönüştüren **statik site barındırma hizmeti**dir.

* HTML, CSS, JS dosyalarınızı doğrudan yayınlayabilir,
* İsterseniz Jekyll ile build sürecinden geçirip de yayınlayabilirsiniz,
* Kişisel site, proje dokümantasyonu, blog gibi pek çok senaryoda kullanılabilir.

Jekyll ile entegrasyonu oldukça güçlüdür; GitHub Pages, Jekyll’i “yerleşik statik site motoru” olarak kullanır.

---

## Adım adım: Jekyll sitenizi GitHub Pages’te yayınlamak

### 1. GitHub’da yeni bir repository oluşturun

* Kişisel site için: `kullaniciadiniz.github.io` isimli repo (klasik “user/organization site” yaklaşımı).
* Proje bazlı site için: Örneğin `my-first-jekyll-site` gibi normal bir repo.

### 2. Jekyll projenizi Git ile bağlayın

Terminalde proje klasöründeyken:

```bash
git init
git remote add origin git@github.com:kullaniciadiniz/my-first-jekyll-site.git
git add .
git commit -m "Initial Jekyll site"
git push -u origin main
```

### 3. GitHub Pages’i etkinleştirin

Repo sayfasına gidip:

* **Settings → Pages** bölümünde
* “Source” kısmında:

  * Branch olarak `main`
  * Folder olarak `/` veya `/docs`

şeklinde yapınızı seçin.

> Dikkat: GitHub Pages Jekyll tarafında belirli eklentileri ve sürümleri destekliyor. Özel plugin’ler kullanmak isterseniz, genelde GitHub Actions ile kendi Jekyll build’inizi alıp `_site` çıktısını ayrı bir branch’e (ör. `gh-pages`) yayınlamak daha esnek olur.

### 4. Site adresinizi kontrol edin

Biraz bekledikten sonra (ilk build zaman alabilir):

* Kullanıcı sitesi ise: `https://kullaniciadiniz.github.io`
* Proje sitesi ise: `https://kullaniciadiniz.github.io/my-first-jekyll-site/`

adresini ziyaret edebilirsiniz.

### 5. Özel domain (isteğe bağlı)

Kendi domain’inizi (örneğin `fmarslan.com`) GitHub Pages ile kullanmak için:

* Repo ayarlarında **Pages → Custom domain** kısmına domain’i girin,
* DNS tarafında `CNAME` veya `A` kayıtlarını GitHub’ın önerdiği şekilde ayarlayın.

---

## Bir örnek: fmarslan.com

Benim kendi kişisel sitem **[fmarslan.com](https://fmarslan.com/)** bir Jekyll + GitHub Pages sitesi olarak yapılandırılmıştır. Anasayfa alt kısmında “GitHub Pages · Jekyll” ibaresi yer almaktadır. (Bkz. sayfa kaynak kodu) ([F.M. Arslan][1])

Ayrıca GitHub’daki **[`fmarslan/fmarslan.github.io`](https://github.com/fmarslan/fmarslan.github.io)** repo’su üzerinden bu sitenin kaynak kodlarını inceleyebilirsiniz. Bu, “kendi sitemi nasıl yaptım” diye bir örnek teşkil edebilir.

---

## GitHub Pages’e alternatif statik site barındırma çözümleri

GitHub Pages çoğu senaryoda fazlasıyla yeterli; ama özellikle daha gelişmiş özelliklere ihtiyaç duyduğunuzda şu alternatifler öne çıkıyor:

* **Netlify** — Git repo’larınızdan otomatik build & deploy; form yakalama, edge işlevleri gibi ek özellikler sunar.
* **Cloudflare Pages** — Cloudflare’ın global ağı üzerinde statik site barındırma; git repo’dan otomatik build & deploy.
* **Vercel** — Özellikle Next.js ve modern frontend projeleri için popüler; statik + serverless fonksiyon desteğiyle.
* **GitLab Pages** — GitLab kullanıyorsanız, GitLab içinden statik site yayınlamaya uygun bir seçenek.

---

## Hangi kombinasyon nerede mantıklı?

Özetle:

* **Kişisel blog, basit dokümantasyon, portföy** gibi senaryolarda:
  Jekyll + GitHub Pages, zahmetsiz ve “Git push = deploy” diyebileceğiniz bir kombinasyon.

* **Daha büyük, çok dilli, yüzlerce-binlerce sayfalık içerik** için:
  Hugo, Eleventy veya Astro gibi alternatifler + Netlify / Vercel / Cloudflare Pages daha esnek olabilir.

* **GitLab kullanan takımlar** için:
  GitLab Pages + herhangi bir SSG (Jekyll dahil) doğal bir seçim.

Benim pratik yaklaşımım genelde şöyle:

1. Önce **ihtiyacı netleştir**: blog mu, dokümantasyon mu, kampanya landing’leri mi?
2. Sonra **içerik üretim hızını** düşün: Markdown ile yazma alışkanlığın var mı?
3. En son da **kullandığın Git platformuna en yakın barındırma** hizmetini seç: GitHub → GitHub Pages / Netlify, GitLab → GitLab Pages / Cloudflare Pages vb.

Bu yazıyı okuduktan sonra, terminali açıp 15–20 dakikada ilk Jekyll sitenizi ayağa kaldırıp GitHub Pages üzerinde yayına alabiliyor olmanız hedefim.

Eğer fmarslan.com üzerindeki Jekyll kurulumunuzda bu anlatılanları uygulayıp, ek yapılandırma ya da tema tarafında yardıma ihtiyaç duyarsanız, devam yazısında tema, çoklu dil ve deploy pipeline detaylarına da girebiliriz.

## Referanslar

- [Ruby][ref-ruby]
- [Jekyll][ref-jekyll]
- [GitHub Pages][ref-gh-pages]

[ref-ruby]: https://www.ruby-lang.org/
[ref-jekyll]: https://jekyllrb.com/
[ref-gh-pages]: https://pages.github.com/

[1]: https://fmarslan.com/
