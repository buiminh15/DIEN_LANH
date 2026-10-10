/* MÁY GIẶT — BÀI 1: PHÂN LOẠI VÀ CẤU TẠO (biên soạn từ docs/may_giat/Bai_1.md) */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const CAT = 'may-giat';

  const DOORS = {
    front: ['Cửa trước – lồng ngang', ['Cửa nạp đồ ở <b>phía trước</b>, lồng quay <b>trục nằm ngang</b>'], ['Giặt rất sạch, đồ ít bị nhàu, tiết kiệm nước'], ['Thời gian giặt lâu (tối thiểu ~45 phút, có thể tới 3 giờ)', 'Tốn điện (sợi đốt đun nước nóng 1700 – 2500 W)', 'Đắt tiền, hư hỏng khó sửa']],
    top: ['Cửa trên – lồng đứng', ['Cửa nạp đồ <b>phía trên</b>, lồng quay <b>trục thẳng đứng</b> (kiểu chụp đứng)'], ['Cấu tạo đơn giản, giá rẻ', 'Giặt nhanh (~30 phút – 1 giờ)', 'Tiêu thụ điện ít, vắt rất khô'], ['Quần áo dễ <b>quấn chặt, nhàu</b>', 'Tốn nước, ít chức năng (ít nước nóng, gần như không sấy)']],
    tilt: ['Cửa trên – lồng nghiêng', ['Cửa nạp phía trên nhưng <b>lồng nghiêng</b> (thương hiệu Sanyo/Aqua)'], ['Giặt sạch hơn máy cửa trên đứng', 'Lấy đồ không phải cúi'], ['Độ rung, ồn cao hơn']]
  };
  const CTRL = {
    mech: ['Điều khiển cơ (đồng hồ chương trình)', 'Cấu tạo bằng chi tiết cơ khí: động cơ nhỏ + bánh răng + bánh cam đóng ngắt tiếp điểm. Thao tác bằng <b>núm xoay</b>, phím ấn.', ['Bền, đơn giản, dễ sửa (hay hỏng tiếp điểm, bánh răng kẹt dầu mỡ/côn trùng)'], ['Ít chức năng, kém hiện đại (càng nhiều chương trình, cam càng phức tạp)']],
    elec: ['Điều khiển điện tử', 'Bo mạch điện tử + màn hình hiển thị; chọn chế độ bằng phím cảm ứng/ấn. Bo được phủ <b>keo chống ẩm</b> vì máy làm việc nơi ẩm ướt.', ['Rất nhiều chức năng, hiện đại'], ['Cấu tạo phức tạp, khó sửa; độ ẩm môi trường cao có thể làm tín hiệu sai, báo lỗi']],
    semi: ['Điều khiển bán điện tử', 'Kết hợp <b>cơ</b> và <b>bo điện tử</b> nhỏ bổ trợ thêm chức năng.', ['Cân bằng giữa độ bền và tính năng'], ['Vẫn cần phân tích cả phần cơ lẫn phần điện tử']]
  };
  const TECH = [
    ['Giặt bong bóng', 'Trộn nước + không khí + bột giặt tạo bọt khí li ti, thấm vào vải nhanh hơn, đánh tan bột giặt đều.'], ['Giặt hơi nước', 'Nồi hơi tạo hơi nước phun vào lồng, đi sâu vào sợi vải khử mùi, vi khuẩn; tiết kiệm thời gian và điện.'], ['Sóng chuyển động (LG)', 'Mô phỏng 6 kiểu giặt tay: nhào, trộn, chà, quay, đập, lắc. Đồ bền màu, mềm mại.'], ['Truyền động trực tiếp', 'Động cơ liền khối với lồng, không dây curoa: giặt sạch hơn, ít ồn, tiết kiệm điện tới ~40%.'], ['Giặt khí nóng (Samsung)', 'Luồng khí nóng thổi vào lồng giặt diệt vi khuẩn, nấm mốc, khử mồ hôi nhanh.'], ['Vắt thông minh', 'Chọn tốc độ vắt theo chất liệu để tránh nhàu, bung rách; vắt khô giúp phơi nhanh.'], ['Chống tràn', 'Van/ bong bóng khí đặt dưới thùng ngăn nước tràn ra ngoài, tiết kiệm nước, tránh đọng mùi.'], ['Cảm biến 3D', 'Tự điều chỉnh mức nước, tốc độ động cơ; kiểm soát chuyển động giảm rung lắc, mất cân bằng.'], ['Sóng siêu âm', 'Tạo hàng triệu bọt khí li ti len vào sợi vải đánh tan chất bẩn.']
  ];
  const PARTS = {
    board: ['Bo mạch điều khiển', 'Nằm phía trên, kín nước. Nhận tín hiệu từ cảm biến/ công tắc, xuất lệnh cho van, bơm, động cơ.'],
    sw: ['Công tắc an toàn', 'Chỉ cho máy chạy khi <b>cửa đã đóng</b>; còn có cần chống rung ngắt khi lồng lắc mạnh.'],
    press: ['Phao áp lực (cảm biến mực nước)', 'Đo mức nước trong thùng, báo cho bo mạch ngắt van cấp nước, và báo khi đã xả hết nước (cho phép vắt).'],
    inlet: ['Van cấp nước', 'Điện từ, mở cho nước sạch vào thùng (xem Bài 2).'],
    filter: ['Bộ lọc xơ vải', 'Giữ xơ vải, sợi bông. Phải vệ sinh định kỳ, nếu không xơ sẽ bám lại vào đồ giặt.'],
    pulsator: ['Mâm giặt', 'Quay tạo dòng nước xoáy, va đập, nhào trộn làm sạch đồ.'],
    drum: ['Lồng giặt (lồng vắt, inox)', 'Chứa đồ giặt; có lỗ thoát nước. Quay tốc độ cao khi vắt.'],
    tub: ['Thùng chứa (thùng ngoài)', 'Bằng nhựa, chứa nước. Cần kiểm tra đồ giặt không có vật kim loại (kẹp, chìa khóa) làm rách thùng.'],
    balance: ['Vành nước muối (đối trọng)', 'Vành nhựa trên miệng lồng chứa nước muối giúp cân bằng khi vắt; quần áo kẹt vào gây rung lắc mạnh.'],
    spring: ['4 lò xo treo', 'Treo cả bộ lồng – thùng – động cơ trên khung vỏ. Một lò xo hỏng thì lồng lệch, rung mạnh; hỏng một nên thay cả bốn.'],
    over: ['Ống chống tràn', 'Khi van cấp hỏng làm nước quá mức, nước theo ống này thoát xuống cửa xả thay vì tràn ra nhà.'],
    motor: ['Động cơ', 'Biến điện thành cơ năng, truyền qua dây curoa sang bộ ly hợp.'],
    clutch: ['Bộ ly hợp (bộ số)', 'Truyền chuyển động sang mâm / lồng: giặt chỉ mâm quay; vắt mâm và lồng quay cùng nhau.'],
    drain: ['Van xả', 'Xả nước bẩn; đồng thời kéo cần ly hợp để vắt (xem Bài 3).']
  };

  function cutawaySVG(sel) {
    const g = (k, inner) => `<g data-k="${k}" style="cursor:pointer" tabindex="0">${inner}</g>`;
    const st = k => sel === k ? ' stroke="var(--cold)" stroke-width="4"' : '';
    return `<svg viewBox="0 0 420 340" role="img" aria-label="Mặt cắt máy giặt cửa trên">
      <rect x="60" y="20" width="240" height="290" rx="14" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      ${g('board', `<rect x="72" y="26" width="216" height="24" rx="5" fill="var(--brass)"${st('board')}/><text class="fl" x="180" y="43" text-anchor="middle" style="fill:var(--ink)">bo mạch điều khiển</text>`)}
      ${g('sw', `<rect x="282" y="62" width="14" height="22" rx="3" fill="var(--hot)"${st('sw')}/>`)}
      ${g('press', `<circle cx="80" cy="82" r="11" fill="var(--cold-l)"${st('press')}/>`)}
      ${g('inlet', `<rect x="72" y="58" width="22" height="12" rx="3" fill="var(--cold)"${st('inlet')}/>`)}
      ${g('tub', `<rect x="82" y="96" width="196" height="150" rx="14" fill="var(--cold-tint2)" stroke="var(--cold)" stroke-width="3"${sel === 'tub' ? ' style="stroke:var(--hot)"' : ''}/>`)}
      ${g('balance', `<rect x="90" y="100" width="180" height="10" rx="4" fill="var(--warm)"${st('balance')}/>`)}
      ${g('drum', `<rect x="102" y="114" width="156" height="110" rx="8" fill="var(--surface)" stroke="var(--ink)" stroke-dasharray="4 3" stroke-width="2.5"${st('drum')}/>`)}
      ${g('filter', `<path d="M240 130q10 16 0 30q-10-14 0-30z" fill="var(--ok)"${st('filter')}/>`)}
      ${g('pulsator', `<ellipse cx="180" cy="214" rx="46" ry="8" fill="var(--cold)"${st('pulsator')}/><path d="M154 214l-8 8M206 214l8 8" stroke="var(--cold)" stroke-width="3"/>`)}
      ${g('over', `<path d="M268 120v110h18" fill="none" stroke="var(--muted)" stroke-width="5"${st('over')}/>`)}
      ${g('spring', [76, 112, 248, 284].map(x => `<path d="M${x} 252l-6 8 12 8-12 8 12 8-6 8" fill="none" stroke="var(--muted)" stroke-width="3"/>`).join('') + `<rect x="70" y="250" width="220" height="60" fill="transparent"${st('spring')}/>`)}
      ${g('clutch', `<rect x="150" y="248" width="60" height="22" rx="5" fill="var(--hot)"${st('clutch')}/>`)}
      ${g('motor', `<rect x="108" y="278" width="52" height="22" rx="6" fill="var(--ink)"${st('motor')}/><text class="fl" x="134" y="293" text-anchor="middle" style="fill:var(--bg)">M</text>`)}
      ${g('drain', `<rect x="216" y="278" width="40" height="22" rx="5" fill="var(--warm)"${st('drain')}/>`)}
      <text class="fl" x="180" y="334" text-anchor="middle">bấm vào từng bộ phận</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-use" data-toc="1 · Công dụng">
  <div class="sec-n">Phần 1</div><h2>Máy giặt dùng để làm gì?</h2>
  <p>Máy giặt <b>giải phóng sức lao động</b> cho con người, làm đúng những việc ta vẫn làm khi giặt tay: <b>làm sạch</b> đồ giặt, <b>làm khô</b> (vắt, sấy) và ở một số máy còn <b>chống nhăn</b> (ủi hơi). Máy dân dụng giặt quần áo hằng ngày; máy công nghiệp (khách sạn) làm cả dây chuyền giặt – sấy – ủi.</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Chương này gồm</h4><ol style="margin:6px 0 0;padding-left:20px"><li>Phân loại và cấu tạo (bài này)</li><li>Thiết bị điện, phụ tải điện</li><li>Phần cơ</li><li>Cách sử dụng</li><li>Phân tích mạch điện</li><li>Khắc phục hư hỏng</li></ol></div>
    <div class="panel warm" style="margin:0"><h4>Vì sao phải biết phân loại?</h4><p style="margin:6px 0 0">Để <b>tư vấn</b> và <b>chọn mua</b> đúng nhu cầu, và để biết mỗi dòng máy hay hỏng ở đâu, sửa thế nào.</p></div></div>
</section>

<section class="sec" id="s-class" data-toc="2 · Phân loại">
  <div class="sec-n">Phần 2</div><h2>Phân loại máy giặt</h2>
  <p>Có 4 cách phân loại: theo <b>vị trí cánh cửa</b>, theo <b>bộ phận điều khiển</b>, theo <b>trọng lượng đồ giặt</b> và theo <b>công dụng / công nghệ</b>.</p>
  <h3>① Theo vị trí cánh cửa</h3>
  <div id="dTabs"></div><article class="panel" id="dPanel" aria-live="polite"></article>
  <h3 style="margin-top:26px">② Theo bộ phận điều khiển</h3>
  <div id="cTabs"></div><article class="panel warm" id="cPanel" aria-live="polite"></article>
  <h3 style="margin-top:26px">③ Theo trọng lượng đồ giặt</h3>
  <p>Số kg ghi trên máy (5 – 5,5 – 6 – 7 – 7,5 – 8 kg…) là khối lượng đồ giặt <b>khô tối đa</b> (loại cotton). Quần áo ngấm nước nặng hơn (len, bông...) thì giá trị này <b>giảm đi một nửa</b> (VD 6 kg → tối đa 3 kg). Đồ giặt chỉ nên chiếm tối đa <b>2/3 thể tích lồng</b>: nhét đầy thành “quả cầu” thì không còn nhào trộn, đập, chà → giặt không sạch.</p>
  <div class="panel" style="border-left-color:var(--cold)"><div class="row"><label>Máy <select id="kgM" class="btn sm" style="min-height:36px"><option value="6">6 kg</option><option value="7.5" selected>7,5 kg</option><option value="9">9 kg</option></select></label><label>Loại vải <select id="kgT" class="btn sm" style="min-height:36px"><option value="1">cotton thông thường</option><option value=".5">vải rất ngấm nước (len, bông, chăn)</option></select></label><label>Đưa vào <input id="kgIn" type="range" min="1" max="12" step=".5" value="5" style="width:150px"> <b id="kgV"></b></label></div>
    <div class="bar" style="height:16px;margin-top:10px"><i id="kgB" style="width:0"></i></div><div class="verdict" id="kgR" style="margin-top:10px"></div></div>
  <h3 style="margin-top:26px">④ Theo công dụng / công nghệ</h3>
  <p>Mỗi hãng gắn công nghệ riêng để tăng hiệu quả giặt. Bấm để xem:</p>
  <div class="tabs" id="techBox">${TECH.map((t, i) => `<button class="tab" type="button" data-i="${i}" aria-pressed="false"><b>${i + 1}</b><span>${t[0]}</span></button>`).join('')}</div>
  <article class="panel" id="techP" style="border-left-color:var(--ok)"><p style="margin:0" class="muted">Chọn một công nghệ ở trên.</p></article>
</section>

<section class="sec" id="s-build" data-toc="3 · Cấu tạo">
  <div class="sec-n">Phần 3</div><h2>Cấu tạo máy giặt</h2>
  <p>Giống tủ lạnh, máy giặt gồm <b>3 phần</b>: <b>vỏ</b> (bằng sắt hoặc nhựa; nâng đỡ và bảo vệ bộ phận bên trong), <b>phần điện</b> (thiết bị điện + phụ tải điện), <b>phần cơ</b> (nhận chuyển động từ động cơ để quay mâm/lồng).</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Thiết bị điện (điều khiển)</h4><p style="margin:6px 0 0">Bo mạch điều khiển, cảm biến mực nước (phao áp lực), công tắc an toàn, khống chế nhiệt độ.</p></div>
    <div class="panel warm" style="margin:0"><h4>Phụ tải điện</h4><p style="margin:6px 0 0">Van cấp nước, van/ bơm xả, động cơ, sợi đốt (điện trở nung).</p></div></div>
  <div class="callout"><span class="ic">⚙️</span><div><b class="t">Vỏ sắt hay vỏ nhựa?</b><p>Vỏ sắt cứng nhưng dễ <b>gỉ</b> nếu để nơi ẩm. Vỏ nhựa không gỉ nhưng không chịu được <b>nhiệt độ cao</b>, dễ biến dạng/ rạn dưới nắng gắt.</p></div></div>
  <h3 style="margin-top:22px">🔬 Mặt cắt máy giặt cửa trên – bấm từng bộ phận</h3>
  <div class="grid2" style="align-items:start"><div class="stage" style="margin:0" id="cSvg"></div><article class="panel" id="cInfo" aria-live="polite"></article></div>
  <div class="callout danger"><span class="ic">🔩</span><div><b class="t">Trước khi giặt</b><p>Kiểm tra túi quần áo: <b>kẹp tóc, chìa khóa, đồ kim loại</b> có thể rơi lọt qua lỗ lồng vào thùng chứa và <b>rách thủng</b> thùng hoặc kẹt trong lúc vắt.</p></div></div>
</section>

<section class="sec" id="s-work" data-toc="4 · Nguyên lý giặt">
  <div class="sec-n">Phần 4</div><h2>Nguyên lý: máy giặt “bắt chước” giặt tay</h2>
  <p>Giặt tay: xử lý vết bẩn → ngâm nước + bột giặt, vò, nhào, chà, đập → vắt nước bẩn → xả nước sạch lần 1 → vắt → xả lần 2 → vắt → xả lần 3 (kèm nước xả mềm vải) → vắt khô. Máy giặt làm đúng quy trình đó bằng <b>3 – 4 lần lấy nước</b> và <b>3 – 4 lần xả</b>.</p>
  <div class="stage"><div id="stepSvg" style="padding:10px 14px"></div><div class="controls"><button class="btn pri sm" id="stGo">▶ Chạy chu trình</button><button class="btn sm" id="stRs">↺</button></div><div class="verdict" id="stV" style="margin:0 14px 12px">Bấm “Chạy chu trình”.</div></div>
  <p>Hiệu quả làm sạch đến từ <b>tạo chuyển động mạnh</b> để phá liên kết giữa chất bẩn và vải, kết hợp nước, bột giặt, nước nóng, sóng siêu âm, hơi nước. Máy giặt cửa trước và cửa trên chỉ khác ở cách tạo chuyển động.</p>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Máy giặt: làm sạch, làm khô (vắt, sấy), chống nhăn.</b></div></li>
    <li class="done"><div><b>Cửa trước: sạch, ít nhàu nhưng lâu, tốn điện, đắt. Cửa trên: nhanh, rẻ nhưng dễ nhàu, tốn nước.</b></div></li>
    <li class="done"><div><b>Điều khiển cơ bền – ít chức năng; điện tử nhiều chức năng – khó sửa, ẩm gây báo lỗi.</b></div></li>
    <li class="done"><div><b>Số kg trên máy là đồ khô tối đa; đồ ngấm nước giảm một nửa; chỉ đầy 2/3 lồng.</b></div></li>
    <li class="done"><div><b>Cấu tạo: vỏ + phần điện (thiết bị, phụ tải) + phần cơ.</b></div></li>
    <li class="done"><div><b>Máy giặt = 3–4 lần cấp nước, giặt, xả và vắt, mô phỏng giặt tay.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/1/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function stepsSVG(i) {
    const S = ['Xử lý vết bẩn', 'Cấp nước lần 1 + bột giặt', 'GIẶT: nhào, đập, chà', 'Xả nước bẩn + vắt', 'Cấp nước 2 → xả 1', 'Vắt', 'Cấp nước 3 + nước xả mềm', 'Xả lần cuối + VẮT KHÔ'];
    return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${S.map((s, k) => `<div style="padding:10px;border-radius:10px;border:2px solid ${k === i ? 'var(--cold)' : 'var(--line)'};background:${k < i ? 'var(--ok-tint)' : k === i ? 'var(--cold-tint)' : 'var(--surface2)'};text-align:center;font-size:13.5px"><b style="display:block;font-size:20px;font-family:var(--head)">${k + 1}</b>${s}</div>`).join('')}</div>`;
  }

  function mount(root) {
    U.tabset($('#dTabs', root), Object.entries(DOORS).map(([id, d], i) => ({ id, n: i + 1, name: d[0] })), id => { const d = DOORS[id]; $('#dPanel', root).innerHTML = `<h3>${d[0]}</h3><p>${d[1].join(' ')}</p><p><b>Ưu:</b> ${d[2].map(x => `<span class="pill ok">${x}</span>`).join('')}</p><p style="margin:0"><b>Nhược:</b> ${d[3].map(x => `<span class="pill bad">${x}</span>`).join('')}</p>`; });
    U.tabset($('#cTabs', root), Object.entries(CTRL).map(([id, d], i) => ({ id, n: i + 1, name: d[0].split(' (')[0] })), id => { const d = CTRL[id]; $('#cPanel', root).innerHTML = `<h3>${d[0]}</h3><p>${d[1]}</p><p><b>Ưu:</b> ${d[2].map(x => `<span class="pill ok">${x}</span>`).join('')}</p><p style="margin:0"><b>Nhược:</b> ${d[3].map(x => `<span class="pill bad">${x}</span>`).join('')}</p>`; });
    // trọng lượng
    const m = $('#kgM', root), t = $('#kgT', root), inp = $('#kgIn', root);
    const kg = () => { const cap = +m.value * +t.value, v = +inp.value, ratio = v / (+m.value); $('#kgV', root).textContent = v + ' kg'; const eff = v <= cap ? (v > cap * .67 ? 'warm' : 'ok') : 'bad'; $('#kgB', root).style.width = Math.min(100, v / cap * 100) + '%'; $('#kgB', root).style.background = eff === 'bad' ? 'var(--bad)' : eff === 'warm' ? 'var(--warm)' : 'var(--ok)'; const r = $('#kgR', root); r.className = 'verdict ' + (v > cap ? 'bad' : 'ok'); r.innerHTML = `Tối đa với loại vải này: <b>${cap} kg</b>. ` + (v > cap ? '✗ <b>Quá tải</b>: đồ vón thành quả cầu, không nhào trộn được, giặt không sạch, máy rung lắc, hao mòn.' : v > cap * .8 ? '⚠️ Gần đầy: đừng nhét quá 2/3 thể tích lồng.' : '✓ Hợp lý, đồ có chỗ chuyển động để giặt sạch.'); };
    [m, t, inp].forEach(e => e.oninput = kg); kg();
    // công nghệ
    $('#techBox', root).onclick = e => { const b = e.target.closest('.tab'); if (!b) return; $$('#techBox .tab', root).forEach(x => x.setAttribute('aria-pressed', x === b)); const c = TECH[+b.dataset.i]; $('#techP', root).innerHTML = `<h3>${c[0]}</h3><p style="margin:0">${c[1]}</p>`; };
    // mặt cắt
    let sel = 'press';
    const cd = () => {
      $('#cSvg', root).innerHTML = cutawaySVG(sel); $('#cInfo', root).innerHTML = `<h3>${PARTS[sel][0]}</h3><p style="margin:0">${PARTS[sel][1]}</p>`;
      $$('#cSvg [data-k]', root).forEach(g => { const f = () => { sel = g.dataset.k; cd(); }; g.onclick = f; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } }; });
    }; cd();
    // chu trình
    let i = -1, tm;
    const sv = $('#stepSvg', root), sd = () => sv.innerHTML = stepsSVG(i), msg = ['Quần áo bẩn được xử lý trước bằng nước giặt.', 'Cấp nước sạch trộn bột giặt (lần lấy nước 1).', 'Mâm quay tạo nước xoáy, nhào đập quần áo.', 'Bơm/van xả nước bẩn, máy vắt.', 'Cấp nước sạch lần 2, xả bột giặt còn sót.', 'Vắt tiếp.', 'Cấp nước lần 3 và nước xả mềm vải.', 'Xả hết, vắt khô: kết thúc chu trình.'];
    $('#stGo', root).onclick = () => { clearInterval(tm); i = 0; sd(); $('#stV', root).textContent = msg[0]; tm = setInterval(() => { if (!document.body.contains(sv)) { clearInterval(tm); return; } i++; if (i > 7) { clearInterval(tm); $('#stV', root).className = 'verdict ok'; $('#stV', root).textContent = '✓ Hoàn thành: 3 lần lấy nước, 4 lần xả (giống giặt tay 3 nước).'; return; } sd(); $('#stV', root).className = 'verdict'; $('#stV', root).textContent = msg[i]; }, 1100); };
    $('#stRs', root).onclick = () => { clearInterval(tm); i = -1; sd(); $('#stV', root).className = 'verdict'; $('#stV', root).textContent = 'Bấm “Chạy chu trình”.'; }; sd();
  }

  const flashcards = [
    { f: 'Công dụng của máy giặt?', b: '<b>Làm sạch, làm khô</b> (vắt, sấy) đồ giặt, một số máy còn chống nhăn.', tag: 'Công dụng' },
    { f: 'Có mấy cách phân loại máy giặt?', b: '4: theo <b>vị trí cánh cửa</b>, <b>bộ phận điều khiển</b>, <b>trọng lượng đồ giặt</b>, <b>công dụng/công nghệ</b>.', tag: 'Phân loại' },
    { f: 'Máy cửa trước lồng ngang: ưu điểm?', b: 'Giặt <b>rất sạch</b>, đồ ít nhàu, tiết kiệm nước.', tag: 'Cửa trước' },
    { f: 'Máy cửa trước: nhược điểm?', b: 'Giặt <b>lâu</b>, tốn điện (sợi đốt 1700–2500 W), đắt, khó sửa.', tag: 'Cửa trước' },
    { f: 'Máy cửa trên lồng đứng: ưu điểm?', b: 'Cấu tạo đơn giản, rẻ, giặt <b>nhanh</b>, ít điện, vắt rất khô.', tag: 'Cửa trên' },
    { f: 'Máy cửa trên: nhược điểm?', b: 'Quần áo <b>quấn, nhàu</b>, tốn nước, ít chức năng.', tag: 'Cửa trên' },
    { f: 'Máy cửa trên lồng nghiêng?', b: 'Giặt sạch hơn cửa trên đứng, tiện lấy đồ; nhược: rung ồn hơn.', tag: 'Cửa trên' },
    { f: 'Điều khiển cơ gồm gì?', b: 'Đồng hồ chương trình: <b>động cơ nhỏ + bánh răng + bánh cam</b> đóng ngắt tiếp điểm.', tag: 'Điều khiển' },
    { f: 'Ưu – nhược điểm điều khiển cơ?', b: 'Bền, đơn giản, dễ sửa; nhưng ít chức năng, kém hiện đại.', tag: 'Điều khiển' },
    { f: 'Ưu – nhược điểm điều khiển điện tử?', b: 'Nhiều chức năng, hiện đại; phức tạp, khó sửa, sợ ẩm.', tag: 'Điều khiển' },
    { f: 'Vì sao bo mạch máy giặt phủ keo?', b: 'Chống <b>ẩm</b>, tránh rò điện, chập cháy.', tag: 'Điều khiển' },
    { f: 'Điều khiển bán điện tử là gì?', b: 'Kết hợp cơ với một bo điện tử nhỏ bổ trợ.', tag: 'Điều khiển' },
    { f: 'Số kg ghi trên máy nghĩa là?', b: 'Khối lượng đồ giặt <b>khô tối đa</b> (loại cotton).', tag: 'Trọng lượng' },
    { f: 'Giặt đồ ngấm nước như len, bông thì tối đa?', b: 'Giảm đi <b>một nửa</b> (6 kg → 3 kg).', tag: 'Trọng lượng' },
    { f: 'Đồ giặt nên chiếm tối đa bao nhiêu lồng?', b: '<b>2/3</b> thể tích lồng.', tag: 'Trọng lượng' },
    { f: 'Nhồi đầy lồng thì sao?', b: 'Đồ vón như quả cầu, không nhào trộn, giặt không sạch.', tag: 'Trọng lượng' },
    { f: 'Công nghệ giặt bong bóng?', b: 'Trộn nước + khí + bột giặt tạo bọt li ti, thấm nhanh.', tag: 'Công nghệ' },
    { f: 'Công nghệ giặt hơi nước?', b: 'Phun hơi nước khử mùi, diệt khuẩn, tiết kiệm.', tag: 'Công nghệ' },
    { f: 'Truyền động trực tiếp?', b: 'Động cơ liền lồng, không dây curoa: êm, tiết kiệm ~40%.', tag: 'Công nghệ' },
    { f: 'Công nghệ chống tràn?', b: 'Van/ bong bóng khí ngăn nước tràn, tránh nước đọng mùi.', tag: 'Công nghệ' },
    { f: 'Cảm biến 3D?', b: 'Tự chỉnh mực nước, tốc độ motor; giảm rung lắc mất cân bằng.', tag: 'Công nghệ' },
    { f: 'Máy giặt gồm mấy phần?', b: '3: <b>vỏ</b>, <b>phần điện</b>, <b>phần cơ</b>.', tag: 'Cấu tạo' },
    { f: 'Thiết bị điện của máy giặt?', b: 'Bo mạch, cảm biến mức nước, công tắc an toàn, khống chế nhiệt độ.', tag: 'Cấu tạo' },
    { f: 'Phụ tải điện của máy giặt?', b: 'Van cấp nước, van/ bơm xả, động cơ, sợi đốt.', tag: 'Cấu tạo' },
    { f: 'Vỏ sắt: nhược điểm? Vỏ nhựa?', b: 'Sắt: dễ gỉ. Nhựa: không chịu nhiệt cao, dễ rạn dưới nắng.', tag: 'Cấu tạo' },
    { f: 'Vành nước muối làm gì?', b: 'Đối trọng cân bằng khi vắt; kẹt quần áo gây rung lắc.', tag: 'Cấu tạo' },
    { f: 'Máy có mấy lò xo treo? Hỏng thì?', b: '<b>4</b> lò xo; một cái hỏng nên thay cả 4.', tag: 'Cấu tạo' },
    { f: 'Ống chống tràn để làm gì?', b: 'Dẫn nước thừa xuống cửa xả khi cấp nước quá mức.', tag: 'Cấu tạo' },
    { f: 'Bộ lọc xơ vải để làm gì?', b: 'Giữ xơ vải; không vệ sinh thì xơ bám lại vào đồ giặt.', tag: 'Cấu tạo' },
    { f: 'Máy giặt cần mấy lần lấy nước tối thiểu?', b: '<b>3</b> (4 nếu có xử lý trước); xả 3–4 lần.', tag: 'Nguyên lý' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Công dụng của máy giặt?', ['Làm sạch, làm khô đồ giặt', 'Chỉ làm sạch', 'Chỉ sấy', 'Chỉ ủi'], 0, 'Giải phóng sức lao động.'),
    Q('Máy cửa trước lồng ngang có ưu điểm?', ['Giặt sạch, ít nhàu', 'Rẻ nhất', 'Giặt nhanh nhất', 'Không tốn điện'], 0, 'Nhược: lâu, tốn điện.'),
    Q('Nhược điểm máy cửa trước?', ['Giặt lâu, tốn điện, đắt', 'Nhàu nát', 'Tốn nước nhiều', 'Ít vắt'], 0, 'Sợi đốt công suất lớn.'),
    Q('Công suất sợi đốt máy cửa trước khoảng?', ['1700 – 2500 W', '50 W', '10 W', '100 000 W'], 0, 'Như bình nóng lạnh.'),
    Q('Ưu điểm máy cửa trên lồng đứng?', ['Rẻ, đơn giản, giặt nhanh', 'Giặt sạch nhất', 'Không nhàu', 'Sấy khô tốt'], 0, 'Giặt ~30 phút – 1 giờ.'),
    Q('Nhược điểm máy cửa trên?', ['Quần áo quấn chặt nhàu, tốn nước', 'Rất lâu', 'Rất đắt', 'Tốn điện'], 0, 'Ít chức năng.'),
    Q('Điều khiển cơ gồm?', ['Động cơ nhỏ, bánh răng, bánh cam', 'Vi xử lý', 'Cảm biến 3D', 'Wi-Fi'], 0, 'Đồng hồ chương trình.'),
    Q('Điều khiển điện tử có nhược điểm?', ['Phức tạp, khó sửa, sợ ẩm', 'Ít chức năng', 'Hay kẹt bánh răng', 'Không báo lỗi'], 0, 'Phủ keo chống ẩm.'),
    Q('Vì sao bo mạch phủ keo?', ['Chống ẩm, rò điện', 'Đẹp', 'Tỏa nhiệt', 'Tăng điện áp'], 0, 'Môi trường ẩm ướt.'),
    Q('Số kg trên máy là?', ['Đồ khô tối đa', 'Khối lượng máy', 'Lượng nước', 'Lượng bột giặt'], 0, 'Cotton khô.'),
    Q('Máy 6 kg giặt đồ ngấm nước (len, bông) tối đa?', ['Khoảng 3 kg', '12 kg', '6 kg', '1 kg'], 0, 'Giảm một nửa.'),
    Q('Đồ giặt tối đa chiếm lồng?', ['2/3', 'Đầy 100%', '1/10', '1/2'], 0, 'Để còn nhào trộn.'),
    Q('Nhồi đầy lồng gây?', ['Giặt không sạch', 'Sạch hơn', 'Tiết kiệm nước', 'Không ảnh hưởng'], 0, 'Đồ vón cục.'),
    Q('Công nghệ truyền động trực tiếp?', ['Động cơ liền lồng, không curoa', 'Có 2 động cơ', 'Dùng hơi nước', 'Dùng sóng siêu âm'], 0, 'Êm, tiết kiệm điện.'),
    Q('Công nghệ nào dùng nồi hơi?', ['Giặt hơi nước', 'Bong bóng', 'Sóng chuyển động', 'Khí nóng'], 0, 'Phun hơi nước.'),
    Q('Sóng chuyển động mô phỏng?', ['6 kiểu giặt tay', 'Giặt sấy', 'Rửa chén', 'Ủi'], 0, 'Nhào, trộn, chà, quay, đập, lắc.'),
    Q('Máy giặt gồm mấy phần chính?', ['3', '2', '4', '5'], 0, 'Vỏ, điện, cơ.'),
    Q('Thiết bị nào KHÔNG phải phụ tải điện?', ['Phao áp lực', 'Van cấp nước', 'Động cơ', 'Sợi đốt'], 0, 'Phao áp lực là thiết bị (cảm biến).'),
    Q('Ống chống tràn nối với?', ['Cửa thoát/ xả', 'Cửa cấp nước', 'Động cơ', 'Bo mạch'], 0, 'Nước thừa chảy xuống.'),
    Q('Một lò xo treo hỏng nên?', ['Thay cả 4', 'Thay 1', 'Bỏ lò xo', 'Kê gạch'], 0, 'Để cân bằng.'),
    Q('Vành nước muối có vai trò?', ['Cân bằng khi vắt', 'Chứa bột giặt', 'Tăng nhiệt', 'Lọc nước'], 0, 'Đối trọng.'),
    Q('Trước khi giặt cần kiểm tra?', ['Đồ kim loại trong túi', 'Màu quần áo', 'Hãng bột giặt', 'Nhiệt độ phòng'], 0, 'Tránh rách thùng.'),
    Q('Lấy nước tối thiểu bao nhiêu lần?', ['3 lần', '1 lần', '10 lần', '0'], 0, 'Giặt + xả.'),
    Q('Bộ lọc xơ vải cần?', ['Vệ sinh định kỳ', 'Không cần chăm sóc', 'Thay hàng ngày', 'Tháo bỏ'], 0, 'Tránh xơ bám lại.')
  ];
  const sort = {
    title: 'Đặc điểm thuộc loại máy nào?',
    buckets: [{ id: 'front', name: 'Cửa TRƯỚC lồng ngang' }, { id: 'top', name: 'Cửa TRÊN lồng đứng' }, { id: 'ctrl', name: 'Kiểu điều khiển' }],
    items: [
      { t: 'Giặt rất sạch, ít nhàu', b: 'front' }, { t: 'Thời gian giặt lâu, tốn điện', b: 'front' }, { t: 'Sợi đốt 1700–2500 W', b: 'front' }, { t: 'Đắt, hư hỏng khó sửa', b: 'front' },
      { t: 'Cấu tạo đơn giản, giặt nhanh', b: 'top' }, { t: 'Quần áo quấn chặt, dễ nhàu', b: 'top' }, { t: 'Tốn nước, ít chức năng', b: 'top' }, { t: 'Vắt rất khô', b: 'top' },
      { t: 'Đồng hồ chương trình: bánh cam', b: 'ctrl' }, { t: 'Bo mạch phủ keo chống ẩm', b: 'ctrl' }, { t: 'Bán điện tử: cơ + bo bổ trợ', b: 'ctrl' }, { t: 'Nhiều chức năng nhưng khó sửa', b: 'ctrl' }
    ]
  };
  const order = [
    { title: 'Chu trình giặt', intro: 'Sắp xếp các giai đoạn của một chu trình.', steps: ['Cấp nước lần 1 và bột giặt', 'Giặt: mâm quay nhào, đập, chà', 'Xả nước bẩn và vắt', 'Cấp nước lần 2, xả bột giặt', 'Cấp nước lần 3 cùng nước xả mềm vải', 'Xả và vắt khô, kết thúc'] },
    { title: 'Chọn khối lượng đồ giặt', intro: 'Sắp xếp các bước đặt đồ vào máy.', steps: ['Đọc số kg ghi trên máy', 'Xác định loại vải (cotton hay ngấm nước)', 'Giảm một nửa nếu vải ngấm nước', 'Kiểm tra túi quần áo, lấy đồ kim loại', 'Xếp đồ chiếm tối đa 2/3 lồng', 'Chọn chế độ và mực nước phù hợp'] },
    { title: 'Nhận biết loại máy', intro: 'Sắp xếp quy trình tư vấn chọn máy.', steps: ['Xác định nhu cầu: số người, loại đồ', 'Cần giặt sạch kỹ, ít nhàu → cửa trước', 'Cần giặt nhanh, rẻ, đơn giản → cửa trên', 'Chọn điều khiển: cơ bền hay điện tử nhiều chức năng', 'Chọn công nghệ bổ sung phù hợp', 'Chọn khối lượng giặt tối đa phù hợp gia đình'] }
  ];
  DL.register({
    cat: CAT, id: 1, ready: true, title: 'Phân loại và cấu tạo máy giặt', sub: 'Cửa trước/cửa trên, điều khiển, công nghệ, cấu tạo', minutes: 30,
    lead: 'Bài mở đầu chương máy giặt: máy giặt dùng để làm gì, các cách phân loại (cửa trước/cửa trên, cơ/điện tử, khối lượng, công nghệ), cấu tạo từng bộ phận và nguyên lý “giặt tay” mà máy mô phỏng.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
