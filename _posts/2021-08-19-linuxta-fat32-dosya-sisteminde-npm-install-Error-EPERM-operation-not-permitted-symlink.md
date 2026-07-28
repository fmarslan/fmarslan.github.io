---
title: "Error: EPERM: operation not permitted, symlink "
layout: post
categories: nodejs
lang: tr-TR
description: "Error: EPERM: operation not permitted, symlink konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "linuxta-fat32-dosya-sisteminde-npm-install-error-eperm-operation-not-permitted-symlink-950f9ebc"
---

linux işletim sisteminde fat32 dosya sistemi üzerinde npm install yaparken aşağıdaki gibi bir hata alıyorsanız çözüm için ``npm config set bin-links false`` komutunu çalıştırarak sorunu çözebilirsiniz.


```sh
[Error: EPERM: operation not permitted, symlink '../@babel/parser/bin/babel-parser.js' -> '.../node_modules/.bin/parser'] { ...
```

