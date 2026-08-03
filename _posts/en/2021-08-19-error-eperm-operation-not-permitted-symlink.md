---
layout: post
title: "Error: EPERM: operation not permitted, symlink"
date: 2021-08-19
description: "Error: EPERM: operation not permitted is a short technical note outlining the basic approach and applicable steps regarding symlinking."
categories: nodejs
lang: en-US
translation_key: "linuxta-fat32-dosya-sisteminde-npm-install-error-eperm-operation-not-permitted-symlink-950f9ebc"
permalink: /en/2021/08/19/error-eperm-operation-not-permitted-symlink.html
---

If you receive an error like the one below while doing npm install on the fat32 file system in the Linux operating system, you can solve the problem by running the ``npm config set bin-links false`` command.


```sh
[Error: EPERM: operation not permitted, symlink '../@babel/parser/bin/babel-parser.js' -> '.../node_modules/.bin/parser'] { ...
```
