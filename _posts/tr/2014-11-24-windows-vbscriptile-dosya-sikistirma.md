---
layout: post
title: "Windows VBScript ile dosya sıkıştırma"
categories: VBScript
lang: tr-TR
description: "Windows VBScript ile dosya sıkıştırma konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "windows-vbscriptile-dosya-sikistirma-db1c6b49"
permalink: /vbscript/2014/11/24/windows-vbscriptile-dosya-sikistirma.html
---

VBScript ile dosya sıkıştırma yapmak için aşağıdaki kod işinizi görebilir
```vb
InputFolder = "D:\temp"
ZipFile = "D:\temp " & Replace(Replace(Replace(FormatDateTime(Now),":","-"),".","-"),"/","-") &".zip"


CreateObject("Scripting.FileSystemObject").CreateTextFile(ZipFile, True).Write "PK" & Chr(5) & Chr(6) & String(18, vbNullChar)

Set objShell = CreateObject("Shell.Application")

Set source = objShell.NameSpace(InputFolder).Items

objShell.NameSpace(ZipFile).CopyHere(source)

wScript.Sleep 2000

```
