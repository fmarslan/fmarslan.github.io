---
layout: post
title: Solr Scheme Yükleme
categories: solr
---

Elastic Search lisans değiştirdikten sonra yoğun bi şekilde solr kullanmaya başladığımız şu günlerde genelde solr scheme yükleme işlemi yapıyoruz. ve her defasında gidip bunun komutu neydi diye aramak yerine şuraya not alayım dursun dedim belki başka ihtiyacı olanlarda olur faydası olur.


Önce hazırladığımız solr scheme klasörünü zookeeper a yükleyeceğiz buna upconfig adı veriliyor bunun için zk client indirmemiz gerekiyor [buradan](https://zookeeper.apache.org/releases.html) bize uygun verisonu indirebiliriz. ben elimde solr olduğu için solr içindeki zk client'ı kullanıyorum eğer solr kurulumunuz varsa sizde kullanabilirsiniz.

``` sh
../solr/server/scripts/cloud-scripts/zkcli.sh -zkhost {{ZK_URL}} -cmd upconfig -confdir {{SOLR_SCHEME_CONF_DIRECTORY}} -confname {{CONF_NAME}}
```

bu işlemi yaptıktan sonra solr arayüzüne gidip Collections sayfasında add collection butonuna tıkladığımızda zk üzerinde ki büütn confları bizim yükleidğimizde dahil görebiliyor olacağız sonrası artık solr ile sizin aranızda :).


- [ZK Tutorial](https://zookeeper.apache.org/doc/current/)
- [Solr Tutorial](https://solr.apache.org/resources.html#tutorials)
