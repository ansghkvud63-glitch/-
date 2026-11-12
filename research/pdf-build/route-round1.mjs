const fs = await import("node:fs/promises");
const task = await taskSpace(16);
const page = task.page("p1");
const P = {
  S: [452338, 455970, "광주송정역"], M1913: [452556, 455553, "1913송정역시장"], SS: [482738, 460148, "산수쌈밥"], BM: [483062, 459993, "비미"],
  ACC: [482084, 458608, "국립아시아문화전당"], DOCH: [481657, 458456, "옛전남도청"], PENG: [481100, 456597, "펭귄마을"],
  GOME: [466743, 461010, "고메스퀘어 광주상무점"], P518: [467402, 461104, "5.18기념공원"], OKGWA: [464711, 462029, "옥과한우촌"],
  MUL: [483418, 459638, "물흐르듯"], YUYU: [483409, 458676, "유유한"], PIS: [482628, 459380, "피스커피랩"], TISOHA: [483075, 459235, "티소하"],
  MUSEUM: [473351, 470145, "국립광주박물관"], EEL: [473576, 480530, "더큰장어"], BANH: [476170, 483930, "반헤이브"], CEM: [486277, 483221, "국립5.18민주묘지"],
  JSS: [493093, 453400, "증심사"], TRAD: [489146, 454787, "전통문화관"], YANGDONG: [477668, 460610, "양동시장"], INC: [474718, 464145, "인크커피 기아챔피언스필드점"],
  GUNG: [471565, 466516, "궁전제과 운암점"], MUHWA: [474155, 466420, "무화과로스터스"], USQ: [472511, 462244, "유스퀘어"], GJST: [479350, 463594, "광주역"],
};
const legs = [
  ["walk", "S", "M1913"], ["traffic", "M1913", "SS"], ["walk", "SS", "BM"], ["walk", "BM", "ACC"], ["walk", "DOCH", "PENG"],
  ["traffic", "PENG", "GOME"], ["walk", "GOME", "P518"], ["traffic", "P518", "MUL"], ["traffic", "GOME", "MUL"], ["walk", "MUL", "YUYU"],
  ["traffic", "YUYU", "MUSEUM"], ["traffic", "MUSEUM", "EEL"], ["walk", "EEL", "BANH"], ["traffic", "EEL", "BANH"], ["traffic", "BANH", "S"],
  ["traffic", "YUYU", "YANGDONG"], ["traffic", "YANGDONG", "OKGWA"], ["traffic", "OKGWA", "INC"], ["traffic", "INC", "S"], ["traffic", "YUYU", "CEM"],
  ["traffic", "CEM", "EEL"], ["traffic", "MUSEUM", "MUHWA"], ["traffic", "MUSEUM", "GUNG"], ["traffic", "YANGDONG", "P518"], ["traffic", "OKGWA", "S"],
  ["traffic", "P518", "OKGWA"], ["walk", "P518", "OKGWA"], ["traffic", "YUYU", "PENG"], ["walk", "YUYU", "PENG"], ["traffic", "PENG", "YANGDONG"],
  ["car", "JSS", "TRAD"], ["car", "TRAD", "SS"], ["car", "ACC", "PENG"], ["car", "PENG", "OKGWA"], ["car", "OKGWA", "MUL"], ["car", "OKGWA", "TISOHA"],
  ["car", "SS", "CEM"], ["car", "CEM", "EEL"], ["car", "EEL", "BANH"], ["car", "BANH", "MUSEUM"], ["car", "MUSEUM", "S"], ["car", "MUSEUM", "GJST"], ["car", "MUSEUM", "USQ"],
  ["car", "SS", "JSS"],
];
const out = [];
for (const [mode, a, b] of legs) {
  const [x1, y1, n1] = P[a], [x2, y2, n2] = P[b];
  const u = `https://map.kakao.com/?target=${mode}&rt=${x1},${y1},${x2},${y2}&rt1=${encodeURIComponent(n1)}&rt2=${encodeURIComponent(n2)}`;
  try {
    await page.goto(u, { timeout: 30000 });
    await page.waitForTimeout(3500);
    const t = await page.evaluate(() => document.body.innerText);
    const s = t.indexOf("모두 지우기");
    const e = t.indexOf("길찾기 정보가 잘못");
    out.push({ mode, a: n1, b: n2, text: t.slice(s + 6, e > 0 ? Math.min(e, s + 700) : s + 700).replace(/\n+/g, " ¦ ") });
  } catch (err) { out.push({ mode, a: n1, b: n2, err: err.message }); }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/pdf-build/routes.json", JSON.stringify(out, null, 1));
console.log("done", out.length);
