---
layout: post
title: "From Code to Customer: Packaging a Product with Kubernetes"
date: 2026-09-07
description: "A cohesive development experience and one on-premises installation package for a distributed application: boundaries, benefits, costs, and when to choose it."
image: /assets/img/packaged-distributed-application.png
image_alt: "Independent geometric modules connected within a single frame"
tags: [kubernetes, platform-engineering, developer-experience, software-architecture, distributed-systems]
lang: en-US
translation_key: "koddan-musteri-ortamina-kubernetes-ile-bir-urunu-paketlemek"
permalink: /en/2026/09/07/from-code-to-customer-packaging-a-product-with-kubernetes.html
published: true
---

When an application must be installed in different customers' own environments, I want to combine a cohesive development experience and a single delivery package with the capabilities of distributed execution. I want to understand the product as a whole, follow the relationships between its features, and start working without rebuilding its surroundings. At runtime, I also want to manage each part according to its needs.

These expectations came together in a product I worked on recently. The application ran as separate workloads on Kubernetes, while customers received its entire ecosystem through one installation package.

I think of this as **a product that feels monolithic to develop and install, but runs as a distributed system**. With clear component boundaries, we can add useful runtime and operational capabilities to that cohesive experience. There is also a cost to carrying this responsibility.

## Why did I need this approach?

The delivery model is on-premises. Unlike a centrally operated SaaS service where customers receive accounts, this product is installed in each customer's own infrastructure. The application arrives with the environment it needs to run.

That environment includes a database, identity management, messaging, and monitoring. Each component supports the application. Selecting, connecting, and configuring these tools manually for every customer could turn delivery into a recurring integration project.

I wanted installation knowledge to become part of the product. The system prepared for one customer needed to be installable for another through the same recipe, using that customer's settings. From the customer's perspective, this should be one product installation.

The runtime requirements still made separate components useful. A user-facing service and a background worker may have different load profiles. Established open-source tools can handle identity or data storage. Delivering these parts together does not require them to run and grow in the same way.

## One development experience, one delivery package

What I appreciate about developing a monolithic application is the ability to keep the whole product in mind. I open the project, see how its parts relate, and evaluate a feature in context. A distributed application can preserve that experience.

Here, “monolithic feel” describes development and installation. **Code organization, the delivery package, and runtime topology are separate design decisions.** A product developed together and delivered in one package can run as separate processes, and where needed on different nodes, in Kubernetes.

The customer's entry point looks like this, using an illustrative command name:

```bash
product install
```

Once the package is available in the target environment, supported server prerequisites are met, and connection details are supplied, this command starts the installation flow. K3s prepares Kubernetes; Helm installs the platform services and application. Initial database definitions, application access settings, and component readiness checks belong to the same flow.

The customer does not have to run a separate installation procedure for every service. Environment-specific settings remain separate, while the package carries the knowledge of how the components fit together.

In this project, application image building also happens inside the target environment. BuildKit produces the image on the platform where it will run. Components requiring compilation use toolchains and base images appropriate for the supported processor architecture. The image is pushed to the local Zot registry and runs on the same platform. Runtime settings are applied during installation, while secrets are provided without baking them into the image.

For the customer, this path from source code to a running application becomes part of the product's installation behavior.

## Where should cohesion end and boundaries begin?

This is the decision that determines whether the approach works. If a unified product experience makes every component dependent on the internal details of the others, we lose much of the value of distributed execution.

**The package defines the product boundary. Component responsibilities need their own boundaries.**

It should be clear which data a component owns, which API or message contracts it exposes, and who is affected when it changes. Requiring components to understand one another's internal tables, implementation details, or private configuration expands the impact of change.

The same distinction applies to updates. We can ship a product release containing components tested together. That does not mean every application change must reinstall the database, identity service, and entire platform. Compatible changes should be applicable to the relevant component. Changes to data schemas or service contracts need their own coordination.

A shared development environment is comfortable when responsibilities are clear. Otherwise, every change inside the package can become a whole-product concern.

The question of where we manage complexity, which I explored in my writing about cloud-native and monolithic systems, matters here too. We can offer cohesion to developers and customers while keeping component relationships explicit in the platform design.

## What do we gain?

The first benefit is repeatable delivery. The order of installation and the required initialization settings travel with the product. Checking existing versions, configuration, and health is part of that experience. Installation and upgrades become defined product operations.

The second benefit is runtime visibility and targeted intervention. When logs, metrics, and health information are associated with components, we can focus investigation on the relevant part. With suitable boundaries, we can restart, update, or change the capacity of one component while limiting the effect on the rest of the product.

This separation also supports performance management. We can add consumers to a busy background workload or scale request-handling services according to their own load. Appropriate metrics and autoscaling policies can automate these changes. Instead of growing the whole product at the same rate, we can expand the part that needs capacity.

This is a capability we can build on the architecture. Application concurrency, data-layer capacity, and available cluster resources determine the result. In an on-premises environment, autoscaling still operates within the customer's hardware capacity and configured limits.

Another benefit is broader access to the open-source ecosystem. We can integrate established tools for identity, messaging, or monitoring into the product. Components do not all need to use the same language. As an illustrative example, an API could use .NET and a background worker Python, while the customer installs both as parts of one product.

The Lego analogy is useful here. Service contracts, data ownership, and version compatibility are the connection points. When those are defined well, we can use the accumulated work of existing tools and focus our own effort on the product's distinctive functionality.

## A useful consequence: Developing in the same environment

Once we have an installable ecosystem for customers, we can install the same package for development. For me, easier local development is a natural benefit of this delivery model.

Tools such as Docker Compose and [Aspire](https://aspire.dev/get-started/faq/), familiar from the .NET ecosystem, can also bring services into a shared development experience. The property I want to preserve here is that the actual customer platform runs in development through its own installation recipe.

We use the same Kubernetes distribution, database, messaging, and identity services. The application communicates with the real components; I do not replace them with substitutes for development. A background task connects to the product's messaging service, and a sign-in flow uses its identity service.

In this sense, I develop in a separate instance of the production environment. It is isolated from the customer's live system and data and can run in a local virtual machine or on development servers. Hardware capacity, node count, and settings may differ, while the components and operating recipe remain consistent. Performance and high-availability assessments still require tests appropriate to the target capacity.

**Developing inside the ecosystem the product will use lets us address some delivery uncertainties earlier.**

## Where do we pay for this convenience?

For the customer to install with one command, we must design everything behind that command. Component compatibility, startup order, access rules, and data relationships become part of product maintenance. Open-source updates and security fixes must be evaluated within that whole.

Installation is the beginning of the lifecycle. Backup and recovery, schema changes, application updates, and support need their own design. Responsibilities must also be clear between the product team and the customer. One installation command alone does not guarantee easy operations.

On-premises customers may remain on different versions. Network access, certificates, storage, and hardware capacity can vary. Defining supported environments and validating upgrade paths takes ongoing effort.

Working on offline installation made this delivery responsibility especially clear. Images and build dependencies must be prepared in advance, package integrity checked, and target prerequisites defined. Supporting restricted-network environments adds responsibilities to release preparation.

There is also a resource cost. Running a full platform alongside a small application requires memory, storage, and operational knowledge. If images are built in the target environment, build capacity and permissions must be included. The simpler development and installation experience is supported by an investment in platform engineering.

## When would I choose it, and when would I avoid it?

I consider this approach for products that will be installed repeatedly in different customers' infrastructure and developed over time. Components with different runtime needs, targeted intervention or scaling requirements, and useful open-source dependencies can justify turning the installation ecosystem into part of the product.

The team's ability to maintain the platform is part of that decision. Writing the installation recipe once is not enough. It must evolve with versions, security updates, and customer environments.

| A need that strengthens the case | A situation favoring a simpler solution |
| --- | --- |
| Repeated installation in different customer environments | Limited installation needs with few dependencies |
| Component-specific capacity and intervention | Adequate operations with one process or a few containers |
| A team and product lifetime that support platform maintenance | Scope and team capacity that cannot justify the maintenance cost |
| Clearly defined, supportable target environments | Customer infrastructure unable to meet the product's resource needs |

If the customer already has a standardized Kubernetes platform, I reconsider including a cluster in the package. Adapting the application and its dependencies to that platform may be more appropriate. A centrally delivered SaaS product also changes the justification, because customer-by-customer installation is no longer the same requirement.

My deciding factors are how the product will be delivered and how it will operate over the years. When we can preserve one product experience while making useful use of component independence, this design has a strong purpose.

One area where I contribute in development and consulting is considering these decisions together: developers must be able to understand the product, customers must be able to install it, and operations teams must be able to manage it. Bringing those needs into one design makes the application a product we can keep delivering and supporting.
