# Гранат науки

[![CI](https://github.com/Meetyouafter/granat-nauki/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Meetyouafter/granat-nauki/actions/workflows/ci.yml)

Сайт детского психолога (подготовка к школе, репетиторство) и админка для его контента.

## Архитектура

Два приложения и общая база. Отдельного бэкенда нет: всё серверное (база, API админки, авторизация) живёт в Next.

```
dev                                          prod
браузер ─► :3000  main (next dev)            браузер ─► nginx на хосте (TLS)
браузер ─► :3001  admin (vite dev)                       ├─ site.ru         ─► main  (node server.js)
                   └─ /api ─► main                       └─ admin.site.ru
main ─► db (postgres :5432)                                   ├─ /api/      ─► main
                                                              └─ /          ─► admin (nginx, статика)
                                             main ─► db (наружу не открыта)
```

- **Публичный сайт** (`main/src/app/[locale]`) читает базу прямо в server components, без собственного API. Языки ru и en через `next-intl`.
- **Админка** (`admin/`) — отдельное SPA. С сервером общается только через Route Handlers в `main/src/app/api` по относительному `/api/...`. В dev запросы проксирует Vite (`server.proxy`), в prod nginx. Поэтому для браузера админка и API находятся на одном origin, и CORS не нужен.
- **Контракты** (`packages/contracts`): схемы запросов (zod), типы ответов и коды ошибок, которые используют и main, и admin. Если сервер начнёт отдавать не то, что описано в контракте, это поймает `tsc`, а не пользователь админки.

## Структура репозитория

```
main/                  Next.js 16 (App Router): сайт + API + auth + Prisma
  prisma/              schema.prisma, migrations/, seed.ts (конфиг: prisma7.config.ts)
  src/app/[locale]/    страницы сайта
  src/app/api/         Route Handlers для админки
  src/lib/             серверные модули
admin/                 Vite + React SPA, Feature-Sliced Design
packages/
  contracts/           @granat/contracts: zod-схемы, DTO, коды ошибок, лимиты
  tsconfig/            @granat/tsconfig: общий строгий base.json
  eslint-config/       @granat/eslint-config: единые правила ESLint
  stylelint-config/    @granat/stylelint-config: правила SCSS
docker-compose.yaml        dev
docker-compose.prod.yaml   prod
```

pnpm workspace: один `pnpm-lock.yaml` на весь репозиторий, версия pnpm закреплена в корневом `package.json` (`packageManager`). Общие версии зависимостей (`zod`, `typescript`, линтеры) задаются в `catalog:` в `pnpm-workspace.yaml`, локальные пакеты подключаются через `workspace:*`. `@granat/contracts` экспортируется исходниками TypeScript, без сборки: Next компилирует его через `transpilePackages`, Vite читает напрямую.

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

Исходники `main/`, `admin/` и `packages/` смонтированы в контейнеры, правки подхватываются без пересборки. `node_modules` хранятся в анонимных volume. Флаг `-V` нужен только после изменения `package.json`, lockfile, `pnpm-workspace.yaml` или Dockerfile.

База данных (команды выполняются внутри контейнера, потому что `DATABASE_URL` указывает на хост `db`):

```bash
docker compose exec main pnpm prisma migrate dev --name <name>
docker compose exec -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... main pnpm prisma db seed
```

`prisma format`, `validate` и `generate` к базе не обращаются, их можно запускать на хосте в `main/`.

## Авторизация

Вход в админку по email и паролю. Сессии хранятся в базе, токен передаётся в httpOnly-cookie, JWT не используется: отзыв прав и выход срабатывают сразу.

- **Роли.** `USER` после регистрации может только отправить запрос на права. `ADMIN` видит и правит контент и решает по запросам. При регистрации роль всегда `USER`. Админ появляется только через seed или одобрение запроса.
- **Токен** имеет вид `id.secret`. В базе хранится только SHA-256 от secret, сравнение выполняется за постоянное время.
- **Срок сессии:** день с последней активности (продлевается при каждом запросе), но не больше трёх дней с момента входа.
- **Cookie:** `__Host-session` в prod, `session` в dev; `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`. Привязана только к хосту админки.
- **Пароли:** argon2id с pepper из `PASSWORD_PEPPER`, длина от 15 до 128 символов, без требований вида «обязательно цифра».
- **Сброс сессий.** При смене пароля удаляются все сессии пользователя и выдаётся новая для текущего устройства. При выдаче прав удаляются все сессии пользователя. Отдельные сессии можно завершить из списка сеансов в настройках.
- **Вход не раскрывает, существует ли email:** на любую ошибку один ответ, а для несуществующего email считается фиктивный хэш, чтобы время ответа было одинаковым. Регистрация занятый email раскрывает (`409`), это осознанный компромисс, перебор ограничен rate limit.
- **CSRF:** `withErrorHandling` отклоняет любой не-GET запрос, у которого `Sec-Fetch-Site` не равен `same-origin`.
- **Rate limit** (`src/lib/rateLimit.ts`, в памяти процесса): вход 20 попыток на IP и 10 на email за 15 минут, регистрация 5 на IP, смена пароля 5 на пользователя. IP берётся только из `X-Real-IP`, который ставит nginx. Без nginx IP будет `unknown`. Лимиты в памяти работают, пока main запущен в одном экземпляре.

Права проверяются в каждом хендлере через DAL (`src/lib/auth/dal.ts`): `requireUser()` возвращает 401, `requireAdmin()` возвращает 403. `src/proxy.ts` отвечает только за i18n и для защиты не используется. Наружу уходят только DTO без `passwordHash`.

## API

Все хендлеры обёрнуты в `withErrorHandling` (`src/lib/http.ts`): проверка CSRF, `AppError` превращается в JSON с кодом из `API_STATUSES`, ответы с `Cache-Control: no-store`. Тела запросов проверяются zod-схемами из `@granat/contracts` через `parseBody`.

| Метод и путь | Доступ | Что делает |
|---|---|---|
| `POST /api/auth/signup` | все | регистрация, роль `USER` |
| `POST /api/auth/signin` | все | вход, ставит cookie |
| `POST /api/auth/signout` | все | удаляет текущую сессию и cookie |
| `GET /api/auth/me` | user | текущий пользователь |
| `POST /api/auth/change-password` | user | смена пароля, сброс всех сессий |
| `GET /api/auth/sessions` | user | список своих сеансов |
| `DELETE /api/auth/sessions` | user | завершить все сеансы, кроме текущего |
| `DELETE /api/auth/sessions/:id` | user | завершить один сеанс |
| `GET /api/access-requests/me` | user | свой запрос на права |
| `POST /api/access-requests` | user | отправить запрос на права |
| `GET /api/access-requests` | admin | все запросы |
| `PATCH /api/access-requests/:id` | admin | одобрить или отклонить |
| `GET /api/health` | все | проверка, что приложение и база доступны |

Новый эндпоинт: схема тела и тип ответа в `@granat/contracts`, проверка прав через DAL первой строкой хендлера, ответ с `satisfies <ТипОтвета>`.

## Prod

`docker-compose.prod.yaml` собирает prod-стадии тех же Dockerfile, у dev-compose стадия `dev`:

| Стадия | Dockerfile | Что внутри |
|---|---|---|
| `dev` | main, admin | зависимости; исходники монтируются из compose, `pnpm dev` |
| `migrations` | main | всё из сборки, включая prisma CLI; `prisma migrate deploy` и выход |
| `runner` | main | Next в режиме `standalone` (~210 МБ): `node server.js` без исходников и dev-зависимостей |
| `runner` | admin | собранная статика за nginx, SPA-fallback на `index.html`, `/api` проксируется в main |

Сервис `migrations` выполняется и завершается до старта main. База наружу не открыта, main и admin слушают только `127.0.0.1` (`:3000` и `:3001`), снаружи к ним ходит nginx на хосте с TLS. Проект compose отдельный (`granat-nauki-prod`): свои контейнеры, сеть и volume базы, с dev не пересекается.

```bash
docker compose -f docker-compose.prod.yaml up -d --build
docker compose -f docker-compose.prod.yaml logs migrations
docker compose -f docker-compose.prod.yaml run --rm -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... migrations pnpm prisma db seed
```

Env-файлы те же, что в dev (см. «Окружение»), со своими значениями на сервере и своим `PASSWORD_PEPPER`. Локально перед запуском остановить dev (`docker compose stop`): порты совпадают.

При сборке `next build` и `prisma generate` получают фиктивный `DATABASE_URL`: к базе они не подключаются. Если страница сайта начнёт читать базу при пререндере, сборка упадёт. Такую страницу нужно сделать динамической.

Деплой на сервер ещё не настроен: хостинг, nginx на хосте с TLS (`site.ru` → main, `admin.site.ru/api/` → main, `admin.site.ru/` → admin, `X-Real-IP` из адреса соединения), бэкапы базы.

## Проверки

```bash
pnpm install
pnpm check    # typecheck + lint во всех пакетах
pnpm fix      # линтеры с автоисправлением
pnpm build    # сборка main и admin
pnpm verify   # check, затем build
```

Перед коммитом должны проходить `check` и `build`. `build` сам ничего не проверяет и не исправляет. Стиль кода задаёт `@granat/eslint-config`: точки с запятой, одинарные кавычки, отступ 2 пробела, строка до 100 символов, фиксированный порядок импортов. Тестов пока нет.

## Ветки и CI

- Работа идёт в `develop`: коммиты и push туда. `main` стабильная, с неё будет деплой.
- В `main` изменения попадают только через PR `develop → main`, слияние только merge commit. Не squash: `develop` живёт постоянно, а squash разводит историю веток и даёт ложные конфликты в следующем PR.
- `main` защищена ruleset'ом на GitHub: прямой push, force push и удаление запрещены, PR нельзя слить, пока не прошли проверки CI.

CI (`.github/workflows/ci.yml`, GitHub Actions) запускается на push в `develop` и `main` и на PR в `main`:

| Job | Что делает |
| --- | --- |
| `check` | `pnpm install`, `prisma generate`, `pnpm check` (в main с проверкой ключей ru/en), `pnpm build` |
| `migrations` | применяет все миграции к пустому Postgres и через `prisma migrate diff` проверяет, что `schema.prisma` с ними совпадает: ловит изменение схемы без миграции |
| `docker` | собирает prod-образы (main `runner`, main `migrations`, admin `runner`) без публикации, чтобы Dockerfile не ломался незаметно |
