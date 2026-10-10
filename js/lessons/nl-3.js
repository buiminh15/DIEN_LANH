/* NGUYÊN LÝ LÀM LẠNH — BÀI 3: CÁC THIẾT BỊ PHỤ (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_3.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const AUX = {
    oil: ['Bình tách dầu', 'Giữa máy nén và thiết bị ngưng tụ (đường đẩy).',
      'Tách dầu ra khỏi hơi môi chất để dầu không bám vào mặt trong các thiết bị, làm giảm trao đổi nhiệt và năng suất lạnh.',
      'Hơi mang theo hạt dầu nhỏ → lớp ngăn dầu gom thành hạt lớn chảy xuống đáy → khi dầu đầy, phao nổi mở van, nhờ chênh áp dầu hồi về máy nén. Hơi sạch đi tiếp sang ngưng tụ.',
      'Máy nén thiếu dầu sẽ hỏng. (Điều hòa dân dụng dùng “bẫy dầu”: các đoạn ống cong chữ U để dầu đọng lại rồi hồi về máy nén.)'],
    dry: ['Phin sấy lọc', 'Sau thiết bị ngưng tụ, trước thiết bị tiết lưu.',
      'Lọc cặn bẩn và hút ẩm khỏi lỏng môi chất để chống tắc hệ thống.',
      'Lưới lọc giữ cặn bẩn; hạt hút ẩm (silicagel…) giữ hơi nước. Nếu có ẩm, ở nhiệt độ âm sau tiết lưu nước đóng băng gây tắc ẩm.',
      'Hệ thống lớn dùng phin lớn, hệ thống nhỏ như tủ lạnh dùng phin nhỏ.'],
    acc: ['Bầu tách lỏng', 'Cuối thiết bị bay hơi, trước đường hút về máy nén.',
      'Giữ lỏng môi chất lại, không cho lỏng về máy nén gây <b>va đập thủy lực</b> làm hỏng máy nén.',
      'Hỗn hợp vào bầu, lỏng rơi xuống đáy, hơi được hút ở phía trên cao. Lỏng đọng lại sẽ tự sôi (áp suất thấp). Có thể kết hợp <b>hồi nhiệt</b>: ống lỏng nóng chạy qua làm bay hết lỏng và làm quá lạnh gas lỏng trước tiết lưu.',
      'Hồi nhiệt giúp gas lỏng ngưng 100%, quá lạnh ở cuối dàn nóng, tăng năng suất lạnh.'],
    rev: ['Van đảo chiều', 'Trên máy điều hòa hai chiều (ít ở tủ lạnh).',
      'Đảo chiều tuần hoàn môi chất để đổi công dụng hai dàn: lúc làm lạnh, lúc sưởi ấm hoặc xả tuyết.',
      'Có 4 cửa: 1 từ đầu đẩy máy nén; 2 và 4 nối hai dàn; 3 về đường hút. Cuộn điện từ kéo piston đổi hướng thông giữa các cửa. Chạy lạnh: dàn trong là bay hơi, dàn ngoài là ngưng tụ. Chạy nóng thì ngược lại.',
      'Chi tiết hơn sẽ học ở phần máy điều hòa cục bộ.']
  };

  function learn() {
    return `
<section class="sec" id="s-aux" data-toc="1 · Thiết bị phụ">
  <div class="sec-n">Phần 1</div><h2>Thiết bị phụ là gì?</h2>
  <p>Ngoài 4 thiết bị chính, hệ thống còn có <b>thiết bị phụ</b> bổ sung chức năng và đáp ứng yêu cầu kỹ thuật. Một hệ thống có thể dùng một hoặc nhiều thiết bị phụ. Bấm để xem 4 thiết bị thường gặp:</p>
  <div id="aTabs"></div><article class="panel" id="aPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-pos" data-toc="2 · Vị trí lắp đặt">
  <div class="sec-n">Phần 2</div><h2>Vị trí trên vòng tuần hoàn</h2>
  <div class="stage"><svg viewBox="0 0 640 260" role="img" aria-label="Vị trí thiết bị phụ trên sơ đồ">
    <defs><marker id="ar3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker></defs>
    <g fill="none" stroke="var(--ink)" stroke-width="3" marker-end="url(#ar3)"><path d="M130 215H520"/><path d="M590 190V90"/><path d="M520 55H130"/><path d="M50 90V190"/></g>
    <g class="lbl" text-anchor="middle"><rect x="520" y="190" width="100" height="50" rx="9" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2.5"/><text x="570" y="220">Máy nén</text>
      <rect x="520" y="30" width="100" height="50" rx="9" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2.5"/><text x="570" y="60">Ngưng tụ</text>
      <rect x="20" y="30" width="100" height="50" rx="9" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2.5"/><text x="70" y="60">Tiết lưu</text>
      <rect x="20" y="190" width="100" height="50" rx="9" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2.5"/><text x="70" y="220">Bay hơi</text></g>
    <g id="auxMk"><circle id="m-oil" cx="610" cy="140" r="14"/><circle id="m-dry" cx="250" cy="55" r="14"/><circle id="m-acc" cx="250" cy="215" r="14"/><circle id="m-rev" cx="440" cy="215" r="14"/></g>
    <g class="fl" text-anchor="middle"><text x="610" y="170">bình tách dầu</text><text x="250" y="35">phin sấy lọc</text><text x="250" y="245">bầu tách lỏng</text><text x="440" y="245">van đảo chiều*</text></g></svg></div>
  <p class="muted">*Van đảo chiều chỉ có ở điều hòa hai chiều; nó nằm ở cụm máy nén, nối đường hút và đường đẩy với hai dàn.</p>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ</b><p><b>Dầu</b> → sau máy nén. <b>Lọc</b> → trước tiết lưu. <b>Lỏng</b> → trước máy nén. <b>Đảo chiều</b> → ở máy nén, đổi hướng gas.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="3 · Tóm tắt">
  <div class="sec-n">Phần 3</div><h2>Tóm tắt bài — 5 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Bình tách dầu: giữa máy nén và ngưng tụ, giữ dầu cho máy nén.</b></div></li>
    <li class="done"><div><b>Phin sấy lọc: trước tiết lưu, lọc cặn và hút ẩm, chống tắc.</b></div></li>
    <li class="done"><div><b>Bầu tách lỏng: trước máy nén, chống va đập thủy lực; có thể kết hợp hồi nhiệt.</b></div></li>
    <li class="done"><div><b>Van đảo chiều: điều hòa hai chiều, đổi vai trò hai dàn.</b></div></li>
    <li class="done"><div><b>Còn nhiều thiết bị phụ khác: van một chiều, van chặn…</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/3/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    const paint = id => ['oil', 'dry', 'acc', 'rev'].forEach(k => { const c = $('#m-' + k, root); c.setAttribute('fill', k === id ? 'var(--warm)' : 'var(--cold-tint)'); c.setAttribute('stroke', 'var(--ink)'); c.setAttribute('stroke-width', k === id ? 4 : 2); });
    U.tabset($('#aTabs', root), Object.entries(AUX).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => {
      const p = AUX[id]; paint(id);
      $('#aPanel', root).innerHTML = `<h3>${p[0]}</h3><dl class="kv"><dt>Vị trí</dt><dd>${p[1]}</dd><dt>Công dụng</dt><dd>${p[2]}</dd><dt>Nguyên lý</dt><dd>${p[3]}</dd><dt>Lưu ý</dt><dd>${p[4]}</dd></dl>`;
    });
  }

  const flashcards = [
    { f: 'Thiết bị phụ dùng để làm gì?', b: 'Bổ sung chức năng và đáp ứng yêu cầu kỹ thuật cho hệ thống.', tag: 'Chung' },
    { f: '4 thiết bị phụ thường gặp?', b: 'Bình tách dầu, phin sấy lọc, bầu tách lỏng, van đảo chiều.', tag: 'Chung' },
    { f: 'Bình tách dầu lắp ở đâu?', b: 'Giữa máy nén và thiết bị ngưng tụ.', tag: 'Tách dầu' },
    { f: 'Vì sao phải tách dầu khỏi hơi gas?', b: 'Dầu bám mặt trong thiết bị làm giảm dẫn nhiệt, giảm năng suất lạnh.', tag: 'Tách dầu' },
    { f: 'Dầu từ bình tách dầu về đâu?', b: 'Về máy nén nhờ phao và chênh áp.', tag: 'Tách dầu' },
    { f: 'Điều hòa dân dụng thay bình tách dầu bằng?', b: 'Bẫy dầu (đoạn ống cong).', tag: 'Tách dầu' },
    { f: 'Phin sấy lọc lắp ở đâu?', b: 'Sau ngưng tụ, trước tiết lưu.', tag: 'Phin sấy lọc' },
    { f: 'Phin sấy lọc có 2 công dụng?', b: 'Lọc cặn bẩn và hút ẩm.', tag: 'Phin sấy lọc' },
    { f: 'Ẩm trong hệ thống gây hậu quả?', b: 'Đóng băng sau tiết lưu, gây tắc ẩm.', tag: 'Phin sấy lọc' },
    { f: 'Vì sao phải lọc cặn trước tiết lưu?', b: 'Tiết lưu tiết diện nhỏ, dễ bị tắc.', tag: 'Phin sấy lọc' },
    { f: 'Bầu tách lỏng lắp ở đâu?', b: 'Cuối thiết bị bay hơi, trước đường hút về máy nén.', tag: 'Tách lỏng' },
    { f: 'Bầu tách lỏng giúp tránh hiện tượng gì?', b: 'Va đập thủy lực làm hỏng máy nén.', tag: 'Tách lỏng' },
    { f: 'Máy nén hút lỏng gây?', b: 'Va đập thủy lực, hỏng máy nén (máy nén chỉ nén hơi).', tag: 'Tách lỏng' },
    { f: 'Hồi nhiệt là gì?', b: 'Dùng nhiệt của lỏng nóng làm bay hết lỏng còn sót, đồng thời quá lạnh gas lỏng.', tag: 'Tách lỏng' },
    { f: 'Lợi ích của quá lạnh gas lỏng?', b: 'Gas ngưng 100%, năng suất lạnh cao hơn.', tag: 'Tách lỏng' },
    { f: 'Van đảo chiều dùng ở?', b: 'Điều hòa hai chiều (ít ở tủ lạnh).', tag: 'Đảo chiều' },
    { f: 'Công dụng van đảo chiều?', b: 'Đảo chiều tuần hoàn để đổi công dụng hai dàn: làm lạnh hoặc sưởi ấm/ xả tuyết.', tag: 'Đảo chiều' },
    { f: 'Chạy lạnh: dàn trong là?', b: 'Dàn bay hơi; dàn ngoài là ngưng tụ.', tag: 'Đảo chiều' },
    { f: 'Chạy nóng: dàn trong là?', b: 'Dàn ngưng tụ; dàn ngoài là bay hơi.', tag: 'Đảo chiều' },
    { f: 'Van đảo chiều có mấy cửa?', b: '4 cửa: đầu đẩy, hai dàn, đường hút về.', tag: 'Đảo chiều' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Thiết bị phụ có tác dụng?', ['Bổ sung chức năng, đáp ứng yêu cầu kỹ thuật', 'Thay máy nén', 'Thay tiết lưu', 'Không cần thiết'], 0, 'Bổ sung cho 4 thiết bị chính.'),
    Q('Bình tách dầu lắp giữa?', ['Máy nén và ngưng tụ', 'Ngưng tụ và tiết lưu', 'Bay hơi và máy nén', 'Tiết lưu và bay hơi'], 0, 'Trên đường đẩy.'),
    Q('Dầu bám vào dàn gây?', ['Giảm trao đổi nhiệt, giảm năng suất lạnh', 'Tăng năng suất', 'Giảm áp suất', 'Không ảnh hưởng'], 0, 'Dầu cản dẫn nhiệt.'),
    Q('Dầu trong bình tách dầu hồi về máy nén nhờ?', ['Phao và chênh áp', 'Quạt', 'Bơm nước', 'Tháp giải nhiệt'], 0, 'Phao mở van khi đầy dầu.'),
    Q('Bẫy dầu thường thấy ở?', ['Đường ống điều hòa dân dụng', 'Tủ lạnh', 'Máy bơm', 'Quạt'], 0, 'Đoạn cong chữ U.'),
    Q('Phin sấy lọc đặt trước?', ['Thiết bị tiết lưu', 'Máy nén', 'Dàn bay hơi', 'Van đảo chiều'], 0, 'Bảo vệ tiết lưu khỏi tắc.'),
    Q('Phin sấy lọc làm 2 việc?', ['Lọc cặn, hút ẩm', 'Nén, ngưng', 'Tách dầu, tách lỏng', 'Đảo chiều, tiết lưu'], 0, 'Cặn bẩn và hơi nước.'),
    Q('Tắc ẩm xảy ra ở?', ['Sau tiết lưu, nơi nhiệt độ âm', 'Đường đẩy', 'Trong máy nén', 'Ở dàn nóng'], 0, 'Nước đóng băng gây tắc.'),
    Q('Hệ thống nhỏ như tủ lạnh dùng?', ['Phin sấy lọc nhỏ', 'Bình tách dầu lớn', 'Tháp giải nhiệt', 'Van đảo chiều'], 0, 'Phin nhỏ.'),
    Q('Bầu tách lỏng đặt ở?', ['Đường hút về máy nén', 'Đường đẩy', 'Trước tiết lưu', 'Sau ngưng tụ'], 0, 'Cuối dàn bay hơi.'),
    Q('Va đập thủy lực xảy ra khi?', ['Máy nén hút phải lỏng', 'Máy nén hút hơi', 'Dàn nóng bám bụi', 'Gas thừa dầu'], 0, 'Lỏng không nén được.'),
    Q('Máy nén chỉ nén được?', ['Hơi', 'Lỏng', 'Nước', 'Dầu'], 0, 'Nên cần tách lỏng.'),
    Q('Lỏng đọng ở bầu tách lỏng sẽ?', ['Tự sôi vì áp suất thấp', 'Về máy nén', 'Đi qua tiết lưu', 'Đông đặc'], 0, 'Bay hơi dần rồi được hút.'),
    Q('Hồi nhiệt giúp?', ['Gas lỏng quá lạnh, năng suất cao hơn', 'Tăng ẩm', 'Giảm áp suất đẩy', 'Tăng dầu'], 0, 'Quá lạnh gas lỏng.'),
    Q('Van đảo chiều dùng ở?', ['Điều hòa hai chiều', 'Tủ lạnh gia đình thông thường', 'Quạt', 'Máy giặt'], 0, 'Đổi nóng/ lạnh.'),
    Q('Chạy chế độ lạnh thì dàn trong là?', ['Bay hơi', 'Ngưng tụ', 'Tiết lưu', 'Tách dầu'], 0, 'Thu nhiệt phòng.'),
    Q('Chạy chế độ sưởi thì dàn trong là?', ['Ngưng tụ', 'Bay hơi', 'Máy nén', 'Phin lọc'], 0, 'Tỏa nhiệt sưởi ấm.'),
    Q('Van đảo chiều có mấy cửa?', ['4', '2', '3', '6'], 0, 'Đẩy, hút và hai dàn.'),
    Q('Bầu tách lỏng bảo vệ?', ['Máy nén', 'Dàn nóng', 'Phin lọc', 'Ống mao'], 0, 'Tránh hút lỏng.'),
    Q('Thiết bị nào đặt sau máy nén để giữ dầu?', ['Bình tách dầu', 'Bầu tách lỏng', 'Phin sấy lọc', 'Van đảo chiều'], 0, 'Tách dầu khỏi hơi nén.')
  ];
  const sort = {
    title: 'Thiết bị phụ nào làm việc gì?',
    buckets: [{ id: 'oil', name: 'Bình tách dầu' }, { id: 'dry', name: 'Phin sấy lọc' }, { id: 'acc', name: 'Bầu tách lỏng' }, { id: 'rev', name: 'Van đảo chiều' }],
    items: [
      { t: 'Gom hạt dầu, hồi dầu về máy nén', b: 'oil' }, { t: 'Lắp sau máy nén', b: 'oil' },
      { t: 'Lọc cặn bẩn', b: 'dry' }, { t: 'Hút ẩm, chống tắc', b: 'dry' }, { t: 'Lắp trước tiết lưu', b: 'dry' },
      { t: 'Chống va đập thủy lực', b: 'acc' }, { t: 'Lắp ở đường hút về máy nén', b: 'acc' }, { t: 'Kết hợp hồi nhiệt', b: 'acc' },
      { t: 'Đổi chế độ lạnh – sưởi', b: 'rev' }, { t: 'Điều hòa hai chiều', b: 'rev' }
    ]
  };
  const order = [
    { title: 'Bình tách dầu hoạt động', intro: 'Từ hơi lẫn dầu đến hồi dầu.', steps: ['Hơi nén mang theo hạt dầu nhỏ vào bình', 'Lớp ngăn dầu gom thành hạt lớn', 'Dầu chảy xuống đáy bình', 'Dầu đầy làm phao nổi, mở van', 'Chênh áp đẩy dầu về máy nén', 'Hơi sạch đi sang ngưng tụ'] },
    { title: 'Bầu tách lỏng hoạt động', intro: 'Bảo vệ máy nén.', steps: ['Hỗn hợp lỏng và hơi ra khỏi dàn bay hơi', 'Vào bầu tách lỏng', 'Lỏng rơi xuống đáy', 'Lỏng tự sôi, bay hơi dần', 'Máy nén chỉ hút hơi ở phía trên'] },
    { title: 'Van đảo chiều: chạy lạnh', intro: 'Dòng gas khi làm lạnh.', steps: ['Máy nén đẩy hơi vào cửa 1', 'Hơi qua dàn ngoài tỏa nhiệt ngưng tụ', 'Lỏng qua tiết lưu vào dàn trong', 'Dàn trong thu nhiệt phòng để sôi', 'Hơi về cửa 3, trở lại máy nén'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 3, ready: true, title: 'Các thiết bị phụ', sub: 'Tách dầu, phin sấy lọc, tách lỏng, van đảo chiều', minutes: 20,
    lead: 'Các thiết bị phụ thường gặp: bình tách dầu, phin sấy lọc, bầu tách lỏng, van đảo chiều; chức năng, vị trí lắp đặt và nguyên lý của từng loại.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
