/* Bộ định tuyến (hash) + khung giao diện. */
(function () {
  const { $, $$, store, esc } = DL;
  const main = $('#main'), shell = $('#shell'), side = $('#sidebar');
  let keyHandler = null, spy = null;

  const CATS = [
    { id: 'tu-lanh', name: 'Tủ lạnh', ready: true },
    { id: 'may-giat', name: 'Máy giặt', ready: true },
    { id: 'dieu-hoa', name: 'Điều hòa', ready: false }
  ];
  const TABS = [
    { id: 'hoc', name: '📖 Bài học' },
    { id: 'flashcard', name: '🃏 Flashcard' },
    { id: 'trac-nghiem', name: '✅ Trắc nghiệm' },
    { id: 'phan-loai', name: '🧲 Kéo thả phân loại' },
    { id: 'sap-xep', name: '🔢 Sắp xếp các bước' }
  ];
  const ICONS = {
    'tu-lanh': '<svg class="ico" viewBox="0 0 96 96" aria-hidden="true"><rect x="22" y="6" width="52" height="84" rx="9" fill="var(--cold-tint)" stroke="var(--ink)" stroke-width="3"/><path d="M22 36H74" stroke="var(--ink)" stroke-width="3"/><rect x="62" y="16" width="5" height="14" rx="2.5" fill="var(--ink)"/><rect x="62" y="46" width="5" height="22" rx="2.5" fill="var(--ink)"/><path d="M40 62l8-8 8 8M40 74l8-8 8 8" stroke="var(--cold)" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>',
    'may-giat': '<svg class="ico" viewBox="0 0 96 96" aria-hidden="true"><rect x="12" y="8" width="72" height="80" rx="10" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><path d="M12 26H84" stroke="var(--ink)" stroke-width="3"/><circle cx="48" cy="57" r="22" fill="var(--cold-tint)" stroke="var(--ink)" stroke-width="3"/><path d="M34 57q7-8 14 0t14 0" stroke="var(--cold)" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="24" cy="17" r="3" fill="var(--ink)"/><circle cx="35" cy="17" r="3" fill="var(--ink)"/></svg>',
    'dieu-hoa': '<svg class="ico" viewBox="0 0 96 96" aria-hidden="true"><rect x="6" y="18" width="84" height="34" rx="9" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><path d="M14 44H82" stroke="var(--ink)" stroke-width="3"/><path d="M26 62q-4 8 0 16M48 62q-4 8 0 16M70 62q-4 8 0 16" stroke="var(--cold)" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>'
  };

  const lesson = (cat, id) => DL.lessons.find(l => l.cat === cat && l.id === +id);
  const inCat = cat => DL.lessons.filter(l => l.cat === cat);
  const catName = cat => (CATS.find(c => c.id === cat) || {}).name;

  function renderCats(active) {
    $('#cats').innerHTML = CATS.map(c => c.ready
      ? `<a class="cat ${c.id === active ? 'on' : ''}" href="#/${c.id}">${c.name}</a>`
      : `<span class="cat soon" title="Sắp ra mắt">${c.name} <span class="tag">Sắp có</span></span>`).join('');
  }

  function renderSide(cat, activeId) {
    side.innerHTML = `<h2 class="side-h">${catName(cat)} · Các bài học</h2><ul class="lnav">${inCat(cat).map(l => {
      const pct = l.ready ? DL.percent(l) : 0;
      return `<li><a class="${l.id === activeId ? 'on' : ''} ${l.ready ? '' : 'soon'}" href="#/${cat}/${l.id}"><span class="n">${l.id || "★"}</span>
        <span class="t">${esc(l.title)}<span class="s">${l.ready ? esc(l.sub || '') : 'Sắp có'}</span></span>
        <span class="st">${pct >= 100 ? '✓' : l.ready && pct ? pct + '%' : ''}</span></a></li>`;
    }).join('')}</ul>`;
  }

  function setLayout(sidebar) {
    shell.classList.toggle('no-side', !sidebar);
    $('#menuBtn').hidden = !sidebar;
    document.body.classList.remove('menu-open');
    $('#menuBtn').setAttribute('aria-expanded', 'false');
  }

  /* ---------- trang chủ ---------- */
  function home() {
    renderCats(''); setLayout(false);
    main.innerHTML = `<div class="wrap"><div class="hero">
      <div class="sec-n">Học · Ôn luyện · Ghi nhớ</div>
      <h1>Điện lạnh dân dụng,<br>học trực quan, nhớ lâu.</h1>
      <p class="lead">Sơ đồ có hoạt ảnh, mô phỏng thao tác, flashcard và bài tập kéo thả giúp bạn hiểu bản chất thay vì học thuộc lòng.</p></div>
      <div class="cards3">${CATS.map(c => {
        const ls = inCat(c.id), done = ls.filter(l => l.ready).length;
        return `<${c.ready ? `a href="#/${c.id}"` : 'div'} class="bigcard ${c.ready ? '' : 'soon'}">${ICONS[c.id]}
          <h3>${c.name}</h3><p>${c.ready ? `${ls.length} bài học · ${done} bài đã sẵn sàng` : 'Đang chuẩn bị nội dung.'}</p>
          ${c.ready ? '<span class="go">Vào học →</span>' : '<span class="tag">Sắp có</span>'}</${c.ready ? 'a' : 'div'}>`;
      }).join('')}</div></div>`;
  }

  /* ---------- danh sách bài của tủ lạnh ---------- */
  function hub(cat) {
    renderCats(cat); renderSide(cat, 0); setLayout(true);
    const all = inCat(cat), ready = all.filter(l => l.ready);
    const avg = ready.length ? Math.round(ready.reduce((s, l) => s + DL.percent(l), 0) / ready.length) : 0;
    main.innerHTML = `<div class="wrap"><div class="hero"><div class="sec-n">Chuyên mục</div><h1>${catName(cat)}</h1>
      <p class="lead">${cat === 'may-giat' ? 'Từ phân loại, cấu tạo, phần điện – cơ, cách sử dụng đến phân tích mạch và sửa chữa. Mỗi bài có phần học và 4 dạng ôn luyện.' : 'Từ cấu tạo từng bộ phận đến cách kiểm tra, sửa chữa. Mỗi bài có phần học và 4 dạng ôn luyện.'}</p></div>
      <div class="stats"><div class="stat"><b>${ready.length}/${all.length}</b><span>bài đã có</span></div><div class="stat"><b>${avg}%</b><span>tiến độ trung bình</span></div></div>
      <div class="lcards">${all.map(l => {
        const pct = l.ready ? DL.percent(l) : 0, tag = l.ready ? 'a' : 'div';
        return `<${tag} ${l.ready ? `href="#/${cat}/${l.id}"` : ''} class="lcard ${l.ready ? '' : 'soon'}"><span class="num">${l.id ? "Bài " + l.id : "Mở đầu"}</span><h3>${esc(l.title)}</h3><p>${esc(l.sub || '')}</p>
          <div class="bar"><i style="width:${pct}%"></i></div><div class="foot"><span>${l.ready ? '≈ ' + l.minutes + ' phút' : 'Sắp có'}</span><span>${l.ready ? pct + '%' : ''}</span></div></${tag}>`;
      }).join('')}</div></div>`;
  }

  /* ---------- trang một bài ---------- */
  function lessonPage(cat, id, tab) {
    const l = lesson(cat, id);
    renderCats(cat); setLayout(true);
    if (!l || !l.ready) { renderSide(cat, +id); main.innerHTML = `<div class="wrap"><div class="hero"><h1>Bài ${esc(id)} sắp có</h1><p class="lead">Nội dung bài này đang được chuẩn bị. <a href="#/${cat}">← Về danh sách bài</a></p></div></div>`; return; }
    if (!TABS.some(t => t.id === tab)) tab = 'hoc';
    if (tab === 'hoc') DL.setProgress(l.key, { visited: true });
    renderSide(cat, l.id);
    main.innerHTML = `<div class="wrap">
      <div class="lhead"><div class="crumb"><a href="#/${cat}">${catName(cat)}</a> › ${l.id ? "Bài " + l.id : "Tổng quát"}</div>
        <h1>${esc(l.title)}</h1><p class="lead">${l.lead}</p>
        <div class="chips"><span class="chip">⏱ ≈ ${l.minutes} phút</span><span class="chip">🃏 ${l.flashcards.length} thẻ</span><span class="chip">✅ ${Math.min(l.quiz.length, l.quizSize || 12)} câu hỏi/lượt</span></div></div>
      <nav class="mtabs" aria-label="Phần bài học">${TABS.map(t => `<a class="mtab ${t.id === tab ? 'on' : ''}" href="#/${cat}/${l.id}/${t.id}">${t.name}</a>`).join('')}</nav>
      <div id="body"></div>
      <div class="divider"></div>
      <div class="row" style="justify-content:space-between">${nav(l, tab)}</div></div>`;
    const body = $('#body');
    if (tab === 'hoc') { body.innerHTML = l.learn(); l.mount(body); toc(body); }
    else if (tab === 'flashcard') keyHandler = DL.flashcards(body, l);
    else if (tab === 'trac-nghiem') DL.quiz(body, l);
    else if (tab === 'phan-loai') DL.sort(body, l);
    else DL.order(body, l);
  }

  function nav(l, tab) {
    const i = TABS.findIndex(t => t.id === tab), p = TABS[i - 1], n = TABS[i + 1];
    const a = (t, txt) => `<a class="btn ${txt.includes('→') ? 'pri' : ''}" href="#/${l.cat}/${l.id}/${t.id}" style="text-decoration:none;display:inline-flex;align-items:center">${txt}</a>`;
    return `<span>${p ? a(p, '← ' + p.name.replace(/^\S+\s/, '')) : ''}</span><span>${n ? a(n, n.name.replace(/^\S+\s/, '') + ' →') : `<a class="btn pri" href="#/${l.cat}" style="text-decoration:none;display:inline-flex;align-items:center">Về danh sách bài ✓</a>`}</span>`;
  }

  function toc(body) {
    const secs = $$('section.sec', body);
    const bar = document.createElement('nav'); bar.className = 'toc'; bar.setAttribute('aria-label', 'Mục lục bài');
    bar.innerHTML = secs.map(s => `<a href="#" data-t="${s.id}">${esc(s.dataset.toc)}</a>`).join('');
    body.prepend(bar);
    bar.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); document.getElementById(a.dataset.t).scrollIntoView({ behavior: 'smooth' }); });
    if (!('IntersectionObserver' in window)) return;
    spy = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) $$('a', bar).forEach(a => a.classList.toggle('on', a.dataset.t === en.target.id));
    }), { rootMargin: '-25% 0px -65% 0px' });
    secs.forEach(s => spy.observe(s));
  }

  function route() {
    if (spy) { spy.disconnect(); spy = null; }
    keyHandler = null;
    const [, cat, id, tab] = (location.hash || '#/').split('/');
    if (CATS.some(c => c.id === cat && c.ready)) id ? lessonPage(cat, id, tab) : hub(cat); else home();
    window.scrollTo(0, 0); main.focus({ preventScroll: true });
    document.title = (id && lesson(cat, id) ? catName(cat) + ' · ' + (+id ? 'Bài ' + id : 'Tổng quát') + ' · ' : '') + 'Điện Lạnh – Học & Ôn luyện';
  }

  /* ---------- sự kiện chung ---------- */
  document.addEventListener('keydown', e => { if (keyHandler && !/INPUT|TEXTAREA/.test(e.target.tagName)) keyHandler(e); });
  $('#menuBtn').onclick = () => { const o = document.body.classList.toggle('menu-open'); $('#menuBtn').setAttribute('aria-expanded', o); };
  $('#scrim').onclick = () => document.body.classList.remove('menu-open');
  side.addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('menu-open'); });
  const root = document.documentElement;
  const saved = store.get('theme', null); if (saved) root.dataset.theme = saved;
  $('#themeBtn').onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark'; store.set('theme', root.dataset.theme);
  };
  window.addEventListener('hashchange', route);
  route();
})();
