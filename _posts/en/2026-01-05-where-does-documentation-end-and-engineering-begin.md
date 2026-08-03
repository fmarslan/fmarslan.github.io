---
layout: post
title: "Where Does Documentation End and Engineering Begin?"
date: 2026-01-05
description: "An evaluation of the engineering decision between adhering to the document and exploring the vehicle's capabilities, using the Kong example."
tags: [engineering, documentation, kong, architecture, devops, mindset]
image: /assets/img/258f48f7-8297-4ca3-b0c7-dda1df84b119.png
lang: en-US
translation_key: "dokumantasyon-nerede-biter-muhendislik-nerede-baslar-2b7d5ef9"
permalink: /en/2026/01/05/where-does-documentation-end-and-engineering-begin.html
---

Sometimes when using a library / product / service, the first reflex is: open the document, copy the example, apply "best practice".

This is not wrong. But after a while, you realize that if you proceed by just looking at the document, you are actually passing through half of the potential offered to you without ever seeing it.

Because most of the time the documentation describes: **most common scenario**.  
Real life is not “common” most of the time. Messy. Dirty. Strange. And it's urgent.

## The document is a guide, not a law book

Products are made for a purpose. But does that purpose have to be the only correct way the product can be used?

I don't think so.

“Start here,” the document says.  
He doesn't say, "Stop here."

The point is this: when you start looking at the product not in terms of **what it is** but in terms of **what capabilities it has**, new doors open.

## They were describing Kong as edge, I used it inside

It was the first time I used Kong. Everyone was calling Kong "edge, the door to the outside world". Outside traffic, auth, rate limit etc.

But my problem wasn't the traffic coming from outside.

There were many services inside and all of them were connected to different 3rd party services. Each team has a different method, a different header set, a different retry logic... At some point, integrations start to become a "habit" rather than a "service". It even becomes difficult to keep track of who is calling what and how.

At that time I thought:

Kong is already a proxy.  
There is a plugin.  
I can observe traffic.  
I can cache.  
I can set an alert.  
I can even standardize small behaviors there when necessary.

So why should there only be a door facing the outside world?

I took Kong and put it in front of the traffic going to 3rd party services. All inside services started going via **Kong** instead of calling outside services directly.

Conclusion?

- Inside, everyone used a **standard interface**.
- 3\. I watched the traffic going to the party shuttles **from one place**.
- I set up **center** things like alert, cache, throttling.
- “Who called what, when and what?” The question suddenly became answerable.

The document did not say "do this". But it worked. And seamlessly.

## “Imagination” is not randomness

The imagination here is not something like “maybe we can try this too”.

More like this question:

> What basic problems can this tool solve, and what other problems would I apply it to?

This view takes you out of “how to use the product” and into “what can be done with the product.”

## There is a price: just documentation is no longer enough

When you enter this path, you also accept this:

- You can rely on undocumented behavior.
- At some points you start using it like "feature", but actually that thing is not a **guarantee**.
- Documents are not enough, **you have to read code**.
- You follow Issues.
- You contribute if necessary.
- And most importantly: you say, "If it breaks, I'll take care of it."

Is it risky? Yes.  
But what we call progress is already a bit risky.

## If the light bulb remained a light bulb...

If the first light bulb had remained just "the thing that gives out light" and no one had thought "this is also a controlled resistor", technology would probably not have reached where it is today.

Sometimes what increases the value of something is not using it better for its "designed purpose"; **to be able to carry it beyond that purpose**.

## Are we driving the tool or is the tool using us?

The line in my head is this:

- Documentation: safe start
- Engineering: understanding boundaries and expanding them when necessary

The real question perhaps is this:

Do we use the tools, or do we live within the boundaries that the tools draw for us?
