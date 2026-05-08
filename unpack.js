const fs = require('fs');
const zlib = require('zlib');
const yaml = require('js-yaml');

if (!fs.existsSync('game.dat')) {
  console.error('game.dat が見つかりません。');
  process.exit(1);
}

if (fs.existsSync('game.yaml')) {
  console.error('game.yaml がすでに存在します。編集中のファイルを保護するため中断します。');
  process.exit(1);
}

const game = JSON.parse(zlib.gunzipSync(fs.readFileSync('game.dat')).toString('utf8'));
fs.writeFileSync('game.yaml', yaml.dump(game, { allowUnicode: true, lineWidth: -1 }));
console.log('game.yaml を展開しました。編集後に node build.js を実行してください。');
