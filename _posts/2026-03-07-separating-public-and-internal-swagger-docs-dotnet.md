---
title: "Separating Public and Internal API Documentation in .NET"
date: 2026-03-10
author: FMArslan
categories: [software, dotnet, api]
tags: [dotnet, swagger, api, architecture]
description: "How to publish separate Swagger documentation for public and internal APIs in a single .NET service."
---

# Separating Public and Internal API Documentation in .NET

In many services there are two types of endpoints:

- **Public APIs** used by customers or external systems  
- **Internal APIs** used for operations, debugging, maintenance, or service-to-service communication

When all endpoints appear in a single Swagger document, the API surface becomes harder to understand and internal endpoints may accidentally be exposed to consumers.

A simple solution is to **publish multiple Swagger documents from the same service.**


## API Documentation Structure

Instead of a single Swagger definition, we define two:

```

/swagger/public/swagger.json
/swagger/internal/swagger.json

````

- **Public** → Customer-facing APIs  
- **Internal** → Operational or system endpoints

Swagger UI can display both documents separately.

## Controller Grouping

Controllers can be assigned to a documentation group using `ApiExplorerSettings`.

Example:

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

Public endpoints can use a different group:

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

## Swagger Configuration

Multiple documents are registered in `SwaggerGen`.

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

And both endpoints are exposed in Swagger UI:

```csharp
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/public/swagger.json", "Public API");
    options.SwaggerEndpoint("/swagger/internal/swagger.json", "Internal API");
});
```

---

## Important Note

This approach **only separates the documentation**, not the access.

Internal endpoints should still be protected using:

* Authentication / Authorization policies
* API gateway rules
* Network restrictions
* Internal service routing

## Why This Helps

Separating internal and external APIs improves:

* **API clarity** for external consumers
* **Operational visibility** for internal teams
* **Safer documentation exposure**

In larger platforms, this pattern helps keep operational endpoints from being mixed with the public API surface.
