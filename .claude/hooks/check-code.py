#!/usr/bin/env python3
"""PostToolUse: after Claude edits a file, lint just that file and report problems back.
eslint for ts/tsx/js in main/ and admin/, stylelint for scss in main/, prisma validate for the schema.
Report-only: nothing is auto-fixed."""
import json
import os
import re
import subprocess
import sys

ROOT = os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd()

data = json.load(sys.stdin)
path = data.get('tool_input', {}).get('file_path', '')
if not path:
    sys.exit(0)

relpath = os.path.relpath(os.path.abspath(path), ROOT)
match = re.match(r'(main|admin)/(.+)$', relpath)
if not match or '/generated/' in relpath or '/node_modules/' in relpath:
    sys.exit(0)

package, inner = match.groups()
cwd = os.path.join(ROOT, package)
bin_dir = os.path.join(cwd, 'node_modules', '.bin')

if re.search(r'\.(tsx?|mts|jsx?)$', inner):
    label, command = 'eslint', [os.path.join(bin_dir, 'eslint'), inner]
elif package == 'main' and inner.endswith('.scss'):
    label, command = 'stylelint', [os.path.join(bin_dir, 'stylelint'), inner]
elif package == 'main' and inner == 'prisma/schema.prisma':
    label, command = 'prisma validate', [os.path.join(bin_dir, 'prisma'), 'validate']
else:
    sys.exit(0)

if not os.path.exists(command[0]):
    sys.exit(0)

result = subprocess.run(command, cwd=cwd, capture_output=True, text=True, timeout=60)
if result.returncode == 0:
    sys.exit(0)

output = (result.stdout + result.stderr).strip()
print(json.dumps({
    'decision': 'block',
    'reason': f'[{label}] {relpath}:\n{output[-3000:]}',
}))
