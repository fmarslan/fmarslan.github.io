---
layout: post
title: "Creating a Google Maps polygon from WKT information"
date: 2017-04-07
description: "A brief technical note outlining the basic approach and actionable steps for creating Google Maps polygons from WKT information."
categories: javascript
lang: en-US
translation_key: "wkt-bilgisinden-google-maps-polygon-olusturma-342cae6f"
permalink: /en/2017/04/07/creating-a-google-maps-polygon-from-wkt-information.html
---

From time to time, we may need to draw polygons on a map. In such a case, if the data you have is in WKT format and you do not use any layers, you can draw polygons from the data in polygon WKT format using the script below. You can get the necessary libraries and detailed documentation information from the http://terraformer.io/ website.

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
