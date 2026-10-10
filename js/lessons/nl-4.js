/* NGUYÊN LÝ LÀM LẠNH — BÀI 4: MÔI CHẤT LẠNH (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_4.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  // bp: nhiệt độ sôi ở 1 atm (°C) theo bài giảng
  const GAS = {
    r12: { n: 'R12', f: 'CCl₂F₂ (Dichlorodifluoromethane)', grp: 'CFC', bp: -29.8, p: '70 – 120 psi', ban: true, note: 'Bình màu trắng. Dùng nhiều trong tủ lạnh, tủ bảo quản trước đây. Có Clo nên phá hủy tầng ôzôn, bị cấm từ 1996. Ở 550 °C trở lên phân hủy thành khí phosgene rất độc.' },
    r22: { n: 'R22', f: 'CHClF₂ (Monochlorodifluoromethane)', grp: 'HCFC', bp: -40.8, p: '120 – 200 psi', ban: true, note: 'Dùng nhiều cho điều hòa, máy làm kem, làm đá. Còn Clo nên bị cấm. Không hòa tan hoàn toàn với dầu nên dễ bị tách dầu.' },
    r134a: { n: 'R134a', f: 'CH₂F–CF₃ (Tetrafluoroethane)', grp: 'HFC', bp: -26.5, p: '80 – 140 psi', ban: false, note: 'Không có Clo, thay thế R12. Phải dùng dầu tổng hợp (Polyester) dễ hút ẩm: gây axit hóa dầu, hỏng máy nén. Năng suất lạnh không cao, chỉ số nóng lên toàn cầu vẫn còn khá lớn.' },
    r502: { n: 'R502', f: 'Hỗn hợp đồng sôi: 48,8% R22 + 51,2% R115', grp: 'CFC', bp: -45.5, p: '—', ban: true, note: 'Tính chất gần R22 nhưng hòa tan dầu tốt hơn, năng suất lạnh cao hơn; dùng trong kho lạnh, máy làm kem, làm đá. Có Clo nên bị cấm.' },
    r410a: { n: 'R410A', f: 'Hỗn hợp không đồng sôi: 50% R125 + 50% R32', grp: 'HFC', bp: -51.5, p: 'cao hơn R22', ban: false, note: 'Không phá tầng ôzôn. Do không đồng sôi, khi rò rỉ thiếu gas phải <b>xả sạch toàn bộ</b> rồi nạp lại; nạp ở <b>thể lỏng</b> (úp ngược chai gas).' },
    r507: { n: 'R507', f: 'Hỗn hợp đồng sôi: 50% R125 + 50% R143a', grp: 'HFC', bp: -46.5, p: '100 – 180 psi', ban: false, note: 'Thay thế R502: nhiệt độ sôi (−46,5 so với −45,5 °C) và áp suất ngưng tụ tương đương.' },
    r600a: { n: 'R600a', f: 'Isobutane (hydrocarbon)', grp: 'HC', bp: -11.7, p: '40 – 50 psi', ban: false, note: 'Dùng trong tủ lạnh Inverter. Thân thiện với môi trường (ODP, GWP rất thấp) nhưng <b>dễ cháy</b>. Nhiệt độ sôi cao nên áp suất sôi thường thấp hơn áp suất khí quyển.' }
  };
  const PROPS = [
    ['Bền vững hóa học', 'Không bị phân hủy, không biến đổi.'],
    ['Không dẫn điện', 'Vì ngâm trong cùng không gian với phần điện.'],
    ['Hòa tan với dầu bôi trơn', 'Không hòa tan sẽ gây tắc dầu.'],
    ['Không cháy, không nổ', 'Hoặc rất khó cháy nổ.'],
    ['Dễ phát hiện rò rỉ', 'Có mùi thơm nhẹ, có thể dùng máy dò.'],
    ['Áp suất ngưng tụ thấp', 'Hệ số nén thấp, nhẹ tải cho máy nén.'],
    ['An toàn, không ảnh hưởng sản phẩm', 'Không độc với cơ thể và sản phẩm cần làm lạnh.'],
    ['Không ăn mòn vật liệu', 'Thân thiện môi trường: ODP, GWP càng thấp càng tốt.']
  ];

  function learn() {
    return `
<section class="sec" id="s-def" data-toc="1 · Khái niệm">
  <div class="sec-n">Phần 1</div><h2>Môi chất lạnh là gì?</h2>
  <p><b>Môi chất lạnh</b> (gas lạnh, tác nhân lạnh) là chất được nạp vào hệ thống làm lạnh. Trong quá trình tuần hoàn, nó <b>không mất đi, không tiêu hao, không biến đổi</b> thành dạng năng lượng khác mà chỉ <b>trao đổi nhiệt</b> với môi trường: tỏa nhiệt ở ngưng tụ, thu nhiệt ở bay hơi.</p>
</section>

<section class="sec" id="s-prop" data-toc="2 · Tính chất">
  <div class="sec-n">Phần 2</div><h2>Tính chất cần có của môi chất lạnh</h2>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Tính chất</th><th>Giải thích</th></tr></thead><tbody>${PROPS.map(p => `<tr><td><b>${p[0]}</b></td><td>${p[1]}</td></tr>`).join('')}</tbody></table></div>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">An toàn khi dùng gas lạnh</b><p>Gas nặng hơn không khí, không duy trì sự sống nên nồng độ cao gây ngạt. Gặp lửa/ nhiệt độ cao, gas phân hủy thành khí độc. Gas lỏng gây bỏng lạnh. <b>Tuyệt đối không dùng bình gas lạnh để chiết nạp khí khác</b>.</p></div></div>
</section>

<section class="sec" id="s-types" data-toc="3 · Các loại gas">
  <div class="sec-n">Phần 3</div><h2>Các môi chất thường dùng</h2>
  <p>Chọn gas để xem công thức, nhiệt độ sôi và lưu ý. Nhiệt độ sôi ở áp suất khí quyển càng thấp thì càng dễ đạt nhiệt độ âm sâu.</p>
  <div id="gTabs"></div><article class="panel" id="gPanel" aria-live="polite"></article>
  <div class="stage" style="padding:14px"><b>So sánh nhiệt độ sôi ở 1 atm</b><div id="gBars" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-use" data-toc="4 · Chọn & nạp gas">
  <div class="sec-n">Phần 4</div><h2>Lưu ý khi thay thế và nạp gas</h2>
  <div class="grid2">
    <div class="panel hotc"><h3>Thay gas phải đảm bảo 2 yếu tố</h3><p style="margin:0">① <b>Áp suất ngưng tụ</b> tương đương (để rơle bảo vệ áp suất và máy nén làm việc đúng). ② <b>Nhiệt độ sôi</b> tương đương (nếu lệch, phải chỉnh tiết lưu cho đạt nhiệt độ yêu cầu).</p></div>
    <div class="panel warm"><h3>Hỗn hợp không đồng sôi</h3><p style="margin:0">Như <b>R410A</b>: thành phần dễ thay đổi khi rò rỉ. Thiếu gas thì <b>không nạp bù</b>, phải xả sạch, hút chân không rồi nạp lại đúng khối lượng, nạp ở thể lỏng.</p></div>
  </div>
  <div class="callout"><span class="ic">🔥</span><div><b class="t">R600a (tủ lạnh Inverter)</b><p>Là gas dễ cháy: tránh ngọn lửa hở, cẩn thận khi hàn. Áp suất sôi thường thấp hơn khí quyển nên đồng hồ áp có thể chỉ dưới 0.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Môi chất lạnh chỉ trao đổi nhiệt, không tiêu hao.</b></div></li>
    <li class="done"><div><b>R12, R22, R502 có Clo – phá tầng ôzôn – đã bị cấm.</b></div></li>
    <li class="done"><div><b>R134a thay R12; dùng dầu tổng hợp polyester (hút ẩm).</b></div></li>
    <li class="done"><div><b>R410A không đồng sôi: rò rỉ phải xả sạch, nạp lại ở thể lỏng.</b></div></li>
    <li class="done"><div><b>R507 thay R502; R600a dùng cho tủ lạnh Inverter (dễ cháy).</b></div></li>
    <li class="done"><div><b>Thay gas: áp suất ngưng tụ và nhiệt độ sôi phải tương đương.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/4/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    const ids = Object.keys(GAS);
    U.tabset($('#gTabs', root), ids.map((id, i) => ({ id, n: i + 1, name: GAS[id].n })), id => {
      const g = GAS[id];
      $('#gPanel', root).innerHTML = `<h3>${g.n} <span class="pill ${g.ban ? 'bad' : 'ok'}">${g.ban ? 'Đã bị cấm / hạn chế' : 'Đang dùng'}</span> <span class="pill cold">${g.grp}</span></h3>
        <dl class="kv"><dt>Công thức</dt><dd>${g.f}</dd><dt>Sôi ở 1 atm</dt><dd><b>${g.bp.toString().replace('.', ',')} °C</b></dd><dt>Áp suất (nhiệt độ thường)</dt><dd>${g.p}</dd><dt>Ghi chú</dt><dd>${g.note}</dd></dl>`;
      $$('#gBars [data-g]', root).forEach(r => r.style.outline = r.dataset.g === id ? '2px solid var(--cold)' : 'none');
    });
    // thanh so sánh: -55 .. 0
    $('#gBars', root).innerHTML = ids.slice().sort((a, b) => GAS[a].bp - GAS[b].bp).map(id => {
      const g = GAS[id], w = Math.round((g.bp + 55) / 55 * 100);
      return `<div data-g="${id}" style="display:flex;align-items:center;gap:10px;margin:4px 0;border-radius:6px;padding:2px 4px"><b style="width:64px">${g.n}</b><div class="bar" style="flex:1;height:14px"><i style="width:${100 - w}%;background:${g.ban ? 'var(--bad)' : 'var(--cold)'}"></i></div><span class="muted" style="width:70px;text-align:right">${g.bp.toString().replace('.', ',')} °C</span></div>`;
    }).join('') + '<p class="muted" style="margin:8px 0 0;font-size:13.5px">Thanh dài hơn = sôi ở nhiệt độ thấp hơn. Màu đỏ: gas đã bị cấm.</p>';
    $$('#gBars [data-g]', root).forEach(r => r.onclick = () => { const b = $(`#gTabs [data-id="${r.dataset.g}"]`, root); if (b) b.click(); });
    $$('#gBars [data-g]', root)[0] && ($('#gBars [data-g="' + ids[0] + '"]', root).style.outline = '2px solid var(--cold)');
  }

  const flashcards = [
    { f: 'Môi chất lạnh là gì?', b: 'Chất nạp trong hệ thống làm lạnh, chỉ trao đổi nhiệt với môi trường, không tiêu hao.', tag: 'Chung' },
    { f: 'Gas lạnh cần có tính chất gì? (nêu 4)', b: 'Bền vững hóa học, không dẫn điện, hòa tan dầu, không cháy nổ, dễ phát hiện rò rỉ…', tag: 'Chung' },
    { f: 'Vì sao gas cần không dẫn điện?', b: 'Gas và dầu tiếp xúc cuộn dây điện bên trong block.', tag: 'Chung' },
    { f: 'Vì sao gas cần hòa tan dầu?', b: 'Để dầu theo gas hồi về máy nén, tránh tắc dầu.', tag: 'Chung' },
    { f: 'Gas lạnh nặng hơn hay nhẹ hơn không khí?', b: 'Nặng hơn; nồng độ cao gây ngạt.', tag: 'An toàn' },
    { f: 'Gas gặp lửa sẽ?', b: 'Phân hủy thành khí rất độc (như phosgene).', tag: 'An toàn' },
    { f: 'Gas lỏng dính da gây?', b: 'Bỏng lạnh.', tag: 'An toàn' },
    { f: 'Có dùng bình gas lạnh nạp khí khác không?', b: 'Tuyệt đối không.', tag: 'An toàn' },
    { f: 'R12: công thức và nhiệt độ sôi?', b: 'CCl₂F₂; sôi −29,8 °C; bình màu trắng.', tag: 'R12' },
    { f: 'Vì sao R12, R22 bị cấm?', b: 'Có Clo, phá hủy tầng ôzôn (cấm từ 1996 theo bài).', tag: 'R12' },
    { f: 'R22: công thức, nhiệt độ sôi?', b: 'CHClF₂; −40,8 °C.', tag: 'R22' },
    { f: 'R22 dùng nhiều ở đâu?', b: 'Điều hòa, máy làm kem, làm đá.', tag: 'R22' },
    { f: 'Nhược điểm R22 về dầu?', b: 'Không hòa tan hoàn toàn với dầu, dễ tách dầu.', tag: 'R22' },
    { f: 'R134a thay thế gas nào?', b: 'R12.', tag: 'R134a' },
    { f: 'R134a sôi ở bao nhiêu độ?', b: '−26,5 °C (theo bài); không có Clo.', tag: 'R134a' },
    { f: 'R134a dùng dầu gì?', b: 'Dầu tổng hợp polyester, dễ hút ẩm.', tag: 'R134a' },
    { f: 'Hệ dùng polyester bị hở thì?', b: 'Dầu hút ẩm, sinh axit, hỏng dầu và máy nén; phải sấy, thay dầu.', tag: 'R134a' },
    { f: 'R502 là hỗn hợp nào?', b: '48,8% R22 + 51,2% R115, đồng sôi; sôi −45,5 °C.', tag: 'R502' },
    { f: 'R410A là hỗn hợp nào?', b: '50% R125 + 50% R32, không đồng sôi; sôi −51,5 °C.', tag: 'R410A' },
    { f: 'R410A rò rỉ thiếu gas phải làm gì?', b: 'Xả sạch toàn bộ, nạp lại; nạp ở thể lỏng (úp ngược chai).', tag: 'R410A' },
    { f: 'R507 thay thế gas nào?', b: 'R502 (sôi −46,5 °C, hỗn hợp 50% R125 + 50% R143a).', tag: 'R507' },
    { f: 'R600a là gì, dùng ở đâu?', b: 'Isobutane (hydrocarbon), dùng trong tủ lạnh Inverter; dễ cháy.', tag: 'R600a' },
    { f: 'R600a sôi ở bao nhiêu độ?', b: '−11,7 °C; áp suất sôi thường thấp hơn khí quyển.', tag: 'R600a' },
    { f: 'Hai yếu tố khi thay gas?', b: 'Áp suất ngưng tụ và nhiệt độ sôi tương đương.', tag: 'Thay gas' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Môi chất lạnh trong hệ thống tuần hoàn?', ['Không tiêu hao, chỉ trao đổi nhiệt', 'Bị đốt cháy dần', 'Biến thành điện', 'Thấm hết vào dầu'], 0, 'Chỉ tỏa nhiệt/ thu nhiệt.'),
    Q('Gas lạnh phải hòa tan với?', ['Dầu bôi trơn', 'Nước', 'Không khí', 'Đồng'], 0, 'Để dầu hồi về máy nén.'),
    Q('Gas lạnh so với không khí?', ['Nặng hơn', 'Nhẹ hơn', 'Bằng', 'Không xác định'], 0, 'Dễ đọng thấp, gây ngạt.'),
    Q('Gas gặp lửa dễ tạo ra?', ['Khí độc', 'Khí oxy', 'Nước', 'Dầu'], 0, 'Phân hủy thành khí độc.'),
    Q('R12 có bình màu?', ['Trắng', 'Xanh lá', 'Đỏ', 'Đen'], 0, 'Theo bài giảng.'),
    Q('Nhiệt độ sôi của R12 ở 1 atm?', ['−29,8 °C', '−40,8 °C', '−51,5 °C', '−11,7 °C'], 0, 'Theo bài.'),
    Q('Nhiệt độ sôi của R22?', ['−40,8 °C', '−29,8 °C', '−26,5 °C', '−46,5 °C'], 0, 'Thấp hơn R12.'),
    Q('Lý do R12, R22 bị cấm?', ['Có Clo, phá tầng ôzôn', 'Quá đắt', 'Không lạnh', 'Dễ cháy'], 0, 'Chứa Clo.'),
    Q('R22 dùng nhiều trong?', ['Điều hòa không khí', 'Tủ lạnh Inverter', 'Bình chữa cháy', 'Máy giặt'], 0, 'Và máy làm kem, làm đá.'),
    Q('Gas thay thế R12 là?', ['R134a', 'R22', 'R502', 'R410A'], 0, 'Không có Clo.'),
    Q('R134a phải dùng dầu?', ['Polyester tổng hợp', 'Dầu khoáng thường', 'Dầu ăn', 'Dầu nhớt xe máy'], 0, 'Nhóm gas HFC.'),
    Q('Dầu polyester nguy hiểm vì?', ['Tự hút ẩm, sinh axit', 'Rất dễ cháy', 'Đông đặc ở 20 °C', 'Có mùi hôi'], 0, 'Ẩm gây axit hóa dầu.'),
    Q('Sau khi hở hệ thống R134a, cần?', ['Sấy, kiểm tra/ thay dầu trước khi nạp', 'Nạp ngay', 'Thêm cồn', 'Bỏ qua'], 0, 'Tách ẩm khỏi dầu.'),
    Q('R502 là?', ['Hỗn hợp đồng sôi R22 + R115', 'Gas tinh khiết', 'Hydrocarbon', 'Không khí nén'], 0, 'Theo thành phần bài giảng.'),
    Q('R410A là hỗn hợp?', ['Không đồng sôi (R125 + R32)', 'Đồng sôi R22', 'Tinh khiết', 'Hydrocarbon'], 0, 'Thành phần đổi khi rò rỉ.'),
    Q('R410A thiếu gas thì?', ['Xả hết rồi nạp lại', 'Nạp thêm cho đủ áp', 'Thêm dầu', 'Đóng van'], 0, 'Tránh sai thành phần.'),
    Q('R410A nên nạp ở thể?', ['Lỏng', 'Hơi', 'Rắn', 'Tùy thích'], 0, 'Úp ngược chai gas.'),
    Q('R507 thay thế?', ['R502', 'R12', 'R134a', 'R600a'], 0, 'Áp suất, nhiệt độ sôi tương đương.'),
    Q('R600a dùng ở?', ['Tủ lạnh Inverter', 'Điều hòa ô tô', 'Máy làm kem công nghiệp', 'Bình lửa'], 0, 'Hydrocarbon thân thiện môi trường.'),
    Q('Điểm cần chú ý của R600a?', ['Dễ cháy', 'Rất độc', 'Không hòa tan dầu', 'Không bay hơi'], 0, 'Tránh lửa khi hàn.'),
    Q('Thay gas cần đảm bảo?', ['Áp suất ngưng tụ và nhiệt độ sôi tương đương', 'Chỉ cùng màu bình', 'Chỉ cùng giá', 'Chỉ cùng hãng'], 0, 'Để thiết bị làm việc đúng.'),
    Q('Gas nào sôi thấp nhất trong bài?', ['R410A (−51,5 °C)', 'R600a (−11,7 °C)', 'R134a (−26,5 °C)', 'R12 (−29,8 °C)'], 0, 'Số âm càng lớn càng thấp.'),
    Q('Gas nào sôi cao nhất trong bài?', ['R600a (−11,7 °C)', 'R22', 'R502', 'R410A'], 0, 'Nên áp suất sôi thấp.'),
    Q('Có dùng bình gas lạnh để nạp khí khác không?', ['Không', 'Có', 'Tùy loại', 'Chỉ nạp oxy'], 0, 'Tuyệt đối không.')
  ];
  const sort = {
    title: 'Phân loại các loại gas',
    buckets: [{ id: 'ban', name: 'Có Clo – đã bị cấm' }, { id: 'hfc', name: 'Không Clo (HFC)' }, { id: 'hc', name: 'Hydrocarbon dễ cháy' }],
    items: [
      { t: 'R12', b: 'ban' }, { t: 'R22', b: 'ban' }, { t: 'R502', b: 'ban' },
      { t: 'R134a', b: 'hfc' }, { t: 'R410A', b: 'hfc' }, { t: 'R507', b: 'hfc' },
      { t: 'R600a (isobutane)', b: 'hc' }
    ]
  };
  const order = [
    { title: 'Nạp lại R410A khi thiếu gas', intro: 'Quy trình đúng.', steps: ['Phát hiện thiếu gas do rò rỉ', 'Sửa chỗ rò rỉ', 'Xả sạch toàn bộ gas cũ', 'Hút chân không', 'Nạp gas mới ở thể lỏng (úp ngược chai) đúng khối lượng', 'Chạy thử, kiểm tra'] },
    { title: 'Xử lý hệ thống R134a bị hở', intro: 'Tránh hỏng dầu.', steps: ['Xác định hệ thống đã hở, để lâu', 'Kiểm tra dầu có ẩm/ axit không', 'Sấy tách ẩm khỏi dầu hoặc thay dầu, vệ sinh sạch', 'Sửa chữa, hàn kín', 'Hút chân không', 'Nạp gas'] },
    { title: 'Chọn gas thay thế', intro: 'Điều kiện thay gas.', steps: ['Gas cũ bị cấm hoặc không có', 'Chọn gas có áp suất ngưng tụ tương đương', 'Kiểm tra nhiệt độ sôi gần như nhau', 'Chỉnh tiết lưu nếu nhiệt độ sôi lệch', 'Kiểm tra dầu có phù hợp'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 4, ready: true, title: 'Môi chất lạnh', sub: 'R12, R22, R134a, R502, R410A, R507, R600a', minutes: 25,
    lead: 'Định nghĩa, tính chất cần có và đặc điểm các loại môi chất lạnh thường dùng: R12, R22, R134a, R502, R410A, R507, R600a; lưu ý khi thay gas và nạp gas.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
