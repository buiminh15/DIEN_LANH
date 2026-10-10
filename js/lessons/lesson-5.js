/* BÀI 5 — BLOCK TỦ LẠNH: phân loại, cấu tạo, nguyên lý, chân đấu điện, sơ đồ mạch (biên soạn từ docs/Bai_5.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const TYPES = {
    open: ['Máy nén hở', 'Trục khuỷu lòi ra ngoài thân, động cơ đặt riêng, truyền động bằng dây đai hoặc khớp nối. Dùng cho hệ thống lớn.'],
    semi: ['Máy nén nửa kín', 'Thân và động cơ chung một khối nhưng có thể tháo nắp bằng bu-lông để sửa chữa bên trong.'],
    hermetic: ['Máy nén kín (block)', 'Động cơ và máy nén nằm chung trong <b>vỏ thép hàn kín</b>. <b>Tủ lạnh dân dụng dùng loại này</b> — nên khó sửa, gọi là “block” hay “lốc”.']
  };
  const BK = {
    piston: ['Block pit-tông (piston)', ['Hút <b>gián tiếp</b>, đẩy <b>trực tiếp</b>', 'Hệ thống chống rung <b>bên trong</b> vỏ (3–4 lò xo treo cả bộ cơ + điện)', 'Dùng nhiều ở tủ lạnh công suất nhỏ', 'Cần chỗ đặt rộng hơn'], 'Bài này học loại này.'],
    rotor: ['Block rô-to (quay)', ['Nhỏ gọn, chiếm ít chỗ', 'Chống rung bố trí <b>bên ngoài</b> (chân cao su)', 'Chạy êm, ổn định', 'Hay gặp ở điều hòa công suất nhỏ'], 'Không học chi tiết trong chương tủ lạnh.']
  };

  const EXT = {
    shell: ['Vỏ thép', 'Bọc kín toàn bộ phần điện và phần cơ bên trong, bảo vệ chúng và chứa dầu bôi trơn. Hàn kín nên khó mở sửa.'],
    disch: ['Ống đẩy', 'Ống đi ra từ buồng nén: nối với <b>dàn nóng</b>. Gas đi ra là hơi <b>áp suất và nhiệt độ cao</b>.'],
    suct: ['Ống hút', 'Nối với <b>dàn lạnh</b> (qua ống hồi về). Hút hơi gas áp suất thấp, nhiệt độ thấp về.'],
    proc: ['Ống công nghệ', 'Thông với khoang chứa dầu như ống hút, <b>có thể đổi chỗ cho ống hút</b>. Dùng khi gia công: <b>hút chân không, nạp gas, thay dầu</b>.'],
    term: ['3 chân đấu điện (C – R – S)', 'Đưa điện từ ngoài vào cuộn dây bên trong qua <b>sứ cách điện</b>, có nắp che bảo vệ. Chân mạ crôm để tiếp xúc tốt.'],
    feet: ['4 chân cao su', 'Hệ thống chống rung <b>bên ngoài</b>: giảm rung truyền ra khung tủ khi block chạy.'],
    cool: ['2 ống làm mát dầu (loại 5 ống)', 'Một số block lớn/vùng nóng có thêm ống chạy dưới khoang dầu để <b>giải nhiệt cho dầu</b>.']
  };
  const INT = {
    spring: ['Lò xo chống rung (3–4 cái)', 'Treo cả bộ phần cơ + điện lơ lửng trong vỏ → block chạy không kêu, không rung. Hỏng thì block kêu to.'],
    cyl: ['Pit-tông + xi-lanh', 'Pit-tông chuyển động <b>tịnh tiến</b> trong thành xi-lanh để hút và nén gas.'],
    valve: ['Lá van hút và lá van đẩy', 'Lá thép mỏng đóng mở tự động theo chênh áp. Van hút cho gas vào xi-lanh, van đẩy cho gas ra. <b>Van mòn, hở</b> → hút đẩy kém.'],
    crank: ['Trục lệch tâm + thanh truyền (tay biên)', 'Biến chuyển động <b>quay</b> của rô-to thành chuyển động <b>tịnh tiến</b> của pit-tông.'],
    stator: ['Stato', 'Khung sắt từ (lá <b>tôn silic</b> dày 0,35 mm ép khối, có ≥ 24 rãnh) + <b>2 cuộn dây</b> chạy và đề đặt lệch nhau 90°.'],
    rotor: ['Rô-to', 'Lõi sắt từ hình trụ bọc hợp kim nhôm. Nằm trong lòng stato, quay nhờ từ trường quay. Tâm rô-to có <b>rãnh xoắn</b> (như mũi khoan) làm bơm dầu.'],
    oil: ['Dầu bôi trơn & bơm dầu', 'Dầu nằm đáy vỏ. Khi rô-to quay đúng chiều, rãnh xoắn ở trục <b>hút dầu lên</b> bôi trơn các chi tiết. Quay sai chiều là mất bôi trơn → hỏng.']
  };

  function blockSVG(view, sel) {
    const on = k => sel === k ? ' stroke="var(--cold)" stroke-width="4"' : '';
    const g = (k, inner) => `<g data-k="${k}" style="cursor:pointer" tabindex="0">${inner}</g>`;
    if (view === 'ext') {
      return `<svg viewBox="0 0 420 300" role="img" aria-label="Block nhìn bên ngoài">
        ${g('shell', `<rect x="90" y="110" width="240" height="150" rx="70" fill="var(--surface2)" stroke="${sel === 'shell' ? 'var(--cold)' : 'var(--ink)'}" stroke-width="4"/>`)}
        ${g('suct', `<path d="M160 112V50H110" fill="none" stroke="var(--cold)" stroke-width="10" stroke-linecap="round"${on('suct')}/><text class="lbl" x="104" y="44" text-anchor="end">Hút</text>`)}
        ${g('proc', `<path d="M210 112V40" fill="none" stroke="var(--brass)" stroke-width="10" stroke-linecap="round"${on('proc')}/><text class="lbl" x="210" y="30" text-anchor="middle">Công nghệ</text>`)}
        ${g('disch', `<path d="M262 112V50H310" fill="none" stroke="var(--hot)" stroke-width="10" stroke-linecap="round"${on('disch')}/><text class="lbl" x="316" y="44">Đẩy</text>`)}
        ${g('term', `<rect x="62" y="162" width="34" height="62" rx="6" fill="var(--surface2)" stroke="var(--muted)"/>${[170, 185, 200].map(y => `<rect x="44" y="${y}" width="22" height="10" rx="3" fill="var(--brass)"${on('term')}/>`).join('')}<text class="fl" x="30" y="245">3 chân điện</text>`)}
        ${g('feet', [120, 160, 260, 300].map(x => `<ellipse cx="${x}" cy="272" rx="14" ry="8" fill="var(--ink)"${on('feet')}/>`).join('') + '<text class="fl" x="210" y="296" text-anchor="middle">4 chân cao su</text>')}
        <text class="sub" x="210" y="196" text-anchor="middle">BLOCK</text><text class="fl" x="210" y="214" text-anchor="middle">vỏ thép hàn kín</text></svg>`;
    }
    const springs = [118, 160, 260, 302].map(x => `<path d="M${x} 262l-6-8 12-8-12-8 12-8-6-8" fill="none" stroke="var(--muted)" stroke-width="2.5"/>`).join('');
    return `<svg viewBox="0 0 420 300" role="img" aria-label="Mặt cắt bên trong block">
      <rect x="90" y="30" width="240" height="240" rx="50" fill="var(--surface2)" stroke="var(--ink)" stroke-width="4"/>
      ${g('oil', `<path d="M96 238h228v8a44 44 0 0 1-44 24H140a44 44 0 0 1-44-24z" fill="var(--warn-tint)"${on('oil')}/><text class="fl" x="210" y="262" text-anchor="middle">dầu</text><path d="M206 150V238" stroke="var(--brass)" stroke-width="3" stroke-dasharray="3 3"/>`)}
      ${g('spring', springs + `<path d="M105 265H315" stroke="var(--line)" stroke-width="1"/><rect x="104" y="200" width="212" height="7" fill="none"${on('spring')}/>`)}
      ${g('stator', `<rect x="148" y="150" width="30" height="76" rx="4" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="2.5"${on('stator')}/><rect x="242" y="150" width="30" height="76" rx="4" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="2.5"${on('stator')}/>`)}
      ${g('rotor', `<rect x="182" y="160" width="56" height="56" rx="4" fill="var(--warm)" opacity=".8"${on('rotor')}/><text class="fl" x="210" y="192" text-anchor="middle" style="fill:var(--ink)">rô-to</text>`)}
      ${g('crank', `<rect x="203" y="96" width="14" height="64" fill="var(--ink)"/><circle cx="210" cy="104" r="9" fill="var(--hot)"${on('crank')}/><path d="M210 104L168 88" stroke="var(--ink)" stroke-width="5"${on('crank')}/>`)}
      ${g('cyl', `<rect x="108" y="70" width="64" height="38" rx="4" fill="var(--cold-tint)" stroke="var(--ink)" stroke-width="2.5"${on('cyl')}/><rect x="150" y="77" width="12" height="24" fill="var(--hot)"/>`)}
      ${g('valve', `<rect x="100" y="66" width="10" height="46" fill="var(--brass)"${on('valve')}/>`)}
      <text class="lbl" x="104" y="60" text-anchor="end">van</text></svg>`;
  }

  /* ---------- pit-tông chạy theo góc quay ---------- */
  function pistonSVG(th) {
    const r = 28, L = 90, cx = 130, cy = 120, rad = th * Math.PI / 180;
    const pin = { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
    const px = cx + r * Math.cos(rad) + Math.sqrt(L * L - Math.pow(r * Math.sin(rad), 2));
    const suction = th > 0 && th < 180, ph = suction ? 'HÚT' : 'NÉN';
    const dis = th >= 300 || th === 0 ? 1 : 0;
    const p = suction ? 0 : Math.min(1, (th - 180) / 130), col = suction ? 'var(--cold-l)' : p < .85 ? 'var(--warm)' : 'var(--hot)';
    const head = 262;
    return `<svg viewBox="0 0 560 240" role="img" aria-label="Pit-tông ở góc ${Math.round(th)} độ, đang ${ph}">
      <rect x="170" y="86" width="${head - 170}" height="68" fill="var(--cold-tint2)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="${px + 8}" y="90" width="${head - px - 8}" height="60" fill="${col}" opacity=".6"/>
      <rect x="${px - 8}" y="90" width="16" height="60" rx="3" fill="var(--ink)"/>
      <path d="M${pin.x} ${pin.y}L${px} 120" stroke="var(--muted)" stroke-width="6" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="5" fill="var(--ink)"/>
      <path d="M${cx} ${cy}L${pin.x} ${pin.y}" stroke="var(--hot)" stroke-width="5" stroke-linecap="round"/><circle cx="${pin.x}" cy="${pin.y}" r="7" fill="var(--hot)"/>
      <g transform="translate(${head} 100) rotate(${suction ? -35 : 0})"><rect x="0" y="-6" width="8" height="26" fill="var(--cold)"/></g>
      <g transform="translate(${head} 138) rotate(${dis ? 35 : 0})"><rect x="0" y="0" width="8" height="26" fill="var(--hot)"/></g>
      <path d="M${head + 10} 62V92" stroke="var(--cold)" stroke-width="${suction ? 8 : 2}" opacity="${suction ? 1 : .3}"/>
      <path d="M${head + 10} 150V190" stroke="var(--hot)" stroke-width="${dis ? 8 : 2}" opacity="${dis ? 1 : .3}"/>
      <text class="lbl" x="${head + 24}" y="58" style="fill:var(--cold)">Van hút ${suction ? 'MỞ' : 'đóng'}</text>
      <text class="lbl" x="${head + 24}" y="206" style="fill:var(--hot)">Van đẩy ${dis ? 'MỞ' : 'đóng'}</text>
      <text class="sub" x="${head + 14}" y="125">buồng nén</text>
      <text x="40" y="32" font-family="var(--head)" font-weight="700" font-size="34" style="fill:${suction ? 'var(--cold)' : 'var(--hot)'}">${ph}</text>
      <text class="sub" x="40" y="220">trục lệch tâm → thanh truyền → pit-tông</text></svg>`;
  }

  /* ---------- sơ đồ mạch điện ---------- */
  const SCH = {
    1: { name: 'Sơ đồ 1', sub: 'rơle khởi động', K: 1, Cs: 0, Cr: 0, desc: 'Cuộn đề lấy điện qua <b>rơle khởi động (K)</b>. K <b>đóng</b> khi khởi động, <b>ngắt</b> khi rô-to đạt <b>70–75%</b> tốc độ để bảo vệ cuộn đề.' },
    2: { name: 'Sơ đồ 2', sub: 'thêm tụ khởi động', K: 1, Cs: 1, Cr: 0, desc: 'Giống sơ đồ 1 nhưng <b>nối tiếp thêm tụ khởi động (tụ kích)</b> với K. Điện áp tụ cộng với lưới → <b>mô-men khởi động lớn</b>, dùng cho block nặng, khó khởi động. K ngắt thì tụ ngừng làm việc.' },
    3: { name: 'Sơ đồ 3', sub: 'tụ làm việc', K: 0, Cs: 0, Cr: 1, desc: 'Dùng <b>một tụ làm việc (tụ ngậm)</b> nối giữa chân chạy và chân đề, <b>không có rơle</b>. Tụ vừa giúp khởi động vừa chạy. Hay gặp ở máy bơm nước, quạt.' },
    4: { name: 'Sơ đồ 4', sub: 'tụ khởi động + tụ làm việc', K: 1, Cs: 1, Cr: 1, desc: 'Kết hợp 2 và 3: khởi động có <b>K + tụ kích</b>; khi K ngắt, <b>tụ làm việc</b> vẫn hỗ trợ cuộn đề cùng cuộn chạy làm việc.' }
  };
  function circuit(s, st) {
    const S = SCH[s]; // st: {on, kOpen, stuck}
    const powered = st.on, kClosed = st.kClosed;
    const actS = powered && S.K && kClosed;           // nhánh K (+ tụ kích) đang có dòng
    const actCr = powered && S.Cr;                    // nhánh tụ làm việc
    const sPath = actS || actCr;
    const seg = (d, act) => `<path d="${d}" fill="none" stroke="var(--muted)" stroke-width="3" opacity=".55"/>${act ? `<path class="flow" d="${d}" stroke="var(--warm)" stroke-width="4" fill="none"/>` : ''}`;
    const cap = (x, y, lab, act) => `<path d="M${x - 14} ${y - 6}H${x + 14}M${x - 14} ${y + 6}H${x + 14}" stroke="${act ? 'var(--warm)' : 'var(--ink)'}" stroke-width="4"/><text class="fl" x="${x + 20}" y="${y + 4}">${lab}</text>`;
    const coil = (x, y, lab, act) => `<rect x="${x}" y="${y - 20}" width="120" height="40" rx="10" fill="var(--cold-tint)" stroke="${act ? 'var(--warm)' : 'var(--cold)'}" stroke-width="3"/><text class="sub" x="${x + 60}" y="${y + 4}" text-anchor="middle" style="fill:var(--ink)">${lab}</text>`;
    const kOpen = !kClosed;
    return `<svg viewBox="0 0 600 270" role="img" aria-label="Sơ đồ đấu điện ${s}">
      ${seg('M60 60H110', powered)}${seg('M170 60H300', powered)}${seg('M420 60H520', powered)}${seg('M520 60V170', powered || false)}${seg('M420 170H520', sPath)}${seg('M520 170V230H60V60', powered)}
      <circle cx="60" cy="145" r="22" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><text class="lbl" x="60" y="150" text-anchor="middle">~220V</text>
      <rect x="110" y="44" width="60" height="32" rx="6" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="140" y="64" text-anchor="middle" style="fill:var(--ink)">Rơle BV</text>
      <circle cx="200" cy="60" r="5" fill="var(--ink)"/><text class="fl" x="188" y="46">R</text><circle cx="200" cy="170" r="5" fill="var(--ink)"/><text class="fl" x="188" y="190">S</text><circle cx="520" cy="115" r="5" fill="var(--ink)"/><text class="fl" x="530" y="118">C</text>
      ${coil(300, 60, 'Cuộn chạy', powered)}${coil(300, 170, 'Cuộn đề', sPath)}
      ${S.K || S.Cs ? seg('M200 60V80', actS) + seg('M200 118V132', actS) + seg('M200 150V170', actS) : ''}
      ${S.K ? `<path d="M200 80${kOpen ? 'L218 100' : 'V118'}" stroke="var(--ink)" stroke-width="4"/><circle cx="200" cy="118" r="3.5" fill="var(--ink)"/><text class="fl" x="228" y="104">K</text>` : ''}
      ${S.Cs ? cap(200, 141, 'tụ kích', actS) : ''}
      ${S.Cr ? seg('M250 60V104', actCr) + seg('M250 118V170', actCr) + cap(250, 111, 'tụ chạy', actCr) : ''}
      ${S.Cr ? '' : seg('M200 170H300', false)}${S.Cr ? seg('M200 170H300', sPath) : ''}</svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-types" data-toc="1 · Phân loại">
  <div class="sec-n">Phần 1</div><h2>Phân loại máy nén (block)</h2>
  <p>Máy nén hơi có 3 kiểu cấu tạo. Tủ lạnh dân dụng dùng <b>máy nén kín</b> (gọi là <b>block</b> hay <b>lốc</b>):</p>
  <div id="cmpTabs"></div><article class="panel" id="cmpPanel" aria-live="polite"></article>
  <h3 style="margin-top:26px">Hai loại block trong tủ lạnh</h3>
  <div id="bkTabs"></div><article class="panel warm" id="bkPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">❤️</span><div><b class="t">Vai trò</b><p>Block hút hơi gas và nén lên áp suất cao để <b>tuần hoàn gas</b> trong hệ thống. Được ví như <b>trái tim</b> của tủ lạnh. Đi kèm block luôn có: <b>rơle khởi động</b>, <b>rơle bảo vệ</b> (ngắt điện khi quá tải) và đôi khi <b>tụ</b>. Block lắp phía sau tủ; muốn tháo phải cắt mối hàn các ống và tháo ốc chân.</p></div></div>
</section>

<section class="sec" id="s-build" data-toc="2 · Cấu tạo">
  <div class="sec-n">Phần 2</div><h2>Cấu tạo block</h2>
  <p>Block gồm <b>3 phần</b>: <b>vỏ</b>, phần <b>cơ</b> (nén gas), phần <b>điện</b> (động cơ). Bấm vào hình để xem từng bộ phận.</p>
  <div id="vwTabs"></div>
  <div class="grid2" style="margin-top:14px;align-items:start"><div class="stage" style="margin:0" id="blkSvg"></div><article class="panel" id="blkPanel" aria-live="polite"></article></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ 3 ống</b><p><b>Đẩy</b> → dàn <b class="hot-t">nóng</b>. <b>Hút</b> → dàn <b class="cold-t">lạnh</b>. Ống còn lại là <b>công nghệ</b> (để sửa chữa). Muốn phân biệt trên block thật: ống nối với buồng nén có ống nhỏ đi thẳng ra vỏ là <b>ống đẩy</b>; hai ống còn lại không có → hút và công nghệ (đổi chỗ được cho nhau).</p></div></div>
  <h3 style="margin-top:26px">Phần điện</h3>
  <p>Động cơ điện <b>không đồng bộ 1 pha</b>: <b>stato</b> (đứng yên) + <b>rô-to</b> (quay). Stato có <b>2 cuộn dây</b>, đặt lệch nhau <b>90°</b> trong không gian để khi có dòng điện sinh ra <b>từ trường quay</b> kéo rô-to quay:</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Cuộn chạy (R)</h4><p style="margin:6px 0 0">Dây <b>to</b> → điện trở <b>nhỏ</b>, chịu dòng lớn và làm việc <b>liên tục</b> lâu dài.</p></div>
    <div class="panel hotc" style="margin:0"><h4>Cuộn đề (S)</h4><p style="margin:6px 0 0">Dây <b>nhỏ</b>, ít vòng → điện trở <b>lớn</b>, chỉ làm việc <b>rất ngắn lúc khởi động</b> nên phải được ngắt đúng lúc.</p></div></div>
</section>

<section class="sec" id="s-work" data-toc="3 · Nguyên lý">
  <div class="sec-n">Phần 3</div><h2>Nguyên lý làm việc: hút và nén</h2>
  <p>Động cơ quay (≥ 3000 vòng/phút) → <b>trục lệch tâm</b> → <b>thanh truyền</b> → pit-tông chạy qua lại trong xi-lanh. Kéo thanh trượt hoặc bấm “Chạy” để xem 1 vòng quay = 1 lần <b>hút</b> + 1 lần <b>nén</b>.</p>
  <div class="stage"><div id="pstSvg"></div>
    <div class="controls"><button class="btn sm" id="pstPlay">▶ Chạy</button><label>Góc quay <input id="pstAng" type="range" min="0" max="359" value="20" aria-label="Góc quay trục"></label></div>
    <div class="verdict" id="pstV" style="margin:0 14px 12px"></div></div>
  <div class="grid2"><div class="panel" style="margin:0;border-left-color:var(--cold)"><h4>① Chu trình HÚT</h4><p style="margin:6px 0 0">Pit-tông đi từ nắp xi-lanh ra xa → thể tích tăng → áp suất giảm → <b>van hút mở</b>, hơi gas từ khoang vỏ vào xi-lanh. Van đẩy đóng.</p></div>
    <div class="panel hotc" style="margin:0"><h4>② Chu trình NÉN</h4><p style="margin:6px 0 0">Pit-tông đi ngược lại → thể tích giảm → áp suất tăng → <b>van hút đóng</b>, khi đủ áp <b>van đẩy mở</b>, gas áp cao ra ống đẩy tới dàn nóng.</p></div></div>
</section>

<section class="sec" id="s-term" data-toc="4 · Xác định chân C-R-S">
  <div class="sec-n">Phần 4</div><h2>Xác định 3 chân đấu điện C – R – S</h2>
  <p>Hai cuộn dây có 4 đầu, nhưng nhà sản xuất <b>nối chung một đầu của hai cuộn</b> rồi đưa ra ngoài, nên block chỉ có <b>3 chân</b>:</p>
  <dl class="kv"><dt>C (Common)</dt><dd>Chân <b>chung</b> của cuộn chạy và cuộn đề.</dd><dt>R (Run)</dt><dd>Đầu còn lại của <b>cuộn chạy</b>.</dd><dt>S (Start)</dt><dd>Đầu còn lại của <b>cuộn đề</b>.</dd></dl>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Xác định sai thì sao?</b><p>Rô-to quay sai chiều làm <b>không hút dầu</b>; cuộn đề (dây nhỏ) làm việc liên tục nên <b>nóng và cháy</b>. Phải xác định đúng!</p></div></div>
  <h3 style="margin-top:22px">Cách đo (thang x1 Ω, nhớ chập hai que chỉnh kim về 0)</h3>
  ${U.steps([['Đo cả 3 cặp chân', 'Chân 1–2, 2–3, 1–3 → có 3 giá trị.'], ['Lần đo LỚN NHẤT = R + S', 'Hai cuộn nối tiếp. <b>Chân còn lại (không tham gia lần đo này) là chân chung C.</b>'], ['Từ C đo sang 2 chân còn lại', 'Giá trị <b>nhỏ</b> là chân <b>chạy R</b> (dây to); giá trị <b>lớn</b> là chân <b>đề S</b> (dây nhỏ).']])}
  <h3 style="margin-top:26px">🔬 Thực hành</h3><div id="lab"></div>
  <div class="grid2" style="margin-top:20px"><div class="panel warm" style="margin:0"><h4>Lưu ý 1: điện áp sử dụng</h4><p style="margin:6px 0 0">Với block công suất nhỏ (≤ ~200 W): điện trở cuộn chạy <b>≥ 10 Ω</b> → dùng <b>220 V</b>; <b>&lt; 10 Ω</b> → dùng <b>110 V</b>; nhỏ hơn <b>5 Ω</b> → bị <b>chập vòng</b>. Chỉ áp dụng cho công suất nhỏ (block lớn như điều hòa có điện trở rất bé vẫn dùng 220 V).</p></div>
    <div class="panel warm" style="margin:0"><h4>Lưu ý 2: nhóm hiếm</h4><p style="margin:6px 0 0">Khoảng <b>80–85%</b> block có R &lt; S, nhưng <b>15–20%</b> thì ngược lại. Vì vậy sau khi đấu điện phải <b>kẹp dòng</b>: nếu dòng <b>cao hơn định mức</b> có thể đã đấu nhầm → <b>đổi chỗ chân chạy và đề</b> rồi thử lại.</p></div></div>
  <div class="callout"><span class="ic">🔌</span><div><b class="t">Khi không ghi dòng định mức</b><p>Tủ lạnh công suất ≤ 200 W: block <b>220 V</b> có dòng khoảng <b>0,38 – 1,5 A</b>; block <b>110 V</b> khoảng <b>1,5 – 3,5 A</b>. Dòng định mức là dòng làm việc tối đa khi có tải.</p></div></div>
</section>

<section class="sec" id="s-circuit" data-toc="5 · Sơ đồ đấu điện">
  <div class="sec-n">Phần 5</div><h2>Sơ đồ đấu điện cho block</h2>
  <p><b>Quy tắc chung:</b> một dây nguồn luôn vào chân <b>C</b>; một dây nguồn vào chân <b>R</b> (qua <b>rơle bảo vệ</b>); chân <b>S</b> lấy điện từ R thông qua <b>rơle khởi động / tụ</b>. Chọn sơ đồ rồi bấm “Cấp điện”.</p>
  <div id="schTabs"></div><article class="panel" id="schPanel" aria-live="polite"></article>
  <div class="stage"><div id="schSvg"></div>
    <div class="controls"><button class="btn pri sm" id="schGo">⚡ Cấp điện</button><button class="btn sm" id="schOff">⏹ Ngắt</button>
      <label>Rơle K <select id="schStuck" class="btn sm" style="min-height:36px"><option value="ok">bình thường</option><option value="open">kẹt hở (không đóng)</option><option value="closed">kẹt đóng (không ngắt)</option></select></label></div>
    <div style="padding:0 16px 6px"><div class="muted" style="font-size:14px">Tốc độ rô-to</div><div class="bar" style="height:14px;margin:6px 0"><i id="schSpd" style="width:0;background:var(--ok)"></i></div><div class="muted" id="schInfo" style="font-size:14px"></div></div>
    <div class="verdict" id="schV" style="margin:6px 14px 12px">Bấm “Cấp điện” để xem quá trình khởi động.</div></div>
  <div class="grid2" style="margin-top:18px"><div class="panel" style="margin:0"><h4>Rơle bảo vệ</h4><p style="margin:6px 0 0">Luôn đi kèm block, nối tiếp với mạch. Quá dòng / quá nhiệt thì <b>ngắt điện</b>. Kiểm tra bằng đồng hồ vạn năng thang <b>x1 Ω</b>: hai chân vào – ra phải <b>thông mạch</b> (điện trở rất nhỏ).</p></div>
    <div class="panel" style="margin:0"><h4>Chọn tụ</h4><p style="margin:6px 0 0">Điện dung tụ phải <b>tương xứng công suất</b> block (theo bài giảng khoảng <b>25 – 31 W cho mỗi 1 µF</b>, sai số ± 5%). Tụ quá lớn → nạp xả chậm, <b>nhanh hỏng</b>; tụ quá nhỏ → mô-men khởi động yếu, không đạt tốc độ.</p></div></div>
  <h3 style="margin-top:24px">Kiểm tra sau khi đấu điện</h3>
  ${U.steps([['Đo thông mạch rơle bảo vệ', 'Thang x1 Ω.'], ['Đo hai chân ra của block (khi chưa cắm điện)', 'Nếu kim không lên (∞) → dây đang đứt hoặc cắm lỏng. Đo luôn cách điện chân – vỏ (≥ 10 MΩ).'], ['Cấp điện, kẹp dòng', 'Dòng lúc chạy phải ≤ dòng định mức (VD 0,6 A). Cao hơn → kẹt cơ, hoặc đấu sai R/S.'], ['Kiểm tra rò điện ra vỏ khi chạy', 'Đảm bảo an toàn khi chạm vào block.']])}
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Tủ lạnh dùng máy nén kín (block): pit-tông hoặc rô-to.</b><span>Bài này học block pit-tông: hút gián tiếp, đẩy trực tiếp.</span></div></li>
    <li class="done"><div><b>Block: vỏ + phần cơ + phần điện.</b><span>3 ống (đẩy, hút, công nghệ), 3 chân điện, 4 chân cao su, 3–4 lò xo chống rung bên trong.</span></div></li>
    <li class="done"><div><b>Một vòng quay: hút (van hút mở) rồi nén (van đẩy mở).</b><span>Trục lệch tâm đổi chuyển động quay → tịnh tiến.</span></div></li>
    <li class="done"><div><b>C – R – S: đo 3 cặp, lần lớn nhất loại ra C.</b><span>Từ C: nhỏ = R (cuộn chạy), lớn = S (cuộn đề).</span></div></li>
    <li class="done"><div><b>Rơle K đóng lúc khởi động, ngắt ở 70–75% tốc độ.</b><span>Giữ cuộn đề (dây nhỏ) khỏi cháy.</span></div></li>
    <li class="done"><div><b>4 sơ đồ: K / K + tụ kích / tụ chạy / K + tụ kích + tụ chạy.</b><span>Luôn có rơle bảo vệ; kiểm tra bằng kẹp dòng.</span></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/5/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#cmpTabs', root), Object.entries(TYPES).map(([id, t], i) => ({ id, n: i + 1, name: t[0] })), id => { $('#cmpPanel', root).innerHTML = `<h3>${TYPES[id][0]}</h3><p style="margin:0">${TYPES[id][1]}</p>`; }, 'hermetic');
    U.tabset($('#bkTabs', root), Object.entries(BK).map(([id, t], i) => ({ id, n: i + 1, name: t[0] })), id => { const b = BK[id]; $('#bkPanel', root).innerHTML = `<h3>${b[0]}</h3><ul style="margin:6px 0">${b[1].map(x => `<li>${x}</li>`).join('')}</ul><p class="muted" style="margin:0">${b[2]}</p>`; });
    // cấu tạo
    let view = 'ext', sel = 'disch';
    const draw = () => {
      const D = view === 'ext' ? EXT : INT; if (!D[sel]) sel = Object.keys(D)[0];
      $('#blkSvg', root).innerHTML = blockSVG(view, sel);
      $('#blkPanel', root).innerHTML = `<h3>${D[sel][0]}</h3><p style="margin:0">${D[sel][1]}</p>` + (view === 'ext' ? '<p class="muted" style="font-size:14px;margin:10px 0 0">Bấm vào ống, chân điện, chân cao su, vỏ trên hình.</p>' : '<p class="muted" style="font-size:14px;margin:10px 0 0">Bấm vào pit-tông, van, trục, stato, rô-to, lò xo, dầu.</p>');
      $$('#blkSvg [data-k]', root).forEach(g => { const f = () => { sel = g.dataset.k; draw(); }; g.onclick = f; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } }; });
    };
    U.tabset($('#vwTabs', root), [{ id: 'ext', name: 'Nhìn bên ngoài' }, { id: 'int', name: 'Mặt cắt bên trong' }], id => { view = id; sel = id === 'ext' ? 'disch' : 'cyl'; draw(); });
    // pit-tông
    const ang = $('#pstAng', root), pb = $('#pstPlay', root); let tm = null;
    const dp = () => { const th = +ang.value; $('#pstSvg', root).innerHTML = pistonSVG(th); $('#pstV', root).innerHTML = th > 0 && th < 180 ? '<b class="cold-t">HÚT:</b> pit-tông lùi xa nắp, thể tích tăng, áp suất giảm → van hút mở, gas vào xi-lanh.' : th < 300 ? '<b class="hot-t">NÉN:</b> pit-tông tiến về nắp, thể tích giảm → gas bị ép, áp suất và nhiệt độ tăng (hai van đều đóng).' : '<b class="hot-t">ĐẨY:</b> áp suất đủ lớn → van đẩy mở, gas áp cao thoát ra ống đẩy.'; };
    ang.oninput = dp; dp();
    pb.onclick = () => { if (tm) { clearInterval(tm); tm = null; pb.textContent = '▶ Chạy'; return; } pb.textContent = '⏸ Dừng'; tm = setInterval(() => { if (!document.body.contains(ang)) { clearInterval(tm); return; } ang.value = (+ang.value + 5) % 360; dp(); }, 40); };
    // phòng đo
    U.motorLab($('#lab', root), 'identify');
    U.bindSteps(root);
    // sơ đồ
    let sc = 1, st = { on: false, kClosed: true }, sp = 0, tm2 = null;
    const stuck = () => $('#schStuck', root).value;
    const rd = () => { $('#schSvg', root).innerHTML = circuit(sc, st); };
    const setV = (c, h) => { const v = $('#schV', root); v.className = 'verdict ' + (c || ''); v.innerHTML = h; };
    function reset() { clearInterval(tm2); tm2 = null; st = { on: false, kClosed: stuck() !== 'open' ? true : false }; sp = 0; $('#schSpd', root).style.width = '0'; $('#schInfo', root).textContent = ''; setV('', 'Bấm “Cấp điện” để xem quá trình khởi động.'); rd(); }
    U.tabset($('#schTabs', root), Object.entries(SCH).map(([id, s]) => ({ id, n: id, name: s.name, sub: s.sub })), id => { sc = +id; $('#schPanel', root).innerHTML = `<p style="margin:0">${SCH[sc].desc}</p>`; reset(); });
    $('#schStuck', root).onchange = reset;
    $('#schOff', root).onclick = reset;
    $('#schGo', root).onclick = () => {
      reset(); const S = SCH[sc], k = stuck(); st.on = true; st.kClosed = k !== 'open'; rd();
      const noStart = (k === 'open' && !S.Cr) || !S.K && !S.Cr; let t = 0;
      tm2 = setInterval(() => {
        if (!document.body.contains($('#schSvg', root))) { clearInterval(tm2); return; }
        t += .1;
        const startAble = !(k === 'open' && !S.Cr);
        if (startAble) sp = Math.min(100, sp + (k === 'open' ? 1.2 : 3)); else sp = Math.min(6, sp + .3);
        $('#schSpd', root).style.width = sp + '%'; $('#schSpd', root).style.background = sp > 70 ? 'var(--ok)' : 'var(--warm)';
        if (S.K && k === 'ok' && st.kClosed && sp >= 72) { st.kClosed = false; rd(); }
        $('#schInfo', root).textContent = `Tốc độ ${Math.round(sp)}% · rơle K: ${S.K ? (st.kClosed ? 'ĐÓNG' : 'NGẮT') : 'không có'}`;
        if (!startAble) { setV('bad', '✗ <b>K kẹt hở</b>: chỉ cuộn chạy có dòng → không có từ trường quay → block <b>ù, không khởi động</b>, dòng rất cao, rơle bảo vệ sẽ nhảy.'); if (t > 3) clearInterval(tm2); }
        else if (sp >= 100) {
          clearInterval(tm2);
          if (k === 'closed' && S.K) setV('bad', '✗ <b>K kẹt đóng (không ngắt)</b>: cuộn đề (dây nhỏ) vẫn có dòng lúc chạy → <b>nóng và cháy</b> cuộn đề' + (S.Cs ? ', tụ kích cũng nóng, phồng, hỏng' : '') + '.');
          else if (k === 'open') setV('', '⚠️ Khởi động được nhờ <b>tụ chạy</b> nhưng mô-men yếu, chậm → block khởi động <b>khó</b>, dòng cao lâu.');
          else setV('ok', S.K ? '✓ Tốc độ đạt 72% → rơle K <b>ngắt</b> → cuộn đề được bảo vệ' + (S.Cr ? ', tụ làm việc vẫn hỗ trợ.' : '.') + ' Block chạy ổn định.' : '✓ Tụ làm việc luôn nối: cuộn đề hỗ trợ cả lúc khởi động và lúc chạy.');
        }
      }, 100);
    };
  }

  const flashcards = [
    { f: 'Có mấy loại máy nén hơi? Tủ lạnh dùng loại nào?', b: '3 loại: <b>hở, nửa kín, kín</b>. Tủ lạnh dùng <b>máy nén kín</b> (block).', tag: 'Phân loại' },
    { f: 'Hai loại block trong tủ lạnh?', b: 'Block <b>pit-tông</b> và block <b>rô-to</b>.', tag: 'Phân loại' },
    { f: 'Block pit-tông: hút/đẩy thế nào?', b: 'Hút <b>gián tiếp</b>, đẩy <b>trực tiếp</b>.', tag: 'Phân loại' },
    { f: 'Chống rung của block pit-tông ở đâu?', b: '<b>Bên trong</b> vỏ: 3–4 lò xo treo bộ cơ + điện.', tag: 'Phân loại' },
    { f: 'Ưu – nhược điểm block rô-to so với pit-tông?', b: 'Nhỏ gọn, êm; nhưng không phải loại chính bài này.', tag: 'Phân loại' },
    { f: 'Block được ví như gì? Vì sao?', b: '<b>Trái tim</b> của tủ lạnh: hút – nén gas để tuần hoàn.', tag: 'Vai trò' },
    { f: 'Đi kèm block luôn có những gì?', b: 'Rơle khởi động, rơle bảo vệ, đôi khi tụ.', tag: 'Vai trò' },
    { f: 'Block gồm mấy phần?', b: '3 phần: <b>vỏ</b>, phần <b>cơ</b>, phần <b>điện</b>.', tag: 'Cấu tạo' },
    { f: 'Ống đẩy nối với đâu?', b: 'Nối <b>dàn nóng</b>.', tag: 'Cấu tạo' },
    { f: 'Ống hút nối với đâu?', b: 'Nối <b>dàn lạnh</b> (qua ống hồi về).', tag: 'Cấu tạo' },
    { f: 'Ống công nghệ để làm gì?', b: 'Gia công sửa chữa: <b>hút chân không, nạp gas, thay dầu</b>. Có thể đổi chỗ với ống hút.', tag: 'Cấu tạo' },
    { f: 'Vỏ block làm bằng gì và có nhiệm vụ gì?', b: '<b>Sắt thép</b>, hàn kín, bảo vệ phần cơ và điện, chứa dầu.', tag: 'Cấu tạo' },
    { f: '4 chân cao su là gì?', b: 'Hệ thống chống rung <b>bên ngoài</b>.', tag: 'Cấu tạo' },
    { f: 'Chức năng 2 ống làm mát dầu (loại 5 ống)?', b: 'Giải nhiệt dầu khi làm việc nơi nóng.', tag: 'Cấu tạo' },
    { f: 'Các chi tiết phần cơ?', b: 'Pit-tông, xi-lanh, thanh truyền, trục lệch tâm, van hút, van đẩy, tiêu âm, ống đẩy...', tag: 'Phần cơ' },
    { f: 'Trục lệch tâm có nhiệm vụ gì?', b: 'Đổi chuyển động <b>quay</b> thành <b>tịnh tiến</b> của pit-tông.', tag: 'Phần cơ' },
    { f: 'Rãnh xoắn ở tâm rô-to dùng để làm gì?', b: 'Làm <b>bơm dầu</b>: hút dầu từ đáy lên bôi trơn khi quay đúng chiều.', tag: 'Phần cơ' },
    { f: 'Phần điện của block là loại động cơ nào?', b: 'Động cơ <b>không đồng bộ 1 pha</b> (stato + rô-to).', tag: 'Phần điện' },
    { f: 'Stato gồm gì?', b: 'Khung sắt từ (<b>tôn silic 0,35 mm</b>, ≥ 24 rãnh) + 2 cuộn dây.', tag: 'Phần điện' },
    { f: 'Hai cuộn dây đặt lệch nhau bao nhiêu độ? Để làm gì?', b: '<b>90°</b> — sinh từ trường quay làm rô-to quay.', tag: 'Phần điện' },
    { f: 'Cuộn chạy khác cuộn đề thế nào?', b: 'Chạy: dây <b>to</b>, R nhỏ, làm việc lâu. Đề: dây <b>nhỏ</b>, R lớn, chỉ lúc khởi động.', tag: 'Phần điện' },
    { f: 'Chu trình HÚT: van nào mở?', b: 'Pit-tông lùi xa nắp, thể tích tăng, áp giảm → <b>van hút mở</b>.', tag: 'Nguyên lý' },
    { f: 'Chu trình NÉN: van nào mở?', b: 'Pit-tông tiến, áp tăng → <b>van đẩy mở</b>, gas áp cao ra ống đẩy.', tag: 'Nguyên lý' },
    { f: 'C, R, S viết tắt của gì?', b: 'C = Common (chung); R = Run (chạy); S = Start (đề).', tag: 'Chân điện' },
    { f: 'Cách tìm chân chung C?', b: 'Đo 3 cặp: lần <b>lớn nhất</b> (R+S) loại ra chân còn lại = <b>C</b>.', tag: 'Chân điện' },
    { f: 'Từ C đo hai chân còn lại: nhỏ / lớn là chân nào?', b: 'Nhỏ = <b>R (chạy)</b>; lớn = <b>S (đề)</b>.', tag: 'Chân điện' },
    { f: 'Điện trở cuộn chạy ≥ 10 Ω nói lên điều gì?', b: 'Block công suất nhỏ dùng <b>220 V</b> (&lt; 10 Ω: 110 V; &lt; 5 Ω: chập vòng).', tag: 'Chân điện' },
    { f: 'Khoảng bao nhiêu % block có R lớn hơn S?', b: 'Khoảng <b>15–20%</b> (số đông 80–85% là R nhỏ hơn S).', tag: 'Chân điện' },
    { f: 'Dòng cao hơn định mức sau khi đấu: làm gì?', b: 'Có thể đấu nhầm → <b>đổi chân chạy và đề</b> rồi kẹp dòng lại.', tag: 'Chân điện' },
    { f: 'Quy tắc chung của sơ đồ đấu điện?', b: 'Nguồn vào <b>C</b> và <b>R</b> (qua rơle bảo vệ); <b>S</b> lấy từ R qua rơle khởi động/tụ.', tag: 'Sơ đồ' },
    { f: 'Rơle khởi động K đóng/ngắt lúc nào?', b: 'Đóng khi khởi động; <b>ngắt ở 70–75%</b> tốc độ.', tag: 'Sơ đồ' },
    { f: 'Tại sao phải ngắt cuộn đề?', b: 'Dây nhỏ, ít vòng, chỉ chịu được thời gian ngắn → nếu không ngắt sẽ <b>cháy</b>.', tag: 'Sơ đồ' },
    { f: 'Tụ kích dùng khi nào?', b: 'Block <b>nặng, khó khởi động</b>; tụ cộng áp với lưới tăng mô-men.', tag: 'Sơ đồ' },
    { f: 'Tụ làm việc (tụ ngậm) có đặc điểm gì?', b: 'Nối thường trực giữa chạy và đề, vừa khởi động vừa chạy; hay gặp ở máy bơm, quạt.', tag: 'Sơ đồ' },
    { f: 'Chọn điện dung tụ thế nào?', b: 'Tương xứng công suất (≈ 25–31 W/µF ±5%). To quá → nhanh hỏng; nhỏ quá → yếu.', tag: 'Sơ đồ' },
    { f: 'Kiểm tra rơle bảo vệ bằng cách nào?', b: 'Đồng hồ vạn năng <b>x1 Ω</b>: hai chân phải <b>thông mạch</b> (R nhỏ).', tag: 'Sơ đồ' },
    { f: 'Dòng định mức block 220 V ≤ 200 W (khi không ghi)?', b: 'Khoảng <b>0,38 – 1,5 A</b> (110 V: 1,5 – 3,5 A).', tag: 'Sơ đồ' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Tủ lạnh dân dụng dùng loại máy nén nào?', ['Máy nén hở', 'Máy nén nửa kín', 'Máy nén kín (block)', 'Máy nén ly tâm'], 2, 'Block: động cơ và máy nén trong vỏ thép hàn kín.'),
    Q('Block pit-tông có kiểu hút và đẩy?', ['Hút trực tiếp, đẩy gián tiếp', 'Hút gián tiếp, đẩy trực tiếp', 'Cả hai trực tiếp', 'Cả hai gián tiếp'], 1, 'Hút gián tiếp (qua khoang vỏ), đẩy trực tiếp ra ống.'),
    Q('Ống nối với dàn nóng của block là?', ['Ống hút', 'Ống đẩy', 'Ống công nghệ', 'Ống làm mát'], 1, 'Gas áp cao đi ra từ ống đẩy.'),
    Q('Ống công nghệ dùng để làm gì?', ['Nối dàn lạnh', 'Hút chân không, nạp gas', 'Xả nước', 'Làm mát dầu'], 1, 'Dùng khi gia công sửa chữa.'),
    Q('Ống hút và ống công nghệ có thể?', ['Đổi chỗ cho nhau', 'Không đổi', 'Hàn lại thành một', 'Chỉ đổi khi đã thay dầu'], 0, 'Cả hai đều thông với khoang dầu.'),
    Q('Hệ thống chống rung bên trong block pit-tông là?', ['Chân cao su', 'Lò xo treo', 'Dầu', 'Tụ'], 1, '3–4 lò xo chống rung.'),
    Q('Rãnh xoắn ở tâm rô-to dùng để?', ['Làm mát cuộn dây', 'Bơm dầu lên bôi trơn', 'Nén gas', 'Giảm ồn'], 1, 'Quay đúng chiều sẽ hút dầu.'),
    Q('Trục lệch tâm có nhiệm vụ?', ['Đổi quay thành tịnh tiến', 'Hút gas', 'Giảm điện áp', 'Tăng tốc'], 0, 'Truyền chuyển động tới pit-tông qua thanh truyền.'),
    Q('Lõi stato làm từ gì?', ['Tôn silic dày 0,35 mm ghép khối', 'Đồng nguyên khối', 'Nhôm đúc', 'Nhựa'], 0, 'Giảm tổn hao từ.'),
    Q('Hai cuộn dây đặt lệch nhau bao nhiêu độ?', ['30°', '45°', '90°', '180°'], 2, 'Tạo từ trường quay.'),
    Q('Cuộn chạy có đặc điểm?', ['Dây to, điện trở nhỏ, làm việc liên tục', 'Dây nhỏ, điện trở lớn, làm việc ngắn', 'Chỉ có lúc khởi động', 'Không có dòng'], 0, 'Chịu dòng lớn, thời gian dài.'),
    Q('Cuộn đề có đặc điểm?', ['Dây to, làm việc lâu', 'Dây nhỏ, điện trở lớn, chỉ khởi động ngắn', 'Không có điện trở', 'Chỉ chạy khi tụ hỏng'], 1, 'Nên phải ngắt sau khởi động.'),
    Q('Trong chu trình hút, pit-tông chuyển động thế nào?', ['Tiến sát nắp', 'Lùi xa nắp, thể tích tăng, áp giảm', 'Đứng yên', 'Quay tròn'], 1, 'Áp giảm → van hút mở.'),
    Q('Van đẩy mở khi nào?', ['Khi hút', 'Khi áp suất trong xi-lanh đủ cao trong chu trình nén', 'Khi tắt máy', 'Luôn mở'], 1, 'Gas áp cao ép van đẩy mở.'),
    Q('Một vòng quay của trục gồm?', ['1 hút + 1 nén', '2 hút', '2 nén', 'Chỉ hút'], 0, 'Mỗi vòng pit-tông đi và về một lần.'),
    Q('Ba lần đo được 10, 20, 30 Ω. Chân chung C ở đâu?', ['Chân không tham gia lần đo 30 Ω', 'Chân nằm trong cả 3 lần', 'Chân của lần đo 10 Ω', 'Không xác định'], 0, 'Lần lớn nhất = R+S loại ra C.'),
    Q('Từ chân chung C đo ra hai chân: 10 Ω và 20 Ω. Chân nào là chân chạy?', ['Chân 10 Ω', 'Chân 20 Ω', 'Cả hai', 'Không biết'], 0, 'Cuộn chạy dây to, điện trở nhỏ hơn.'),
    Q('Block công suất nhỏ: điện trở cuộn chạy bao nhiêu thì dùng điện 220 V?', ['≥ 10 Ω', '< 10 Ω', '< 5 Ω', '= 0 Ω'], 0, '< 10 Ω: 110 V; < 5 Ω: chập vòng.'),
    Q('Tỉ lệ block có R > S khoảng?', ['15–20%', '80–85%', '50%', 'Không có'], 0, 'Số đông (80–85%) R < S.'),
    Q('Đấu xong, kẹp dòng thấy cao hơn định mức. Cách thử?', ['Đổi chỗ chân chạy và đề', 'Thay phin', 'Tăng nguồn', 'Bỏ rơle'], 0, 'Có thể đã đấu nhầm.'),
    Q('Quy tắc đấu điện: hai dây nguồn nối vào?', ['C và R', 'R và S', 'C và S', 'Cả 3 chân'], 0, 'S lấy từ R qua K / tụ.'),
    Q('Rơle khởi động K ngắt khi rô-to đạt?', ['10%', '30%', '70–75% tốc độ', '100%'], 2, 'Để bảo vệ cuộn đề.'),
    Q('K kẹt hở (không đóng) thì block?', ['Ù, không khởi động, dòng cao', 'Chạy rất êm', 'Chạy nhanh hơn', 'Không ảnh hưởng'], 0, 'Chỉ có cuộn chạy → không có từ trường quay.'),
    Q('K kẹt đóng (không ngắt) sẽ?', ['Cháy cuộn đề (và tụ kích)', 'Tốt hơn', 'Tiết kiệm điện', 'Làm lạnh sâu'], 0, 'Cuộn đề chịu dòng liên tục.'),
    Q('Tụ kích dùng cho?', ['Block nặng, khó khởi động', 'Block nhẹ', 'Dàn nóng', 'Quạt'], 0, 'Tăng mô-men khởi động.'),
    Q('Sơ đồ chỉ dùng tụ làm việc, không rơle, hay gặp ở?', ['Máy bơm nước, quạt', 'Tủ lạnh đời cũ', 'Dàn nóng', 'Đèn'], 0, 'Tụ vừa khởi động vừa chạy.'),
    Q('Tụ quá lớn so với công suất block sẽ?', ['Nhanh hỏng, nạp xả chậm', 'Tốt hơn', 'Không ảnh hưởng', 'Khởi động mạnh hơn rất nhiều và bền'], 0, 'Nên chọn tương xứng.'),
    Q('Rơle bảo vệ kiểm tra thế nào?', ['x1 Ω: thông mạch', 'x10k: vô cùng', 'Đo áp suất', 'Cắm điện thử'], 0, 'Phải thông mạch khi tốt.')
  ];
  const sort = {
    title: 'Chi tiết / đặc điểm này thuộc phần nào của block?',
    buckets: [{ id: 'shell', name: '① Vỏ & ống' }, { id: 'mech', name: '② Phần cơ' }, { id: 'elec', name: '③ Phần điện' }],
    items: [
      { t: 'Ống đẩy nối dàn nóng', b: 'shell' }, { t: 'Ống công nghệ để nạp gas', b: 'shell' }, { t: '4 chân cao su chống rung ngoài', b: 'shell' }, { t: '3 chân đấu điện C, R, S', b: 'shell' },
      { t: 'Pit-tông và xi-lanh', b: 'mech' }, { t: 'Lá van hút, van đẩy', b: 'mech' }, { t: 'Trục lệch tâm, thanh truyền', b: 'mech' }, { t: 'Lò xo chống rung bên trong', b: 'mech' },
      { t: 'Stato bằng tôn silic 0,35 mm', b: 'elec' }, { t: 'Cuộn chạy dây to', b: 'elec' }, { t: 'Cuộn đề dây nhỏ', b: 'elec' }, { t: 'Rô-to bọc hợp kim nhôm', b: 'elec' }
    ]
  };
  const order = [
    { title: 'Xác định chân C-R-S', intro: 'Sắp xếp các bước xác định chân đấu điện.', steps: ['Chỉnh đồng hồ vạn năng thang x1 Ω, chập hai que chỉnh kim về 0', 'Đo cả 3 cặp chân, ghi 3 giá trị', 'Tìm lần đo lớn nhất (R + S)', 'Chân còn lại là chân chung C', 'Từ C đo sang 2 chân kia', 'Giá trị nhỏ là R (chạy), giá trị lớn là S (đề)'] },
    { title: 'Một vòng làm việc của block', intro: 'Sắp xếp chu trình hút – nén.', steps: ['Rô-to quay, trục lệch tâm quay theo', 'Thanh truyền đẩy kéo pit-tông', 'Pit-tông lùi, thể tích tăng, áp suất giảm', 'Van hút mở, hơi gas vào xi-lanh', 'Pit-tông tiến, ép gas, áp suất tăng', 'Van đẩy mở, gas áp cao ra ống đẩy tới dàn nóng'] },
    { title: 'Khởi động block (sơ đồ rơle)', intro: 'Sắp xếp quá trình khởi động.', steps: ['Cấp điện: dòng vào cuộn chạy qua rơle bảo vệ', 'Rơle K đóng, dòng đi vào cuộn đề', 'Hai cuộn lệch 90° sinh từ trường quay', 'Rô-to quay, tăng tốc', 'Tốc độ đạt 70–75%, rơle K ngắt', 'Block chạy ổn định bằng cuộn chạy'] }
  ];
  DL.register({
    id: 5, ready: true, title: 'Block tủ lạnh: cấu tạo, nguyên lý, sơ đồ mạch', sub: 'Phân loại, hút – nén, chân C-R-S, mạch khởi động', minutes: 35,
    lead: 'Block là trái tim tủ lạnh. Bài này giải thích block gồm những gì, pit-tông hút và nén ra sao, cách tìm ba chân C – R – S và 4 sơ đồ đấu điện khởi động — nền tảng để học kiểm tra (Bài 2).',
    learn, mount, flashcards, quiz, sort, order
  });
})();
