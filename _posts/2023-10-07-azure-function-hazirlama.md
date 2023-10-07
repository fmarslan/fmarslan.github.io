---
layout: post
title: "Azure Functions Örneği"
categories: azure
---

![image](https://github.com/fmarslan/fmarslan.github.io/assets/12278069/6f7fe91f-754c-45be-a9d1-827ad3a40d9a)


## Azure Functions Nedir?

Azure Functions, Microsoft'un sunuculess (sunucu olmadan) hesaplama platformudur. Bu platform, uygulamalarınızı ve servislerinizi küçük, bağımsız işlevlere bölebileceğiniz ve bu işlevleri olay tetikleyicileri veya HTTP istekleri ile tetikleyebileceğiniz bir çevre sunar. Azure Functions, işlevleri çalıştırmak ve yönetmek için kullanıcıya hizmet sağlar ve işlevlerin ölçeklenebilirliğini otomatik olarak yönetir.

Azure Functions, çeşitli programlama dillerini destekler ve olaylara yanıt vermek için kullanılabilir. Özellikle aşağıdaki senaryolarda tercih edilir:

1. **Olay Tetiklemeli İşlevler**: Azure Functions, veritabanı değişiklikleri, dosya yükleme gibi olayları otomatik olarak tetikleyebilir. Bu, veri senkronizasyonu, bildirimler ve daha fazlası gibi senaryolar için uygundur.

2. **HTTP Tetiklemeli İşlevler**: Azure Functions, HTTP isteklerini işlemek için kullanılabilir. Web API'leri oluşturabilir, oturum açma işlemleri gerçekleştirebilir veya diğer HTTP tabanlı görevleri yerine getirebilirsiniz.

3. **Zamanlanmış Görevler**: Azure Functions, belirli bir sıklıkla çalıştırılacak işlevler oluşturmanıza olanak tanır. Örneğin, her gün belirli bir saatte bir işlem çalıştırmak için kullanabilirsiniz.

## Azure Functions Örnek

Azure Functions ile bir HTTP tetiklemeli işlev örneğini inceleyelim. Bu işlev, bir HTTP isteğini alır, bir metinle birleştirir ve yanıt olarak gönderir.

1. Azure Portal'a giriş yapın ve bir Azure Functions uygulaması oluşturun.
2. Yeni bir işlev oluşturun ve HTTP tetiklemesiyle başlayın.
3. Aşağıdaki örnek C# işlev kodunu kullanarak işlevinizi tanımlayın:

```csharp
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

public static class HttpTriggerExample
{
    [FunctionName("HttpTriggerExample")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("HTTP trigger function processed a request.");

        string name = req.Query["name"];
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        name = name ?? data?.name;

        return name != null
            ? (ActionResult)new OkObjectResult($"Hello, {name}")
            : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
    }
}
```

4. İşlevinizi yayınlamak için Visual Studio Code veya Azure Functions aracını kullanabilirsiniz.

Bu örnekte, bir HTTP isteği alındığında işlev adı ve bir isimle birleştirilmiş bir yanıt döndüren bir Azure Functions işlevi tanımladık.

## Referanslar ve Kaynaklar

- Azure Functions Dökümantasyonu: [Azure Functions Dökümantasyonu](https://docs.microsoft.com/en-us/azure/azure-functions/)
- Azure Functions ile Başlangıç Kılavuzu: [Azure Functions ile Başlangıç Kılavuzu](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function)

Bu kaynaklar, Azure Functions'ı daha fazla öğrenmek ve daha karmaşık senaryoları ele almak isteyenler için faydalı olacaktır.
