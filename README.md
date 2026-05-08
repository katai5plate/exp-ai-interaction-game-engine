# exp-ai-interaction-game-engine

AIがゲームプレイを認識するためのゲームエンジン兼ひな形

<img width="618" height="948" alt="image" src="https://github.com/user-attachments/assets/de91b5c5-26b2-4162-889c-27fa12678b05" />
<img width="602" height="804" alt="image" src="https://github.com/user-attachments/assets/5a01e401-30c4-4d86-a331-efd0c976a62c" />
<img width="596" height="819" alt="image" src="https://github.com/user-attachments/assets/582a5ab7-5804-498b-aa60-9249acb9b603" />
<img width="600" height="862" alt="image" src="https://github.com/user-attachments/assets/7405aa6b-270c-4133-9d82-22eaf4ca4de7" />

## 目的

- AIとゲームを「共著する」のは永遠の課題である。
  - AIはゲームを遊んだ経験がない
  - AIはテストプレイができない
  - ユニットテストではなくプレイヤーになってほしい
  - そもそもゲーム制作とは、実装して終わりではない。実装して、プレイして、調整する必要がある。AIでは実装しかできない。
- このプロジェクトでは「プロトタイピング/スケッチ用途」に限定することで、以下を実現する
  - AIがコマンドラインでゲームを遊ぶことができるようにする。
  - AIが実際にプレイして感想を得ることができるようにする。
  - AIがプレイした感想を元にゲームを改善できるようにする。

## 設計思想

- ゲームロジックはYAMLで書ける。`game.yaml`
- `node new-game.js` でニューゲーム。ゲームステートは game-state.json に保存される。AIはログでオープニングを見る。
- `node interaction.js {name}` でゲームを進行。AIはそのログで結果と次の選択肢を見る。

### 例

```
> node new-game.js

あなたは森を彷徨っている。
[1] 東へ行く
[2] 西へ行く

> node interaction.js 1

光が見えるが、川が立ちはだかっている。
[1] 川を渡る
[2] 引き返す
```
