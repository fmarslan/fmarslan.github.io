---
layout: post
title: "Using JSF 1.2 Datatable and Paginator"
date: 2014-10-30
description: "A short technical note outlining the basic approach and applicable steps in using JSF 1.2 Datatable and Paginator."
categories: JSF
lang: en-US
translation_key: "jsf-12-datatable-ve-paginator-kullanimi-d7f5f197"
permalink: /en/2014/10/30/using-jsf-1-2-datatable-and-paginator.html
---

The following example for using datatable with the pagination feature in JSF 1.2 may be useful to you.

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

QueryAction.java

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
When used in this way, it displays the data in the active InquiryList in the InquiryAction by paginating it to the user. This process does not perform paging on the database. At the same time, you can make some changes to "PaginationAction.java" to perform paging on the database or search for the PagedList feature in Java. In this way, you can develop the activeQueryList list to perform database pagination.
