---
layout: post
title: "Query with rest api via cli for elastic search"
date: 2020-11-13
description: "A short technical note summarizing the basic approach and applicable steps for querying with rest api via cli for elastic search."
lang: en-US
translation_key: "elastik-search-rest-api-ile-cli-uzerinden-sorgu-ebb2b238"
permalink: /en/2020/11/13/query-with-rest-api-via-cli-for-elastic-search.html
---

*Can be updated over time*

The following commands are given with curl for cli. The same requests can be made from postman or directly from the browser. If you do not want the json result data to appear pretty, you should remove the &pretty=true section at the end.

index meta file

```
curl -X GET http://es1:9200/index-name
```

search

```sh
curl -X GET http://es1:9200/index-name/_search?q=*:*&size=10

```

all indexes
```sh
curl -X GET http://es2:9200/_aliases?pretty=true
```
