---
layout: post
title: Elastik search için cli üzerinden rest api ile sorgu
category: tools
lang: tr-TR
description: "Elastik search için cli üzerinden rest api ile sorgu konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "elastik-search-rest-api-ile-cli-uzerinden-sorgu-ebb2b238"
permalink: /tools/2020/11/13/elastik-search-rest-api-ile-cli-uzerinden-sorgu.html
---

*Zaman içinde güncellenebilir*

Aşağıdaki komutlar cli için curl ile verilmiştir aynı istekelr postman veya doğrudan tarayıcıdan yapılabilir eğer json result verisinin pretty oalrak görünmesini istemiyorsanız en son daki &pretty=true bölümünü kaldırmalısınız

index meta dosyası

```
curl -X GET http://es1:9200/index-name
```

arama

```sh
curl -X GET http://es1:9200/index-name/_search?q=*:*&size=10

```

tüm indexler
```sh
curl -X GET http://es2:9200/_aliases?pretty=true
```

