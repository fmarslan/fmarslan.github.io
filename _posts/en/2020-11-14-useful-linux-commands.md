---
layout: post
title: "Useful Linux commands"
date: 2020-11-14
description: "A short technical note outlining the basic approach and actionable steps on useful linux commands."
categories: linux
lang: en-US
translation_key: "yararli-linux-komutlari-1fd4901a"
permalink: /en/2020/11/14/useful-linux-commands.html
---

*Can be updated over time*


```checkwinsize``` feature checks the row and column size with window size before writing each character in Linux and rearranges them by moving them to the bottom row if necessary. This can be a headache, especially when working remotely from another terminal, so you can use the following command to turn it off.

```sh
shopt -s checkwinsize
```


To make http request on terminal

```sh

curl -X GET/POST 

```

You have connected to a remote terminal and started a long process, what happens if your connection is lost? Most likely your transaction will be interrupted. There is a way to prevent this, you can use the Screen command. ([source](https://linuxize.com/post/how-to-use-linux-screen/))

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


Searching for apps in repo

```sh
#centos
yum search xxx

# ubuntu
apt search xxx

```

If you want it to appear as pretty when printing a json file/output to the terminal (example rest api call answer)


```sh

<command> | json_pp

```

to count the number of lines in an output

```sh
<command> | wc -l
```

to get a column in an output (there are detailed regex etc features)
```sh
 <command>awk '{print $9}'
```


for sorting in an output
```sh
# sayılar için
<command> | sort -n -k1 

#metin için
<command> | sort -n -k2
```

to print a list as uniq 
```sh
<command> | uniq

#sonuna -c eklerseniz count ile birlikte yazar

```


DNS Centos

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

pass the output to another command

```sh
 <command1> | grep <filter> | xargs <command>
```

deleting all docker containers

```sh
docker ps --all | awk  '{print $1}' | xargs docker rm
```

Downloading the latest release from a git repo with curl
```sh
curl -Lo /tmp/opencart.zip $(sh -c 'curl -s https://api.github.com/repos/opencart/opencart/releases/latest | grep "browser_download_url" | cut -d : -f 2,3 | tr -d \"'); \
```

Searching for folders in zip with unzip
```sh
unzip -l /tmp/opencart.zip | awk '{print $4}' | grep -E 'opencart-[a-z0-9.]+/upload/$';
```
