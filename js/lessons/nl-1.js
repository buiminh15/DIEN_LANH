/* NGUYÊN LÝ LÀM LẠNH — BÀI 1: NGUYÊN LÝ LÀM LẠNH (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_1.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const HEAT = {
    cond: ['Dẫn nhiệt', 'Truyền nhiệt khi các vật <b>tiếp xúc trực tiếp</b>, chủ yếu ở thể <b>rắn</b>.', 'Cán thìa kim loại nóng lên khi xào nấu. Kim loại (vàng, bạc, nhôm, đồng, sắt) dẫn nhiệt tốt; tre, nhựa dẫn kém nên dùng làm tay cầm cách nhiệt.'],
    conv: ['Đối lưu nhiệt', 'Truyền nhiệt nhờ các khối <b>chất lỏng hoặc chất khí dịch chuyển</b> giữa vùng nhiệt độ này sang vùng khác.', 'Nước sôi trong nồi tuần hoàn từ dưới lên trên. Ngồi trước quạt thấy mát vì quạt đưa không khí nóng quanh người đi và đưa không khí mát tới. Dàn ngưng tụ có quạt là <b>đối lưu cưỡng bức</b>.'],
    rad: ['Bức xạ nhiệt', 'Truyền nhiệt bằng <b>tia bức xạ</b> mang năng lượng, vật hấp thụ tia rồi biến thành nhiệt.', 'Ngồi cạnh đám cháy thấy nóng dù không chạm vào. Ứng dụng: đèn sưởi, quạt sưởi.']
  };
  const DEV = {
    comp: ['Máy nén', 'Hút hơi môi chất <b>áp suất thấp, nhiệt độ thấp</b> từ thiết bị bay hơi, nén lên <b>áp suất cao, nhiệt độ cao</b> rồi đẩy vào thiết bị ngưng tụ. Đồng thời tuần hoàn môi chất và duy trì áp suất sôi ổn định.', 'hot'],
    cond: ['Thiết bị ngưng tụ', 'Hơi áp suất cao <b>tỏa nhiệt</b> ra môi trường làm mát và ngưng tụ từ hơi thành lỏng. Nhiệt tỏa ra (Q<sub>k</sub>) có thể tận dụng để sưởi ấm.', 'hot'],
    exp: ['Thiết bị tiết lưu', 'Tiết diện nhỏ, trở lực lớn nên <b>tạo chênh lệch áp suất</b>: trước tiết lưu là áp suất cao (p<sub>k</sub>), sau tiết lưu là áp suất thấp (p<sub>0</sub>). Điều chỉnh lưu lượng môi chất vào dàn bay hơi.', 'cold'],
    evap: ['Thiết bị bay hơi', 'Lỏng ở áp suất thấp <b>sôi ở nhiệt độ thấp</b>, thu nhiệt (Q<sub>0</sub>) của sản phẩm hoặc môi trường cần làm lạnh → sản phẩm mất nhiệt nên lạnh đi. Hơi tạo ra lại được máy nén hút về.', 'cold']
  };

  function learn() {
    return `
<section class="sec" id="s-heat" data-toc="1 · Truyền nhiệt">
  <div class="sec-n">Phần 1</div><h2>Truyền nhiệt: 3 phương pháp</h2>
  <p><b>Truyền nhiệt</b> là quá trình trao đổi nhiệt giữa các vật có nhiệt độ khác nhau. Nhiệt <b>chỉ truyền từ nơi nhiệt độ cao sang nơi nhiệt độ thấp</b>; khi hai vật đạt <b>cân bằng nhiệt</b> thì không còn truyền nhiệt nữa.</p>
  <div id="hTabs"></div><article class="panel" id="hPanel" aria-live="polite"></article>
  <div class="stage" style="padding:14px"><b>Thử: thả đá vào cốc trà nóng</b>
    <div class="row" style="margin-top:8px"><button class="btn pri sm" id="iceGo">🧊 Thả đá</button><button class="btn sm" id="iceRst">Làm lại</button></div>
    <div style="margin-top:10px"><span class="muted">Trà</span><div class="bar" style="height:16px"><i id="bTea" style="width:80%;background:var(--hot)"></i></div><span id="tTea" class="muted"></span></div>
    <div style="margin-top:6px"><span class="muted">Đá</span><div class="bar" style="height:16px"><i id="bIce" style="width:0;background:var(--cold)"></i></div><span id="tIce" class="muted"></span></div>
    <div class="verdict" id="iceV" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-def" data-toc="2 · Làm lạnh">
  <div class="sec-n">Phần 2</div><h2>Khái niệm và các phương pháp làm lạnh</h2>
  <p><b>Làm lạnh</b> là quá trình làm giảm và duy trì nhiệt độ của một vật thể trong giới hạn <b>thấp hơn nhiệt độ môi trường xung quanh</b>. Vật cần làm lạnh phải <b>mất nhiệt</b> cho một môi trường trung gian có nhiệt độ thấp hơn.</p>
  <div class="grid2">
    <div class="panel"><h3>Làm lạnh tự nhiên</h3><p style="margin:0">Dùng băng đá mùa đông cất trong hang sâu; ngâm chai nước trong giếng khơi. Không tốn năng lượng nhưng hạn chế về mức lạnh.</p></div>
    <div class="panel warm"><h3>Làm lạnh nhân tạo</h3><p style="margin:0">Tốn một dạng năng lượng khác (điện): tủ lạnh, điều hòa, máy làm kem, máy làm đá…</p></div>
  </div>
  <p style="margin-top:14px">Có nhiều phương pháp nhân tạo: bay hơi chất lỏng, hòa trộn lạnh, giãn nở có sinh ngoại công, tiết lưu, giãn nở trong ống xoáy, hiệu ứng nhiệt điện, khử từ đoạn nhiệt, hóa lỏng/ thăng hoa vật rắn…</p>
  <div class="callout mem"><span class="ic">💡</span><div><b class="t">Phương pháp phổ biến nhất</b><p><b>Bay hơi chất lỏng</b> (làm lạnh bằng máy nén hơi) đạt hiệu quả cao và mức nhiệt độ thấp nhất. Hiệu ứng nhiệt điện chỉ dùng ở thiết bị nhỏ như tủ lạnh mini khách sạn, bình nước nóng lạnh vì năng suất thấp.</p></div></div>
</section>

<section class="sec" id="s-boil" data-toc="3 · Sôi và ngưng tụ">
  <div class="sec-n">Phần 3</div><h2>Vì sao bay hơi chất lỏng lại làm lạnh?</h2>
  <div class="grid2">
    <div class="panel hotc"><h3>Ngưng tụ (hơi → lỏng)</h3><p style="margin:0">Cần <b>hai điều kiện</b>: ① nén lên <b>áp suất cao</b>; ② <b>tỏa nhiệt</b> ra môi trường. Ví dụ: hơi nước đọng trên vung nồi, sương đọng ngoài cốc trà đá.</p></div>
    <div class="panel"><h3>Sôi / bay hơi (lỏng → hơi)</h3><p style="margin:0">Phải <b>thu nhiệt</b> của môi trường. Cồn, xăng dính tay thấy mát lạnh vì sôi ở nhiệt độ thấp và hút nhiệt ngay tại da.</p></div>
  </div>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">An toàn</b><p>Không để gas lỏng hay CO₂ lỏng (bình chữa cháy) dính vào da hoặc cầm vào loa phun: lỏng sôi rất nhanh, hút nhiệt của tay gây <b>bỏng lạnh</b>.</p></div></div>
</section>

<section class="sec" id="s-cycle" data-toc="4 · Sơ đồ khối">
  <div class="sec-n">Phần 4</div><h2>Sơ đồ khối hệ thống lạnh máy nén hơi</h2>
  <p>Để không hao hụt môi chất, hệ thống là <b>vòng tuần hoàn kín</b> với 4 thiết bị chính. Chọn từng thiết bị để xem vai trò:</p>
  <div class="stage"><svg viewBox="0 0 600 290" role="img" aria-label="Sơ đồ khối: máy nén, ngưng tụ, tiết lưu, bay hơi">
    <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker></defs>
    <g fill="none" stroke="var(--ink)" stroke-width="3" marker-end="url(#ar)">
      <path d="M190 230H370"/><path d="M515 190V100"/><path d="M370 55H190"/><path d="M85 100V190"/></g>
    <g id="nodes">
      <rect id="n-comp" x="370" y="195" width="145" height="60" rx="10"/><text class="lbl" x="442" y="230" text-anchor="middle">① Máy nén</text>
      <rect id="n-cond" x="370" y="25" width="145" height="60" rx="10"/><text class="lbl" x="442" y="60" text-anchor="middle">② Ngưng tụ</text>
      <rect id="n-exp" x="45" y="25" width="145" height="60" rx="10"/><text class="lbl" x="117" y="60" text-anchor="middle">③ Tiết lưu</text>
      <rect id="n-evap" x="45" y="195" width="145" height="60" rx="10"/><text class="lbl" x="117" y="230" text-anchor="middle">④ Bay hơi</text></g>
    <text class="sub" x="535" y="150">hơi p cao, t cao</text><text class="sub" x="280" y="46" text-anchor="middle">lỏng p cao</text>
    <text class="sub" x="10" y="150">lỏng p thấp</text><text class="sub" x="280" y="248" text-anchor="middle">hơi p thấp, t thấp</text>
    <text class="fl" x="300" y="145" text-anchor="middle">Q<tspan font-size="10" dy="3">k</tspan><tspan dy="-3"> tỏa ra ↑ · Q</tspan><tspan font-size="10" dy="3">0</tspan><tspan dy="-3"> thu vào ↓</tspan></text></svg></div>
  <div id="dTabs"></div><article class="panel" id="dPanel" aria-live="polite"></article>
  <p style="margin-top:14px">Trên đồ thị: <b>4→1</b> hút và nén, <b>1→2</b> tỏa nhiệt ngưng tụ, <b>2→3</b> tiết lưu, <b>3→4</b> thu nhiệt bay hơi (đánh số theo bài giảng). p<sub>k</sub>, t<sub>k</sub> là áp suất, nhiệt độ ở dàn ngưng tụ; p<sub>0</sub>, t<sub>0</sub> ở dàn bay hơi.</p>
  <div class="callout"><span class="ic">🔧</span><div><b class="t">Ba điều kiện để hệ thống có lạnh</b><p>① Có đủ 4 thiết bị chính (và thiết bị phụ) nối bằng ống kín. ② Được <b>nạp đủ gas</b>. ③ <b>Máy nén hoạt động</b>.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Ba cách truyền nhiệt: dẫn nhiệt, đối lưu, bức xạ.</b></div></li>
    <li class="done"><div><b>Nhiệt chỉ truyền từ cao sang thấp, đến khi cân bằng.</b></div></li>
    <li class="done"><div><b>Làm lạnh = làm vật mất nhiệt; phổ biến nhất là bay hơi chất lỏng.</b></div></li>
    <li class="done"><div><b>Ngưng tụ: nén áp cao + tỏa nhiệt. Sôi: thu nhiệt.</b></div></li>
    <li class="done"><div><b>4 thiết bị: máy nén → ngưng tụ → tiết lưu → bay hơi.</b></div></li>
    <li class="done"><div><b>Tiết lưu tạo chênh áp để gas sôi ở nhiệt độ thấp tại dàn bay hơi.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/1/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#hTabs', root), Object.entries(HEAT).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => {
      $('#hPanel', root).innerHTML = `<h3>${HEAT[id][0]}</h3><p>${HEAT[id][1]}</p><p style="margin:0"><b>Ví dụ:</b> ${HEAT[id][2]}</p>`;
    });
    let tea = 60, ice = 0, tm;
    const draw = () => {
      $('#bTea', root).style.width = tea + '%'; $('#bIce', root).style.width = Math.max(0, ice) + '%';
      $('#tTea', root).textContent = tea.toFixed(0) + ' °C'; $('#tIce', root).textContent = ice.toFixed(0) + ' °C';
      const eq = Math.abs(tea - ice) < 1, v = $('#iceV', root);
      v.className = 'verdict ' + (eq ? 'ok' : '');
      v.textContent = eq ? 'Cân bằng nhiệt: hai vật cùng nhiệt độ, không còn truyền nhiệt. Trà đã nguội đi (mất nhiệt) còn đá nóng lên.' : tea === 60 && ice === 0 ? 'Trà nóng hơn đá nên nhiệt truyền từ trà sang đá.' : 'Trà mất nhiệt (lạnh dần), đá nhận nhiệt (ấm dần)…';
    };
    $('#iceGo', root).onclick = () => { clearInterval(tm); tm = setInterval(() => { if (!document.body.contains($('#iceV', root))) { clearInterval(tm); return; } const d = (tea - ice) * .12; tea -= d; ice += d; if (tea - ice < 1) { tea = ice = (tea + ice) / 2; clearInterval(tm); } draw(); }, 120); };
    $('#iceRst', root).onclick = () => { clearInterval(tm); tea = 60; ice = 0; draw(); };
    draw();
    const paint = id => ['comp', 'cond', 'exp', 'evap'].forEach(k => { const r = $('#n-' + k, root); const on = k === id, hot = DEV[k][2] === 'hot'; r.setAttribute('fill', on ? (hot ? 'var(--hot)' : 'var(--cold)') : 'var(--surface2)'); r.setAttribute('stroke', 'var(--ink)'); r.setAttribute('stroke-width', on ? 4 : 2.5); });
    U.tabset($('#dTabs', root), Object.entries(DEV).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { paint(id); $('#dPanel', root).innerHTML = `<h3>${DEV[id][0]}</h3><p style="margin:0">${DEV[id][1]}</p>`; });
  }

  const flashcards = [
    { f: 'Nhiệt truyền theo chiều nào?', b: 'Chỉ từ nơi nhiệt độ cao sang nơi nhiệt độ thấp.', tag: 'Truyền nhiệt' },
    { f: 'Khi nào ngừng truyền nhiệt?', b: 'Khi hai vật cân bằng nhiệt (cùng nhiệt độ).', tag: 'Truyền nhiệt' },
    { f: 'Ba phương pháp truyền nhiệt?', b: 'Dẫn nhiệt, đối lưu nhiệt, bức xạ nhiệt.', tag: 'Truyền nhiệt' },
    { f: 'Dẫn nhiệt là gì?', b: 'Truyền nhiệt khi các vật tiếp xúc trực tiếp, chủ yếu ở thể rắn.', tag: 'Truyền nhiệt' },
    { f: 'Đối lưu nhiệt là gì?', b: 'Truyền nhiệt nhờ dịch chuyển khối chất lỏng hoặc khí giữa các vùng nhiệt độ khác nhau.', tag: 'Truyền nhiệt' },
    { f: 'Bức xạ nhiệt là gì?', b: 'Truyền nhiệt bằng tia bức xạ mang năng lượng; vật hấp thụ tia rồi thành nhiệt.', tag: 'Truyền nhiệt' },
    { f: 'Vì sao ngồi trước quạt thấy mát?', b: 'Quạt đối lưu, đưa khí nóng quanh người đi, đưa khí mát tới, tăng chênh lệch nhiệt độ.', tag: 'Truyền nhiệt' },
    { f: 'Định nghĩa làm lạnh?', b: 'Làm giảm và duy trì nhiệt độ của vật trong giới hạn thấp hơn nhiệt độ môi trường.', tag: 'Làm lạnh' },
    { f: 'Làm lạnh tự nhiên ví dụ?', b: 'Cất băng đá trong hang sâu; ngâm chai nước trong giếng khơi.', tag: 'Làm lạnh' },
    { f: 'Làm lạnh nhân tạo ví dụ?', b: 'Tủ lạnh, điều hòa, máy làm kem, máy làm đá (tốn năng lượng điện).', tag: 'Làm lạnh' },
    { f: 'Phương pháp làm lạnh nhân tạo hiệu quả nhất?', b: 'Bay hơi chất lỏng (máy nén hơi).', tag: 'Làm lạnh' },
    { f: 'Hiệu ứng nhiệt điện dùng ở đâu?', b: 'Thiết bị nhỏ: tủ lạnh mini khách sạn, bình nước nóng lạnh; năng suất thấp.', tag: 'Làm lạnh' },
    { f: 'Hai điều kiện để ngưng tụ?', b: 'Nén lên áp suất cao và tỏa nhiệt ra môi trường.', tag: 'Ngưng tụ / sôi' },
    { f: 'Điều kiện để sôi?', b: 'Phải thu nhiệt của môi trường xung quanh.', tag: 'Ngưng tụ / sôi' },
    { f: 'Vì sao cồn, xăng dính tay thấy mát?', b: 'Sôi ở nhiệt độ thấp, hút nhiệt ngay tại da.', tag: 'Ngưng tụ / sôi' },
    { f: 'Vì sao không để gas lỏng dính tay?', b: 'Sôi hút nhiệt rất nhanh gây bỏng lạnh.', tag: 'An toàn' },
    { f: '4 thiết bị chính của hệ thống lạnh?', b: 'Máy nén, thiết bị ngưng tụ, thiết bị tiết lưu, thiết bị bay hơi.', tag: 'Sơ đồ khối' },
    { f: 'Máy nén làm nhiệm vụ gì?', b: 'Hút hơi p thấp, t thấp; nén thành p cao, t cao đẩy sang ngưng tụ.', tag: 'Sơ đồ khối' },
    { f: 'Thiết bị ngưng tụ làm gì?', b: 'Cho hơi tỏa nhiệt ra môi trường, ngưng thành lỏng.', tag: 'Sơ đồ khối' },
    { f: 'Thiết bị tiết lưu làm gì?', b: 'Tạo chênh lệch áp suất (hạ áp) và điều chỉnh lưu lượng môi chất.', tag: 'Sơ đồ khối' },
    { f: 'Thiết bị bay hơi làm gì?', b: 'Lỏng sôi ở t thấp, thu nhiệt của sản phẩm/môi trường làm nó lạnh.', tag: 'Sơ đồ khối' },
    { f: 'p<sub>k</sub> và p<sub>0</sub> là gì?', b: 'p<sub>k</sub>: áp suất cao ở ngưng tụ; p<sub>0</sub>: áp suất thấp ở bay hơi.', tag: 'Sơ đồ khối' },
    { f: 'Q<sub>k</sub> và Q<sub>0</sub> là gì?', b: 'Q<sub>k</sub>: nhiệt tỏa ra ở ngưng tụ; Q<sub>0</sub>: nhiệt thu vào ở bay hơi.', tag: 'Sơ đồ khối' },
    { f: 'Ba điều kiện để hệ thống có lạnh?', b: 'Đủ thiết bị nối kín; nạp đủ gas; máy nén hoạt động.', tag: 'Sơ đồ khối' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Nhiệt truyền theo chiều nào?', ['Từ cao sang thấp', 'Từ thấp sang cao', 'Cả hai chiều như nhau', 'Không có chiều'], 0, 'Nhiệt chỉ truyền từ nơi nhiệt độ cao sang nơi thấp.'),
    Q('Khi hai vật cân bằng nhiệt thì?', ['Không còn truyền nhiệt', 'Truyền nhiệt mạnh hơn', 'Vật nóng nóng thêm', 'Vật lạnh lạnh thêm'], 0, 'Cùng nhiệt độ thì ngừng truyền.'),
    Q('Cán thìa kim loại nóng lên là do?', ['Dẫn nhiệt', 'Đối lưu', 'Bức xạ', 'Ngưng tụ'], 0, 'Tiếp xúc trực tiếp ở thể rắn.'),
    Q('Nước sôi tuần hoàn trong nồi là?', ['Đối lưu', 'Dẫn nhiệt', 'Bức xạ', 'Khử từ'], 0, 'Khối lỏng dịch chuyển.'),
    Q('Ngồi gần đám cháy thấy nóng chủ yếu do?', ['Bức xạ nhiệt', 'Dẫn nhiệt', 'Ngưng tụ', 'Tiết lưu'], 0, 'Tia bức xạ truyền nhiệt qua không khí.'),
    Q('Vật liệu làm tay cầm để tránh nóng nên là?', ['Cách nhiệt (tre, nhựa)', 'Đồng', 'Nhôm', 'Bạc'], 0, 'Kim loại dẫn nhiệt tốt nên không dùng làm tay cầm.'),
    Q('Muốn vật được làm lạnh thì vật đó phải?', ['Mất nhiệt cho môi trường lạnh hơn', 'Nhận nhiệt', 'Được nén', 'Được đun'], 0, 'Làm lạnh là làm vật mất nhiệt.'),
    Q('Cất băng đá trong hang sâu là kiểu làm lạnh?', ['Tự nhiên', 'Nhân tạo bằng máy nén', 'Nhiệt điện', 'Hòa trộn'], 0, 'Không tốn năng lượng nhân tạo.'),
    Q('Phương pháp nhân tạo đạt nhiệt độ thấp nhất, hiệu quả cao?', ['Bay hơi chất lỏng', 'Nhiệt điện', 'Phơi nắng', 'Quạt gió'], 0, 'Dùng máy nén hơi.'),
    Q('Hiệu ứng nhiệt điện thích hợp cho?', ['Thiết bị nhỏ, năng suất thấp', 'Kho lạnh lớn', 'Chiller trung tâm', 'Máy nén công nghiệp'], 0, 'Tủ mini, bình nước nóng lạnh.'),
    Q('Điều kiện ngưng tụ gồm?', ['Áp suất cao và tỏa nhiệt', 'Áp suất thấp và thu nhiệt', 'Áp suất thấp và tỏa nhiệt', 'Chỉ cần thu nhiệt'], 0, 'Nén cao và tỏa nhiệt.'),
    Q('Quá trình sôi cần?', ['Thu nhiệt', 'Tỏa nhiệt', 'Nén áp cao', 'Không cần gì'], 0, 'Sôi phải hấp thụ nhiệt.'),
    Q('Gas lỏng dính tay gây?', ['Bỏng lạnh', 'Bỏng nóng', 'Điện giật', 'Không sao'], 0, 'Sôi nhanh, hút nhiệt của da.'),
    Q('Thứ tự dòng môi chất đúng?', ['Máy nén → ngưng tụ → tiết lưu → bay hơi', 'Máy nén → bay hơi → tiết lưu → ngưng tụ', 'Ngưng tụ → máy nén → tiết lưu → bay hơi', 'Tiết lưu → ngưng tụ → máy nén → bay hơi'], 0, 'Vòng tuần hoàn kín.'),
    Q('Máy nén đẩy vào ngưng tụ hơi ở trạng thái?', ['Áp suất cao, nhiệt độ cao', 'Áp suất thấp, nhiệt độ thấp', 'Áp suất cao, nhiệt độ thấp', 'Thể lỏng'], 0, 'Nén làm tăng p và t.'),
    Q('Thiết bị tiết lưu có tiết diện nhỏ để?', ['Tạo chênh lệch áp suất', 'Tăng nhiệt độ', 'Nén hơi', 'Lọc cặn'], 0, 'Trở lực lớn tạo chênh áp.'),
    Q('Lạnh được tạo ra ở thiết bị nào?', ['Bay hơi', 'Ngưng tụ', 'Máy nén', 'Ống nối'], 0, 'Lỏng sôi thu nhiệt môi trường.'),
    Q('Nhiệt Q<sub>k</sub> tỏa ra ở?', ['Thiết bị ngưng tụ', 'Thiết bị bay hơi', 'Tiết lưu', 'Ống hút'], 0, 'Tỏa nhiệt ở dàn nóng.'),
    Q('p<sub>0</sub> là áp suất ở?', ['Thiết bị bay hơi', 'Thiết bị ngưng tụ', 'Đầu đẩy máy nén', 'Trước tiết lưu'], 0, 'p thấp ở dàn lạnh.'),
    Q('Điều nào KHÔNG phải điều kiện để hệ thống có lạnh?', ['Nạp thật nhiều dầu', 'Nạp đủ gas', 'Máy nén hoạt động', 'Có đủ thiết bị nối kín'], 0, 'Ba điều kiện là thiết bị, gas, máy nén.'),
    Q('Quạt gió ở dàn ngưng tụ tạo ra truyền nhiệt kiểu?', ['Đối lưu cưỡng bức', 'Dẫn nhiệt', 'Bức xạ', 'Đối lưu tự nhiên'], 0, 'Có quạt là cưỡng bức.'),
    Q('Tận dụng nhiệt tỏa ở ngưng tụ có thể để?', ['Sưởi ấm', 'Làm đá', 'Hút chân không', 'Hạ áp suất'], 0, 'Nhiệt tỏa làm tăng nhiệt độ môi trường.')
  ];
  const sort = {
    title: 'Phân loại thiết bị và quá trình',
    buckets: [{ id: 'hot', name: 'Phía áp suất cao (nóng)' }, { id: 'cold', name: 'Phía áp suất thấp (lạnh)' }, { id: 'ht', name: 'Cách truyền nhiệt' }],
    items: [
      { t: 'Đầu đẩy máy nén', b: 'hot' }, { t: 'Thiết bị ngưng tụ', b: 'hot' }, { t: 'Hơi tỏa nhiệt ra môi trường', b: 'hot' },
      { t: 'Thiết bị bay hơi', b: 'cold' }, { t: 'Sau tiết lưu', b: 'cold' }, { t: 'Lỏng sôi thu nhiệt', b: 'cold' },
      { t: 'Thìa kim loại nóng lên', b: 'ht' }, { t: 'Quạt thổi mát người', b: 'ht' }, { t: 'Đèn sưởi ấm', b: 'ht' }
    ]
  };
  const order = [
    { title: 'Vòng tuần hoàn môi chất', intro: 'Sắp xếp theo thứ tự.', steps: ['Máy nén hút hơi áp thấp từ dàn bay hơi', 'Nén thành hơi áp cao, nhiệt độ cao', 'Hơi tỏa nhiệt, ngưng tụ thành lỏng', 'Lỏng đi qua thiết bị tiết lưu, giảm áp', 'Lỏng sôi ở dàn bay hơi, thu nhiệt', 'Hơi lại được máy nén hút về'] },
    { title: 'Làm lạnh vật cần lạnh', intro: 'Từ nhiệt của sản phẩm đến lạnh.', steps: ['Gas lỏng áp thấp vào dàn bay hơi', 'Gas thu nhiệt của sản phẩm để sôi', 'Sản phẩm mất nhiệt', 'Sản phẩm lạnh dần', 'Hơi gas được máy nén hút về'] },
    { title: 'Thả đá vào cốc trà nóng', intro: 'Quá trình truyền nhiệt.', steps: ['Trà nóng hơn đá', 'Nhiệt truyền từ trà sang đá', 'Trà mất nhiệt, nguội dần', 'Đá nhận nhiệt, ấm dần', 'Hai bên cân bằng nhiệt, ngừng truyền'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 1, ready: true, title: 'Nguyên lý làm lạnh', sub: 'Truyền nhiệt, làm lạnh, sơ đồ khối 4 thiết bị', minutes: 25,
    lead: 'Nền tảng của mọi hệ thống lạnh: ba cách truyền nhiệt, làm lạnh là gì, vì sao bay hơi chất lỏng sinh ra lạnh và vòng tuần hoàn của 4 thiết bị chính.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
