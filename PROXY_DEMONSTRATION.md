# 🔄 Демонстрация проксирования диалогов

## Архитектура проксирования

```
┌─────────────────┐    HTTP запрос     ┌─────────────────┐
│                 │ ──────────────────► │                 │
│   КЛИЕНТ        │                    │   МОНОЛИТ       │
│                 │ ◄────────────────── │   (Port 3000)   │
└─────────────────┘    HTTP ответ      └─────────────────┘
                                                │
                                                │ ПРОКСИРОВАНИЕ
                                                │ HTTP запрос
                                                ▼
                                       ┌─────────────────┐
                                       │                 │
                                       │ DIALOG-SERVICE  │
                                       │   (Port 3001)   │
                                       └─────────────────┘
```

## Как работает проксирование

1. **Клиент** отправляет запрос к **монолиту** на порт 3000
2. **Монолит** получает запрос и проверяет JWT токен
3. **Монолит** извлекает user_id из токена
4. **Монолит** проксирует запрос к **dialog-service** на порт 3001
5. **Dialog-service** обрабатывает запрос и возвращает ответ
6. **Монолит** возвращает ответ клиенту

## Примеры запросов для тестирования

### 1. Регистрация пользователя (только монолит)
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Иван",
    "second_name": "Петров", 
    "birthdate": "1990-01-01",
    "biography": "Тестовый пользователь",
    "city": "Москва",
    "password": "password123"
  }'
```

### 2. Авторизация (только монолит)
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "USER_ID_FROM_REGISTRATION",
    "password": "password123"
  }'
```

### 3. Отправка сообщения (ПРОКСИРУЕТСЯ!)
```bash
# Запрос идет к монолиту, но обрабатывается dialog-service
curl -X POST http://localhost:3000/dialog/FRIEND_ID/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Привет! Это сообщение проксируется к dialog-service!"
  }'
```

### 4. Получение диалогов (ПРОКСИРУЕТСЯ!)
```bash
# Запрос идет к монолиту, но обрабатывается dialog-service
curl -X GET http://localhost:3000/dialog/FRIEND_ID/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Список всех диалогов (ПРОКСИРУЕТСЯ!)
```bash
# Запрос идет к монолиту, но обрабатывается dialog-service
curl -X GET http://localhost:3000/dialog/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Как убедиться, что проксирование работает

### Способ 1: Логи контейнеров
```bash
# Смотрим логи монолита
docker compose logs -f dating-app-monolith

# В другом терминале смотрим логи dialog-service
docker compose logs -f dialog-service

# Отправляем запрос и видим активность в ОБОИХ логах
```

### Способ 2: Прямое сравнение
```bash
# Прямой запрос к dialog-service (НЕ проксирование)
curl -X POST http://localhost:3001/dialog/FRIEND_ID/send \
  -H "x-user-id: USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"text": "Прямой запрос к микросервису"}'

# Запрос через монолит (ПРОКСИРОВАНИЕ)
curl -X POST http://localhost:3000/dialog/FRIEND_ID/send \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Запрос через проксирование"}'
```

### Способ 3: Остановка dialog-service
```bash
# Останавливаем dialog-service
docker compose stop dialog-service

# Пробуем отправить сообщение через монолит
curl -X POST http://localhost:3000/dialog/FRIEND_ID/send \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Этот запрос должен упасть"}'

# Должна быть ошибка "Dialog service unavailable" (503)
```

## Swagger документация

- **Монолит**: http://localhost:3000/api
- **Dialog Service**: http://localhost:3001/api

Обратите внимание: в Swagger монолита диалоги показаны как обычные эндпоинты, но внутри они проксируются!

## Преимущества такой архитектуры

1. **Обратная совместимость**: Клиенты продолжают обращаться к монолиту
2. **Постепенная миграция**: Можно выделять сервисы по одному
3. **Единая точка входа**: Монолит остается API Gateway
4. **JWT аутентификация**: Монолит проверяет токены и передает user_id
5. **Изоляция**: Dialog-service может масштабироваться независимо

## Код проксирования

В файле `src/dialogs/dialogs.controller.ts`:

```typescript
async sendMessage(
  @Param('user_id') toUserId: string,
  @Body() sendMessageDto: SendMessageDto,
  @GetUser() user: User,
): Promise<void> {
  // ПРОКСИРОВАНИЕ: Запрос перенаправляется к dialog-service
  return this.dialogProxyService.sendMessage(sendMessageDto, user.id, toUserId);
}
```

В файле `src/dialog-proxy/dialog-proxy.service.ts`:

```typescript
async sendMessage(sendMessageDto: SendMessageDto, fromUserId: string, toUserId: string): Promise<void> {
  try {
    await firstValueFrom(
      this.httpService.post(
        `${this.dialogServiceUrl}/dialog/${toUserId}/send`,
        sendMessageDto,
        {
          headers: {
            'x-user-id': fromUserId,
            'Content-Type': 'application/json',
          },
        }
      )
    );
  } catch (error) {
    throw new HttpException('Dialog service unavailable', 503);
  }
}
```

## Заключение

Эта архитектура демонстрирует **правильный подход к миграции от монолита к микросервисам**:

- ✅ Клиенты не меняют API
- ✅ Монолит остается точкой входа
- ✅ Диалоги обрабатываются отдельным сервисом
- ✅ Можно масштабировать dialog-service независимо
- ✅ Легко добавить мониторинг и логирование проксирования
