/* Thành phần giao diện dùng chung cho các bài (từ Bài 2 trở đi). */
(function () {
  const { $, $$, shuffle } = DL;
  const ui = {};

  /* Danh sách các bước bấm để đánh dấu */
  ui.steps = arr => `<ol class="steps">${arr.map(s => `<li tabindex="0"><div><b>${s[0]}</b><span>${s[1] || ''}</span></div></li>`).join('')}</ol><div class="prog"><span class="pc">Đã làm 0/${arr.length} bước</span><div class="bar"><i style="width:0"></i></div><span class="muted">(bấm từng bước để đánh dấu)</span></div>`;
  ui.bindSteps = root => $$('ol.steps:not(.recap)', root).forEach(ol => {
    const items = $$('li', ol), box = ol.nextElementSibling;
    if (!box || ol.dataset.bound) return; ol.dataset.bound = 1;
    const upd = () => { const d = items.filter(i => i.classList.contains('done')).length; $('.pc', box).textContent = `Đã làm ${d}/${items.length} bước`; $('.bar i', box).style.width = d / items.length * 100 + '%'; };
    items.forEach(li => { const t = () => { li.classList.toggle('done'); upd(); }; li.onclick = t; li.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } }; });
  });

  /* Bộ tab: items = [{id, n, name, sub}] -> gọi on(id) khi chọn */
  ui.tabset = (box, items, on, first) => {
    box.classList.add('tabs');
    box.innerHTML = items.map((t, i) => `<button class="tab" type="button" data-id="${t.id}" aria-pressed="${(first ? t.id === first : i === 0)}"><b>${t.n || i + 1}</b><span>${t.name}${t.sub ? `<br><small class="muted">${t.sub}</small>` : ''}</span></button>`).join('');
    box.onclick = e => { const b = e.target.closest('.tab'); if (!b) return; $$('.tab', box).forEach(x => x.setAttribute('aria-pressed', x === b)); on(b.dataset.id); };
    on(first || items[0].id);
  };

  /* Đồng hồ kim bán nguyệt. o = {min,max,step,unit,good:[a,b]} */
  ui.gauge = (v, o) => {
    const cx = 150, cy = 150, r = 105, f = x => Math.PI * (1 - (x - o.min) / (o.max - o.min));
    const px = (a, rr) => (cx + rr * Math.cos(a)).toFixed(1), py = (a, rr) => (cy - rr * Math.sin(a)).toFixed(1);
    let t = '';
    for (let x = o.min; x <= o.max + 1e-6; x += o.step) {
      const a = f(x);
      t += `<path d="M${px(a, r - 12)} ${py(a, r - 12)}L${px(a, r)} ${py(a, r)}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="${px(a, r - 28)}" y="${+py(a, r - 28) + 4}" text-anchor="middle">${x}</text>`;
    }
    const g = o.good ? `<path d="M${px(f(o.good[0]), r - 5)} ${py(f(o.good[0]), r - 5)}A${r - 5} ${r - 5} 0 0 1 ${px(f(o.good[1]), r - 5)} ${py(f(o.good[1]), r - 5)}" stroke="var(--ok)" stroke-width="5" fill="none" opacity=".55"/>` : '';
    const a = f(Math.max(o.min, Math.min(o.max, v)));
    return `<svg viewBox="0 0 300 190" role="img" aria-label="Đồng hồ chỉ ${Math.round(v)} ${o.unit}">
      <path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>${g}${t}
      <path d="M${cx} ${cy}L${px(a, r - 18)} ${py(a, r - 18)}" stroke="var(--hot)" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="9" fill="var(--ink)"/>
      <text class="lbl" x="150" y="183" text-anchor="middle">${Math.round(v)} ${o.unit}</text></svg>`;
  };

  /* Phòng thực hành đo điện trở động cơ (block). mode: 'identify' | 'diagnose' */
  ui.motorLab = (root, mode) => {
    let M;
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    function fresh() {
      let r = rnd(9, 16), s = r + rnd(4, 12);
      if (Math.random() < .2) [r, s] = [s, r]; // khoảng 15–20% động cơ có cuộn chạy lớn hơn cuộn đề
      const roles = shuffle(['C', 'R', 'S']);
      const state = mode === 'identify' ? 'good' : shuffle(['good', 'good', 'open', 'short', 'leak'])[0];
      M = { r, s, roles, state, open: Math.random() < .5 ? 'R' : 'S', seen: {}, sel: {}, ins: null };
    }
    const pairR = (i, j) => {                       // điện trở giữa 2 chân vật lý i, j
      const a = M.roles[i], b = M.roles[j], k = [a, b].sort().join('');
      let rr = M.r, ss = M.s;
      if (M.state === 'short') rr = Math.max(1, +(M.r * .3).toFixed(1));
      const wind = { CR: ['R'], CS: ['S'], RS: ['R', 'S'] }[k];
      if (M.state === 'open' && wind.includes(M.open)) return Infinity;
      return wind.reduce((t, w) => t + (w === 'R' ? rr : ss), 0);
    };
    const fmt = x => x === Infinity ? 'OL (∞)' : x.toFixed(1) + ' Ω';
    const names = { 0: '1', 1: '2', 2: '3' }, pairs = [[0, 1], [1, 2], [0, 2]];
    function draw() {
      root.innerHTML = `<div class="gauge-wrap" style="grid-template-columns:minmax(0,320px) minmax(0,1fr)">
        <div class="stage" style="margin:0"><svg viewBox="0 0 300 230" role="img" aria-label="Ba chân đấu điện của block">
          <rect x="40" y="20" width="220" height="130" rx="60" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>
          <text class="sub" x="150" y="92" text-anchor="middle">Block tủ lạnh</text><text class="fl" x="150" y="112" text-anchor="middle">3 chân đấu điện</text>
          ${[0, 1, 2].map(i => `<g><rect x="${75 + i * 75}" y="150" width="22" height="42" rx="3" fill="var(--brass)"/><circle cx="${86 + i * 75}" cy="212" r="14" fill="var(--ink)"/><text x="${86 + i * 75}" y="217" text-anchor="middle" fill="var(--bg)" font-weight="700" font-size="14">${i + 1}</text></g>`).join('')}
        </svg><div class="controls" style="justify-content:center"><span class="muted" style="font-size:14px">Đồng hồ vạn năng: thang x1Ω (đo cuộn dây), x10kΩ (cách điện)</span></div></div>
        <div>
          <div class="row" id="mBtns">${pairs.map(p => `<button class="btn sm" data-p="${p.join('')}">Đo chân ${p[0] + 1} – ${p[1] + 1}</button>`).join('')}<button class="btn sm" id="mIns">Đo chân → vỏ (x10k)</button></div>
          <div class="verdict" id="mDisp" style="margin-top:12px;font-family:monospace;font-size:15px;min-height:7.5em">${Object.keys(M.seen).length || M.ins ? readout() : 'Bấm các nút để đo. Kết quả sẽ hiện ở đây.'}</div>
          <div class="panel" style="margin-top:12px" id="mAns">${answerHTML()}</div>
          <div id="mRes" style="margin-top:10px"></div>
        </div></div>
        <div class="row" style="margin-top:14px"><button class="btn" id="mNew">🔄 Động cơ mới</button></div>`;
      $$('#mBtns [data-p]', root).forEach(b => b.onclick = () => { const [i, j] = b.dataset.p.split('').map(Number); M.seen[b.dataset.p] = pairR(i, j); $('#mDisp', root).innerHTML = readout(); });
      $('#mIns', root).onclick = () => { M.ins = M.state === 'leak' ? (Math.random() * 1.6 + .2).toFixed(1) + ' MΩ' : '> 10 MΩ (kim không lên)'; $('#mDisp', root).innerHTML = readout(); };
      $('#mNew', root).onclick = () => { fresh(); draw(); };
      $('#mChk', root).onclick = check;
    }
    function readout() {
      let h = pairs.map(p => { const k = p.join(''); return `Chân ${p[0] + 1} – ${p[1] + 1}: ${k in M.seen ? '<b>' + fmt(M.seen[k]) + '</b>' : '…'}`; }).join('<br>');
      return h + `<br>Chân → vỏ: ${M.ins ? '<b>' + M.ins + '</b>' : '…'}`;
    }
    function answerHTML() {
      const opt = o => o.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
      const role = `<option value="">?</option>` + opt([['C', 'C (chung)'], ['R', 'R (chạy)'], ['S', 'S (đề)']]);
      let h = mode === 'identify' ? '<b>Theo bạn, mỗi chân là gì?</b>' : '<b>Kết luận tình trạng động cơ</b>';
      if (mode === 'diagnose') h += `<div class="row" style="margin:8px 0"><select id="mCond" class="btn sm" style="min-height:40px"><option value="">— chọn kết luận —</option>${opt([['good', 'Cuộn dây tốt, cách điện tốt'], ['open', 'Đứt cuộn dây'], ['short', 'Chập một số vòng dây'], ['leak', 'Rò điện ra vỏ']])}</select></div>`;
      else h += `<div class="row" style="margin:8px 0">${[0, 1, 2].map(i => `<label class="row" style="gap:6px">Chân ${i + 1} <select data-i="${i}" class="btn sm roleSel" style="min-height:40px">${role}</select></label>`).join('')}</div>`;
      return h + '<button class="btn pri sm" id="mChk">Kiểm tra</button>';
    }
    function check() {
      const res = $('#mRes', root);
      if (mode === 'identify') {
        const ans = $$('.roleSel', root).map(s => s.value);
        if (ans.some(a => !a)) { res.innerHTML = '<div class="why">Hãy chọn vai trò cho cả 3 chân.</div>'; return; }
        const ok = ans.every((a, i) => a === M.roles[i]);
        res.innerHTML = `<div class="why" style="border-color:var(--${ok ? 'ok' : 'bad'})"><b>${ok ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> Đáp án: ${M.roles.map((r, i) => `chân ${i + 1} = ${r}`).join(', ')}.<br>Cách làm: lần đo <b>lớn nhất</b> (${M.r + M.s} Ω = R + S) loại ra chân <b>chung C</b>; từ C đo hai chân còn lại: số <b>nhỏ</b> là chạy (R = ${M.r} Ω), số <b>lớn</b> là đề (S = ${M.s} Ω).${M.r > M.s ? '<br><i>Động cơ này thuộc nhóm hiếm (15–20%) có cuộn chạy lớn hơn cuộn đề — nên khi lắp thật vẫn phải kiểm tra bằng đồng hồ kẹp dòng.</i>' : ''}</div>`;
      } else {
        const c = $('#mCond', root).value;
        if (!c) { res.innerHTML = '<div class="why">Hãy chọn một kết luận.</div>'; return; }
        const msg = { good: 'Ba lần đo đều có điện trở hợp lý, lớn nhất = tổng hai cuộn và chân → vỏ > 10 MΩ.', open: 'Có lần đo kim không lên (OL, ∞) → cuộn dây bị <b>đứt</b>.', short: 'Điện trở một cuộn nhỏ bất thường (cuộn chạy nhỏ hơn mức bình thường, thường < 5 Ω) → <b>chập vòng</b>.', leak: 'Cuộn dây bình thường nhưng chân → vỏ chỉ vài MΩ (< 10 MΩ) → <b>rò điện ra vỏ</b>.' };
        res.innerHTML = `<div class="why" style="border-color:var(--${c === M.state ? 'ok' : 'bad'})"><b>${c === M.state ? '✓ Đúng!' : '✗ Chưa đúng.'}</b> Đáp án: ${msg[M.state]}${M.state === 'good' ? '' : ''}<br><span class="muted">Mẹo: nhớ đo đủ 3 cặp chân <b>và</b> đo cách điện chân → vỏ trước khi kết luận.</span></div>`;
      }
    }
    fresh(); draw();
  };

  DL.ui = ui;
})();
