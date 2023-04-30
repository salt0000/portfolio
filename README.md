# portfolio

## 概要
SPA構成のWebアプリをフルスタックに開発

## 作成済みの機能
#### インフラ
- 以下にまとめている
- https://qiita.com/salt00000/items/bb8ea9b870cac233b53d
#### フロントエンド
- react
  - MUIを使用
  - ヘッダーとフッダーとメイン部分作成
  - コンポーネントをルーティングして表示
#### バックエンド
- Laravel
  - Docker
    - Nginx
    - PHP
    - MySQL
  - ariga/atlasを使ったマイグレーション
  - API
    - 認証

## 作成予定の機能
#### フロントエンド
- react
  - 認証
  - api連携
  - レファクタリング

#### バックエンド
- laravel(api)
  - API
    - 8つくらいAPIを作成
    - テストコードの作成

#### インフラ
- CDK
  - Laravelの自動テスト
  - APIのリクエストも前段にCloudFrontを置く