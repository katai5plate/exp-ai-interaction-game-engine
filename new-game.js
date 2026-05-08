const { loadGame, saveState, printScene } = require('./engine');

const game = loadGame();
const state = { scene: game.start, inventory: [] };

saveState(state);
printScene(game, state);
