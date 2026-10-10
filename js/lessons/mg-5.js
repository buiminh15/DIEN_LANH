/* MÁY GIẶT — BÀI 5: ĐỘNG CƠ CỬA TRƯỚC (2-IN-1, VÀNH GÓP) & SỢI ĐỐT (biên soạn từ docs/may_giat/Bai_5.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  /* 5 chân: 1..5; điện trở minh họa (Ω): cuộn giặt (1-2 ... ), cuộn vắt */
  const PAIRS = [['1-2', 5], ['1-3', 5], ['1-4', 10], ['1-5', 10], ['2-3', 10], ['2-4', 15], ['2-5', 15], ['3-4', 15], ['3-5', 15], ['4-5', 20]];

  const COMM = {
    brush: ['Chổi than', 'Thanh than chì tì lên vành góp để dẫn điện vào rôto. <b>Mòn dần</b> theo thời gian → phải thay khi ngắn.'],
    comm: ['Vành góp (cổ góp)', 'Các thanh đồng cách điện, nối với cuộn rôto. Chổi than đảo chiều dòng khi rôto quay → duy trì mô-men.'],
    spd: ['Cảm biến tốc độ', 'Cuộn/ nam châm phát xung tỉ lệ tốc độ, gửi về bo để <b>điều tốc</b> bằng triac.'],
    stator: ['Cuộn stato', 'Cuộn kích từ. Đảo đầu dây stato (so với rôto) → <b>đảo chiều quay</b>.']
  };
  const HEAT = {
    ok: ['Sợi đốt tốt', 'Thang x1 Ω: <b>vài chục Ω</b>, ví dụ 25 Ω (cỡ 2 kW). Thang x10k: <b>≥ 10 MΩ</b> giữa sợi đốt với vỏ.'],
    open: ['Sợi đốt đứt', 'Đo ∞ → nước không nóng → thay sợi đốt.'],
    leak: ['Sợi đốt chạm vỏ', 'Đo vỏ có số (thấp hơn 10 MΩ) → rò điện, nhảy áp-tô-mát → thay.']
  };

  function learn() {
    return `
<section class="sec" id="s-why" data-toc="1 · Giới thiệu">
  <div class="sec-n">Phần 1</div><h2>Động cơ máy giặt cửa trước</h2>
  <p>Máy cửa trước dùng hai kiểu động cơ phổ biến: <b>động cơ 2-in-1</b> (một động cơ có hai chế độ giặt – vắt, 5 chân) và <b>động cơ vành góp</b> (có chổi than, điều tốc rộng). Ngoài ra còn <b>sợi đốt</b> đun nóng nước.</p>
</section>

<section class="sec" id="s-2in1" data-toc="2 · Động cơ 2-in-1">
  <div class="sec-n">Phần 2</div><h2>🔬 Động cơ 2-in-1: 5 chân, 10 phép đo</h2>
  <p>Có <b>5 chân</b> → <b>10 cặp</b> đo. Phân tích: một cuộn cho <b>giặt</b> (tốc độ thấp, nhiều cực), một cuộn cho <b>vắt</b> (tốc độ cao, ít cực). Ba cặp bằng nhau cho biết các cuộn thành phần. Chọn cặp để xem kết quả mẫu:</p>
  <div class="stage" style="padding:14px"><div class="row" id="pairs">${PAIRS.map(p => `<button type="button" class="btn sm" data-p="${p[0]}" aria-pressed="false">${p[0]}</button>`).join('')}</div>
    <div id="pG" style="text-align:center;font-family:var(--head);font-size:34px;margin:12px 0">—</div><div class="verdict" id="pV">Chọn một cặp chân.</div>
    <div class="row" style="margin-top:10px"><button class="btn sm" id="pAll">📋 Hiện bảng 10 phép đo</button></div><div id="pTab"></div></div>
  <div class="callout"><span class="ic">🧪</span><div><b class="t">Mẹo ghi nhớ</b><p>Đo hết 10 cặp rồi so sánh: cặp có điện trở <b>nhỏ nhất</b> là một cuộn đơn, cặp <b>lớn nhất</b> là hai đầu ngoài cùng. Nếu một cặp ra ∞ → cuộn tương ứng đứt.</p></div></div>
</section>

<section class="sec" id="s-comm" data-toc="3 · Vành góp">
  <div class="sec-n">Phần 3</div><h2>Động cơ vành góp (chổi than)</h2>
  <p>Khác với lồng sóc: rôto có <b>cuộn dây</b> và <b>vành góp</b>; dòng điện được dẫn vào qua <b>chổi than</b>. Ưu điểm: <b>điều tốc rất rộng</b> (giặt chậm, vắt nhanh) bằng triac + cảm biến tốc độ, dây ra khoảng <b>6 – 10 dây</b>. Nhược điểm: chổi than mòn, đánh lửa, ồn.</p>
  <div id="cTabs"></div><article class="panel" id="cPanel" aria-live="polite"></article>
  <div class="stage" style="margin-top:14px"><div id="bSvg" style="padding:8px"></div><div class="controls"><label>Độ mòn chổi than <input id="bw" type="range" min="0" max="100" value="10" style="width:180px"></label></div><div class="verdict" id="bV" style="margin:0 14px 12px"></div></div>
</section>

<section class="sec" id="s-heat" data-toc="4 · Sợi đốt">
  <div class="sec-n">Phần 4</div><h2>Sợi đốt (điện trở nung)</h2>
  <p>Công suất <b>1500 – 2500 W</b>, đun nước nóng trong thùng. Đo bằng 2 thang: <b>x1 Ω</b> (thông mạch) và <b>x10k</b> (cách điện với vỏ).</p>
  <div id="hTabs"></div><article class="panel warm" id="hPanel"></article>
  <div class="callout danger"><span class="ic">⚡</span><div><b class="t">Cẩn thận</b><p>Sợi đốt chạm vỏ có thể gây <b>giật điện</b> và nhảy aptomat. Luôn có tiếp địa tốt cho máy.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Cửa trước dùng động cơ 2-in-1 (5 chân) hoặc vành góp.</b></div></li>
    <li class="done"><div><b>5 chân → 10 phép đo; đo hết, so sánh để suy ra cuộn.</b></div></li>
    <li class="done"><div><b>Vành góp: chổi than + cổ góp + cảm biến tốc độ, điều tốc bằng triac.</b></div></li>
    <li class="done"><div><b>Chổi than mòn thì thay; hay đánh lửa, ồn.</b></div></li>
    <li class="done"><div><b>Sợi đốt 1500–2500 W: đo x1 Ω thông, x10k ≥ 10 MΩ với vỏ.</b></div></li>
    <li class="done"><div><b>Sợi đốt chạm vỏ → nguy hiểm, thay.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/5/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function brushSVG(w) {
    const h = 56 - w * .4;
    return `<svg viewBox="0 0 420 170"><circle cx="210" cy="95" r="52" fill="var(--warm)" stroke="var(--ink)" stroke-width="3"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${210 + Math.cos(a) * 36} ${95 + Math.sin(a) * 36}L${210 + Math.cos(a) * 52} ${95 + Math.sin(a) * 52}" stroke="var(--ink)" stroke-width="3"/>`; }).join('')}
      <rect x="150" y="${20 + (56 - h)}" width="26" height="${h}" fill="var(--ink)"/><rect x="244" y="${20 + (56 - h)}" width="26" height="${h}" fill="var(--ink)"/>
      <text class="fl" x="163" y="14" text-anchor="middle">chổi than</text>
      ${w > 70 ? '<path d="M170 76l6-8l2 8l8-6" stroke="var(--hot)" stroke-width="3" fill="none"/><path d="M250 76l-6-8l-2 8l-8-6" stroke="var(--hot)" stroke-width="3" fill="none"/>' : ''}
      <text class="fl" x="210" y="162" text-anchor="middle">vành góp</text></svg>`;
  }

  function mount(root) {
    const vals = Object.fromEntries(PAIRS);
    $$('#pairs [data-p]', root).forEach(b => b.onclick = () => { $$('#pairs [data-p]', root).forEach(x => x.setAttribute('aria-pressed', x === b)); const v = vals[b.dataset.p]; $('#pG', root).textContent = v + ' Ω'; const r = $('#pV', root); r.className = 'verdict ok'; r.textContent = `Cặp ${b.dataset.p}: ${v} Ω (số minh họa; đối chiếu với các cặp còn lại).`; });
    $('#pAll', root).onclick = () => { $('#pTab', root).innerHTML = `<table style="margin-top:10px"><tr><th>Cặp</th><th>Ω</th><th>Cặp</th><th>Ω</th></tr>${[0, 1, 2, 3, 4].map(i => `<tr><td>${PAIRS[i][0]}</td><td>${PAIRS[i][1]}</td><td>${PAIRS[i + 5][0]}</td><td>${PAIRS[i + 5][1]}</td></tr>`).join('')}</table>`; };
    U.tabset($('#cTabs', root), Object.entries(COMM).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#cPanel', root).innerHTML = `<h3>${COMM[id][0]}</h3><p style="margin:0">${COMM[id][1]}</p>`; });
    const bw = $('#bw', root), bd = () => { const w = +bw.value; $('#bSvg', root).innerHTML = brushSVG(w); const v = $('#bV', root); v.className = 'verdict ' + (w > 70 ? 'bad' : 'ok'); v.textContent = w > 70 ? '✗ Chổi than mòn ngắn: tiếp xúc kém, đánh lửa, ồn, mất lực → THAY chổi than.' : '✓ Chổi than còn đủ dài.'; };
    bw.oninput = bd; bd();
    U.tabset($('#hTabs', root), Object.entries(HEAT).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#hPanel', root).innerHTML = `<h3>${HEAT[id][0]}</h3><p style="margin:0">${HEAT[id][1]}</p>`; });
  }

  const flashcards = [
    { f: 'Động cơ 2-in-1 có mấy chân?', b: '<b>5 chân</b> → 10 phép đo.', tag: '2-in-1' },
    { f: 'Vì sao có 10 phép đo?', b: 'Tổ hợp 2 trong 5 chân: C(5,2) = 10.', tag: '2-in-1' },
    { f: 'Động cơ 2-in-1 có hai cuộn cho?', b: 'Giặt (tốc độ thấp) và vắt (tốc độ cao).', tag: '2-in-1' },
    { f: 'Cặp điện trở lớn nhất?', b: 'Hai đầu ngoài cùng.', tag: '2-in-1' },
    { f: 'Cặp đo ∞ nghĩa là?', b: 'Cuộn tương ứng đứt.', tag: '2-in-1' },
    { f: 'Động cơ vành góp có gì?', b: 'Chổi than, vành góp, cảm biến tốc độ.', tag: 'Vành góp' },
    { f: 'Số dây của động cơ vành góp?', b: 'Khoảng 6 – 10 dây.', tag: 'Vành góp' },
    { f: 'Điều tốc bằng gì?', b: 'Triac + cảm biến tốc độ.', tag: 'Vành góp' },
    { f: 'Chổi than làm gì?', b: 'Dẫn điện vào rôto qua vành góp.', tag: 'Vành góp' },
    { f: 'Chổi than mòn ngắn thì?', b: 'Thay.', tag: 'Vành góp' },
    { f: 'Biểu hiện chổi than mòn?', b: 'Đánh lửa, ồn, mất lực.', tag: 'Vành góp' },
    { f: 'Cảm biến tốc độ làm gì?', b: 'Gửi xung về bo để điều tốc.', tag: 'Vành góp' },
    { f: 'Đảo chiều quay vành góp?', b: 'Đảo đầu dây stato so với rôto.', tag: 'Vành góp' },
    { f: 'Ưu điểm vành góp?', b: 'Điều tốc rộng.', tag: 'Vành góp' },
    { f: 'Nhược điểm vành góp?', b: 'Chổi than mòn, ồn, đánh lửa.', tag: 'Vành góp' },
    { f: 'Công suất sợi đốt?', b: '1500 – 2500 W.', tag: 'Sợi đốt' },
    { f: 'Đo sợi đốt thang nào?', b: 'x1 Ω và x10k.', tag: 'Sợi đốt' },
    { f: 'Sợi đốt tốt đo x10k với vỏ?', b: '≥ 10 MΩ.', tag: 'Sợi đốt' },
    { f: 'Sợi đốt đứt đo?', b: '∞.', tag: 'Sợi đốt' },
    { f: 'Sợi đốt chạm vỏ?', b: 'Rò điện, nhảy aptomat → thay.', tag: 'Sợi đốt' },
    { f: 'Sợi đốt có nhiệm vụ?', b: 'Đun nóng nước trong thùng.', tag: 'Sợi đốt' },
    { f: 'Vì sao cần tiếp địa?', b: 'An toàn khi rò điện.', tag: 'An toàn' },
    { f: 'Cửa trước tốn điện chủ yếu do?', b: 'Sợi đốt công suất lớn.', tag: 'Sợi đốt' },
    { f: 'Động cơ lồng sóc khác vành góp ở đâu?', b: 'Không có chổi than, điều tốc hạn chế.', tag: 'So sánh' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Động cơ 2-in-1 có mấy chân?', ['5', '3', '2', '10'], 0, '10 phép đo.'),
    Q('5 chân có bao nhiêu cặp đo?', ['10', '5', '15', '20'], 0, 'Tổ hợp.'),
    Q('Động cơ 2-in-1 phục vụ?', ['Giặt và vắt', 'Chỉ giặt', 'Chỉ sấy', 'Cấp nước'], 0, 'Hai cuộn.'),
    Q('Cặp đo ∞ cho thấy?', ['Cuộn đứt', 'Cuộn tốt', 'Chạm vỏ', 'Mòn'], 0, 'Hở mạch.'),
    Q('Động cơ vành góp có?', ['Chổi than', 'Lồng sóc thuần', 'Nam châm', 'Không dây'], 0, 'Nhưng mòn.'),
    Q('Điều tốc động cơ vành góp dùng?', ['Triac', 'Tụ', 'Phao', 'Bơm'], 0, 'Với cảm biến tốc độ.'),
    Q('Chổi than mòn, xử lý?', ['Thay', 'Bôi mỡ', 'Bỏ', 'Hạ điện áp'], 0, 'Tiêu hao.'),
    Q('Dấu hiệu chổi than mòn?', ['Đánh lửa, ồn', 'Quay êm', 'Giặt sạch', 'Không có'], 0, 'Tiếp xúc kém.'),
    Q('Cảm biến tốc độ gửi tín hiệu về?', ['Bo mạch', 'Bơm', 'Van', 'Sợi đốt'], 0, 'Điều tốc.'),
    Q('Vành góp có bao nhiêu dây ra khoảng?', ['6 – 10', '2', '1', '100'], 0, 'Nhiều dây.'),
    Q('Sợi đốt công suất?', ['1500 – 2500 W', '5 W', '50 W', '100 kW'], 0, 'Đun nước.'),
    Q('Sợi đốt tốt đo x1 Ω?', ['Vài chục Ω', '∞', '0 Ω', 'MΩ'], 0, 'Thông mạch.'),
    Q('Sợi đốt tốt đo x10k với vỏ?', ['≥ 10 MΩ', '0', '50 Ω', 'Vài kΩ'], 0, 'Cách điện.'),
    Q('Sợi đốt đo ∞ thang x1?', ['Đứt', 'Tốt', 'Chạm vỏ', 'Mới'], 0, 'Thay.'),
    Q('Sợi đốt chạm vỏ gây?', ['Nhảy aptomat, giật điện', 'Nóng nhanh', 'Tiết kiệm', 'Không sao'], 0, 'Nguy hiểm.'),
    Q('Cửa trước tốn điện do?', ['Sợi đốt công suất lớn', 'Van cấp', 'Phao', 'Đèn'], 0, '1700–2500 W.'),
    Q('Vì sao cần tiếp địa?', ['An toàn khi rò', 'Tăng áp', 'Đẹp', 'Giảm ồn'], 0, 'Chống giật.'),
    Q('Đảo chiều quay vành góp?', ['Đảo đầu dây stato', 'Đổi chổi', 'Đổi dây curoa', 'Không đảo được'], 0, 'Nguyên lý.'),
    Q('Ưu điểm động cơ vành góp?', ['Điều tốc rộng', 'Không mòn', 'Rẻ', 'Không ồn'], 0, 'Đổi lại chổi than.'),
    Q('Cặp nào điện trở lớn nhất?', ['Hai đầu ngoài cùng', 'Hai chân sát', 'Bất kỳ', 'Bằng nhau'], 0, 'Nối tiếp.'),
    Q('Điều tốc cần cảm biến vì?', ['Phản hồi tốc độ', 'Đo nước', 'Đo nhiệt', 'Đo dòng'], 0, 'Vòng kín.'),
    Q('Thang đo cách điện sợi đốt?', ['x10k', 'x1', 'DCV', 'ACA'], 0, 'MΩ.'),
    Q('Lồng sóc khác vành góp?', ['Không chổi than', 'Có chổi than', 'Có sợi đốt', 'Có bơm'], 0, 'Bền hơn.'),
    Q('2-in-1 điều khiển tốc độ bằng?', ['Chuyển cuộn giặt/vắt', 'Chổi than', 'Triac', 'Dây curoa'], 0, 'Số cực khác nhau.')
  ];
  const sort = {
    title: 'Phân loại đặc điểm',
    buckets: [{ id: 'two', name: 'Động cơ 2-in-1' }, { id: 'com', name: 'Động cơ vành góp' }, { id: 'heat', name: 'Sợi đốt' }],
    items: [
      { t: '5 chân, 10 phép đo', b: 'two' }, { t: 'Cuộn giặt + cuộn vắt', b: 'two' }, { t: 'Không có chổi than', b: 'two' },
      { t: 'Chổi than mòn → thay', b: 'com' }, { t: 'Cảm biến tốc độ + triac', b: 'com' }, { t: '6 – 10 dây', b: 'com' }, { t: 'Đánh lửa, ồn', b: 'com' },
      { t: '1500 – 2500 W', b: 'heat' }, { t: 'x10k ≥ 10 MΩ với vỏ', b: 'heat' }, { t: 'Đứt đo ∞', b: 'heat' }, { t: 'Chạm vỏ → nhảy aptomat', b: 'heat' }
    ]
  };
  const order = [
    { title: 'Kiểm tra động cơ 2-in-1', intro: 'Quy trình đo.', steps: ['Rút điện, tháo giắc động cơ', 'Đặt thang Ω', 'Đo lần lượt 10 cặp chân', 'Ghi và so sánh các giá trị', 'Cặp ∞ → cuộn đứt', 'Kết luận cuộn giặt/ vắt tốt hay hỏng'] },
    { title: 'Thay chổi than', intro: 'Máy vành góp đánh lửa.', steps: ['Rút điện', 'Tháo nắp chổi than', 'Lấy chổi cũ ra, đo độ dài', 'Mòn ngắn → thay chổi mới cùng loại', 'Vệ sinh vành góp', 'Lắp lại, chạy thử'] },
    { title: 'Kiểm tra sợi đốt', intro: 'Hai phép đo.', steps: ['Rút điện, tháo dây sợi đốt', 'Thang x1 Ω: đo hai đầu', 'Đo vài chục Ω → thông', 'Thang x10k: đo từng đầu với vỏ', '≥ 10 MΩ → cách điện tốt', 'Lắp lại, thử nóng'] }
  ];
  DL.register({
    cat: 'may-giat', id: 5, ready: true, title: 'Động cơ cửa trước & sợi đốt', sub: '2-in-1 (5 chân), vành góp, sợi đốt', minutes: 30,
    lead: 'Máy cửa trước dùng động cơ 2-in-1 hoặc vành góp và sợi đốt công suất lớn. Học cách đo 10 cặp chân, nhận biết chổi than mòn và kiểm tra sợi đốt.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
