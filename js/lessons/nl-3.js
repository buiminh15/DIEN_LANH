/* NGUYÊN LÝ LÀM LẠNH — BÀI 3: CÁC THIẾT BỊ PHỤ (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_3.txt)
   Mỗi thiết bị phụ có hình mặt cắt động; vị trí hiện trên vòng tuần hoàn; van đảo chiều bật tắt được. */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sv = (body, label) => `<svg viewBox="0 0 240 150" role="img" aria-label="${label}">${body}</svg>`;
  const pipe = (d, c) => `<path d="${d}" fill="none" stroke="var(--${c})" stroke-width="6" stroke-linecap="round"/>`;
  const t = (x, y, s, a = 'middle') => `<text class="nl3-s" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;

  const revSvg = () => sv(`<rect x="48" y="40" width="144" height="58" rx="12" class="nl3-b"/>
    <rect class="nl3-slide" x="66" y="62" width="68" height="22" rx="8"/>
    ${pipe('M120 40V14', 'hot')}${[[80, '4'], [120, '3'], [160, '2']].map(p => pipe(`M${p[0]} 98V122`, p[1] === '3' ? 'cold-l' : 'brass')).join('')}
    <circle cx="120" cy="10" r="9" class="nl3-n"/><text class="nl3-nt" x="120" y="14" text-anchor="middle">1</text>
    ${[[80, '4'], [120, '3'], [160, '2']].map(p => `<circle cx="${p[0]}" cy="130" r="9" class="nl3-n"/><text class="nl3-nt" x="${p[0]}" y="134" text-anchor="middle">${p[1]}</text>`).join('')}
    ${t(134, 14, 'từ đầu đẩy', 'start')}${t(120, 148, 'cửa 4 và 2 nối hai dàn, cửa 3 về đường hút')}`, 'Van đảo chiều có 4 cửa, piston trượt đổi hướng');

  const PIC = {
    oil: sv(`<rect x="76" y="12" width="92" height="124" rx="16" class="nl3-b"/>
      ${pipe('M16 40H76', 'hot')}${pipe('M168 40H224', 'hot')}
      <path d="M92 56L142 66M154 78L100 88M92 98L142 108" class="nl3-edge"/>
      ${[0, 1, 2].map(i => `<circle class="nl3-drop" style="animation-delay:${i * .5}s" cx="${108 + i * 16}" cy="70" r="3.2"/>`).join('')}
      <rect x="78" y="114" width="88" height="20" fill="var(--warm)" opacity=".55"/><circle cx="122" cy="112" r="6" class="nl3-b"/>
      ${pipe('M122 136V144H12', 'brass')}${t(16, 32, 'hơi + dầu', 'start')}${t(224, 32, 'hơi sạch', 'end')}${t(12, 134, 'dầu về', 'start')}`, 'Bình tách dầu: tấm ngăn gom hạt dầu chảy xuống đáy, phao mở van cho dầu về máy nén'),
    dry: sv(`<rect x="56" y="46" width="128" height="58" rx="18" class="nl3-b"/>
      ${pipe('M12 75H56', 'warm')}${pipe('M184 75H228', 'warm')}
      <path d="M92 50V100M100 50V100" class="nl3-mesh"/>
      ${[[66, 62], [72, 82], [66, 94], [78, 70]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="var(--ink)"/>`).join('')}
      ${[0, 1, 2, 3, 4].map(r => [0, 1, 2].map(c => `<circle cx="${116 + r * 14}" cy="${58 + c * 16 + (r % 2) * 5}" r="5" class="nl3-bead"/>`).join('')).join('')}
      ${t(88, 124, 'lưới giữ cặn')}${t(150, 124, 'hạt hút ẩm')}${t(120, 32, 'lỏng đi qua, cặn và ẩm ở lại')}`, 'Phin sấy lọc: lưới giữ cặn bẩn, hạt hút ẩm giữ hơi nước'),
    acc: sv(`<rect x="84" y="14" width="76" height="122" rx="14" class="nl3-b"/>
      <rect x="86" y="98" width="72" height="36" rx="12" fill="var(--cold)" opacity=".6"/>
      ${[0, 1, 2].map(i => `<circle class="nl3-bub" style="animation-delay:${i * .6}s" cx="${106 + i * 18}" cy="108" r="3"/>`).join('')}
      ${pipe('M16 58H84', 'cold-l')}${pipe('M130 44V26H226', 'cold-l')}
      ${t(16, 48, 'lỏng + hơi', 'start')}${t(226, 18, 'hơi ra máy nén', 'end')}${t(122, 126, 'lỏng đọng', 'middle')}${t(122, 76, 'hơi bay lên', 'middle')}`, 'Bầu tách lỏng: lỏng rơi xuống đáy và tự sôi, chỉ hơi được hút ở phía trên'),
    rev: revSvg()
  };

  /* hạt chạy: tính mốc theo chiều dài thật của đường gấp khúc */
  const polyLen = pts => pts.reduce((a, p, i) => a + (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  const profile = (plateaus, n) => { // plateaus: [{a,b,s}] theo phân số 0..1
    const bps = [...new Set([0, 1, ...plateaus.flatMap(p => [p.a, p.b])])].sort((x, y) => x - y).map(x => +x.toFixed(3));
    return { bps, w: Array.from({ length: n }, (_, s) => bps.map(x => plateaus.some(p => p.s === s && x >= p.a - 1e-6 && x <= p.b + 1e-6) ? 1 : 0)) };
  };

  const POS = `<svg viewBox="0 0 680 300" role="img" aria-label="Vị trí thiết bị phụ trên vòng tuần hoàn">
    <g fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M520 150V60H380" stroke="var(--hot)"/><path d="M230 60H90V150" stroke="var(--warm)"/><path d="M90 150V240H230" stroke="var(--cold)"/><path d="M380 240H520V150" stroke="var(--cold-l)"/></g>
    <path id="nl3loop" d="M520 150V60H90V240H520V150" fill="none"/>
    <g class="nl3-main"><rect x="230" y="40" width="150" height="40" rx="8"/><text x="305" y="65" text-anchor="middle">Ngưng tụ</text>
      <rect x="230" y="220" width="150" height="40" rx="8"/><text x="305" y="245" text-anchor="middle">Bay hơi</text>
      <rect x="58" y="130" width="64" height="40" rx="8"/><text x="90" y="155" text-anchor="middle">Tiết lưu</text>
      <circle cx="520" cy="150" r="30"/><text x="520" y="155" text-anchor="middle">Máy nén</text></g>
    <g class="aux" data-k="oil"><rect x="506" y="78" width="28" height="40" rx="9"/><path d="M512 90L528 96M528 104L512 110" class="nl3-edge"/><text class="nl3-lb" x="544" y="102">bình tách dầu</text></g>
    <g class="aux" data-k="dry"><rect x="136" y="48" width="48" height="24" rx="12"/><path d="M150 52V68M156 52V68" class="nl3-mesh"/><text class="nl3-lb" x="160" y="38" text-anchor="middle">phin sấy lọc</text></g>
    <g class="aux" data-k="acc"><rect x="436" y="214" width="28" height="52" rx="9"/><rect x="438" y="244" width="24" height="20" rx="7" fill="var(--cold)" opacity=".6" stroke="none"/><text class="nl3-lb" x="450" y="288" text-anchor="middle">bầu tách lỏng</text></g>
    <g class="aux" data-k="rev"><rect x="504" y="190" width="32" height="20" rx="5" stroke-dasharray="4 3"/><text class="nl3-lb" x="544" y="205">van đảo chiều*</text></g>
    <g id="nl3dots"></g></svg>`;

  const RVS = `<svg viewBox="0 0 680 310" role="img" aria-label="Điều hòa hai chiều: van đảo chiều đổi vai trò hai dàn">
    <rect x="14" y="30" width="236" height="150" rx="14" id="zIn" class="nl3-zone"/><rect x="430" y="30" width="236" height="150" rx="14" id="zOut" class="nl3-zone"/>
    <text class="nl3-lb" x="26" y="52">Trong nhà</text><text class="nl3-lb" x="654" y="52" text-anchor="end">Ngoài trời</text>
    <g fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" id="rvPipes">
      <path id="rp1" d="M340 214V150"/><path id="rp2" d="M300 214V150"/>
      <path id="rp3" d="M285 110V85H200"/><path id="rp4" d="M355 110V85H440"/>
      <path id="rp5" d="M60 85H30V285H300"/><path id="rp6" d="M340 285H610V85H580"/></g>
    <path id="rvInC" d="M200 85L184 63L160 107L136 63L112 107L88 63L64 107L60 85" fill="none" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
    <path id="rvOutC" d="M440 85L456 63L480 107L504 63L528 107L552 63L576 107L580 85" fill="none" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="296" y="270" width="48" height="30" rx="7" class="nl3-main-r"/><text class="nl3-lb" x="320" y="290" text-anchor="middle">tiết lưu</text>
    <rect x="262" y="108" width="116" height="46" rx="10" class="nl3-valve"/>
    <g id="rvCh" fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round"></g>
    <circle cx="320" cy="240" r="25" class="nl3-main-r"/><text x="320" y="244" text-anchor="middle" class="nl3-lb" style="font-size:12.5px">Máy nén</text>
    <text class="nl3-lb" x="394" y="150">đẩy</text><text class="nl3-lb" x="246" y="150" text-anchor="end">hút</text>
    <text class="nl3-r" id="rvTi" x="132" y="170" text-anchor="middle"></text><text class="nl3-r" id="rvTo" x="548" y="170" text-anchor="middle"></text>
    <path id="rvLoop" d="M0 0" fill="none"/><g id="rvDots"></g></svg>`;

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
  <div class="sec-n">Phần 1</div><h2>Bốn thiết bị phụ, mỗi cái giải quyết một rủi ro</h2>
  <p>Ngoài 4 thiết bị chính, hệ thống còn có <b>thiết bị phụ</b> để bổ sung chức năng và đáp ứng yêu cầu kỹ thuật. Mỗi cái bảo vệ hệ thống khỏi một sự cố cụ thể. Bấm để xem hình mặt cắt:</p>
  <div class="stage nl2-box"><div id="aTabs"></div>
    <div class="nl2-kind" aria-live="polite"><div class="nl2-pic" id="aPic"></div><article class="panel" id="aPanel"></article></div></div>
</section>

<section class="sec" id="s-pos" data-toc="2 · Vị trí lắp đặt">
  <div class="sec-n">Phần 2</div><h2>Vị trí trên vòng tuần hoàn</h2>
  <p>Bấm vào một thiết bị phụ trên hình để xem nó làm gì. Hạt gas chạy theo vòng: hơi nóng, lỏng nóng, lỏng lạnh, hơi lạnh.</p>
  <div class="stage nl3-pos" id="posBox" data-sel="oil"><div class="nl1-scroll">${POS}</div><p class="nl1-swipe muted">Vuốt ngang để xem hết sơ đồ ↔</p></div>
  <p class="muted">*Van đảo chiều chỉ có ở điều hòa hai chiều; nó nằm ở cụm máy nén, nối đường hút và đường đẩy với hai dàn.</p>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ</b><p><b>Dầu</b> → sau máy nén. <b>Lọc</b> → trước tiết lưu. <b>Lỏng</b> → trước máy nén. <b>Đảo chiều</b> → ở máy nén, đổi hướng gas.</p></div></div>
</section>

<section class="sec" id="s-rev" data-toc="3 · Van đảo chiều">
  <div class="sec-n">Phần 3</div><h2>Van đảo chiều: đổi chỗ hai dàn</h2>
  <p>Máy nén luôn đẩy gas nóng ra một cửa và hút về một cửa. Van đảo chiều chỉ <b>đổi đường nối</b> tới hai dàn, nên dàn nào là <b>ngưng tụ</b>, dàn nào là <b>bay hơi</b> sẽ đổi theo. Thử chuyển chế độ:</p>
  <div class="stage nl3-lab">
    <div class="row" role="group" aria-label="Chế độ"><button class="btn pri sm" id="rvCool" aria-pressed="true">❄ Chạy lạnh</button><button class="btn sm" id="rvHeat" aria-pressed="false">🔥 Chạy nóng (sưởi)</button><button class="btn sm" id="rvPlay" aria-pressed="true">⏸ Dừng</button></div>
    <div class="nl1-scroll">${RVS}</div><p class="nl1-swipe muted">Vuốt ngang để xem hết sơ đồ ↔</p>
    <div class="verdict" id="rvV" aria-live="polite"></div>
    <div class="nl1-legend"><span><i class="liq"></i> gas thể lỏng</span><span><i class="gas"></i> gas thể hơi</span></div>
  </div>
</section>

<section class="sec" id="s-recap" data-toc="4 · Tóm tắt">
  <div class="sec-n">Phần 4</div><h2>Tóm tắt bài — 5 điều cần nhớ</h2>
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

  function mountPos(root) {
    const g = $('#nl3dots', root), L = polyLen([[520, 150], [520, 60], [90, 60], [90, 240], [520, 240], [520, 150]]);
    const a = x => x / L, pr = profile([{ a: 0, b: a(230), s: 0 }, { a: a(380), b: a(610), s: 1 }, { a: a(610), b: a(840), s: 2 }, { a: a(990), b: a(1130), s: 3 }, { a: 1, b: 1, s: 0 }], 4);
    g.innerHTML = U.flow('nl3loop', 11, 16, pr.bps, [{ c: 'nl1-p-hg', r: 6 }, { c: 'nl1-p-hl', r: 4.5 }, { c: 'nl1-p-cl', r: 4.5 }, { c: 'nl1-p-cg', r: 6 }].map((s, i) => ({ ...s, w: pr.w[i] })));
    if (RM) try { $('svg', $('#posBox', root)).pauseAnimations(); } catch (e) { }
  }

  function mountRev(root) {
    const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const PTS = {
      cool: [[340, 214], [340, 150], [355, 110], [355, 85], [440, 85], [580, 85], [610, 85], [610, 285], [340, 285], [300, 285], [30, 285], [30, 85], [60, 85], [200, 85], [285, 85], [285, 110], [300, 150], [300, 214]],
      heat: [[340, 214], [340, 150], [285, 110], [285, 85], [200, 85], [60, 85], [30, 85], [30, 285], [300, 285], [340, 285], [610, 285], [610, 85], [580, 85], [440, 85], [355, 85], [355, 110], [300, 150], [300, 214]]
    };
    const set = (id, c) => { const e = $('#' + id, root); e.setAttribute('stroke', `var(--${c})`); };
    let mode = 'cool', on = !RM;
    const svg = $('svg', $('.nl3-lab', root));
    const apply = () => { try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) { } $('#rvPlay', root).textContent = on ? '⏸ Dừng' : '▶ Chạy'; $('#rvPlay', root).setAttribute('aria-pressed', on); };
    const draw = m => {
      mode = m; const cool = m === 'cool', P = PTS[m], L = polyLen(P);
      const cum = i => polyLen(P.slice(0, i + 1)) / L;
      const pr = profile([{ a: 0, b: cum(4), s: 0 }, { a: cum(5), b: cum(8), s: 1 }, { a: cum(9), b: cum(12), s: 2 }, { a: cum(13), b: cum(16), s: 3 }, { a: 1, b: 1, s: 0 }], 4);
      $('#rvLoop', root).setAttribute('d', 'M' + P.map(p => p.join(' ')).join('L'));
      $('#rvDots', root).innerHTML = U.flow('rvLoop', 12, 16, pr.bps, [{ c: 'nl1-p-hg', r: 6 }, { c: 'nl1-p-hl', r: 4.5 }, { c: 'nl1-p-cl', r: 4.5 }, { c: 'nl1-p-cg', r: 6 }].map((s, i) => ({ ...s, w: pr.w[i] })));
      set('rp1', 'hot'); set('rp2', 'cold-l');
      set('rp3', cool ? 'cold-l' : 'hot'); set('rp4', cool ? 'hot' : 'cold-l');
      set('rp5', cool ? 'cold' : 'warm'); set('rp6', cool ? 'warm' : 'cold');
      set('rvInC', cool ? 'cold' : 'hot'); set('rvOutC', cool ? 'hot' : 'cold');
      $('#zIn', root).setAttribute('fill', cool ? 'var(--cold-tint)' : 'var(--hot-tint)'); $('#zOut', root).setAttribute('fill', cool ? 'var(--hot-tint)' : 'var(--cold-tint)');
      $('#rvCh', root).innerHTML = cool ? '<path d="M340 150L355 110"/><path d="M300 150L285 110"/>' : '<path d="M340 150L285 110"/><path d="M300 150L355 110"/>';
      $('#rvTi', root).textContent = cool ? 'bay hơi: hút nhiệt phòng' : 'ngưng tụ: tỏa nhiệt sưởi ấm';
      $('#rvTo', root).textContent = cool ? 'ngưng tụ: thải nhiệt ra ngoài' : 'bay hơi: lấy nhiệt từ ngoài trời';
      $('#rvTi', root).setAttribute('fill', cool ? 'var(--cold)' : 'var(--hot)'); $('#rvTo', root).setAttribute('fill', cool ? 'var(--hot)' : 'var(--cold)');
      const v = $('#rvV', root); v.className = 'verdict'; v.innerHTML = cool
        ? '<b>Chạy lạnh:</b> van nối cửa đẩy tới dàn ngoài. Dàn ngoài ngưng tụ và thải nhiệt; dàn trong bay hơi, hút nhiệt nên phòng mát.'
        : '<b>Chạy nóng:</b> van đổi đường, cửa đẩy nối tới dàn trong. Dàn trong ngưng tụ và tỏa nhiệt nên phòng ấm; dàn ngoài bay hơi, lấy nhiệt từ ngoài trời.';
      $('#rvCool', root).classList.toggle('pri', cool); $('#rvHeat', root).classList.toggle('pri', !cool);
      $('#rvCool', root).setAttribute('aria-pressed', cool); $('#rvHeat', root).setAttribute('aria-pressed', !cool);
      apply();
    };
    $('#rvCool', root).onclick = () => draw('cool'); $('#rvHeat', root).onclick = () => draw('heat');
    $('#rvPlay', root).onclick = () => { on = !on; apply(); };
    draw('cool');
  }

  function mount(root) {
    const box = $('#posBox', root);
    U.tabset($('#aTabs', root), Object.entries(AUX).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => {
      const p = AUX[id]; box.dataset.sel = id;
      $('#aPic', root).innerHTML = PIC[id];
      $('#aPanel', root).innerHTML = `<h3>${p[0]}</h3><dl class="kv"><dt>Vị trí</dt><dd>${p[1]}</dd><dt>Công dụng</dt><dd>${p[2]}</dd><dt>Nguyên lý</dt><dd>${p[3]}</dd><dt>Lưu ý</dt><dd>${p[4]}</dd></dl>`;
    });
    $$('.aux', box).forEach(el => { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); const go = () => { const b = $(`.tab[data-id="${el.dataset.k}"]`, root); if (b) { b.click(); } }; el.addEventListener('click', go); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    mountPos(root); mountRev(root);
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
