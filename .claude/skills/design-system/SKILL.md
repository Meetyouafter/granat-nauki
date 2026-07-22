---
name: design-system
description: The visual identity for granat-nauki (child psychologist / school-prep / tutoring site) — color tokens, type roles, and the pomegranate signature motif. Use before styling or restyling any page/component, so new work matches the established identity instead of drifting back to generic defaults.
---

# granat-nauki design system

Established 2026-07-22 to replace a generic AI-SaaS default look (cream+terracotta, all-Roboto, emoji icons, gradient text/buttons, hover-lift+glow cards). Palette revised same day, second pass — see "Why this palette" below. See [[run-frontend]] to preview changes.

## Why this identity

Brand name is "Гранат науки" (pomegranate of science) — a child psychologist + school-prep + tutor practice. The pomegranate cross-section, drawn like a 19th-century botanical/scientific plate, is the signature element: it ties "granat" and "nauki" together without literal fruit clip-art (see Signature section below).

## Why this palette

First pass used a literal deep-garnet/blush palette (driven by the brand name). The user explicitly overrode this: for a **child psychologist's** site, the audience needs calm and safety, not the brand name's literal color — no reds, nothing that reads as intense or "loud." Replaced with two natural, muted themes:
- Light — **"Sage & clay"**: warm off-white ground, sage green as the broad brand/trust color, warm clay/terracotta reserved only for calls to action.
- Dark — **"Deep teal calm"**: deep teal ground (not black), mint green as the brand color, warm sand as the CTA color — same natural gamut, inverted.

Neither theme uses stark black/white — text colors are soft warm charcoal / warm cream, not `#000`/`#fff`, to keep contrast comfortable rather than harsh. Micro-interaction animations were also toned down at the same time (see Motion below) — "loud" isn't just a color problem here.

## Color tokens — `frontend/src/styles/colors.scss`

Two roles, deliberately separate — **don't collapse them back into one accent**:
- `--color-accent-primary` / `-hover` / `-active` — sage `#7c9473` (light) / mint `#8fbfa1` (dark). The **broad brand color**: headings, kicker text, icons (`PomegranateMark`), links, hover borders, focus rings, stat numbers, the logo wordmark. Used pervasively — this is what should read as "calm."
- `--color-cta-primary` / `-hover` / `-active` — clay `#c17a54` (light) / sand `#dab778` (dark). Reserved **only** for actual calls to action: real button fills (`mixins.scss` `main_button`, home page `.ctaPrimary`, `ReviewForm` submit, contacts page submit). Decorative icon badges and gradient-text headings on unmigrated pages (about/contacts) intentionally still use `--color-accent-primary`, not CTA — they aren't clickable actions.
- `--color-success` / `-warning` / `-error` / `-info` — muted, non-alarming versions (e.g. error is soft brick `#b2604a`/`#d98a78`, not a bright alert red) — errors should still feel calm on this site.
- Full token list and both themes are in the file itself — read it before adding a new color rather than picking an ad hoc hex.

**Don't** reintroduce cream/beige-only or garnet/burgundy-red accents — both were rejected (the first for being the generic default, the second for reading too intense for a child-psychology audience). **Don't** point a button's `background` at `--color-accent-primary` — that's the brand color, not the CTA color; use `--color-cta-primary`.

## Motion — calm by default

The user asked explicitly for soft animation, no "loud" micro-interactions, alongside the palette change:
- `@keyframes pulse` (`frontend/src/styles/animations.scss`, used on link/icon hover via `mixins.link`, `Socials`, `LanguageSwitcher`) is a gentle `scale3d(1.04)`, not a bouncy 1.15 — keep new hover pulses at this amplitude or gentler.
- Cookie banner enter/exit use `fadeInUp` / `fadeOutDown` (soft opacity+12px slide) — the old `lightSpeedOutRight` (skew + fly off-screen) was removed as too sharp for this site. Don't bring skew/fly-style exits back here.

## Type roles — `frontend/src/styles/typography.scss`

Two font roles, set as CSS vars in `frontend/src/app/layout.tsx` via `next/font/google` (`Alegreya` → `--font-display`, `Manrope` → `--font-body`), both loaded with `cyrillic` subset (site is ru/en, this matters):
- `@include typography.display` — Alegreya, serif, used **italic** at heavier weight for: page/section headings (`Section.module.scss` `.title`), card titles, hero title, stat numbers, step numerals, logo wordmark. Carries the brand's warmth/personality.
- `@include typography.body-font` — Manrope, applied globally on `html, body` in `globals.scss`. Everything else (paragraphs, labels, buttons, nav) inherits this by default — don't re-declare it per component.
- Size/weight mixins (`text-xs` … `text-xxl`, `regular`/`semibold`/`bold`/`extrabold`) are unchanged from before — combine with `display`/`body-font` for the font-family.

## Signature — `PomegranateMark` component

`frontend/src/components/PomegranateMark/PomegranateMark.tsx` — inline SVG, `color: currentColor` driven, two variants:
- `variant="seed"` — small single-seed glyph (24×24 viewBox). Used everywhere an emoji icon used to be: card icons, trust-bar icons, article icons, the logo mark. This is a **consistent single glyph**, not a per-topic icon set — differentiation between card types comes from heading/copy, not from swapping icons.
- `variant="plate"` — the full botanical cross-section (200×200 viewBox), used once as a faint (`opacity: 0.06`) decorative motif behind the hero (`page.module.scss` `.heroMotif`). Don't scatter this large variant around the page — it's a one-place signature, not a repeating pattern.

Never reintroduce raw emoji (💙🌱📚🎒⭐ etc.) as icons — replace with `<PomegranateMark variant="seed" />`.

## Restrained surface/interaction rules

Established while redoing the home page (`frontend/src/app/[locale]/page.module.scss`) — apply the same when touching other pages:
- Cards: `1px solid var(--color-border-primary)` border (not 2px), `border-radius: 16px` (not 20-24px), hover = border-color + background swap only. **No** `transform: translateY(...)` lift, no glow `box-shadow` on hover, no icon `scale`/`rotate` on hover — those were template tells.
- Buttons: solid `var(--color-cta-primary)` background (not `accent-primary`, see Color tokens above), not a gradient. `border-radius: 8px`.
- Headings/stat numbers: solid `--color-accent-primary` + `display` italic, not `background-clip: text` gradient text.
- Numbered steps are a legitimate exception to "no numbering as decoration" — the "how sessions work" flow is a real ordered sequence, so `stepNumber` (styled in `--color-cta-primary`, display italic) is fine there. Don't add numbering elsewhere without the same justification.

## Known drift — not yet migrated

`about`, `services`, `faq`, `contacts`, `reviews`, `articles` pages under `frontend/src/app/[locale]/` were **not** touched in the 2026-07-22 pass and may still have raw emoji or the old card hover-lift/glow pattern (confirmed emoji still present in `about/page.tsx`, and `about/page.module.scss` still has the old large icon font-sizes). When you touch one of these pages, bring it in line with this system rather than leaving it as the old default — don't let the two styles coexist longer than necessary.
