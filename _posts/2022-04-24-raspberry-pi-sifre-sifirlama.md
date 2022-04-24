---
layout: post
title: "Raspberry pi Şifre Sıfırlama"
categories: Raspberrypi
---
Eğer birgün raspberry pi şifresini unutur açamazsanız aşağıdaki şekilde şifreyi sıfırlayabilirsiniz

**1:** Öncelikle sd kartı cihazdan çıkartıp bir bilgisayarda dosya görüntülemek için açın

**2:** cmdline.txt dosyasının içine bir text editör ile açıp satırın sonuna `init=/bin/sh` ekleyin

**3:** kartı tekrar cihaza(raspberry pi) takıp açın karşınıza root kullanıcısı ile terminal gelecektir.

**4:** `passwd pi` ile şifreyi değiştirebilirsiniz veya fakrlı bir kullanıcı adı belirterek bu işlemi yapabilirsiniz.

**5:** Eğer `authentication token manipulation error`hatası alırsanız `mount -o remount, rw /` bu komutu çalıştırmanız yeterlidir. sonrasında şifre sıfırlama işlemini tekrarlayabilirsiniz.

**6:** Tekrar kartı pc de açıp ***2. adım*** daki işlemi geir alın kaydedin.

**7:** Cihaza kartı takıp yeni şifrenizle açabilirsiniz.
