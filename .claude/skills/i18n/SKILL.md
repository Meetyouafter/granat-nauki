---
name: i18n
description: How ru/en localization works on the granat-nauki site (main/, next-intl) — locale JSON files, key parity, getTranslations vs useTranslations, t.raw arrays, page metadata in data/metadata.ts, localized navigation. Use when adding or changing any user-visible text, aria-label, page title/description, or a new page in main/src/app/[locale].
---

# granat-nauki i18n (next-intl)

Locales: `ru` (default) and `en`. Every public page lives under `main/src/app/[locale]/`.

```
src/i18n/routing.ts     locales + defaultLocale
src/i18n/request.ts     loads src/locales/<locale>.json per request
src/i18n/navigation.ts  locale-aware Link, redirect, usePathname, useRouter, getPathname
src/proxy.ts            next-intl middleware (locale detection/redirect) — nothing else
src/locales/ru.json     UI strings, ru
src/locales/en.json     UI strings, en — same keys
src/data/metadata.ts    page <title>/description per locale (not in the JSON)
```

## Rules

- **No user-visible literal in JSX.** Text, `alt`, `aria-label`, `title`, placeholders — all from the locale files. Known leaks to not copy: Russian fallbacks in `contacts/page.tsx`, `aria-label="Next slide"` in `ui/Slider`, hardcoded `alt` in `LanguageSwitcher`.
- **Key parity is exact.** Every key added to `ru.json` is added to `en.json` in the same commit, same nesting. Check:

  ```bash
  cd main && python3 -c "
  import json
  def k(d,p=''):
      s=set()
      for a,b in d.items(): s|=k(b,p+a+'.') if isinstance(b,dict) else {p+a}
      return s
  r,e=(k(json.load(open(f'src/locales/{l}.json'))) for l in ('ru','en'))
  print('only ru:',r-e or '-'); print('only en:',e-r or '-')"
  ```

- **Namespace = top-level key per page/component** (`HomePage`, `AboutPage`, `Header.navigation`, `ReviewForm`, `ErrorPage`). New page → new `XxxPage` namespace; new shared component → its own namespace named after the component.
- Russian is the source text. Write ru first, then a real English translation — not a transliteration, not a placeholder.

## Reading strings

- Server component (default): `const t = await getTranslations('AboutPage')` from `next-intl/server`.
- Client component (`'use client'`): `const t = useTranslations('Cookie')` from `next-intl`. Messages reach the client through `NextIntlClientProvider` in `[locale]/layout.tsx`.
- Lists: arrays in JSON read with `t.raw('items')` and cast to a typed shape at the call site (`services/page.tsx`, `MainPage.tsx`). Don't couple other data to array indexes — prices bound to `servicesData[index]` is a known bug: reordering the translated array mis-prices services. Give items a stable key instead.

## Page metadata

`generateMetadata` reads from `src/data/metadata.ts`:

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metadata.about[locale as keyof typeof metadata.about] ?? metadata.about.en;
}
```

A new page adds its `{ ru: { title, description }, en: { … } }` entry there. The `%s | Гранат Науки` template comes from `metadata.template` in the layout.

## Links and locale switching

- Route strings come from `paths` (`@constants`), never literals — see [[frontend-conventions]].
- `src/i18n/navigation.ts` gives locale-aware `Link`/`useRouter`/`usePathname`; `LanguageSwitcher` uses them (`router.replace(pathname, { locale })`). Existing `Button`, `TextLink`, `Navigation`, `Logo` import `next/link` and rely on `proxy.ts` to add the locale prefix via redirect. Don't mix the two in one component; ask the user before migrating existing components.

## DB content

Content from the DB (FAQ, articles, reviews) is not in the locale files. Until per-locale translations exist in the DB, a ru row can show on `/en` — that's a data problem, don't patch it with UI strings.

Text itself (tone, dashes, forbidden wording) — see [[content-copy]].
