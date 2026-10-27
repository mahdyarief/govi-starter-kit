#!/usr/bin/env bash
#
# Runs the gofi and vine audits that ship with the ai-coding-skills plugins.
#
# The plugins live outside the repo, so a check is skipped with a notice when
# the plugin is not installed. Set AI_CODING_SKILLS_DIR to point at a different
# cache root.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS="${AI_CODING_SKILLS_DIR:-$HOME/.openclaude/plugins/cache/ai-coding-skills}"

status=0
ran=0

# script_for <plugin> <relative path> -> newest installed copy, empty if absent
script_for() {
  local plugin=$1 rel=$2
  local newest
  newest=$(ls -d "$SKILLS/$plugin"/*/"$rel" 2>/dev/null | sort -V | tail -1)
  printf '%s' "$newest"
}

run_check() {
  local label=$1 plugin=$2 rel=$3 root=$4
  local script
  script=$(script_for "$plugin" "$rel")

  if [[ -z $script ]]; then
    echo "SKIP  $label (plugin '$plugin' not installed under $SKILLS)"
    return 0
  fi

  ran=$((ran + 1))
  echo "RUN   $label"
  if ! python3 "$script" --root "$root"; then
    status=1
  fi
  echo
}

run_check "gofi layers"    gofi skills/layers/scripts/audit_layers.py        "$ROOT/server"
run_check "gofi env sync"  gofi skills/maintenance/scripts/check_env_sync.py "$ROOT/server"
run_check "vine layers"    vine skills/layers/scripts/audit_layers.py        "$ROOT/web"
run_check "vine env sync"  vine skills/maintenance/scripts/check_env_sync.py "$ROOT/web"

if [[ $ran -eq 0 ]]; then
  echo "No ai-coding-skills plugin found under $SKILLS." >&2
  exit 1
fi

exit $status
