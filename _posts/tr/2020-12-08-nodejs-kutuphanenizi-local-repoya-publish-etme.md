---
title: Nodejs için kendi kütüphanenizi yayınlayın
layout: post
category: nodejs
lang: tr-TR
description: "Nodejs için kendi kütüphanenizi yayınlayın konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "nodejs-kutuphanenizi-local-repoya-publish-etme-2bbc1409"
image: "http://fmarslan.com/assets/img/aWryH.png"
permalink: /nodejs/2020/12/08/nodejs-kutuphanenizi-local-repoya-publish-etme.html
---

nodejs, npm ve ng kurulumu yapılmıştır diye varsayarak başlıyoruz bu süreçte angular kütüphanesi yayınlayacağız

öncelikle angular cli ile kütüphanemizi oluşturuyoruz detaylı bilgiler için [tıklayınız](https://angular.io/guide/creating-libraries)

```sh
ng new my-workspace --create-application=false
cd my-workspace
ng generate library my-lib
```

gerekli eklemelerimizi ve geliştirmelerimiz yaptıktan sonra build ediyoruz bu kısımda tstler vs tamamlanır.

```sh
ng build my-lib
```

sonrasında kütüphanemiz hazırsa publish etme aşamasına geldik burada ben nexus repo kullanıyorum kendi repoma publish yapacağım

Öncelikle nexus repomuzda realm tanımlarında npm bearer token realm ı aktif hale getirelim

kütüphanenin ```package.json``` dosyasına aşağıdaki gibi publish cofngi eklmeliyiz

```json
  "publishConfig": {
    "registry": "http://nexus.fmarslan.com/repository/npm-repository"
  }
```

npm repo iin user ekleme işlemini yapıyoruz
```sh
npm adduser --registry=http://nexus.fmarslan.com/repository/npm-repository/ --always-auth
```

derleyip publish işlemimiz yapıyoruz.

```sh
ng build my-lib --prod
cd dist/my-lib
npm publish
```

kontrol ediyoruz yüklendiğini doğruluyoruz.
