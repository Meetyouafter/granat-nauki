---
name: admin-conventions
description: Code-level styling conventions for the granat-nauki admin panel (Vite/React app under admin/) — color tokens, typography mixins, and combining CSS-module classes. Use when writing or editing any component/module under admin/src, not just when touching visual styling.
---

# granat-nauki admin conventions

## Layout: Feature-Sliced Design

`admin/src` follows FSD as of 2026-08-11: `app / pages / widgets / features / entities / shared`, imports flowing downward only. Each slice exposes an `index.ts` public API; reach for `@entities/faq`, not `@entities/faq/api/faqApi`. Inside a slice use relative paths, across slices use the aliases `@app @pages @widgets @features @entities @shared` (they work in SCSS too). ESLint enforces the boundaries via `no-restricted-imports` in `admin/eslint.config.js` — a violation fails `pnpm lint`. Details in `admin/README.md`.

New shared component → `shared/ui/<Name>/` with an `index.ts`. New API call → the matching `entities/<slice>`, never a page.

Request/response types, validation limits, zod schemas and error codes come from `@granat/contracts` (a regular package, allowed in any layer), never re-declared here: `builder.query<MeResponse, void>`, `signupSchema.safeParse(form)`, `MIN_PASSWORD_LENGTH`. UI-only types (form state, view models) stay in the slice.

Lint rules come from the shared `@granat/eslint-config` (same as `main`: semicolons, single quotes, typescript-eslint `strictTypeChecked`); `admin/eslint.config.js` only adds the FSD boundaries and `react-refresh`. Import order is enforced by `eslint-plugin-simple-import-sort`, groups separated by a blank line, alphabetical within each: side effects → react → other packages → one group per layer in FSD order (`@app @pages @widgets @features @entities @shared`) → relative paths → styles last. Don't hand-order imports — run `pnpm eslint . --fix`.

SCSS is checked by stylelint from the shared `@granat/stylelint-config` (same rules as `main`: `stylelint-config-standard-scss` plus our naming and order). Class and `@keyframes` names are camelCase, no hand-written `-webkit-` prefixes (autoprefixer adds them at build time). Properties are ordered by groups (visibility → transform → position → layout → margin → border → dimensions → padding → overflow → animation → font → color), `@include` goes before declarations. Don't order by hand — `pnpm fix` fixes it.

## Always use color tokens

Never hardcode a hex/rgb color value in a component or its `.module.scss`. Use the CSS custom properties defined in `admin/src/shared/styles/colors.scss`:

- neutrals: `--color-bg`, `--color-surface`, `--color-surface-muted` (table head, row hover, empty states), `--color-border`, `--color-border-strong` (inputs), `--color-text`, `--color-text-secondary`, `--color-text-tertiary` (placeholders, meta), `--color-text-inverse`
- the one action color: `--color-accent` / `-hover` / `-subtle` (dark sage, the site's brand hue darkened for contrast): primary buttons, links, active nav, focus
- danger: `--color-error` / `-hover` / `-bg` (soft brick, not an alarm red)
- status tones for badges: `--color-success`/`-bg`, `--color-processing`/`-bg`, `--color-pending`/`-bg`
- `--color-shadow-rgb` for shadows and translucent hovers: `rgb(var(--color-shadow-rgb), 0.05)`

Palette reworked 2026-10-19: the old teal accent + brown `--color-cta` pair and the neon `#f9330d` error were dropped. There is no separate CTA color in the admin: one accent for every primary action. Don't add a generic `warning`/`info` tier or a one-off hex; if a need doesn't fit, add a token to `colors.scss`.

Non-color tokens live in `admin/src/shared/styles/tokens.scss`: `--space-*`, `--radius-*`, `--shadow-*` (incl. `--shadow-focus`, `--shadow-focus-error`), motion, z-index, sizes (`--size-control-sm/md` 32/40px, `--size-header`, `--size-content`). Use them instead of px that happen to match.

Shared SCSS mixins in `admin/src/shared/styles/mixins.scss`: `surface` (bordered panel), `control` (text-field look), `focus-ring`, `page($max-width)` (page column under the header).

## Use the shared UI primitives

Don't hand-style buttons, inputs or pills in a page; use `shared/ui`:

- `Button` (`variant: primary | secondary | ghost | danger`, `size: sm | md`, `isIconOnly`, `isLoading`); `getButtonClassName()` for a router `Link` that looks like a button
- `Field` (label + control + error line that keeps its height) with `Input` / `Textarea` / `Select` (`isInvalid` → `aria-invalid`); `PasswordInput` is built on `Input`
- `Badge` (`tone: neutral | accent | pending | processing | success | error`); `StatusBadge` is built on it
- `PageHeader` (title, `count`, `extra` next to the title, `actions`, `back` link), `EmptyState` (text + optional action)
- `ConfirmModal`, `FormActions` (sticky save bar), `Toast`, `Loader`, `Pagination`, icons in `shared/ui/icons` (no emoji or unicode glyphs as icons)

## Always use typography mixins

Never hand-write `font-size`/`line-height`/`font-family` in a component's `.module.scss`. Use the mixins from `admin/src/shared/styles/typography.scss` (`text-xs` 14px, `text-sm` 16px, `text-md` 20px, `text-lg` 24px; `regular`/`semibold`/`bold`):

```scss
@use '@shared/styles/typography';

.title {
  @include typography.text-lg;
  @include typography.semibold;
}
```

The base size is `text-xs` (14px) on `html, body` (`admin/src/app/styles/globals.scss`): the admin is a dense work tool. Controls use `text-sm` (no iOS zoom on focus), page titles `text-lg`.

## Combining class names — use `classnames`

`classnames` is already a dependency (`admin/package.json`). For a single conditional class or one static + one dynamic class, a plain template string or ternary is fine. Once a className has **more than two** classes being combined (static + multiple conditionals, or several dynamic pieces), switch to `classnames` instead of chaining ternaries/template strings:

```tsx
import classNames from 'classnames'
import styles from './Header.module.scss'

const linkClassName = classNames(styles.link, isActive && styles.linkActive, className)
```

Reference implementation: `admin/src/widgets/header/ui/Header.tsx` (`NavLink`'s `className` callback combining `styles.link` and `styles.linkActive`).
