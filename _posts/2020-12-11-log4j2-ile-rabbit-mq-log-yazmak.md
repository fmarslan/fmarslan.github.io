---
title: Log4j2 ile Rabbit MQ ya log yazmak
category: java
layout: post
---

Log4j2 ile rabbit mqya log yazdırmak için basit bir kaç ayarı burada paylaşmaya çalışacağım

log4j2 xml yapılandırmasında packages olarak kullanacağımız plugin olan `org.springframework.amqp.rabbit.log4j2` paketini ekliyoruz ve `RabbitMQ` bilgileirmizi giriyoruz

```XML
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

pom içerisine gerekli dependencyleri ekliyoruz burada sizin uygulamanız için uyumlu olan versionları seçmenizde gerekmektedir.

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

artık aşağıdaki gibi kullanımlarımızda log doğrudan rabbit mq ya ilgili exchange ile gönderilecektir.

```java

...
  public static final Log CHANGEFIELDLOGGER = LogFactory.getLog("ChangeFieldLogger");
...
  CHANGEFIELDLOGGER.info("{JSON OBJECT}");
...

```

*Detaylı bilgiler*
rabbit mq kurulumu için [buraya](https://www.rabbitmq.com/getstarted.html) bakabilirsiniz

spring amqp için [buraya](https://docs.spring.io/spring-amqp/docs/current/reference/html/) bakabilirsiniz.

