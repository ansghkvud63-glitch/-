const fs = await import("node:fs/promises");
const src = "C:/Users/Administrator/llm-local/research/people/people.html";
const dst = "C:/Users/Administrator/llm-local/research/people/people-gwangju.html";
let h = await fs.readFile(src, "utf8");

// 1) 제외 인물 카드 삭제
const drop = ["김환기", "김영랑", "이매방", "서신정", "김춘식", "김대중", "정약용"];
h = h.replace(/<div class="p"><div class="hd"><span class="nm">([^<]+)<\/span>[\s\S]*?<\/dl><\/div>\n*/g, (m, nm) => drop.includes(nm.trim()) ? "" : m);

// 2) 빈 섹션 제목 삭제·번호 다시 매기기
h = h.replace(/<h2>3\. 장인 \(국가무형유산 보유자\)<\/h2>\n*/, "");
h = h.replace(/<h2>4\. 역사 · 사회 인물<\/h2>\n*/, "");
h = h.replace("<h2>5. 논란이 될 만한 사항 (별도 정리)</h2>", "<h2>3. 논란이 될 만한 사항 (별도 정리)</h2>");

// 3) 제외 인물 논란 블록 삭제
h = h.replace(/<div class="cv"[^>]*><h3[^>]*>[\s\S]*?<\/h3><ul>[\s\S]*?<\/ul><\/div>\n*/g, m => /(김대중|이매방|서신정)/.test(m.slice(0, 200)) ? "" : m);

// 4) 표지·안내 문구
h = h.replace("<title>전남광주 대표 인물·장인·창작자 조사</title>", "<title>광주 대표 인물·창작자 조사</title>");
h = h.replace('<div style="font-size:9pt;opacity:.9">자료조사 · 전남광주통합특별시</div>', '<div style="font-size:9pt;opacity:.9">자료조사 · 광주(옛 광주광역시 5개 구) 한정</div>');
h = h.replace("<h1>전남광주의 대표 인물 · 장인 · 창작자</h1>", "<h1>광주의 대표 인물 · 창작자</h1>");
h = h.replace("<li>선정 기준: 전남광주 출생이거나 이 지역에서 주요 활동을 한 인물 중, 공신력 있는 자료로 업적과 영향이 확인되는 사람. 생존 인물은 공개된 공적 활동만 다룬다.</li>",
  "<li><b>범위: 광주(옛 광주광역시 동·서·남·북·광산구)로 한정했다.</b> 광주에서 태어났거나(한강·정율성·임방울), 광주에 정착해 주로 활동한 인물(허백련·오지호)만 넣었다. 전남 시군 출생·활동 인물(김환기·김영랑·이매방·김대중·정약용, 담양·나주 장인)은 제외했다. 생존 인물은 공개된 공적 활동만 다룬다.</li>");
h = h.replace("논란의 구체 내용은 <b>5장 「논란이 될 만한 사항」</b>에 따로 모았다.", "논란의 구체 내용은 <b>3장 「논란이 될 만한 사항」</b>에 따로 모았다.");
h = h.replace(/<span class="rl">한국화가 · 1891~1977 · 진도 출생 · 호 의재<\/span>/, '<span class="rl">한국화가 · 1891~1977 · 진도 출생, 광주 정착·활동 · 호 의재</span>');
h = h.replace(/<span class="rl">서양화가 · 1905~1982 · 화순 출생<\/span>/, '<span class="rl">서양화가 · 1905~1982 · 화순 출생, 1948년부터 광주 정착·활동</span>');
h = h.replace(/<span class="rl">판소리 명창 · 1904~1961 · 광산\(현 광산구\) 출생<\/span>/, '<span class="rl">판소리 명창 · 1904~1961 · 광산(현 광주 광산구) 출생</span>');

// 5) '확인된 논란 없음' 메모
h = h.replace(/<div class="note"><b>확인된 논란 없음<\/b>:[\s\S]*?<\/div>/,
  '<div class="note"><b>확인된 논란 없음</b>: 허백련, 오지호, 임방울 — 이번 조사 범위(한국민족문화대백과사전, 주요 언론 검색)에서 공개적으로 쟁점이 된 논란을 찾지 못했다. 허백련은 \'친일파와도 거리를 두지 않았다\'는 미술관장의 교류 일화가 있으나, 협력 행위를 보여 주는 자료는 아니다.<span class="src">관련 기사</span></div>\n<div class="note"><b>참고</b>: 광주 지역의 무형유산 보유 장인은 이번 조사에 포함되지 않았다(앞선 조사의 장인 2명은 담양·나주 소재라 제외).</div>');

// 6) 출처: 제외 인물 전용 출처 삭제
const dropSrc = ["보그 2025", "뉴시스 2019", "최지원 2021", "경향신문 2008", "서울신문 2011", "다음뉴스 2026", "서울신문 2003", "<b>SBS</b>", "경향신문 2013"];
h = h.replace(/  <li><b>[^<]*<\/b>[^\n]*\n/g, m => dropSrc.some(k => m.includes(k)) ? "" : m);
h = h.replace("김환기 E0011112, 허백련 E0063058, 오지호 E0038551, 정율성 E0050711, 임방울 E0047447, 승무 E0032185, 김영랑 E0009839, 김대중 E0078635, 정약용 E0050549",
  "허백련 E0063058, 오지호 E0038551, 정율성 E0050711, 임방울 E0047447");
h = h.replace("원본: research/people/people.html", "원본: research/people/people-gwangju.html (광주 한정판)");

await fs.writeFile(dst, h);
const left = [...h.matchAll(/<span class="nm">([^<]+)<\/span>/g)].map(m => m[1]);
console.log("인물:", left.join(", "));
console.log("논란 블록:", [...h.matchAll(/<div class="cv"[^>]*><h3[^>]*>([\s\S]*?)<\/h3>/g)].map(m => m[1].replace(/<[^>]+>/g, "").trim()).join(" | "));
console.log("제외 이름 잔존:", drop.filter(n => h.includes(n)));
