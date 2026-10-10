/* BÀI 17 — NẠP GAS CHO TỦ LẠNH (biên soạn từ docs/Bai_17.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  // áp suất thấp ổn định (psi) khi đủ gas, theo số sao (theo bài giảng)
  const PFIN = { 1: [9, 12], 2: [6, 9], 3: [2, 6] };
  const TARGET = 75, IRATED = .7;

  const CASES = {
    low: { name: 'Thiếu gas', p: [-2, 1], i: [.35, .55], hot: 'Dàn nóng chỉ nóng ở <b>đầu dàn</b>, cuối dàn không nóng lắm', cold: 'Tuyết chỉ bám <b>đầu dàn</b>, phần sau không có', ret: 'Ống hồi về khô', door: 'Áp thấp, không đổi', fix: 'Nạp bổ sung từng chút.' },
    high: { name: 'Thừa gas', p: [14, 22], i: [.75, .95], hot: 'Dàn nóng <b>rất nóng</b>, nóng đều', cold: 'Tuyết bám đều đến cuối dàn', ret: 'Ống hồi về <b>đổ mồ hôi, ướt</b> (gas lỏng về block)', door: 'Áp cao hơn dải', fix: 'Xả bớt gas (chỉ khi áp lớn hơn khí quyển).' },
    ok: { name: 'Đủ gas', p: [3, 5], i: [.5, .65], hot: 'Dàn nóng <b>nóng đều</b> từ đầu đến cuối', cold: 'Tuyết bám đều, <b>khô và dính tay</b> từ đầu đến cuối', ret: 'Ống hồi về <b>mát và khô</b>', door: 'Áp ổn định trong dải', fix: 'Kẹp ống, hàn kín ống nạp.' },
    weak: { name: 'Block yếu / lọt hơi', p: [55, 75], i: [.9, 1.2], hot: 'Dàn nóng <b>không nóng</b>', cold: 'Không có tuyết, dàn lạnh không lạnh', ret: 'Ống hồi về bình thường', door: 'Áp thấp lên cao <b>đột ngột</b> gần cân bằng (50–70 psi)', fix: 'Thay block.' },
    dirt: { name: 'Tắc bẩn (tắc toàn phần)', p: [-8, -3], i: [.15, .25], hot: 'Dàn nóng lúc đầu nóng rồi <b>nguội dần</b>', cold: 'Dàn lạnh không lạnh; tuyết tan', ret: 'Ống hồi về không lạnh', door: 'Mở cửa tủ, áp <b>KHÔNG lên lại</b>, vẫn ở dưới 0 (chân không)', fix: 'Súc rửa, thổi sạch hoặc thay phin/ống mao.' },
    wet: { name: 'Tắc ẩm', p: [-8, -3], i: [.15, .25], hot: 'Dàn nóng nguội khi tắc, nóng lại khi thông', cold: 'Dàn lạnh lúc lạnh lúc không; có tuyết ở cuối ống mao', ret: 'Ống hồi về dao động', door: 'Mở cửa tủ cho nhiệt độ lên dương, băng tan → áp <b>lên lại</b> rồi lại tụt', fix: 'Khử ẩm: hút chân không lại, thay phin, sấy/thay dầu.' }
  };

  function learn() {
    return `
<section class="sec" id="s-prep" data-toc="1 · Chuẩn bị">
  <div class="sec-n">Phần 1</div><h2>Trước khi nạp gas</h2>
  <p>Sau khi <b>tạo chân không</b> xong (xem <a href="#/tu-lanh/16">Bài 16</a>), nối dây giữa của bộ đồng hồ với <b>bình gas</b>, dây đồng hồ thấp nối ống công nghệ, <b>khóa đồng hồ áp cao</b>. Rồi tra cứu thông số trên nhãn tủ (thường dán ở phía sau):</p>
  <div class="tabs"><div class="tab" style="cursor:default"><b>1</b><span><strong>Loại gas</strong><br><small class="muted">VD R134a, R600a — phải nạp <b>đúng loại</b>; gas và dầu phải phù hợp nhau</small></span></div><div class="tab" style="cursor:default"><b>2</b><span><strong>Trọng lượng gas</strong><br><small class="muted">VD 55 g, 75 g, tủ lớn ~150 g</small></span></div><div class="tab" style="cursor:default"><b>3</b><span><strong>Dòng định mức</strong><br><small class="muted">dòng làm việc tối đa khi có tải; không được vượt khi nạp đủ</small></span></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Nạp thể lỏng chính xác nhất</b><p>Mọi loại gas nên nạp ở <b>thể lỏng</b> theo <b>trọng lượng</b> (dùng cân): độ chính xác cao nhất. Nạp ở <b>thể hơi</b> (dựa vào áp suất và biểu hiện) kém chính xác hơn nhưng phổ biến vì không cần cân. Khi cân phải trừ lượng gas <b>nằm trong dây đồng hồ</b> (VD dây chứa ~5 g).</p></div></div>
</section>

<section class="sec" id="s-vapor" data-toc="2 · Nạp thể hơi">
  <div class="sec-n">Phần 2</div><h2>Nạp gas ở thể hơi (R134a)</h2>
  ${U.steps([['Cấp điện cho block, kẹp ampe kìm theo dõi dòng', 'Block khởi động, hút gas từ ống nạp. Mở khóa đồng hồ thấp.'], ['Mở nhẹ van bình gas vài giây rồi khóa lại', 'Khống chế áp thấp khoảng <b>20 – 37 psi</b> (bài giảng: mở khoảng 5 – 10 giây, có thể tới 20 – 30 giây cho tủ nhiều gas); đừng để áp suất vọt cao. Tủ gas ít (55–75 g) phải mở rất ngắn.'], ['Khóa van và quan sát kim', 'Nếu gas được đưa vào và tuần hoàn thì kim đồng hồ áp thấp <b>lớn hơn giá trị ban đầu</b> (đã hút chân không). Nếu không tăng → không tuần hoàn, nghi <b>tắc</b>.'], ['Lặp lại đến khi kim ổn định khoảng 15 psi', 'Lúc này <b>tạm dừng</b> chưa phải kết luận, vì áp suất còn phụ thuộc nhiệt độ môi trường và nhiệt độ dàn.'], ['Cho tủ chạy một lúc (có thể 3 – 5 giờ)', 'Dàn lạnh lạnh dần, áp suất <b>tụt xuống</b> về dải ổn định theo số sao.'], ['Kết luận đủ hay chưa, rồi kẹp ống và hàn kín', 'Dựa vào áp suất + dàn nóng + dàn lạnh + ống hồi + dòng.']])}
  <div class="tscroll"><table class="cmp"><thead><tr><th>Loại tủ</th><th>Áp suất thấp ban đầu</th><th>Sau khi chạy lạnh (đủ gas)</th></tr></thead><tbody>
    <tr><th>1 sao</th><td>≈ 15 psi</td><td>giảm về <b>9 – 12 psi</b></td></tr><tr><th>2 sao</th><td>≈ 15 psi</td><td>giảm về <b>6 – 9 psi</b></td></tr><tr><th>3 – 4 sao</th><td>≈ 15 psi</td><td>giảm về <b>2 – 6 psi</b></td></tr></tbody></table></div>
  <p class="muted" style="font-size:14px">Giá trị áp suất chỉ để tham khảo, <b>không phụ thuộc trọng lượng gas hay dung tích</b> mà phụ thuộc <b>nhiệt độ môi trường</b> và số sao. Mỗi loại gas (R134a, R600a, R12...) có áp suất bay hơi khác nhau nên đừng áp bảng này cho gas khác.</p>
  <h3 style="margin-top:24px">🔬 Mô phỏng nạp tủ R134a, cần ${TARGET} g</h3>
  <div class="gauge-wrap"><div class="stage" style="margin:0"><div id="nG"></div><div class="controls" style="justify-content:center"><span class="muted" id="nTxt"></span></div></div>
    <div><div class="row"><label>Tủ <select id="nStar" class="btn sm" style="min-height:36px"><option value="1">1 sao</option><option value="2">2 sao</option><option value="3" selected>3 – 4 sao</option></select></label></div>
      <div class="row" style="margin-top:10px"><button class="btn pri sm" id="nOpen">⛽ Mở van 5–10 s (nạp thêm)</button><button class="btn sm" id="nRun">⏱ Chạy thử 3 giờ</button><button class="btn sm" id="nBleed">💨 Xả bớt</button><button class="btn sm" id="nRs">↺ Làm lại</button></div>
      <div class="verdict" id="nV" style="margin-top:10px">Khóa đồng hồ cao, mở van gas từng chút.</div>
      <div class="row" style="margin-top:10px"><button class="btn sm" id="nSeal">🔧 Kẹp ống & hàn kín ống nạp</button></div></div></div>
</section>

<section class="sec" id="s-judge" data-toc="3 · Đủ hay thiếu, thừa">
  <div class="sec-n">Phần 3</div><h2>Biết gas đủ, thiếu hay thừa</h2>
  <p>Không nên chỉ nhìn đồng hồ áp suất. Phải kết hợp 5 dấu hiệu:</p>
  <div class="tscroll"><table class="cmp"><thead><tr><th></th><th>Thiếu gas</th><th>ĐỦ gas</th><th>Thừa gas</th></tr></thead><tbody>
    <tr><th>Dàn nóng</th><td>Chỉ nóng đầu dàn, cuối dàn không nóng lắm</td><td><b>Nóng đều</b> đầu → cuối</td><td><b>Rất nóng</b></td></tr>
    <tr><th>Dàn lạnh</th><td>Tuyết chỉ ở đầu dàn, ít</td><td>Tuyết đều, <b>khô, dính tay</b> (tủ 3–4 sao)</td><td>Tuyết đều nhưng ống hồi ướt</td></tr>
    <tr><th>Ống hồi về block</th><td>Khô, không mát</td><td><b>Mát, khô</b>, không đổ mồ hôi</td><td><b>Đổ mồ hôi</b>, ướt</td></tr>
    <tr><th>Dòng làm việc</th><td>Nhỏ hơn định mức nhiều</td><td><b>≤ dòng định mức</b>, ổn định</td><td>Bằng hoặc lớn hơn định mức</td></tr>
    <tr><th>Xử lý</th><td>Nạp bổ sung</td><td>Hàn kín</td><td>Xả bớt</td></tr></tbody></table></div>
  <p>Kiểm tra nhiệt độ: <b>ngăn đông tủ 4 sao</b> đạt khoảng <b>−18 đến −23 °C</b> sau khoảng 3 giờ chạy thử (ví dụ bài giảng đo được −23 °C ở dàn), khay đá đông cứng sau khoảng 24 giờ.</p>
  <div class="callout danger"><span class="ic">💨</span><div><b class="t">Khi xả bớt gas</b><p>Chỉ xả khi kim đồng hồ <b>lớn hơn 0</b> (áp lớn hơn khí quyển). Nếu áp thấp hơn khí quyển, xả sẽ <b>hút không khí vào</b>. Phải <b>ngắt điện, chờ cân bằng áp</b> hai dàn rồi mới xả. Gas <b>hỗn hợp không đồng sôi</b> thì không được xả bớt/ nạp bổ sung — phải <b>thay toàn bộ</b> vì thành phần bị lệch.</p></div></div>
  <div class="callout"><span class="ic">🔧</span><div><b class="t">Kết thúc: hàn kín ống nạp</b><p>Dùng <b>kìm kẹp ống</b> bóp bẹp ống nạp rồi hàn kín (khi block đang chạy để áp thấp, dễ hàn, an toàn). Với gas <b>hydrocarbon (R600a...)</b> dễ cháy nổ: hạn chế hàn, dùng <b>van một chiều + keo dán ống</b> (không keo thì gas và dầu làm trương phồng cao su, sau thời gian bị rò).</p></div></div>
</section>

<section class="sec" id="s-diag" data-toc="4 · Hiện tượng sau nạp">
  <div class="sec-n">Phần 4</div><h2>Hư hỏng thường gặp sau khi nạp gas</h2>
  <p>Chọn “Ca bệnh mới” để nhận một tủ vừa nạp xong có hiện tượng ngẫu nhiên. Đọc số liệu, thử mở cửa tủ rồi kết luận.</p>
  <div class="panel"><div class="row"><button class="btn pri sm" id="dNew">🔄 Ca bệnh mới</button><button class="btn sm" id="dDoor">🚪 Ngắt điện, mở cửa tủ cho ấm lên</button></div>
    <dl class="kv" style="margin:12px 0 6px"><dt>Áp suất thấp</dt><dd id="dP">…</dd><dt>Dòng (định mức ${IRATED} A)</dt><dd id="dI">…</dd><dt>Dàn nóng</dt><dd id="dH">…</dd><dt>Dàn lạnh</dt><dd id="dC">…</dd><dt>Ống hồi về</dt><dd id="dR">…</dd><dt>Sau khi mở cửa</dt><dd id="dD">chưa thử</dd></dl>
    <div class="row"><b>Kết luận:</b><select id="dAns" class="btn sm" style="min-height:40px"><option value="">— chọn —</option>${Object.entries(CASES).map(([k, c]) => `<option value="${k}">${c.name}</option>`).join('')}</select><button class="btn pri sm" id="dChk">Kiểm tra</button></div><div id="dRes" style="margin-top:10px"></div></div>
  <div class="grid2" style="margin-top:14px"><div class="panel hotc" style="margin:0"><h4>Tắc bẩn hay tắc ẩm?</h4><p style="margin:6px 0 0">Cả hai: kim áp thấp tụt xuống chân không, <b>dòng tụt cỡ 0,2 A</b> (chạy chân không), dàn nóng nguội. Phân biệt: ngắt điện, <b>mở cửa tủ</b> cho nhiệt độ lên trên 0 °C. <b>Áp lên lại</b> (băng tan) → <b>tắc ẩm</b>. Áp <b>không lên</b> → <b>tắc bẩn</b> (cần thổi sạch / thay phin, ống mao).</p></div>
    <div class="panel warm" style="margin:0"><h4>Block không khởi động khi có tải</h4><p style="margin:6px 0 0">Trước khi nạp block chạy bình thường nhưng sau khi nạp (hoặc ngắt rồi bật lại) <b>không khởi động, dòng cao</b>, áp cân bằng 80–140 psi (R134a). Do <b>block yếu</b>, không khởi động nổi khi có áp.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Tra nhãn: loại gas, trọng lượng gas, dòng định mức.</b></div></li>
    <li class="done"><div><b>Nạp thể lỏng theo cân chính xác nhất; nạp thể hơi dựa áp suất + biểu hiện.</b></div></li>
    <li class="done"><div><b>Nạp từng chút (mở van vài giây), kim ban đầu ~15 psi rồi chạy thử, áp tụt về dải theo số sao.</b></div></li>
    <li class="done"><div><b>Đủ gas: dàn nóng nóng đều, dàn lạnh tuyết đều khô, ống hồi mát khô, dòng ≤ định mức.</b></div></li>
    <li class="done"><div><b>Thiếu → nạp thêm; thừa → xả (khi áp &gt; 0). Gas hỗn hợp không đồng sôi: thay toàn bộ.</b></div></li>
    <li class="done"><div><b>Cuối cùng kẹp bẹp rồi hàn kín ống nạp (R600a dùng van một chiều + keo).</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/17/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    // mô phỏng nạp
    let m, ran, sealed;
    const star = () => $('#nStar', root).value;
    const pressure = () => { // áp suất thấp hiện thời (psi)
      if (!ran) return Math.min(37, Math.max(0, m * .22 - 1));
      const r = m / TARGET, mid = (PFIN[star()][0] + PFIN[star()][1]) / 2;
      return mid + 16 * (r - 1);
    };
    const draw = () => {
      $('#nG', root).innerHTML = U.gauge(pressure(), { min: -5, max: 40, step: 5, unit: 'psi', good: ran ? PFIN[star()] : null });
      $('#nTxt', root).textContent = `Lượng gas đã nạp (theo cân): ${m} g · mục tiêu ${TARGET} g`;
    };
    const reset = () => { m = 0; ran = false; sealed = false; $('#nV', root).className = 'verdict'; $('#nV', root).textContent = 'Khóa đồng hồ cao, mở van gas từng chút.'; draw(); };
    $('#nOpen', root).onclick = () => { if (sealed) return; m += 4 + Math.floor(Math.random() * 4); ran = false; const v = $('#nV', root); v.className = 'verdict'; v.textContent = pressure() > 20 ? 'Áp thấp đang lên cao — khóa van, đừng mở thêm cho tới khi chạy thử.' : 'Gas được đưa vào, kim áp thấp tăng. Khóa van, lặp lại cho đến khoảng 15 psi rồi chạy thử.'; draw(); };
    $('#nBleed', root).onclick = () => { if (sealed || m < 4) return; m -= 4; const v = $('#nV', root); v.className = 'verdict'; v.textContent = pressure() <= 0 ? '⚠️ Áp thấp hơn khí quyển: xả sẽ hút không khí vào!' : 'Đã xả bớt một ít gas.'; draw(); };
    $('#nRun', root).onclick = () => {
      if (sealed) return; ran = true; draw();
      const r = m / TARGET, v = $('#nV', root), p = pressure().toFixed(0);
      if (r < .6) { v.className = 'verdict bad'; v.innerHTML = `Chạy 3 giờ: áp ${p} psi, ${'dàn nóng chỉ nóng đầu, tuyết rất ít, dòng nhỏ'} → <b>THIẾU gas</b> nhiều. Nạp thêm.`; }
      else if (r < .88) { v.className = 'verdict bad'; v.innerHTML = `Chạy 3 giờ: áp ${p} psi (thấp hơn dải), tuyết chưa phủ hết dàn → <b>còn thiếu gas</b>, nạp bổ sung.`; }
      else if (r <= 1.12) { v.className = 'verdict ok'; v.innerHTML = `Chạy 3 giờ: áp <b>${p} psi</b> nằm trong dải ${PFIN[star()].join('–')} psi, dàn nóng nóng đều, tuyết đều khô, ống hồi mát khô, dòng ≤ ${IRATED} A → <b>ĐỦ gas</b>. Có thể hàn kín.`; }
      else { v.className = 'verdict bad'; v.innerHTML = `Chạy 3 giờ: áp ${p} psi (cao hơn dải), dàn nóng rất nóng, ống hồi <b>đổ mồ hôi</b>, dòng cao → <b>THỪA gas</b>. Xả bớt.`; }
    };
    $('#nSeal', root).onclick = () => { const v = $('#nV', root), r = m / TARGET; if (!ran) { v.className = 'verdict bad'; v.textContent = 'Chưa chạy thử nên chưa biết đủ gas. Hãy bấm “Chạy thử 3 giờ” trước.'; return; } sealed = true; v.className = 'verdict ' + (r >= .88 && r <= 1.12 ? 'ok' : 'bad'); v.innerHTML = r >= .88 && r <= 1.12 ? '✓ Đã kẹp bẹp và hàn kín ống nạp với lượng gas đủ. Tủ hoàn thiện!' : `✗ Bạn đã hàn kín khi gas ${r < .88 ? 'còn thiếu' : 'đang thừa'} (${m} g / ${TARGET} g). Tủ sẽ kém lạnh hoặc quá tải. Hãy xả/ nạp lại trước khi hàn.`; };
    $('#nRs', root).onclick = reset; $('#nStar', root).onchange = () => { if (ran) draw(); };
    reset();
    // ca bệnh
    let C, tried = false;
    const rnd = (a, b) => (a + Math.random() * (b - a));
    const nc = () => {
      const k = Object.keys(CASES)[Math.floor(Math.random() * 6)], c = CASES[k]; C = { k, c, p: rnd(c.p[0], c.p[1]), i: rnd(c.i[0], c.i[1]) }; tried = false;
      $('#dP', root).innerHTML = `<b>${C.p.toFixed(0)} psi</b>${C.p < 0 ? ' (dưới 0: chân không)' : ''}`; $('#dI', root).innerHTML = `<b>${C.i.toFixed(2)} A</b>`; $('#dH', root).innerHTML = c.hot; $('#dC', root).innerHTML = c.cold; $('#dR', root).innerHTML = c.ret; $('#dD', root).textContent = 'chưa thử'; $('#dRes', root).innerHTML = ''; $('#dAns', root).value = '';
    };
    $('#dNew', root).onclick = nc; nc();
    $('#dDoor', root).onclick = () => { $('#dD', root).innerHTML = C.k === 'wet' ? C.c.door : C.k === 'dirt' ? C.c.door : 'Áp suất gần như không đổi (không phải tắc).'; };
    $('#dChk', root).onclick = () => { const v = $('#dAns', root).value; if (!v) { $('#dRes', root).innerHTML = '<div class="why">Hãy chọn kết luận.</div>'; return; } $('#dRes', root).innerHTML = `<div class="why" style="border-color:var(--${v === C.k ? 'ok' : 'bad'})"><b>${v === C.k ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> Đây là <b>${C.c.name}</b>. Xử lý: ${C.c.fix}</div>`; };
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Trước khi nạp gas cần tra những thông số nào?', b: '<b>Loại gas, trọng lượng gas, dòng định mức</b> (nhãn sau tủ).', tag: 'Chuẩn bị' },
    { f: 'Vì sao phải nạp đúng loại gas?', b: 'Gas phải phù hợp với dầu và hệ thống; nạp sai tủ không lạnh đúng.', tag: 'Chuẩn bị' },
    { f: 'Nạp thể nào chính xác nhất?', b: 'Nạp ở <b>thể lỏng</b> theo <b>trọng lượng</b> (dùng cân).', tag: 'Chuẩn bị' },
    { f: 'Khi cân cần lưu ý gì?', b: 'Trừ lượng gas nằm trong dây đồng hồ (VD ~5 g).', tag: 'Chuẩn bị' },
    { f: 'Dòng định mức là gì?', b: 'Dòng làm việc <b>tối đa</b> khi có tải; không được vượt khi đủ gas.', tag: 'Chuẩn bị' },
    { f: 'Nạp thể hơi: mở van gas bao lâu một lần?', b: 'Vài giây (khoảng 5–10 s, có thể 20–30 s), rồi khóa quan sát.', tag: 'Nạp hơi' },
    { f: 'Áp thấp lúc nạp khống chế khoảng?', b: 'Khoảng <b>20 – 37 psi</b>, kim đạt ~15 psi thì dừng.', tag: 'Nạp hơi' },
    { f: 'Nạp mà kim đồng hồ không tăng → ?', b: 'Không tuần hoàn → nghi <b>tắc</b>.', tag: 'Nạp hơi' },
    { f: 'Vì sao dừng ở ~15 psi chưa kết luận?', b: 'Áp suất còn phụ thuộc nhiệt độ môi trường và dàn.', tag: 'Nạp hơi' },
    { f: 'Chạy thử bao lâu để đánh giá?', b: 'Khoảng <b>3 – 5 giờ</b> (khay đá ~24 giờ).', tag: 'Nạp hơi' },
    { f: 'Áp ổn định tủ 1 sao đủ gas?', b: '<b>9 – 12 psi</b>.', tag: 'Nạp hơi' },
    { f: 'Áp ổn định tủ 2 sao đủ gas?', b: '<b>6 – 9 psi</b>.', tag: 'Nạp hơi' },
    { f: 'Áp ổn định tủ 3–4 sao đủ gas?', b: '<b>2 – 6 psi</b>.', tag: 'Nạp hơi' },
    { f: 'Giá trị áp ổn định phụ thuộc gì?', b: '<b>Nhiệt độ môi trường</b> và số sao; không phụ thuộc trọng lượng gas, dung tích.', tag: 'Nạp hơi' },
    { f: 'Gas ĐỦ: dàn nóng ra sao?', b: '<b>Nóng đều</b> từ đầu đến cuối.', tag: 'Đánh giá' },
    { f: 'Gas ĐỦ: dàn lạnh ra sao?', b: 'Tuyết bám đều, <b>khô, dính tay</b> (tủ 3–4 sao).', tag: 'Đánh giá' },
    { f: 'Gas ĐỦ: ống hồi về ra sao?', b: '<b>Mát và khô</b>, không đổ mồ hôi.', tag: 'Đánh giá' },
    { f: 'Gas ĐỦ: dòng?', b: '<b>≤ dòng định mức</b>, ổn định.', tag: 'Đánh giá' },
    { f: 'Gas THIẾU: dấu hiệu?', b: 'Dàn nóng chỉ nóng đầu dàn, tuyết ít chỉ ở đầu dàn, dòng nhỏ hơn định mức.', tag: 'Đánh giá' },
    { f: 'Gas THỪA: dấu hiệu?', b: 'Dàn nóng rất nóng, ống hồi <b>đổ mồ hôi</b>, dòng bằng hoặc hơn định mức.', tag: 'Đánh giá' },
    { f: 'Xử lý thiếu gas? Thừa gas?', b: 'Thiếu: <b>nạp bổ sung</b>. Thừa: <b>xả bớt</b>.', tag: 'Đánh giá' },
    { f: 'Khi nào được xả bớt gas?', b: 'Khi áp suất <b>lớn hơn khí quyển</b>; nếu thấp hơn, cân bằng áp (ngắt điện) rồi mới xả.', tag: 'Đánh giá' },
    { f: 'Gas hỗn hợp không đồng sôi bị sai lượng thì?', b: 'Không được xả/ nạp bổ sung → <b>thay toàn bộ</b> gas.', tag: 'Đánh giá' },
    { f: 'Hàn kín ống nạp thế nào?', b: 'Dùng kìm <b>kẹp bẹp</b> ống rồi hàn kín (khi block chạy, áp thấp).', tag: 'Hoàn tất' },
    { f: 'Gas R600a (hydrocarbon) hoàn tất thế nào?', b: 'Hạn chế hàn: dùng <b>van một chiều + keo dán ống</b>.', tag: 'Hoàn tất' },
    { f: 'Sau nạp, block không khởi động, áp cân bằng 80–140 psi?', b: '<b>Block yếu</b> không khởi động khi có tải.', tag: 'Hư hỏng sau nạp' },
    { f: 'Áp thấp lên đột ngột 50–70 psi, tủ mất lạnh?', b: 'Block <b>lọt hơi</b> (hỏng van) → thay block.', tag: 'Hư hỏng sau nạp' },
    { f: 'Tắc: kim áp thấp và dòng ra sao?', b: 'Áp xuống dưới 0, dòng tụt ~0,2 A (chạy chân không), dàn nóng nguội.', tag: 'Hư hỏng sau nạp' },
    { f: 'Phân biệt tắc ẩm và tắc bẩn?', b: 'Mở cửa tủ cho ấm lên: <b>áp lên lại</b> = tắc ẩm; <b>không lên</b> = tắc bẩn.', tag: 'Hư hỏng sau nạp' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Thông số cần tra trước khi nạp gas?', ['Loại gas, trọng lượng gas, dòng định mức', 'Màu tủ', 'Hãng', 'Giá'], 0, 'Nhãn sau tủ.'),
    Q('Nạp gas chính xác nhất khi?', ['Nạp thể lỏng theo trọng lượng', 'Nạp thể hơi', 'Nạp theo cảm giác', 'Nạp theo nhiệt độ'], 0, 'Dùng cân.'),
    Q('Dòng định mức là?', ['Dòng làm việc tối đa khi có tải', 'Dòng khởi động', 'Dòng rò', 'Dòng bằng 0'], 0, 'Không được vượt.'),
    Q('Mở van gas nạp hơi mỗi lần khoảng?', ['Vài giây', '10 phút', 'Liên tục', '1 giờ'], 0, 'Tránh nạp thừa.'),
    Q('Kim áp thấp khi nạp dừng ở?', ['≈ 15 psi', '≈ 150 psi', '≈ 0', '≈ −30'], 0, 'Rồi chạy thử.'),
    Q('Nạp mà kim không tăng nghĩa là?', ['Không tuần hoàn, nghi tắc', 'Đủ gas', 'Thừa gas', 'Block tốt'], 0, 'Gas không đi qua.'),
    Q('Chạy thử đánh giá khoảng?', ['3 – 5 giờ', '1 phút', '1 tuần', 'Không cần'], 0, 'Để áp ổn định.'),
    Q('Tủ 1 sao đủ gas, áp ổn định?', ['9–12 psi', '2–6', '6–9', '50–70'], 0, 'Bảng.'),
    Q('Tủ 2 sao đủ gas?', ['6–9 psi', '9–12', '2–6', '80–140'], 0, 'Bảng.'),
    Q('Tủ 3–4 sao đủ gas?', ['2–6 psi', '9–12', '6–9', '20–37'], 0, 'Bảng.'),
    Q('Áp ổn định phụ thuộc chủ yếu?', ['Nhiệt độ môi trường và số sao', 'Trọng lượng gas', 'Dung tích tủ', 'Màu'], 0, 'Theo bài.'),
    Q('Dấu hiệu gas đủ ở dàn nóng?', ['Nóng đều', 'Chỉ nóng đầu', 'Rất nóng', 'Lạnh'], 0, 'Đầu → cuối.'),
    Q('Dấu hiệu gas đủ ở ống hồi về?', ['Mát và khô', 'Đổ mồ hôi', 'Nóng', 'Đóng băng'], 0, 'Không lỏng về block.'),
    Q('Gas thừa, ống hồi về?', ['Đổ mồ hôi', 'Khô', 'Nóng', 'Không đổi'], 0, 'Lỏng về block.'),
    Q('Gas thiếu, dàn nóng?', ['Chỉ nóng đầu dàn', 'Rất nóng', 'Nóng đều', 'Nguội hẳn'], 0, 'Ít gas ngưng.'),
    Q('Gas thừa xử lý?', ['Xả bớt', 'Nạp thêm', 'Thay dầu', 'Thay phin'], 0, 'Khi áp > 0.'),
    Q('Gas thiếu xử lý?', ['Nạp bổ sung', 'Xả bớt', 'Hàn luôn', 'Thay block'], 0, 'Từng chút.'),
    Q('Khi áp thấp hơn khí quyển mà xả gas?', ['Hút không khí vào', 'An toàn', 'Gas thoát nhanh', 'Tủ lạnh hơn'], 0, 'Không được xả.'),
    Q('Gas hỗn hợp không đồng sôi lệch lượng thì?', ['Thay toàn bộ gas', 'Xả bớt', 'Nạp thêm', 'Kệ'], 0, 'Thành phần bị lệch.'),
    Q('Hàn kín ống nạp trước tiên làm gì?', ['Kẹp bẹp ống bằng kìm', 'Cắt ống', 'Đổ dầu', 'Tăng áp'], 0, 'Rồi hàn.'),
    Q('R600a hoàn tất bằng?', ['Van một chiều + keo', 'Hàn thật lâu', 'Không kín', 'Dây buộc'], 0, 'Dễ cháy nổ.'),
    Q('Block không khởi động có tải, áp cân bằng 80–140 psi?', ['Block yếu', 'Thừa gas', 'Tắc ẩm', 'Thiếu gas'], 0, 'Không khởi động nổi.'),
    Q('Áp tăng đột ngột 50–70 psi, mất lạnh?', ['Block lọt hơi', 'Thiếu gas', 'Tắc', 'Quạt hỏng'], 0, 'Thay block.'),
    Q('Tắc: dòng ra sao?', ['Tụt còn ~0,2 A', 'Lên rất cao', 'Bằng định mức', 'Dao động mạnh'], 0, 'Chạy chân không.'),
    Q('Mở cửa tủ, áp lên lại → ?', ['Tắc ẩm', 'Tắc bẩn', 'Thừa gas', 'Thiếu gas'], 0, 'Băng tan.')
  ];
  const sort = {
    title: 'Dấu hiệu thuộc tình trạng nào?',
    buckets: [{ id: 'low', name: 'Thiếu gas' }, { id: 'ok', name: 'Đủ gas' }, { id: 'high', name: 'Thừa gas' }],
    items: [
      { t: 'Chỉ nóng đầu dàn nóng', b: 'low' }, { t: 'Tuyết chỉ bám đầu dàn', b: 'low' }, { t: 'Dòng nhỏ hơn định mức nhiều', b: 'low' }, { t: 'Cần nạp bổ sung', b: 'low' },
      { t: 'Dàn nóng nóng đều', b: 'ok' }, { t: 'Tuyết đều, khô, dính tay', b: 'ok' }, { t: 'Ống hồi mát, khô', b: 'ok' }, { t: 'Dòng ≤ định mức, có thể hàn kín', b: 'ok' },
      { t: 'Dàn nóng rất nóng', b: 'high' }, { t: 'Ống hồi đổ mồ hôi', b: 'high' }, { t: 'Dòng bằng hoặc hơn định mức', b: 'high' }, { t: 'Phải xả bớt', b: 'high' }
    ]
  };
  const order = [
    { title: 'Nạp gas thể hơi', intro: 'Sắp xếp các bước nạp.', steps: ['Tạo chân không đạt −30 inHg', 'Chuyển dây sang bình gas, xả đuổi khí trong dây', 'Cấp điện cho block, kẹp ampe kìm', 'Mở van gas vài giây rồi khóa, theo dõi kim', 'Lặp lại đến khoảng 15 psi rồi chạy thử vài giờ', 'Đánh giá đủ gas rồi kẹp ống và hàn kín'] },
    { title: 'Xử lý khi thừa gas', intro: 'Sắp xếp các bước.', steps: ['Phát hiện: dàn nóng rất nóng, ống hồi đổ mồ hôi', 'Kiểm tra kim áp thấp lớn hơn 0', 'Mở từ từ van xả, xả một ít gas', 'Khóa van, chạy thử quan sát lại', 'Dàn nóng nóng đều, ống hồi khô', 'Kẹp ống và hàn kín'] },
    { title: 'Phân biệt tắc ẩm và tắc bẩn', intro: 'Sắp xếp các bước.', steps: ['Quan sát áp tụt xuống chân không, dòng thấp', 'Ngắt điện tủ', 'Mở cánh cửa tủ cho nhiệt độ lên dương', 'Theo dõi kim đồng hồ áp thấp', 'Áp lên lại: tắc ẩm → khử ẩm, thay phin', 'Áp không lên: tắc bẩn → súc rửa, thay phin/ống mao'] }
  ];
  DL.register({
    id: 17, ready: true, title: 'Nạp gas cho tủ lạnh', sub: 'Chuẩn bị, nạp thể hơi, đánh giá đủ – thiếu – thừa, hư hỏng sau nạp', minutes: 35,
    lead: 'Bước cuối của quy trình sửa chữa: nạp đúng lượng gas. Bài có mô phỏng nạp từng chút theo áp suất và biểu hiện, bảng nhận biết thiếu – đủ – thừa và bài tập chẩn đoán hư hỏng sau nạp.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
