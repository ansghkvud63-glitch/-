const fs = await import("node:fs/promises");
const f = "C:/Users/Administrator/llm-local/research/pdf-build/cardnews-insta.html";
let h = await fs.readFile(f, "utf8");
const T = s => `<i class="s">${s}</i>`;
const K = T("카카오맵"), KR = T("카카오맵 길찾기"), D = T("다이닝코드"), G = T("광주관광"), B = T("국가보훈부"), M = T("박물관 누리집"), J = T("전통문화관");

// 1) CSS
if (!h.includes(".s {")) h = h.replace("</style>", `  i.s { font-style:normal; font-size:0.62em; font-weight:800; color:#8a6d1f; background:#fff3c4; border-radius:6px; padding:1px 6px; margin-left:5px; vertical-align:2px; white-space:nowrap; letter-spacing:0; }\n</style>`);

// 2) 이동(길찾기) 칩: mv / mvx / pair-h small 끝에 출처 추가
h = h.replace(/(<span class="mv[^"]*">)([\s\S]*?)(<\/span>)/g, (m, a, b, c) => b.includes('class="s"') ? m : a + b + KR + c);
h = h.replace(/(<span class="mvx">)([\s\S]*?)(<\/span>)/g, (m, a, b, c) => b.includes('class="s"') ? m : a + b + KR + c);
h = h.replace(/(<div class="pair-h">[\s\S]*?<small>)([\s\S]*?)(<\/small>)/g, (m, a, b, c) => b.includes('class="s"') ? m : a + b + KR + c);

// 3) 문구 뒤 출처 (정규식, 모든 곳)
const rules = [
  // 카카오맵 장소 정보
  [/우렁이쌈밥정식 10,000원(\s?\(2인 이상\))?/g, K],
  [/1인정식 12,000원/g, K],
  [/(월~토만 영업<\/b>\(10:30~20:00\)|월~토 10:30~20:00(\s?\(라스트오더 19:30\))?)/g, K],
  [/밤 초코 몽블랑 8,500원/g, K],
  [/조회일(\(11\.12\))? \d{2}:\d{2}까지( 영업)?/g, K],
  [/24:00까지\)/g, K],
  [/오리탕뚝배기 15,000원/g, K],
  [/오리로스(\(1인분\)| 1인분) 19,000원/g, K],
  [/오리주물럭\(200g\) 19,000원/g, K],
  [/다관세트 12,000원/g, K],
  [/장어반탕 5,000원( \(카카오맵 메뉴\)|\(카카오맵 메뉴\))?/g, K],
  [/16:30 재오픈\)/g, K],
  [/브렉퍼스트 18,000원/g, K],
  [/아메리카노 5,000원/g, K],
  [/(?<!공영주차장 · )무료 주차(?!장)/g, K],
  [/동시 80대 주차/g, K],
  [/(전용 )?주차장 없음(, 가까운 공영주차장 이용(\(카카오맵 안내\))?| · 가까운 공영주차장 이용)?/g, K],
  // 다이닝코드 메뉴판
  [/밀푀유 9,500원/g, D],
  [/파리 브레스트 8,500원/g, D],
  [/바스크 티라미슈 치즈케이크 8,000원/g, D],
  [/리얼 티라미슈 9,000원/g, D],
  [/보늬밤 파르페 17,500원/g, D],
  // 광주관광 공식 사이트
  [/보통 11:00~22:00(\(금·토·일 23:00\)|, 금·토·일 23:00까지)/g, G],
  [/둘째·넷째 월요일( 휴무)?(<\/b>)?/g, G],
  [/월요일 휴관(<\/b>)?/g, G],
  [/(?<=증심사길 177 · |<div class="inf">)09:00~17:00/g, G],
  [/상시 개방( · 무료|·무료)?/g, G],
  [/공영주차장(\(100여 대, 남구 천변좌로418번길 2\)| 100여 대)/g, G],
  [/250,000원\(2~4인\)/g, G],
  [/\(주말·공휴일 250,000원, 2~4인\)/g, G],
  [/1인 평일 20,000원 \/ 주말 25,000원/g, G],
  [/무료 공영주차장/g, G],
  [/목~일 10:30~16:30/g, G],
  // 전통문화관
  [/정기 해설 10:30( · |·)13:30( · |·)15:30/g, J],
  [/(방문 )?10일 전 예약/g, J],
  // 국가보훈부
  [/참배 09:00~18:00( \(국가보훈부\)|\(국가보훈부\))?/g, B],
  // 국립광주박물관
  [/10:00~18:00 ?\(입장 마감 17:30\)/g, M],
  [/1월 1일, 설날·추석 당일/g, M],
  [/무료\(유료 특별전 제외\)/g, M],
];
const report = [];
for (const [re, tag] of rules) {
  let n = 0;
  h = h.replace(re, (m) => { n++; return m + tag; });
  report.push(`${n}\t${re}`);
}
await fs.writeFile(f, h);
console.log(report.join("\n"));
