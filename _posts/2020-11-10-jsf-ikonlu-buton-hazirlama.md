---
layout: post
title: "JSF İkonlu Buton Hazırlama"
categories: JSF
---
Jsf framework kullanırken kullandığınız submit butonlar için ikon kullanmak istiyorsanız aşağıdaki gibi kendinize özgü bir button hazırlayabilirsiniz (budefa kodu fazla temizleyemedim anlaşılmayan yer olursa sorabilirsiniz) ikonlar fontawesome kütüphaesinden alınmaktadır

bağımlılıklar
fontawesome



render classı
```java

package tr.com.mypackage.base.component.command;


import java.io.IOException;
import java.util.Map;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.event.ActionEvent;
import tr.com.mypackage.base.component.helper.CssDefault;

public class MeCommandButtonRender extends javax.faces.render.Renderer {

@Override

public void encodeBegin(FacesContext context, UIComponent component)
throws IOException {

super.encodeBegin(context, component);
MeCommandButton commandButton = ((MeCommandButton) component);
String id = commandButton.getClientId(context);
ResponseWriter writer = context.getResponseWriter();
if (commandButton.getButtonType() != null) {
writer.startElement("div", commandButton);

writer.writeAttribute("class",

CssDefault.BUTTON_FOR_ICON_CONTAINER, null);

writer.startElement("i", commandButton);

String styleClass = "";

if (commandButton.getValue() == null

|| ((String) commandButton.getValue()).trim().equals(""))

styleClass = " " + CssDefault.BUTTON_FOR_ICON_ONLY;

styleClass = styleClass + " " + CssDefault.BUTTON_FOR_ICON

+ commandButton.getButtonType();

writer.writeAttribute("class", styleClass, null);

writer.endElement("i");

}

writer.startElement("input", commandButton);

writer.writeAttribute("class",

CssDefault.BUTTON

+ " "

+ (commandButton.getStyleClass() == null ? ""

: commandButton.getStyleClass()), null);

writer.writeAttribute("name", id, null);

writer.writeAttribute("id", id, null);

writer.writeAttribute("style", commandButton.getStyle() == null ? ""

: commandButton.getStyle(), null);

if (commandButton.isDisabled() == true)

writer.writeAttribute("disabled", "true", null);

writer.writeAttribute("type", "submit", null);

writer.writeAttribute("value", (commandButton.getValue() == null ? ""

: commandButton.getValue()), null);

writer.endElement("input");

if (commandButton.getButtonType() != null) {

writer.endElement("div");

}

}

```
```java

@Override

public void decode(FacesContext context, UIComponent component) {

//super.decode(context, component);

if (!didThisButtonInvokeSubmit(context, component)) {

return;

}

component.queueEvent(new ActionEvent(component));

}

private boolean didThisButtonInvokeSubmit(

FacesContext facesContext, UIComponent uiComponent) {

//find if the form submitted by a textField, workaround to deal with the default behaviour of the browser

//(e.g.) if a form has a button on it, and enter key pressed on a text field, form submitted by the first intance of button

Map<String,String> requestParameterMap = facesContext.getExternalContext().getRequestParameterMap();

String componentClientId = uiComponent.getClientId(facesContext);

return requestParameterMap.containsKey(componentClientId);

}

}


```
button classı
```java
package tr.com.mypackage.base.component.command;

public class MeCommandButton extends
javax.faces.component.html.HtmlCommandButton {

public static final String TREEVIEW_PREFIX = "button";
private static final String OPTIMIZED_PACKAGE = "tr.com.mypackage.base.component.";
public static final String COMPONENT_TYPE = "tr.com.mypackage.faces.commandButton";


@Override
public String getFamily() {
return "tr.com.mypackage.faces.commandButton";
}

private String buttonType = null;
private Object params = null;
private Boolean partialSubmit = false;
public String getButtonType() {
return buttonType;
}
public void setButtonType(String buttonType) {
this.buttonType = buttonType;
}
public Object getParams() {
return params;
}
public void setParams(Object params) {
this.params = params;
}
public Boolean getPartialSubmit() {
return partialSubmit;
}
public void setPartialSubmit(Boolean partialSubmit) {
this.partialSubmit = partialSubmit;
}
public MeCommandButton() {
super();
this.setRendererType("tr.com.mypackage.faces.commandButton");
}
}
```
style
```css

.btn[value=""] {
padding: 0px;
background: none;
border: none;
}

.btn-icon-group>.btn {
text-align: right;
padding-left: 20px;
margin: 0px;
}

.btn-icon-group {
position: relative;
display: inline-block;
}

.btn-icon {
position: absolute;
top: 7px;
left: 9px;
display: inline-block;
font-family: FontAwesome;
font-style: normal;
font-weight: normal;
line-height: 1;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
color: #fff;
z-index: 5;
font-size: 1em;
pointer-events: none;
}
.icon-only {
color: #2d2d2d;
}

.input-append>.btn-icon-group>.btn-icon.icon-only {
top: 5px;
left: 5px;
}

.icon-add:before {
content: "\f067";
}

.icon-delete:before {
content: "\f014";
}

.icon-find:before {
content: "\f002";
}

.icon-edit:before {
content: "\f044";
}

.icon-save:before {
content: "\f0c7";
}

.icon-close:before {
content: "\f057";
}

.icon-open:before {
content: "\f115";
}

.btn-login {
color: #fff;
background: none;
background-color: #f0ad4e;
border-color: #eea236;
padding: 0px;
margin: 1px;
background-color: #f0ad4e;
}
```