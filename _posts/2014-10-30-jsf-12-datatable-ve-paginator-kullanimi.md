---
layout: post
title: "JSF 1.2 Datatable ve Paginator kullanımı"
categories: JSF
---

JSF 1.2 de sayfalama özelliğiyle birlikte datatable kullanımı için aşağıdaki örnek işinize yarayabilir.

XHTML

```html
<h:dataTable id="tablo" rows="#10" value="#{SorgulamaAction.aktifSorgulamaList}" binding="#{PaginationAction.paginationDmdDataTable}" var="list">
    <h:column>
        <f:facet name="header">
            <h:outputText value="Kimlik No" />
        </f:facet>
        <h:outputText value="#{list.KimlikNo}" />
    </h:column>
</h:dataTable>
<ui:repeat value="#{PaginationAction.pages}" var="page" >
    <td>
        <h:commandLink value="#{page}" actionListener="#{PaginationAction.page}" rendered="#{page != PaginationAction.currentPage}" />
        <h:outputText value="#{page}" escape="false" rendered="#{page == PaginationAction.currentPage}" />
    </td>
</ui:repeat>

```

PaginationAction.java

```java
package tr.com.app.page.action;

import java.io.Serializable;

import javax.faces.component.UICommand;
import javax.faces.component.html.HtmlDataTable;
import javax.faces.event.ActionEvent;

public class PaginationAction implements Serializable{
    private static final long serialVersionUID = 1L;
    private transient HtmlDataTable  paginationDmdDataTable;
    private int totalRows;
    private int firstRow;
    private int rowsPerPage = 2;
    private int totalPages;
    private int pageRange = 10;
    private Integer[] pages ;
    private int currentPage;
    public void loadData(){
        totalRows = paginationDmdDataTable.getRowCount();
        currentPage = (totalRows / rowsPerPage) - ((totalRows - firstRow) / rowsPerPage) + 1;
        totalPages = (totalRows / rowsPerPage) + ((totalRows % rowsPerPage != 0) ? 1 : 0);
        int pagesLength = Math.min(pageRange, totalPages); 
        pages = new Integer[pagesLength];
        int firstPage = Math.min(Math.max(0, currentPage - (pageRange / 2)), totalPages - pagesLength);
        // Create pages (page numbers for page links).
        for (int i = 0; i < pagesLength; i++) {
            pages[i] = ++firstPage;
        }
    }

    public void page(ActionEvent event) {
     System.out.println((Integer) ((UICommand) event.getComponent()).getValue());
        page(((Integer) ((UICommand) event.getComponent()).getValue() - 1) * rowsPerPage);
    }

    private void page(int firstRow) {
     this.firstRow = firstRow;
     loadData();
    }
    public Integer[] getPages() {
       loadData();
       return pages;
    }

 public HtmlDataTable getPaginationDmdDataTable() {
  return paginationDmdDataTable;
 }

 public void setPaginationDmdDataTable(HtmlDataTable paginationDmdDataTable) {
  this.paginationDmdDataTable = paginationDmdDataTable;
 }

 public int getTotalRows() {
  return totalRows;
 }

 public void setTotalRows(int totalRows) {
  this.totalRows = totalRows;
 }

 public int getFirstRow() {
  return firstRow;
 }

 public void setFirstRow(int firstRow) {
  this.firstRow = firstRow;
 }

 public int getRowsPerPage() {
  return rowsPerPage;
 }

 public void setRowsPerPage(int rowsPerPage) {
  this.rowsPerPage = rowsPerPage;
 }

 public int getTotalPages() {
  return totalPages;
 }

 public void setTotalPages(int totalPages) {
  this.totalPages = totalPages;
 }

 public int getPageRange() {
  return pageRange;
 }

 public void setPageRange(int pageRange) {
  this.pageRange = pageRange;
 }

 public int getCurrentPage() {
  return currentPage;
 }

 public void setCurrentPage(int currentPage) {
  this.currentPage = currentPage;
 }

 public void setPages(Integer[] pages) {
  this.pages = pages;
 }
}

```

SorgulamaAction.java

```java
private List<Model> aktifSorgulamaList
public List<Model> getAktifSorgulamaList() {
  return aktifSorgulamaList;
 }
public void setAktifSorgulamaList(
   List<Model> aktifSorgulamaList) {
  this.aktifSorgulamaList = aktifSorgulamaList;

 }


```
Bu şekilde kullanıldığında SorgulamaAction içerisinde bulunan aktifSorgulamaList içerisindeki veriyi kullanıcıya sayfalayarak gösterir. Bu işlem veri tabanı üzerinde sayfalama işlemi yapmaz aynı zamanda veri tabanı üzerinde sayfalama işlemi yapmak için "PaginationAction.java" üzerinde bir takım oynamalar yapabilirsiniz veya Java da PagedList özelliğini araştırın. Bu şekilde aktifSorgulamaList listesini veritabanı sayfalaması yapacak şekilde geliştirebilirsiniz.
