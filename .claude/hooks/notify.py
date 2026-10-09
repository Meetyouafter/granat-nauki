#!/usr/bin/env python3
"""Notification: Windows balloon notification from WSL when Claude is waiting for the user."""
import json
import shutil
import subprocess
import sys

powershell = shutil.which('powershell.exe')
if not powershell:
    sys.exit(0)

message = json.load(sys.stdin).get('message') or 'Claude is waiting for you'
message = message.replace("'", "''")[:200]

script = (
    'Add-Type -AssemblyName System.Windows.Forms; '
    '$n = New-Object System.Windows.Forms.NotifyIcon; '
    '$n.Icon = [System.Drawing.SystemIcons]::Information; '
    '$n.Visible = $true; '
    f"$n.ShowBalloonTip(5000, 'Claude Code: granat-nauki', '{message}', 'Info'); "
    'Start-Sleep -Seconds 6; $n.Dispose()'
)

subprocess.Popen(
    [powershell, '-NoProfile', '-WindowStyle', 'Hidden', '-Command', script],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True,
)
