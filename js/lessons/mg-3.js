/* MÁY GIẶT — BÀI 3: VAN XẢ NƯỚC (biên soạn từ docs/may_giat/Bai_3.md) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const TYPES = {
    pull: ['Van xả hút (xả kéo điện từ)', ['Dùng <b>cuộn dây điện từ + lõi sắt</b> kéo nắp xả; đồng thời kéo <b>cần ly hợp</b> để mâm và lồng quay cùng nhau khi vắt.', 'Nguồn: <b>220 V AC</b> hoặc <b>200 V DC</b> (qua cầu chỉnh lưu).', 'Có <b>2 cuộn dây</b>: cuộn làm việc (khỏe, hút) và cuộn duy trì (giữ).'], 'Phổ biến, đơn giản'],
    two: ['Van xả 2 nấc', ['Điều khiển hai mức xả để vừa xả nước vừa bật ly hợp.', 'Dùng điện áp xoay chiều; có cuộn dây kèm công tắc ngắt cuộn làm việc.'], 'Kiểm soát chính xác hơn'],
    cable: ['Van xả kéo bằng cáp / motor', ['Dùng <b>động cơ nhỏ</b> hoặc cơ cấu cáp kéo nắp xả, kéo cần ly hợp.', 'Có công tắc hành trình dừng đúng vị trí.'], 'Dùng trên một số dòng máy']
  };

  const PARTS = {
    body: ['Thân van', 'Vỏ đỡ nước xả; có nắp (xả) kín nước và ống xả.'],
    plunger: ['Lõi sắt từ', 'Bị cuộn dây hút vào khi có điện; nối với lò xo và cơ cấu kéo.'],
    work: ['Cuộn làm việc', 'Cuộn dây <b>khỏe</b>: có điện chạy là hút lõi sắt vào <b>điểm cuối</b>. Sau khi hút xong bị công tắc K ngắt.'],
    hold: ['Cuộn duy trì', 'Cuộn dây nhỏ giữ lõi sắt ở vị trí kéo nhờ dòng nhỏ → <b>tiết kiệm điện, ít nóng</b>.'],
    switch: ['Công tắc K', 'Đóng khi nghỉ. Khi lõi sắt hút hết hành trình, <b>tác động mở K</b> → ngắt cuộn làm việc, chỉ còn cuộn duy trì.'],
    clutch: ['Cần ly hợp / nắp xả', 'Được lõi sắt kéo để (1) mở đường xả nước, (2) <b>gạt bộ ly hợp</b> để mâm + lồng quay liền nhau (vắt).']
  };

  function pullSVG(st) {
    // st: 0 nghỉ, 1 hút (cả hai cuộn), 2 giữ (chỉ cuộn duy trì)
    const x = st ? 100 : -4, col = st ? 'var(--ok)' : 'var(--muted)';
    return `<svg viewBox="0 0 460 250" role="img" aria-label="Van xả hút ${['nghỉ', 'đang hút', 'đang giữ'][st]}">
      <rect x="140" y="40" width="180" height="62" rx="10" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="150" y="48" width="78" height="46" rx="6" fill="${st === 1 ? 'var(--hot)' : 'var(--line)'}"/><text class="fl" x="189" y="76" text-anchor="middle" style="fill:var(--ink)">làm việc</text>
      <rect x="236" y="48" width="74" height="46" rx="6" fill="${st ? 'var(--warm)' : 'var(--line)'}"/><text class="fl" x="273" y="76" text-anchor="middle" style="fill:var(--ink)">duy trì</text>
      <rect x="${x + 60}" y="62" width="80" height="16" fill="var(--ink)" opacity=".85"/><text class="fl" x="${x + 100}" y="124" text-anchor="middle">lõi sắt</text>
      <path d="M60 70H${x + 60}" stroke="var(--ink)" stroke-width="4"/><circle cx="60" cy="70" r="6" fill="var(--ink)"/>
      <path d="M60 70V160" stroke="var(--muted)" stroke-width="4"/><rect x="30" y="150" width="60" height="28" rx="6" fill="${st ? 'var(--cold)' : 'var(--cold-l)'}"/><text class="fl" x="60" y="196" text-anchor="middle">cần ly hợp</text>
      <rect x="360" y="40" width="70" height="22" rx="4" fill="${st === 1 ? 'var(--ok)' : 'var(--bad)'}"/><text class="fl" x="395" y="34" text-anchor="middle">công tắc K</text><text class="fl" x="395" y="76" text-anchor="middle" style="fill:var(--ink)">${st === 1 ? 'ĐÓNG' : st === 2 ? 'MỞ' : 'ĐÓNG'}</text>
      <path d="M170 128q10 12 20 0t20 0t20 0" fill="none" stroke="var(--cold)" stroke-width="3"/>
      <text class="sub" x="230" y="170" text-anchor="middle" style="fill:${col}">${['NGHỈ','HÚT','GIỮ (VẮT)'][st]}</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-use" data-toc="1 · Công dụng">
  <div class="sec-n">Phần 1</div><h2>Van xả nước làm gì?</h2>
  <p>Chu trình giặt có <b>3 lần lấy nước</b> nên có <b>4 lần xả</b>. Van xả (phụ tải điện thứ hai) có hai nhiệm vụ trên máy cửa trên:</p>
  <ol class="steps recap"><li class="done"><div><b>Xả toàn bộ nước bẩn</b> trong thùng ra ngoài sau mỗi lần giặt/ xả.</div></li><li class="done"><div><b>Kéo cần ly hợp</b> để mâm và lồng cùng quay (chế độ <b>vắt</b>). Ở chế độ giặt thì chỉ mâm quay.</div></li></ol>
  <div class="callout"><span class="ic">🔄</span><div><b class="t">Giặt và vắt khác nhau</b><p>Giặt: động cơ quay <b>hai chiều</b>, chỉ mâm giặt quay → nước xoáy. Vắt: nước đã xả hết, <b>mâm + lồng quay một chiều tốc độ cao</b> → văng nước ra ngoài.</p></div></div>
</section>

<section class="sec" id="s-type" data-toc="2 · Phân loại">
  <div class="sec-n">Phần 2</div><h2>Phân loại van xả</h2>
  <div id="tTabs"></div><article class="panel" id="tPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-lab" data-toc="3 · Thí nghiệm">
  <div class="sec-n">Phần 3</div><h2>🔬 Van xả hút làm việc: hút → giữ</h2>
  <p>Bên trong có <b>2 cuộn dây</b>. Khi mới có điện cả hai cùng hút; khi lõi vào hết hành trình, công tắc K mở ngắt cuộn làm việc, chỉ còn cuộn duy trì giữ.</p>
  <div class="stage"><div id="pSvg" style="padding:6px"></div><div class="controls"><button class="btn pri sm" id="pGo">⚡ Cấp điện</button><button class="btn sm" id="pRs">⏻ Ngắt điện</button></div><div class="verdict" id="pV" style="margin:0 14px 12px"></div></div>
  <h3 style="margin-top:22px">Các bộ phận</h3>
  <div id="pTabs"></div><article class="panel warm" id="pPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">💡</span><div><b class="t">Vì sao cần 2 cuộn?</b><p>Hút lõi sắt cần lực lớn (dòng lớn), nhưng <b>giữ</b> thì chỉ cần lực nhỏ. Dùng cuộn duy trì giúp van <b>không nóng</b> và <b>tiết kiệm điện</b> trong lúc xả/ vắt kéo dài.</p></div></div>
</section>

<section class="sec" id="s-fix" data-toc="4 · Kiểm tra">
  <div class="sec-n">Phần 4</div><h2>Kiểm tra bằng đồng hồ</h2>
  <p>Rút giắc van, đo từng cuộn bằng thang Ω:</p>
  <div class="stage" style="padding:14px"><div class="row"><label>Đo <select id="mw" class="btn sm" style="min-height:36px"><option value="work">cuộn làm việc</option><option value="hold">cuộn duy trì</option></select></label><label>Tình trạng <select id="ms" class="btn sm" style="min-height:36px"><option value="ok">tốt</option><option value="open">đứt</option><option value="short">chạm vòng</option></select></label></div><div id="mG"></div><div class="verdict" id="mV"></div></div>
  <div class="grid2" style="margin-top:14px"><div class="panel" style="margin:0"><h4>Lỗi hay gặp</h4><ul style="margin:6px 0 0;padding-left:20px"><li><b>Nước không xả</b>: cuộn đứt, lõi kẹt, nắp xả dính cặn</li><li><b>Rò rỉ nước</b>: nắp xả không kín (rác, mòn cao su)</li><li><b>Không vắt</b>: không kéo được cần ly hợp</li></ul></div>
    <div class="panel warm" style="margin:0"><h4>Gợi ý</h4><p style="margin:6px 0 0">Thường giá trị cuộn làm việc nhỏ hơn cuộn duy trì. Hãy so sánh với <b>van cùng loại</b> còn tốt, sai số trong khoảng 5 – 10%.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Van xả: xả nước bẩn + kéo cần ly hợp để vắt.</b></div></li>
    <li class="done"><div><b>3 lần lấy nước → 4 lần xả.</b></div></li>
    <li class="done"><div><b>Van xả hút dùng 220 V AC hoặc 200 V DC (qua cầu chỉnh lưu).</b></div></li>
    <li class="done"><div><b>Có 2 cuộn: cuộn làm việc (hút) và cuộn duy trì (giữ).</b></div></li>
    <li class="done"><div><b>Lõi vào hết hành trình → công tắc K mở → ngắt cuộn làm việc.</b></div></li>
    <li class="done"><div><b>Đo từng cuộn bằng thang Ω; đứt → thay van.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/3/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#tTabs', root), Object.entries(TYPES).map(([id, t], i) => ({ id, n: i + 1, name: t[0] })), id => { const t = TYPES[id]; $('#tPanel', root).innerHTML = `<h3>${t[0]}</h3><ul>${t[1].map(x => `<li>${x}</li>`).join('')}</ul><p style="margin:0"><span class="pill ok">${t[2]}</span></p>`; });
    let st = 0, tm;
    const dr = () => { $('#pSvg', root).innerHTML = pullSVG(st); const v = $('#pV', root); v.className = 'verdict ' + (st === 2 ? 'ok' : ''); v.textContent = ['Chưa có điện: van đóng, ly hợp nhả.', 'Cả 2 cuộn hút lõi sắt…', '✓ Lõi vào hết → K mở, cuộn duy trì giữ: nước xả, máy vắt được.'][st]; };
    $('#pGo', root).onclick = () => { clearTimeout(tm); st = 1; dr(); tm = setTimeout(() => { st = 2; dr(); }, 1400); };
    $('#pRs', root).onclick = () => { clearTimeout(tm); st = 0; dr(); }; dr();
    U.tabset($('#pTabs', root), Object.entries(PARTS).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#pPanel', root).innerHTML = `<h3>${PARTS[id][0]}</h3><p style="margin:0">${PARTS[id][1]}</p>`; });
    const w = $('#mw', root), s = $('#ms', root), md = () => { const base = w.value === 'work' ? 2.8 : 3.4; const v = s.value === 'ok' ? base + ' kΩ' : s.value === 'open' ? '∞ (hở)' : '0,3 kΩ'; $('#mG', root).innerHTML = `<div style="text-align:center;font-family:var(--head);font-size:34px;margin:10px 0">${v}</div>`; const r = $('#mV', root); r.className = 'verdict ' + (s.value === 'ok' ? 'ok' : 'bad'); r.innerHTML = s.value === 'ok' ? '✓ Cuộn tốt (so với van cùng loại, sai số 5–10%).' : s.value === 'open' ? '✗ Đứt cuộn → thay van.' : '✗ Chạm vòng → nóng, hút yếu → thay van.'; };
    w.onchange = s.onchange = md; md();
  }

  const flashcards = [
    { f: 'Van xả có mấy nhiệm vụ?', b: '2: xả nước bẩn và <b>kéo cần ly hợp</b> để vắt.', tag: 'Công dụng' },
    { f: 'Mấy lần lấy nước, mấy lần xả?', b: '3 lần lấy nước, <b>4 lần xả</b>.', tag: 'Công dụng' },
    { f: 'Khi giặt, bộ phận nào quay?', b: 'Chỉ <b>mâm</b>, hai chiều.', tag: 'Công dụng' },
    { f: 'Khi vắt, bộ phận nào quay?', b: '<b>Mâm và lồng</b> cùng quay.', tag: 'Công dụng' },
    { f: 'Van xả hút dùng điện nào?', b: '220 V AC hoặc 200 V DC (qua cầu chỉnh lưu).', tag: 'Cơ bản' },
    { f: 'Van xả hút có mấy cuộn?', b: '<b>2</b>: làm việc và duy trì.', tag: 'Cấu tạo' },
    { f: 'Cuộn làm việc làm gì?', b: 'Khỏe, hút lõi sắt vào hết hành trình.', tag: 'Cấu tạo' },
    { f: 'Cuộn duy trì làm gì?', b: 'Dòng nhỏ, giữ lõi sắt ở vị trí kéo.', tag: 'Cấu tạo' },
    { f: 'Công tắc K khi nghỉ?', b: 'Đóng.', tag: 'Cấu tạo' },
    { f: 'Lõi sắt vào hết hành trình thì?', b: 'Tác động mở K, ngắt cuộn làm việc.', tag: 'Nguyên lý' },
    { f: 'Vì sao có cuộn duy trì?', b: 'Giảm dòng, mát, tiết kiệm điện.', tag: 'Nguyên lý' },
    { f: 'Lõi sắt từ nối với gì?', b: 'Lò xo và cơ cấu kéo nắp xả/ cần ly hợp.', tag: 'Cấu tạo' },
    { f: 'Van xả hút luôn ở trạng thái nào khi vắt?', b: 'Trạng thái xả (giữ kéo).', tag: 'Nguyên lý' },
    { f: 'Nước không xả, nguyên nhân?', b: 'Cuộn đứt, lõi kẹt, nắp dính cặn.', tag: 'Hư hỏng' },
    { f: 'Rò nước ở van xả?', b: 'Nắp xả không kín (rác, cao su mòn).', tag: 'Hư hỏng' },
    { f: 'Máy không vắt?', b: 'Van không kéo được cần ly hợp.', tag: 'Hư hỏng' },
    { f: 'Cuộn đo ∞ thì?', b: 'Đứt → thay van.', tag: 'Hư hỏng' },
    { f: 'Cuộn đo thấp bất thường?', b: 'Chạm vòng → thay.', tag: 'Hư hỏng' },
    { f: 'Van xả 2 nấc dùng để?', b: 'Điều khiển hai mức: xả và bật ly hợp.', tag: 'Phân loại' },
    { f: 'Van xả kéo bằng cáp dùng gì?', b: 'Động cơ nhỏ hoặc cơ cấu cáp.', tag: 'Phân loại' },
    { f: 'Quy tắc đo cuộn van?', b: 'So với van cùng loại còn tốt, sai số 5–10%.', tag: 'Kiểm tra' },
    { f: 'Chế độ giặt: động cơ quay thế nào?', b: 'Hai chiều.', tag: 'Công dụng' },
    { f: 'Cầu chỉnh lưu dùng để?', b: 'Đổi 220 V AC sang DC.', tag: 'Cơ bản' },
    { f: 'Tác dụng chính của cần ly hợp?', b: 'Ghép mâm với lồng để vắt.', tag: 'Công dụng' },
    { f: 'Thiết bị nào là phụ tải điện thứ hai (sau van cấp)?', b: '<b>Van xả</b>.', tag: 'Cơ bản' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Van xả có nhiệm vụ?', ['Xả nước bẩn và kéo cần ly hợp', 'Chỉ cấp nước', 'Đun nóng', 'Đo mực nước'], 0, 'Hai nhiệm vụ.'),
    Q('Máy có 3 lần lấy nước thì xả mấy lần?', ['4', '3', '2', '5'], 0, '4 lần.'),
    Q('Chế độ giặt, bộ phận quay là?', ['Mâm', 'Mâm + lồng', 'Lồng', 'Thùng'], 0, 'Tạo nước xoáy.'),
    Q('Chế độ vắt?', ['Mâm và lồng cùng quay', 'Chỉ mâm', 'Chỉ lồng', 'Không quay'], 0, 'Nhờ ly hợp.'),
    Q('Van xả hút dùng điện?', ['220 V AC hoặc 200 V DC', '5 V', '12 V DC', '380 V'], 0, 'Có cầu chỉnh lưu.'),
    Q('Van xả hút có mấy cuộn?', ['2', '1', '3', '4'], 0, 'Làm việc + duy trì.'),
    Q('Cuộn làm việc?', ['Hút lõi sắt vào', 'Chỉ giữ', 'Đo nhiệt', 'Không cần'], 0, 'Dòng lớn.'),
    Q('Cuộn duy trì?', ['Giữ lõi sắt ở vị trí kéo', 'Hút mạnh', 'Cấp nước', 'Làm nóng'], 0, 'Dòng nhỏ.'),
    Q('Công tắc K mở khi?', ['Lõi vào hết hành trình', 'Mất điện', 'Cửa mở', 'Hết nước'], 0, 'Ngắt cuộn làm việc.'),
    Q('Sau khi K mở, còn dòng điện ở?', ['Cuộn duy trì', 'Cuộn làm việc', 'Cả hai', 'Không cuộn nào'], 0, 'Giữ lõi.'),
    Q('Ưu điểm có cuộn duy trì?', ['Tiết kiệm điện, ít nóng', 'Tốn điện', 'Hút mạnh hơn', 'Ồn hơn'], 0, 'Dòng giữ nhỏ.'),
    Q('Nước không xả có thể do?', ['Cuộn đứt, lõi kẹt', 'Lưới lọc sạch', 'Nước nóng', 'Tụ tốt'], 0, 'Hư hỏng van xả.'),
    Q('Máy không vắt, nghi?', ['Van xả không kéo ly hợp', 'Van cấp hỏng', 'Sợi đốt', 'Đèn'], 0, 'Cần ly hợp không gạt.'),
    Q('Cuộn đo ∞ thì?', ['Đứt', 'Tốt', 'Chạm vòng', 'Nóng'], 0, 'Thay van.'),
    Q('Van xả rò nước thường do?', ['Nắp xả không kín', 'Cuộn tốt', 'Điện yếu', 'Lò xo mới'], 0, 'Rác kẹt, cao su mòn.'),
    Q('Cầu chỉnh lưu dùng để?', ['Đổi AC sang DC', 'Đổi DC sang AC', 'Tăng áp', 'Lọc nước'], 0, '220 V → 200 V DC.'),
    Q('Vì sao vắt nước phải xả hết trước?', ['Để lồng nhẹ, vắt khô', 'Cho lồng chạy chậm', 'Cho đỡ điện', 'Không có lý do'], 0, 'Nước nặng làm quá tải.'),
    Q('Van xả 2 nấc?', ['Điều khiển 2 mức xả/ ly hợp', 'Cấp 2 nước', 'Hai cuộn nước', 'Tắt'], 0, 'Phân loại.'),
    Q('Cần ly hợp nối?', ['Mâm với lồng', 'Bơm với motor', 'Bo với van', 'Thùng với vỏ'], 0, 'Để vắt.'),
    Q('Khi giặt, motor quay?', ['Hai chiều', 'Một chiều nhanh', 'Đứng yên', 'Chậm dần'], 0, 'Tạo xoáy nước.'),
    Q('Khi vắt, motor quay?', ['Một chiều tốc độ cao', 'Hai chiều', 'Chậm', 'Dừng'], 0, 'Văng nước.'),
    Q('Van xả hút là loại phụ tải?', ['Điện', 'Cơ', 'Nhiệt', 'Khí'], 0, 'Phụ tải điện.'),
    Q('Cuộn đo thấp bất thường là?', ['Chạm vòng', 'Đứt', 'Tốt', 'Không đo được'], 0, 'Hư hỏng.'),
    Q('Sai số cho phép khi so sánh cuộn với van tốt?', ['5 – 10%', '50%', '0%', '200%'], 0, 'Dung sai.')
  ];
  const sort = {
    title: 'Phân biệt các thành phần',
    buckets: [{ id: 'work', name: 'Cuộn làm việc' }, { id: 'hold', name: 'Cuộn duy trì' }, { id: 'both', name: 'Chung / hư hỏng' }],
    items: [
      { t: 'Dòng điện lớn', b: 'work' }, { t: 'Hút lõi sắt vào hết hành trình', b: 'work' }, { t: 'Bị ngắt khi K mở', b: 'work' },
      { t: 'Dòng điện nhỏ', b: 'hold' }, { t: 'Giữ lõi ở vị trí kéo', b: 'hold' }, { t: 'Có điện suốt lúc xả/vắt', b: 'hold' },
      { t: 'Đứt → đo ∞ → thay van', b: 'both' }, { t: 'Điện 220 V AC hoặc 200 V DC', b: 'both' }, { t: 'Nắp xả không kín → rò nước', b: 'both' }, { t: 'Cần ly hợp không gạt → không vắt', b: 'both' }
    ]
  };
  const order = [
    { title: 'Van xả hút làm việc', intro: 'Khi chuyển sang vắt.', steps: ['Cấp điện cho van', 'Cả 2 cuộn có dòng, sinh từ trường', 'Hút lõi sắt vào', 'Lõi vào hết hành trình, tác động mở K', 'Ngắt cuộn làm việc, giữ bằng cuộn duy trì', 'Nước xả, ly hợp ghép mâm + lồng → vắt'] },
    { title: 'Một chu trình xả', intro: 'Số lần xả.', steps: ['Lấy nước lần 1, giặt', 'Xả lần 1 và vắt', 'Lấy nước lần 2, xả bột', 'Xả lần 2 và vắt', 'Lấy nước lần 3 cùng nước xả mềm', 'Xả lần cuối, vắt khô'] },
    { title: 'Kiểm tra máy không xả', intro: 'Chẩn đoán van xả.', steps: ['Rút điện, kiểm tra ống xả không tắc', 'Tháo giắc van xả', 'Đo điện trở từng cuộn', 'Đứt hoặc chạm: thay van', 'Cuộn tốt: vệ sinh nắp xả, lõi sắt', 'Lắp lại, thử máy'] }
  ];
  DL.register({
    cat: 'may-giat', id: 3, ready: true, title: 'Van xả nước', sub: 'Xả hút, 2 cuộn, ly hợp, vắt', minutes: 25,
    lead: 'Van xả vừa xả nước bẩn vừa kéo cần ly hợp để ghép mâm với lồng khi vắt. Bài này mô phỏng cơ chế hai cuộn dây — làm việc và duy trì — và cách đo kiểm.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
