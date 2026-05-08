# 開発者ガイド

## 概要

このエンジンは `game.yaml` にゲームロジックを記述し、AIがコマンドラインでテストプレイできる環境を提供します。

ゲームロジックの永続ストレージは `game.dat`（gzipバイナリ）のみです。`game.yaml` は編集中だけ一時的に存在し、ビルド後に自動削除されます。これにより、AIがプロジェクトディレクトリ内のファイルを読んでもネタバレになりません。

```
node unpack.js            # game.dat → game.yaml に展開（編集開始時）
node build.js             # game.yaml → game.dat に変換し game.yaml を削除（編集完了時）
node new-game.js          # ゲーム開始・状態リセット
node interaction.js {n}   # 選択肢 n を選んで進行
```

## ファイル構成

```
unpack.js          game.dat を game.yaml に展開するスクリプト
build.js           game.yaml を game.dat に変換・game.yaml を削除するスクリプト
game.dat           唯一の永続ストレージ・バイナリ（コミット対象）
engine.js          共通ロジック（条件判定・状態管理・表示）
new-game.js        ゲーム開始スクリプト
interaction.js     進行スクリプト
game-state.json    実行時に自動生成されるゲーム状態（gitignore済み）
```

> `game.yaml` は `.gitignore` に含まれています。リポジトリには `game.dat` のみが存在します。

## game.yaml の書き方

### 基本構造

```yaml
start: シーンID  # 開始シーン

scenes:
  シーンID:
    description: 説明文
    choices:
      - label: 選択肢のラベル
        next: 遷移先シーンID
```

### シーンのフィールド一覧

| フィールド | 型 | 説明 |
|---|---|---|
| `description` | string | デフォルトの説明文 |
| `description_variants` | list | 条件付き説明文（後述） |
| `choices` | list | 選択肢リスト |
| `end` | boolean | `true` にするとゲーム終端（選択肢なし） |

### 選択肢のフィールド一覧

| フィールド | 型 | 説明 |
|---|---|---|
| `label` | string | 選択肢のテキスト |
| `next` | string | 遷移先シーンID |
| `requires` | list | この選択肢を表示するために必要なアイテム |
| `requires_not` | list | この選択肢を表示するために持っていてはいけないアイテム |
| `give` | list | この選択肢を選ぶと得るアイテム |
| `take` | list | この選択肢を選ぶと失うアイテム |

### 条件付き説明文（description_variants）

インベントリの状態に応じて説明文を切り替えられます。

```yaml
scenes:
  forest:
    description: あなたは森を彷徨っている。
    description_variants:
      - requires: [boat]
        description: あなたはボートを運びながら森を彷徨っている。
```

`description_variants` は上から順に評価され、最初にマッチしたものが使われます。どれもマッチしない場合は `description` が使われます。

### インベントリと条件の使い方

アイテム名は任意の文字列です。`give` で取得、`take` で消費します。

```yaml
# ボートがないときだけ表示（取得可能）
- label: ボートを拾う
  requires_not: [boat]
  next: forest
  give: [boat]

# 鍵とたいまつ両方が必要
- label: 扉を開けて進む
  requires: [key, torch]
  next: dungeon_inner

# 鍵を消費して先へ進む
- label: 鍵を使って開錠する
  requires: [key]
  next: locked_room
  take: [key]
```

### ゲーム終端シーン

```yaml
  good_end:
    description: おめでとう！あなたは世界を救った！
    end: true

  bad_end:
    description: あなたは力尽きた...
    end: true
```

`end: true` を指定すると選択肢が表示されず、それ以上進行できません。`node new-game.js` でリセットできます。

## 状態ファイル（game-state.json）

実行中のゲーム状態は `game-state.json` に保存されます。

```json
{
  "scene": "forest",
  "inventory": ["boat"]
}
```

手動で編集することでデバッグが可能です（特定シーンから再開、アイテム付与など）。

## エンジンの拡張

エンジンのコアロジックは `engine.js` に集約されています。

- **新しい条件タイプを追加したい場合** → `meetsCondition()` を拡張
- **状態に新しいフィールドを追加したい場合** → `loadState()` / `saveState()` と初期化処理（`new-game.js`）を修正
- **出力フォーマットを変えたい場合** → `printScene()` を修正

## AIテストプレイの流れ

1. `node unpack.js` で `game.yaml` を展開する
2. `game.yaml` を編集してゲームを作る
3. `node build.js` で `game.dat` に変換する（`game.yaml` は自動削除される）
4. AIに `PLAY.md` を渡してテストプレイを依頼する（`game.yaml` はすでに存在しない）
5. AIのフィードバックを元に 1 に戻る
