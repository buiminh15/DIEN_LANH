/* BÀI 14 — PHÂN TÍCH SƠ ĐỒ MẠCH ĐIỆN TỦ LẠNH TRỰC TIẾP (biên soạn từ docs/Bai_14.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const lamp = (x, lab, on, col) => `<g><circle cx="${x}" cy="48" r="17" fill="${on ? col : 'var(--line)'}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="${x}" y="88" text-anchor="middle">${lab}</text></g>`;
  const link = (x1, x2, on) => `<path d="M${x1} 48H${x2}" stroke="${on ? 'var(--warm)' : 'var(--muted)'}" stroke-width="4" opacity="${on ? 1 : .35}"/>${on ? `<path class="flow" d="M${x1} 48H${x2}" stroke="#fff" stroke-width="2"/>` : ''}`;

  function chainOne(door, hot) {
    const light = door, run = hot;
    return `<svg viewBox="0 0 620 245" role="img" aria-label="Mạch tủ 1 cánh: đèn ${light ? 'sáng' : 'tắt'}, block ${run ? 'chạy' : 'dừng'}">
      <text class="lbl" x="10" y="20">① Mạch chiếu sáng</text>
      ${link(40, 120, light)}${lamp(140, 'công tắc cửa', light, 'var(--ok)')}${link(158, 262, light)}${lamp(280, 'bóng đèn', light, 'var(--warm)')}${link(298, 400, light)}<text class="fl" x="420" y="52">→ nguồn cấp trước (N)</text>
      <g transform="translate(0 130)"><text class="lbl" x="10" y="0">② Mạch chạy lạnh</text>
      <g transform="translate(0 4)">${link(40, 100, run)}${lamp(118, 'thermostat', run, 'var(--cold)')}${link(135, 215, run)}${lamp(232, 'rơle bảo vệ', run, 'var(--ok)')}${link(249, 330, run)}${lamp(348, 'rơle KĐ', run, 'var(--ok)')}${link(365, 440, run)}${lamp(458, 'BLOCK', run, 'var(--hot)')}${link(475, 590, run)}</g></g></svg>`;
  }

  function chainTwo(hl, lc, rh, rb) {
    let mode, vb, vh;
    if (!hl) { mode = 'off'; vb = 0; vh = 0; } else if (lc) { mode = 'cool'; vb = 220; vh = 0; } else { mode = 'heat'; vb = 220 * rb / (rb + rh); vh = 220 - vb; }
    const pb = vb * vb / rb, ph = vh * vh / rh, cur = hl ? 220 / (lc ? rb : rb + rh) : 0;
    const svg = `<svg viewBox="0 0 640 215" role="img" aria-label="Mạch tủ 2 cánh: chế độ ${mode === 'cool' ? 'chạy lạnh' : mode === 'heat' ? 'sấy' : 'tắt'}">
      <rect x="20" y="20" width="150" height="70" rx="12" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><text class="lbl" x="95" y="46" text-anchor="middle">Thermostat 3 chân</text>
      <text class="fl" x="95" y="66" text-anchor="middle" style="fill:${hl ? 'var(--ok)' : 'var(--bad)'}">H–L (tay): ${hl ? 'ĐÓNG' : 'NGẮT'}</text><text class="fl" x="95" y="82" text-anchor="middle" style="fill:${lc ? 'var(--ok)' : 'var(--muted)'}">L–C (nhiệt): ${lc ? 'ĐÓNG' : 'NGẮT'}</text>
      <path d="M170 40H260" stroke="${hl ? 'var(--warm)' : 'var(--muted)'}" stroke-width="4" opacity="${hl ? 1 : .35}"/>
      <rect x="260" y="20" width="130" height="50" rx="10" fill="${mode === 'heat' ? 'var(--hot-tint)' : 'var(--surface2)'}" stroke="var(--hot)" stroke-width="3"/><text class="sub" x="325" y="42" text-anchor="middle" style="fill:var(--ink)">Sấy ngăn mát</text><text class="fl" x="325" y="60" text-anchor="middle">${(rh / 1000).toFixed(0)} kΩ</text>
      <path d="M390 45H470" stroke="${mode !== 'off' ? 'var(--warm)' : 'var(--muted)'}" stroke-width="4" opacity="${mode !== 'off' ? 1 : .35}"/>
      <rect x="470" y="20" width="150" height="50" rx="10" fill="${mode === 'cool' ? 'var(--ok-tint)' : 'var(--surface2)'}" stroke="var(--cold)" stroke-width="3"/><text class="sub" x="545" y="42" text-anchor="middle" style="fill:var(--ink)">Rơle BV + block</text><text class="fl" x="545" y="60" text-anchor="middle">${rb} Ω</text>
      <text class="lbl" x="20" y="130">Điện áp:</text><text class="sub" x="20" y="152">trên sấy ≈ <tspan font-weight="700">${vh.toFixed(1)} V</tspan> · công suất ${ph < .01 ? '0' : ph.toFixed(2)} W</text><text class="sub" x="20" y="174">trên block ≈ <tspan font-weight="700">${vb.toFixed(1)} V</tspan> · công suất ${pb < .01 ? '0' : pb.toFixed(0)} W</text>
      <text class="sub" x="20" y="196">dòng mạch ≈ <tspan font-weight="700">${(cur * 1000).toFixed(0)} mA</tspan></text>
      <text class="lbl" x="330" y="150" style="fill:${mode === 'cool' ? 'var(--ok)' : mode === 'heat' ? 'var(--warm)' : 'var(--muted)'}">${mode === 'cool' ? 'BLOCK CHẠY, sấy bị nối tắt (0 V)' : mode === 'heat' ? 'SẤY có gần đủ 220 V, block gần như 0 V → không chạy' : 'Cả tủ tắt (nút OFF)'}</text></svg>`;
    return { svg, mode, vb, vh };
  }

  function learn() {
    return `
<section class="sec" id="s-read" data-toc="1 · Cách đọc sơ đồ">
  <div class="sec-n">Phần 1</div><h2>Cách phân tích sơ đồ mạch điện</h2>
  <p>Phân tích mạch = <b>đi theo đường dòng điện</b>. Điện xoay chiều có hai dây: <b>L (dây pha, “nguồn điều khiển”)</b> đi qua các thiết bị đóng ngắt, và <b>N (dây trung tính, “nguồn cấp trước”)</b> nối thẳng tới phụ tải. Dòng chỉ chạy khi tải có <b>chênh lệch điện áp giữa hai đầu</b>.</p>
  ${U.steps([['Liệt kê thiết bị và phụ tải', 'Thiết bị: công tắc, thermostat, rơle... Phụ tải: đèn, block, sấy...'], ['Chia mạch theo chức năng', 'Mạch <b>chiếu sáng</b>, mạch <b>chạy lạnh</b> (block), mạch <b>sấy</b> (nếu có).'], ['Đi từ L qua thiết bị đóng ngắt → phụ tải → N', 'Mỗi mạch là một vòng kín.'], ['Xét điều kiện để từng mạch làm việc', 'Công tắc ở trạng thái nào, thermostat đóng hay ngắt.']])}
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Quy tắc hai tải nối tiếp</b><p>Hai phụ tải <b>mắc nối tiếp</b>: tải có <b>công suất nhỏ</b> (điện trở lớn) nhận <b>gần hết điện áp</b> nên là <b>“tải”</b>; tải có <b>công suất lớn</b> (điện trở nhỏ) nhận rất ít điện áp, chỉ như <b>dây dẫn</b>.</p></div></div>
</section>

<section class="sec" id="s-one" data-toc="2 · Tủ 1 cánh">
  <div class="sec-n">Phần 2</div><h2>Mạch tủ lạnh trực tiếp 1 cánh</h2>
  <p>Tủ lạnh trực tiếp 1 cánh <b>xả tuyết bán tự động</b> bằng nhiệt môi trường (có thể gộp nút xả đá vào thermostat). Mạch gồm <b>4 thiết bị</b>: công tắc cửa, rơle xả đá/thermostat, rơle khởi động, rơle bảo vệ và <b>2 phụ tải</b>: bóng đèn, block.</p>
  <dl class="kv"><dt>Mạch chiếu sáng</dt><dd>L → công tắc cửa → đèn → N. Mở cửa công tắc đóng → đèn sáng.</dd><dt>Mạch chạy lạnh</dt><dd>L → thermostat → chân C → rơle bảo vệ → block (cuộn chạy; cuộn đề qua rơle khởi động) → N. Thermostat đóng khi nhiệt độ cao.</dd></dl>
  <div class="stage"><div id="oneSvg"></div><div class="controls"><button class="btn sm" id="oDoor">🚪 Cửa: ĐÓNG</button><button class="btn sm" id="oHot">🌡 Tủ: NÓNG (thermostat đóng)</button></div>
    <div class="verdict" id="oV" style="margin:0 14px 12px"></div></div>
  <p class="muted" style="font-size:14px">Mạch tương tự dùng nhiều trong tủ đông, tủ bảo quản, cây nước nóng lạnh. Tủ đông thường có thêm quạt mắc <b>song song</b> với block ở ngăn mát hoặc dàn nóng.</p>
</section>

<section class="sec" id="s-two" data-toc="3 · Tủ 2 cánh">
  <div class="sec-n">Phần 3</div><h2>Mạch tủ lạnh trực tiếp 2 cánh</h2>
  <p>Có <b>3 phụ tải</b>: đèn, block, <b>sấy ngăn mát</b> (công suất rất nhỏ, điện trở lớn khoảng <b>2 – 20 kΩ</b>, thường 10 – 15 kΩ). Thermostat có <b>3 chân H – L – C</b> với hai cặp tiếp điểm:</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>H – L : đóng mở bằng tay</h4><p style="margin:6px 0 0">Vị trí <b>OFF</b> (xoay hết ngược chiều kim đồng hồ) sẽ <b>ngắt</b> cặp này: tủ tắt hoàn toàn.</p></div><div class="panel warm" style="margin:0"><h4>L – C : đóng mở theo nhiệt độ</h4><p style="margin:6px 0 0"><b>Đóng</b> khi tủ nóng → block chạy. <b>Ngắt</b> khi đủ lạnh → sấy làm việc.</p></div></div>
  <h3 style="margin-top:22px">🔬 Mô phỏng: hai tải nối tiếp</h3>
  <div class="stage"><div id="twoSvg"></div>
    <div class="controls"><button class="btn sm" id="tHL" aria-pressed="true">H–L (tay): ĐÓNG</button><button class="btn sm" id="tLC" aria-pressed="true">L–C (nhiệt): ĐÓNG (tủ nóng)</button>
      <label>R sấy <input id="tRh" type="range" min="2" max="20" value="15" style="width:120px"> <b id="tRhV"></b></label><label>Z block (khi chạy) <input id="tRb" type="range" min="10" max="300" value="240" style="width:110px"> <b id="tRbV"></b></label></div>
    <div class="verdict" id="tV" style="margin:0 14px 12px"></div></div>
  <div class="callout"><span class="ic">🔑</span><div><b class="t">Kết luận quan trọng</b><p>Khi L–C <b>ngắt</b> (tủ đủ lạnh): sấy mắc <b>nối tiếp</b> với block. Block có điện trở rất nhỏ so với sấy → <b>block chỉ như dây dẫn</b>, nhận gần như 0 V → <b>không chạy</b>; sấy nhận gần đủ 220 V nên <b>làm việc</b>. Muốn thử trên bàn: rút chân C để mô phỏng đủ lạnh.</p></div></div>
</section>

<section class="sec" id="s-wire" data-toc="4 · Đấu và kiểm tra mạch">
  <div class="sec-n">Phần 4</div><h2>Thực hành đấu mạch tủ 2 cánh</h2>
  <h3>① Kiểm tra từng thiết bị trước khi đấu</h3>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Thiết bị</th><th>Cách kiểm tra</th></tr></thead><tbody>
    <tr><th>Bóng đèn</th><td>Thang x10 Ω: có điện trở (không ∞)</td></tr>
    <tr><th>Công tắc cửa</th><td>x1 Ω, ấn nút: đổi trạng thái đóng ngắt</td></tr>
    <tr><th>Thermostat 3 chân</th><td>Đo H–L và L–C: nhiệt độ môi trường cao → cả hai cặp thông. Xoay về OFF → H–L ngắt</td></tr>
    <tr><th>Rơle khởi động (bán dẫn)</th><td>Chân vào – chân M thông; qua PTC 10–50 Ω; rơle bảo vệ thông mạch</td></tr>
    <tr><th>Sấy ngăn mát</th><td>Điện trở lớn (kΩ). Nếu không đủ lớn có thể nối tiếp 2 bóng sấy để tăng trở</td></tr>
    <tr><th>Block</th><td>Cuộn chạy, cuộn đề, cách điện chân – vỏ ≥ 10 MΩ</td></tr></tbody></table></div>
  <h3 style="margin-top:22px">② Các bước đấu</h3>
  ${U.steps([['Tìm dây điều khiển (L)', 'Dùng đồng hồ x1 Ω thông mạch xác định từng dây giữa phía sau tủ và ngăn mát. Dây từ phích cắm vào <b>công tắc cửa</b> và vào <b>chân H</b> thermostat.'], ['Nối chân L với sấy', 'Sấy nối với chân L; đầu kia của sấy cùng chân C nối vào <b>rơle bảo vệ</b>.'], ['Nối chân C với rơle bảo vệ → block', 'Rơle bảo vệ gắn vào chân chung C của block; rơle khởi động ở chân chạy / đề.'], ['Nối dây cấp trước (N)', 'N cấp cho đèn và cho block (qua giắc cắm).'], ['Bọc cách điện mối nối', 'Dùng băng keo / đầu chụp để tránh chạm chập.'], ['Kiểm tra bằng đồng hồ trước khi cắm điện', 'Đo hai đầu phích cắm: có R của block ∥ đèn. Rút một giắc block → chỉ còn R đèn (ấn công tắc thấy đổi). Rút chân C (mô phỏng L–C ngắt) → đo thấy R mạch sấy ∥ đèn.'], ['Cấp nguồn, kẹp dòng', 'Chạy lạnh: dòng block ≈ 0,92 A. Khi L–C ngắt: dòng tụt còn rất nhỏ (cỡ 0,03 A, là dòng sấy + đèn).']])}
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Phân tích mạch: đi từ L qua thiết bị → phụ tải → N, chia 3 mạch.</b></div></li>
    <li class="done"><div><b>Tủ 1 cánh: 2 phụ tải (đèn, block), xả tuyết bán tự động.</b></div></li>
    <li class="done"><div><b>Tủ 2 cánh: thêm sấy ngăn mát (2–20 kΩ), thermostat 3 chân H, L, C.</b></div></li>
    <li class="done"><div><b>H–L đóng bằng tay (OFF ngắt); L–C đóng theo nhiệt độ.</b></div></li>
    <li class="done"><div><b>L–C đóng: block chạy, sấy bị nối tắt. L–C ngắt: sấy làm tải, block là “dây dẫn”.</b></div></li>
    <li class="done"><div><b>Hai tải nối tiếp: tải công suất nhỏ nhận điện áp, tải công suất lớn chỉ như dây dẫn.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/14/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    let door = false, hot = true;
    const os = $('#oneSvg', root), ov = $('#oV', root);
    const od = () => { os.innerHTML = chainOne(door, hot); ov.className = 'verdict'; ov.innerHTML = `Cửa <b>${door ? 'MỞ' : 'ĐÓNG'}</b> → công tắc <b>${door ? 'đóng' : 'ngắt'}</b> → đèn <b>${door ? 'SÁNG' : 'tắt'}</b>.<br>Tủ <b>${hot ? 'nóng' : 'đủ lạnh'}</b> → thermostat <b>${hot ? 'đóng' : 'ngắt'}</b> → block <b>${hot ? 'CHẠY' : 'dừng'}</b>.`; };
    od();
    $('#oDoor', root).onclick = e => { door = !door; e.target.textContent = '🚪 Cửa: ' + (door ? 'MỞ' : 'ĐÓNG'); od(); };
    $('#oHot', root).onclick = e => { hot = !hot; e.target.textContent = hot ? '🌡 Tủ: NÓNG (thermostat đóng)' : '❄ Tủ: ĐỦ LẠNH (thermostat ngắt)'; od(); };
    // 2 cánh
    let hl = true, lc = true;
    const rh = $('#tRh', root), rb = $('#tRb', root);
    const td = () => {
      $('#tRhV', root).textContent = rh.value + ' kΩ'; $('#tRbV', root).textContent = rb.value + ' Ω';
      const r = chainTwo(hl, lc, +rh.value * 1000, +rb.value); $('#twoSvg', root).innerHTML = r.svg;
      const v = $('#tV', root); v.className = 'verdict ' + (r.mode === 'cool' ? 'ok' : r.mode === 'heat' ? '' : 'bad');
      v.innerHTML = r.mode === 'cool' ? 'Tủ đang <b>chạy lạnh</b>: block có đủ 220 V, sấy bị nối tắt nên <b>không làm việc</b>.' : r.mode === 'heat' ? `Đủ lạnh (L–C ngắt): sấy nhận <b>${r.vh.toFixed(0)} V</b>, block chỉ <b>${r.vb.toFixed(1)} V</b> → block <b>không chạy</b>, sấy làm tan tuyết/ làm ấm ngăn mát.` : 'Thermostat ở vị trí <b>OFF</b>: cặp H–L ngắt, tủ tắt hoàn toàn.';
    };
    $('#tHL', root).onclick = e => { hl = !hl; e.target.setAttribute('aria-pressed', hl); e.target.textContent = 'H–L (tay): ' + (hl ? 'ĐÓNG' : 'NGẮT (OFF)'); td(); };
    $('#tLC', root).onclick = e => { lc = !lc; e.target.setAttribute('aria-pressed', lc); e.target.textContent = 'L–C (nhiệt): ' + (lc ? 'ĐÓNG (tủ nóng)' : 'NGẮT (đủ lạnh)'); td(); };
    rh.oninput = td; rb.oninput = td; td();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Điện xoay chiều trong sơ đồ có hai dây nào?', b: '<b>L</b> (pha, “nguồn điều khiển”) và <b>N</b> (trung tính, “nguồn cấp trước”).', tag: 'Đọc sơ đồ' },
    { f: 'Điều kiện để tải có dòng điện?', b: 'Hai đầu tải có <b>chênh lệch điện áp</b>.', tag: 'Đọc sơ đồ' },
    { f: 'Chia mạch điện tủ lạnh thành những mạch nào?', b: 'Mạch <b>chiếu sáng</b>, mạch <b>chạy lạnh</b>, mạch <b>sấy</b> (và mạch chuyển chế độ ở tủ gián tiếp).', tag: 'Đọc sơ đồ' },
    { f: 'Thiết bị khác phụ tải thế nào?', b: 'Thiết bị <b>điều khiển</b> nguồn; phụ tải <b>tiêu thụ</b> điện.', tag: 'Đọc sơ đồ' },
    { f: 'Hai tải nối tiếp: tải nào nhận điện áp?', b: 'Tải <b>công suất nhỏ</b> (R lớn); tải công suất lớn như dây dẫn.', tag: 'Đọc sơ đồ' },
    { f: 'Mạch tủ 1 cánh có những phụ tải nào?', b: '<b>Bóng đèn và block</b>.', tag: 'Tủ 1 cánh' },
    { f: 'Tủ 1 cánh xả tuyết kiểu gì?', b: '<b>Bán tự động</b> bằng nhiệt môi trường (rơle xả đá).', tag: 'Tủ 1 cánh' },
    { f: 'Thiết bị trong mạch tủ 1 cánh?', b: 'Công tắc cửa, rơle xả đá/ thermostat, rơle khởi động, rơle bảo vệ.', tag: 'Tủ 1 cánh' },
    { f: 'Mạch chiếu sáng tủ 1 cánh đi thế nào?', b: 'L → công tắc cửa → đèn → N.', tag: 'Tủ 1 cánh' },
    { f: 'Mạch chạy lạnh tủ 1 cánh đi thế nào?', b: 'L → thermostat → rơle bảo vệ → block (rơle KĐ cho cuộn đề) → N.', tag: 'Tủ 1 cánh' },
    { f: 'Tủ 2 cánh có thêm phụ tải nào?', b: '<b>Sấy ngăn mát</b> công suất rất nhỏ.', tag: 'Tủ 2 cánh' },
    { f: 'Điện trở sấy tủ 2 cánh?', b: 'Rất lớn: khoảng <b>2 – 20 kΩ</b>, thường 10–15 kΩ.', tag: 'Tủ 2 cánh' },
    { f: 'Sấy tủ 2 cánh đặt ở đâu và để làm gì?', b: 'Ngăn mát, <b>bổ trợ</b> (không làm tan tuyết ngăn đông).', tag: 'Tủ 2 cánh' },
    { f: 'Thermostat tủ 2 cánh có mấy chân?', b: '<b>3 chân</b>: H, L, C.', tag: 'Tủ 2 cánh' },
    { f: 'Cặp H–L là gì?', b: 'Cặp tiếp điểm <b>đóng mở bằng tay</b> (vị trí OFF).', tag: 'Tủ 2 cánh' },
    { f: 'Cặp L–C là gì?', b: 'Cặp tiếp điểm <b>đóng mở theo nhiệt độ</b>.', tag: 'Tủ 2 cánh' },
    { f: 'L–C đóng thì?', b: 'Sấy bị nối tắt, <b>block chạy</b> đủ điện áp.', tag: 'Tủ 2 cánh' },
    { f: 'L–C ngắt thì?', b: 'Block nối tiếp sấy: <b>sấy làm việc</b>, block gần 0 V không chạy.', tag: 'Tủ 2 cánh' },
    { f: 'Vì sao block làm “dây dẫn” khi L–C ngắt?', b: 'Điện trở block rất nhỏ so với sấy.', tag: 'Tủ 2 cánh' },
    { f: 'Nối sai cặp tiếp điểm tay vào điều khiển block thì?', b: 'Block chạy mãi, thermostat không còn khống chế nhiệt độ.', tag: 'Tủ 2 cánh' },
    { f: 'Tìm dây điều khiển bằng gì?', b: 'Đồng hồ x1 Ω đo thông mạch giữa các đầu dây.', tag: 'Đấu mạch' },
    { f: 'Mô phỏng “đủ lạnh” trên bàn thực hành?', b: 'Rút chân C của thermostat (ngắt cặp L–C).', tag: 'Đấu mạch' },
    { f: 'Dòng khi chạy lạnh và khi sấy ở mô hình?', b: 'Chạy lạnh ≈ <b>0,92 A</b>; sấy chỉ còn cỡ <b>0,03 A</b>.', tag: 'Đấu mạch' },
    { f: 'Trước khi cắm điện cần làm gì?', b: 'Bọc cách điện mối nối, đo hai đầu phích cắm bằng đồng hồ.', tag: 'Đấu mạch' },
    { f: 'Mạch tương tự dùng ở thiết bị nào khác?', b: 'Tủ đông, tủ bảo quản, cây nước nóng lạnh.', tag: 'Ứng dụng' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Dây L trong sơ đồ còn gọi là?', ['Nguồn điều khiển', 'Nguồn cấp trước', 'Dây tiếp đất', 'Dây phụ'], 0, 'Đi qua thiết bị đóng ngắt.'),
    Q('Dây N còn gọi là?', ['Nguồn cấp trước', 'Nguồn điều khiển', 'Dây nóng', 'Dây tải'], 0, 'Nối thẳng tới phụ tải.'),
    Q('Tải có dòng khi?', ['Hai đầu có chênh lệch điện áp', 'Hai đầu bằng nhau', 'Chỉ có N', 'Chỉ có L'], 0, 'Điều kiện làm việc của tải.'),
    Q('Hai tải nối tiếp, tải nào là “tải” thật sự?', ['Công suất nhỏ (R lớn)', 'Công suất lớn', 'Cả hai', 'Không tải nào'], 0, 'Nhận gần hết điện áp.'),
    Q('Tủ 1 cánh có phụ tải?', ['Đèn và block', 'Đèn, block, sấy', 'Chỉ block', 'Đèn và quạt'], 0, 'Theo sơ đồ bài.'),
    Q('Tủ 2 cánh có thêm?', ['Sấy ngăn mát', 'Quạt', 'Tụ', 'Rơle thời gian'], 0, 'Công suất nhỏ.'),
    Q('Điện trở sấy tủ 2 cánh khoảng?', ['2–20 kΩ', '300–500 Ω', '1 Ω', '1 MΩ'], 0, 'Rất lớn.'),
    Q('Thermostat tủ 2 cánh có?', ['3 chân', '1 chân', '2 chân', '5 chân'], 0, 'H, L, C.'),
    Q('H–L là cặp tiếp điểm?', ['Đóng mở bằng tay', 'Đóng mở theo nhiệt độ', 'Luôn hở', 'Luôn thông'], 0, 'OFF cắt cặp này.'),
    Q('L–C đóng khi?', ['Tủ nóng', 'Tủ đủ lạnh', 'Cửa mở', 'Mất điện'], 0, 'Cặp theo nhiệt độ.'),
    Q('L–C đóng, sấy ra sao?', ['Bị nối tắt, không làm việc', 'Làm việc mạnh', 'Cháy', 'Nối tiếp block'], 0, 'Không chênh áp hai đầu sấy.'),
    Q('L–C ngắt, ai làm việc?', ['Sấy', 'Block', 'Đèn', 'Quạt'], 0, 'Block chỉ như dây dẫn.'),
    Q('Vì sao block không chạy khi L–C ngắt?', ['Điện áp trên block gần bằng 0', 'Hết gas', 'Rơle hỏng', 'Tụ yếu'], 0, 'Chia áp với sấy R lớn.'),
    Q('Điện áp trên sấy khi L–C ngắt khoảng?', ['Gần 220 V', '0 V', '12 V', '110 V'], 0, 'Sấy là tải.'),
    Q('Cặp H–L ngắt thì?', ['Tủ tắt hoàn toàn', 'Chỉ sấy chạy', 'Chỉ đèn tắt', 'Block chạy'], 0, 'OFF.'),
    Q('Rút chân C thermostat để mô phỏng?', ['Đủ lạnh', 'Quá nóng', 'Mở cửa', 'Mất điện'], 0, 'Ngắt L–C.'),
    Q('Dòng khi sấy làm việc so với khi block chạy?', ['Rất nhỏ', 'Lớn hơn', 'Bằng nhau', 'Bằng 0'], 0, '≈ 0,03 A so với ≈ 0,92 A.'),
    Q('Tìm dây điều khiển bằng?', ['Thông mạch x1 Ω', 'Đo áp suất', 'Quan sát màu', 'Nghe tiếng'], 0, 'Phương pháp đo.'),
    Q('Trước khi cấp điện cần?', ['Bọc cách điện, đo kiểm tra', 'Cắm luôn', 'Nạp gas', 'Thay dầu'], 0, 'An toàn.'),
    Q('Xả tuyết tủ 1 cánh?', ['Bán tự động', 'Tự động bằng timer', 'Không xả', 'Bằng sấy lớn'], 0, 'Nhiệt môi trường.'),
    Q('Mạch chiếu sáng gồm?', ['Công tắc cửa và đèn', 'Thermostat và block', 'Sấy và block', 'Quạt và đèn'], 0, 'L–công tắc–đèn–N.'),
    Q('Mở cửa tủ thì đèn?', ['Sáng', 'Tắt', 'Nhấp nháy', 'Cháy'], 0, 'Công tắc đèn thường đóng.'),
    Q('Tủ đông bảo quản có quạt ngăn mát mắc thế nào với block?', ['Song song', 'Nối tiếp', 'Không nối', 'Qua tụ'], 0, 'Cùng chạy khi block chạy.'),
    Q('Tải công suất lớn nối tiếp tải nhỏ thì?', ['Như dây dẫn', 'Nhận hết áp', 'Cháy', 'Ngắt'], 0, 'Kết luận bài.')
  ];
  const sort = {
    title: 'Trạng thái này ứng với chế độ nào của tủ 2 cánh?',
    buckets: [{ id: 'cool', name: 'Chạy lạnh (L–C đóng)' }, { id: 'heat', name: 'Sấy (L–C ngắt)' }, { id: 'off', name: 'Tắt (H–L ngắt)' }],
    items: [
      { t: 'Tủ đang nóng', b: 'cool' }, { t: 'Block nhận 220 V', b: 'cool' }, { t: 'Dòng ≈ 0,9 A', b: 'cool' }, { t: 'Sấy bị nối tắt', b: 'cool' },
      { t: 'Tủ đã đủ lạnh', b: 'heat' }, { t: 'Sấy nhận gần 220 V', b: 'heat' }, { t: 'Block như dây dẫn, không chạy', b: 'heat' }, { t: 'Dòng rất nhỏ ≈ 0,03 A', b: 'heat' },
      { t: 'Núm xoay về vị trí OFF', b: 'off' }, { t: 'Block, sấy đều không có điện', b: 'off' }, { t: 'Chỉ đèn còn phụ thuộc công tắc cửa', b: 'off' }, { t: 'Cặp tiếp điểm tay bị ngắt', b: 'off' }
    ]
  };
  const order = [
    { title: 'Phân tích mạch điện', intro: 'Sắp xếp các bước phân tích.', steps: ['Liệt kê thiết bị và phụ tải', 'Chia thành các mạch theo chức năng', 'Xác định dây L và dây N', 'Đi từ L qua thiết bị đóng ngắt tới tải', 'Về N, kiểm tra vòng kín', 'Xét điều kiện làm việc của từng mạch'] },
    { title: 'Đấu mạch tủ 2 cánh', intro: 'Sắp xếp quy trình đấu.', steps: ['Kiểm tra từng thiết bị và phụ tải', 'Tìm dây điều khiển (L) bằng thông mạch', 'Nối L với chân H thermostat và công tắc đèn', 'Nối sấy với L và rơle bảo vệ với chân C', 'Nối dây cấp trước (N) cho đèn và block', 'Bọc băng keo, đo kiểm tra rồi cấp nguồn'] },
    { title: 'Kiểm tra sau khi đấu', intro: 'Sắp xếp các bước đo.', steps: ['Đo hai đầu phích cắm khi chưa cấp điện', 'Thấy R của block song song đèn', 'Rút giắc block, ấn công tắc xem R đèn đổi', 'Rút chân C của thermostat', 'Đo thấy R mạch sấy song song đèn', 'Cấp nguồn, kẹp dòng kiểm tra từng chế độ'] }
  ];
  DL.register({
    id: 14, ready: true, title: 'Phân tích mạch điện tủ trực tiếp', sub: 'Tủ 1 cánh, tủ 2 cánh, hai tải nối tiếp, thực hành đấu mạch', minutes: 30,
    lead: 'Học cách đọc sơ đồ mạch điện: đi từ dây L qua thiết bị tới phụ tải rồi về N. Bài có mô phỏng mạch tủ 1 cánh và mô phỏng hai tải nối tiếp trong tủ 2 cánh (sấy và block).',
    learn, mount, flashcards, quiz, sort, order
  });
})();
