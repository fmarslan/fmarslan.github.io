Bazen elimizde bir image(.img gibi) dosyası olur bunun boyutunu artırmamız gerekebilir bu durumlarda aşağıdaki adımları takipe debiliriz bizim image dosyamız bir raspberry os image dosyası

aşağıdaki uygulamarı kuruyoruz bu işlemleri yaparken raspberry pi lite os kullandım bu adımlar sorunsuz çalıştı.

```sh
sudo apt install qemu-utils qemu-system-arm unzip lsof

```

ilk kontrolü yapıyoruz boyut bilgisini öğreniyoruz
```sh
kpartx -a -v <img file>
mount /dev/mapper/loop0p2 /mnt
df -h

```


kpartx ile image dosyasını kapatıyoruz ve un mount ediyoruz 
```sh
umount /mnt
kpartx -d <img file>

```


image kullanılıyormu kontrol ediyoruz
```sh

lsof <img file>
```

resize işlemini yapıyoruz

```sh
qemu-img resize <img file> +1G

```
yeniden başlatıyoruz 

kpart ile image dosyasını açıyoruz

```sh
kpartx -a -v <img file>

```

fdisk ile dosyayı açıp partiton düzenlemsini yapıyoruz
```sh
fdisk -l <img file>
fdisk <img file>
```

yeniden başlatıp dosya sistemini düzenliyoruz

```sh
e2fsck -f /dev/mapper/loop0p2 ## burada kendi loop dosyanızı gösterin

resize2fs /dev/mapper/loop0p2  ## burada kendi loop dosyanızı gösterin


```

Değşikliği Kontrol ediyoruz

```sh
mount /dev/mapper/loop0p2 /mnt
df -h
```


[Kaynak](https://univers-libre.net/posts/extend-disk-image.html)
