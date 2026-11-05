/* NGUYÊN LÝ LÀM LẠNH — BÀI 5: DẦU MÁY LẠNH VÀ CHẤT TẢI LẠNH (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_5.txt)
   Hình: dầu trong máy nén, màu dầu, vòng chất tải lạnh, thang điểm đông đặc có thanh trượt. */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const vn = x => String(x).replace('-', '−');

  // fp: nhiệt độ đông đặc (°C) theo bài giảng
  const BRINE = [
    { n: 'Nước (H₂O)', type: 'Vô cơ', fp: 0, use: 'Hệ lạnh dương: điều hòa trung tâm, bảo quản sản phẩm.', c: '' },
    { n: 'Nước muối NaCl 23%', type: 'Vô cơ', fp: -20, use: 'Hệ lạnh nhiệt độ thấp: máy làm kem, làm đá…', c: 'Pha 23% muối, 77% nước theo khối lượng.' },
    { n: 'Dung dịch CaCl₂ 29%', type: 'Vô cơ', fp: -51, use: 'Công nghiệp lạnh sâu: làm kem, làm đá…', c: 'Pha 29% theo khối lượng.' },
    { n: 'Cồn ethanol', type: 'Hữu cơ', fp: -115, use: 'Công nghiệp, nhiệt độ rất thấp.', c: 'Bài giảng nêu khoảng −115 °C với nồng độ phù hợp; dễ bay hơi nên hệ phải kín.' },
    { n: 'Cồn methanol', type: 'Hữu cơ', fp: -125, use: 'Công nghiệp, nhiệt độ rất thấp.', c: 'Rất độc: uống gây ngộ độc, dính mắt có thể mù. Hệ phải kín.' }
  ];
  const OILI = ['🤝', '🧊', '⚡', '🧱', '🕰️'];

  const COMP = `<svg viewBox="0 0 320 180" role="img" aria-label="Mặt cắt máy nén: dầu ở đáy được bơm lên bôi trơn pít-tông và trục">
    <rect x="30" y="14" width="260" height="154" rx="30" class="nl5-b"/>
    <rect x="132" y="26" width="56" height="64" rx="4" class="nl5-cyl"/>
    <rect class="nl5-pist" x="136" y="30" width="48" height="22" rx="3"/>
    <path d="M160 52V86" class="nl5-rod"/>
    <circle cx="160" cy="104" r="16" class="nl5-b"/><g class="nl5-spin" style="transform-origin:160px 104px"><path d="M160 90V118" stroke="var(--ink)" stroke-width="3"/><circle cx="160" cy="92" r="4" fill="var(--ink)"/></g>
    <rect x="34" y="136" width="252" height="28" rx="14" class="nl5-oil"/>
    <path class="nl5-up" d="M96 136V108Q96 100 112 100H140"/><path class="nl5-up" d="M224 136V108Q224 100 208 100H180"/>
    ${[0, 1, 2].map(i => `<circle class="nl5-dr" style="animation-delay:${i * .5}s" cx="${146 + i * 14}" cy="66" r="2.6"/>`).join('')}
    <text class="nl5-s" x="160" y="156" text-anchor="middle" style="fill:var(--ink)">dầu ở đáy block</text>
    <text class="nl5-s" x="198" y="46">pít-tông</text><text class="nl5-s" x="184" y="128">trục khuỷu</text>
    <text class="nl5-s" x="46" y="94">dầu theo gas</text><text class="nl5-s" x="46" y="106">hồi về đáy</text></svg>`;

  const VIAL = (x, fill, op, lbl, sub, ok) => `<g transform="translate(${x} 0)"><path d="M26 10H54V24L66 38V122Q66 132 56 132H24Q14 132 14 122V38L26 24Z" class="nl5-glass"/><path d="M16 60H64V122Q64 130 56 130H24Q16 130 16 122Z" fill="${fill}" opacity="${op}"/><path d="M26 10H54" class="nl5-cap"/>
    <text class="nl5-t" x="40" y="156" text-anchor="middle">${lbl}</text><text class="nl5-s" x="40" y="172" text-anchor="middle" style="fill:var(--${ok ? 'ok' : 'bad'})">${sub}</text></g>`;
  const VIALS = `<svg viewBox="0 0 440 180" role="img" aria-label="Ba lọ dầu: vàng nhạt, trong, và đen có muội">
    ${VIAL(10, '#E3CF7A', .95, 'Vàng nhạt', 'gas có Clo', true)}${VIAL(160, 'var(--cold-tint2)', .9, 'Trong', 'gas HFC (có thể hơi vàng)', true)}${VIAL(310, '#1C1815', .96, 'Đen, có muội', 'block có vấn đề', false)}</svg>`;

  const LOOP = `<svg viewBox="0 0 640 170" role="img" aria-label="Chất tải lạnh chảy vòng giữa dàn bay hơi và vật cần làm lạnh">
    <rect x="10" y="40" width="170" height="90" rx="12" class="nl5-bx cold"/><text class="nl5-t" x="95" y="80" text-anchor="middle">Dàn bay hơi</text><text class="nl5-s" x="95" y="100" text-anchor="middle">gas sôi, thu nhiệt</text>
    <rect x="460" y="40" width="170" height="90" rx="12" class="nl5-bx hot"/><text class="nl5-t" x="545" y="80" text-anchor="middle">Vật cần làm lạnh</text><text class="nl5-s" x="545" y="100" text-anchor="middle">nước, kem, kho lạnh…</text>
    <path class="nl5-fl cold" d="M184 62H456" marker-end="url(#nl5a)"/><path class="nl5-fl hot" d="M456 108H184" marker-end="url(#nl5b)"/>
    <defs><marker id="nl5a" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--cold)"/></marker><marker id="nl5b" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--hot)"/></marker></defs>
    <text class="nl5-s" x="320" y="50" text-anchor="middle" style="fill:var(--cold)">chất tải lạnh đã lạnh →</text><text class="nl5-s" x="320" y="132" text-anchor="middle" style="fill:var(--hot)">← chất tải lạnh đã nhận nhiệt</text>
    <text class="nl5-s" x="320" y="156" text-anchor="middle">Nhiệt đi: vật → chất tải lạnh → gas</text></svg>`;

  function learn() {
    return `
<section class="sec" id="s-oil" data-toc="1 · Dầu máy lạnh">
  <div class="sec-n">Phần 1</div><h2>Dầu máy lạnh</h2>
  <p><b>Dầu máy lạnh</b> dùng cho máy nén để <b>bôi trơn và làm mát</b> các chi tiết chuyển động. Máy nén chạy lâu dài, tiếp xúc gas, đồng, nóng và lạnh, nên dầu phải có 5 tính chất:</p>
  <div class="nl5-split"><div class="nl4-fig">${COMP}</div>
    <div class="nl5-oc">${Object.values(OIL).map((p, i) => `<article class="nl4-pc"><span class="nl4-ic" aria-hidden="true">${OILI[i]}</span><h3>${p[0]}</h3><p>${p[1]}</p></article>`).join('')}</div></div>
</section>

<section class="sec" id="s-note" data-toc="2 · Lưu ý dùng dầu">
  <div class="sec-n">Phần 2</div><h2>Lưu ý khi chọn và thay dầu</h2>
  <p>Màu dầu cho biết nhiều điều. Nhìn lọ dầu:</p>
  <div class="nl4-fig nl5-vials">${VIALS}</div>
  <div class="grid2" style="margin-top:16px">
    <div class="panel hotc"><h3>Dầu phải hợp với gas</h3><p style="margin:0">Dầu không phù hợp gas sẽ phản ứng với gas, gây hỏng và <b>không lạnh</b>. Nhìn nhãn trên block để biết gas và loại dầu.</p></div>
    <div class="panel warm"><h3>Khi nào thay dầu?</h3><p style="margin:0">Hệ thống chạy bình thường <b>không thay dầu định kỳ</b> (dầu lạnh độ nhớt cao, tiêu hao ít). Chỉ thay khi sửa chữa cần thiết hoặc đổi sang gas khác không tương thích. Thừa hay thiếu dầu đều làm giảm hiệu quả làm lạnh.</p></div>
  </div>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Dầu cũ hỏng thì phải xử lý thế nào?</b><p>Với gas HFC (R134a), dầu tự hút ẩm. Hệ thống bị hở lâu ngày phải tách ẩm khỏi dầu hoặc <b>thay dầu, vệ sinh sạch toàn bộ</b> rồi mới hút chân không, nạp gas. Không trộn dầu mới với dầu cũ đã hỏng.</p></div></div>
  <div class="callout"><span class="ic">🌬️</span><div><b class="t">Vì sao điều hòa hay chết máy nén do thiếu dầu?</b><p>Gas R22 không hòa tan hoàn toàn với dầu; dàn ngoài thường đặt cao hơn dàn trong nên dầu theo gas lên dàn khó hồi về, đặc biệt khi nạp thừa gas hoặc ống không có bẫy dầu. Vì vậy cần kiểm tra, bổ sung hoặc thay dầu khi bảo dưỡng.</p></div></div>
</section>

<section class="sec" id="s-brine" data-toc="3 · Chất tải lạnh">
  <div class="sec-n">Phần 3</div><h2>Chất tải lạnh</h2>
  <p><b>Chất tải lạnh</b> là chất lỏng trung gian: nhận nhiệt của vật cần làm lạnh rồi chuyển cho thiết bị bay hơi. Ví dụ: nước trong Chiller, nước muối trong máy làm kem. Có hai nhóm: <b>vô cơ</b> (nước, nước muối) và <b>hữu cơ</b> (cồn).</p>
  <div class="stage nl4-fig" style="padding:8px">${LOOP}</div>
  <p style="margin-top:14px"><b>Yêu cầu:</b> nhiệt độ đông đặc thấp hơn nhiệt độ bay hơi của gas; khó bay hơi ở nhiệt độ thường; độ nhớt thấp để giảm trở lực; khối lượng riêng nhỏ; không phân hủy; không cháy nổ, không độc; không ảnh hưởng sản phẩm; rẻ, dễ kiếm; dẫn nhiệt tốt; không ăn mòn.</p>
  <div class="stage nl4-chart"><h3>Chọn chất tải lạnh theo nhiệt độ làm việc</h3>
    <label class="row" style="gap:10px">Nhiệt độ cần <input id="bT" type="range" min="-60" max="10" step="1" value="-10" style="width:min(260px,60vw)" aria-label="Nhiệt độ làm việc"> <b id="bV"></b></label>
    <div class="nl4-scroll"><div id="bChart"></div></div>
    <div class="verdict" id="bVd" aria-live="polite" style="margin-top:8px"></div>
    <div class="nl1-legend"><span><i style="background:var(--ok)"></i> dùng được (đông đặc thấp hơn ít nhất 5 °C)</span><span><i style="background:var(--bad)"></i> không hợp</span><span><i style="background:var(--warm);opacity:.5"></i> vùng đệm 5 °C</span></div></div>
  <div class="callout"><span class="ic">🧪</span><div><b class="t">Cồn chống ẩm trong hệ thống</b><p>Thợ điện lạnh dùng một lượng nhỏ (<b>2 – 3 cc</b>) cồn nồng độ cao (~99,9°) cho vào hệ thống để cồn hòa tan nước, tránh tắc ẩm. Nhưng cồn ăn mòn vật liệu nên không dùng nhiều.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Dầu lạnh bôi trơn, làm mát; hòa tan gas, không đông đặc, không dẫn điện, nhớt cao.</b></div></li>
    <li class="done"><div><b>Dầu phải đúng loại gas; đổi gas cần xem lại dầu.</b></div></li>
    <li class="done"><div><b>Hệ chạy bình thường: không thay dầu định kỳ.</b></div></li>
    <li class="done"><div><b>Chất tải lạnh: chất lỏng trung gian, đông đặc thấp, an toàn, rẻ.</b></div></li>
    <li class="done"><div><b>Nước 0 °C; NaCl 23% → −20 °C; CaCl₂ 29% → −51 °C.</b></div></li>
    <li class="done"><div><b>Cồn đông đặc rất thấp nhưng dễ bay hơi; methanol độc.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/5/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const OIL = {
    sol: ['Hòa tan với gas', 'Gas phải hòa tan dầu (và ngược lại), nếu không dầu bị giữ lại ở dàn gây tắc dầu, máy nén thiếu dầu.'],
    low: ['Không đông đặc', 'Không đông đặc ở nhiệt độ làm việc. Tủ lạnh 4 sao có thể xuống khoảng −30 °C; dầu đông đặc thì không bôi trơn được, tắc van, hỏng máy nén.'],
    ins: ['Không dẫn điện', 'Cuộn dây điện của block ngâm hoặc bị văng dầu nên dầu phải cách điện.'],
    stb: ['Bền vững, không ăn mòn', 'Không bị phân hủy, không ăn mòn vật liệu chế tạo máy.'],
    vis: ['Độ nhớt cao, tiêu hao ít', 'Không cần thay định kỳ như dầu xe máy; không cháy tạo muội đen. Dầu bị đen thường báo block có vấn đề.']
  };

  function mount(root) {
    const sl = $('#bT', root), rows = BRINE, rh = 44, X = t => 200 + (t + 130) / 140 * 400;
    const draw = () => {
      const t = +sl.value; $('#bV', root).textContent = vn(t) + ' °C';
      let s = `<svg viewBox="0 0 640 ${rows.length * rh + 42}" role="img" aria-label="Điểm đông đặc của các chất tải lạnh so với nhiệt độ làm việc">`;
      for (let k = -120; k <= 0; k += 20) s += `<path d="M${X(k)} 26V${rows.length * rh + 34}" class="nl4-gl"/><text class="nl4-s" x="${X(k)}" y="16" text-anchor="middle">${vn(k)}</text>`;
      s += `<rect x="${X(t - 5)}" y="24" width="${X(t) - X(t - 5)}" height="${rows.length * rh + 12}" fill="var(--warm)" opacity=".35"/>`;
      rows.forEach((b, i) => {
        const ok = b.fp < t - 5, y = 34 + i * rh;
        s += `<g><text class="nl4-t" x="188" y="${y + 24}" text-anchor="end">${b.n}</text><path d="M${X(b.fp)} ${y + 18}H${X(10)}" class="nl4-tr"/>
          <circle cx="${X(b.fp)}" cy="${y + 18}" r="9" fill="var(--${ok ? 'ok' : 'bad'})" stroke="var(--ink)" stroke-width="2"/>
          <text class="nl4-s" x="${X(b.fp) + 14}" y="${y + 14}">${vn(b.fp)} °C</text></g>`;
      });
      s += `<path d="M${X(t)} 24V${rows.length * rh + 36}" class="nl4-tl"/></svg>`;
      $('#bChart', root).innerHTML = s;
      const okL = rows.filter(b => b.fp < t - 5);
      const v = $('#bVd', root); v.className = 'verdict ' + (okL.length ? 'ok' : 'bad');
      v.innerHTML = okL.length ? `Ở <b>${vn(t)} °C</b> dùng được: ${okL.map(b => `<b>${b.n}</b> (${b.use.replace(/\.$/, '')})`).join('; ')}.` : 'Không chất nào đủ an toàn ở nhiệt độ này.';
    };
    sl.oninput = draw; draw();
  }

  const flashcards = [
    { f: 'Dầu máy lạnh là gì?', b: 'Dầu dùng cho máy nén trong hệ thống làm lạnh.', tag: 'Dầu lạnh' },
    { f: 'Dầu lạnh có nhiệm vụ?', b: 'Bôi trơn và làm mát chi tiết chuyển động.', tag: 'Dầu lạnh' },
    { f: 'Vì sao dầu phải hòa tan với gas?', b: 'Nếu không, dầu bị giữ lại ở dàn gây tắc dầu, máy nén thiếu dầu.', tag: 'Dầu lạnh' },
    { f: 'Vì sao dầu không được đông đặc ở nhiệt độ làm việc?', b: 'Đông đặc thì mất bôi trơn, tắc, hỏng máy.', tag: 'Dầu lạnh' },
    { f: 'Dầu lạnh có dẫn điện không?', b: 'Không (cuộn dây ngâm trong dầu).', tag: 'Dầu lạnh' },
    { f: 'Dầu lạnh cần thay định kỳ không?', b: 'Không, vì độ nhớt cao, tiêu hao ít, không cháy muội.', tag: 'Dầu lạnh' },
    { f: 'Dầu đen, có muội báo hiệu?', b: 'Block có vấn đề (quá nhiệt, phản ứng gas – dầu).', tag: 'Dầu lạnh' },
    { f: 'Dầu dùng cho gas có Clo thường có màu?', b: 'Vàng nhạt.', tag: 'Dầu lạnh' },
    { f: 'Dầu dùng cho gas không Clo (HFC) thường?', b: 'Trong, một số hơi vàng nhạt.', tag: 'Dầu lạnh' },
    { f: 'Khi nào phải thay dầu?', b: 'Khi sửa chữa cần thiết, đổi gas không tương thích, dầu hỏng/ nhiễm ẩm.', tag: 'Thay dầu' },
    { f: 'Thừa hay thiếu dầu thì sao?', b: 'Đều làm giảm hiệu quả làm lạnh.', tag: 'Thay dầu' },
    { f: 'Có trộn dầu mới với dầu cũ đã hỏng không?', b: 'Không; phải vệ sinh sạch dầu hỏng trước.', tag: 'Thay dầu' },
    { f: 'Điều hòa R22 chết máy nén do thiếu dầu vì?', b: 'R22 không hòa tan hoàn toàn dầu; dầu lên dàn khó hồi về.', tag: 'Thay dầu' },
    { f: 'Chất tải lạnh là gì?', b: 'Chất lỏng trung gian nhận nhiệt của đối tượng cần lạnh, chuyển cho thiết bị bay hơi.', tag: 'Tải lạnh' },
    { f: 'Hai nhóm chất tải lạnh?', b: 'Vô cơ (nước, nước muối) và hữu cơ (cồn).', tag: 'Tải lạnh' },
    { f: 'Yêu cầu về nhiệt độ đông đặc của chất tải lạnh?', b: 'Thấp hơn nhiệt độ bay hơi của gas.', tag: 'Tải lạnh' },
    { f: 'Nước dùng làm chất tải lạnh khi nào?', b: 'Hệ lạnh dương (đông đặc ở 0 °C).', tag: 'Tải lạnh' },
    { f: 'NaCl 23% đông đặc ở?', b: '−20 °C.', tag: 'Tải lạnh' },
    { f: 'CaCl₂ 29% đông đặc ở?', b: '−51 °C.', tag: 'Tải lạnh' },
    { f: 'Nước muối thường dùng ở?', b: 'Máy làm kem, làm đá.', tag: 'Tải lạnh' },
    { f: 'Chất tải lạnh hữu cơ ví dụ?', b: 'Cồn ethanol, methanol.', tag: 'Tải lạnh' },
    { f: 'Methanol nguy hiểm vì?', b: 'Rất độc; uống gây ngộ độc, dính mắt có thể mù.', tag: 'Tải lạnh' },
    { f: 'Nhược điểm của cồn làm tải lạnh?', b: 'Dễ bay hơi ở nhiệt độ môi trường, hệ phải kín; ăn mòn nhẹ.', tag: 'Tải lạnh' },
    { f: 'Dùng cồn chống ẩm bao nhiêu?', b: 'Khoảng 2 – 3 cc cồn ~99,9°; không dùng nhiều vì ăn mòn.', tag: 'Tải lạnh' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Dầu máy lạnh dùng cho?', ['Máy nén hệ thống lạnh', 'Xe máy', 'Máy khâu', 'Biến thế'], 0, 'Đúng định nghĩa.'),
    Q('Nhiệm vụ của dầu lạnh?', ['Bôi trơn và làm mát', 'Tạo lạnh', 'Hút ẩm', 'Tăng áp'], 0, 'Chi tiết chuyển động.'),
    Q('Gas và dầu không hòa tan sẽ gây?', ['Tắc dầu', 'Tăng năng suất', 'Giảm điện năng', 'Không sao'], 0, 'Dầu bị giữ ở dàn.'),
    Q('Tủ lạnh 4 sao có thể xuống tới?', ['Khoảng −30 °C', '+10 °C', '0 °C', '+25 °C'], 0, 'Dầu không được đông đặc ở nhiệt độ đó.'),
    Q('Dầu lạnh khác dầu xe máy ở chỗ?', ['Không cần thay định kỳ', 'Phải thay 2000 km', 'Dẫn điện', 'Dễ cháy muội'], 0, 'Nhớt cao, tiêu hao ít.'),
    Q('Dầu đen có muội báo hiệu?', ['Block có vấn đề', 'Dầu mới', 'Gas đủ', 'Phin lọc tốt'], 0, 'Quá nhiệt, phản ứng dầu – gas.'),
    Q('Dầu phải hợp với?', ['Loại gas đang dùng', 'Màu vỏ block', 'Hãng tủ', 'Loại ổ cắm'], 0, 'Dầu sai sinh phản ứng.'),
    Q('Gas có Clo thường dùng dầu?', ['Vàng nhạt', 'Trong suốt tuyệt đối', 'Đen', 'Đỏ'], 0, 'Theo phân loại bài.'),
    Q('Dầu cho gas R134a có đặc điểm?', ['Dễ hút ẩm', 'Không hút ẩm', 'Dẫn điện', 'Đông đặc ở 0 °C'], 0, 'Polyester.'),
    Q('Hệ thống bị hở lâu cần?', ['Tách ẩm/ thay dầu trước khi nạp gas', 'Nạp gas luôn', 'Thêm cồn nhiều', 'Bỏ qua'], 0, 'Tránh axit hóa dầu.'),
    Q('Điều hòa R22 hay chết máy nén do?', ['Thiếu dầu', 'Thừa dầu', 'Quá lạnh', 'Mất điện'], 0, 'Dầu khó hồi về.'),
    Q('Thừa dầu hay thiếu dầu đều?', ['Ảnh hưởng làm lạnh', 'Không ảnh hưởng', 'Tăng năng suất', 'Giảm điện'], 0, 'Theo bài.'),
    Q('Chất tải lạnh là?', ['Chất lỏng trung gian', 'Máy nén', 'Gas', 'Dầu'], 0, 'Nhận nhiệt của đối tượng, chuyển cho bay hơi.'),
    Q('Chất tải lạnh vô cơ gồm?', ['Nước, nước muối', 'Cồn', 'Dầu', 'Gas'], 0, 'Nhóm vô cơ.'),
    Q('Chất tải lạnh hữu cơ gồm?', ['Cồn ethanol, methanol', 'Nước', 'NaCl', 'CaCl₂'], 0, 'Nhóm hữu cơ.'),
    Q('Nước dùng làm chất tải lạnh vì đông đặc ở 0 °C nên chỉ dùng cho?', ['Hệ lạnh dương', 'Lạnh sâu −30 °C', 'Làm đá', 'Làm kem'], 0, 'Không được xuống dưới 0 °C.'),
    Q('NaCl 23% đông đặc ở?', ['−20 °C', '0 °C', '−51 °C', '−115 °C'], 0, 'Theo bài.'),
    Q('CaCl₂ 29% đông đặc ở?', ['−51 °C', '−20 °C', '0 °C', '−10 °C'], 0, 'Theo bài.'),
    Q('Chất nào rất độc, dính mắt có thể mù?', ['Methanol', 'Nước muối', 'Nước', 'CaCl₂'], 0, 'Nguy hiểm.'),
    Q('Nhược điểm chất tải lạnh là cồn?', ['Dễ bay hơi, hệ phải kín', 'Đông đặc cao', 'Không dẫn nhiệt', 'Quá rẻ'], 0, 'Sôi ở nhiệt độ thấp.'),
    Q('Cồn chống ẩm trong hệ thống dùng khoảng?', ['2 – 3 cc', '500 ml', '1 lít', 'Đổ đầy'], 0, 'Dùng ít vì ăn mòn.'),
    Q('Yêu cầu của chất tải lạnh?', ['Đông đặc thấp, an toàn, rẻ, dẫn nhiệt tốt', 'Dễ cháy', 'Độc', 'Ăn mòn'], 0, 'Tổng hợp tính chất.'),
    Q('Vì sao dầu lạnh không cần thay định kỳ?', ['Độ nhớt cao, tiêu hao ít', 'Dầu rẻ', 'Không dùng dầu', 'Dầu tự sinh ra'], 0, 'Theo bài.')
  ];
  const sort = {
    title: 'Dầu hay chất tải lạnh?',
    buckets: [{ id: 'oil', name: 'Dầu máy lạnh' }, { id: 'inorg', name: 'Tải lạnh vô cơ' }, { id: 'org', name: 'Tải lạnh hữu cơ' }],
    items: [
      { t: 'Bôi trơn, làm mát block', b: 'oil' }, { t: 'Phải hợp với loại gas', b: 'oil' }, { t: 'Không cần thay định kỳ', b: 'oil' },
      { t: 'Nước (hệ lạnh dương)', b: 'inorg' }, { t: 'Nước muối NaCl', b: 'inorg' }, { t: 'Dung dịch CaCl₂', b: 'inorg' },
      { t: 'Cồn ethanol', b: 'org' }, { t: 'Cồn methanol (độc)', b: 'org' }
    ]
  };
  const order = [
    { title: 'Sửa chữa hệ thống R134a bị hở lâu', intro: 'Bảo vệ dầu và máy nén.', steps: ['Kiểm tra dầu có ẩm/ axit', 'Xả hết dầu hỏng, vệ sinh sạch hệ thống', 'Thay dầu mới đúng loại', 'Sửa chữa, hàn kín', 'Hút chân không', 'Nạp gas đúng lượng'] },
    { title: 'Chọn chất tải lạnh theo nhiệt độ giảm dần', intro: 'Từ chất đông đặc cao đến thấp.', steps: ['Nước (0 °C)', 'Nước muối NaCl 23% (−20 °C)', 'Dung dịch CaCl₂ 29% (−51 °C)', 'Cồn ethanol (khoảng −115 °C)'] },
    { title: 'Vai trò chất tải lạnh', intro: 'Chuyển nhiệt qua chất trung gian.', steps: ['Sản phẩm/ không gian có nhiệt độ cao', 'Chất tải lạnh nhận nhiệt, nóng lên', 'Chất tải lạnh được bơm tới dàn bay hơi', 'Gas sôi thu nhiệt, chất tải lạnh nguội đi', 'Chất tải lạnh lạnh quay lại làm lạnh sản phẩm'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 5, ready: true, title: 'Dầu máy lạnh và chất tải lạnh', sub: 'Tính chất dầu, khi nào thay, nước muối, cồn', minutes: 20,
    lead: 'Dầu máy lạnh: nhiệm vụ, tính chất, cách chọn và thay; chất tải lạnh vô cơ (nước, nước muối) và hữu cơ (cồn) với nhiệt độ đông đặc của từng loại.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
