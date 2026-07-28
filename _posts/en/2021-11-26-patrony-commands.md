---
layout: post
title: "Patrony Commands"
date: 2021-11-26
description: "A short technical note summarizing the basic approach and applicable steps on Patroni Commands."
categories: patroni
lang: en-US
translation_key: "patroni-replica-reinit-a33ebe95"
permalink: /en/2021/11/26/patrony-commands.html
---

You can use the following short commands to list the replicas in the Patroni cluster and restart a problematic replica.

First check the cluster status, then run `reinit`, specifying the cluster and node name:

```sh

patronictl list

patronictl reinit clustername nodename

```
