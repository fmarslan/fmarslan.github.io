---
layout: post
title: "How to upload your own library to the Global Maven Repository?"
date: 2021-03-18
description: "How to upload your own library to the Global Maven Repository? A brief technical note outlining the basic approach and applicable steps on the topic."
categories: maven
lang: en-US
translation_key: "global-mvn-repo-kutuphane-yukleme-a3c805a6"
permalink: /en/2021/03/18/how-to-upload-your-own-library-to-the-global-maven-repository.html
---

Sometimes people, like me, may get bored of always being a consumer and think that they should become a producer and maybe add something in their own way. In such a case, we say hello to the open source world, which we constantly benefit from. In this article, I will not explain what open question is, etc. We took such a path, we prepared our library, we published the source codes on github or another similar platform, but anyone cannot use it easily, we are not included in the global repo. In this case, in our scenario, we have a domain address, we use it as a packet name, and we want to upload it to the global maven repo with this package name and this group name.

Step 1: Our source codes are available as open source in an open environment *(we have this part ready)*
2. We are learning how the DNS record of our domain address is managed, we will need to add a txt record.
3. https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134 We open an issue here and explain our problem. *(See other issues as examples)*
4. You add the resulting issue number to your domain address as a txt record.
5. You write a comment stating that you added a txt record to the issue.
6. You will receive a response similar to the one below and the package name will be defined to your account. And how to deploy it is explained in detail in this comment.

{%raw%}
```text
{{your group name}} has been prepared, now user(s) {{your username}} can:
Publish snapshot and release artifacts to https://s01.oss.sonatype.org
Have a look at this section of our official guide for deployment instructions:
https://central.sonatype.org/pages/ossrh-guide.html#deployment

Please comment on this ticket when you've released your first component(s), so we can activate the sync to Maven Central.
Depending on your build configuration, this might happen automatically. If not, you can follow the steps in this section of our guide:
https://central.sonatype.org/pages/releasing-the-deployment.html

```
{% endraw %}

Now you have a place in a global repo. Similar methods are available for all repos.

[Source](https://central.sonatype.org/pages/ossrh-guide.html)
