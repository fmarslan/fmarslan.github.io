---
layout: post
title: Elastic Search Python ile veri indexleme
categories: elasticsearch
---

Elimizdeki bir csvden verileri okuyarak elastic search indeksleme işlemini yapcağız. 

*Burada önemli bir nokta işlemlerin hepsi rest api üzerinden yapılmaktadır. İndeks oluşturma csv parse etme vb tüm işlemler sadece örnek amaçlı hazırlanmıştır **en iyi yöntem değildir**, prod işlemleriniz için senaryonuza ihtiyacınıza göre en iyi uygulama/yöntem için araştırma yapmanızı ilgili uygulamaların dökümanlarını okumanızı veya bu alanda uzmanlığı olanlardan destek almanızı öneririm*

ilk olarak eğer hazır indeksiniz yoksa elastic search üzerinde bir index oluşturalım 1 shard 1 replica şeklinde oluşturacağız *[Detaylı kaynak](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html)*

```sh
curl -X PUT "elasticsearch.host:9200/first-index?pretty" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,  
      "number_of_replicas": 1 
    }
  }
}
'

```

şimdi python3 için aşağıdaki kurulumları yapıyoruz *(varsa gerek yok)*
```sh
sudo dnf install python3 # python3 kurulumu

sudo python3 -m pip install elasticsearch # elasticsearch kütüphanesi kurulumu

```

python script *[Detaylı kaynak](https://www.w3schools.com/python/default.asp)*

```py
from datetime import datetime
import csv # csv kütüphanesi import
from elasticsearch import Elasticsearch # elastic search kütüphanesi import
es = Elasticsearch(["elasticsearch.host"], maxsize=25) # elastic search connection

index=0

with open('{file.path}', newline='',encoding='utf-8-sig') as csvfile:
  spamreader = csv.reader(csvfile, delimiter=';', quotechar='|')
  for row in spamreader:
    index=index+1
    doc = {
        "Id":row[0],
        "ReadingId":row[1],	
        "StationId":row[2],	
        "Date": datetime.strptime(row[3],'%Y-%m-%d %H:%M:%S.%f'), #2016-01-01 00:10:21.413
        "Temperature":row[4] if row[4] != 'NULL' else None,
    }
    res = es.index(index="first-index", body=doc) # döküman sunucuya gönderiliyor
    if ((index % 1000) == 0):
        print(index)
        es.indices.refresh(index="first-index") # index yenileniyor
  print(index)

```

indekslediğimiz verileri sorgulayarak kontrol ediyoruz *[detaylı kaynak](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)*

```sh
curl -X GET "elasticsearch.host:9200/first-index/_search?pretty"
```

