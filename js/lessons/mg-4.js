/* MÁY GIẶT — BÀI 4: BƠM XẢ & ĐỘNG CƠ LỒNG SÓC CỬA TRÊN (biên soạn từ docs/may_giat/Bai_4.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const PUMP = {
    imp: ['Cánh bơm (cánh quạt)', 'Quay làm nước bị <b>ly tâm</b> văng ra cửa xả. Rác, tóc, xơ vải quấn vào cánh gây kẹt, ồn.'],
    rotor: ['Rôto nam châm', 'Rôto vĩnh cửu gắn cánh bơm, quay theo từ trường xoay chiều của stato.'],
    stator: ['Stato (cuộn dây)', 'Cuộn dây đồng bộ chạy <b>220 V AC</b>, điện trở khoảng <b>vài chục đến ~ 150 Ω</b> (thông thường).'],
    inlet: ['Cửa hút – cửa xả', 'Cửa hút nối thùng giặt; cửa xả nối ống thoát. Phải kín nước.']
  };

  const MOT = {
    run: ['Cuộn chạy (làm việc)', 'Dây to, ít vòng → điện trở <b>nhỏ</b>. Làm việc liên tục.'],
    start: ['Cuộn đề (khởi động)', 'Dây nhỏ, nhiều vòng → điện trở <b>lớn hơn</b> (trong máy giặt thường nối tụ). Máy giặt dùng 2 cuộn <b>giống nhau</b> nên đổi vai trò cho nhau.'],
    cap: ['Tụ điện', 'Tạo lệch pha giữa hai cuộn để rôto quay. <b>Tụ hỏng</b> → động cơ chỉ “gầm”, không quay.'],
    rotor: ['Rôto lồng sóc', 'Các thanh nhôm nối vòng ngắn mạch như “lồng sóc”. Không có chổi than nên bền.']
  };

  function motorSVG(dir) {
    const cw = dir === 1, a = cw ? 'M70 50a30 30 0 1 1-18 30' : 'M70 50a30 30 0 1 0-18 30';
    return `<svg viewBox="0 0 440 240" role="img" aria-label="Động cơ giặt quay ${dir === 0 ? 'dừng' : cw ? 'thuận' : 'ngược'}">
      <rect x="150" y="50" width="130" height="110" rx="14" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="215" cy="105" r="40" fill="var(--cold-tint)" stroke="var(--ink)" stroke-width="2.5"/>
      ${dir ? `<g class="fan" style="transform-origin:215px 105px;animation-direction:${cw ? 'normal' : 'reverse'}"><path d="M215 105l20-28M215 105l-20 28M215 105l-28-20M215 105l28 20" stroke="var(--ink)" stroke-width="5"/></g>` : '<circle cx="215" cy="105" r="6" fill="var(--ink)"/>'}
      <text class="fl" x="215" y="180" text-anchor="middle">rôto lồng sóc</text>
      <circle cx="60" cy="60" r="8" fill="var(--hot)"/><text class="fl" x="60" y="88" text-anchor="middle">nguồn L</text>
      <path d="M68 60H150" stroke="${dir === 1 ? 'var(--ok)' : 'var(--line)'}" stroke-width="6"/>
      <path d="M68 140H150" stroke="${dir === -1 ? 'var(--ok)' : 'var(--line)'}" stroke-width="6"/>
      <text class="fl" x="109" y="52" text-anchor="middle">→ cuộn A chạy</text><text class="fl" x="109" y="132" text-anchor="middle">→ cuộn B chạy</text>
      <text class="sub" x="330" y="110" style="fill:${dir ? 'var(--ok)' : 'var(--muted)'}">${dir === 0 ? 'DỪNG' : dir === 1 ? 'QUAY THUẬN ↻' : 'QUAY NGƯỢC ↺'}</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-pump" data-toc="1 · Bơm xả">
  <div class="sec-n">Phần 1</div><h2>Bơm xả nước (máy cửa trước)</h2>
  <p>Máy cửa trước dùng <b>bơm xả</b> thay van xả hút: bơm <b>chủ động hút nước ra</b> nên xả được cả khi máy đặt thấp hơn cửa thoát. Bơm gồm <b>cánh bơm</b>, <b>rôto nam châm vĩnh cửu</b> và <b>stato</b>.</p>
  <div id="pTabs"></div><article class="panel" id="pPanel" aria-live="polite"></article>
  <div class="grid2" style="margin-top:14px"><div class="panel warm" style="margin:0"><h4>Đo kiểm</h4><p style="margin:6px 0 0">Đo cuộn stato bằng thang Ω; <b>∞</b> là đứt. Giá trị thông thường là vài chục ôm, không chạm vỏ. Thử bằng tay xoay cánh bơm phải nhẹ.</p></div>
    <div class="panel" style="margin:0;border-left-color:var(--bad)"><h4>Hư hỏng thường gặp</h4><ul style="margin:6px 0 0;padding-left:20px"><li>Nước không xả: cánh bơm kẹt tóc, xơ, cuộn đứt</li><li>Bơm kêu to: cánh vỡ, vật lạ lọt vào</li><li>Rò nước: ron mòn</li></ul></div></div>
</section>

<section class="sec" id="s-mot" data-toc="2 · Động cơ lồng sóc">
  <div class="sec-n">Phần 2</div><h2>Động cơ lồng sóc 1 pha (máy giặt cửa trên)</h2>
  <p>Động cơ 1 pha có <b>2 cuộn dây giống nhau</b> (cuộn chạy và cuộn đề đổi vai trò cho nhau) và một tụ. Cuộn nào được nối <b>thẳng nguồn</b> thì là cuộn chạy, cuộn còn lại nối qua <b>tụ</b> là cuộn đề. <b>Đảo vị trí</b> hai cuộn → đảo chiều quay. Đó là lý do ở chế độ giặt máy quay luân phiên hai chiều.</p>
  <div class="stage"><div id="mSvg" style="padding:6px"></div><div class="controls"><button class="btn pri sm" id="m1">↻ Cuộn A chạy (thuận)</button><button class="btn sm" id="m2">↺ Cuộn B chạy (ngược)</button><button class="btn sm" id="m0">■ Dừng</button><button class="btn sm" id="mAuto" aria-pressed="false">🔁 Tự đảo</button></div><div class="verdict" id="mV" style="margin:0 14px 12px"></div></div>
  <div id="mTabs"></div><article class="panel warm" id="mPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-find" data-toc="3 · Nhận biết chân">
  <div class="sec-n">Phần 3</div><h2>🔬 Nhận biết 3 chân động cơ</h2>
  <p>Động cơ ra 3 dây: <b>chung (C)</b> và hai đầu A, B. Đo 3 cặp: C–A, C–B, A–B. Hai cuộn bằng nhau nên <b>C–A = C–B</b>, còn A–B (hai cuộn nối tiếp) <b>lớn gấp đôi</b>.</p>
  <div class="stage" style="padding:14px"><div class="row"><label>Cặp đo <select id="pr" class="btn sm" style="min-height:36px"><option value="CA">C – A</option><option value="CB">C – B</option><option value="AB">A – B</option></select></label><label>Tình trạng <select id="ps" class="btn sm" style="min-height:36px"><option value="ok">tốt</option><option value="open">đứt cuộn A</option><option value="short">chạm vỏ</option></select></label></div><div id="pG"></div><div class="verdict" id="pV"></div></div>
  <div class="callout"><span class="ic">⚙️</span><div><b class="t">Chạy thử</b><p>Nối tụ giữa 2 đầu A, B và cấp điện vào C và một đầu: đổi đầu cấp điện sẽ đổi chiều quay. Nếu động cơ gầm mà không quay: kiểm tra <b>tụ</b> trước.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Bơm xả gồm cánh, rôto nam châm, stato; chạy 220 V AC.</b></div></li>
    <li class="done"><div><b>Bơm kẹt do tóc, xơ vải; cuộn đo ∞ là đứt.</b></div></li>
    <li class="done"><div><b>Động cơ lồng sóc: 2 cuộn giống nhau + tụ.</b></div></li>
    <li class="done"><div><b>Đổi cuộn chạy/ đề cho nhau → đảo chiều quay.</b></div></li>
    <li class="done"><div><b>3 chân: C–A = C–B, A–B = gấp đôi.</b></div></li>
    <li class="done"><div><b>Tụ hỏng → động cơ gầm, không quay.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/4/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#pTabs', root), Object.entries(PUMP).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#pPanel', root).innerHTML = `<h3>${PUMP[id][0]}</h3><p style="margin:0">${PUMP[id][1]}</p>`; });
    U.tabset($('#mTabs', root), Object.entries(MOT).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#mPanel', root).innerHTML = `<h3>${MOT[id][0]}</h3><p style="margin:0">${MOT[id][1]}</p>`; });
    let dir = 0, tm;
    const dr = () => { $('#mSvg', root).innerHTML = motorSVG(dir); const v = $('#mV', root); v.className = 'verdict ' + (dir ? 'ok' : ''); v.textContent = dir === 0 ? 'Động cơ dừng.' : dir === 1 ? 'Cuộn A nối thẳng nguồn (chạy), B qua tụ (đề) → quay thuận.' : 'Cuộn B nối thẳng nguồn, A qua tụ → quay ngược.'; };
    const stopAuto = () => { clearInterval(tm); tm = null; $('#mAuto', root).setAttribute('aria-pressed', false); };
    $('#m1', root).onclick = () => { stopAuto(); dir = 1; dr(); };
    $('#m2', root).onclick = () => { stopAuto(); dir = -1; dr(); };
    $('#m0', root).onclick = () => { stopAuto(); dir = 0; dr(); };
    $('#mAuto', root).onclick = () => { if (tm) { stopAuto(); return; } $('#mAuto', root).setAttribute('aria-pressed', true); dir = 1; dr(); tm = setInterval(() => { if (!document.body.contains($('#mSvg', root))) { clearInterval(tm); return; } dir = -dir; dr(); }, 1500); };
    dr();
    const pr = $('#pr', root), ps = $('#ps', root), pd = () => { const R = 2.4; let v, ok = true, msg; const k = pr.value, s = ps.value;
      if (s === 'ok') { v = (k === 'AB' ? R * 2 : R).toFixed(1) + ' Ω'; msg = k === 'AB' ? '✓ A–B = tổng 2 cuộn (gấp đôi).' : '✓ Hai cuộn bằng nhau: C–A = C–B.'; }
      else if (s === 'open') { if (k === 'CB') { v = R.toFixed(1) + ' Ω'; msg = 'Cuộn B còn tốt.'; } else { v = '∞ (hở)'; ok = false; msg = '✗ Cuộn A đứt → động cơ hỏng, thay/ quấn lại.'; } }
      else { v = '0 Ω với vỏ'; ok = false; msg = '✗ Chạm vỏ → rò điện nguy hiểm, thay động cơ.'; }
      $('#pG', root).innerHTML = `<div style="text-align:center;font-family:var(--head);font-size:34px;margin:10px 0">${v}</div>`; const r = $('#pV', root); r.className = 'verdict ' + (ok ? 'ok' : 'bad'); r.innerHTML = msg; };
    pr.onchange = ps.onchange = pd; pd();
  }

  const flashcards = [
    { f: 'Máy cửa trước xả nước bằng gì?', b: '<b>Bơm xả</b> chủ động hút nước ra.', tag: 'Bơm' },
    { f: 'Bơm xả gồm?', b: 'Cánh bơm, rôto nam châm, stato.', tag: 'Bơm' },
    { f: 'Điện cấp cho bơm?', b: '220 V AC.', tag: 'Bơm' },
    { f: 'Bơm xả không xả nước, nguyên nhân?', b: 'Cánh kẹt tóc/ xơ, cuộn đứt.', tag: 'Bơm' },
    { f: 'Bơm kêu to do?', b: 'Cánh vỡ, vật lạ lọt vào.', tag: 'Bơm' },
    { f: 'Đo cuộn bơm đo ∞?', b: 'Đứt cuộn → thay.', tag: 'Bơm' },
    { f: 'Động cơ cửa trên là loại gì?', b: 'Động cơ 1 pha lồng sóc.', tag: 'Động cơ' },
    { f: 'Hai cuộn của động cơ giặt như thế nào?', b: '<b>Giống nhau</b> (đổi vai trò chạy/ đề).', tag: 'Động cơ' },
    { f: 'Làm sao đảo chiều quay?', b: 'Đổi vị trí cuộn nối thẳng nguồn và cuộn nối tụ.', tag: 'Động cơ' },
    { f: 'Vì sao khi giặt động cơ quay hai chiều?', b: 'Tạo nước xoáy luân phiên, giặt sạch, chống quấn đồ.', tag: 'Động cơ' },
    { f: 'Tụ trong động cơ giặt dùng để?', b: 'Lệch pha để tạo từ trường quay.', tag: 'Động cơ' },
    { f: 'Tụ hỏng → hiện tượng?', b: 'Động cơ gầm, không quay.', tag: 'Hư hỏng' },
    { f: 'Rôto lồng sóc có chổi than không?', b: 'Không → bền.', tag: 'Động cơ' },
    { f: 'Động cơ có mấy dây ra?', b: '3 dây: chung C, hai đầu A, B.', tag: 'Nhận biết' },
    { f: 'Quy luật 3 cặp chân?', b: 'C–A = C–B; A–B gấp đôi.', tag: 'Nhận biết' },
    { f: 'Cặp nào điện trở lớn nhất?', b: 'A–B (hai cuộn nối tiếp).', tag: 'Nhận biết' },
    { f: 'Chạm vỏ động cơ?', b: 'Rò điện nguy hiểm, thay.', tag: 'Hư hỏng' },
    { f: 'Cuộn đứt đo?', b: '∞.', tag: 'Hư hỏng' },
    { f: 'Cách chạy thử động cơ?', b: 'Nối tụ giữa A–B, cấp điện vào C và một đầu.', tag: 'Kiểm tra' },
    { f: 'Đổi đầu cấp điện thì?', b: 'Đổi chiều quay.', tag: 'Động cơ' },
    { f: 'Cuộn chạy là cuộn?', b: 'Nối thẳng nguồn.', tag: 'Động cơ' },
    { f: 'Cuộn đề là cuộn?', b: 'Nối qua tụ.', tag: 'Động cơ' },
    { f: 'Động cơ truyền động qua?', b: 'Dây curoa sang ly hợp.', tag: 'Động cơ' },
    { f: 'Thiết bị đo cuộn?', b: 'Đồng hồ vạn năng thang Ω.', tag: 'Kiểm tra' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Máy cửa trước xả bằng?', ['Bơm xả', 'Van xả hút', 'Trọng lực', 'Van cấp'], 0, 'Chủ động.'),
    Q('Rôto bơm xả là?', ['Nam châm vĩnh cửu', 'Lồng sóc', 'Cuộn dây', 'Vành góp'], 0, 'Đồng bộ.'),
    Q('Điện cấp cho bơm xả?', ['220 V AC', '12 V', '5 V', '380 V'], 0, 'Điện lưới.'),
    Q('Bơm không xả do?', ['Kẹt tóc, xơ', 'Tụ tốt', 'Nước sạch', 'Quá mát'], 0, 'Cánh bị quấn.'),
    Q('Cuộn bơm đo ∞ thì?', ['Đứt', 'Tốt', 'Chạm vỏ', 'Mới'], 0, 'Thay bơm.'),
    Q('Động cơ máy giặt cửa trên là?', ['1 pha lồng sóc', '3 pha', 'Vành góp', 'Bước'], 0, 'Đơn giản.'),
    Q('Hai cuộn của động cơ giặt?', ['Giống nhau', 'Khác hẳn', 'Chỉ 1 cuộn', 'Không có'], 0, 'Đổi vai trò.'),
    Q('Đảo chiều quay bằng?', ['Đổi cuộn chạy và đề', 'Đổi chổi than', 'Đổi tụ', 'Quay tay'], 0, 'Nguyên lý.'),
    Q('Tụ hỏng gây?', ['Gầm không quay', 'Quay nhanh', 'Quay ngược', 'Không ảnh hưởng'], 0, 'Thiếu lệch pha.'),
    Q('Rôto lồng sóc?', ['Không chổi than', 'Có chổi than', 'Có nam châm', 'Có cảm biến'], 0, 'Bền.'),
    Q('Động cơ có mấy dây ra?', ['3', '2', '5', '10'], 0, 'C, A, B.'),
    Q('Cặp có điện trở lớn nhất?', ['A – B', 'C – A', 'C – B', 'Bằng nhau'], 0, 'Hai cuộn nối tiếp.'),
    Q('C–A so với C–B?', ['Bằng nhau', 'Gấp đôi', 'Gấp ba', 'Khác nhiều'], 0, 'Cuộn giống nhau.'),
    Q('A–B so với C–A?', ['Gấp đôi', 'Bằng', 'Một nửa', 'Bằng 0'], 0, 'Nối tiếp.'),
    Q('Chạm vỏ?', ['Nguy hiểm → thay', 'Bình thường', 'Tốt', 'Ít ảnh hưởng'], 0, 'Rò điện.'),
    Q('Cuộn chạy là cuộn?', ['Nối thẳng nguồn', 'Nối qua tụ', 'Đứt', 'Chạm vỏ'], 0, 'Làm việc.'),
    Q('Cuộn đề là cuộn?', ['Nối qua tụ', 'Nối thẳng', 'Chạm vỏ', 'Không dùng'], 0, 'Khởi động.'),
    Q('Khi giặt, motor quay?', ['Hai chiều luân phiên', 'Một chiều', 'Đứng', 'Chậm'], 0, 'Tạo xoáy.'),
    Q('Bơm xả bị tắc thường do?', ['Tóc, xơ, vật lạ', 'Điện cao', 'Tụ', 'Lò xo'], 0, 'Cần vệ sinh.'),
    Q('Đồng hồ vạn năng đo cuộn để đặt thang?', ['Ω', 'V~', 'A', 'Hz'], 0, 'Điện trở.'),
    Q('Đổi đầu cấp điện cho cuộn thì?', ['Đảo chiều quay', 'Dừng', 'Cháy', 'Không đổi'], 0, 'Đổi vai trò.'),
    Q('Rôto bơm quay theo?', ['Từ trường stato', 'Dây curoa', 'Tay quay', 'Trọng lực'], 0, 'Đồng bộ.'),
    Q('Bơm kêu to do?', ['Vật lạ lọt vào', 'Điện thấp', 'Nước sạch', 'Cuộn tốt'], 0, 'Va đập cánh.'),
    Q('Tại sao cửa trước dùng bơm?', ['Chủ động xả, đặt thấp vẫn xả', 'Rẻ hơn', 'Ít điện hơn', 'Dễ sửa'], 0, 'Bơm đẩy nước đi.')
  ];
  const sort = {
    title: 'Phân loại thiết bị',
    buckets: [{ id: 'pump', name: 'Bơm xả' }, { id: 'mot', name: 'Động cơ lồng sóc' }, { id: 'bad', name: 'Hư hỏng' }],
    items: [
      { t: 'Cánh bơm', b: 'pump' }, { t: 'Rôto nam châm vĩnh cửu', b: 'pump' }, { t: 'Cửa hút và cửa xả', b: 'pump' },
      { t: '2 cuộn giống nhau + tụ', b: 'mot' }, { t: 'Đổi cuộn → đổi chiều quay', b: 'mot' }, { t: 'Rôto thanh nhôm lồng sóc', b: 'mot' }, { t: '3 dây C, A, B', b: 'mot' },
      { t: 'Kẹt tóc → không xả', b: 'bad' }, { t: 'Tụ hỏng → gầm không quay', b: 'bad' }, { t: 'Cuộn đo ∞', b: 'bad' }, { t: 'Chạm vỏ', b: 'bad' }
    ]
  };
  const order = [
    { title: 'Đảo chiều quay', intro: 'Chu trình giặt luân phiên.', steps: ['Cấp điện cuộn A thẳng nguồn', 'Cuộn B qua tụ, động cơ quay thuận', 'Dừng một nhịp ngắn', 'Đổi: cuộn B thẳng nguồn', 'Cuộn A qua tụ, động cơ quay ngược', 'Lặp lại luân phiên'] },
    { title: 'Nhận biết 3 chân', intro: 'Quy trình đo.', steps: ['Rút động cơ khỏi nguồn', 'Đo cả 3 cặp bằng thang Ω', 'Tìm cặp lớn nhất → đó là A và B', 'Chân còn lại là C', 'Xác nhận C–A ≈ C–B', 'Ghi nhãn các dây'] },
    { title: 'Bơm không xả nước', intro: 'Chẩn đoán.', steps: ['Rút điện, kiểm tra ống xả không gập', 'Tháo bơm, vệ sinh cánh', 'Xoay cánh bằng tay thử', 'Đo điện trở cuộn stato', 'Đứt → thay bơm', 'Lắp lại, thử xả'] }
  ];
  DL.register({
    cat: 'may-giat', id: 4, ready: true, title: 'Bơm xả & động cơ lồng sóc', sub: 'Máy cửa trên, đảo chiều quay, nhận biết 3 chân', minutes: 28,
    lead: 'Bơm xả của máy cửa trước và động cơ 1 pha lồng sóc của máy cửa trên. Bạn sẽ mô phỏng việc đảo chiều quay bằng cách đổi cuộn chạy–đề và luyện nhận biết 3 chân bằng phép đo.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
