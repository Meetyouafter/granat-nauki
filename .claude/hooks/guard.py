#!/usr/bin/env python3
"""PreToolUse: не даёт Claude трогать секреты, сгенерированный код, применённые миграции
и запускать команды, которые стирают данные или коммитят за пользователя."""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd()

ENV_FILE = re.compile(r'(^|/)\.env(\.[\w-]+)?$')
ENV_IN_CMD = re.compile(r'''(^|[\s/'"=<>])\.env(\.(local|development|production|test))?($|[\s'";|&)])''')

DANGEROUS_COMMANDS = [
    (r'\bprisma\s+migrate\s+reset\b', 'prisma migrate reset стирает БД'),
    (r'\bprisma\s+db\s+push\b.*--(force-reset|accept-data-loss)', 'db push с потерей данных'),
    (r'\bdocker[\s-]+compose\b.*\bdown\b.*(\s-v\b|--volumes)', 'down -v удаляет том с БД'),
    (r'\bdocker\s+volume\s+(rm|prune)\b', 'удаление docker-томов'),
    (r'\bgit\s+push\b.*(\s-f\b|--force)', 'force push переписывает историю на GitHub'),
]

GIT_WRITE = re.compile(r'\bgit\s+(push|commit)\b')


def deny(reason):
    print(json.dumps({
        'hookSpecificOutput': {
            'hookEventName': 'PreToolUse',
            'permissionDecision': 'deny',
            'permissionDecisionReason': f'[guard] {reason}',
        }
    }))
    sys.exit(0)


def rel(path):
    return os.path.relpath(os.path.abspath(path), ROOT)


def git_allowed(session_id):
    # флаг ставит git-intent.py, когда пользователь просит закоммитить/запушить; живёт один ход
    return os.path.exists(os.path.join(tempfile.gettempdir(), f'claude-git-allowed-{session_id or "unknown"}'))


def is_committed(path):
    result = subprocess.run(
        ['git', '-C', ROOT, 'ls-files', '--error-unmatch', rel(path)],
        capture_output=True,
    )
    return result.returncode == 0


data = json.load(sys.stdin)
tool = data.get('tool_name', '')
params = data.get('tool_input', {})

if tool in ('Read', 'Edit', 'Write', 'NotebookEdit'):
    path = params.get('file_path') or params.get('notebook_path') or ''
    relpath = rel(path) if path else ''

    if ENV_FILE.search(path):
        deny(f'{relpath}: .env содержит секреты, не читать и не править. Нужны имена переменных — спроси пользователя.')

    if tool != 'Read':
        if relpath.startswith('main/src/generated/'):
            deny(f'{relpath}: сгенерированный Prisma-клиент, правится только через `pnpm prisma generate`.')
        if re.match(r'main/prisma/migrations/[^/]+/migration\.sql$', relpath) and is_committed(path):
            deny(f'{relpath}: миграция уже в git (считаем применённой). Нужна новая миграция, а не правка старой.')

elif tool == 'Bash':
    command = params.get('command', '')
    if ENV_IN_CMD.search(command):
        deny('команда обращается к .env, а там секреты. Нужны имена переменных — спроси пользователя.')
    for pattern, reason in DANGEROUS_COMMANDS:
        if re.search(pattern, command):
            deny(f'{reason}. Если это действительно нужно, пусть пользователь выполнит команду сам.')
    if GIT_WRITE.search(command) and not git_allowed(data.get('session_id')):
        deny('коммит и пуш только по прямой просьбе пользователя в текущем сообщении («закоммить», «запушь»).')
