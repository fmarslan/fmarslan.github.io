---
layout: post
title: "Should I Write Everything? On Properly Leveraging External Tools"
date: 2026-01-07
description: "I explain why it is unsustainable to try to solve every problem ourselves while developing a system and how using the right tools in the right place adds strength to the architecture."
image: /assets/img/harici-araclardan-dogru-sekilde-faydalanma.png
tags:
  - engineering-culture
  - system-design
  - architecture
  - tooling
lang: en-US
translation_key: "harici-araclardan-dogru-sekilde-faydalanma-1cea0118"
permalink: /en/2026/01/07/should-i-write-everything-on-properly-leveraging-external-tools.html
---

While developing a system, the earliest thing I realized but the last thing I accepted was this:  
**Trying to write everything yourself is not difficult, it's a burden.**

It seems very tempting at first.  
“This library is not exactly what I wanted.”  
“I can write this more clearly.”  
“Let addiction be less.”  
“Let me be in control.”

But as the system grows, the team expands, and the work hits the real world, you face this reality:  
**If you write everything, you will maintain everything.**

This article is not about why you should avoid external tools;  
**It explains how and when to benefit**.

## Where Does the Reflex of Writing Everything Yourself Come From?

This reflex is natural in most engineering teams.  
It is especially common in young teams or early stage projects.

The reason is simple:

- Feeling of control  
- Perception of rapid progress  
- The idea that "addiction is risky"  
- Not trusting outside vehicles  

But this reflex turns into this in the long run:

- Special solutions that no one can touch  
- Internal tools that are not updated  
- Undocumented “our frameworks”  
- Critical parts that only one person knows  

And the worst:  
**The team slows down as the system evolves.**

## The Real Question Is: “Does This Problem Really Belong to Me?”

At some point, I started asking myself this question:

> “Am I really supposed to solve this problem,  
>or is this an issue that others have already solved for years?”

Examples are very familiar:

- Logging  
- Queue management  
- Retry & backoff  
- Authentication  
- Configuration management  
-Observability  
- Deployment orchestration  

Saying "I write myself" in these fields means  
**means postponing the main problem of the product**.

Because the user is not your logging infrastructure,  
**He cares about his job**.

## Tool Selection = Architectural Decision

Bringing an external tool into the project is an **architectural decision**, not just a technical one.

Wrong tool:

- It complicates the system  
- Increases the learning curve  
- Builds resilience within the team  

The right tool is:

- Takes load from code  
- Increases the team's speed  
- Standardizes  
- Shares care  

The critical point here is this:  
**The tool must solve the problem; It should not create new problems.**

## There Is No “Best Tool”, There Is “Appropriate Tool For This Problem”

Kafka or RabbitMQ?  
Redis or PostgreSQL?  
Kubernetes or Nomad?  
C#, Python or Java?

There is no single correct answer to these questions.  
But there are many wrong questions:

> “Everyone uses this, let's use it too.”

Over time, my approach evolved into this:

- **What's the problem?**
- **What is the load profile?**
- **What is the operational complexity?**
- **Does the team know this vehicle?**
- **Who will take over this system tomorrow?**

Sometimes it's not the "coolest" solution,  
**the most boring solution** turns out to be the most correct one.

## Not Afraid of Vehicles, Coloring the Ecosystem

Once upon a time I noticed this:  
We constantly rely on the same tools to solve the same problems.

However, the ecosystem is large.  
And this is not a threat, but an advantage.

- Using managed service for some work  
- Leaving some work to open source projects  
- Adopting an “as a service” approach in some places  

These do not weaken the architecture.  
On the contrary, **it helps you focus.**

The focus should be:

> “Where do I really create added value?”

## Team Truth: Making Decisions Without Knowing the Vehicle Culture is a Mistake

Another big misconception:  
**Criticizing the tool but not recognizing its culture.**

Many tools get a bad reputation because they are used incorrectly.

- Kafka is called "complex", but it's actually used in the wrong place  
- Kubernetes is trying to “overkill” but the team is not ready  
- Some frameworks are called "slow", but the problem is wrong modeling  

The important thing here is this:

> **The vehicle is not good or bad by itself.  
> The habits of the team using it are decisive.**

That's why when choosing a tool you should not only look at the technical documentation, but also  
It is necessary to look at the real competence of the team**.

## Maximum Benefit = Making Peace with the Current Structure

When developing a system, it can be tempting to tear everything down and rebuild it.  
But often this is unrealistic.

One of the most valuable lessons I learned was this:

> **Try to produce maximum benefit with whatever structure you have.**

This means:- Don't underestimate the language used  
- Scribble existing tools  
- Instead of saying "We wouldn't have done this in the first place"  
- “How can I get better results from this structure?” think  

This approach enlarges both the system and the team.

## Conclusion: Engineering is a Matter of Choice, Not Ego

When I look back today, I see this clearly:

- Writing everything yourself is not sustainable  
- The right tools won't slow you down, they'll speed you up  
- It's not the wrong vehicle, it's the vehicle used in the wrong place  
- Architecture that ignores the reality of the team remains on paper  

And perhaps most importantly:

> **Good architecture is not about controlling everything;  
> being able to share control in the right places.**

When this balance is established, the system not only works;  
**lives, grows and becomes transferable.**
