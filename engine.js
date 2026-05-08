const fs = require('fs');
const zlib = require('zlib');

const GAME_FILE = 'game.dat';
const STATE_FILE = 'game-state.json';

function loadGame() {
  if (!fs.existsSync(GAME_FILE)) {
    console.error('game.dat が見つかりません。先に node build.js を実行してください。');
    process.exit(1);
  }
  return JSON.parse(zlib.gunzipSync(fs.readFileSync(GAME_FILE)).toString('utf8'));
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    console.error('ゲームが開始されていません。先に node new-game.js を実行してください。');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function meetsCondition(entry, inventory) {
  const requires = [].concat(entry.requires || []);
  const requiresNot = [].concat(entry.requires_not || []);
  return requires.every(i => inventory.includes(i)) &&
         requiresNot.every(i => !inventory.includes(i));
}

function getDescription(scene, inventory) {
  const variant = (scene.description_variants || []).find(v => meetsCondition(v, inventory));
  return variant ? variant.description : scene.description;
}

function getValidChoices(scene, inventory) {
  return (scene.choices || []).filter(c => meetsCondition(c, inventory));
}

function printScene(game, state) {
  const scene = game.scenes[state.scene];
  console.log(getDescription(scene, state.inventory));
  if (!scene.end) {
    getValidChoices(scene, state.inventory).forEach((c, i) => {
      console.log(`[${i + 1}] ${c.label}`);
    });
  }
}

module.exports = { loadGame, loadState, saveState, getValidChoices, printScene };
