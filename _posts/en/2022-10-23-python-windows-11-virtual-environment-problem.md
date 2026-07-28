---
layout: post
title: "Python windows 11 virtual environment problem"
date: 2022-10-23
description: "A short technical note summarizing the basic approach and applicable steps on the Python windows 11 virtual environment problem."
categories: Python
lang: en-US
translation_key: "windows-11-python-virtual-environment-unauthorizedaccess-problem-f2a5d708"
permalink: /en/2022/10/23/python-windows-11-virtual-environment-problem.html
---

If you get the following error when you want to use virtual env in Windows 11 with Python:


```powershell 

.\env\Scripts\activate : File D:\work\fmarslan\python\env\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see 
about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ .\env\Scripts\activate
+ ~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

for solution
``powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
``

**Source**
- https://stackoverflow.com/a/72140763
