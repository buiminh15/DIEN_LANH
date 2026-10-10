/* NGUYÊN LÝ LÀM LẠNH — BÀI 2: CÁC THIẾT BỊ CHÍNH (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_2.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const T = {
    comp: {
      name: 'Máy nén', role: 'Hút và nén hơi môi chất, tuần hoàn môi chất và duy trì áp suất ngưng tụ, áp suất sôi ổn định.',
      kinds: [
        ['Máy nén kín (block, lốc)', 'Phần điện (động cơ) và phần cơ nằm chung một vỏ kim loại hàn kín.', 'Ít rò rỉ gas.', 'Rất khó gia công, sửa chữa (phải cưa vỏ).', 'Hệ thống nhỏ: tủ lạnh, tủ đông, cây nước nóng lạnh…'],
        ['Máy nén nửa kín', 'Phần điện và phần cơ trong hai vỏ ghép nhau bằng mặt bích, bắt bu-lông; có mắt kính xem mức dầu.', 'Tháo lắp, sửa chữa được.', 'Có gioăng/ phớt nên rò rỉ gas lớn hơn.', 'Công nghiệp: máy làm kem, làm đá…'],
        ['Máy nén hở', 'Động cơ điện nằm ngoài, truyền động sang máy nén bằng dây đai hoặc khớp nối.', 'Dễ sửa; dùng được nhiều loại gas; đổi được năng suất (đổi tốc độ).', 'Rò rỉ gas lớn; phải căn chỉnh dây đai, khớp nối.', 'Điều hòa trung tâm, điều hòa ô tô…']
      ]
    },
    cond: {
      name: 'Thiết bị ngưng tụ', role: 'Tỏa nhiệt của hơi môi chất ra môi trường làm mát để hơi ngưng tụ thành lỏng.',
      kinds: [
        ['Dàn nóng (đối lưu tự nhiên)', 'Môi trường làm mát là không khí, truyền nhiệt bằng đối lưu tự nhiên.', 'Cấu tạo đơn giản, dễ sửa, thay thế.', 'Năng suất tỏa nhiệt thấp; trời nóng thì làm lạnh kém.', 'Tủ lạnh gia đình, tủ bảo quản.'],
        ['Dàn ngưng tụ (có quạt)', 'Không khí đối lưu cưỡng bức nhờ quạt gió.', 'Nhỏ gọn, tỏa nhiệt tốt, chỉnh được tốc độ quạt.', 'Cần quạt; bụi bẩn bám nhanh nên phải bảo dưỡng thường xuyên.', 'Điều hòa, máy làm kem, làm đá, công suất lớn hơn.'],
        ['Bình ngưng tụ', 'Môi trường làm mát là nước chảy trong ống, gas ở ngoài ống; kèm tháp giải nhiệt và máy bơm tuần hoàn.', 'Tỏa nhiệt rất nhanh, ngưng tụ tốt.', 'Phải có hệ thống bơm, tháp giải nhiệt.', 'Tủ lạnh công nghiệp, điều hòa trung tâm.']
      ]
    },
    exp: {
      name: 'Thiết bị tiết lưu', role: 'Tạo chênh lệch áp suất (p<sub>k</sub> trước, p<sub>0</sub> sau) và điều chỉnh lưu lượng môi chất. Đổi lưu lượng hay tiết diện thì đổi áp suất sôi, đổi nhiệt độ sôi.',
      kinds: [
        ['Cố định (ống mao)', 'Đoạn ống đồng tiết diện nhỏ, hàn giữa dàn nóng và dàn lạnh.', 'Đơn giản, rẻ, dễ thay thế.', 'Không điều chỉnh được lưu lượng.', 'Tủ lạnh, điều hòa không khí.'],
        ['Van tiết lưu chỉnh tay', 'Có trục vặn để người vận hành chỉnh lưu lượng, thường theo đồng hồ áp suất.', 'Chỉnh được lưu lượng.', 'Cần công nhân vận hành, chỉnh.', 'Máy làm kem, làm đá, kho bảo quản.'],
        ['Van tiết lưu tự động', 'Cân bằng áp trong/ ngoài; loại cơ dùng bầu cảm biến nhiệt và hộp xếp, loại điện từ dùng cuộn dây.', 'Độ chính xác cao.', 'Giá thành cao, khó sửa chữa.', 'Kho lạnh, một số máy Inverter.']
      ]
    },
    evap: {
      name: 'Thiết bị bay hơi', role: 'Thu nhiệt của sản phẩm hoặc môi trường cần làm lạnh để cấp cho gas lỏng sôi.',
      kinds: [
        ['Dàn lạnh (thu nhiệt trực tiếp)', 'Sản phẩm tiếp xúc trực tiếp bề mặt dàn.', 'Làm lạnh nhanh.', 'Làm lạnh không đều, chỉ trong không gian hẹp.', 'Tủ lạnh, tủ cấp đông trực tiếp, cây nước nóng lạnh.'],
        ['Dàn bay hơi (có quạt)', 'Môi trường làm lạnh là không khí, quạt đối lưu.', 'Làm lạnh đều, không gian rộng.', 'Phải làm lạnh không khí trước nên chậm hơn; phụ thuộc quạt.', 'Điều hòa, kho lạnh gián tiếp, tủ lạnh gián tiếp.'],
        ['Bình bay hơi', 'Môi trường làm lạnh là chất lỏng (nước…), gas trong ống xoắn.', 'Làm lạnh nhanh, rộng; ít làm khô không khí.', 'Cần hệ thống tuần hoàn chất lỏng (Chiller).', 'Hệ thống lạnh nước, điều hòa trung tâm.']
      ]
    }
  };

  function learn() {
    return `
<section class="sec" id="s-dev" data-toc="1 · 4 thiết bị chính">
  <div class="sec-n">Phần 1</div><h2>Bốn thiết bị chính và cách phân loại</h2>
  <p>Mỗi thiết bị có <b>ba loại</b> thường gặp. Chọn thiết bị rồi chọn loại để xem cấu tạo, ưu – nhược điểm và nơi dùng:</p>
  <div id="dTabs"></div><article class="panel" id="dRole" aria-live="polite"></article>
  <div id="kTabs"></div><article class="panel warm" id="kPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-cmp" data-toc="2 · So sánh">
  <div class="sec-n">Phần 2</div><h2>Chọn loại thiết bị theo ứng dụng</h2>
  <p>Trong thực tế: tủ lạnh dùng <b>máy nén kín</b> (block), <b>dàn nóng tự nhiên</b>, <b>ống mao</b>, <b>dàn lạnh</b>. Điều hòa dùng <b>máy nén kín</b>, <b>dàn ngưng tụ có quạt</b>, <b>ống mao</b> (một số Inverter dùng van điện từ), <b>dàn bay hơi có quạt</b>. Hệ thống công nghiệp lớn dùng bình ngưng tụ, van tiết lưu tự động, bình bay hơi.</p>
  <div class="stage" style="padding:14px"><b>Luyện nhanh: chọn thiết bị phù hợp</b>
    <div id="qBox" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-recap" data-toc="3 · Tóm tắt">
  <div class="sec-n">Phần 3</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Máy nén: kín (khó sửa, ít rò) – nửa kín – hở (dễ sửa, hay rò).</b></div></li>
    <li class="done"><div><b>Ngưng tụ: dàn nóng (tự nhiên), dàn có quạt, bình ngưng (nước + tháp giải nhiệt).</b></div></li>
    <li class="done"><div><b>Tiết lưu: ống mao cố định, van chỉnh tay, van tự động.</b></div></li>
    <li class="done"><div><b>Bay hơi: dàn lạnh, dàn bay hơi có quạt, bình bay hơi.</b></div></li>
    <li class="done"><div><b>Đổi lưu lượng ở tiết lưu thì đổi áp suất sôi, nhiệt độ sôi.</b></div></li>
    <li class="done"><div><b>Tủ lạnh: block kín + dàn nóng tự nhiên + ống mao + dàn lạnh.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/2/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const APPS = [
    ['Tủ lạnh gia đình cần máy nén loại nào?', 'Máy nén kín (block)', ['Máy nén kín (block)', 'Máy nén hở', 'Máy nén nửa kín']],
    ['Điều hòa ô tô (động cơ xe kéo máy nén bằng dây đai) dùng?', 'Máy nén hở', ['Máy nén hở', 'Máy nén kín (block)', 'Máy nén nửa kín']],
    ['Tủ lạnh nhỏ không có quạt ở dàn nóng, tản nhiệt tự nhiên là?', 'Dàn nóng', ['Dàn nóng', 'Bình ngưng tụ', 'Dàn ngưng tụ có quạt']],
    ['Tủ lạnh công nghiệp cần tỏa nhiệt nhanh, dùng nước làm mát?', 'Bình ngưng tụ', ['Bình ngưng tụ', 'Dàn nóng', 'Dàn lạnh']],
    ['Đoạn ống đồng nhỏ thay cho van tiết lưu trong tủ lạnh là?', 'Ống mao', ['Ống mao', 'Van chỉnh tay', 'Van điện từ']],
    ['Hệ thống Chiller làm lạnh nước dùng thiết bị bay hơi?', 'Bình bay hơi', ['Bình bay hơi', 'Dàn lạnh', 'Dàn bay hơi có quạt']]
  ];

  function mount(root) {
    const dItems = Object.entries(T).map(([id, p], i) => ({ id, n: i + 1, name: p.name }));
    let curDev = 'comp';
    const showKind = (dev, k) => {
      const x = T[dev].kinds[k];
      $('#kPanel', root).innerHTML = `<h3>${x[0]}</h3><dl class="kv"><dt>Cấu tạo</dt><dd>${x[1]}</dd><dt>Ưu điểm</dt><dd><span class="pill ok">${x[2]}</span></dd><dt>Nhược điểm</dt><dd><span class="pill bad">${x[3]}</span></dd><dt>Dùng ở</dt><dd>${x[4]}</dd></dl>`;
    };
    U.tabset($('#dTabs', root), dItems, id => {
      curDev = id; $('#dRole', root).innerHTML = `<h3>${T[id].name}</h3><p style="margin:0"><b>Công dụng:</b> ${T[id].role}</p>`;
      U.tabset($('#kTabs', root), T[id].kinds.map((k, i) => ({ id: String(i), n: i + 1, name: k[0] })), k => showKind(curDev, +k));
    });
    let qi = 0, sc = 0;
    const box = $('#qBox', root);
    const draw = () => {
      if (qi >= APPS.length) { box.innerHTML = `<div class="verdict ok">Hoàn thành: ${sc}/${APPS.length} câu đúng.</div><div class="row" style="margin-top:10px"><button class="btn sm" id="qAgain">Làm lại</button></div>`; $('#qAgain', root).onclick = () => { qi = 0; sc = 0; draw(); }; return; }
      const [q, a, opts] = APPS[qi];
      box.innerHTML = `<p style="margin:0 0 8px"><b>Câu ${qi + 1}/${APPS.length}.</b> ${q}</p><div class="row">${DL.shuffle(opts).map(o => `<button class="btn sm" data-o="${o}">${o}</button>`).join('')}</div><div class="verdict" id="qV" style="margin-top:10px">Chọn một đáp án.</div>`;
      $$('[data-o]', box).forEach(b => b.onclick = () => {
        const ok = b.dataset.o === a; if (ok) sc++;
        $$('[data-o]', box).forEach(x => x.disabled = true);
        const v = $('#qV', box); v.className = 'verdict ' + (ok ? 'ok' : 'bad'); v.innerHTML = (ok ? '✓ Đúng! ' : `✗ Chưa đúng, đáp án: <b>${a}</b>. `) + '<button class="btn sm pri" id="qN" style="margin-left:8px">Tiếp →</button>';
        $('#qN', box).onclick = () => { qi++; draw(); };
      });
    };
    draw();
  }

  const flashcards = [
    { f: '4 thiết bị chính của hệ thống lạnh?', b: 'Máy nén, ngưng tụ, tiết lưu, bay hơi.', tag: 'Chung' },
    { f: 'Công dụng của máy nén?', b: 'Hút, nén hơi môi chất, tuần hoàn môi chất, duy trì áp suất sôi và ngưng tụ ổn định.', tag: 'Máy nén' },
    { f: '3 loại máy nén?', b: 'Kín, nửa kín, hở.', tag: 'Máy nén' },
    { f: 'Máy nén kín còn gọi là?', b: 'Block, lốc.', tag: 'Máy nén' },
    { f: 'Ưu – nhược của máy nén kín?', b: 'Ít rò gas; rất khó gia công, sửa chữa.', tag: 'Máy nén' },
    { f: 'Máy nén kín dùng ở đâu?', b: 'Tủ lạnh, tủ đông, cây nước nóng lạnh – công suất nhỏ.', tag: 'Máy nén' },
    { f: 'Máy nén nửa kín khác kín ở điểm nào?', b: 'Phần điện, phần cơ ở hai vỏ ghép bằng mặt bích, bắt bu-lông; có mắt kính dầu; tháo sửa được.', tag: 'Máy nén' },
    { f: 'Máy nén hở truyền động bằng?', b: 'Dây đai hoặc khớp nối trục; động cơ nằm ngoài.', tag: 'Máy nén' },
    { f: 'Máy nén hở dùng ở đâu?', b: 'Điều hòa trung tâm, điều hòa ô tô.', tag: 'Máy nén' },
    { f: 'Công dụng thiết bị ngưng tụ?', b: 'Tỏa nhiệt của hơi ra môi trường làm mát để ngưng thành lỏng.', tag: 'Ngưng tụ' },
    { f: '3 loại thiết bị ngưng tụ?', b: 'Dàn nóng, dàn ngưng tụ (quạt), bình ngưng tụ.', tag: 'Ngưng tụ' },
    { f: 'Dàn nóng truyền nhiệt kiểu nào?', b: 'Đối lưu tự nhiên với không khí.', tag: 'Ngưng tụ' },
    { f: 'Nhược điểm dàn nóng?', b: 'Năng suất tỏa nhiệt thấp, trời nóng làm lạnh kém.', tag: 'Ngưng tụ' },
    { f: 'Dàn ngưng tụ có quạt cần bảo dưỡng vì?', b: 'Quạt hút không khí kèm bụi, bụi bám dàn nhanh.', tag: 'Ngưng tụ' },
    { f: 'Bình ngưng tụ luôn đi kèm?', b: 'Tháp giải nhiệt và máy bơm tuần hoàn nước.', tag: 'Ngưng tụ' },
    { f: 'Công dụng thiết bị tiết lưu?', b: 'Tạo chênh áp p<sub>k</sub> – p<sub>0</sub> và điều chỉnh lưu lượng môi chất.', tag: 'Tiết lưu' },
    { f: '3 loại thiết bị tiết lưu?', b: 'Cố định (ống mao), van chỉnh tay, van tự động.', tag: 'Tiết lưu' },
    { f: 'Ống mao có chỉnh được lưu lượng không?', b: 'Không. Đơn giản, rẻ nhưng cố định.', tag: 'Tiết lưu' },
    { f: 'Van tiết lưu tự động dùng ở đâu?', b: 'Kho lạnh, một số máy Inverter; chính xác nhưng đắt, khó sửa.', tag: 'Tiết lưu' },
    { f: 'Công dụng thiết bị bay hơi?', b: 'Thu nhiệt của sản phẩm/môi trường để gas lỏng sôi.', tag: 'Bay hơi' },
    { f: '3 loại thiết bị bay hơi?', b: 'Dàn lạnh, dàn bay hơi (quạt), bình bay hơi.', tag: 'Bay hơi' },
    { f: 'Dàn lạnh trực tiếp ưu – nhược?', b: 'Lạnh nhanh; không đều, chỉ không gian hẹp.', tag: 'Bay hơi' },
    { f: 'Bình bay hơi dùng ở hệ thống nào?', b: 'Hệ thống lạnh nước (Chiller).', tag: 'Bay hơi' },
    { f: 'Ưu điểm hệ lạnh nước so với dùng gas trực tiếp?', b: 'Ít làm khô da/ không khí; ống nước dễ sửa; rò nước ít nguy hiểm hơn mất gas.', tag: 'Bay hơi' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Máy nén có mấy loại chính?', ['3: kín, nửa kín, hở', '2', '4', '5'], 0, 'Kín, nửa kín, hở.'),
    Q('Máy nén kín khó ở điểm nào?', ['Gia công, sửa chữa', 'Rò gas nhiều', 'Đổi năng suất', 'Truyền dây đai'], 0, 'Phải cưa vỏ để sửa.'),
    Q('Tủ lạnh gia đình dùng máy nén?', ['Kín', 'Hở', 'Nửa kín', 'Không dùng'], 0, 'Công suất nhỏ.'),
    Q('Máy nén có mắt kính xem dầu, ghép bằng bu-lông là?', ['Nửa kín', 'Kín', 'Hở', 'Không có'], 0, 'Hai vỏ ghép bằng mặt bích.'),
    Q('Máy nén truyền động dây đai/ khớp nối là?', ['Hở', 'Kín', 'Nửa kín', 'Block'], 0, 'Động cơ nằm ngoài.'),
    Q('Điều hòa ô tô thường dùng?', ['Máy nén hở', 'Máy nén kín', 'Ống mao', 'Bình ngưng'], 0, 'Chạy bằng dây đai từ động cơ.'),
    Q('Máy nén hở có nhược điểm?', ['Rò rỉ gas lớn', 'Không dùng được nhiều gas', 'Không đổi được năng suất', 'Quá khó sửa'], 0, 'Có phớt, khớp nối.'),
    Q('Dàn nóng tủ lạnh truyền nhiệt bằng?', ['Đối lưu tự nhiên', 'Đối lưu cưỡng bức', 'Nước', 'Bức xạ chủ yếu'], 0, 'Không có quạt.'),
    Q('Dàn ngưng tụ có quạt hơn dàn nóng ở?', ['Nhỏ gọn, tỏa nhiệt tốt', 'Không cần bảo dưỡng', 'Không tốn điện', 'Không bám bụi'], 0, 'Đối lưu cưỡng bức.'),
    Q('Bình ngưng tụ dùng môi trường làm mát là?', ['Nước', 'Không khí tĩnh', 'Dầu', 'Gas'], 0, 'Có tháp giải nhiệt.'),
    Q('Tháp giải nhiệt dùng để?', ['Làm mát nước tuần hoàn', 'Nén gas', 'Lọc ẩm', 'Tiết lưu'], 0, 'Nước nóng được làm nguội.'),
    Q('Ống mao là thiết bị?', ['Tiết lưu cố định', 'Ngưng tụ', 'Bay hơi', 'Máy nén'], 0, 'Đoạn ống đồng nhỏ.'),
    Q('Muốn đổi áp suất sôi, đổi nhiệt độ sôi ta?', ['Đổi lưu lượng/ tiết diện tiết lưu', 'Đổi màu dàn', 'Tăng dầu', 'Thêm quạt'], 0, 'Tiết lưu quyết định chênh áp.'),
    Q('Van tiết lưu tự động có nhược điểm?', ['Giá cao, khó sửa', 'Không chính xác', 'Cần công nhân chỉnh liên tục', 'Không dùng được kho lạnh'], 0, 'Chính xác nhưng đắt.'),
    Q('Van tiết lưu chỉnh tay hay dùng ở?', ['Máy làm kem, làm đá, kho bảo quản', 'Tủ lạnh gia đình', 'Điều hòa gia đình', 'Cây nước nóng lạnh'], 0, 'Cần người vận hành.'),
    Q('Dàn lạnh thu nhiệt trực tiếp có nhược điểm?', ['Lạnh không đều', 'Lạnh chậm', 'Cần bơm', 'Cần tháp giải nhiệt'], 0, 'Chỉ không gian hẹp.'),
    Q('Điều hòa dùng dàn bay hơi có quạt vì?', ['Làm lạnh đều không gian rộng', 'Rẻ nhất', 'Không cần điện', 'Không cần gas'], 0, 'Quạt đối lưu không khí.'),
    Q('Hệ thống Chiller dùng?', ['Bình bay hơi', 'Dàn lạnh trực tiếp', 'Ống mao', 'Máy nén hở only'], 0, 'Làm lạnh chất lỏng.'),
    Q('Công dụng chính của thiết bị bay hơi là?', ['Thu nhiệt môi trường cần lạnh', 'Tỏa nhiệt', 'Nén gas', 'Lọc cặn'], 0, 'Cấp nhiệt cho gas sôi.'),
    Q('Nhiệm vụ thiết bị ngưng tụ là?', ['Tỏa nhiệt cho hơi ngưng thành lỏng', 'Thu nhiệt', 'Nén hơi', 'Tạo chân không'], 0, 'Ra môi trường làm mát.'),
    Q('Bình ngưng luôn đi kèm?', ['Máy bơm + tháp giải nhiệt', 'Ống mao', 'Dàn lạnh', 'Quạt hơi'], 0, 'Cần hệ tuần hoàn nước.'),
    Q('Ưu điểm hệ lạnh nước (Chiller)?', ['Ít làm khô không khí; rò nước ít nguy hiểm', 'Không cần ống', 'Không cần máy nén', 'Không cần điện'], 0, 'Theo bài.')
  ];
  const sort = {
    title: 'Phân loại ứng dụng theo thiết bị',
    buckets: [{ id: 'comp', name: 'Máy nén' }, { id: 'cond', name: 'Ngưng tụ' }, { id: 'exp', name: 'Tiết lưu' }, { id: 'evap', name: 'Bay hơi' }],
    items: [
      { t: 'Block (lốc) kín', b: 'comp' }, { t: 'Máy nén hở dây đai', b: 'comp' }, { t: 'Máy nén nửa kín', b: 'comp' },
      { t: 'Dàn nóng', b: 'cond' }, { t: 'Bình ngưng tụ', b: 'cond' }, { t: 'Tháp giải nhiệt kèm theo', b: 'cond' },
      { t: 'Ống mao', b: 'exp' }, { t: 'Van chỉnh tay', b: 'exp' }, { t: 'Van điện từ (Inverter)', b: 'exp' },
      { t: 'Dàn lạnh tủ lạnh', b: 'evap' }, { t: 'Dàn bay hơi điều hòa', b: 'evap' }, { t: 'Bình bay hơi Chiller', b: 'evap' }
    ]
  };
  const order = [
    { title: 'Hệ thống bình ngưng tụ nước', intro: 'Dòng nước và gas.', steps: ['Máy nén đẩy hơi nóng vào bình ngưng', 'Nước lạnh chảy trong ống của bình', 'Hơi tỏa nhiệt cho nước, ngưng thành lỏng', 'Nước nóng lên được bơm lên tháp giải nhiệt', 'Tháp làm nguội nước bằng quạt', 'Nước lạnh lại tuần hoàn về bình'] },
    { title: 'Hệ thống lạnh nước (Chiller)', intro: 'Từ dàn bay hơi đến phòng.', steps: ['Gas sôi trong bình bay hơi', 'Nước đi qua bình mất nhiệt, lạnh đi', 'Bơm đẩy nước lạnh theo ống bảo ôn', 'Nước lạnh tới dàn trao đổi ở các phòng', 'Phòng được làm lạnh, nước nóng lên', 'Nước quay về bình bay hơi'] },
    { title: 'Chọn tiết lưu để đổi nhiệt độ sôi', intro: 'Quan hệ nhân quả.', steps: ['Thay đổi tiết diện hay chiều dài tiết lưu', 'Lưu lượng môi chất đổi', 'Áp suất sôi p0 đổi', 'Nhiệt độ sôi t0 đổi', 'Mức lạnh của hệ thống đổi'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 2, ready: true, title: 'Các thiết bị chính', sub: 'Máy nén, ngưng tụ, tiết lưu, bay hơi', minutes: 25,
    lead: 'Cấu tạo, phân loại, ưu – nhược điểm và nơi dùng của bốn thiết bị chính: máy nén, thiết bị ngưng tụ, thiết bị tiết lưu và thiết bị bay hơi.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
