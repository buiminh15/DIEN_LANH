/* MÁY GIẶT — BÀI 8: PHẦN CƠ (BỘ SỐ / LY HỢP CỬA TRÊN, CẤU TẠO CỬA TRƯỚC) (biên soạn từ docs/may_giat/Bai_8.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const PARTS = {
    pulley: ['Puli + dây curoa', 'Nhận chuyển động từ động cơ. Dây curoa tuột/ chùng → động cơ có dòng nhưng mâm không quay.'],
    cone: ['Đầu côn dưới / trên', 'Hai “quả côn” nằm nối đuôi nhau, được <b>lò xo côn</b> bó chặt quanh cả hai khi vắt. Đầu côn dưới nối trục trung gian dưới và puli; đầu côn trên nối trục trong ra mâm.'],
    spring: ['Lò xo côn (lò xo ly hợp)', 'Giặt: chỉ <b>nới/ bó đầu côn dưới</b> nên mâm quay riêng. Vắt: bó cả 2 đầu côn → mâm và lồng quay cùng nhau. Lắp lò xo phải đúng chiều xoắn.'],
    lever: ['Cần ly hợp + vít chỉnh', 'Van xả kéo cần ly hợp; vít chỉnh quyết định hành trình để mỏ cò nhả ra hoàn toàn.'],
    beak: ['Mỏ cò + bánh răng khế', 'Giặt: mỏ cò <b>khóa bánh răng khế</b> giữ lồng đứng yên (chỉ nới lò xo khi quay một chiều). Vắt: cần kéo mỏ cò <b>nhả</b> → lồng được quay.'],
    gear: ['Bánh răng giảm tốc', 'Bằng nhựa, ngâm dầu. Giảm tốc khoảng <b>4 – 5 lần</b> cho mâm giặt. Mất dầu/ mòn răng → kêu, không giặt được.'],
    bearing: ['Vòng bi một chiều', 'Chỉ cho lồng quay <b>một chiều</b> (chiều bị cuốn theo nước). Chiều còn lại bị giữ để lồng không xoay ngược do quán tính.'],
    brake: ['Phanh (má phanh lò xo)', 'Khi cắt điện, má phanh ôm cụm bộ số làm lồng <b>dừng ngay</b> – an toàn khi mở nắp. Phanh mòn/ cháy → lồng chạy trớn khá lâu.'],
    seal: ['Phốt chống nước', 'Ngăn nước từ thùng chảy xuống bộ số và ra sàn. Phốt hỏng → nước vào dầu, mất dầu, vết dầu văng dưới máy.']
  };
  const FRONT = {
    drum: ['Lồng + thùng chứa', 'Lồng quay trục nằm ngang bên trong thùng chứa nước (thùng nhựa/ inox). Cánh gạt trên thành lồng đảo đồ.'],
    spring: ['Lò xo treo + giảm chấn', 'Treo cả khối thùng – động cơ lơ lửng, kết hợp <b>giảm chấn (nhún)</b> hạn chế rung khi vắt. Hỏng → rung lắc, kêu.'],
    weight: ['Khối bê tông đối trọng', 'Hai khối bê tông (trên và trước) dằn thùng, giữ máy thăng bằng. Thường là đối trọng nặng hơn nhiều so với máy cửa trên; lỏng/ nứt → rung mạnh.'],
    bear: ['Mặt bích + trục cơ + 2 vòng bi', 'Trục cơ gắn lồng, xuyên qua mặt bích, đỡ bởi <b>2 vòng bi</b> (kèm phốt). Hỏng vòng bi → kêu ro ro khi quay; phải tháo toàn bộ để thay.'],
    belt: ['Puli lớn + dây curoa', 'Động cơ (2-in-1, vành góp, hoặc truyền động trực tiếp) kéo puli lớn làm quay lồng.']
  };
  const NOISE = {
    a: ['Giặt bình thường, VẮT thì kêu/ rung', 'Mất cân bằng: kê chân không phẳng, đồ giặt dồn một phía, vành nước muối rò, lò xo treo hỏng.', 'Kiểm tra độ cân (nước phẳng/ thước thủy), phân bố lại đồ, kiểm tra 4 lò xo.'],
    b: ['Tháo dây curoa thì HẾT kêu', 'Hỏng vòng bi/ trục cơ, thùng chứa kẹt vật lạ → lỗi phần cơ của lồng.', 'Tháo máy thay vòng bi, phốt; vệ sinh thùng.'],
    c: ['Tháo dây curoa mà VẪN kêu', 'Lỗi từ động cơ: vòng bi động cơ khô, rơ.', 'Thay vòng bi động cơ hoặc động cơ.'],
    d: ['Mỗi lần đảo chiều lại “quỳnh” kêu', 'Dây curoa trơn/ mòn, tuột.', 'Thay/ căng lại dây curoa.'],
    e: ['Cửa trên: có vết dầu dưới máy, không giặt/ kêu', 'Mất dầu bộ số do phốt hỏng; bánh răng nhựa mòn, vỡ.', 'Thay phốt, bơm dầu, thay bánh răng; nếu hỏng nhiều thay bộ số.']
  };

  function clutchSVG(mode) {
    const spin = (on, rev) => on ? `class="fan" style="transform-origin:center;transform-box:fill-box;animation-direction:${rev ? 'reverse' : 'normal'}"` : '';
    const v = mode === 'spin';
    return `<svg viewBox="0 0 460 280" role="img" aria-label="Bộ số máy giặt ở chế độ ${v ? 'vắt' : 'giặt'}">
      <rect x="20" y="20" width="420" height="34" rx="8" fill="var(--surface2)" stroke="var(--ink)" stroke-width="2"/><text class="fl" x="230" y="42" text-anchor="middle">LỒNG GIẶT (trục ngoài) — ${v ? 'ĐANG QUAY' : 'đứng yên'}</text>
      ${v ? '<path d="M30 62v-8M60 62v-8M90 62v-8" stroke="var(--cold)" stroke-width="3"/>' : ''}
      <rect x="150" y="60" width="160" height="30" rx="6" fill="${v ? 'var(--cold)' : 'var(--cold-l)'}"/><text class="fl" x="230" y="80" text-anchor="middle" style="fill:var(--ink)">MÂM GIẶT (trục trong) quay</text>
      <rect x="170" y="100" width="120" height="76" rx="10" fill="var(--warm)" stroke="var(--ink)" stroke-width="3" opacity=".9"/>
      <text class="fl" x="230" y="124" text-anchor="middle" style="fill:var(--ink)">lò xo côn</text><text class="fl" x="230" y="148" text-anchor="middle" style="fill:var(--ink)">${v ? 'BÓ CẢ HAI ĐẦU CÔN' : 'chỉ bó đầu côn dưới'}</text>
      <path d="M170 190h-60" stroke="var(--ink)" stroke-width="5"/><rect x="40" y="170" width="70" height="40" rx="8" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><text class="fl" x="75" y="194" text-anchor="middle">mỏ cò</text>
      <path d="M110 190${v ? 'l-22-24' : 'h0'}" stroke="${v ? 'var(--ok)' : 'var(--bad)'}" stroke-width="5"/>
      <text class="fl" x="75" y="228" text-anchor="middle" style="fill:${v ? 'var(--ok)' : 'var(--bad)'}">${v ? 'NHẢ bánh khế' : 'KHÓA bánh khế'}</text>
      <rect x="320" y="170" width="110" height="40" rx="8" fill="${v ? 'var(--hot)' : 'var(--surface2)'}" stroke="var(--ink)" stroke-width="3"/><text class="fl" x="375" y="194" text-anchor="middle" style="fill:var(--ink)">cần ly hợp</text>
      <text class="fl" x="375" y="228" text-anchor="middle">${v ? 'van xả KÉO' : 'van xả nghỉ'}</text>
      <text class="sub" x="230" y="268" text-anchor="middle" style="fill:var(--ink)">${v ? 'Động cơ quay 1 chiều (chiều siết lò xo) → mâm + lồng cùng quay nhanh' : 'Động cơ quay 2 chiều chậm → chỉ mâm quay (đảo nước)'}</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-top" data-toc="1 · Bộ số cửa trên">
  <div class="sec-n">Phần 1</div><h2>Phần cơ máy giặt cửa trên: bộ số (ly hợp)</h2>
  <p>Bộ số nằm <b>dưới thùng chứa</b>, nối với <b>mâm</b> và <b>lồng</b> ở phía trên, nhận chuyển động từ động cơ qua <b>puli + dây curoa</b>. Nhiệm vụ: khi <b>giặt</b> chỉ cho mâm quay (hai chiều, chậm); khi <b>vắt</b> cho mâm và lồng quay cùng một chiều, nhanh.</p>
  <div class="stage"><div id="cSvg" style="padding:6px"></div><div class="controls"><button class="btn pri sm" id="mWash" aria-pressed="true">🧺 Chế độ GIẶT</button><button class="btn sm" id="mSpin" aria-pressed="false">🌀 Chế độ VẮT</button></div><div class="verdict" id="cV" style="margin:0 14px 12px"></div></div>
  <div class="callout"><span class="ic">🧠</span><div><b class="t">Mấu chốt cần nhớ</b><p>Chiều quay của động cơ khi vắt <b>phải đúng chiều siết lò xo côn</b>. Lò xo được siết càng chặt khi quay càng nhanh. Lắp sai chiều lò xo → ly hợp “ăn” ngược, máy giặt không vắt được.</p></div></div>
  <h3 style="margin-top:22px">Các chi tiết bên trong – bấm xem</h3>
  <div id="pTabs"></div><article class="panel" id="pPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-flow" data-toc="2 · Nguyên lý">
  <div class="sec-n">Phần 2</div><h2>Nguyên lý làm việc</h2>
  <div class="grid2"><div class="panel" style="margin:0;border-left-color:var(--cold)"><h4>Chế độ GIẶT (van xả không làm việc)</h4><ol style="margin:6px 0 0;padding-left:20px"><li>Lò xo ở cần ly hợp đẩy <b>mỏ cò</b> khóa bánh răng khế.</li><li>Động cơ quay hai chiều → puli → trục dưới.</li><li>Lò xo côn chỉ truyền lên <b>trục trên qua bánh răng giảm tốc (4–5 lần)</b>.</li><li>Mâm quay đảo chiều → nước xoáy.</li></ol></div>
    <div class="panel warm" style="margin:0"><h4>Chế độ VẮT (van xả kéo cần)</h4><ol style="margin:6px 0 0;padding-left:20px"><li>Nước xả hết, van xả kéo <b>cần ly hợp</b>.</li><li>Cần đẩy mỏ cò <b>nhả</b> bánh răng khế và thả phanh.</li><li>Động cơ quay một chiều → lò xo côn siết cả hai đầu côn.</li><li>Mâm và lồng cùng quay nhanh → văng nước.</li></ol></div></div>
  <div class="callout"><span class="ic">🛑</span><div><b class="t">Vì sao tắt điện lồng dừng gần như ngay?</b><p>Khi van xả hết kéo, <b>má phanh</b> ôm cụm bộ số. Nếu không có phanh, lồng chứa đầy đồ sẽ chạy trớn rất lâu — nguy hiểm khi mở nắp. Phanh mòn thì lồng không dừng kịp, còn phanh quá chặt sẽ làm máy xê dịch.</p></div></div>
</section>

<section class="sec" id="s-front" data-toc="3 · Cửa trước">
  <div class="sec-n">Phần 3</div><h2>Phần cơ máy giặt cửa trước (lồng ngang)</h2>
  <p>Đơn giản hơn: <b>không có bộ số</b>. Lồng nối thẳng với <b>puli lớn</b> qua <b>trục cơ</b>. Giặt: động cơ quay hai chiều tốc độ thấp, kiểu quay vài chục giây rồi nghỉ, đảo chiều. Vắt: quay một chiều tốc độ cao (~1000 – 1200 vòng/phút).</p>
  <div id="fTabs"></div><article class="panel warm" id="fPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">⚖️</span><div><b class="t">Chiều quay không quan trọng</b><p>Với máy cửa trước chỉ có một lồng, quay thuận hay ngược khi vắt đều được — chiều quay phụ thuộc cấu tạo động cơ, không phải “phải theo chiều kim đồng hồ”.</p></div></div>
</section>

<section class="sec" id="s-noise" data-toc="4 · Tiếng kêu">
  <div class="sec-n">Phần 4</div><h2>🩺 Phán đoán qua tiếng kêu</h2>
  <p>Hư hỏng phần cơ thường biểu hiện bằng <b>tiếng kêu</b>. Chọn triệu chứng:</p>
  <div id="nTabs"></div><article class="panel" id="nPanel" style="border-left-color:var(--bad)"></article>
  <div class="callout"><span class="ic">🔧</span><div><b class="t">Thứ tự tháo/ lắp khi thay vòng bi cửa trước</b><p>Tháo dây curoa → tháo động cơ → tháo ống cấp/ xả, giữ lại các giắc điện → đưa khối thùng ra → tháo thùng chứa → ép bỏ 2 vòng bi cũ → vệ sinh, tra mỡ → lắp lại. Nguyên tắc: <b>tháo sau thì lắp trước</b>.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 7 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Bộ số (ly hợp) cửa trên: giặt chỉ mâm quay hai chiều; vắt mâm + lồng quay một chiều.</b></div></li>
    <li class="done"><div><b>Giặt: mỏ cò khóa bánh răng khế; Vắt: van xả kéo cần ly hợp → mỏ cò nhả.</b></div></li>
    <li class="done"><div><b>Lò xo côn bó đầu côn; chiều quay vắt phải trùng chiều siết lò xo.</b></div></li>
    <li class="done"><div><b>Bánh răng giảm tốc 4–5 lần; mất dầu → kêu, hỏng.</b></div></li>
    <li class="done"><div><b>Vòng bi một chiều + phanh: lồng quay một chiều, dừng nhanh khi tắt.</b></div></li>
    <li class="done"><div><b>Cửa trước: không bộ số; lò xo treo, giảm chấn, bê tông đối trọng, 2 vòng bi.</b></div></li>
    <li class="done"><div><b>Tháo dây curoa: hết kêu → lỗi phần cơ; còn kêu → lỗi động cơ.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/8/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    let mode = 'wash';
    const dr = () => { $('#cSvg', root).innerHTML = clutchSVG(mode); $('#mWash', root).setAttribute('aria-pressed', mode === 'wash'); $('#mSpin', root).setAttribute('aria-pressed', mode === 'spin'); const v = $('#cV', root); v.className = 'verdict ' + (mode === 'spin' ? 'ok' : ''); v.textContent = mode === 'spin' ? 'Vắt: lò xo côn bó cả hai đầu côn; mỏ cò nhả; mâm và lồng cùng quay.' : 'Giặt: mỏ cò khóa lồng; chỉ mâm quay hai chiều.'; };
    $('#mWash', root).onclick = () => { mode = 'wash'; dr(); }; $('#mSpin', root).onclick = () => { mode = 'spin'; dr(); }; dr();
    U.tabset($('#pTabs', root), Object.entries(PARTS).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#pPanel', root).innerHTML = `<h3>${PARTS[id][0]}</h3><p style="margin:0">${PARTS[id][1]}</p>`; });
    U.tabset($('#fTabs', root), Object.entries(FRONT).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#fPanel', root).innerHTML = `<h3>${FRONT[id][0]}</h3><p style="margin:0">${FRONT[id][1]}</p>`; });
    U.tabset($('#nTabs', root), Object.entries(NOISE).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { const f = NOISE[id]; $('#nPanel', root).innerHTML = `<h3>${f[0]}</h3><p><b>Nguyên nhân:</b> ${f[1]}</p><p style="margin:0"><b>Xử lý:</b> ${f[2]}</p>`; });
  }

  const flashcards = [
    { f: 'Bộ số máy giặt còn gọi là?', b: 'Bộ ly hợp.', tag: 'Bộ số' },
    { f: 'Bộ số nằm ở đâu?', b: 'Dưới thùng chứa, nối với mâm và lồng ở trên.', tag: 'Bộ số' },
    { f: 'Giặt: bộ phận nào quay?', b: 'Chỉ mâm, hai chiều, chậm.', tag: 'Nguyên lý' },
    { f: 'Vắt: bộ phận nào quay?', b: 'Mâm + lồng, một chiều, nhanh.', tag: 'Nguyên lý' },
    { f: 'Mỏ cò làm gì khi giặt?', b: 'Khóa bánh răng khế giữ lồng đứng yên.', tag: 'Cấu tạo' },
    { f: 'Khi vắt mỏ cò thế nào?', b: 'Cần ly hợp bị kéo → mỏ cò nhả.', tag: 'Nguyên lý' },
    { f: 'Ai kéo cần ly hợp?', b: 'Van xả.', tag: 'Nguyên lý' },
    { f: 'Vít chỉnh ly hợp để làm gì?', b: 'Chỉnh hành trình kéo cho mỏ cò nhả hết.', tag: 'Cấu tạo' },
    { f: 'Lò xo côn làm gì?', b: 'Bó đầu côn: giặt chỉ đầu dưới, vắt cả hai.', tag: 'Cấu tạo' },
    { f: 'Lắp lò xo côn cần lưu ý?', b: 'Đúng chiều xoắn; sai chiều → không vắt.', tag: 'Cấu tạo' },
    { f: 'Chiều quay động cơ khi vắt?', b: 'Là chiều siết lò xo côn.', tag: 'Nguyên lý' },
    { f: 'Bánh răng giảm tốc giảm khoảng?', b: '4 – 5 lần.', tag: 'Cấu tạo' },
    { f: 'Bánh răng số làm bằng gì?', b: 'Nhựa, ngâm dầu.', tag: 'Cấu tạo' },
    { f: 'Dấu hiệu mất dầu bộ số?', b: 'Vết dầu văng dưới máy.', tag: 'Hư hỏng' },
    { f: 'Vòng bi một chiều để?', b: 'Lồng chỉ quay một chiều khi giặt.', tag: 'Cấu tạo' },
    { f: 'Phanh bộ số để?', b: 'Dừng lồng ngay khi tắt, an toàn.', tag: 'Cấu tạo' },
    { f: 'Phanh mòn gây?', b: 'Lồng chạy trớn lâu.', tag: 'Hư hỏng' },
    { f: 'Phốt chống nước để?', b: 'Không cho nước xuống bộ số.', tag: 'Cấu tạo' },
    { f: 'Vành nước muối để?', b: 'Đối trọng cân bằng khi vắt.', tag: 'Cấu tạo' },
    { f: 'Cửa trước có bộ số không?', b: 'Không; lồng nối trực tiếp puli lớn.', tag: 'Cửa trước' },
    { f: 'Giặt cửa trước quay thế nào?', b: 'Hai chiều chậm, quay – nghỉ – đảo.', tag: 'Cửa trước' },
    { f: 'Vắt cửa trước?', b: 'Một chiều tốc độ cao.', tag: 'Cửa trước' },
    { f: 'Máy cửa trước treo bằng?', b: 'Lò xo treo + giảm chấn.', tag: 'Cửa trước' },
    { f: 'Khối bê tông để làm gì?', b: 'Đối trọng giữ thăng bằng.', tag: 'Cửa trước' },
    { f: 'Trục cơ cửa trước có mấy vòng bi?', b: '2.', tag: 'Cửa trước' },
    { f: 'Tháo dây curoa hết kêu?', b: 'Lỗi phần cơ (vòng bi, trục, thùng).', tag: 'Chẩn đoán' },
    { f: 'Tháo dây curoa vẫn kêu?', b: 'Lỗi động cơ.', tag: 'Chẩn đoán' },
    { f: 'Đảo chiều lại kêu “quỳnh”?', b: 'Dây curoa mòn/ trơn.', tag: 'Chẩn đoán' },
    { f: 'Nguyên tắc tháo lắp?', b: 'Tháo sau thì lắp trước.', tag: 'Sửa chữa' },
    { f: 'Giặt tốt, vắt kêu rung?', b: 'Mất cân bằng: kê chân, đồ dồn, lò xo treo.', tag: 'Chẩn đoán' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Bộ số còn gọi là?', ['Bộ ly hợp', 'Bộ lọc', 'Bộ nguồn', 'Bộ điều tốc'], 0, 'Ghép mâm – lồng.'),
    Q('Khi giặt, chỉ bộ phận nào quay?', ['Mâm', 'Mâm + lồng', 'Lồng', 'Không'], 0, 'Đảo nước.'),
    Q('Khi vắt?', ['Mâm + lồng cùng quay', 'Chỉ mâm', 'Chỉ lồng', 'Đứng yên'], 0, 'Lò xo bó 2 đầu côn.'),
    Q('Mỏ cò khóa bánh răng khế khi?', ['Giặt', 'Vắt', 'Tắt điện', 'Xả'], 0, 'Giữ lồng.'),
    Q('Ai kéo cần ly hợp?', ['Van xả', 'Van cấp', 'Bơm', 'Phao'], 0, 'Khi vắt.'),
    Q('Lò xo côn bó?', ['Đầu côn', 'Mâm', 'Dây curoa', 'Phao'], 0, 'Truyền chuyển động.'),
    Q('Lò xo côn lắp sai chiều?', ['Không vắt được', 'Vắt tốt hơn', 'Không ảnh hưởng', 'Giặt mạnh hơn'], 0, 'Ly hợp không ăn.'),
    Q('Chiều quay vắt?', ['Là chiều siết lò xo', 'Ngược lò xo', 'Tùy ý', 'Hai chiều'], 0, 'Siết khi quay nhanh.'),
    Q('Giảm tốc của bánh răng số?', ['4–5 lần', '50 lần', '1,1 lần', 'Không giảm'], 0, 'Cho mâm.'),
    Q('Bánh răng số làm bằng?', ['Nhựa ngâm dầu', 'Sắt khô', 'Cao su', 'Gỗ'], 0, 'Cần dầu.'),
    Q('Vết dầu dưới máy là do?', ['Mất dầu bộ số', 'Nước xả', 'Bột giặt', 'Bình thường'], 0, 'Phốt hỏng.'),
    Q('Vòng bi một chiều giúp?', ['Lồng quay một chiều', 'Quay hai chiều', 'Cấp nước', 'Tăng ồn'], 0, 'Chống xoay ngược.'),
    Q('Phanh để?', ['Dừng lồng ngay khi tắt', 'Tăng tốc', 'Làm mát', 'Cấp nước'], 0, 'An toàn.'),
    Q('Phanh mòn thì?', ['Lồng chạy trớn lâu', 'Dừng ngay', 'Quay nhanh hơn', 'Không đổi'], 0, 'Không hãm kịp.'),
    Q('Phốt hỏng gây?', ['Nước vào bộ số, mất dầu', 'Ồn êm hơn', 'Tăng áp', 'Giặt sạch hơn'], 0, 'Chống nước.'),
    Q('Cửa trước có bộ số không?', ['Không', 'Có', '2 bộ', 'Tùy ý'], 0, 'Lồng nối trực tiếp.'),
    Q('Khối bê tông dùng?', ['Đối trọng', 'Chứa nước', 'Cấp nhiệt', 'Lọc xơ'], 0, 'Giữ thăng bằng.'),
    Q('Cửa trước có bao nhiêu vòng bi ở trục?', ['2', '1', '3', '0'], 0, 'Đỡ trục cơ.'),
    Q('Giặt cửa trước quay?', ['Hai chiều chậm', 'Một chiều nhanh', 'Đứng yên', 'Chỉ ngược'], 0, 'Đảo đồ.'),
    Q('Tháo dây curoa, hết kêu: lỗi?', ['Phần cơ', 'Động cơ', 'Bo mạch', 'Van cấp'], 0, 'Vòng bi, thùng.'),
    Q('Tháo dây curoa vẫn kêu: lỗi?', ['Động cơ', 'Vòng bi lồng', 'Thùng chứa', 'Phốt'], 0, 'Vòng bi động cơ.'),
    Q('Đảo chiều kêu “quỳnh”?', ['Dây curoa', 'Phao', 'Van', 'Bơm'], 0, 'Mòn/ trơn.'),
    Q('Nguyên tắc tháo lắp?', ['Tháo sau lắp trước', 'Tháo trước lắp trước', 'Không cần', 'Thay tất cả'], 0, 'Đảo ngược.'),
    Q('Vắt kêu rung, giặt bình thường?', ['Mất cân bằng', 'Hỏng van cấp', 'Hỏng bo', 'Hết nước'], 0, 'Kiểm tra cân, lò xo.')
  ];
  const sort = {
    title: 'Chế độ giặt hay vắt?',
    buckets: [{ id: 'wash', name: 'GIẶT' }, { id: 'spin', name: 'VẮT' }, { id: 'front', name: 'Cửa trước' }],
    items: [
      { t: 'Mỏ cò khóa bánh răng khế', b: 'wash' }, { t: 'Van xả không làm việc', b: 'wash' }, { t: 'Chỉ mâm quay hai chiều', b: 'wash' },
      { t: 'Van xả kéo cần ly hợp', b: 'spin' }, { t: 'Lò xo bó cả 2 đầu côn', b: 'spin' }, { t: 'Mâm + lồng cùng quay', b: 'spin' }, { t: 'Phanh nhả', b: 'spin' },
      { t: 'Không có bộ số', b: 'front' }, { t: 'Khối bê tông đối trọng', b: 'front' }, { t: '2 vòng bi + mặt bích', b: 'front' }, { t: 'Lò xo treo + giảm chấn', b: 'front' }
    ]
  };
  const order = [
    { title: 'Máy cửa trên chuyển sang vắt', intro: 'Từ cuối giặt đến vắt.', steps: ['Kết thúc giặt, van xả xả nước bẩn', 'Cảm biến báo hết nước', 'Van xả kéo cần ly hợp', 'Mỏ cò nhả bánh răng khế', 'Động cơ quay một chiều siết lò xo côn', 'Mâm và lồng cùng quay nhanh'] },
    { title: 'Chẩn đoán tiếng kêu', intro: 'Phân biệt cơ và động cơ.', steps: ['Rút điện', 'Tháo dây curoa', 'Cấp điện, nghe động cơ chạy không tải', 'Còn kêu → lỗi động cơ', 'Hết kêu → lỗi phần cơ lồng', 'Tháo kiểm tra vòng bi/ trục/ thùng'] },
    { title: 'Thay vòng bi cửa trước', intro: 'Nguyên tắc tháo trước – lắp sau.', steps: ['Tháo dây curoa', 'Tháo động cơ', 'Tháo ống cấp, ống xả, giắc điện', 'Đưa khối thùng ra ngoài', 'Tháo thùng chứa, ép vòng bi cũ', 'Vệ sinh, tra mỡ, lắp vòng bi mới rồi lắp ngược lại'] }
  ];
  DL.register({
    cat: 'may-giat', id: 8, ready: true, title: 'Phần cơ: bộ số và cửa trước', sub: 'Ly hợp, mỏ cò, lò xo côn, vòng bi, tiếng kêu', minutes: 30,
    lead: 'Bộ số (bộ ly hợp) quyết định mâm, lồng quay thế nào khi giặt và vắt; máy cửa trước thì đơn giản hơn nhưng nặng đối trọng. Học nguyên lý qua mô phỏng và cách đoán hỏng qua tiếng kêu.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
