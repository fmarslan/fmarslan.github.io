---
layout: post
title: ".NET'te Genel ve Dahili API Belgelerini Ayırma"
date: 2026-03-07
description: "Tek bir .NET hizmetinde genel ve dahili API'ler için ayrı Swagger belgeleri nasıl yayınlanır?"
categories: [software, dotnet, api]
tags: [dotnet, swagger, api, architecture]
lang: tr-TR
translation_key: "separating-public-and-internal-swagger-docs-dotnet-4fab5cf0"
permalink: /tr/2026/03/07/net-te-genel-ve-dahili-api-belgelerini-ayrma.html
---

# .NET'te Genel ve Dahili API Belgelerini Ayırma

Birçok hizmette iki tür uç nokta vardır:

- **Müşteriler veya harici sistemler tarafından kullanılan **genel API'ler**  
- **İşlemler, hata ayıklama, bakım veya hizmetten hizmete iletişim için kullanılan **dahili API'ler**

Tüm uç noktalar tek bir Swagger belgesinde göründüğünde, API yüzeyinin anlaşılması zorlaşır ve dahili uç noktalar yanlışlıkla tüketicilerin kullanımına sunulabilir.

Basit bir çözüm **aynı hizmetten birden fazla Swagger belgesi yayınlamaktır.**


## API Dokümantasyon Yapısı

Tek bir Swagger tanımı yerine iki tane tanımlıyoruz:

```

/swagger/public/swagger.json
/swagger/internal/swagger.json

````

- **Genel** → Müşteriye yönelik API'ler  
- **Dahili** → Operasyonel veya sistem uç noktaları

Swagger UI her iki belgeyi ayrı ayrı görüntüleyebilir.

## Denetleyici Gruplaması

Kontrolörler `ApiExplorerSettings` kullanılarak bir dokümantasyon grubuna atanabilir.

Örnek:

```csharp
[ApiController]
[Route("api/internal/[controller]")]
[ApiExplorerSettings(GroupName = "internal")]
public class AdminController : ControllerBase
{
    [HttpGet("health-detail")]
    public IActionResult Get()
    {
        return Ok("internal data");
    }
}
````

Genel uç noktalar farklı bir grup kullanabilir:

```csharp
[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "public")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok();
    }
}
```

## Swagger Yapılandırması

`SwaggerGen`'de birden fazla belge kayıtlı.

```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("public", new OpenApiInfo
    {
        Title = "Public API",
        Version = "v1"
    });

    options.SwaggerDoc("internal", new OpenApiInfo
    {
        Title = "Internal API",
        Version = "v1"
    });

    options.DocInclusionPredicate((docName, apiDesc) =>
    {
        var groupName = apiDesc.GroupName;
        return string.Equals(groupName, docName, StringComparison.OrdinalIgnoreCase);
    });
});
```

Ve her iki uç nokta da Swagger kullanıcı arayüzünde gösteriliyor:

```csharp
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/public/swagger.json", "Public API");
    options.SwaggerEndpoint("/swagger/internal/swagger.json", "Internal API");
});
```

---

## Önemli Not

Bu yaklaşım **yalnızca belgeleri ayırır**, erişimi değil.

Dahili uç noktalar aşağıdakiler kullanılarak korunmaya devam edilmelidir:

* Kimlik Doğrulama / Yetkilendirme politikaları
* API ağ geçidi kuralları
* Ağ kısıtlamaları
* Dahili servis yönlendirmesi

## Bu Neden Yardımcı Olur?

Dahili ve harici API'leri ayırmak şunları iyileştirir:

* **Harici tüketiciler için API netliği**
* **Dahili ekipler için operasyonel görünürlük**
* **Dokümantasyona daha güvenli erişim**

Daha büyük platformlarda bu model, operasyonel uç noktaların genel API yüzeyiyle karışmasını önlemeye yardımcı olur.
