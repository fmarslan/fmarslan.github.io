---
layout: post
title: "Adding events to your JSF Custom components"
date: 2015-02-04
description: "A brief technical note outlining the basic approach and applicable steps for adding events to your JSF Custom components."
categories: JSF
lang: en-US
translation_key: "jsf-custom-componentlerinize-event-ekleme-3c214cd9"
permalink: /en/2015/02/04/adding-events-to-your-jsf-custom-components.html
---

I gave custom control examples in my old articles, we prepared a control, but we want to define a custom event. For this, first define the event property as string type in the control we prepared.

```java
private String onRowClick = null;
```
Then let's define the get set methods as follows
```java
public String getOnRowClick() {
  //return this.onRowClick;
  if(this.onRowClick!=null){
   return this.onRowClick;
  }
        ValueExpression _ve = getValueExpression("onRowClick");
        if (_ve != null) {         
            return _ve.getExpressionString();
        } else {
            return null;
        }
 }

 public void setOnRowClick(String onRowClick) {
  this.onRowClick=onRowClick;
                List<String> setAttributes = null;
  String cname = this.getClass().getName();
  if (cname != null && cname.startsWith(OPTIMIZED_PACKAGE)) {
   setAttributes = (List<String>) this
     .getAttributes()
     .get("javax.faces.component.UIComponentBase.attributesThatAreSet");
   if (setAttributes == null) {
    setAttributes = new ArrayList<String>(6);
    this.getAttributes()
      .put("javax.faces.component.UIComponentBase.attributesThatAreSet",
        setAttributes);
   }
   if (onRowClick== null) {
    setAttributes.remove("onRowClick");
   } else if (!setAttributes.contains("onRowClick")) {
    setAttributes.add("onRowClick");
   }
  }

 }
```
Let's define our ActionEvent Class
```java
public class CustomClickActionEvent extends ActionEvent {

 private static final long serialVersionUID = 1L;
 private Object selectedRow;
 
 public GridRowClickActionEvent(UIComponent component) {
  super(component);
 }

 public Object getSelectedRow() {
  return selectedRow;
 }

 public void setSelectedRow(Object selectedRow) {
  this.selectedRow = selectedRow;
 }
  
}
```
Let's create the input object, which will send the value with submit in the render, with encodeEnd. Since I made it on the datatable, I created a hidden field at the bottom. (If you look at the tree object I made before, I was posting the data with checkbox)
```java
@Override
 public void encodeEnd(FacesContext facesContext, UIComponent uiComponent)
   throws IOException {
  super.encodeEnd(facesContext, uiComponent);
  SBHtmlDataTable dataTable = (SBHtmlDataTable) uiComponent;
  if (dataTable.getOnRowClick() != null
    && !dataTable.getOnRowClick().trim().equals("")) {
   String clientId = uiComponent.getClientId(facesContext);
   ResponseWriter writer = facesContext.getResponseWriter();
   writer.startElement("input", uiComponent);
   writer.writeAttribute("id", clientId + "_selectedRow", null);
   writer.writeAttribute("name", clientId, null);
   writer.writeAttribute("type", "hidden", null);
   writer.endElement("input");
  }
 }
```
Now it's time to trigger. I will not give sample code for this, just if you post the form containing your component with an object with your ClientId, your method will be triggered.


Now let's talk about triggering this event. For this, we use the overridden decode method as follows.
```java
@Override
 public void decode(FacesContext facesContext, UIComponent uiComponent) {
  // TODO Auto-generated method stub
  super.decode(facesContext, uiComponent);
  MeCustomComponent dataTable = (MeCustomComponent ) uiComponent;

  Map<String, String> requestParameterMap = facesContext
    .getExternalContext().getRequestParameterMap();
  String componentClientId = uiComponent.getClientId(facesContext);
  if (!requestParameterMap.containsKey(componentClientId))
   return;

  if (dataTable.getOnRowClick() == null
    || dataTable.getOnRowClick().trim().equals(""))
   return;

  String value = requestParameterMap.get(componentClientId);
  ExpressionFactory factory = FacesContext.getCurrentInstance()
    .getApplication().getExpressionFactory();

  MethodExpression methodsexpression = factory.createMethodExpression(
    FacesContext.getCurrentInstance().getELContext(),
    dataTable.getOnRowClick(), null,
    new Class[] { GridRowClickActionEvent.class });

  CustomClickActionEvent actionEvent = new CustomClickActionEvent (
    dataTable);
  actionEvent.setSelectedRow(value );
  ELContext elContext = facesContext.getELContext();
  methodsexpression.invoke(elContext, new Object[] { actionEvent });
 }
```
We can now trigger any method we want with the "onrowclick" property in our datatable component. The value in that line will be returned to us as a parameter.

The method to be triggered for onrowclick should be as follows.
```java
public void rowClick(CustomClickActionEvent actionEvent){
  
 }
```
