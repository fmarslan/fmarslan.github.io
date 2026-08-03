---
layout: post
title: "Writing logs to Rabbit MQ with Log4j2"
date: 2020-12-11
description: "A short technical note outlining the basic approach and applicable steps for logging to Rabbit MQ with Log4j2."
lang: en-US
translation_key: "log4j2-ile-rabbit-mq-log-yazmak-ea5bad18"
permalink: /en/2020/12/11/writing-logs-to-rabbit-mq-with-log4j2.html
---

I will try to share a few simple settings here to print rabbit mqya log with Log4j2.

We add the `org.springframework.amqp.rabbit.log4j2` package, which is the plugin we will use as packages in the log4j2 xml configuration, and enter our `RabbitMQ` information.

```xml
<Configuration  packages="org.springframework.amqp.rabbit.log4j2">
	<Appenders>
		<Console name="console" target="SYSTEM_OUT">
			<PatternLayout pattern="%d [%t] %-5p (%F:%L) - %m%n"/>
		</Console>
		<RabbitMQ name="rabbitmq_change"
                            host="mq.playground.svc.cluster.local" port="5672"
                            user="fmarslan"
                            password="fmarslan" exchange="my-exchange"
                            applicationId="myapplication" routingKeyPattern="change_event"
                            connectionName="rabbitmq_change_appender"
                            contentType="text/plain"
                            contentEncoding="UTF-8"
                            generateId="false"
                            deliveryMode="PERSISTENT"
                            charset="UTF-8"
                            senderPoolSize="3"
                            maxSenderRetries="5">
		</RabbitMQ>
	</Appenders>
	<Loggers>
		<Logger name="ChangeFieldLogger" level="info">
			<AppenderRef ref="rabbitmq_change" />
		</Logger>
		<Root level="error">
			<AppenderRef ref="console" />
		</Root>
	</Loggers>
</Configuration>
```

We add the necessary dependencies into the pom. Here you need to select the versions that are compatible with your application.

```xml 
...
	  <dependency>
			<groupId>org.springframework.amqp</groupId>
			<artifactId>spring-rabbit</artifactId>
			<version>2.3.1</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.amqp</groupId>
			<artifactId>spring-amqp</artifactId>
			<version>2.3.1</version>
		</dependency>
    <dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-messaging</artifactId>
		</dependency>
...

```

Now, in our usages as below, the log will be sent directly to rabbit mq via the relevant exchange.

```java

...
  public static final Log CHANGEFIELDLOGGER = LogFactory.getLog("ChangeFieldLogger");
...
  CHANGEFIELDLOGGER.info("{JSON OBJECT}");
...

```

*Detailed information*

For rabbit mq installation, you can look [here](https://www.rabbitmq.com/getstarted.html)

For spring amqp you can look [here](https://docs.spring.io/spring-amqp/docs/current/reference/html/).
