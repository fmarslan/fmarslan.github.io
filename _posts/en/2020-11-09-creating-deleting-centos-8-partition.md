---
layout: post
title: "Creating/deleting Centos 8 partition"
date: 2020-11-09
description: "A brief technical note outlining the basic approach and applicable steps for creating/deleting a Centos 8 partition."
categories: linux
lang: en-US
translation_key: "centos-8-partition-olusturma-silme-16708b51"
permalink: /en/2020/11/09/creating-deleting-centos-8-partition.html
---

Those who want to put a timer on your page for time out can edit the code below. 

```sh
parted /dev/sda komutu ile mevcut partitionlar görüntülenir
```


Important Note: The following commands from this section will be applied to the disk instantly, so I recommend that you do it carefully. 

```sh
mkpart <name> <start> <end> ile yeni partition oluşturulur
rm <listitem> ilgili partition siler
```

Among the file formats, msdos supports 4 partitions, gpt supports 128
