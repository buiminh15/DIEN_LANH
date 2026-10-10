/* NGUYÊN LÝ LÀM LẠNH — BÀI 7: KỸ THUẬT GIA CÔNG ỐNG (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_7.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const f1 = x => (Math.round(x * 10) / 10).toString().replace('.', ',');

  // đường kính ống đồng: [inch, mm kẹp, nhô cao khỏi mặt thước kẹp (mm)]
  const TUBE = [['1/4"', 6.4, .5], ['5/16"', 7.9, .5], ['3/8"', 9.5, .5], ['1/2"', 12.7, .5], ['5/8"', 15.9, .5], ['3/4"', 19.1, 1]];
  const FLARE_BAD = {
    ok: ['Mép loe đạt', 'ok', 'Mép loe <b>tròn, nhẵn, đều</b> xung quanh, không xước, không quá to, không quá nhỏ, dày mỏng đồng đều.', 'Lắp rắc co được, kín.'],
    skew: ['Mép loe bị lệch', 'bad', 'Một bên cao, một bên thấp.', 'Nguyên nhân: ống chưa được duỗi thẳng, cắt không vuông góc, kẹp ống không vuông góc. Cắt lại và loe lại.'],
    crack: ['Mép loe bị nứt', 'bad', 'Mép loe bị nứt ngang hoặc rách.', 'Nguyên nhân: loe sai kích thước (thước kẹp không phù hợp ống), hoặc đồng bị cứng/ loe quá mạnh. Cắt bỏ đoạn hỏng, loe lại.'],
    thick: ['Dày mỏng không đều', 'bad', 'Một bên mép dày, một bên mỏng.', 'Nguyên nhân: kẹp/ khóa vít thước kẹp chưa chuẩn, ống bị nghiêng. Chỉnh chặt vít, kẹp lại.'],
    size: ['Mép loe to/ nhỏ quá', 'bad', 'Loe vượt hoặc chưa tới mép trong của rắc co.', 'Nguyên nhân: ống nhô cao quá hoặc thấp quá so với thước kẹp. Kiểm tra mép loe phải <b>lọt vào trong ren rắc co</b> nhưng không chạm ren.']
  };
  const TOOLS = {
    flare: ['Bộ loe ống lệch tâm', 'Gồm 2 thước kẹp (hệ mét và hệ inch), dao cắt ống, dao nạo ba via và côn loe. Tay quay vừa khóa chặt thước kẹp vừa quay côn loe ép lên ống tạo mép loe.'],
    swage: ['Bộ nong/ loe đồng tâm', 'Thước kẹp, các đầu nong (6, 8, 10, 12, 16, 19…), tay khóa. Nong ống để lồng đoạn ống nhỏ vào ống lớn rồi hàn (mối nối cố định). Dùng được cho điều hòa công nghiệp, không cần nạo ba via.'],
    bend: ['Lò xo / bộ uốn ống', 'Lò xo lồng trong hoặc ngoài ống rồi uốn bằng tay để ống không bị bẹp. Bộ uốn 180° dùng cho ống nhỏ, có thước đo góc (90°, 135°…).'],
    meas: ['Thước kẹp (panme)', 'Đo đường kính ngoài, đường kính trong và chiều sâu. Đọc: số mm ở thước chính + vạch trên thước phụ trùng với thước chính × độ chia (0,05 mm).']
  };
  const BRAZE = {
    cuCu: ['Hàn đồng với đồng', 'Dùng que hàn <b>hợp kim bạc</b> (ống nhỏ) hoặc <b>đồng vàng</b> (ống lớn). Gia nhiệt đều vào mối hàn đến khi đồng đỏ tươi, quẹt que hàn từ dưới lên, que tan đều thì đưa ngọn lửa ra xa dần.'],
    cuFe: ['Hàn đồng với sắt', 'Sắt nóng chảy cao hơn đồng nên phải <b>gia nhiệt ở bên ống sắt</b>. Vệ sinh sạch gỉ, <b>tráng một lớp que hàn lên bề mặt ống sắt (~3 cm)</b> rồi mới đưa ống đồng vào hàn. Hàn xong sơn hoặc bọc ống chống rỉ, ăn mòn điện phân giữa hai kim loại.'],
    al: ['Hàn nhôm', 'Khó nhất vì nhôm <b>không đổi màu</b> khi nóng chảy. Dùng que hàn nhôm chạm thử lên bề mặt để biết nhiệt đã đủ; hàn nhanh, vệ sinh sạch lớp ô-xít nhôm; hàn không cẩn thận dễ bị chảy thủng.']
  };

  function learn() {
    return `
<section class="sec" id="s-flare" data-toc="1 · Loe ống">
  <div class="sec-n">Phần 1</div><h2>Phương pháp loe ống</h2>
  <p>Loe ống là tạo mép loe ở đầu ống đồng mềm để <b>nối bằng rắc co (đai ốc)</b>, mối nối tháo được; thường dùng khi lắp đặt điều hòa. Rắc co đực hàn cố định vào máy, rắc co cái đi kèm đầu ống.</p>
  <ol class="steps"><li tabindex="0"><div><b>Duỗi thẳng ống</b><span>Ống đồng cuộn sẵn; đặt lên nền phẳng, giữ chặt một đầu rồi lăn để ống thẳng.</span></div></li>
    <li tabindex="0"><div><b>Đo và cắt ống</b><span>Dùng thước dây lấy chiều dài; dao cắt ống tịnh tiến dần lưỡi dao, quay vòng quanh ống. Tịnh tiến quá nhanh sẽ làm bẹp ống.</span></div></li>
    <li tabindex="0"><div><b>Nạo ba via và làm sạch</b><span>Nạo ba via ở mép trong (đầu ống úp xuống để mạt rơi ra ngoài), lau sạch, lau khô.</span></div></li>
    <li tabindex="0"><div><b>Lồng rắc co, kẹp ống</b><span>Nhớ lồng rắc co vào ống <b>trước khi loe</b>. Kẹp ống vào thước kẹp đúng cỡ, <b>nhô cao</b> khỏi mặt thước kẹp theo bảng bên dưới.</span></div></li>
    <li tabindex="0"><div><b>Loe ống</b><span>Khóa chặt, quay tay côn loe đến khi mép loe vừa đủ.</span></div></li>
    <li tabindex="0"><div><b>Kiểm tra mép loe</b><span>Mép loe phải nhẵn, đều, không nứt; nằm gọn trong ren rắc co nhưng không chạm ren.</span></div></li></ol>
  <div class="prog"><span class="pc">Đã làm 0/6 bước</span><div class="bar"><i style="width:0"></i></div><span class="muted">(bấm từng bước để đánh dấu)</span></div>
  <div class="stage" style="padding:14px"><b>Tra độ nhô ống khi loe</b>
    <div class="row" style="margin-top:10px"><label>Chọn ống <select id="tSel" style="padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)">${TUBE.map((t, i) => `<option value="${i}">${t[0]} (≈ ${f1(t[1])} mm)</option>`).join('')}</select></label></div>
    <div class="verdict" id="tRes" style="margin-top:10px"></div>
    <p class="muted" style="margin:8px 0 0;font-size:13.5px">Quy đổi: 1/4″ ≈ 6,4 mm; 3/8″ ≈ 9,5 mm; 1/2″ ≈ 12,7 mm; 5/8″ ≈ 15,9 mm; 3/4″ ≈ 19,1 mm.</p></div>
  <h3 style="margin-top:22px">Kiểm tra chất lượng mép loe</h3>
  <div id="fTabs"></div><article class="panel" id="fPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-swage" data-toc="2 · Nong ống & dụng cụ">
  <div class="sec-n">Phần 2</div><h2>Nong ống và dụng cụ gia công</h2>
  <p><b>Nong ống</b> (nút ống) là mở rộng đầu ống để lồng ống nhỏ cùng cỡ vào bên trong rồi <b>hàn</b>, tạo mối nối cố định, không tháo được. Hai dụng cụ: kìm nong (ống 6 → 12 mm) và bộ nong/ loe đồng tâm. Khi nong, kẹp ống nhô cao khoảng <b>1 cm</b> so với mặt thước kẹp rồi nong đến khi đầu nong chạm mặt thước kẹp. Nhô quá cao thì ống bị lún, mép xấu; quá thấp thì phần nong ngắn, mối hàn kém kín.</p>
  <div id="oTabs"></div><article class="panel" id="oPanel" aria-live="polite"></article>
  <div class="stage" style="padding:14px"><b>Luyện đọc thước kẹp (độ chia 0,05 mm)</b>
    <div id="vSvg" style="margin-top:10px"></div>
    <div class="row" style="margin-top:10px"><label>Kết quả (mm) <input id="vAns" type="number" step="0.05" style="width:110px;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)"></label><button class="btn pri sm" id="vChk">Kiểm tra</button><button class="btn sm" id="vNew">Đề mới</button></div>
    <div class="verdict" id="vRes" style="margin-top:10px">Đọc số nguyên trên thước chính, cộng vạch phụ trùng × 0,05.</div></div>
</section>

<section class="sec" id="s-braze" data-toc="3 · Hàn ống">
  <div class="sec-n">Phần 3</div><h2>Hàn ống</h2>
  <p>Vật liệu hệ thống lạnh thường là <b>đồng, sắt, nhôm</b> (cân bằng giữa dẫn nhiệt, giá thành, chịu áp). Đồng và sắt dễ hàn vì khi đạt nhiệt độ nóng chảy que hàn thì vật liệu đổi màu (đỏ tươi); nhôm không đổi màu nên khó hàn.</p>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Que hàn</th><th>Dùng khi</th></tr></thead><tbody>
    <tr><td><b>Hợp kim đồng – bạc (bạc)</b></td><td>Hàn ống đồng với ống đồng/ sắt kích thước nhỏ</td></tr>
    <tr><td><b>Đồng vàng</b></td><td>Hàn ống đồng với ống đồng/ sắt kích thước lớn</td></tr>
    <tr><td><b>Que hàn nhôm</b></td><td>Hàn nhôm (loại có thuốc bên trong hoặc nhúng thuốc)</td></tr></tbody></table></div>
  <div class="grid2" style="margin-top:14px">
    <div class="panel"><h3>Đèn khò gas</h3><p style="margin:0">Rẻ, dễ dùng; nhiệt <b>không cao</b>, ngọn lửa dài nên dễ cháy vật liệu xung quanh (xốp, nhựa tủ lạnh). Dùng cho ống nhỏ.</p></div>
    <div class="panel hotc"><h3>Mỏ hàn hơi (oxy + gas/ axetilen)</h3><p style="margin:0">Nhiệt rất cao, hàn được ống lớn; ngọn lửa dễ che chắn. Phải <b>chỉnh ngọn lửa vừa phải</b>: quá lớn có thể làm cháy thủng vật liệu. Có 2 đồng hồ trên mỗi bình (áp bình, áp làm việc).</p></div></div>
  <div id="bTabs" style="margin-top:14px"></div><article class="panel warm" id="bPanel" aria-live="polite"></article>
  <div class="callout mem"><span class="ic">💨</span><div><b class="t">Vì sao phải xả khí nitơ khi hàn?</b><p>Gia nhiệt làm bề mặt trong ống đồng bị ô-xi hóa thành muội đen. Muội này theo gas chạy vào hệ thống gây <b>tắc</b>. Nitơ (hoặc argon) <b>đuổi hết không khí</b> trong ống, không còn ô-xi để cháy, mối hàn trong ống sạch. Mở/ khóa nitơ từ từ.</p></div></div>
  <div class="callout danger"><span class="ic">🧯</span><div><b class="t">An toàn khi hàn</b><p>Dọn dẹp vật dễ cháy, có <b>bình chữa cháy</b> gần đó, lót tấm chắn chịu nhiệt. Đọc đúng thứ tự mở/ khóa van oxy – gas. Tránh hút khói và khí thải. Để mối hàn nguội tự nhiên rồi kiểm tra kín.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Loe ống = mối nối tháo được bằng rắc co; nong ống = mối nối cố định bằng hàn.</b></div></li>
    <li class="done"><div><b>Lồng rắc co trước khi loe; ống nhô khỏi thước kẹp khoảng 0,5 mm (cỡ 19 mm: 1 mm).</b></div></li>
    <li class="done"><div><b>Mép loe phải nhẵn, đều, không nứt; lệch/ nứt thì cắt và làm lại.</b></div></li>
    <li class="done"><div><b>Hàn đồng–đồng: gia nhiệt đến đỏ tươi, quẹt que từ dưới lên.</b></div></li>
    <li class="done"><div><b>Hàn đồng–sắt: gia nhiệt ở sắt, tráng que hàn lên sắt trước, sơn chống rỉ sau.</b></div></li>
    <li class="done"><div><b>Xả nitơ khi hàn để tránh muội đen gây tắc hệ thống.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/7/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.bindSteps(root);
    const sel = $('#tSel', root), draw = () => { const t = TUBE[+sel.value]; $('#tRes', root).innerHTML = `Ống <b>${t[0]}</b> (≈ ${f1(t[1])} mm): để ống <b>nhô cao ${f1(t[2])} mm</b> so với mặt thước kẹp.`; };
    sel.onchange = draw; draw();
    U.tabset($('#fTabs', root), Object.entries(FLARE_BAD).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { const p = FLARE_BAD[id]; $('#fPanel', root).innerHTML = `<h3>${p[0]} <span class="pill ${p[1]}">${p[1] === 'ok' ? 'Đạt' : 'Không đạt'}</span></h3><p>${p[2]}</p><p style="margin:0">${p[3]}</p>`; });
    U.tabset($('#oTabs', root), Object.entries(TOOLS).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#oPanel', root).innerHTML = `<h3>${TOOLS[id][0]}</h3><p style="margin:0">${TOOLS[id][1]}</p>`; });
    U.tabset($('#bTabs', root), Object.entries(BRAZE).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#bPanel', root).innerHTML = `<h3>${BRAZE[id][0]}</h3><p style="margin:0">${BRAZE[id][1]}</p>`; });

    // thước kẹp: thước chính mm nguyên + vạch phụ (0–19, mỗi vạch 0,05 mm)
    let V;
    const vsvg = () => {
      const x0 = 30, mm = 12, W = x0 + 40 * mm + 20, ox = x0 + V.main * mm + V.k * .05 * mm; // gốc thước phụ
      let s = `<svg viewBox="0 0 ${W} 150" role="img" aria-label="Thước kẹp"><text class="fl" x="6" y="22">Thước chính (mm)</text><path d="M${x0} 30H${W - 15}" stroke="var(--ink)" stroke-width="2"/>`;
      for (let i = 0; i <= 40; i++) s += `<path d="M${x0 + i * mm} 30v${i % 5 === 0 ? 18 : 11}" stroke="var(--ink)" stroke-width="2"/>` + (i % 5 === 0 ? `<text class="fl" x="${x0 + i * mm}" y="64" text-anchor="middle">${i}</text>` : '');
      s += `<rect x="${ox}" y="84" width="${20 * mm + 4}" height="54" fill="var(--cold-tint)" stroke="var(--ink)" stroke-width="2" rx="4"/><text class="fl" x="${ox + 6}" y="148">Thước phụ</text>`;
      for (let j = 0; j <= 20; j++) s += `<path d="M${ox + j * mm * .95} 84v${j % 5 === 0 ? 20 : 13}" stroke="var(--ink)" stroke-width="2"/>` + (j % 5 === 0 ? `<text class="fl" x="${ox + j * mm * .95}" y="118" text-anchor="middle">${(j * .05).toString().replace('.', ',')}</text>` : '');
      return s + '</svg>';
    };
    const newV = () => {
      V = { main: Math.floor(Math.random() * 12) + 2, k: Math.floor(Math.random() * 19) + 1 };
      $('#vSvg', root).innerHTML = vsvg(); $('#vAns', root).value = '';
      $('#vRes', root).className = 'verdict'; $('#vRes', root).textContent = 'Đọc số nguyên trên thước chính, cộng vạch phụ trùng × 0,05.';
    };
    $('#vNew', root).onclick = newV; newV();
    $('#vChk', root).onclick = () => {
      const truth = V.main + V.k * .05, a = parseFloat($('#vAns', root).value), ok = Math.abs(a - truth) < .005, v = $('#vRes', root);
      v.className = 'verdict ' + (ok ? 'ok' : 'bad'); v.innerHTML = ok ? `✓ Đúng: ${V.main} + ${V.k} × 0,05 = <b>${truth.toFixed(2).replace('.', ',')} mm</b>.` : `✗ Chưa đúng. Kết quả: ${V.main} + ${V.k} × 0,05 = <b>${truth.toFixed(2).replace('.', ',')} mm</b>.`;
    };
  }

  const flashcards = [
    { f: 'Loe ống dùng để làm gì?', b: 'Tạo mép loe để nối ống bằng rắc co – mối nối tháo được.', tag: 'Loe' },
    { f: 'Nong ống dùng để làm gì?', b: 'Mở rộng đầu ống để lồng ống cùng cỡ vào rồi hàn – mối nối cố định.', tag: 'Nong' },
    { f: 'Khi nào lồng rắc co vào ống?', b: 'Trước khi loe.', tag: 'Loe' },
    { f: 'Thứ tự gia công ống trước khi loe?', b: 'Duỗi thẳng → đo, cắt → nạo ba via, lau sạch → kẹp.', tag: 'Loe' },
    { f: 'Vì sao cắt ống phải tịnh tiến dần?', b: 'Tịnh tiến quá mạnh làm bẹp ống.', tag: 'Loe' },
    { f: 'Độ nhô ống 6–16 mm khi loe?', b: '0,5 mm so với mặt thước kẹp.', tag: 'Loe' },
    { f: 'Độ nhô ống 19 mm khi loe?', b: '1 mm.', tag: 'Loe' },
    { f: '1/4 inch bằng bao nhiêu mm?', b: '≈ 6,4 mm.', tag: 'Đơn vị ống' },
    { f: '3/8 inch bằng?', b: '≈ 9,5 mm.', tag: 'Đơn vị ống' },
    { f: '1/2 inch bằng?', b: '≈ 12,7 mm.', tag: 'Đơn vị ống' },
    { f: '5/8 inch bằng?', b: '≈ 15,9 mm.', tag: 'Đơn vị ống' },
    { f: '3/4 inch bằng?', b: '≈ 19,1 mm.', tag: 'Đơn vị ống' },
    { f: 'Mép loe lệch một bên do?', b: 'Ống chưa duỗi thẳng, cắt/ kẹp không vuông.', tag: 'Lỗi loe' },
    { f: 'Mép loe nứt ngang do?', b: 'Loe sai cỡ, thước kẹp không phù hợp ống.', tag: 'Lỗi loe' },
    { f: 'Mép loe dày mỏng không đều do?', b: 'Khóa vít thước kẹp chưa chuẩn, ống nghiêng.', tag: 'Lỗi loe' },
    { f: 'Mép loe đạt chuẩn trông thế nào?', b: 'Tròn, nhẵn, đều, không xước; vừa trong ren rắc co.', tag: 'Lỗi loe' },
    { f: 'Thước kẹp (panme) đọc theo độ chia?', b: '0,05 mm.', tag: 'Dụng cụ' },
    { f: 'Lò xo uốn ống để làm gì?', b: 'Giữ ống không bị bẹp khi uốn.', tag: 'Dụng cụ' },
    { f: 'Vật liệu chính của ống hệ thống lạnh?', b: 'Đồng, sắt, nhôm.', tag: 'Hàn' },
    { f: 'Vì sao nhôm khó hàn?', b: 'Nóng chảy mà không đổi màu, khó biết nhiệt độ.', tag: 'Hàn' },
    { f: 'Que hàn bạc dùng ở?', b: 'Hàn ống đồng với đồng/ sắt cỡ nhỏ.', tag: 'Hàn' },
    { f: 'Que hàn đồng vàng dùng ở?', b: 'Hàn ống đồng với đồng/ sắt cỡ lớn.', tag: 'Hàn' },
    { f: 'Khi hàn đồng với đồng, nhận biết đủ nhiệt?', b: 'Đồng đỏ tươi; que hàn chạm vào tan đều.', tag: 'Hàn' },
    { f: 'Hàn đồng với sắt gia nhiệt ở đâu?', b: 'Ở bên ống sắt (nóng chảy cao hơn); tráng que hàn lên sắt trước.', tag: 'Hàn' },
    { f: 'Vì sao phải sơn/ bọc mối hàn đồng – sắt?', b: 'Hai kim loại khác nhau gây ăn mòn điện phân, rỉ sét.', tag: 'Hàn' },
    { f: 'Vì sao xả nitơ khi hàn?', b: 'Đuổi không khí, tránh muội đen gây tắc hệ thống.', tag: 'Hàn' },
    { f: 'Nhược điểm đèn khò gas?', b: 'Nhiệt thấp, ngọn lửa dài dễ cháy vật liệu xung quanh.', tag: 'Hàn' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Loe ống tạo mối nối?', ['Tháo được bằng rắc co', 'Cố định bằng hàn', 'Dán keo', 'Hàn thiếc'], 0, 'Rắc co.'),
    Q('Nong ống để?', ['Lồng ống cùng cỡ rồi hàn', 'Nối bằng rắc co', 'Cắt ống', 'Uốn ống'], 0, 'Mối nối cố định.'),
    Q('Rắc co phải lồng vào ống?', ['Trước khi loe', 'Sau khi loe', 'Khi hàn', 'Không cần'], 0, 'Loe xong không lồng được nữa.'),
    Q('Bước đầu tiên là?', ['Duỗi thẳng ống', 'Hàn', 'Loe', 'Nạp gas'], 0, 'Ống cuộn nên phải duỗi.'),
    Q('Tịnh tiến dao cắt ống quá nhanh gây?', ['Bẹp ống', 'Ống dài hơn', 'Ống nóng', 'Không sao'], 0, 'Phải từ từ.'),
    Q('Ba via nạo ở mép nào?', ['Mép trong (và ngoài)', 'Chỉ thân ống', 'Không cần', 'Rắc co'], 0, 'Giữ ống sạch, tránh làm hỏng mép loe.'),
    Q('Ống 12,7 mm (1/2″) nhô cao khỏi thước kẹp?', ['0,5 mm', '5 mm', '10 mm', '0 mm'], 0, 'Cỡ 6 – 16 mm.'),
    Q('Ống 19 mm nhô cao?', ['1 mm', '0,5 mm', '5 mm', '10 mm'], 0, 'Theo bài.'),
    Q('3/8″ bằng khoảng?', ['9,5 mm', '6,4 mm', '12,7 mm', '15,9 mm'], 0, '25,4 × 3/8.'),
    Q('5/8″ bằng khoảng?', ['15,9 mm', '9,5 mm', '12,7 mm', '19,1 mm'], 0, '25,4 × 5/8.'),
    Q('Mép loe lệch một bên do?', ['Ống không thẳng, cắt/ kẹp không vuông', 'Gas thừa', 'Dầu thiếu', 'Điện áp thấp'], 0, 'Làm lại.'),
    Q('Mép loe nứt do?', ['Loe sai cỡ/ không phù hợp thước kẹp', 'Nạp gas nhiều', 'Dàn bẩn', 'Thiếu dầu'], 0, 'Chọn đúng cỡ.'),
    Q('Mép loe dày mỏng không đều do?', ['Vít khóa thước kẹp chưa chuẩn', 'Ống quá dài', 'Quá nhiều gas', 'Dùng sai que hàn'], 0, 'Kẹp lại chặt.'),
    Q('Độ chia thước kẹp trong bài?', ['0,05 mm', '1 mm', '0,5 cm', '5 mm'], 0, 'Đọc thước phụ.'),
    Q('Vật liệu khó hàn nhất?', ['Nhôm', 'Đồng', 'Sắt', 'Bạc'], 0, 'Không đổi màu khi nóng chảy.'),
    Q('Ống đồng cỡ nhỏ hàn bằng que?', ['Hợp kim bạc', 'Đồng vàng', 'Thiếc hàn mạch', 'Nhôm'], 0, 'Theo bài.'),
    Q('Ống lớn hàn đồng – sắt dùng?', ['Đồng vàng', 'Que nhôm', 'Keo dán', 'Băng keo'], 0, 'Hàn nhiệt độ cao.'),
    Q('Đồng đạt nhiệt hàn thì có màu?', ['Đỏ tươi', 'Xanh', 'Trắng', 'Đen'], 0, 'Dấu hiệu nhiệt độ.'),
    Q('Hàn đồng với sắt cần?', ['Gia nhiệt sắt, tráng que hàn lên sắt trước', 'Gia nhiệt đồng trước', 'Không cần vệ sinh', 'Chỉ dùng keo'], 0, 'Sắt nóng chảy cao hơn.'),
    Q('Sau khi hàn đồng – sắt nên?', ['Sơn/ bọc chống rỉ', 'Để nguyên', 'Ngâm nước', 'Mài bóng'], 0, 'Ăn mòn điện phân.'),
    Q('Xả nitơ khi hàn để?', ['Tránh muội đen gây tắc', 'Làm nóng ống', 'Tăng áp', 'Tạo chân không'], 0, 'Không có oxy thì không cháy.'),
    Q('Mỏ hàn hơi dùng khí?', ['Oxy và gas/ axetilen', 'Nitơ và argon', 'Chỉ gas', 'Chỉ oxy'], 0, 'Tạo nhiệt cao.'),
    Q('Nhược điểm đèn khò gas?', ['Nhiệt không cao, ngọn lửa dài', 'Quá đắt', 'Quá nặng', 'Không có lửa'], 0, 'Chỉ dùng chi tiết nhỏ.'),
    Q('Khi hàn cần có sẵn?', ['Bình chữa cháy và tấm chắn', 'Quạt thổi mạnh', 'Dầu máy', 'Gas thừa'], 0, 'An toàn phòng cháy.'),
    Q('Bắt đầu nạp gas sau khi hàn cần?', ['Kiểm tra kín mối hàn', 'Bỏ qua', 'Chạy máy luôn', 'Tăng dầu'], 0, 'Phải thử kín.')
  ];
  const sort = {
    title: 'Loe, nong hay hàn?',
    buckets: [{ id: 'flare', name: 'Loe ống (rắc co)' }, { id: 'swage', name: 'Nong ống' }, { id: 'braze', name: 'Hàn ống' }],
    items: [
      { t: 'Lồng rắc co trước', b: 'flare' }, { t: 'Mối nối tháo được', b: 'flare' }, { t: 'Nhô 0,5 mm khỏi thước kẹp', b: 'flare' },
      { t: 'Mở rộng đầu ống để lồng ống nhỏ vào', b: 'swage' }, { t: 'Dùng kìm nong hoặc bộ đồng tâm', b: 'swage' },
      { t: 'Que hàn bạc', b: 'braze' }, { t: 'Xả nitơ chống muội', b: 'braze' }, { t: 'Gia nhiệt tới đỏ tươi', b: 'braze' }, { t: 'Mối nối cố định', b: 'braze' }
    ]
  };
  const order = [
    { title: 'Loe ống đồng', intro: 'Từng bước.', steps: ['Duỗi thẳng ống', 'Đo, cắt ống', 'Nạo ba via, lau sạch', 'Lồng rắc co vào ống', 'Kẹp ống, nhô đúng độ cao', 'Loe và kiểm tra mép loe'] },
    { title: 'Hàn ống đồng với ống đồng', intro: 'Quy trình an toàn.', steps: ['Dọn vật dễ cháy, chuẩn bị bình chữa cháy', 'Xả nitơ vào ống', 'Mở gas, oxy, châm lửa chỉnh ngọn lửa', 'Gia nhiệt mối hàn đến đỏ tươi', 'Quẹt que hàn từ dưới lên', 'Đưa lửa ra xa, để nguội, kiểm tra kín'] },
    { title: 'Hàn ống đồng với ống sắt', intro: 'Có tráng que hàn.', steps: ['Vệ sinh sạch gỉ bên ống sắt', 'Gia nhiệt ở bên ống sắt', 'Tráng que hàn lên bề mặt sắt khoảng 3 cm', 'Lồng ống đồng vào', 'Gia nhiệt hàn kín mối nối', 'Sơn/ bọc chống rỉ sau khi nguội'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 7, ready: true, title: 'Kỹ thuật gia công ống', sub: 'Loe ống, nong ống, hàn ống đồng – sắt – nhôm', minutes: 30,
    lead: 'Kỹ thuật gia công ống trong nghề lạnh: loe ống nối rắc co, nong ống hàn nối, dụng cụ đo – uốn ống và kỹ thuật hàn đồng, sắt, nhôm với nitơ chống muội.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
