/* BÀI 4 — PHIN LỌC VÀ ỐNG MAO (biên soạn từ docs/Bai_4.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  /* ---------- Phin lọc: mặt cắt ---------- */
  const PARTS = {
    shell: ['Vỏ phin', 'Một đoạn <b>ống đồng</b> đường kính khoảng 1,5 – 2 cm (lớn hay nhỏ tùy hệ thống). Hai đầu thu nhỏ lại cho khớp ống nối.'],
    coarse: ['Lưới lọc thô', 'Gas lỏng đi vào gặp lưới này trước: giữ lại <b>cặn bẩn to</b> (mạt kim loại, mảnh vụn sơn dây...).'],
    desic: ['Hạt hút ẩm', 'Nằm ở <b>giữa</b>. Hút <b>hơi ẩm</b> còn sót trong hệ thống, tránh nước đóng băng làm tắc ống mao. Hết tác dụng nếu để hở ngoài không khí lâu.'],
    fine: ['Lưới lọc tinh', 'Cuối cùng: giữ <b>cặn nhỏ</b> và cả mảnh vỡ của hạt hút ẩm, không cho trôi sang ống mao.'],
    inlet: ['Đầu vào', 'Nối với <b>cuối dàn nóng</b>.'],
    outlet: ['Đầu ra', 'Nối với <b>ống mao</b>.'],
    tech: ['Đuôi công nghệ (chỉ phin 3 đuôi)', 'Ống phụ dùng nối đồng hồ khi gia công: <b>hút chân không, nạp gas</b>.']
  };
  function filterSVG(three, sel) {
    const h = k => sel === k ? ' stroke="var(--cold)" stroke-width="4"' : '';
    return `<svg viewBox="0 0 640 220" role="img" aria-label="Mặt cắt phin lọc">
      <path d="M20 110H110M530 110H620" stroke="var(--brass)" stroke-width="12" stroke-linecap="round" data-k="${'inlet'}"/>
      <text class="lbl" x="55" y="85" text-anchor="middle">VÀO</text><text class="sub" x="55" y="142" text-anchor="middle">từ dàn nóng</text>
      <text class="lbl" x="585" y="85" text-anchor="middle">RA</text><text class="sub" x="585" y="142" text-anchor="middle">tới ống mao</text>
      <g data-k="shell" style="cursor:pointer"><rect x="110" y="60" width="420" height="100" rx="40" fill="var(--surface2)" stroke="${sel === 'shell' ? 'var(--cold)' : 'var(--brass)'}" stroke-width="5"/></g>
      <g data-k="coarse" style="cursor:pointer"><rect x="170" y="70" width="12" height="80" rx="3" fill="var(--muted)"${h('coarse')}/>${[82, 96, 110, 124, 138].map(y => `<path d="M170 ${y}H182" stroke="var(--bg)" stroke-width="2"/>`).join('')}</g>
      <g data-k="desic" style="cursor:pointer"><rect x="186" y="70" width="270" height="80" rx="6" fill="var(--cold-tint)"${h('desic')}/>${[...Array(40)].map((_, i) => `<circle cx="${196 + (i % 10) * 26}" cy="${86 + Math.floor(i / 10) * 20}" r="7" fill="var(--cold-l)" stroke="var(--cold)"/>`).join('')}</g>
      <g data-k="fine" style="cursor:pointer"><rect x="460" y="70" width="12" height="80" rx="3" fill="var(--muted)"${h('fine')}/>${[82, 96, 110, 124, 138].map(y => `<path d="M460 ${y}H472" stroke="var(--bg)" stroke-width="1.5"/>`).join('')}</g>
      ${three ? `<g data-k="tech" style="cursor:pointer"><path d="M320 60V22" stroke="var(--hot)" stroke-width="10" stroke-linecap="round"${h('tech')}/><text class="lbl" x="320" y="14" text-anchor="middle" fill="var(--hot)">đuôi công nghệ</text></g>` : ''}
      <path class="flow" d="M30 110H110M110 110H530M530 110H610" stroke="#fff" stroke-width="2.5"/>
      <text class="fl" x="176" y="190" text-anchor="middle">lưới thô</text><text class="fl" x="320" y="190" text-anchor="middle">hạt hút ẩm</text><text class="fl" x="466" y="190" text-anchor="middle">lưới tinh</text>
      <text class="sub" x="320" y="212" text-anchor="middle">gas đi từ trái sang phải: thô → hút ẩm → tinh</text></svg>`;
  }

  /* ---------- Sơ đồ vòng tuần hoàn có 4 vị trí cắt ---------- */
  function cycleSVG(cuts) {
    const mark = (n, x, y) => `<g><circle cx="${x}" cy="${y}" r="15" fill="${cuts.has(n) ? 'var(--bad)' : 'var(--ink)'}"/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="var(--bg)" font-weight="700" font-size="15">${cuts.has(n) ? '✂' : n}</text></g>`;
    const zz = (x0, y0, w, n, col) => { let d = `M${x0} ${y0}`; for (let i = 0; i < n; i++) d += `V${y0 + (i % 2 ? 0 : 80)}H${x0 + (i + 1) * w}`; return `<path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linejoin="round"/>`; };
    return `<svg viewBox="0 0 660 290" role="img" aria-label="Sơ đồ vòng gas với 4 vị trí cắt">
      <rect x="20" y="40" width="190" height="130" rx="14" fill="var(--cold-tint)"/><rect x="450" y="40" width="190" height="130" rx="14" fill="var(--hot-tint)"/>
      <text class="lbl" x="115" y="196" text-anchor="middle">Dàn lạnh</text><text class="lbl" x="545" y="196" text-anchor="middle">Dàn nóng</text>
      ${zz(40, 70, 28, 6, 'var(--cold)')}${zz(470, 70, 28, 6, 'var(--hot)')}
      <rect x="270" y="25" width="120" height="50" rx="12" fill="var(--ink)"/><text x="330" y="56" text-anchor="middle" fill="var(--bg)" font-weight="700">BLOCK</text>
      <path d="M390 50H470M40 70V50H270M330 75V95" stroke="var(--hot)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M638 150V235H600" stroke="var(--warm)" stroke-width="6" fill="none"/>
      <rect x="540" y="222" width="60" height="26" rx="10" fill="var(--brass)"/><text class="fl" x="570" y="266" text-anchor="middle" style="fill:var(--ink)">phin lọc</text>
      <path d="M540 235H300q-10-14-20 0t-20 0t-20 0t-20 0H40" stroke="var(--cold-l)" stroke-width="3" fill="none"/>
      <text class="fl" x="300" y="262" text-anchor="middle" style="fill:var(--ink)">ống mao</text>
      <path d="M40 150V235" stroke="var(--cold)" stroke-width="6" fill="none"/>
      ${mark(1, 330, 110)}${mark(4, 465, 60)}${mark(3, 638, 192)}${mark(2, 520, 235)}</svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-filter" data-toc="1 · Phin lọc">
  <div class="sec-n">Phần 1</div><h2>Phin lọc (phin sấy lọc)</h2>
  <p>Phin lọc nằm <b>sau dàn nóng, trước ống mao</b>. Nó có <b>2 công dụng</b>: <b>lọc</b> cặn bẩn và <b>sấy</b> (hút) hơi ẩm. Bấm vào từng bộ phận trên hình để xem chức năng.</p>
  <div id="phTabs"></div>
  <div class="grid2" style="margin-top:14px;align-items:start"><div class="stage" style="margin:0" id="phSvg"></div><article class="panel" id="phPanel" aria-live="polite"></article></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ</b><p>Theo chiều gas đi: <b>thô → hạt hút ẩm → tinh</b> (như sàng gạo: sàng to trước, tinh sau). “Lọc cặn + sấy ẩm” = tên gọi <b>phin sấy lọc</b>.</p></div></div>
  <div class="callout"><span class="ic">🔧</span><div><b class="t">Cặn bẩn từ đâu ra?</b><p>Mạt kim loại do chi tiết block ma sát; sản phẩm phản ứng giữa gas – dầu – hơi ẩm; bụi bẩn lọt vào khi sửa chữa; mảnh vụn cách điện cuộn dây khi chạy nóng; xỉ hàn.</p></div></div>
</section>

<section class="sec" id="s-cap" data-toc="2 · Ống mao">
  <div class="sec-n">Phần 2</div><h2>Ống mao (van tiết lưu cố định)</h2>
  <p>Ống mao là một đoạn <b>ống đồng rất nhỏ và dài</b>, tạo <b>trở lực lớn</b> → làm <b>chênh lệch áp suất</b> giữa dàn nóng (cao, ~8 bar) và dàn lạnh (rất thấp, ~0,6 bar). Áp thấp → gas lỏng sôi ở nhiệt độ thấp (~ −23 °C với gas R134a) để hút nhiệt.</p>
  <dl class="kv"><dt>Kích thước</dt><dd>Đường kính ngoài cỡ <b>1 – 2 mm</b>, đường kính trong còn nhỏ hơn (cỡ <b>0,6 – 1 mm</b>).</dd><dt>Chiều dài</dt><dd>Thường <b>0,5 – 2,5 m</b> (tốt nhất khoảng 2 – 2,5 m), một số tủ có thể tới 3 m.</dd><dt>Vị trí</dt><dd>Một đầu nối phin, một đầu nối dàn lạnh.</dd></dl>
  <h3 style="margin-top:22px">Ống mao sai chiều dài / tiết diện thì sao?</h3>
  <div id="capTabs"></div><article class="panel warm" id="capPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-fault" data-toc="3 · Hư hỏng, triệu chứng">
  <div class="sec-n">Phần 3</div><h2>Hư hỏng thường gặp và cách nhận biết</h2>
  <div class="grid2"><div class="panel hotc" style="margin:0"><h4>Phin lọc</h4><ul style="margin:6px 0 0;padding-left:18px"><li><b>Tắc lưới lọc</b> (một phần / toàn phần)</li><li><b>Mất tính hút ẩm</b></li></ul></div>
    <div class="panel hotc" style="margin:0"><h4>Ống mao</h4><ul style="margin:6px 0 0;padding-left:18px"><li><b>Tắc bẩn</b> (một phần / toàn phần)</li><li><b>Tắc ẩm</b> (băng bịt cuối ống mao)</li></ul></div></div>
  <p style="margin-top:14px">Hậu quả chung: tủ <b>kém lạnh</b> (tắc một phần) hoặc <b>mất lạnh</b> (tắc toàn phần). Chọn một tình huống để xem biểu hiện:</p>
  <div id="simTabs"></div>
  <div class="stage"><div id="simLights" class="row" style="justify-content:space-around;padding:14px 8px"></div>
    <div style="padding:0 16px 8px"><div class="muted" style="font-size:14px">Dòng điện block:</div><div class="bar" style="height:14px;margin:6px 0 4px"><i id="simCur" style="width:20%;background:var(--cold)"></i></div><div id="simAmp" class="muted" style="font-size:14px"></div></div>
    <div class="verdict" id="simV" style="margin:6px 14px 12px"></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Vì sao tắc ẩm lại “lúc lạnh lúc không”?</b><p>Hơi nước trong gas khi qua <b>ống mao</b> gặp nhiệt độ âm sẽ <b>đóng băng</b> bịt cuối ống mao. Máy nén hút hết gas phía thấp → chạy <b>chân không</b> (dòng thấp), dàn nóng nguội. Băng tan thì gas lại tuần hoàn, tủ lạnh lại → rồi tắc lại. Chu kỳ lặp đi lặp lại.</p></div></div>
</section>

<section class="sec" id="s-test" data-toc="4 · Chẩn đoán 4 điểm cắt">
  <div class="sec-n">Phần 4</div><h2>Thực hành: tìm chỗ tắc bằng 4 điểm cắt</h2>
  <p>Tủ chạy mà <b>không lạnh</b>. Có thể hỏng block (lọt hơi), thủng/hết gas, hoặc tắc ở ống mao / phin / dàn nóng. Ta cắt ống ở <b>4 vị trí</b> để loại trừ dần.</p>
  <div class="stage"><div id="cyc"></div></div>
  <div class="panel"><div class="row" id="vBtns">
    <button class="btn sm" data-a="v1">✂ 1 · Cắt ống công nghệ ở block</button>
    <button class="btn sm" data-a="run">🌀 Chạy máy hút khí → ngắt → thử tay ở ống</button>
    <button class="btn sm" data-a="v2">✂ 2 · Cắt cuối phin / đầu ống mao</button>
    <button class="btn sm" data-a="v3">✂ 3 · Cắt cuối dàn nóng / đầu phin</button>
    <button class="btn sm" data-a="v4">✂ 4 · Cắt đầu dàn nóng</button>
    <button class="btn sm" id="vNew">🔄 Ca bệnh mới</button></div>
    <div class="verdict" id="vOut" style="margin-top:12px;min-height:4.5em">Hãy bắt đầu bằng thao tác đầu tiên bạn cho là hợp lý.</div>
    <div class="row" style="margin-top:12px"><b>Kết luận:</b><select id="vAns" class="btn sm" style="min-height:40px"><option value="">— chọn —</option><option value="comp">Block lọt hơi (hỏng van, không hút/đẩy)</option><option value="leak">Thủng / hết gas</option><option value="cap">Tắc ống mao</option><option value="filter">Tắc phin lọc</option><option value="cond">Tắc dàn nóng</option></select><button class="btn pri sm" id="vChk">Kiểm tra</button></div><div id="vRes" style="margin-top:10px"></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Quy tắc “từ block đi ngược về”</b><p>① Cắt 1: <b>gas xì mạnh</b> → block hút/đẩy kém (lọt hơi). ② Không có gas → chạy máy hút khí: <b>có luồng khí tuần hoàn</b> → hệ thống thủng; <b>không có</b> → tắc. ③ Tìm điểm tắc: cắt <b>2 → 3 → 4</b>: điểm đầu tiên <b>có gas xì ra</b> cho biết nằm ngay trước chỗ tắc.</p></div></div>
</section>

<section class="sec" id="s-fix" data-toc="5 · Sửa chữa, thay thế">
  <div class="sec-n">Phần 5</div><h2>Sửa chữa và thay thế</h2>
  <p>Phin lọc là loại <b>không tháo lắp được</b>: hỏng thì <b>thay phin mới</b>. Tuy tưởng vệ sinh lưới được nhưng để ngoài không khí hạt hút ẩm sẽ <b>hút ẩm bão hòa</b> và mất tác dụng.</p>
  <div id="fixTabs"></div><div id="fixBody"></div>
  <div class="callout danger"><span class="ic">🔥</span><div><b class="t">Khi hàn phin lọc</b><p>Chỉnh ngọn lửa vừa phải, <b>quấn giẻ ướt quanh thân phin</b>. Nếu nóng quá, hạt hút ẩm bị cháy, vỡ vụn → <b>chính nó gây tắc</b>.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Phin lọc nằm sau dàn nóng, trước ống mao.</b><span>Lọc cặn + hút ẩm; có loại 2 đuôi và 3 đuôi (đuôi công nghệ).</span></div></li>
    <li class="done"><div><b>Cấu tạo: lưới thô → hạt hút ẩm → lưới tinh.</b><span>Vỏ ống đồng cỡ 1,5 – 2 cm.</span></div></li>
    <li class="done"><div><b>Ống mao nhỏ và dài tạo chênh áp; đoạn hay tắc nhất.</b><span>Chiều dài thường 0,5 – 2,5 m.</span></div></li>
    <li class="done"><div><b>Tắc một phần → đổ mồ hôi / bám tuyết, kém lạnh. Tắc ẩm → lúc lạnh lúc không.</b><span>Tắc toàn phần → không lạnh.</span></div></li>
    <li class="done"><div><b>Chẩn đoán bằng 4 điểm cắt, từ block ngược về.</b><span>Gas xì mạnh ở 1 → hỏng block; không gas và không tuần hoàn → tắc.</span></div></li>
    <li class="done"><div><b>Phin hỏng luôn thay mới; trước khi thay ống mao phải súc rửa hệ thống.</b><span>Cắm ống mao vào phin chạm lưới rồi lùi ~1 cm.</span></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/4/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const CAP = {
    short: ['Ống mao QUÁ NGẮN / tiết diện LỚN', '<ul><li>Trở lực nhỏ, chênh áp không đủ → <b>áp suất sôi P0 tăng</b>, nhiệt độ sôi tăng.</li><li>Gas lỏng chảy sang dàn lạnh quá nhiều/quá nhanh → tủ <b>kém lạnh</b>.</li></ul>'],
    ok: ['Ống mao ĐÚNG (cân cáp chuẩn)', '<ul><li>P0 đúng thiết kế → gas sôi ở nhiệt độ thấp, đạt <b>năng suất làm lạnh</b> yêu cầu.</li><li>Việc chọn đúng chiều dài / tiết diện gọi là <b>“cân cáp”</b> (sẽ học riêng).</li></ul>'],
    long: ['Ống mao QUÁ DÀI / tiết diện NHỎ', '<ul><li>Lưu lượng gas phun sang dàn lạnh <b>quá ít</b> → năng suất làm lạnh giảm.</li><li>Gas hồi về chậm, <b>block không được làm mát</b> kịp → nóng, hại block.</li><li>Tiết diện càng nhỏ càng <b>dễ tắc</b>.</li></ul>']
  };

  const SIM = {
    ok: { name: 'Bình thường', lights: [['Dàn nóng', 'nóng đều', 1], ['Dàn lạnh', 'lạnh', 1], ['Phin lọc', 'khô, ấm', 1], ['Ống mao', 'khô', 1]], cur: 30, amp: 'Có tải lúc đầu, rồi ổn định ≤ định mức', v: 'Tuần hoàn liên tục, tủ lạnh bình thường.' },
    part: { name: 'Tắc một phần (phin / ống mao)', lights: [['Dàn nóng', 'nóng đều', 1], ['Dàn lạnh', 'lạnh yếu', .5], ['Phin lọc', 'ĐỔ MỒ HÔI / bám tuyết', 0], ['Ống mao', 'đổ mồ hôi', 0]], cur: 38, amp: 'Hơi cao hơn bình thường', v: 'Điểm tắc hoạt động như van tiết lưu: <b>sau điểm tắc đổ mồ hôi hoặc bám tuyết</b>. Gas lỏng qua ít → tủ <b>kém lạnh</b>. Dàn nóng vẫn nóng đều.' },
    full: { name: 'Tắc toàn phần', lights: [['Dàn nóng', 'không nóng', 0], ['Dàn lạnh', 'không lạnh', 0], ['Phin lọc', 'bình thường', 1], ['Ống mao', 'bình thường', 1]], cur: 12, amp: 'Thấp: block chạy gần như không tải (chân không)', v: 'Block hút hết gas phía thấp rồi không còn gì để hút: chạy <b>chân không</b>, dòng thấp. Dàn nóng không nóng, dàn lạnh không lạnh → tủ <b>mất lạnh</b>.' },
    wet: { name: 'Tắc ẩm (đóng băng cuối ống mao)', lights: [], cur: 0, amp: '', v: '' }
  };
  const WET = [
    { t: 'Đang tuần hoàn', hot: 1, cold: 1, cur: 34, amp: 'Có gas → dòng bình thường/cao hơn', v: 'Gas tuần hoàn, dàn nóng nóng, dàn lạnh lạnh. Hơi ẩm bắt đầu đóng băng ở cuối ống mao...' },
    { t: 'Băng bịt cuối ống mao', hot: 0, cold: 0, cur: 12, amp: 'Thấp: block chạy chân không', v: 'Cuối ống mao bị băng bịt kín → dòng chảy ngừng. Block hút hết gas, <b>dàn nóng nguội, dàn lạnh không lạnh</b>.' },
    { t: 'Nóng lên, băng tan', hot: .5, cold: 0, cur: 22, amp: 'Đang tăng dần', v: 'Dàn lạnh ấm dần, băng tan → gas lại chảy được...' }
  ];

  const FIX = {
    filter: [['Thay phin lọc mới (luôn thay khi sửa hệ thống)', 'Hạt hút ẩm hết tác dụng khi để ngoài không khí, nên đã mở hệ thống là thay phin.'], ['Chọn phin mới còn bịt kín', 'Hai đầu phải còn <b>nút cao su</b>, đựng trong túi bạc hút chân không → hạt hút ẩm còn nguyên tính chất.'], ['Quấn giẻ ướt quanh thân phin', 'Tránh cháy hạt hút ẩm khi hàn.'], ['Hàn phin vào đường ống', 'Chỉnh ngọn lửa vừa, hàn nhanh.'], ['Hút chân không, nạp gas', '']],
    cap: [['Ống mao tắc bẩn — thổi sạch trước, không được mới thay', 'Dùng khí nitơ ≤ 300 psi'], ['Hở đầu ống mao, nối bơm vào cuối dàn lạnh', 'Hàn cuối dàn lạnh (đường hồi về block) với ống công nghệ phi 6, nối đồng hồ, bơm nitơ từ cuối dàn lạnh về phía ống mao.'], ['Giữ áp suất ≤ 300 psi', 'Không vượt quá áp chịu đựng của dàn lạnh để tránh nổ.'], ['Hơ nóng đầu ống mao bằng máy sấy tóc', 'Dầu loãng ra dễ bị thổi cùng cặn bẩn. Có thể kết hợp nước tẩy rửa chuyên dụng.'], ['Thông thì hàn nối lại, hút chân không, nạp gas', 'Không thông → thay ống mao (đừng cố thổi mạnh dễ phá dàn lạnh).']],
    wet: [['Tắc ẩm: phải khử hết ẩm khỏi hệ thống', 'Thay phin + hút chân không lại'], ['Hút chân không lại cho hệ thống', 'Với gas HFC dùng dầu polyester dễ hút ẩm; ẩm còn nằm trong dầu.'], ['Sấy nóng hoặc thay dầu bị nhiễm ẩm', 'Thổi sạch dầu nhiễm ẩm ra ngoài.'], ['Thay phin sấy lọc mới', 'Phin cũ đã bão hòa ẩm.'], ['(Cách khác) bơm cồn methanol', 'Cồn hút nước, hạ điểm đóng băng của nước xuống rất thấp để băng không bịt ống mao.']],
    swap: [['Thay ống mao', 'Phải đúng đường kính và chiều dài'], ['Súc rửa toàn bộ hệ thống trước', 'Thổi nitơ + nước súc rửa cho sạch cặn dầu trong dàn nóng; thay dầu; thay phin. Nếu không, ống mao mới sẽ <b>lại tắc</b>.'], ['Chọn ống mao đường kính trong và chiều dài tương đương', 'Ống mao chỉ đo được đường kính <b>ngoài</b>; có thể dò đường kính trong bằng sợi kim loại mảnh. Cần “cân cáp” để đạt P0 đúng.'], ['Luồn ống mao dễ hơn', 'Tủ gián tiếp: có thể luồn qua đường nước xả đá; hoặc chọc lỗ nhỏ rồi luồn, sau đó dán lại bằng băng dính bạc.'], ['Hàn ống mao vào phin đúng cách', 'Cắm ống mao vào phin tới <b>chạm lưới lọc rồi lùi ra khoảng 1 cm</b> (để ống nằm cao hơn “rốn” đáy phin, cặn đọng dưới đáy không bị hút vào). Hàn khi phin chúc đầu ống mao xuống để que hàn chảy xuôi, không chảy ngược làm tắc ống mao.']]
  };

  function mount(root) {
    // 1. Phin lọc
    let three = false, sel = 'coarse';
    const drawF = () => {
      $('#phSvg', root).innerHTML = filterSVG(three, sel);
      const p = PARTS[sel]; $('#phPanel', root).innerHTML = `<h3>${p[0]}</h3><p style="margin:0">${p[1]}</p><p class="muted" style="margin:10px 0 0;font-size:14px">${three ? 'Phin 3 đuôi: có thêm đuôi công nghệ.' : 'Phin 2 đuôi: chỉ có đầu vào và đầu ra.'}</p>`;
      $$('#phSvg [data-k]', root).forEach(g => g.onclick = () => { sel = g.dataset.k; drawF(); });
    };
    U.tabset($('#phTabs', root), [{ id: '2', name: 'Phin 2 đuôi', sub: 'vào / ra' }, { id: '3', name: 'Phin 3 đuôi', sub: 'có đuôi công nghệ' }], id => { three = id === '3'; if (!three && sel === 'tech') sel = 'coarse'; drawF(); });
    // 2. Ống mao
    U.tabset($('#capTabs', root), [{ id: 'short', name: 'Quá ngắn / to' }, { id: 'ok', name: 'Đúng' }, { id: 'long', name: 'Quá dài / nhỏ' }], id => { $('#capPanel', root).innerHTML = `<h3>${CAP[id][0]}</h3>${CAP[id][1]}`; }, 'ok');
    // 3. mô phỏng triệu chứng
    let timer = null, ph = 0;
    const lights = arr => $('#simLights', root).innerHTML = arr.map(l => `<div style="text-align:center;min-width:120px"><div style="width:46px;height:46px;border-radius:50%;margin:0 auto 6px;background:${l[2] === 1 ? 'var(--ok)' : l[2] === 0 ? 'var(--bad)' : 'var(--warm)'};opacity:${l[2] === 1 ? 1 : .85}"></div><b style="font-size:14px">${l[0]}</b><div class="muted" style="font-size:13px">${l[1]}</div></div>`).join('');
    const setCur = (c, a, v) => { $('#simCur', root).style.width = c + '%'; $('#simAmp', root).textContent = a; $('#simV', root).innerHTML = v; };
    function sim(id) {
      clearInterval(timer); timer = null; const s = SIM[id];
      if (id !== 'wet') { lights(s.lights); setCur(s.cur, s.amp, s.v); return; }
      ph = 0;
      const step = () => { const w = WET[ph]; lights([['Dàn nóng', w.hot === 1 ? 'nóng' : w.hot ? 'ấm dần' : 'nguội', w.hot], ['Dàn lạnh', w.cold === 1 ? 'lạnh' : 'không lạnh', w.cold], ['Ống mao', ph === 1 ? 'băng bịt cuối' : 'đang đóng băng/tan', ph === 1 ? 0 : .5]]); setCur(w.cur, w.amp, `<b>${w.t}.</b> ${w.v}`); ph = (ph + 1) % WET.length; };
      step(); timer = setInterval(() => { if (!document.body.contains($('#simLights', root))) { clearInterval(timer); return; } step(); }, 2600);
    }
    U.tabset($('#simTabs', root), Object.entries(SIM).map(([id, s]) => ({ id, name: s.name })), sim);
    // 4. chẩn đoán 4 điểm cắt
    let ca, cuts = new Set();
    const cyc = () => $('#cyc', root).innerHTML = cycleSVG(cuts);
    const newCa = () => { ca = ['comp', 'leak', 'cap', 'filter', 'cond'][Math.floor(Math.random() * 5)]; cuts = new Set(); cyc(); $('#vOut', root).className = 'verdict'; $('#vOut', root).textContent = 'Hãy bắt đầu bằng thao tác đầu tiên bạn cho là hợp lý.'; $('#vRes', root).innerHTML = ''; $('#vAns', root).value = ''; };
    newCa(); $('#vNew', root).onclick = newCa;
    const R = {
      v1: { comp: '<b>Gas xì ra MẠNH</b> (áp cân bằng, block không hút/đẩy nổi).', leak: 'Không có gas xì ra (áp trong = áp ngoài).', cap: 'Không có gas xì ra (block đã hút hết gas phía thấp).', filter: 'Không có gas xì ra (block đã hút hết gas phía thấp).', cond: 'Không có gas xì ra (block đã hút hết gas phía thấp).' },
      run: { comp: 'Ở ống công nghệ đã có gas xì nên không cần thử bước này.', leak: 'Sau khi ngắt máy: tay đặt ở đầu ống <b>có luồng khí thổi ra</b> → không khí tuần hoàn qua cả vòng → hệ thống <b>thông</b>, đang bị <b>thủng / hết gas</b>.', cap: '<b>Không có luồng khí</b> → không khí không lưu thông được → hệ thống <b>bị tắc</b> toàn phần.', filter: '<b>Không có luồng khí</b> → hệ thống <b>bị tắc</b> toàn phần.', cond: '<b>Không có luồng khí</b> → hệ thống <b>bị tắc</b> toàn phần.' },
      v2: { comp: 'Có chút gas áp thấp (hệ thống cân bằng).', leak: 'Không có gas.', cap: '<b>Gas + khí xì ra mạnh</b> → điểm tắc nằm ngay sau điểm cắt này (ống mao).', filter: 'Không có gas xì ra.', cond: 'Không có gas xì ra.' },
      v3: { comp: 'Có chút gas áp thấp.', leak: 'Không có gas.', cap: 'Gas xì ra mạnh (áp cao dồn lại cả phía trước).', filter: '<b>Gas xì ra mạnh</b> → chỗ tắc nằm giữa điểm 3 và điểm 2 (phin lọc, hoặc đầu ống mao dính cặn).', cond: 'Không có gas xì ra.' },
      v4: { comp: 'Có chút gas áp thấp.', leak: 'Không có gas.', cap: 'Gas xì ra mạnh.', filter: 'Gas xì ra mạnh.', cond: '<b>Gas xì ra mạnh</b> → chỗ tắc nằm giữa điểm 4 và điểm 3: <b>dàn nóng</b> tắc.' }
    };
    $$('#vBtns [data-a]', root).forEach(b => b.onclick = () => {
      const a = b.dataset.a; if (a !== 'run') cuts.add(+a[1]); cyc();
      $('#vOut', root).className = 'verdict'; $('#vOut', root).innerHTML = (a === 'run' ? '' : `Cắt tại vị trí ${a[1]}: `) + R[a][ca];
    });
    $('#vChk', root).onclick = () => {
      const v = $('#vAns', root).value, r = $('#vRes', root); if (!v) { r.innerHTML = '<div class="why">Hãy chọn kết luận.</div>'; return; }
      const why = { comp: 'Gas xì mạnh ngay ở điểm 1 → block lọt hơi (hỏng van), không hút/đẩy được.', leak: 'Không có gas ở điểm 1, nhưng có luồng khí tuần hoàn khi thử → hệ thống thông, bị thủng hoặc hết gas. Tiếp theo phải thử kín từng bộ phận.', cap: 'Điểm 1 không gas, không tuần hoàn (tắc), cắt điểm 2 thấy gas xì mạnh → tắc ở <b>ống mao</b>.', filter: 'Điểm 2 không gas nhưng điểm 3 xì mạnh → tắc ở <b>phin lọc</b> (hoặc đầu ống mao dính cặn dưới đáy phin).', cond: 'Điểm 3 không gas nhưng điểm 4 xì mạnh → tắc ở <b>dàn nóng</b>.' };
      r.innerHTML = `<div class="why" style="border-color:var(--${v === ca ? 'ok' : 'bad'})"><b>${v === ca ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> ${why[ca]}</div>`;
    };
    // 5. sửa chữa
    U.tabset($('#fixTabs', root), [{ id: 'filter', name: 'Thay phin lọc' }, { id: 'cap', name: 'Ống mao tắc bẩn', sub: 'thổi sạch' }, { id: 'wet', name: 'Tắc ẩm', sub: 'khử ẩm' }, { id: 'swap', name: 'Thay ống mao' }], id => { const f = FIX[id]; $('#fixBody', root).innerHTML = `<article class="panel warm"><h3>${f[0][0]}</h3><p style="margin:0">${f[0][1]}</p></article>${U.steps(f.slice(1))}`; U.bindSteps($('#fixBody', root)); });
  }

  const flashcards = [
    { f: 'Phin lọc nằm ở đâu trong hệ thống?', b: '<b>Sau dàn nóng, trước ống mao</b>.', tag: 'Phin lọc' },
    { f: 'Công dụng của phin lọc?', b: '<b>Lọc</b> cặn bẩn và <b>sấy</b> (hút) hơi ẩm → gọi là phin sấy lọc.', tag: 'Phin lọc' },
    { f: 'Thứ tự các lớp trong phin theo chiều gas?', b: 'Lưới lọc <b>thô</b> → <b>hạt hút ẩm</b> → lưới lọc <b>tinh</b>.', tag: 'Phin lọc' },
    { f: 'Phin 2 đuôi và 3 đuôi khác nhau thế nào?', b: 'Phin 3 đuôi có thêm <b>đuôi công nghệ</b> để nối đồng hồ hút chân không, nạp gas.', tag: 'Phin lọc' },
    { f: 'Vỏ phin lọc làm bằng gì, cỡ bao nhiêu?', b: '<b>Ống đồng</b>, đường kính khoảng 1,5 – 2 cm.', tag: 'Phin lọc' },
    { f: 'Cặn bẩn trong hệ thống đến từ đâu?', b: 'Mạt kim loại ở block, phản ứng gas–dầu–ẩm, bụi lọt khi sửa, vụn cách điện, xỉ hàn.', tag: 'Phin lọc' },
    { f: 'Ống mao có nhiệm vụ gì?', b: 'Tạo <b>trở lực</b> → chênh áp giữa dàn nóng và dàn lạnh → gas lỏng sôi ở nhiệt độ thấp.', tag: 'Ống mao' },
    { f: 'Kích thước ống mao?', b: 'Đường kính ngoài cỡ <b>1–2 mm</b>, trong cỡ <b>0,6–1 mm</b>, dài <b>0,5–2,5 m</b> (có tủ tới 3 m).', tag: 'Ống mao' },
    { f: 'Áp suất ở dàn lạnh và dàn nóng (ví dụ trong bài)?', b: 'Dàn nóng ~ <b>8 bar</b>; dàn lạnh ~ <b>0,6 bar</b> → gas R134a sôi ~ <b>−23 °C</b>.', tag: 'Ống mao' },
    { f: 'Ống mao quá dài / nhỏ gây hậu quả?', b: 'Lưu lượng ít, năng suất giảm; hồi gas chậm làm <b>block nóng</b>; dễ tắc.', tag: 'Ống mao' },
    { f: 'Ống mao quá ngắn / to gây hậu quả?', b: '<b>P0 tăng</b>, nhiệt độ sôi tăng → tủ kém lạnh.', tag: 'Ống mao' },
    { f: '“Cân cáp” là gì?', b: 'Chọn đúng <b>chiều dài / tiết diện</b> ống mao để đạt áp suất bay hơi P0 đúng thiết kế.', tag: 'Ống mao' },
    { f: 'Phin và ống mao hay hỏng ở dạng nào?', b: 'Tắc một phần, tắc toàn phần, và <b>tắc ẩm</b>; phin còn bị <b>mất tính hút ẩm</b>.', tag: 'Hư hỏng' },
    { f: 'Tắc một phần: biểu hiện?', b: 'Tủ <b>kém lạnh</b>; ngay sau điểm tắc <b>đổ mồ hôi hoặc bám tuyết</b>; dàn nóng nóng đều.', tag: 'Hư hỏng' },
    { f: 'Tắc toàn phần: biểu hiện?', b: 'Tủ <b>mất lạnh</b>; dàn nóng không nóng, dàn lạnh không lạnh; block chạy dòng thấp (chân không).', tag: 'Hư hỏng' },
    { f: 'Tắc ẩm là gì? Biểu hiện?', b: 'Hơi nước <b>đóng băng</b> bịt cuối ống mao. Tủ <b>lúc lạnh lúc không</b>, dòng lên xuống theo chu kỳ.', tag: 'Hư hỏng' },
    { f: 'Block chạy chân không thì dòng thế nào?', b: 'Dòng <b>thấp</b> (nhỏ hơn dòng có tải).', tag: 'Hư hỏng' },
    { f: 'Cắt ống công nghệ ở block (điểm 1), gas xì mạnh. Kết luận?', b: '<b>Block lọt hơi</b> (hút/đẩy kém), không phải tắc.', tag: 'Chẩn đoán' },
    { f: 'Không có gas ở điểm 1: làm gì tiếp?', b: 'Cho block chạy hút khí, ngắt rồi thử tay: <b>có khí → thủng/hết gas</b>; <b>không khí → tắc</b>.', tag: 'Chẩn đoán' },
    { f: 'Cắt điểm 2 gas xì mạnh. Tắc ở đâu?', b: '<b>Ống mao</b>.', tag: 'Chẩn đoán' },
    { f: 'Điểm 2 không gas, điểm 3 xì mạnh. Tắc ở đâu?', b: '<b>Phin lọc</b> (hoặc đầu ống mao dính cặn).', tag: 'Chẩn đoán' },
    { f: 'Điểm 3 không gas, điểm 4 xì mạnh. Tắc ở đâu?', b: '<b>Dàn nóng</b>.', tag: 'Chẩn đoán' },
    { f: 'Phin lọc hỏng thì sửa hay thay?', b: '<b>Thay mới</b> — không tháo lắp, vệ sinh thì hạt hút ẩm đã bão hòa.', tag: 'Sửa chữa' },
    { f: 'Phin mới cần đảm bảo điều gì?', b: 'Hai đầu có <b>nút cao su</b>, đựng túi bạc hút chân không.', tag: 'Sửa chữa' },
    { f: 'Khi hàn phin, làm gì để tránh cháy hạt hút ẩm?', b: 'Chỉnh lửa vừa, <b>quấn giẻ ướt</b> quanh thân phin.', tag: 'Sửa chữa' },
    { f: 'Thổi sạch ống mao tắc bẩn: áp suất tối đa?', b: 'Khí nitơ <b>≤ 300 psi</b>, bơm từ cuối dàn lạnh, hơ nóng đầu ống mao.', tag: 'Sửa chữa' },
    { f: 'Cách khử ẩm cho tắc ẩm?', b: 'Hút chân không lại, thay dầu/sấy, <b>thay phin</b>; hoặc bơm cồn methanol hút nước.', tag: 'Sửa chữa' },
    { f: 'Trước khi thay ống mao cần làm gì?', b: '<b>Súc rửa toàn bộ hệ thống</b>, thay dầu, thay phin — nếu không sẽ tắc lại.', tag: 'Sửa chữa' },
    { f: 'Hàn ống mao vào phin: cắm bao sâu?', b: 'Cắm tới <b>chạm lưới lọc rồi lùi khoảng 1 cm</b>.', tag: 'Sửa chữa' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Phin lọc được lắp ở đâu?', ['Sau dàn nóng, trước ống mao', 'Trước block', 'Sau dàn lạnh', 'Giữa block và dàn nóng'], 0, 'Ở cuối dàn nóng, trước thiết bị tiết lưu.'),
    Q('Hai công dụng của phin lọc?', ['Lọc cặn và hút ẩm', 'Nén và làm mát', 'Tiết lưu và ngưng tụ', 'Bay hơi và hồi dầu'], 0, 'Phin sấy lọc: lọc + sấy.'),
    Q('Theo chiều gas, thứ tự đúng trong phin?', ['Tinh – hút ẩm – thô', 'Thô – hút ẩm – tinh', 'Hút ẩm – thô – tinh', 'Tinh – thô – hút ẩm'], 1, 'Thô → hút ẩm → tinh.'),
    Q('Đuôi công nghệ của phin 3 đuôi dùng để?', ['Hút chân không, nạp gas', 'Xả dầu', 'Làm mát', 'Giảm ồn'], 0, 'Dùng nối đồng hồ khi gia công.'),
    Q('Nhiệm vụ chính của ống mao?', ['Tạo chênh lệch áp suất giữa dàn nóng và dàn lạnh', 'Lọc cặn', 'Nén gas', 'Làm mát block'], 0, 'Nhỏ và dài → trở lực lớn.'),
    Q('Chiều dài ống mao thường?', ['5 cm', '0,5 – 2,5 m', '10 m', '50 m'], 1, 'Một số tủ tới 3 m.'),
    Q('Ống mao quá ngắn (hoặc quá to) làm P0 thế nào?', ['Giảm', 'Tăng', 'Không đổi', 'Bằng 0'], 1, 'Chênh áp ít → P0 cao → nhiệt độ sôi cao → kém lạnh.'),
    Q('Ống mao quá dài/nhỏ làm?', ['Lưu lượng gas ít, năng suất giảm, block dễ nóng', 'Tủ lạnh sâu', 'Block mát', 'Gas nhiều hơn'], 0, 'Hồi gas chậm làm block thiếu làm mát.'),
    Q('Tắc một phần ở phin thì biểu hiện?', ['Sau phin đổ mồ hôi / bám tuyết', 'Dàn nóng nguội', 'Dòng bằng 0', 'Tủ nóng'], 0, 'Điểm tắc như van tiết lưu, gas sôi hút nhiệt.'),
    Q('Tắc toàn phần thì tủ?', ['Mất lạnh', 'Lạnh sâu', 'Kém lạnh nhẹ', 'Không ảnh hưởng'], 0, 'Gas không tuần hoàn.'),
    Q('Tắc ẩm xảy ra ở đâu?', ['Cuối ống mao (băng bịt ống)', 'Trong block', 'Giữa dàn nóng', 'Ở ống hút'], 0, 'Hơi nước đóng băng khi gặp nhiệt độ âm.'),
    Q('Biểu hiện điển hình của tắc ẩm?', ['Tủ lúc lạnh lúc không, theo chu kỳ', 'Luôn lạnh', 'Không bao giờ lạnh', 'Block không chạy'], 0, 'Băng bịt rồi tan rồi lại bịt.'),
    Q('Block chạy chân không có dòng?', ['Thấp', 'Cao', 'Bằng định mức', 'Rất cao'], 0, 'Không có tải nên dòng thấp.'),
    Q('Cắt điểm 1 (ống công nghệ ở block) gas xì mạnh. Kết luận?', ['Block lọt hơi', 'Tắc ống mao', 'Tắc dàn nóng', 'Tắc phin'], 0, 'Block không hút/đẩy nổi nên áp cân bằng.'),
    Q('Không có gas ở điểm 1, thử chạy máy hút khí rồi ngắt thấy có luồng khí. Kết luận?', ['Hệ thống thủng / hết gas', 'Tắc toàn phần', 'Block tốt, không hỏng gì', 'Tắc ẩm'], 0, 'Không khí tuần hoàn được → hệ thống thông.'),
    Q('Điểm 2 xì mạnh. Chỗ tắc là?', ['Ống mao', 'Phin lọc', 'Dàn nóng', 'Block'], 0, 'Gas dồn trước chỗ tắc.'),
    Q('Điểm 2 không gas, điểm 3 xì mạnh. Chỗ tắc là?', ['Phin lọc', 'Ống mao', 'Dàn lạnh', 'Block'], 0, 'Chỗ tắc nằm giữa điểm 3 và điểm 2.'),
    Q('Điểm 3 không gas, điểm 4 xì mạnh. Chỗ tắc là?', ['Dàn nóng', 'Phin', 'Ống mao', 'Dàn lạnh'], 0, 'Giữa điểm 4 và điểm 3.'),
    Q('Phin lọc hỏng thì nên?', ['Thay phin mới', 'Vệ sinh lưới dùng lại', 'Đục ra sửa', 'Bỏ không dùng'], 0, 'Hạt hút ẩm để ngoài không khí sẽ mất tác dụng.'),
    Q('Khi hàn phin, tránh cháy hạt hút ẩm bằng cách?', ['Quấn giẻ ướt quanh phin', 'Hàn thật lâu', 'Tăng lửa tối đa', 'Đổ dầu'], 0, 'Hạt cháy vỡ sẽ gây tắc.'),
    Q('Thổi sạch ống mao tắc, áp suất nitơ tối đa?', ['≤ 300 psi', '≤ 30 psi', '≤ 1000 psi', 'Không giới hạn'], 0, 'Tránh vượt quá áp chịu của dàn lạnh.'),
    Q('Vì sao cồn methanol có thể xử lý tắc ẩm?', ['Hút nước và hạ điểm đóng băng', 'Làm sạch cặn bẩn', 'Tăng áp suất', 'Bôi trơn block'], 0, 'Băng không bịt được ống mao.'),
    Q('Trước khi thay ống mao cần?', ['Súc rửa toàn bộ hệ thống', 'Giảm gas', 'Thay quạt', 'Làm nóng tủ'], 0, 'Không thì ống mới lại tắc vì cặn còn lại.'),
    Q('Hàn ống mao vào phin: cách cắm đúng?', ['Cắm chạm lưới rồi lùi ~1 cm', 'Cắm sát lưới, không lùi', 'Cắm thật sâu qua lưới', 'Chỉ cắm 1 mm'], 0, 'Để ống cao hơn rốn đáy phin, cặn đọng không bị hút vào.')
  ];
  const sort = {
    title: 'Đặc điểm / hư hỏng này thuộc bộ phận nào?',
    buckets: [{ id: 'filter', name: 'Phin lọc' }, { id: 'cap', name: 'Ống mao' }, { id: 'both', name: 'Cả hai' }],
    items: [
      { t: 'Có lưới thô, hạt hút ẩm, lưới tinh', b: 'filter' }, { t: 'Có loại 2 đuôi và 3 đuôi', b: 'filter' }, { t: 'Hỏng thì luôn thay mới, không vệ sinh dùng lại', b: 'filter' }, { t: 'Hàn phải quấn giẻ ướt để khỏi cháy hạt', b: 'filter' },
      { t: 'Ống đồng nhỏ, dài 0,5 – 2,5 m', b: 'cap' }, { t: 'Tạo chênh lệch áp giữa dàn nóng và dàn lạnh', b: 'cap' }, { t: 'Có thể bị tắc ẩm do băng ở cuối ống', b: 'cap' }, { t: 'Cần “cân cáp” khi thay', b: 'cap' },
      { t: 'Tắc một phần: sau điểm tắc đổ mồ hôi / bám tuyết', b: 'both' }, { t: 'Tắc toàn phần: tủ mất lạnh', b: 'both' }, { t: 'Cặn bẩn hệ thống làm tắc', b: 'both' }, { t: 'Phải súc rửa hệ thống trước khi thay để khỏi tắc lại', b: 'both' }
    ]
  };
  const order = [
    { title: 'Thay phin lọc', intro: 'Sắp xếp các bước thay phin sấy lọc.', steps: ['Xác định phin hỏng, xả gas an toàn', 'Cắt phin cũ ra khỏi đường ống', 'Lấy phin mới còn nút cao su bịt kín', 'Quấn giẻ ướt quanh thân phin', 'Hàn phin vào ống, chỉnh lửa vừa phải', 'Hút chân không, nạp gas'] },
    { title: 'Tìm chỗ tắc bằng điểm cắt', intro: 'Sắp xếp quy trình chẩn đoán “không lạnh”.', steps: ['Cắt ống công nghệ ở block (điểm 1), xem gas', 'Không có gas → chạy máy hút khí, ngắt, thử tay', 'Không có luồng khí → hệ thống bị tắc', 'Cắt đầu ống mao (điểm 2), xem gas', 'Không gas → cắt cuối dàn nóng (điểm 3)', 'Không gas → cắt đầu dàn nóng (điểm 4), kết luận'] },
    { title: 'Thay ống mao', intro: 'Sắp xếp các bước thay ống mao cho đúng.', steps: ['Súc rửa dàn nóng và hệ thống bằng nitơ + nước tẩy', 'Thay dầu, thay phin sấy lọc mới', 'Chọn ống mao đúng đường kính, chiều dài', 'Cắm ống mao vào phin chạm lưới rồi lùi 1 cm', 'Hàn ống mao, phin chúc xuống để que hàn chảy xuôi', 'Hút chân không, nạp gas, cân cáp kiểm tra'] }
  ];
  DL.register({
    id: 4, ready: true, title: 'Phin lọc và ống mao', sub: 'Cấu tạo, hư hỏng, tìm chỗ tắc, thay thế', minutes: 25,
    lead: 'Phin lọc giữ sạch gas, ống mao hạ áp cho gas sôi. Hai bộ phận nhỏ này rất hay tắc. Bài học giúp bạn nhận biết triệu chứng, tìm chỗ tắc bằng 4 điểm cắt và thay thế đúng cách.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
