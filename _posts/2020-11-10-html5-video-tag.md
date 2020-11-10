---
layout: post
title: "HTML5 video tag"
categories:html
---
Sitenizde Video player mi kullanmak istiyorsunuz kendinizi çok yormayın HTML5 sayesinde "<img/>" tagı gibi  "<video/>" tagını kullanabilirsiniz. Detaylı bilgi için buraya bakabilirsiniz

```html
<video preload="none" width="640" height="300" poster="{imageUrl}" data-setup="{}" controls="true" class="video-player">
    <source src="{video.url}" type='video/mp4'/>
</video>
```