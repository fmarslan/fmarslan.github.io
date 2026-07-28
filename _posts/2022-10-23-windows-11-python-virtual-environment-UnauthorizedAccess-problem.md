---
layout: post
title: "Python windows 11 virtual environment problem"
categories: Python
lang: tr-TR
description: "Python windows 11 virtual environment problem konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "windows-11-python-virtual-environment-unauthorizedaccess-problem-f2a5d708"
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
