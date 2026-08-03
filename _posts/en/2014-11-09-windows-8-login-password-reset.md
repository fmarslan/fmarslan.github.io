---
layout: post
title: "Windows 8 login password reset"
date: 2014-11-09
description: "A brief technical note outlining the basic approach and applicable steps for resetting Windows 8 login password."
categories: windows
lang: en-US
translation_key: "windows-8-logi-password-sifirlama-58465306"
permalink: /en/2014/11/09/windows-8-login-password-reset.html
---

When you want to reset Windows 8 login password, follow the steps below


Start your computer with any software that supports NTFS command system. (E.g. Hiren Boot, Windows recovery)

Change the name of the Utilman.exe file to UtilmanCopy.exe under system 32 in the Windows installed directory.

Rename Cmd.exe to Utilman.exe.

Restart the computer. Open it with Windows.

When the login screen appears, click on the accessibility button at the bottom left. The command system will open.

Run the command { net user trial abc123 /ADD }

Run { net users trial /active:yes }

Restart the computer

A new user named Trial must be added. The password of this user is "abc123". Log in to the trial user.

Change your current user's password as desired



good luck....
