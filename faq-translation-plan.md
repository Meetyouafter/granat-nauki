# Асинхронный перевод FAQ на EN + статус в админке

## Контекст

Сейчас `FaqEntity`/`FaqTranslationEntity` (`backend/src/faq/entities/faq.entity.ts`) поддерживают модель "сущность + переводы по locale", но на практике весь код (`faq.service.ts`) читает/пишет только `locale='ru'` — EN-переводы никогда не создаются и не обновляются. `GET /faq` использует `innerJoinAndSelect` с фильтром по locale, поэтому элементы без перевода на нужный язык **молча выпадают** из ответа. Админка (`Faq.tsx`/`FaqRow.tsx`) вообще не показывает locale — редактирует один плоский набор полей.

Цель: админ по-прежнему правит только RU-текст. После сохранения в фоне (без Redis/BullMQ — не нужен для такого масштаба) генерируется EN-перевод через Claude API (ключ `CLAUDE_KEY` уже лежит в `backend/.env`, неиспользуемый). Админ видит только маленький бейдж статуса перевода (pending/done/failed) в строке FAQ — без редактирования переведённого текста.

**Решения, принятые с пользователем:**
- Движок перевода — **Claude API** (существующий `CLAUDE_KEY`), не DeepL.
- Только что созданный вопрос **не показывается на `/en/faq`**, пока перевод не готов впервые. При этом уже опубликованный (ранее переведённый) вопрос при правке RU **не пропадает** с английской страницы — остаётся последний удачный перевод со статусом "pending", пока не подъедет новый.

## Схема данных

`backend/src/faq/entities/translation-status.enum.ts` (новый файл, первый enum в backend/src):
```ts
export enum TranslationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  FAILED = 'failed',
}
```

В `FaqTranslationEntity` (`faq.entity.ts`) добавить колонки:
- `status: TranslationStatus` — `@Column({ type: 'enum', enum: TranslationStatus, default: TranslationStatus.DONE })`. RU-строки всегда `DONE` (это источник); EN-строкам сервис явно ставит `PENDING`.
- `attempts: number` — `@Column({ default: 0 })`.
- `lastError: string | null` — `@Column({ type: 'text', nullable: true })`.
- `updatedAt: Date` — `@UpdateDateColumn()` (используется и как "heartbeat" для конкурентной обработки, см. ниже).

Отдельная таблица очереди не нужна — состояние живёт прямо в строке перевода. `synchronize: true` (миграций в проекте нет) применит новые колонки/enum автоматически при рестарте backend.

**Безопасный захват батча воркером** (на случай накладывающихся тиков): в транзакции raw-запросом (`manager.query`, т.к. `SELECT ... FOR UPDATE SKIP LOCKED` неудобно выразить через query builder):
```sql
UPDATE faq_translations
SET status = 'processing', "updatedAt" = now()
WHERE id IN (
  SELECT id FROM faq_translations
  WHERE status = 'pending'
     OR (status = 'processing' AND "updatedAt" < now() - interval '10 minutes')
  ORDER BY "updatedAt" ASC
  LIMIT $1
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```
Условие про "processing дольше 10 минут" самовосстанавливает зависшие строки после падения процесса.

## Изменения в `faq.service.ts`

**`createFaqItem`** — создаёт RU-строку с реальным текстом и EN-строку-заглушку **без бридж-копии RU**:
```ts
translations: [
  { locale: LOCALE_RU, title, description },
  { locale: LOCALE_EN, title: '', description: '', status: TranslationStatus.PENDING },
]
```
Пустой `title`/`description` — сигнал "ещё ни разу не переведено", используется при фильтрации EN-ответа (см. ниже).

**`editFaqItem`** — `saveFaqItems` вызывает `editFaqItem` для *каждого* элемента при любом сохранении, включая чистый drag-and-drop без изменения текста. Нужно ставить `PENDING` только если текст реально изменился:
```ts
const textChanged = ru.title !== dto.title || ru.description !== dto.description;
ru.title = dto.title;
ru.description = dto.description;

if (textChanged) {
  const en = entity.translations.find(t => t.locale === LOCALE_EN)
    ?? entity.translations[entity.translations.push({ locale: LOCALE_EN, title: '', description: '' } as FaqTranslationEntity) - 1];
  en.status = TranslationStatus.PENDING;
  en.attempts = 0;
  en.lastError = null;
  // en.title/description НЕ трогаем — это и есть "последний хороший перевод" для уже переведённых элементов.
}
```

**`getFaqItems` — фильтр/фолбэк по locale, заменяет `innerJoinAndSelect`:**
Переключить на `leftJoinAndSelect('faq.translations', 'translation')` (без фильтра locale в самом join) и выбирать нужную строку в коде:
- `locale = 'ru'` (дефолт, используется и админкой): вернуть все элементы, к каждому прикрепить `translationStatus` из его EN-строки (`enTranslation?.status ?? PENDING`).
- `locale = 'en'` (используется публичным фронтом): включать элемент только если EN-строка существует **и** `title !== ''` (т.е. хоть раз успешно переведена). Иначе — не показывать (это и реализует "скрывать до готовности", а заодно окончательно убирает случайный молчаливый дроп старых записей).

`toGetFaqDto` в `saveFaqItems` обновить аналогично.

## Воркер перевода

Новый модуль `backend/src/translation/`:
- `translation-provider.interface.ts` — `interface TranslationProvider { translate(title: string, description: string): Promise<{ title: string; description: string }> }` — абстракция, чтобы движок можно было сменить, не трогая cron-логику.
- `claude-translation.provider.ts` — вызывает Claude Messages API (`@anthropic-ai/sdk`, новая зависимость) с `CLAUDE_KEY` из `ConfigService`. Модель — `claude-haiku-4-5-20251001` (быстро и дёшево для короткого текста FAQ, сложное рассуждение не нужно). System-промпt: перевести с русского на английский, сохранив профессиональный, доброжелательный тон (сайт детского психолога/репетитора), вернуть **строго JSON** `{"title": "...", "description": "..."}`. Ответ парсить с `try/catch`; ошибка парсинга = неудачная попытка (как и сетевая ошибка).
- `translation-cron.service.ts` — `@Interval(60_000)` (проще, чем cron-выражение для "каждые N секунд"): захватить батч (SQL выше), для каждой EN-строки подтянуть текущий RU-текст того же `faq` (через relation), вызвать провайдер. Успех → `title`/`description`/`status=DONE`/`attempts=0`/`lastError=null`. Ошибка → `attempts++`; если `attempts >= TRANSLATION_MAX_ATTEMPTS` (env, дефолт 5) → `status=FAILED` + `lastError`; иначе `status=PENDING` (следующий тик сам повторит — интервал опроса и есть backoff).
- `translation.module.ts` — `TypeOrmModule.forFeature([FaqEntity, FaqTranslationEntity])`, провайдеры выше.
- В `app.module.ts`: `ScheduleModule.forRoot()` (новая зависимость `@nestjs/schedule`) + импорт `TranslationModule`.

Env (`backend/.env`, добавить рядом с существующими):
- `CLAUDE_KEY=` — уже есть, переиспользуется.
- `TRANSLATION_BATCH_SIZE=5` (опционально, есть дефолт в коде).
- `TRANSLATION_MAX_ATTEMPTS=5` (опционально, есть дефолт в коде).

## DTO / Swagger → admin types

- `backend/src/faq/dto/getFaq.dto.ts` — добавить `translationStatus: TranslationStatus` (`@IsEnum(TranslationStatus)`, `@ApiProperty({ enum: TranslationStatus })`).
- `SaveFaqDto`/`PutFaqDto` не меняются — админка статус не отправляет.
- После рестарта backend в admin выполнить `npm run gen:api-types` (тянет живую Swagger-схему с `http://localhost:4000/api-json`) — обновит `admin/src/types/api.d.ts` с новым полем.
- `admin/src/types/index.ts`: `FaqItemDto` сейчас = `components['schemas']['SaveFaqDto']` (нет `translationStatus`). Переключить на `GetFaqDto` (там будет и `translationStatus`, и обязательный `id`) — `Faq.tsx`/`FaqRow.tsx` уже разделяют черновики от сохранённых через `fakeId`-юнион, логика не ломается.

## Admin UI

Новый компонент `admin/src/components/TranslationStatusBadge/TranslationStatusBadge.tsx` + `.module.scss` — цветная точка с нативным `title`-тултипом (без доп. либы), 3 визуальных состояния (`pending`/`processing` объединены в серый):
- pending/processing → `var(--color-text-secondary)`
- done → `var(--color-accent)`
- failed → `var(--color-error)`, тултип показывает `lastError`, если есть.

Используются существующие токены из `admin/src/styles/colors.scss`, новых не добавляем.

Подключить в `FaqRow.tsx`: бейдж рендерится только когда `'id' in item` (у черновых несохранённых строк `translationStatus` ещё нет).

## Порядок реализации

1. Enum + колонки в `faq.entity.ts` → рестарт backend, проверить схему (`\d faq_translations` в psql).
2. `faq.service.ts` (leftJoin + фильтр по locale, `createFaqItem`, `editFaqItem` с guard на `textChanged`, `toGetFaqDto`) + поле в `getFaq.dto.ts` → проверить через Swagger UI (`/api`) и curl `GET /faq`, `GET /faq?locale=en`.
3. `backend/src/translation/` (интерфейс, Claude-провайдер, cron-сервис), `npm i @anthropic-ai/sdk @nestjs/schedule`, регистрация в `app.module.ts`, env-переменные → проверить, посадив тестовую pending-строку и дождавшись тика.
4. Admin: `npm run gen:api-types`, обновить alias в `admin/src/types/index.ts`.
5. Admin: `TranslationStatusBadge`, подключение в `FaqRow.tsx`.
6. Полный ручной E2E-прогон (ниже).

## Проверка (ручной E2E)

1. Создать новый вопрос в админке → бейдж сразу серый (pending). `GET /faq?locale=en` — новый вопрос **отсутствует** в списке.
2. Дождаться тика `@Interval` (60 сек) → бейдж становится тёмно-бирюзовым (done); в БД у EN-строки реальный английский текст, `attempts=0`, `lastError=null`.
3. `GET /faq?locale=en` / фронт `/en/faq` — вопрос теперь виден с переводом.
4. Отредактировать RU-текст этого вопроса → бейдж мгновенно снова серый, но `/en/faq` **продолжает показывать старый** английский текст (последний хороший перевод), не пропадает.
5. Дождаться следующего тика → бейдж done, `/en/faq` отдаёт обновлённый перевод.
6. Отключить/сломать `CLAUDE_KEY`, отредактировать вопрос → `attempts` растёт с каждым тиком до `TRANSLATION_MAX_ATTEMPTS`, бейдж становится красным с текстом ошибки в тултипе; `/en/faq` продолжает отдавать последний хороший перевод (не падает, не показывает пусто).
7. Регрессия: перетащить существующие вопросы (drag-and-drop, без изменения текста) и сохранить → ни один бейдж не должен перейти в pending (проверка guard'а `textChanged`).
8. `tsc`/сборка admin после смены alias `FaqItemDto` → `GetFaqDto`, чтобы убедиться, что типы не разъехались.
