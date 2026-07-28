---
layout: post
title: "Preparing Javascript tab control"
date: 2017-04-07
description: "A brief technical note outlining the basic approach and applicable steps in preparing a Javascript tab control."
categories: javascript
lang: en-US
translation_key: "javascript-tab-control-hazirlama-47bc220c"
permalink: /en/2017/04/07/preparing-javascript-tab-control.html
---

From time to time, we may need to prepare components with JavaScript for simple instant solutions. In such a case, I wanted to share with you the script I prepared for the tab control I need. I hope it will be useful to someone

The component has been prepared as a Javascript class and is kept very simple. You can develop it as you wish. I did not share the css content, you can write your own css.

```javascript
var TabControl = function(className) {
  var tabControl = this;

  var wrapper = document.createElement("div");
  var captions = document.createElement("div");
  var contents = document.createElement("div");
  
  wrapper.className = "f-tab";
  
  if(typeof className == "string")
   wrapper.classList.add(className);
  
  captions.className = "tab-captions";
  contents.className = "tab-contents";

  wrapper.appendChild(captions);
  wrapper.appendChild(contents);

  tabControl.select = function(content) {
   for (var c = 0; c < contents.children.length; c++) {
    contents.children[c].caption.classList.remove("passive");
    contents.children[c].classList.remove("passive");
    contents.children[c].caption.classList.remove("active");
    contents.children[c].classList.remove("active");
    if (contents.children[c] === content) {
     contents.children[c].caption.classList.add("active");
     contents.children[c].classList.add("active");
    } else {
     contents.children[c].caption.classList.add("passive");
     contents.children[c].classList.add("passive");
    }
   }
  }

  tabControl.addTab = function(caption, content) {
   if (typeof caption == "string") {
    var l = caption;
    caption = document.createElement("span");
    caption.innerHTML = l;
   }
   caption.classList.add("passive");
   contentclassList.add("passive");
   content.caption = caption;
   caption.content = content;
   captions.appendChild(caption);
   contents.appendChild(content);

   caption.addEventListener("click", function() {
    tabControl.select(content);
   });
  }

  tabControl.getElement = function() {
   return wrapper;
  }

  return tabControl;

 }
```
