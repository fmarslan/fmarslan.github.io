---
layout: post
title: "Managing Dependencies: Where Should Microservice Boundaries Be Drawn?"
date: 2026-08-04
description: "Microservices cannot eliminate dependencies. The practical goal is to contain how changes, latency, and failures propagate across service boundaries."
image: /assets/img/microservice-dependency-boundaries.png
image_alt: "Abstract geometric illustration of contained and cascading service dependencies"
tags: [microservices, dependencies, software-architecture, distributed-systems, integration]
lang: en-US
translation_key: "microservice-dependency-boundaries-2026"
permalink: /en/2026/08/04/managing-dependencies-and-microservice-boundaries.html
published: true
mermaid: true
---

No component in a software system is completely isolated. The important question is not whether a dependency exists, but how far a change, delay, or failure in one component can spread through the rest of the system.

We often say that microservices should be independent. Yet an order may require a payment, a payment belongs to a customer, and shipping depends on inventory. Absolute independence is neither realistic nor useful. The goal is to **understand dependency boundaries and control their effects**.

## What is a dependency?

A component depends on another component when it needs that component's availability, behavior, or data to perform its responsibility.

An order service may depend on:

- a payment service to collect money,
- an inventory service to check availability,
- a customer service to obtain a delivery address,
- a message broker to publish events,
- or a particular database schema to process data.

A dependency is not limited to one service making an HTTP request to another. Shared databases, common libraries, API and event contracts, deployment procedures, and recurring coordination between teams can all create dependencies.

## A dependency is not the same as a necessity

Business needs and technical design decisions should be separated. Requiring payment before confirming an order may be a **business necessity**. Making the order service call the payment service synchronously is a **technical design decision**.

The distinction becomes clearer when the same example is classified:

| Situation | Type |
| --- | --- |
| An order cannot be confirmed before payment | Business rule |
| Transaction records must be retained | Regulatory requirement |
| A separate service handles the payment | Service dependency |
| The payment result is awaited in the same HTTP request | Runtime dependency |
| Order and payment services must be released together | Deployment dependency |

We may not be able to remove a business or regulatory requirement. However, implementing it with a particular protocol, shared transaction, or shared database is usually an architectural choice. We can change that choice, reduce its impact, and design for failure.

## When does a relationship become a dependency?

If the answer to any of the following questions is yes, there is a dependency worth managing:

- Does my component stop working when the other component is unavailable?
- Does a change in the other component require a change in my code?
- Must the two components be released at the same time?
- Does my service need to know the other service's internal data model?
- Do both services write to the same database tables?
- Does one service's performance problem directly affect the other?
- Does one team repeatedly have to wait for another team to deliver a feature?

These questions show that dependencies exist beyond source code. Runtime, data, contract, deployment, and organizational dependencies create different kinds of risk.

### Runtime dependency

Service A waits for an immediate response from service B before completing an operation. If no fallback, cache, or deferred path has been defined, A cannot complete that flow while B is unavailable. As the call chain grows, latency and the probability of failure grow with it.

### Data dependency

One service needs data managed by another. That need is normal, but direct access to the same tables turns every schema change into a shared release problem.

### Contract dependency

Services communicate through APIs, events, or message formats. An uncontrolled contract change can break consumers. Asynchronous communication does not remove this dependency; it changes its form.

### Deployment dependency

If releasing one service requires several other services to be updated at the same time, the services may be physically separate but are not independently deployable.

### Organizational dependency

When one team repeatedly waits for another team's implementation or approval, a technical relationship has become an organizational bottleneck.

Shared libraries and infrastructure are not automatically harmful. They become a significant dependency when a shared change forces many services to upgrade together or prevents teams from working independently.

## Where should the microservice boundary be drawn?

Microservice architecture is not an attempt to remove every relationship between services. Its purpose is to let each service make decisions within its business area without knowing the internal design of other services or inheriting every temporary failure they experience.

A healthy microservice should:

- own a defined business capability,
- manage its own data,
- avoid direct access to another service's database,
- expose explicit and backward-compatible contracts,
- be independently deployable where practical,
- tolerate temporary failures within defined limits,
- and avoid knowledge of other services' implementation details.

The acceptable dependency boundary can be evaluated through a service's ability to **change, deploy, and fail independently**. If a small change requires many services to be updated together, the system is tightly coupled even if it is distributed across separate processes.

## How synchronous and asynchronous communication change dependency

With synchronous communication, the caller waits for the other service. This model is direct and easy to understand, and it can be appropriate for short operations that require an immediate answer. However, latency and failures propagate through the call chain.

With asynchronous communication, a service publishes an event that other services process later. The services no longer need to be available at the same moment, but message ordering, retries, idempotency, observability, and eventual consistency must now be managed.

<div class="mermaid">
flowchart LR
    subgraph S["Synchronous flow"]
      O1["Order"] -->|"waits"| P1["Payment"]
      P1 -->|"waits"| I1["Inventory"]
    end
    subgraph A["Asynchronous flow"]
      O2["Order"] --> B(("Event broker"))
      B --> P2["Payment"]
      B --> I2["Inventory"]
    end
</div>

Asynchronous communication does not eliminate dependency. When the message is reliably accepted and persisted, the order service no longer depends on the payment service being available at that exact moment, but it still depends on the event contract and messaging infrastructure. The dependency is loosened in time; the responsibility remains.

## Useful dependency and harmful coupling

Delegating payment processing to a service that owns that business capability can be a useful dependency. Requiring the order service to understand the payment service's internal tables, classes, or release schedule is harmful coupling.

| Manageable dependency | Harmful coupling |
| --- | --- |
| Based on a clear business responsibility | Responsibility boundaries are unclear |
| Uses a stable contract | Relies on internal implementation details |
| Is one-way where practical | Is bidirectional or cyclic |
| Defines failure behavior | Propagates failures through the system |
| Allows independent deployment | Forces coordinated releases |
| Is observable and testable | Becomes visible only in production |

Well-designed dependencies separate responsibilities, allow teams to specialize in business domains, and let components scale according to their own workload. Uncontrolled dependencies turn small changes into large coordination efforts, make test environments difficult to create, and tie system performance to the slowest component.

The result can be a **distributed monolith**: a system made of separate services that still have to be developed, tested, and released together. It combines the coupling of a monolith with the network and operational costs of a distributed system.

## How should dependencies be managed?

### Define boundaries around business capabilities

Design services around business responsibilities rather than technical layers. Generic services used by everyone can gradually become central bottlenecks.

### Give every data set an owner

The authoritative owner of the data and its write rules should be explicit. Other services may access it through defined APIs or events and keep controlled local copies when necessary, but they should not take ownership of the source's write rules.

### Evolve contracts compatibly

API and event schemas are contracts between services. Contract tests and deliberate versioning help prevent a provider change from unexpectedly breaking its consumers.

### Question long synchronous call chains

When a single user request calls many services in sequence, both latency and failure probability increase. If the user does not need the complete result immediately, part of the work may be handled asynchronously.

### Treat failure as a normal design condition

Timeouts, bounded retries, circuit breakers, idempotency, queues, and appropriate fallback responses can contain the impact of a dependency. Unbounded retries deserve particular care because they can send even more traffic to a service that is already struggling.

### Prevent cyclic dependencies

If service A depends on B and B also depends on A, revisit the service boundaries or ownership of the workflow. A cycle can be evidence that a separate business capability has not yet been recognized.

### Make dependencies visible

Service maps, distributed traces, metrics, and correlated logs should reveal which services depend on one another. A relationship that is missing from the documentation does not disappear in production.

## Before introducing a new dependency

The following questions form a useful review checklist before adding a service call, shared library, or event contract:

1. Is this relationship a genuine business requirement or a consequence of the current design?
2. Does the user need the result immediately?
3. What happens when the called service is unavailable?
4. Can the operation continue with cached or slightly stale data?
5. Can the work be completed later?
6. Who owns the contract, and how will it evolve?
7. Can the services still be deployed independently?
8. Does the design require direct access to another service's database?
9. Is the dependency becoming bidirectional or cyclic?
10. Can we observe the effects of failures, delays, and changes in production?

## Conclusion

The goal of microservices is not zero dependency; that would be unrealistic for a system whose parts collaborate. The goal is to make dependencies explicit, bounded, mostly one-way, resilient, and open to change.

One question provides a useful starting point:

> Does a change, delay, or failure in one service unnecessarily affect the code, release schedule, or runtime behavior of other services?

If the answer is repeatedly yes, the relationship is more than a natural business dependency: it is tight technical coupling. Good architecture does not hide dependencies or pretend to remove them. It makes them visible, draws deliberate boundaries around them, and prevents their effects from spreading through the system without control.
