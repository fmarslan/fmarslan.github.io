---
layout: post
title: "Chat GPT API usage"
date: 2023-06-16
description: "A short technical note outlining the basic approach and applicable steps in using the Chat GPT API."
categories: OpenAI GPT
lang: en-US
translation_key: "chat-gpt-api-kullanm-1cd910aa"
permalink: /en/2023/06/16/chat-gpt-api-usage.html
---

## ChatGPT API Implementation

This Python application allows you to create a simple text-based chat application using the ChatGPT API.

1. First, enter the API endpoint URL and your API key into the `API_ENDPOINT` and `API_KEY` variables. You can get it from [Open AI Platform](https://platform.openai.com/).

2. Then, use the `send_message` function to send the user's message to the API and receive the response. This function interacts with the API and returns the response.

3. `chat` function receives messages from the user and gets response from API using `send_message` function. The chat ends when the user types "quit".

**Code Example:**

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

This example shows a text-based chat application interacting with the user using the ChatGPT API. First of all, you need to enter the endpoint URL of the OpenAI ChatGPT API into the API_ENDPOINT variable and your API key into the API_KEY variable.

This example provides a basic structure for a simple chat application. You can customize the send_message function to interact with the API and process the responses however you want.

Remember, it is important that you comply with API limitations and policies when using the ChatGPT API. Also, remember that the app you develop should be checked for accuracy and ethics.
