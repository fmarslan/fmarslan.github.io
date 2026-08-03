---
layout: post
title: "How Not to Use AI? Facts Through Experience"
date: 2026-04-06
description: "Real experiences on using AI: coding, research and risks. If you are not in control, AI will manage you."
image: /assets/img/403d882b-7907-47f5-9d06-098b3c873539.png
tags: [ai, software, engineering, architecture, productivity]
lang: en-US
translation_key: "ai-nasil-kullanilmamali-deneyim-uzerinden-gercekler-557dd77d"
permalink: /en/2026/04/06/how-not-to-use-ai-facts-through-experience.html
---

AI use is different for everyone. This article does not tell a "truth"; It contains only my observations and experiences.

Today, AI is generally used for 3 purposes:
1. Writing code  
2. Research  
3. Entertainment  

## 1. Writing Code

Starting a project has become very easy with AI.  
Scaffold, structure establishment, first deployment → provides significant speed.

But the real problem starts after revision.**

### Problem

There are two critical scenarios:

### a) Starting the project from scratch with AI

First version:
- Works nice  
- The document is correct  
- It is deployed  

But then:
- New needs come  
- Revisions begin  
- Context disappears  

Result:
- Code gets messy  
- Repetitions occur  
- No owner of the code remains  
- Becomes unmanageable  

### Solution approach

- Break down the big project  
- Perform small services  
- Manage each service with separate AI context  

In this way:
- Context remains small  
- It becomes intervenable  
- The code is not corrupted  

> If the spine is not intact, this approach will not work either.

### b) Breaking existing clean project with AI

The most dangerous scenario.

In particular:
- If there is a custom framework  
- If there is an internal library  

AI:
- He doesn't know your nature.  
- Uses old version information  
- Generates deprecated config  
- Adds code repetitions  

After a while:
> You become unable to recognize your own code.

### Critical risk

If you are not familiar with the code:

AI tells you "I did it" but:
- He may have written raw query instead of ORM  
- It may have left a security vulnerability  
- It may have impaired performance  

And you don't realize it.

At this point:
> You, not the AI, become the risk.

## 2. Research

The risk is greater here.

AI:
- Can give old information  
- May give incorrect information  
- Can adapt  

If you don't verify:

In real life:
- You make the wrong defense  
- You clash with experienced people  
- You lose confidence  

### Critical error

AI:
>Using it as a “responsive system”

Correct:
> “Using it like a search engine”

So:
- Inquire  
- Compare  
- Search for resources  
- Ask for evidence  

### Real world problem

AI tells you:
- “This is how you can do it”

But:
- Service does not work  
- Data is not correct  
- The system is at POC level  

You build a product on top of it → it explodes.

## 3. Entertainment

No problem here :)  
In fact, it is the healthiest area of use.

## Result

AI, if you don't set limits:

- Makes his own decisions  
- Builds architecture for you  
- Produces things you don't know  

And often:
> Does not match your needs

### The clearest takeaway

If:
- If you don't know what you're doing  
- If you are not in control  

> You're not working with AI, AI is using you.

### Last word

If you are not at the table:

> You are not part of the game, you are in the gamble.

## Reference

My previous thought post that complements this article: [Customer or Operator](https://fmarslan.com/2026/01/30/ai-gercegiyle-yuzlesmek-musteri-mi-operator-mu.html)
