---
layout: post
title: "Creating and Using Telegram Bot"
date: 2021-01-12
description: "A short technical note outlining the basic approach and applicable steps in creating and Using a Telegram Bot."
lang: en-US
translation_key: "telegram-bot-olusturma-ve-kullanma-822f6d90"
permalink: /en/2021/01/12/creating-and-using-telegram-bot.html
---

Hello, today let's add creating a bot in Telegram to our notes.

First of all, if we do not have a Telegram account, we open it, then we find the father of the bots approved in the chat section, BotFather (http://t.me/BotFather) and add it.

Step 1: In the chat section, we say '`/newbot`'. Our bot father asks us the name of the bot, we tell it, we answer the questions and our bot is ready.

Step 2: Our bot father shared information about our bot. We keep the token information given here securely (very important and confidential information).

3. With https://api.telegram.org/bot{token}/getUpdates, you can see everyone who has started a chat with this bot and you can start a chat by selecting the chat id you want.
``` https://api.telegram.org/botxxx:yyy-zzz/getUpdates```
```json
{
   "message_id":1,
   "from":{
      "id":yyyyy,
      "is_bot":false,
      "first_name":"Fatih Mehmet",
      "last_name":"ARSLAN",
      "username":"fmarslan",
      "language_code":"en"
   },
   "chat":{
      "id":xxx, //chat id,
      "first_name":"Fatih Mehmet",
      "last_name":"ARSLAN",
      "username":"fmarslan",
      "type":"private"
   },
   "date":1610438921,
   "text":"/start",
   "entities":[
      {
         "offset":0,
         "length":6,
         "type":"bot_command"
      }
   ]
}
```


Step 4: To send a message, you can add the chat ID information you found above to the url below and send a message to the chat screen you want.

``https://api.telegram.org/botxxxx:yyy-zzzzz/sendMessage?chat_id=xxx&parse_mode=Markdown&text=Selam``

[For Detailed Information https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)
