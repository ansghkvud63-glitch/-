const fs = await import("node:fs/promises");
const task = await taskSpace(16);
const page = task.page("p1");
const queries = ["산수쌈밥", "더큰장어", "명화식육식당", "맥문동 광주", "오리온 광주 식당", "유향 광주", "대양꼬리곰탕",
  "상무초밥", "명품상무팥죽", "쌍교숯불갈비", "옥과한우촌", "고메스퀘어", "행복식당 치평동", "수완식당 상무점", "365별당"];
const out = [];
await page.cdp("Network.enable", {});
for (const q of queries) {
  await page.events();
  try {
    await page.goto("https://map.kakao.com/?q=" + encodeURIComponent(q), { timeout: 30000 });
    await page.waitForTimeout(2500);
    const ev = await page.events();
    const hit = ev.filter(e => e.method === "Network.responseReceived" && /api\/v1\/mapsearch\/map\?/.test(e.params?.response?.url || "")).pop();
    const b = hit ? await page.cdp("Network.getResponseBody", { requestId: hit.params.requestId }) : null;
    const j = b ? JSON.parse(b.body) : {};
    out.push({ q, total: j.place_totalcount ?? j.placeTotalCount ?? null, places: (j.place || []).slice(0, 15).map(p => ({ name: p.name, addr: p.new_address || p.address, cate: p.last_cate_name, x: p.x, y: p.y, id: p.confirmid })) });
  } catch (e) { out.push({ q, err: e.message }); }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/pdf-build/chain.json", JSON.stringify(out, null, 1));
console.log("done");
