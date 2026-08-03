---
layout: post
title: "List of key concepts for modern cloud architecture"
date: 2025-11-19
description: "I have compiled the concepts you will encounter most when establishing a cloud-based platform with short and simple explanations."
image: /assets/img/modern-bulut-mimarisi-cover.png
tags:
  - architecture
  - cloud
  - devops
  - kubernetes
lang: en-US
translation_key: "modern-bulut-mimarisi-temel-kavramlar-d9083f75"
permalink: /en/2025/11/19/list-of-key-concepts-for-modern-cloud-architecture.html
---

When building a cloud-based product, it is necessary to deal with many concepts and tools at the same time. Moreover, all of this requires a common language between teams. The list below consists of short notes I prepared to turn these concepts accumulated over time into a more organized and reusable dictionary.

## Container and Kubernetes Fundamentals

* **Kubernetes core concepts** → Pod, Deployment/StatefulSet, Service, Ingress, ConfigMap, Secret and Namespace; It determines where workloads in the cluster will run and how they will communicate. When correct access, security and resource definitions are made to these components, cluster behavior becomes predictable.

* **Node & NodePool management** → Workload performance largely depends on node hardware, zone selection and node pool strategy. Autoscaling rules determine durability.

* **Horizontal Pod Autoscaler (HPA)** → Automatically scales the number of Pods according to CPU, memory or custom metrics. Correct threshold and min/max settings prevent service interruption during sudden load increases.

* **Liveness / Readiness / Startup Probes** → Informs kubelet whether the application is really in a healthy state. Incorrect probe values ​​may lead to unnecessary restarts.

* **Container image & Docker fundamentals** → Layered image structure, entrypoint/command, multi-stage build techniques allow you to produce smaller and faster images. Image versioning strategies provide transparency in the CI/CD chain.

* **Resource requests & limits** → Determining the CPU/memory values ​​correctly affects not only the cost but also the fair sharing within the cluster. Incorrect limits may result in throttling or node crash.

## Event-Driven Architecture and Messaging

* **Apache Kafka** → It carries high volume data streams reliably with its topic, partition and consumer group structure. Offset and commit strategies make it possible to rollback without data loss.

* **Topic & partition design** → Correct key selection preserves the ordering guarantee for critical operations. Improper deployment can create latency and hotspotting.

* **Consumer group scaling** → While the same consumer group shares the load, different groups process the same data independently. This provides both security and flexibility to parallel processing scenarios.

* **Retry, DLQ and back-pressure** → Retry policies, DLQ structures and consumer speed control ensure producer-consumer balance. Well-designed idempotent operations absorb repeated data safely.

* **Kafka UI / monitoring tools** → Lag, throughput and partition health visibility provides early warning. Visual tools reveal patterns that operators miss.

## Data Flow and Orchestration

* **Apache NiFi** → Allows you to visually manage data flows with Processor, FlowFile, Connection and Queue structures. Back-pressure thresholds and Provenance tracking provide end-to-end transparency.

* **NiFi Registry** → Flow maintains consistency across different environments thanks to versioning. Rollback and promotion operations can be done visually instead of CLI.

* **Serverless function steps** → Dividing events into stateless functions provides independent scaling and rapid deployment. Payload + context model reduces unnecessary dependency between functions.

## API Gateway and TLS/Certificate Management

* **API Gateway (Kong, KIC)** → It collects common needs such as routing, authentication, rate limiting and logging under a single entry point. gRPC/REST support makes it easy to deliver hybrid services from a single door.

* **cert-manager** → ACME, Issuer/ClusterIssuer and DNS challenge mechanisms free TLS automation from human intervention. Internal–external CA management ensures consistent chain of trust even in hybrid environments.

## Observability and Operation

* **Prometheus metrics** → Counter, gauge, histogram and summary types measure system behavior. ServiceMonitor and scrape interval settings provide automatic discovery. Good label design increases the readability of queries.* **Grafana dashboards** → It transforms metrics into visual narrative and allows you to manage alert rules from a single place. Shared dashboard libraries create a common language within the team.

* **Fluent Bit pipeline** → Input → Filter → Output line enriches the logs and directs them to targets such as Elasticsearch/OpenSearch. Adding trace-id / customer-id significantly shortens debugging time.

* **OpenTelemetry** → Provides a unified standard for metrics, logs and traces. Vendor reduces the risk of lock-in and simplifies agent management with auto-instrumentation.

* **SLO / SLI / Error Budget** → Setting service targets early reduces dashboard and alert noise. Teams agree on metrics that represent customer experience.

## Storage and Databases

* **Amazon S3** → Bucket, prefix, lifecycle policy design directly affects cost and durability. Pre-signed URL offers controlled sharing for sensitive files.

* **PostgreSQL multi-tenant patterns** → Tenant isolation is provided with Schema separation, search_path and Row Level Security. Correct index design and pgBouncer ensure stability in heavy traffic.

* **Redis caching** → Key/value structure, TTL, rate-limit tokens and persistence options are ideal for performance-critical data. Incorrect eviction policy may cause cache loss.

## CI/CD and DevOps

* **GitOps & Argo CD** → Managing manifests via Git creates a strong audit trail. Health check rules and branch filters ensure environment consistency.

* **Standardizing the CI pipeline (Build → Scan → Deploy)** → Code → image → security scan → deploy chain reduces surprises. Quality gates minimize production errors.

* **Helm Charts** → Thanks to the template structure, the same service can be reused in many environments. Values ​​files allow secrets and resource values ​​to be adapted to the environment.

* **Environment separation & secret management** → It is critical for security to keep dev/test/prod boundaries clear and centralize secrets management (Secrets, External Secrets, Vault).

## Service Mesh (Optional)

* **Istio / Linkerd** → mTLS provides traffic shifting, policy enforcement and richer observability. It offers the ability to manage traffic without changing application code.

## Scaling and Performance Practices

* **Back-pressure & async patterns** → Balancing the producer-consumer speed difference by managing queue depth and throughput keeps the system stable. Avoiding blocking operations speeds up the flow.

* **Node disk I/O & storage class selection** → Disk IOPS determines the real bottleneck, especially in NiFi repository or temporary object storage scenarios.

* **Retry patterns & idempotency** → Each retry producing the same result ensures data consistency in the persistence layer. Idempotent key mechanisms provide assurance in critical transactions.

* **Delivery guarantees** → At-least-once or exactly-once model is selected according to your application requirements. Compensation flows and audit logs make it easier to undo wrong scenarios.

## Application Tips

* **CNCF Trail Map** It is a guide that shows the order in which technologies such as → Container → orchestration → service mesh → observability will be discussed. Having teams proceed in the same order reduces conceptual confusion.

* **Cloud Well-Architected Frameworks** → Makes it easier to evaluate areas such as security, cost and operation with a checklist approach. Separate frameworks are available for AWS, Azure and GCP.

* **Cross-team glossary** → Keeping short definitions of key concepts in common areas like Confluence/Notion ensures that newly joined team members speak the same language from day one.
