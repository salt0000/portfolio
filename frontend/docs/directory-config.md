# ディレクトリの構成について
- client: Next.jsのアプリ
- client以外のファイル: Next.jsに関係のないファイル
- docker: ecsで使用(ローカルではdocker-compose.ymlを使用)
- client/src: 全てのソースを集約
    - app: Next.jsの機能を使うディレクトリ