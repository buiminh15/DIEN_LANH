/* MÁY GIẶT — BÀI 9: CÁCH SỬ DỤNG MÁY GIẶT (biên soạn từ docs/may_giat/Bai_9.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const KEYS = {
    pow: ['Nguồn', 'Bật/tắt máy. Luôn là phím đầu tiên bấm.'],
    start: ['Khởi động / Tạm dừng', 'Bắt đầu chương trình đã chọn; bấm lại để tạm dừng.'],
    prog: ['Chọn chương trình', 'Giặt thường, nhanh, ngâm, nhẹ… Đèn chương trình nào sáng là đang chọn chương trình đó.'],
    fn: ['Chọn chức năng', 'Giặt – xả – vắt, xả tràn…'],
    spin: ['Vắt cực khô', 'Tốc độ quay cao nhất, thời gian dài (30 hoặc 90 phút). <b>Không phải sấy</b>, chỉ vắt khô hơn để phơi nhanh.'],
    water: ['Mực nước', 'Cực thấp – thấp – trung bình – cao: chọn theo lượng đồ.'],
    lock: ['Khóa trẻ em', 'Giữ phím khoảng 3 – 5 giây để bật/ tắt. Khóa bảng điều khiển, tránh trẻ bấm nhầm.'],
    delay: ['Hẹn giờ', 'Trì hoãn 6 hoặc 9 giờ rồi mới chạy: giặt ban đêm khi điện khỏe, hoặc đúng giờ nước thành phố có áp.'],
    clean: ['Vệ sinh lồng giặt', 'Chạy không đồ (không bột giặt/ có chất tẩy) mỗi khoảng <b>một tháng</b> để tránh mùi hôi, cặn bẩn.']
  };
  const SCEN = {
    wrinkle: ['Đồ hay nhàu', 'Tăng xả tràn (xả nhiều), hoặc bỏ vắt: chỉ xả nước, không vắt, phơi ngay.', ['rinse', 'nospin']],
    handwash: ['Đã giặt tay, chỉ cần vắt', 'Bật nguồn → chọn chức năng chỉ có “vắt” → khởi động.', ['spinonly']],
    soapy: ['Còn nhiều xà phòng sau giặt', 'Bỏ giặt, chọn xả tràn + vắt để xả sạch lại.', ['rinse', 'spinonly']],
    rain: ['Trời mưa phùn, phơi lâu', 'Bật vắt cực khô (30 hoặc 90 phút) – không phải sấy.', ['xdry']],
    night: ['Điện yếu ban ngày', 'Dùng hẹn giờ 6 hoặc 9 giờ để giặt khuya.', ['delay']],
    smell: ['Lồng giặt bẩn, đồ có mùi', 'Vệ sinh lồng (chạy rỗng) mỗi tháng.', ['clean']]
  };
  const EN = [['Wash', 'Giặt'], ['Rinse', 'Xả'], ['Spin', 'Vắt'], ['Water level', 'Mực nước'], ['Soak', 'Ngâm'], ['Normal', 'Thông thường'], ['Program / Cycle', 'Chương trình'], ['Quick / Fast', 'Giặt nhanh'], ['Wool', 'Đồ len'], ['Synthetic', 'Vải tổng hợp'], ['Cotton', 'Vải bông'], ['Delicate', 'Vải mỏng, mềm'], ['Hand wash', 'Giặt tay'], ['Drain', 'Xả nước'], ['Door lock', 'Khóa cửa'], ['Power', 'Nguồn'], ['Start / Pause', 'Bắt đầu / Tạm dừng'], ['Heavy', 'Giặt mạnh'], ['Dry', 'Sấy']];

  function learn() {
    return `
<section class="sec" id="s-intro" data-toc="1 · Giới thiệu">
  <div class="sec-n">Phần 1</div><h2>Mỗi máy một kiểu bảng điều khiển</h2>
  <p>Thị trường có rất nhiều hãng nên bảng điều khiển khác nhau, ghi bằng <b>tiếng Việt</b> (máy liên doanh) hoặc <b>tiếng Anh</b> (máy nhập khẩu). Nhưng quy tắc chung gần giống nhau. Có hai cách chạy máy:</p>
  <div class="grid2"><div class="panel" style="margin:0;border-left-color:var(--ok)"><h4>① Chạy tự động</h4><p style="margin:6px 0 0">Bấm <b>Nguồn → Khởi động</b>. Máy dùng chương trình mặc định của nhà sản xuất: giặt – xả – vắt; <b>tự cân đồ</b> để chọn mực nước.</p></div>
    <div class="panel warm" style="margin:0"><h4>② Tự chọn</h4><p style="margin:6px 0 0"><b>Nguồn → Chương trình → Chức năng → Mực nước → Khởi động</b>. Đèn của mục nào sáng là mục đó đang chọn; khi chạy, đèn đang làm việc <b>nhấp nháy</b>.</p></div></div>
  <div class="callout"><span class="ic">⚖️</span><div><b class="t">Máy tự cân đồ thế nào? (cửa trên điện tử)</b><p>Mâm quay thử khi chưa có nước; đồ giặt làm kín khe hở của mâm → sinh ra <b>gió</b> đi vào ống dẫn áp, dịch chuyển lõi ferit của cảm biến mực nước → máy biết lượng đồ nhiều/ ít và chọn mực nước.</p></div></div>
</section>

<section class="sec" id="s-panel" data-toc="2 · Bảng điều khiển">
  <div class="sec-n">Phần 2</div><h2>🔬 Thử bảng điều khiển (máy cửa trên)</h2>
  <p>Các phím trên máy điển hình. Bấm từng phím để xem tác dụng:</p>
  <div class="stage" style="padding:14px"><div class="row" id="keys">${Object.entries(KEYS).map(([k, v]) => `<button type="button" class="btn sm" data-k="${k}" aria-pressed="false">${v[0]}</button>`).join('')}</div><article class="panel" id="kP" style="margin-top:12px;border-left-color:var(--cold)"><p style="margin:0" class="muted">Bấm một phím.</p></article></div>
  <h3 style="margin-top:22px">Mực nước và lượng bột giặt</h3>
  <div class="stage" style="padding:14px"><div class="row"><label>Mực nước <select id="wl" class="btn sm" style="min-height:36px"><option value="12">cực thấp</option><option value="23">thấp</option><option value="38" selected>trung bình</option><option value="53">cao</option></select></label><label>Lượng bột giặt <input id="bg" type="range" min="1" max="10" value="4" style="width:150px"></label></div>
    <div class="bar" style="height:16px;margin-top:10px"><i id="wB" style="width:0"></i></div><div class="verdict" id="wV" style="margin-top:10px"></div></div>
  <div class="callout"><span class="ic">💧</span><div><b class="t">Đánh đổi</b><p>Mực nước thấp: <b>sạch hơn, tiết kiệm nước</b> nhưng đồ dễ nhàu. Mực nước cao mà ít bột giặt: tốn nước, bột bị loãng → xả không sạch. (Giá trị 12/23/38/53 lít chỉ là ví dụ trên một model.)</p></div></div>
</section>

<section class="sec" id="s-scen" data-toc="3 · Tình huống">
  <div class="sec-n">Phần 3</div><h2>🧩 Chọn thao tác theo tình huống</h2>
  <div id="sTabs"></div><article class="panel warm" id="sP"></article>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Cấp nước trực tiếp từ đường nước thành phố</b><p>Nhà không có bể cao thì phải biết <b>giờ nước có áp</b>, hoặc dùng hẹn giờ để giặt đúng lúc.</p></div></div>
</section>

<section class="sec" id="s-front" data-toc="4 · Cửa trước">
  <div class="sec-n">Phần 4</div><h2>Máy cửa trước (LG, Samsung, Electrolux…)</h2>
  <p>Không phải máy nào cũng cho chạy tự động ngay; thường phải <b>xoay núm chọn chương trình</b> (cotton, tổng hợp, nhanh, đồ len, đồ trẻ em…) rồi chỉnh thêm:</p>
  <ul><li><b>Nhiệt độ</b>: lạnh – 30 – 40 – 60 – 95 °C (đồ chịu nhiệt kém không chọn cao)</li><li><b>Vắt</b>: 400 / 800 / 1000 / 1200 vòng/phút (đồ mỏng chọn thấp để khỏi nhàu)</li><li><b>Xả thêm</b>, hơi nước, giặt trước, khóa trẻ em…</li></ul>
  <p>Máy thông minh tự giới hạn: đồ mỏng không cho vắt 1200 vòng/ phút. Sau khi chọn xong bấm <b>Start</b>; đèn khóa cửa sáng thì máy mới chạy.</p>
</section>

<section class="sec" id="s-en" data-toc="5 · Từ tiếng Anh">
  <div class="sec-n">Phần 5</div><h2>Từ tiếng Anh thường gặp trên bảng</h2>
  <p>Bấm vào thẻ để xem nghĩa:</p>
  <div class="row" id="enBox">${EN.map((w, i) => `<button class="btn sm" type="button" data-i="${i}">${w[0]}</button>`).join('')}</div><div class="verdict" id="enV" style="margin-top:10px">Chọn một từ.</div>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Hai cách chạy: tự động (Nguồn → Khởi động) hoặc tự chọn.</b></div></li>
    <li class="done"><div><b>Máy điện tử tự cân đồ để chọn mực nước.</b></div></li>
    <li class="done"><div><b>Vắt cực khô không phải sấy: chỉ quay nhanh, lâu.</b></div></li>
    <li class="done"><div><b>Khóa trẻ em: giữ phím 3–5 giây. Hẹn giờ 6/9 giờ.</b></div></li>
    <li class="done"><div><b>Vệ sinh lồng khoảng 1 tháng/ lần (chạy rỗng).</b></div></li>
    <li class="done"><div><b>Cửa trước: chọn chương trình, nhiệt độ, vòng vắt; đồ mỏng vắt thấp.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/9/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    $('#keys', root).onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; $$('#keys [data-k]', root).forEach(x => x.setAttribute('aria-pressed', x === b)); const k = KEYS[b.dataset.k]; $('#kP', root).innerHTML = `<h3>${k[0]}</h3><p style="margin:0">${k[1]}</p>`; };
    const wl = $('#wl', root), bg = $('#bg', root), wd = () => { const w = +wl.value, b = +bg.value, ratio = b / (w / 6); $('#wB', root).style.width = Math.min(100, ratio * 20) + '%'; $('#wB', root).style.background = ratio > 3.5 ? 'var(--warm)' : ratio < 1 ? 'var(--bad)' : 'var(--ok)'; const r = $('#wV', root); r.className = 'verdict ' + (ratio < 1 ? 'bad' : 'ok'); r.textContent = ratio < 1 ? '✗ Nước nhiều, bột ít: bột loãng, giặt không sạch, tốn nước.' : ratio > 3.5 ? '⚠️ Bột quá nhiều so với nước: khó xả sạch, đọng xà phòng.' : '✓ Tỉ lệ bột/ nước hợp lý.'; };
    wl.onchange = bg.oninput = wd; wd();
    U.tabset($('#sTabs', root), Object.entries(SCEN).map(([id, s], i) => ({ id, n: i + 1, name: s[0] })), id => { const s = SCEN[id]; $('#sP', root).innerHTML = `<h3>${s[0]}</h3><p style="margin:0">${s[1]}</p>`; });
    $('#enBox', root).onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const w = EN[+b.dataset.i]; $('#enV', root).className = 'verdict ok'; $('#enV', root).innerHTML = `<b>${w[0]}</b> = ${w[1]}`; };
  }

  const flashcards = [
    { f: 'Hai cách chạy máy điện tử?', b: 'Tự động (mặc định) và tự chọn.', tag: 'Cơ bản' },
    { f: 'Chạy tự động bấm?', b: 'Nguồn → Khởi động.', tag: 'Cơ bản' },
    { f: 'Máy chạy tự động gồm?', b: 'Giặt – xả – vắt, tự chọn mực nước.', tag: 'Cơ bản' },
    { f: 'Máy tự cân đồ bằng?', b: 'Mâm quay tạo gió vào ống áp, đổi vị trí lõi ferit.', tag: 'Cơ bản' },
    { f: 'Đèn sáng là?', b: 'Mục đó đang được chọn.', tag: 'Bảng điều khiển' },
    { f: 'Đèn nhấp nháy là?', b: 'Chương trình đang làm việc.', tag: 'Bảng điều khiển' },
    { f: 'Vắt cực khô có phải sấy?', b: 'Không; quay nhanh, lâu.', tag: 'Chức năng' },
    { f: 'Thời gian vắt cực khô?', b: '30 hoặc 90 phút.', tag: 'Chức năng' },
    { f: 'Đồ hay nhàu nên?', b: 'Tăng xả tràn hoặc bỏ vắt.', tag: 'Tình huống' },
    { f: 'Giặt tay xong, muốn vắt?', b: 'Chọn chức năng chỉ vắt.', tag: 'Tình huống' },
    { f: 'Còn xà phòng?', b: 'Xả tràn + vắt.', tag: 'Tình huống' },
    { f: 'Khóa trẻ em bật bằng?', b: 'Giữ phím ~3 – 5 giây.', tag: 'Chức năng' },
    { f: 'Hẹn giờ có các mức?', b: '6 giờ hoặc 9 giờ.', tag: 'Chức năng' },
    { f: 'Vì sao dùng hẹn giờ?', b: 'Giặt khuya điện khỏe, hoặc đúng giờ nước có áp.', tag: 'Chức năng' },
    { f: 'Vệ sinh lồng mấy lần?', b: 'Khoảng 1 tháng/ lần.', tag: 'Bảo dưỡng' },
    { f: 'Vệ sinh lồng làm thế nào?', b: 'Chạy giặt rỗng không có đồ.', tag: 'Bảo dưỡng' },
    { f: 'Mực nước thấp thì?', b: 'Sạch hơn, tiết kiệm nước, dễ nhàu.', tag: 'Mực nước' },
    { f: 'Mực nước cao, ít bột?', b: 'Tốn nước, bột loãng, xả không sạch.', tag: 'Mực nước' },
    { f: 'Cửa trước: chọn gì sau chương trình?', b: 'Nhiệt độ, vòng vắt, xả thêm.', tag: 'Cửa trước' },
    { f: 'Nhiệt độ cửa trước?', b: 'Lạnh, 30, 40, 60, 95 °C.', tag: 'Cửa trước' },
    { f: 'Vòng vắt thông thường?', b: '400, 800, 1000, 1200 vòng/ phút.', tag: 'Cửa trước' },
    { f: 'Đồ mỏng vắt?', b: 'Tốc độ thấp.', tag: 'Cửa trước' },
    { f: 'Wash / Rinse / Spin?', b: 'Giặt / Xả / Vắt.', tag: 'Tiếng Anh' },
    { f: 'Delicate / Cotton / Wool?', b: 'Vải mỏng / Bông / Len.', tag: 'Tiếng Anh' },
    { f: 'Start / Pause?', b: 'Bắt đầu / Tạm dừng.', tag: 'Tiếng Anh' },
    { f: 'Soak / Quick?', b: 'Ngâm / Giặt nhanh.', tag: 'Tiếng Anh' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Chạy tự động bấm?', ['Nguồn → Khởi động', 'Chỉ khởi động', 'Hẹn giờ', 'Khóa trẻ em'], 0, 'Mặc định.'),
    Q('Máy tự cân đồ bằng?', ['Gió vào ống áp lực', 'Cân điện tử', 'Nhiệt độ', 'Tay'], 0, 'Lõi ferit dịch.'),
    Q('Đèn nhấp nháy nghĩa là?', ['Đang làm việc', 'Hỏng', 'Tắt', 'Khóa'], 0, 'Chương trình đang chạy.'),
    Q('Vắt cực khô là?', ['Quay nhanh lâu, không sấy', 'Sấy', 'Xả', 'Ngâm'], 0, '30/90 phút.'),
    Q('Đồ hay nhàu nên?', ['Tăng xả tràn / bỏ vắt', 'Vắt cực khô', 'Tăng bột giặt', 'Dùng nước nóng'], 0, 'Giảm nhàu.'),
    Q('Đã giặt tay, chỉ cần?', ['Chọn chỉ vắt', 'Chạy cả chu trình', 'Hẹn giờ', 'Vệ sinh lồng'], 0, 'Tiết kiệm.'),
    Q('Còn xà phòng?', ['Xả tràn + vắt', 'Giặt lại', 'Vệ sinh lồng', 'Hẹn giờ'], 0, 'Xả sạch.'),
    Q('Khóa trẻ em bật bằng?', ['Giữ phím vài giây', 'Bấm 1 lần', 'Rút điện', 'Không có'], 0, '3–5 s.'),
    Q('Hẹn giờ có mức?', ['6 hoặc 9 giờ', '1 phút', '24 giờ', '100 giờ'], 0, 'Ví dụ trên model.'),
    Q('Hẹn giờ dùng khi?', ['Điện yếu ban ngày, giặt khuya', 'Luôn luôn', 'Máy hỏng', 'Hết nước'], 0, 'Chủ động.'),
    Q('Vệ sinh lồng khoảng?', ['1 tháng/ lần', '1 ngày/ lần', '1 năm/ lần', 'Không cần'], 0, 'Tránh mùi.'),
    Q('Vệ sinh lồng bằng?', ['Chạy rỗng', 'Chạy đầy đồ', 'Tắt điện', 'Tháo lồng'], 0, 'Không có đồ.'),
    Q('Mực nước thấp?', ['Sạch hơn, dễ nhàu', 'Dễ nhàu, nước nhiều', 'Tốn nước', 'Không giặt được'], 0, 'Tiết kiệm nước.'),
    Q('Mực nước cao, ít bột?', ['Tốn nước, bột loãng', 'Sạch hơn', 'Tiết kiệm', 'Không đổi'], 0, 'Không tối ưu.'),
    Q('Nhiệt độ cửa trước cao nhất ví dụ?', ['95 °C', '10 °C', '200 °C', '150 °C'], 0, 'Nước nóng.'),
    Q('Đồ chịu nhiệt kém?', ['Không chọn nhiệt cao', 'Chọn nhiệt cao', 'Không giặt', 'Chỉ sấy'], 0, 'Tránh hỏng đồ.'),
    Q('Đồ mỏng vắt?', ['Tốc độ thấp', 'Cao nhất', 'Không vắt', 'Tùy'], 0, 'Tránh nhàu.'),
    Q('Wash là?', ['Giặt', 'Xả', 'Vắt', 'Sấy'], 0, 'Tiếng Anh.'),
    Q('Rinse là?', ['Xả', 'Giặt', 'Vắt', 'Ngâm'], 0, 'Tiếng Anh.'),
    Q('Spin là?', ['Vắt', 'Xả', 'Giặt', 'Khóa'], 0, 'Tiếng Anh.'),
    Q('Delicate là?', ['Vải mỏng, mềm', 'Giặt mạnh', 'Sấy', 'Ngâm'], 0, 'Tiếng Anh.'),
    Q('Cửa trước: đèn khóa cửa sáng nghĩa?', ['Cửa đã khóa, máy sẽ chạy', 'Hỏng', 'Hết nước', 'Tắt máy'], 0, 'Điều kiện an toàn.'),
    Q('Cấp nước trực tiếp phải lưu ý?', ['Giờ nước có áp', 'Màu nước', 'Hãng nước', 'Nhiệt độ phòng'], 0, 'Áp lực nguồn.'),
    Q('Tạm dừng dùng phím?', ['Khởi động/ Tạm dừng', 'Nguồn', 'Mực nước', 'Khóa trẻ em'], 0, 'Phím chung.')
  ];
  const sort = {
    title: 'Chọn chức năng phù hợp',
    buckets: [{ id: 'spin', name: 'Cần VẮT thêm' }, { id: 'rinse', name: 'Cần XẢ thêm' }, { id: 'other', name: 'Hẹn giờ / vệ sinh / khóa' }],
    items: [
      { t: 'Trời mưa phùn, phơi lâu khô', b: 'spin' }, { t: 'Đã giặt tay xong', b: 'spin' }, { t: 'Muốn đồ ráo nhanh', b: 'spin' },
      { t: 'Còn nhiều xà phòng', b: 'rinse' }, { t: 'Đồ nhàu, bỏ vắt', b: 'rinse' }, { t: 'Giặt đồ trẻ em', b: 'rinse' },
      { t: 'Giặt khuya điện khỏe', b: 'other' }, { t: 'Lồng có mùi hôi', b: 'other' }, { t: 'Con nhỏ hay bấm phím', b: 'other' }
    ]
  };
  const order = [
    { title: 'Chạy tự chọn (cửa trên)', intro: 'Thứ tự thao tác.', steps: ['Cho đồ vào lồng', 'Bấm nguồn', 'Chọn chương trình', 'Chọn chức năng', 'Chọn mực nước', 'Bấm khởi động'] },
    { title: 'Vệ sinh lồng giặt', intro: 'Mỗi tháng.', steps: ['Lấy hết đồ ra', 'Đóng nắp, bật nguồn', 'Chọn chế độ giặt rỗng', 'Cho chất tẩy theo hướng dẫn', 'Chạy hết chu trình', 'Lau khô, để nắp mở'] },
    { title: 'Máy cửa trước', intro: 'Từ chọn chương trình.', steps: ['Đóng cửa', 'Bật nguồn', 'Chọn chương trình', 'Chỉnh nhiệt độ', 'Chỉnh vòng vắt', 'Bấm Start, chờ khóa cửa'] }
  ];
  DL.register({
    cat: 'may-giat', id: 9, ready: true, title: 'Cách sử dụng máy giặt', sub: 'Bảng điều khiển, chương trình, mực nước, hẹn giờ', minutes: 22,
    lead: 'Cách vận hành máy giặt cửa trên và cửa trước: chạy tự động hay tự chọn, các phím chức năng, chọn thao tác theo tình huống thực tế và từ tiếng Anh trên bảng điều khiển.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
