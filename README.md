# Гранат науки

Сайт детского психолога (подготовка к школе, репетиторство) и админка для его контента.

- `main/`: Next.js 16, публичный сайт и вся серверная часть (Prisma 7 + Postgres, API для админки, авторизация)
- `admin/`: Vite + React SPA админки
- `packages/`: общие контракты (`@granat/contracts`) и конфиги TypeScript, ESLint, Stylelint

pnpm workspace, версия pnpm закреплена в корневом `package.json`.

## Окружение

Env-файлы не коммитятся, в git лежат только шаблоны `.env.example` с ключами без настоящих значений. Перед первым запуском:

```bash
cp .env.example .env
cp main/.env.example main/.env
```

| Файл | Ключ | Что это |
|---|---|---|
| `.env` | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` | пользователь, пароль и имя базы для контейнера `db`; compose подставляет их в `docker-compose.yaml` |
| `main/.env` | `DATABASE_URL` | строка подключения Prisma: `postgresql://<user>:<password>@db:5432/<database>`, значения те же, что в корневом `.env`; хост `db` доступен только внутри docker-сети |
| `main/.env` | `PASSWORD_PEPPER` | секрет для хэшей паролей (argon2id), base64, не меньше 32 байт: `openssl rand -base64 32`. После смены все сохранённые пароли перестают подходить; хранится отдельно от бэкапов базы |

`main/.env` попадает в контейнер `main` через `env_file`. `NODE_ENV` в env-файлы не пишется: Next выставляет его сам.

Учётные данные админа в env-файлах не хранятся, они передаются только при seed (см. ниже). `API_PROXY_TARGET` для админки задан в `docker-compose.yaml`.

## Запуск

Всё запускается через docker compose из корня репозитория:

```bash
docker compose up -d                   # main :3000, admin :3001, db :5432, dozzle (логи) :8888
docker compose up -d --build -V main   # пересборка main после изменения package.json / lockfile / Dockerfile
docker compose logs -f main
```

Сайт: http://localhost:3000/ru, админка: http://localhost:3001.

База данных (команды выполняются внутри контейнера, потому что `DATABASE_URL` указывает на хост `db`):

```bash
docker compose exec main pnpm prisma migrate dev --name <name>
docker compose exec -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... main pnpm prisma db seed
```

## Проверки

```bash
pnpm install
pnpm check    # typecheck + lint во всех пакетах
pnpm fix      # линтеры с автоисправлением
pnpm build    # сборка main и admin
pnpm verify   # check, затем build
```
