---
title: "Error: EPERM: operation not permitted, symlink "
layout: post
categories: nodejs
---

linux işletim sisteminde fat32 dosya sistemi üzerinde npm install yaparken aşağıdaki gibi bir hata alıyorsanız çözüm için ``npm config set bin-links false`` komutunu çalıştırarak sorunu çözebilirsiniz.


```sh
[Error: EPERM: operation not permitted, symlink '../@babel/parser/bin/babel-parser.js' -> '.../node_modules/.bin/parser'] { ...
```

