---
layout: post
title: "CAP Approach and Event-Driven Design: The Invisible Backbone of Modern Systems"
date: 2025-11-14
description: "A short technical note summarizing the basic approach and actionable steps on CAP Approach and Event-Driven Design: The Invisible Backbone of Modern Systems."
categories: [CAP, Event-Driven]
lang: en-US
translation_key: "event-driven-cap-1e1a8a92"
permalink: /en/2025/11/14/cap-approach-and-event-driven-design-the-invisible-backbone-of-modern-systems.html
image: "/assets/img/5198cfa0-de03-4bb5-b637-e100abef9ab1.png"
---

While distributed systems are growing rapidly, the era of applications running on a single machine is long gone. We are now dealing with structures where hundreds of components operate simultaneously, are distributed in different regions, and are expected to have high fault tolerance. This transformation brings with it a fundamental question:

> **“What is more important, consistency, availability, or operability even during downtime?”**

Academic answer to this question → **CAP Theorem**
Practical equivalent → **Event-Driven Design**

## 1. The Big Picture in Distributed Systems

Modern systems:

* surviving under high traffic,
* continuing to work in partition scenarios,
* present data as consistently as possible

has to.

When moving from monolithic structures to distributed systems, one of the principles guiding the system is the **CAP Theorem**.

<div class="mermaid">
graph TD
    A[Distributed System] --> B(C: Consistency)
    A --> C(A: Accessibility)
    A --> D(P: Partition Tolerance)
</div>

## 2. CAP Theorem (Consistency – Availability – Partition Tolerance)

### 2.1 Description

The CAP Theorem states that a distributed system **cannot provide the C + A + P triple at the same time**.

When a network split occurs, the system is faced with the following choice:

* **C (Consistency)** → Keeping data up to date everywhere
* **A (Availability)** → System's ability to respond to every request
* **P (Partition Tolerance)** → Continues to work even during network splits

> Since division is inevitable, the real choice is **Will C or A come forward?**

## 3. CAP Concepts Simply

### **Consistency**

All clients see the same data. For example: "The balance in the bank should appear the same in all branches."

### **Availability**

The system responds to every request – even if the response is an error.

### **Partition Tolerance**

It means that the system continues to function even if the network is disconnected.

## 4. The Truth About the “Two Out of Three” Fallacy

CAP is not about choosing two options from a menu; **This is the reaction given when division occurs**.

The following table summarizes this behavior:

| Type | Provided by | What He Sacrificed | Usage Area |
|  | - |  | - |
| CP | Consistency + Cleavage | Accessibility | Banking, leader election systems |
| AP | Accessibility + Division | Consistency | Event-driven, log processing, IoT |

## 5. System Types According to CAP

<div class="mermaid">
    graph L.R.
    CP[CP Systems] C1(Consistent)
    CP C2(Partition Tolerant)
    CP -.->|Sacrifice: Accessibility| C.X.
    AP[AP Systems] A1(Accessible)
    AP A2(Partition Tolerant)
    AP -.->|Sacrifice: Instant Consistency| AX
</div>

### **CP Systems**

* Always produces accurate data.
* Some requests may be rejected at the time of division.
  Example: Zookeeper, Etcd.

### **AP Systems**

* Responds in all situations.
* Consistency is achieved **delayed**.
  Example: IoT data collectors, log systems, event-driven pipeline.

## 6. The Birth of Event-Driven Architecture

Typical problems with synchronous REST calls:

* high latency,
* chain dependencies,
* a single point of failure affects the entire system,
* scaling becomes difficult.

For this reason, modern structures turn to **asynchronous – loosely coupled – message-driven** setups.

The sequence diagram below describes an example process:

<div class="mermaid">
sequenceDiagram
    participant A as Order Service
    participant B as Payment Service
    participant C as Invoice Service

A->>Broker: event: OrderCreated
Broker->>B: OrderCreated
B->>Broker: event: PaymentCompleted
Broker->>C: PaymentCompleted

</div>

## 7. Event-Driven = A Natural AP Approach

Event-driven architecture does not require waiting; Everyone carries out their work independently.

Therefore:

* **Accessibility is high (A)**
* **Tolerant to network splits (P)**
* Consistency is mostly **eventual consistency**

>500 ms delayed stock update is generally not critical; but accessibility is vital for most systems.

## 8. CAP-Oriented Architectural Selection Examples| Scenario | Preference | Reason |
| -- |  | - |
| Money transfer | CP | Inconsistency is unacceptable |
| Log processing, notification | AP | Consistency may be delayed |
| IoT data collection | AP | It is more important to respond consistently |
| Config management | CP | All nodes should see the same config |

## 9. Technical Advantages of Event-Driven Architecture

### ✔ Scalability

Each service can grow according to its own load.

### ✔ Durability

Keeping the queue alive even when a service stops maintains transaction continuity.

### ✔ Performance

Requests are not blocked; The messaging system balances the load.

### ✔ Loose Commitment

It minimizes service dependencies.

### ✔ Extensibility

Adding a new service often just means writing an event listener.

## 10. Diagram: Flow of Event-Driven System

<div class="mermaid">
flowchart L.R.
    A[Producer Service] -->|Sends event| K((Event Bus))
    B[Worker Service] -->|Consumes Event| K
    C[Notification Service] -->|Consumes Event| K
    D[Analytics Service] -->|Consumes Event| K

K --> E[(Event Store)]

</div>

## 11. Things to Consider

Event-driven architecture is powerful but can become a mess if poorly designed:

* Correct determination of event boundaries
* **Idempotent consumers** (even if an event occurs again, the result should be the same)
* Retry + DLQ editing
* Event versioning
* End-to-end monitoring with Correlation ID
* Avoiding generating unnecessary events (event storming)

### Example: Idempotency Check

```pseudo
if event.id in processed_events:
    ignore
else:
    process(event)
    save(event.id)
```

## 12. CAP + Event-Driven in the Serverless Context

In serverless systems (AWS Lambda, Azure Functions) the following should also be taken into account:

*timeout
* cold start
* ordering
* retry policies

Therefore:

* consistent input/output rules,
* central logging,
* distributed monitoring,
* measurability

is of great importance.

## 13. Conclusion

The CAP Theorem reminds us that:

> **There is always a balance between consistency and availability in distributed systems.**

Event-driven architecture is:

> **By solving this balance in the AP direction, it enables building strong, flexible and scalable structures.**

Most modern architectures combine these three principles:

* **AP approach**
* **Eventual Consistency**
* **Event-Driven Architecture**

When designing a new system, ask yourself these questions:

> "What's really critical in this scenario: consistency or availability?"

This question allows you to choose the right architecture.

## Resources

* Arslan, F. M.: *“Important Points to Consider When Preparing a Serverless Architecture”*, October 202
