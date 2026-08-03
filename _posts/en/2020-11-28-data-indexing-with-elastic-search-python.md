---
layout: post
title: "Data indexing with Elastic Search Python"
date: 2020-11-28
description: "Elastic Search A short technical note outlining the basic approach and applicable steps for data indexing with Python."
categories: elasticsearch
lang: en-US
translation_key: "elastic-search-python-ile-veri-indeksleme-e37ee539"
permalink: /en/2020/11/28/data-indexing-with-elastic-search-python.html
---

We will perform elastic search indexing by reading the data from a CSV we have. 

*An important point here is that all transactions are made via rest API. All operations such as indexing, csv parsing, etc. are prepared for example purposes only **it is not the best method**, for your prod operations, I recommend you to do research for the best application/method according to your scenario and needs, read the documentation of the relevant applications or get support from those who have expertise in this field*

First of all, if you do not have a ready index, let's create an index on elastic search. We will create it as 1 shard and 1 replica *[Detailed source](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html)*

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

Now we are making the following installations for Python3 *(no need if available)*
```sh
sudo dnf install python3 # python3 kurulumu

sudo python3 -m pip install elasticsearch # elasticsearch kütüphanesi kurulumu

```

python script *[Detailed source](https://www.w3schools.com/python/default.asp)*

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

We check the data we index by querying *[detailed source](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)*

```sh
curl -X GET "elasticsearch.host:9200/first-index/_search?pretty"
```
