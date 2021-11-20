---
title: "Solr Notlar"
layout: post
categories: solr
---

leader seçimi

http://XXX:8983/solr/admin/collections?action=FORCELEADER&collection={collection}&shard={shard}


UP config

```
./solr/server/scripts/cloud-scripts/zkcli.sh -zkhost $ZK_URL -cmd upconfig -confdir $WORKSPACE/solr-config/conf/ -confname $NAME

```


DELETE config
```
./solr/server/scripts/cloud-scripts/zkcli.sh -zkhost $ZK_URL -cmd clear /configs/$NAME

```

[Kaynak](https://solr.apache.org/guide/8_7/)
