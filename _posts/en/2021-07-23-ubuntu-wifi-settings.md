---
layout: post
title: "Ubuntu Wifi Settings"
date: 2021-07-23
description: "A short technical note outlining the basic approach and applicable steps on Ubuntu Wifi Settings."
categories: system
lang: en-US
translation_key: "ubuntu-server-wifi-settings-595feb42"
permalink: /en/2021/07/23/ubuntu-wifi-settings.html
---

In step 1, let's check the existing network hardware and find out its name.

``` sh
$ ls /sys/class/net
  eth0 lo wlan0
```

2. Let's check the network config file

```sh

$ ls /etc/netplan
  50-cloud-init.yaml

```

3. Let's register the wifi network


```sh

$ sudo edit /etc/netplan/50-cloud-init.yaml

```

addition to file content

```sh
network:
    wifis:
        wlan0:
            optional: true
            dhcp4: true
            access-points:
                "<WIFI SSID>":
                    password: "<WIFI Password>"
            
```

We apply the settings

```sh
$ sudo netplan apply
$ sudo reboot
```

After restarting, if your wifi information is correct and wifi access point is on, the connection will be established.

[Detailed Information](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#3-wifi-or-ethernet)
