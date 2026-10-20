// Сверяет ключи ru.json и en.json и считает тире. Падает, если ключи расходятся
// или файл не парсится; тире только печатает (цель 0, новых не добавлять).
import { readFileSync } from 'node:fs';
import path from 'node:path';

const LOCALES_DIR = path.join(import.meta.dirname, '..', 'src', 'locales');
const LOCALES = ['ru', 'en'] as const;

type Locale = (typeof LOCALES)[number];

const collectKeys = (node: Record<string, unknown>, prefix = ''): Set<string> => {
  const result = new Set<string>();
  for (const [key, value] of Object.entries(node)) {
    const full = prefix + key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      for (const nested of collectKeys(value as Record<string, unknown>, `${full}.`)) {
        result.add(nested);
      }
    } else {
      result.add(full);
    }
  }
  return result;
};

const problems: string[] = [];
const keys = new Map<Locale, Set<string>>();
const dashes = new Map<Locale, number>();

for (const locale of LOCALES) {
  const text = readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf-8');
  dashes.set(locale, text.match(/[—–]/g)?.length ?? 0);
  try {
    keys.set(locale, collectKeys(JSON.parse(text) as Record<string, unknown>));
  } catch (error) {
    problems.push(`${locale}.json не парсится: ${String(error)}`);
  }
}

const ru = keys.get('ru');
const en = keys.get('en');
if (ru && en) {
  const onlyRu = [...ru].filter(key => !en.has(key)).sort();
  const onlyEn = [...en].filter(key => !ru.has(key)).sort();
  if (onlyRu.length > 0) {
    problems.push(`есть только в ru.json: ${onlyRu.join(', ')}`);
  }
  if (onlyEn.length > 0) {
    problems.push(`есть только в en.json: ${onlyEn.join(', ')}`);
  }
}

console.log(
  `[locales] тире: ru ${String(dashes.get('ru'))}, en ${String(dashes.get('en'))}`
  + ' (цель 0, новых не добавлять)',
);

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`[locales] ${problem}`);
  }
  process.exitCode = 1;
} else {
  console.log('[locales] ключи ru/en совпадают');
}
