---
layout: post
title: "JSF treeview component hazırlama"
categories: JSF
---
Birgün gelirde sizinde benim gibi treeview ihtiyacınız olursa işte kodlar takıldığınız yerde ayrıca yardımcı olmaya çalışırım :)

Bağımlılıklar : jQuery & Font Awesome

Kullanımı(dtoList öğeleri INode interface den türetilmesi lazım)
```xhtml
<me:treeView id="testTree" value="#{TreeSampleAction.selectedDtoList}">

<f:selectItems value="#{TreeSampleAction.dtoList}" />

</me:treeView>
```

Öncelikle Control Class
```java

package tr.com.mypackage.component.tree;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.UIComponent;
import javax.faces.component.UIInput;
import javax.faces.component.UISelectItems;
import javax.faces.context.FacesContext;
import javax.faces.convert.ConverterException;

import org.apache.axis.encoding.Base64;

import tr.com.mypackage.component.tree.INode;

public class MeTreeView extends UIInput implements javax.faces.component.EditableValueHolder {

public static final String TREEVIEW_PREFIX = "inputFile";
private static final String OPTIMIZED_PACKAGE = "tr.com.mypackage.component.";

public String getComponentType() {
return "tr.com.mypackage.faces.tree";
}

public String getRendererType() {
return "tr.com.mypackage.faces.tree";
}

public String getFamily() {
return "tr.com.mypackage.faces.tree";
}

private String styleClass;
private String style;
private Boolean multipleSelect = false;
private java.lang.String onchange;

private List<INode> parentNode;

public String getStyleClass() {
return styleClass + " treeview";
}

public void setStyleClass(String styleClass) {
this.styleClass = styleClass;
}

public String getStyle() {
return style;
}

public void setStyle(String style) {
this.style = style;
}

public Boolean getMultipleSelect() {
return multipleSelect;
}

public void setMultipleSelect(Boolean multipleSelect) {
this.multipleSelect = multipleSelect;
}


public java.lang.String getOnchange() {
if (null != this.onchange) {
return this.onchange;
}
ValueExpression _ve = getValueExpression("onchange");
if (_ve != null) {
return (java.lang.String) _ve.getValue(getFacesContext().getELContext());
} else {
return null;
}
}

public void setOnchange(java.lang.String onchange) {
this.onchange = onchange;
handleAttribute("onchange", onchange);
}

public List<INode> getParentNode() {
return parentNode;
}

public void setParentNode(List<INode> parentNode) {
this.parentNode = parentNode;
}

@SuppressWarnings("unchecked")
public List<MeTreeNode> getNode() throws Exception {
List<MeTreeNode> resultNode = new ArrayList<MeTreeNode>();
Iterator<UIComponent> children = this.getChildren().iterator();
while (children.hasNext()) {
UIComponent child = (UIComponent) children.next();
if (child instanceof UISelectItems) {
Object childValue = ((UISelectItems) child).getValue();
if (childValue instanceof Collection) {
List<INode> nodeList = (List<INode>)childValue;
for (INode node : nodeList) {
if (node.getParent() == null) {
resultNode.add(getChildrenNode(nodeList, node));
}
}
} else {
throw new Exception(
"Tree SelectItems degeri Collection Türünden Olmalı");
}
} else {
throw new Exception("Tree SelectItem objesi kullanılmalıdır");
}
}
return resultNode;
}

public Object saveState(FacesContext context) {
Object values[] = new Object[2];
values[0] = super.saveState(context);
values[1] = parentNode;
values[2] = styleClass;
values[3] = style;
return ((Object) (values));
}

@SuppressWarnings("unchecked")
public void restoreState(FacesContext context, Object state) {
Object values[] = (Object[]) state;
super.restoreState(context, values[0]);
parentNode = (List<INode>) values[1];
styleClass = (String) values[2];
style = (String) values[3];
}

public void validate(FacesContext context) {

List<INode> nodeList = new ArrayList<INode>();
if (context == null) {
throw new NullPointerException();
}
Map<String, String> req = context.getExternalContext().getRequestParameterMap();
for(String check:req.keySet()){
if(check.startsWith(this.getClientId(context)+":"))
nodeList.add((INode)getAsObject(req.get(check)));
}
setValue(nodeList);
}

private MeTreeNode getChildrenNode(List<INode> nodeList, INode node) {
MeTreeNode treeNode = new MeTreeNode(node);
for (INode item : nodeList) {
if (item.getParent() != null && item.getParent().getValue().equals(node.getValue())) {
if (treeNode.getChildren() == null) {
treeNode.setChildren(new ArrayList<MeTreeNode>());
}
MeTreeNode childNode = getChildrenNode(nodeList, item);
treeNode.getChildren().add(childNode);
}
}
return treeNode;
}

private Object getAsObject(String value) {
Object obj = null;

try {
String serializedObj = value;

byte[] byteObj = Base64.decode(serializedObj);
ObjectInputStream ois = new ObjectInputStream(
new ByteArrayInputStream(byteObj));
obj = ois.readObject();
ois.close();
} catch (Exception e) {
throw new ConverterException(
"Transient object cannot be read from stream");
}

return obj;
}

@SuppressWarnings("unchecked")
private void handleAttribute(String name, Object value) {
List<String> setAttributes = null;
String cname = this.getClass().getName();
if (cname != null && cname.startsWith(OPTIMIZED_PACKAGE)) {
setAttributes = (List<String>) this.getAttributes().get("javax.faces.component.UIComponentBase.attributesThatAreSet");
if (setAttributes == null) {
setAttributes = new ArrayList<String>(6);
this.getAttributes().put("javax.faces.component.UIComponentBase.attributesThatAreSet", setAttributes);
}
if (value == null) {
setAttributes.remove(name);
} else if (!setAttributes.contains(name)) {
setAttributes.add(name);
}
}
}

}

```
Sonra Render Class

```java

package tr.com.mypackage.component.tree;

import java.io.IOException;

import java.util.Collection;

import java.util.Iterator;

import java.util.List;


import javax.faces.component.UIComponent;

import javax.faces.context.FacesContext;

import javax.faces.context.ResponseWriter;

import javax.faces.render.Renderer;


import tr.com.mypackage.component.tree.INode;


public class MeTreeRender extends Renderer {




@SuppressWarnings("rawtypes")

private void writerTreeChild(ResponseWriter writer, MeTreeView treeView,

MeTreeNode node, String name) throws IOException {

String clickScript = "var itemContainer = this.parentElement; if(itemContainer.parentElement.classList.contains('single')==false && itemContainer.parentElement.classList.contains('close')) {itemContainer.parentElement.classList.remove('close');itemContainer.parentElement.classList.add('open'); }else{itemContainer.parentElement.classList.remove('open');itemContainer.parentElement.classList.add('close');}";

writer.startElement("li", treeView);

writer.startElement("div", treeView);

writer.writeAttribute("class", "tree-item", null);

writer.startElement("i", treeView);

writer.writeAttribute("class", "tree-icon", null);

writer.writeAttribute("onclick", "javascript:" + clickScript, null);

writer.endElement("i");

String checkType = "radio";

if (treeView.getMultipleSelect() == true) {

checkType = "checkbox";

}

writer.startElement("input", treeView);

writer.writeAttribute("type", checkType, null);

writer.writeAttribute("onchange", "javascript:treeChangeState(this);", null);

// writer.writeAttribute("style", "display:none", null);

writer.writeAttribute("name", name + ":" + node.getValue(), null);

writer.writeAttribute("value", node.getAsString(), null);

if (treeView.getValue() != null) {

if (treeView.getValue() instanceof INode) {

if (((INode) treeView.getValue()).getValue().equals(

node.getValue())) {

writer.writeAttribute("checked", true, null);

}

}

if (treeView.getValue() instanceof Collection) {

Iterator valueList = ((Collection) treeView.getValue())

.iterator();

while (valueList.hasNext()) {

INode nodeValue = ((INode) valueList.next());

if (nodeValue.getValue().equals(node.getValue())) {

writer.writeAttribute("checked", true, null);

break;

}

}

}

}

writer.endElement("input");

writer.writeAttribute("class", "tree-item", null);

writer.startElement("label", treeView);

writer.writeAttribute("id", name + ":" + node.getValue(), null);

writer.writeAttribute("onclick", "javascript:" + clickScript, null);

writer.write(node.getLabel());

writer.endElement("label");

writer.endElement("div");

if (node.getChildren() != null && node.getChildren().size() > 0) {

writer.writeAttribute("class", " close", null);

writer.startElement("ul", treeView);

for (MeTreeNode item : node.getChildren()) {

writerTreeChild(writer, treeView, item, name);

}

writer.endElement("ul");

} else {

writer.writeAttribute("class", " single", null);

}

writer.endElement("li");

}




public void encodeBegin(FacesContext context, UIComponent component)

throws IOException {

String id = component.getClientId(context);

MeTreeView treeView = (MeTreeView) component;

/*

* UIComponent hidden = createHiddenField(id);

* c.getParent().getChildren().add(hidden);

*/

ResponseWriter writer = context.getResponseWriter();




writer.startElement("div", treeView);

writer.writeAttribute("id", id + "Container", null);

writer.writeAttribute("class", treeView.getStyleClass(), null);

writer.writeAttribute("style", treeView.getStyle(), null);

writer.startElement("ul", treeView);

List<MeTreeNode> nodeList = null;

try {

nodeList = treeView.getNode();

} catch (Exception e) {

// TODO Auto-generated catch block

e.printStackTrace();

}

for (MeTreeNode node : nodeList) {

if (node != null) {

writerTreeChild(writer, treeView, node, id);

}

}

writer.endElement("ul");

writer.endElement("div");

}




public void decode(FacesContext facesContext, UIComponent uiComponent) {

super.decode(facesContext, uiComponent);

}




}


```

INode Interface class
```java


package tr.com.mypackage.component.tree;
import java.io.Serializable;
public interface INode extends Serializable {


public INode getParent();


public Object getValue();


public String getLabel();


}


```

Javascript

```javascript

var treeChangeState = function(e) {

var checked = jQuery(e).prop("checked"),

container = jQuery(e).parent().parent(),

siblings = container.siblings();



container.find('input[type="checkbox"]').prop({

indeterminate: false,

checked: checked

});



function checkSiblings(el) {

var parent = el.parent().parent(),

all = true;



el.siblings().each(function() {

return all = (jQuery(this).children('.tree-item').children('input[type="checkbox"]').prop("checked") === checked);

});



if (all && checked) {

parent.children('.tree-item').children('input[type="checkbox"]').prop({

indeterminate: false,

checked: checked

});

checkSiblings(parent);

} else if (all && !checked) {

parent.children('.tree-item').children('input[type="checkbox"]').prop("checked", checked);

parent.children('.tree-item').children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));

checkSiblings(parent);

} else {

el.parents("li").children('.tree-item').children('input[type="checkbox"]').prop({

indeterminate: true,

checked: false

});

}

}



checkSiblings(container);

}

```
ve Son Olarak Css dosyası

```css

.treeview {

width: 100%;

overflow: hidden;

overflow-y: auto;

max-height: 20em;

border: 1px solid #ccc;

}




.treeview .close, .treeview .open {

font-size: inherit;

opacity: 1;

font-weight: 700;

line-height: 1;

text-shadow: none;

float: none;

}




.treeview ul {

list-style: none;

list-style-type: none;

padding: 0px;

margin: 0px;

display: block;

}




.treeview ul ul {

margin: 2em 0em 0em 1.2em;

}

.treeview li.close>ul{

display:none;

}

.treeview ul li {

display: table;

width: 100%;

margin: .5em 0em 0em 0em;

position: relative;

padding: 0px 0px 0px 1em;

}




.treeview input {

display: block;

float: left;

margin: .3em;

}




.treeview i {

float: left;

display: inline-block;

font-family: FontAwesome;

font-style: normal;

font-weight: normal;

line-height: 1;

-webkit-font-smoothing: antialiased;

-moz-osx-font-smoothing: grayscale;

color: #959595;

font-size: 1.26em;

margin: .23em .1em .1em 1px;

}




.treeview li.close>.tree-item>i:before {

content: "\f196";

}




.treeview li.open>.tree-item>i:before {

content: "\f147";

}




.treeview li.single>.tree-item>i:before {

content: "\f0c8";

cursor: default;

}

.treeview .tree-item {

border: 1px solid transparent;

cursor: pointer;

padding: 0px;

float: left;

z-index:10;

}

.treeview .tree-item label{

cursor: pointer;

font-weight: normal;

margin: .3em 0em;

}

.treeview .tree-item:hover label{

color: #0B6ED1;

}
```
