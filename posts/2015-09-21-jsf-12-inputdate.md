---
layout: post
title: "JSF 1.2 InputDate"
categories: JSF
---
inputdate ve render classları aşağıdadır sayfanıza xdsoft datetimepicker(jQuery) kütüphanesini eklemeniz gerekmektedir.

 Input Date
```java
package tr.com.mypackage.base.component.date;

import javax.faces.component.html.HtmlInputText;
import javax.faces.el.ValueBinding;

import tr.com.mypackage.base.component.util.ComponentUtil;
import tr.com.mypackage.base.util.ConstInsCore;

public class MeInputDate extends HtmlInputText{

 public static final String TREEVIEW_PREFIX = "button";
 private static final String OPTIMIZED_PACKAGE = "tr.com.mypackage.base.component.";
 public static final String COMPONENT_TYPE = "tr.com.mypackage.faces.inputDate";
 private String inputType = "date";
 private String dateFormat = ConstInsCore.DATE_FORMAT;
 
 @Override
 public String getFamily() {
  return "tr.com.mypackage.faces.inputDate";
 }

 public String getInputType() {
  return inputType;
 }

 public void setInputType(String inputType) {
  this.inputType = inputType;
  if(inputType.equals("datetime")){
   dateFormat = ConstInsCore.DATE_TIME_FORMAT;
  }
 }
 
 
 public String getDateFormat() {
  return dateFormat;
 }

 public void setDateFormat(String dateFormat) {
  this.dateFormat = dateFormat;
 }

 public MeInputDate(){
  this.setRendererType("tr.com.mypackage.faces.inputDate");
 }
}

```
InputDateRender
```java
package tr.com.mypackage.base.component.date;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.event.ActionEvent;
import javax.faces.event.ValueChangeEvent;
import javax.faces.event.ValueChangeListener;
import javax.faces.render.Renderer;

import sun.tools.tree.MethodExpression;
import tr.com.mypackage.base.component.helper.CssDefault;
import tr.com.mypackage.base.component.helper.ScriptDefault;
import tr.com.mypackage.base.util.ConstInsCore;
import tr.com.mypackage.business.core.common.DateUtils;

public class MeDateInputRender extends Renderer {

 @Override
 public void encodeBegin(FacesContext context, UIComponent component)
   throws IOException {
  super.encodeBegin(context, component);
  StringBuilder sbStyle = new StringBuilder();
  MeInputDate inputDate = (MeInputDate) component;
  String id = component.getClientId(context);
  ResponseWriter writer = context.getResponseWriter();
  writer.startElement("div", component);
  // writer.writeAttribute("class", CssDefault.INPUT_DATE, null);
  sbStyle.append(CssDefault.INPUT_DATE);
  sbStyle.append(" ");
  sbStyle.append(CssDefault.INPUT_GROUP);
  if (inputDate.getStyleClass() != null) {
   sbStyle.append(" ");
   sbStyle.append(inputDate.getStyleClass());
  }
  writer.writeAttribute("class", sbStyle.toString(), null);
  if (inputDate.getStyle() != null) {
   writer.writeAttribute("style", inputDate.getStyle(), null);
  }
  writer.startElement("input", component);
  sbStyle = new StringBuilder();
  sbStyle.append(CssDefault.FORM_CONTROL + " ");
  if (inputDate.isRequired()) {
   sbStyle.append(CssDefault.REQUIRED + " ");
   writer.writeAttribute("required", true, null);
  }
  if (inputDate.isDisabled()) {
   sbStyle.append(CssDefault.DISABLED);
   writer.writeAttribute("disabled", true, null);
  }

  writer.writeAttribute("class", sbStyle.toString(), null);
  //if (inputDate.getValueChangeListeners().length > 0) {
   writer.writeAttribute("onchange",
     ScriptDefault.FORM_PARTIAL_SUBMIT_SCRIPT, null);
  //}
   
  StringBuilder dateInputType = new StringBuilder();
  dateInputType.append("jQuery(document).ready(function(){ jQuery('#"
    + id.replace(":", "\\\\:")
    + "').datetimepicker({");
  
  if (inputDate.getInputType().equals("datetime")) {
   dateInputType.append("closeOnDateSelect:true,timepicker:true");
  }else{
   dateInputType.append("format:'d/m/Y',timepicker:false,closeOnDateSelect:true");
  }
  dateInputType.append("});");
  if (context.getExternalContext().getRequestParameterMap().containsKey(id)) {
   dateInputType.append("jQuery(document).ready(function(){ jQuery('#"
    + id.replace(":", "\\\\:")
    + "').datetimepicker('hide')");
  }
  dateInputType.append("});");
  // writer.writeAttribute("onfocus", "javascript:" + dateInputType,
  // null);
  writer.writeAttribute("id", id, null);
  writer.writeAttribute("name", id, null);
  String value = "";
  if (inputDate.getValue() != null) {
   try {
    Timestamp timestampValue = new Timestamp(
      ((Date) inputDate.getValue()).getTime());
    value = DateUtils.dateToString(timestampValue,
      inputDate.getDateFormat());
   } catch (Throwable e) {
    e.printStackTrace();
   }
  }
  writer.writeAttribute("value", value, null);
  writer.writeAttribute(
    "onkeypress",
    "var numberArray = [46,8];if((this.value.length==2 || this.value.length==5) && (numberArray.indexOf(event.keyCode)<0)) this.value = this.value + '/';",
    null);
  writer.writeAttribute(
    "onkeydown",
    "javascript: var numberArray = [46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,8,9,13,27,35,36,37,39]; if (numberArray.indexOf(event.keyCode)<0) event.preventDefault(); ",
    null);
  writer.endElement("input");
  writer.startElement("span", component);
  if (inputDate.isDisabled()) {
   writer.writeAttribute("class", CssDefault.INPUT_GROUP_BUTTON + " "
     + CssDefault.DISABLED, null);
   writer.writeAttribute("disabled", true, null);
  } else {
   writer.writeAttribute("class", CssDefault.INPUT_GROUP_BUTTON, null);
  }
  writer.writeAttribute("show", false, null);
  if (!inputDate.isDisabled())
   writer.writeAttribute(
     "onclick",
     "javascript:if(this.getAttribute('show')=='true') { jQuery('#"
       + id.replace(":", "\\\\:")
       + "').datetimepicker('hide'); this.setAttribute('show','false');} else { jQuery('#"
       + id.replace(":", "\\\\:")
       + "').datetimepicker('show'); this.setAttribute('show','true');}",
     null);
  writer.startElement("i", component);
  writer.writeAttribute("class", CssDefault.DATE_COMMAND_ICON, null);
  writer.endElement("i");
  writer.endElement("span");
  if (!inputDate.isDisabled()) {
   writer.startElement("script", component);
   writer.writeAttribute("type", "text/javascript", null);
   writer.write(dateInputType.toString());
   writer.endElement("script");
  }
  writer.endElement("div");
 }

 @Override
 public void decode(FacesContext context, UIComponent component) {

  MeInputDate inputDate = (MeInputDate) component;
  Map<String, String> requestParameterMap = context.getExternalContext()
    .getRequestParameterMap();
  String componentClientId = component.getClientId(context);
  String value = requestParameterMap.get(componentClientId);
  Object oldValue = inputDate.getValue();
  if (value != null && !value.trim().equals("")) {
   try {
    inputDate.setValue(DateUtils.formatter(value,
      inputDate.getDateFormat()));
   } catch (Throwable e) {
    e.printStackTrace();
   }
  } else {
   inputDate.setValue(null);
  }

  if (!requestParameterMap.containsKey(componentClientId)) {
   return;
  }
  for (ValueChangeListener method : inputDate.getValueChangeListeners()) {
   ValueChangeEvent event = new ValueChangeEvent(component, oldValue,
     inputDate.getValue());
   method.processValueChange(event);
  }
 }
}
```
