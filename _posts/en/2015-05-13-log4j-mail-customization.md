---
layout: post
title: "Log4j Mail Customization"
date: 2015-05-13
description: "A brief technical note outlining the basic approach and applicable steps on Log4j Mail Customization."
categories: java
lang: en-US
translation_key: "log4j-mail-ozellestirme-b37c20b9"
permalink: /en/2015/05/13/log4j-mail-customization.html
---

You have configured the logs written with log4j to send them as e-mail, but you want to format the e-mails you send specifically for you, so what you need to do

1. Prepare a class that extends the org.apache.log4j.net.SMTPAppender class
2. Show the class you prepared for the "log4j.appender.mail" feature in log4j
3. You can customize your message as you wish by adding the code below into this class.

```java

@Override
 protected void sendBuffer() {  
  try {
   MimeBodyPart part = new MimeBodyPart();
   StringBuffer sbuf = new StringBuffer();
   sbuf.append("Params : ");
   sbuf.append(activeSessionParams());
   sbuf.append("\n\r");
   sbuf.append("Active Url : ");
   sbuf.append(activeSessionURL());
   sbuf.append("\n\r");
   String t = layout.getHeader();
   if (t != null)
    sbuf.append(t);
   int len = cb.length();
   for (int i = 0; i < len; i++) {
    // sbuf.append(MimeUtility.encodeText(layout.format(cb.get())));
    LoggingEvent event = cb.get();

    // setting the subject
    if (i == 0) {
     Layout subjectLayout = new PatternLayout(getSubject());
     msg.setSubject(MimeUtility.encodeText(
       subjectLayout.format(event), "UTF-8", null));
    }

    sbuf.append(layout.format(event));
    if (layout.ignoresThrowable()) {
     String[] s = event.getThrowableStrRep();
     if (s != null) {
      for (int j = 0; j < s.length; j++) {
       sbuf.append(s[j]);
       sbuf.append(Layout.LINE_SEP);
      }
     }
    }
   }
   t = layout.getFooter();
   if (t != null)
    sbuf.append(t);
   part.setContent(sbuf.toString(), layout.getContentType());

   Multipart mp = new MimeMultipart();
   mp.addBodyPart(part);
   msg.setContent(mp);
   msg.setSentDate(new Date());
   Transport.send(msg);
   
  } catch (Exception e) {
   LogLog.error("Error occured while sending e-mail notification.", e);
  }
 }
 
```
