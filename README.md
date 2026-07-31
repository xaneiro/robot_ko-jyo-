# ロボットコージョー

React + Vite で作られた、ブラウザで動くガチャ・図鑑アプリです。画像と音声を `public/` から読み込み、入手状況やキャンバス配置はブラウザの `localStorage` を使います。

公開ページ:
https://xaneiro.github.io/robot_ko-jyo-/

Cloudflare Pages に出す場合は、通常の `npm run build` でドメイン直下用にビルドします。
GitHub Pages は GitHub Actions 側で `VITE_DEPLOY_TARGET=github-pages` を付けて、`/robot_ko-jyo-/` 配下用にビルドします。

## 開発

```bash
npm ci
npm run dev
```

開発サーバーの URL が表示されたら、ブラウザで開いて確認します。

## ビルド

```bash
npm run build
npm run preview
```

`dist/` はビルド結果です。手で編集せず、公開先に合わせてビルドし直します。

## 主な構成

- `src/App.jsx`: 画面と動きの中心。ガチャ対象の画像一覧もここで管理します。
- `src/styles.css`: レイアウト、色、アニメーションなどの見た目。
- `public/images/`: ガチャや図鑑で使う画像。
- `public/bgm/`: BGM。
- `public/se/`: 効果音。
- `AGENTS.md`: Codex や AI に作業を頼む時の補足ガイド。

## GitHub 運用

- Pull request では CI が `npm ci` と `npm run build` を実行します。
- `main` に反映された変更は GitHub Actions でビルドされ、GitHub Pages にデプロイされます。
- Issue と Pull request は `.github` のテンプレートに沿って記録します。

## 複数チャットで並行作業する時のルール

- `main` には直接作業しません。
- 1つのチャットにつき、1つの作業ブランチを使います。
- Codex に作業を頼む場合、Codex は編集前にチャット専用の作業フォルダとブランチを自動作成します。
- 1つの作業は、1つの Pull request として扱います。
- 複数チャットで同じ作業フォルダを同時編集しません。
- Pull request の `CI Build` が成功してから `main` に merge します。
- 競合が出た場合は GitHub の Pull request 画面で差分を確認し、片方の変更を取り込んでから merge します。

自動作業フォルダ・ブランチ作成:

```bash
npm run codex:start -- short-task-name
```

Codexチャット内では、コマンド出力の `Worktree:` に表示されたフォルダで作業します。通常のターミナルでは、現在のフォルダに作業ブランチを作ります。

作業後:

```bash
git push -u origin "$(git branch --show-current)"
```

その後、GitHub で Pull request を作成します。

ローカルでは `.githooks` により、`main` への直接 commit / push を止めます。初回だけ以下を実行してください。

```bash
git config core.hooksPath .githooks
```

## 素材の扱い

このリポジトリには画像・音声素材が含まれます。ソースコードを含め、素材の再利用・再配布・改変利用は許可なく行わないでください。

## Codex への依頼例

- 「ガチャに `public/images/新しい画像.png` を追加して」
- 「`src/App.jsx` のタイトル文言を変更して」
- 「`npm run build` が通るように修正して」
- 「Issue の内容を実装計画に整理して」
