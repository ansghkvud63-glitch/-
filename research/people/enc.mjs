const fs = await import("node:fs/promises");
const task = await taskSpace(7);
const page = task.page("p1");
const names = [
  ["김환기", "화가"], ["허백련", "화가"], ["오지호", "화가"], ["정율성", "작곡가"], ["임방울", "판소리"],
  ["이매방", "무용가"], ["김영랑", "시인"], ["김대중", "대통령"], ["정약용", "실학자"], ["한강", "소설가 채식주의자"],
];
const out = {};
for (const [n, hint] of names) {
  try {
    await page.goto("https://search.naver.com/search.naver?query=" + encodeURIComponent(`${n} ${hint} 한국민족문화대백과사전`), { timeout: 30000 });
    await page.waitForTimeout(1500);
    const links = await page.evaluate(() => [...document.querySelectorAll("a")].map(a => a.href).filter(h => /encykorea\.aks\.ac\.kr\/Article\/E\d+/.test(h)));
    const url = links[0];
    if (!url) { out[n] = { err: "no encykorea link" }; continue; }
    await page.goto(url, { timeout: 30000 });
    await page.waitForTimeout(2000);
    const t = await page.evaluate(() => document.body.innerText);
    const title = await page.evaluate(() => document.title);
    const i = t.search(/정의|개설|요약/);
    out[n] = { url, title, text: t.slice(Math.max(0, i), i + 3500).replace(/\n{2,}/g, "\n") };
  } catch (e) { out[n] = { err: e.message }; }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/people/enc.json", JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k, v.err || v.url, v.title || "");
