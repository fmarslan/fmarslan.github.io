---
layout: post
title: "Using OkHttp3 and Okhttp together in the same project"
date: 2020-12-03
description: "A short technical note outlining the basic approach and applicable steps for using OkHttp3 and Okhttp together in the same project."
lang: en-US
translation_key: "okhttp3-ile-okhttp-ayni-projede-birlikte-kullanma-1a38fc73"
permalink: /en/2020/12/03/using-okhttp3-and-okhttp-together-in-the-same-project.html
image: "http://fmarslan.com/assets/img/Screenshot%20from%202020-12-03%2014-43-04.png"
---

Sometimes we experience incompatibility between the libraries we use when developing applications in Java. Many people have encountered this. Here we will explain how to solve this type of problems in general through an example.

For example, let's say we have dependencies as follows in a project, the versions of the okio library conflict in these two dependencies.

```xml
...

    <dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-hdfs-client</artifactId>
			<version>3.3.0</version>
		</dependency>
    <dependency>
			<groupId>io.minio</groupId>
			<artifactId>minio</artifactId>
			<version>8.0.3</version>
		</dependency>
....

```
You can see the conflicting versions in the picture.

*1. Step* You may have noticed that the main conflicting issues here are okhttp and okhttp3. There is no interface between them like there is in log4j, so we will have to hope to find compatible versions :) We can use log4j and log4j2 libraries interchangeably since there is an interface in between.
*2. Step* [for okhttp here](https://mvnrepository.com/artifact/com.squareup.okhttp/okhttp) [for okhttp3 here](https://mvnrepository.com/artifact/com.squareup.okhttp3/okhttp) When we check the versions, okhttp is not available after 2.7.5, so we have no chance to move there, so we will go via okhttp3. We are coming backwards for okhttp3. Since it is a major version 4 in versions, I do not recommend switching to 3. Problems usually occur, so we are trying to find the lowest *okio* version from the *4.

*3. As a step*, we are trying to find a version that will not cause problems due to changes by following the [change logs](https://square.github.io/okio/changelog/#version-222) between these okio versions.

*4. Step* I found the appropriate version here in okio:2.2.2 with 4.0.0, now I am applying it in the maven pom.

```xml
...
		<dependency>
			<groupId>io.minio</groupId>
			<artifactId>minio</artifactId>
			<version>8.0.3</version>
      <!-- minio içinden http3 kütüphanesini çıkarıyoruz -->
			<exclusions>
				<exclusion>
					<groupId>com.squareup.okhttp3</groupId>
					<artifactId>okhttp</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
    <!-- yeni http3 kütüphanemizi ekliyoruz -->
		<dependency>
			<groupId>com.squareup.okhttp3</groupId>
			<artifactId>okhttp</artifactId>
			<version>4.0.0</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-hdfs-client</artifactId>
			<version>3.3.0</version>
      <!-- okio kütüphanesi http3ten geldiği için buradna çıkarıyoruz. -->
			<exclusions>
				<exclusion>
					<groupId>com.squareup.okio</groupId>
					<artifactId>okio</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
...

```

*As a final note*, if we use libraries by paying attention to their compatibility, we will not encounter such things in general. Moreover, if we are publishing such libraries, we do not use specific versions, if we add interfaces for such situations (example: If there was an interface between http and http3, this problem would probably not occur.)
