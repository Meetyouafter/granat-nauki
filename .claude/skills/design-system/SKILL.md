---
name: design-system
description: The visual identity for granat-nauki (child psychologist / school-prep / tutoring site) — color tokens, type roles, and the pomegranate signature motif. Use before styling or restyling any page/component, so new work matches the established identity instead of drifting back to generic defaults.
---

# granat-nauki design system

Established 2026-07-22 to replace a generic AI-SaaS default look (cream+terracotta, all-Roboto, emoji icons, gradient text/buttons, hover-lift+glow cards). Palette revised same day, second pass — see "Why this palette" below. See [[run-app]] to preview changes.

Always load [[design-taste-frontend]] alongside this skill for any design or visual-correction task — it holds the general anti-template rules and pre-flight check. Where the two disagree, this file (the project's identity) wins.

## Why this identity

Brand name is "Гранат науки" (pomegranate of science) — a child psychologist + school-prep + tutor practice. The pomegranate cross-section, drawn like a 19th-century botanical/scientific plate, is the signature element: it ties "granat" and "nauki" together without literal fruit clip-art (see Signature section below).

## Why this palette

First pass used a literal deep-garnet/blush palette (driven by the brand name). The user explicitly overrode this: for a **child psychologist's** site, the audience needs calm and safety, not the brand name's literal color — no reds, nothing that reads as intense or "loud." Replaced with two natural, muted themes:
- Light — **"Sage & clay"**: warm off-white ground, sage green as the broad brand/trust color, warm clay/terracotta reserved only for calls to action.
- Dark — **"Deep teal calm"**: deep teal ground (not black), mint green as the brand color, warm sand as the CTA color — same natural gamut, inverted.

Neither theme uses stark black/white — text colors are soft warm charcoal / warm cream, not `#000`/`#fff`, to keep contrast comfortable rather than harsh. Micro-interaction animations were also toned down at the same time (see Motion below) — "loud" isn't just a color problem here.

## Color tokens — `main/src/styles/colors.scss`

Two roles, deliberately separate — **don't collapse them back into one accent**:
- `--color-accent-primary` / `-hover` / `-active` — sage `#5b7254` (light) / mint `#8fbfa1` (dark). The **broad brand color**: headings, kicker text, icons (`PomegranateMark`), links, hover borders, focus rings, stat numbers, the logo wordmark. Used pervasively — this is what should read as "calm."
- `--color-cta-primary` / `-hover` / `-active` — clay `#a3603b` (light) / sand `#dab778` (dark). Reserved **only** for actual calls to action: real button fills (`mixins.scss` `main_button`, home page `.ctaPrimary`, `ReviewForm` submit, contacts page submit). Decorative icon badges and gradient-text headings on unmigrated pages (about/contacts) intentionally still use `--color-accent-primary`, not CTA — they aren't clickable actions.
- `--color-success` / `-warning` / `-error` / `-info` — muted, non-alarming versions (e.g. error is soft brick `#b2604a`/`#d98a78`, not a bright alert red) — errors should still feel calm on this site.
- Light values were deepened on 2026-10-20 (from sage `#7c9473`, clay `#c17a54`, tertiary `#96917f`) so text and CTA labels pass WCAG AA: accent 4.76:1 on bg, `text-inverse` on CTA 4.73:1, tertiary 4.74:1. Check contrast before lightening any of them again.
- Dark theme applies both via `[data-theme='dark']` and via `prefers-color-scheme: dark` while no theme is chosen (`:root:not([data-theme='light'])`), so SSR already renders the right theme with no light flash. Both blocks include the same `dark-theme` mixin: add a dark token there, not in one of the blocks.
- Full token list and both themes are in the file itself — read it before adding a new color rather than picking an ad hoc hex.

**Don't** reintroduce cream/beige-only or garnet/burgundy-red accents — both were rejected (the first for being the generic default, the second for reading too intense for a child-psychology audience). **Don't** point a button's `background` at `--color-accent-primary` — that's the brand color, not the CTA color; use `--color-cta-primary`.

## Motion — calm by default

The user asked explicitly for soft animation, no "loud" micro-interactions, alongside the palette change:
- `@keyframes pulse` (`main/src/styles/animations.scss`, used on link/icon hover via `mixins.link`, `Socials`, `LanguageSwitcher`) is a gentle `scale3d(1.04)`, not a bouncy 1.15 — keep new hover pulses at this amplitude or gentler.
- Motion budget is low (brief: MOTION_INTENSITY 2): hover/focus transitions, the cookie banner and the theme switch only. The theme switch is a 0.4s View Transitions crossfade (`toggleTheme` in `ThemeContext`, durations in `globals.scss`), skipped under reduced motion or without the API; its sun/moon icon is picked by CSS from `data-theme`/`prefers-color-scheme`, so it is right before hydration. No scroll reveals, counters, autoplay carousels or 3D tilt; `Reveal`, `StatCounter` and `ui/Slider` were removed on 2026-10-20 for that reason. `reset.scss` collapses every animation/transition under `prefers-reduced-motion: reduce`.
- Cookie banner enter/exit use `fadeInUp` / `fadeOutDown` (soft opacity+12px slide) — the old `lightSpeedOutRight` (skew + fly off-screen) was removed as too sharp for this site. Don't bring skew/fly-style exits back here.

## Type roles — `main/src/styles/typography.scss`

Two font roles, set as CSS vars in `main/src/app/layout.tsx` via `next/font/google` (`Alegreya` → `--font-display`, `Manrope` → `--font-body`), both loaded with `cyrillic` subset (site is ru/en, this matters):
- `@include typography.display` — Alegreya, serif, used **italic** at heavier weight for: page/section headings (`Section.module.scss` `.title`), card titles, hero title, stat numbers, step numerals, logo wordmark. Carries the brand's warmth/personality.
- `@include typography.body-font` — Manrope, applied globally on `html, body` in `globals.scss`. Everything else (paragraphs, labels, buttons, nav) inherits this by default — don't re-declare it per component.
- Size/weight mixins (`text-xs` … `text-xxl`, `regular`/`semibold`/`bold`/`extrabold`) are unchanged from before — combine with `display`/`body-font` for the font-family.

## Signature — `PomegranateMark` component

`main/src/components/PomegranateMark/PomegranateMark.tsx` — inline SVG, `color: currentColor` driven, two variants:
- `variant="seed"` — small single-seed glyph (24×24 viewBox). Used everywhere an emoji icon used to be: card icons, trust-bar icons, article icons, the logo mark. This is a **consistent single glyph**, not a per-topic icon set — differentiation between card types comes from heading/copy, not from swapping icons.
- `variant="plate"` — the full botanical cross-section (200×200 viewBox), used once as a faint (`opacity: 0.06`) decorative motif behind the hero (`page.module.scss` `.heroMotif`). Don't scatter this large variant around the page — it's a one-place signature, not a repeating pattern.

Never reintroduce raw emoji (💙🌱📚🎒⭐ etc.) as icons — replace with `<PomegranateMark variant="seed" />`.

## Restrained surface/interaction rules

Established while redoing the home page (`main/src/app/[locale]/page.module.scss`) — apply the same when touching other pages:
- Cards: `1px solid var(--color-border-primary)` border (not 2px), `border-radius: 16px` (not 20-24px), hover = border-color + background swap only. **No** `transform: translateY(...)` lift, no glow `box-shadow` on hover, no icon `scale`/`rotate` on hover — those were template tells.
- Buttons: solid `var(--color-cta-primary)` background (not `accent-primary`, see Color tokens above), not a gradient. `border-radius: 8px`.
- Headings/stat numbers: solid `--color-accent-primary` + `display` italic, not `background-clip: text` gradient text.
- Numbered steps are a legitimate exception to "no numbering as decoration" — the "how sessions work" flow is a real ordered sequence, so `stepNumber` (styled in `--color-cta-primary`, display italic) is fine there. Don't add numbering elsewhere without the same justification.

## Layout rules (2026-10-20 design-audit pass, leftovers in `todo/16-audit-leftovers.md`)

- Radii: cards, image frames, tinted bands 16px; buttons, inputs, tags, focus outlines 8px; toggles and the language switcher 999px. Nothing else.
- `Section` carries the vertical rhythm (64/48/40px) and the H2 (display italic, `text-xl`, `text-lg` on mobile); `pageTitle` makes it the page's single H1. Leads and prose are capped at 65ch.
- One layout family per home-page section: split hero, tinted band, prose, stat + prose, 1+3 card bento, bordered quotes, list rows, step line, accordion (`FaqList`), CTA block. Don't add a second auto-fit card grid.
- Focus is always visible: 2px `--color-accent-primary` outline on `:focus-visible`.

All pages under `main/src/app/[locale]/` are migrated; there is no known legacy styling left.
