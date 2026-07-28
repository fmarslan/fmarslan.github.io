---
layout: post
title: "Raspberry pi Password Reset"
date: 2022-04-24
description: "A short technical note outlining the basic approach and applicable steps on Raspberry pi Password Reset."
categories: Raspberrypi
lang: en-US
translation_key: "raspberry-pi-sifre-sifirlama-3637edfc"
permalink: /en/2022/04/24/raspberry-pi-password-reset.html
---

If one day you forget your Raspberry Pi password and cannot open it, you can reset the password as follows.

**1:** First, remove the SD card from the device and open it on a computer to view files.

**2:** Open the cmdline.txt file with a text editor and add `init=/bin/sh` at the end of the line

**3:** Insert the card back into the device (Raspberry Pi) and turn it on. You will see a terminal with the root user.

**4:** You can change the password with `passwd pi` or specify a different username.

**5:** If you get `authentication token manipulation error` error, just run this command `mount -o remount, rw /`. You can then repeat the password reset process.

**6:** Open the card again on the PC ***2. Complete the process in step*** and save it.

**7:** You can insert the card into the device and turn it on with your new password.
