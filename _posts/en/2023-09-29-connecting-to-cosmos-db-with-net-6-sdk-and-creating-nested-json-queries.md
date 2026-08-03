---
layout: post
title: "Connecting to Cosmos DB with .NET 6 SDK and Creating Nested JSON Queries"
date: 2023-09-29
description: "A brief technical note outlining the basic approach and actionable steps on Connecting to Cosmos DB with .NET 6 SDK and Creating Nested JSON Queries."
categories: cosmos, net6
lang: en-US
translation_key: "cosmos-db-net-connection-ve-nested-sorgular-15dd120a"
permalink: /en/2023/09/29/connecting-to-cosmos-db-with-net-6-sdk-and-creating-nested-json-queries.html
---

Cosmos DB is a globally distributed NoSQL database service from Microsoft. With .NET 6, you can easily connect to Cosmos DB and create deep queries within JSON documents. In this article, you will learn step by step how to connect to Cosmos DB using .NET 6 SDK and create nested JSON queries.

#1. Connecting to Cosmos DB:

To connect to Cosmos DB with .NET 6, add the Microsoft.Azure.Cosmos NuGet package to your project. Next, create a **CosmosClient** instance using your Cosmos DB account key and database name:

```cs
var cosmosClient = new CosmosClient("Cosmos DB Connection String");
var database = cosmosClient.GetDatabase("DatabaseName");
var container = database.GetContainer("ContainerName");
```

#2. Creating Nested JSON Queries:

We can use LINQ queries to create nested JSON queries in Cosmos DB. For example, to query a nested JSON element with a specific property:

```cs
var query = new QueryDefinition("SELECT * FROM c WHERE c.NestedObject.Property = @propertyValue")
                .WithParameter("@propertyValue", "TargetValue");

var resultSet = container.GetItemQueryIterator<dynamic>(query);
while (resultSet.HasMoreResults)
{
    var response = await resultSet.ReadNextAsync();
    foreach (var item in response)
    {
        Console.WriteLine(item);
    }
}

```

This query filters JSON documents that contain a property called "NestedObject".

**Sample Application:**

For a complete .NET 6 application example that follows these steps, you can check out [Cosmos DB .NET SDK samples on GitHub](https://github.com/Azure-Samples/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples). These examples detail how to connect to Cosmos DB, create queries, and more.

In this article, you learned how to connect to Cosmos DB and create nested JSON queries using the .NET 6 SDK. With these techniques, you can expand your capabilities to pull data from Cosmos DB and query complex data structures. For more details and examples, you can check out the official [Azure Cosmos DB documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/).
