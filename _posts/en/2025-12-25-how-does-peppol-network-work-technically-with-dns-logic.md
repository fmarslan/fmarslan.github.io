---
layout: post
title: "How Does Peppol Network Work Technically? (With DNS Logic)"
date: 2025-12-25
description: "Technical guide explaining the roles of SML, SMP, Participant ID and Access Point in the Peppol network by comparing them directly with the DNS resolution logic."
image: /assets/img/peppol-network-cover.png
tags:
  - peppol
  - e-invoice
  - networking
  - dns
categories:
  - networking
lang: en-US
translation_key: "peppol-aginin-dns-mantikla-calisma-prensibi-92c2fa1a"
permalink: /en/2025/12/25/how-does-peppol-network-work-technically-with-dns-logic.html
---

When trying to understand Peppol, dozens of terms such as SML, SMP, Access Point, Participant ID may seem like complex topics that need to be memorized. However, the essence of the matter is based on the following question: **“How do I deliver an electronic document to the right institution, to the right technical endpoint, securely?”** This is the same problem that DNS has been solving on the Internet for years. Peppol architecture also re-establishes the authority delegation and resolution chain we learned from DNS for institutions and e-documents.

If you are wondering how DNS works layer by layer, I suggest you first look at this article: [ICANN, DNS Resolution Chain and Authority Map](/networking/2025/12/20/icann-dns-cozme-ve-authority-chain.html). The explanation here assumes that you know that chain.

## What is Peppol Network?

Peppol is neither a central platform nor a single software product. You can think of it like the Internet: Rules, roles, technical standards and trust framework are defined; Everyone builds their system in accordance with these rules. No one “runs Peppol”, but everyone can work in harmony with Peppol and exchange documents on the same network.

## Main idea that matches DNS exactly

The basic question for DNS is “Where is this thing on the network?” In Peppol, the question is the same: **“Where is the document reception point of the institution with this Participant ID?”** Participant ID is an identity in the format `0088:5790000435968`, and in Peppol it is what `example.com` is in DNS. Nobody thinks about IP; Everyone says "Send to this institution" and the rest is completed by the solution chain.

## SML: Root directory (like Root DNS)

When a Participant ID arrives, the first question to be answered is: “In which SMP are the technical records of this institution stored?” SML maintains this directory information. Does not know any document, Access Point or format; It just says "This participant's records are in this SMP". It is the exact equivalent of root zone → TLD redirection in DNS.

## SMP: Authoritative technical fact (like Authoritative DNS)

SMP is where authorized records reside for a particular participant. Here the following is kept:

* What document types and processes are supported
* Which format (e.g. UBL)
* Which Access Point to go to
* Technical endpoint address and protocol information

SMP content is in Peppol what IP/MX/SRV records are in DNS. It is not centralized; Each organization or service provider can host its own SMP.

## Endpoint and Access Point

The information that comes at the end of the analysis chain is "This participant receives a document via this Access Point by connecting to this endpoint with AS4." No data is sent before it reaches here. The Access Point layer does the actual communication: AS4 messaging, certificate verification, signing, encryption, retry, producing proof of delivery... Sender and receiver systems never talk directly, just like email servers talk to each other, there is always Access Point → Access Point communication.

## Peppol flow (like DNS chain)

1. The system says, “This document will go to the following participant.”
2. The sending Access Point looks at the SML.
3. SML returns the corresponding SMP.
4. Provides SMP Access Point + endpoint information.
5. The sending Access Point connects to the receiving Access Point and transmits the message.

This flow is the exact equivalent of not sending an HTTP request without DNS resolution.

## Multiple Access Point & SMP separation

Just as DNS supports multiple IPs (load balancing / failover) for the same domain, Peppol also allows multiple Access Points or regional distribution setups for the same participant. Additionally, it is not mandatory for SMP and Access Point to be on the same provider. In DNS, another company can host authoritative DNS, another company can run the web server; This distinction is also common in Peppol.

## Why is it designed like this?

The aim is to ensure that the network does not come to a halt when a single country, company or platform collapses. There is no central system, no single point of failure; Everyone is responsible for their own part. It is difficult to learn at first glance and troublesome to install, but it provides a reliable structure in the long run.

## Brief technical summary

* Peppol = DNS-like resolution for e-documents + secure transport
* Participant ID = domain name
* SML = root directory
* SMP = authorized technical registration
* Access Point = actual communication server
* Data is never sent before analysis is finishedWhen you look at it this way, you clearly see why Peppol is so “rigid” and layered: The aim is to establish a reliable and distributed document distribution network on a global scale.
