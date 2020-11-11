---
layout: post
title: "JSF 1.2 için Input File Upload Component"
categories: JSF
---

Malum kullanan varmıdır bilmiyorum ama JSF 1.2 de file upload yok bunu tolere edebilmek için ben yeniden bir inputFile componenti yazdım başkası ihtiyacı olan bir başkası uğraşmasın

HtmlInputFile.java 

```java 

package tr.com.app.base.component.inputfile;

import java.io.File;
import java.io.Serializable;

import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.FacesEvent;
import javax.faces.event.ValueChangeEvent;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class HtmlInputFile extends javax.faces.component.html.HtmlInputText
        implements Serializable {

    private static final long serialVersionUID = 1L;

    private static final Log log = LogFactory.getLog(HtmlInputFile.class);

    public static final String FILE_UPLOAD_PREFIX = "inputFile";
    private String label;
    
    public String getComponentType() {
        return "tr.com.app.faces.Upload";
    }

    public String getRendererType() {
        return "tr.com.app.faces.Upload";
    }

    public String getFamily() {
        return "tr.com.app.faces.File";
    }

    public void broadcast(FacesEvent event) throws AbortProcessingException {
        super.broadcast(event);
    }

    public Object saveState(FacesContext context) {
        Object values[] = new Object[2];
        values[0] = super.saveState(context);
        values[1] = label;
        return ((Object) (values));
    }

    public void restoreState(FacesContext context, Object state) {
        Object values[] = (Object[]) state;
        super.restoreState(context, values[0]);
        disabled = (Boolean) values[1];
        styleClass = (String) values[2];
        label = (String) values[3];
        disabled = (Boolean) values[4];
        file = (File) values[5];
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void validate(FacesContext context) {

        if (context == null) {
            throw new NullPointerException();
        }
        String filename = context.getRequestParameterMap()
                .get(this.getClientId(context)).trim();
        filename =  "c:\\\\temp\" + filename;
        File file = new File(filename.trim());
        setValue(file);

    }

}

```

HtmlInputFileRender.java 

```java 

package tr.com.app.base.component.inputfile;

import java.io.IOException;
import javax.faces.application.Application;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.Renderer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.icesoft.faces.component.ext.HtmlInputHidden;
import tr.com.app.base.component.ext.HtmlInputHidden;

public class HtmlInputFileRender extends Renderer {
    private static final Log log = LogFactory
            .getLog(HtmlInputFileRender.class);

    public void encodeBegin(FacesContext context, UIComponent component)
            throws IOException {
        String id = component.getClientId(context);
        HtmlInputFile c = (HtmlInputFile) component;
        ResponseWriter writer = context.getResponseWriter();
        writer.startElement("div", c);        writer.startElement("input", c);
        writer.writeAttribute("type", "hidden", null);
        writer.writeAttribute("id", id, null);
        writer.writeAttribute("name", id, null);
        writer.endElement("input");
        if (c.getShowImage()) {
            writer.startElement("img", c);
            writer.writeAttribute("style", "display:none;", null);
            writer.endElement("img");
        }
        writer.startElement("input", c);
        writer.writeAttribute("type", "button", null);
        writer.writeAttribute("onclick", "javascript:this.parentElement.getElementsBySelector(\"input[type='file']\")[0].click()", null);
        writer.writeAttribute("value", c.getLabel(), null);
        writer.endElement("input");
        writer.startElement("input", c);
        writer.writeAttribute("type", "file", null);
        writer.writeAttribute("style", "display:none;", null);
        writer.writeAttribute("onchange", "javascript:appUpload(this);", null);
        writer.endElement("input");
        writer.endElement("div");

    }
}

```

UploadServlet.java

```java

package tr.com.app.servlet;

import java.io.File;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class UploadServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private String filePath;
    private int maxFileSize = 1024 * 1024 * 10;
    private int maxMemSize = 1024 * 1024 * 10;
    private File file;

    public void init() {
            filePath = "C:\\\\temp";
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, java.io.IOException {
        response.setContentType("text/html");
        java.io.PrintWriter out = response.getWriter();
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setSizeThreshold(maxMemSize);
        factory.setRepository(new File(filePath));
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setSizeMax(maxFileSize);

        try {
            List fileItems = upload.parseRequest(request);
            Iterator i = fileItems.iterator();
            while (i.hasNext()) {
               FileItem fi = (FileItem) i.next();
                if (!fi.isFormField()) {
                    String fileName = fi.getName();
                    fileName = fi.getName() + request.getSession().getId()
                            + Calendar.getInstance().getTimeInMillis();
                    byte[] fileNameBytes = fileName.getBytes("UTF-8");
                    MessageDigest md = MessageDigest.getInstance("MD5");
                    //byte[] hashMD5 = md.digest(fileNameBytes);
                    md.update(fileNameBytes, 0, fileNameBytes.length);
                    BigInteger md5Int = new BigInteger(1, md.digest());
                    fileName = md5Int.toString(32);
                    fileName = fileName + "." +                 FilenameUtils.getExtension(fi.getName());
                    file = new File(filePath + "\\" + fileName);
                    fi.write(file);
                    out.println(fileName);
                }
            }
        } catch (Exception ex) {
            if (ConstInsCore.DEBUG_ENABLED)
                System.out.println(ex);
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, java.io.IOException {
        response.getWriter().write("Upload Servlet");

    }

}

```

fileUpload.js 

```javascript 

var appUpload = function(item) {
    var data = new FormData();
    data.append('uploadFile', item.files[0]);
    var btn = jQuery(item).parent().find("input[type='button']");
    btn.val("Yükleniyor...");
    btn.attr("disabled", true);
    btn.addClass("disabled");
    jQuery.ajax({
        type : 'post',
        url : '/upload?name=' + item.files[0].name,
        data : data,
        cache : false,
        contentType : false,
        processData : false,
        success : function(f) {
            var hidden = jQuery(item).parent().find("input[type='hidden']");
            if (hidden) {
                hidden.val(f);
            }
        },
        xhrFields : {
            onprogress : function(progress) {
                var percentage = Math
                        .floor((progress.total / progress.totalSize) * 100);
                console.log('progress', percentage);
                if (percentage === 100) {
                    console.log('DONE!');
                }
            }
        },
        complete : function() {
            btn.val("Yükleme Tamamlandı");
            btn.removeClass("disabled");
            btn.attr("disabled", false);
        },
        error : function() {
            btn.attr("disabled", false);
            btn.removeClass("disabled");
            btn.val("Dosya Yüklenemedi");
        }
    });
};

```

Configuration

Web.xml

```xml

<render-kit>
     <renderer>
            <component-family>tr.com.app.faces.File</component-family>
            <renderer-type>tr.com.app.faces.Upload</renderer-type>
            <renderer-class>tr.com.app.base.component.inputfile.HtmlInputFileRender</renderer-class>
        </renderer>
 </render-kit>
<component>
        <component-type>InputFile</component-type>
        <component-class>tr.com.app.base.component.inputfile.HtmlInputFile</component-class>
    </component>
<tag>
        <tag-name>inputFile</tag-name>
        <component>
            <component-type>InputFile</component-type>
        </component>
    </tag>

```


xhtml dosya içerisinde tanımladığınız tag ile inputFile olarak kullanabilirsiniz
