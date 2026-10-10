/* BÀI 15 — PHÂN TÍCH SƠ ĐỒ MẠCH ĐIỆN TỦ LẠNH GIÁN TIẾP (biên soạn từ docs/Bai_14.txt phần cuối và docs/Bai_15.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const TSO = -5, TFUSE = 73;

  const PATHS = {
    t1: {
      name: 'Loại 1 (Hitachi)', sub: 'động cơ rơle chân 1–3',
      light: 'L → công tắc cửa → đèn → N',
      cool: 'L → thermostat → <b>chân 3</b> → (3 nối 4) → <b>chân 4</b> → chia hai nhánh: ① quạt → công tắc quạt → N; ② rơle bảo vệ → block (rơle khởi động) → N',
      heat: 'L → thermostat → chân 3 → (3 nối 2) → <b>chân 2</b> → <b>sò lạnh</b> → điện trở sấy → cầu chì nhiệt → N',
      sw: 'L → thermostat → chân 3 → <b>động cơ rơle (1–3)</b> → chân 1 → sấy → cầu chì → N (động cơ rơle <b>nối tiếp</b> với sấy)',
      note: 'Động cơ rơle luôn quay ở <b>chế độ chạy lạnh</b>; ở chế độ xả, động cơ chỉ quay khi <b>sò lạnh đã ngắt</b> (tuyết tan hết, bề mặt dàn ấm lên). Sò lạnh đóng thì hai đầu động cơ cân bằng điện áp → đồng hồ dừng, sấy làm việc.'
    },
    t2: {
      name: 'Loại 2 (Sharp)', sub: 'động cơ rơle chân 1–4',
      light: 'L → công tắc cửa → đèn → N',
      cool: 'L → thermostat → chân 3 → (3 nối 4) → chân 4 → quạt (qua công tắc) và rơle bảo vệ → block → N',
      heat: 'L → thermostat → chân 3 → (3 nối 2) → chân 2 → cầu chì nhiệt → điện trở sấy → <b>sò lạnh</b> → N',
      sw: 'L → thermostat → chân 3 → chân 4 / chân 1 → <b>sò lạnh</b> → N: động cơ rơle phụ thuộc vào sò lạnh',
      note: 'Ở chế độ <b>chạy lạnh</b>, sò lạnh phải <b>ĐÓNG</b> (dàn đã lạnh) thì động cơ rơle mới quay → rơle bắt đầu đếm giờ khi dàn thực sự lạnh. Ở chế độ <b>xả</b>, sò lạnh phải <b>NGẮT</b> (tuyết tan hết) rơle mới quay để quay về chạy lạnh.'
    }
  };

  function simSVG(s) {
    const lamp = (x, lab, on, col) => `<g><circle cx="${x}" cy="40" r="19" fill="${on ? col : 'var(--line)'}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="${x}" y="82" text-anchor="middle">${lab}</text></g>`;
    return `<svg viewBox="0 0 640 100" role="img" aria-label="Trạng thái các thiết bị trong chu kỳ">
      ${lamp(60, 'đèn', s.door, 'var(--warm)')}${lamp(180, 'block + quạt', s.cool && !s.blockOff, 'var(--cold)')}${lamp(300, 'sấy xả tuyết', s.heater, 'var(--hot)')}${lamp(420, 'sò lạnh', s.soClosed, 'var(--ok)')}${lamp(540, 'động cơ rơle TG', s.runs, 'var(--brass)')}</svg>`;
  }
  function tSVG(pts) {
    const W = 600, H = 120, lo = -30, hi = 90, X = i => 40 + i / 249 * (W - 60), Y = t => 8 + (hi - t) / (hi - lo) * (H - 26);
    return `<svg viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Nhiệt độ bề mặt dàn lạnh theo thời gian"><path d="M40 8V${H - 18}H${W - 10}" stroke="var(--ink)" fill="none" stroke-width="2"/>
      ${[-20, 0, 40, 80].map(t => `<path d="M36 ${Y(t)}H${W - 10}" stroke="var(--line)"/><text class="fl" x="34" y="${Y(t) + 4}" text-anchor="end">${t}°</text>`).join('')}
      <path d="M40 ${Y(TSO)}H${W - 10}" stroke="var(--cold)" stroke-dasharray="6 4"/><path d="M40 ${Y(TFUSE)}H${W - 10}" stroke="var(--hot)" stroke-dasharray="6 4"/>
      <path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p).toFixed(1)}`).join('')}" fill="none" stroke="var(--ink)" stroke-width="2.5"/></svg>`;
  }
  function waveSVG(half) {
    let a = '', b = '';
    for (let x = 0; x <= 280; x += 4) { const y = Math.sin(x / 280 * Math.PI * 4); a += `${x ? 'L' : 'M'}${20 + x} ${60 - y * 36}`; b += `${x ? 'L' : 'M'}${20 + x} ${60 - Math.max(0, y) * 36}`; }
    return `<svg viewBox="0 0 320 120" role="img" aria-label="Dạng sóng điện qua sấy: ${half ? 'một chiều (bán kỳ)' : 'toàn kỳ'}"><path d="M20 60H300" stroke="var(--line)"/><path d="${half ? b : a}" fill="none" stroke="${half ? 'var(--warm)' : 'var(--hot)'}" stroke-width="3"/><text class="sub" x="160" y="108" text-anchor="middle">${half ? 'Có điốt: nửa chu kỳ, công suất ≈ 1/2' : 'Không điốt: cả chu kỳ, công suất đủ'}</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-intro" data-toc="1 · Tổng quan mạch gián tiếp">
  <div class="sec-n">Phần 1</div><h2>Mạch điện tủ lạnh gián tiếp</h2>
  <p>Mạch phức tạp hơn tủ trực tiếp vì có <b>xả tuyết tự động</b>. Thường gồm <b>8 thiết bị</b>: công tắc cửa, thermostat (bộ điều chỉnh nhiệt độ), <b>rơle thời gian</b>, <b>sò lạnh</b> (cảm biến âm), <b>cầu chì nhiệt</b>, tụ điện, rơle khởi động, rơle bảo vệ; và <b>5 phụ tải</b>: đèn, quạt gió, block, điện trở sấy, <b>động cơ rơle thời gian</b>.</p>
  <p>Chia thành <b>4 mạch</b>:</p>
  <div class="tabs"><div class="tab" style="cursor:default"><b>1</b><span><strong>Mạch chiếu sáng</strong><br><small class="muted">đèn</small></span></div><div class="tab" style="cursor:default"><b>2</b><span><strong>Mạch chạy lạnh</strong><br><small class="muted">block + quạt gió</small></span></div><div class="tab" style="cursor:default"><b>3</b><span><strong>Mạch sấy</strong><br><small class="muted">điện trở xả tuyết</small></span></div><div class="tab" style="cursor:default"><b>4</b><span><strong>Mạch chuyển chế độ</strong><br><small class="muted">động cơ rơle thời gian</small></span></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Quy tắc sống còn</b><p>Tủ gián tiếp <b>phải luân phiên</b> chạy lạnh ↔ xả tuyết. Kẹt ở <b>chế độ chạy lạnh</b> → tuyết bám kín dàn, <b>kém lạnh dần rồi mất lạnh</b>. Kẹt ở <b>chế độ xả</b> → block + quạt không có điện → <b>chỉ đèn sáng, tủ không chạy</b>. Mạch chuyển chế độ chính là nơi quyết định.</p></div></div>
</section>

<section class="sec" id="s-paths" data-toc="2 · Đường đi dòng điện">
  <div class="sec-n">Phần 2</div><h2>Đường đi của dòng điện theo từng mạch</h2>
  <div id="pTabs"></div><article class="panel" id="pPanel" aria-live="polite"></article>
  <p style="margin-top:14px">Hai loại mạch khác nhau do dùng <b>rơle thời gian loại 1</b> (động cơ chân 1–3, <a href="#/tu-lanh/10">Bài 10</a>) hay <b>loại 2</b> (động cơ chân 1–4). Hai rơle giống hệt về hình dạng; khi thay loại khác phải <b>đổi vị trí dây</b> (sò lạnh ↔ sấy/cầu chì ở chân 1, 2) hoặc đổi chân cấp nguồn động cơ.</p>
</section>

<section class="sec" id="s-sim" data-toc="3 · Mô phỏng chu kỳ">
  <div class="sec-n">Phần 3</div><h2>🔬 Mô phỏng chu kỳ chạy lạnh – xả tuyết</h2>
  <p>Chọn loại mạch và lỗi, bấm <b>Chạy</b>. Quan sát các đèn báo: đèn = bật điện; đường nhiệt độ: đứt xanh là ngưỡng sò lạnh (−5 °C), đứt đỏ là ngưỡng cầu chì (+73 °C).</p>
  <div class="stage"><div id="sSvg"></div><div id="sT"></div>
    <div style="padding:0 16px"><div class="muted" style="font-size:14px">Lớp tuyết trên dàn <b id="iceV"></b></div><div class="bar" style="height:14px;margin:6px 0"><i id="iceB" style="width:0;background:var(--cold-l)"></i></div></div>
    <div class="controls">
      <label>Mạch <select id="sType" class="btn sm" style="min-height:36px"><option value="1">Loại 1 (Hitachi)</option><option value="2">Loại 2 (Sharp)</option></select></label>
      <label>Sò lạnh <select id="sSo" class="btn sm" style="min-height:36px"><option value="ok">Tốt</option><option value="open">Hở</option><option value="stuck">Dính</option></select></label>
      <label>Cầu chì <select id="sFu" class="btn sm" style="min-height:36px"><option value="ok">Tốt</option><option value="blown">Đứt</option></select></label>
      <button class="btn pri sm" id="sGo">▶ Chạy</button><button class="btn sm" id="sDoor">🚪 Cửa: đóng</button></div>
    <div class="verdict" id="sV" style="margin:0 14px 12px">Bấm “Chạy”.</div></div>
  <div class="grid2" style="margin-top:14px"><div class="panel" style="margin:0"><h4>Lưu ý loại 1</h4><p style="margin:6px 0 0">Động cơ rơle <b>nối tiếp</b> với sấy + cầu chì: cầu chì đứt hoặc sấy đứt → động cơ rơle <b>mất nguồn</b> → bánh cam đứng yên.</p></div>
    <div class="panel warm" style="margin:0"><h4>Lưu ý loại 2</h4><p style="margin:6px 0 0">Động cơ rơle phụ thuộc <b>sò lạnh</b>: sò hở → chạy lạnh mãi không đếm giờ; sò dính → xả mãi không quay về chạy lạnh.</p></div></div>
</section>

<section class="sec" id="s-toshiba" data-toc="4 · Mạch Toshiba (điốt)">
  <div class="sec-n">Phần 4</div><h2>Mạch có điốt (Toshiba)</h2>
  <p>Cùng nguyên lý rơle thời gian loại 1 nhưng trong mạch sấy có thêm: <b>cầu chì dòng</b>, <b>điốt</b> và <b>varistor</b> (thiết bị bảo vệ điện áp cao, “chống sét”). Sấy gồm <b>hai bóng</b>: sấy dàn (4,3 kΩ) và sấy khay (7,5 kΩ), lấy nguồn khi rơle ở chế độ xả. Điện trở sấy đi <b>một chiều</b> qua điốt (hai điốt lắp ngược nhau chỉ cho nửa chu kỳ qua).</p>
  <div class="grid2" style="align-items:center"><div class="stage" style="margin:0"><div id="w1"></div></div><div class="stage" style="margin:0"><div id="w2"></div></div></div>
  <div class="callout"><span class="ic">💡</span><div><b class="t">Vì sao dùng điốt?</b><p>Sấy chạy <b>nửa công suất</b> nên hạn chế sốc nhiệt, bóng sấy bền hơn (bóng sấy hay nổ do nước nhỏ vào lúc nóng quá nhanh).</p></div></div>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Hư hỏng</th><th>Hậu quả</th></tr></thead><tbody>
    <tr><th>Điốt chạm</th><td>Sấy chạy đủ công suất, dòng lớn → có thể <b>đứt cầu chì dòng</b> → sấy mất điện → tuyết bám kín, kém lạnh dần rồi mất lạnh (giống hỏng mạch xả tuyết)</td></tr>
    <tr><th>Điốt đứt</th><td>Sấy không có dòng → không làm tan tuyết, <b>tuyết bám kín dàn</b></td></tr>
    <tr><th>Varistor chạm</th><td>Đứt cầu chì dòng → mất sấy, kém lạnh</td></tr></tbody></table></div>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Đừng thay bừa!</b><p>Gặp tuyết bám kín dàn, nhiều thợ thay luôn rơle thời gian, sò lạnh, sấy, cầu chì nhiệt mà vẫn không hết. Hãy <b>phân tích mạch</b> để tìm đúng chỗ hỏng (VD điốt, cầu chì dòng) rồi mới sửa.</p></div></div>
</section>

<section class="sec" id="s-swap" data-toc="5 · Thay nhầm rơle, đấu mạch">
  <div class="sec-n">Phần 5</div><h2>Thay nhầm loại rơle thời gian & thực hành đấu</h2>
  <p>Nếu thay rơle loại 1 bằng loại 2 mà <b>không đổi dây</b>: chân 2 và chân 4 lắp lẫn → ở chế độ xả, <b>sấy và động cơ rơle cùng chạy</b> trong khi chạy lạnh. Khi sò lạnh ngắt sớm (30 phút) mà rơle chưa quay → tủ kẹt ở chế độ xả hoặc chuyển chế độ sai → <b>chỉ đèn sáng</b> hoặc kém lạnh.</p>
  <p><b>Cách sửa an toàn:</b> với mạch loại 1: chân 2 nối sò lạnh; chân 1 nối sấy/cầu chì. Với loại 2: đổi hai đầu dây sò lạnh ↔ cầu chì (làm hết ở <b>ngăn đông</b>), còn dây phía rơle giữ nguyên (1: nguồn, 3: thermostat, 4: block+quạt).</p>
  <h3 style="margin-top:18px">Thực hành đấu mạch loại 1 trên mô hình</h3>
  ${U.steps([['Kiểm tra toàn bộ thiết bị, phụ tải bằng đồng hồ', 'Đèn, công tắc, thermostat, rơle thời gian (5–30 kΩ), sò lạnh, cầu chì, sấy (300–500 Ω), block, quạt (600–800 Ω).'], ['Cố định dây nguồn, tìm dây thông ngăn mát ↔ ngăn đông', 'Dùng thông mạch để biết dây nào lên ngăn đông. Nên chọn dây khác nhau cho từng nối để tránh thông nhầm hai vị trí.'], ['Nối dây điều khiển: phích cắm → thermostat → chân 3', 'Dây thông cả hai ngăn dùng làm dây nguồn chung hoặc chân 4.'], ['Nối chân 4 vào block (qua rơle bảo vệ) và quạt (qua công tắc quạt)', 'Đây là chế độ dài (chạy lạnh).'], ['Nối chân 2 vào sò lạnh, sò lạnh nối sấy, sấy nối cầu chì, cầu chì nối chân 1', 'Ba thiết bị sò lạnh – sấy – cầu chì <b>mắc nối tiếp</b> (cùng ở ngăn đông).'], ['Bọc cách điện, đo kiểm tra', 'Chạy lạnh: R đèn ∥ R quạt ∥ R block. Chế độ xả: xoay cam chậm, R của mạch (rơle + sấy) ≈ 26 – 28 kΩ khi nối tiếp.'], ['Cấp nguồn, kẹp dòng, nhìn bánh răng', 'Chạy lạnh: có dòng block, quạt quay. Xoay cam sang xả: dòng đèn ≈ 0,04 A; nối tắt sò lạnh → sấy làm việc, đồng hồ dừng quay, dòng ≈ 0,38 A.']])}
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Tủ gián tiếp: 4 mạch — chiếu sáng, chạy lạnh, sấy, chuyển chế độ.</b></div></li>
    <li class="done"><div><b>Chân 3 = chung (từ thermostat); 3–4 chạy lạnh; 3–2 xả tuyết.</b></div></li>
    <li class="done"><div><b>Loại 1: động cơ rơle nối tiếp sấy; ở chế độ xả quay khi sò lạnh ngắt.</b></div></li>
    <li class="done"><div><b>Loại 2: động cơ rơle theo sò lạnh — lạnh phải đóng, xả phải ngắt.</b></div></li>
    <li class="done"><div><b>Kẹt chế độ lạnh → tuyết bám; kẹt chế độ xả → chỉ đèn sáng.</b></div></li>
    <li class="done"><div><b>Phân tích mạch trước khi thay (điốt, cầu chì dòng, varistor, thay nhầm rơle).</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/15/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#pTabs', root), [{ id: 't1', name: PATHS.t1.name, sub: PATHS.t1.sub }, { id: 't2', name: PATHS.t2.name, sub: PATHS.t2.sub }], id => {
      const p = PATHS[id];
      $('#pPanel', root).innerHTML = `<dl class="kv"><dt>① Chiếu sáng</dt><dd>${p.light}</dd><dt>② Chạy lạnh</dt><dd>${p.cool}</dd><dt>③ Sấy</dt><dd>${p.heat}</dd><dt>④ Chuyển chế độ</dt><dd>${p.sw}</dd></dl><div class="callout mem" style="margin-top:6px"><span class="ic">🧠</span><div><p>${p.note}</p></div></div>`;
    });
    $('#w1', root).innerHTML = waveSVG(false); $('#w2', root).innerHTML = waveSVG(true);
    // mô phỏng
    let S, tm, pts, door = false;
    const reset = () => {
      clearInterval(tm); tm = null;
      S = { mode: 'cool', prog: 0, T: -6, ice: 0, blown: $('#sFu', root).value === 'blown', door, cool: true, heater: false, soClosed: false, runs: false, t: 0, stuckTicks: 0 };
      pts = Array(250).fill(S.T); draw(); $('#sV', root).className = 'verdict'; $('#sV', root).textContent = 'Bấm “Chạy”.';
    };
    function draw() {
      S.door = door; $('#sSvg', root).innerHTML = simSVG(S); $('#sT', root).innerHTML = tSVG(pts);
      $('#iceB', root).style.width = S.ice * 100 + '%'; $('#iceB', root).style.background = S.ice > .7 ? 'var(--bad)' : 'var(--cold-l)'; $('#iceV', root).textContent = Math.round(S.ice * 100) + '%';
    }
    function tick() {
      if (!document.body.contains($('#sSvg', root))) { clearInterval(tm); return; }
      const type = +$('#sType', root).value, so = $('#sSo', root).value;
      S.soClosed = so === 'open' ? false : so === 'stuck' ? true : S.T <= TSO;
      const cool = S.mode === 'cool', def = !cool;
      S.cool = cool; S.heater = def && S.soClosed && !S.blown;
      if (cool) { S.T = Math.max(-28, S.T - .35 * (1 - S.ice * .8)); S.ice = Math.min(1, S.ice + .0022); }
      else if (S.heater) { if (S.ice > 0) { S.ice = Math.max(0, S.ice - .012); S.T = Math.min(-6.5, S.T + .3); } else S.T += .8; }
      else S.T += .05;
      if (S.T >= TFUSE && S.heater) S.blown = true;
      if (S.T > 40 && !S.heater) S.T = Math.max(20, S.T - .5);
      S.runs = type === 1 ? (cool ? !S.blown : !S.soClosed && !S.blown) : (cool ? S.soClosed : !S.soClosed);
      if (S.runs) S.prog++;
      if (cool && S.prog >= 200) { S.mode = 'def'; S.prog = 0; }
      else if (def && S.prog >= 50) { S.mode = 'cool'; S.prog = 0; S.T = Math.min(S.T, 0); }
      pts.push(S.T); pts.shift(); S.t++; draw();
      const v = $('#sV', root);
      if (!S.runs) S.stuckTicks++; else S.stuckTicks = 0;
      if (S.mode === 'def' && S.stuckTicks > 120) { v.className = 'verdict bad'; v.innerHTML = '✗ Rơle thời gian <b>kẹt ở chế độ xả</b>: block + quạt không có điện → <b>chỉ đèn sáng, tủ không chạy</b>' + (S.blown ? ' (cầu chì nhiệt đã đứt).' : so === 'stuck' ? ' (sò lạnh dính, sấy chạy mãi).' : '.'); }
      else if (S.mode === 'cool' && (S.ice > .75 || S.stuckTicks > 150)) { v.className = 'verdict bad'; v.innerHTML = '✗ Tủ <b>kẹt ở chế độ chạy lạnh</b> / không xả được tuyết: <b>tuyết bám kín dàn</b> (' + Math.round(S.ice * 100) + '%) → kém lạnh dần rồi mất lạnh.'; }
      else { v.className = 'verdict ok'; v.innerHTML = `Chế độ: <b>${S.mode === 'cool' ? 'CHẠY LẠNH' : 'XẢ TUYẾT'}</b> · nhiệt độ dàn ≈ ${S.T.toFixed(0)} °C · bánh cam ${S.runs ? 'đang quay' : 'đứng yên (chờ điều kiện)'}.`; }
    }
    $('#sGo', root).onclick = () => { reset(); tm = setInterval(tick, 40); };
    $('#sDoor', root).onclick = e => { door = !door; e.target.textContent = '🚪 Cửa: ' + (door ? 'mở' : 'đóng'); if (S) draw(); };
    ['#sType', '#sSo', '#sFu'].forEach(s => $(s, root).onchange = reset);
    reset();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Tủ gián tiếp có mấy mạch?', b: '4: <b>chiếu sáng, chạy lạnh, sấy, chuyển chế độ</b>.', tag: 'Tổng quan' },
    { f: 'Các phụ tải của tủ gián tiếp?', b: 'Đèn, quạt, block, điện trở sấy, <b>động cơ rơle thời gian</b>.', tag: 'Tổng quan' },
    { f: 'Kẹt ở chế độ chạy lạnh thì?', b: 'Không xả tuyết → tuyết bám kín dàn → kém lạnh rồi mất lạnh.', tag: 'Tổng quan' },
    { f: 'Kẹt ở chế độ xả thì?', b: 'Block + quạt không có điện → <b>chỉ đèn sáng</b>.', tag: 'Tổng quan' },
    { f: 'Chân 3 của rơle thời gian nối với?', b: '<b>Thermostat</b> (chân chung của tiếp điểm).', tag: 'Đường điện' },
    { f: 'Chân 4 nối với?', b: 'Block (qua rơle bảo vệ) và quạt gió.', tag: 'Đường điện' },
    { f: 'Chân 2 (3–2) dẫn tới đâu ở chế độ xả?', b: 'Sò lạnh/cầu chì và <b>điện trở sấy</b>.', tag: 'Đường điện' },
    { f: 'Mạch loại 1: động cơ rơle ở chân nào?', b: '<b>Chân 1 và 3</b>.', tag: 'Loại 1' },
    { f: 'Loại 1: động cơ rơle mắc thế nào với sấy?', b: '<b>Nối tiếp</b> với sấy + cầu chì.', tag: 'Loại 1' },
    { f: 'Loại 1: lúc chạy lạnh động cơ rơle ra sao?', b: 'Luôn quay (nối tiếp sấy, sấy chỉ nhận rất ít áp).', tag: 'Loại 1' },
    { f: 'Loại 1: lúc xả, vì sao đồng hồ dừng khi sò lạnh đóng?', b: 'Hai đầu động cơ cân bằng điện áp (sò nối tắt).', tag: 'Loại 1' },
    { f: 'Loại 1: khi nào quay về chạy lạnh?', b: 'Khi tuyết tan hết, sò lạnh <b>ngắt</b> → động cơ lại có điện.', tag: 'Loại 1' },
    { f: 'Mạch loại 2: động cơ rơle ở chân nào?', b: '<b>Chân 1 và 4</b>.', tag: 'Loại 2' },
    { f: 'Loại 2: chế độ chạy lạnh, sò lạnh phải ở trạng thái?', b: '<b>Đóng</b> (dàn đã lạnh) thì rơle mới quay.', tag: 'Loại 2' },
    { f: 'Loại 2: chế độ xả, sò lạnh phải?', b: '<b>Ngắt</b> (tuyết tan hết) thì rơle mới quay.', tag: 'Loại 2' },
    { f: 'Kết luận chung mạch loại 2?', b: 'Động cơ rơle hoạt động <b>phụ thuộc sò lạnh</b>.', tag: 'Loại 2' },
    { f: 'Thời gian chạy lạnh và xả?', b: '6–8 giờ và 15–30 phút.', tag: 'Chu kỳ' },
    { f: 'Chuỗi vòng lặp thế nào?', b: 'Chạy lạnh → sò đóng/sấy → tuyết tan → sò ngắt → rơle quay → chạy lạnh.', tag: 'Chu kỳ' },
    { f: 'Mạch Toshiba có thêm gì trong mạch sấy?', b: '<b>Điốt</b>, <b>varistor</b> (chống sét), <b>cầu chì dòng</b>.', tag: 'Toshiba' },
    { f: 'Điốt làm sấy chạy thế nào?', b: 'Chỉ <b>một chiều</b> (nửa chu kỳ) → công suất ~ 1/2.', tag: 'Toshiba' },
    { f: 'Vì sao giảm công suất sấy?', b: 'Bóng sấy ít bị sốc nhiệt, ít nổ.', tag: 'Toshiba' },
    { f: 'Điốt chạm thì?', b: 'Sấy đủ công suất, có thể đứt cầu chì dòng → mất sấy, tuyết bám.', tag: 'Toshiba' },
    { f: 'Varistor dùng để?', b: '<b>Bảo vệ áp cao</b> (chống sét); chạm thì đứt cầu chì dòng.', tag: 'Toshiba' },
    { f: 'Vì sao không nên thay bừa linh kiện xả tuyết?', b: 'Có thể hỏng điốt, cầu chì dòng... Phải <b>phân tích mạch</b> tìm đúng chỗ.', tag: 'Toshiba' },
    { f: 'Thay nhầm loại rơle thời gian gây gì?', b: 'Mạch xả/lạnh đảo sai → chỉ đèn sáng hoặc kém lạnh.', tag: 'Thay thế' },
    { f: 'Cách sửa khi thay khác loại?', b: 'Đổi vị trí dây sò lạnh ↔ cầu chì/sấy (hoặc dây cấp nguồn động cơ).', tag: 'Thay thế' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Mạch gián tiếp chia thành mấy mạch?', ['4', '2', '3', '6'], 0, 'Chiếu sáng, chạy lạnh, sấy, chuyển chế độ.'),
    Q('Chân 3 rơle thời gian nối?', ['Thermostat', 'Block', 'Sấy', 'Đèn'], 0, 'Chân chung.'),
    Q('Chạy lạnh khi tiếp điểm?', ['3 nối 4', '3 nối 2', '1 nối 2', '2 nối 4'], 0, 'Chế độ dài.'),
    Q('Xả tuyết khi tiếp điểm?', ['3 nối 2', '3 nối 4', '1 nối 4', 'Không'], 0, 'Chế độ ngắn.'),
    Q('Kẹt chế độ lạnh → ?', ['Tuyết bám, kém lạnh', 'Chỉ đèn sáng', 'Cháy sấy', 'Không đổi'], 0, 'Không xả.'),
    Q('Kẹt chế độ xả → ?', ['Chỉ đèn sáng', 'Tuyết bám', 'Lạnh sâu', 'Block quá tải'], 0, 'Block + quạt mất điện.'),
    Q('Loại 1: động cơ rơle nối ở?', ['Chân 1–3', 'Chân 1–4', 'Chân 2–4', 'Chân 2–3'], 0, 'Loại “13”.'),
    Q('Loại 1: động cơ rơle mắc với sấy?', ['Nối tiếp', 'Song song', 'Không nối', 'Qua tụ'], 0, 'Chia áp: động cơ có điện, sấy ít.'),
    Q('Loại 1: sò lạnh đóng trong chế độ xả thì động cơ?', ['Dừng', 'Quay nhanh', 'Quay ngược', 'Cháy'], 0, 'Hai đầu cân bằng áp.'),
    Q('Loại 1: tuyết tan hết thì?', ['Sò ngắt, động cơ quay lại', 'Sò đóng', 'Cầu chì đứt', 'Block chạy'], 0, 'Chuyển về chạy lạnh.'),
    Q('Loại 2: động cơ ở?', ['Chân 1–4', 'Chân 1–3', 'Chân 2–3', 'Chân 3–4'], 0, 'Loại “14”.'),
    Q('Loại 2: chạy lạnh, động cơ quay khi sò lạnh?', ['Đóng', 'Ngắt', 'Cháy', 'Dính'], 0, 'Dàn đã lạnh.'),
    Q('Loại 2: chế độ xả, động cơ quay khi sò lạnh?', ['Ngắt', 'Đóng', 'Hở', 'Dính'], 0, 'Tuyết tan.'),
    Q('Thời gian xả phụ thuộc?', ['Thời gian sò lạnh đóng', 'Điện áp', 'Nhiệt độ phòng', 'Dung tích'], 0, 'Lượng tuyết.'),
    Q('Mạch Toshiba thêm?', ['Điốt, varistor, cầu chì dòng', 'Thêm quạt', 'Thêm block', 'Thêm đèn'], 0, 'Trong mạch sấy.'),
    Q('Điốt trong mạch sấy cho dòng?', ['Một chiều', 'Hai chiều', 'Không', 'Chỉ lúc khởi động'], 0, 'Nửa chu kỳ.'),
    Q('Sấy chạy bán kỳ thì công suất?', ['Khoảng một nửa', 'Gấp đôi', 'Bằng 0', 'Không đổi'], 0, 'Bán kỳ.'),
    Q('Điốt chạm → ?', ['Sấy đủ công suất, có thể đứt cầu chì dòng', 'Sấy tắt ngay', 'Block ồn', 'Quạt hỏng'], 0, 'Hậu quả.'),
    Q('Varistor là?', ['Thiết bị bảo vệ áp cao', 'Tụ', 'Cầu chì nhiệt', 'Rơle'], 0, 'Chống sét.'),
    Q('Tuyết bám dù đã thay timer, sò, sấy, cầu chì: nghi?', ['Điốt, cầu chì dòng', 'Block', 'Phin', 'Dàn nóng'], 0, 'Phân tích mạch.'),
    Q('Thay nhầm loại timer cần?', ['Đổi dây sò lạnh ↔ cầu chì/sấy', 'Tăng gas', 'Thay quạt', 'Thay block'], 0, 'Sửa mạch.'),
    Q('Cầu chì nhiệt đứt với loại 1 → động cơ rơle?', ['Mất nguồn', 'Quay nhanh', 'Cháy', 'Không đổi'], 0, 'Nối tiếp với sấy.'),
    Q('Mạch chiếu sáng gồm?', ['Công tắc cửa, đèn', 'Thermostat, block', 'Sấy, sò lạnh', 'Quạt, timer'], 0, 'Đơn giản.'),
    Q('Quạt cấp từ chân?', ['Chân 4', 'Chân 2', 'Chân 1', 'Không'], 0, 'Chế độ dài.')
  ];
  const sort = {
    title: 'Hiện tượng thuộc kiểu kẹt nào?',
    buckets: [{ id: 'cool', name: 'Kẹt chế độ CHẠY LẠNH' }, { id: 'def', name: 'Kẹt chế độ XẢ' }, { id: 'ok', name: 'Hoạt động bình thường' }],
    items: [
      { t: 'Tuyết bám kín dàn', b: 'cool' }, { t: 'Kém lạnh dần rồi mất lạnh', b: 'cool' }, { t: 'Sò lạnh hở, sấy không có điện', b: 'cool' }, { t: 'Cầu chì đứt, rơle dừng ở chế độ dài', b: 'cool' },
      { t: 'Chỉ đèn sáng, tủ không chạy', b: 'def' }, { t: 'Block + quạt mất điện', b: 'def' }, { t: 'Sò lạnh dính, sấy chạy mãi', b: 'def' }, { t: 'Cầu chì đứt, rơle dừng ở chế độ ngắn', b: 'def' },
      { t: 'Luân phiên 6–8 giờ lạnh, 15–30 phút xả', b: 'ok' }, { t: 'Tuyết tan hết, sò lạnh ngắt', b: 'ok' }, { t: 'Động cơ rơle quay đủ chu kỳ', b: 'ok' }, { t: 'Dàn thông thoáng, gió đối lưu tốt', b: 'ok' }
    ]
  };
  const order = [
    { title: 'Một chu kỳ mạch loại 1', intro: 'Sắp xếp diễn biến.', steps: ['Chạy lạnh: 3–4, block + quạt chạy, động cơ rơle quay', 'Sau 6–8 giờ bánh cam chuyển sang 3–2', 'Sò lạnh đóng, sấy làm việc, động cơ rơle dừng', 'Tuyết tan hết, nhiệt độ bề mặt dàn tăng', 'Sò lạnh ngắt, động cơ rơle quay trở lại', 'Rơle chuyển về 3–4, tủ chạy lạnh'] },
    { title: 'Một chu kỳ mạch loại 2', intro: 'Sắp xếp diễn biến.', steps: ['Mới cấp điện: 3–4, block + quạt chạy, sò còn ngắt nên rơle chưa quay', 'Dàn lạnh xuống, sò lạnh đóng', 'Động cơ rơle bắt đầu quay đếm giờ', 'Sau 6–8 giờ rơle chuyển sang 3–2, sấy làm việc', 'Tuyết tan, sò lạnh ngắt', 'Động cơ rơle quay, về chế độ chạy lạnh'] },
    { title: 'Tìm hỏng khi tuyết bám kín dàn', intro: 'Sắp xếp quy trình phân tích.', steps: ['Tháo tấm xốp quan sát tuyết bám dàn', 'Xác định loại rơle thời gian và vẽ mạch', 'Kiểm tra động cơ rơle, tiếp điểm, bánh răng', 'Kiểm tra sò lạnh và cầu chì nhiệt', 'Kiểm tra sấy, điốt, cầu chì dòng (nếu có)', 'Thay đúng thiết bị hỏng, kiểm tra chu kỳ'] }
  ];
  DL.register({
    id: 15, ready: true, title: 'Phân tích mạch điện tủ gián tiếp', sub: 'Rơle thời gian loại 1, loại 2, mạch Toshiba, thực hành đấu mạch', minutes: 40,
    lead: 'Mạch tủ gián tiếp là phần khó nhất của điện lạnh tủ lạnh. Bài này theo dõi dòng điện qua 4 mạch, mô phỏng chu kỳ chạy lạnh – xả tuyết cho cả hai loại rơle và các lỗi thường gặp.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
