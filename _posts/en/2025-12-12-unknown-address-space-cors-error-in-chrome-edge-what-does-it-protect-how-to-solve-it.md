---
layout: post
title: "'unknown address space' CORS error in Chrome / Edge: what does it protect, how to solve it?"
date: 2025-12-12
description: "An experience-oriented article explaining the Private Network Access model, reasons and practical solutions behind the 'unknown address space' CORS error that occurs with Chrome 142+."
image: /assets/img/7f100c91-2ecb-40ad-b64e-e54e08778f34.png
tags:
  - chrome
  - edge
  - cors
  - security
  - private-network-access
lang: en-US
translation_key: "chrome-edge-unknown-address-space-cors-hatasi-76644ae1"
permalink: /en/2025/12/12/unknown-address-space-cors-error-in-chrome-edge-what-does-it-protect-how-to-solve-it.html
---

The security model of modern browsers is no longer limited to the concept of **origin**.
Chromium-based browsers such as Chrome and Edge also take into account **which IP domain** the requests are going to.

That's why we encounter the following error more frequently in Chrome 142 and later versions:

```
Access to fetch at '...private IP...' from origin '...public domain...' 
has been blocked by CORS policy: Permission was denied for this request 
to access the `unknown` address space.
```

At first glance, it seems like a classic CORS problem, but actually the issue is completely different.

In this article, this error:

* why it appeared,
* which security model is the result,
* what it protects,
* where it appears in real life
* and **how to solve it permanently**

I tried to put it together.

---

## Why does this error occur?

For a long time, browsers only followed **same-origin** and classic CORS rules.
However, this model did not adequately protect users' **local networks**.

To close this gap, the Chrome team introduced the **Private Network Access (PNA)**, formerly known as **Local Network Access (LNA)** model.

The basic idea is this:

> A public website should not silently assign requests to IPs on the local network (such as 10.x, 192.168.x.x) through the user's browser.

So now browsers:

* checks whether the address the request goes to is **public or private**,
* It automatically stops public origin → private IP transitions,
* and reports it like a classic CORS error.

The phrase “unknown address space” here actually says that the browser does not find the target IP area safe.

---

## When did it come into play?

This mechanism is actually not new; It had been gradually being prepared for several years.

But in practice, the breaking point was **Chromium 142**.

In summary, the process went like this:

* The first trials started years ago behind the flag under the name CORS-RFC1918
* **preflight obligation** announced for PNA in 2023
* As of 2025 (Chrome 142+) public → private access will be blocked by default

In other words, many flows that "somehow worked" until now started to break with this version.

---

## What exactly do browsers protect?

This restriction is not arbitrary, but arises from a very clear need for security.

Let's think about it:

* User opens a public site
* That site can send requests to devices on the user's local network through the browser
* Router interfaces, admin panels, internal APIs become targets

This situation:

* CSRF-like attacks,
* local network discovery,
* It can even lead to unauthorized administrative access on some devices.

With the PNA model the browser says:

> “If a public page wants to enter the private network, it must clearly state this and obtain permission.”

---

## Where does it appear in real life?

This error occurs most often in the following scenarios.

### Cloud portals and private clusters

For example:

* Via Azure Portal
* When you try to access private AKS cluster APIs

The browser can detect that a request is being sent from a public domain to a private endpoint and interrupt the request.

While Edge and Chrome are quite strict in this regard, there may be cases where Firefox is more flexible.

---

### Local development environments

It is possible for a frontend application running locally to give this error even when sending requests to the local backend.

Classic at this point:

```
Access-Control-Allow-Origin
```

The header is of no use.

Because the browser blocks the address space before it even reaches the CORS stage.

---

### SSO and silent auth streams

In some MSAL/SSO scenarios the error gets even more confusing:

* Silent login does not work
* Errors similar to `LocalNetworkAccessPermissionDenied` appear in the console
* At first glance, the problem seems to be on the auth side

However, the root cause is again that the browser blocks private network access.

---

## So how to solve it?

At this point, we need to say this clearly:
This problem cannot be solved **just adding the CORS header**.

There is more than one solution and it is necessary to choose according to the scenario.

---

### Granting Local Network Access permission from the browser

In Chrome or Edge, from:

```
chrome://settings/content/localNetworkAccess
edge://settings/content/localNetworkAccess
```

Adding the relevant site to the **Allow** list is the fastest solution.

It is generally sufficient, especially in portal or admin interfaces.

---### Returning PNA compatible headers on the server side

If your requests are in the preflight phase:

```
Access-Control-Request-Private-Network: true
```

If it comes with a header, you need to explicitly return the following headers on the backend:

```
Access-Control-Allow-Private-Network: true
Access-Control-Allow-Origin: https://example.com
```

This is the only technical way to tell the browser "yes, I knowingly allow private network access."

---

### Using public endpoint or reverse proxy

This is often the cleanest solution, especially in corporate environments:

* The endpoint the browser talks to is a public hostname
* Real private services are left behind
* The browser thinks it is talking public → public

Thus, progress can be made without getting stuck in the PNA layer.

---

## Result

This error we see in Chrome and Edge is not a CORS problem in the classical sense.

Actually the browser says:

> “I do not allow a public page to access the private network.”

This approach:

* significantly increases local network security,
* forces applications written with old habits,
* but it creates a safer web model in the long run.

It is possible to adapt to this model with the right permissions, right headers and the right architecture.

---

## Resources

1. [Private Network Access update: Introducing a deprecation trial — Chrome for Developers](https://developer.chrome.com/blog/private-network-access-update/)
2. [Chrome 142 beta release notes — Chrome for Developers](https://developer.chrome.com/blog/chrome-142-beta/)
3. [Private Network Access: introducing preflights — Chrome for Developers](https://developer.chrome.com/blog/private-network-access-preflight/)
4. [Chrome Local Network Access prompts with Jamf Trust ZTNA — Jamf Support](https://support.jamf.com/en/articles/12894739-chrome-local-network-access-prompts-with-jamf-trust-ztna)
5. [Chromium 142 Local Network Access issue and "unknown address space" error — Dynamsoft](https://www.dynamsoft.com/web-twain/docs/faq/chromium-142-local-network-access-issue.html)
6. [ssoSilent fails in Chrome 142 (LocalNetworkAccessPermissionDenied) — AzureAD / MSAL JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/8100)
7. [Blazor WASM silent logins blocked by Chrome 142 LocalNetworkAccessPermissionDenied — dotnet/aspnetcore](https://github.com/dotnet/aspnetcore/issues/64699)
