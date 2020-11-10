---
layout: post
title: "javascript tree oluşturma"
categories: javascript
---

Yine geldik bir javascript componenti hazırlamaya ben genel itibariyle basit işler için hazır javascript componentleri kullanmak yerine kendi componentimi hazırlamayı tercih ederim. Başta şunu kabul ediyorum çok eksikleri olur fakat o an ki işinizi çözecek sadece o işe odaklanacak bir komponent yaparsanız gereksiz bir çok işlemi ve tarayıcı üzerine düşen yükü de ortadan kaldırmış olursunuz. Aşağıdaki tree Scripti sadece gelen node verisine göre li ve ul şeklinde kırınımları oluşturuyor css ile ve ihtiyacınıza göre geliştirmeler ile sizinde bir uygulamanızda yer alabilir. bu konuda hiç bir hak talebim yoktur :) Anlaşılmayan karmaşık gelen yerler olursa herzaman yorum kısmından sorularınızı sorabilirsiniz müsait olduğum sürece cevaplamaya çalışırım.

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
