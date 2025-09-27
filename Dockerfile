# Используем официальный Node.js образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci --legacy-peer-deps

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Удаляем dev зависимости после сборки
RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]
