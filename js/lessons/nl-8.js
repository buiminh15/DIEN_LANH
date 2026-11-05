/* NGUYÊN LÝ LÀM LẠNH — BÀI 8: CÂN CÁP TỦ LẠNH (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_8.txt; nguồn: meta.vn/hotro/can-cap-tu-lanh-16340)
   Hình: sơ đồ lắp đo có hạt khí chạy, đồng hồ kim đọc P1, bảng thông số lọc theo gas. */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vn = x => String(x).replace('-', '−');

  // máy: [tên, gas, nhiệt độ trong, nhiệt độ ngoài, cân cáp [min,max], áp đi, áp về]
  // Dòng chỉ có một giá trị cân cáp trong nguồn được ghi min = max.
  const ROWS = [
    ['Máy lạnh NON Inverter', 'R22', '18 – 25', '20 – 38', [90, 100], '215 – 245', '60 – 90'],
    ['Máy lạnh NON Inverter', 'R410A', '18 – 25', '20 – 38', [100, 120], '350 – 400', '120 – 140'],
    ['Tủ lạnh quạt', 'R134a', 'dưới −20', '20 – 38', [200, 220], '190 – 220', '0 – 5'],
    ['Tủ lạnh COIL', 'R134a', 'dưới −20', '20 – 38', [200, 220], '190 – 220', '0 – 10'],
    ['Tủ đông', 'R600a', 'dưới −18', '20 – 32', [330, 350], '350 – 370', '−10 – 5'],
    ['Tủ đông', 'R134a', 'dưới −18', '20 – 32', [300, 300], '180 – 200', '0 – 5'],
    ['Tủ mát', 'R134a', '0 – 10', '20 – 32', [260, 260], '160 – 190', '5'],
    ['Tủ mát', 'R600a', '0 – 10', '20 – 32', [280, 280], '180 – 200', '0'],
    ['Tủ đông, mát', 'R134a', 'dưới −18 / −5 – 9', '20 – 32', [300, 300], '180 – 200', '0'],
    ['Tủ đông, mát', 'R600a', 'dưới −18 / −5 – 9', '20 – 32', [350, 350], '300 – 350', '−10'],
    ['Tủ lạnh 6 cánh inox', 'R404A', 'dưới −18', '20 – 32', [250, 250], '170 – 190', '5'],
    ['Tủ mát 6 cánh inox', 'R404A', '0 – 10', '20 – 32', [200, 200], '180 – 200', '10 – 15'],
    ['Tủ kem', 'R134a', '−26', '20 – 32', [220, 250], '250', '−5 – 0'],
    ['Tủ kem', 'R600a', '−26', '20 – 32', [330, 350], '350 – 370', '−10 – 0']
  ];
  const TOL = 10; // nguồn chỉ cho một giá trị: app coi ±10 psi là "sát" (mức minh họa)
  const GASES = ['Tất cả', 'R22', 'R410A', 'R134a', 'R600a', 'R404A'];
  const rng = r => r[0] === r[1] ? String(r[0]) : r[0] + ' – ' + r[1];

  const PARTS = {
    blk: ['Block', 'Đầu <b>đẩy</b> nối với dàn nóng. Đầu <b>hút</b> để <b>hở</b> cho block hút không khí tự do vào.'],
    cond: ['Dàn nóng', 'Một đầu nối với đầu đẩy của block. Đầu còn lại bắt vào đồng hồ áp suất rồi hàn nối tiếp với phin.'],
    gauge: ['Đồng hồ áp suất', 'Lắp <b>trước phin</b>. Dây <b>đỏ</b> nối phía đầu ống mao, dây <b>vàng</b> nối với đầu đẩy block. Kim tăng dần khi block chạy; giá trị cao nhất là <b>P1</b>.'],
    filter: ['Phin (2 ngăn)', 'Một ngăn hàn với đầu <b>ti sạc gas</b>, ngăn kia hàn với <b>cáp</b> (ống mao).'],
    cap: ['Cáp (ống mao)', 'Hàn vào một ngăn của phin; đầu kia để <b>tự do trong không khí</b>. <b>Không hàn kín</b> đầu cáp vào phin trong lúc đo.']
  };

  /* hạt khí: hút ở đầu hút, bị nén ở block, đi qua dàn nóng, gặp trở lực ở cáp rồi thoát ra */
  const profile = (plateaus, n) => {
    const bps = [...new Set([0, 1, ...plateaus.flatMap(p => [p.a, p.b])])].sort((x, y) => x - y).map(x => +x.toFixed(3));
    return { bps, w: Array.from({ length: n }, (_, s) => bps.map(x => plateaus.some(p => p.s === s && x >= p.a - 1e-6 && x <= p.b + 1e-6) ? 1 : 0)) };
  };
  const PATH = 'M10 218H62L122 152V100H700';
  const SETUP = () => {
    const pr = profile([{ a: 0, b: .07, s: 0 }, { a: .2, b: 1, s: 1 }], 2);
    return `<svg viewBox="0 0 720 300" role="img" aria-label="Sơ đồ lắp đo: block, dàn nóng, đồng hồ áp suất, phin hai ngăn và ống mao, đầu hút và đầu cáp để hở">
    <path id="nl8air" d="${PATH}" fill="none"/>
    <path d="M10 218H62" class="nl8-p cold"/><path d="M122 152V100H200M380 100H700" class="nl8-p hot"/>
    <g class="dev" data-k="cond"><rect x="196" y="64" width="188" height="72" rx="10" class="nl8-bx"/>
      <path d="M200 100L216 78L240 122L264 78L288 122L312 78L336 122L360 78L380 100" fill="none" stroke="var(--hot)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
      <text class="nl8-t" x="290" y="158" text-anchor="middle">Dàn nóng</text></g>
    <g class="dev" data-k="blk"><rect x="40" y="152" width="130" height="100" rx="16" class="nl8-bx"/><text class="nl8-t" x="105" y="208" text-anchor="middle">Block</text>
      <text class="nl8-s" x="10" y="274">đầu hút: để hở</text><text class="nl8-s" x="132" y="146" text-anchor="start">đầu đẩy</text></g>
    <g class="dev" data-k="gauge"><path d="M452 100V84" stroke="var(--ink)" stroke-width="5"/><circle cx="452" cy="56" r="30" class="nl8-bx"/>
      <path d="M452 56L468 38" stroke="var(--hot)" stroke-width="4" stroke-linecap="round"/><circle cx="452" cy="56" r="4" fill="var(--ink)"/>
      <text class="nl8-t" x="452" y="116" text-anchor="middle" dy="22">Áp kế</text></g>
    <g class="dev" data-k="filter"><rect x="520" y="82" width="70" height="36" rx="8" class="nl8-bx"/><path d="M520 100H590" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M545 82V62" stroke="var(--ink)" stroke-width="5"/><text class="nl8-s" x="545" y="56" text-anchor="middle">ti sạc</text><text class="nl8-t" x="555" y="146" text-anchor="middle">Phin 2 ngăn</text></g>
    <g class="dev" data-k="cap"><path d="M590 100H606C606 70 636 70 636 100S666 130 666 100H700" fill="none" stroke="var(--brass)" stroke-width="4" stroke-linecap="round"/>
      <text class="nl8-t" x="650" y="146" text-anchor="middle">Cáp</text><text class="nl8-s" x="708" y="168" text-anchor="end">đầu cáp: để hở</text></g>
    ${U.flow('nl8air', 9, 12, pr.bps, [{ c: 'nl1-p-cg', r: 5, w: pr.w[0] }, { c: 'nl1-p-hg', r: 5, w: pr.w[1] }])}
  </svg>`;
  };

  const dial = v => {
    const cx = 150, cy = 140, r = 108, max = 450, a = x => Math.PI * (1 - x / max), pt = (x, rr) => `${(cx + rr * Math.cos(a(x))).toFixed(1)} ${(cy - rr * Math.sin(a(x))).toFixed(1)}`;
    let t = '';
    for (let i = 0; i <= 9; i++) { const x = i * 50; t += `<path d="M${pt(x, r - (i % 2 ? 8 : 14))}L${pt(x, r)}" stroke="var(--ink)" stroke-width="${i % 2 ? 1.6 : 2.6}"/>` + (i % 2 === 0 ? `<text class="nl8-s" x="${(cx + (r - 26) * Math.cos(a(x))).toFixed(1)}" y="${(cy - (r - 26) * Math.sin(a(x)) + 4).toFixed(1)}" text-anchor="middle">${x}</text>` : ''); }
    return `<svg viewBox="0 0 300 168" role="img" aria-label="Đồng hồ áp suất chỉ ${v} psi"><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}Z" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>${t}<path id="nl8nd" d="M${cx} ${cy}L${pt(v, r - 18)}" stroke="var(--hot)" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="var(--ink)"/><text class="nl8-big" x="${cx}" y="${cy + 24}" text-anchor="middle">${v} psi</text></svg>`;
  };

  function learn() {
    return `
<section class="sec" id="s-what" data-toc="1 · Cân cáp là gì">
  <div class="sec-n">Phần 1</div><h2>Cân cáp: chọn độ dài ống mao cho đúng</h2>
  <p><b>Cân cáp</b> là kỹ thuật <b>đo trở lực</b> của ống mao (cáp) khi lắp với block, để chọn chiều dài cáp cho hợp. Cáp là thiết bị tiết lưu ở Bài 2: nó tạo chênh áp giữa dàn nóng và dàn lạnh. Cân không đúng kỹ thuật sẽ ảnh hưởng trực tiếp đến hoạt động của tủ và làm tủ <b>hao điện hơn</b>.</p>
  <div class="grid2">
    <div class="panel hotc"><h3>Cáp bị tắc</h3><p style="margin:0">Cáp tắc nghẽn phải <b>thay mới</b>, và cáp mới phải được cân.</p></div>
    <div class="panel"><h3>Thay block</h3><p style="margin:0">Khi <b>thay block</b> cũng cần cân cáp để thiết bị hoạt động tốt hơn.</p></div>
  </div>
  <div class="callout mem"><span class="ic">🧭</span><div><b class="t">Ý tưởng cân cáp</b><p>Cáp <b>dài</b> thì cản gas nhiều, cáp <b>ngắn</b> thì cản ít. Cho block bơm không khí qua cáp và đọc áp kế: đó là <b>P1</b>, thước đo độ cản của cáp. So P1 với bảng thông số rồi cắt bớt hoặc nối thêm cáp.</p></div></div>
</section>

<section class="sec" id="s-diagram" data-toc="2 · Sơ đồ lắp đo">
  <div class="sec-n">Phần 2</div><h2>Sơ đồ lắp đo</h2>
  <p>Hạt rỗng là không khí. Block <b>hút không khí tự do</b> ở đầu hút, nén qua dàn nóng, qua áp kế và phin, rồi gặp trở lực ở cáp và thoát ra đầu cáp để hở. Bấm vào bộ phận để xem cách nối:</p>
  <div class="stage nl8-st" id="nl8box" data-sel="all"><div class="nl1-scroll">${SETUP()}</div><p class="nl1-swipe muted">Vuốt ngang để xem hết sơ đồ ↔</p>
    <div class="nl6-parts" id="nl8btn"></div><article class="panel" id="nl8panel" aria-live="polite"></article>
    <div class="nl1-legend"><span><i class="gas" style="border-color:var(--cold-l)"></i> không khí hút vào</span><span><i class="gas" style="border-color:var(--hot);background:var(--hot-tint)"></i> không khí đã nén</span><button class="btn sm" id="nl8play" aria-pressed="true" style="margin-left:auto">⏸ Dừng</button></div></div>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Hai điều không được quên</b><p><b>Để hở đầu hút</b> của block để block hút không khí vào. <b>Không hàn kín đầu cáp vào phin</b>, phải để hở.</p></div></div>
</section>

<section class="sec" id="s-way" data-toc="3 · Hai cách cân">
  <div class="sec-n">Phần 3</div><h2>Hai cách cân cáp</h2>
  <div class="grid2">
    <div class="panel"><h3>Cách 1: block lắp cùng ống mao và phin</h3><p style="margin:0">Hay dùng ở thợ <b>lành nghề, kỹ thuật cao</b>. Đo riêng lực trở của ống mao và phin với block.</p></div>
    <div class="panel warm"><h3>Cách 2: hệ thống đã lắp hoàn chỉnh</h3><p style="margin:0">Lắp cáp vào hệ thống hoàn chỉnh, lấy độ dài theo <b>giá trị định hướng</b> và <b>thêm chiều dài dự trữ</b>.</p></div>
  </div>
  <h3 style="margin-top:22px">Cách 1, từng bước</h3>
  ${U.steps([
    ['Dùng phin 2 ngăn', 'Một ngăn hàn với đầu ti sạc gas, một ngăn hàn với cáp.'],
    ['Nối ống mao vào phin và đầu đẩy block', 'Lắp đồng hồ áp suất ở trước phin.'],
    ['Để hở hai đầu', 'Đầu hút của block hút không khí tự do; đầu kia của ống mao cũng để tự do.'],
    ['Cho block chạy, đọc P1', 'Kim tăng lên; giá trị cao nhất là P1, tức trở kháng của ống mao.'],
    ['Chỉnh cáp theo P1', 'P1 lớn: cắt bớt ống mao. P1 nhỏ: nối thêm ống mao để tăng lực trở.']
  ])}
  <h3 style="margin-top:22px">Cách 2, từng bước</h3>
  ${U.steps([
    ['Lắp ống mao vào hệ thống hoàn chỉnh', 'Lấy độ dài theo giá trị định hướng, thêm chiều dài dự trữ.'],
    ['Lắp áp kế trước phin lọc', 'Đo trở lực của không khí.'],
    ['Để ống nạp tự do trong không khí', 'Rồi đọc áp kế như ở cách 1.']
  ])}
  <div class="stage nl8-lab"><h3>Thử: đọc P1 rồi quyết định</h3>
    <p class="muted" style="margin:0 0 8px">Chọn loại tủ, kéo kim áp kế tới số đã đọc, xem nên làm gì với cáp.</p>
    <label class="row" style="gap:8px">Loại tủ <select id="nl8sel" class="btn sm" style="min-height:40px">${ROWS.map((r, i) => `<option value="${i}">${r[0]} · ${r[1]}</option>`).join('')}</select></label>
    <div class="nl8-lg"><div id="nl8dial"></div><div>
      <label class="row" style="gap:10px">P1 đọc được <input id="nl8p" type="range" min="0" max="450" step="5" value="150" style="width:min(240px,55vw)" aria-label="P1 đọc được trên áp kế"> <b id="nl8pv"></b></label>
      <div class="verdict" id="nl8v" aria-live="polite" style="margin-top:10px"></div></div></div></div>
</section>

<section class="sec" id="s-table" data-toc="4 · Bảng thông số">
  <div class="sec-n">Phần 4</div><h2>Bảng thông số cân cáp</h2>
  <p>Bảng tham khảo cho máy lạnh, tủ lạnh, tủ đông, tủ mát và tủ kem. Dùng kết hợp với <b>nhiệt độ môi trường hiện tại</b> để cân cho đúng. Lọc theo môi chất:</p>
  <div class="nl6-parts" id="nl8f" role="group" aria-label="Lọc theo môi chất">${GASES.map((g, i) => `<button type="button" class="nl4-chip" data-g="${g}" aria-pressed="${i === 0}">${g}</button>`).join('')}</div>
  <div class="tscroll"><table class="cmp" id="nl8tb"></table></div>
  <p class="muted" style="font-size:13.5px">Đơn vị áp suất là psi (1 bar ≈ 14,5 psi, xem Bài 6). Cột nhiệt độ là nhiệt độ trong tủ và nhiệt độ ngoài trời. Nguồn: meta.vn, bài đăng 08/06/2022; số liệu chỉ để tham khảo, nên đối chiếu thêm thông số của hãng.</p>
</section>

<section class="sec" id="s-note" data-toc="5 · Lưu ý">
  <div class="sec-n">Phần 5</div><h2>Lưu ý khi cân cáp</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Làm theo sơ đồ ở trên</b><span>để hạn chế không khí bị ngưng tụ dưới áp suất làm ẩm hệ thống.</span></div></li>
    <li class="done"><div><b>Nên hàn trực tiếp ống mao với rắc co</b><span>khi cân cáp.</span></div></li>
    <li class="done"><div><b>Lưu ý các lỗi có thể xảy ra</b><span>để chỉnh cáp phù hợp với từng dòng tủ lạnh.</span></div></li>
  </ol>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Cân cáp = đo trở lực ống mao để chọn độ dài cáp.</b></div></li>
    <li class="done"><div><b>Cần cân khi cáp tắc thay mới hoặc khi thay block.</b></div></li>
    <li class="done"><div><b>Đầu hút block và đầu cáp đều để hở; áp kế lắp trước phin.</b></div></li>
    <li class="done"><div><b>P1 là giá trị cao nhất của kim áp kế khi block chạy.</b></div></li>
    <li class="done"><div><b>P1 lớn: cắt bớt cáp. P1 nhỏ: nối thêm cáp.</b></div></li>
    <li class="done"><div><b>Đối chiếu bảng thông số theo loại tủ, môi chất và nhiệt độ môi trường.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/8/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.bindSteps(root);
    // sơ đồ
    const box = $('#nl8box', root), svg = $('svg', box), play = $('#nl8play', root);
    let on = !RM;
    const pl = () => { try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) { } play.textContent = on ? '⏸ Dừng' : '▶ Chạy'; play.setAttribute('aria-pressed', on); };
    play.onclick = () => { on = !on; pl(); };
    const show = k => {
      box.dataset.sel = k;
      $$('#nl8btn .nl4-chip', root).forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
      $('#nl8panel', root).innerHTML = k === 'all' ? '<h3>Cả sơ đồ</h3><p style="margin:0">Block → dàn nóng → áp kế → phin → cáp. Hai đầu <b>hở</b>: đầu hút của block và đầu cáp.</p>' : `<h3>${PARTS[k][0]}</h3><p style="margin:0">${PARTS[k][1]}</p>`;
    };
    $('#nl8btn', root).innerHTML = [['all', 'Cả sơ đồ'], ...Object.entries(PARTS).map(([k, p]) => [k, p[0]])].map(p => `<button type="button" class="nl4-chip" data-k="${p[0]}">${p[1]}</button>`).join('');
    $$('#nl8btn .nl4-chip', root).forEach(b => b.onclick = () => show(b.dataset.k));
    $$('.dev', box).forEach(g => { g.style.cursor = 'pointer'; g.addEventListener('click', () => show(g.dataset.k)); });
    show('all'); pl();

    // đọc P1
    const sel = $('#nl8sel', root), sl = $('#nl8p', root);
    const read = () => {
      const r = ROWS[+sel.value], p = +sl.value, [lo, hi] = r[4], single = lo === hi;
      const a = single ? lo - TOL : lo, b = single ? hi + TOL : hi;
      $('#nl8pv', root).textContent = p + ' psi'; $('#nl8dial', root).innerHTML = dial(p);
      const v = $('#nl8v', root), ref = `${r[0]} (${r[1]}): bảng ghi <b>${rng(r[4])} psi</b>${single ? ` (chỉ có một giá trị; ở đây coi ±${TOL} psi là sát)` : ''}.`;
      if (p > b) { v.className = 'verdict bad'; v.innerHTML = `<b>P1 lớn</b>, cáp cản quá nhiều: <b>cắt bớt ống mao</b>, rồi đo lại. ${ref}`; }
      else if (p < a) { v.className = 'verdict bad'; v.innerHTML = `<b>P1 nhỏ</b>, cáp cản chưa đủ: <b>nối thêm ống mao</b> để tăng lực trở, rồi đo lại. ${ref}`; }
      else { v.className = 'verdict ok'; v.innerHTML = `<b>P1 đạt</b>: cáp có độ dài phù hợp. ${ref}`; }
    };
    sel.onchange = () => { const r = ROWS[+sel.value]; sl.value = Math.round((r[4][0] + r[4][1]) / 2 / 5) * 5; read(); };
    sl.oninput = read; read();

    // bảng
    let g = 'Tất cả';
    const table = () => {
      const rows = ROWS.filter(r => g === 'Tất cả' || r[1] === g);
      $('#nl8tb', root).innerHTML = `<thead><tr><th>Máy</th><th>Môi chất</th><th>Trong (°C)</th><th>Ngoài (°C)</th><th>Cân cáp (psi)</th><th>Áp đi (psi)</th><th>Áp về (psi)</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><b>${rng(r[4])}</b></td><td>${r[5]}</td><td>${r[6]}</td></tr>`).join('')}</tbody>`;
    };
    $$('#nl8f .nl4-chip', root).forEach(b => b.onclick = () => { g = b.dataset.g; $$('#nl8f .nl4-chip', root).forEach(x => x.setAttribute('aria-pressed', x === b)); table(); });
    table();
  }

  const flashcards = [
    { f: 'Cân cáp tủ lạnh là gì?', b: 'Kỹ thuật đo trở lực của ống mao khi lắp với block để chọn độ dài cáp.', tag: 'Khái niệm' },
    { f: 'Cân cáp sai gây hậu quả gì?', b: 'Ảnh hưởng trực tiếp đến hoạt động của tủ và làm tủ hao điện hơn.', tag: 'Khái niệm' },
    { f: 'Khi nào cần cân cáp?', b: 'Khi cáp bị tắc cần thay mới, hoặc khi thay block.', tag: 'Khái niệm' },
    { f: 'Đầu hút của block khi cân cáp để thế nào?', b: 'Để hở cho block hút không khí tự do.', tag: 'Sơ đồ' },
    { f: 'Đầu cáp khi cân cáp để thế nào?', b: 'Để hở, tự do trong không khí; không hàn kín vào phin.', tag: 'Sơ đồ' },
    { f: 'Đồng hồ áp suất lắp ở đâu khi cân cáp?', b: 'Trước phin.', tag: 'Sơ đồ' },
    { f: 'Dây đỏ và dây vàng của đồng hồ nối với đâu?', b: 'Dây đỏ nối phía đầu ống mao; dây vàng nối đầu đẩy block.', tag: 'Sơ đồ' },
    { f: 'Phin 2 ngăn dùng thế nào?', b: 'Một ngăn hàn với ti sạc gas, một ngăn hàn với cáp.', tag: 'Cách 1' },
    { f: 'P1 là gì?', b: 'Giá trị cao nhất kim áp kế đạt khi block chạy; chính là trở kháng của ống mao.', tag: 'Cách 1' },
    { f: 'P1 lớn thì xử lý thế nào?', b: 'Cắt bớt ống mao.', tag: 'Cách 1' },
    { f: 'P1 nhỏ thì xử lý thế nào?', b: 'Nối thêm ống mao để tăng lực trở.', tag: 'Cách 1' },
    { f: 'Cách 1 thường dùng bởi ai?', b: 'Thợ điện lạnh lành nghề, kỹ thuật cao.', tag: 'Cách 1' },
    { f: 'Cách 2 đo ở đâu?', b: 'Trong hệ thống lạnh đã lắp hoàn chỉnh: áp kế lắp trước phin lọc, ống nạp để tự do.', tag: 'Cách 2' },
    { f: 'Cách 2 lấy độ dài ống mao thế nào?', b: 'Theo giá trị định hướng, thêm chiều dài dự trữ.', tag: 'Cách 2' },
    { f: 'Máy lạnh NON Inverter R22: cân cáp?', b: '90 – 100 psi (áp đi 215 – 245, áp về 60 – 90).', tag: 'Bảng' },
    { f: 'Máy lạnh NON Inverter R410A: cân cáp?', b: '100 – 120 psi (áp đi 350 – 400, áp về 120 – 140).', tag: 'Bảng' },
    { f: 'Tủ lạnh R134a (quạt hoặc coil): cân cáp?', b: '200 – 220 psi.', tag: 'Bảng' },
    { f: 'Tủ đông R600a: cân cáp?', b: '330 – 350 psi.', tag: 'Bảng' },
    { f: 'Tủ mát R134a: cân cáp?', b: '260 psi.', tag: 'Bảng' },
    { f: 'Dùng bảng thông số cân cáp thế nào?', b: 'Kết hợp với nhiệt độ môi trường hiện tại để cân cho đúng.', tag: 'Bảng' },
    { f: 'Vì sao nên làm theo sơ đồ lắp đo?', b: 'Hạn chế không khí bị ngưng tụ dưới áp suất làm ẩm hệ thống.', tag: 'Lưu ý' },
    { f: 'Nên hàn ống mao với gì khi cân cáp?', b: 'Hàn trực tiếp ống mao với rắc co.', tag: 'Lưu ý' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Cân cáp tủ lạnh là kỹ thuật?', ['Đo trở lực ống mao để chọn độ dài cáp', 'Nạp gas cho tủ', 'Hút chân không', 'Thay dầu máy nén'], 0, 'Chọn độ dài ống mao cho hợp với block.'),
    Q('Trường hợp nào cần cân cáp?', ['Cáp tắc thay mới hoặc thay block', 'Thay bóng đèn tủ', 'Lau dàn nóng', 'Đổi ổ cắm'], 0, 'Cáp mới hoặc block mới thì phải cân lại.'),
    Q('Cân cáp sai có thể làm tủ?', ['Hao điện hơn', 'Lạnh hơn bình thường', 'Giảm tiếng ồn', 'Không ảnh hưởng'], 0, 'Ảnh hưởng hoạt động và tiêu hao điện.'),
    Q('Đầu hút của block khi cân cáp?', ['Để hở', 'Hàn kín', 'Nối đồng hồ áp', 'Nối bình gas'], 0, 'Block hút không khí tự do vào.'),
    Q('Đầu cáp khi cân cáp?', ['Để hở, không hàn kín vào phin', 'Hàn kín vào phin', 'Nối vào dàn lạnh', 'Nối rắc co'], 0, 'Để thoát không khí.'),
    Q('Đồng hồ áp suất lắp ở đâu?', ['Trước phin', 'Sau ống mao', 'Ở đầu hút block', 'Trong block'], 0, 'Đo áp lực đứng trước cáp.'),
    Q('Dây đỏ của đồng hồ nối vào?', ['Phía đầu ống mao', 'Đầu đẩy block', 'Đầu hút block', 'Dàn lạnh'], 0, 'Dây vàng mới nối đầu đẩy block.'),
    Q('Dây vàng của đồng hồ nối vào?', ['Đầu đẩy block', 'Phía đầu ống mao', 'Phin', 'Đầu hút block'], 0, 'Theo sơ đồ nguồn.'),
    Q('Phin dùng khi cân cáp có?', ['2 ngăn', '1 ngăn', '3 ngăn', 'Không có ngăn'], 0, 'Một ngăn ti sạc, một ngăn cáp.'),
    Q('Ngăn của phin hàn với ti sạc gas là?', ['Một trong hai ngăn', 'Cả hai ngăn', 'Không ngăn nào', 'Đầu hút'], 0, 'Ngăn còn lại hàn với cáp.'),
    Q('P1 là giá trị?', ['Cao nhất kim áp kế đạt được', 'Thấp nhất của kim', 'Áp suất khí quyển', 'Áp suất hút'], 0, 'Cho biết trở kháng ống mao.'),
    Q('P1 lớn thì?', ['Cắt bớt ống mao', 'Nối thêm ống mao', 'Nạp thêm gas', 'Đổi block'], 0, 'Cáp cản quá nhiều.'),
    Q('P1 nhỏ thì?', ['Nối thêm ống mao', 'Cắt bớt ống mao', 'Hút chân không', 'Thay phin'], 0, 'Cần tăng lực trở.'),
    Q('Cách 1 do ai thường dùng?', ['Thợ lành nghề, kỹ thuật cao', 'Người mới học', 'Chỉ nhà máy', 'Không ai'], 0, 'Theo nguồn.'),
    Q('Cách 2 đo trên?', ['Hệ thống đã lắp hoàn chỉnh', 'Block tháo rời', 'Chỉ dàn lạnh', 'Phin riêng'], 0, 'Đo trở lực ống mao trong hệ thống hoàn chỉnh.'),
    Q('Ở cách 2, độ dài ống mao lấy theo?', ['Giá trị định hướng, thêm chiều dài dự trữ', 'Ước chừng bằng mắt', 'Bằng chiều dài dàn nóng', 'Gấp đôi ống cũ'], 0, 'Dự trữ để còn cắt chỉnh.'),
    Q('Máy lạnh NON Inverter R22 có cân cáp khoảng?', ['90 – 100 psi', '200 – 220 psi', '330 – 350 psi', '260 psi'], 0, 'Theo bảng.'),
    Q('Tủ đông R600a có cân cáp khoảng?', ['330 – 350 psi', '90 – 100 psi', '100 – 120 psi', '200 psi'], 0, 'Theo bảng.'),
    Q('Tủ lạnh R134a (quạt, coil) có cân cáp khoảng?', ['200 – 220 psi', '90 – 100 psi', '330 – 350 psi', '100 – 120 psi'], 0, 'Theo bảng.'),
    Q('Dùng bảng cân cáp nên kết hợp với?', ['Nhiệt độ môi trường hiện tại', 'Màu vỏ tủ', 'Hãng sản xuất bóng đèn', 'Số ngăn tủ'], 0, 'Nhiệt độ môi trường ảnh hưởng áp suất.'),
    Q('Nên hàn ống mao trực tiếp với?', ['Rắc co', 'Dàn lạnh', 'Vỏ block', 'Đầu hút'], 0, 'Theo lưu ý của bài.'),
    Q('Vì sao làm theo sơ đồ lắp đo?', ['Hạn chế không khí ngưng tụ làm ẩm hệ thống', 'Để tủ chạy êm', 'Để tiết kiệm que hàn', 'Để đo dòng điện'], 0, 'Tránh ẩm trong hệ thống.')
  ];
  const sort = {
    title: 'Cách 1, cách 2 hay cả hai?',
    buckets: [{ id: 'c1', name: 'Cách 1' }, { id: 'c2', name: 'Cách 2' }, { id: 'both', name: 'Cả hai cách' }],
    items: [
      { t: 'Dùng phin 2 ngăn (ti sạc + cáp)', b: 'c1' }, { t: 'Đọc giá trị cao nhất P1', b: 'c1' }, { t: 'Thợ lành nghề, kỹ thuật cao', b: 'c1' },
      { t: 'Lắp cáp vào hệ thống đã hoàn chỉnh', b: 'c2' }, { t: 'Thêm chiều dài dự trữ cho ống mao', b: 'c2' },
      { t: 'Lắp áp kế trước phin', b: 'both' }, { t: 'Để đầu ống mao/ ống nạp tự do trong không khí', b: 'both' }, { t: 'Đo trở lực của không khí', b: 'both' }
    ]
  };
  const order = [
    { title: 'Cân cáp theo cách 1', intro: 'Từ lắp đo đến chỉnh cáp.', steps: ['Dùng phin 2 ngăn: ti sạc một ngăn, cáp một ngăn', 'Nối ống mao vào phin và đầu đẩy block', 'Lắp đồng hồ áp suất trước phin', 'Để hở đầu hút block và đầu ống mao', 'Cho block chạy, đọc P1 cao nhất', 'P1 lớn thì cắt bớt, P1 nhỏ thì nối thêm ống mao'] },
    { title: 'Cân cáp theo cách 2', intro: 'Trên hệ thống hoàn chỉnh.', steps: ['Lắp ống mao vào hệ thống hoàn chỉnh', 'Lấy độ dài theo giá trị định hướng, thêm dự trữ', 'Lắp áp kế trước phin lọc', 'Để ống nạp tự do trong không khí', 'Đo trở lực không khí rồi so với bảng'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 8, ready: true, title: 'Cân cáp tủ lạnh', sub: 'Đo trở lực ống mao, sơ đồ lắp đo, bảng thông số', minutes: 20,
    lead: 'Cân cáp là chọn độ dài ống mao cho hợp với block: khi nào cần cân, sơ đồ lắp đo, hai cách đo P1, cách chỉnh cáp và bảng thông số theo loại tủ, môi chất.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
