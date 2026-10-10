/* MÁY GIẶT — BÀI 10: PHÂN TÍCH MẠCH ĐIỀU KHIỂN ĐA NĂNG (biên soạn từ docs/may_giat/Bai_10.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const BLOCKS = {
    jack: ['Giắc ra phụ tải', 'Gồm: nguồn cấp trước, dây chung (nối chung các phụ tải), van xả (AC hoặc DC qua cầu nắn), van cấp, hai giắc động cơ (chạy/ đề → quay phải/ trái), công tắc cơ cửa, cảm biến mực nước (van áp lực).'],
    relay: ['Rơle (cấp nguồn)', 'Nguồn 220 V đi vào chân chung của rơle; tiếp điểm đóng khi cuộn dây rơle có điện → cấp nguồn cho các triac và cầu nắn. Cuộn rơle lấy <b>12 V</b>, điều khiển qua một bóng bán dẫn.'],
    triac: ['Triac Z1…Z4', 'Đóng/ ngắt nguồn xoay chiều cho phụ tải. Cần <b>dòng kích một chiều</b> vào chân G (qua điện trở). Z1, Z2: động cơ phải/ trái (có <b>lá nhôm tản nhiệt</b>); Z3: van xả; Z4: van cấp nước.'],
    trans: ['Bóng bán dẫn điều khiển', 'Vi xử lý cấp dòng nhỏ vào chân B (qua điện trở ~47 kΩ) → bóng dẫn → kéo sụt áp 5 V xuống mát → có dòng kích cho chân G của triac.'],
    xfmr: ['Biến áp + cầu nắn + tụ lọc', 'Biến áp hạ 220 V xuống 12 V AC (sơ cấp có điện trở lớn hơn thứ cấp), cầu nắn → DC, tụ lọc (ví dụ 1000 µF/ 25 V) → <b>12 V DC</b> cho rơle và IC ổn áp.'],
    reg: ['IC ổn áp 7805', 'Nhận 12 V ở chân 1, cho <b>5 V</b> ở chân 3 (chân 2 là mát). 5 V cấp cho vi xử lý và các tín hiệu báo về.'],
    mcu: ['Vi xử lý (MCU)', 'Điều kiện làm việc: ① nguồn nuôi 5 V ở chân 15 và mát; ② thạch anh dao động ở 2 chân 16–17; ③ mạch khởi động (reset) ở chân 5 (RC: 10 kΩ + tụ 104 → áp lên chậm hơn nguồn một nhịp); ④ các đường tín hiệu báo về; ⑤ các đường tín hiệu điều khiển ra.'],
    coat: ['Keo chống ẩm', 'Phủ bo vì môi trường ẩm. <b>Cảnh báo:</b> phần điện áp thấp 5 V của mạch này nối chung với nguồn 220 V (không cách ly) → <b>sờ vào có thể bị giật</b>.']
  };

  const OUT = {
    cw: { n: 'Quay phải (động cơ)', pin: 'chân 9 → ', tr: 'Z1', jack: 'giắc 5', fx: 'động cơ quay thuận' },
    ccw: { n: 'Quay trái (động cơ)', pin: 'chân 10 → ', tr: 'Z2', jack: 'giắc 6', fx: 'động cơ quay ngược' },
    fill: { n: 'Van cấp nước', pin: 'chân 11 → ', tr: 'Z4', jack: 'giắc 4', fx: 'nước chảy vào thùng' },
    drain: { n: 'Van xả', pin: 'chân 12 → ', tr: 'Z3', jack: 'giắc 3', fx: 'xả nước/ kéo ly hợp' }
  };

  function learn() {
    return `
<section class="sec" id="s-what" data-toc="1 · Mạch đa năng">
  <div class="sec-n">Phần 1</div><h2>Mạch điều khiển đa năng là gì?</h2>
  <p>Là bo mạch <b>thay thế</b> khi không có bo nguyên bản của hãng (ví dụ máy cửa trên kiểu Mondo). Cách nhận dạng một bo: <b>① các giắc ra</b> (nguồn – phụ tải), <b>② nhóm công suất</b> (rơle, triac), <b>③ nguồn nuôi</b> (biến áp, cầu nắn, 7805), <b>④ khối vi xử lý</b>.</p>
  <div class="callout"><span class="ic">🧭</span><div><b class="t">Quy trình phân tích mạch điện tử</b><p>Bước 1: <b>nhận dạng</b> bo. Bước 2: phân tích <b>nguồn 220 V</b> (dây cấp trước – dây điều khiển). Bước 3: phân tích <b>nguồn DC</b> (12 V → 5 V). Bước 4: điều kiện để vi xử lý làm việc. Bước 5: tín hiệu <b>báo về</b>. Bước 6: tín hiệu <b>điều khiển ra</b>.</p></div></div>
</section>

<section class="sec" id="s-board" data-toc="2 · Khối chức năng">
  <div class="sec-n">Phần 2</div><h2>🔬 Các khối trên bo – bấm xem</h2>
  <div class="stage" style="padding:14px"><div id="bbox" class="row" style="gap:8px"></div></div>
  <article class="panel" id="bP" aria-live="polite"></article>
</section>

<section class="sec" id="s-mcu" data-toc="3 · Vi xử lý">
  <div class="sec-n">Phần 3</div><h2>🔬 Vi xử lý có chạy không?</h2>
  <p>Bật/ tắt từng điều kiện để xem MCU có làm việc không:</p>
  <div class="stage" style="padding:14px"><div class="row" id="cond">${[['v', 'Nguồn 5 V chân 15'], ['g', 'Mát'], ['x', 'Thạch anh dao động (16–17)'], ['r', 'Mạch khởi động chân 5']].map(c => `<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-c="${c[0]}" checked> ${c[1]}</label>`).join('')}</div><div class="verdict" id="mV" style="margin-top:12px"></div></div>
</section>

<section class="sec" id="s-out" data-toc="4 · Đường ra">
  <div class="sec-n">Phần 4</div><h2>🔬 Từ vi xử lý đến phụ tải</h2>
  <p>Chọn một phụ tải để xem chuỗi tác động: <b>MCU → điện trở → bóng bán dẫn → dòng kích G → triac → phụ tải</b>.</p>
  <div id="oTabs"></div><article class="panel warm" id="oP"></article>
  <div class="stage" style="margin-top:10px;padding:14px"><div id="chain" class="row" style="gap:6px;align-items:center;flex-wrap:wrap"></div></div>
</section>

<section class="sec" id="s-in" data-toc="5 · Tín hiệu báo về">
  <div class="sec-n">Phần 5</div><h2>Tín hiệu báo về</h2>
  <ul><li><b>Công tắc cơ cửa, phím Start…</b>: nối chân MCU qua điện trở với 5 V; khi đóng/ nhấn → <b>điện áp sụt</b> (xung thay đổi) → MCU nhận biết.</li><li><b>Van áp lực điện tử</b>: tín hiệu tần số qua IC giải mã phao (HEF4069) để biến xung sin thành xung vuông đưa vào MCU (chân Data).</li><li>MCU <b>so sánh</b> tín hiệu với giá trị cài sẵn; sai → có thể <b>báo lỗi</b>.</li></ul>
  <div class="callout danger"><span class="ic">⚡</span><div><b class="t">An toàn</b><p>Phần 5 V của bo này <b>không cách ly</b> với 220 V. Không chạm tay vào mạch khi cấp điện; bo được đổ keo để chống ẩm và chống chạm.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 7 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Phân tích mạch: nhận dạng → nguồn 220 V → nguồn DC → MCU → báo về → điều khiển ra.</b></div></li>
    <li class="done"><div><b>Nguồn 220 V chia dây cấp trước (qua rơle) và dây chung/ điều khiển.</b></div></li>
    <li class="done"><div><b>Biến áp → cầu nắn → tụ lọc → 12 V → 7805 → 5 V.</b></div></li>
    <li class="done"><div><b>MCU cần: nguồn 5 V, mát, thạch anh, mạch khởi động.</b></div></li>
    <li class="done"><div><b>Triac cần dòng kích một chiều vào chân G, do bóng bán dẫn tạo ra.</b></div></li>
    <li class="done"><div><b>Z1/ Z2 điều khiển động cơ phải/ trái, Z3 van xả, Z4 van cấp.</b></div></li>
    <li class="done"><div><b>Phần điện áp thấp không cách ly 220 V → nguy hiểm.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/10/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    let sel = 'jack';
    const bb = $('#bbox', root), bd = () => { bb.innerHTML = Object.entries(BLOCKS).map(([k, v]) => `<button type="button" class="btn sm" data-k="${k}" aria-pressed="${k === sel}">${v[0]}</button>`).join(''); $('#bP', root).innerHTML = `<h3>${BLOCKS[sel][0]}</h3><p style="margin:0">${BLOCKS[sel][1]}</p>`; };
    bb.onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; sel = b.dataset.k; bd(); }; bd();
    const md = () => { const miss = $$('#cond input', root).filter(i => !i.checked).map(i => i.parentNode.textContent.trim()); const v = $('#mV', root); v.className = 'verdict ' + (miss.length ? 'bad' : 'ok'); v.innerHTML = miss.length ? `✗ MCU <b>không chạy</b>: thiếu ${miss.join(', ')}. Máy không phản ứng, đèn không sáng hoặc không nhận lệnh.` : '✓ MCU làm việc: đủ nguồn, mát, dao động và khởi động.'; };
    $$('#cond input', root).forEach(i => i.onchange = md); md();
    U.tabset($('#oTabs', root), Object.entries(OUT).map(([id, o], i) => ({ id, n: i + 1, name: o.n })), id => { const o = OUT[id]; $('#oP', root).innerHTML = `<h3>${o.n}</h3><p style="margin:0">MCU <b>${o.pin}</b>R 47 kΩ → bóng bán dẫn dẫn → dòng kích G của <b>${o.tr}</b> → triac thông T1–T2 → ra <b>${o.jack}</b> → <b>${o.fx}</b>.</p>`; $('#chain', root).innerHTML = ['MCU', 'R 47k', 'Bóng bán dẫn', 'G của ' + o.tr, 'T1–T2 thông', o.jack].map((s, i, a) => `<span class="pill ok">${s}</span>${i < a.length - 1 ? '<b>→</b>' : ''}`).join(''); });
  }

  const flashcards = [
    { f: 'Mạch đa năng dùng khi nào?', b: 'Khi không có bo nguyên bản để thay.', tag: 'Cơ bản' },
    { f: 'Cách nhận dạng bo?', b: 'Giắc ra, công suất, nguồn nuôi, MCU.', tag: 'Cơ bản' },
    { f: 'Nguồn cấp trước đi qua?', b: 'Chân chung của rơle.', tag: 'Nguồn' },
    { f: 'Dây chung dùng để?', b: 'Nối chung các phụ tải.', tag: 'Nguồn' },
    { f: 'Rơle cấp điện bằng?', b: '12 V.', tag: 'Nguồn' },
    { f: 'Biến áp hạ áp: sơ cấp điện trở?', b: 'Lớn hơn thứ cấp.', tag: 'Nguồn' },
    { f: 'Biến áp → ?', b: 'Cầu nắn → tụ lọc → 12 V DC.', tag: 'Nguồn' },
    { f: 'IC ổn áp tạo 5 V?', b: '7805.', tag: 'Nguồn' },
    { f: '7805: chân 1 nhận?', b: '12 V.', tag: 'Nguồn' },
    { f: '7805: chân 3 cho?', b: '5 V.', tag: 'Nguồn' },
    { f: 'MCU cần mấy điều kiện?', b: 'Nguồn 5V, mát, thạch anh, khởi động.', tag: 'MCU' },
    { f: 'MCU chân nguồn?', b: 'Chân 15.', tag: 'MCU' },
    { f: 'Thạch anh nối chân?', b: '16 và 17.', tag: 'MCU' },
    { f: 'Mạch khởi động ở chân?', b: '5 (RC 10 kΩ + 104).', tag: 'MCU' },
    { f: 'Khởi động làm gì?', b: 'Làm áp lên chậm một nhịp để MCU reset.', tag: 'MCU' },
    { f: 'Triac cần?', b: 'Dòng kích một chiều vào G.', tag: 'Công suất' },
    { f: 'Z1, Z2?', b: 'Động cơ phải/ trái.', tag: 'Công suất' },
    { f: 'Z3?', b: 'Van xả.', tag: 'Công suất' },
    { f: 'Z4?', b: 'Van cấp nước.', tag: 'Công suất' },
    { f: 'Lá nhôm gắn triac để?', b: 'Tản nhiệt.', tag: 'Công suất' },
    { f: 'Bóng bán dẫn nhận từ?', b: 'MCU qua R 47 kΩ.', tag: 'Điều khiển' },
    { f: 'Bóng dẫn làm gì?', b: 'Kéo sụt 5V → dòng kích G.', tag: 'Điều khiển' },
    { f: 'Tín hiệu báo về của công tắc?', b: 'Điện áp sụt khi đóng.', tag: 'Báo về' },
    { f: 'HEF4069 làm gì?', b: 'Giải mã phao: biến tần số thành xung vuông.', tag: 'Báo về' },
    { f: 'Vì sao đổ keo?', b: 'Chống ẩm, chống chạm.', tag: 'An toàn' },
    { f: 'Phần 5V có nguy hiểm?', b: 'Có: không cách ly với 220 V.', tag: 'An toàn' },
    { f: 'Diode D5 song song cuộn rơle?', b: 'Thoát xung ngược bảo vệ bóng.', tag: 'Công suất' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Mạch đa năng dùng để?', ['Thay bo nguyên bản', 'Làm đẹp', 'Thay động cơ', 'Thay van'], 0, 'Dùng chung nhiều máy.'),
    Q('Bước đầu phân tích mạch?', ['Nhận dạng bo', 'Thay linh kiện', 'Hàn lại', 'Đổ keo'], 0, 'Rồi nguồn.'),
    Q('Rơle cấp nguồn điện áp?', ['12 V', '5 V', '220 V', '3 V'], 0, 'Cuộn dây.'),
    Q('IC tạo 5V?', ['7805', '4069', '555', 'LM358'], 0, 'Ổn áp.'),
    Q('7805 chân vào 12V?', ['Chân 1', 'Chân 2', 'Chân 3', 'Chân 4'], 0, 'Chân 3 ra 5V.'),
    Q('Biến áp hạ áp sơ cấp?', ['Điện trở lớn hơn', 'Nhỏ hơn', 'Bằng 0', 'Vô cực'], 0, 'Nhiều vòng.'),
    Q('MCU chân nguồn?', ['15', '5', '16', '1'], 0, 'Theo bài.'),
    Q('Thạch anh nối chân?', ['16–17', '1–2', '9–10', '18–19'], 0, 'Dao động.'),
    Q('Mạch reset ở chân?', ['5', '15', '17', '19'], 0, 'RC.'),
    Q('Thiếu thạch anh?', ['MCU không chạy', 'Chạy bình thường', 'Chạy nhanh', 'Nóng'], 0, 'Không dao động.'),
    Q('Z1 điều khiển?', ['Động cơ quay phải', 'Van cấp', 'Van xả', 'Sợi đốt'], 0, 'Theo bài.'),
    Q('Z3 điều khiển?', ['Van xả', 'Van cấp', 'Quạt', 'Đèn'], 0, 'Xả.'),
    Q('Z4 điều khiển?', ['Van cấp nước', 'Van xả', 'Động cơ', 'Bơm'], 0, 'Cấp.'),
    Q('Triac cần kích bằng?', ['Dòng một chiều vào G', 'AC vào T1', 'Nước', 'Không cần'], 0, 'Điều khiển AC.'),
    Q('Bóng bán dẫn được cấp dòng qua?', ['R ~47kΩ', 'Tụ', 'Cuộn', 'Dây'], 0, 'Bias.'),
    Q('Lá nhôm trên triac?', ['Tản nhiệt', 'Cách điện', 'Che', 'Dẫn điện'], 0, 'Triac nóng.'),
    Q('Tín hiệu báo về của công tắc?', ['Điện áp sụt khi đóng', 'Tần số tăng', 'Dòng 10 A', 'Không có'], 0, 'MCU nhận biết.'),
    Q('HEF4069 dùng cho?', ['Giải mã phao', 'Tạo 5V', 'Khởi động', 'Chỉnh lưu'], 0, 'Chuyển xung.'),
    Q('Keo trên bo để?', ['Chống ẩm', 'Tản nhiệt', 'Tăng điện', 'Giảm dòng'], 0, 'Ẩm ướt.'),
    Q('Phần 5V trong bo đa năng?', ['Không cách ly 220V', 'Cách ly hoàn toàn', 'Là 12V', 'An toàn tuyệt đối'], 0, 'Nguy hiểm.'),
    Q('Tụ lọc nguồn ví dụ?', ['1000 µF/25V', '1 pF', '10 nF', '0,1 µF'], 0, 'Theo bài.'),
    Q('Nguồn cấp trước đi vào?', ['Chân chung rơle', 'Chân G triac', 'Chân MCU', 'Thạch anh'], 0, 'Qua tiếp điểm.'),
    Q('D5 mắc song song cuộn rơle?', ['Thoát xung ngược', 'Chỉnh lưu', 'Ổn áp', 'Khuếch đại'], 0, 'Bảo vệ.'),
    Q('Nếu mất 12V thì?', ['Rơle và 5V mất', 'Chỉ rơle', 'Không sao', 'Chỉ MCU'], 0, '7805 nhận 12V.')
  ];
  const sort = {
    title: 'Khối nào của bo?',
    buckets: [{ id: 'psu', name: 'Nguồn' }, { id: 'pow', name: 'Công suất' }, { id: 'ctl', name: 'Vi xử lý & tín hiệu' }],
    items: [
      { t: 'Biến áp', b: 'psu' }, { t: 'Cầu nắn + tụ lọc', b: 'psu' }, { t: '7805', b: 'psu' },
      { t: 'Rơle', b: 'pow' }, { t: 'Triac Z1–Z4', b: 'pow' }, { t: 'Lá nhôm tản nhiệt', b: 'pow' }, { t: 'Diode thoát xung', b: 'pow' },
      { t: 'Thạch anh', b: 'ctl' }, { t: 'Mạch reset', b: 'ctl' }, { t: 'HEF4069', b: 'ctl' }, { t: 'Điện trở 47k vào bóng', b: 'ctl' }
    ]
  };
  const order = [
    { title: 'Tạo nguồn 5 V', intro: 'Từ 220 V.', steps: ['220 V vào sơ cấp biến áp', 'Thứ cấp ra 12 V AC', 'Cầu nắn chỉnh lưu', 'Tụ lọc 1000 µF', 'IC 7805 hạ xuống 5 V', 'Cấp cho MCU chân 15'] },
    { title: 'MCU điều khiển van cấp', intro: 'Chuỗi điều khiển.', steps: ['MCU xuất mức điện áp', 'Qua R 47k vào chân B', 'Bóng bán dẫn dẫn', 'Sụt áp tạo dòng kích G', 'Triac Z4 thông T1–T2', 'Van cấp có 220 V, nước chảy'] },
    { title: 'Phân tích mạch', intro: 'Quy trình 6 bước.', steps: ['Nhận dạng bo', 'Phân tích nguồn 220 V', 'Phân tích nguồn DC', 'Điều kiện MCU làm việc', 'Tín hiệu báo về', 'Tín hiệu điều khiển ra'] }
  ];
  DL.register({
    cat: 'may-giat', id: 10, ready: true, title: 'Phân tích mạch điều khiển đa năng', sub: 'Nguồn 12V/5V, MCU, triac, đường tín hiệu', minutes: 30,
    lead: 'Học cách “đọc” một bo mạch đa năng máy giặt cửa trên: nhận dạng giắc, nguồn nuôi, điều kiện làm việc của vi xử lý và chuỗi MCU → bóng → triac → phụ tải.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
