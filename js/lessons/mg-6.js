/* MÁY GIẶT — BÀI 6: VAN ÁP LỰC / CẢM BIẾN MỰC NƯỚC (biên soạn từ docs/may_giat/Bai_6.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const MECH = {
    c: ['Chân C (chung)', 'Chân chung của công tắc, nối nguồn vào.'],
    no: ['Chân NO (thường hở)', 'Thường <b>hở</b> với C khi thùng chưa có nước; đóng lại khi áp suất tăng.'],
    nc: ['Chân NC (thường đóng)', 'Thường <b>thông</b> với C khi thùng chưa có nước; mở ra khi áp suất tăng.'],
    air: ['Ống dẫn khí', 'Nối từ thùng giặt tới van áp lực. Nước dâng nén không khí trong ống, ép lên màng.']
  };
  const FAULT = {
    a: ['Nước vào mãi không ngắt / báo tràn', 'Ống dẫn khí bị rò hoặc tắc, màng van mất đàn hồi, tiếp điểm kẹt.', 'Thổi bằng miệng vào ống: nghe “tách” của tiếp điểm; thay van nếu không đổi trạng thái.'],
    b: ['Không cấp nước hoặc ngắt sớm', 'Tiếp điểm bị oxi hóa, ống khí bị gập.', 'Vệ sinh/ thay van; kiểm tra ống.'],
    c: ['Không xả hết nước để vắt', 'Van áp lực không về trạng thái “cạn nước”.', 'Kiểm tra ống tắc nước/ cặn; thay van.'],
    d: ['Điện tử: báo lỗi mức nước', 'Cuộn cảm/ lõi ferit lệch, ống khí rò, bo không đọc được tần số.', 'Đo tần số tín hiệu ở chân; kiểm tra ống; thay cảm biến.']
  };

  function levelSVG(level) {
    const y = 180 - level * 1.4, f = (39 - level * .15).toFixed(0);
    return `<svg viewBox="0 0 440 230" role="img" aria-label="Mức nước ${level}%">
      <rect x="40" y="30" width="150" height="170" rx="10" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="44" y="${y}" width="142" height="${196 - y}" fill="var(--cold)" opacity=".7"/>
      <path d="M190 190H330V100" fill="none" stroke="var(--muted)" stroke-width="6"/><text class="fl" x="260" y="212" text-anchor="middle">ống dẫn khí</text>
      <rect x="296" y="50" width="70" height="60" rx="8" fill="var(--warm)" stroke="var(--ink)" stroke-width="3"/><text class="fl" x="331" y="84" text-anchor="middle" style="fill:var(--ink)">van áp lực</text>
      <text class="sub" x="40" y="22" style="fill:var(--ink)">mức nước ${level}%</text>
      <text class="sub" x="300" y="140" style="fill:var(--cold)">~${f} kHz (điện tử)</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-use" data-toc="1 · Công dụng">
  <div class="sec-n">Phần 1</div><h2>Van áp lực (phao áp lực) là gì?</h2>
  <p>Là <b>cảm biến mực nước</b>: nhận áp suất khí từ ống nối thùng giặt và báo cho bo mạch: <b>đủ nước</b> thì ngắt van cấp; <b>hết nước</b> thì cho phép vắt. Có 2 loại: <b>cơ</b> và <b>điện tử</b>.</p>
  <div class="callout"><span class="ic">💨</span><div><b class="t">Nguyên lý chung</b><p>Nước càng cao → không khí trong ống bị nén càng mạnh → áp suất lên màng van càng lớn. Van chuyển áp suất thành <b>trạng thái tiếp điểm</b> (cơ) hoặc <b>tần số</b> (điện tử).</p></div></div>
</section>

<section class="sec" id="s-mech" data-toc="2 · Van áp lực cơ">
  <div class="sec-n">Phần 2</div><h2>Van áp lực cơ: C – NO – NC</h2>
  <p>Có 3 chân: <b>C</b> chung, <b>NO</b> (thường hở), <b>NC</b> (thường đóng). Khi chưa có nước: C–NC thông. Khi nước đủ, áp suất ép màng, cơ cấu lật chuyển: C–NC hở, C–NO thông.</p>
  <div id="mTabs"></div><article class="panel" id="mPanel" aria-live="polite"></article>
  <div class="stage" style="margin-top:14px;padding:14px"><div class="row"><label>Mức nước <input id="lv" type="range" min="0" max="100" value="0" style="width:200px"> <b id="lvT">0%</b></label></div><div id="lvS"></div><div class="verdict" id="lvV"></div></div>
  <div class="callout"><span class="ic">🫁</span><div><b class="t">Thổi thử</b><p>Thổi bằng miệng vào ống: nghe “tách” và đo thông C–NO. Ngừng thổi: về lại C–NC. Không đổi → van hỏng.</p></div></div>
</section>

<section class="sec" id="s-elec" data-toc="3 · Van điện tử">
  <div class="sec-n">Phần 3</div><h2>Van áp lực điện tử: cuộn cảm + lõi ferit</h2>
  <p>Áp suất đẩy một <b>lõi ferit</b> vào/ra khỏi <b>cuộn cảm</b>, đổi giá trị điện cảm → đổi <b>tần số</b> của mạch dao động. Bo mạch đọc tần số để biết mức nước. Mức nước càng cao, tần số càng <b>thấp</b>: ví dụ 39 kHz (cạn) → 28 kHz → 24 kHz (đầy).</p>
  <div class="stage"><div id="eSvg" style="padding:6px"></div><div class="controls"><label>Mức nước <input id="ev" type="range" min="0" max="100" value="0" style="width:200px"></label></div><div class="verdict" id="eV" style="margin:0 14px 12px"></div></div>
</section>

<section class="sec" id="s-fix" data-toc="4 · Hư hỏng">
  <div class="sec-n">Phần 4</div><h2>🩺 Chẩn đoán hư hỏng</h2>
  <div id="fTabs"></div><article class="panel warm" id="fPanel"></article>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Van áp lực đo mức nước nhờ áp suất khí trong ống.</b></div></li>
    <li class="done"><div><b>Loại cơ: 3 chân C, NO, NC; có nước thì C–NC mở, C–NO đóng.</b></div></li>
    <li class="done"><div><b>Thổi vào ống để thử van cơ.</b></div></li>
    <li class="done"><div><b>Loại điện tử: cuộn cảm + lõi ferit, đổi tần số theo mức nước.</b></div></li>
    <li class="done"><div><b>Nước cao → tần số thấp (39 → 28 → 24 kHz).</b></div></li>
    <li class="done"><div><b>Ống khí rò/ gập là nguyên nhân hay gặp.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/6/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#mTabs', root), Object.entries(MECH).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#mPanel', root).innerHTML = `<h3>${MECH[id][0]}</h3><p style="margin:0">${MECH[id][1]}</p>`; });
    const lv = $('#lv', root), ld = () => { const v = +lv.value, full = v >= 60; $('#lvT', root).textContent = v + '%'; $('#lvS', root).innerHTML = levelSVG(v); const r = $('#lvV', root); r.className = 'verdict ' + (full ? 'ok' : ''); r.innerHTML = full ? '✓ Đủ nước: <b>C–NC hở</b>, <b>C–NO đóng</b> → bo ngắt van cấp.' : 'Chưa đủ: <b>C–NC thông</b>, C–NO hở → tiếp tục cấp nước.'; };
    lv.oninput = ld; ld();
    const ev = $('#ev', root), ed = () => { const v = +ev.value; $('#eSvg', root).innerHTML = levelSVG(v); const f = v < 33 ? 39 - v * .33 : v < 66 ? 28 - (v - 33) * .12 : 24; $('#eV', root).innerHTML = `Tần số đọc được: <b>${f.toFixed(1)} kHz</b> — nước càng cao, tần số càng thấp.`; $('#eV', root).className = 'verdict ok'; };
    ev.oninput = ed; ed();
    U.tabset($('#fTabs', root), Object.entries(FAULT).map(([id, f], i) => ({ id, n: i + 1, name: f[0] })), id => { const f = FAULT[id]; $('#fPanel', root).innerHTML = `<h3>${f[0]}</h3><p><b>Nguyên nhân:</b> ${f[1]}</p><p style="margin:0"><b>Cách xử lý:</b> ${f[2]}</p>`; });
  }

  const flashcards = [
    { f: 'Van áp lực là gì?', b: 'Cảm biến <b>mực nước</b> bằng áp suất khí.', tag: 'Cơ bản' },
    { f: 'Có mấy loại van áp lực?', b: '2: cơ và điện tử.', tag: 'Cơ bản' },
    { f: 'Van cơ có mấy chân?', b: '3: C, NO, NC.', tag: 'Cơ' },
    { f: 'C là chân?', b: 'Chung.', tag: 'Cơ' },
    { f: 'NO là chân?', b: 'Thường hở.', tag: 'Cơ' },
    { f: 'NC là chân?', b: 'Thường đóng.', tag: 'Cơ' },
    { f: 'Chưa có nước, thông cặp nào?', b: 'C–NC.', tag: 'Cơ' },
    { f: 'Đủ nước, thông cặp nào?', b: 'C–NO.', tag: 'Cơ' },
    { f: 'Thổi vào ống để?', b: 'Thử van đổi trạng thái.', tag: 'Cơ' },
    { f: 'Van điện tử gồm?', b: 'Cuộn cảm + lõi ferit.', tag: 'Điện tử' },
    { f: 'Nước dâng thì lõi ferit?', b: 'Dịch chuyển, đổi điện cảm.', tag: 'Điện tử' },
    { f: 'Tín hiệu van điện tử?', b: '<b>Tần số</b>.', tag: 'Điện tử' },
    { f: 'Nước cao → tần số?', b: 'Giảm.', tag: 'Điện tử' },
    { f: 'Tần số ví dụ?', b: '39 → 28 → 24 kHz.', tag: 'Điện tử' },
    { f: 'Ống dẫn khí rò gây?', b: 'Báo sai mức nước.', tag: 'Hư hỏng' },
    { f: 'Nước vào mãi không ngắt?', b: 'Van/ ống hỏng → không báo đủ nước.', tag: 'Hư hỏng' },
    { f: 'Không xả hết để vắt?', b: 'Van không về trạng thái cạn.', tag: 'Hư hỏng' },
    { f: 'Tiếp điểm oxi hóa gây?', b: 'Ngắt sớm hoặc không cấp nước.', tag: 'Hư hỏng' },
    { f: 'Van áp lực báo cho ai?', b: 'Bo mạch điều khiển.', tag: 'Cơ bản' },
    { f: 'Đủ nước thì bo làm gì?', b: 'Ngắt van cấp nước.', tag: 'Cơ bản' },
    { f: 'Hết nước thì bo làm gì?', b: 'Cho phép vắt.', tag: 'Cơ bản' },
    { f: 'Ống khí nối từ đâu?', b: 'Thùng giặt tới van.', tag: 'Cấu tạo' },
    { f: 'Nước cao nén khí để?', b: 'Tạo áp suất lên màng van.', tag: 'Cơ bản' },
    { f: 'Phao áp lực còn gọi là?', b: 'Van áp lực / cảm biến mức nước.', tag: 'Cơ bản' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Van áp lực dùng để?', ['Đo mức nước', 'Đo nhiệt', 'Xả nước', 'Khóa cửa'], 0, 'Áp suất khí.'),
    Q('Van cơ có chân?', ['C, NO, NC', 'A, B', '1,2,3,4,5', 'L, N'], 0, 'Ba chân.'),
    Q('Chưa có nước, thông?', ['C–NC', 'C–NO', 'NO–NC', 'Không thông'], 0, 'Mặc định.'),
    Q('Đủ nước, thông?', ['C–NO', 'C–NC', 'NO–NC', 'Không thông'], 0, 'Đổi trạng thái.'),
    Q('Thổi vào ống để?', ['Thử van', 'Làm sạch', 'Cấp nước', 'Tăng áp'], 0, 'Kiểm tra tiếp điểm.'),
    Q('Van điện tử dùng?', ['Cuộn cảm + lõi ferit', 'Tụ', 'Điện trở nhiệt', 'Màng cao su'], 0, 'Đổi điện cảm.'),
    Q('Tín hiệu của van điện tử?', ['Tần số', 'Điện áp AC', 'Dòng DC', 'Nhiệt độ'], 0, 'Mạch dao động.'),
    Q('Nước cao thì tần số?', ['Giảm', 'Tăng', 'Không đổi', 'Bằng 0'], 0, '39 → 24 kHz.'),
    Q('Tần số cạn nước (ví dụ)?', ['~39 kHz', '24 kHz', '1 Hz', '100 kHz'], 0, 'Mức cao nhất.'),
    Q('Ống khí rò gây?', ['Báo sai mức nước', 'Chạy êm', 'Giặt sạch', 'Không ảnh hưởng'], 0, 'Mất áp.'),
    Q('Nước vào mãi không ngắt?', ['Van/ ống hỏng', 'Tụ hỏng', 'Hết bột', 'Mất điện'], 0, 'Không báo đủ.'),
    Q('Không xả hết để vắt?', ['Van không về trạng thái cạn', 'Tụ hỏng', 'Đèn', 'Sợi đốt'], 0, 'Kẹt tiếp điểm.'),
    Q('Van áp lực báo tín hiệu cho?', ['Bo mạch', 'Bơm', 'Vỏ', 'Dây curoa'], 0, 'Điều khiển.'),
    Q('Đủ nước, bo?', ['Ngắt van cấp', 'Mở van cấp', 'Tắt đèn', 'Mở cửa'], 0, 'Dừng cấp nước.'),
    Q('Hết nước, bo?', ['Cho phép vắt', 'Cấp thêm', 'Dừng máy', 'Báo cháy'], 0, 'Xả xong mới vắt.'),
    Q('Thành phần nén khí là?', ['Nước dâng', 'Động cơ', 'Bơm', 'Van cấp'], 0, 'Áp suất.'),
    Q('Tiếp điểm oxi hóa gây?', ['Ngắt sớm / không cấp nước', 'Tăng tốc', 'Giặt sạch', 'Không sao'], 0, 'Tiếp xúc kém.'),
    Q('NC nghĩa là?', ['Thường đóng', 'Thường hở', 'Không có', 'Chung'], 0, 'Normally Closed.'),
    Q('NO nghĩa là?', ['Thường hở', 'Thường đóng', 'Chung', 'Nguồn'], 0, 'Normally Open.'),
    Q('Van áp lực cơ khác điện tử ở?', ['Tiếp điểm so với tần số', 'Chạy điện', 'Chạy gas', 'Không khác'], 0, 'Loại tín hiệu.'),
    Q('Ống dẫn nối?', ['Thùng giặt với van', 'Bơm với van', 'Bo với van', 'Cửa với van'], 0, 'Dẫn khí.'),
    Q('Lõi ferit di chuyển làm?', ['Đổi điện cảm', 'Đổi điện trở', 'Đổi áp', 'Đổi nhiệt'], 0, 'Tần số đổi.'),
    Q('Nước cạn thì C–NC?', ['Thông', 'Hở', 'Cháy', 'Đo ∞'], 0, 'Trạng thái nghỉ.'),
    Q('Van hỏng nên?', ['Thay', 'Bỏ', 'Hạ áp', 'Tăng nước'], 0, 'Sau khi kiểm tra ống.')
  ];
  const sort = {
    title: 'Loại van áp lực & trạng thái',
    buckets: [{ id: 'mech', name: 'Van cơ' }, { id: 'elec', name: 'Van điện tử' }, { id: 'bad', name: 'Hư hỏng' }],
    items: [
      { t: '3 chân C – NO – NC', b: 'mech' }, { t: 'Thổi ống nghe tách', b: 'mech' }, { t: 'Chuyển tiếp điểm khi nước đủ', b: 'mech' },
      { t: 'Cuộn cảm + lõi ferit', b: 'elec' }, { t: 'Tín hiệu là tần số', b: 'elec' }, { t: '39 → 28 → 24 kHz', b: 'elec' }, { t: 'Nước cao, tần số thấp', b: 'elec' },
      { t: 'Ống khí rò', b: 'bad' }, { t: 'Tiếp điểm oxi hóa', b: 'bad' }, { t: 'Không xả hết để vắt', b: 'bad' }, { t: 'Nước vào mãi', b: 'bad' }
    ]
  };
  const order = [
    { title: 'Máy cấp nước đến khi đủ', intro: 'Van cơ.', steps: ['Thùng cạn, C–NC thông', 'Bo cấp điện van cấp', 'Nước dâng, nén khí trong ống', 'Áp ép màng, lật tiếp điểm', 'C–NO đóng, bo nhận tín hiệu đủ nước', 'Bo ngắt van cấp'] },
    { title: 'Đọc tần số mức nước', intro: 'Van điện tử.', steps: ['Nước dâng nén khí', 'Lõi ferit di chuyển trong cuộn cảm', 'Điện cảm thay đổi', 'Tần số dao động giảm', 'Bo đọc tần số', 'Quy đổi mức nước và điều khiển'] },
    { title: 'Kiểm tra van áp lực cơ', intro: 'Chẩn đoán.', steps: ['Rút điện, tháo ống khí', 'Đo C–NC khi chưa thổi', 'Thổi vào ống nghe tách', 'Đo C–NO thông', 'Ngừng thổi, trở lại C–NC', 'Không đổi: thay van'] }
  ];
  DL.register({
    cat: 'may-giat', id: 6, ready: true, title: 'Van áp lực (mực nước)', sub: 'Loại cơ C–NO–NC, loại điện tử theo tần số', minutes: 25,
    lead: 'Van áp lực đo mức nước nhờ áp suất khí trong ống. Bạn sẽ mô phỏng van cơ C–NO–NC, van điện tử đổi tần số theo mức nước và học cách chẩn đoán.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
