---
title: Telegram Bot oluşturma ve Kullanma
type: post
category: bot
---

Merhaba bugün notlarımıza telegram da bot oluşturmayı ekleyelim

öncelikle telegram hesabımız yoksa açıyoruz sonra chat bölümünden onaylanmış BotFather(http://t.me/BotFather) botların babasını bulup ekliyoruz

1. adım chat bölümüne ``/newbot`` diyoruz bot babamız bize botun ismini soruyor söylüyoruz soruları cevpalandırıyoruz ve botumuz hazır

2. adım bot babamız bize botumuz ile alakalı bilgilier paylaştı buradan verilne token bilgisini sağlam bi şekilde saklıyoruz(çok önemli ve gizli bilgi)

3. https://api.telegram.org/bot{token}/getUpdates ile bu botumuz ile sohbet başlatmış herkesi görebilirsiniz ve istediğiniz chat id sini seçerek chat başlatabilirsiniz
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


4. adım mesaj göndermek için yukarıdan bulduğunuz chat id bilgisini aşağıdaki urle ekleyerek istediğiniz chat ekranına mesaj atabilrisiniz

``https://api.telegram.org/botxxxx:yyy-zzzzz/sendMessage?chat_id=xxx&parse_mode=Markdown&text=Selam``

