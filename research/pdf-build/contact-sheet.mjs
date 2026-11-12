const fs = await import("node:fs/promises");
const data = JSON.parse(await fs.readFile("C:/Users/Administrator/llm-local/research/pdf-build/photo-candidates.json", "utf8"));
const outDir = "C:/Users/ADMINI~1/AppData/Local/Temp/claude/d2ceaeec60f3a83d/2912f5f0-08d8-4a62-a9c2-3327a5ee19dd/scratchpad/";
const th = u => "https://img1.kakaocdn.net/cthumb/local/C240x180.q60/?fname=" + encodeURIComponent(u);
const task = await taskSpace(27);
const page = task.page("p1");
await page.goto("about:blank");
const keys = Object.keys(data);
for (let s = 0; s < keys.length; s += 2) {
  const group = keys.slice(s, s + 2);
  const imgs = [];
  for (const k of group) {
    for (const p of data[k].photos) {
      try {
        const r = await fetch(th(p.url));
        const b = Buffer.from(await r.arrayBuffer());
        imgs.push({ k, d: "data:image/jpeg;base64," + b.toString("base64") });
      } catch (e) { imgs.push({ k, d: null }); }
    }
  }
  const png = await page.evaluate(async ({ group, imgs }) => {
    const W = 240, H = 180, cols = 8, rowsPer = 2, labelH = 30;
    const c = document.createElement("canvas");
    c.width = cols * W; c.height = group.length * (rowsPer * H + labelH);
    const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
    let gi = 0;
    for (const [gidx, k] of group.entries()) {
      const y0 = gidx * (rowsPer * H + labelH);
      x.fillStyle = "#000"; x.font = "bold 22px sans-serif"; x.fillText(k, 6, y0 + 22);
      const mine = imgs.filter(i => i.k === k);
      for (let i = 0; i < mine.length; i++) {
        const cx = (i % cols) * W, cy = y0 + labelH + Math.floor(i / cols) * H;
        if (mine[i].d) {
          const im = new Image(); im.src = mine[i].d; await im.decode().catch(() => {});
          try { x.drawImage(im, cx, cy, W, H); } catch (e) {}
        }
        x.fillStyle = "rgba(0,0,0,.75)"; x.fillRect(cx, cy, 34, 28);
        x.fillStyle = "#fff"; x.font = "bold 20px sans-serif"; x.fillText(String(i), cx + 5, cy + 21);
      }
    }
    return c.toDataURL("image/jpeg", 0.8);
  }, { group, imgs });
  const f = outDir + "cs_" + group.join("_") + ".jpg";
  await fs.writeFile(f, Buffer.from(png.split(",")[1], "base64"));
  console.log(f);
}
