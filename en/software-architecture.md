---
layout: page
title: Software Architecture
permalink: /en/software-architecture/
lang: en-US
alternate_url: /yazilim-mimarisi/
description: Software architecture by Fatih Mehmet Arslan (fmarslan), connecting service boundaries, data ownership and production experience in Java and .NET systems.
---

## Architecture close to implementation

I am Fatih Mehmet Arslan, a software engineer who stays involved from technical decisions through implementation and production troubleshooting. My work spans public-sector systems, energy telemetry, retail, SaaS and regulated integrations.

For me, architecture starts with the constraints of the system: who owns the data, which failures must be contained, and what the team can operate. Choosing microservices is a consequence of those decisions, not a starting requirement.

## Boundaries, regulation and operational trade-offs

When a platform grows, splitting a service can reduce coupling but also introduce network failures and consistency problems. In regulated systems, data location and audit requirements also influence where a boundary belongs. The following articles explain the reasoning behind these decisions:

- [How I decide whether to split or merge services]({% post_url en/2025-11-23-breaking-up-or-merging-services-my-guide-to-bounded-context %})
- [Sovereign cell architecture and regulation-oriented design]({% post_url en/2026-04-27-sovereign-cell-architecture-regulation-oriented-system-design %})

## Related experience

Continue with [distributed systems]({{ '/en/distributed-systems/' | relative_url }}) and [Peppol integration]({{ '/en/peppol-integration/' | relative_url }}), or read [my professional experience]({{ '/en/cv/' | relative_url }}) and [how I work]({{ '/en/about/' | relative_url }}).
