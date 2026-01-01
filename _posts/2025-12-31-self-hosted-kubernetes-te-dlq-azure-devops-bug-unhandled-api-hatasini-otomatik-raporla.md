---
layout: post
title: "Self-Hosted Kubernetes'te DLQ -> Azure DevOps Bug: Unhandled API hatasını otomatik raporla, aynı mesajla lokalde birebir simüle et"
date: 2025-12-31 09:00:00 +0300
description: .NET Web API unhandled exception → DLQ queue, DLQ consumer → Azure DevOps Bug. Bug içine replay edilebilir repro paketi göm.
tags: [kubernetes, dotnet, dlq, rabbitmq, azure-devops, observability]
image: /assets/img/dlq2azuredevops.png

---

Bazen “500 oldu geçti” değil; **500 olduysa** bunun _kanıtı_, _repro’su_ ve _versiyon bilgisi_ tek yerde olmalı.
Benim hedefim şu:

- **Self-hosted Kubernetes** üzerinde çalışan **.NET Web API**
- Kullanıcı çağrı yapar, response hazırlanırken **Unhandled Exception** patlar
- Servis bu hatayı **DLQ queue**’ya yazar (ben RabbitMQ seçtim, Kafka/Redis Streams de olur)
- **DLQ consumer** (K8s Deployment) mesajı alır, **Azure DevOps’ta Bug** açar
- Bug içine **repro paketi** koyar: developer bu içerikle lokalde **aynı hatayı** tetikleyebilsin

Bu yazıdaki örneklerde asıl mesele “DLQ” kelimesi değil; **poison/error event’in bir kuyruğa düşmesi** ve **otomatik issue** açılması.

![Test-Centric Development kapak görseli](/assets/img/dlq2azuredevops.png)

## 1) Topoloji

<div class="mermaid">
flowchart TB
    C[Client] --> I[Ingress]
    I --> A[Orders API .NET]
    A -->|500 + traceId| C

    A -->|Unhandled Exception| Q[RabbitMQdlq.api-errors]
    Q --> D[dlq-consumer Python ]
    D --> B[Azure DevOps Bug]

    B --- R[Bug Content:• Repro payload• curl command• Full JSON• Build / Image / Git SHA]

</div>



## 2) Bug içine koyacağımız “Repro Paketi”

Developer’ın işine yarayan veri şunlar:

- **traceId / correlationId**
- **HTTP replay**:
  - method, path, query
  - sanitize edilmiş headers (Authorization/Cookie yok)
  - request body
  - örnek `curl`
- **Build fingerprint**:
  - service name
  - version, git sha, image tag
- **Runtime fingerprint**:
  - pod / namespace / node
- **Exception**:
  - type, message
  - stack trace
  - inner exceptions

Bu paketi “tek JSON” olarak bug’a gömeceğiz.

> Uyarı: Authorization/Cookie gibi şeyleri _bilerek_ koymuyoruz. PII/secrets sızdırmak istemiyorum. Ama tenantId gibi “repro için gerekli” alanları koyuyorum.



## 3) .NET Web API: Unhandled exception → DLQ queue

### 3.1 appsettings.json

```json
{
  "Dlq": {
    "RabbitMq": {
      "Host": "rabbitmq",
      "User": "app",
      "Pass": "secret",
      "Queue": "dlq.api-errors"
    }
  },
  "Build": {
    "ServiceName": "orders-api",
    "Version": "1.2.3",
    "GitSha": "abc1234",
    "ImageTag": "orders-api:abc1234"
  }
}
````

### 3.2 Middleware: request’i bufferla, repro paketini üret, DLQ’ya bas

> Request body’yi okuyup tekrar pipeline’a sokmak için `EnableBuffering()` kullanıyorum.
> Bu kısım “best-effort”; body okunamazsa yine de temel paket oluşur.

```csharp
using System.Text;
using System.Text.Json;

public sealed class GlobalExceptionToDlqMiddleware : IMiddleware
{
    private readonly IDlqPublisher _publisher;
    private readonly IConfiguration _cfg;
    private readonly ILogger<GlobalExceptionToDlqMiddleware> _logger;

    public GlobalExceptionToDlqMiddleware(IDlqPublisher publisher, IConfiguration cfg, ILogger<GlobalExceptionToDlqMiddleware> logger)
    {
        _publisher = publisher;
        _cfg = cfg;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var traceId = context.TraceIdentifier;
            var request = context.Request;

            string requestBody = "";
            try
            {
                request.EnableBuffering();
                using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
                requestBody = await reader.ReadToEndAsync();
                request.Body.Position = 0;
            }
            catch { /* best-effort */ }

            var headers = request.Headers
                .Where(h => !IsSensitiveHeader(h.Key))
                .ToDictionary(k => k.Key, v => v.Value.ToString());

            // OPTIONAL: tenantId gibi repro için kritik alanlar (header’dan ya da body’den)
            var tenantId = request.Headers.TryGetValue("x-tenant-id", out var t) ? t.ToString() : null;

            var repro = new
            {
                kind = "unhandled_api_error",
                occurredAtUtc = DateTime.UtcNow,
                traceId,

                http = new
                {
                    method = request.Method,
                    path = request.Path.Value,
                    query = request.QueryString.Value,
                    headers,
                    body = requestBody
                },

                context = new
                {
                    tenantId,
                    // userId gibi bir şey koyacaksan hashle
                    // userHash = Hash(context.User.Identity?.Name)
                },

                exception = FlattenException(ex),

                build = new
                {
                    service = _cfg["Build:ServiceName"],
                    version = _cfg["Build:Version"],
                    gitSha = _cfg["Build:GitSha"],
                    imageTag = _cfg["Build:ImageTag"]
                },

                runtime = new
                {
                    pod = Environment.GetEnvironmentVariable("HOSTNAME"),
                    @namespace = Environment.GetEnvironmentVariable("POD_NAMESPACE"),
                    node = Environment.GetEnvironmentVariable("NODE_NAME")
                }
            };

            await _publisher.PublishAsync(repro, traceId);

            _logger.LogError(ex, "Unhandled error. traceId={TraceId}", traceId);

            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { success = false, code = "ERR-UNHANDLED", traceId });
        }
    }

    private static bool IsSensitiveHeader(string key)
    {
        var k = key.ToLowerInvariant();
        return k is "authorization" or "cookie" or "set-cookie" or "x-api-key";
    }

    private static object FlattenException(Exception ex)
    {
        var list = new List<object>();
        Exception? cur = ex;
        while (cur != null)
        {
            list.Add(new
            {
                type = cur.GetType().FullName,
                message = cur.Message,
                stack = cur.StackTrace
            });
            cur = cur.InnerException;
        }
        return list;
    }
}
```

### 3.3 DLQ publisher (RabbitMQ)

NuGet: `RabbitMQ.Client`

```csharp
public interface IDlqPublisher
{
    Task PublishAsync(object payload, string correlationId);
}
```

```csharp
using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

public sealed class RabbitDlqPublisher : IDlqPublisher
{
    private readonly IConnection _conn;
    private readonly string _queue;

    public RabbitDlqPublisher(IConfiguration cfg)
    {
        _queue = cfg["Dlq:RabbitMq:Queue"]!;
        var factory = new ConnectionFactory
        {
            HostName = cfg["Dlq:RabbitMq:Host"],
            UserName = cfg["Dlq:RabbitMq:User"],
            Password = cfg["Dlq:RabbitMq:Pass"]
        };
        _conn = factory.CreateConnection();
    }

    public Task PublishAsync(object payload, string correlationId)
    {
        using var ch = _conn.CreateModel();
        ch.QueueDeclare(_queue, durable: true, exclusive: false, autoDelete: false);

        var props = ch.CreateBasicProperties();
        props.Persistent = true;
        props.CorrelationId = correlationId;
        props.ContentType = "application/json";

        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload));
        ch.BasicPublish(exchange: "", routingKey: _queue, basicProperties: props, body: bytes);
        return Task.CompletedTask;
    }
}
```

### 3.4 Program.cs bağlama

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<IDlqPublisher, RabbitDlqPublisher>();
builder.Services.AddTransient<GlobalExceptionToDlqMiddleware>();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionToDlqMiddleware>();
app.MapControllers();

app.Run();
```



## 4) Test endpoint: bilinçli hata üret (demo için)

```csharp
[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpPost("explode")]
    public IActionResult Explode([FromBody] object payload)
    {
        // "response hazırlanırken patladı" senaryosu
        throw new InvalidOperationException("Simulated unhandled exception for DLQ demo.");
    }
}
```



## 5) DLQ Consumer: Self-hosted K8s’te çalışır, Bug açar

Bu consumer:

* RabbitMQ’dan `dlq.api-errors` dinler
* Mesajı parse eder
* Azure DevOps REST API ile **Bug** açar
* Bug description içine:

  * `curl`
  * full JSON payload
  * build/runtime/exception
    koyar
* sonra ack

### 5.1 Python kodu

Pip: `pika requests`

```python
import os, json, base64, requests
import pika

RABBIT_HOST = os.environ["RABBIT_HOST"]
RABBIT_USER = os.environ["RABBIT_USER"]
RABBIT_PASS = os.environ["RABBIT_PASS"]
QUEUE = os.environ.get("DLQ_QUEUE", "dlq.api-errors")

AZDO_ORG = os.environ["AZDO_ORG"]
AZDO_PROJECT = os.environ["AZDO_PROJECT"]
AZDO_PAT = os.environ["AZDO_PAT"]

def escape_html(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def build_curl(payload: dict) -> str:
    http = payload.get("http", {})
    method = http.get("method", "POST")
    path = http.get("path", "/")
    query = http.get("query", "")
    headers = http.get("headers", {})
    body = http.get("body", "")

    header_lines = []
    for k, v in headers.items():
        # Assume sanitized already
        header_lines.append(f"-H '{k}: {v}'")

    curl = (
        f"curl -i -X {method} \\\n"
        f"  'http://localhost:8080{path}{query}' \\\n"
        f"  " + " \\\n  ".join(header_lines) + " \\\n"
        f"  --data-raw '{body}'"
    )
    return curl

def azdo_create_bug(title: str, description_html: str):
    url = f"https://dev.azure.com/{AZDO_ORG}/{AZDO_PROJECT}/_apis/wit/workitems/$Bug?api-version=7.1-preview.3"
    token = base64.b64encode(f":{AZDO_PAT}".encode()).decode()
    headers = {
        "Authorization": f"Basic {token}",
        "Content-Type": "application/json-patch+json"
    }
    patch = [
        {"op": "add", "path": "/fields/System.Title", "value": title},
        {"op": "add", "path": "/fields/System.Description", "value": description_html},
    ]
    r = requests.post(url, headers=headers, data=json.dumps(patch), timeout=20)
    r.raise_for_status()
    return r.json()

def build_description(payload: dict) -> str:
    trace_id = payload.get("traceId", "-")
    build = payload.get("build", {})
    runtime = payload.get("runtime", {})
    exc = payload.get("exception", [])
    curl = build_curl(payload)
    pretty_json = json.dumps(payload, indent=2, ensure_ascii=False)

    # Exception summary (first item)
    exc_summary = ""
    if isinstance(exc, list) and len(exc) > 0:
        e0 = exc[0]
        exc_summary = f"{e0.get('type','Exception')}: {e0.get('message','')}"
    else:
        exc_summary = "Exception: -"

    html = f"""
<h3>DLQ Repro Package</h3>
<p><b>TraceId:</b> {escape_html(str(trace_id))}</p>
<p><b>Exception:</b> {escape_html(exc_summary)}</p>

<h4>Build Fingerprint</h4>
<pre>{escape_html(json.dumps(build, indent=2, ensure_ascii=False))}</pre>

<h4>Runtime Fingerprint</h4>
<pre>{escape_html(json.dumps(runtime, indent=2, ensure_ascii=False))}</pre>

<h4>Replay (Local)</h4>
<p>API'yı localde 8080'de ayağa kaldırıp aşağıdaki curl'ü çalıştır.</p>
<pre>{escape_html(curl)}</pre>

<h4>Full Payload (JSON)</h4>
<pre>{escape_html(pretty_json)}</pre>
"""
    return html

def on_message(ch, method, properties, body_bytes):
    try:
        payload = json.loads(body_bytes.decode("utf-8"))
        trace_id = payload.get("traceId") or properties.correlation_id or "-"
        service = (payload.get("build") or {}).get("service", "service")
        title = f"[DLQ] Unhandled API Error | {service} | traceId={trace_id}"

        desc = build_description(payload)
        azdo_create_bug(title, desc)

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        # no ack -> retry later
        print("ERROR:", str(e))

def main():
    creds = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
    conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBIT_HOST, credentials=creds))
    ch = conn.channel()
    ch.queue_declare(queue=QUEUE, durable=True)
    ch.basic_qos(prefetch_count=5)
    ch.basic_consume(queue=QUEUE, on_message_callback=on_message)
    print("dlq-consumer started.")
    ch.start_consuming()

if __name__ == "__main__":
    main()
```



## 6) Kubernetes manifest örnekleri

### 6.1 Orders API Deployment (downward API ile fingerprint)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
  namespace: demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: orders-api
  template:
    metadata:
      labels:
        app: orders-api
    spec:
      containers:
      - name: orders-api
        image: registry.local/orders-api:abc1234
        ports:
        - containerPort: 8080
        env:
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef: { fieldPath: metadata.namespace }
        - name: NODE_NAME
          valueFrom:
            fieldRef: { fieldPath: spec.nodeName }
        # Rabbit settings (demo; prod’da Secret kullan)
        - name: Dlq__RabbitMq__Host
          value: rabbitmq.demo.svc.cluster.local
        - name: Dlq__RabbitMq__User
          value: app
        - name: Dlq__RabbitMq__Pass
          value: secret
        - name: Dlq__RabbitMq__Queue
          value: dlq.api-errors
```

### 6.2 dlq-consumer Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dlq-consumer
  namespace: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: dlq-consumer
  template:
    metadata:
      labels:
        app: dlq-consumer
    spec:
      containers:
      - name: dlq-consumer
        image: registry.local/dlq-consumer:1.0.0
        env:
        - name: RABBIT_HOST
          value: rabbitmq.demo.svc.cluster.local
        - name: RABBIT_USER
          value: app
        - name: RABBIT_PASS
          value: secret
        - name: DLQ_QUEUE
          value: dlq.api-errors
        - name: AZDO_ORG
          value: yourOrg
        - name: AZDO_PROJECT
          value: yourProject
        - name: AZDO_PAT
          valueFrom:
            secretKeyRef:
              name: azdo-pat
              key: pat
```



## 7) Lokalde “aynı hatayı” simüle etme

Bug açıldığında description içinde zaten şunlar var:

* **Full JSON payload**
* **Replay curl**

Developer’ın yaptığı pratik:

1. API’yı lokalde ayağa kaldır
2. Bug’daki `curl` komutunu çalıştır
3. Aynı request body + aynı route ile aynı code path tetiklenir
4. `traceId` ile log/trace üzerinden yürür

Bu kadar.



## 8) Sahadan eleştiri: bu sistem nerede patlar?

Bunu yazmadan olmaz:

* **Duplicate bug spam**: Consumer restart olunca aynı mesaj tekrar işlenebilir.

  * Çözüm: payload’ın hash’ini çıkar, bug title’a koy, önce ADO’da search et veya Redis/SQL ile dedupe yap.
* **PII/Secrets**: body içinde müşteri datası olabilir.

  * Çözüm: field bazlı mask (email, taxId, iban, address).
* **Hata fırtınası**: bir config patladı mı yüzlerce bug açılır.

  * Çözüm: “signature” bazlı aggregation (aynı stack+route için tek bug, içine occurrence count/comment).

Ben olsam prod’a çıkmadan önce bu üçüne bir “minimum” çözüm koyarım, yoksa sistem kendi kendini DDoS eder.



## 9) Son söz

Bu yaklaşımın sevdiğim tarafı: “hata oldu” bilgisini değil, **hata tekrar üretilebilir** bir paketi taşıması.
Bug’ı açtığında “loglara bak” değil; “al bu curl, al bu payload, al bu imageTag” diyorsun.

Kısaca: **hata = event**. Event’i kaybetme. Event’i issue’ya dönüştür. Issue’yu repro ile doldur.
