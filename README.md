# portfolio

## 概要
SPA構成のwebアプリ

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

## 作成予定の機能
#### フロントエンド
- react
- mui

#### バックエンド
- laravel(api)
- mysql
- ariga/atlasを使ったマイグレーション