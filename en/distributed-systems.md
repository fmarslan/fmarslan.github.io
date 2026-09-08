---
layout: page
title: Distributed Systems Engineering
permalink: /en/distributed-systems/
lang: en-US
alternate_url: /dagitik-sistemler/
description: Fatih Mehmet Arslan (fmarslan) on distributed systems engineering with Java, .NET and Kafka; data ownership, asynchronous flows and microservice boundaries.
---

## Data ownership before service count

My distributed systems work involves Java and .NET services, Kafka flows, asynchronous processing and multi-tenant platforms. I focus on the behaviour of the whole flow, including the points where a message is delayed, a dependency fails or two services interpret the same value differently.

A service boundary is useful when ownership and failure behaviour are clear. Adding another process does not by itself make a system easier to maintain. Shared domain values, in particular, require decisions about who defines them and how changes reach consumers.

## Selected technical writing

These articles connect implementation choices to the architectural boundaries they create:

- [Managing domain values in distributed systems]({% post_url en/2026-07-04-managing-domain-values-in-distributed-systems %})
- [Deciding when to split or merge services]({% post_url en/2025-11-23-breaking-up-or-merging-services-my-guide-to-bounded-context %})

## From design to production

Code review, observability and troubleshooting are part of this work. I use production feedback to examine assumptions about data, dependencies and service boundaries. See [my experience and technologies]({{ '/en/cv/' | relative_url }}), [software architecture]({{ '/en/software-architecture/' | relative_url }}) and the [regulated Peppol integration context]({{ '/en/peppol-integration/' | relative_url }}).
