---
layout: post
title: "Yararlı linux komutları"
categories: linux
---

*Zaman içinde güncellenebilir*


```checkwinsize``` özelliği linuxta her bir karakteri yazmadan önce window size ile satır sütun boyutunu kontrol edip gerekirse alt satıra geçirerek yeniden düzenler bu özellikle uzaktan başka bir terminalde çalışırken baş ağrıtıcı olabiliyor bu yüzden kapatmak için aşağıdaki komutu kullanabilirsiniz

```sh
shopt -s checkwinsize
```


terminal üzerinde http request yapmak için

```sh

curl -X GET/POST 

```

uzak bir terminale bağlandınız ve uzun sürecek bir işlem başlattınız ya bağlantınız koparsa ne olacak ? büyük ihtimal işleminiz yarıda kesilecektir. Bunun önlemenin bir yolu var Screen komutunu kullanabilirsiniz. ([kaynak](https://linuxize.com/post/how-to-use-linux-screen/))

```sh

# version kontrol
screen --version  

# isim ile session başlatma
screen -S dbquery

#komutu sonlandırmadan ekrandan ayrılmak için Ctrl+a,d


#oluşturulmuş ekranları listelemek için
screen -ls

mevcut bir oturuma bağlanmak için (devam komutları çıktıları aynı şekilde görüntülersiniz)
screen -r dbquery

# oturum içindeyken ctrl+d ile direkt çıkarsanız oturum komple sonlanır oturuma bağlı değilken kapatmak için

screen -X -S dbquery quit

```
