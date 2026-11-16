const fs = await import("node:fs/promises");
const src = "C:/Users/Administrator/llm-local/research/people/people-gwangju.html";
const dst = "C:/Users/Administrator/llm-local/research/people/people-gwangju-craft.html";
let h = await fs.readFile(src, "utf8");

const S = s => `<span class="src">${s}</span>`;
const G = S("전통문화관");
const crafts = [
  ["이춘봉", "악기장", "1995.11.10", "김명칠 → 김광주 → 이춘봉",
    "윗판·밑판을 따로 만들지 않고 나무 원통을 파서 악기를 만든다. 대표작은 오동나무를 통째로 파 한 판으로 만든 가야금 '백년금'." + G,
    "전통 제작법을 지키면서 필요한 도구는 새로 개발하고, 우리 악기를 세계에 알릴 악기를 연구한다." + G],
  ["이준수", "악기장", "2010.1.8", "김명칠 → 김광주 → 조정삼·최동식 → 이준수",
    "가야금·거문고·아쟁·해금 등 현악기·관악기 27종 50여 가지를 만든다. 나무 선정·벌채부터 염장·자연 건조까지 전통 방식을 고수하고 거의 수작업으로 만든다." + G,
    "2026년 11월 남도 민속유산 전승 방안 민·관·학 집담회에 보유자로 참석했다." + S("뉴시스 2026")],
  ["조기종", "화류소목장", "1996.12.24", "김홍순 → 조춘훈 → 조기종",
    "서안·경상·연상·사방탁자·책장·이층장. 400년 넘은 화류목을 쓰고, 못 없이 45° 연귀짜임으로 결합한다. 1971년 처음 사방탁자를 만들었다." + G,
    "'국내 유일 화류소목장'으로 소개되며, 오지호 화백이 그의 화류 소목을 즐겨 썼다고 보도됐다." + S("전남매일")],
  ["임종철", "소목장(창호)", "2024.7.1", "민가창호 박래문 → 김석봉 → 임종철 / 사찰창호 박상길 → 박영곤 → 임종철",
    "광주 누문동 보광건구 공방에서 목공을 배운 전업 장인으로, 사찰 전각의 꽃살 창호를 만든다." + G,
    "증심사·불회사·해인사 등 국가유산의 창호를 제작한 대한민국 명장이며, 2024년 신설된 '소목장(창호)' 종목 보유자로 인정됐다." + S("브릿지경제 2024")],
  ["박영곤", "대목장", "2010.2.16", "인범 → 김형곤 → 임채점 → 박영곤",
    "한옥의 부족한 수납공간을 보완하려고 서서 걸을 수 있는 높이의 다락 건축 양식을 개발했다. 견고함·실용성·아름다움·경제성을 원칙으로 삼는다." + G,
    "2010년 광주시 무형문화재 제19호 보유자로 선정됐고, 50여 년 목수 일을 했다." + S("시민의소리")],
  ["송광무", "탱화장 (현담스님)", "2012.11.26", "박석초 → 송복동 → 송광무",
    "부친 송복동에게 불사 전반을 이어받아 백양사·선운사 등 전국 100여 사찰에서 탱화·단청·불상 조성·개금을 했다. 천연석채와 쪽 염료를 잘 쓴다." + G,
    "전승이 끊긴 천연석채 복원을 위해 재료 발굴과 재현 작품으로 전통 불화를 연구하고 있다." + G],
  ["문상호", "필장", "2005.3.3", "박순 → 최유일 → 문상호",
    "닭털·꿩털·볏짚·대나무·칡·배냇머리 등 다양한 재료로 붓을 만든다. 대나무를 쪼개 만든 '죽필'은 붓끝에 힘이 있고 10년 정도 쓴다." + G,
    "54년 붓 제작 이력을 담은 전시 「붓을 말하다」가 열렸다." + S("파이낸셜투데이")],
  ["안명환", "필장", "2005.3.3", "안재환 → 안규상 → 안종선 → 안명환",
    "산수필·서예붓·황모붓. 털끝 없는 털을 골라내는 '물끝보기'가 특기다. 부친의 '진교필방'에서 이름을 딴 '진다리붓'을 4대째 잇는다." + G,
    "진다리붓은 대가들이 인정한 명품 붓으로 소개된다." + S("전남매일")],
  ["최영자", "남도의례음식장", "2002.12.27", "보성 임씨 할머니 → … → 이연채 → 최영자",
    "이바지·폐백음식, 신선로, 찜·탕, 부각, 한과, 약밥, 떡, 저장찬, 전통주까지 의례음식 조리기법을 두루 갖췄다." + G,
    "남도 전통음식을 6대째 잇는 명인으로, '남도 음식문화의 대모' 이연채의 후계자다." + G],
  ["이애섭", "남도의례음식장", "2006.2.9", "이교문·은진 송씨 → … → 이상하·윤영면 → 이애섭",
    "폐백·이바지 음식에 뛰어나며, 문어·오징어로 만드는 봉황오리기와 곶감오리기 솜씨가 탁월하다." + G,
    "사대부 집안 혼례음식과 남도음식의 맥을 잇는 명인으로 평가받는다." + G],
  ["민경숙", "남도의례음식장", "2014.1.9", "하동 정씨 → 정귀례 → 민경숙",
    "어머니 정귀례에게 6대째 남도의례음식을 전수받았다. 떡·과정류·장류와 폐백·이바지 음식에 고유한 기능을 지녔다." + G,
    "혼례·회갑례·제례 등 의례에 쓰이는 과정류의 전통을 잇고 있다." + G],
];

const cards = crafts.map(([nm, jong, date, line, made, infl]) => `
<div class="cc"><div class="cc-h"><span class="cc-nm">${nm}</span><span class="cc-j">${jong}</span><span class="cc-d">보유자 인정 ${date}</span></div>
<div class="cc-b"><div><b>전승 계보</b> ${line}${G}</div><div><b>만드는 것</b> ${made}</div><div><b>활동·영향</b> ${infl}</div></div></div>`).join("");

const section = `<h2>3. 장인 (광주 무형유산 기능보유자)</h2>
<p style="margin:0 0 6px;font-size:9pt">전통문화관(광주문화재단) 누리집 '무형유산 목록'에 실린 현재 기능보유자 11명이다(작고 보유자 제외). 모두 이번 조사 범위에서 <span class="flag f-no" style="margin-left:0">확인된 논란 없음</span>.</p>
<div class="cgrid">${cards}
</div>
`;

h = h.replace("<h2>3. 논란이 될 만한 사항 (별도 정리)</h2>", section + "\n<h2>4. 논란이 될 만한 사항 (별도 정리)</h2>");

// CSS
h = h.replace("</style>", `  .cgrid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .cc { border:1px solid var(--line); border-radius:10px; overflow:hidden; break-inside:avoid; font-size:8.7pt; line-height:1.5; }
  .cc-h { background:#f1ece4; padding:5px 10px; display:flex; gap:8px; align-items:baseline; flex-wrap:wrap; }
  .cc-nm { font-size:11.5pt; font-weight:900; } .cc-j { font-weight:800; color:var(--ac); } .cc-d { margin-left:auto; font-size:7.8pt; color:var(--sub); }
  .cc-b { padding:6px 10px 8px; } .cc-b > div { margin:2px 0; } .cc-b b { color:var(--sub); margin-right:3px; }
</style>`);

// 표지·안내
h = h.replace("<title>광주 대표 인물·창작자 조사</title>", "<title>광주 대표 인물·장인·창작자 조사</title>");
h = h.replace("<h1>광주의 대표 인물 · 창작자</h1>", "<h1>광주의 대표 인물 · 장인 · 창작자</h1>");
h = h.replace("논란의 구체 내용은 <b>3장 「논란이 될 만한 사항」</b>에 따로 모았다.", "논란의 구체 내용은 <b>4장 「논란이 될 만한 사항」</b>에 따로 모았다. 장인은 3장에 모았다.");
h = h.replace("광주에 정착해 주로 활동한 인물(허백련·오지호)만 넣었다.", "광주에 정착해 주로 활동한 인물(허백련·오지호), 그리고 광주 무형유산 기능보유자(장인 11명)를 넣었다.");
h = h.replace(/\n<div class="note"><b>참고<\/b>: 광주 지역의 무형유산 보유 장인은[\s\S]*?<\/div>/, "");

// 논란 장: 조기종 지원 문제(논란 아님)
h = h.replace(/(<div class="note"><b>확인된 논란 없음<\/b>: )허백련, 오지호, 임방울/, "$1허백련, 오지호, 임방울, 장인 11명");
h = h.replace(/(<div class="note"><b>확인된 논란 없음<\/b>)/, `<div class="cv" style="border-color:#e6e9ef;background:#fafbfc"><h3 style="color:#5b6478"><span class="lv lv-l">낮음</span> 조기종(화류소목장) — 작업장 지원 문제 (논란이 아닌 지원 문제)</h3><ul>
  <li>정식 작업장 없이 5년째 임시 작업장을 운영하고 있어 지원이 절실하다고 보도됐다.${S("전남매일")}</li>
</ul></div>

$1`);

// 출처 추가
h = h.replace("</ul>\n\n<footer>", `  <li><b>전통문화관</b> 광주문화재단 전통문화관 '무형유산 목록'(기능보유자 소개) · https://www.gtcc.or.kr/bbs/board.php?bo_table=heritage_list</li>
  <li><b>전남매일</b> [한국의 명장] 화류소목장 조기종 · http://www.jndn.com/article.php?aid=1614215066312274171 / 「4대째 '진다리붓' 가업 계승한 안명환 필장」 · http://www.jndn.com/article.php?aid=1611728175310901170</li>
  <li><b>브릿지경제 2024</b> 「광주시, 소목장 무형유산으로 임종철 명장 인정」 2024.07.01 · https://www.viva100.com/main/view.php?key=20240701010000145</li>
  <li><b>시민의소리</b> 「남도의 멋을 찾아서(19) 영산 대목장 박영곤」 · http://www.siminsori.com/news/articleView.html?idxno=83635</li>
  <li><b>파이낸셜투데이</b> 「전시회 '붓을 말하다', 무형문화재 문상호 필장의 반세기 흔적」 · http://www.fntoday.co.kr/news/articleView.html?idxno=301706</li>
  <li><b>뉴시스 2026</b> 남도 민속유산 민·관·학 집담회 보도 2026.11.04 · https://www.newsis.com/view/NISX20261104_0003853903</li>
</ul>

<footer>`);
h = h.replace("원본: research/people/people-gwangju.html (광주 한정판)", "원본: research/people/people-gwangju-craft.html (광주 한정판 · 장인 포함)");

await fs.writeFile(dst, h);
console.log("cards:", (h.match(/class="cc"/g) || []).length, "| h2:", [...h.matchAll(/<h2>([^<]+)<\/h2>/g)].map(m => m[1]).join(" / "));
console.log("note 제거:", !h.includes("광주 지역의 무형유산 보유 장인은 이번 조사에 포함되지 않았다"), "| 출처 추가:", h.includes("bo_table=heritage_list"));
