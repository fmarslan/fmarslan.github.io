---
layout: post
title: "Where is the Software Industry Heading?"
date: 2021-07-03
description: "Where is the Software Industry Heading? A brief technical note outlining the basic approach and applicable steps on the topic."
categories: yazilim
lang: en-US
translation_key: "yazilim-sektoru-nereye-gidiyor-2ab4f563"
permalink: /en/2021/07/03/where-is-the-software-industry-heading.html
image: "https://fmarslan.com/assets/img/coding-man.jpg"
---

In this article, I wanted to share my humble thoughts about the software industry. There may be people who have different opinions, if they share them, I would like to benefit from them. 

I think it would be beneficial to first go back in time and observe the experiences gained. In this context, if we go back to the beginning of 2000, there were approaches such as **ASP**, **PHP**, **JSP**, where Front-End and Back-End sides were developed together and html rendering operations were done directly on the server. These approaches also made large projects, for example, WordPress for **PHP** is a good example of this, in my opinion, because it is still used by those who like it or dislike it, for better or worse. Although the same is not true for **PHP**, **JSP**, **ASP** are now dead and a long time has passed. In these approaches, Back-End and Front-End are developed intertwined, usually called a full stack developer, creating a need for a developer who is familiar with all technologies, from JavaScript to CSS, to the Back-End side, which made the development job very difficult, because firstly, developers need to know all the stages so that applications that can produce optimum solutions can emerge. In this way, it was not possible to expect a person to know everything, because everyone's interest and knowledge were at different points, and an artificial Front-End Back-End distinction was tried to be made. In addition, in order to reduce the management difficulties and development burden in the large projects experienced here, a period began in which Front-End side such as **JSF**, **ASP Web Form** were tried to be automatically created, and developments were made without much effort with Javascript CSS by just writing Back-End and maybe knowing a little HTML. In this period, it was aimed and achieved to take the CSS and Javascript load in the Front-end from development and to make management easier with OOP. However, a problem arose: this approach began to experience serious limitations on the interface side, tiring methods were needed for even the smallest operations, and the frameworks that solved this best were successful. Another thing is that rendering operations on the server and OOP approaches brought about serious resource consumption, which of course means costs, so the search for new methods began. For example, I think **GWT**, which was released later in this period, aimed to do this, but it was too complicated. With **VAADIN**, it was aimed to make this easier, but this deepened the restrictions even further. I believe that the **MVC** approach is based on this, and the thing that made me happiest when I switched to **MVC** was that it provided less server resources and a more flexible development, while not compromising OOP, which facilitates project management.  During this period, javascript frameworks such as **jQuery** started to spread around to facilitate many operations for the Front-End, and they did a good job. Thanks to these, front-end developments could be made very quickly. 

Of course, its lifespan was limited because people started to get tired of server costs and started to look for more economical solutions. At this stage, client-based applications such as **Angular** **React** came out and thanks to these, html rendering operations on Back-End servers were eliminated, which meant cost savings. The fact that this approach completely separated the backend and front end sides caused an increase in service-based approaches on the Back-End side. On the other hand, since we were dependent on the resources of the client computers, the user's computer performance affected our application performance and complaints were received that the application was too slow. At the same time, this required the user to provide a software standard, for example, an application we made for Firefox did not work in Internet Explorer. Over time, a standardization has been achieved in browsers. Today, a single application can run on all browsers at a rate of 80-90%. After the situation came to this point, Front-End and Back-End developers are now completely separated, so separate performance evaluations and improvements can be made.We were just saying that frameworks such as **Angular**, **React**, **EmberJS** etc. are very good, SEO problems have been solved, single page applications can be made like desktop applications, and especially when we support this with native application bases such as Electron, a single application can run as web or native. Just when we were at the final point, new developments started to emerge. Nowadays, those who are curious and research have seen that there is a term called **WebAssembly** and there are even people who use it.

Now that we have finished our history lesson and come to the present day, let's investigate as follows;

### What's happening on the Front-End side

- **Ecmascript** and **Javascript** syntax is very close to **Typescript**. It is said that browsers will soon support **Typescript** directly.
- **C# .Net Core** has achieved good performance. It directly supports the **WebAssembly** side, so the code you write in **C#** can directly affect the frontend.
- The importance of async programming has emerged. Multithread approaches have begun to be moved away, so much so that with the increasing use of websocket with **NodeJs**, async Client-Server communications have begun, eliminating these huge CPU Thread needs.
- Native application bases such as **Electron** provide the opportunity to use web applications as native applications via Chrome, which has begun to eliminate the concept of web/native application.

### What's happening on the Back-End side

- With **Kubernetes**, the **CAAS** architecture is experiencing its golden age. Physical server dependency is now eliminated. When a server breaks down, the replacement cost is only the server cost.
- With **Golang**, the need for an Operating System in the container is eliminated, the code you write can run directly in the container, there is no need to use any base.
- The concept of thread is not used much anymore. With **Golang**, the async approach has been thoroughly adopted, which minimizes resource consumption.
- With the **SAAS**, **FAAS** approaches, the backend was divided into atomic parts, and the possibility of monitoring and scaling separately began to emerge very easily (The warnings in my article titled [What is this Microservice Stream?](https://fmarslan.com/microservice/2021/01/22/nedir-bu-mikroservis-akimi.html) that I wrote for microservices here are still valid)
- Language dependency within the application has been eliminated, so that while the saving service can be written in **C#**, the reading service can be written in **Golang**, and the Update service can be written in **Python**.
- Maintenance costs started to decrease.
- The concept of "Product", not a solution, has been made easier to access.

All of these are what come to my mind right now and if we think about where we are going when we read these together with the past, according to my thoughts;

### So What Will Happen?

- **Google** and **Microsoft** have joined hands to prepare the market for a new future, both of them are opening the doors of the cloud-based personal computer era with cloud services, **Windows** and **Chrome OS** operating systems, 
- They aim to solve the problems on the web side and only introduce the concept of "application" instead of completely erasing the native/web application concepts.
- **Golang** aims to be the most powerful language on the system side, **C#** on the application side
- **Amazon** is aware of this and is preparing services like crazy these days.
- Since common services can be used even in solution projects on the Back-End side, back end development seems to slow down, but this does not mean that it will end.
- There will be much faster and radical changes on the Front-End side, which will cause many developers who cannot keep up to be left behind.
- **Microsoft** is making serious contributions to cloud and **C#** compatibility on the **Linux** side, which, who knows, may cause **Windows** to become a thing of the past and instead come with a very simple software such as Thin Client just for cloud services :)
- On the **Open-Source** side, **Microsoft**'s contributions cannot be ignored. They are making investments like **Google** with their salaried staff. As a result, they seem to be taking away the only area where **Java** is strong.There may be more points to talk about, but I will leave it here for now in order not to extend any further. I would like to draw attention to one last point. **Java** is a very powerful and widely used language, but as we have talked about above, **Java** is never mentioned here, who knows, maybe it has a place in the dusty pages of history like **Pascal** **VBasic**. As for **Python**, it does not die easily, there is no scripting language that powerful yet that can rival it, but again, you never know what time will bring. Although it may not be like the invention of electricity, we are in a period where one era ends and another opens. If we can be fast and keep up with this change, we will be among the winners, otherwise we will be among the losers.

[Photo Freepik](https://www.freepik.com/photos/computer)
