---
layout: post
title: "Solr Notes"
date: 2021-09-10
description: "A short technical note on Solr Notes, outlining the basic approach and actionable steps."
categories: solr
lang: en-US
translation_key: "solr-cloud-notlar-3245e824"
permalink: /en/2021/09/10/solr-notes.html
---

leader selection

```
http://XXX:8983/solr/admin/collections?action=FORCELEADER&collection={collection}&shard={shard}
```

UP config

```
./solr/server/scripts/cloud-scripts/zkcli.sh -zkhost $ZK_URL -cmd upconfig -confdir $WORKSPACE/solr-config/conf/ -confname $NAME

```


DELETE config
```
./solr/server/scripts/cloud-scripts/zkcli.sh -zkhost $ZK_URL -cmd clear /configs/$NAME

```

[Source](https://solr.apache.org/guide/8_7/)
