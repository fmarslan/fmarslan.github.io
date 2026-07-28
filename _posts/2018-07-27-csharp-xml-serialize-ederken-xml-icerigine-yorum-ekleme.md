---
layout: post
title: "Csharp XML Serialize Ederken XML İçeriğine Yorum Ekleme"
categories: Csharp
lang: tr-TR
description: "Csharp XML Serialize Ederken XML İçeriğine Yorum Ekleme konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "csharp-xml-serialize-ederken-xml-icerigine-yorum-ekleme-b8caf72e"
---

Sayfanıza time out için zaman sayacı koymak isteyenler aşağıdaki kodu düzenleyebilirler 


XmlComment Attribute oluşturulur

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



Serialize edeceğiniz nesneye IXmlSerializable interface'i implement edilmeli


```csharp
public class DataSyncSettings : IXmlSerializable        {

       .
       .
       .
```

WriteXml Metodunun içeriğini aşağıdaki gibi doldurun


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

Yorum ekleyeceğiniz özelliği aşağıdaki gibi attribute kullanarak ekleyebilirsiniz

```csharp
[XmlCommentAttribute("The application version, NOT the file version!")] public String Format { get; set; }
```


Sonuç aşağıdaki gibi olacaktır.


```xml
  <!--The application version, NOT the file version!-->
  <Format>Please set format property</Format>
```
