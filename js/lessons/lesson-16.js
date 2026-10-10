/* BÀI 16 — CÂN CÁP VÀ TẠO CHÂN KHÔNG (biên soạn từ docs/Bai_16.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  // số liệu theo bài giảng (psi): [min, max]
  const RANGE = {
    out: { 1: [135, 150], 2: [155, 170], 3: [175, 190], none: [135, 197] },
    inn: { 1: [150, 165], 2: [170, 185], 3: [190, 220], none: [150, 220] }
  };

  function learn() {
    return `
<section class="sec" id="s-why" data-toc="1 · Vì sao cân cáp">
  <div class="sec-n">Phần 1</div><h2>Ôn lại: ống mao quyết định áp suất bay hơi</h2>
  <p>Gas lỏng áp cao (khoảng <b>8 bar</b>, cuối dàn nóng 45–55 °C) đi qua ống mao (dài cỡ <b>1,5 m</b>, đường kính trong cỡ <b>0,6 mm</b>) bị giảm áp xuống rất thấp (cỡ <b>0,6 bar</b>) rồi sôi ở khoảng <b>−23 °C</b> trong dàn lạnh.</p>
  <div class="tabs"><div class="tab" style="cursor:default"><b>↑</b><span><strong>Ống mao quá ngắn / quá to</strong><br><small class="muted">trở lực nhỏ → P0 cao → gas sôi ở nhiệt độ cao → tủ không đủ lạnh</small></span></div><div class="tab" style="cursor:default"><b>↓</b><span><strong>Ống mao quá dài / quá nhỏ</strong><br><small class="muted">trở lực lớn → lưu lượng gas ít → năng suất lạnh giảm</small></span></div></div>
  <p style="margin-top:14px"><b>Cân cáp</b> = đo <b>trở lực không khí</b> của block + ống mao để chọn <b>chiều dài và tiết diện</b> ống mao cho đúng. Chỉ áp dụng khi <b>thay block</b>, <b>đổi loại gas</b> hoặc <b>lắp mới</b> hệ thống (không cần khi chỉ thay phin, sửa nhỏ).</p>
</section>

<section class="sec" id="s-method" data-toc="2 · Hai phương pháp">
  <div class="sec-n">Phần 2</div><h2>Cân cáp ngoài và cân cáp trong</h2>
  <div id="mTabs"></div><article class="panel" id="mPanel" aria-live="polite"></article>
  <h3 style="margin-top:22px">Giá trị trở lực quy định (psi)</h3>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Loại tủ</th><th>Cân cáp ngoài</th><th>Cân cáp trong</th></tr></thead><tbody>
    <tr><th>1 sao</th><td>135 – 150</td><td>150 – 165</td></tr><tr><th>2 sao</th><td>155 – 170</td><td>170 – 185</td></tr><tr><th>3 và 4 sao</th><td>175 – 190</td><td>190 – 220</td></tr><tr><th>Tủ không ghi sao</th><td>≈ 135 – 197</td><td>≈ 150 – 220</td></tr></tbody></table></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Quy tắc xử lý kết quả</b><p>Đo được <b>lớn hơn</b> quy định → trở lực quá lớn → <b>cắt bớt</b> ống mao hoặc thay ống <b>tiết diện lớn hơn</b>. Đo được <b>nhỏ hơn</b> → <b>nối thêm</b> ống mao hoặc thay ống tiết diện <b>nhỏ hơn</b>. Cắt từ từ, đừng cắt đứt một lần — cắt quá thì không nối lại được.</p></div></div>
  <h3 style="margin-top:26px">🔬 Thực hành cân cáp</h3>
  <p>Chọn tủ, phương pháp và độ khỏe của block. Kéo thanh chiều dài ống mao để đưa kim vào dải quy định.</p>
  <div class="gauge-wrap"><div class="stage" style="margin:0"><div id="gBox"></div></div>
    <div><div class="row"><label>Tủ <select id="cStar" class="btn sm" style="min-height:36px"><option value="1">1 sao</option><option value="2">2 sao</option><option value="3" selected>3 – 4 sao</option><option value="none">Không ghi sao</option></select></label><label>Phương pháp <select id="cM" class="btn sm" style="min-height:36px"><option value="out">Cân cáp ngoài</option><option value="inn">Cân cáp trong</option></select></label></div>
      <div class="row" style="margin-top:10px"><label>Block <select id="cB" class="btn sm" style="min-height:36px"><option value="0">trung bình</option><option value="12">khỏe (đẩy mạnh)</option><option value="-12">yếu</option></select></label></div>
      <label class="row" style="gap:12px;margin-top:10px">Chiều dài ống mao <input id="cL" type="range" min="0.3" max="2.5" step="0.05" value="1.5" style="width:200px"> <b id="cLV"></b></label>
      <div class="verdict" id="cV" style="margin-top:12px"></div></div></div>
  <div class="callout"><span class="ic">📌</span><div><b class="t">Lưu ý khi cân cáp</b><ul style="margin:6px 0 0;padding-left:18px"><li>Trước khi cân, đo <b>áp suất đẩy</b> của block: block <b>khỏe</b> thì chọn giá trị trở lực <b>cao</b>, block <b>yếu</b> chọn giá trị <b>thấp</b>.</li><li>Tủ đời mới thường không ghi số sao (đều đạt mức nhiệt cao) → dùng dải chung.</li><li>Thay block mà trở lực đo được <b>nhỏ hơn nhiều</b> → block công suất <b>nhỏ/yếu</b> hơn hệ thống, nên chọn block khác tương xứng. Đo <b>lớn hơn nhiều</b> → block <b>mạnh</b> hơn hoặc hệ thống bị <b>tắc</b> một phần.</li><li>Cân cáp cũng giúp kiểm tra block mới đã <b>phù hợp</b> với dung tích tủ chưa.</li></ul></div></div>
</section>

<section class="sec" id="s-vac" data-toc="3 · Tạo chân không">
  <div class="sec-n">Phần 3</div><h2>Tạo chân không</h2>
  <p>Trước khi nạp gas phải <b>hút sạch không khí và hơi ẩm</b> ra khỏi hệ thống. Nếu không: hơi ẩm sinh <b>axit</b>, hỏng dầu; bụi gây <b>tắc</b>; không khí làm áp suất đẩy cao, block quá tải, tủ kém lạnh, có thể <b>cháy block</b>.</p>
  <div id="vTabs"></div><article class="panel warm" id="vPanel" aria-live="polite"></article>
  <h3 style="margin-top:24px">Nối đồng hồ và hút (đồng hồ 2 dây)</h3>
  ${U.steps([['Nối hệ thống: dây đồng hồ thấp vào ống công nghệ, dây trung gian vào máy hút (hoặc block hút)', 'Ống đẩy của máy hút để hở. Mở khóa đồng hồ thấp.'], ['Cấp điện cho máy hút (block hút)', 'Máy hút toàn bộ không khí ra ngoài; theo dõi kim đồng hồ chân không.'], ['Kim chỉ −76 cmHg (−30 inHg) và ống đẩy của máy hút <b>không còn khí</b>', 'Mới đạt yêu cầu. Còn khí → còn không khí hoặc hở. Có thể quét <b>bọt xà phòng</b> kiểm tra đầu nối.'], ['Khóa van đồng hồ, ngắt nguồn máy hút', 'Chuyển dây trung gian từ máy hút sang bình gas.'], ['Xả đuổi không khí trong dây', 'Mở nhẹ van bình gas và khóa đồng hồ để gas đẩy hết khí trong dây ra ngoài (hoặc nới lỏng đầu dây) rồi vặn lại.'], ['Sẵn sàng nạp gas', '']])}
  <div class="grid2"><div class="panel" style="margin:0"><h4>Đồng hồ 3 dây</h4><p style="margin:6px 0 0">Dây giữa nối bình gas, dây thấp nối ống công nghệ, dây còn lại nối máy hút. Đóng khóa bình gas, mở khóa thấp để hút. Hút xong khóa van, ngắt máy hút, mở bình gas là nạp được ngay — <b>không phải tháo dây</b>.</p></div>
    <div class="panel warm" style="margin:0"><h4>Tự chế máy hút</h4><p style="margin:6px 0 0">Block tủ lạnh <b>hút gián tiếp, đẩy trực tiếp</b>: hàn kín đầu nạp gas, nối ống hút (hoặc ống còn lại) với ống công nghệ phi 6 → hoạt động như máy hút chân không; ống đẩy để hở.</p></div></div>
  <h3 style="margin-top:26px">🔬 Mô phỏng hút chân không</h3>
  <p>Chọn tình trạng hệ thống, bấm <b>Bắt đầu hút</b> (1 giây thật ≈ 3 phút). Tắt khi bạn thấy đủ rồi xem kết quả giữ chân không.</p>
  <div class="gauge-wrap"><div class="stage" style="margin:0"><div id="vBox"></div><div class="controls" style="justify-content:center"><span class="muted" id="vClock">0 phút</span></div></div>
    <div><div class="opts-r"><label><input type="radio" name="vs" value="ok" checked><span><b>Hệ thống kín, thông</b></span></label><label><input type="radio" name="vs" value="leak"><span><b>Hệ thống bị hở (rò khí)</b></span></label><label><input type="radio" name="vs" value="clog"><span><b>Hệ thống bị tắc</b> (chỉ hút được một phần)</span></label><label><input type="radio" name="vs" value="wet"><span><b>Có ẩm trong dầu</b> (gas HFC / dầu polyeste)</span></label></div>
      <label class="row" style="gap:8px"><input type="checkbox" id="vHeat"> Sấy nóng block, dàn bằng máy sấy tóc</label>
      <div class="row" style="margin-top:10px"><button class="btn pri sm" id="vGo">▶ Bắt đầu hút</button><button class="btn sm" id="vStop">⏹ Khóa van, tắt máy hút</button></div>
      <div class="verdict" id="vV" style="margin-top:10px">Chọn tình trạng rồi bấm “Bắt đầu hút”.</div></div></div>
</section>

<section class="sec" id="s-tip" data-toc="4 · Lưu ý chân không">
  <div class="sec-n">Phần 4</div><h2>Lưu ý khi tạo chân không</h2>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Thời gian hút</th><th>Kim chân không</th><th>Kết luận</th></tr></thead><tbody>
    <tr><th>Rất lâu</th><td>Vẫn không về −30 inHg / còn khí ở ống đẩy</td><td><span class="pill bad">Hệ thống bị <b>hở</b></span></td></tr>
    <tr><th>Rất ngắn</th><td>Về −30 inHg quá nhanh</td><td><span class="pill bad">Hệ thống bị <b>tắc</b> (chỉ hút được đoạn gần)</span></td></tr>
    <tr><th>≥ 30 phút (càng lâu càng tốt)</th><td>Về −30 inHg, giữ ổn định</td><td><span class="pill ok">Đạt yêu cầu</span></td></tr></tbody></table></div>
  <div class="callout mem"><span class="ic">🌡️</span><div><b class="t">Khử ẩm trong dầu</b><p>Gas HFC dùng dầu polyeste <b>hút ẩm</b> mạnh; hơi nước nằm trong dầu. Muốn hiệu quả: <b>sấy nóng</b> block, dàn (máy sấy tóc) để hơi nước bốc ra rồi hút; hoặc <b>thay dầu</b> / súc rửa trước. Thời gian hút nên từ <b>30 phút trở lên</b>.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Ống mao dài/nhỏ → áp suất sôi thấp, lưu lượng ít; ngắn/to → P0 cao, kém lạnh.</b></div></li>
    <li class="done"><div><b>Cân cáp: đo trở lực không khí để chọn chiều dài, tiết diện.</b><span>Chỉ khi thay block, đổi gas, lắp mới.</span></div></li>
    <li class="done"><div><b>Cân cáp ngoài và trong; dải quy định theo số sao (psi).</b></div></li>
    <li class="done"><div><b>Lớn hơn quy định → cắt bớt; nhỏ hơn → nối thêm.</b></div></li>
    <li class="done"><div><b>Chân không đạt −30 inHg (−76 cmHg), hút ≥ 30 phút.</b></div></li>
    <li class="done"><div><b>Hút lâu không hết khí: hở. Hút quá nhanh: tắc. Có ẩm: sấy nóng.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/16/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const METH = {
    out: ['Cân cáp ngoài', 'Lắp <b>block và ống mao</b> (chưa gắn vào tủ) thành một mạch thử bên ngoài: đầu đẩy block nối với phin lọc/ống công nghệ qua đồng hồ áp suất cao (nối đầu ống mao còn lại để hở). Cho block chạy, quan sát kim: <b>kim lên rồi dừng</b> = trở lực không khí của block + ống mao. So sánh với bảng. Dùng khi chưa lắp hệ thống.'],
    inn: ['Cân cáp trong', 'Hệ thống <b>đã lắp hoàn chỉnh</b> (dùng khi ống mao nằm chìm khó tháo ra). Nối đồng hồ áp cao vào ống công nghệ trên phin, <b>đầu nạp gas để hở</b> (không khí vào theo ống hút). Cho block chạy; kim lên rồi đứng im = trở lực của block + ống mao + dàn lạnh. So với bảng (giá trị cao hơn bảng “ngoài” vì có thêm dàn lạnh).']
  };
  const VM = {
    pump: ['Dùng máy hút chân không', 'Máy chuyên dụng. Nối qua bộ đồng hồ 2 hoặc 3 dây, hút cho tới −30 inHg. Hiệu quả nhất.'],
    own: ['Dùng block trong hệ thống', 'Không có máy hút: nối ống công nghệ (qua đồng hồ) rồi cho chính block hút khí dàn lạnh đẩy sang dàn nóng. Khí thoát ra <b>ống công nghệ</b>. Khi không còn khí đẩy ra, kim đạt −30 inHg thì dàn nóng còn cân bằng áp khí quyển. Mở nhẹ van <b>bình gas</b> để gas đẩy khí ở dàn nóng, <b>lặp 3–4 lần</b>, tới khi hết khí rồi <b>vừa hàn kín</b> ống công nghệ <b>vừa để block chạy</b> (nếu rút ra, dàn nóng tràn khí).']
  };

  function mount(root) {
    U.tabset($('#mTabs', root), [{ id: 'out', name: 'Cân cáp ngoài' }, { id: 'inn', name: 'Cân cáp trong' }], id => { $('#mPanel', root).innerHTML = `<h3>${METH[id][0]}</h3><p style="margin:0">${METH[id][1]}</p>`; });
    U.tabset($('#vTabs', root), [{ id: 'pump', name: 'Máy hút chân không' }, { id: 'own', name: 'Block trong hệ thống' }], id => { $('#vPanel', root).innerHTML = `<h3>${VM[id][0]}</h3><p style="margin:0">${VM[id][1]}</p>`; });
    // cân cáp
    const L = $('#cL', root);
    const cc = () => {
      const star = $('#cStar', root).value, m = $('#cM', root).value, off = +$('#cB', root).value, l = +L.value;
      const val = Math.round(110 + 50 * l + (m === 'inn' ? 18 : 0) + off);
      $('#cLV', root).textContent = l.toFixed(2) + ' m'; $('#gBox', root).innerHTML = U.gauge(val, { min: 0, max: 300, step: 50, unit: 'psi', good: RANGE[m][star] });
      const r = RANGE[m][star], v = $('#cV', root);
      v.className = 'verdict ' + (val >= r[0] && val <= r[1] ? 'ok' : 'bad');
      v.innerHTML = val > r[1] ? `Trở lực ${val} psi <b>lớn hơn</b> quy định (${r[0]}–${r[1]}) → <b>cắt bớt</b> ống mao hoặc dùng ống tiết diện lớn hơn.` : val < r[0] ? `Trở lực ${val} psi <b>nhỏ hơn</b> quy định (${r[0]}–${r[1]}) → <b>nối thêm</b> ống mao hoặc dùng ống tiết diện nhỏ hơn.` : `✓ Trở lực ${val} psi nằm trong dải quy định (${r[0]}–${r[1]} psi): ống mao đạt.`;
    };
    ['#cStar', '#cM', '#cB'].forEach(s => $(s, root).onchange = cc); L.oninput = cc; cc();
    // chân không
    let t = 0, tm, v = 0, running = false;
    const vg = () => $('#vBox', root).innerHTML = U.gauge(v, { min: -30, max: 0, step: 5, unit: 'inHg', good: [-30, -27] });
    const model = (s, heat) => { const tau = s === 'wet' ? (heat ? 4.5 : 11) : 6; if (s === 'leak') return -17 * (1 - Math.exp(-t / tau)); if (s === 'clog') return -30 * (1 - Math.exp(-t / .6)); return -30 * (1 - Math.exp(-t / tau)); };
    const reset = () => { clearInterval(tm); running = false; t = 0; v = 0; vg(); $('#vClock', root).textContent = '0 phút'; $('#vV', root).className = 'verdict'; $('#vV', root).textContent = 'Chọn tình trạng rồi bấm “Bắt đầu hút”.'; };
    $('#vGo', root).onclick = () => { reset(); running = true; tm = setInterval(() => { if (!document.body.contains($('#vBox', root))) { clearInterval(tm); return; } t += .6; v = model($('input[name=vs]:checked', root).value, $('#vHeat', root).checked); vg(); $('#vClock', root).textContent = Math.round(t) + ' phút'; if (t >= 60) { clearInterval(tm); } }, 200); };
    $('#vStop', root).onclick = () => {
      if (!running) return; clearInterval(tm); running = false; const s = $('input[name=vs]:checked', root).value, vv = $('#vV', root); vv.className = 'verdict bad';
      if (t < 30 && s !== 'clog') { vv.innerHTML = `✗ Mới hút <b>${Math.round(t)} phút</b> (nên ≥ 30 phút). Dù kim chưa tới −30, hơi ẩm và khí còn sót. Hãy hút lâu hơn.`; return; }
      if (s === 'clog') vv.innerHTML = `✗ Kim về −30 inHg chỉ sau ~${Math.max(1, Math.round(t))} phút: <b>quá nhanh</b> → hệ thống <b>bị tắc</b> (chỉ hút được đoạn gần máy hút). Phải tìm chỗ tắc (phin, ống mao...) trước khi nạp.`;
      else if (s === 'leak') vv.innerHTML = '✗ Hút rất lâu mà kim <b>không về −30 inHg</b> (chỉ ~ −17) → hệ thống <b>bị hở</b>. Kiểm tra mối hàn bằng bọt xà phòng.';
      else if (v > -29) vv.innerHTML = `✗ Kim mới ${v.toFixed(1)} inHg, chưa đạt −30. Hút tiếp${s === 'wet' && !$('#vHeat', root).checked ? ' và nên <b>sấy nóng</b> block, dàn để đuổi ẩm trong dầu' : ''}.`;
      else { vv.className = 'verdict ok'; vv.innerHTML = `✓ Đạt −30 inHg sau ${Math.round(t)} phút, hút ≥ 30 phút. Khóa van, giữ chân không ổn định. Chuyển dây sang bình gas để nạp.`; }
    };
    $$('input[name=vs]', root).forEach(r => r.onchange = reset); $('#vHeat', root).onchange = reset; reset();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Gas áp cao ở dàn nóng khoảng bao nhiêu?', b: 'Khoảng <b>8 bar</b>, 45–55 °C cuối dàn.', tag: 'Ôn lại' },
    { f: 'Ống mao có kích thước điển hình?', b: 'Dài ~<b>1,5 m</b>, đường kính trong ~<b>0,6 mm</b>.', tag: 'Ôn lại' },
    { f: 'Gas sôi ở dàn lạnh khoảng bao nhiêu độ?', b: 'Khoảng <b>−23 °C</b> (áp ~0,6 bar).', tag: 'Ôn lại' },
    { f: 'Ống mao quá ngắn hoặc quá to gây gì?', b: 'P0 cao, nhiệt độ sôi cao → tủ kém lạnh.', tag: 'Ôn lại' },
    { f: 'Ống mao quá dài hoặc quá nhỏ gây gì?', b: 'Lưu lượng gas ít → năng suất lạnh giảm.', tag: 'Ôn lại' },
    { f: 'Cân cáp là gì?', b: 'Đo <b>trở lực không khí</b> của block + ống mao để chọn chiều dài, tiết diện ống mao.', tag: 'Cân cáp' },
    { f: 'Khi nào cần cân cáp?', b: 'Thay <b>block</b>, đổi <b>gas</b> hoặc lắp mới hệ thống.', tag: 'Cân cáp' },
    { f: 'Cân cáp ngoài là gì?', b: 'Thử block + ống mao <b>bên ngoài</b> hệ thống.', tag: 'Cân cáp' },
    { f: 'Cân cáp trong là gì?', b: 'Cân trên hệ thống <b>đã lắp hoàn chỉnh</b> (có dàn lạnh).', tag: 'Cân cáp' },
    { f: 'Cân cáp ngoài tủ 1 sao?', b: '<b>135 – 150 psi</b>.', tag: 'Cân cáp' },
    { f: 'Cân cáp ngoài tủ 2 sao?', b: '<b>155 – 170 psi</b>.', tag: 'Cân cáp' },
    { f: 'Cân cáp ngoài tủ 3–4 sao?', b: '<b>175 – 190 psi</b>.', tag: 'Cân cáp' },
    { f: 'Cân cáp trong tủ 3–4 sao?', b: '<b>190 – 220 psi</b>.', tag: 'Cân cáp' },
    { f: 'Giá trị đo lớn hơn quy định thì làm gì?', b: '<b>Cắt bớt</b> ống mao hoặc thay ống tiết diện lớn hơn.', tag: 'Cân cáp' },
    { f: 'Giá trị đo nhỏ hơn quy định thì làm gì?', b: '<b>Nối thêm</b> ống mao hoặc dùng ống tiết diện nhỏ hơn.', tag: 'Cân cáp' },
    { f: 'Block khỏe thì chọn trở lực thế nào?', b: 'Chọn giá trị <b>cao</b>; block yếu chọn thấp.', tag: 'Cân cáp' },
    { f: 'Thay block, trở lực đo nhỏ hơn nhiều?', b: 'Block <b>công suất nhỏ/yếu</b> so với hệ thống.', tag: 'Cân cáp' },
    { f: 'Vì sao phải tạo chân không?', b: 'Loại không khí và hơi ẩm: tránh axit, tắc, quá áp, cháy block.', tag: 'Chân không' },
    { f: 'Độ chân không đạt yêu cầu?', b: '<b>−76 cmHg = −30 inHg</b>.', tag: 'Chân không' },
    { f: 'Hai cách tạo chân không?', b: 'Máy hút chân không / block trong hệ thống.', tag: 'Chân không' },
    { f: 'Tự chế máy hút từ block thế nào?', b: 'Hàn kín đầu nạp gas, nối ống hút với ống công nghệ, ống đẩy để hở.', tag: 'Chân không' },
    { f: 'Thời gian hút tối thiểu?', b: '<b>≥ 30 phút</b>, càng lâu càng tốt.', tag: 'Chân không' },
    { f: 'Hút lâu mà không hết khí → ?', b: 'Hệ thống bị <b>hở</b>.', tag: 'Chân không' },
    { f: 'Hút quá nhanh đã hết khí → ?', b: 'Hệ thống bị <b>tắc</b>.', tag: 'Chân không' },
    { f: 'Kiểm tra đầu nối bằng gì?', b: 'Bọt xà phòng.', tag: 'Chân không' },
    { f: 'Vì sao phải sấy nóng khi hút?', b: 'Hơi nước nằm trong dầu (polyeste) cần bốc ra mới hút được.', tag: 'Chân không' },
    { f: 'Dùng block trong hệ thống: xả khí dàn nóng mấy lần?', b: 'Khoảng <b>3–4 lần</b> bằng gas bình, tới khi hết khí.', tag: 'Chân không' },
    { f: 'Hàn kín ống công nghệ khi nào?', b: 'Khi hết khí, <b>lúc block vẫn đang chạy</b>.', tag: 'Chân không' },
    { f: 'Sau khi hút xong, trước khi nạp gas làm gì với dây?', b: 'Xả đuổi không khí trong dây bằng gas.', tag: 'Chân không' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Cân cáp là gì?', ['Đo trở lực không khí chọn ống mao', 'Cân gas', 'Cân block', 'Đo điện áp'], 0, 'Định nghĩa.'),
    Q('Khi nào cần cân cáp?', ['Thay block hoặc đổi gas', 'Thay phin', 'Thay đèn', 'Vệ sinh dàn'], 0, 'Thay đổi hệ thống.'),
    Q('Ống mao quá ngắn → ?', ['P0 cao, kém lạnh', 'P0 thấp, lạnh sâu', 'Block nóng', 'Không đổi'], 0, 'Trở lực nhỏ.'),
    Q('Ống mao quá dài → ?', ['Lưu lượng ít, năng suất giảm', 'Lạnh sâu', 'Block mát', 'Không đổi'], 0, 'Trở lực lớn.'),
    Q('Cân cáp ngoài tủ 1 sao?', ['135–150 psi', '175–190', '190–220', '50–100'], 0, 'Bảng.'),
    Q('Cân cáp ngoài tủ 3–4 sao?', ['175–190 psi', '135–150', '155–170', '250–300'], 0, 'Bảng.'),
    Q('Cân cáp trong tủ 3–4 sao?', ['190–220 psi', '135–150', '150–165', '70–90'], 0, 'Bảng.'),
    Q('Đo lớn hơn quy định, xử lý?', ['Cắt bớt ống mao', 'Nối thêm', 'Thêm gas', 'Thay phin'], 0, 'Giảm trở lực.'),
    Q('Đo nhỏ hơn quy định, xử lý?', ['Nối thêm ống mao', 'Cắt bớt', 'Bỏ ống mao', 'Thay dầu'], 0, 'Tăng trở lực.'),
    Q('Block khỏe nên chọn trở lực?', ['Cao', 'Thấp', 'Bằng 0', 'Không cần'], 0, 'Theo bài.'),
    Q('Cân cáp trong làm trên?', ['Hệ thống đã lắp xong', 'Block rời', 'Dàn nóng rời', 'Phin rời'], 0, 'Có cả dàn lạnh.'),
    Q('Cân cáp ngoài dùng?', ['Block + ống mao rời', 'Cả hệ thống', 'Chỉ dàn', 'Chỉ phin'], 0, 'Thử bên ngoài.'),
    Q('Thay block, trở lực đo nhỏ hơn nhiều → ?', ['Block yếu hơn hệ thống', 'Block khỏe', 'Ống mao tắc', 'Gas thừa'], 0, 'Công suất không tương xứng.'),
    Q('Vì sao phải tạo chân không?', ['Loại không khí và hơi ẩm', 'Làm lạnh nhanh', 'Giảm điện', 'Tăng gas'], 0, 'Tránh axit, tắc, cháy.'),
    Q('Độ chân không đạt yêu cầu?', ['−30 inHg', '−5 inHg', '0 inHg', '+30 inHg'], 0, '−76 cmHg.'),
    Q('Thời gian hút nên?', ['≥ 30 phút', '30 giây', '1 phút', '5 giây'], 0, 'Lâu hiệu quả.'),
    Q('Hút lâu mà không hết khí?', ['Hệ thống hở', 'Hệ thống tắc', 'Tốt', 'Thừa gas'], 0, 'Có rò.'),
    Q('Hút nhanh đã hết khí?', ['Hệ thống tắc', 'Hệ thống hở', 'Tốt', 'Thiếu gas'], 0, 'Chỉ hút được đoạn gần.'),
    Q('Tự chế máy hút từ?', ['Block tủ lạnh', 'Quạt', 'Bơm nước', 'Tụ'], 0, 'Hút gián tiếp, đẩy trực tiếp.'),
    Q('Gas HFC dùng dầu?', ['Polyeste (hút ẩm)', 'Dầu khoáng', 'Dầu ăn', 'Nước'], 0, 'Ẩm nằm trong dầu.'),
    Q('Muốn khử ẩm trong dầu, nên?', ['Sấy nóng khi hút', 'Làm lạnh', 'Thêm gas', 'Đổ nước'], 0, 'Bốc hơi nước.'),
    Q('Dùng block trong hệ thống: xả khí dàn nóng bao nhiêu lần?', ['3–4 lần', '1 lần', '100 lần', 'Không xả'], 0, 'Tới khi hết khí.'),
    Q('Hàn kín ống công nghệ khi?', ['Block đang chạy', 'Block tắt', 'Chưa hút', 'Đã nạp gas'], 0, 'Tránh dàn nóng tràn khí.'),
    Q('Kiểm tra mối nối chân không bằng?', ['Bọt xà phòng', 'Đồng hồ điện', 'Quan sát', 'Nghe'], 0, 'Tìm chỗ rò.'),
    Q('Sau khi hút xong, dây cần?', ['Xả đuổi khí bằng gas', 'Để nguyên', 'Cắt bỏ', 'Hàn kín'], 0, 'Tránh đưa khí vào hệ thống.')
  ];
  const sort = {
    title: 'Hiện tượng khi hút chân không ứng với gì?',
    buckets: [{ id: 'leak', name: 'Hệ thống HỞ' }, { id: 'clog', name: 'Hệ thống TẮC' }, { id: 'ok', name: 'Đạt yêu cầu' }],
    items: [
      { t: 'Hút rất lâu vẫn còn khí đẩy ra', b: 'leak' }, { t: 'Kim không về −30 inHg', b: 'leak' }, { t: 'Quét xà phòng thấy bọt ở mối nối', b: 'leak' }, { t: 'Ngắt máy hút kim về 0 nhanh', b: 'leak' },
      { t: 'Hút vài phút đã hết khí', b: 'clog' }, { t: 'Kim về −30 quá nhanh', b: 'clog' }, { t: 'Chỉ hút được đoạn gần máy hút', b: 'clog' }, { t: 'Cần tìm chỗ tắc (phin, ống mao)', b: 'clog' },
      { t: 'Hút ≥ 30 phút, kim −30 inHg', b: 'ok' }, { t: 'Ống đẩy máy hút không còn khí', b: 'ok' }, { t: 'Kim đứng yên sau khi khóa van', b: 'ok' }, { t: 'Sẵn sàng nạp gas', b: 'ok' }
    ]
  };
  const order = [
    { title: 'Cân cáp trong', intro: 'Sắp xếp các bước.', steps: ['Hệ thống đã lắp hoàn chỉnh, chưa nạp gas', 'Nối đồng hồ áp cao vào ống công nghệ trên phin', 'Để hở đầu nạp gas', 'Cấp điện cho block chạy', 'Chờ kim đồng hồ dừng hẳn, ghi giá trị', 'So với bảng quy định, cắt hoặc nối ống mao'] },
    { title: 'Tạo chân không bằng máy hút', intro: 'Sắp xếp quy trình.', steps: ['Nối dây đồng hồ thấp vào ống công nghệ', 'Nối dây trung gian vào máy hút', 'Mở khóa đồng hồ, bật máy hút', 'Hút tới −30 inHg, ống đẩy hết khí, ≥ 30 phút', 'Khóa van, tắt máy hút', 'Chuyển dây sang bình gas và xả đuổi khí'] },
    { title: 'Tạo chân không bằng block trong hệ thống', intro: 'Sắp xếp quy trình.', steps: ['Nối ống công nghệ qua đồng hồ', 'Cho block chạy, hút khí dàn lạnh đẩy ra ống công nghệ', 'Kim đạt −30 inHg, hết khí đẩy ra', 'Mở nhẹ van bình gas xả khí dàn nóng, lặp 3–4 lần', 'Hết khí thì hàn kín ống công nghệ khi block vẫn chạy', 'Sẵn sàng nạp gas'] }
  ];
  DL.register({
    id: 16, ready: true, title: 'Cân cáp và tạo chân không', sub: 'Chọn ống mao đúng, hút sạch khí và ẩm', minutes: 30,
    lead: 'Hai bước chuẩn bị quan trọng trước khi nạp gas: chọn đúng ống mao bằng phương pháp cân cáp và hút hết không khí, hơi ẩm bằng chân không. Có mô phỏng cân cáp và mô phỏng hút chân không.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
