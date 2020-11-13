---
layout: post
title: "Linux terminal kullanırken komutlar satır başından devam ediyor."
categories: linux
---

```checkwinsize``` özelliği linuxta her bir karakteri yazmadan önce window size ile satır sütun boyutunu kontrol edip gerekirse alt satıra geçirerek yeniden düzenler bu özellikle uzaktan başka bir terminalde çalışırken baş ağrıtıcı olabiliyor bu yüzden kapatmak için aşağıdaki komutu kullanabilirsiniz

```sh
shopt -s checkwinsize
```
