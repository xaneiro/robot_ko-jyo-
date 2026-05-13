#!/usr/bin/env bash
set -euo pipefail

main_branch="${CODEX_MAIN_BRANCH:-main}"
prefix="${CODEX_BRANCH_PREFIX:-codex}"
task_name="${1:-${CODEX_TASK_NAME:-auto}}"

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"
cd "$repo_root"

current_branch="$(git branch --show-current)"
if [[ -z "$current_branch" ]]; then
  echo "Detached HEADです。先に通常のブランチへ戻してください。" >&2
  exit 1
fi

if [[ "$current_branch" != "$main_branch" ]]; then
  echo "Already on branch: $current_branch"
  exit 0
fi

slug="$(
  printf '%s' "$task_name" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//; s/-{2,}/-/g'
)"
if [[ -z "$slug" ]]; then
  slug="auto"
fi

timestamp="$(date +%Y%m%d-%H%M%S)"
base_branch="${prefix}/${timestamp}-${slug}"
new_branch="$base_branch"
index=1

while git show-ref --verify --quiet "refs/heads/$new_branch" || git ls-remote --exit-code --heads origin "$new_branch" >/dev/null 2>&1; do
  index=$((index + 1))
  new_branch="${base_branch}-${index}"
done

git fetch origin "$main_branch" --quiet

if git diff-index --quiet HEAD -- && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  git merge --ff-only "origin/$main_branch" --quiet
else
  echo "作業ツリーに未保存の変更があります。現在の状態から新しいブランチを作ります。"
fi

git switch -c "$new_branch"

echo "Created branch: $new_branch"
echo "作業後は以下を実行してください:"
echo "  git push -u origin $new_branch"
