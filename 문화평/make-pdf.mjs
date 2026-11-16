const fs = await import("node:fs/promises");
const dir = "C:/Users/Administrator/llm-local/문화평/";
const md = await fs.readFile(dir + "topic-idea.md", "utf8");

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
  .replace(/`(.+?)`/g, "<code>$1</code>")
  .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1">$1</a>');

const lines = md.split(/\r?\n/);
let out = [], i = 0;
while (i < lines.length) {
  const l = lines[i];
  if (/^\|/.test(l)) {
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
    const cells = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    const head = cells(rows[0]);
    out.push("<table><thead><tr>" + head.map(c => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>" +
      rows.slice(2).map(r => "<tr>" + cells(r).map(c => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") + "</tbody></table>");
    continue;
  }
  if (/^- /.test(l) || /^  - /.test(l)) {
    let html = "<ul>", depth = 0;
    while (i < lines.length && /^(  )?- /.test(lines[i])) {
      const sub = lines[i].startsWith("  ");
      if (sub && depth === 0) { html += "<ul>"; depth = 1; }
      if (!sub && depth === 1) { html += "</ul>"; depth = 0; }
      html += "<li>" + inline(lines[i].replace(/^\s*- /, "")) + "</li>";
      i++;
    }
    if (depth) html += "</ul>";
    out.push(html + "</ul>");
    continue;
  }
  let m;
  if (/^---+\s*$/.test(l)) out.push('<div style="break-after:page"></div>');
  else if ((m = l.match(/^(#{1,3}) (.*)/))) out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
  else if (l.trim()) out.push(`<p>${inline(l)}</p>`);
  i++;
}

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>K-웰니스 기획전 주제 아이디어</title>
<style>
@page { size: A4; margin: 16mm 15mm 18mm; }
body { font-family: "Malgun Gothic", "맑은 고딕", sans-serif; font-size: 9.6pt; line-height: 1.6; color: #222; }
h1 { font-size: 17pt; margin: 0 0 10px; padding-bottom: 8px; border-bottom: 3px solid #4f7a4a; color: #2f4f2c; }
h2 { font-size: 12.5pt; margin: 20px 0 8px; padding: 5px 10px; background: #eef4ec; border-left: 5px solid #4f7a4a; color: #2f4f2c; break-after: avoid; }
h3 { font-size: 10.8pt; margin: 14px 0 6px; color: #4f7a4a; break-after: avoid; }
ul { margin: 4px 0 8px; padding-left: 20px; } li { margin: 2px 0; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; font-size: 8.8pt; break-inside: auto; }
th, td { border: 1px solid #cfd8cc; padding: 5px 7px; vertical-align: top; text-align: left; }
th { background: #f3f6f1; font-weight: 700; }
tr { break-inside: avoid; }
td:nth-child(2) { white-space: nowrap; }
a { color: #2c5f8a; word-break: break-all; text-decoration: none; }
code { font-family: Consolas, monospace; background: #f3f3f3; padding: 0 3px; border-radius: 3px; }
</style></head><body>${out.join("\n")}</body></html>`;
await fs.writeFile(dir + "topic-idea.html", html);

const task = await taskSpace("topic-pdf");
const page = task.page("p1");
await page.goto("file:///" + dir + "topic-idea.html", { timeout: 30000 });
await page.waitForTimeout(1000);
const r = await page.cdp("Page.printToPDF", {
  printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: '<div style="font-size:7pt;width:100%;text-align:center;color:#888">문화평 · topic-idea · 자료조사일자 2026-11-16 · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
});
const buf = Buffer.from(r.data, "base64");
await fs.writeFile(dir + "topic-idea.pdf", buf);
console.log("pages:", (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length, "bytes:", buf.length);
await task.finish({ keep: [] });
