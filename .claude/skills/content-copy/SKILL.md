---
name: content-copy
description: Rules for any user-visible text on the granat-nauki site (child psychologist / school prep / tutoring) — voice, zero em/en dashes, forbidden medical and guarantee wording, child-focused topics, honest reviews, legal-sensitive copy. Use when writing or editing text in main/src/locales/*.json, main/src/data/*.ts, page metadata, form labels, or admin-facing defaults that end up on the site.
---

# granat-nauki copy rules

The site belongs to a practicing child psychologist who also does school preparation and tutoring. Readers are parents.

## Voice

- Warm, first person ("я помогаю"), concrete, no marketing verbs ("уникальная методика", "раскройте потенциал"). The audit (`docs/audit-step1.md`) calls the current voice "genuinely good and worth protecting" — match it, don't polish it into ad copy.
- Address parents, talk about children. Topics are child topics: school readiness, adaptation, emotions, behaviour, communication, family consultations. Not adult topics — `AboutPage.helpAreas` currently lists panic attacks and burnout, that's a known content bug, not a pattern.
- Hero subtext ≤ 20 words, headline ≤ 2 lines.

## Punctuation

- **Zero em-dashes (`—`) and en-dashes (`–`)** in rendered text — locale JSON, `src/data/*.ts`, metadata descriptions. Rephrase or use a comma/colon; ranges use a hyphen: `5-7 лет`. Code comments don't count.
- Count before and after editing:

  ```bash
  cd main && grep -c '[—–]' src/locales/*.json src/data/*.ts
  ```

  Not zero yet (existing debt). Never add new ones; when touching a string that has one, fix it.

## Forbidden wording (legal)

Psychological counselling is not a medical service, and advertising law forbids promises:

- No "лечение / лечить", "диагностика / диагноз", "психотерапия / терапия", "пациент", "вылечим". Use "консультация", "работа с запросом", "клиент", "занятия".
- No guarantees of results: "100% подготовим к школе", "гарантируем результат", "навсегда избавим".
- Reviews are real and published with the author's consent. Never invent reviews, names, numbers of clients or years of experience — ask the user for real figures and leave a visible TODO instead of a plausible fake.
- Don't touch `/privacy`, `/terms` and consent wording without the user's explicit OK — that's legal text.

## Forms and personal data

- Forms are filled by the parent. Ask the minimum about the child; don't invite a free-form description of the child's health or problems (special category of personal data).
- Every form gets a separate, unchecked consent checkbox linking to the privacy policy.

## Placeholders

Never ship placeholder copy ("New Question", lorem ipsum, "Main" as a page title). If real text isn't available, say so to the user instead of filling the gap.

Where strings live and key parity — see [[i18n]].
