---
layout: post
title: "Mysql json parse operation in Query and use of create/insert command with WITH"
date: 2023-09-29
description: "A short technical note summarizing the basic approach and applicable steps on the mysql json parse process in Query and the use of WITH and create/insert command."
categories: mysql
lang: en-US
translation_key: "mysql-json-parse-in-query-and-create-insert-with-with-clause-f6bc6e08"
permalink: /en/2023/09/29/mysql-json-parse-operation-in-query-and-use-of-create-insert-command-with-with.html
---

The example below performs the query json parse operation, creates a table and inserts the query result created with with into it.

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
