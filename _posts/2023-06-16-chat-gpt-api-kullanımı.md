---
layout: post
title: "Chat GPT Api kullanımı"
categories: OpenAI GPT
---

## ChatGPT API Uygulaması

Bu Python uygulaması, ChatGPT API'sini kullanarak basit bir metin tabanlı sohbet uygulaması oluşturmanızı sağlar.

1. Öncelikle, API endpoint URL'sini ve API anahtarınızı `API_ENDPOINT` ve `API_KEY` değişkenlerine girin. bunu [Open AI Platform](https://platform.openai.com/) 'dan temin edebilirsiniz.

2. Ardından, `send_message` fonksiyonunu kullanarak kullanıcının mesajını API'ya gönderin ve yanıtı alın. Bu fonksiyon, API ile etkileşim sağlar ve yanıtı geri döndürür.

3. `chat` fonksiyonu, kullanıcıdan mesajları alır ve `send_message` fonksiyonunu kullanarak API'dan yanıt alır. Kullanıcı "quit" yazdığında sohbet sona erer.

**Kod Örneği:**

```python

import requests

API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
API_KEY = 'API_ANAHTARINIZ'

def send_message(message):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}'
    }
    payload = {
        'messages': [{'role': 'system', 'content': 'You: ' + message}]
    }
    response = requests.post(API_ENDPOINT, headers=headers, json=payload)
    response_json = response.json()
    return response_json['choices'][0]['message']['content']

def chat():
    print('Chat with the model. Enter "quit" to exit.')
    while True:
        user_input = input('You: ')
        if user_input.lower() == 'quit':
            break
        response = send_message(user_input)
        print('ChatGPT: ' + response)

chat()

```

Bu örnek, ChatGPT API'sini kullanarak kullanıcıyla etkileşimde bulunan bir metin tabanlı bir sohbet uygulamasını göstermektedir. Öncelikle API_ENDPOINT değişkenine OpenAI ChatGPT API'sinin endpoint URL'sini ve API_KEY değişkenine sizin API anahtarınızı girmeniz gerekmektedir.

Bu örnek, basit bir sohbet uygulaması için temel bir yapı sağlar. API ile etkileşime geçmek için send_message fonksiyonunu özelleştirebilir ve yanıtları istediğiniz şekilde işleyebilirsiniz.

Unutmayın, ChatGPT API'sini kullanırken API sınırlamalarına ve politikalarına uymanız önemlidir. Ayrıca, geliştirdiğiniz uygulamanın doğruluk ve etik açısından kontrol edilmesi gerektiğini unutmayın.
