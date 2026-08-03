---
layout: post
title: "creating javascript custom style checkbox"
date: 2017-04-07
description: "A brief technical note outlining the basic approach and applicable steps for creating a javascript custom style checkbox."
categories: javascript
lang: en-US
translation_key: "javascript-custom-style-checkbox-olusturma-fe55e9ba"
permalink: /en/2017/04/07/creating-javascript-custom-style-checkbox.html
---

If you are one of those who are annoyed by the statements you see on some web pages such as "How do they make a checkbox component like this? How does it look like this?", here is an example of changing the checkbox style with a simple CSS. Also, as a javascript fan, in case you want to prepare the checkbox with javascript, the script that prepares the checkbox with javascript is included as a gift.

Is it over?

Of course, it is not over, there is also a development for those who want to put a colorbox next to the checkbox, of course, this development is done with the http://jscolor.com/ library, I will try to explain it another time.

NOTE: When it is this busy, it inevitably comes with complexity. As always, you can ask about the points you do not understand and get stuck on. Also, don't forget to add the http://fontawesome.io/ library for style.

```javascript
var createCheckBox = function(name, value, caption, showColorBox) {
   var wrapper = document.createElement("div");
   var check = document.createElement("input");
   var changeListener = [];
   var childULElement = null;

   /**
    * Change Listener
    */
   wrapper.addChangeListener = function(f) {
    changeListener.push(f);
   };
   wrapper.removeChangeListener = function(f) {
    changeListener.splice(array.indexOf(f), 1);
   };
   wrapper.change = function(e) {
    for ( var event in changeListener) {
     changeListener[event](e, check);
    }
   };

   wrapper.setChild = function(ul) {
    childULElement = ul;
   }

   wrapper.addChangeListener(function(e, c) {
    CBS.setAttribute(name, c.checked);
    wrapper.setAttribute("checked",c.checked);
    CBS.settings.applyFilter();    
   });

   wrapper.setChecked = function(val) {
    check.checked = val;
    wrapper.change(null);
   }

   wrapper.isChecked = function(){
    return check.checked;
   }
   
   wrapper.className = "cbs-checkbox";
   wrapper.setAttribute("name", name)
   var oldValue = CBS.getAttribute(name);
   if (oldValue == null) {
    CBS.setAttribute(name, value);
   } else {
    value = oldValue;
   }

   check.setAttribute("type", "checkbox");
   check.checked = value;
   wrapper.setAttribute("checked",check.checked);
   check.addEventListener("click", function(e) {
    wrapper.change(e);
   });

   var label = document.createElement("span");
   label.innerText = caption;

   wrapper.appendChild(check);
   wrapper.appendChild(label);
   wrapper.disabled = function(disabled) {
    if (disabled == true) {
     check.setAttribute("disabled", true)
     wrapper.setAttribute("disabled", true)
    } else {
     check.removeAttribute("disabled")
     wrapper.removeAttribute("disabled")
    }
   }

   if (typeof showColorBox != "undefined" && showColorBox == true
     && typeof jscolor == "function") {
    var colorBtn = document.createElement("button");
    colorBtn.className = "color-box";
    var picker = new jscolor(colorBtn, {
     valueElement : null
    });
    
    var color = CBS.getAttribute(name+"_color");
    if(color == null)
     color = CBS.getSettings().polygonColor;
    
    picker.fromString(color);
    picker.onClose = function(colorBox) {
     wrapper.setAttribute("color",wrapper.color.style.backgroundColor);
     // Burada yapmak istediğiniz her işlemi yapabilirsiniz seçilen renk kullanımınıza hazır.
    }
    wrapper.insertBefore(colorBtn, wrapper.firstChild);
    wrapper.classList.add("has-colorbox");
    wrapper.color = colorBtn;
   }
   return wrapper;
  }
```


css
```css
.cbs-checkbox{
 line-height:100%;
 margin-bottom: 5px;
}
.content>div>.cbs-checkbox{
 margin-left:8px;
}
.cbs-checkbox>input{
    font: normal normal normal 16px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    background:none;
    border:none;
    /*visibility: hidden;*/
    width: 13px;
    height:13px;
  position: relative;
  margin:auto 5px;
  overflow:hidden;
  display:inline-block;
}
.cbs-checkbox>input:before{
 content: " "; /*\f046*/
 font-size:11px;
 width:11px;
 height:11px;
 display:inline-block;
 cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    background: #fcfff4;
    position:absolute;
    border:1px solid #bbb;
}
.cbs-checkbox>input:checked:before{
 content: "\f00c";
}
.cbs-checkbox .color-box {
 border: 1px solid #bbb;
 background: none;
 width: 13px;
 height: 13px;
 display: block;
 float: left;
 margin-top: 0px;
 margin-left: 6px;
}
```
