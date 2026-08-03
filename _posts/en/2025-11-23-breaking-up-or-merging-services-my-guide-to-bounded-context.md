---
layout: post
title: "Breaking Up or Merging Services? My Guide to Bounded Context"
date: 2025-11-23
description: "I explained with daily experiences how I made my decision without breaking away from the domain language when determining service limits."
image: /assets/img/bounded-context-abstract.png
tags:
  - architecture
  - domain-driven-design
  - microservices
lang: en-US
translation_key: "bounded-context-karari-nasil-verilir-774244af"
permalink: /en/2025/11/23/breaking-up-or-merging-services-my-guide-to-bounded-context.html
---

The question I get most often when designing a new platform is: **“Should we build this service separately or add it to the existing service?”**  
Nobody wants to listen to microservice beautification anymore; Everyone is looking for a clear answer that works in real life.

My answer is very clear today:  
**“This decision is made not by code, but by bounded context.”**

The following notes are a summary of the approaches I stumbled upon on real projects and now use as a guide in every architectural decision.

## 1. Service Fragmentation is a Domain Decision, Not an Architecture Decision

I used to believe that “the smaller the service, the better”.  
Then I realized that a service divided in the wrong place does much more damage than a monolith that is not divided at all.

Because the service boundary is drawn not by looking at the folder structure, but by looking at the meaningful boundaries of the domain**.

<div class="mermaid">
flowchart TD
    Platform --> DogruContext
    Platform --> YanlisContext
    CorrectContext --> CleanBorders
    WrongContext --> Confusion
</div>

Services stuck in the wrong context tire both the code, the operation and the team at the same time.

## 2. “In What Sense Is This Data Alive?” The Question Clarifies Everything

What we call bound context is actually the answer to a very simple question:  
**“In what area and in what sense does this knowledge live?”**

The same concept can take on three different identities in three different contexts:

- `invoice` in the **Finance** context → financial record  
- `invoice` → shipment trigger in **Logistics** context  
- `invoice` → customer behavior in **CRM** context

That's why a single "invoice service" is often not as innocent as it seems.

## 3. Signs That Let Me Know I Need to Split Serving

If the following symptoms occur, I have exceeded the service limit:

1. If there are **three different workflows** such as mapping + validation + billing in a single service  
2. If new customer rules turn into an **if/else jungle**  
3. When a part of the code is changed, another unrelated part breaks.  
4. The operations team constantly asks "Which service is this job in?" if he asks  

When these signs come, I separate the services like a knife cut.

## 4. Situations That Scream That You Shouldn't Interrupt the Service

Sometimes fragmenting services really adds unnecessary overhead.  
The service should be left in one piece in the following cases:

- If the data model is fed from a **single source**, splitting it into two services creates only data transport traffic  
- If the workflow flows like **one breath**, splitting it artificially disperses the flow  
- If the code is already readable and small, there is no need to split it to "make it micro"  
- Sharding creates unnecessary network call, tracing and monitoring costs  

Not every division is correct. Sometimes a combined structure is healthier.
## 5. Who is the Real Owner? (The Most Critical Question)

A service is not owned by another service.  
**The real owner is the context itself.**

Example:

- Party → Identity context  
- Invoice → Finance context  
- Mapping → Transformation context  
- Routing → Integration context  

If the meaning of a concept changes depending on the context, compressing that structure into a single service will inevitably cause problems in the future.

## 6. I Don't Make Decisions Before Drawing the Dependency Flow

Even a simple flowchart reveals how services actually talk:

<div class="mermaid">
flowchart L.R.
    Collect --> Prepare
    Prepare --> Validate
    Validate --> Map
    Map --> Send
</div>

If the steps of this flow belong to different contexts → it is correct to split it.  
If it belongs to the same set of meanings → there should be only one service left.

## 7. “How Small?” Not → “How Significant?”

This was the turning point for me.  
I used to think that I was getting closer to the truth as I made the service smaller.

Now I know:

> **What is important is not the size of the service, but whether it is within a meaningful limit.**

Sometimes the meaningful limit produces a large serve,  
Sometimes a little service solves the whole problem.<div class="mermaid">
flowchart L.R.
    Monolith --> Unnecessary Fragmentation
    Unnecessary Fragmentation --> LatencyArtisi
    Unnecessary Partition --> Operation Cost
    Unnecessary Fragmentation --> Commitment Confusion
</div>

Breaking it down in the wrong place is the quickest way to technical debt.

## 8. 6 Questions I Ask Myself Before Making a Decision

These questions lead me to the 90% correct decision:

1. Does this job really have a **separate lifecycle**?  
2. Is the data model **independent** of others?  
3. **Who is affected when a change occurs?**  
4. Does this workflow by itself **make sense**?  
5. When you separate it, does **traffic increase or decrease?**  
6. Does the team have the **operational capacity** to handle this distinction?

If most of the answers are "yes", I separate them.  
If most of them are “no”, I leave it as a single service.

## 9. Microservice is an Output, Bounded Context is a Decision

For me the bottom line is this:

- Microservice → is the resulting result  
- Bounded context → is the decision that needs to be made  

First draw the correct context boundaries, the rest will fall into place automatically.

What's wrong: opening a service for every function.  
What's wrong: filling all functions into a single service.

The right thing to do: **follow the natural boundaries of the domain.**

## 10. Courage to Disassemble, Wisdom to Unite

Determining the service limit is an art of balance.  
My guide points are as follows:

- Real limits come from the domain  
- Meaningful boundaries increase team productivity  
- Unnecessary microservice → mess  
- Unnecessary combination → future problems  
- It takes courage to smash  
- But merging is often the wiser decision  

Last word:

> **Dividing services is not a decision, but a process of discovering the domain.  
> Once you understand the domain, the services automatically take the correct form.**
