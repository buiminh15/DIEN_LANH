/* BÀI 1 — DÀN LẠNH TỦ LẠNH (biên soạn từ docs/Bai_1.txt) */
(function () {
  const { $, $$ } = DL;

  /* ============ Dữ liệu 3 loại dàn ============ */
  const TYPES = [
    { id: 'one', n: 1, name: 'Trực tiếp 1 cánh', short: 'Lắp nổi trong ngăn đông',
      pos: 'Lắp <b>nổi</b> ngay trong ngăn đông — mở cửa là nhìn thấy.',
      mat: 'Nhôm tấm, dạng <b>hộp chữ nhật</b>. Tùy dung tích tủ mà có 1, 3, 4 hay 5 mặt tiếp xúc với thực phẩm.',
      surf: 'Dập nhiều <b>gân (rãnh)</b> trên bề mặt để gas tuần hoàn.',
      pros: ['Làm lạnh nhanh (tiếp xúc trực tiếp thực phẩm)', 'Dễ tháo lắp vì lắp nổi'],
      cons: ['Dễ thủng do va chạm, do lấy thực phẩm ra vào'],
      check: 'Nhìn bề mặt dàn trong ngăn đông: có <b>vết dầu loang</b> là chỗ thủng.',
      fix: 'Tháo dàn → thử kín → hàn nhôm / dán keo Epoxy, hoặc thay dàn / tự chế dàn ống đồng.' },
    { id: 'two', n: 2, name: 'Trực tiếp 2 cánh', short: 'Ẩn sau lớp vỏ nhựa',
      pos: 'Bố trí ở <b>cả ngăn đông và ngăn mát</b>, nằm <b>ẩn sau lớp vỏ nhựa</b> của tủ (không nhìn thấy).',
      mat: '<b>Ống nhôm</b> (phổ biến) hoặc ống đồng (số ít), đường kính khoảng <b>phi 6 – phi 8</b>, quấn quanh ngăn đông.',
      surf: 'Phủ lớp <b>băng dính bạc</b> dán lên để tăng diện tích trao đổi nhiệt.',
      pros: ['Ít va chạm nên ít bị hỏng', 'Bền'],
      cons: ['Làm lạnh chậm hơn', 'Gia công, sửa chữa rất khó (phải đào lớp xốp cách nhiệt)'],
      check: 'Không quan sát được dàn → phải <b>thử kín bằng khí nitơ</b> và đồng hồ áp suất.',
      fix: 'Tháo tấm tôn sau + nắp nhựa trên → đào xốp → lấy dàn ra → tìm chỗ thủng → hàn/dán keo hoặc thay dàn mới.' },
    { id: 'ind', n: 3, name: 'Gián tiếp (quạt gió)', short: 'Có quạt và kênh gió',
      pos: 'Phía <b>sau</b> ngăn đông, hoặc <b>dưới</b> ngăn đông, hoặc nằm <b>giữa</b> ngăn đông và ngăn mát. Phía trước có kênh gió và cánh quạt đối lưu.',
      mat: '<b>Ống nhôm</b> (số đông) hoặc ống đồng (số ít).',
      surf: 'Các <b>lá nhôm mỏng</b> (cánh tản nhiệt) gắn quanh ống.',
      pros: ['Ít va chạm', 'Dễ tháo lắp (chỉ tháo tấm che kênh gió)', 'Làm lạnh đều cả không gian rộng'],
      cons: ['Tuyết bám kín dàn → gió không đối lưu được → tủ kém lạnh', 'Luôn cần quạt và hệ thống kênh dẫn gió'],
      check: 'Tháo tấm che kênh gió để nhìn dàn; <b>thử kín</b> bằng nitơ nếu nghi thủng.',
      fix: 'Tháo dàn (lót tấm sắt chắn nhiệt khi hàn) → thử kín → hàn / keo, hoặc thay dàn mới đúng kích thước.' }
  ];

  /* ============ SVG tủ lạnh theo loại ============ */
  function fridgeSVG(t, frost) {
    const body = `<rect x="50" y="14" width="260" height="412" rx="18" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="68" y="32" width="224" height="376" rx="8" fill="var(--cold-tint2)"/>`;
    const handle = (y, h) => `<rect x="40" y="${y}" width="7" height="${h}" rx="3.5" fill="var(--ink)"/>`;
    let s = body;
    if (t === 'one') {
      s += `<rect x="68" y="32" width="224" height="376" rx="8" fill="none"/>
        <g>
        <rect x="84" y="44" width="192" height="100" rx="8" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="3.5"/>
        ${[62, 80, 98, 116].map(y => `<path d="M96 ${y}H264" stroke="var(--cold)" stroke-width="2" opacity=".55"/>`).join('')}
        <path d="M96 56V132M264 56V132" stroke="var(--cold)" stroke-width="2" opacity=".35"/>
        <path class="flow" d="M96 62H264V80H96V98H264V116H96" stroke="var(--cold-l)" stroke-width="3"/>
        <text class="lbl" x="180" y="38" text-anchor="middle" style="display:none"></text></g>
        ${[196, 262, 328].map(y => `<path d="M82 ${y}H278" stroke="var(--casing)" stroke-width="5"/>`).join('')}
        <text class="fl" x="180" y="176" text-anchor="middle">Ngăn mát (không có dàn)</text>
        <rect x="50" y="14" width="18" height="412" rx="9" fill="var(--casing)" stroke="var(--ink)" stroke-width="2"/>${handle(200, 80)}`;
    } else if (t === 'two') {
      s += `<path d="M68 190H292" stroke="var(--ink)" stroke-width="5"/>
        <rect x="76" y="40" width="208" height="142" rx="6" fill="var(--surface2)" opacity=".75"/>
        <rect x="76" y="198" width="208" height="202" rx="6" fill="var(--surface2)" opacity=".75"/>
        <g fill="none" stroke="var(--cold)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" opacity=".9">
          <path d="M88 52H272V172H88V96H236V132H124" stroke-dasharray="0"/>
          <path d="M88 212H272V300"/>
        </g>
        <path class="flow" d="M88 52H272V172H88V96H236V132H124" stroke="#fff" stroke-width="2.4"/>
        <path class="flow" d="M88 212H272V300" stroke="#fff" stroke-width="2.4"/>
        <text class="fl" x="180" y="70" text-anchor="middle" style="display:none"></text>
        <text class="fl" x="182" y="360" text-anchor="middle">Dàn ẩn sau vỏ nhựa</text>
        <text class="fl" x="182" y="378" text-anchor="middle">(quấn quanh thành tủ)</text>
        <rect x="50" y="14" width="18" height="170" rx="9" fill="var(--casing)" stroke="var(--ink)" stroke-width="2"/>
        <rect x="50" y="196" width="18" height="230" rx="9" fill="var(--casing)" stroke="var(--ink)" stroke-width="2"/>${handle(70, 60)}${handle(250, 70)}`;
    } else {
      const op = (1 - frost / 100 * .88).toFixed(2), fo = (frost / 100 * .92).toFixed(2), fw = 4 + frost / 100 * 5;
      s += `<path d="M68 190H292" stroke="var(--ink)" stroke-width="5"/>
        <rect x="214" y="40" width="70" height="116" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>
        <rect x="222" y="48" width="54" height="96" rx="4" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="2.5"/>
        <path d="M232 52V140M244 52V140M256 52V140M268 52V140" stroke="var(--cold)" stroke-width="3"/>
        ${[60, 72, 84, 96, 108, 120, 132].map(y => `<path d="M224 ${y}H274" stroke="var(--cold)" stroke-width="1.4" opacity=".6"/>`).join('')}
        <rect x="222" y="48" width="54" height="96" rx="4" fill="#fff" opacity="${fo}" stroke="#fff" stroke-width="${fw}"/>
        <g class="air-g" style="opacity:${op}">
          <path class="air" d="M232 168H100V74H214"/>
          <path class="air" d="M270 172V340H100V218H214V160" style="animation-duration:1.3s"/>
        </g>
        <g transform="translate(249 162)"><circle r="13" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2"/>
          <g class="fan"><path d="M0 0L-3-11Q0-13 3-11ZM0 0L11 3Q13 0 11-3ZM0 0L3 11Q0 13-3 11ZM0 0L-11-3Q-13 0-11 3Z" fill="var(--ink)"/></g></g>
        <text class="fl" x="130" y="125" text-anchor="middle">Ngăn đông</text>
        <text class="fl" x="130" y="300" text-anchor="middle">Ngăn mát</text>
        <rect x="50" y="14" width="18" height="170" rx="9" fill="var(--casing)" stroke="var(--ink)" stroke-width="2"/>
        <rect x="50" y="196" width="18" height="230" rx="9" fill="var(--casing)" stroke="var(--ink)" stroke-width="2"/>${handle(70, 60)}${handle(250, 70)}`;
    }
    return `<svg viewBox="0 0 360 440" role="img" aria-label="Mặt cắt tủ lạnh ${TYPES.find(x => x.id === t).name}">${s}</svg>`;
  }

  /* ============ SVG tổng quan dàn lạnh ============ */
  const OVERVIEW = `<svg viewBox="0 0 660 270" role="img" aria-label="Gas lạnh sôi trong dàn lạnh và hút nhiệt từ thực phẩm">
    <rect x="150" y="40" width="360" height="190" rx="16" fill="var(--cold-tint)"/>
    <text class="sub" x="330" y="30" text-anchor="middle">Bên trong tủ (nóng hơn gas) — nhiệt đi vào dàn lạnh</text>
    <path d="M60 135H190" class="casing" stroke-width="14"/><path d="M470 135H600" class="casing" stroke-width="14"/>
    <path id="coil" d="M190 135H220V80H260V190H300V80H340V190H380V80H420V190H460V135H470" fill="none" stroke="var(--cold)" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
    <path class="flow" d="M60 135H220V80H260V190H300V80H340V190H380V80H420V190H460V135H600" stroke="#fff" stroke-width="3"/>
    <g class="heat-g"><path class="heat" d="M240 54V74" marker-end="url(#ah)"/></g><g class="heat-g b"><path class="heat" d="M320 54V74" marker-end="url(#ah)"/></g><g class="heat-g c"><path class="heat" d="M400 54V74" marker-end="url(#ah)"/></g>
    <g class="heat-g b"><path class="heat" d="M280 216V196" marker-end="url(#ah)"/></g><g class="heat-g"><path class="heat" d="M360 216V196" marker-end="url(#ah)"/></g>
    <defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="heat-h"/></marker></defs>
    ${[[250, 140, 0], [330, 150, .8], [410, 130, 1.4], [290, 120, 1.9], [370, 160, .4]].map(b => `<circle class="bub" cx="${b[0]}" cy="${b[1]}" r="5" style="animation-delay:${b[2]}s"/>`).join('')}
    <text class="lbl" x="105" y="116" text-anchor="middle">Gas lỏng lạnh</text><text class="sub" x="105" y="160" text-anchor="middle">áp suất thấp</text><text class="sub" x="105" y="178" text-anchor="middle">(từ ống mao)</text>
    <text class="lbl" x="555" y="116" text-anchor="middle">Hơi gas</text><text class="sub" x="555" y="160" text-anchor="middle">về máy nén</text>
    <text class="lbl" x="330" y="256" text-anchor="middle" fill="var(--cold)">DÀN LẠNH = nơi gas SÔI → HÚT nhiệt</text></svg>`;

  /* ============ Đồng hồ áp suất ============ */
  function gaugeSVG(v) {
    const ang = Math.PI * (1 - v / 400), cx = 150, cy = 150, r = 105;
    const px = (a, rr) => (cx + rr * Math.cos(a)).toFixed(1), py = (a, rr) => (cy - rr * Math.sin(a)).toFixed(1);
    let t = '';
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI * (1 - i / 8);
      t += `<path d="M${px(a, r - 12)} ${py(a, r - 12)}L${px(a, r)} ${py(a, r)}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="${px(a, r - 28)}" y="${+py(a, r - 28) + 4}" text-anchor="middle">${i * 50}</text>`;
    }
    return `<svg viewBox="0 0 300 190" role="img" aria-label="Đồng hồ áp suất đang chỉ ${Math.round(v)} psi">
      <path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M${px(Math.PI * (1 - 150 / 400), r - 5)} ${py(Math.PI * (1 - 150 / 400), r - 5)}A${r - 5} ${r - 5} 0 0 1 ${px(Math.PI * (1 - 300 / 400), r - 5)} ${py(Math.PI * (1 - 300 / 400), r - 5)}" stroke="var(--ok)" stroke-width="5" fill="none" opacity=".5"/>
      ${t}<path d="M${cx} ${cy}L${px(ang, r - 18)} ${py(ang, r - 18)}" stroke="var(--hot)" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="9" fill="var(--ink)"/>
      <text class="lbl" x="150" y="182" text-anchor="middle">${Math.round(v)} psi</text></svg>`;
  }

  /* ============ HTML bài học ============ */
  const steps = (arr) => `<ol class="steps">${arr.map(s => `<li tabindex="0"><div><b>${s[0]}</b><span>${s[1]}</span></div></li>`).join('')}</ol><div class="prog"><span class="pc">Đã làm 0/${arr.length} bước</span><div class="bar"><i style="width:0"></i></div><span class="muted">(bấm vào từng bước để đánh dấu)</span></div>`;

  function learn() {
    return `
<section class="sec" id="s-what" data-toc="1 · Dàn lạnh là gì?">
  <div class="sec-n">Phần 1</div><h2>Dàn lạnh làm nhiệm vụ gì?</h2>
  <p>Tủ lạnh có <b>4 bộ phận chính</b> trong vòng tuần hoàn gas: <b>máy nén → dàn nóng → ống mao → dàn lạnh</b>. Dàn lạnh là nơi cuối cùng: gas lỏng đã bị giảm áp, nhiệt độ rất thấp nên <b>sôi</b> và <b>hút nhiệt</b> từ thực phẩm — đó chính là lúc tủ “lạnh”.</p>
  <div class="stage" id="ov">${OVERVIEW}
    <div class="controls"><button class="btn sm" id="ovPlay" type="button">Tạm dừng hoạt ảnh</button></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ</b><p>Dàn <b class="hot-t">nóng</b> = <b>tỏa</b> nhiệt ra ngoài. Dàn <b class="cold-t">lạnh</b> = <b>hút</b> nhiệt từ trong tủ. Nhớ “lạnh hút – nóng thải”.</p></div></div>
</section>

<section class="sec" id="s-types" data-toc="2 · 3 loại dàn lạnh">
  <div class="sec-n">Phần 2</div><h2>Phân loại: 3 loại dàn lạnh</h2>
  <p>Người ta phân loại dàn lạnh theo <b>kiểu tủ</b> (cách làm lạnh môi trường trong tủ). Bấm từng loại để xem dàn nằm ở đâu, làm bằng gì và ưu – nhược điểm.</p>
  <div class="tabs" id="typeTabs">${TYPES.map((t, i) => `<button class="tab" type="button" data-t="${t.id}" aria-pressed="${i === 0}"><b>${t.n}</b><span>${t.name}<br><small class="muted">${t.short}</small></span></button>`).join('')}</div>
  <div class="grid2" style="margin-top:14px;align-items:start">
    <div class="stage" style="margin:0" id="fridgeStage"><div id="fridgeBox"></div>
      <div id="frostCtl" class="controls" hidden><label>Lớp tuyết bám trên dàn <input id="frost" type="range" min="0" max="100" value="0" aria-label="Mức tuyết bám"></label></div></div>
    <article class="panel" id="typePanel" aria-live="polite"></article>
  </div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Ghi nhớ nhanh</b>
    <p><b>1 cánh</b> = dàn <i>lộ</i> → nhanh nhưng dễ thủng. <b>2 cánh</b> = dàn <i>ẩn</i> sau vỏ → bền nhưng khó sửa. <b>Gián tiếp</b> = dàn có <i>quạt</i> → dễ tháo nhưng sợ <i>tuyết</i>.</p></div></div>
  <h3 style="margin-top:30px">Bảng so sánh</h3>
  <div class="tscroll"><table class="cmp"><thead><tr><th></th>${TYPES.map(t => `<th>${t.name}</th>`).join('')}</tr></thead><tbody>
    <tr><th>Vị trí</th>${TYPES.map(t => `<td>${t.pos}</td>`).join('')}</tr>
    <tr><th>Vật liệu</th>${TYPES.map(t => `<td>${t.mat}</td>`).join('')}</tr>
    <tr><th>Bề mặt dẫn nhiệt</th>${TYPES.map(t => `<td>${t.surf}</td>`).join('')}</tr>
    <tr><th>Ưu điểm</th>${TYPES.map(t => `<td>${t.pros.map(p => `<span class="pill ok">${p}</span>`).join('')}</td>`).join('')}</tr>
    <tr><th>Nhược điểm</th>${TYPES.map(t => `<td>${t.cons.map(p => `<span class="pill bad">${p}</span>`).join('')}</td>`).join('')}</tr>
  </tbody></table></div>
</section>

<section class="sec" id="s-fault" data-toc="3 · Hư hỏng thường gặp">
  <div class="sec-n">Phần 3</div><h2>Dàn lạnh hay hỏng ở đâu?</h2>
  <p>Khi tủ <b>chạy nhưng không lạnh</b>, nguyên nhân có thể nằm ở bất kỳ bộ phận nào trên vòng gas. Bấm vào từng bộ phận để xem kiểu hỏng của nó.</p>
  <div class="tabs" id="faultTabs">
    <button class="tab" type="button" data-f="evap" aria-pressed="true"><b>4</b><span>Dàn lạnh</span></button>
    <button class="tab" type="button" data-f="cond" aria-pressed="false"><b>2</b><span>Dàn nóng</span></button>
    <button class="tab" type="button" data-f="filter" aria-pressed="false"><b>·</b><span>Phin lọc</span></button>
    <button class="tab" type="button" data-f="cap" aria-pressed="false"><b>3</b><span>Ống mao</span></button>
  </div>
  <article class="panel hotc" id="faultPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">💡</span><div><b class="t">Vì sao thủng thì tủ mất lạnh?</b>
    <p>Dàn lạnh thủng → <b>gas và dầu thoát ra ngoài</b> → hệ thống mất môi chất. Không còn gas để sôi và hút nhiệt → tủ <b>không còn lạnh</b>. Dàn lạnh thường thủng do <b>va chạm</b> hoặc do <b>mòn, ăn mòn</b> theo thời gian.</p></div></div>
</section>

<section class="sec" id="s-test" data-toc="4 · Kiểm tra, thử kín">
  <div class="sec-n">Phần 4</div><h2>Kiểm tra: dàn có bị thủng không?</h2>
  <p>Bước đầu tiên luôn là <b>quan sát</b>. Nếu không thấy gì, ta dùng phương pháp <b>thử kín</b>: tách dàn ra khỏi hệ thống, bơm khí nitơ vào rồi xem áp suất có tụt không.</p>
  <h3 style="margin-top:22px">Quy trình theo từng loại tủ</h3>
  <div class="tabs" id="testTabs">${TYPES.map((t, i) => `<button class="tab" type="button" data-t="${t.id}" aria-pressed="${i === 0}"><b>${t.n}</b><span>${t.name}</span></button>`).join('')}</div>
  <div id="testSteps"></div>

  <h3 style="margin-top:34px">Mô phỏng đồng hồ áp suất</h3>
  <p>Bơm nitơ vào dàn đến <b>200–300 psi</b> (đã hàn kín một đầu, nối đồng hồ ở đầu kia). Chọn tình huống rồi bấm “Bắt đầu theo dõi” để xem kim đồng hồ.</p>
  <div class="gauge-wrap">
    <div class="stage" style="margin:0">${'<div id="gaugeBox"></div>'}<div class="controls" style="justify-content:center"><span class="muted" id="clock">Thời gian: 0 giờ</span></div></div>
    <div>
      <div class="opts-r" id="leakOpts">
        <label><input type="radio" name="leak" value="ok" checked><span><b>Dàn kín tốt</b><br><small class="muted">Không có chỗ thủng</small></span></label>
        <label><input type="radio" name="leak" value="small"><span><b>Thủng rất nhỏ (xì chậm)</b><br><small class="muted">Phải chờ 24–48 giờ mới thấy</small></span></label>
        <label><input type="radio" name="leak" value="big"><span><b>Thủng lớn</b><br><small class="muted">Kim tụt nhanh thấy ngay</small></span></label>
      </div>
      <div class="row"><button class="btn pri" id="gStart" type="button">▶ Bắt đầu theo dõi</button><button class="btn" id="gReset" type="button">↺ Bơm lại</button></div>
      <div class="verdict" id="gVerdict" style="margin-top:12px">Kim đang ở 300 psi. Hãy bấm “Bắt đầu theo dõi”.</div>
    </div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Quy tắc đọc kết quả</b><p>Sau một thời gian, kim <b>vẫn chỉ giá trị ban đầu</b> → dàn <b class="cold-t">kín</b>. Kim <b>nhỏ hơn giá trị ban đầu</b> → dàn <b class="hot-t">thủng</b> → phải lấy dàn ra tìm vị trí thủng (nhúng nước hoặc quét bọt xà phòng).</p></div></div>
  <div class="grid2" style="margin-top:20px">
    <div class="panel okc" style="margin:0"><h4>Áp suất thử theo dàn</h4>
      <dl class="kv" style="grid-template-columns:110px 1fr"><dt>Dàn lạnh</dt><dd>áp thấp → thử <b>150 – 250 psi</b></dd><dt>Dàn nóng</dt><dd>áp cao → thử <b>300 – 400 psi</b></dd></dl>
      <span class="muted" style="font-size:14px">Dàn lạnh làm việc ở áp suất thấp nên thử với áp thấp hơn dàn nóng.</span></div>
    <div class="panel warm" style="margin:0"><h4>Dụng cụ cần chuẩn bị</h4><p style="margin:6px 0 0">Bình khí nitơ + đồng hồ áp suất, dây nạp, bọt xà phòng, chậu nước, bộ hàn hơi (hàn kín đầu ống).</p></div></div>
</section>

<section class="sec" id="s-fix" data-toc="5 · Sửa chữa, thay thế">
  <div class="sec-n">Phần 5</div><h2>Sửa chữa hoặc thay dàn lạnh</h2>
  <p>Sau khi tìm ra chỗ thủng có <b>3 hướng xử lý</b>. Chọn cách phù hợp: thủng nhỏ, một chỗ thì sửa; thủng nhiều chỗ hoặc sửa xong lại hỏng thì thay dàn.</p>
  <div class="tabs" id="fixTabs">
    <button class="tab" type="button" data-x="epoxy" aria-pressed="true"><b>A</b><span>Dán keo Epoxy<br><small class="muted">lỗ thủng nhỏ</small></span></button>
    <button class="tab" type="button" data-x="weld" aria-pressed="false"><b>B</b><span>Hàn kín<br><small class="muted">hàn nhôm / hàn đồng</small></span></button>
    <button class="tab" type="button" data-x="swap" aria-pressed="false"><b>C</b><span>Thay / tự chế dàn<br><small class="muted">thủng nhiều chỗ</small></span></button>
  </div>
  <div id="fixBody"></div>
  <div class="callout danger"><span class="ic">🔥</span><div><b class="t">Lưu ý an toàn: tủ gián tiếp</b><p>Dàn nằm trong lớp xốp cách nhiệt. Khi hàn, hơi nóng làm <b>cháy xốp và nhựa</b>. Hãy <b>lót tấm sắt (hoặc giẻ ướt) chắn nhiệt</b> phía sau mối hàn và hàn <b>thật nhanh</b>.</p></div></div>
  <div class="callout"><span class="ic">🧪</span><div><b class="t">Đổ lại xốp cách nhiệt (sau khi lắp dàn)</b>
    <p>Dùng xốp PU <b>2 thành phần (A : B = 1 : 1)</b>, khuấy thật nhanh rồi đổ <b>từng lớp mỏng</b>. Đổ một lần quá dày, xốp nở mạnh và sinh nhiệt sẽ làm vỏ tủ <b>phồng, biến dạng</b>. Có thể dùng khăn lạnh/ván chặn bề mặt để vỏ không bị biến dạng. Cuối cùng: <b>hàn lại, hút chân không, nạp gas</b>.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 5 điều cần nhớ</h2>
  <ol class="steps recap" style="counter-reset:s">
    <li class="done"><div><b>Dàn lạnh = nơi gas sôi và hút nhiệt.</b><span>Áp suất thấp, nhiệt độ thấp → thu nhiệt của thực phẩm trong tủ.</span></div></li>
    <li class="done"><div><b>Có 3 loại: trực tiếp 1 cánh, trực tiếp 2 cánh, gián tiếp.</b><span>Phân biệt theo vị trí, vật liệu, bề mặt dẫn nhiệt.</span></div></li>
    <li class="done"><div><b>Dàn lạnh chỉ hỏng ở dạng thủng.</b><span>Thủng → mất gas và dầu → tủ không lạnh. Nguyên nhân: va chạm, mòn.</span></div></li>
    <li class="done"><div><b>Kiểm tra: quan sát vết dầu loang, rồi thử kín bằng nitơ.</b><span>Kim đồng hồ tụt = thủng. Thử 150–250 psi (dàn lạnh).</span></div></li>
    <li class="done"><div><b>Sửa: keo Epoxy / hàn / thay dàn.</b><span>Tủ gián tiếp nhớ chắn nhiệt khi hàn; đổ xốp từng lớp mỏng; xong phải hút chân không và nạp gas.</span></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/1/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  /* ============ Tương tác ============ */
  function bindSteps(root) {
    $$('ol.steps:not(.recap)', root).forEach(ol => {
      const items = $$('li', ol), box = ol.nextElementSibling;
      const upd = () => { const d = items.filter(i => i.classList.contains('done')).length; $('.pc', box).textContent = `Đã làm ${d}/${items.length} bước`; $('.bar i', box).style.width = d / items.length * 100 + '%'; };
      items.forEach(li => {
        const t = () => { li.classList.toggle('done'); upd(); };
        li.onclick = t; li.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } };
      });
    });
  }
  const pressed = (wrap, btn) => $$('.tab', wrap).forEach(b => b.setAttribute('aria-pressed', b === btn));

  const FAULTS = {
    evap: { h: '4. Dàn lạnh — hỏng ở dạng <span class="hot-t">THỦNG</span>', c: 'hotc', b: '<p>Dàn lạnh thường chỉ hỏng ở một dạng: <b>nứt / thủng</b> do va chạm hoặc bị mòn. Thủng thì <b>mất gas và dầu</b> → tủ không còn lạnh.</p><p><span class="pill bad">Thủng</span><span class="pill cold">Không tắc (ống to)</span></p><p class="muted" style="margin:0">Ống dàn lạnh khá lớn (khoảng phi 6 – 8) nên hầu như không bị tắc; hỏng chủ yếu là thủng.</p>' },
    cond: { h: '2. Dàn nóng — thủng hoặc tắc', c: 'warm', b: '<p>Dàn nóng có thể <b>thủng</b> (xì gas) hoặc <b>bị bẩn / tắc</b> gây tản nhiệt kém, tủ chạy liên tục nhưng không lạnh. Sẽ học kỹ ở <a href="#/tu-lanh/3">Bài 3</a>.</p>' },
    filter: { h: 'Phin lọc — tắc một phần hoặc toàn phần', c: 'warm', b: '<p>Phin lọc giữ cặn bẩn và hơi ẩm. Khi bị <b>tắc một phần</b> tủ lạnh yếu; <b>tắc toàn phần</b> gas không đi qua được → tủ không lạnh. Xem <a href="#/tu-lanh/4">Bài 4</a>.</p>' },
    cap: { h: '3. Ống mao — tắc một phần hoặc toàn phần', c: 'warm', b: '<p>Ống mao có tiết diện rất nhỏ (cỡ <b>1–2 mm</b> trở xuống) nên <b>dễ tắc</b> bởi cặn bẩn, hơi ẩm. Ngược lại dàn lạnh có ống lớn hơn nhiều (cỡ phi 6 – 8) nên không tắc mà chỉ thủng. Xem <a href="#/tu-lanh/4">Bài 4</a>.</p>' }
  };

  const TEST = {
    one: [['Quan sát bề mặt dàn trong ngăn đông', 'Dàn lắp nổi nên nhìn thấy được. Có <b>vết dầu loang</b> là vị trí thủng.'], ['Không thấy vết dầu → tháo dàn ra ngoài', 'Cắt ống tách dàn khỏi hệ thống.'], ['Hàn kín một đầu ống, đầu kia nối bơm', 'Dùng bộ hàn hơi để hàn kín.'], ['Bơm khí vào dàn, nhúng dàn xuống nước', 'Nhìn chỗ nào <b>nổi bọt khí</b> là chỗ thủng.'], ['Đánh dấu vị trí thủng và tiến hành sửa', 'Chuyển sang phần 5 để chọn cách sửa.']],
    two: [['Dàn nằm sau vỏ nhựa nên không quan sát được', 'Không có cách nhìn vết dầu loang → phải <b>thử kín</b>.'], ['Tách dàn khỏi hệ thống, hàn kín đầu ống mao và đầu hồi về', 'Cắt tại mối hàn của ống mao và ống hồi về máy nén.'], ['Nối đồng hồ áp suất, bơm nitơ 200–300 psi', 'Bơm qua bộ đồng hồ áp suất.'], ['Quét bọt xà phòng vào mối nối dây đồng hồ', 'Loại trừ xì ở đầu nối (không phải dàn).'], ['Chờ rồi so sánh kim đồng hồ', 'Kim tụt so với ban đầu → dàn thủng; đứng yên → dàn kín.'], ['Nếu thủng: lấy dàn ra để tìm chỗ thủng', 'Tháo tấm tôn, nắp nhựa, đào xốp, đưa dàn ra, nhúng nước tìm bọt khí.']],
    ind: [['Tháo tấm che kênh gió phía trước dàn', 'Che chắn cẩn thận, tháo cánh quạt nếu cần. Quan sát dàn xem có dầu loang, tuyết bám.'], ['Tách dàn khỏi hệ thống', 'Có 2 mối nối: ống mao → đầu dàn, và đầu dàn → ống hồi về máy nén.'], ['Nối đồng hồ, bơm nitơ 150–250 psi', 'Áp suất thấp hơn dàn nóng vì dàn lạnh làm việc ở áp thấp.'], ['Quét bọt xà phòng các mối nối, rồi theo dõi kim', 'Kim tụt → dàn thủng.'], ['Lấy dàn ra, nhúng nước tìm chỗ thủng', 'Nhớ lót tấm chắn nhiệt nếu phải hàn lại trong lòng tủ.']]
  };

  const FIX = {
    epoxy: { t: 'Dán keo Epoxy (keo 2 thành phần, “keo dán sắt”)', tip: 'Dùng cho <b>lỗ nhỏ</b>, dàn nhôm vì hàn nhôm rất khó. Nếu lỗ lớn: dán thêm <b>lá nhôm</b> hoặc băng dính bạc che chỗ thủng để keo không lọt vào trong ống.',
      s: [['Chà nhám chỗ thủng', 'Dùng giấy nhám đánh sạch lớp sơn / lớp oxit nhôm cho bề mặt nhám.'], ['Sấy nóng bề mặt', 'Dùng máy sấy tóc hơ nóng vùng cần dán.'], ['Trộn keo tỉ lệ 1 : 1', 'Hai thành phần trộn đều, sấy nóng keo cho dẻo mềm.'], ['Quét keo / dán lá nhôm che lỗ', 'Lỗ nhỏ chỉ cần quét keo; lỗ lớn dán lá nhôm rồi phủ keo.'], ['Sấy cho keo kết dính', 'Hơ máy sấy tóc đến khi keo dính chặt, chờ khô hẳn rồi thử kín lại.']] },
    weld: { t: 'Hàn kín chỗ thủng', tip: 'Dàn <b>nhôm</b> cần que <b>hàn nhôm chuyên dụng</b> (khó). Dàn <b>đồng</b> hàn đồng như thường. Dàn đã dùng lâu phải <b>vệ sinh sạch lớp oxit</b> trước khi hàn.',
      s: [['Làm sạch vị trí thủng', 'Đánh sạch lớp oxit, bụi bẩn, dầu.'], ['Chọn que hàn đúng vật liệu', 'Nhôm → que hàn nhôm; đồng → que hàn đồng.'], ['Hàn nhanh, gọn', 'Với tủ gián tiếp: lót tấm sắt chắn nhiệt để không cháy xốp.'], ['Thử kín lại', 'Bơm nitơ, quét xà phòng/ nhúng nước, theo dõi kim đồng hồ.']] },
    swap: { t: 'Thay dàn mới hoặc tự chế dàn ống đồng', tip: 'Nếu <b>thủng nhiều chỗ</b> hoặc sửa xong lại hỏng: thay dàn có <b>hình dạng và kích thước tương đương</b> (dàn nhỏ quá thì tủ kém lạnh). Không có dàn phù hợp thì tự chế.',
      s: [['Chọn dàn thay thế phù hợp', 'Mua dàn đúng kích thước. Dàn quá nhỏ → năng suất lạnh thấp.'], ['Tự chế (tủ 1 cánh): quấn ống đồng quanh dàn', 'Dùng ống đồng cùng tiết diện, quấn quanh hộp nhôm cũ; nhôm dẫn nhiệt tốt nên vẫn đạt năng suất tương đương.'], ['Tự chế (tủ 2 cánh): quấn ống đồng phi 6 hoặc phi 8', 'Tủ đời mới thường dùng phi 8. Ngăn đông quấn khoảng <b>7–8 vòng</b> từ trên xuống; ngăn mát quấn khoảng 2 vòng.'], ['Cố định dàn vào lớp vỏ', 'Dán băng dính bạc để tăng diện tích trao đổi nhiệt, định vị khoảng cách.'], ['Đổ lại xốp, hàn lại, hút chân không, nạp gas', 'Xốp PU đổ từng lớp mỏng (A:B = 1:1). Cuối cùng nạp gas.']] }
  };

  function mount(root) {
    // phần 1: tạm dừng hoạt ảnh
    const ov = $('#ov', root), pb = $('#ovPlay', root);
    pb.onclick = () => { const p = ov.classList.toggle('paused'); pb.textContent = p ? 'Chạy hoạt ảnh' : 'Tạm dừng hoạt ảnh'; };

    // phần 2: 3 loại dàn
    const tt = $('#typeTabs', root), fb = $('#fridgeBox', root), frost = $('#frost', root);
    function showType(id) {
      const t = TYPES.find(x => x.id === id);
      fb.innerHTML = fridgeSVG(id, +frost.value);
      $('#frostCtl', root).hidden = id !== 'ind'; const fn = $('#frostNote', root); if (fn) fn.innerHTML = '';
      $('#typePanel', root).innerHTML = `<h3>${t.n}. ${t.name}</h3>
        <dl class="kv"><dt>Vị trí</dt><dd>${t.pos}</dd><dt>Vật liệu</dt><dd>${t.mat}</dd><dt>Bề mặt dẫn nhiệt</dt><dd>${t.surf}</dd>
        <dt>Ưu điểm</dt><dd>${t.pros.map(p => `<span class="pill ok">${p}</span>`).join('')}</dd>
        <dt>Nhược điểm</dt><dd>${t.cons.map(p => `<span class="pill bad">${p}</span>`).join('')}</dd>
        <dt>Cách kiểm tra</dt><dd>${t.check}</dd><dt>Cách xử lý</dt><dd>${t.fix}</dd></dl>`;
    }
    let curType = 'one';
    tt.onclick = e => { const b = e.target.closest('.tab'); if (!b) return; curType = b.dataset.t; frost.value = 0; pressed(tt, b); showType(curType); };
    frost.oninput = () => {
      const v = +frost.value;
      fb.innerHTML = fridgeSVG('ind', v);
      const note = v < 30 ? '' : v < 70 ? '<div class="why" style="margin:0 14px 12px">Tuyết dày dần, gió qua dàn yếu đi.</div>' : '<div class="why" style="margin:0 14px 12px;border-color:var(--bad)"><b>Tuyết bám kín dàn</b> → quạt không hút/đẩy gió qua dàn được → tủ <b>kém lạnh</b>.</div>';
      let n = $('#frostNote', root); if (!n) { n = document.createElement('div'); n.id = 'frostNote'; $('#fridgeStage', root).appendChild(n); }
      n.innerHTML = note;
    };
    showType('one');

    // phần 3: hư hỏng
    const ft = $('#faultTabs', root), fp = $('#faultPanel', root);
    const showFault = k => { const f = FAULTS[k]; fp.className = 'panel ' + f.c; fp.innerHTML = `<h3>${f.h}</h3>${f.b}`; };
    ft.onclick = e => { const b = e.target.closest('.tab'); if (!b) return; pressed(ft, b); showFault(b.dataset.f); };
    showFault('evap');

    // phần 4: quy trình + đồng hồ
    const tst = $('#testTabs', root), tbox = $('#testSteps', root);
    const showTest = id => { tbox.innerHTML = steps(TEST[id]); bindSteps(tbox); };
    tst.onclick = e => { const b = e.target.closest('.tab'); if (!b) return; pressed(tst, b); showTest(b.dataset.t); };
    showTest('one');

    const gb = $('#gaugeBox', root), clock = $('#clock', root), vd = $('#gVerdict', root);
    let tm = null, hours = 0;
    const kind = () => $('input[name=leak]:checked', root).value;
    const pressure = h => { const k = kind(); return k === 'ok' ? 300 : k === 'small' ? 300 * Math.exp(-h / 28) : 300 * Math.exp(-h * 14); };
    const draw = () => { gb.innerHTML = gaugeSVG(pressure(hours)); clock.textContent = 'Thời gian: ' + (hours < 1 ? Math.round(hours * 60) + ' phút' : Math.round(hours) + ' giờ'); };
    function reset() { clearInterval(tm); tm = null; hours = 0; draw(); vd.className = 'verdict'; vd.textContent = 'Kim đang ở 300 psi. Hãy bấm “Bắt đầu theo dõi”.'; $('#gStart', root).disabled = false; }
    function finish() {
      clearInterval(tm); tm = null; $('#gStart', root).disabled = true;
      const k = kind();
      vd.className = 'verdict ' + (k === 'ok' ? 'ok' : 'bad');
      vd.innerHTML = k === 'ok' ? '✓ Kim vẫn ở 300 psi (bằng giá trị ban đầu) → <b>dàn kín tốt</b>.' : '✗ Kim <b>tụt thấp hơn</b> giá trị ban đầu → <b>dàn bị thủng</b>. ' + (k === 'small' ? 'Thủng nhỏ nên phải chờ rất lâu mới thấy — đừng kết luận quá sớm!' : 'Thủng lớn nên kim tụt gần như ngay.') + ' Tiếp theo: lấy dàn ra, nhúng nước tìm bọt khí.';
    }
    $('#gStart', root).onclick = () => {
      if (tm) return; vd.className = 'verdict'; vd.textContent = 'Đang theo dõi kim đồng hồ…';
      const k = kind(), end = 48, dt = k === 'big' ? .02 : .5;
      tm = setInterval(() => { hours += dt; if (hours >= (k === 'big' ? 1 : end)) { hours = k === 'big' ? 1 : end; draw(); finish(); } else draw(); }, 50);
    };
    $('#gReset', root).onclick = reset;
    $$('input[name=leak]', root).forEach(r => r.onchange = reset);
    draw();

    // phần 5: sửa chữa
    const xt = $('#fixTabs', root), xb = $('#fixBody', root);
    const showFix = k => { const f = FIX[k]; xb.innerHTML = `<article class="panel warm"><h3>${f.t}</h3><p>${f.tip}</p></article>${steps(f.s)}`; bindSteps(xb); };
    xt.onclick = e => { const b = e.target.closest('.tab'); if (!b) return; pressed(xt, b); showFix(b.dataset.x); };
    showFix('epoxy');
  }

  /* ============ Ôn luyện ============ */
  const flashcards = [
    { f: 'Dàn lạnh có nhiệm vụ gì?', b: 'Là nơi gas <b>sôi</b> ở áp suất và nhiệt độ thấp, <b>hút nhiệt</b> của thực phẩm/môi trường trong tủ → làm lạnh.', tag: 'Khái niệm' },
    { f: 'Có mấy loại dàn lạnh? Kể tên.', b: '<b>3 loại</b>: dàn tủ trực tiếp 1 cánh, dàn tủ trực tiếp 2 cánh, dàn tủ gián tiếp (quạt gió).', tag: 'Phân loại' },
    { f: 'Dàn tủ <b>1 cánh</b> nằm ở đâu?', b: 'Lắp <b>nổi</b> trong ngăn đông, nhìn thấy được.', tag: 'Tủ 1 cánh' },
    { f: 'Vật liệu và hình dạng dàn tủ <b>1 cánh</b>?', b: '<b>Nhôm tấm</b>, dạng <b>hộp chữ nhật</b>, bề mặt có nhiều <b>gân</b> để gas tuần hoàn.', tag: 'Tủ 1 cánh' },
    { f: 'Ưu – nhược điểm của dàn tủ <b>1 cánh</b>?', b: 'Ưu: làm lạnh <b>nhanh</b>, dễ tháo lắp.<br>Nhược: <b>dễ thủng</b> do va chạm khi lấy thực phẩm.', tag: 'Tủ 1 cánh' },
    { f: 'Dàn tủ <b>2 cánh</b> nằm ở đâu?', b: 'Ở cả ngăn đông và ngăn mát, <b>ẩn sau lớp vỏ nhựa</b>.', tag: 'Tủ 2 cánh' },
    { f: 'Vật liệu dàn tủ <b>2 cánh</b>?', b: '<b>Ống nhôm</b> (chủ yếu) hoặc ống đồng (ít), cỡ <b>phi 6 – phi 8</b>.', tag: 'Tủ 2 cánh' },
    { f: 'Bề mặt dẫn nhiệt của dàn tủ <b>2 cánh</b> là gì?', b: 'Lớp <b>băng dính bạc</b> dán lên dàn.', tag: 'Tủ 2 cánh' },
    { f: 'Ưu – nhược điểm của dàn tủ <b>2 cánh</b>?', b: 'Ưu: ít va chạm nên ít hỏng.<br>Nhược: làm lạnh <b>chậm</b>, <b>khó sửa</b> vì nằm sau lớp vỏ.', tag: 'Tủ 2 cánh' },
    { f: 'Dàn tủ <b>gián tiếp</b> nằm ở đâu?', b: 'Sau ngăn đông, hoặc dưới ngăn đông, hoặc giữa ngăn đông và ngăn mát. Có <b>kênh gió + quạt</b>.', tag: 'Tủ gián tiếp' },
    { f: 'Bề mặt dẫn nhiệt của dàn tủ <b>gián tiếp</b>?', b: 'Các <b>lá nhôm mỏng</b> (cánh tản nhiệt) quanh ống nhôm.', tag: 'Tủ gián tiếp' },
    { f: 'Nhược điểm lớn nhất của dàn tủ gián tiếp?', b: '<b>Tuyết bám kín</b> bề mặt dàn → gió không đối lưu được → tủ <b>kém lạnh</b>.', tag: 'Tủ gián tiếp' },
    { f: 'Dàn lạnh thường hỏng ở dạng nào, vì sao?', b: '<b>Thủng</b> (do va chạm, mòn). Thủng → mất gas và dầu → tủ <b>không lạnh</b>.', tag: 'Hư hỏng' },
    { f: 'Dấu hiệu nhận biết dàn tủ 1 cánh bị thủng?', b: 'Có <b>vết dầu loang</b> trên bề mặt dàn trong ngăn đông.', tag: 'Kiểm tra' },
    { f: 'Cách thử kín dàn lạnh?', b: 'Tách dàn, hàn kín đầu, bơm <b>nitơ</b> qua đồng hồ, quét <b>bọt xà phòng</b> mối nối, theo dõi kim: <b>tụt = thủng</b>.', tag: 'Kiểm tra' },
    { f: 'Áp suất thử kín: dàn lạnh và dàn nóng?', b: 'Dàn lạnh (áp thấp): <b>150–250 psi</b>.<br>Dàn nóng (áp cao): <b>300–400 psi</b>.', tag: 'Kiểm tra' },
    { f: 'Tìm vị trí thủng của dàn đã tháo ra bằng cách nào?', b: 'Bơm khí vào dàn rồi <b>nhúng xuống nước</b> → nơi <b>nổi bọt</b> là chỗ thủng.', tag: 'Kiểm tra' },
    { f: 'Dán keo Epoxy: tỉ lệ trộn và thao tác?', b: 'Tỉ lệ <b>1 : 1</b>. Chà nhám sạch → sấy nóng → quét keo (lỗ lớn thêm lá nhôm) → sấy cho keo kết dính.', tag: 'Sửa chữa' },
    { f: 'Vì sao dàn nhôm hay dùng keo Epoxy thay vì hàn?', b: 'Vì <b>hàn nhôm rất khó</b>, cần que hàn nhôm chuyên dụng.', tag: 'Sửa chữa' },
    { f: 'Tự chế dàn ống đồng cho tủ 2 cánh: số vòng quấn?', b: 'Ống đồng <b>phi 6 hoặc phi 8</b>. Ngăn đông ~ <b>7–8 vòng</b> từ trên xuống, ngăn mát ~ 2 vòng.', tag: 'Sửa chữa' },
    { f: 'Khi hàn dàn tủ gián tiếp cần lưu ý gì?', b: 'Lót <b>tấm sắt chắn nhiệt</b> để không cháy xốp/nhựa; hàn <b>thật nhanh</b>.', tag: 'An toàn' },
    { f: 'Đổ xốp PU cách nhiệt: tỉ lệ và cách đổ?', b: 'A : B = <b>1 : 1</b>, khuấy nhanh, đổ <b>từng lớp mỏng</b> để tránh vỏ tủ phồng, biến dạng.', tag: 'Sửa chữa' },
    { f: 'Sau khi sửa/thay dàn xong, cần làm gì để tủ chạy lại?', b: 'Hàn kín lại hệ thống → <b>hút chân không</b> → <b>nạp gas</b>.', tag: 'Sửa chữa' }
  ];

  const quiz = [
    { q: 'Chức năng chính của dàn lạnh là gì?', o: ['Nén gas lên áp suất cao', 'Gas sôi và hút nhiệt của môi trường cần làm lạnh', 'Tỏa nhiệt ra môi trường bên ngoài', 'Lọc cặn bẩn và hơi ẩm'], a: 1, why: 'Dàn lạnh là nơi gas ở áp suất và nhiệt độ thấp <b>sôi</b>, thu nhiệt của thực phẩm.' },
    { q: 'Dàn lạnh được phân loại theo cách nào?', o: ['Theo màu sắc vỏ tủ', 'Theo hãng sản xuất', 'Theo kiểu tủ / môi trường cần làm lạnh (1 cánh, 2 cánh, gián tiếp)', 'Theo loại gas'], a: 2, why: 'Có 3 loại: trực tiếp 1 cánh, trực tiếp 2 cánh và gián tiếp.' },
    { q: 'Dàn của tủ trực tiếp 1 cánh có vị trí thế nào?', o: ['Ẩn sau vỏ nhựa', 'Lắp nổi trong ngăn đông', 'Nằm sau kênh gió', 'Đặt ở phía sau tủ'], a: 1, why: 'Dàn tủ 1 cánh lắp <b>nổi</b> trong ngăn đông nên nhìn thấy được.' },
    { q: 'Nhược điểm của dàn tủ trực tiếp 1 cánh là?', o: ['Làm lạnh chậm', 'Dễ thủng do va chạm khi lấy thực phẩm', 'Cần quạt gió', 'Khó tháo lắp'], a: 1, why: 'Vì lắp nổi và tiếp xúc trực tiếp thực phẩm nên dễ bị va chạm, thủng.' },
    { q: 'Dàn tủ trực tiếp 2 cánh có bề mặt dẫn nhiệt là gì?', o: ['Lá nhôm mỏng', 'Các gân dập nổi', 'Lớp băng dính bạc', 'Lưới thép'], a: 2, why: 'Dàn tủ 2 cánh (ống nhôm/đồng) dán lớp <b>băng dính bạc</b> để tăng diện tích trao đổi nhiệt.' },
    { q: 'Điểm nào là nhược điểm của dàn tủ 2 cánh?', o: ['Dễ va chạm', 'Làm lạnh chậm và khó gia công sửa chữa', 'Luôn cần quạt', 'Tuyết bám kín'], a: 1, why: 'Dàn nằm sau lớp vỏ nhựa nên khó sửa, và làm lạnh chậm hơn.' },
    { q: 'Dàn tủ gián tiếp luôn đi kèm bộ phận nào để đối lưu không khí?', o: ['Phin lọc', 'Quạt gió và kênh dẫn gió', 'Bình ngưng', 'Rơ-le nhiệt'], a: 1, why: 'Không tiếp xúc trực tiếp thực phẩm nên phải dùng quạt + kênh gió để đối lưu.' },
    { q: 'Tủ gián tiếp bị kém lạnh dần, nguyên nhân thường gặp liên quan đến dàn lạnh là?', o: ['Dàn bị oxy hóa', 'Tuyết bám kín bề mặt dàn làm gió không lưu thông', 'Dàn quá lớn', 'Quạt quay quá nhanh'], a: 1, why: 'Tuyết bám kín cản gió qua dàn nên không trao đổi nhiệt được.' },
    { q: 'Dàn lạnh thường hỏng ở dạng nào?', o: ['Tắc một phần', 'Tắc toàn phần', 'Thủng', 'Cháy cuộn dây'], a: 2, why: 'Ống dàn lạnh lớn nên không tắc; hư hỏng chủ yếu là <b>thủng</b> do va chạm, mòn.' },
    { q: 'Dàn thủng thì tủ lạnh có hiện tượng gì?', o: ['Chạy nhưng không lạnh do mất gas và dầu', 'Lạnh sâu hơn', 'Quạt ngừng quay', 'Đóng tuyết nhiều hơn'], a: 0, why: 'Thủng → gas và dầu thoát ra → hệ thống mất môi chất → không lạnh.' },
    { q: 'Với tủ 1 cánh, dấu hiệu quan sát được tại vị trí dàn thủng là?', o: ['Vết dầu loang', 'Tuyết đóng dày', 'Tiếng ồn', 'Đèn nháy'], a: 0, why: 'Dầu máy nén theo gas rò rỉ ra, để lại <b>vết dầu loang</b> ở chỗ thủng.' },
    { q: 'Để tìm vị trí thủng của dàn đã tháo ra, ta làm gì?', o: ['Đo điện trở', 'Bơm khí vào và nhúng xuống nước xem chỗ nổi bọt', 'Nghe bằng ống nghe', 'Cân khối lượng'], a: 1, why: 'Chỗ thủng sẽ nổi bọt khí khi dàn có áp suất bên trong.' },
    { q: 'Khí dùng để thử kín dàn là?', o: ['Ô-xy', 'Nitơ', 'Hydro', 'Gas lạnh R134a'], a: 1, why: 'Dùng khí <b>nitơ</b> (khô, an toàn, trơ) qua bộ đồng hồ áp suất.' },
    { q: 'Sau khi bơm nitơ, kim đồng hồ tụt thấp hơn giá trị ban đầu nghĩa là gì?', o: ['Dàn kín tốt', 'Dàn bị thủng', 'Máy nén hỏng', 'Phin lọc tắc'], a: 1, why: 'Áp suất mất đi chứng tỏ khí thoát ra ngoài qua chỗ thủng.' },
    { q: 'Áp suất thử kín thích hợp cho dàn lạnh (áp thấp) là?', o: ['50 – 100 psi', '150 – 250 psi', '300 – 400 psi', '500 – 600 psi'], a: 1, why: 'Dàn lạnh làm việc ở áp thấp nên thử 150–250 psi; dàn nóng thử 300–400 psi.' },
    { q: 'Keo Epoxy 2 thành phần được trộn theo tỉ lệ nào?', o: ['1 : 1', '1 : 2', '2 : 1', '1 : 5'], a: 0, why: 'Trộn <b>1 : 1</b> rồi sấy nóng cho dẻo trước khi quét.' },
    { q: 'Trước khi dán keo Epoxy lên dàn nhôm cần làm gì đầu tiên?', o: ['Quét sơn', 'Chà nhám sạch lớp oxit/sơn tại chỗ thủng', 'Nhúng dầu', 'Bơm gas'], a: 1, why: 'Bề mặt phải sạch và nhám thì keo mới bám chắc.' },
    { q: 'Vì sao nhiều thợ dùng keo Epoxy sửa dàn nhôm?', o: ['Rẻ hơn gas', 'Hàn nhôm khó, cần que hàn chuyên dụng', 'Keo dẫn nhiệt tốt hơn', 'Quy định bắt buộc'], a: 1, why: 'Hàn nhôm rất khó nên keo Epoxy là phương án thay thế khi không có đồ hàn chuyên dụng.' },
    { q: 'Khi hàn dàn trong tủ gián tiếp, cần lót tấm sắt để làm gì?', o: ['Chống ồn', 'Tránh nhiệt làm cháy lớp xốp và nhựa', 'Tăng áp suất', 'Cho đẹp'], a: 1, why: 'Nhiệt hàn có thể làm cháy xốp cách nhiệt và nhựa.' },
    { q: 'Khi đổ xốp PU cách nhiệt, cách làm đúng là?', o: ['Đổ một lần thật dày', 'Đổ từng lớp mỏng, khuấy nhanh, tỉ lệ A:B = 1:1', 'Chỉ dùng thành phần A', 'Đổ khi xốp đã khô'], a: 1, why: 'Xốp nở mạnh và sinh nhiệt, đổ dày sẽ làm vỏ tủ phồng, biến dạng.' },
    { q: 'Tự chế dàn tủ 2 cánh: ngăn đông quấn khoảng bao nhiêu vòng ống đồng?', o: ['1 – 2 vòng', '3 – 4 vòng', '7 – 8 vòng', '15 – 20 vòng'], a: 2, why: 'Ngăn đông quấn khoảng 7–8 vòng từ trên xuống, ngăn mát khoảng 2 vòng.' },
    { q: 'Thay dàn mới nhỏ hơn dàn cũ thì hậu quả là gì?', o: ['Tủ lạnh sâu hơn', 'Năng suất làm lạnh thấp, tủ kém lạnh', 'Không ảnh hưởng', 'Tủ bị ồn'], a: 1, why: 'Dàn nhỏ → diện tích trao đổi nhiệt ít → năng suất lạnh không đủ.' },
    { q: 'Sau khi sửa/thay dàn xong, bước cuối cùng để tủ hoạt động lại là?', o: ['Lau sạch tủ', 'Hút chân không và nạp gas', 'Thay dầu máy nén', 'Bật đèn'], a: 1, why: 'Hệ thống phải được hàn kín, hút chân không rồi nạp lại gas.' }
  ];

  const sort = {
    title: 'Đặc điểm này thuộc loại dàn lạnh nào?',
    buckets: [{ id: 'one', name: '1 · Trực tiếp 1 cánh' }, { id: 'two', name: '2 · Trực tiếp 2 cánh' }, { id: 'ind', name: '3 · Gián tiếp' }],
    items: [
      { t: 'Lắp nổi trong ngăn đông, nhìn thấy được', b: 'one' }, { t: 'Nhôm tấm dạng hộp chữ nhật, có nhiều gân', b: 'one' },
      { t: 'Làm lạnh nhanh nhưng dễ thủng do va chạm', b: 'one' }, { t: 'Nhìn thấy vết dầu loang là biết chỗ thủng', b: 'one' },
      { t: 'Ẩn sau lớp vỏ nhựa, quấn quanh ngăn đông', b: 'two' }, { t: 'Bề mặt dẫn nhiệt là băng dính bạc', b: 'two' },
      { t: 'Ít va chạm nhưng làm lạnh chậm, khó sửa', b: 'two' }, { t: 'Sửa phải đào lớp xốp cách nhiệt phía sau', b: 'two' },
      { t: 'Có quạt gió và kênh dẫn gió để đối lưu', b: 'ind' }, { t: 'Bề mặt dẫn nhiệt là các lá nhôm mỏng', b: 'ind' },
      { t: 'Tuyết bám kín dàn làm tủ kém lạnh', b: 'ind' }, { t: 'Tháo tấm che kênh gió là lấy được dàn ra', b: 'ind' }
    ]
  };

  const order = [
    { title: 'Sửa lỗ thủng bằng keo Epoxy', intro: 'Sắp xếp các bước dán keo Epoxy cho đúng thứ tự.',
      steps: ['Xác định vị trí thủng (nhúng nước / quét xà phòng)', 'Chà nhám sạch lớp sơn, lớp oxit tại chỗ thủng', 'Sấy nóng bề mặt dàn bằng máy sấy tóc', 'Trộn keo 2 thành phần tỉ lệ 1 : 1, sấy cho keo dẻo', 'Quét keo (lỗ lớn: dán thêm lá nhôm / băng dính bạc)', 'Sấy cho keo kết dính, chờ khô rồi thử kín lại'] },
    { title: 'Thử kín dàn tủ 2 cánh', intro: 'Dàn nằm sau vỏ nhựa, không nhìn thấy. Sắp xếp quy trình thử kín.',
      steps: ['Tách dàn khỏi hệ thống, hàn kín đầu ống mao', 'Nối đồng hồ áp suất vào đầu hồi về', 'Bơm nitơ lên 200–300 psi', 'Quét bọt xà phòng kiểm tra mối nối dây đồng hồ', 'Chờ một thời gian, đọc lại kim đồng hồ', 'Kim tụt → kết luận dàn thủng, lấy dàn ra tìm chỗ thủng'] },
    { title: 'Thay dàn tủ 2 cánh', intro: 'Sắp xếp các bước thay dàn lạnh tủ trực tiếp 2 cánh.',
      steps: ['Tháo tấm tôn sau tủ và nắp nhựa phía trên', 'Đào lớp xốp cách nhiệt quanh dàn', 'Lấy dàn cũ ra ngoài', 'Lắp dàn mới (hoặc ống đồng tự chế) và dán băng dính bạc', 'Đổ lại xốp PU từng lớp mỏng', 'Hàn lại, hút chân không, nạp gas'] }
  ];

  DL.register({
    id: 1, ready: true, title: 'Dàn lạnh tủ lạnh', sub: 'Phân loại, cấu tạo, hư hỏng, kiểm tra, sửa chữa', minutes: 25,
    lead: 'Dàn lạnh là nơi gas “sôi” để hút nhiệt khiến tủ lạnh. Bài này giúp bạn nhận biết 3 loại dàn, hiểu vì sao dàn bị hỏng, và nắm cách kiểm tra – sửa chữa – thay thế.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
