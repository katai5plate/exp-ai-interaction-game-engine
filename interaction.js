const { loadGame, loadState, saveState, getValidChoices, printScene } = require('./engine');

const choiceIndex = parseInt(process.argv[2], 10);
if (isNaN(choiceIndex) || choiceIndex < 1) {
  console.error('使い方: node interaction.js {選択肢番号}');
  process.exit(1);
}

const game = loadGame();
const state = loadState();
const scene = game.scenes[state.scene];

if (scene.end) {
  console.error('ゲームはすでに終了しています。node new-game.js で再開してください。');
  process.exit(1);
}

const choices = getValidChoices(scene, state.inventory);
const choice = choices[choiceIndex - 1];

if (!choice) {
  console.error(`無効な選択肢です。1〜${choices.length} の数字を入力してください。`);
  process.exit(1);
}

for (const item of [].concat(choice.give || [])) {
  if (!state.inventory.includes(item)) state.inventory.push(item);
}
for (const item of [].concat(choice.take || [])) {
  state.inventory = state.inventory.filter(i => i !== item);
}

state.scene = choice.next;
saveState(state);
printScene(game, state);
