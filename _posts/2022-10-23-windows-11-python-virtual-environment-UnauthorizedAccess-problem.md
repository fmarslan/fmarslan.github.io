---
layout: post
title: "Python windows 11 virtual environment problem"
categories: Python
---

Python ile windows 11 de virtual env kullanmak istediğiniz aşağıdaki hatayı aldıysanız


```powershell 

.\env\Scripts\activate : File D:\work\fmarslan\python\env\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see 
about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ .\env\Scripts\activate
+ ~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

Çözüm için
``powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
``

**Kaynak**
- https://stackoverflow.com/a/72140763
