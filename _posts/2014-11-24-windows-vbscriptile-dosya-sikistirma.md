---
layout: post
title: "Windows VBScript ile dosya sıkıştırma"
categories: VBScript
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
