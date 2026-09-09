---
layout: post
title: "Adapting Technology to Regulation, Rather Than Regulation to Technology"
date: 2026-07-15
description: "Lessons from electronic invoicing and industrial integration: separating shared models from local rules to prepare systems for regulatory change."
image: /assets/img/adapting-technology-to-regulation.png
image_alt: "Geometric modules fitting the stepped edge of a fixed boundary"
tags: [software-architecture, integration, e-invoicing, regulation, modularity]
lang: en-US
translation_key: "adapting-technology-to-regulation"
permalink: /en/2026/07/15/adapting-technology-to-regulation.html
published: true
---

Working on industrial systems, enterprise transformation, and electronic invoicing integrations, I have encountered the same engineering question in different settings: how can we bring systems governed by different rules into a shared structure without losing what makes each one distinct?

In SCADA and industrial integration, those differences usually involved devices, protocols, and conditions in the field. In my electronic invoicing work, country-specific standards, regulation, and the participants' legal responsibilities play a more prominent role in design decisions.

These experiences have led me to identify likely points of change before designing the architecture. While building today's connection, I also consider which requirements might change tomorrow and where the system should accommodate them.

## Bringing different systems into a shared structure

One goal of integration work is to reduce the development a participant must repeat for every new connection.

In electronic invoicing, this means allowing a company to use its existing format to reach different countries and networks. The platform processes the incoming document, adapts it to the destination's requirements, and manages the associated workflow.

I see some similarities with ETL systems: data is received, transformed, and transferred to a destination. Electronic invoicing also requires tracking responses and status changes after transmission. Technical delivery and acceptance within the business process may represent different states. When designing and coding the system, I therefore consider how the process reaches completion alongside the transformation itself.

My work with industrial data has also shaped this approach. Separating source-specific connection details makes shared processing steps easier to reuse.

The aim is to reduce the customer's integration burden as much as possible. Additional country-specific information may still be necessary, but processing and transmitting it should not require an entirely separate integration every time.

## Preserving differences alongside shared standards

Shared standards provide an important foundation for interoperability. Using the same document format, however, does not mean that the entire process works in the same way.

Authentication, transport mechanisms, certificates, responses, and business rules can differ. Contracts, data protection obligations, and country-specific responsibilities also influence the design.

When evaluating an integration, I start by understanding the participants' roles and the expected workflow. Which information is shared, and which belongs to a particular source or destination? Which steps can be reused, and which need separate treatment?

I assess the common data model through these questions as well. It is valuable to solve recurring operations through a shared structure, provided it preserves meanings specific to a country or network. Forcing every difference into one model can turn an early convenience into a later constraint.

## From regulation to engineering decisions

Working on systems subject to extensive regulation has shown me that technical requirements are not always available in an API document.

Questions about where data is processed, how it is stored, who can access it, and what an operation means need a technical interpretation. Understanding contracts, security requirements, and certification conditions contributes to that work.

At this stage, I focus on identifying which component, data flow, or operational decision a requirement affects. Turning an abstract condition into behavior that can be implemented and verified is an important part of engineering.

Consider a general example: access to a particular group of data is restricted. Hiding a field on a screen may address only part of the requirement. API permissions, background processing, and logging also need consideration. Understanding the requirement determines the scope of the change.

For this reason, I do not treat regulatory analysis as a one-time phase completed before development. As requirements become clearer or change, the technical design needs to be evaluated alongside them.

## Handling change where it belongs

To manage this variety, I value modular structures and, where needed, components that can be developed and operated independently.

In enterprise transformation and distributed systems work, I have seen the value of these boundaries in both implementation and operations. Separating a component is only part of the work. Its information dependencies and the effect of its changes on other components matter just as much.

In electronic invoicing, receiving, validating, transforming, transmitting, and processing responses can be considered separate responsibilities. These boundaries make it easier to address country-specific or network-specific changes in the relevant part of the system.

For example, I want to limit how far a change in transport method affects transformation rules. Similarly, I try to avoid turning a local validation rule into behavior imposed across the whole platform.

I do not measure flexibility by the number of services. Modularity concerns the organization of dependencies and responsibilities. Distribution can support that approach when independent execution, scaling, or operation is needed.

## Considering technology and team capability together

Working with different protocols, data formats, and security mechanisms broadens the knowledge an engineering team needs. When choosing technology, I consider how it fits development and operations as well as how it meets the immediate requirement.

Knowledge gained from writing code, building integrations, and troubleshooting directly informs architectural decisions. For example, understanding why a validation rule applies only to a particular country helps us assess whether that rule belongs in shared logic when the next change arrives.

It is unrealistic to expect a team to know every technology from the outset. A willingness to learn, the ability to understand unfamiliar systems, and the habit of sharing the reasoning behind decisions become valuable capabilities.

Discussing why an approach was chosen also helps the team respond more independently to new requirements. Knowing which decisions reflect technical preferences and which follow country-specific or network-specific obligations helps us determine the scope of a change. I care about developing that shared knowledge alongside the architecture.

## The principle behind my approach

These experiences have reinforced one principle for me: **understand regulation accurately and keep technology flexible enough to adapt to it.**

This requires clarifying requirements and responsibilities first, then distinguishing the areas that can be shared from those that need to differ. Technology choices become meaningful within that context.

One question I ask when designing a system is: when a new rule arrives, where will we make the change, and what else will it affect?

Being able to answer that clearly is one of the measures I use to assess how prepared an architecture is for change.
