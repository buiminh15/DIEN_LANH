/* MÁY GIẶT — BÀI 7: CÔNG TẮC AN TOÀN, KHỐNG CHẾ NHIỆT ĐỘ, MẠCH ĐIỀU KHIỂN (biên soạn từ docs/may_giat/Bai_7.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const SAFE = {
    mag: ['Công tắc từ', 'Nam châm trên cửa làm tiếp điểm trong thân đóng khi cửa đóng. Mở cửa → ngắt.'],
    mech: ['Công tắc cơ', 'Chốt cơ ấn tiếp điểm khi cửa đóng. Hay hỏng chốt, tiếp điểm.'],
    lock: ['Khóa cửa (thạch anh – lưỡng kim)', 'Điện cấp cho <b>lưỡng kim</b> nóng lên, cong đẩy chốt khóa. Ngắt điện → lưỡng kim nguội, mở khóa sau <b>~3 – 5 phút</b> (nhờ vậy cửa không mở khi lồng còn quay).']
  };
  const MC = {
    mech: ['Điều khiển cơ', 'Đồng hồ chương trình: động cơ nhỏ + bánh răng + cam. Núm xoay chọn chương trình. Hỏng: tiếp điểm cháy, bánh răng kẹt.'],
    elec: ['Điều khiển điện tử', 'Vi điều khiển + rơle/ triac. Nhận tín hiệu từ cảm biến mức nước, nhiệt, cửa. Hỏng: ẩm, tụ, triac, rơle.']
  };

  function learn() {
    return `
<section class="sec" id="s-safe" data-toc="1 · Công tắc an toàn">
  <div class="sec-n">Phần 1</div><h2>Công tắc an toàn cửa</h2>
  <p>Máy chỉ chạy khi <b>cửa đã đóng</b>. Có 3 kiểu, bấm để xem:</p>
  <div id="sTabs"></div><article class="panel" id="sPanel" aria-live="polite"></article>
  <div class="stage" style="margin-top:14px;padding:14px"><div class="row"><button class="btn pri sm" id="lkOn" aria-pressed="false">🔒 Cấp điện khóa cửa</button><button class="btn sm" id="lkOff">🔓 Ngắt điện</button></div>
    <div class="bar" style="height:18px;margin-top:10px"><i id="lkB" style="width:0"></i></div><div class="verdict" id="lkV" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-temp" data-toc="2 · Khống chế nhiệt độ">
  <div class="sec-n">Phần 2</div><h2>Khống chế nhiệt độ nước (20 – 90 °C)</h2>
  <p>Cảm biến (<b>điện trở nhiệt NTC</b>) đo nhiệt độ nước; bo so sánh với mức đặt và <b>đóng/ ngắt sợi đốt</b>. Nhiệt độ chọn từ <b>20 °C đến 90 °C</b>.</p>
  <div class="stage" style="padding:14px"><div class="row"><label>Đặt <input id="tSet" type="range" min="20" max="90" step="10" value="40" style="width:200px"> <b id="tV"></b></label><button class="btn pri sm" id="tGo">▶ Đun</button></div><div id="tG" style="margin-top:10px"></div><div class="verdict" id="tR"></div></div>
</section>

<section class="sec" id="s-ctrl" data-toc="3 · Mạch điều khiển">
  <div class="sec-n">Phần 3</div><h2>Mạch điều khiển cơ và điện tử</h2>
  <div id="mTabs"></div><article class="panel warm" id="mPanel"></article>
  <div class="callout"><span class="ic">🔌</span><div><b class="t">Thứ tự một chu trình tự động</b><p>Cửa đóng → khóa → cấp nước (đến đủ mực) → đun (nếu cần) → giặt → xả → xả nước → vắt → báo xong → mở khóa.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 5 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Công tắc an toàn: từ, cơ, khóa lưỡng kim.</b></div></li>
    <li class="done"><div><b>Khóa cửa lưỡng kim mở sau ~3–5 phút nguội.</b></div></li>
    <li class="done"><div><b>Nhiệt độ nước chọn 20 – 90 °C; NTC đo, bo đóng/ ngắt sợi đốt.</b></div></li>
    <li class="done"><div><b>Mạch cơ: đồng hồ chương trình; mạch điện tử: vi điều khiển.</b></div></li>
    <li class="done"><div><b>Thứ tự: cửa đóng → cấp nước → đun → giặt → xả → vắt.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/7/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#sTabs', root), Object.entries(SAFE).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#sPanel', root).innerHTML = `<h3>${SAFE[id][0]}</h3><p style="margin:0">${SAFE[id][1]}</p>`; });
    let lk = 0, tm;
    const lb = $('#lkB', root), lv = $('#lkV', root);
    const upd = (w, msg, cl) => { lb.style.width = w + '%'; lb.style.background = w > 50 ? 'var(--hot)' : 'var(--cold)'; lv.className = 'verdict ' + (cl || ''); lv.textContent = msg; };
    upd(0, 'Cửa đang mở được.');
    $('#lkOn', root).onclick = () => { clearInterval(tm); lk = 0; tm = setInterval(() => { if (!document.body.contains(lb)) { clearInterval(tm); return; } lk = Math.min(100, lk + 10); upd(lk, lk >= 100 ? '🔒 Lưỡng kim đã nóng, chốt khóa cửa.' : 'Lưỡng kim đang nóng lên…', lk >= 100 ? 'ok' : ''); if (lk >= 100) clearInterval(tm); }, 150); };
    $('#lkOff', root).onclick = () => { clearInterval(tm); tm = setInterval(() => { if (!document.body.contains(lb)) { clearInterval(tm); return; } lk = Math.max(0, lk - 4); upd(lk, lk > 0 ? 'Lưỡng kim nguội dần (~3–5 phút thật)… chưa mở được cửa.' : '🔓 Đã mở khóa, cửa mở được.', lk > 0 ? 'bad' : 'ok'); if (lk <= 0) clearInterval(tm); }, 150); };
    const ts = $('#tSet', root), tv = $('#tV', root); tv.textContent = ts.value + ' °C';
    let temp = 20, ht;
    const td = () => { $('#tG', root).innerHTML = U.gauge ? U.gauge(temp, { min: 0, max: 100, step: 1, unit: '°C', good: [+ts.value - 3, +ts.value + 3] }) : `<b>${temp}°C</b>`; const r = $('#tR', root), on = temp < +ts.value; r.className = 'verdict ' + (on ? '' : 'ok'); r.textContent = on ? `Nước ${temp.toFixed(0)} °C < ${ts.value} °C → bo ĐÓNG sợi đốt.` : `Nước đạt ${ts.value} °C → bo NGẮT sợi đốt.`; };
    ts.oninput = () => { tv.textContent = ts.value + ' °C'; td(); }; td();
    $('#tGo', root).onclick = () => { clearInterval(ht); temp = 20; td(); ht = setInterval(() => { if (!document.body.contains(ts)) { clearInterval(ht); return; } temp += 2; if (temp >= +ts.value) { temp = +ts.value; clearInterval(ht); } td(); }, 90); };
    U.tabset($('#mTabs', root), Object.entries(MC).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#mPanel', root).innerHTML = `<h3>${MC[id][0]}</h3><p style="margin:0">${MC[id][1]}</p>`; });
  }

  const flashcards = [
    { f: 'Công tắc an toàn dùng để?', b: 'Chỉ cho máy chạy khi cửa đóng.', tag: 'An toàn' },
    { f: 'Có mấy kiểu công tắc cửa?', b: '3: từ, cơ, khóa lưỡng kim.', tag: 'An toàn' },
    { f: 'Công tắc từ hoạt động nhờ?', b: 'Nam châm trên cửa.', tag: 'An toàn' },
    { f: 'Khóa lưỡng kim làm việc thế nào?', b: 'Có điện → lưỡng kim nóng, cong, chốt khóa.', tag: 'An toàn' },
    { f: 'Ngắt điện khóa cửa mở sau?', b: '~3 – 5 phút.', tag: 'An toàn' },
    { f: 'Vì sao cửa không mở ngay?', b: 'Tránh mở khi lồng còn quay.', tag: 'An toàn' },
    { f: 'Khống chế nhiệt độ dải?', b: '20 – 90 °C.', tag: 'Nhiệt' },
    { f: 'Cảm biến nhiệt?', b: 'NTC (điện trở nhiệt âm).', tag: 'Nhiệt' },
    { f: 'Nước thấp hơn mức đặt?', b: 'Bo đóng sợi đốt.', tag: 'Nhiệt' },
    { f: 'Nước đạt mức đặt?', b: 'Bo ngắt sợi đốt.', tag: 'Nhiệt' },
    { f: 'Mạch điều khiển cơ?', b: 'Đồng hồ chương trình, cam.', tag: 'Điều khiển' },
    { f: 'Mạch điều khiển điện tử?', b: 'Vi điều khiển, rơle, triac.', tag: 'Điều khiển' },
    { f: 'Hỏng điều khiển cơ?', b: 'Tiếp điểm cháy, bánh răng kẹt.', tag: 'Điều khiển' },
    { f: 'Hỏng điều khiển điện tử?', b: 'Ẩm, tụ, triac, rơle.', tag: 'Điều khiển' },
    { f: 'Trình tự đầu chu trình?', b: 'Cửa đóng → khóa → cấp nước.', tag: 'Chu trình' },
    { f: 'Sau cấp nước đủ?', b: 'Đun (nếu cần) → giặt.', tag: 'Chu trình' },
    { f: 'Cuối chu trình?', b: 'Xả → vắt → báo xong → mở khóa.', tag: 'Chu trình' },
    { f: 'Công tắc cơ hay hỏng?', b: 'Chốt, tiếp điểm.', tag: 'An toàn' },
    { f: 'Công tắc từ ngắt khi?', b: 'Cửa mở (nam châm rời).', tag: 'An toàn' },
    { f: 'Vì sao cần khống chế nhiệt?', b: 'Tiết kiệm điện, bảo vệ đồ, đúng chế độ.', tag: 'Nhiệt' },
    { f: 'Nhiệt độ cao nhất?', b: '90 °C.', tag: 'Nhiệt' },
    { f: 'Nhiệt độ thấp nhất?', b: '20 °C.', tag: 'Nhiệt' },
    { f: 'Vì sao cần cảm biến nhiệt?', b: 'Để bo biết khi nào ngắt sợi đốt.', tag: 'Nhiệt' },
    { f: 'Lưỡng kim là?', b: 'Hai kim loại giãn nở khác nhau, nóng thì cong.', tag: 'An toàn' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Công tắc an toàn cho máy chạy khi?', ['Cửa đóng', 'Cửa mở', 'Hết nước', 'Có gió'], 0, 'An toàn.'),
    Q('Có mấy kiểu công tắc cửa?', ['3', '1', '5', '10'], 0, 'Từ, cơ, lưỡng kim.'),
    Q('Công tắc từ nhờ?', ['Nam châm', 'Dây curoa', 'Lò xo', 'Gió'], 0, 'Trên cửa.'),
    Q('Lưỡng kim có điện thì?', ['Nóng, cong, khóa chốt', 'Nguội', 'Đứng yên', 'Nổ'], 0, 'Khóa cửa.'),
    Q('Ngắt điện, cửa mở sau?', ['~3–5 phút', 'Ngay', '1 giờ', 'Không bao giờ'], 0, 'Lưỡng kim nguội.'),
    Q('Vì sao cửa không mở ngay?', ['Tránh lồng còn quay', 'Hỏng', 'Hết nước', 'Tiết kiệm'], 0, 'An toàn.'),
    Q('Dải nhiệt độ?', ['20 – 90 °C', '0 – 10', '100 – 200', '–10 – 0'], 0, 'Chọn chế độ.'),
    Q('Cảm biến nhiệt?', ['NTC', 'Tụ', 'Cuộn', 'Phao'], 0, 'Điện trở nhiệt.'),
    Q('Nước thấp hơn mức đặt thì sợi đốt?', ['Đóng', 'Ngắt', 'Cháy', 'Hỏng'], 0, 'Đun.'),
    Q('Nước đạt mức đặt thì?', ['Ngắt sợi đốt', 'Tiếp tục đun', 'Xả', 'Quay'], 0, 'Dừng.'),
    Q('Điều khiển cơ là?', ['Đồng hồ chương trình', 'Vi xử lý', 'Wi-Fi', 'Cảm ứng'], 0, 'Cam + bánh răng.'),
    Q('Điều khiển điện tử là?', ['Vi điều khiển', 'Cam', 'Bánh răng', 'Chổi than'], 0, 'Bo mạch.'),
    Q('Điều khiển cơ hỏng ở?', ['Tiếp điểm, bánh răng', 'Phần mềm', 'Màn hình', 'Wi-Fi'], 0, 'Cơ khí.'),
    Q('Điều khiển điện tử hỏng do?', ['Ẩm, triac, tụ', 'Cam', 'Chổi than', 'Bánh răng'], 0, 'Điện tử.'),
    Q('Trình tự đúng?', ['Cửa đóng → cấp nước → giặt → vắt', 'Vắt → cấp nước', 'Giặt → khóa', 'Xả → khóa'], 0, 'Chu trình.'),
    Q('Công tắc cơ hay hỏng?', ['Chốt, tiếp điểm', 'Nam châm', 'Tụ', 'Cuộn'], 0, 'Cơ khí.'),
    Q('Công tắc từ ngắt khi?', ['Cửa mở', 'Cửa đóng', 'Hết nước', 'Nóng'], 0, 'Nam châm rời.'),
    Q('Lưỡng kim là gì?', ['2 kim loại giãn nở khác nhau', 'Nam châm', 'Tụ', 'Cuộn'], 0, 'Nóng thì cong.'),
    Q('Khóa cửa dùng để?', ['Giữ cửa khi chạy', 'Cấp nước', 'Đo nhiệt', 'Xả nước'], 0, 'An toàn.'),
    Q('Cảm biến nhiệt báo cho?', ['Bo mạch', 'Bơm', 'Van', 'Cửa'], 0, 'Điều khiển.'),
    Q('Giá trị thấp nhất nhiệt độ?', ['20 °C', '0 °C', '5 °C', '50 °C'], 0, 'Theo bài.'),
    Q('Giá trị cao nhất?', ['90 °C', '30 °C', '60 °C', '120 °C'], 0, 'Theo bài.'),
    Q('Cuối chu trình?', ['Vắt → báo xong → mở khóa', 'Cấp nước', 'Đun', 'Khóa cửa'], 0, 'Kết thúc.'),
    Q('Điều khiển điện tử nhận tín hiệu từ?', ['Cảm biến mức nước, nhiệt, cửa', 'Chỉ cửa', 'Chỉ nước', 'Không có'], 0, 'Đa tín hiệu.')
  ];
  const sort = {
    title: 'Phân loại thiết bị',
    buckets: [{ id: 'safe', name: 'Công tắc an toàn' }, { id: 'temp', name: 'Khống chế nhiệt' }, { id: 'ctrl', name: 'Mạch điều khiển' }],
    items: [
      { t: 'Nam châm trên cửa', b: 'safe' }, { t: 'Lưỡng kim khóa cửa', b: 'safe' }, { t: 'Mở sau 3–5 phút', b: 'safe' },
      { t: 'NTC đo nước', b: 'temp' }, { t: '20 – 90 °C', b: 'temp' }, { t: 'Đóng/ ngắt sợi đốt', b: 'temp' },
      { t: 'Đồng hồ chương trình', b: 'ctrl' }, { t: 'Vi điều khiển, triac', b: 'ctrl' }, { t: 'Cam và bánh răng', b: 'ctrl' }
    ]
  };
  const order = [
    { title: 'Chu trình tự động', intro: 'Sắp xếp theo thứ tự.', steps: ['Đóng cửa', 'Khóa cửa', 'Cấp nước đến đủ mực', 'Đun nước (nếu cần)', 'Giặt', 'Xả nước', 'Vắt', 'Báo xong, mở khóa'] },
    { title: 'Khóa cửa lưỡng kim', intro: 'Cơ chế.', steps: ['Cấp điện cho lưỡng kim', 'Lưỡng kim nóng lên', 'Lưỡng kim cong đẩy chốt', 'Cửa khóa', 'Ngắt điện', 'Nguội ~3–5 phút, mở khóa'] },
    { title: 'Khống chế nhiệt', intro: 'Đun nước.', steps: ['Chọn nhiệt độ 20–90 °C', 'NTC đo nhiệt nước', 'Bo so sánh với mức đặt', 'Thấp hơn → đóng sợi đốt', 'Đạt mức → ngắt sợi đốt', 'Giữ nhiệt'] }
  ];
  DL.register({
    cat: 'may-giat', id: 7, ready: true, title: 'Công tắc an toàn, nhiệt độ, mạch điều khiển', sub: 'Khóa cửa lưỡng kim, NTC, điều khiển cơ/ điện tử', minutes: 25,
    lead: 'Ba nhóm cuối của phần thiết bị điện máy giặt: công tắc an toàn khóa cửa, khống chế nhiệt độ nước 20–90 °C và mạch điều khiển cơ/ điện tử.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
