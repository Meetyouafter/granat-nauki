#!/usr/bin/env python3
"""PostToolUse: после правки main/src/locales/*.json сверяет ключи ru/en и считает тире."""
import json
import os
import re
import sys

ROOT = os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd()
LOCALES = os.path.join(ROOT, 'main', 'src', 'locales')

data = json.load(sys.stdin)
path = data.get('tool_input', {}).get('file_path', '')
if not re.search(r'main/src/locales/[^/]+\.json$', path):
    sys.exit(0)


def keys(node, prefix=''):
    result = set()
    for key, value in node.items():
        full = prefix + key
        result |= keys(value, full + '.') if isinstance(value, dict) else {full}
    return result


problems = []
parsed = {}
dashes = {}
for locale in ('ru', 'en'):
    file = os.path.join(LOCALES, f'{locale}.json')
    with open(file, encoding='utf-8') as f:
        text = f.read()
    dashes[locale] = len(re.findall('[—–]', text))
    try:
        parsed[locale] = keys(json.loads(text))
    except json.JSONDecodeError as error:
        problems.append(f'{locale}.json не парсится: {error}')

if len(parsed) == 2:
    only_ru = sorted(parsed['ru'] - parsed['en'])
    only_en = sorted(parsed['en'] - parsed['ru'])
    if only_ru:
        problems.append('есть только в ru.json: ' + ', '.join(only_ru))
    if only_en:
        problems.append('есть только в en.json: ' + ', '.join(only_en))

summary = f'тире в локалях: ru {dashes["ru"]}, en {dashes["en"]} (цель 0, новых не добавлять)'

if problems:
    print(json.dumps({
        'decision': 'block',
        'reason': '[locales] ' + '; '.join(problems) + '. ' + summary,
    }))
else:
    print(json.dumps({
        'hookSpecificOutput': {
            'hookEventName': 'PostToolUse',
            'additionalContext': f'[locales] ключи ru/en совпадают; {summary}',
        }
    }))
