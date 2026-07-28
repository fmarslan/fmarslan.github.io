---
layout: post
title: "Cosmos db complex query example"
date: 2023-09-29
description: "A brief technical note outlining the basic approach and applicable steps on the Cosmos db complex query example."
categories: cosmos
lang: en-US
translation_key: "cosmos-db-karmask-query-ornekleri-c00373a4"
permalink: /en/2023/09/29/cosmos-db-complex-query-example.html
---

It is quite common to create queries on complex and nested JSON documents in Cosmos DB. Let's walk through an example to understand this type of query.

Let's say, in an e-commerce application, we have two collections named customers and orders. Customer documents may look like this:
```json
{
    "id": "1",
    "name": "John Doe",
    "address": {
        "city": "New York",
        "country": "USA"
    }
}

```

Order documents can be as follows:

```json
{
    "id": "1",
    "customerId": "1",
    "products": [
        {
            "name": "Product A",
            "quantity": 2
        },
        {
            "name": "Product B",
            "quantity": 1
        }
    ]
}

```

Here we have two collections named *customers* and *orders*.

## Questions and Answers

**Question 1:** Bring the names and orders of customers living in a specific city.

```sql
SELECT c.name, o.id, o.products
FROM customers c
JOIN orders o IN c.id
WHERE c.address.city = 'New York'
```
This query returns the name and orders of customers living in New York.

**Question 2:** Return the total number of orders for each product from customers living in a specific country.
```sql
SELECT c.address.country, p.name, SUM(o.products.quantity) as totalQuantity
FROM customers c
JOIN orders o IN c.id
JOIN p IN o.products
GROUP BY c.address.country, p.name
```
This query returns the total number of orders for each product, grouped by country.

**Question 3:** List of customers who purchased a particular product.
```sql
SELECT c.name
FROM customers c
JOIN orders o IN c.id
JOIN p IN o.products
WHERE p.name = 'Product A'
```
This query returns the names of customers who purchased the product named 'Product A'.

These sample queries can be used to query nested JSON data in Cosmos DB. You can adapt your queries by taking into account the structure of your JSON documents to create queries that suit your real scenarios.
