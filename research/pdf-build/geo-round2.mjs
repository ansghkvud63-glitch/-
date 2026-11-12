const fs = await import("node:fs/promises");
const task = await taskSpace(16);
const page = task.page("p1");
const queries = ["더큰장어", "피스커피랩", "네이비소셜클럽", "피스풀하우스", "데이오프나이트", "카페 기본 삼각동", "쓸모 광주역",
  "상무역 광주1호선", "김대중컨벤션센터역", "농성역 광주1호선", "광주송정역 광주1호선", "금남로4가역", "궁전제과 수완점", "창억떡집 중흥본점"];
const geo = [];
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
    geo.push({ q, places: (j.place || []).slice(0, 4).map(p => ({ name: p.name, addr: p.new_address || p.address, x: p.x, y: p.y, id: p.confirmid })) });
  } catch (e) { geo.push({ q, err: e.message }); }
}
// 영업시간: 카카오맵 장소 상세
const ids = { "산수쌈밥": 2027994313, "옥과한우촌": 392602490, "고메스퀘어 광주상무점": 779766841, "비미": 616656256, "티소하": 200098266,
  "코다": 1727067628, "커프커프하우스 동명점": 380455331, "물흐르듯": 1519520995, "홉커피": 654345352, "궁전제과 운암점": 10226269,
  "무화과로스터스": 1130699358, "인크커피 광주기아챔피언스필드점": 266604145, "쌍교숯불갈비 송정점": 658400183, "명품상무팥죽": 9073032 };
const hours = [];
for (const [n, id] of Object.entries(ids)) {
  try {
    await page.goto("https://place.map.kakao.com/" + id, { timeout: 30000 });
    await page.waitForTimeout(2500);
    const t = await page.evaluate(() => document.body.innerText);
    const i = t.search(/영업시간|운영시간|영업 정보/);
    hours.push({ n, id, text: i >= 0 ? t.slice(i, i + 700) : t.slice(0, 500) });
  } catch (e) { hours.push({ n, err: e.message }); }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/pdf-build/geo2.json", JSON.stringify({ geo, hours }, null, 1));
console.log("done");
