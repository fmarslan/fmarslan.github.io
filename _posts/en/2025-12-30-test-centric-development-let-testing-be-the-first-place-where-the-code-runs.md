---
layout: post
title: "Test-Centric Development: Let Testing Be the First Place Where the Code Runs"
date: 2025-12-30
description: "A practical approach for teams that are distant from TDD, increasing debug speed by making testing the natural entry point of the development flow."
image: /assets/img/test-centric-development.png
tags:
  - testing
  - debugging
  - developer-experience
  - software-architecture
  - workflow
lang: en-US
translation_key: "test-centric-development-47760c19"
permalink: /en/2025/12/30/test-centric-development-let-testing-be-the-first-place-where-the-code-runs.html
---

_Develop around testing, not test-first_

Testing often takes a backseat when writing code.  
This isn't laziness, this is real life. Something isn't working, you want to debug.  
A behavior is not clear in your mind, you say, "Let me try it."  
At this point, writing tests is not a reflex for most developers.

What usually happens is this:  
The application is restarted, a request is made to the controller, the log is checked, and it is tried again.  
The code you actually want to see gets lost in the noise of config and environment.

## What does the Test-Centric approach do?

He doesn't tell anyone to "do TDD".  
It doesn't force anyone to write tests.

It just says:

> **The first place the code runs should be a test, not an application.**

When you press Run / Debug in the IDE, what gets up is not the application, but **test**.

## A simple example from daily life

You write a new calculation function.

Normally:
- add controller
- call endpoint
- look at response
- add/delete log

In test-centric:
- write a test
- call from there
- set breakpoint
- over

### .NET example

```csharp
public class OrderService
{
    public decimal CalculateTotal(decimal price, int quantity)
    {
        return price * quantity;
    }
}
````

No need to uninstall the app to try this.

```csharp
public class OrderServiceTests
{
    [Fact]
    public void CalculateTotal_basic_case()
    {
        var service = new OrderService();

        var result = service.CalculateTotal(10, 3);

        Assert.Equal(30, result);
    }
}
```

Here's what most developers think:

> Not "I'm writing a test",
> “Let me run it and see.”

But ultimately:

* Code worked
* Debug was done
* And **a test has already occurred**

This test doesn't have to be perfect.
But at least there is **smoke level** assurance for that code now.

## When in-memory tools come into play

As the business gets bigger, it becomes more expensive to set up real systems locally.

At this point:

* in-memory DB
* in-memory message bus
* fake / lightweight dependencies

comes into play.

But the aim is not to imitate the prod exactly.
The aim is to **run the flow in the developer's mind quickly**.

### A simple example

```csharp
public class PaymentHandler
{
    private readonly IEventBus _bus;

    public PaymentHandler(IEventBus bus)
    {
        _bus = bus;
    }

    public void Handle(Payment payment)
    {
        if (payment.Amount <= 0)
            throw new InvalidOperationException();

        _bus.Publish(new PaymentCompleted(payment.Id));
    }
}
```

No real Kafka in test:

```csharp
[Fact]
public void Payment_should_publish_event()
{
    var bus = new InMemoryEventBus();
    var handler = new PaymentHandler(bus);

    handler.Handle(new Payment { Id = "p1", Amount = 100 });

    Assert.Single(bus.PublishedEvents);
}
```

The test runs like a little runtime here:

* message going
* handler is triggered
* the result is visible

No Docker, no network, no config.
There is only the behavior of the code.

## Prod ↔ Local bridge (DLQ side)

The real difference comes here.

There is an error in prod.
A message lands on DLQ.

Normally:

*log is read
*predictions are made
* deployed to staging
* "If it happens again, we'll see" is said

In the test-centric approach:

* DLQ message is received
* is put into the test
* Runs again locally

```csharp
[Fact]
public void DLQ_message_should_fail_same_way()
{
    var bus = new InMemoryEventBus();
    var handler = new PaymentHandler(bus);

    var faulty = new Payment { Id = "p2", Amount = 0 };

    Assert.Throws<InvalidOperationException>(() =>
        handler.Handle(faulty)
    );
}
```

You press run.
Breakpoint drops.
The error is there.

When Fix is ​​written, the test remains.
That prod error is now a **replayable** scenario.

If he comes again, he will be caught.

## Is this TDD?

No.
There is no Red-Green-Refactor discipline.
It is not a dogmatic approach.

But the common point is this:

* How the code will be used is shaped by testing

The motivation here is not quality.
Motivation **being able to debug**.

Testing is a by-product.

## So why doesn't it happen everywhere?

The first is architecture.
This approach won't work if the code is not easily callable from the test.
If everything is embedded in the controller, testing cannot be an entry point.

The second is habit.
Many teams still debug via "uninstall application, look at log".
It does not see test runner as a debugging tool.

Third is perception.
Testing is still perceived as "post-written" and "QA work".
It's a mental threshold to put at the center of development.

Fourth is time pressure.
It seems slow at first.
Most teams don't get past that first threshold.

## Last word

Test-Centric Development is not a magic solution.
It doesn't work in every team.

But:

* does not like writing tests
* Distance from TDD
* but also tired of prod mistakes

An honest middle ground for teams.

By making testing no longer mandatory,
He tries to make it **a natural part of the way he works**.

And most of the time, that's a big enough win.
