/* BÀI 12 — TỤ ĐIỆN, CÔNG TẮC, HỆ THỐNG XẢ TUYẾT (biên soạn từ docs/Bai_12.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const CAPS = {
    run: ['Tụ làm việc (tụ ngậm, CR)', 'Mắc <b>song song</b> với rơle khởi động (hoặc PTC). Tạo mô-men <b>vừa khởi động vừa làm việc</b>, nên làm việc <b>liên tục lâu dài</b>.', ['Điện dung nhỏ: thường <b>≤ 60 µF</b>', 'Điện áp chịu đựng cao: <b>400 – 500 V AC</b>', 'Kích thước tương đối lớn (điện áp cao)'], 'Thêm tụ ngậm vào block <b>chưa có</b> giúp <b>giảm dòng</b> (cỡ 0,3 A trở xuống) khi block chạy hơi cao dòng.'],
    start: ['Tụ khởi động (tụ kích, CS)', 'Mắc <b>nối tiếp</b> với rơle khởi động (tiếp điểm K). Chỉ tạo <b>mô-men khởi động ban đầu</b>, làm việc trong thời gian <b>rất ngắn</b> rồi bị ngắt.', ['Điện dung lớn: thường <b>≥ 40 µF</b> (VD > 100 µF cho block nặng)', 'Điện áp chịu đựng thấp hơn: <b>160 – 250 V AC</b>', 'Kích thước nhỏ'], 'Không dùng tụ kích thay tụ ngậm vì tụ kích điện áp thấp, không chịu được làm việc lâu. Dùng tụ ngậm thay tụ kích thì được (điện áp cao hơn, điện dung đúng).']
  };

  function meterSVG(v, label) {
    return U.gauge(v, { min: 0, max: 100, step: 20, unit: '%' }).replace('</svg>', `<text class="fl" x="150" y="130" text-anchor="middle">${label}</text></svg>`);
  }

  function doorSVG(open, nc) {
    const lampOn = open, fanOn = !open;
    return `<svg viewBox="0 0 520 240" role="img" aria-label="Cửa tủ ${open ? 'mở' : 'đóng'}: đèn ${lampOn ? 'sáng' : 'tắt'}, quạt ${fanOn ? 'quay' : 'dừng'}">
      <rect x="40" y="20" width="200" height="200" rx="12" fill="var(--cold-tint2)" stroke="var(--ink)" stroke-width="4"/>
      <g transform="${open ? 'translate(0 0) skewY(0)' : ''}"><rect x="${open ? 10 : 40}" y="20" width="${open ? 30 : 16}" height="200" rx="6" fill="var(--casing)" stroke="var(--ink)" stroke-width="3"/></g>
      <circle cx="140" cy="60" r="20" fill="${lampOn ? 'var(--warm)' : 'var(--line)'}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="140" y="100" text-anchor="middle">đèn</text>
      ${lampOn ? [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M${140 + 26 * Math.cos(a * Math.PI / 180)} ${60 + 26 * Math.sin(a * Math.PI / 180)}L${140 + 36 * Math.cos(a * Math.PI / 180)} ${60 + 36 * Math.sin(a * Math.PI / 180)}" stroke="var(--warm)" stroke-width="3"/>`).join('') : ''}
      <g transform="translate(140 160)"><circle r="26" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2.5"/><g class="${fanOn ? 'fan' : ''}"><path d="M0 0L-6-22Q0-26 6-22ZM0 0L22 6Q26 0 22-6ZM0 0L6 22Q0 26-6 22ZM0 0L-22-6Q-26 0-22 6Z" fill="${fanOn ? 'var(--cold)' : 'var(--muted)'}"/></g></g><text class="fl" x="140" y="205" text-anchor="middle">quạt gió</text>
      <rect x="250" y="${open ? 120 : 100}" width="22" height="30" rx="4" fill="var(--brass)"/><text class="sub" x="285" y="${open ? 140 : 120}">công tắc cửa</text>
      <g transform="translate(300 40)"><text class="lbl" x="0" y="0">Công tắc ĐÈN (tiếp điểm ${nc ? 'THƯỜNG ĐÓNG' : 'thường mở'})</text><text class="sub" x="0" y="22">cửa ${open ? 'MỞ' : 'ĐÓNG'} → công tắc ${open ? 'nhả' : 'bị ấn'} → đèn ${lampOn ? 'SÁNG' : 'tắt'}</text>
      <text class="lbl" x="0" y="70">Công tắc QUẠT (tiếp điểm thường mở)</text><text class="sub" x="0" y="92">cửa ${open ? 'MỞ' : 'ĐÓNG'} → quạt ${fanOn ? 'QUAY' : 'DỪNG'}</text>
      <text class="fl" x="0" y="130">Mở cửa mà quạt vẫn quay → gió lạnh thổi ra ngoài,</text><text class="fl" x="0" y="148">tủ kém lạnh và tốn điện.</text></g></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-cap" data-toc="1 · Tụ điện">
  <div class="sec-n">Phần 1</div><h2>Tụ điện trong mạch động cơ</h2>
  <p>Tụ điện nạp – xả, giúp tạo <b>từ trường lệch pha</b> giữa cuộn chạy và cuộn đề, từ đó tạo mô-men khởi động và làm việc, tăng hiệu suất. Cả hai loại tụ đều là <b>tụ hóa không phân cực</b>, dùng cho điện xoay chiều.</p>
  <div id="cTabs"></div><article class="panel" id="cPanel" aria-live="polite"></article>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Nhớ nhanh</b><p><b>Song song</b> với rơle = tụ <b>ngậm</b> (làm việc lâu, áp cao, nhỏ µF). <b>Nối tiếp</b> với rơle = tụ <b>kích</b> (chỉ lúc khởi động, áp thấp, lớn µF).</p></div></div>
  <div class="grid2"><div class="panel hotc" style="margin:0"><h4>Tụ kích hỏng</h4><p style="margin:6px 0 0">Block cần tụ kích mới chạy nổi → hỏng thì <b>không khởi động được, dòng cao</b>.</p></div>
    <div class="panel warm" style="margin:0"><h4>Tụ ngậm hỏng</h4><p style="margin:6px 0 0">Mất phần hỗ trợ khi chạy: có thể <b>khó khởi động</b> hoặc chạy nhưng <b>dòng cao</b>. Ngoài ra rơle bán dẫn (PTC) còn nóng sau khi tắt mà bật lại ngay cũng gây không khởi động.</p></div></div>
  <h3 style="margin-top:26px">🔬 Mô phỏng đo tụ bằng đồng hồ kim (thang x1k hoặc x10k)</h3>
  <p>Ta mượn pin trong đồng hồ để <b>nạp tụ</b>. Chọn tình trạng tụ, bấm “Đo” rồi “Đảo que”, quan sát kim.</p>
  <div class="grid2" style="align-items:center"><div class="stage" style="margin:0"><div id="mSvg"></div></div>
    <div><div class="opts-r" id="cState"><label><input type="radio" name="cs" value="good" checked><span><b>Tụ tốt</b></span></label><label><input type="radio" name="cs" value="short"><span><b>Tụ bị chạm (chập)</b></span></label><label><input type="radio" name="cs" value="leak"><span><b>Tụ rò / khô điện môi</b></span></label><label><input type="radio" name="cs" value="open"><span><b>Tụ bị đứt (hở)</b></span></label></div>
      <div class="row"><button class="btn pri sm" id="mGo">Đo</button><button class="btn sm" id="mRev">Đảo que đo</button></div>
      <div class="verdict" id="mV" style="margin-top:10px">Chọn tình trạng rồi bấm “Đo”.</div></div></div>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Kim đồng hồ</th><th>Kết luận</th></tr></thead><tbody>
    <tr><th>Lên <b>nhanh</b> rồi <b>về nhanh</b>, đảo que lặp lại</th><td><span class="pill ok">Tụ tốt</span> (nạp – xả)</td></tr>
    <tr><th>Lên và <b>không về</b> (về 0 Ω)</th><td><span class="pill bad">Chạm</span> (chập)</td></tr>
    <tr><th>Lên rồi về <b>chậm / không hết</b></th><td><span class="pill bad">Rò</span> hoặc khô điện môi</td></tr>
    <tr><th><b>Không lên</b></th><td><span class="pill bad">Đứt</span> hoặc mất điện dung</td></tr></tbody></table></div>
  <p style="margin-top:12px"><b>Thay thế:</b> phải đúng <b>điện dung (µF)</b> và đúng <b>điện áp chịu đựng</b> ghi trên thân.</p>
</section>

<section class="sec" id="s-sw" data-toc="2 · Công tắc">
  <div class="sec-n">Phần 2</div><h2>Công tắc cửa</h2>
  <p>Công tắc gắn ở <b>mép cánh cửa</b> (hoặc giữa ngăn đông và ngăn mát), cánh cửa tác động lên nút ấn. Có <b>2 loại công dụng</b>:</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Công tắc đèn</h4><p style="margin:6px 0 0">Tiếp điểm <b>thường đóng</b>: cửa đóng bị ấn → hở mạch → đèn tắt; mở cửa → nhả → đóng mạch → đèn sáng. Bắt buộc phải có.</p></div>
    <div class="panel warm" style="margin:0"><h4>Công tắc quạt</h4><p style="margin:6px 0 0">Chỉ ở tủ gián tiếp, tiếp điểm <b>thường mở</b>: cửa đóng (bị ấn) → quạt chạy; mở cửa → <b>ngắt quạt</b> để gió lạnh không thổi ra ngoài. Không phải tủ nào cũng có.</p></div></div>
  <div class="stage" style="margin-top:16px"><div id="dSvg"></div><div class="controls"><button class="btn pri sm" id="dBtn">🚪 Mở / đóng cửa</button></div></div>
  <h3 style="margin-top:22px">Kiểm tra</h3>
  ${U.steps([['Thang x1 Ω, chỉnh kim về 0', ''], ['Đo hai chân khi chưa ấn rồi ấn nút', 'Công tắc đèn: ban đầu <b>thông</b> (0 Ω), ấn vào thì <b>hở</b>. Công tắc quạt: ban đầu <b>hở</b>, ấn vào thì <b>thông</b>.'], ['Có sự đổi trạng thái đóng – ngắt → công tắc tốt', 'Hỏng thì tiếp điểm bị chạm hoặc không tiếp xúc.'], ['Công tắc 3 chân: chân chung C, NO (thường mở), NC (thường đóng)', 'Một que cố định ở C, que kia đo NO và NC, rồi ấn nút.']])}
  <div class="callout"><span class="ic">💡</span><div><b class="t">Hậu quả khi hỏng</b><p><b>Công tắc đèn</b> không tiếp xúc: đèn không sáng. Dính tiếp điểm: <b>đèn sáng liên tục</b> — đèn sợi đốt tỏa nhiệt vào tủ → <b>kém lạnh, tốn điện</b>. <b>Công tắc quạt</b> hỏng không ngắt: mở cửa quạt vẫn quay, tủ kém lạnh, tốn điện; hỏng hở mạch: quạt <b>không quay</b>, tủ không lạnh.</p></div></div>
  <p><b>Vệ sinh:</b> công tắc hỏng có thể đánh tiếp điểm bằng giấy nhám mịn rồi kiểm tra lại; không được thì thay. <b>Thay đúng chủng loại</b>: công tắc nhỏ quá thì cửa đóng không ấn tới; to quá thì không lắp vừa. <b>Công tắc quạt</b> có thể bỏ (nối tắt) nếu không có — chỉ <b>công tắc đèn bắt buộc</b> phải dùng.</p>
  <p><b>Công tắc nhiều chân:</b> tủ có 3–4 ngăn hoặc 2 dàn, 2 quạt, 2 đèn thường dùng công tắc kép/4 chân. Đèn chỉ cần tác động một nút (ngăn mát); quạt dùng chung một dàn thông cả hai ngăn thì <b>phải ấn cả hai nút</b> mới đổi trạng thái. Đo từng cặp chân khi ấn từng nút để biết chân nào của đèn, chân nào của quạt.</p>
</section>

<section class="sec" id="s-defrost" data-toc="3 · Xả tuyết">
  <div class="sec-n">Phần 3</div><h2>Hệ thống xả tuyết</h2>
  <p>Hơi ẩm gặp bề mặt lạnh sẽ <b>đóng tuyết, băng đá</b> trên dàn lạnh. Tuyết là chất <b>dẫn nhiệt kém</b> nên càng dày, năng suất làm lạnh càng giảm. Phải <b>xả tuyết</b> để tăng hiệu quả. Truyền nhiệt có 3 cách: dẫn nhiệt (vật rắn, tốt nhất là kim loại như đồng, nhôm), đối lưu, bức xạ.</p>
  <div class="panel" style="border-left-color:var(--cold)"><label class="row" style="gap:12px">Độ dày tuyết <input id="fr" type="range" min="0" max="100" value="10" style="width:240px"> <b id="frV"></b></label>
    <div class="bar" style="height:16px;margin-top:10px"><i id="frBar" style="width:80%;background:var(--ok)"></i></div><div class="verdict" id="frT" style="margin-top:10px"></div></div>
  <h3 style="margin-top:24px">3 cách xả tuyết</h3>
  <div id="xTabs"></div><article class="panel warm" id="xPanel" aria-live="polite"></article>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Xả tuyết thủ công</b><p>Ngắt điện, cho tuyết tan tự nhiên (có thể dùng máy sấy tóc, quạt gió, hoặc tưới nước nóng lên dàn), lau khô rồi mới cấp điện. <b>Không dùng vật nhọn cạy băng</b> — dàn lạnh nhôm dễ thủng! Chuyển thực phẩm sang chỗ lạnh để khỏi hỏng.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Tụ ngậm song song rơle: ≤ 60 µF, 400–500 V. Tụ kích nối tiếp rơle: ≥ 40 µF, 160–250 V.</b></div></li>
    <li class="done"><div><b>Đo tụ: kim lên nhanh về nhanh là tốt; không về = chạm; về chậm = rò; không lên = đứt.</b></div></li>
    <li class="done"><div><b>Công tắc đèn thường đóng; công tắc quạt thường mở.</b><span>Cửa mở: đèn sáng, quạt dừng.</span></div></li>
    <li class="done"><div><b>Kiểm tra công tắc: x1 Ω, ấn nút phải đổi trạng thái.</b></div></li>
    <li class="done"><div><b>Tuyết dẫn nhiệt kém nên phải xả tuyết.</b></div></li>
    <li class="done"><div><b>Xả tuyết: thủ công – bán tự động (nút nhấn) – tự động (rơle thời gian).</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/12/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const XTYPES = {
    hand: ['Xả tuyết thủ công', 'Dùng cho tủ <b>1 cánh</b>. Ngắt nguồn, chờ tuyết tan nhờ nhiệt môi trường, lau khô bằng khăn mềm rồi cấp điện lại. Nên kết hợp với bảo dưỡng tủ. Có thể xả nhanh bằng <b>máy sấy tóc, quạt gió, tưới nước nóng</b>.'],
    semi: ['Xả tuyết bán tự động', 'Dùng nhiệt môi trường. Trong tủ trực tiếp 1–2 cánh có <b>rơle xả đá</b> (nút nhấn): cấu tạo giống thermostat cơ — có bầu cảm biến, ống dẫn, hộp xếp, tiếp điểm, <b>lò xo</b>, nhưng thay núm xoay bằng <b>nút nhấn</b>. Muốn xả: ấn nút → <b>ngắt block</b> → tuyết tan nhờ nhiệt môi trường → khi dàn ấm lên đủ, hộp xếp nở ra, <b>tự đóng lại</b> cho block chạy. Nhiều tủ gộp <b>chung với thermostat</b>: xoay núm để chỉnh nhiệt, ấn núm để xả đá.'],
    auto: ['Xả tuyết tự động', 'Dùng cho tủ <b>gián tiếp</b>. Gồm <b>rơle thời gian</b>, sò lạnh, cầu chì nhiệt, điện trở sấy: chạy lạnh 6–8 giờ → sấy 15–30 phút → lặp lại hoàn toàn tự động. Hỏng một thiết bị sẽ gây ra: <b>chỉ đèn sáng</b> hoặc <b>kém lạnh dần rồi mất lạnh</b>, dàn bị tuyết bám kín (xem Bài 10, 11).']
  };

  function mount(root) {
    U.tabset($('#cTabs', root), [{ id: 'run', name: 'Tụ ngậm', sub: 'làm việc' }, { id: 'start', name: 'Tụ kích', sub: 'khởi động' }], id => { const c = CAPS[id]; $('#cPanel', root).innerHTML = `<h3>${c[0]}</h3><p>${c[1]}</p><ul>${c[2].map(x => `<li>${x}</li>`).join('')}</ul><p class="muted" style="margin:0">${c[3]}</p>`; });
    // đo tụ
    let tm, v = 0;
    const st = () => $('input[name=cs]:checked', root).value;
    const m = $('#mSvg', root), out = $('#mV', root);
    const draw = (lab) => m.innerHTML = meterSVG(v, lab || '');
    const run = rev => {
      clearInterval(tm); const s = st(); let t = 0, peak = s === 'open' ? 2 : 95, tail = s === 'good' ? 0 : s === 'short' ? 95 : s === 'leak' ? 38 : 0;
      tm = setInterval(() => {
        if (!document.body.contains(m)) { clearInterval(tm); return; }
        t += .05; const k = t < .4 ? t / .4 : 1; v = t < .4 ? peak * k : tail + (peak - tail) * Math.exp(-(t - .4) * (s === 'leak' ? 2.2 : 3.2)); draw(rev ? 'đảo que' : 'que thuận'); if (t > 3) clearInterval(tm);
        if (t > 3) { out.className = 'verdict ' + (s === 'good' ? 'ok' : 'bad'); out.innerHTML = { good: '✓ Kim lên nhanh rồi <b>về nhanh</b> → tụ <b>tốt</b> (nạp rồi xả).', short: '✗ Kim lên và <b>không về</b> → tụ bị <b>chạm</b>.', leak: '✗ Kim về <b>chậm và không hết</b> → tụ <b>rò</b>/ khô điện môi.', open: '✗ Kim <b>không lên</b> → tụ <b>đứt</b>.' }[s]; }
      }, 40);
    };
    $('#mGo', root).onclick = () => { v = 0; out.className = 'verdict'; out.textContent = 'Đang đo…'; run(false); };
    $('#mRev', root).onclick = () => { v = 0; out.className = 'verdict'; out.textContent = 'Đảo que, đo lại…'; run(true); };
    $$('input[name=cs]', root).forEach(r => r.onchange = () => { clearInterval(tm); v = 0; draw(); out.className = 'verdict'; out.textContent = 'Chọn tình trạng rồi bấm “Đo”.'; });
    draw();
    // cửa
    let open = false; const dd = $('#dSvg', root); const dr = () => dd.innerHTML = doorSVG(open, true); dr();
    $('#dBtn', root).onclick = () => { open = !open; dr(); };
    // tuyết
    const fr = $('#fr', root), upd = () => {
      const f = +fr.value, eff = Math.round(100 - f * .8); $('#frV', root).textContent = f + '%'; $('#frBar', root).style.width = eff + '%'; $('#frBar', root).style.background = eff > 70 ? 'var(--ok)' : eff > 45 ? 'var(--warm)' : 'var(--bad)';
      $('#frT', root).className = 'verdict ' + (eff > 70 ? 'ok' : 'bad'); $('#frT', root).innerHTML = `Năng suất trao đổi nhiệt của dàn còn khoảng <b>${eff}%</b>. ` + (eff > 70 ? 'Dàn còn sạch, làm lạnh tốt.' : eff > 45 ? 'Tuyết đã dày, tủ bắt đầu kém lạnh — cần xả tuyết.' : 'Tuyết bám kín, tủ kém lạnh nghiêm trọng, chạy liên tục tốn điện.');
    }; fr.oninput = upd; upd();
    U.tabset($('#xTabs', root), Object.entries(XTYPES).map(([id, x], i) => ({ id, n: i + 1, name: x[0] })), id => { $('#xPanel', root).innerHTML = `<h3>${XTYPES[id][0]}</h3><p style="margin:0">${XTYPES[id][1]}</p>`; });
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Tụ điện trong mạch động cơ có công dụng gì?', b: 'Tạo <b>từ trường lệch pha</b> giữa cuộn chạy và cuộn đề → mô-men khởi động và làm việc.', tag: 'Tụ' },
    { f: 'Có mấy loại tụ gắn cho block?', b: '2 loại: <b>tụ ngậm</b> (làm việc) và <b>tụ kích</b> (khởi động).', tag: 'Tụ' },
    { f: 'Tụ ngậm mắc thế nào?', b: '<b>Song song</b> với rơle khởi động.', tag: 'Tụ' },
    { f: 'Tụ kích mắc thế nào?', b: '<b>Nối tiếp</b> với rơle khởi động (K).', tag: 'Tụ' },
    { f: 'Thông số tụ ngậm?', b: 'Điện dung <b>≤ 60 µF</b>, chịu <b>400 – 500 V AC</b>.', tag: 'Tụ' },
    { f: 'Thông số tụ kích?', b: 'Điện dung <b>≥ 40 µF</b>, chịu <b>160 – 250 V AC</b>.', tag: 'Tụ' },
    { f: 'Tụ ngậm hoạt động bao lâu?', b: '<b>Liên tục</b> khi block chạy.', tag: 'Tụ' },
    { f: 'Tụ kích hoạt động bao lâu?', b: 'Rất <b>ngắn</b> (lúc khởi động), rồi bị ngắt cùng K.', tag: 'Tụ' },
    { f: 'Tụ kích hỏng → ?', b: 'Block <b>không khởi động được</b>, dòng cao.', tag: 'Hư hỏng tụ' },
    { f: 'Block hơi cao dòng, thêm tụ ngậm có tác dụng gì?', b: 'Giảm dòng (cỡ 0,3 A trở xuống) nếu block <b>chưa lắp</b> tụ ngậm.', tag: 'Hư hỏng tụ' },
    { f: 'Có thay tụ kích bằng tụ ngậm được không?', b: 'Được (điện áp cao hơn), nhưng <b>không dùng tụ kích thay tụ ngậm</b>.', tag: 'Hư hỏng tụ' },
    { f: 'Kim đồng hồ lên nhanh, về nhanh khi đo tụ?', b: 'Tụ <b>tốt</b>.', tag: 'Kiểm tra tụ' },
    { f: 'Kim lên và không về?', b: 'Tụ bị <b>chạm</b> (chập).', tag: 'Kiểm tra tụ' },
    { f: 'Kim lên rồi về chậm / không hết?', b: 'Tụ <b>rò</b> hoặc khô điện môi.', tag: 'Kiểm tra tụ' },
    { f: 'Kim không lên?', b: 'Tụ <b>đứt</b>.', tag: 'Kiểm tra tụ' },
    { f: 'Khi đo tụ phải làm gì với que đo?', b: '<b>Đảo chiều</b> que đo để kiểm tra nạp – xả hai chiều.', tag: 'Kiểm tra tụ' },
    { f: 'Công tắc cửa gắn ở đâu?', b: 'Ở <b>mép cánh cửa</b> hoặc giữa ngăn đông và ngăn mát.', tag: 'Công tắc' },
    { f: 'Công tắc đèn: tiếp điểm thế nào?', b: '<b>Thường đóng</b>; cửa đóng bị ấn → hở → đèn tắt.', tag: 'Công tắc' },
    { f: 'Công tắc quạt: tiếp điểm thế nào?', b: '<b>Thường mở</b>; cửa đóng bị ấn → thông → quạt chạy.', tag: 'Công tắc' },
    { f: 'Công tắc quạt dùng cho tủ nào, vì sao?', b: 'Tủ <b>gián tiếp</b>: mở cửa thì ngắt quạt để gió lạnh không thổi ra ngoài.', tag: 'Công tắc' },
    { f: 'Công tắc ba chân gồm?', b: '<b>C</b> (chung), <b>NO</b> (thường mở), <b>NC</b> (thường đóng).', tag: 'Công tắc' },
    { f: 'Đèn luôn sáng gây gì?', b: 'Đèn sợi đốt tỏa nhiệt → tủ <b>kém lạnh, tốn điện</b>.', tag: 'Công tắc' },
    { f: 'Công tắc nào bắt buộc phải có?', b: 'Công tắc <b>đèn</b>; công tắc quạt có thể bỏ.', tag: 'Công tắc' },
    { f: 'Vì sao phải xả tuyết?', b: 'Tuyết <b>dẫn nhiệt kém</b>, bám dày làm giảm năng suất lạnh.', tag: 'Xả tuyết' },
    { f: 'Vật liệu dẫn nhiệt tốt?', b: 'Kim loại: <b>đồng, nhôm, sắt</b>.', tag: 'Xả tuyết' },
    { f: 'Có mấy cách xả tuyết?', b: '3: <b>thủ công, bán tự động, tự động</b>.', tag: 'Xả tuyết' },
    { f: 'Xả tuyết bán tự động dùng gì?', b: '<b>Rơle xả đá</b> (nút nhấn), nhiệt môi trường; xả xong tự đóng cho block chạy.', tag: 'Xả tuyết' },
    { f: 'Xả tuyết tự động dùng cho tủ nào, thiết bị nào?', b: 'Tủ gián tiếp: rơle thời gian, sò lạnh, cầu chì nhiệt, điện trở sấy.', tag: 'Xả tuyết' },
    { f: 'Khi xả tuyết thủ công cần tránh điều gì?', b: 'Không dùng vật nhọn cạy băng (dễ thủng dàn); lau khô trước khi cấp điện.', tag: 'Xả tuyết' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Tụ ngậm mắc thế nào với rơle khởi động?', ['Song song', 'Nối tiếp', 'Không nối', 'Với vỏ'], 0, 'Tụ ngậm = tụ làm việc.'),
    Q('Tụ kích mắc thế nào?', ['Nối tiếp với K', 'Song song', 'Với quạt', 'Với đèn'], 0, 'Chỉ làm việc lúc khởi động.'),
    Q('Tụ làm việc có đặc điểm?', ['Điện áp cao, điện dung nhỏ', 'Điện áp thấp, điện dung lớn', 'Không có điện áp', 'Phân cực'], 0, '400–500 V, ≤ 60 µF.'),
    Q('Tụ khởi động có đặc điểm?', ['Điện dung lớn, điện áp thấp', 'Điện dung nhỏ, điện áp cao', 'Không dùng', 'Phân cực'], 0, '≥ 40 µF, 160–250 V.'),
    Q('Tụ kích hỏng → ?', ['Block không khởi động', 'Tủ lạnh sâu', 'Block êm', 'Không đổi'], 0, 'Block cần tụ kích mới chạy được.'),
    Q('Đo tụ tốt, kim?', ['Lên nhanh, về nhanh', 'Lên không về', 'Không lên', 'Đứng yên'], 0, 'Nạp xả.'),
    Q('Tụ chạm, kim?', ['Lên và không về', 'Không lên', 'Lên nhanh về nhanh', 'Về chậm'], 0, 'Chập.'),
    Q('Tụ đứt, kim?', ['Không lên', 'Lên và đứng', 'Về chậm', 'Lên nhanh'], 0, 'Hở.'),
    Q('Khi đo tụ cần?', ['Đảo chiều que đo', 'Chỉ đo một chiều', 'Chập hai chân', 'Đo điện áp'], 0, 'Kiểm tra nạp – xả.'),
    Q('Thay tụ phải đúng?', ['Điện dung và điện áp', 'Màu', 'Hãng', 'Chiều cao'], 0, 'Ghi trên thân.'),
    Q('Công tắc đèn có tiếp điểm?', ['Thường đóng', 'Thường mở', 'Luôn hở', 'Luôn dính'], 0, 'Cửa đóng bị ấn → hở.'),
    Q('Công tắc quạt có tiếp điểm?', ['Thường mở', 'Thường đóng', 'Luôn hở', 'Không có'], 0, 'Cửa đóng bị ấn → thông.'),
    Q('Mở cửa tủ gián tiếp thì quạt?', ['Dừng', 'Quay nhanh hơn', 'Quay ngược', 'Không đổi'], 0, 'Tránh gió lạnh ra ngoài.'),
    Q('Công tắc nào bắt buộc có?', ['Công tắc đèn', 'Công tắc quạt', 'Cả hai', 'Không cái nào'], 0, 'Quạt có thể bỏ.'),
    Q('Công tắc 3 chân gồm?', ['C, NO, NC', 'A, B, C', 'L, N, E', 'H, L, C'], 0, 'Chung, thường mở, thường đóng.'),
    Q('Đèn luôn sáng sẽ?', ['Làm tủ kém lạnh, tốn điện', 'Làm tủ lạnh sâu', 'Tắt quạt', 'Không ảnh hưởng'], 0, 'Đèn sợi đốt tỏa nhiệt.'),
    Q('Công tắc quạt hỏng không ngắt → ?', ['Mở cửa quạt vẫn quay, kém lạnh', 'Đèn tắt', 'Block hỏng', 'Không đổi'], 0, 'Gió lạnh thổi ra.'),
    Q('Công tắc nhỏ quá thì?', ['Cửa đóng không ấn tới', 'Tốt hơn', 'Tiết kiệm điện', 'Không ảnh hưởng'], 0, 'Phải thay đúng chủng loại.'),
    Q('Tuyết bám dày làm?', ['Giảm năng suất trao đổi nhiệt', 'Tăng lạnh', 'Giảm điện', 'Tăng áp thấp'], 0, 'Tuyết dẫn nhiệt kém.'),
    Q('Xả tuyết thủ công dùng cho?', ['Tủ 1 cánh', 'Tủ gián tiếp', 'Điều hòa', 'Máy giặt'], 0, 'Ngắt điện chờ tan.'),
    Q('Rơle xả đá thay núm xoay bằng?', ['Nút nhấn', 'Tụ', 'Quạt', 'Đèn'], 0, 'Cấu tạo giống thermostat cơ.'),
    Q('Xả tuyết tự động dùng?', ['Rơle thời gian', 'Nút nhấn', 'Máy sấy tóc', 'Tụ'], 0, 'Tủ gián tiếp.'),
    Q('Không nên làm gì khi xả tuyết?', ['Cạy băng bằng vật nhọn', 'Ngắt điện', 'Lau khô', 'Chờ tan'], 0, 'Dễ làm thủng dàn nhôm.'),
    Q('Vật liệu dẫn nhiệt tốt nhất trong số này?', ['Nhôm', 'Nhựa', 'Gỗ', 'Xốp'], 0, 'Kim loại dẫn nhiệt tốt.')
  ];
  const sort = {
    title: 'Chi tiết thuộc thiết bị nào?',
    buckets: [{ id: 'run', name: 'Tụ ngậm' }, { id: 'start', name: 'Tụ kích' }, { id: 'sw', name: 'Công tắc cửa' }],
    items: [
      { t: 'Mắc song song với rơle khởi động', b: 'run' }, { t: '≤ 60 µF, 400–500 V', b: 'run' }, { t: 'Làm việc liên tục lâu dài', b: 'run' }, { t: 'Giảm dòng cho block chạy hơi cao', b: 'run' },
      { t: 'Mắc nối tiếp với rơle khởi động', b: 'start' }, { t: '≥ 40 µF, 160–250 V', b: 'start' }, { t: 'Chỉ làm việc lúc khởi động', b: 'start' }, { t: 'Hỏng thì block không khởi động', b: 'start' },
      { t: 'Thường đóng: cửa mở thì đèn sáng', b: 'sw' }, { t: 'Thường mở: cửa mở thì ngắt quạt', b: 'sw' }, { t: 'Đo x1 Ω và ấn nút xem đổi trạng thái', b: 'sw' }, { t: 'Có loại 3 chân C, NO, NC', b: 'sw' }
    ]
  };
  const order = [
    { title: 'Đo tụ bằng đồng hồ kim', intro: 'Sắp xếp các bước đo tụ.', steps: ['Xả hết điện của tụ (chập hai chân)', 'Chọn thang x1k hoặc x10k, chỉnh kim về 0', 'Chạm que vào hai chân tụ, quan sát kim', 'Đảo chiều que đo, quan sát lại', 'Kim lên nhanh về nhanh', 'Kết luận tụ tốt'] },
    { title: 'Kiểm tra công tắc đèn', intro: 'Sắp xếp quy trình.', steps: ['Tháo công tắc hoặc rút dây ra', 'Chọn thang x1 Ω, chỉnh kim về 0', 'Đo hai chân khi chưa ấn', 'Ấn núm công tắc, đo lại', 'Thấy trạng thái đổi (thông → hở)', 'Kết luận công tắc tốt'] },
    { title: 'Xả tuyết thủ công', intro: 'Sắp xếp các bước.', steps: ['Chuyển thực phẩm sang chỗ lạnh', 'Ngắt nguồn điện cho tủ', 'Để tuyết tan (có thể dùng máy sấy tóc)', 'Hứng và lau sạch nước', 'Lau khô dàn bằng khăn mềm', 'Cấp điện, xếp lại thực phẩm'] }
  ];
  DL.register({
    id: 12, ready: true, title: 'Tụ điện, công tắc, hệ thống xả tuyết', sub: 'Tụ ngậm – tụ kích, công tắc đèn – quạt, 3 cách xả tuyết', minutes: 25,
    lead: 'Ba nhóm thiết bị nhỏ nhưng hay gặp: tụ hỗ trợ block, công tắc cửa bật đèn – ngắt quạt và các cách xả tuyết. Bài có mô phỏng đo tụ bằng đồng hồ kim và cửa tủ.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
