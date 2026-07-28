---
layout: post
title: "File compression with Windows VBScript"
date: 2014-11-24
description: "A brief technical note outlining the basic approach and applicable steps for file compression with Windows VBScript."
categories: VBScript
lang: en-US
translation_key: "windows-vbscriptile-dosya-sikistirma-db1c6b49"
permalink: /en/2014/11/24/file-compression-with-windows-vbscript.html
---

The following code may be useful for file compression with VBScript.
```vb
InputFolder = "D:\temp"
ZipFile = "D:\temp " & Replace(Replace(Replace(FormatDateTime(Now),":","-"),".","-"),"/","-") &".zip"


CreateObject("Scripting.FileSystemObject").CreateTextFile(ZipFile, True).Write "PK" & Chr(5) & Chr(6) & String(18, vbNullChar)

Set objShell = CreateObject("Shell.Application")

Set source = objShell.NameSpace(InputFolder).Items

objShell.NameSpace(ZipFile).CopyHere(source)

wScript.Sleep 2000

```
