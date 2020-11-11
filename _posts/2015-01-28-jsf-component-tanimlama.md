---
layout: post
title: "JSF component tanımlama"
categories: JSF
---
Mevcut bir komponentin kullanımı için nyapılması gereken tanımlamalar

Web xml içerisine aşağıdaki şekilde tanımlamalar yapılmalıdır
```xml
<context-param>

<faces-config>

<render-kit>

<renderer>

<component-family>tr.com.mypackages.faces.tree</component-family>

<renderer-type>tr.com.mypackages.faces.tree</renderer-type>

<renderer-class>tr.com.mypackages.component.tree.MeTreeRender</renderer-class>

</renderer>

</render-kit>

<component>

<component-type>MeTreeView</component-type>

<component-class>tr.com.mypackages.component.tree.MeTreeView</component-class>

</component>

</faces-config>

<facelet-taglib>

<tag>

<tag-name>treeView</tag-name>

<component>

<component-type>MeTreeView</component-type>

</component>

</tag>

</facelet-taglib>

</context-param>
```
