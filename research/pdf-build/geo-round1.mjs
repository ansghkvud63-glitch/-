const fs = await import("node:fs/promises");
const task = await taskSpace(16);
const page = task.page("p1");
const queries = [
  // 40~50대 식사
  "산수쌈밥 동계로", "옥과한우촌 상무점", "쌍교숯불갈비 송정점", "더큰장어 본점 하서로", "명화식육식당 평동로",
  "쿠우쿠우 골드 광주수완점", "고메스퀘어 광주상무점", "명품상무팥죽 본점", "샤브20 광주상무점", "등촌 상무점",
  // 20~30대 디저트 (동명동 상위 10)
  "비미 동계로10번길", "티소하 동계천로", "피스커피랩 동명로", "코다 동명로14번길", "커프커프하우스 동명점",
  "네이비소셜클럽 동계로", "피스풀하우스 동명로", "물흐르듯 동명로", "데이오프나이트 동명로", "홉커피 동계로",
  // 20~30대 디저트 (북구 상위권)
  "인크커피 광주기아챔피언스필드점", "궁전제과 운암동", "용봉커피 전대후문", "하이퍼스탠다드커피랩 첨단", "주디마리 전대후문",
  "무화과로스터스 금호로", "다올카페 첨단", "카페마르디 당뫼로", "카페인 문산로74번길", "반헤이브 용전마을길",
  "이븐베터커피 양산택지로", "카페기본 설죽로", "쓸모 광주역 효죽로", "사보르커피 전남대점",
  // 관광지·교통
  "광주송정역", "1913송정역시장", "국립아시아문화전당", "옛 전남도청", "양림동 펭귄마을", "양림동역사문화마을",
  "국립광주박물관", "국립5.18민주묘지", "5.18기념공원", "증심사 광주", "전통문화관 의재로", "광주김치타운",
  "양동시장 천변좌로", "유스퀘어 광주종합버스터미널", "남도향토음식박물관", "유유한 백서로224번길", "오가헌 구성로194번길",
  "월곡고려인문화관 결", "문화전당역", "남광주역", "양동시장역", "광주역", "학동증심사입구역", "광주공항",
  "무등산국립공원 원효사", "서창 감성조망대",
];
const out = [];
await page.cdp("Network.enable", {});
for (const q of queries) {
  await page.events();
  try {
    await page.goto("https://map.kakao.com/?q=" + encodeURIComponent(q), { timeout: 30000 });
    await page.waitForTimeout(2500);
    const ev = await page.events();
    const hit = ev.filter(e => e.method === "Network.responseReceived" && /api\/v1\/mapsearch\/map\?/.test(e.params?.response?.url || "")).pop();
    if (!hit) { out.push({ q, err: "no response" }); continue; }
    const b = await page.cdp("Network.getResponseBody", { requestId: hit.params.requestId });
    const j = JSON.parse(b.body);
    const pl = (j.place || [])[0];
    const ad = (j.address || [])[0];
    out.push({ q, place: pl ? { name: pl.name, addr: pl.new_address || pl.address, x: pl.x, y: pl.y, cate: pl.last_cate_name, id: pl.confirmid, hours: pl.open_hour || pl.openhour || null } : null,
      address: ad ? { addr: ad.new_address || ad.address_name || ad.address, x: ad.x, y: ad.y } : null, keys: pl ? Object.keys(pl).slice(0, 60) : Object.keys(j) });
  } catch (e) { out.push({ q, err: e.message }); }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/pdf-build/geo.json", JSON.stringify(out, null, 1));
console.log("done", out.length);
