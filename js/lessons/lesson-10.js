/* BÀI 10 — RƠLE THỜI GIAN (ĐỒNG HỒ XẢ TUYẾT) (biên soạn từ docs/Bai_10.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  function camSVG(th, mode, stuck) {
    const cx = 130, cy = 120, r = 90, defr = 22; // cung xả tuyết 22°
    const a0 = (360 - defr) * Math.PI / 180, ang = a => `${cx + r * Math.sin(a)} ${cy - r * Math.cos(a)}`;
    const arc = `M${cx} ${cy}L${ang(a0)}A${r} ${r} 0 0 1 ${ang(2 * Math.PI - .0001)}Z`;
    const ptr = th * Math.PI / 180;
    const cold = mode === 'cool', ok = !stuck;
    return `<svg viewBox="0 0 560 250" role="img" aria-label="Bánh cam rơle thời gian đang ở chế độ ${cold ? 'làm lạnh' : 'xả tuyết'}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="3"/><path d="${arc}" fill="var(--hot-tint)" stroke="var(--hot)" stroke-width="2"/>
      <path d="M${cx} ${cy}L${ang(ptr)}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="var(--ink)"/>
      <text class="fl" x="${cx - 40}" y="${cy + 40}" style="fill:var(--ink)">làm lạnh</text><text class="fl" x="${cx + 28}" y="${cy - 80}" style="fill:var(--hot)">xả tuyết</text>
      <text class="sub" x="${cx}" y="236" text-anchor="middle">một vòng cam = 1 chu kỳ (lạnh + xả tuyết)</text>
      <g transform="translate(290 40)">
        <text class="lbl" x="0" y="8">Chân 3 → 4  (chế độ DÀI)</text><rect x="0" y="16" width="240" height="14" rx="7" fill="var(--line)"/><rect x="0" y="16" width="${cold ? 240 : 0}" height="14" rx="7" fill="var(--ok)"/>
        <text class="sub" x="0" y="48">→ block + quạt gió: <tspan font-weight="700" style="fill:${cold ? 'var(--ok)' : 'var(--muted)'}">${cold ? 'CÓ ĐIỆN' : 'ngắt'}</tspan></text>
        <text class="lbl" x="0" y="86">Chân 3 → 2  (chế độ NGẮN)</text><rect x="0" y="94" width="240" height="14" rx="7" fill="var(--line)"/><rect x="0" y="94" width="${cold ? 0 : 240}" height="14" rx="7" fill="var(--hot)"/>
        <text class="sub" x="0" y="126">→ điện trở sấy xả tuyết: <tspan font-weight="700" style="fill:${cold ? 'var(--muted)' : 'var(--hot)'}">${cold ? 'ngắt' : 'CÓ ĐIỆN'}</tspan></text>
        <text class="sub" x="0" y="160" style="fill:${ok ? 'var(--ok)' : 'var(--bad)'}">${ok ? 'Động cơ rơle quay bình thường' : 'Rơle bị kẹt, không chuyển chế độ!'}</text></g></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-why" data-toc="1 · Vì sao cần xả tuyết">
  <div class="sec-n">Phần 1</div><h2>Rơle thời gian (đồng hồ xả tuyết)</h2>
  <p>Ở <b>tủ lạnh gián tiếp</b>, quạt thổi gió qua dàn lạnh. Hơi ẩm trong tủ <b>đóng tuyết</b> dần lên dàn. Tuyết dày làm <b>gió không đối lưu được</b> qua dàn → tủ <b>kém lạnh</b> rồi mất lạnh. Vì vậy phải định kỳ <b>sấy tan tuyết</b> — việc này do <b>rơle thời gian</b> tự động làm.</p>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Công dụng</b><p>Điều khiển nguồn cho <b>block + quạt gió</b> (chạy lạnh) và cho <b>điện trở sấy xả tuyết</b>, theo chu kỳ hoàn toàn tự động: chạy lạnh một thời gian dài → xả tuyết một thời gian ngắn → lặp lại.</p></div></div>
  <div class="grid2"><div class="panel okc" style="margin:0"><h4>Chạy lạnh</h4><p style="margin:6px 0 0">Khoảng <b>6 – 8 giờ</b>: block + quạt chạy, dàn đóng tuyết.</p></div><div class="panel hotc" style="margin:0"><h4>Xả tuyết</h4><p style="margin:6px 0 0">Khoảng <b>15 – 30 phút</b>: block + quạt dừng, điện trở sấy làm tan tuyết.</p></div></div>
</section>

<section class="sec" id="s-build" data-toc="2 · Cấu tạo, nguyên lý">
  <div class="sec-n">Phần 2</div><h2>Cấu tạo và nguyên lý</h2>
  <dl class="kv"><dt>① Động cơ nhỏ</dt><dd>Động cơ điện công suất nhỏ, điện trở cuộn dây khoảng <b>5 – 30 kΩ</b>, quay rất chậm.</dd><dt>② Hệ bánh răng</dt><dd>Giảm tốc: truyền chuyển động từ rô-to tới bánh cam.</dd><dt>③ Bánh cam</dt><dd>Có gờ/khuyết, quay <b>một vòng</b> = một chu kỳ. Khi quay tác động vào tiếp điểm.</dd><dt>④ Tiếp điểm</dt><dd>Gạt chuyển giữa hai trạng thái: <b>chân 3 nối 4</b> (chế độ <b>dài</b> → block + quạt) hoặc <b>chân 3 nối 2</b> (chế độ <b>ngắn</b> → sấy).</dd></dl>
  <p>Động cơ rơle luôn có điện nên bánh cam <b>luôn quay chậm</b>; đến vị trí khuyết, tiếp điểm chuyển sang xả tuyết, hết đoạn thì chuyển về chạy lạnh.</p>
  <h3 style="margin-top:22px">🔬 Mô phỏng một chu kỳ (1 vòng ≈ 15 giây thật)</h3>
  <div class="stage"><div id="camSvg"></div>
    <div style="padding:0 16px"><div class="muted" style="font-size:14px">Lớp tuyết trên dàn lạnh</div><div class="bar" style="height:16px;margin:6px 0"><i id="frost" style="width:0;background:var(--cold-l)"></i></div><div class="muted" id="frostTxt" style="font-size:14px"></div></div>
    <div class="controls"><label>Tình trạng rơle <select id="cFault" class="btn sm" style="min-height:36px"><option value="ok">Tốt</option><option value="coolstuck">Kẹt ở chế độ DÀI (không xả được)</option><option value="defstuck">Kẹt ở chế độ NGẮN (xả mãi)</option></select></label><button class="btn sm" id="cRs">↺ Làm lại</button></div>
    <div class="verdict" id="cV" style="margin:0 14px 12px"></div></div>
</section>

<section class="sec" id="s-types" data-toc="3 · Phân loại, nhận biết chân">
  <div class="sec-n">Phần 3</div><h2>Hai loại rơle thời gian và cách nhận biết</h2>
  <p>Hai loại giống hệt nhau về hình dạng, chỉ khác <b>vị trí chân cấp nguồn cho động cơ rơle</b>:</p>
  <div id="tTabs"></div><article class="panel" id="tPanel" aria-live="polite"></article>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Chân</th><th>Loại 1 (động cơ 1–3)</th><th>Loại 2 (động cơ 1–4)</th></tr></thead><tbody>
    <tr><th>1</th><td>Nguồn từ <b>điện trở sấy / cầu chì nhiệt</b></td><td>Nguồn từ <b>sò lạnh</b> (cảm biến âm)</td></tr>
    <tr><th>2</th><td>Nối <b>sò lạnh</b></td><td>Nối <b>điện trở sấy / cầu chì</b></td></tr>
    <tr><th>3</th><td>Nối <b>thermostat</b> (chân chung)</td><td>Nối <b>thermostat</b> (chân chung)</td></tr>
    <tr><th>4</th><td>Nối <b>block + quạt</b></td><td>Nối <b>block + quạt</b></td></tr></tbody></table></div>
  <div class="callout"><span class="ic">⚠️</span><div><b class="t">Không được lắp sai loại</b><p>Hai loại hình dạng giống nhau nhưng nếu thay nhầm, <b>mạch điện không đảm bảo làm lạnh</b>. Nếu bắt buộc thay loại khác, phải <b>đổi vị trí dây sò lạnh ↔ sấy/cầu chì</b> (chân 1 ↔ 2) theo sơ đồ loại mới.</p></div></div>
  <h3 style="margin-top:26px">🔬 Thực hành: rơle này là loại nào?</h3>
  <p>Đồng hồ vạn năng <b>x1 kΩ</b> (5–30 kΩ là điện trở động cơ). Dùng tô-vít xoay trục cam để chuyển giữa <b>chế độ dài</b> (3 nối 4) và <b>chế độ ngắn</b> (3 nối 2). Đo các cặp chân ở cả hai vị trí.</p>
  <div class="panel"><div class="row"><b>Vị trí cam:</b><button class="btn sm" id="camA" aria-pressed="true">Chế độ DÀI (3–4)</button><button class="btn sm" id="camB">Chế độ NGẮN (3–2)</button><button class="btn sm" id="lNew">🔄 Rơle mới</button></div>
    <div class="row" id="lBtns" style="margin-top:10px">${['1–3', '1–4', '1–2', '3–4', '3–2'].map(p => `<button class="btn sm" data-p="${p}">Đo ${p}</button>`).join('')}</div>
    <div class="tscroll"><table class="cmp"><thead><tr><th>Cặp chân</th><th>Cam ở chế độ DÀI</th><th>Cam ở chế độ NGẮN</th></tr></thead><tbody id="lTab"></tbody></table></div>
    <div class="row" style="margin-top:10px"><b>Kết luận:</b><select id="lAns" class="btn sm" style="min-height:40px"><option value="">— chọn —</option><option value="1">Loại 1 (động cơ chân 1–3)</option><option value="2">Loại 2 (động cơ chân 1–4)</option></select><button class="btn pri sm" id="lChk">Kiểm tra</button></div><div id="lRes" style="margin-top:10px"></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo phân biệt nhanh</b><p>Đo <b>1 – 3</b> ở cả hai vị trí cam: <b>cả hai đều thấy 5–30 kΩ</b> → loại <b>1</b>. <b>Một lần lên, một lần ∞</b> → loại <b>2</b>. Ngoài ra: nhìn <b>chân nguồn động cơ</b> kẹp ở hai chân đầu (1 và 4) → loại 2; ở chân ngoài cùng và chân kế 3 → loại 1. Hoặc nhìn mạch: chân 2 nối sò lạnh → loại 1; chân 2 nối sấy/cầu chì → loại 2.</p></div></div>
  <p>Nếu chân <b>không có ký hiệu số</b>: đo hai chân ngoài cùng ở cả hai vị trí cam — nếu <b>thông mạch</b> thì đó là chân <b>4</b>; nếu có điện trở 5–30 kΩ thì chân ngoài cùng là chân <b>1</b>. Chân có màu riêng hoặc tách riêng thường là chân 1.</p>
</section>

<section class="sec" id="s-fault" data-toc="4 · Hư hỏng, kiểm tra">
  <div class="sec-n">Phần 4</div><h2>Hư hỏng, kiểm tra và thay thế</h2>
  <p>Rơle gồm 3 phần: <b>động cơ, tiếp điểm, hệ bánh răng</b>; hỏng một trong ba là rơle hỏng.</p>
  <div class="grid2"><div class="panel hotc" style="margin:0"><h4>Tủ không hoạt động, chỉ đèn sáng</h4><p style="margin:6px 0 0">Rơle kẹt ở <b>chế độ ngắn</b> (3–2): block + quạt không có điện, sấy làm việc. Cũng giống khi mất nguồn, hỏng thermostat, rơle bảo vệ, rơle khởi động, dây bị chuột cắn...</p></div>
    <div class="panel hotc" style="margin:0"><h4>Tủ chạy nhưng kém lạnh dần rồi mất lạnh</h4><p style="margin:6px 0 0">Rơle kẹt ở <b>chế độ dài</b> (không chuyển sang xả) → <b>tuyết bám kín dàn</b>. Tháo tấm xốp trắng phía trước sẽ thấy tuyết đóng dày.</p></div></div>
  <h3 style="margin-top:22px">Kiểm tra 3 phần</h3>
  ${U.steps([['Động cơ: đo cuộn dây (x1 kΩ)', 'Chân 1–3 (loại 1) hoặc 1–4 (loại 2): <b>5 – 30 kΩ</b> là không đứt.'], ['Tiếp điểm: thang x1 Ω, xoay trục cam', 'Đo 3–4 và 3–2: khi xoay cam, trạng thái đóng – ngắt phải <b>đổi</b> (3–4 thông ↔ 3–2 thông).'], ['Bánh răng: cấp nguồn 220 V cho động cơ', 'Nhìn qua <b>mắt kính</b> (cửa sổ) trên thân: bánh răng/rô-to quay là tốt. Rơle vỏ trong thì quan sát trực tiếp.'], ['Rơle có tụ nối tiếp với cuộn dây?', 'Dùng thang <b>x10k</b>, đảo chiều que đo: kim lên rồi về nhanh (tụ nạp xả) → động cơ tốt.']])}
  <div class="callout"><span class="ic">🔧</span><div><b class="t">Thay thế</b><p>Chọn rơle theo <b>hình dạng, chủng loại, điện áp sử dụng</b> ghi trên thân (VD 220–240 V, 50/60 Hz). Khác loại thì phải đổi vị trí dây (sò lạnh ↔ sấy/cầu chì, hoặc dây chân 3 ↔ 4 tùy mạch).</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Rơle thời gian chỉ có ở tủ gián tiếp, để xả tuyết tự động.</b></div></li>
    <li class="done"><div><b>Chạy lạnh 6–8 giờ, xả tuyết 15–30 phút.</b></div></li>
    <li class="done"><div><b>Gồm động cơ nhỏ, bánh răng, bánh cam, tiếp điểm.</b><span>Cam quay một vòng = một chu kỳ.</span></div></li>
    <li class="done"><div><b>Chân 3–4: chế độ dài (block + quạt). Chân 3–2: chế độ ngắn (sấy).</b></div></li>
    <li class="done"><div><b>Loại 1: động cơ 1–3; loại 2: động cơ 1–4. Đừng lắp sai loại.</b></div></li>
    <li class="done"><div><b>Kẹt chế độ dài → tuyết bám kín, kém lạnh. Kẹt chế độ ngắn → chỉ đèn sáng.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/10/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const TYPES = {
    l1: ['Loại 1 (còn gọi “13”)', '<p>Động cơ rơle cấp nguồn ở <b>chân 1 và chân 3</b>. Chân 1 nhận nguồn từ <b>điện trở sấy / cầu chì nhiệt</b>; chân 2 nối <b>sò lạnh</b>.</p>'],
    l2: ['Loại 2 (còn gọi “14”)', '<p>Động cơ rơle cấp nguồn ở <b>chân 1 và chân 4</b> (hai chân đầu). Chân 1 nhận nguồn từ <b>sò lạnh</b>; chân 2 nối <b>điện trở sấy / cầu chì</b>.</p>']
  };

  function mount(root) {
    // mô phỏng
    let th = 0, f = 0, tm, cnt = 0;
    const reset = () => { clearInterval(tm); th = 0; f = 0; cnt = 0; tm = setInterval(tick, 50); tick(); };
    function tick() {
      if (!document.body.contains($('#camSvg', root))) { clearInterval(tm); return; }
      const ft = $('#cFault', root).value; let mode;
      if (ft === 'coolstuck') { th = Math.min(th, 300); mode = 'cool'; } else if (ft === 'defstuck') { th = 350; mode = 'defrost'; } else { th = (th + 1.2) % 360; mode = th >= 338 ? 'defrost' : 'cool'; }
      f = Math.max(0, Math.min(1, f + (mode === 'cool' ? .0016 : -.03)));
      if (ft === 'coolstuck') f = Math.min(1, f + .0008);
      $('#camSvg', root).innerHTML = camSVG(th, mode, ft !== 'ok');
      $('#frost', root).style.width = f * 100 + '%'; $('#frost', root).style.background = f > .7 ? 'var(--bad)' : 'var(--cold-l)';
      $('#frostTxt', root).textContent = `Tuyết ${Math.round(f * 100)}% · độ thông gió qua dàn ${Math.round((1 - f) * 100)}%`;
      const v = $('#cV', root);
      if (ft === 'ok') { v.className = 'verdict ok'; v.innerHTML = mode === 'cool' ? 'Đang <b>chạy lạnh</b>: block + quạt chạy, tuyết tích tụ dần.' : 'Đang <b>xả tuyết</b>: block + quạt dừng, sấy làm tan tuyết → dàn sạch rồi quay lại chạy lạnh.'; }
      else if (ft === 'coolstuck') { v.className = 'verdict bad'; v.innerHTML = f > .7 ? '✗ Không bao giờ xả tuyết → <b>tuyết bám kín dàn</b>, gió không qua được → tủ <b>kém lạnh rồi mất lạnh</b>.' : '✗ Rơle kẹt ở chế độ dài: tuyết vẫn tăng dần…'; }
      else { v.className = 'verdict bad'; v.innerHTML = '✗ Rơle kẹt ở chế độ ngắn: block + quạt <b>không có điện</b>, chỉ sấy làm việc. Tủ <b>không chạy, chỉ đèn sáng</b>; nhiệt độ trong tủ tăng.'; }
    }
    $('#cFault', root).onchange = reset; $('#cRs', root).onclick = reset; reset();
    // phân loại tab
    U.tabset($('#tTabs', root), [{ id: 'l1', name: 'Loại 1', sub: 'động cơ 1–3' }, { id: 'l2', name: 'Loại 2', sub: 'động cơ 1–4' }], id => { $('#tPanel', root).innerHTML = `<h3>${TYPES[id][0]}</h3>${TYPES[id][1]}`; });
    // phòng đo
    let L, cam = 'A', rd;
    const kohm = () => 5 + Math.floor(Math.random() * 25);
    const path = (a, b) => {
      const edges = [L.type === 1 ? ['1', '3', L.rm] : ['1', '4', L.rm], cam === 'A' ? ['3', '4', 0] : ['3', '2', 0]];
      const dfs = (n, seen) => { if (n === b) return 0; for (const e of edges) { const o = e[0] === n ? e[1] : e[1] === n ? e[0] : null; if (o && !seen.has(o)) { const r = dfs(o, new Set([...seen, o])); if (r !== null) return r + e[2]; } } return null; };
      const r = dfs(a, new Set([a])); return r === null ? Infinity : r;
    };
    const fmt = r => r === Infinity ? '∞ (kim không lên)' : r === 0 ? '0 Ω (thông)' : r + ' kΩ';
    const tab = () => { $('#lTab', root).innerHTML = ['1–3', '1–4', '1–2', '3–4', '3–2'].map(p => `<tr><th>${p}</th><td>${rd[p + 'A'] || '…'}</td><td>${rd[p + 'B'] || '…'}</td></tr>`).join(''); };
    const mk = () => { L = { type: Math.random() < .5 ? 1 : 2, rm: kohm() }; rd = {}; cam = 'A'; $('#camA', root).setAttribute('aria-pressed', 'true'); $('#camB', root).removeAttribute('aria-pressed'); tab(); $('#lRes', root).innerHTML = ''; $('#lAns', root).value = ''; };
    mk();
    $('#camA', root).onclick = () => { cam = 'A'; $('#camA', root).setAttribute('aria-pressed', 'true'); $('#camB', root).removeAttribute('aria-pressed'); };
    $('#camB', root).onclick = () => { cam = 'B'; $('#camB', root).setAttribute('aria-pressed', 'true'); $('#camA', root).removeAttribute('aria-pressed'); };
    $('#lNew', root).onclick = mk;
    $$('#lBtns [data-p]', root).forEach(b => b.onclick = () => { const p = b.dataset.p, [x, y] = p.split('–'); rd[p + cam] = fmt(path(x, y)); tab(); });
    $('#lChk', root).onclick = () => {
      const v = $('#lAns', root).value, r = $('#lRes', root); if (!v) { r.innerHTML = '<div class="why">Hãy chọn kết luận.</div>'; return; }
      r.innerHTML = `<div class="why" style="border-color:var(--${+v === L.type ? 'ok' : 'bad'})"><b>${+v === L.type ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> Đây là rơle <b>loại ${L.type}</b> (động cơ chân ${L.type === 1 ? '1–3' : '1–4'}, ${L.rm} kΩ). ${L.type === 1 ? 'Đo 1–3 ở cả hai vị trí cam đều thấy điện trở động cơ.' : 'Đo 1–3 chỉ thấy điện trở khi cam ở chế độ DÀI (3 nối 4); ở chế độ NGẮN là ∞.'}</div>`;
    };
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Rơle thời gian được lắp ở tủ lạnh loại nào?', b: 'Tủ lạnh <b>gián tiếp</b> (quạt gió).', tag: 'Công dụng' },
    { f: 'Vì sao tủ gián tiếp phải xả tuyết?', b: 'Tuyết bám kín dàn → gió không đối lưu → tủ <b>kém lạnh, mất lạnh</b>.', tag: 'Công dụng' },
    { f: 'Rơle thời gian còn gọi là?', b: '<b>Đồng hồ xả tuyết</b> (đồng hồ xả đá).', tag: 'Công dụng' },
    { f: 'Công dụng của rơle thời gian?', b: 'Điều khiển nguồn cho <b>block + quạt</b> (chạy lạnh) và cho <b>sấy</b> (xả tuyết) tự động theo chu kỳ.', tag: 'Công dụng' },
    { f: 'Thời gian chạy lạnh và xả tuyết?', b: 'Chạy lạnh khoảng <b>6–8 giờ</b>, xả tuyết <b>15–30 phút</b>.', tag: 'Công dụng' },
    { f: 'Cấu tạo rơle thời gian?', b: 'Động cơ nhỏ, hệ bánh răng, bánh cam, tiếp điểm.', tag: 'Cấu tạo' },
    { f: 'Điện trở động cơ rơle thời gian?', b: 'Khoảng <b>5 – 30 kΩ</b> (công suất nhỏ).', tag: 'Cấu tạo' },
    { f: 'Bánh cam quay một vòng ứng với?', b: 'Một chu kỳ: <b>chạy lạnh + xả tuyết</b>.', tag: 'Cấu tạo' },
    { f: 'Chân 3 nối 4 là chế độ nào? Điều khiển gì?', b: 'Chế độ <b>dài</b> — block + quạt gió (làm lạnh).', tag: 'Nguyên lý' },
    { f: 'Chân 3 nối 2 là chế độ nào? Điều khiển gì?', b: 'Chế độ <b>ngắn</b> — điện trở sấy xả tuyết.', tag: 'Nguyên lý' },
    { f: 'Chân nào nối thermostat?', b: '<b>Chân 3</b> (chân chung của tiếp điểm).', tag: 'Nguyên lý' },
    { f: 'Chân 4 nối với?', b: '<b>Block và quạt gió</b>.', tag: 'Nguyên lý' },
    { f: 'Hai loại rơle thời gian khác nhau ở đâu?', b: 'Vị trí chân cấp nguồn cho <b>động cơ rơle</b>: loại 1 là chân 1–3; loại 2 là chân 1–4.', tag: 'Phân loại' },
    { f: 'Loại 1: chân 1 và chân 2 nối với?', b: 'Chân 1: sấy/cầu chì; chân 2: <b>sò lạnh</b>.', tag: 'Phân loại' },
    { f: 'Loại 2: chân 1 và chân 2 nối với?', b: 'Chân 1: <b>sò lạnh</b>; chân 2: sấy/cầu chì.', tag: 'Phân loại' },
    { f: 'Mẹo phân biệt: đo 1–3 ở hai vị trí cam, cả hai thấy 5–30 kΩ?', b: 'Loại <b>1</b>.', tag: 'Phân loại' },
    { f: 'Đo 1–3: một lần có điện trở, một lần ∞?', b: 'Loại <b>2</b>.', tag: 'Phân loại' },
    { f: 'Thay rơle khác loại cần làm gì?', b: 'Đổi vị trí dây (sò lạnh ↔ sấy/cầu chì ở chân 1, 2) theo sơ đồ mới.', tag: 'Phân loại' },
    { f: 'Chân rơle không có số: nhận biết chân 1 bằng?', b: 'Chân có <b>màu riêng</b> hoặc <b>tách rời</b>; hoặc nhờ phép đo điện trở.', tag: 'Phân loại' },
    { f: 'Đo hai chân ngoài cùng, thông mạch ở cả hai vị trí cam: đó là chân?', b: 'Chân <b>4</b>.', tag: 'Phân loại' },
    { f: 'Rơle kẹt ở chế độ dài, tủ ra sao?', b: 'Không xả tuyết → <b>tuyết bám kín dàn</b> → kém lạnh dần, mất lạnh.', tag: 'Hư hỏng' },
    { f: 'Rơle kẹt ở chế độ ngắn, tủ ra sao?', b: 'Block + quạt không có điện → <b>chỉ đèn sáng, tủ không chạy</b>.', tag: 'Hư hỏng' },
    { f: 'Hư hỏng rơle thời gian ở những phần nào?', b: 'Động cơ, bánh răng, tiếp điểm.', tag: 'Hư hỏng' },
    { f: 'Kiểm tra động cơ rơle?', b: 'Đo điện trở cuộn dây: <b>5–30 kΩ</b> là không đứt.', tag: 'Kiểm tra' },
    { f: 'Kiểm tra tiếp điểm rơle?', b: 'Thang x1 Ω, xoay trục cam: trạng thái đóng – ngắt phải <b>thay đổi</b>.', tag: 'Kiểm tra' },
    { f: 'Kiểm tra bánh răng?', b: 'Cấp 220 V cho động cơ, nhìn qua <b>mắt kính</b> thấy bánh răng quay.', tag: 'Kiểm tra' },
    { f: 'Vì sao đôi khi đo động cơ rơle bằng x10k đảo que?', b: 'Cuộn dây có <b>tụ nối tiếp</b>: nạp xả của tụ làm kim lên rồi về nhanh.', tag: 'Kiểm tra' },
    { f: 'Chọn rơle thay thế dựa vào?', b: '<b>Hình dạng, chủng loại, điện áp</b> ghi trên thân.', tag: 'Thay thế' },
    { f: 'Tuyết bám kín dàn: quan sát thế nào?', b: 'Tháo tấm xốp trắng (che kênh gió) phía trước dàn.', tag: 'Thay thế' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Rơle thời gian dùng ở tủ?', ['Trực tiếp 1 cánh', 'Gián tiếp (quạt gió)', 'Mọi loại', 'Không dùng'], 1, 'Dàn có quạt dễ đóng tuyết.'),
    Q('Nhiệm vụ chính?', ['Xả tuyết tự động theo chu kỳ', 'Khởi động block', 'Bảo vệ quá tải', 'Đo nhiệt độ'], 0, 'Đồng hồ xả tuyết.'),
    Q('Thời gian chạy lạnh khoảng?', ['6 – 8 giờ', '15 phút', '1 phút', '48 giờ'], 0, 'Theo bài giảng.'),
    Q('Thời gian xả tuyết khoảng?', ['15 – 30 phút', '6 giờ', '1 giây', '3 giờ'], 0, 'Đủ làm tan tuyết.'),
    Q('Tuyết bám kín dàn gây?', ['Tủ kém lạnh', 'Tủ lạnh sâu', 'Tủ ồn', 'Không đổi'], 0, 'Gió không đối lưu.'),
    Q('Điện trở động cơ rơle khoảng?', ['5 – 30 kΩ', '1 Ω', '1 MΩ', '500 Ω'], 0, 'Động cơ công suất nhỏ.'),
    Q('Bánh cam quay một vòng ứng với?', ['Một chu kỳ lạnh + xả', 'Một phút', 'Một ngày', 'Không gì'], 0, 'Hết chu kỳ.'),
    Q('Chân 3 nối 4 điều khiển?', ['Block và quạt', 'Sấy', 'Đèn', 'Thermostat'], 0, 'Chế độ dài.'),
    Q('Chân 3 nối 2 điều khiển?', ['Sấy xả tuyết', 'Block', 'Quạt', 'Đèn'], 0, 'Chế độ ngắn.'),
    Q('Chân 3 thường nối với?', ['Thermostat', 'Sò lạnh', 'Cầu chì', 'Block'], 0, 'Chân chung.'),
    Q('Chân 4 nối với?', ['Block và quạt', 'Sấy', 'Sò lạnh', 'Đèn'], 0, 'Chạy lạnh.'),
    Q('Hai loại rơle khác nhau ở?', ['Vị trí chân nguồn động cơ rơle', 'Màu vỏ', 'Hãng', 'Số bánh răng'], 0, 'Loại 1: 1–3; loại 2: 1–4.'),
    Q('Loại 1: chân 2 nối với?', ['Sò lạnh', 'Sấy', 'Block', 'Thermostat'], 0, 'Chân 1 nối sấy/cầu chì.'),
    Q('Loại 2: chân 1 nối với?', ['Sò lạnh', 'Sấy', 'Block', 'Quạt'], 0, 'Chân 2 nối sấy/cầu chì.'),
    Q('Đo 1–3 cả hai vị trí cam đều có 5–30 kΩ: loại?', ['Loại 1', 'Loại 2', 'Hỏng', 'Không xác định'], 0, 'Động cơ nối trực tiếp 1–3.'),
    Q('Đo 1–3: một lần có điện trở, một lần ∞: loại?', ['Loại 2', 'Loại 1', 'Hỏng', 'Điện tử'], 0, 'Phải qua tiếp điểm 3–4.'),
    Q('Rơle kẹt chế độ dài → ?', ['Tuyết bám kín, kém lạnh', 'Chỉ đèn sáng', 'Tủ lạnh sâu', 'Sấy cháy'], 0, 'Không xả được.'),
    Q('Rơle kẹt chế độ ngắn → ?', ['Chỉ đèn sáng, tủ không chạy', 'Tuyết dày', 'Tủ lạnh sâu', 'Block quá tải'], 0, 'Mất nguồn block + quạt.'),
    Q('Đo tiếp điểm bằng thang?', ['x1 Ω', 'x10k', 'AC', 'DC'], 0, 'Đo thông mạch.'),
    Q('Xoay trục cam khi đo để làm gì?', ['Xem tiếp điểm có đổi trạng thái', 'Tăng điện trở', 'Đổi điện áp', 'Tháo rơle'], 0, 'Chuyển dài ↔ ngắn.'),
    Q('Kiểm tra bánh răng bằng cách?', ['Cấp nguồn, nhìn qua mắt kính', 'Đo điện trở', 'Nghe tiếng gõ', 'Cân'], 0, 'Thấy bánh răng quay.'),
    Q('Cuộn dây rơle có tụ nối tiếp: đo thế nào?', ['Thang x10k, đảo que', 'Thang x1 Ω', 'Không đo', 'Thang DC'], 0, 'Quan sát nạp xả của tụ.'),
    Q('Thay rơle khác loại phải?', ['Đổi vị trí dây theo sơ đồ loại mới', 'Giữ nguyên', 'Thêm tụ', 'Nối tắt chân 1–2'], 0, 'Để mạch đúng.'),
    Q('Khi chọn rơle thay thế cần đúng?', ['Hình dạng, loại, điện áp', 'Màu', 'Giá', 'Hãng'], 0, 'Thông số trên thân.'),
    Q('Tháo tấm xốp trắng phía trước dàn để?', ['Quan sát tuyết bám dàn', 'Thay block', 'Nạp gas', 'Đo áp'], 0, 'Kiểm tra tuyết.')
  ];
  const sort = {
    title: 'Hiện tượng / đặc điểm này thuộc chế độ nào?',
    buckets: [{ id: 'cool', name: 'Chế độ DÀI (3–4)' }, { id: 'def', name: 'Chế độ NGẮN (3–2)' }, { id: 'bad', name: 'Rơle hỏng' }],
    items: [
      { t: 'Block và quạt có điện', b: 'cool' }, { t: 'Kéo dài 6 – 8 giờ', b: 'cool' }, { t: 'Tuyết bám dần lên dàn', b: 'cool' }, { t: 'Nối thermostat – block – quạt', b: 'cool' },
      { t: 'Điện trở sấy có điện', b: 'def' }, { t: 'Kéo dài 15 – 30 phút', b: 'def' }, { t: 'Block và quạt dừng', b: 'def' }, { t: 'Tuyết tan, dàn thông thoáng', b: 'def' },
      { t: 'Kẹt chế độ dài: tuyết bám kín', b: 'bad' }, { t: 'Kẹt chế độ ngắn: chỉ đèn sáng', b: 'bad' }, { t: 'Động cơ rơle đứt (kim không lên)', b: 'bad' }, { t: 'Bánh răng không quay khi có điện', b: 'bad' }
    ]
  };
  const order = [
    { title: 'Một chu kỳ rơle thời gian', intro: 'Sắp xếp diễn biến.', steps: ['Động cơ rơle quay, bánh cam quay chậm', 'Tiếp điểm ở chế độ dài: block + quạt chạy lạnh', 'Tuyết bám dần lên dàn lạnh', 'Cam tới khuyết, tiếp điểm chuyển sang chế độ ngắn', 'Block + quạt dừng, sấy làm tan tuyết', 'Hết chu kỳ, tiếp điểm quay lại chế độ dài'] },
    { title: 'Nhận biết loại rơle thời gian', intro: 'Sắp xếp các bước đo.', steps: ['Chọn thang x1 kΩ, chỉnh kim về 0', 'Đặt que vào chân 1 và chân 3', 'Xoay trục cam sang chế độ dài, ghi kết quả', 'Xoay trục cam sang chế độ ngắn, ghi kết quả', 'Cả hai đều có điện trở thì loại 1', 'Một lần ∞ một lần có điện trở thì loại 2'] },
    { title: 'Kiểm tra rơle thời gian', intro: 'Sắp xếp quy trình kiểm tra.', steps: ['Đo cuộn dây động cơ rơle (5–30 kΩ)', 'Đo tiếp điểm, xoay cam xem đổi trạng thái', 'Cấp nguồn 220 V cho động cơ rơle', 'Quan sát bánh răng qua mắt kính', 'Cả ba phần tốt thì rơle tốt', 'Hỏng một phần thì thay rơle đúng loại'] }
  ];
  DL.register({
    id: 10, ready: true, title: 'Rơle thời gian (đồng hồ xả tuyết)', sub: 'Chu kỳ lạnh – xả, 2 loại, nhận biết chân, hư hỏng', minutes: 30,
    lead: 'Tủ gián tiếp cần xả tuyết định kỳ. Rơle thời gian tự chuyển giữa chạy lạnh và xả tuyết. Bài này mô phỏng bánh cam, cách nhận biết hai loại rơle và các hư hỏng thường gặp.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
