/* BÀI 13 — PHỤ TẢI ĐIỆN: BLOCK, QUẠT GIÓ, SẤY XẢ TUYẾT, ĐÈN (biên soạn từ docs/Bai_13.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  function fanSVG(motorCW, bladeCW) {
    const ok = motorCW === bladeCW;
    return `<svg viewBox="0 0 560 230" role="img" aria-label="Quạt gió: động cơ quay ${motorCW ? 'thuận' : 'ngược'} chiều kim đồng hồ, cánh thiết kế cho chiều ${bladeCW ? 'thuận' : 'ngược'}">
      <defs><marker id="fa" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--cold)"/></marker></defs>
      <rect x="20" y="20" width="250" height="190" rx="14" fill="var(--cold-tint2)" stroke="var(--ink)" stroke-width="3"/><text class="sub" x="145" y="42" text-anchor="middle">dàn lạnh phía trước quạt</text>
      <g transform="translate(145 120)"><circle r="62" fill="none" stroke="var(--line)" stroke-width="3"/>
        <g style="transform-box:fill-box;transform-origin:center;animation:spin ${ok ? 1 : 3}s linear infinite ${motorCW ? '' : 'reverse'}">
          ${[0, 1, 2, 3, 4].map(i => `<path transform="rotate(${i * 72})" d="M0 0 C ${bladeCW ? '-14 -30 8 -52 30 -50' : '14 -30 -8 -52 -30 -50'} 0 -58 0 0" fill="${ok ? 'var(--cold)' : 'var(--bad)'}" opacity=".85"/>`).join('')}</g>
        <circle r="9" fill="var(--ink)"/></g>
      <g transform="translate(320 60)"><text class="lbl" x="0" y="0">Động cơ quay: ${motorCW ? 'THUẬN' : 'NGƯỢC'} chiều kim đồng hồ</text><text class="lbl" x="0" y="26">Cánh thiết kế cho chiều: ${bladeCW ? 'THUẬN' : 'NGƯỢC'}</text>
        <text class="lbl" x="0" y="72" style="fill:${ok ? 'var(--ok)' : 'var(--bad)'}">${ok ? '✓ Khớp: gió đối lưu mạnh' : '✗ Ngược: gió yếu, tủ kém lạnh'}</text>
        <text class="sub" x="0" y="96">${ok ? 'Quạt đẩy/hút gió qua dàn đúng chiều.' : 'Quạt quay ngược chiều cánh → lưu lượng gió rất yếu,'}</text><text class="sub" x="0" y="116">${ok ? '' : 'dễ tắc kênh gió, tuyết bám ở ngăn đông.'}</text></g></svg>`;
  }

  const LOADS = {
    fan: { name: 'Động cơ quạt gió', range: [500, 900], unit: 'Ω', hint: 'khoảng 600 – 800 Ω' },
    heat: { name: 'Sấy xả tuyết (bóng thủy tinh / ống nhôm)', range: [300, 500], unit: 'Ω', hint: 'khoảng 300 – 500 Ω (VD 380 Ω)' },
    blk: { name: 'Cuộn chạy block', range: [10, 25], unit: 'Ω', hint: 'từ vài Ω đến vài chục Ω (VD 12 Ω)' }
  };

  function learn() {
    return `
<section class="sec" id="s-intro" data-toc="1 · Phụ tải là gì">
  <div class="sec-n">Phần 1</div><h2>Phụ tải điện trong tủ lạnh</h2>
  <p>Ở Bài 6–12 ta học <b>thiết bị điện</b> (điều khiển nguồn). Bài này học <b>phụ tải điện</b>: thiết bị <b>tiêu thụ điện</b>, biến điện năng thành dạng năng lượng khác để làm việc.</p>
  <div class="tabs"><div class="tab" style="cursor:default"><b>1</b><span><strong>Động cơ block</strong><br><small class="muted">điện → cơ năng, nén gas</small></span></div><div class="tab" style="cursor:default"><b>2</b><span><strong>Động cơ quạt gió</strong><br><small class="muted">điện → cơ năng, đối lưu gió</small></span></div><div class="tab" style="cursor:default"><b>3</b><span><strong>Sấy xả tuyết</strong><br><small class="muted">điện → nhiệt năng</small></span></div><div class="tab" style="cursor:default"><b>4</b><span><strong>Bóng đèn</strong><br><small class="muted">điện → quang năng</small></span></div></div>
</section>

<section class="sec" id="s-block" data-toc="2 · Block (ôn lại)">
  <div class="sec-n">Phần 2</div><h2>Động cơ block — nhắc lại</h2>
  <p>Block có 3 phần: vỏ, phần cơ, phần <b>điện</b> (phụ tải điện chính là động cơ điện xoay chiều không đồng bộ 1 pha: <b>rô-to</b> trong lòng <b>stato</b>, tâm rô-to có rãnh xoắn bơm dầu; stato bằng lá thép kỹ thuật điện, ≥ 24 rãnh, 2 cuộn dây lệch 90°). Xem lại <a href="#/tu-lanh/5">Bài 5</a> và <a href="#/tu-lanh/2">Bài 2</a>.</p>
  <div class="callout"><span class="ic">🔁</span><div><b class="t">Ba nhắc nhớ</b><p>① Chân chung C: loại ra từ lần đo <b>lớn nhất</b>. ② Nếu dòng cao hơn định mức có thể xác định nhầm → <b>đổi chạy – đề</b>. ③ Kiểm tra: cuộn dây (x1 Ω), cách điện (x10k, ≥ 10 MΩ), dòng làm việc (kẹp dòng).</p></div></div>
</section>

<section class="sec" id="s-fan" data-toc="3 · Quạt gió">
  <div class="sec-n">Phần 3</div><h2>Động cơ quạt gió</h2>
  <p>Đặt phía sau ngăn đông tủ <b>gián tiếp</b>: quạt <b>hút hoặc đẩy</b> gió qua dàn trao đổi nhiệt rồi đưa gió lạnh vào các ngăn. Quạt càng quay nhanh, đúng chiều, năng suất lạnh càng tốt.</p>
  <dl class="kv"><dt>Cấu tạo</dt><dd>Động cơ điện xoay chiều <b>công suất nhỏ</b>: stato chỉ có <b>1 cuộn dây</b> quấn trên khung sắt từ, khởi động bằng <b>vòng chậm (vòng ngắn mạch)</b>; rô-to nối trục cánh.</dd>
  <dt>Chiều quay</dt><dd>Động cơ chỉ quay <b>một chiều cố định</b> (khác block có 2 cuộn nên đổi được chân chạy/đề). Chiều quay phụ thuộc vị trí lắp và cấu trúc cánh.</dd>
  <dt>Điện trở</dt><dd>Cuộn dây quạt khoảng <b>600 – 800 Ω</b> (VD 600 Ω; mô hình đo được 800 Ω).</dd></dl>
  <h3 style="margin-top:20px">🔬 Chiều quay đúng hay sai?</h3>
  <p>Quạt thay mới đôi khi quay ngược chiều cánh. Bấm để đổi chiều rô-to hoặc cánh và xem hậu quả.</p>
  <div class="stage"><div id="fSvg"></div><div class="controls"><button class="btn sm" id="fM">⟲⟳ Đổi chiều động cơ (đảo rô-to hoặc stato)</button><button class="btn sm" id="fB">⟲⟳ Đổi cánh quạt khác chiều</button></div></div>
  <div class="grid2"><div class="panel okc" style="margin:0"><h4>Cách đổi chiều quay quạt</h4><p style="margin:6px 0 0">Tháo vỏ cánh, <b>lật ngược rô-to</b> <i>hoặc</i> lật ngược <b>stato</b> (chỉ đổi <b>một</b> trong hai, không đổi cả hai). Hoặc mua <b>cánh ngược chiều</b> cho phù hợp. Nhiều quạt dùng đinh tán — muốn tháo phải bỏ đinh tán rồi thay bằng bu-lông.</p></div>
    <div class="panel hotc" style="margin:0"><h4>Hư hỏng quạt</h4><ul style="margin:6px 0 0;padding-left:18px"><li><b>Đứt cuộn dây</b> → quạt không quay → tủ không lạnh</li><li><b>Kẹt rô-to / trục</b> hoặc thiếu dầu → quay chậm → <b>kém lạnh</b></li><li><b>Trượt cánh</b> do mất chốt giữ, cánh chạm thân quạt</li><li><b>Quay ngược</b> chiều cánh → kém lạnh, dễ tắc kênh gió</li></ul></div></div>
  ${U.steps([['Tủ kém lạnh → quan sát chiều quay, tốc độ cánh', 'Quay chậm → vệ sinh, tra dầu, tìm chỗ kẹt.'], ['Tủ không lạnh → quạt không quay → đo điện trở cuộn dây', 'Đo hai chân giắc cắm: khoảng 600 – 800 Ω. ∞ → đứt cuộn dây.'], ['Cấp nguồn thử quay', 'Nhiều quạt quay trơn bằng tay nhưng khi có điện bị <b>kẹt</b> (nhiễm từ).'], ['Kiểm tra nguồn cấp', 'Một dây từ công tắc quạt, một dây từ chân <b>4</b> (chế độ dài) của rơle thời gian. Có điện mà không quay → hỏng quạt.'], ['Thay thế: đúng hình dạng, kích thước, điện áp, chiều quay', 'Quạt có dòng dây quấn lớn/nhỏ, cánh 3 cỡ (nhỏ/trung/đại), trục khác nhau; mỏng quá không lắp được. Cánh phải không chạm vào thân quạt.']])}
</section>

<section class="sec" id="s-heat" data-toc="4 · Sấy xả tuyết">
  <div class="sec-n">Phần 4</div><h2>Điện trở sấy xả tuyết</h2>
  <p>Biến điện năng thành <b>nhiệt</b> để làm tan tuyết trên dàn. Tủ <b>1 cánh</b> không có sấy; tủ <b>2 cánh</b> có sấy rất nhỏ, chỉ <b>bổ trợ ngăn mát</b>; tủ <b>gián tiếp</b> thì sấy cực kỳ quan trọng.</p>
  <div id="hTabs"></div><article class="panel" id="hPanel" aria-live="polite"></article>
  <h3 style="margin-top:20px">Hư hỏng và kiểm tra</h3>
  <p>Sấy thường hỏng ở dạng <b>đứt dây điện trở</b>. Biểu hiện tùy mạch (xem Bài 15): <b>chỉ đèn sáng</b> (khi rơle thời gian đứng ở chế độ xả) hoặc <b>kém lạnh dần rồi mất lạnh</b>, tuyết bám kín dàn. Đo hai đầu sấy bằng thang <b>x10 Ω</b>: có giá trị khoảng <b>300 – 500 Ω</b> là tốt, không có (∞) là đứt.</p>
  <p><b>Thay thế:</b> đúng hình dạng, kích thước, <b>công suất, điện áp</b>. Ống nhôm thường bán kèm dàn, khó thay riêng (phải xuyên qua lá tản nhiệt) nên khi hỏng thường đổi sang <b>bóng thủy tinh</b> đặt dưới dàn. Khi lắp phải kiểm tra <b>tấm che kim loại</b> phía trên bóng có phẳng không — nếu cong, nước nhỏ vào gây nổ bóng, rò điện ra vỏ.</p>
</section>

<section class="sec" id="s-lamp" data-toc="5 · Bóng đèn">
  <div class="sec-n">Phần 5</div><h2>Bóng đèn chiếu sáng</h2>
  <p>Tủ lạnh dùng chủ yếu <b>đèn sợi đốt</b> và số ít <b>đèn LED</b>. Đèn sợi đốt biến điện năng thành quang năng nhưng tỏa nhiều <b>nhiệt</b> vào tủ, nên nếu đèn <b>luôn sáng</b> (công tắc cửa dính) tủ sẽ kém lạnh, tốn điện. Đèn không sáng: kiểm tra bóng, công tắc, dây.</p>
</section>

<section class="sec" id="s-lab" data-toc="6 · Thực hành đo">
  <div class="sec-n">Phần 6</div><h2>Thực hành đo phụ tải</h2>
  <p>Chọn phụ tải, bấm “Đo” để xem số đo của một mẫu ngẫu nhiên (tốt hoặc hỏng), rồi kết luận.</p>
  <div class="panel"><div class="row"><label>Phụ tải <select id="lSel" class="btn sm" style="min-height:36px">${Object.entries(LOADS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}</select></label><button class="btn sm" id="lNew">🔄 Mẫu mới</button><button class="btn pri sm" id="lMeas">Đo hai đầu</button></div>
    <div class="verdict" id="lOut" style="margin-top:10px;font-family:monospace;min-height:3.5em">Bấm “Đo hai đầu”.</div>
    <div class="row" style="margin-top:10px"><b>Kết luận:</b><select id="lAns" class="btn sm" style="min-height:40px"><option value="">— chọn —</option><option value="good">Tốt</option><option value="open">Đứt dây</option><option value="short">Chạm / chập</option></select><button class="btn pri sm" id="lChk">Kiểm tra</button></div><div id="lRes" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-recap" data-toc="7 · Tóm tắt">
  <div class="sec-n">Phần 7</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Phụ tải điện: block, quạt gió, sấy xả tuyết, bóng đèn.</b></div></li>
    <li class="done"><div><b>Quạt gió: động cơ 1 cuộn + vòng chậm, một chiều quay, R ≈ 600–800 Ω.</b></div></li>
    <li class="done"><div><b>Quạt quay ngược chiều cánh → kém lạnh; đổi bằng lật rô-to hoặc stato.</b></div></li>
    <li class="done"><div><b>Quạt kẹt/chậm → kém lạnh; không quay → không lạnh.</b></div></li>
    <li class="done"><div><b>Sấy: ống nhôm (song song dàn) hoặc bóng thủy tinh (dưới dàn), R ≈ 300–500 Ω.</b></div></li>
    <li class="done"><div><b>Sấy đứt → tuyết bám kín hoặc chỉ đèn sáng; đèn luôn sáng gây kém lạnh.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/13/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const HT = {
    al: ['Sấy ống nhôm', ['Vỏ ngoài là <b>ống nhôm</b>, bên trong dây điện trở và bột cách điện.', 'Lắp <b>song song với bề mặt dàn</b>, xuyên qua các lá nhôm tản nhiệt.'], ['Làm tan tuyết đều toàn bộ bề mặt dàn', 'Bền hơn bóng thủy tinh'], ['Hư hỏng rất khó thay riêng', 'Thường phải thay cả dàn']],
    glass: ['Sấy bóng thủy tinh', ['Vỏ ngoài là <b>ống thủy tinh</b>, bên trong dây điện trở.', 'Lắp <b>dưới</b> bề mặt dàn, phía trên có <b>tấm che kim loại</b>.'], ['Cấu tạo đơn giản', 'Dễ thay thế'], ['Kém bền: nước tuyết tan nhỏ xuống bóng đang nóng làm <b>nổ, đứt</b>', 'Tấm che cong vênh càng dễ hỏng']]
  };

  function mount(root) {
    let m = true, b = true; const fs = $('#fSvg', root), fd = () => fs.innerHTML = fanSVG(m, b); fd();
    $('#fM', root).onclick = () => { m = !m; fd(); }; $('#fB', root).onclick = () => { b = !b; fd(); };
    U.tabset($('#hTabs', root), [{ id: 'al', name: 'Ống nhôm' }, { id: 'glass', name: 'Bóng thủy tinh' }], id => { const h = HT[id]; $('#hPanel', root).innerHTML = `<h3>${h[0]}</h3><ul>${h[1].map(x => `<li>${x}</li>`).join('')}</ul><p style="margin:0"><b>Ưu:</b> ${h[2].map(x => `<span class="pill ok">${x}</span>`).join('')}</p><p style="margin:8px 0 0"><b>Nhược:</b> ${h[3].map(x => `<span class="pill bad">${x}</span>`).join('')}</p>`; });
    // lab
    let L;
    const mk = () => { const k = $('#lSel', root).value, r = LOADS[k].range; L = { k, st: ['good', 'good', 'open', k === 'blk' ? 'short' : 'good'][Math.floor(Math.random() * 4)], v: Math.round(r[0] + Math.random() * (r[1] - r[0])) }; $('#lOut', root).textContent = 'Bấm “Đo hai đầu”.'; $('#lRes', root).innerHTML = ''; $('#lAns', root).value = ''; };
    mk();
    $('#lSel', root).onchange = mk; $('#lNew', root).onclick = mk;
    $('#lMeas', root).onclick = () => { const ld = LOADS[L.k]; $('#lOut', root).innerHTML = L.st === 'open' ? 'Thang đo: <b>OL (∞) — kim không lên</b>' : L.st === 'short' ? 'Thang đo: <b>0 Ω — chạm</b>' : `Thang đo: <b>${L.v} ${ld.unit}</b>`; };
    $('#lChk', root).onclick = () => { const v = $('#lAns', root).value, r = $('#lRes', root); if (!v) { r.innerHTML = '<div class="why">Hãy chọn kết luận.</div>'; return; } r.innerHTML = `<div class="why" style="border-color:var(--${v === L.st ? 'ok' : 'bad'})"><b>${v === L.st ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> ${LOADS[L.k].name}: giá trị tốt ${LOADS[L.k].hint}. Mẫu này ${L.st === 'good' ? 'là <b>tốt</b>.' : L.st === 'open' ? 'bị <b>đứt dây</b> (∞).' : 'bị <b>chạm</b> (0 Ω).'}</div>`; };
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Phụ tải điện là gì?', b: 'Thiết bị <b>tiêu thụ điện</b> và biến thành dạng năng lượng khác (cơ, nhiệt, quang).', tag: 'Khái niệm' },
    { f: 'Kể các phụ tải trong tủ lạnh.', b: 'Block, quạt gió, sấy xả tuyết, bóng đèn.', tag: 'Khái niệm' },
    { f: 'Phần nào của block là phụ tải điện?', b: '<b>Động cơ điện</b> (stato + rô-to).', tag: 'Block' },
    { f: 'Stato block có mấy cuộn dây? Lệch bao nhiêu độ?', b: '<b>2</b> cuộn (chạy, đề), lệch <b>90°</b>.', tag: 'Block' },
    { f: 'Dòng cao hơn định mức sau khi đấu: nghi gì?', b: 'Đấu nhầm chạy – đề → đổi chỗ hai chân.', tag: 'Block' },
    { f: 'Quạt gió đặt ở đâu và để làm gì?', b: 'Phía sau ngăn đông tủ gián tiếp, đối lưu gió qua dàn lạnh.', tag: 'Quạt' },
    { f: 'Cấu tạo động cơ quạt?', b: 'Động cơ xoay chiều công suất nhỏ, stato <b>1 cuộn</b> + <b>vòng chậm</b>.', tag: 'Quạt' },
    { f: 'Điện trở cuộn dây quạt?', b: 'Khoảng <b>600 – 800 Ω</b>.', tag: 'Quạt' },
    { f: 'Quạt có đổi chiều bằng chân chạy/đề được không?', b: '<b>Không</b> (chỉ 1 cuộn). Đảo <b>rô-to hoặc stato</b>.', tag: 'Quạt' },
    { f: 'Đổi chiều quay quạt thế nào?', b: 'Lật rô-to <b>hoặc</b> stato (chỉ một trong hai), hoặc dùng cánh ngược chiều.', tag: 'Quạt' },
    { f: 'Quạt quay ngược chiều cánh → ?', b: 'Gió yếu, tủ <b>kém lạnh</b>, dễ tắc kênh gió.', tag: 'Quạt' },
    { f: 'Quạt quay chậm do đâu?', b: 'Kẹt rô-to/ trục, thiếu dầu, bám bẩn.', tag: 'Quạt' },
    { f: 'Quạt không quay → ?', b: 'Gió không đối lưu → tủ <b>không lạnh</b>.', tag: 'Quạt' },
    { f: 'Quạt lấy nguồn từ đâu?', b: 'Công tắc quạt và chân <b>4</b> (chế độ dài) của rơle thời gian.', tag: 'Quạt' },
    { f: 'Thay quạt cần đúng những gì?', b: 'Hình dạng, kích thước, điện áp, trục/cánh và chiều quay.', tag: 'Quạt' },
    { f: 'Tủ 1 cánh có sấy xả tuyết không?', b: '<b>Không</b>.', tag: 'Sấy' },
    { f: 'Sấy tủ 2 cánh làm gì?', b: 'Công suất nhỏ, <b>bổ trợ ngăn mát</b>.', tag: 'Sấy' },
    { f: 'Hai loại sấy tủ gián tiếp?', b: '<b>Ống nhôm</b> và <b>bóng thủy tinh</b>.', tag: 'Sấy' },
    { f: 'Sấy ống nhôm lắp thế nào?', b: 'Song song bề mặt dàn, xuyên các lá nhôm tản nhiệt.', tag: 'Sấy' },
    { f: 'Sấy bóng thủy tinh lắp ở đâu?', b: 'Phía dưới dàn, có <b>tấm che</b> kim loại phía trên.', tag: 'Sấy' },
    { f: 'Nhược điểm bóng thủy tinh?', b: 'Kém bền: nước nhỏ lên bóng nóng gây <b>nổ, đứt</b>.', tag: 'Sấy' },
    { f: 'Điện trở sấy tốt?', b: 'Khoảng <b>300 – 500 Ω</b> (VD 380 Ω); thang x10 Ω.', tag: 'Sấy' },
    { f: 'Sấy đứt → tủ ra sao?', b: 'Kém lạnh dần rồi mất lạnh (tuyết bám kín) hoặc chỉ đèn sáng.', tag: 'Sấy' },
    { f: 'Tấm che bóng sấy cong thì sao?', b: 'Nước nhỏ vào bóng gây nổ, <b>rò điện ra vỏ</b>.', tag: 'Sấy' },
    { f: 'Hai loại đèn trong tủ lạnh?', b: '<b>Sợi đốt</b> (đa số) và <b>LED</b>.', tag: 'Đèn' },
    { f: 'Đèn sợi đốt luôn sáng gây gì?', b: 'Tỏa nhiệt → tủ <b>kém lạnh, tốn điện</b>.', tag: 'Đèn' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Phụ tải điện là?', ['Thiết bị tiêu thụ điện', 'Thiết bị điều khiển nguồn', 'Dây dẫn', 'Cầu chì'], 0, 'Biến điện năng thành dạng khác.'),
    Q('Đâu là phụ tải?', ['Quạt gió', 'Rơle khởi động', 'Thermostat', 'Sò lạnh'], 0, 'Các thiết bị còn lại điều khiển.'),
    Q('Quạt gió dùng ở tủ?', ['Gián tiếp', 'Trực tiếp 1 cánh', 'Mọi tủ', 'Không dùng'], 0, 'Dàn có quạt đối lưu.'),
    Q('Stato quạt gió có?', ['1 cuộn dây', '2 cuộn dây', '3 cuộn dây', 'Không cuộn'], 0, 'Công suất nhỏ.'),
    Q('Quạt khởi động nhờ?', ['Vòng chậm', 'Tụ kích', 'PTC', 'Rơle dòng'], 0, 'Vòng ngắn mạch.'),
    Q('Điện trở cuộn quạt khoảng?', ['600–800 Ω', '10 Ω', '10 kΩ', '1 MΩ'], 0, 'Theo bài giảng.'),
    Q('Đổi chiều quay quạt?', ['Lật rô-to hoặc stato', 'Đổi chạy – đề', 'Đảo hai dây nguồn', 'Thêm tụ'], 0, 'Chỉ đổi một trong hai.'),
    Q('Đổi chiều quay quạt bằng cách đảo chạy-đề được không?', ['Không, quạt chỉ 1 cuộn', 'Được', 'Chỉ khi có tụ', 'Chỉ block'], 0, 'Block mới có 2 cuộn.'),
    Q('Quạt quay ngược chiều cánh gây?', ['Kém lạnh', 'Lạnh sâu', 'Ồn ít', 'Không đổi'], 0, 'Gió yếu.'),
    Q('Quạt không quay do?', ['Đứt cuộn dây / kẹt', 'Thừa gas', 'Dàn bẩn', 'Phin tắc'], 0, 'Hỏng cơ điện.'),
    Q('Quạt quay chậm, xử lý?', ['Vệ sinh, tra dầu', 'Thay block', 'Nạp gas', 'Thay phin'], 0, 'Tìm chỗ kẹt.'),
    Q('Đo quạt thấy ∞ nghĩa là?', ['Đứt cuộn dây', 'Tốt', 'Chạm', 'Kẹt cánh'], 0, 'Hở mạch.'),
    Q('Quạt gió lấy nguồn từ chân nào rơle thời gian?', ['Chân 4', 'Chân 2', 'Chân 1', 'Chân 3'], 0, 'Chế độ dài.'),
    Q('Tủ 1 cánh có sấy xả tuyết?', ['Không', 'Có', 'Có hai', 'Tùy hãng'], 0, 'Chỉ xả thủ công/ bán tự động.'),
    Q('Sấy tủ 2 cánh để?', ['Bổ trợ ngăn mát', 'Làm tan tuyết toàn bộ', 'Làm lạnh', 'Chiếu sáng'], 0, 'Công suất nhỏ.'),
    Q('Sấy ống nhôm khác bóng thủy tinh ở?', ['Lắp song song dàn, khó thay', 'Lắp ngoài tủ', 'Không có dây', 'Dùng gas'], 0, 'Ống nhôm xuyên qua lá tản nhiệt.'),
    Q('Điện trở sấy tốt khoảng?', ['300–500 Ω', '1 Ω', '100 kΩ', '∞'], 0, 'VD 380 Ω.'),
    Q('Đo sấy dùng thang?', ['x10 Ω', 'x10k', 'DC 12 V', 'AC 750 V'], 0, 'Điện trở trăm Ω.'),
    Q('Bóng sấy nổ do?', ['Nước nhỏ vào bóng đang nóng', 'Thiếu gas', 'Quạt quay ngược', 'Dầu bẩn'], 0, 'Thay đổi nhiệt đột ngột.'),
    Q('Vì sao cần tấm che trên bóng sấy?', ['Chắn nước nhỏ xuống', 'Trang trí', 'Tăng nhiệt', 'Giảm ồn'], 0, 'Bảo vệ bóng.'),
    Q('Sấy đứt thường gây?', ['Kém lạnh dần hoặc chỉ đèn sáng', 'Lạnh sâu', 'Cháy tủ', 'Thủng dàn'], 0, 'Tuyết bám hoặc timer kẹt.'),
    Q('Đèn nào tỏa nhiệt nhiều?', ['Sợi đốt', 'LED', 'Cả hai như nhau', 'Không đèn'], 0, 'Biến điện thành sáng + nhiệt.'),
    Q('Đèn luôn sáng gây?', ['Kém lạnh, tốn điện', 'Lạnh sâu', 'Tủ ồn', 'Không đổi'], 0, 'Nhiệt tỏa vào tủ.'),
    Q('Điều nào đúng về phụ tải?', ['Biến điện thành dạng năng lượng khác', 'Chỉ dẫn điện', 'Giữ điện áp', 'Không tiêu điện'], 0, 'Định nghĩa.')
  ];
  const sort = {
    title: 'Đặc điểm thuộc phụ tải nào?',
    buckets: [{ id: 'blk', name: 'Block' }, { id: 'fan', name: 'Quạt gió' }, { id: 'heat', name: 'Sấy xả tuyết' }],
    items: [
      { t: '2 cuộn dây chạy – đề lệch 90°', b: 'blk' }, { t: 'Tâm rô-to có rãnh xoắn bơm dầu', b: 'blk' }, { t: 'Đổi chạy – đề khi dòng cao', b: 'blk' }, { t: 'Cần rơle khởi động', b: 'blk' },
      { t: '1 cuộn dây, khởi động bằng vòng chậm', b: 'fan' }, { t: 'R ≈ 600–800 Ω', b: 'fan' }, { t: 'Đổi chiều bằng lật rô-to hoặc stato', b: 'fan' }, { t: 'Quay ngược cánh → kém lạnh', b: 'fan' },
      { t: 'R ≈ 300–500 Ω', b: 'heat' }, { t: 'Có loại ống nhôm và bóng thủy tinh', b: 'heat' }, { t: 'Tấm che cong làm nổ bóng', b: 'heat' }, { t: 'Đứt → tuyết bám kín dàn', b: 'heat' }
    ]
  };
  const order = [
    { title: 'Kiểm tra quạt gió không quay', intro: 'Tủ không lạnh. Sắp xếp các bước.', steps: ['Quan sát cánh quạt có quay không', 'Kiểm tra cánh có bị kẹt, chạm thân quạt', 'Đo điện trở cuộn dây quạt', 'Đứt (∞) thì thay quạt', 'Còn thông thì kiểm tra nguồn cấp (công tắc, chân 4)', 'Có nguồn mà không quay thì quạt hỏng'] },
    { title: 'Đổi chiều quay quạt', intro: 'Sắp xếp quy trình.', steps: ['Cấp nguồn thử, so chiều quay với chiều cánh', 'Phát hiện quay ngược', 'Tháo vỏ cánh quạt', 'Lật ngược rô-to (hoặc stato)', 'Lắp lại, cấp nguồn thử', 'Quay đúng chiều, lắp vào tủ'] },
    { title: 'Kiểm tra sấy xả tuyết', intro: 'Sắp xếp các bước.', steps: ['Tháo tấm xốp che kênh gió, quan sát dàn', 'Rút giắc cắm sấy', 'Chọn thang x10 Ω, chỉnh kim về 0', 'Đo hai đầu sấy', 'Đọc giá trị 300–500 Ω là tốt', 'Không có điện trở: sấy đứt, thay mới'] }
  ];
  DL.register({
    id: 13, ready: true, title: 'Phụ tải điện: quạt gió, sấy, đèn', sub: 'Quạt gió, sấy xả tuyết, bóng đèn, thực hành đo', minutes: 25,
    lead: 'Phụ tải là các thiết bị tiêu thụ điện. Bài này tập trung vào quạt gió (đổi chiều quay), sấy xả tuyết (hai loại bóng) và bóng đèn, kèm bài thực hành đo.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
