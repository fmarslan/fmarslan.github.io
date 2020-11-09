---
layout: post
title: "Java Servlet dosya yükleme (POST Method)"
categories: Java
---

```Java

package tr.com.app.servlet;

import java.io.File;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
                    fileName = request.getSession().getId()
                            + Calendar.getInstance().getTimeInMillis();
                    byte[] fileNameBytes = fileName.getBytes("UTF-8");
                    MessageDigest md = MessageDigest.getInstance("MD5");
                    byte[] hashMD5 = md.digest(fileNameBytes);
                    md.update(fileNameBytes, 0, fileNameBytes.length);
                    BigInteger md5Int = new BigInteger(1, md.digest());
                    fileName = md5Int.toString(32);
                    fileName = fileName + "-" + request.getParameter("name");
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
