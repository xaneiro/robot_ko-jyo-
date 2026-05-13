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
  echo "Worktree: $repo_root"
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

worktree_for_branch() {
  git worktree list --porcelain | awk -v target="refs/heads/$1" '
    /^worktree / { path = substr($0, 10) }
    /^branch / {
      if ($2 == target) {
        print path
        exit
      }
    }
  '
}

unique_branch_name() {
  local base_branch="$1"
  local new_branch="$base_branch"
  local index=1

  while git show-ref --verify --quiet "refs/heads/$new_branch" || git ls-remote --exit-code --heads origin "$new_branch" >/dev/null 2>&1; do
    index=$((index + 1))
    new_branch="${base_branch}-${index}"
  done

  printf '%s\n' "$new_branch"
}

git fetch origin "$main_branch" --quiet

if [[ -n "${CODEX_THREAD_ID:-}" && "${CODEX_USE_WORKTREE:-1}" != "0" ]]; then
  thread_slug="$(
    printf '%s' "$CODEX_THREAD_ID" \
      | tr '[:upper:]' '[:lower:]' \
      | sed -E 's/[^a-z0-9]+//g' \
      | cut -c 1-12
  )"
  if [[ -z "$thread_slug" ]]; then
    thread_slug="$(date +%Y%m%d%H%M%S)"
  fi

  branch_prefix="${prefix}/thread-${thread_slug}"
  existing_branch="$(
    git for-each-ref --format='%(refname:short)' "refs/heads/${branch_prefix}-*" \
      | head -n 1
  )"
  repo_name="$(basename "$repo_root")"
  worktree_parent="${CODEX_WORKTREE_ROOT:-"$(dirname "$repo_root")/${repo_name}-codex-worktrees"}"

  if [[ -n "$existing_branch" ]]; then
    new_branch="$existing_branch"
  else
    new_branch="$(unique_branch_name "${branch_prefix}-${slug}")"
  fi

  worktree_path="$(worktree_for_branch "$new_branch")"
  if [[ -z "$worktree_path" ]]; then
    mkdir -p "$worktree_parent"
    worktree_path="${worktree_parent}/${new_branch//\//-}"

    if [[ -e "$worktree_path" ]]; then
      worktree_path="${worktree_path}-$(date +%Y%m%d%H%M%S)"
    fi

    if git show-ref --verify --quiet "refs/heads/$new_branch"; then
      git worktree add "$worktree_path" "$new_branch"
    else
      git branch --no-track "$new_branch" "origin/$main_branch"
      git worktree add "$worktree_path" "$new_branch"
    fi
  fi

  echo "Codex thread branch: $new_branch"
  echo "Worktree: $worktree_path"
  echo "以後このチャットの作業は上の Worktree で行ってください。"
  echo "作業後は以下を実行してください:"
  echo "  git -C \"$worktree_path\" push -u origin $new_branch"
  exit 0
fi

timestamp="$(date +%Y%m%d-%H%M%S)"
new_branch="$(unique_branch_name "${prefix}/${timestamp}-${slug}")"

if git diff-index --quiet HEAD -- && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  git merge --ff-only "origin/$main_branch" --quiet
else
  echo "作業ツリーに未保存の変更があります。現在の状態から新しいブランチを作ります。"
fi

git switch -c "$new_branch"

echo "Created branch: $new_branch"
echo "Worktree: $repo_root"
echo "作業後は以下を実行してください:"
echo "  git push -u origin $new_branch"
