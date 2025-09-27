# Dating App

## Архитектура

```
┌─────────────┐    HTTP/JWT     ┌─────────────┐    HTTP/x-user-id    ┌─────────────┐
│   CLIENT    │ ──────────────► │  MONOLITH   │ ──────────────────► │DIALOG SERVICE│
│             │                │  (port 3000)│                    │ (port 3001) │
│             │ ◄────────────── │             │ ◄────────────────── │             │
└─────────────┘    Response     └─────────────┘      Response       └─────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │   SQLite    │
                                │  Database   │
                                └─────────────┘
```

**Компоненты:**
- **Монолит** (3000) - пользователи, посты, друзья, проксирование диалогов
- **Dialog Service** (3001) - диалоги и сообщения

**Проксирование:** Запросы диалогов через старое API обрабатываются новым микросервисом.

## Технологии

- NestJS, TypeORM, SQLite
- JWT аутентификация
- Docker Compose

## Запуск

```bash
# Быстрый запуск
docker compose up -d

# Или сборка образов вручную
docker build -t dating-app-monolith .
docker build -t dialog-service ./dialog-service
docker compose up -d
```

## API

- Основное приложение: http://localhost:3000/api
- Сервис диалогов: http://localhost:3001/api

## Тестирование

Используйте Postman коллекции:
- `postman-collection.json`
- `postman-collection-microservices.json`
