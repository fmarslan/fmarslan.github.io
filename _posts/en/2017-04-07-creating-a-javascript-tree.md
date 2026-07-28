---
layout: post
title: "creating a javascript tree"
date: 2017-04-07
description: "A brief technical note outlining the basic approach and applicable steps for creating a javascript tree."
categories: javascript
lang: en-US
translation_key: "javascript-tree-olusturma-58cf7831"
permalink: /en/2017/04/07/creating-a-javascript-tree.html
---

Now we come to preparing a javascript component. In general, I prefer to prepare my own component instead of using ready-made javascript components for simple tasks. First of all, I admit that it has many shortcomings, but if you make a component that will solve your current task and focus only on that task, you will eliminate many unnecessary processes and the burden on the browser. The tree script below only creates li and ul diffractions based on the incoming node data, and can be included in your application with CSS and improvements according to your needs. I have no claim on this matter :) If there are areas that are unclear or complicated, you can always ask your questions in the comments section, I will try to answer as long as I am available.

```javascript
var createTree = function(node) {
   var li = document.createElement("li");
   li.setAttribute("id", node.id);
   li.setAttribute("name", node.name);
   li.className = node.className;

   var item = document.createElement("div");
   item.className = "item";   
   item.innerText=node.caption;
   li.appendChild(item); 
   if (node.hasOwnProperty("children") && node.children.length>0) {
    var ul = document.createElement("ul");
    for ( var i in node.children) {
     ul.appendChild(createTree(node.children[i], showColorBox));
    }
    li.appendChild(ul);
    li.classList.add("has-children");
    li.classList.add("shrink");
    li.addEventListener("click", function(e) {
     if (e.layerX > -1 || e.layerY < 0 || e.layerY > 13)
      return;
     if (li.classList.contains("expand")) {
      li.classList.add("shrink");
      li.classList.remove("expand");
     } else {
      li.classList.remove("shrink");
      li.classList.add("expand");
     }
     e.stopPropagation();
    });
   }
   return li;
  }
```
