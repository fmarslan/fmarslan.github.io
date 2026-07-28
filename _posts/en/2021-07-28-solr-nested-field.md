---
layout: post
title: "Solr Nested Field"
date: 2021-07-28
description: "A short technical note on Solr Nested Field, outlining the basic approach and actionable steps."
categories: Solr
lang: en-US
translation_key: "solr-nested-field-d1828d04"
permalink: /en/2021/07/28/solr-nested-field.html
---

There is a nice feature like nested field in Solr. Let's briefly talk about what kind of configuration we need to make to benefit from this feature (these explanations are for version 8.7).

Step 1 scheme.xml content should be as follows

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
After making upconfig for this scheme, we move on to the indexing section. We can send a request for indexing as follows.

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

In this way, your indexing will be done. Normally, when you search, when you search, you will see all child docs as separate docs. Don't get excited :) Solr indexes all child documents as the main sky. For this reason, if you pay attention to the scheme, the child fields are defined as if they were parent object fields. So what do we do to see this as json? The answer is very simple :) 

Add *, [child] to the fl parameter, just type ``&fl=*,[child]``. There are various query methods for [child], you can check the solr docs for detailed information.

Source: [Solr Docs](https://solr.apache.org/guide/8_7/searching-nested-documents.html)
