/* BÀI 11 — CẢM BIẾN ÂM (SÒ LẠNH) VÀ CẦU CHÌ NHIỆT (biên soạn từ docs/Bai_11.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const TSET = -5, TFUSE = 73;

  function chainSVG(s) {
    const lamp = (x, lab, on, col) => `<g><circle cx="${x}" cy="60" r="18" fill="${on ? col : 'var(--line)'}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="${x}" y="102" text-anchor="middle">${lab}</text></g>`;
    const link = (x1, x2, on) => `<path d="M${x1} 60H${x2}" stroke="${on ? 'var(--warm)' : 'var(--muted)'}" stroke-width="4" opacity="${on ? 1 : .4}"/>${on ? `<path class="flow" d="M${x1} 60H${x2}" stroke="#fff" stroke-width="2"/>` : ''}`;
    const p = s.powered, a = p && s.timerDef, b = a && s.soClosed, c = b && !s.fuseBlown;
    return `<svg viewBox="0 0 640 125" role="img" aria-label="Chuỗi mạch xả tuyết">
      ${link(40, 112, p)}${link(148, 232, a)}${link(268, 352, b)}${link(388, 472, c)}${link(508, 580, c)}
      ${lamp(130, 'Thermostat', p, 'var(--ok)')}${lamp(250, 'Rơle TG (3→2)', a, 'var(--ok)')}${lamp(370, 'Sò lạnh', b, 'var(--cold)')}${lamp(490, 'Điện trở sấy', c, 'var(--hot)')}
      <g><rect x="580" y="42" width="40" height="36" rx="8" fill="${s.fuseBlown ? 'var(--bad-tint)' : 'var(--surface2)'}" stroke="${s.fuseBlown ? 'var(--bad)' : 'var(--ink)'}" stroke-width="2.5"/><text class="fl" x="600" y="64" text-anchor="middle" style="fill:var(--ink)">${s.fuseBlown ? '✗' : 'CC'}</text><text class="fl" x="600" y="102" text-anchor="middle">Cầu chì nhiệt</text></g>
      <text class="fl" x="20" y="30">nguồn</text></svg>`;
  }
  function tempSVG(pts, soT) {
    const W = 560, H = 150, lo = -30, hi = 90, X = i => 40 + i / 199 * (W - 60), Y = t => 10 + (hi - t) / (hi - lo) * (H - 30);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p).toFixed(1)}`).join('');
    return `<svg viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Đồ thị nhiệt độ bề mặt dàn trong lúc xả tuyết"><path d="M40 10V${H - 20}H${W - 10}" stroke="var(--ink)" fill="none" stroke-width="2"/>
      ${[-20, 0, 40, 80].map(t => `<path d="M36 ${Y(t)}H${W - 10}" stroke="var(--line)"/><text class="fl" x="34" y="${Y(t) + 4}" text-anchor="end">${t}°</text>`).join('')}
      <path d="M40 ${Y(soT)}H${W - 10}" stroke="var(--cold)" stroke-dasharray="6 4"/><text class="fl" x="${W - 12}" y="${Y(soT) - 4}" text-anchor="end" style="fill:var(--cold)">sò lạnh ngắt ${soT}°C</text>
      <path d="M40 ${Y(TFUSE)}H${W - 10}" stroke="var(--hot)" stroke-dasharray="6 4"/><text class="fl" x="${W - 12}" y="${Y(TFUSE) - 4}" text-anchor="end" style="fill:var(--hot)">cầu chì đứt +${TFUSE}°C</text>
      <path d="${d}" fill="none" stroke="var(--ink)" stroke-width="3"/></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-so" data-toc="1 · Sò lạnh: công dụng">
  <div class="sec-n">Phần 1</div><h2>Cảm biến âm (sò lạnh)</h2>
  <p>Rơle thời gian xả tuyết theo <b>giờ</b> (cố định), nhưng lượng tuyết mỗi lần mỗi khác. Nếu dàn đã sạch mà sấy vẫn chạy thì <b>lãng phí điện</b> (nhiệt tỏa ra và hút vào triệt tiêu nhau); nếu sấy dừng sớm mà tuyết chưa hết thì <b>gió vẫn không qua được dàn</b>, tủ kém lạnh.</p>
  <p><b>Sò lạnh</b> giải quyết: nối tiếp trong mạch sấy, <b>đóng – ngắt theo nhiệt độ bề mặt dàn</b> (nên thời gian xả phụ thuộc vào lượng tuyết).</p>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Công dụng</h4><p style="margin:6px 0 0">Lắp ở tủ lạnh gián tiếp, <b>đóng ngắt nguồn cho sấy</b> dựa vào <b>nhiệt độ bề mặt dàn lạnh</b>. Gắn ở vị trí <b>cao nhất</b> trên dàn.</p></div>
    <div class="panel warm" style="margin:0"><h4>Nguyên lý</h4><p style="margin:6px 0 0">Gồm <b>thanh lưỡng kim + cặp tiếp điểm</b>. Nhiệt độ <b>≤ giá trị ghi trên thân</b> (VD −5 °C): lưỡng kim thẳng, tiếp điểm <b>đóng</b> → sấy làm việc. Nhiệt độ <b>cao hơn</b>: lưỡng kim cong, tiếp điểm <b>mở</b> → sấy ngắt.</p></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Phối hợp 2 thiết bị</b><p><b>Rơle thời gian</b> quyết định <i>khi nào bắt đầu xả</i>; <b>sò lạnh</b> quyết định <i>khi nào ngừng sấy</i>. Mỗi khi tuyết tan hết, bề mặt dàn ấm lên, sò lạnh ngắt sấy → tiết kiệm điện và không làm nóng tủ.</p></div></div>
  <p>Giá trị ghi trên sò lạnh thường từ khoảng <b>−8 đến −20 °C</b> (phổ biến nhất ≈ −5 °C trong ví dụ bài giảng). Có <b>vỏ nhựa bọc kín</b> (hút chân không hoặc có chất cách ẩm), bên trong không tháo được.</p>
</section>

<section class="sec" id="s-fuse" data-toc="2 · Cầu chì nhiệt">
  <div class="sec-n">Phần 2</div><h2>Cầu chì nhiệt (sò dương)</h2>
  <p>Nối tiếp với điện trở sấy. Nếu <b>sò lạnh bị dính</b> không ngắt, sấy sẽ nóng <b>liên tục</b>, nhiệt rất cao có thể <b>làm hỏng thực phẩm, cháy nhựa, gây hỏa hoạn</b>. Cầu chì nhiệt <b>đứt để cắt nguồn</b> cho sấy.</p>
  <dl class="kv"><dt>Cấu tạo</dt><dd>Dây kim loại nhiệt độ nóng chảy thấp, bọc kín trong vỏ (thủy tinh/gốm). Giống một <b>dây dẫn</b> bình thường.</dd><dt>Nguyên lý</dt><dd>Nhiệt độ bề mặt dàn vượt mức ghi trên thân → <b>đứt</b>. Chỉ bảo vệ <b>một lần</b>, đứt rồi phải thay.</dd><dt>Thông số</dt><dd>Tủ lạnh dùng cầu chì <b>+62 … +80 °C</b>, phổ biến <b>+73 °C và +76 °C</b> (cầu chì nồi cơm 125–160 °C — không dùng thay được).</dd><dt>Vị trí</dt><dd>Giữa dàn lạnh, gần điện trở sấy.</dd></dl>
  <div class="callout"><span class="ic">🧩</span><div><b class="t">Loại 2 trong 1</b><p>Trên thị trường có loại <b>sò lạnh + cầu chì nhiệt</b> trong cùng một vỏ nhựa trắng, <b>3 chân</b>: chân <b>chung</b>, chân <b>sò âm</b> và chân <b>cầu chì (dương)</b>. Chân chung nối vào chân <b>1</b> của rơle thời gian; chân cầu chì nối với <b>sấy</b>; chân sò âm nối với <b>chân 2</b> rơle thời gian (mạch loại 1) hoặc nối theo sơ đồ loại 2.</p></div></div>
</section>

<section class="sec" id="s-sim" data-toc="3 · Mô phỏng xả tuyết">
  <div class="sec-n">Phần 3</div><h2>Mô phỏng một lần xả tuyết</h2>
  <p>Chọn lượng tuyết và tình trạng sò lạnh, cầu chì rồi bấm <b>Bắt đầu xả</b>. Hãy quan sát điện trở sấy bật – tắt và nhiệt độ bề mặt dàn.</p>
  <div class="stage"><div id="chain"></div><div id="tChart"></div>
    <div class="controls"><label>Lượng tuyết <input id="ice" type="range" min="20" max="100" value="60" style="width:130px"> <b id="iceV"></b></label>
      <label>Sò lạnh <select id="sSo" class="btn sm" style="min-height:36px"><option value="ok">Tốt</option><option value="open">Hở mạch (không đóng)</option><option value="stuck">Dính (không ngắt)</option></select></label>
      <label>Cầu chì <select id="sFu" class="btn sm" style="min-height:36px"><option value="ok">Tốt</option><option value="blown">Đã đứt</option></select></label>
      <button class="btn pri sm" id="sGo">▶ Bắt đầu xả</button></div>
    <div class="verdict" id="sV" style="margin:0 14px 12px">Chọn điều kiện rồi bấm “Bắt đầu xả”.</div></div>
</section>

<section class="sec" id="s-fault" data-toc="4 · Hư hỏng, kiểm tra">
  <div class="sec-n">Phần 4</div><h2>Hư hỏng, kiểm tra</h2>
  <div id="fTabs"></div><article class="panel hotc" id="fPanel" aria-live="polite"></article>
  <h3 style="margin-top:22px">Kiểm tra sò lạnh</h3>
  ${U.steps([['Đo hai đầu sò lạnh (x1 Ω) khi <b>còn nóng</b> (nhiệt độ phòng)', 'Kim <b>không lên</b> là bình thường (tiếp điểm đang mở). Kim lên ở nhiệt độ phòng → sò <b>hỏng (dính)</b>.'], ['Đặt sò vào nơi lạnh ≤ giá trị ghi trên thân (ngăn đông tủ đang chạy)', 'Kim <b>lên</b> (thông mạch) → sò <b>tốt</b>. Mất thời gian nên có thể kiểm tra trực tiếp trên mạch.'], ['Kiểm tra trực tiếp trên tủ: nối tắt hai dây sò lạnh', 'Xoay trục cam rơle thời gian sang <b>chế độ xả</b>. Nếu <b>sấy làm việc</b> và <b>đồng hồ ngừng quay</b> → sò lạnh hỏng (do hở mạch). Thay sò là xong.'], ['Kiểm tra mạch xả tuyết', 'Đo 220 V ở các chân: nếu có điện ở chân 1–3 → động cơ rơle, sấy, cầu chì tốt; kiểm tra tiếp theo ở sò lạnh.']])}
  <h3 style="margin-top:22px">Kiểm tra cầu chì nhiệt</h3>
  <p>Cầu chì như một sợi dây: đo <b>x1 Ω</b> hai đầu, kim <b>lên (thông)</b> là tốt; <b>không lên</b> là đã <b>đứt</b>. Thay phải đúng thông số ghi trên thân (VD +73 °C, +76 °C) và lắp đúng vị trí (gần giữa dàn).</p>
  <div class="callout danger"><span class="ic">🔥</span><div><b class="t">Tìm nguyên nhân cầu chì đứt</b><p>Cầu chì chỉ đứt khi sấy chạy quá lâu — thường do <b>sò lạnh bị dính</b>. Phải <b>thay cả sò lạnh</b> (nếu hai thiết bị tách rời) khi thay cầu chì, nếu không cầu chì mới sẽ lại đứt.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Sò lạnh đóng ngắt sấy theo nhiệt độ bề mặt dàn.</b><span>Rơle thời gian: khi nào bắt đầu xả; sò lạnh: khi nào ngừng.</span></div></li>
    <li class="done"><div><b>Sò lạnh: ≤ giá trị ghi thì ĐÓNG, cao hơn thì MỞ.</b></div></li>
    <li class="done"><div><b>Cầu chì nhiệt bảo vệ khi sò lạnh dính: đứt ở +62…+80 °C, chỉ một lần.</b></div></li>
    <li class="done"><div><b>Sò lạnh hở → tuyết không tan, kém lạnh. Cầu chì đứt → mất nguồn rơle/sấy.</b></div></li>
    <li class="done"><div><b>Kiểm tra: sò lạnh nóng (∞), lạnh (thông); cầu chì thông mạch.</b></div></li>
    <li class="done"><div><b>Loại 2 trong 1 có 3 chân: chung – sò âm – cầu chì.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/11/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const FAULTS = {
    so: ['Sò lạnh hỏng (hở / không đóng)', 'Nhiệt độ thấp mà <b>không đóng</b> → sấy không có điện → <b>tuyết không tan</b>, bám kín dàn → tủ <b>kém lạnh dần rồi mất lạnh</b>. Tháo tấm xốp trắng phía trước dàn sẽ thấy tuyết dày.'],
    soStuck: ['Sò lạnh dính (không ngắt)', 'Nhiệt độ cao vẫn <b>đóng</b> → sấy làm việc liên tục, nóng rất cao, có thể gây hỏng thực phẩm, cháy → <b>cầu chì nhiệt đứt</b> để bảo vệ.'],
    fuse: ['Cầu chì nhiệt đứt', 'Với rơle thời gian <b>loại 1</b> chân 1 lấy nguồn qua sấy + cầu chì → cầu chì đứt thì <b>động cơ rơle mất điện</b>, bánh cam đứng yên. Nếu đứng ở <b>chế độ dài</b>: tuyết bám kín, kém lạnh. Nếu đứng ở <b>chế độ ngắn</b>: <b>chỉ đèn sáng, tủ không chạy</b> (giống hỏng sò lạnh).']
  };

  function mount(root) {
    U.tabset($('#fTabs', root), Object.entries(FAULTS).map(([id, f], i) => ({ id, n: i + 1, name: f[0] })), id => { $('#fPanel', root).innerHTML = `<h3>${FAULTS[id][0]}</h3><p style="margin:0">${FAULTS[id][1]}</p>`; });
    const ice = $('#ice', root); let tm, S, T, m, pts;
    const iv = () => $('#iceV', root).textContent = ice.value + '%';
    ice.oninput = iv; iv();
    const draw = () => { $('#chain', root).innerHTML = chainSVG(S); $('#tChart', root).innerHTML = tempSVG(pts, TSET); };
    function init() {
      clearInterval(tm); const so = $('#sSo', root).value, fu = $('#sFu', root).value;
      T = -25; m = +ice.value / 100; pts = Array(200).fill(T);
      S = { powered: true, timerDef: true, soClosed: false, fuseBlown: fu === 'blown', so, t: 0, done: false };
      draw();
    }
    function step() {
      if (!document.body.contains($('#chain', root))) { clearInterval(tm); return; }
      S.t++;
      S.soClosed = S.so === 'open' ? false : S.so === 'stuck' ? true : T <= TSET;
      const heat = S.soClosed && !S.fuseBlown;
      if (heat) { if (m > 0) { m = Math.max(0, m - .008); T = Math.min(-6, T + .35); } else T += .7; }
      else T += 0.0;
      if (S.so === 'stuck' && T >= TFUSE && !S.fuseBlown) { S.fuseBlown = true; }
      pts.push(T); pts.shift(); draw();
      const v = $('#sV', root);
      if (S.t > 400 || (!heat && !(S.so === 'ok' && T <= TSET)) && S.t > 30) { clearInterval(tm); end(v); }
      else v.textContent = `Đang xả tuyết… nhiệt độ bề mặt dàn ≈ ${T.toFixed(0)} °C · tuyết còn ${Math.round(m * 100)}%`;
    }
    function end(v) {
      const so = S.so, fb = S.fuseBlown, ok = so === 'ok' && !fb && m === 0;
      v.className = 'verdict ' + (ok ? 'ok' : 'bad');
      if (ok) v.innerHTML = '✓ Tuyết tan hết → bề mặt dàn ấm lên quá ngưỡng của sò lạnh → <b>sò ngắt sấy</b>. Xả tuyết đủ thời gian, không phí điện, quay lại chạy lạnh.';
      else if (so === 'open') v.innerHTML = `✗ <b>Sò lạnh không đóng</b>: sấy không có điện, tuyết còn ${Math.round(m * 100)}% → <b>tuyết bám kín dàn</b>, tủ kém lạnh dần rồi mất lạnh.`;
      else if (fb && so === 'ok') v.innerHTML = `✗ <b>Cầu chì nhiệt đã đứt</b>: sấy mất điện (và động cơ rơle thời gian loại 1 cũng mất nguồn) → tuyết còn ${Math.round(m * 100)}%, tủ <b>kém lạnh</b> hoặc <b>chỉ đèn sáng</b>.`;
      else v.innerHTML = '✗ <b>Sò lạnh dính</b>: sấy không ngắt, nhiệt độ vọt lên đến <b>' + TFUSE + ' °C</b> → <b>cầu chì nhiệt đứt</b> để tránh cháy. Từ đó tủ mất sấy (và có thể mất nguồn rơle thời gian) → kém lạnh / chỉ đèn sáng. Phải thay cả sò lạnh và cầu chì.';
    }
    $('#sGo', root).onclick = () => { init(); const v = $('#sV', root); v.className = 'verdict'; v.textContent = 'Đang xả tuyết…'; tm = setInterval(step, 40); };
    ['#sSo', '#sFu', '#ice'].forEach(s => $(s, root).onchange = init);
    init();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Sò lạnh còn gọi là gì?', b: '<b>Cảm biến âm</b>.', tag: 'Sò lạnh' },
    { f: 'Sò lạnh dùng ở tủ nào?', b: 'Tủ lạnh <b>gián tiếp</b> (cùng rơle thời gian).', tag: 'Sò lạnh' },
    { f: 'Công dụng của sò lạnh?', b: '<b>Đóng ngắt nguồn cho sấy</b> dựa vào nhiệt độ bề mặt dàn lạnh.', tag: 'Sò lạnh' },
    { f: 'Vì sao cần sò lạnh khi đã có rơle thời gian?', b: 'Rơle thời gian xả theo giờ cố định; lượng tuyết mỗi lần khác nhau. Sò lạnh giúp xả <b>đủ tuyết, không phí điện</b>.', tag: 'Sò lạnh' },
    { f: 'Sò lạnh gồm những gì?', b: '<b>Thanh lưỡng kim và cặp tiếp điểm</b>, bọc vỏ nhựa kín.', tag: 'Sò lạnh' },
    { f: 'Nhiệt độ ≤ giá trị ghi trên thân thì sò lạnh?', b: '<b>Đóng</b> tiếp điểm → sấy có điện.', tag: 'Nguyên lý' },
    { f: 'Nhiệt độ cao hơn giá trị ghi thì sò lạnh?', b: '<b>Mở</b> tiếp điểm → sấy ngắt.', tag: 'Nguyên lý' },
    { f: 'Sò lạnh gắn ở đâu trên dàn?', b: 'Vị trí <b>cao nhất</b> của dàn lạnh.', tag: 'Nguyên lý' },
    { f: 'Thời gian xả tuyết phụ thuộc vào gì?', b: 'Vào <b>lượng tuyết</b> bám trên dàn (nhờ sò lạnh).', tag: 'Nguyên lý' },
    { f: 'Giá trị nhiệt độ thường ghi trên sò lạnh?', b: 'Khoảng −8 đến −20 °C (ví dụ −5 °C).', tag: 'Nguyên lý' },
    { f: 'Sò lạnh hỏng (không đóng) → tủ?', b: 'Sấy không có điện → <b>tuyết bám kín</b>, kém lạnh rồi mất lạnh.', tag: 'Hư hỏng' },
    { f: 'Sò lạnh dính (không ngắt) → ?', b: 'Sấy chạy liên tục, nhiệt cao → <b>cầu chì nhiệt đứt</b> bảo vệ.', tag: 'Hư hỏng' },
    { f: 'Kiểm tra sò lạnh khi còn nóng: kim?', b: '<b>Không lên</b> (bình thường). Lên → sò dính/hỏng.', tag: 'Kiểm tra' },
    { f: 'Sò lạnh đặt vào nơi lạnh (≤ ngưỡng): kim?', b: '<b>Lên</b> (thông mạch) → sò tốt.', tag: 'Kiểm tra' },
    { f: 'Nối tắt hai dây sò lạnh trên tủ để làm gì?', b: 'Xem sấy có làm việc, đồng hồ có ngừng quay không → <b>sò lạnh hỏng</b> nếu có.', tag: 'Kiểm tra' },
    { f: 'Thay sò lạnh cần chú ý?', b: 'Đúng <b>vị trí</b> (cao nhất, ốp sát dàn) và đúng giá trị nhiệt độ ghi trên thân.', tag: 'Kiểm tra' },
    { f: 'Cầu chì nhiệt còn gọi là?', b: '<b>Sò dương</b> (cảm biến dương).', tag: 'Cầu chì' },
    { f: 'Công dụng của cầu chì nhiệt?', b: 'Cắt nguồn sấy khi nhiệt độ bề mặt dàn <b>quá cao</b> — bảo vệ thực phẩm và tủ.', tag: 'Cầu chì' },
    { f: 'Cầu chì nhiệt bảo vệ được mấy lần?', b: '<b>Một lần</b>: đứt thì phải thay.', tag: 'Cầu chì' },
    { f: 'Giá trị cầu chì nhiệt trong tủ lạnh?', b: 'Khoảng <b>+62 … +80 °C</b> (phổ biến +73, +76 °C).', tag: 'Cầu chì' },
    { f: 'Cầu chì nồi cơm dùng thay được không?', b: '<b>Không</b>: loại đó 125–160 °C.', tag: 'Cầu chì' },
    { f: 'Cầu chì lắp ở đâu?', b: 'Giữa dàn lạnh, nối tiếp với điện trở sấy.', tag: 'Cầu chì' },
    { f: 'Cách đo cầu chì nhiệt?', b: 'x1 Ω hai đầu: kim lên là tốt, không lên là đã đứt.', tag: 'Cầu chì' },
    { f: 'Cầu chì đứt với rơle TG loại 1: hậu quả?', b: 'Động cơ rơle mất điện, bánh cam đứng: kẹt dài → kém lạnh; kẹt ngắn → chỉ đèn sáng.', tag: 'Cầu chì' },
    { f: 'Loại 2 trong 1 có mấy chân?', b: '<b>3 chân</b>: chung, sò âm, cầu chì (dương).', tag: 'Loại 2 trong 1' },
    { f: 'Chân chung của loại 2 trong 1 nối với?', b: 'Chân <b>1</b> của rơle thời gian.', tag: 'Loại 2 trong 1' },
    { f: 'Chân cầu chì của loại 2 trong 1 nối với?', b: 'Điện trở sấy.', tag: 'Loại 2 trong 1' },
    { f: 'Thay cầu chì cần làm gì thêm?', b: 'Tìm nguyên nhân (thường do <b>sò lạnh dính</b>) và thay cả sò lạnh.', tag: 'Cầu chì' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Sò lạnh còn gọi là?', ['Cảm biến âm', 'Cảm biến dương', 'Rơle bảo vệ', 'Thermostat'], 0, 'Âm: đóng khi lạnh.'),
    Q('Sò lạnh điều khiển nguồn cho?', ['Điện trở sấy', 'Block', 'Quạt', 'Đèn'], 0, 'Cùng rơle thời gian.'),
    Q('Sò lạnh dựa vào gì để đóng ngắt?', ['Nhiệt độ bề mặt dàn', 'Dòng điện', 'Điện áp', 'Thời gian'], 0, 'Cảm nhận nhiệt độ dàn.'),
    Q('Sò lạnh đặt ở?', ['Vị trí cao nhất của dàn', 'Cửa tủ', 'Block', 'Phin lọc'], 0, 'Theo bài giảng.'),
    Q('Nhiệt độ ≤ giá trị ghi trên thân, sò lạnh?', ['Đóng', 'Mở', 'Cháy', 'Nổ'], 0, 'Lưỡng kim thẳng.'),
    Q('Nhiệt độ cao hơn giá trị ghi, sò lạnh?', ['Mở', 'Đóng', 'Dính', 'Đứt'], 0, 'Cong ra, ngắt sấy.'),
    Q('Thời gian xả tuyết phụ thuộc?', ['Lượng tuyết', 'Điện áp', 'Nhiệt độ phòng', 'Dung tích'], 0, 'Nhờ sò lạnh.'),
    Q('Sò lạnh hỏng (hở) → ?', ['Tuyết không tan, kém lạnh', 'Tủ lạnh sâu', 'Cháy tủ', 'Block quá tải'], 0, 'Sấy không có điện.'),
    Q('Sò lạnh dính → ?', ['Sấy chạy liên tục, cầu chì nhiệt đứt', 'Tuyết dày', 'Tủ lạnh sâu', 'Không đổi'], 0, 'Nhiệt tăng cao.'),
    Q('Kiểm tra sò lạnh ở nhiệt độ phòng, kim không lên?', ['Bình thường', 'Hỏng', 'Chập', 'Dính'], 0, 'Tiếp điểm đang mở.'),
    Q('Sò lạnh đặt vào nơi lạnh ≤ ngưỡng, kim lên?', ['Sò tốt', 'Sò hỏng', 'Chập', 'Không kết luận'], 0, 'Đóng khi lạnh.'),
    Q('Nối tắt sò lạnh, sấy làm việc và đồng hồ ngừng quay thì?', ['Sò lạnh hỏng', 'Sò tốt', 'Cầu chì hỏng', 'Rơle TG tốt'], 0, 'Sò hở nên không đóng.'),
    Q('Cầu chì nhiệt còn gọi?', ['Sò dương', 'Sò âm', 'Rơle', 'Tụ'], 0, 'Ngược sò âm.'),
    Q('Cầu chì nhiệt bảo vệ?', ['Một lần', 'Nhiều lần', 'Vô hạn', 'Không'], 0, 'Đứt rồi thay.'),
    Q('Cầu chì nhiệt tủ lạnh thường?', ['+73 / +76 °C', '+200 °C', '−5 °C', '0 °C'], 0, 'Dải +62…+80.'),
    Q('Cầu chì nồi cơm dùng thay được không?', ['Không, 125–160 °C', 'Được', 'Tùy', 'Chỉ dùng tạm'], 0, 'Sai ngưỡng bảo vệ.'),
    Q('Cầu chì đứt, đo x1 Ω hai đầu kim?', ['Không lên', 'Lên', 'Nhảy', 'Về 0'], 0, 'Hở mạch.'),
    Q('Cầu chì lắp thế nào với sấy?', ['Nối tiếp', 'Song song', 'Không nối', 'Qua tụ'], 0, 'Cắt sấy khi đứt.'),
    Q('Loại 2 trong 1 có mấy chân?', ['3', '2', '4', '5'], 0, 'Chung, sò âm, cầu chì.'),
    Q('Cầu chì đứt với rơle TG loại 1: động cơ rơle?', ['Mất nguồn', 'Chạy nhanh', 'Cháy', 'Không đổi'], 0, 'Chân 1 lấy nguồn qua sấy + cầu chì.'),
    Q('Bánh cam đứng ở chế độ dài do cầu chì đứt?', ['Tuyết bám kín, kém lạnh', 'Chỉ đèn sáng', 'Tủ lạnh sâu', 'Cháy sấy'], 0, 'Không xả tuyết.'),
    Q('Bánh cam đứng ở chế độ ngắn do cầu chì đứt?', ['Chỉ đèn sáng', 'Tuyết dày', 'Tủ lạnh sâu', 'Không đổi'], 0, 'Block + quạt mất nguồn.'),
    Q('Khi thay cầu chì cần thêm?', ['Tìm nguyên nhân, thay sò lạnh nếu dính', 'Không cần', 'Tăng điện áp', 'Bỏ cầu chì'], 0, 'Tránh đứt lại.'),
    Q('Rơle thời gian và sò lạnh phối hợp thế nào?', ['TG: lúc bắt đầu xả; sò: lúc ngừng', 'Ngược lại', 'Cùng bắt đầu', 'Không liên quan'], 0, 'Xả đủ tuyết.')
  ];
  const sort = {
    title: 'Chi tiết thuộc thiết bị nào?',
    buckets: [{ id: 'so', name: 'Sò lạnh (cảm biến âm)' }, { id: 'fuse', name: 'Cầu chì nhiệt (sò dương)' }, { id: 'both', name: 'Cả hai' }],
    items: [
      { t: 'Đóng khi nhiệt độ ≤ giá trị ghi (VD −5 °C)', b: 'so' }, { t: 'Có thanh lưỡng kim, đóng ngắt nhiều lần', b: 'so' }, { t: 'Quyết định lúc ngừng sấy', b: 'so' }, { t: 'Hỏng (hở) → tuyết bám kín dàn', b: 'so' },
      { t: 'Giống một dây dẫn, đứt vĩnh viễn', b: 'fuse' }, { t: 'Chỉ bảo vệ một lần', b: 'fuse' }, { t: 'Đứt khi nhiệt ~ +73 °C', b: 'fuse' }, { t: 'Bảo vệ khi sò lạnh dính', b: 'fuse' },
      { t: 'Lắp trong mạch xả tuyết tủ gián tiếp', b: 'both' }, { t: 'Đo bằng đồng hồ x1 Ω', b: 'both' }, { t: 'Có loại gộp 2 trong 1, 3 chân', b: 'both' }, { t: 'Hỏng → tủ kém lạnh hoặc chỉ đèn sáng', b: 'both' }
    ]
  };
  const order = [
    { title: 'Một lần xả tuyết', intro: 'Sắp xếp diễn biến.', steps: ['Rơle thời gian chuyển sang chế độ xả (3 nối 2)', 'Nhiệt độ dàn thấp, sò lạnh đóng', 'Điện trở sấy có điện, làm tan tuyết', 'Tuyết hết, bề mặt dàn ấm lên', 'Nhiệt độ vượt ngưỡng, sò lạnh mở, ngắt sấy', 'Hết thời gian, rơle quay về chế độ chạy lạnh'] },
    { title: 'Sò lạnh dính', intro: 'Sắp xếp hậu quả.', steps: ['Sò lạnh không ngắt khi dàn đã ấm', 'Điện trở sấy làm việc liên tục', 'Nhiệt độ bề mặt dàn tăng rất cao', 'Cầu chì nhiệt đứt tại +73 °C', 'Sấy mất điện, rơle loại 1 mất nguồn', 'Phải thay sò lạnh và cầu chì nhiệt'] },
    { title: 'Kiểm tra sò lạnh', intro: 'Sắp xếp các bước.', steps: ['Đồng hồ x1 Ω, chỉnh kim về 0', 'Đo sò ở nhiệt độ phòng: kim không lên', 'Đặt sò vào nơi lạnh ≤ giá trị ghi trên thân', 'Đo lại: kim lên thì sò tốt', 'Hoặc nối tắt hai dây sò trên tủ ở chế độ xả', 'Sấy chạy, đồng hồ dừng: sò hỏng, thay mới'] }
  ];
  DL.register({
    id: 11, ready: true, title: 'Sò lạnh và cầu chì nhiệt', sub: 'Xả tuyết thông minh và bảo vệ an toàn', minutes: 25,
    lead: 'Sò lạnh quyết định khi nào ngừng sấy, cầu chì nhiệt là “chốt chặn” cuối cùng. Bài này mô phỏng một lần xả tuyết và chỉ ra điều gì xảy ra khi từng thiết bị hỏng.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
