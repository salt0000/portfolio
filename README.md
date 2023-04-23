# portfolio

## 概要
SPA構成のwebアプリ
娯楽イベントの検索、詳細の確認ができるようにする予定

まだただのcreate-react-appを表示させてただけ

https://saltportfolio.net/

## 作成済みの機能
#### インフラ
- cdk(TypeScript)を使ってインフラを作成(一部セキュリティに関わりそうな情報は伏せている)
- クライアントアプリはS3とCLoudfrontを使って配信
- ecs on ec2でapiを作成
- CodePipelineを使ってフロントとバックエンドのCI/CDを作成(このリポジトリをトリガーにしている)
- route53のレコードを追加してDNS設定
- 以下マネコンから作業したこと
  - ドメイン取得
  - ACMの設定
  - GithubとCodePipelineの認証設定
  - ec2のpemファイル作成
※細かい部分は後で調整

## 作成予定の機能
#### フロントエンド
- react
  - 認証
  - api連携
  - react routerを使ってコンポーネントの切り替え
- mui

#### バックエンド
- laravel(api)
- mysql
- ariga/atlasを使ったマイグレーション