/* BÀI 8 — RƠLE KHỞI ĐỘNG BÁN DẪN (PTC) (biên soạn từ docs/Bai_8.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const TYPES = {
    t1: { name: 'Loại 1 vào – 2 ra', sub: '3 chân, không tụ', cs: 0, cr: 0, desc: 'Một chân vào, hai chân ra nối chân chạy (M) và chân đề (S). <b>Không có tụ.</b> PTC nối giữa nguồn chạy và cuộn đề.', test: [['Chân vào – chân M', 'Thông mạch (kim lên, R ≈ 0)'], ['Chân vào (hoặc M) – chân S', 'R của PTC: khoảng <b>10 – 50 Ω</b> (lúc nguội)']] },
    t2: { name: 'Loại 2 vào – 2 ra', sub: 'có tụ làm việc', cs: 0, cr: 1, desc: 'Có thêm <b>tụ làm việc (tụ ngậm, CR)</b> mắc <b>song song</b> với PTC. PTC cao trở thì tụ vẫn nạp xả, tiếp tục cấp dòng cho cuộn đề trong lúc block chạy.', test: [['Hai chân vào với nhau', 'Thông mạch'], ['Chân vào – chân M', 'Thông mạch'], ['Chân vào – chân S', 'R của PTC khoảng <b>10 – 50 Ω</b>']] },
    t3: { name: 'Loại 3 vào – 2 ra', sub: 'tụ kích + tụ làm việc', cs: 1, cr: 1, desc: 'Có cả <b>tụ kích (CS)</b> nối tiếp với PTC và <b>tụ làm việc (CR)</b> song song. Tụ kích giúp mô-men khởi động lớn; sau đó PTC cao trở, CR hỗ trợ khi chạy.', test: [['Chân 1 – chân M', 'Thông mạch'], ['Chân tụ (3) – chân S', 'Thông mạch'], ['Chân 1 – chân S (qua PTC)', 'R của PTC khoảng <b>10 – 50 Ω</b>']] }
  };

  function schemeSVG(t, hot) {
    const T = TYPES[t], g = "var(--muted)";
    const box = (x, y, w, h, lab, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${col}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" style="fill:var(--ink)">${lab}</text>`;
    const px = T.cs ? 240 : 200, pw = T.cs ? 64 : 70;
    return `<svg viewBox="0 0 560 250" role="img" aria-label="Mạch rơle bán dẫn ${T.name}">
      <circle cx="40" cy="125" r="20" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><text class="fl" x="40" y="129" text-anchor="middle">220V</text>
      <path d="M40 105V40H360M40 145V215H520V125" fill="none" stroke="${g}" stroke-width="3"/>
      <rect x="360" y="22" width="120" height="36" rx="10" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="3"/><text class="sub" x="420" y="45" text-anchor="middle" style="fill:var(--ink)">cuộn chạy</text>
      <path d="M480 40H520V125" fill="none" stroke="${g}" stroke-width="3"/><circle cx="520" cy="125" r="5" fill="var(--ink)"/><text class="fl" x="530" y="123">C</text>
      <circle cx="150" cy="40" r="5" fill="var(--ink)"/><text class="fl" x="138" y="28">R</text>
      <path d="M150 40V117M150 117H${px}M${px + pw} 117H330V170H360" fill="none" stroke="${g}" stroke-width="3"/><circle cx="330" cy="170" r="5" fill="var(--ink)"/><text class="fl" x="318" y="160">S</text>
      <rect x="360" y="152" width="120" height="36" rx="10" fill="var(--hot-tint)" stroke="var(--hot)" stroke-width="3"/><text class="sub" x="420" y="175" text-anchor="middle" style="fill:var(--ink)">cuộn đề</text>
      <path d="M480 170H520V125" fill="none" stroke="${g}" stroke-width="3"/>
      ${T.cs ? box(160, 104, 70, 26, "tụ kích", "var(--warn-tint)") + `<path d="M230 117H240" stroke="${g}" stroke-width="3"/>` : ""}
      ${box(px, 100, pw, 34, "PTC", hot ? "var(--hot-tint)" : "var(--ok-tint)")}
      ${T.cr ? `<path d="M150 117V190H200M270 190H330V170" fill="none" stroke="${g}" stroke-width="3"/>` + box(200, 177, 70, 26, "tụ chạy", "var(--warn-tint)") : ""}
      <text class="sub" x="280" y="242" text-anchor="middle">PTC ${hot ? "ĐANG NÓNG: R rất lớn, chặn dòng cuộn đề" : "còn nguội: R nhỏ, cho dòng vào cuộn đề"}</text></svg>`;
  }

  /* đồ thị R(t) và I(t) khi khởi động */
  function graphSVG(t) {
    const X = s => 50 + s / 5 * 480, Rf = s => 20 * Math.exp(Math.max(0, s - .8) * 3.2), Rc = s => Math.min(Rf(s), 20000);
    const Y = r => 190 - Math.log10(r / 10) / 3.5 * 150, I = s => 220 / (Rc(s) + 25);
    let pr = '', pi = '';
    for (let s = 0; s <= Math.min(5, t) + 1e-6; s += .05) { pr += `${pr ? 'L' : 'M'}${X(s).toFixed(1)} ${Y(Rc(s)).toFixed(1)}`; pi += `${pi ? 'L' : 'M'}${X(s).toFixed(1)} ${(190 - Math.min(I(s) / 5, 1) * 150).toFixed(1)}`; }
    return `<svg viewBox="0 0 600 230" role="img" aria-label="Đồ thị điện trở PTC và dòng cuộn đề theo thời gian">
      <path d="M50 190H540M50 190V30" stroke="var(--ink)" stroke-width="2" fill="none"/>
      ${[1, 2, 3, 4, 5].map(s => `<path d="M${X(s)} 190v5" stroke="var(--ink)"/><text class="fl" x="${X(s)}" y="210" text-anchor="middle">${s}s</text>`).join('')}
      ${[['10 Ω', 10], ['100 Ω', 100], ['1 kΩ', 1000], ['10 kΩ', 10000]].map(a => `<text class="fl" x="46" y="${Y(a[1]) + 4}" text-anchor="end">${a[0]}</text>`).join('')}
      <path d="${pr}" fill="none" stroke="var(--hot)" stroke-width="3.5"/><path d="${pi}" fill="none" stroke="var(--cold)" stroke-width="3.5"/>
      <text class="lbl" x="400" y="70" style="fill:var(--hot)">Điện trở PTC</text><text class="lbl" x="150" y="60" style="fill:var(--cold)">Dòng cuộn đề</text>
      <text class="fl" x="545" y="40" text-anchor="end">Dòng tới ~${(220 / 45).toFixed(1)} A rồi tụt về gần 0 khi PTC nóng lên</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-what" data-toc="1 · Rơle bán dẫn là gì">
  <div class="sec-n">Phần 1</div><h2>Rơle khởi động bán dẫn (PTC)</h2>
  <p>Giống rơle dòng, nó điều khiển nguồn cho <b>cuộn đề</b>: cho dòng đi qua lúc khởi động rồi chặn lại. Nhưng bên trong <b>không có cuộn dây hay tiếp điểm</b> — chỉ có một <b>miếng chất bán dẫn</b> hoạt động như <b>điện trở nhiệt dương (PTC)</b>: <b>nhiệt độ tăng → điện trở tăng rất nhanh</b>. Còn gọi là rơle điện tử.</p>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ</b><p>PTC = “<b>P</b>ositive <b>T</b>emperature <b>C</b>oefficient”: nóng thì trở <b>tăng</b>. Giống ấm đun: dòng lớn làm nóng, nóng thì tự chặn dòng.</p></div></div>
  <h3 style="margin-top:22px">3 loại thường gặp</h3>
  <div id="tTabs"></div>
  <div class="grid2" style="margin-top:14px;align-items:start"><div class="stage" style="margin:0" id="sSvg"></div><article class="panel" id="tPanel" aria-live="polite"></article></div>
</section>

<section class="sec" id="s-work" data-toc="2 · Nguyên lý">
  <div class="sec-n">Phần 2</div><h2>Nguyên lý làm việc</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Mới cấp điện: PTC còn nguội</b><span>Điện trở thấp (khoảng <b>10 – 50 Ω</b>) nên dòng đi qua PTC vào <b>cuộn đề</b> → hai cuộn lệch pha → từ trường quay → rô-to quay.</span></div></li>
    <li class="done"><div><b>Dòng lớn làm PTC nóng rất nhanh</b><span>Chưa tới vài giây điện trở tăng lên hàng nghìn Ω, tới hàng chục kΩ.</span></div></li>
    <li class="done"><div><b>PTC “cấm dòng”</b><span>Điện trở rất lớn → dòng qua cuộn đề gần như bằng 0 → kết thúc một lần khởi động.</span></div></li>
    <li class="done"><div><b>Khi block chạy</b><span>Một dòng rất nhỏ vẫn chạy qua PTC giữ nó <b>luôn nóng</b> → luôn chặn cuộn đề. Vì thế muốn khởi động lại, PTC phải <b>nguội</b>.</span></div></li>
  </ol>
  <h3 style="margin-top:22px">🔬 Mô phỏng: điện trở PTC và dòng cuộn đề</h3>
  <div class="stage"><div id="gSvg"></div><div class="controls"><button class="btn pri sm" id="gGo">⚡ Cấp điện</button><span class="muted" id="gTxt" style="font-size:14px"></span></div></div>
  <h3 style="margin-top:26px">🔬 Chờ bao lâu mới bật lại được?</h3>
  <p>Block vừa dừng. Kéo thanh trượt chọn <b>thời gian nghỉ</b> trước khi cấp điện lại:</p>
  <div class="panel" style="border-left-color:var(--warm)"><label class="row" style="gap:12px">Nghỉ <input id="wait" type="range" min="0" max="8" step=".5" value="1" style="width:240px"> <b id="waitV"></b></label>
    <div class="verdict" id="waitOut" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-test" data-toc="3 · Hư hỏng, kiểm tra">
  <div class="sec-n">Phần 3</div><h2>Hư hỏng và cách kiểm tra</h2>
  <div class="grid2"><div class="panel hotc" style="margin:0"><h4>Hư hỏng hay gặp</h4><ul style="margin:6px 0 0;padding-left:18px"><li>Chân giắc cắm <b>oxy hóa</b>, tiếp xúc kém với chân block</li><li>Tiếp xúc kém giữa giắc cắm và miếng bán dẫn</li><li><b>Miếng bán dẫn vỡ</b> hoặc không còn đổi điện trở theo nhiệt độ</li></ul></div>
    <div class="panel" style="margin:0"><h4>Biểu hiện</h4><p style="margin:6px 0 0">Cuộn đề không được cấp điện → <b>block không chạy, dòng cao</b> (chỉ cuộn chạy hoạt động). Dòng cao cũng có thể do block kẹt cơ, điện yếu, tắc một phần — nên đo kiểm tra từng bước.</p></div></div>
  <h3 style="margin-top:22px">Đo bằng đồng hồ vạn năng thang x1 Ω (chỉnh kim về 0)</h3>
  <div id="mTabs"></div><article class="panel" id="mPanel" aria-live="polite"></article>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Quy tắc</b><p>Đo qua <b>PTC</b>: <b>10 – 50 Ω</b> là tốt. Đo giữa các chân không qua PTC (chân vào – M): <b>thông</b>. Còn nên kiểm tra thêm chân giắc cắm có tiếp xúc tốt không.</p></div></div>
</section>

<section class="sec" id="s-note" data-toc="4 · Lưu ý, thay thế">
  <div class="sec-n">Phần 4</div><h2>Lưu ý khi lắp và thay thế</h2>
  <div class="tabs"><div class="tab" style="cursor:default"><b>1</b><span><strong>Xác định đúng chân</strong><br><small class="muted">Rơle bán dẫn phải lắp khớp chân R, S của block. Nếu chân chạy/đề của block bị đảo vị trí thì loại 3 chân không lắp được (loại có tụ vẫn dùng được nếu đấu đúng sơ đồ).</small></span></div>
    <div class="tab" style="cursor:default"><b>2</b><span><strong>Chờ PTC nguội</strong><br><small class="muted">Block vừa tắt muốn chạy lại phải nghỉ <b>≥ 5 phút</b> (lâu hơn càng tốt; có thể 5–7 phút).</small></span></div>
    <div class="tab" style="cursor:default"><b>3</b><span><strong>Chỉ cho block công suất nhỏ</strong><br><small class="muted">Công suất lớn thì dòng cuộn lớn, PTC nóng lên nhanh (cấm sớm) nhưng thời gian khởi động lại lâu hơn → dùng rơle dòng.</small></span></div>
    <div class="tab" style="cursor:default"><b>4</b><span><strong>Không dùng tụ kích?</strong><br><small class="muted">Loại 2 vào 2 ra / 3 vào 2 ra: nối tắt chân tụ kích.</small></span></div></div>
  <h3 style="margin-top:26px">So sánh hai loại rơle khởi động</h3>
  <div class="tscroll"><table class="cmp"><thead><tr><th></th><th>Rơle dòng (Bài 7)</th><th>Rơle bán dẫn (Bài 8)</th></tr></thead><tbody>
    <tr><th>Cấu tạo</th><td>Cuộn dây, lõi sắt, tiếp điểm — <b>có chi tiết chuyển động</b></td><td>Một miếng bán dẫn PTC — <b>không chuyển động</b></td></tr>
    <tr><th>Cách ngắt</th><td>Dòng giảm → lõi rơi, tiếp điểm mở (cuộn đề ngắt hẳn)</td><td>PTC nóng lên, cao trở (dòng còn rất nhỏ)</td></tr>
    <tr><th>Công suất</th><td>Mọi công suất (kể cả block lớn)</td><td>Thường block <b>nhỏ</b></td></tr>
    <tr><th>Khởi động lại</th><td>Ngay (khi áp cân bằng)</td><td>Phải <b>chờ ≥ 5 phút</b> cho PTC nguội</td></tr>
    <tr><th>Hỏng thường gặp</th><td>Cháy cuộn, kẹt lõi, dính tiếp điểm</td><td>Oxy hóa chân, vỡ/lão hóa miếng bán dẫn</td></tr></tbody></table></div>
  <div class="callout"><span class="ic">⏱️</span><div><b class="t">Vì sao tủ có bộ thời gian chờ?</b><p>Thiết bị bảo vệ tủ lạnh (hoặc ngắt khi điện áp quá cao/thấp) thường <b>trễ vài phút</b> trước khi cấp điện lại — vừa để <b>cân bằng áp suất</b> hai dàn cho block khởi động nhẹ, vừa để <b>PTC kịp nguội</b>.</p></div></div>
  <h3 style="margin-top:26px">Kiểm tra khi lắp thật</h3>
  ${U.steps([['Kiểm tra rơle bảo vệ trước', 'Thông mạch (x1 Ω).'], ['Xác định chân C – R – S của block, lắp rơle bán dẫn đúng chân', 'Dây nguồn: một dây vào C, một dây vào R.'], ['Có tụ thì kiểm tra tụ (bán dẫn loại có tụ)', 'Tụ làm việc nối song song PTC; tụ kích nối tiếp PTC.'], ['Cấp điện qua kìm kẹp dòng', 'Kim lên rồi tụt về ≤ định mức. Không có tụ làm việc thì dòng cao hơn một chút; có tụ làm việc dòng thấp hơn.'], ['Nghỉ ≥ 5 phút trước mỗi lần thử lại', 'Cho PTC nguội.']])}
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Rơle bán dẫn = miếng bán dẫn PTC (điện trở nhiệt dương).</b></div></li>
    <li class="done"><div><b>Nguội: 10–50 Ω cho dòng vào cuộn đề; nóng: R rất lớn chặn dòng.</b></div></li>
    <li class="done"><div><b>Có 3 loại: 1 vào 2 ra, 2 vào 2 ra (tụ chạy), 3 vào 2 ra (tụ kích + tụ chạy).</b></div></li>
    <li class="done"><div><b>Kiểm tra x1 Ω: qua PTC 10–50 Ω; chân khác thông mạch.</b></div></li>
    <li class="done"><div><b>Block tắt phải chờ ≥ 5 phút cho PTC nguội mới chạy lại.</b></div></li>
    <li class="done"><div><b>Chỉ dùng cho block công suất nhỏ; block lớn dùng rơle dòng.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/8/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    const hotRef = { v: false };
    let cur = 't1';
    const draw = () => { $('#sSvg', root).innerHTML = schemeSVG(cur, hotRef.v); };
    U.tabset($('#tTabs', root), Object.entries(TYPES).map(([id, t], i) => ({ id, n: i + 1, name: t.name, sub: t.sub })), id => { cur = id; hotRef.v = false; $('#tPanel', root).innerHTML = `<h3>${TYPES[id].name}</h3><p style="margin:0">${TYPES[id].desc}</p>`; draw(); });
    U.tabset($('#mTabs', root), Object.entries(TYPES).map(([id, t], i) => ({ id, n: i + 1, name: t.name })), id => { $('#mPanel', root).innerHTML = `<h3>${TYPES[id].name}</h3><table class="cmp"><thead><tr><th>Phép đo</th><th>Kết quả tốt</th></tr></thead><tbody>${TYPES[id].test.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table>`; });
    // đồ thị
    let tm;
    const g = $('#gSvg', root); g.innerHTML = graphSVG(0);
    $('#gGo', root).onclick = () => { clearInterval(tm); let t = 0; hotRef.v = false; draw(); tm = setInterval(() => { if (!document.body.contains(g)) { clearInterval(tm); return; } t += .08; g.innerHTML = graphSVG(t); if (t > .8 + .8 && !hotRef.v) { hotRef.v = true; draw(); } $('#gTxt', root).textContent = t < 1 ? 'PTC nguội: dòng vào cuộn đề lớn…' : t < 3 ? 'PTC đang nóng lên, trở tăng vọt, dòng tụt…' : 'PTC nóng: R hàng chục kΩ, dòng cuộn đề ≈ 0 → khởi động xong.'; if (t >= 5) clearInterval(tm); }, 60); };
    // thời gian nghỉ
    const w = $('#wait', root), wv = $('#waitV', root), wo = $('#waitOut', root);
    const upd = () => { const m = +w.value, c = Math.exp(-m / 6), R = 20 * Math.pow(1000, c); wv.textContent = m + ' phút'; const ok = R < 100; wo.className = 'verdict ' + (ok ? 'ok' : 'bad'); wo.innerHTML = `PTC còn khoảng <b>${R < 1000 ? Math.round(R) + ' Ω' : (R / 1000).toFixed(1) + ' kΩ'}</b>. ` + (ok ? '✓ Đã nguội: dòng vào được cuộn đề → block <b>khởi động bình thường</b>.' : '✗ Còn nóng: điện trở lớn chặn cuộn đề → block <b>không khởi động</b>, ù, dòng cao. Hãy chờ thêm.'); };
    w.oninput = upd; upd();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Rơle bán dẫn làm bằng gì?', b: 'Một <b>miếng chất bán dẫn</b> hoạt động như điện trở nhiệt dương (<b>PTC</b>).', tag: 'Khái niệm' },
    { f: 'PTC nghĩa là gì?', b: 'Điện trở có hệ số nhiệt <b>dương</b>: nhiệt độ tăng → điện trở <b>tăng nhanh</b>.', tag: 'Khái niệm' },
    { f: 'Rơle bán dẫn còn gọi là?', b: 'Rơle <b>điện tử</b>.', tag: 'Khái niệm' },
    { f: 'Rơle bán dẫn có tiếp điểm, cuộn dây không?', b: '<b>Không</b>. Chỉ có miếng bán dẫn và chân giắc cắm.', tag: 'Khái niệm' },
    { f: 'Có mấy loại rơle bán dẫn thường gặp?', b: '3: <b>1 vào 2 ra</b>; <b>2 vào 2 ra</b> (tụ chạy); <b>3 vào 2 ra</b> (tụ kích + tụ chạy).', tag: 'Phân loại' },
    { f: 'Loại 1 vào 2 ra có tụ không?', b: '<b>Không tụ</b> (3 chân).', tag: 'Phân loại' },
    { f: 'Loại 2 vào 2 ra có tụ gì?', b: '<b>Tụ làm việc</b> (tụ ngậm, CR) mắc song song với PTC.', tag: 'Phân loại' },
    { f: 'Loại 3 vào 2 ra có những tụ nào?', b: '<b>Tụ kích (CS)</b> nối tiếp PTC và <b>tụ làm việc (CR)</b> song song.', tag: 'Phân loại' },
    { f: 'Khi mới cấp điện, điện trở PTC là?', b: 'Thấp, khoảng <b>10 – 50 Ω</b>.', tag: 'Nguyên lý' },
    { f: 'Vì sao PTC nóng lên?', b: 'Dòng lớn chạy qua lúc khởi động làm nó nóng nhanh.', tag: 'Nguyên lý' },
    { f: 'PTC nóng thì dòng cuộn đề thế nào?', b: 'R tăng rất lớn → dòng cuộn đề gần bằng 0 → kết thúc khởi động.', tag: 'Nguyên lý' },
    { f: 'Khi block đang chạy, PTC ở trạng thái nào?', b: 'Luôn <b>nóng</b> nhờ dòng nhỏ đi qua nên luôn chặn cuộn đề.', tag: 'Nguyên lý' },
    { f: 'Tụ làm việc trong sơ đồ có vai trò gì?', b: 'Khi PTC cao trở, tụ vẫn nạp xả duy trì dòng qua cuộn đề, hỗ trợ cuộn chạy.', tag: 'Nguyên lý' },
    { f: 'Tụ kích trong sơ đồ loại 3 vào 2 ra làm gì?', b: 'Tăng dòng/mô-men lúc khởi động (nạp xả cộng với nguồn).', tag: 'Nguyên lý' },
    { f: 'Hỏng hay gặp ở rơle bán dẫn?', b: 'Chân giắc cắm oxy hóa; tiếp xúc kém với miếng bán dẫn; miếng bán dẫn vỡ/không đổi điện trở.', tag: 'Hư hỏng' },
    { f: 'Rơle bán dẫn hỏng thì block ra sao?', b: 'Cuộn đề không có điện → <b>không chạy, dòng cao</b>.', tag: 'Hư hỏng' },
    { f: 'Đo rơle bán dẫn dùng thang?', b: '<b>x1 Ω</b>.', tag: 'Kiểm tra' },
    { f: 'Điện trở đúng khi đo qua PTC?', b: '<b>10 – 50 Ω</b>.', tag: 'Kiểm tra' },
    { f: 'Đo giữa chân vào và chân M (không qua PTC)?', b: '<b>Thông mạch</b>.', tag: 'Kiểm tra' },
    { f: 'Block vừa tắt, bao lâu mới bật lại được?', b: '<b>≥ 5 phút</b> (có thể 5–7 phút) để PTC nguội.', tag: 'Lưu ý' },
    { f: 'Bật lại ngay thì sao?', b: 'PTC còn nóng, R lớn → cuộn đề không có điện → <b>không khởi động</b>.', tag: 'Lưu ý' },
    { f: 'Rơle bán dẫn dùng cho block công suất nào?', b: '<b>Nhỏ</b>. Block lớn dùng rơle dòng.', tag: 'Lưu ý' },
    { f: 'Vì sao block lớn không dùng PTC?', b: 'Thời gian khởi động lâu; PTC cấm dòng sớm trước khi rô-to đạt tốc độ.', tag: 'Lưu ý' },
    { f: 'Không dùng tụ kích thì làm gì?', b: '<b>Nối tắt</b> hai chân tụ kích.', tag: 'Lưu ý' },
    { f: 'Vì sao phải xác định chân block trước khi lắp?', b: 'Rơle phải khớp chân chạy/đề, nếu đảo vị trí loại 3 chân không lắp được.', tag: 'Lưu ý' },
    { f: 'So sánh với rơle dòng: ai khởi động lại được ngay?', b: '<b>Rơle dòng</b>; PTC phải chờ nguội.', tag: 'So sánh' },
    { f: 'Rơle nào có chi tiết chuyển động?', b: '<b>Rơle dòng</b> (lõi sắt, tiếp điểm); PTC không có.', tag: 'So sánh' },
    { f: 'Vì sao tủ có thiết bị trễ vài phút khi cấp điện lại?', b: 'Cân bằng áp suất hai dàn để block khởi động nhẹ, và cho PTC nguội.', tag: 'So sánh' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Bên trong rơle bán dẫn khởi động chỉ có?', ['Cuộn dây và lõi sắt', 'Một miếng bán dẫn PTC', 'Động cơ nhỏ', 'Lưỡng kim'], 1, 'Không có chi tiết chuyển động.'),
    Q('PTC có tính chất nào?', ['Nóng thì điện trở giảm', 'Nóng thì điện trở tăng nhanh', 'Không đổi', 'Chỉ dẫn điện một chiều'], 1, 'Hệ số nhiệt dương.'),
    Q('Điện trở PTC khi nguội?', ['10 – 50 Ω', '10 kΩ', '1 MΩ', '0 Ω'], 0, 'Nhỏ để cho dòng vào cuộn đề.'),
    Q('Khi PTC nóng thì cuộn đề?', ['Có dòng rất lớn', 'Gần như không có dòng', 'Cháy ngay', 'Tăng tốc'], 1, 'PTC cao trở chặn dòng.'),
    Q('Rơle bán dẫn kết thúc khởi động bằng cách?', ['Mở tiếp điểm', 'PTC nóng lên, cao trở', 'Cuộn dây hút lõi', 'Quạt thổi'], 1, 'Không có tiếp điểm.'),
    Q('Rơle 2 vào 2 ra có thêm?', ['Tụ làm việc', 'Quạt', 'Cầu chì nhiệt', 'Điện trở sấy'], 0, 'Song song với PTC.'),
    Q('Rơle 3 vào 2 ra có?', ['Không tụ', 'Chỉ tụ chạy', 'Tụ kích và tụ làm việc', 'Chỉ tụ kích'], 2, 'Cả hai tụ.'),
    Q('Rơle 1 vào 2 ra là loại?', ['3 chân, không tụ', '4 chân, có tụ', '5 chân', 'Có động cơ'], 0, 'Đơn giản nhất.'),
    Q('Trong lúc block chạy, PTC?', ['Nguội', 'Luôn nóng nhờ dòng nhỏ chạy qua', 'Bị ngắt', 'Cháy'], 1, 'Giữ cuộn đề cách ly.'),
    Q('Muốn khởi động lại, PTC phải?', ['Nóng', 'Nguội', 'Ướt', 'Thay mới'], 1, 'Khi nguội R mới nhỏ.'),
    Q('Block vừa tắt cần nghỉ tối thiểu?', ['5 giây', '5 phút', '1 giờ', 'Không cần'], 1, 'Cho PTC nguội.'),
    Q('Đo rơle bán dẫn dùng thang?', ['x10k', 'x1 Ω', 'AC 250 V', 'DC 12 V'], 1, 'Đo điện trở nhỏ.'),
    Q('Điện trở qua PTC tốt là?', ['10 – 50 Ω', '1 MΩ', '0 Ω', '∞'], 0, 'Theo bài giảng.'),
    Q('Chân vào – chân M của rơle 3 chân?', ['Thông mạch', 'Hở mạch', '10 kΩ', '1 MΩ'], 0, 'Không qua PTC.'),
    Q('Rơle bán dẫn hỏng thường do?', ['Chân oxy hóa hoặc miếng bán dẫn vỡ', 'Thiếu gas', 'Phin tắc', 'Dàn bẩn'], 0, 'Hư hỏng cơ học/điện.'),
    Q('Hỏng rơle bán dẫn → block?', ['Không chạy, dòng cao', 'Chạy rất êm', 'Lạnh sâu', 'Dòng 0'], 0, 'Cuộn đề không có điện.'),
    Q('Rơle bán dẫn phù hợp block?', ['Công suất nhỏ', 'Công suất lớn', 'Mọi công suất', 'Điều hòa 12 000 BTU'], 0, 'Block lớn dùng rơle dòng.'),
    Q('Vì sao block lớn ít dùng PTC?', ['Khởi động lâu hơn, PTC cấm sớm', 'PTC đắt', 'PTC to', 'Không có'], 0, 'Dòng cuộn lớn làm PTC nóng nhanh.'),
    Q('Không dùng tụ kích, ta làm gì?', ['Nối tắt chân tụ kích', 'Bỏ rơle', 'Cắt dây nguồn', 'Tăng tụ'], 0, 'Để mạch thông.'),
    Q('So với rơle dòng, rơle bán dẫn?', ['Không có chi tiết chuyển động', 'Có tiếp điểm', 'Có cuộn dây', 'Nặng hơn'], 0, 'Điều khiển bằng nhiệt.'),
    Q('Khởi động lại ngay khi PTC còn nóng sẽ?', ['Khởi động tốt', 'Không khởi động, dòng cao', 'Cháy tủ', 'Tủ lạnh nhanh'], 1, 'R lớn chặn cuộn đề.'),
    Q('Tụ làm việc mắc thế nào với PTC?', ['Song song', 'Nối tiếp', 'Không nối', 'Nối với vỏ'], 0, 'Tiếp tục cấp dòng cho cuộn đề.'),
    Q('Tụ kích mắc thế nào với PTC?', ['Nối tiếp', 'Song song', 'Với cuộn chạy', 'Không'], 0, 'Tăng mô-men lúc khởi động.'),
    Q('Rơle cần lắp đúng điều gì?', ['Chân R và S khớp block', 'Màu sắc', 'Hãng', 'Chiều cao'], 0, 'Nếu không sẽ không lắp được/đấu sai.'),
    Q('Thiết bị trễ vài phút cấp điện lại giúp?', ['Cân bằng áp suất và cho PTC nguội', 'Tăng điện áp', 'Làm lạnh nhanh', 'Giảm tiếng ồn'], 0, 'Bảo vệ block.')
  ];
  const sort = {
    title: 'Đặc điểm thuộc loại rơle khởi động nào?',
    buckets: [{ id: 'cur', name: 'Rơle dòng (Bài 7)' }, { id: 'ptc', name: 'Rơle bán dẫn PTC (Bài 8)' }, { id: 'both', name: 'Cả hai' }],
    items: [
      { t: 'Có cuộn dây, lõi sắt từ, tiếp điểm', b: 'cur' }, { t: 'Khởi động lại ngay được', b: 'cur' }, { t: 'Phải lắp đúng chiều để tiếp điểm thường mở', b: 'cur' }, { t: 'Dùng được cho block công suất lớn', b: 'cur' },
      { t: 'Chỉ có miếng bán dẫn', b: 'ptc' }, { t: 'Phải chờ ≥ 5 phút cho nguội', b: 'ptc' }, { t: 'Khi nóng điện trở tăng vọt', b: 'ptc' }, { t: 'Đo qua PTC: 10 – 50 Ω', b: 'ptc' },
      { t: 'Điều khiển nguồn cho cuộn đề', b: 'both' }, { t: 'Có loại có tụ khởi động', b: 'both' }, { t: 'Đo bằng đồng hồ x1 Ω', b: 'both' }, { t: 'Hỏng thì block không chạy, dòng cao', b: 'both' }
    ]
  };
  const order = [
    { title: 'Khởi động với PTC', intro: 'Sắp xếp diễn biến khởi động.', steps: ['Cấp điện, PTC còn nguội, R khoảng 10–50 Ω', 'Dòng vào cuộn đề, sinh từ trường quay', 'Rô-to quay nhanh dần', 'Dòng lớn làm PTC nóng, R tăng vọt', 'Dòng cuộn đề gần bằng 0, kết thúc khởi động', 'PTC giữ nóng nhờ dòng nhỏ khi block chạy'] },
    { title: 'Đo rơle bán dẫn 3 chân', intro: 'Sắp xếp các bước đo.', steps: ['Chọn thang x1 Ω, chập que chỉnh kim về 0', 'Đo chân vào – chân M: kim lên (thông)', 'Đo chân vào – chân S (qua PTC)', 'Đọc điện trở: 10 – 50 Ω là tốt', 'Kiểm tra chân giắc cắm có oxy hóa không', 'Kết luận rơle tốt hay hỏng'] },
    { title: 'Thay rơle bán dẫn', intro: 'Sắp xếp các bước thay.', steps: ['Xác định chân C-R-S của block', 'Chọn rơle bán dẫn đúng loại, đúng chân', 'Cắm rơle, nối tắt chân tụ nếu không dùng', 'Cấp điện qua kìm kẹp dòng', 'Kim lên rồi tụt về ≤ định mức', 'Nghỉ ≥ 5 phút mỗi lần thử lại'] }
  ];
  DL.register({
    id: 8, ready: true, title: 'Rơle khởi động bán dẫn (PTC)', sub: 'Cấu tạo, nguyên lý, kiểm tra, lưu ý', minutes: 20,
    lead: 'Rơle bán dẫn không có tiếp điểm: chỉ một miếng PTC tự nóng lên để chặn dòng cuộn đề. Bài này giải thích 3 loại, vì sao phải chờ nguội ≥ 5 phút và cách đo.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
