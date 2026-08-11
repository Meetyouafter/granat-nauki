## Админка

Панель управления контентом сайта.

### Функционал
- **FAQ** — управление списком вопросов и ответов.
- **Отзывы** — добавление, редактирование, удаление отзывов клиентов.
- **Статьи** — создание, редактирование, удаление статей.
- **Услуги** — управление карточками услуг.
- **Контакты / заявки** — просмотр заявок, оставленных через форму контактов на сайте.

### Архитектура — Feature-Sliced Design

```
src/
  main.tsx        точка входа (вне слоёв)
  app/            провайдеры, роутинг, layout, глобальные стили
  pages/          faq, home, login, reviews
  widgets/        header
  features/       faq-editor, review-editor
  entities/       faq, review
  shared/         ui, api, config, styles
```

Импорты — только сверху вниз (`app → pages → widgets → features → entities → shared`), слайс подключается через свой `index.ts`, между слайсами — алиасы `@app @pages @widgets @features @entities @shared` (работают и в SCSS).

Границы слоёв и порядок импортов проверяет ESLint; автофикс — `npx eslint . --fix`.
