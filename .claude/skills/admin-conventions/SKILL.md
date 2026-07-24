---
name: admin-conventions
description: Code-level styling conventions for the granat-nauki admin panel (Vite/React app under admin/) — color tokens, typography mixins, and combining CSS-module classes. Use when writing or editing any component/module under admin/src, not just when touching visual styling.
---

# granat-nauki admin conventions

## Always use color tokens

Never hardcode a hex/rgb color value in a component or its `.module.scss`. Use the CSS custom properties defined in `admin/src/styles/colors.scss` (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-border`, `--color-accent`, `--color-accent-hover`, `--color-cta`, `--color-cta-hover`, `--color-error`, `--color-shadow-rgb`):

```scss
.link {
  color: var(--color-text-secondary);

  &:hover {
    color: var(--color-text);
  }
}
```

This is a deliberately small token set (trimmed 2026-07-24 — no tertiary bg/text variants, no success/warning/info) — don't reintroduce those tiers or add a one-off hex value; if a new need doesn't fit an existing token, add a token to `colors.scss` rather than inlining a color.

## Always use typography mixins

Never hand-write `font-size`/`line-height`/`font-family` in a component's `.module.scss`. Use the mixins from `admin/src/styles/typography.scss` (`text-xxs` through `text-xxl`, `display`, `body-font`, `regular`/`semibold`/`bold`/`extrabold`):

```scss
@use '../../styles/typography';

.title {
  @include typography.text-lg;
  @include typography.semibold;
}
```

`body-font` is already applied globally on `html, body` (`globals.scss`) — only opt into `display` when a component specifically needs the display/heading family.

## Combining class names — use `classnames`

`classnames` is already a dependency (`admin/package.json`). For a single conditional class or one static + one dynamic class, a plain template string or ternary is fine. Once a className has **more than two** classes being combined (static + multiple conditionals, or several dynamic pieces), switch to `classnames` instead of chaining ternaries/template strings:

```tsx
import classNames from 'classnames'
import styles from './Header.module.scss'

const linkClassName = classNames(styles.link, isActive && styles.linkActive, className)
```

Reference implementation: `admin/src/components/Header/Header.tsx` (`NavLink`'s `className` callback combining `styles.link` and `styles.linkActive`).
