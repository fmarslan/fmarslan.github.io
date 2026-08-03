---
layout: post
title: "Query içinde mysql json parse işlemi ve WITH  ile create/insert komutu kullanımı"
categories: mysql
lang: tr-TR
description: "Query içinde mysql json parse işlemi ve WITH  ile create/insert komutu kullanımı konusunda temel yaklaşımı ve uygulanabilir adımları özetleyen kısa bir teknik not."
translation_key: "mysql-json-parse-in-query-and-create-insert-with-with-clause-f6bc6e08"
permalink: /mysql/2023/09/29/mysql-json-parse-in-query-and-create-insert-with-WITH-clause.html
---

aşağıdaki örnek query json parse işlemini yapmakta ve table oluşturup içerisine with ile oluşturulan sorgu sonucunu insert etmektedir.

```sql
create table migration_template_table -- or insert command
with template as(
SELECT
    jt.t_name,
    jt.t_code,
    jt.t_attributes,
    jta.a_name,
    jta.a_code,
    jta.a_type
FROM
    migration_temporary_table t,
    JSON_TABLE(
        t.data,
        '$[*]'
        COLUMNS (
            t_name VARCHAR(255) PATH '$.name',
            t_code VARCHAR(255) PATH '$.code',
            t_attributes json PATH '$.attributes'
        )
    ) AS jt,
    JSON_TABLE(
        jt.t_attributes,
        '$[*]'
        COLUMNS (
            a_name VARCHAR(255) PATH '$.name',
            a_code VARCHAR(255) PATH '$.code',
            a_type json PATH '$'
        )
    ) AS jta)
select t_name,t_code,a_name,a_code,a_type from template
```
