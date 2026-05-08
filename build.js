const fs = require('fs');
const zlib = require('zlib');
const yaml = require('js-yaml');

if (!fs.existsSync('game.yaml')) {
  console.error('game.yaml が見つかりません。先に node unpack.js を実行してください。');
  process.exit(1);
}

const game = yaml.load(fs.readFileSync('game.yaml', 'utf8'));
const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(game), 'utf8'));
fs.writeFileSync('game.dat', compressed);
fs.unlinkSync('game.yaml');
console.log('game.dat を生成し、game.yaml を削除しました。');
