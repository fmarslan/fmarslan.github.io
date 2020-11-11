---
layout: post
title: "Javascript tab control hazırlama"
categories: javascript
---
Zaman zaman basit anlık çözümler için javascript ile component hazırlama ihtiyacı duyabiliriz yine böyle bir durumda ihtiyaç duyduğum tab control için hazırladığım scripti sizler ile paylaşmak istedim. Umarım birilerinin işine yarar

component Javascript class olarak hazırlanmıştır ve çok basit tutulmuştur isteğinize göre geliştirebilirsiniz. Css içeriğini paylaşmadım kendinize göre csslerini yazabilirsiniz.

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
