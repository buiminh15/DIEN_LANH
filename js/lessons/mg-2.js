/* MÁY GIẶT — BÀI 2: VAN CẤP NƯỚC (biên soạn từ docs/may_giat/Bai_2.md) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const PARTS = {
    coil: ['Cuộn dây điện từ', 'Có điện → sinh từ trường, <b>hút lõi sắt</b> lên, mở lỗ thoát nhỏ. Điện áp 220 V AC (cuộn dây điện trở ~ 3 – 4 kΩ).'],
    core: ['Lõi sắt + lò xo', 'Lõi sắt bịt <b>lỗ thoát</b>. Mất điện, lò xo đẩy lõi sắt xuống bịt kín lỗ.'],
    memb: ['Màng cao su', 'Ngăn giữa <b>khoang khống chế</b> (trên) và cửa nước ra (dưới). Màng có <b>lỗ tăng áp</b> nhỏ cho nước từ nguồn lọt lên khoang trên.'],
    chamber: ['Khoang khống chế', 'Nước chứa ở trên màng. Áp suất trên màng <b>lớn hơn</b> (vì diện tích lớn hơn) nên ép chặt màng, van đóng.'],
    filter: ['Lưới lọc đầu vào', 'Giữ cặn bẩn. Bẩn, tắc → nước chảy yếu hoặc van đóng không kín.']
  };

  function valveSVG(on) {
    const w = on ? 'var(--cold)' : 'var(--cold-l)', mY = on ? 76 : 100;
    return `<svg viewBox="0 0 440 250" role="img" aria-label="Van cấp nước ${on ? 'mở' : 'đóng'}">
      <rect x="120" y="14" width="140" height="42" rx="6" fill="var(--warm)" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="190" y="40" text-anchor="middle" style="fill:var(--ink)">cuộn dây ${on ? 'CÓ ĐIỆN' : 'không điện'}</text>
      <rect x="176" y="${on ? 36 : 56}" width="28" height="30" fill="var(--muted)"/><text class="fl" x="214" y="${on ? 58 : 76}">lõi sắt</text>
      <rect x="70" y="80" width="240" height="120" rx="12" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="80" y="86" width="220" height="${mY - 90 + 4}" fill="${on ? 'var(--surface)' : 'var(--cold-tint2)'}" opacity=".9"/>
      <text class="fl" x="190" y="${on ? 96 : 105}" text-anchor="middle">khoang khống chế</text>
      <path d="M72 ${mY + 10}H308" stroke="var(--ink)" stroke-width="7"/>
      <text class="fl" x="190" y="${mY + 28}" text-anchor="middle">màng cao su ${on ? 'BỊ ĐẨY LÊN' : 'ép xuống'}</text>
      <path d="M20 170H70" stroke="${w}" stroke-width="14"/><text class="fl" x="20" y="198">nước vào</text>
      <path d="M310 170H410" stroke="${on ? 'var(--cold)' : 'var(--line)'}" stroke-width="14"/><text class="fl" x="320" y="198">ra thùng</text>
      ${on ? `<path class="flow" d="M70 170H310" stroke="var(--cold)" stroke-width="6" fill="none"/>` : `<rect x="180" y="134" width="20" height="46" fill="var(--bad)" opacity=".7"/><text class="fl" x="190" y="226" text-anchor="middle" style="fill:var(--bad)">màng đóng kín cửa ra</text>`}</svg>`;
  }

  const FAULTS = {
    a: ['Nước không vào, cuộn dây có điện', 'Cuộn dây đứt/ lõi kẹt/ màng rách', 'Đo cuộn dây: nếu ∞ (đứt) → thay. Nếu thông (~3 – 4 kΩ) mà vẫn không mở → lõi sắt kẹt, màng không lên → tháo vệ sinh/ thay.'],
    b: ['Nước vào liên tục, không ngắt dù đã đủ mực', 'Màng rách, lỗ thoát bị cặn bịt, lõi kẹt không bịt lỗ', 'Tháo vệ sinh lõi, lỗ, màng; hỏng thì thay van. (Nguy hiểm: tràn nước.)'],
    c: ['Nước vào yếu', 'Lưới lọc đầu vào bẩn, nguồn nước yếu, van nước ngoài chưa mở hết', 'Tháo lưới lọc rửa sạch.'],
    d: ['Cuộn dây có điện nhưng không nghe tiếng “tách”', 'Cuộn đứt, lỏng giắc cắm, bo mạch không cấp điện (hỏng triac)', 'Đo điện áp tại giắc van. Có 220 V mà không hút → thay van. Không có → kiểm tra bo mạch (triac/ transistor).']
  };

  function learn() {
    return `
<section class="sec" id="s-use" data-toc="1 · Công dụng">
  <div class="sec-n">Phần 1</div><h2>Van cấp nước làm gì?</h2>
  <p>Van cấp nước là <b>van điện từ</b>: bo mạch cấp điện thì van mở cho nước vào thùng; <b>đủ mực thì cắt điện, van tự đóng</b>. Máy có 1 van (nước lạnh) hoặc nhiều van (nhiều đầu vào: nước nóng, nước xả mềm, đa ngăn bột giặt…).</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Đặc điểm</h4><ul style="margin:6px 0 0;padding-left:20px"><li>Hoạt động bằng <b>điện 220 V AC</b></li><li>Cuộn dây điện trở khoảng <b>3 – 4 kΩ</b></li><li>Điều khiển bởi <b>triac</b> hoặc transistor trên bo</li></ul></div>
    <div class="panel warm" style="margin:0"><h4>Vì sao không dùng điện trực tiếp “đẩy” màng?</h4><p style="margin:6px 0 0">Nước máy có <b>áp suất sẵn</b>. Van chỉ cần mở lỗ thoát nhỏ, để chính áp nước đẩy màng — cuộn dây nhỏ gọn, tiết kiệm.</p></div></div>
</section>

<section class="sec" id="s-lab" data-toc="2 · Thí nghiệm van">
  <div class="sec-n">Phần 2</div><h2>🔬 Cấu tạo & nguyên lý: bật/tắt điện</h2>
  <div class="stage"><div id="vSvg" style="padding:6px"></div><div class="controls"><button class="btn pri sm" id="vOn" aria-pressed="false">⚡ Cấp điện cuộn dây</button></div><div class="verdict" id="vV" style="margin:0 14px 12px"></div></div>
  <div class="callout"><span class="ic">💡</span><div><b class="t">Vì sao khoang trên giữ được màng?</b><p>Nước lọt qua <b>lỗ tăng áp</b> nhỏ lên khoang trên màng. Mặt trên màng có <b>diện tích lớn hơn</b> → lực ép lớn hơn lực đẩy từ dưới → <b>van đóng kín</b>. Khi lõi sắt mở lỗ thoát, nước ở khoang trên xả đi nhanh hơn nước bổ sung → áp trên giảm → nước nguồn đẩy màng lên.</p></div></div>
  <h3 style="margin-top:22px">Các bộ phận – bấm xem</h3>
  <div id="pTabs"></div><article class="panel" id="pPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-fix" data-toc="3 · Kiểm tra hư hỏng">
  <div class="sec-n">Phần 3</div><h2>Kiểm tra & sửa chữa</h2>
  <h3>Đo cuộn dây</h3>
  <div class="stage" style="padding:14px"><div class="row"><label>Cuộn dây đang ở tình trạng <select id="cs" class="btn sm" style="min-height:36px"><option value="ok">Bình thường</option><option value="open">Đứt dây</option><option value="short">Chạm vòng</option></select></label></div><div id="cG"></div><div class="verdict" id="cV"></div></div>
  <h3 style="margin-top:22px">🩺 Chẩn đoán lỗi thường gặp</h3>
  <div id="fTabs"></div><article class="panel warm" id="fPanel"></article>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">An toàn</b><p>Van hỏng kẹt mở có thể <b>tràn nước</b> hỏng bo mạch. Khi sửa luôn <b>rút điện, khóa vòi nước</b> trước.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 5 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Van cấp nước là van điện từ 220 V AC, cuộn dây ~3–4 kΩ.</b></div></li>
    <li class="done"><div><b>Có điện: lõi sắt hút lên → mở lỗ thoát → áp khoang trên giảm → màng mở → nước chảy.</b></div></li>
    <li class="done"><div><b>Mất điện: lò xo bịt lỗ → nước qua lỗ tăng áp → ép màng đóng.</b></div></li>
    <li class="done"><div><b>Nước vào liên tục = màng rách/ lõi kẹt; nước yếu = lưới lọc bẩn.</b></div></li>
    <li class="done"><div><b>Cuộn đứt: đo ∞ → thay van.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/2/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    let on = false;
    const draw = () => { $('#vSvg', root).innerHTML = valveSVG(on); const b = $('#vOn', root); b.setAttribute('aria-pressed', on); b.textContent = on ? '⏻ Ngắt điện' : '⚡ Cấp điện cuộn dây'; $('#vV', root).className = 'verdict ' + (on ? 'ok' : ''); $('#vV', root).innerHTML = on ? '✓ Van <b>MỞ</b>: nước chảy vào thùng giặt.' : 'Van <b>ĐÓNG</b>: áp suất khoang trên giữ chặt màng.'; };
    $('#vOn', root).onclick = () => { on = !on; draw(); }; draw();
    U.tabset($('#pTabs', root), Object.entries(PARTS).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#pPanel', root).innerHTML = `<h3>${PARTS[id][0]}</h3><p style="margin:0">${PARTS[id][1]}</p>`; });
    const cs = $('#cs', root), cd = () => { const v = { ok: 3.5, open: 'inf', short: 0.4 }[cs.value]; $('#cG', root).innerHTML = `<div style="text-align:center;font-family:var(--head);font-size:34px;margin:10px 0">${v === 'inf' ? '∞ (hở)' : v + ' kΩ'}</div>`; const r = $('#cV', root); r.className = 'verdict ' + (cs.value === 'ok' ? 'ok' : 'bad'); r.innerHTML = cs.value === 'ok' ? '✓ Cuộn dây tốt (~3–4 kΩ).' : cs.value === 'open' ? '✗ Đứt cuộn → thay van.' : '✗ Chạm vòng (điện trở quá thấp) → nóng, cháy → thay van.'; };
    cs.onchange = cd; cd();
    U.tabset($('#fTabs', root), Object.entries(FAULTS).map(([id, f], i) => ({ id, n: i + 1, name: f[0] })), id => { const f = FAULTS[id]; $('#fPanel', root).innerHTML = `<h3>${f[0]}</h3><p><b>Nguyên nhân:</b> ${f[1]}</p><p style="margin:0"><b>Cách xử lý:</b> ${f[2]}</p>`; });
  }

  const flashcards = [
    { f: 'Van cấp nước thuộc loại van gì?', b: 'Van <b>điện từ</b> 220 V AC.', tag: 'Cơ bản' },
    { f: 'Điện trở cuộn dây van cấp nước?', b: 'Khoảng <b>3 – 4 kΩ</b>.', tag: 'Cơ bản' },
    { f: 'Van điều khiển bằng linh kiện nào trên bo?', b: '<b>Triac</b> hoặc transistor.', tag: 'Cơ bản' },
    { f: 'Khi có điện, van làm gì?', b: 'Hút lõi sắt → mở lỗ thoát → màng mở → nước vào.', tag: 'Nguyên lý' },
    { f: 'Khi mất điện, van làm gì?', b: 'Lò xo ép lõi sắt bịt lỗ → van đóng.', tag: 'Nguyên lý' },
    { f: 'Màng cao su ngăn giữa cái gì?', b: 'Khoang khống chế (trên) và cửa nước ra (dưới).', tag: 'Cấu tạo' },
    { f: 'Lỗ tăng áp trên màng để làm gì?', b: 'Cho nước lọt lên khoang trên, tạo áp ép màng đóng.', tag: 'Nguyên lý' },
    { f: 'Vì sao áp trên màng ép chặt được màng?', b: 'Mặt trên có <b>diện tích lớn hơn</b> mặt dưới.', tag: 'Nguyên lý' },
    { f: 'Khoang khống chế là gì?', b: 'Khoang nước phía trên màng, quyết định đóng/mở.', tag: 'Cấu tạo' },
    { f: 'Lưới lọc đầu vào dùng để?', b: 'Giữ cặn; bẩn → nước yếu.', tag: 'Cấu tạo' },
    { f: 'Nước vào liên tục là do?', b: 'Màng rách, lỗ thoát bịt cặn, lõi kẹt.', tag: 'Hư hỏng' },
    { f: 'Nước vào yếu là do?', b: 'Lưới lọc bẩn, nguồn nước yếu.', tag: 'Hư hỏng' },
    { f: 'Cuộn dây van cấp đo ∞ nghĩa là?', b: 'Đứt cuộn → thay van.', tag: 'Hư hỏng' },
    { f: 'Cuộn dây đo rất thấp (vài trăm Ω)?', b: 'Chạm vòng → thay.', tag: 'Hư hỏng' },
    { f: 'Có 220 V tại giắc nhưng van không mở?', b: 'Van hỏng (cuộn/ lõi kẹt) → thay/ vệ sinh.', tag: 'Hư hỏng' },
    { f: 'Không có 220 V tại giắc?', b: 'Kiểm tra bo mạch: triac/ transistor.', tag: 'Hư hỏng' },
    { f: 'Máy nhiều van dùng để?', b: 'Nhiều đầu nước: lạnh, nóng, nước xả…', tag: 'Cơ bản' },
    { f: 'Van mở nước ngắt khi nào?', b: 'Khi cảm biến mức nước báo đủ, bo cắt điện.', tag: 'Nguyên lý' },
    { f: 'Vì sao dùng áp lực nước để mở màng?', b: 'Cuộn nhỏ gọn, chỉ mở lỗ nhỏ, tiết kiệm điện.', tag: 'Nguyên lý' },
    { f: 'An toàn khi sửa van?', b: 'Rút điện và khóa vòi nước.', tag: 'An toàn' },
    { f: 'Vì sao van kẹt mở nguy hiểm?', b: 'Nước tràn hỏng bo, ngập nhà.', tag: 'An toàn' },
    { f: 'Tiếng “tách” khi cấp nước là?', b: 'Lõi sắt hút.', tag: 'Nguyên lý' },
    { f: 'Nguồn điện van cấp nước là AC hay DC?', b: 'AC 220 V.', tag: 'Cơ bản' },
    { f: 'Chạm vòng cuộn dây gây?', b: 'Nóng, cháy, hết lực hút.', tag: 'Hư hỏng' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Van cấp nước là loại van?', ['Điện từ', 'Cơ tay', 'Thủy lực', 'Khí nén'], 0, '220 V AC.'),
    Q('Cuộn dây van cấp nước khoảng?', ['3 – 4 kΩ', '3 – 4 Ω', '300 kΩ', '0 Ω'], 0, 'Đo bằng thang x1k.'),
    Q('Có điện thì lõi sắt?', ['Bị hút lên', 'Rơi xuống', 'Đứng im', 'Xoay'], 0, 'Mở lỗ thoát.'),
    Q('Mất điện van đóng nhờ?', ['Lò xo', 'Trọng lực', 'Từ trường', 'Bơm'], 0, 'Lò xo ép lõi bịt lỗ.'),
    Q('Màng cao su mở khi?', ['Áp khoang trên giảm', 'Áp trên tăng', 'Hết nước', 'Mất lò xo'], 0, 'Nước nguồn đẩy lên.'),
    Q('Van đóng được là nhờ?', ['Áp trên màng lớn hơn do diện tích lớn', 'Lực từ', 'Lò xo mạnh', 'Nước nóng'], 0, 'Diện tích trên > dưới.'),
    Q('Lỗ tăng áp nằm ở?', ['Trên màng', 'Cuộn dây', 'Thùng', 'Bo mạch'], 0, 'Cho nước lên khoang trên.'),
    Q('Nước vào liên tục không ngắt, nguyên nhân?', ['Màng rách / lõi kẹt', 'Lưới sạch', 'Cuộn đứt', 'Mất điện'], 0, 'Van không đóng được.'),
    Q('Nước vào yếu, thường do?', ['Lưới lọc bẩn', 'Triac chập', 'Đứt cuộn', 'Hỏng bơm xả'], 0, 'Rửa lưới.'),
    Q('Cuộn dây đo ∞ thì?', ['Thay van', 'Còn tốt', 'Vệ sinh lưới', 'Thay bo'], 0, 'Đứt cuộn.'),
    Q('Điều khiển van trên bo là?', ['Triac/ transistor', 'Tụ', 'Phin lọc', 'Role PTC'], 0, 'Đóng/mở nguồn.'),
    Q('Không có 220 V tại giắc van, nên kiểm tra?', ['Bo mạch', 'Lưới lọc', 'Màng', 'Dây curoa'], 0, 'Triac hỏng.'),
    Q('Có 220 V, van không mở, tiếng “tách” không có?', ['Van hỏng', 'Bo hỏng', 'Hết nước', 'Lồng kẹt'], 0, 'Cuộn hoặc lõi.'),
    Q('Khi sửa van cần?', ['Rút điện, khóa nước', 'Chỉ rút điện', 'Chỉ khóa nước', 'Không cần'], 0, 'An toàn.'),
    Q('Khoang khống chế nằm?', ['Trên màng', 'Dưới màng', 'Trong thùng', 'Ngoài van'], 0, 'Chứa nước ép màng.'),
    Q('Chạm vòng cuộn dây đo điện trở?', ['Rất thấp', 'Rất cao', '∞', 'Bình thường'], 0, 'Chạm vòng.'),
    Q('Van cấp nước dùng điện?', ['220 V AC', '12 V DC', '5 V', 'Ắc quy'], 0, 'Điện lưới.'),
    Q('Van đóng ngay khi?', ['Cảm biến báo đủ nước, bo ngắt điện', 'Tắt vòi', 'Hết bột giặt', 'Lồng quay'], 0, 'Điều khiển bởi bo.'),
    Q('Máy cần nhiều van để?', ['Nhiều đường nước', 'Tăng điện', 'Tăng ồn', 'Giảm nước'], 0, 'Lạnh, nóng, xả…'),
    Q('Lõi sắt kẹt gây?', ['Van không đóng/ mở', 'Giặt sạch hơn', 'Động cơ chạy nhanh', 'Hết điện'], 0, 'Cơ khí kẹt.'),
    Q('Van cấp mở ở tình trạng bình thường (không điện)?', ['Đóng', 'Mở', 'Nửa mở', 'Tùy hãng'], 0, 'Thường đóng.'),
    Q('Ưu điểm dùng áp nước?', ['Cuộn nhỏ, tiết kiệm điện', 'Ồn hơn', 'Đắt hơn', 'Không cần lọc'], 0, 'Chỉ mở lỗ nhỏ.'),
    Q('Bộ phận giữ cặn đầu vào?', ['Lưới lọc', 'Màng', 'Lõi sắt', 'Cuộn'], 0, 'Vệ sinh định kỳ.'),
    Q('Thành phần nào là màng ngăn giữa hai khoang?', ['Màng cao su', 'Lò xo', 'Lõi sắt', 'Lưới'], 0, 'Có lỗ tăng áp.')
  ];
  const sort = {
    title: 'Trạng thái van & hậu quả',
    buckets: [{ id: 'on', name: 'Khi CÓ ĐIỆN' }, { id: 'off', name: 'Khi MẤT ĐIỆN' }, { id: 'bad', name: 'Hư hỏng' }],
    items: [
      { t: 'Lõi sắt bị hút lên', b: 'on' }, { t: 'Lỗ thoát mở', b: 'on' }, { t: 'Áp khoang trên giảm', b: 'on' }, { t: 'Nước chảy vào thùng', b: 'on' },
      { t: 'Lò xo bịt lỗ thoát', b: 'off' }, { t: 'Áp trên màng ép đóng', b: 'off' }, { t: 'Nước dừng', b: 'off' },
      { t: 'Màng rách → nước vào liên tục', b: 'bad' }, { t: 'Lưới bẩn → nước yếu', b: 'bad' }, { t: 'Cuộn đứt đo ∞', b: 'bad' }, { t: 'Triac hỏng → không có 220 V', b: 'bad' }
    ]
  };
  const order = [
    { title: 'Van mở nước', intro: 'Từ lúc cấp điện đến khi nước chảy.', steps: ['Bo mạch cấp 220 V cho cuộn dây', 'Cuộn sinh từ trường hút lõi sắt', 'Lỗ thoát mở, nước khoang trên xả đi', 'Áp trên màng giảm', 'Nước nguồn đẩy màng lên', 'Nước chảy vào thùng giặt'] },
    { title: 'Van đóng nước', intro: 'Từ lúc ngắt điện đến khi nước dừng.', steps: ['Đủ mực, bo ngắt điện', 'Từ trường mất', 'Lò xo đẩy lõi sắt bịt lỗ thoát', 'Nước qua lỗ tăng áp lên khoang trên', 'Áp trên màng tăng, ép màng xuống', 'Van đóng kín'] },
    { title: 'Kiểm tra van không cấp nước', intro: 'Quy trình chẩn đoán.', steps: ['Khóa nước, rút điện, tháo giắc van', 'Đo điện trở cuộn dây', 'Cuộn tốt (~3–4 kΩ): kiểm tra tiếp lưới lọc và màng', 'Lắp lại, cấp điện, đo 220 V tại giắc', 'Có 220 V mà van không mở: thay van', 'Không có 220 V: kiểm tra bo mạch'] }
  ];
  DL.register({
    cat: 'may-giat', id: 2, ready: true, title: 'Van cấp nước', sub: 'Van điện từ, màng cao su, lỗ tăng áp', minutes: 25,
    lead: 'Van cấp nước là van điện từ dùng áp lực nước để mở và đóng. Bạn sẽ thấy rõ vai trò của cuộn dây, lõi sắt, màng cao su và khoang khống chế — cùng cách đo và sửa các lỗi thường gặp.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
