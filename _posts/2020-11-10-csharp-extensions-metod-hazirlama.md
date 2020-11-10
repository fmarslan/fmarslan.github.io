---
layout: post
title: "CSharp Extensions metod hazırlama"
categories:csharp
---
C# ta bazen kod yazımını kolaylaştırmak için kendi class larınıza veya herhangi bir hazır olan veri tipine extension metod yazmak isteye bilirsiniz bunun için herhangi bir class içerisine aşağıdaki kodu kendinize göre düzenleyip yazarsanız  o classın ait olduğu namespace içerisinde veya o name space dahil edilmiş olan tüm classlarda kullanabilirsiniz. eklediğiniz classın ne olduğu önemli değil yine de tavsiyem bu tip metodlarınız aynı çatı altında toplamanızdır.

Bilmeyenler için Extension metod kod yazarken herhangi bir objeden sonra "." koyduğunuzda açılan menü listesine kendi metodunuzu eklemek için kullanılır.

Örnek
int a =5;
a.Topla(6);//extension metod
//11

```csharp

public static int Topla(this int sayi,int eklenecekSayi)
        {
            return sayi+eklenecekSayi;
        }
```