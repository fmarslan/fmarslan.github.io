---
layout: post
title: "Error: EPERM: operation not permitted, symlink"
date: 2021-08-19
last_modified_at: 2026-09-20
description: "Error: EPERM: operation not permitted is a short technical note outlining the basic approach and applicable steps regarding symlinking."
categories: nodejs
lang: en-US
translation_key: "linuxta-fat32-dosya-sisteminde-npm-install-error-eperm-operation-not-permitted-symlink-950f9ebc"
permalink: /en/2021/08/19/error-eperm-operation-not-permitted-symlink.html
---

An `EPERM` error during `npm install` can occur when npm tries to create an executable link on a filesystem that does not support symbolic links. This note covers a project stored on FAT32 under Linux; other permission errors may have a different cause.

## Recognize the failing operation

```text
Error: EPERM: operation not permitted, symlink
'../@babel/parser/bin/babel-parser.js' -> '.../node_modules/.bin/parser'
```

The `symlink` operation and `node_modules/.bin` destination identify the step that failed.

## Install without executable links

From the project directory, use a per-command option:

```sh
npm install --bin-links=false
```

This skips executable-link creation for that installation. The original workaround is a persistent npm setting:

```sh
npm config set bin-links false
```

Prefer the per-command form when the restriction applies to only one project. A persistent setting can also affect later installations.

## Check the result and the limitation

Run the project's usual build or test command after installation. Skipping links can leave package command-line tools unavailable through `node_modules/.bin`; a successful install alone does not prove the application builds correctly.

For normal development, move the project to a filesystem that supports symbolic links and reinstall its dependencies with links enabled. Avoid treating every `EPERM` as this filesystem issue: confirm that the failing operation is a symbolic link first.

See the official [npm `bin-links` documentation](https://docs.npmjs.com/cli/install/#bin-links) for the option's behavior.
