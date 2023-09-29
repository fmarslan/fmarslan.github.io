---
layout: post
title: "Cosmos DB'ye .NET 6 SDK ile Bağlanma ve Nested JSON Sorguları Oluşturma"
categories: cosmos, net6
---

Cosmos DB, Microsoft'un küresel ölçekte dağıtılmış bir NoSQL veritabanı hizmetidir. .NET 6 ile, Cosmos DB'ye kolayca bağlanabilir ve JSON dokümanları içinde derinlemesine sorgular oluşturabilirsiniz. Bu makalede, Cosmos DB'ye .NET 6 SDK kullanarak nasıl bağlanılacağınızı ve iç içe geçmiş JSON sorgularını nasıl oluşturacağınızı adım adım öğreneceksiniz.

# 1. Cosmos DB'ye Bağlanma:

.NET 6 ile Cosmos DB'ye bağlanmak için, Microsoft.Azure.Cosmos NuGet paketini projenize ekleyin. Ardından, Cosmos DB hesap anahtarınızı ve veritabanı adınızı kullanarak bir **CosmosClient** örneği oluşturun:

```cs
var cosmosClient = new CosmosClient("Cosmos DB Connection String");
var database = cosmosClient.GetDatabase("DatabaseName");
var container = database.GetContainer("ContainerName");
```

# 2. Nested JSON Sorguları Oluşturma:

Cosmos DB'de iç içe geçmiş JSON sorguları oluşturmak için LINQ sorgularını kullanabiliriz. Örneğin, belirli bir özelliğe sahip iç içe geçmiş bir JSON öğesini sorgulamak için:

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

Bu sorgu, "NestedObject" adlı bir özellik içeren JSON belgelerini filtreler.

**Örnek Uygulama:**

Bu adımları uygulayan tam bir .NET 6 uygulama örneği için [GitHub'daki Cosmos DB .NET SDK örneklerine](https://github.com/Azure-Samples/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples) göz atabilirsiniz. Bu örnekler, Cosmos DB'ye bağlanma, sorgu oluşturma ve diğer işlemleri ayrıntılı bir şekilde gösterir.

Bu makalede, .NET 6 SDK kullanarak Cosmos DB'ye bağlanmayı ve iç içe geçmiş JSON sorgularını oluşturmayı öğrendiniz. Bu tekniklerle, Cosmos DB'den veri çekme ve karmaşık veri yapılarını sorgulama yeteneklerinizi genişletebilirsiniz. Daha fazla ayrıntı ve örnekler için resmi [Azure Cosmos DB belgelerine](https://docs.microsoft.com/en-us/azure/cosmos-db/) göz atabilirsiniz.
