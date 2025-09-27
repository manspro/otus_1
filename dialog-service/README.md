# Dialog Service

Микросервис для диалогов и сообщений.

## Функции

- Отправка сообщений
- История диалогов
- Список диалогов пользователя

## API

- `POST /dialog/{user_id}/send` - отправить сообщение
- `GET /dialog/{user_id}/list` - получить диалог  
- `GET /dialog/list` - список диалогов

Аутентификация: заголовок `x-user-id`

## Запуск

```bash
cd dialog-service
npm install
npm run start:dev
```

Swagger: http://localhost:3001/api
