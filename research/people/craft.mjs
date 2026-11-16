const fs = await import("node:fs/promises");
const task = await taskSpace(11);
const page = task.page("p1");
await page.goto("https://www.gtcc.or.kr/bbs/board.php?bo_table=heritage_list", { timeout: 30000 });
await page.waitForTimeout(3000);
// 목록 항목 → 상세 링크
const items = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll("a[href*='wr_id=']").forEach(a => {
    const t = a.innerText.trim().replace(/\s+/g, " ");
    if (/기능보유자/.test(t)) out.push({ t, href: a.href });
  });
  return out;
});
const uniq = [...new Map(items.map(x => [x.href, x])).values()];
console.log("기능보유자 링크:", uniq.length);
const res = [];
for (const it of uniq) {
  try {
    await page.goto(it.href, { timeout: 30000 });
    await page.waitForTimeout(2000);
    const t = await page.evaluate(() => document.body.innerText);
    const s = t.indexOf("무형유산 목록", 300);
    const e = t.indexOf("FAMILY SITE");
    res.push({ head: it.t, href: it.href, text: t.slice(s > 0 ? s : 0, e > 0 ? e : undefined).replace(/\n{2,}/g, "\n").slice(0, 2500) });
  } catch (e) { res.push({ head: it.t, href: it.href, err: e.message }); }
}
await fs.writeFile("C:/Users/Administrator/llm-local/research/people/craft.json", JSON.stringify(res, null, 1));
for (const r of res) console.log("=====", r.head, r.href, "\n", (r.text || r.err || "").slice(0, 900));
