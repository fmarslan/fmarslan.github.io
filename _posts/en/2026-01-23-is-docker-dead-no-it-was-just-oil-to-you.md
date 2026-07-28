---
layout: post
title: "Is Docker Dead? No. It Was Just 'Oil to You'."
date: 2026-01-23
description: "An article discussing how Docker identifies with the concept of containers and how to establish the right mental model in the changing container ecosystem."
image: /assets/img/242c6430-9d74-463e-993d-6fb7d47266e9.png
tags:
  - docker
  - containers
  - kubernetes
  - devops
  - cloud-native
lang: en-US
translation_key: "docker-oldu-mu-hayir-sana-yagi-oldu-99f2c044"
permalink: /en/2026/01/23/is-docker-dead-no-it-was-just-oil-to-you.html
---

There is a sentence that has been heard frequently in technical conversations in the last few years:  
**“Docker is now dead.”**

This sentence is technically wrong, but mentally it says a lot.  
Docker is not dead; **The word Docker replaced the concept of container.**  
Just like once upon a time, every margarine was called "yam oil".

## What was Docker, what happened?

Docker did not invent container technology.  
But he did this very well:

- Made complex Linux capabilities available with a single command  
- It placed the concepts of image, registry, build, run into a single model  
- Dramatically simplified the developer experience  

The result was:

> **Container = Docker**

From this point on, Docker became a **brand** rather than a technology.

## What is the Real Technology?

The point that is often missed when talking about Docker is this:

What we call a container is actually a combination of:

- Linux namespaces  
- cgroups  
- Immutable image layers  
- OCI (Open Container Initiative) standards  

So container:

- Not a product  
- Not a company  
- Not a binary  

**An architectural approach.**

Docker was the first major ecosystem to package this approach.

## Where did the “Docker is Dead” Perception Come From?

There are several clear reasons for this perception.

### 1. Kubernetes was thought to have “abandoned” Docker

Kubernetes has stopped using Docker Engine as a runtime.  
But he did not leave:

- Docker image format  
- Container operating model  

Kubernetes today mainly:

- containerd  
- CRI-O  

is using.

**Docker Engine is gone, container remains.**

### 2. Docker Desktop and licensing truth

The following topics have become more visible in the corporate world:

- License costs  
- Root authority  
- Central daemon architecture  
- Security and isolation expectations  

This paved the way for alternative vehicles.

### 3. The ecosystem has matured

At first it was all Docker:

- Build  
-Run  
-push  
-Orchestration  

Today, each piece is specialized in its own field.

## How Does the New Order Work?

Today's chart is clear:

### Image production
- Dockerfile is still standard  
- But the build can be done with the following tools:
  -BuildKit
  -Podman
  - Buildah
  -Kaniko  

### Container running
- In local environment:
  – Docker
  -Podman  
- In Kubernetes:
  - containerd
  - CRI-O  

### Orchestration
- Kubernetes is now at the center  
- Docker is not a mandatory component here  

The more accurate statement today is:

> Not “We use Docker”  
> **“We produce OCI compliant container images.”**

## Where Does Podman Fit In This Story?

Podman didn't revolutionize, **fills in the blank**:

- Very similar to Docker CLI  
- No daemons  
- It can work without root  
- Mentally closer to the Kubernetes pod model  

That's why Podman:

- Not a competitor to Docker  
- Native tool of the post-Docker era  

## Time to Change Mental Model

The problem is not using Docker.  
The problem is **Missing Docker as the hub**.

Correct mental model:

- Docker is a brand  
- A container architecture  
- OCI is a standard  
- Kubernetes is a reality  

Docker is not dead.  
But there is no **one correct answer** anymore.

Just like:

- "Sana oil" is margarine  
- “Selpak” is tissue paper  

like.

The question we need to ask when designing a system today is:

> “Is there Docker?” not  
> **“How dependent is this system on container standards?”**

Brands change.  
But well-established architectural ideas do not die easily.
