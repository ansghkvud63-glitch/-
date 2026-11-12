const fs = await import("node:fs/promises");
const task = await taskSpace(27);
const page = task.page("p1");
await page.goto("https://place.map.kakao.com/2027994313", { timeout: 30000 });
await page.waitForTimeout(2000);
const ids = {
  sansu: [2027994313, "산수쌈밥"], orion: [460293057, "오리온"], eel: [2063846004, "더큰장어"],
  bimi: [616656256, "비미"], mul: [1519520995, "물흐르듯"], tisoha: [200098266, "티소하"], vanh: [1116852033, "반헤이브"],
  m1913: [176940020, "1913송정역시장"], acc: [27233966, "국립아시아문화전당"], doch: [777465572, "옛전남도청"], peng: [27368555, "펭귄마을"],
  cem: [25042994, "국립5.18민주묘지"], jss: [15166788, "증심사"], trad: [17252051, "전통문화관"], mus: [8215041, "국립광주박물관"], yuyu: [1036000804, "유유한"],
};
const out = {};
for (const [k, [id, name]] of Object.entries(ids)) {
  try {
    const r = await page.fetch("https://place.map.kakao.com/places/panel3/" + id, { timeout: 15000, headers: { pf: "web" } });
    const j = JSON.parse(r.body);
    const ph = (j.photos?.photos || j.photos || []);
    const arr = Array.isArray(ph) ? ph : (ph.list || []);
    out[k] = { id, name, photos: arr.slice(0, 16).map(p => ({ url: p.url, type: p.type, title: p.title || "", link: p.blog_link_url || p.link_url || "", cat: p.category || p.photo_type || "" })) , rawKeys: Array.isArray(ph) ? null : Object.keys(ph) };
  } catch (e) { out[k] = { id, name, err: e.message }; }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/pdf-build/photo-candidates.json", JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k, v.name, v.err || (v.photos.length + " photos"), v.rawKeys ? JSON.stringify(v.rawKeys) : "", (v.photos||[]).slice(0,3).map(p=>p.type+"/"+p.cat).join(","));
