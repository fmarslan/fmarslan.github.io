---
layout: post
title: "Adding Comments to XML Content When Serializing Csharp XML"
date: 2018-07-27
description: "A brief technical note outlining the basic approach and applicable steps for Adding Comments to XML Content When Serializing Csharp XML."
categories: Csharp
lang: en-US
translation_key: "csharp-xml-serialize-ederken-xml-icerigine-yorum-ekleme-b8caf72e"
permalink: /en/2018/07/27/adding-comments-to-xml-content-when-serializing-csharp-xml.html
---

Those who want to put a timer on your page for time out can edit the code below. 


XmlComment Attribute is created

```csharp
[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class XmlCommentAttribute : Attribute
    {
        public XmlCommentAttribute(string value)
        {
            this.Value = value;
        }

        public string Value { get; set; }
    }
```



The IXmlSerializable interface must be implemented on the object you will serialize.


```csharp
public class DataSyncSettings : IXmlSerializable        {

       .
       .
       .
```

Fill in the content of the WriteXml Method as follows


```csharp
public void WriteXml(XmlWriter writer)
        {
            var properties = GetType().GetProperties();

            foreach (var propertyInfo in properties)
            {
                if (propertyInfo.IsDefined(typeof(XmlCommentAttribute), false))
                {
                    writer.WriteComment(
                        propertyInfo.GetCustomAttributes(typeof(XmlCommentAttribute), false)
                            .Cast<XmlCommentAttribute>().Single().Value);
                }

                writer.WriteElementString(propertyInfo.Name, propertyInfo.GetValue(this, null).ToString());
            }
        }
```

You can add the feature you want to comment on using the attribute as follows:

```csharp
[XmlCommentAttribute("The application version, NOT the file version!")] public String Format { get; set; }
```


The result will be as follows.


```xml
  <!--The application version, NOT the file version!-->
  <Format>Please set format property</Format>
```
