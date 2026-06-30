const fs = require("fs");
const OpenCC = require("opencc");
const s2t = new OpenCC("s2t.json");
const t2s = new OpenCC("t2s.json");

let simpIndex = new Map();
let tradIndex = new Map();
let engList = [];

function isEnglish(str) {
  return /^[a-zA-Z\s\-]+$/.test(str.trim());
}

function isTraditional(str) {
  const afterS2T = t2s.convertSync(s2t.convertSync(str));
  return str !== afterS2T;
}

function loadDict() {
  const text = fs.readFileSync("cedict.txt", "utf8");
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const row = line.trim();
    if (!row) continue;
    const reg = /^(.+?) (.+?) \[(.+?)\] \/(.+)\//;
    const match = row.match(reg);
    if (!match) continue;
    const trad = match[1];
    const simp = match[2];
    const pinyin = match[3];
    const eng = match[4];
    const obj = { trad, simp, pinyin, eng };
    simpIndex.set(simp, obj);
    tradIndex.set(trad, obj);
    engList.push({ key: eng.toLowerCase(), data: obj });
  }
}

function autoQuery(input) {
  const word = input.trim();
  if (word.length === 0) return { type: "none" };

  if (isEnglish(word)) {
    const kw = word.toLowerCase();
    const hit = engList.find(x => x.key.includes(kw));
    if (!hit) return { type: "none" };
    return {
      type: "英文",
      simp: hit.data.simp,
      trad: hit.data.trad,
      pinyin: hit.data.pinyin,
      explain: hit.data.eng
    };
  }

  if (isTraditional(word)) {
    const hit = tradIndex.get(word);
    if (!hit) return { type: "none" };
    return {
      type: "繁體中文",
      simp: hit.simp,
      trad: hit.trad,
      pinyin: hit.pinyin,
      explain: hit.eng
    };
  }

  const hit = simpIndex.get(word);
  if (!hit) return { type: "none" };
  return {
    type: "簡體中文",
    simp: hit.simp,
    trad: hit.trad,
    pinyin: hit.pinyin,
    explain: hit.eng
  };
}

loadDict();
module.exports = { autoQuery };
