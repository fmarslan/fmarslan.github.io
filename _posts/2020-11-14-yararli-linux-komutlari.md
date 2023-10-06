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

# oturum içindeyken ctrl+d ile direkt çıkarsanız oturum kom
le sonlanır oturuma bağlı değilken kapatmak için

screen -X -S dbquery quit

```


repoda uygulama aramak

```sh
#centos
yum search xxx

# ubuntu
apt search xxx

```

bir json dosyasını/çıktısını terminale yazdırırken pretty olarak görünmesini istiyorsanız (örnek rest api call cevabı)


```sh

<command> | json_pp

```

bir çıktıda satır sayısını sayırmak için

```sh
<command> | wc -l
```

bir çıktıda bir sütunu almak için (detaylı regex vs özellikleri var)
```sh
 <command>awk '{print $9}'
```


bir çıktıda sıralama için
```sh
# sayılar için
<command> | sort -n -k1 

#metin için
<command> | sort -n -k2
```

bir listeyi uniq olarak yazdırmak için 
```sh
<command> | uniq

#sonuna -c eklerseniz count ile birlikte yazar

```


DNS  Centos

```sh
 /etc/resolv.conf
 /etc/named.conf
 /etc/named.rfc1912.zones
 /etc/sysconfig/network-scripts/ifcfg-enp2s0
 systemctl enable --now named
 dig @10.96.0.10 google.com
 
```


iptables

```sh
/etc/sysconfig/iptables
```

çıktı yı başka bir komuta vermek

```sh
 <command1> | grep <filter> | xargs <command>
```

tüm docker containerları silmek

```sh
docker ps --all | awk  '{print $1}' | xargs docker rm
```

bir git repodan curl ile son release indirme
```sh
curl -Lo /tmp/opencart.zip $(sh -c 'curl -s https://api.github.com/repos/opencart/opencart/releases/latest | grep "browser_download_url" | cut -d : -f 2,3 | tr -d \"'); \
```

unzip ile zip çinde klasör arama
```sh
unzip -l /tmp/opencart.zip | awk '{print $4}' | grep -E 'opencart-[a-z0-9.]+/upload/$';
```
