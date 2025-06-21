# TODO App 実装タスク一覧

## プロジェクト概要

- **フロントエンド**: Vite + React + TanStack Router + shadcn/ui
- **バックエンド**: Hono + PostgreSQL
- **デプロイ**: Docker Compose (自宅サーバー想定)

## プロジェクト構造

```
todo/
├── frontend/              # React アプリケーション
│   ├── src/
│   │   ├── components/    # UI コンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── routes/        # ルーティング
│   │   └── lib/           # ユーティリティ
│   ├── package.json
│   └── Dockerfile
├── backend/               # Hono API サーバー
│   ├── src/
│   │   ├── routes/        # API ルート
│   │   ├── models/        # データモデル
│   │   └── db/            # データベース設定
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml     # Docker設定
└── README.md
```

## 実装タスク

### 1. バックエンド開発 (Hono + PostgreSQL)

#### ✅ プロジェクト初期化

- [ ] Hono プロジェクト作成
- [ ] 必要なパッケージインストール
  - hono
  - @hono/node-server
  - pg (PostgreSQL クライアント)
  - @types/pg
  - drizzle-orm (ORM)
  - drizzle-kit
  - typescript
  - tsx

#### ✅ データベース設定

- [ ] PostgreSQL 接続設定
- [ ] Drizzle ORM スキーマ定義
- [ ] マイグレーション設定
- [ ] 環境変数設定

#### ✅ TODO API 実装

- [ ] TODO データモデル定義
  - id: string (UUID)
  - title: string
  - description?: string
  - completed: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
- [ ] API ルート実装
  - GET /api/todos - TODO一覧取得
  - POST /api/todos - TODO作成
  - PUT /api/todos/:id - TODO更新
  - DELETE /api/todos/:id - TODO削除
- [ ] バリデーション・エラーハンドリング
- [ ] CORS設定

### 2. フロントエンド開発 (Vite + React + TanStack Router + shadcn/ui)

#### ✅ プロジェクト初期化

- [ ] Vite + React プロジェクト作成
- [ ] TypeScript 設定
- [ ] 必要なパッケージインストール
  - @tanstack/react-router
  - @tanstack/router-devtools
  - @tanstack/react-query

#### ✅ shadcn/ui セットアップ

- [ ] shadcn/ui 初期化
- [ ] 全てのコンポーネントインストール

#### ✅ TanStack Router 設定

- [ ] ルーター設定
- [ ] ページコンポーネント作成
  - / (ホームページ - TODO一覧)
  - /about (アバウトページ)

#### ✅ TODO 管理 UI 実装

- [ ] TODO一覧表示コンポーネント
- [ ] TODO作成フォーム
- [ ] TODO編集機能
- [ ] TODO削除機能
- [ ] 完了状態トグル機能
- [ ] APIクライアント実装
- [ ] 状態管理 (React Query)

### 3. Docker化

#### ✅ バックエンド Dockerfile

- [ ] Node.js ベースイメージ
- [ ] 依存関係インストール
- [ ] アプリケーションコピー
- [ ] ポート設定 (3000)

#### ✅ フロントエンド Dockerfile

- [ ] Node.js ビルドステージ
- [ ] Nginx 配信ステージ
- [ ] 静的ファイル配信設定
- [ ] ポート設定 (80)

#### ✅ Docker Compose 設定

- [ ] PostgreSQL サービス
- [ ] バックエンド サービス
- [ ] フロントエンド サービス
- [ ] 環境変数設定
- [ ] ボリュームマウント設定
- [ ] ネットワーク設定

### 4. 統合・テスト

#### ✅ 動作確認

- [ ] データベース接続確認
- [ ] API エンドポイント動作確認
- [ ] フロントエンド・バックエンド連携確認
- [ ] Docker Compose 起動確認

#### ✅ 自宅サーバー準備

- [ ] 環境変数設定例作成
- [ ] 起動手順書作成
- [ ] ポート設定確認
- [ ] データ永続化設定

## 技術仕様

### API仕様

```
GET    /api/todos          - TODO一覧取得
POST   /api/todos          - TODO作成
PUT    /api/todos/:id      - TODO更新
DELETE /api/todos/:id      - TODO削除
```

### データベーススキーマ

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ポート設定

- フロントエンド: 3001
- バックエンド: 3000
- PostgreSQL: 5432

## 実行手順

1. 開発環境

```bash
# バックエンド
cd backend
npm install
npm run dev

# フロントエンド
cd frontend
npm install
npm run dev
```

2. Docker環境

```bash
docker-compose up -d
```

## 注意事項

- 環境変数は `.env` ファイルで管理
- PostgreSQL データは Docker ボリュームで永続化
- 自宅サーバーでは適切なファイアウォール設定が必要
