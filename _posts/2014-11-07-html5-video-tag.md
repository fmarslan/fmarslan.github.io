---
layout: post
title: "HTML5 video tag"
categories: html
lang: tr-TR
description: "HTML5 video tag konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "html5-video-tag-b34f7aad"
---

Sitenizde Video player mi kullanmak istiyorsunuz kendinizi çok yormayın HTML5 sayesinde ```<img/>``` tagı gibi  ```<video/>``` tagını kullanabilirsiniz. Detaylı bilgi için buraya bakabilirsiniz

```html
<video preload="none" width="640" height="300" poster="{imageUrl}" data-setup="{}" controls="true" class="video-player">
    <source src="{video.url}" type='video/mp4'/>
</video>
```
