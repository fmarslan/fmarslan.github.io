---
layout: post
title: "Finding polygon midpoint"
date: 2017-04-07
description: "A brief technical note outlining the basic approach and actionable steps for finding polygon midpoints."
categories: javascript
lang: en-US
translation_key: "polygon-orta-nokta-bulma-1a62edb7"
permalink: /en/2017/04/07/finding-polygon-midpoint.html
---

If one day you want to find the midpoint of a polygon, but this process gives a result other than the polygon in cases where the polygon shape is strange and you are not happy with it, the following script is for you (Note, as always, it is open to personal improvements :) )

```javascript
var generatePointInPolygon = function(path) {
  var kesisimNoktalari = [];
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < path.length; i++) {
   bounds.extend(new google.maps.LatLng(path[i].lat, path[i].lng));
  }

  var sw = bounds.getSouthWest();
  var ne = bounds.getNorthEast();

  for (var i = 0; i < path.length - 1; i++) {

   var t = ((ne.lng() - sw.lng()) * (sw.lat() - path[i].lat) - (sw
     .lng() - path[i].lng)
     * (ne.lat() - sw.lat()))
     / ((ne.lng() - sw.lng()) * (path[i + 1].lat - path[i].lat) - (path[i + 1].lng - path[i].lng)
       * (ne.lat() - sw.lat()));

   var ptLat = path[i].lat + (path[i + 1].lat - path[i].lat) * t;
   var ptLng = path[i].lng + (path[i + 1].lng - path[i].lng) * t;

   if ((sw.lat() <= ptLat && sw.lng() <= ptLng && ne.lat() >= ptLat && ne
     .lng() >= ptLng)
     && ((path[i].lat <= ptLat && path[i].lng >= ptLng
       && path[i + 1].lat >= ptLat && path[i + 1].lng <= ptLng)
       || (path[i].lat >= ptLat && path[i].lng <= ptLng
         && path[i + 1].lat <= ptLat && path[i + 1].lng >= ptLng

       )
       || (path[i].lat <= ptLat && path[i].lng <= ptLng
         && path[i + 1].lat >= ptLat && path[i + 1].lng >= ptLng) || (path[i].lat >= ptLat
       && path[i].lng >= ptLng && path[i + 1].lat <= ptLat && path[i + 1].lng <= ptLng

     ))) {
    var point = new google.maps.LatLng(ptLat, ptLng);
    if (kesisimNoktalari.length == 0) {
     kesisimNoktalari.push(point);
     continue;
    }

    for ( var pIndex in kesisimNoktalari) {
     if (kesisimNoktalari[pIndex].lat() > point.lat()
       && kesisimNoktalari[pIndex].lng() > point.lng()) {
      kesisimNoktalari.splice(pIndex, 0, point);
      break;
     }
    }
   }
  }
  var enUzunAralik = 0, center = null;
  for (var pIndex = 0; pIndex < kesisimNoktalari.length - 1; pIndex = pIndex + 2) {
   if (Math
     .abs(Math
       .sqrt(Math
         .pow(
           (kesisimNoktalari[pIndex].lat() - kesisimNoktalari[pIndex + 1]
             .lat()), 2)
         + Math
           .pow(
             (kesisimNoktalari[pIndex]
               .lng() - kesisimNoktalari[pIndex + 1]
               .lng()), 2))) > enUzunAralik) {
    var x, y;
    if (kesisimNoktalari[pIndex].lng() > kesisimNoktalari[pIndex + 1]
      .lng()) {
     y = kesisimNoktalari[pIndex + 1].lng()
       + ((kesisimNoktalari[pIndex].lng() - kesisimNoktalari[pIndex + 1]
         .lng()) / 2);
    } else {
     y = kesisimNoktalari[pIndex].lng()
       + ((kesisimNoktalari[pIndex + 1].lng() - kesisimNoktalari[pIndex]
         .lng()) / 2);
    }
    if (kesisimNoktalari[pIndex].lat() > kesisimNoktalari[pIndex + 1]
      .lat()) {
     x = kesisimNoktalari[pIndex + 1].lat()
       + ((kesisimNoktalari[pIndex].lat() - kesisimNoktalari[pIndex + 1]
         .lat()) / 2);
    } else {
     x = kesisimNoktalari[pIndex].lat()
       + ((kesisimNoktalari[pIndex + 1].lat() - kesisimNoktalari[pIndex]
         .lat()) / 2);
    }
    center = new google.maps.LatLng(x, y);
   }
  }
  return center;
 }
```
