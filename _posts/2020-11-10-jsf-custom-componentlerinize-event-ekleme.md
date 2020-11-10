---
layout: post
title: "JSF Custom componentlerinize event ekleme"
categories: JSF
---
Eski yazılarımda custom control  örnekleri vermiştim control hazırladık fakat custom bir event tanımlamak istiyoruz bunun için öncelik hazırladığımız kontrol içerisinde event propertisini string tipinde tanımlayınız.

```java
private String onRowClick = null;
```
sonra get set metodlarını aşağıdaki gibi tanımlayalım
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
ActionEvent Classımızı tanımlayalım
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
render içerisinde submit ile değeri gönderecek olan input nesnesini encodeEnd ile oluşturalım datatable üzerinde yaptığım için en altta hidden field oluşturdum. (Daha önceki yaptığım  tree nesnesinde incelerseniz chekbox ile datayı post ediyordum)
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
şimdi sıra tetiklemeye geldi. bunun için örnek kod vermeyeceğim sadece componentinizin bulunduğu formu ClientId nize sahip bir obje ile post ederseniz metodunuz tetiklenecektir.


şimdi bu event i tetikleme olayına gelelim. bunun için override edilen decode metodunu aşağıdaki gibi kullanıyoruz.
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
artık datatable componentimizde "onrowclick" property si ile istediğimiz metodu tetikleyebiliriz. parametre olarak o satırdaki değeri bize dönecektir.

onrowclick için tetiklenecek metod aşağıdaki gibi olmalıdır.
```java
public void rowClick(CustomClickActionEvent actionEvent){
  
 }
```