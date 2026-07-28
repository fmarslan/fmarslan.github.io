---
layout: post
title: "Why Is Debug Not Enough in Event-Driven Architecture? On Tracing, Replay and True Observability"
date: 2025-11-29
description: "Personal and practical observations on how the debug approach changes when moving from monolith to distributed systems."
image: /assets/img/20b9c292-816b-43cc-a652-1de9cc4ca2f2.png
tags:
  - debugging
  - event-driven
  - distributed-tracing
  - observability
  - system-design
lang: en-US
translation_key: "event-driven-mimaride-debug-neden-yetmez-b1b14ec9"
permalink: /en/2025/11/29/why-is-debug-not-enough-in-event-driven-architecture-on-tracing-replay-and-true-observability.html
---

The most obvious feeling I experienced when I switched to event-driven architecture was not being able to see the entire flow.  
I look at the API log, I look at the worker log, I check if there are messages in Kafka...  
But it was not possible to put the pieces together. I know what happened, but it was hard to see the “how”.

Things seemed simpler in the monolith days.  
One process, one thread, one call stack…  
When you pressed F5, the system would move forward with you.  
When we switch to an event-driven structure, that order disappears.  
The event queues, the worker changes, the external API is delayed, the retry comes into play, a new path opens in DLQ... Then the flow ceases to be a straight line.

While I was in this mess, I came across distributed tracing.  
When we added Trace ID, every step moving through the system began to be connected to each other.  
When the time is extended, which service is waiting, how long the external API is delayed... all of them become visible on the screen.  
That was the first time I clearly realized that something was "flow".

---

## What Does the Log Show and What Does It Not Show?

The log is still necessary, even indispensable.  
But the log only sheds light on the moment when the event occurred.  
The links are entirely up to your interpretation.

For example, let's consider a flow like the following:

<div class="mermaid">
sequenceDiagram
    participant API as API
    participant MAP as Mapper
    participant K as Kafka
    participant W as Worker
    participant EXT as External API

    API->>MAP: Input
    MAP->>K: Create event
    K->>W: Worker consumed
    W->>EXT: External API call
    EXT-->>W: Response returned
</div>

All of these steps are in separate logs.  
It's like one person's notebook is in one place and the other is in another.  
It takes extra effort to put them all side by side.

---

## Why is Debug Logic Different in Distributed Systems?

Event-driven architecture inherently introduces some complexities:

- The same event can pass through different services  
- Adds queue scheduling  
- Retry changes the flow  
- DLQ creates a different pipeline  
- Latency of external APIs affects  
- If worker dies, another worker continues  

In this case, the "let me stop the code and look" approach naturally does not work.  
It's no longer about stopping the code, it's about following the flow.

---

## Clarifying the Flow with Distributed Tracing

Tracing brings together all parts of the system through a common identity.  
In this way, you can see where a request passes and what it experiences on a single screen.

<div class="mermaid">
flowchart TD
    A[API] --> B[Event Producer]
    B --> C[Kafka]
    C --> D[Worker]
    D --> E[External API]
    E --> F[After Worker]
    F --> G[Final Transaction]

    subgraph TekTraceID
    A.
    B.
    C.
    D.
    E.
    F
    g
    end
</div>

Thanks to this image, information such as "delayed here", "got an error here", "returned from here" are now fully visible.

---

## Replay: The Simplest Form of Error Solving

After a point, just seeing tracing is not enough.  
Being able to take the event that falls into DLQ and run it locally allows you to reproduce the error as it is.  
This shortens the process of finding and solving the error considerably.

Replay is a truly relaxing method in distributed systems.

---

## Minimizing Local Environment

At first, I was trying to get the whole system up and running locally.  
Kafka, PostgreSQL, Redis, workers, gateway, discovery, services…  
But after tracing came into play, I realized that it did not make much sense to regenerate the entire system locally.

Now I only run the relevant part locally and follow the rest of the flow via tracing.  
This was a much calmer and more sustainable method.

---

## Simple But Useful Notes

- It is difficult to follow event-driven architecture without Trace ID  
- Log format should be as standard as possible  
- DLQ replay should become part of the work culture  
- Local debug should be isolated  
- Tracing and observability are now an extension of debug

---

## ResultIn distributed architecture, the concept of debug turns into a perspective rather than a tool.  
It is no longer the individual steps that are important; the overall journey of the event.  
Tracing and replay make this journey easier to understand and make the system more predictable.
