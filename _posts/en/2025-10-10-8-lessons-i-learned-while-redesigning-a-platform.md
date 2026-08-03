---
layout: post
title: "8 Lessons I Learned While Redesigning a Platform"
date: 2025-10-10
description: "A brief technical note outlining the basic approach and actionable steps on 8 Lessons I Learned Redesigning a Platform."
categories: Architecture
lang: en-US
translation_key: "bir-platform-tasarlarken-ogrendigim-8-ders-1e6ee684"
permalink: /en/2025/10/10/8-lessons-i-learned-while-redesigning-a-platform.html
image: "/assets/img/sdasvfdw.png"
---

Designing a platform from scratch teaches people a lot not only technically but also intellectually. The following items are the most valuable lessons that I have truly experienced throughout this process and that still shape my work today.

## **1. The Top Question: What Are We Actually Trying to Do?**

One of the biggest mistakes I made in the past was to start the project by **choosing technology**. However, the questions that needed to be answered first were much simpler:

* How critical is consistency in this system?
* What level should accessibility be?
* In which steps can delay be tolerated?
* Which fields require instant accurate data?

When these questions become clear, both the technology decision and the architectural form emerge spontaneously.

## **2. You Need to Start Separating Fields, Not Writing Code**

At first, I was focusing directly on writing code. Over time, I realized that the main issue is not the code, but **dividing the meaning correctly**.

When you break the platform into meaningful parts:

* the team works in parallel easily,
* complexity decreases,
* The limits of responsibility become clear.

First, it is necessary to solve this: “Which job belongs to which field?”

## **3. Asynchronous Flow is the Foundation for True Performance**

Synchronous calls (e.g. REST) become brittle when traffic increases. When a service is delayed, the entire chain is affected.

In an asynchronous structure, the flow works much more smoothly:

* completes the service task,
* generates an event,
* other services process that event when appropriate.

This model offers both a fast and durable structure.

## **4. Errors Should Be Managed, Not Hided**

For a while, I thought it was "success" that mistakes were not visible. I was wrong.

> Every mistake that is hidden comes back in a bigger way one day.

That's why three basic structures are essential in a solid architecture:

* **idempotency:** Even if the same event occurs again, the result should not change
* **retry:** temporary problems must be tried again
* **DLQ:** unresolvable events should be placed in a separate queue

Error is not hidden; **managed, monitored, classified.**

## **5. If You Bury the Rules in the Code, Every Change Will Become Torture**

As the platform grew, I saw that:

* customer rules are changing,
* country rules change,
* formats change,
* processes are evolving.

When these rules are embedded in the code:

* every change requires deployment,
* variations are increasing,
* processes become fragile.

The correct approach is simple:

> **“The rule should be in the config, the behavior should be in the code.”**

In this way, the platform becomes flexible and much easier to manage.

## **6. Writing Everything From Scratch Isn't Heroism, It's Technical Debt**

At first, I had the approach of "I write the best". Then I realized:

* you cannot solve every problem yourself,
* even if you solve it, it won't be sustainable,
* Excellent solutions have already existed for years.

The correct question was:

> “What is the best open source or built-in tool to solve this problem?”

Kafka, Redis, Postgres, S3, NATS, XSLT, OpenSearch… Each of them is an expert in their field. Choosing the right tool both strengthens the platform and accelerates it.

## **7. What Can the Team Do? As Important as Architectural Decision**

Perfect architecture is only the architecture that the team can carry.

Therefore, I now pay more attention to:

* Which language does the team speak well?
* With which tools do they work more comfortably?
* Is their knowledge sustainable?
* how high is the learning curve?

Team harmony as well as technical choice ensures the longevity of the platform.

## **8. It's Easy to Criticize a Tool; Understanding Its Culture is Valuable**

Every vehicle has a work culture and a world view.

If you try to use Kafka like RabbitMQ or Redis like Postgres, you will naturally run into problems.

So now I ask this first:

* “Why does this vehicle work like this?”
* “What problem is it designed to solve?”
* “In what situation is it appropriate and in what situation is it not?”

Criticizing a tool without understanding it is the fastest way to make wrong architectural decisions.

# **Conclusion**

This process taught me eight important truths:

* Ask the right question first,
* Clarify business areas,
* Think asynchronously,
* Manage errors,
* Extract rules from code,
* Use the ecosystem,
* Design according to the team,
* Learn the culture of the vehicle you use.Designing platforms; It means **making the right decisions at the right time** rather than choosing technology.
