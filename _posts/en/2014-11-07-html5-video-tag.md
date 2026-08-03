---
layout: post
title: "HTML5 video tag"
date: 2014-11-07
description: "A brief technical note outlining the basic approach and applicable steps for HTML5 video tags."
categories: html
lang: en-US
translation_key: "html5-video-tag-b34f7aad"
permalink: /en/2014/11/07/html5-video-tag.html
---

Do you want to use a video player on your site? Don't worry too much. Thanks to HTML5, you can use the ```<video/>``` tag like the ```<img/>``` tag. You can look here for detailed information.

```html
<video preload="none" width="640" height="300" poster="{imageUrl}" data-setup="{}" controls="true" class="video-player">
    <source src="{video.url}" type='video/mp4'/>
</video>
```
