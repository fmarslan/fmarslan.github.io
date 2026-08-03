---
layout: post
title: "Serving GitHub Files via CDN with jsDelivr (Short and Clear Guide)"
date: 2026-01-09
description: "A practical way to serve public GitHub repo files via CDN in a commit-based, immutable and cache-friendly way with jsDelivr."
tags:
  - cdn
  - jsdelivr
  - github
  - performance
  - frontend
lang: en-US
translation_key: "jsdelivr-ile-github-dosyalarini-cdn-uzerinden-sunmak-0e1ef7af"
permalink: /en/2026/01/09/serving-github-files-via-cdn-with-jsdelivr-short-and-clear-guide.html
---

If you want to serve a single file in a public GitHub repo quickly, securely and without cache problems, there is no need for extra infrastructure for most scenarios.
**jsDelivr** allows you to use GitHub directly as a CDN source.

This article focuses on **“how to use it correctly”** rather than “why”.



## Basic URL format

```text
https://cdn.jsdelivr.net/gh/<user>/<repo>@<version>/<path>
```

* `<user>`: GitHub username
* `<repo>`: repository name
* `<version>`: **commit SHA**, tag or branch
* `<path>`: file path in repo

> Critical point: **use commit SHA as version.**
> Using Branch or `main` produces a cache surprise.



## Real example (file in this blog)

Source file (GitHub):

```
https://github.com/fmarslan/fmarslan.github.io/blob/a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js
```

jsDelivr CDN URL:

```
https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js
```

Usage in HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js"></script>
```

This URL:

* Immutable
* CDN cache works safely
* When the file changes, it means **new commit = new URL**



## CLI and runtime examples

### curls

```bash
curl -L \
"https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js"
```

### Node.js

```js
import fetch from 'node-fetch';

const url =
  'https://cdn.jsdelivr.net/gh/fmarslan/fmarslan.github.io@a3d76ec02081dfc283f20980ef41797978141d7b/assets/js/post-enhancements.js';

const res = await fetch(url);
if (!res.ok) throw new Error(res.statusText);

const content = await res.text();
console.log(content);
```



## Good practices (important for prod)

* **Use Commit SHA**
  → There is no cache invalidation problem.
* If the file has been updated
  → **new commit, new URL**.
* jsDelivr **offers public repo only**.
* If authentication, confidential data, PII
  → this method is **wrong**.
* For critical prod loads
  → Consider your own edge solution like S3 + CloudFront / Cloudflare.



## Common problems

**I'm getting a 404**

* Repo name, path or commit SHA is incorrect.
* Check if the file actually exists in that commit.

**File sounds old**

* You are using Branch.
* Switch to Commit SHA.

**Access is slow on corporate network**

* jsDelivr rate-limit or network policy.
*Alternative CDN may be required.



## When does it make sense and when does it not?

**Makes sense**

* Blog, documentation, static JS/CSS
* Small helper scripts
* Immutable assets

**Unreasonable**

* Secret code
* Frequently changing runtime dependencies
* Critical prod components requiring SLA



In summary:
If you want **public**, **small** and **the URL should change when it changes**, jsDelivr is sufficient.
The problem here is not technical; **using branch URL in wrong place**.

If you want, in the next step, we can put the **S3 + CloudFront** or **Cloudflare Workers** equivalents of the same file side by side and clarify the differences.
