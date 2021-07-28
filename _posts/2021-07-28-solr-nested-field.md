---
layout: post
title: "Solr Nested Field"
categories: Solr
---

Solrda nested field gibi güzel bir yetenek mevcut bu yetenekten faydalanmak için nasıl bir yapılandırma yapmamız gerekiyor kısaca değinecek olursak (bu anlatımlar 8.7 version için)

1. adım scheme.xml içeriği aşağıdaki gibi olmalı

```xml
<!-- Scheme.xml -->

....


<?xml version="1.0" encoding="UTF-8"?>
<schema name="PublicationSchema" version="7.4">
  <types>
      ....
        <fieldType name="_nest_path_" class="solr.NestPathField"/>
      ....
    
  </types>
  <fields>
    
    <field name="_root_" type="string" docValues="true" indexed="true" stored="true"/>
    <field name="_nest_path_" type="_nest_path_" indexed="true" stored="true" multiValued="false"/>
        
    <field name="id" type="string"  required="true" indexed="true" stored="true" multiValued="false"/>

    <field name="col1" type="text" indexed="true" stored="true"/>
    
    <field name="child1_col1" type="text" indexed="true" stored="true"  multiValued="false" />
    <field name="child1_col2" type="text" indexed="true" stored="true"  multiValued="false" />
    
    <field name="child2_col1" type="text" indexed="true" stored="true"  multiValued="true"  />
    <field name="child2_col2" type="text" indexed="true" stored="true"  multiValued="true"  />


    <field name="child1" type="_nest_path_"  multiValued="false">
        <field name="child1_col1" type="text" indexed="true" stored="true"  multiValued="false" />
        <field name="child1_col2" type="text" indexed="true" stored="true"  multiValued="false" />
    </field>
    
    <field name="child2" type="_nest_path_"  multiValued="true">
        <field name="child2_col1" type="text" indexed="true" stored="true"  multiValued="true" />
        <field name="child2_col2" type="text" indexed="true" stored="true"  multiValued="true" />
        <field name="col1" type="text" indexed="true" stored="true"/>
    </field>
    
    <field name="_version_" type="long" indexed="true" stored="true" multiValued="false"/>
    <field name="defaultSearchField" type="text" multiValued="true"/>

  </fields>

  <uniqueKey>id</uniqueKey>
  <df>defaultSearchField</df>
  <solrQueryParser q.op="AND"/>

  <copyField source="child1_col1" dest="defaultSearchField"/>
  <copyField source="child1_col2" dest="defaultSearchField"/>
  <copyField source="child2_col1" dest="defaultSearchField"/>
  <copyField source="child2_col2" dest="defaultSearchField"/>
  <copyField source="col1" dest="defaultSearchField"/>

</schema>

```
bu scheme için upconfig yaptıktan sonra indexleme kısmına geçiyoruz indexleme için aşağıdaki şekilde istek gönderebiliriz.

```sh

curl --location --request POST 'http://{SOLR_HOST}:8983/solr/{COLLECTION}/update?commit=true' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "id": "1",
        "col1": "val1",
        "child1": {
            "child1_col1": "val",
            "child1_col2": "val",
            "col1": "val"
        },
        "child2": [
            {
                "child2_col1": "val",
                "child2_col2": "val",
                "col1": "val"
            },
            {
                "child2_col1": "val",
                "child2_col2": "val",
                "col1": "val"
            }
        ]
    }
]'

```

bu şekilde indexlemeniz yapılmış olacaktır. arama için normalda search yaptığınızda tüm child docsları sanki ayrı docs gibi göreceksiniz heyacan yapmayın :) solr child dökümanların hepsini asıl göküman gibi indexliyor zaten bu sebepten schemeda dikkat ederseniz child fieldlarda sanki parent obje field gibi tanımlandı. peki bunu json gibi görmek için ne yapıyoruz cevap çok basit :) 

fl parametresine *, [child] ekleyin yeterli ``&fl=*,[child]`` şeklinde burada [child] için çeşitli sorgulama metodları mevcuttur detaylı bilgi için solr docs a bakabilrisiniz

Kaynak : [Solr Docs](https://solr.apache.org/guide/8_7/searching-nested-documents.html)


