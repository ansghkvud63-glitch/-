const fs = await import("node:fs/promises");
const data = JSON.parse(await fs.readFile("C:/Users/Administrator/llm-local/research/pdf-build/photo-candidates.json", "utf8"));
const pick = {
  sansu: { store: 14, food: 3 }, orion: { store: 2, food: 13 }, eel: { store: 4, food: 0 },
  bimi: { store: 0, food: 13 }, mul: { store: 0, food: 9 }, tisoha: { store: 4, food: 1 }, vanh: { store: 1, food: 3 },
  m1913: { main: 0 }, acc: { main: 13 }, doch: { main: 0 }, peng: { main: 14, mural: 3 }, cem: { main: 13 },
  jss: { main: 9 }, trad: { main: 3 }, mus: { main: 4 }, yuyu: { main: 10 },
};
const dir = "C:/Users/Administrator/llm-local/research/pdf-build/photos/";
await fs.mkdir(dir, { recursive: true });
const credits = {};
const typeName = { BLOG: "블로그", KMAPREVIEW: "카카오맵 이용자 후기", MYSTORE: "카카오맵 업체 등록 사진", POI: "카카오맵 장소 사진" };
for (const [k, sel] of Object.entries(pick)) {
  for (const [role, idx] of Object.entries(sel)) {
    const p = data[k].photos[idx];
    const urls = ["https://img1.kakaocdn.net/cthumb/local/R1080x0.q85/?fname=" + encodeURIComponent(p.url), p.url];
    let ok = false;
    for (const u of urls) {
      try {
        const r = await fetch(u);
        const ct = r.headers.get("content-type") || "";
        if (!r.ok || !/image/.test(ct)) continue;
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length < 5000) continue;
        await fs.writeFile(dir + `${k}_${role}.jpg`, b);
        ok = true; console.log(k, role, b.length, u.slice(0, 60)); break;
      } catch (e) {}
    }
    credits[`${k}_${role}`] = { place: data[k].name, placeUrl: "https://place.map.kakao.com/" + data[k].id, type: typeName[p.type] || p.type, title: p.title, link: p.link, ok };
  }
}
await fs.writeFile(dir + "credits.json", JSON.stringify(credits, null, 1));
console.log("done");
