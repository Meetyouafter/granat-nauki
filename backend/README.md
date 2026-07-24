Основы Nest

Модули, контроллеры, сервисы, DI (dependency injection) 
Декораторы (@Injectable, @Controller, @Get/@Post и т.д.)
Pipes (валидация данных через class-validator/class-transformer) и Guards (авторизация запросов)
Interceptors и Exception Filters — обработка ответов и ошибок централизованно

База данных
Prisma ORM или TypeORM
PostgreSQL как основная БД
Миграции, связи между таблицами (one-to-many, many-to-many)

Аутентификация и авторизация
JWT (access + refresh токены)
Passport.js
Ролевая модель (RBAC) через Guards

API дизайн
REST — как база (для старта проще)
GraphQL (@nestjs/graphql) — если хочешь пощупать альтернативу, у Nest отличная интеграция
Swagger/OpenAPI — автогенерация документации API из декораторов

Redis — кэширование и/или сессии
Очереди задач — BullMQ (Nest имеет нативную интеграцию), полезно для фоновых задач (отправка писем, обработка файлов)
WebSockets (@nestjs/websockets) — если в проекте нужен real-time (чат, уведомления)
Тестирование — Jest уже встроен в Nest по умолчанию, попробуй unit + e2e тесты

Деплой и инфраструктура
Docker
Деплой на Railway/Render/Fly.io (просто и бесплатно для пет-проекта) или VPS + nginx
CI/CD — простой GitHub Actions pipeline (lint + test + deploy)