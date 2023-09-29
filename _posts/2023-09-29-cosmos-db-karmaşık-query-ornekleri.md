---
layout: post
title: "Cosmos db karmaşık query örneği"
categories: cosmos
---

Cosmos DB'de karmaşık ve iç içe geçmiş JSON dokümanları üzerinde sorgular oluşturmak oldukça yaygındır. Bu tür sorguları anlamak için bir örnek üzerinden ilerleyelim.

Diyelim ki, bir e-ticaret uygulamasında müşteriler ve siparişler adında iki koleksiyonumuz var. Müşteri belgeleri şu şekilde gözükebilir:
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

Sipariş belgeleri ise şu şekilde olabilir:

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

Burada *customers* ve *orders* adında iki koleksiyonumuz var.

## Sorular ve Yanıtlar

**Soru 1:** Belirli bir şehirde yaşayan müşterilerin isimlerini ve siparişlerini getirin.

```sql
SELECT c.name, o.id, o.products
FROM customers c
JOIN orders o IN c.id
WHERE c.address.city = 'New York'
```
Bu sorgu, New York'ta yaşayan müşterilerin adını ve siparişlerini döndürür.

**Soru 2:** Belirli bir ülkede yaşayan müşterilerin her bir ürün için toplam sipariş sayısını getirin.
```sql
SELECT c.address.country, p.name, SUM(o.products.quantity) as totalQuantity
FROM customers c
JOIN orders o IN c.id
JOIN p IN o.products
GROUP BY c.address.country, p.name
```
Bu sorgu, ülkeye göre gruplandırılmış her bir ürün için toplam sipariş sayısını döndürür.

**Soru 3:** Belirli bir ürünü satın alan müşterilerin listesi.
```sql
SELECT c.name
FROM customers c
JOIN orders o IN c.id
JOIN p IN o.products
WHERE p.name = 'Product A'
```
Bu sorgu, 'Product A' adlı ürünü satın alan müşterilerin isimlerini döndürür.

Bu örnek sorgular, Cosmos DB'de iç içe geçmiş JSON verileri sorgulamak için kullanılabilir. Gerçek senaryolarınıza uygun sorguları oluşturmak için JSON dokümanlarınızın yapısını dikkate alarak sorgularınızı uyarlayabilirsiniz.
