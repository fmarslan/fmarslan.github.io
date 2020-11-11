---
layout: post
title: "WKT bilgisinden Google Maps polygon oluşturma"
categories: javascript
---
Zaman zaman bir harita üzerinde polygon çizme ihtiyacımız olabilir yine böyle bir durumda elinizde ki veri WKT formatında ise ve herhangi bir layer kullanmıyorsanız aşağıdaki scripti kullanarak polygon WKT formatındaki veriden polygon çizebilirsiniz. Gerekli kütüphaneleri ve detaylı dökümantasyon bilgisini http://terraformer.io/ sitesinden alabilirsiniz.

```javascript
var generatePolygon = function(obj) {
  var parsed = Terraformer.WKT.parse(obj.geometry);
  var paths = [];
  if (parsed.type == "MultiPolygon") {
   for (var i = 0; i < parsed.coordinates.length; i++) {

    for (var j = 0; j < parsed.coordinates[i].length; j++) {
     var islandOrHole = [];
     for (var k = 0; k < parsed.coordinates[i][j].length; k++) {
      islandOrHole.push({
       lat : parsed.coordinates[i][j][k][1],
       lng : parsed.coordinates[i][j][k][0]
      });
     }
     paths.push(islandOrHole);
    }
   }
  } else {

   for (i = 0; i < parsed.coordinates.length; i++) {
    var poly = [];
    for (j = 0; j < parsed.coordinates[i].length; j++) {
     var latLng = {
      lat : parsed.coordinates[i][j][1],
      lng : parsed.coordinates[i][j][0]
     };
     poly.push(latLng);
    }
    paths.push(poly);
   }

  }
  return paths;
 }
```
