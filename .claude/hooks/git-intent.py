#!/usr/bin/env python3
"""Grants Claude permission to git commit/push for one turn, only when the user asked for it.

UserPromptSubmit: if the prompt asks to commit or push, create a per-session flag; otherwise remove it.
Stop (--clear): remove the flag, so the permission never outlives the turn it was given in.
guard.py checks the flag before letting `git commit` / `git push` through."""
import json
import os
import re
import sys
import tempfile

ASK = re.compile(r'(за)?к[оа]мм?ит|(за)?пуш|\bcommit\b|\bpush\b', re.IGNORECASE)
NEGATED = re.compile(r'\bне\s+(за)?(к[оа]мм?ит|пуш)|\b(don\'?t|do not|no)\s+(commit|push)', re.IGNORECASE)


def flag_path(session_id):
    return os.path.join(tempfile.gettempdir(), f'claude-git-allowed-{session_id or "unknown"}')


data = json.load(sys.stdin)
flag = flag_path(data.get('session_id'))

if '--clear' in sys.argv:
    if os.path.exists(flag):
        os.remove(flag)
    sys.exit(0)

prompt = data.get('prompt', '')
if ASK.search(prompt) and not NEGATED.search(prompt):
    open(flag, 'w').close()
elif os.path.exists(flag):
    os.remove(flag)
