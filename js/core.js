/* Lõi dùng chung: lưu tiến độ, đăng ký bài, và các công cụ ôn luyện (flashcard, trắc nghiệm, kéo thả, sắp xếp). */
(function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem('dl:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('dl:' + k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } }
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const DL = { lessons: [], store, $, $$, shuffle, esc };

  // Đăng ký bài: gộp theo id (bài "sắp có" chỉ có metadata, bài thật có thêm nội dung)
  DL.register = function (l) {
    const i = DL.lessons.findIndex(x => x.id === l.id);
    if (i >= 0) DL.lessons[i] = Object.assign({}, DL.lessons[i], l);
    else DL.lessons.push(l);
    DL.lessons.sort((a, b) => a.id - b.id);
  };
  DL.progress = function (id) {
    const p = store.get('p' + id, {});
    return { quiz: p.quiz || 0, cards: p.cards || 0, sort: !!p.sort, order: p.order || 0, visited: !!p.visited };
  };
  DL.setProgress = function (id, patch) { store.set('p' + id, Object.assign(store.get('p' + id, {}), patch)); };
  DL.percent = function (l) {
    const p = DL.progress(l.id);
    const cards = l.flashcards ? Math.min(1, p.cards / l.flashcards.length) : 0;
    const parts = [p.visited ? 1 : 0, cards, p.quiz / 100, p.sort ? 1 : 0];
    return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length * 100);
  };

  /* ---------------- Flashcard ---------------- */
  DL.flashcards = function (root, lesson) {
    let deck = lesson.flashcards.map((c, i) => Object.assign({ i }, c));
    let known = new Set(store.get('known' + lesson.id, []));
    let idx = 0, onlyUnknown = false;
    const save = () => { store.set('known' + lesson.id, [...known]); DL.setProgress(lesson.id, { cards: known.size }); };
    const cur = () => (onlyUnknown ? deck.filter(c => !known.has(c.i)) : deck);

    function draw() {
      const list = cur();
      if (!list.length) {
        root.innerHTML = `<div class="pcard score"><div class="ring">🎉</div><h3>Bạn đã thuộc hết ${lesson.flashcards.length} thẻ!</h3><p class="msg">Tuyệt vời. Hãy sang phần trắc nghiệm để kiểm tra lại.</p><div class="fc-act"><button class="btn" data-a="reset">Học lại từ đầu</button></div></div>`;
        root.querySelector('[data-a=reset]').onclick = () => { known.clear(); save(); onlyUnknown = false; idx = 0; draw(); };
        return;
      }
      idx = Math.min(idx, list.length - 1);
      const c = list[idx];
      root.innerHTML = `<div class="pcard">
        <div class="phead"><b>Thẻ ${idx + 1} / ${list.length}</b><div class="bar"><i style="width:${known.size / lesson.flashcards.length * 100}%"></i></div><span class="muted">Đã thuộc ${known.size}/${lesson.flashcards.length}</span></div>
        <div class="flip" id="flip"><div class="flip-in" tabindex="0" role="button" aria-label="Lật thẻ">
          <div class="face front"><div class="k">${esc(c.tag || 'Câu hỏi')}</div><div class="big">${c.f}</div><div class="hint">Bấm để lật · phím Space</div></div>
          <div class="face back"><div class="k">Đáp án</div><div class="txt">${c.b}</div></div>
        </div></div>
        <div class="fc-act">
          <button class="btn sm" data-a="prev" aria-label="Thẻ trước">← Trước</button>
          <button class="btn sm" data-a="no">Chưa thuộc</button>
          <button class="btn sm pri" data-a="yes">Đã thuộc ✓</button>
          <button class="btn sm" data-a="next" aria-label="Thẻ sau">Sau →</button>
        </div>
        <div class="fc-act" style="margin-top:14px">
          <button class="btn sm" data-a="shuf">🔀 Xáo trộn</button>
          <button class="btn sm" data-a="only">${onlyUnknown ? 'Xem tất cả' : 'Chỉ thẻ chưa thuộc'}</button>
        </div></div>`;
      const flip = root.querySelector('#flip'), inner = flip.firstElementChild;
      const toggle = () => flip.classList.toggle('on');
      inner.onclick = toggle;
      const go = d => { idx = (idx + d + list.length) % list.length; draw(); };
      root.querySelector('[data-a=prev]').onclick = () => go(-1);
      root.querySelector('[data-a=next]').onclick = () => go(1);
      root.querySelector('[data-a=yes]').onclick = () => { known.add(c.i); save(); onlyUnknown ? draw() : go(1); };
      root.querySelector('[data-a=no]').onclick = () => { known.delete(c.i); save(); go(1); };
      root.querySelector('[data-a=shuf]').onclick = () => { deck = shuffle(deck); idx = 0; draw(); };
      root.querySelector('[data-a=only]').onclick = () => { onlyUnknown = !onlyUnknown; idx = 0; draw(); };
      root._key = e => {
        if (e.key === ' ' || e.key === 'Enter') { if (e.target.closest('button')) return; e.preventDefault(); toggle(); }
        else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
      };
    }
    draw();
    return e => root._key && root._key(e);
  };

  /* ---------------- Trắc nghiệm ---------------- */
  DL.quiz = function (root, lesson) {
    const L = ['A', 'B', 'C', 'D', 'E'];
    let qs, i, score, wrong, answered;
    function start() {
      qs = shuffle(lesson.quiz).slice(0, lesson.quizSize || 12).map(q => {
        const order = shuffle(q.o.map((t, k) => k));
        return { q: q.q, o: order.map(k => q.o[k]), a: order.indexOf(q.a), why: q.why };
      });
      i = 0; score = 0; wrong = []; answered = false; draw();
    }
    function draw() {
      if (i >= qs.length) return end();
      const q = qs[i]; answered = false;
      root.innerHTML = `<div class="pcard">
        <div class="phead"><b>Câu ${i + 1} / ${qs.length}</b><div class="bar"><i style="width:${i / qs.length * 100}%"></i></div><span class="muted">Đúng ${score}</span></div>
        <div class="q-text">${q.q}</div>
        <div class="qopts">${q.o.map((t, k) => `<button class="qopt" data-k="${k}"><span class="l">${L[k]}</span><span>${t}</span></button>`).join('')}</div>
        <div id="fb"></div></div>`;
      root.querySelectorAll('.qopt').forEach(b => b.onclick = () => pick(+b.dataset.k));
    }
    function pick(k) {
      if (answered) return; answered = true;
      const q = qs[i], ok = k === q.a;
      if (ok) score++; else wrong.push(q);
      root.querySelectorAll('.qopt').forEach((b, n) => { b.disabled = true; if (n === q.a) b.classList.add('right'); else if (n === k) b.classList.add('wrong'); });
      root.querySelector('#fb').innerHTML = `<div class="why"><b>${ok ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> ${q.why}</div>
        <div class="fc-act" style="margin-top:16px"><button class="btn pri" id="nx">${i + 1 < qs.length ? 'Câu tiếp theo →' : 'Xem kết quả'}</button></div>`;
      const nx = root.querySelector('#nx'); nx.focus();
      nx.onclick = () => { i++; draw(); };
    }
    function end() {
      const pct = Math.round(score / qs.length * 100), best = Math.max(pct, DL.progress(lesson.id).quiz);
      DL.setProgress(lesson.id, { quiz: best });
      const msg = pct >= 90 ? 'Xuất sắc! Bạn nắm rất chắc bài này.' : pct >= 70 ? 'Khá tốt! Xem lại vài câu sai bên dưới để chắc hơn.' : 'Cần ôn thêm. Đọc lại bài học và lật flashcard rồi thử lại nhé.';
      root.innerHTML = `<div class="pcard score"><div class="ring" style="color:${pct >= 70 ? 'var(--ok)' : 'var(--warm)'}">${score}/${qs.length}</div>
        <p class="msg" style="margin-inline:auto">${pct}% · ${msg}<br>Điểm cao nhất: ${best}%</p>
        <div class="fc-act"><button class="btn pri" id="again">Làm lại (đảo câu)</button></div>
        ${wrong.length ? `<div class="review"><h4>Các câu cần xem lại</h4>${wrong.map(q => `<div><b>${q.q}</b><br>→ Đáp án: ${q.o[q.a]}<br><span class="muted">${q.why}</span></div>`).join('')}</div>` : ''}</div>`;
      root.querySelector('#again').onclick = start;
    }
    start();
  };

  /* ---------------- Kéo thả phân loại (có chạm-để-chọn cho điện thoại) ---------------- */
  DL.sort = function (root, lesson) {
    const cfg = lesson.sort;
    const items = shuffle(cfg.items.map((t, i) => ({ id: i, t: t.t, b: t.b })));
    const place = {}; // id -> bucket id | null
    items.forEach(x => place[x.id] = null);
    let sel = null, checked = false;
    root.innerHTML = `<div class="pcard">
      <div class="phead"><b>${cfg.title}</b><span class="muted" id="cnt"></span></div>
      <p class="muted">Kéo thả từng thẻ vào đúng cột. Trên điện thoại: chạm thẻ rồi chạm cột cần thả. Chạm thẻ đã đặt để đưa về lại.</p>
      <div class="pool" id="pool"></div>
      <div class="buckets" id="bks">${cfg.buckets.map(b => `<div class="bucket" data-b="${b.id}"><h4>${b.name}</h4><div class="bl" style="display:flex;flex-direction:column;gap:8px"></div></div>`).join('')}</div>
      <div class="fc-act" style="margin-top:18px"><button class="btn pri" id="chk">Kiểm tra</button><button class="btn" id="rst">Làm lại</button></div>
      <div id="res" style="margin-top:14px"></div></div>`;
    const pool = root.querySelector('#pool');
    const chip = x => {
      const c = document.createElement('div');
      c.className = 'dchip'; c.draggable = true; c.dataset.id = x.id; c.textContent = x.t; c.tabIndex = 0;
      c.addEventListener('dragstart', e => { sel = x.id; e.dataTransfer.setData('text/plain', x.id); c.classList.add('dragging'); });
      c.addEventListener('dragend', () => { c.classList.remove('dragging'); sel = null; });
      c.addEventListener('click', () => {
        if (checked) return;
        if (place[x.id] !== null) { place[x.id] = null; sel = null; render(); return; }
        sel = sel === x.id ? null : x.id; render();
      });
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
      if (x.id === sel) c.classList.add('sel');
      if (checked && place[x.id] !== null) c.classList.add(place[x.id] === x.b ? 'ok' : 'no');
      return c;
    };
    function render() {
      pool.innerHTML = '';
      root.querySelectorAll('.bl').forEach(e => e.innerHTML = '');
      items.forEach(x => {
        const target = place[x.id] === null ? pool : root.querySelector(`.bucket[data-b="${place[x.id]}"] .bl`);
        target.appendChild(chip(x));
      });
      const placed = items.filter(x => place[x.id] !== null).length;
      root.querySelector('#cnt').textContent = `Đã đặt ${placed}/${items.length}`;
      root.querySelectorAll('.bucket').forEach(b => b.classList.toggle('armed', sel !== null && !checked));
      if (!pool.children.length) pool.innerHTML = '<span class="muted">Đã đặt hết thẻ — bấm “Kiểm tra”.</span>';
    }
    const drop = (bid) => { if (checked || sel === null) return; place[sel] = bid; sel = null; render(); };
    root.querySelectorAll('.bucket').forEach(b => {
      b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
      b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', e => { e.preventDefault(); b.classList.remove('over'); const id = +e.dataTransfer.getData('text/plain'); sel = isNaN(id) ? sel : id; drop(b.dataset.b); });
      b.addEventListener('click', e => { if (!e.target.closest('.dchip')) drop(b.dataset.b); });
    });
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', e => { e.preventDefault(); const id = +e.dataTransfer.getData('text/plain'); if (!isNaN(id) && !checked) { place[id] = null; sel = null; render(); } });
    root.querySelector('#chk').onclick = () => {
      const placed = items.filter(x => place[x.id] !== null).length;
      const res = root.querySelector('#res');
      if (placed < items.length) { res.innerHTML = `<div class="why">Còn ${items.length - placed} thẻ chưa đặt. Hãy đặt hết rồi kiểm tra nhé.</div>`; return; }
      checked = true; render();
      const good = items.filter(x => place[x.id] === x.b).length;
      if (good === items.length) DL.setProgress(lesson.id, { sort: true });
      res.innerHTML = `<div class="why" style="border-color:${good === items.length ? 'var(--ok)' : 'var(--warm)'}"><b>${good}/${items.length} thẻ đúng.</b> ${good === items.length ? '🎉 Hoàn hảo!' : 'Thẻ đỏ là chưa đúng cột — bấm “Làm lại” để thử lần nữa.'}</div>`;
    };
    root.querySelector('#rst').onclick = () => { items.forEach(x => place[x.id] = null); sel = null; checked = false; root.querySelector('#res').innerHTML = ''; render(); };
    render();
  };

  /* ---------------- Sắp xếp thứ tự các bước ---------------- */
  DL.order = function (root, lesson) {
    const sets = lesson.order;
    let cur = 0;
    function mount() {
      const set = sets[cur];
      let list = shuffle(set.steps.map((t, i) => ({ t, i })));
      if (list.every((x, k) => x.i === k)) list.reverse();
      let sel = null, checked = false, dragFrom = null;
      root.innerHTML = `<div class="pcard">
        <div class="sub-tabs">${sets.map((s, k) => `<button class="tab" style="min-height:44px" data-k="${k}" aria-pressed="${k === cur}"><b>${k + 1}</b><span>${s.title}</span></button>`).join('')}</div>
        <p class="muted">${set.intro} Kéo thả (hoặc dùng nút ▲▼) để xếp đúng thứ tự.</p>
        <ul class="olist" id="ol"></ul>
        <div class="fc-act" style="margin-top:14px"><button class="btn pri" id="chk">Kiểm tra</button><button class="btn" id="rst">Xáo lại</button></div>
        <div id="res" style="margin-top:14px"></div></div>`;
      root.querySelectorAll('.sub-tabs .tab').forEach(b => b.onclick = () => { cur = +b.dataset.k; mount(); });
      const ol = root.querySelector('#ol');
      const move = (a, b) => { if (b < 0 || b >= list.length) return; const [x] = list.splice(a, 1); list.splice(b, 0, x); draw(); };
      function draw() {
        ol.innerHTML = '';
        list.forEach((x, k) => {
          const li = document.createElement('li');
          li.draggable = !checked;
          if (checked) li.classList.add(x.i === k ? 'ok' : 'no');
          li.innerHTML = `<span class="pos">${k + 1}</span><span>${x.t}</span><span class="mv"><button aria-label="Lên">▲</button><button aria-label="Xuống">▼</button></span>`;
          const [up, dn] = li.querySelectorAll('button');
          up.onclick = e => { e.stopPropagation(); if (!checked) move(k, k - 1); };
          dn.onclick = e => { e.stopPropagation(); if (!checked) move(k, k + 1); };
          li.addEventListener('dragstart', e => { dragFrom = k; e.dataTransfer.setData('text/plain', k); li.classList.add('dragging'); });
          li.addEventListener('dragend', () => li.classList.remove('dragging'));
          li.addEventListener('dragover', e => e.preventDefault());
          li.addEventListener('drop', e => { e.preventDefault(); if (dragFrom !== null && !checked) { const f = dragFrom; dragFrom = null; move(f, k); } });
          ol.appendChild(li);
        });
      }
      draw();
      root.querySelector('#chk').onclick = () => {
        checked = true; draw();
        const good = list.filter((x, k) => x.i === k).length;
        if (good === list.length) { const p = DL.progress(lesson.id); DL.setProgress(lesson.id, { order: Math.max(p.order, 1) }); }
        root.querySelector('#res').innerHTML = `<div class="why" style="border-color:${good === list.length ? 'var(--ok)' : 'var(--warm)'}"><b>${good}/${list.length} bước đúng vị trí.</b> ${good === list.length ? '🎉 Đúng thứ tự!' : 'Xanh là đúng, đỏ là sai vị trí. Bấm “Xáo lại” để thử lại.'}</div>`;
      };
      root.querySelector('#rst').onclick = mount;
    }
    mount();
  };

  window.DL = DL;
})();
