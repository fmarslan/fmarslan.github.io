---
layout: post
title: "Log4j Mail Özelliği"
categories: java
---
log4j ile yazılan logları mail olarak göndermek için yapılandırdınız fakat gönderdiğiniz mailleri size özel biçimlendirmek istiyorsunuz onun için yapmanız gerekenler

1. org.apache.log4j.net.SMTPAppender classını extend eden bir class hazırlayın
2. log4j içerisinde "log4j.appender.mail" özelliki için kendi hazırladığınız classı gösterin
3.  Aşağıdaki kodu bu classın içerisine ekleyerek istediğiniz gibi mesajınızı özelleştirebilirsiniz.
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