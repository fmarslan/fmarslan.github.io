---
layout: post
title: "Creating/Updating Solr Collection"
date: 2021-04-02
description: "A brief technical note outlining the basic approach and applicable steps for Creating/Updating a Solr Collection."
categories: solr
lang: en-US
translation_key: "solr-collection-olusturma-guncelleme-d637175b"
permalink: /en/2021/04/02/creating-updating-solr-collection.html
---

These days, when we started using Solr intensively after changing the Elastic Search license, we generally install Solr Collection. And instead of going back and searching every time to find out what the command was, I thought I'd just take a note of it here, maybe it might be useful to others who need it.


First, we will upload the Solr Collection folder we prepared to Zookeeper, it is called upconfig, for this we need to download the zk client [here](https://zookeeper.apache.org/releases.html) We can download the appropriate version for us. Since I have Solr, I use the zk client in Solr. If you have Solr installed, you can use it too.

``` sh
../solr/server/scripts/cloud-scripts/zkcli.sh -zkhost {{ZK_URL}} -cmd upconfig -confdir {{SOLR_COLLECTION_CONF_DIRECTORY}} -confname {{CONF_NAME}}
```

After doing this, when we go to the solr interface and click the add collection button on the Collections page, we will be able to see all the confs on zk, including the one we uploaded, then it is between you and solr :).


- [ZK Tutorial](https://zookeeper.apache.org/doc/current/)
- [Solr Tutorial](https://solr.apache.org/resources.html#tutorials)
