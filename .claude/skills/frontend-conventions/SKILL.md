---
name: frontend-conventions
description: Code-level conventions for the granat-nauki Next.js frontend — combining CSS-module classes, import aliases, and the design-system component layout under src/ui. Use when writing or editing any React component/module in frontend/src, not just when touching visual styling (see [[design-system]] for that).
---

# granat-nauki frontend conventions

## Combining class names — use `classnames`

Never hand-roll `[a, b, c].filter(Boolean).join(' ')` to merge CSS-module classes. The `classnames` package is already a dependency (`frontend/package.json`) — use it:

```tsx
import classNames from 'classnames';

const rootClassName = classNames(
  styles.text,
  styles[`size-${size}`],
  className,
);
```

Reference implementation: `frontend/src/ui/Text/Text.tsx`. Older components (`StatCounter.tsx`, others) still use the manual `.filter(Boolean).join(' ')` pattern — that's drift, not the convention; bring a component onto `classnames` when you touch it rather than copying the old pattern into new code.

## Import aliases (`frontend/tsconfig.json`)

Always import via the configured path aliases, never long relative paths (`../../../`):

- `@/*` → `src/*` (generic escape hatch)
- `@components/*` → `src/components/*` — page-specific/business components (Header, Footer, Cookie, ReviewForm, ...)
- `@ui/*` → `src/ui/*` — generic design-system primitives (Text, and future ones like Button) — no business logic, just visual/behavioral building blocks
- `@styles/*` → `src/styles/*` — tokens and mixins (colors, typography, animations, mixins)
- `@constants` → `src/constants`
- `@data/*` → `src/data/*`

`@components` vs `@ui` is a meaningful split, not interchangeable: if a component encodes a specific business/page concept (a review card, the site header) it belongs in `components`; if it's a reusable primitive that any page could use with just props (text, buttons, inputs) it belongs in `ui`.

## Internal route strings — always from `paths` (`@constants`)

Never write a raw route literal (`href="/contacts"`, `'/about'`, ...) anywhere in JSX or data. `frontend/src/constants/index.ts` exports `paths` (`home`, `about`, `services`, `articles`, `reviews`, `faq`, `contacts`, `privacy`, `terms`) precisely so routes have one source of truth — import it (`import { paths } from '@constants';`) and use `paths.contacts`, not the string. This was already the convention in `Logo.tsx`/`Navigation.tsx`; `frontend/src/app/[locale]/page.tsx` had drifted with hardcoded literals (2026-07-22) and was brought back in line — don't reintroduce a literal when adding a new internal link, and if `paths` is missing a route you need, add it there rather than inlining.

## Design-system primitives (`src/ui`)

Started 2026-07-22 with `Text` (`frontend/src/ui/Text/Text.tsx`), then `Card`, `CardGrid`, `Button`, `TextLink` the same day while migrating the home page (`frontend/src/app/[locale]/page.tsx`). Current roster:

- **`Text`** (`size`, `weight`, `italic`, `as`) — replaces ad hoc `@include typography.*` usage in page/component `.module.scss` files. **The only primitive with a polymorphic `as` prop** — it's the one component whose whole job is rendering arbitrary text content in an arbitrary tag (`p`, `span`, `h1`...three, `li`...). Every other primitive below has a single fixed semantic role, so it does not take `as`.
- **`Card`** — the design-system card contract from [[design-system]] (1px border, 16px radius, hover = border-color + background swap) and nothing else. Always renders a `<li>` (its only real usage is as a grid item inside `CardGrid`) — no `as`. Layout (flex direction, gap, padding, text-align, cursor) stays in the consuming page's own module class, passed via `className`.
- **`CardGrid`** — `repeat(auto-fit, minmax(var(--card-grid-min-width), 1fr))` grid with the standard mobile 1-column collapse; `minWidth` (number, px) is threaded through as a CSS custom property via inline `style` since it varies per usage. Renders `<ul>` by default, `<ol>` when `ordered` is set — a boolean flag for the one real semantic fork, not a generic `as`.
- **`Button`** — `variant: 'primary' | 'secondary'`, plus an optional `href`. **Not polymorphic** — it decides its own tag: renders `next/link`'s `Link` when `href` is passed (it's navigation, so it's semantically an `<a>`), otherwise a real `<button type="button">`. This replaced an earlier `as={Link}` version — passing `as` to force a button to render as a link was flagged as semantically backwards (a "button" that's actually a link should just say so via `href`, not via a generic escape hatch). Typography (`text-sm` + weight) is baked into each variant, not exposed as a prop, since it's fixed per variant.
- **`TextLink`** — always a `next/link` `Link` (`href` is required) — the inline text-link pattern (`text-sm`/semibold, `--color-accent-primary`, color-only hover, no underline) for in-page navigation that isn't a full CTA. No `as` — it has exactly one job.

Pattern for new primitives:

- Give every primitive one clear semantic identity and default to a **fixed** rendered tag/behavior. Only reach for a generic `as` prop when the component's actual job is "render arbitrary content as an arbitrary tag" (so far, only `Text` qualifies). If a component needs to pick between exactly two concrete, known shapes (e.g. `CardGrid`'s `ul`/`ol`, `Button`'s link/button), model that with a small, named prop (`ordered`, `href`) instead of a generic `as` — it stays just as correct semantically without asking the caller to understand a polymorphic API. This was a deliberate correction on 2026-07-22 away from making every primitive polymorphic by default.
- Props map 1:1 to a small set of style axes — never a free-form `style` prop or arbitrary className overrides beyond the optional `className` passthrough. No `variant`/font-family prop on `Text` — `body-font` is already applied globally on `html, body` (`globals.scss`), so a primitive only needs to opt into `italic` for the display look, not pick a whole family.
- Each prop value maps to one CSS-module class (e.g. `size="lg"` → `.size-lg`), and the module's SCSS just `@include`s the existing mixins from `@styles/typography` (or `@styles/mixins`) rather than redefining values — the primitive is a thin prop-to-class mapping layer, not a new source of truth for tokens. Don't add a bare `margin: 0` (or similar) reset inside a primitive's module — `reset.scss` already zeroes margin globally (`* { margin: 0; }`); check there before adding a reset rule anywhere.
- Compose classes with `classnames` per the section above.
- **Component shape**: props typed via an `interface` named `I<ComponentName>` (e.g. `IText`, `ICard`, `IButton`). For a plain (non-generic) primitive, type the component itself as `const ComponentName: FC<IComponentName> = ({ ... }) => (...)` — explicit `React.FC` typing, not an untyped arrow function with the prop type only on the parameter. `Text` is the one exception: since it's generic over `as`'s element type, `FC` can't express that (`FC` isn't generic), so it stays a bare generic arrow function — `const Text = <T extends ElementType = 'p',>(props: TextProps<T>) => {...}`, with the `IText<T>`/`Omit<ComponentPropsWithoutRef<T>, ...>` intersection pattern already documented for that one case.
- Written as a `const Component = ...` arrow function, not `function Component(...)`, with a single `export default Component;` statement at the **bottom** of the file (not inline on the declaration).

As pages migrate off direct `@include typography.*`/card-border-and-hover/grid duplication in their own `.module.scss`, prefer swapping them to the matching `ui` primitive rather than leaving both patterns coexisting indefinitely — same "no prolonged drift" rule as in [[design-system]]. Reference migration: `frontend/src/app/[locale]/page.tsx` + `page.module.scss` (2026-07-22) — five near-identical card blocks (`workCard`, `serviceCard`, `reviewCard`, `articleCard`, `stepCard`) and five near-identical grids collapsed onto `Card`/`CardGrid`, keeping only each instance's unique layout rules (gap, padding, align/text-align) in the page module.
