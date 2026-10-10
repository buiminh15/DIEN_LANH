/* BÀI 0 — TỔNG QUÁT: TỦ LẠNH LÀM LẠNH NHƯ THẾ NÀO? (biên soạn từ docs/Tủ lạnh làm lạnh như thế nào_.html) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const CYCLE = {
    comp: ['Máy nén (lốc)', 'Trái tim của hệ thống. Hút <b>hơi gas lạnh, áp suất thấp</b> từ dàn lạnh rồi nén lên áp suất cao. Bị nén nên gas nóng lên rất nhiều (khoảng 60 – 90 °C) và được đẩy sang dàn nóng. Máy nén <b>không trực tiếp làm lạnh</b>; nó tạo ra chênh lệch áp suất để gas mang được nhiệt đi.', 'Vào: hơi lạnh, áp thấp → Ra: hơi nóng, áp cao', 'Hỏng: máy chạy mà tủ không lạnh, kêu to, hoặc rơle nhảy liên tục (kẹt cơ, cháy cuộn dây).'],
    cond: ['Dàn nóng', 'Gas nóng, áp cao đi qua dàn ống ở sau/ dưới tủ, <b>nhả nhiệt ra không khí</b> và <b>ngưng tụ</b> từ hơi thành lỏng ấm (vẫn áp cao).', 'Vào: hơi nóng, áp cao → Ra: lỏng ấm, áp cao', 'Bám bụi dày hoặc đặt sát tường: thải nhiệt kém, tủ chạy liên tục, tốn điện.'],
    cap: ['Ống mao dẫn', 'Ống đồng rất nhỏ làm <b>giảm áp suất đột ngột</b>. Áp suất giảm thì nhiệt độ sôi giảm theo: một phần gas hóa hơi ngay và cả dòng lạnh đi mạnh.', 'Vào: lỏng ấm, áp cao → Ra: lỏng lạnh, áp thấp', 'Tắc (ẩm, cặn): tủ không lạnh, dàn lạnh đóng tuyết từng phần.'],
    evap: ['Dàn lạnh', 'Gas lỏng lạnh, áp thấp <b>sôi</b> trong dàn lạnh và <b>hút nhiệt</b> từ thực phẩm/ không khí trong tủ → hóa hơi lạnh rồi quay về máy nén.', 'Vào: lỏng lạnh, áp thấp → Ra: hơi lạnh, áp thấp', 'Đóng tuyết dày: cản gió, tủ kém lạnh (xem bài xả tuyết).']
  };
  const CUT = {
    comp: ['Máy nén', 'Nằm ở đáy, phía sau tủ. Máy nén kín: động cơ và piston nằm chung trong vỏ thép hàn kín. Hút hơi lạnh từ dàn lạnh, nén thành hơi nóng áp cao đẩy tới dàn nóng. Hỏng: chạy mà không lạnh, kêu to, ngắt liên tục.'],
    relay: ['Rơle khởi động', 'Gắn cạnh máy nén. Giúp động cơ máy nén <b>khởi động</b> rồi tự ngắt bộ phận phụ khi đã chạy.'],
    cond: ['Dàn nóng', 'Dàn ống ở sau/ dưới tủ, thải nhiệt ra phòng và ngưng gas thành lỏng.'],
    filter: ['Bộ sấy lọc', 'Lọc cặn và <b>hút ẩm</b> trước khi gas vào ống mao dẫn, tránh tắc ống.'],
    cap: ['Ống mao dẫn', 'Ống nhỏ làm giảm áp suất gas trước khi vào dàn lạnh.'],
    evap: ['Dàn lạnh', 'Nằm ở ngăn đá (phía sau). Gas sôi và hút nhiệt ở đây.'],
    fan: ['Quạt dàn lạnh', 'Thổi gió qua dàn lạnh xuống các ngăn (tủ quạt gió – no-frost). Kẹt quạt/ tuyết cản gió → ngăn mát không lạnh dù ngăn đá vẫn lạnh.'],
    heater: ['Điện trở xả đá', 'Định kỳ nóng lên để <b>làm tan tuyết</b> bám dàn lạnh.'],
    sensor: ['Cảm biến nhiệt độ', 'Đo nhiệt trong tủ, báo cho bo mạch quyết định chạy/ dừng máy nén.']
  };
  // nhiệt độ sôi/ngưng của R600a theo áp suất tuyệt đối (bar) — số liệu làm tròn, minh họa
  const SAT = [[0.5, -32], [0.65, -23], [1, -11.7], [1.5, 0], [2, 8], [3, 21], [4, 30.5], [5, 38.5], [6, 45]];
  const tsat = p => { for (let i = 1; i < SAT.length; i++) if (p <= SAT[i][0]) { const [p0, t0] = SAT[i - 1], [p1, t1] = SAT[i]; return t0 + (t1 - t0) * (Math.log(p / p0) / Math.log(p1 / p0)); } return SAT[SAT.length - 1][1]; };

  const stateCol = { hotv: 'var(--hot)', warml: 'var(--warm)', coldl: 'var(--cold)', coldv: 'var(--cold-l)' };
  function cycleSVG(sel, run) {
    const st = k => sel === k ? ' stroke="var(--ink)" stroke-width="5"' : ' stroke="var(--ink)" stroke-width="2.5"';
    const flow = (d, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" opacity=".35"/><path ${run ? 'class="flow"' : ''} d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 12"/>`;
    return `<svg viewBox="0 0 520 330" role="img" aria-label="Chu trình gas lạnh qua bốn bộ phận">
      ${flow('M310 70H420', stateCol.hotv)}${flow('M470 98V232', stateCol.warml)}${flow('M420 262H300', stateCol.coldl)}${flow('M110 232V98', stateCol.coldv)}${flow('M110 70H210', stateCol.coldv)}
      <g data-k="comp" style="cursor:pointer" tabindex="0"><rect x="210" y="38" width="100" height="64" rx="14" fill="var(--hot)"${st('comp')}/><text class="sub" x="260" y="76" text-anchor="middle" style="fill:var(--ink)">1 Máy nén</text></g>
      <g data-k="cond" style="cursor:pointer" tabindex="0"><rect x="420" y="38" width="100" height="64" rx="14" fill="var(--warm)"${st('cond')}/><text class="sub" x="470" y="76" text-anchor="middle" style="fill:var(--ink)">2 Dàn nóng</text></g>
      <g data-k="cap" style="cursor:pointer" tabindex="0"><rect x="420" y="232" width="100" height="64" rx="14" fill="var(--cold-l)"${st('cap')}/><text class="sub" x="470" y="270" text-anchor="middle" style="fill:var(--ink)">3 Ống mao</text></g>
      <g data-k="evap" style="cursor:pointer" tabindex="0"><rect x="60" y="232" width="100" height="64" rx="14" fill="var(--cold)"${st('evap')}/><text class="sub" x="110" y="270" text-anchor="middle" style="fill:var(--ink)">4 Dàn lạnh</text></g>
      <text class="fl" x="365" y="28" text-anchor="middle">hơi nóng, áp cao</text><text class="fl" x="458" y="170" text-anchor="end">lỏng ấm, áp cao</text><text class="fl" x="360" y="284" text-anchor="middle">lỏng lạnh, áp thấp</text><text class="fl" x="14" y="170">hơi lạnh,</text><text class="fl" x="14" y="188">áp thấp</text></svg>`;
  }
  function cutSVG(sel) {
    const g = (k, inner) => `<g data-k="${k}" style="cursor:pointer" tabindex="0">${inner}</g>`, o = k => sel === k ? ' stroke="var(--ink)" stroke-width="5"' : ' stroke="var(--ink)" stroke-width="2"';
    return `<svg viewBox="0 0 360 440" role="img" aria-label="Mặt cắt tủ lạnh quạt gió hai ngăn">
      <rect x="40" y="14" width="260" height="400" rx="16" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M40 150H300" stroke="var(--ink)" stroke-width="3"/><text class="fl" x="60" y="40" style="fill:var(--cold)">NGĂN ĐÁ</text><text class="fl" x="60" y="172" style="fill:var(--cold)">NGĂN MÁT</text>
      ${g('evap', `<rect x="200" y="48" width="84" height="40" rx="6" fill="var(--cold)"${o('evap')}/>`)}
      ${g('fan', `<circle cx="242" cy="112" r="16" fill="var(--cold-l)"${o('fan')}/><path d="M242 98v28M228 112h28" stroke="var(--ink)" stroke-width="2"/>`)}
      ${g('heater', `<path d="M200 96h84" stroke="var(--hot)" stroke-width="7"${sel === 'heater' ? ' stroke-dasharray="3 3"' : ''}/>`)}
      ${g('sensor', `<circle cx="120" cy="100" r="10" fill="var(--warm)"${o('sensor')}/>`)}
      ${g('cap', `<path d="M64 350q10-12 20 0t20 0" fill="none" stroke="var(--cold)" stroke-width="5"/><rect x="60" y="330" width="52" height="40" fill="transparent"${o('cap')}/>`)}
      ${g('filter', `<rect x="124" y="338" width="30" height="16" rx="5" fill="var(--ok)"${o('filter')}/>`)}
      ${g('cond', `<path d="M170 300h110M170 316h110M170 332h110M170 348h110" stroke="var(--warm)" stroke-width="5"/><rect x="164" y="292" width="124" height="66" fill="transparent"${o('cond')}/>`)}
      ${g('relay', `<rect x="236" y="372" width="28" height="22" rx="4" fill="var(--hot)"${o('relay')}/>`)}
      ${g('comp', `<rect x="130" y="372" width="96" height="34" rx="12" fill="var(--ink)"${o('comp')}/><text class="fl" x="178" y="394" text-anchor="middle" style="fill:var(--bg)">máy nén</text>`)}
    </svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-idea" data-toc="1 · Ý tưởng chính">
  <div class="sec-n">Phần 1</div><h2>Tủ lạnh không “sinh ra lạnh” — nó chuyển nhiệt</h2>
  <p>Gas lạnh chạy <b>một vòng kín</b> qua <b>bốn bộ phận</b>. Mỗi vòng chuyển một ít <b>nhiệt từ trong tủ ra ngoài phòng</b>. Bấm vào từng bộ phận để xem nó làm gì.</p>
  <div class="stage"><div id="cSvg" style="padding:6px"></div><div class="controls"><button class="btn pri sm" id="cPlay" aria-pressed="true">⏸ Tạm dừng</button></div>
    <div class="row" style="padding:0 14px 12px;gap:10px;flex-wrap:wrap"><span class="pill" style="background:var(--hot-tint);color:var(--hot)">hơi nóng, áp cao</span><span class="pill" style="background:var(--warm-tint);color:var(--warm)">lỏng ấm, áp cao</span><span class="pill" style="background:var(--cold-tint);color:var(--cold)">lỏng lạnh, áp thấp</span><span class="pill" style="background:var(--cold-tint2);color:var(--cold)">hơi lạnh, áp thấp</span></div></div>
  <article class="panel" id="cPanel" aria-live="polite"></article>
  <ol class="steps recap" style="margin-top:12px"><li class="done"><div><b>① Máy nén</b><span>nén hơi lạnh → hơi nóng, áp cao</span></div></li><li class="done"><div><b>② Dàn nóng</b><span>nhả nhiệt ra phòng, hơi → lỏng</span></div></li><li class="done"><div><b>③ Ống mao dẫn</b><span>giảm áp → gas lạnh sâu</span></div></li><li class="done"><div><b>④ Dàn lạnh</b><span>lỏng sôi, hút nhiệt trong tủ</span></div></li></ol>
</section>

<section class="sec" id="s-why" data-toc="2 · Vì sao đổi áp suất?">
  <div class="sec-n">Phần 2</div><h2>Vì sao đổi áp suất lại đổi được nhiệt độ?</h2>
  <p>Mọi chất lỏng đều <b>sôi ở một nhiệt độ phụ thuộc áp suất</b>. Gas lạnh (ví dụ <b>R600a</b>) bị hạ áp xuống thấp thì sôi ở nhiệt độ rất thấp, và khi sôi nó <b>hút nhiệt</b> từ xung quanh. Bị nén lên áp cao thì nó chỉ ngưng ở nhiệt độ cao hơn phòng, và khi ngưng nó <b>nhả nhiệt</b> ra ngoài. Kéo thanh trượt để thử:</p>
  <div class="stage" style="padding:14px"><div class="row"><label>Áp suất (tuyệt đối) <input id="pr" type="range" min="0.5" max="6" step="0.05" value="0.65" style="width:220px"> <b id="prV"></b></label></div>
    <div id="thm" style="margin-top:12px"></div><div class="verdict" id="prR" style="margin-top:12px"></div></div>
  <p class="muted" style="font-size:13px">Số liệu làm tròn, dùng minh họa cho gas R600a (isobutan). Thực tế khác nhau theo loại gas và nhiệt độ phòng.</p>
</section>

<section class="sec" id="s-real" data-toc="3 · Trong tủ thật">
  <div class="sec-n">Phần 3</div><h2>Các bộ phận nằm ở đâu trong tủ thật?</h2>
  <p>Mặt cắt một tủ lạnh <b>quạt gió (no-frost) hai ngăn</b>. Ngoài bốn bộ phận chính còn có thiết bị phụ giúp tủ chạy đúng và bền.</p>
  <div class="grid2" style="align-items:start"><div class="stage" style="margin:0" id="kSvg"></div><article class="panel" id="kInfo" aria-live="polite"></article></div>
  <div class="callout danger"><span class="ic">🔥</span><div><b class="t">An toàn</b><p>Nhiều tủ lạnh hiện nay dùng gas <b>R600a rất dễ cháy</b>. Việc xả gas, hàn ống và nạp gas cần thợ được đào tạo và dụng cụ phù hợp.</p></div></div>
</section>

<section class="sec" id="s-map" data-toc="4 · Các bài sau">
  <div class="sec-n">Phần 4</div><h2>Bản đồ các bài học tiếp theo</h2>
  <p>Bài tổng quát cho bạn bức tranh lớn. Các bài sau đi sâu từng bộ phận:</p>
  <ul><li><b>Bài 1 – 4</b>: dàn lạnh, động cơ block, dàn nóng, phin lọc & ống mao</li><li><b>Bài 5 – 13</b>: block, rơle, sò lạnh, tụ, xả tuyết, phụ tải</li><li><b>Bài 14 – 15</b>: mạch điện tủ trực tiếp, gián tiếp</li><li><b>Bài 16 – 17</b>: cân cáp, chân không, nạp gas</li></ul>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Tủ lạnh chuyển nhiệt từ trong ra ngoài bằng gas chạy vòng kín.</b></div></li>
    <li class="done"><div><b>Máy nén tạo chênh lệch áp suất, không trực tiếp làm lạnh.</b></div></li>
    <li class="done"><div><b>Dàn nóng: nhả nhiệt, gas ngưng thành lỏng.</b></div></li>
    <li class="done"><div><b>Ống mao: giảm áp → giảm nhiệt độ sôi.</b></div></li>
    <li class="done"><div><b>Dàn lạnh: gas sôi, hút nhiệt trong tủ.</b></div></li>
    <li class="done"><div><b>Áp thấp → sôi ở nhiệt độ thấp; áp cao → ngưng ở nhiệt độ cao.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/0/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    let sel = 'comp', run = true;
    const cd = () => {
      $('#cSvg', root).innerHTML = cycleSVG(sel, run); const c = CYCLE[sel];
      $('#cPanel', root).innerHTML = `<h3>${c[0]}</h3><p>${c[1]}</p><p><span class="pill ok">${c[2]}</span></p><p style="margin:0"><b>${c[3].split(':')[0]}:</b>${c[3].slice(c[3].indexOf(':') + 1)}</p>`;
      $$('#cSvg [data-k]', root).forEach(g => { const f = () => { sel = g.dataset.k; cd(); }; g.onclick = f; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } }; });
    }; cd();
    $('#cPlay', root).onclick = e => { run = !run; e.currentTarget.setAttribute('aria-pressed', run); e.currentTarget.textContent = run ? '⏸ Tạm dừng' : '▶ Chạy tiếp'; cd(); };
    const pr = $('#pr', root), pd = () => {
      const p = +pr.value, t = tsat(p); $('#prV', root).textContent = p.toFixed(2) + ' bar → ' + t.toFixed(0) + ' °C';
      const X = v => 40 + (v + 40) / 100 * 440;
      $('#thm', root).innerHTML = `<svg viewBox="0 0 520 90"><rect x="40" y="30" width="440" height="14" rx="7" fill="var(--surface2)" stroke="var(--line)"/><path d="M${X(-18)} 22V52" stroke="var(--cold)" stroke-width="3"/><text class="fl" x="${X(-18)}" y="16" text-anchor="middle">ngăn đá −18 °C</text><path d="M${X(32)} 22V52" stroke="var(--warm)" stroke-width="3"/><text class="fl" x="${X(32)}" y="16" text-anchor="middle">phòng 32 °C</text><circle cx="${X(t)}" cy="37" r="11" fill="${t < -18 ? 'var(--cold)' : t > 32 ? 'var(--hot)' : 'var(--muted)'}" stroke="var(--ink)" stroke-width="3"/><text class="sub" x="${X(t)}" y="76" text-anchor="middle">gas sôi/ ngưng ở ${t.toFixed(0)} °C</text></svg>`;
      const r = $('#prR', root);
      if (t < -18) { r.className = 'verdict ok'; r.innerHTML = `✓ Gas sôi ở ${t.toFixed(0)} °C, thấp hơn ngăn đá (−18 °C) nên nó <b>hút được nhiệt</b> từ thực phẩm. Đây là điều kiện của <b>dàn lạnh</b>.`; }
      else if (t > 32) { r.className = 'verdict ok'; r.innerHTML = `✓ Gas chỉ ngưng ở ${t.toFixed(0)} °C, cao hơn phòng (32 °C) nên nó <b>nhả được nhiệt</b> ra ngoài. Đây là điều kiện của <b>dàn nóng</b>.`; }
      else { r.className = 'verdict'; r.textContent = `Ở ${t.toFixed(0)} °C: gas không đủ lạnh để hút nhiệt từ ngăn đá, cũng không đủ nóng để nhả nhiệt ra phòng. Hãy kéo về áp thấp (≈0,65) hoặc áp cao (≈4,5).`; }
    };
    pr.oninput = pd; pd();
    let ks = 'comp';
    const kd = () => {
      $('#kSvg', root).innerHTML = cutSVG(ks);
      $('#kInfo', root).innerHTML = `<h3>${CUT[ks][0]}</h3><p style="margin:0">${CUT[ks][1]}</p><div class="row" style="margin-top:12px;gap:6px">${Object.entries(CUT).map(([k, v], i) => `<button type="button" class="btn sm" data-k="${k}" aria-pressed="${k === ks}">${i + 1}. ${v[0]}</button>`).join('')}</div>`;
      $$('#kSvg [data-k], #kInfo [data-k]', root).forEach(g => { const f = () => { ks = g.dataset.k; kd(); }; g.onclick = f; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } }; });
    }; kd();
  }

  const flashcards = [
    { f: 'Tủ lạnh làm lạnh bằng cách nào?', b: '<b>Chuyển nhiệt</b> từ trong tủ ra ngoài phòng nhờ gas chạy vòng kín.', tag: 'Ý chính' },
    { f: 'Vòng gas đi qua mấy bộ phận chính?', b: '<b>4</b>: máy nén, dàn nóng, ống mao dẫn, dàn lạnh.', tag: 'Ý chính' },
    { f: 'Máy nén có làm lạnh trực tiếp không?', b: 'Không; nó tạo <b>chênh lệch áp suất</b>.', tag: 'Máy nén' },
    { f: 'Gas vào máy nén ở trạng thái?', b: 'Hơi lạnh, áp suất thấp.', tag: 'Máy nén' },
    { f: 'Gas ra khỏi máy nén?', b: 'Hơi nóng, áp suất cao (~60–90 °C).', tag: 'Máy nén' },
    { f: 'Dàn nóng làm gì?', b: 'Nhả nhiệt ra phòng, gas ngưng thành lỏng ấm.', tag: 'Dàn nóng' },
    { f: 'Dàn nóng bám bụi/ đặt sát tường?', b: 'Thải nhiệt kém, chạy liên tục, tốn điện.', tag: 'Dàn nóng' },
    { f: 'Ống mao dẫn làm gì?', b: 'Giảm áp suất đột ngột → gas lạnh sâu.', tag: 'Ống mao' },
    { f: 'Sau ống mao gas ở trạng thái?', b: 'Lỏng lạnh (một phần hóa hơi), áp thấp.', tag: 'Ống mao' },
    { f: 'Dàn lạnh làm gì?', b: 'Gas sôi, hút nhiệt trong tủ, hóa hơi lạnh.', tag: 'Dàn lạnh' },
    { f: 'Vì sao đổi áp suất đổi nhiệt độ?', b: 'Nhiệt độ sôi phụ thuộc áp suất.', tag: 'Nguyên lý' },
    { f: 'Áp suất thấp thì?', b: 'Gas sôi ở nhiệt độ thấp → hút nhiệt.', tag: 'Nguyên lý' },
    { f: 'Áp suất cao thì?', b: 'Gas ngưng ở nhiệt độ cao → nhả nhiệt.', tag: 'Nguyên lý' },
    { f: 'Gas phổ biến của tủ hiện nay?', b: 'R600a (isobutan), dễ cháy.', tag: 'Gas' },
    { f: 'R600a ở 0,65 bar sôi khoảng?', b: '−23 °C.', tag: 'Gas' },
    { f: 'Máy nén nằm ở đâu?', b: 'Đáy, phía sau tủ; là máy nén kín.', tag: 'Tủ thật' },
    { f: 'Rơle khởi động giúp gì?', b: 'Khởi động động cơ máy nén.', tag: 'Tủ thật' },
    { f: 'Bộ sấy lọc làm gì?', b: 'Lọc cặn, hút ẩm, tránh tắc ống mao.', tag: 'Tủ thật' },
    { f: 'Quạt dàn lạnh làm gì?', b: 'Thổi gió lạnh xuống các ngăn (no-frost).', tag: 'Tủ thật' },
    { f: 'Điện trở xả đá làm gì?', b: 'Làm tan tuyết bám dàn lạnh.', tag: 'Tủ thật' },
    { f: 'Cảm biến nhiệt báo cho ai?', b: 'Bo mạch quyết định chạy/ dừng máy nén.', tag: 'Tủ thật' },
    { f: 'Ngăn đá lạnh, ngăn mát không lạnh?', b: 'Nghi quạt dàn lạnh kẹt hoặc tuyết cản gió.', tag: 'Chẩn đoán' },
    { f: 'Máy nén chạy mà không lạnh?', b: 'Có thể hỏng máy nén.', tag: 'Chẩn đoán' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Bộ phận nào làm tăng áp suất gas?', ['Máy nén', 'Dàn nóng', 'Ống mao dẫn', 'Dàn lạnh'], 0, 'Máy nén hút hơi áp thấp và nén lên áp cao. Ống mao làm ngược lại.'),
    Q('Gas chuyển từ hơi sang lỏng ở đâu?', ['Dàn nóng', 'Dàn lạnh', 'Máy nén', 'Ống mao'], 0, 'Dàn nóng nhả nhiệt, gas ngưng thành lỏng.'),
    Q('Vì sao gas lạnh đi mạnh sau ống mao dẫn?', ['Áp suất giảm nên nhiệt độ sôi giảm', 'Ống đồng dẫn nhiệt tốt', 'Quạt thổi gió', 'Gas bị nén'], 0, 'Áp giảm kéo nhiệt sôi xuống rất thấp.'),
    Q('Dàn nóng bám bụi, tủ sát tường thường gây?', ['Thải nhiệt kém, chạy liên tục, tốn điện', 'Tủ lạnh sâu hơn', 'Rò gas', 'Giảm điện'], 0, 'Nhiệt không thoát được.'),
    Q('Ngăn đá lạnh, ngăn mát không lạnh, nghe lạch cạch. Nghi trước hết?', ['Quạt dàn lạnh kẹt hoặc tuyết cản gió', 'Máy nén cháy', 'Rơle khởi động', 'Hết gas'], 0, 'Ngăn mát lấy lạnh nhờ gió.'),
    Q('Dàn lạnh làm gì?', ['Gas sôi, hút nhiệt', 'Nhả nhiệt', 'Nén gas', 'Giảm áp'], 0, 'Hút nhiệt từ trong tủ.'),
    Q('Máy nén có trực tiếp làm lạnh?', ['Không, tạo chênh lệch áp suất', 'Có', 'Chỉ khi hỏng', 'Chỉ ngăn đá'], 0, 'Để gas mang được nhiệt.'),
    Q('Áp suất thấp thì gas sôi ở?', ['Nhiệt độ thấp', 'Nhiệt độ cao', 'Không sôi', 'Bằng phòng'], 0, 'Điều kiện của dàn lạnh.'),
    Q('Gas ra khỏi máy nén ở trạng thái?', ['Hơi nóng, áp cao', 'Lỏng lạnh', 'Hơi lạnh', 'Lỏng ấm'], 0, '60–90 °C.'),
    Q('Bộ sấy lọc để?', ['Lọc cặn, hút ẩm', 'Nén gas', 'Làm nóng', 'Đo nhiệt'], 0, 'Tránh tắc ống mao.'),
    Q('Điện trở xả đá làm?', ['Làm tan tuyết', 'Làm lạnh', 'Nén gas', 'Quạt gió'], 0, 'Định kỳ nóng lên.'),
    Q('Gas R600a có đặc điểm?', ['Dễ cháy', 'Không cháy', 'Độc', 'Không mùi nên an toàn'], 0, 'Cần thợ đào tạo.')
  ];
  const sort = {
    title: 'Bộ phận nào?',
    buckets: [{ id: 'comp', name: 'Máy nén' }, { id: 'hot', name: 'Dàn nóng' }, { id: 'cold', name: 'Ống mao & Dàn lạnh' }],
    items: [
      { t: 'Hút hơi áp thấp, nén lên áp cao', b: 'comp' }, { t: 'Đẩy ra hơi nóng 60–90 °C', b: 'comp' }, { t: 'Hỏng: chạy mà không lạnh', b: 'comp' },
      { t: 'Nhả nhiệt ra phòng', b: 'hot' }, { t: 'Hơi ngưng thành lỏng ấm', b: 'hot' }, { t: 'Bám bụi → tốn điện', b: 'hot' },
      { t: 'Giảm áp đột ngột', b: 'cold' }, { t: 'Gas sôi, hút nhiệt', b: 'cold' }, { t: 'Lỏng lạnh → hơi lạnh', b: 'cold' }, { t: 'Đóng tuyết', b: 'cold' }
    ]
  };
  const order = [
    { title: 'Vòng tuần hoàn của gas', intro: 'Theo chiều đi của gas.', steps: ['Máy nén nén hơi lạnh thành hơi nóng, áp cao', 'Dàn nóng nhả nhiệt, ngưng thành lỏng ấm', 'Ống mao dẫn giảm áp, gas lạnh sâu', 'Dàn lạnh: gas sôi, hút nhiệt trong tủ', 'Hơi lạnh áp thấp quay về máy nén'] },
    { title: 'Biến đổi trạng thái gas', intro: 'Sắp xếp trạng thái theo chu trình.', steps: ['Hơi lạnh, áp thấp (vào máy nén)', 'Hơi nóng, áp cao', 'Lỏng ấm, áp cao', 'Lỏng lạnh, áp thấp', 'Hơi lạnh, áp thấp (ra dàn lạnh)'] },
    { title: 'Ngăn mát không lạnh', intro: 'Quy trình nghi ngờ.', steps: ['Xác nhận ngăn đá vẫn lạnh', 'Nghe tiếng ù/ lạch cạch', 'Kiểm tra quạt dàn lạnh có quay', 'Kiểm tra tuyết cản gió', 'Xả tuyết/ thay quạt', 'Chạy thử'] }
  ];
  DL.register({
    cat: 'tu-lanh', id: 0, ready: true, title: 'Tổng quát', sub: 'Tủ lạnh làm lạnh như thế nào? Bức tranh toàn cảnh', minutes: 15,
    lead: 'Gas lạnh chạy một vòng kín qua bốn bộ phận, mỗi vòng chuyển một ít nhiệt từ trong tủ ra ngoài phòng. Hiểu bức tranh này trước khi học chi tiết từng bộ phận.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
