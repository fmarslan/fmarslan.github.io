---
layout: post
title: "JSF component definition"
date: 2015-01-28
description: "A brief technical note outlining the basic approach and applicable steps for defining JSF components."
categories: JSF
lang: en-US
translation_key: "jsf-component-tanimlama-bc7d5771"
permalink: /en/2015/01/28/jsf-component-definition.html
---

Definitions to be made for the use of an existing component

The following definitions should be made in web xml:
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
