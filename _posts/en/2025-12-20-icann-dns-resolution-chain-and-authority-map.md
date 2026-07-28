---
layout: post
title: "ICANN, DNS Resolution Chain and Authority Map"
date: 2025-12-20
description: "A guide explaining why DNS is hierarchical and how the ICANN, registry, registrar, resolver and authoritative DNS roles are distinguished."
image: /assets/img/icann-dns-kapak.png
tags:
  - dns
  - icann
  - networking
  - registry
  - resolver
categories:
  - networking
lang: en-US
translation_key: "icann-dns-cozme-ve-yetki-zinciri-611d640b"
permalink: /en/2025/12/20/icann-dns-resolution-chain-and-authority-map.html
---

When talking about DNS, most explanations start with the root–TLD–authoritative order. Let me go in reverse: **Resolving a domain = knowing the IP**, but there is no single authority that does this. DNS is deliberately fragmented, with ICANN on top.

## What does ICANN do and what does it not do?

ICANN

* Does not receive DNS query,
* Does not return IP,
* It does not say "This domain is this IP".

In other words, it has no direct contact with the user. ICANN's role is to define who has say in the namespace and coordinate the root zone. “Who owns .com, to whom has .tr been transferred?” The answers to these questions are determined by this coordination. It is best to think of ICANN as a center that does not go into the field and draws the authority map.

## Why is DNS hierarchical?

If kept in a single location, it would be both unscalable and unmanageable from a security and policy standpoint. So the structure is layered:

```
Root (.) → TLD (.com, .tr, .eu) → Domain (example.com) → Subdomain (api.example.com)
```

Each layer delegates authority to the next layer. This ``delegation`` logic is the backbone of DNS.

### Root zone and root server

Root zone “I don't know the IP, but I know which TLD will look at which name server.” means. Ask the root server "What is the IP of example.com?" You don't ask; “Where is .com?” you ask. The answer is “Go to these name servers for .com”. The root server never resolves the domain, it just redirects it.

## What does Registry do?

Registry is the official registry of a TLD. For example, the .com registry knows which domains are registered, which authoritative DNS it uses and, if any, DNSSEC DS records. But it does not say "The IP of this domain is this" and does not respond to the DNS query. Its job is to say, "The authoritative DNS for this domain is here, ask it." So the registry does not provide the solution; is the intermediate authority.

## Where does the Registrar fit in?

The Registrar stands entirely on the commercial side. User buys domain, renews, changes NS; The registrar processes this information into the registry. It has no active role in the solution chain, it is the configuration gate itself.

## When will Resolver hit the field?

Where the real work is done is the recursive resolver. The browser requests the IP for `api.example.com`, the resolver runs with the following flow:

1. It looks at the cache, if there is one, it returns directly.
2. Otherwise it asks root: “Where is .com?”
3. Asks the TLD: “What name server is example.com on?”
4. Go to Authoritative DNS and ask “What is the IP of api.example.com?” says.
5. It receives the response, caches it, and returns it to the user.

Resolver is stubborn; It goes through the entire chain itself and verifies without trusting anyone.

## Authoritative DNS has the final say

At the end of the chain is authoritative DNS and that's where records like `api.example.com → 172.x.x.x` are actually kept. After the resolver receives this answer, the query ends and does not go up again.

## Why are registry and resolver confused?

Although they are both thrown into the same basket as “DNS side”, the roles are different:

* **Registry:** “Where is the authoritative DNS for this domain?”
* **Resolver:** “What is the IP of this domain?”

Registry acts like a notebook, and resolver acts like a researcher.

## How is DNSSEC added to the chain?

DNSSEC root → TLD → domain “Did this information come from an authorized source?” answers the question cryptographically. The starting point of trust is the root key on the ICANN/IANA side. ICANN still doesn't go into the field, but it does initiate the chain's trust.

## To sum up

* ICANN DNS does not resolve; defines authority.
* Registry does not keep IP; NS holds.
* Resolver is the party that does the work.
* DNS works entirely with the logic of delegation of authority.
* At the end there is authoritative DNS and the real records are there.

A controlled chaos that is not centralized but not dispersed either. That's the beauty of DNS.
