/* BÀI 7 — RƠLE KHỞI ĐỘNG (RƠLE DÒNG / ĐIỆN TỪ) (biên soạn từ docs/Bai_7.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const RELAYS = [['1/12 HP', .45], ['1/10 HP', .75], ['1/8 HP', .85], ['1/6 HP', 1.0], ['1/5 HP', 1.15], ['1/2 HP', 1.5]];
  const IM = .95; // block 1/6 HP, dòng định mức 0,95 A

  function relaySVG(closed, I) {
    const k = closed ? 'var(--ok)' : 'var(--muted)';
    return `<svg viewBox="0 0 560 250" role="img" aria-label="Mạch rơle dòng: tiếp điểm ${closed ? 'đóng' : 'mở'}">
      <circle cx="50" cy="130" r="22" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><text class="lbl" x="50" y="135" text-anchor="middle">~220V</text>
      <path d="M50 108V50H120" fill="none" stroke="var(--warm)" stroke-width="4"/><path class="flow" d="M50 108V50H120" stroke="#fff" stroke-width="2.5"/>
      <rect x="120" y="30" width="110" height="40" rx="8" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="3"/><text class="sub" x="175" y="55" text-anchor="middle" style="fill:var(--ink)">cuộn rơle</text>
      <path d="M230 50H330" fill="none" stroke="var(--warm)" stroke-width="4"/><path class="flow" d="M230 50H330" stroke="#fff" stroke-width="2.5"/>
      <rect x="330" y="30" width="130" height="40" rx="10" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="3"/><text class="sub" x="395" y="55" text-anchor="middle" style="fill:var(--ink)">cuộn chạy (R)</text>
      <path d="M460 50H520V130" fill="none" stroke="var(--warm)" stroke-width="4"/>
      <path d="M280 50V150H330" fill="none" stroke="${k}" stroke-width="4"/>${closed ? '<path class="flow" d="M280 50V150H330" stroke="#fff" stroke-width="2.5"/>' : ''}
      <rect x="330" y="130" width="130" height="40" rx="10" fill="var(--hot-tint)" stroke="var(--hot)" stroke-width="3"/><text class="sub" x="395" y="155" text-anchor="middle" style="fill:var(--ink)">cuộn đề (S)</text>
      <path d="M460 150H520V130" fill="none" stroke="${k}" stroke-width="4"/><path d="M520 130V200H50V152" fill="none" stroke="var(--warm)" stroke-width="4"/>
      <circle cx="520" cy="130" r="5" fill="var(--ink)"/><text class="fl" x="530" y="128">C</text>
      <path d="M280 95${closed ? 'V115' : 'L302 110'}" stroke="var(--ink)" stroke-width="5"/><circle cx="280" cy="95" r="4" fill="var(--ink)"/><circle cx="280" cy="118" r="4" fill="var(--ink)"/>
      <text class="lbl" x="316" y="108">K</text><text class="sub" x="316" y="126">tiếp điểm thường mở</text>
      <text class="lbl" x="280" y="232" text-anchor="middle" style="fill:${closed ? 'var(--ok)' : 'var(--muted)'}">${closed ? 'K ĐÓNG: cuộn đề có điện' : 'K MỞ: cuộn đề không có điện'}</text>
      <text class="sub" x="100" y="22">dòng cuộn rơle ≈ ${I.toFixed(2)} A</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-why" data-toc="1 · Công dụng">
  <div class="sec-n">Phần 1</div><h2>Rơle khởi động làm gì?</h2>
  <p>Động cơ block có 3 chân C – R – S (xem Bài 5). Cuộn đề S chỉ có điện qua <b>công tắc K</b> — chính là <b>rơle khởi động</b>. Có hai tình huống:</p>
  <div class="grid2"><div class="panel hotc" style="margin:0"><h4>K mở</h4><p style="margin:6px 0 0">Dòng chỉ qua <b>cuộn chạy</b> → từ trường song song với lõi sắt, <b>không có từ trường quay</b> → block <b>đứng yên</b>, dòng rất cao.</p></div>
    <div class="panel okc" style="margin:0"><h4>K đóng</h4><p style="margin:6px 0 0">Dòng qua <b>cả hai cuộn</b> → sinh <b>từ trường lệch pha</b> (quay) → rô-to quay. Rô-to đạt <b>70 – 75%</b> tốc độ thì K <b>mở</b> để bảo vệ cuộn đề (dây nhỏ, ít vòng).</p></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Chức năng</b><p>Rơle khởi động <b>tự động đóng</b> khi khởi động và <b>tự động ngắt</b> khi block đạt tốc độ → kết thúc một chu kỳ khởi động.</p></div></div>
  <h3 style="margin-top:22px">Hai loại rơle khởi động trên thị trường</h3>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Rơle dòng (điện từ, cơ khí)</h4><p style="margin:6px 0 0">Bài này. Còn gọi rơle cuộn dây. Có lõi sắt từ rơi/hút.</p></div><div class="panel warm" style="margin:0"><h4>Rơle bán dẫn (điện tử, PTC)</h4><p style="margin:6px 0 0">Học ở <a href="#/tu-lanh/8">Bài 8</a>.</p></div></div>
</section>

<section class="sec" id="s-build" data-toc="2 · Cấu tạo">
  <div class="sec-n">Phần 2</div><h2>Cấu tạo rơle dòng</h2>
  <p>Gồm <b>3 phần chính</b>: <b>cuộn dây</b> (nối tiếp với cuộn chạy), <b>lõi sắt từ</b> chuyển động, và <b>tiếp điểm thường mở (NO)</b>. Chi tiết: ① nắp ② tiếp điểm tĩnh ③ tiếp điểm động ④ cuộn dây ngoài ⑤ lò xo tiếp điểm ⑥ giá đỡ ⑦ lõi sắt từ.</p>
  <h3>Phân loại theo số chân</h3>
  <div id="pinTabs"></div><article class="panel" id="pinPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">📐</span><div><b class="t">Lắp đúng chiều</b><p>Rơle dòng chỉ làm việc đúng khi <b>tiếp điểm ở trạng thái thường mở</b>: lõi sắt <b>rơi xuống</b> nhờ trọng lực (và lò xo) làm tiếp điểm mở. Khi lắp lên block phải <b>đặt đúng chiều</b>. Có block chân C ở trên, có block chân C ở dưới; nhà sản xuất làm rơle tương thích sẵn nên cứ lắp sao cho tiếp điểm <b>luôn mở</b> lúc ban đầu.</p></div></div>
</section>

<section class="sec" id="s-work" data-toc="3 · Nguyên lý">
  <div class="sec-n">Phần 3</div><h2>Nguyên lý làm việc</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Cấp điện: tiếp điểm đang mở</b><span>Dòng chỉ chạy qua cuộn rơle nối tiếp cuộn chạy. Block chưa quay, dòng <b>cực đại</b>.</span></div></li>
    <li class="done"><div><b>Cuộn rơle sinh từ trường mạnh</b><span>Từ trường tỉ lệ với dòng (B ~ I). Dòng lớn → lực hút lớn → <b>hút lõi sắt lên, đóng tiếp điểm</b>.</span></div></li>
    <li class="done"><div><b>Cuộn đề có điện</b><span>Hai cuộn lệch pha 90° sinh từ trường quay → rô-to quay nhanh dần.</span></div></li>
    <li class="done"><div><b>Rô-to quay nhanh, dòng giảm dần</b><span>Dòng qua cuộn rơle giảm → từ trường yếu đi → hết hút gọi là <b>nhả</b>.</span></div></li>
    <li class="done"><div><b>Đạt 70 – 75% tốc độ: lõi rơi, tiếp điểm mở</b><span>Cuộn đề mất điện → kết thúc một chu kỳ khởi động.</span></div></li>
  </ol>
  <p style="margin-top:14px"><b>Loại 4 chân (có tụ khởi động):</b> tụ nối tiếp với tiếp điểm K. Khi K đóng, tụ nạp – xả, điện áp xả <b>cộng nối tiếp</b> với nguồn → dòng qua cuộn đề ban đầu rất lớn → <b>mô-men khởi động rất lớn</b>, dễ thắng quán tính. K mở thì tụ cũng ngừng nạp xả.</p>
  <h3 style="margin-top:26px">🔬 Mô phỏng: block 1/6 HP (0,95 A) lắp rơle nào?</h3>
  <p>Chọn công suất rơle rồi bấm “Cấp điện”. Rơle đúng khởi động thành công; sai công suất sẽ có hiện tượng khác.</p>
  <div class="stage"><div id="sSvg"></div>
    <div class="controls"><label>Rơle <select id="sRel" class="btn sm" style="min-height:36px">${RELAYS.map((r, i) => `<option value="${i}" ${i === 3 ? 'selected' : ''}>${r[0]} (${r[1].toFixed(2)} A)</option>`).join('')}</select></label><button class="btn pri sm" id="sGo">⚡ Cấp điện</button><button class="btn sm" id="sRs">↺ Làm lại</button></div>
    <div style="padding:0 16px 6px"><div class="muted" style="font-size:14px">Tốc độ rô-to</div><div class="bar" style="height:14px;margin:6px 0"><i id="sSpd" style="width:0;background:var(--ok)"></i></div><div class="muted" id="sInfo" style="font-size:14px"></div></div>
    <div class="verdict" id="sV" style="margin:6px 14px 12px">Bấm “Cấp điện”.</div></div>
</section>

<section class="sec" id="s-fault" data-toc="4 · Hư hỏng">
  <div class="sec-n">Phần 4</div><h2>Hư hỏng và biểu hiện</h2>
  <p>Rơle tốt phải có <b>cả 3 phần</b> tốt: cuộn dây, lõi sắt, tiếp điểm.</p>
  <div id="fTabs"></div><article class="panel hotc" id="fPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">🔎</span><div><b class="t">Đồng hồ kẹp dòng nói gì?</b><p>Block bình thường: kim <b>nhảy lên lớn</b> rồi <b>tụt nhanh</b> về giá trị ≤ định mức. Không chạy + dòng = 0: hở mạch (cuộn rơle đứt, rơle bảo vệ hỏng, mất nguồn...). Không chạy + dòng <b>cao</b>: rơle không đóng (kẹt lõi, tiếp điểm không chạm), hoặc block kẹt. Chạy nhưng <b>dòng vẫn cao</b>: tiếp điểm không nhả.</p></div></div>
</section>

<section class="sec" id="s-test" data-toc="5 · Kiểm tra">
  <div class="sec-n">Phần 5</div><h2>Kiểm tra rơle dòng bằng đồng hồ vạn năng</h2>
  ${U.steps([['Nhìn cuộn dây', 'Có cháy đen, chảy nhựa không? Cuộn rơle lộ ngoài nên quan sát được.'], ['Đặt rơle ở vị trí thường mở', 'Cuộn thang <b>x1 Ω</b>, chập que chỉnh kim về 0.'], ['Đo chân vào – chân M (cuộn dây)', 'Kim lên, R rất nhỏ → cuộn dây <b>không đứt</b>.'], ['Đo chân vào – chân S (tiếp điểm)', 'Ở vị trí thường mở kim <b>không</b> lên là đúng.'], ['Lật ngược rơle rồi đo lại vào – S', 'Lõi sắt rơi xuống đóng tiếp điểm: kim <b>lên</b> → lõi và tiếp điểm tốt; không lên → hỏng.']])}
  <p style="margin-top:14px"><b>Rơle 4 chân:</b> đo một trong hai chân vào với hai chân ra: có một cặp kim lên (cuộn dây). Cặp còn lại (chân vào kia – chân S) không lên; lật rơle thì phải lên. Hoặc nối tắt hai chân vào để biến thành loại 3 chân rồi đo như trên.</p>
  <h3 style="margin-top:26px">🔬 Thực hành đo</h3>
  <div class="panel"><div class="row"><label>Loại rơle <select id="tType" class="btn sm" style="min-height:36px"><option value="3">3 chân (vào – M – S)</option><option value="4">4 chân (V1, V2 – M – S)</option></select></label><button class="btn sm" id="tNew">🔄 Rơle mới (ngẫu nhiên)</button></div>
    <div class="row" id="tBtns" style="margin-top:10px"></div>
    <div class="verdict" id="tOut" style="margin-top:10px;font-family:monospace;min-height:5em">Bấm các phép đo.</div>
    <div class="row" style="margin-top:10px"><b>Kết luận:</b><select id="tAns" class="btn sm" style="min-height:40px"><option value="">— chọn —</option><option value="good">Rơle tốt</option><option value="coil">Đứt cuộn dây</option><option value="core">Kẹt lõi / tiếp điểm không đóng</option><option value="weld">Tiếp điểm dính (luôn thông)</option></select><button class="btn pri sm" id="tChk">Kiểm tra</button></div><div id="tRes" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-swap" data-toc="6 · Thay thế">
  <div class="sec-n">Phần 6</div><h2>Thay thế và lưu ý</h2>
  <p>Chọn rơle theo <b>hình dạng, chủng loại, công suất</b>. Công suất ghi trên thân (VD 1/5 HP 220 V) phải khớp với block. Lý do: cuộn rơle được tính để <b>hút lõi</b> khi dòng lớn hơn một mức nhất định.</p>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Rơle so với block</th><th>Điều gì xảy ra</th></tr></thead><tbody>
    <tr><th>Đúng</th><td><span class="pill ok">Kim kẹp dòng lên cao rồi tụt về ≤ định mức</span> — khởi động thành công</td></tr>
    <tr><th>Nhỏ hơn (VD 1/6 HP lắp cho block lớn hơn)</th><td><span class="pill bad">Dòng chạy bình thường vẫn đủ giữ lõi → <b>tiếp điểm không nhả</b></span>. Block chạy nhưng <b>dòng cao</b>; nếu rơle bảo vệ không ngắt kịp thì <b>cháy cuộn đề</b>.</td></tr>
    <tr><th>Lớn hơn (VD 1/2 HP lắp cho block 1/6 HP)</th><td><span class="pill bad">Dòng khởi động không đủ <b>hút lõi</b> → tiếp điểm không đóng</span>. Cuộn đề không có điện, block <b>không khởi động</b>, dòng cao.</td></tr></tbody></table></div>
  <div class="grid2" style="margin-top:14px"><div class="panel warm" style="margin:0"><h4>Rơle 4 chân không dùng tụ</h4><p style="margin:6px 0 0">Phải <b>nối tắt hai chân tụ</b> (2 chân vào thành 1) để biến thành loại 3 chân. Nếu có tụ mà tụ <b>hỏng hở mạch</b> thì block cũng không khởi động được.</p></div>
    <div class="panel warm" style="margin:0"><h4>Không biết công suất rơle và block?</h4><p style="margin:6px 0 0">Lắp rơle cùng hình dạng, kích thước, cấp điện và nhìn <b>kìm kẹp dòng</b>: ① lên cao rồi <b>tụt về ≤ định mức</b> → hợp. ② lên cao và <b>đứng yên</b> không tụt → rơle <b>lớn hơn</b> block. ③ lên cao rồi tụt nhưng <b>vẫn cao hơn định mức</b> → rơle <b>nhỏ hơn</b> block.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="7 · Tóm tắt">
  <div class="sec-n">Phần 7</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Rơle khởi động là công tắc K tự động cấp điện cho cuộn đề.</b><span>Đóng lúc khởi động, ngắt ở 70–75% tốc độ.</span></div></li>
    <li class="done"><div><b>Rơle dòng: cuộn rơle nối tiếp cuộn chạy, tiếp điểm thường mở.</b><span>Dòng lớn → hút lõi đóng K; dòng giảm → nhả, mở K.</span></div></li>
    <li class="done"><div><b>Có loại 3 chân (không tụ) và 4 chân (có tụ khởi động).</b></div></li>
    <li class="done"><div><b>Hỏng: đứt/chập cuộn dây, kẹt lõi, dính tiếp điểm.</b><span>Biểu hiện: dòng 0 / không chạy dòng cao / chạy dòng cao.</span></div></li>
    <li class="done"><div><b>Đo x1 Ω: vào–M thông; vào–S hở, lật ngược thì thông.</b></div></li>
    <li class="done"><div><b>Thay đúng công suất.</b><span>Nhỏ: không nhả → dòng cao. Lớn: không đóng → không khởi động.</span></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/7/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const PINS = {
    p3: ['Rơle 3 chân (1 vào – 2 ra)', '<p>Một chân <b>vào</b> (nhận nguồn) và hai chân <b>ra</b> nối với chân <b>M</b> (chạy) và <b>S</b> (đề) của block. <b>Không có tụ.</b></p><p class="muted" style="margin:0">Mạch: nguồn → cuộn rơle → cuộn chạy → C. Nhánh K → cuộn đề.</p>'],
    p4: ['Rơle 4 chân (2 vào – 2 ra)', '<p>Hai chân <b>vào</b> (một chân nhận nguồn, một chân nối <b>tụ khởi động</b>) và hai chân <b>ra</b> (M, S). Có <b>tụ kích</b> nối tiếp với K để tăng mô-men khởi động.</p><p class="muted" style="margin:0">Không cần tụ: nối tắt hai chân vào.</p>']
  };
  const FAULTS = {
    coil: ['Cuộn dây rơle cháy / đứt / chập', 'Đứt: không có dòng → <b>block không chạy, dòng = 0</b>. Chập vòng: điện cảm giảm → từ trường yếu, <b>không hút được lõi</b>.'],
    core: ['Kẹt lõi hoặc tiếp điểm không chạm', 'Lõi bị hút nhưng tiếp điểm không đóng → cuộn đề không có điện → <b>block không chạy, dòng RẤT CAO</b> (chỉ cuộn chạy hoạt động).'],
    weld: ['Tiếp điểm dính, không nhả', 'Block <b>chạy</b> nhưng cuộn đề luôn có điện → hai tải chạy cùng lúc → <b>dòng cao</b>, cuộn đề nóng, nếu rơle bảo vệ không ngắt kịp sẽ cháy.']
  };

  function mount(root) {
    U.tabset($('#pinTabs', root), [{ id: 'p3', name: 'Loại 3 chân', sub: 'không tụ' }, { id: 'p4', name: 'Loại 4 chân', sub: 'có tụ khởi động' }], id => { $('#pinPanel', root).innerHTML = `<h3>${PINS[id][0]}</h3>${PINS[id][1]}`; });
    U.tabset($('#fTabs', root), Object.entries(FAULTS).map(([id, f], i) => ({ id, n: i + 1, name: f[0] })), id => { $('#fPanel', root).innerHTML = `<h3>${FAULTS[id][0]}</h3><p style="margin:0">${FAULTS[id][1]}</p>`; });
    // mô phỏng
    let st, tm;
    const draw = () => { $('#sSvg', root).innerHTML = relaySVG(st.k, st.irun); $('#sSpd', root).style.width = st.s * 100 + '%'; $('#sInfo', root).textContent = `Tốc độ ${Math.round(st.s * 100)}% · dòng tổng ≈ ${st.itot.toFixed(2)} A · định mức ${IM} A`; };
    const reset = () => { clearInterval(tm); tm = null; st = { s: 0, k: false, irun: 3 * IM, itot: 3 * IM, t: 0, closed: false, opened: false }; draw(); $('#sV', root).className = 'verdict'; $('#sV', root).textContent = 'Bấm “Cấp điện”.'; };
    $('#sGo', root).onclick = () => {
      reset(); const [name, ir] = RELAYS[+$('#sRel', root).value], Ip = 2 * ir, Id = 1.15 * ir;
      tm = setInterval(() => {
        if (!document.body.contains($('#sSvg', root))) { clearInterval(tm); return; }
        st.t++;
        const irun = IM * (1 + 2 * Math.pow(1 - st.s, 2));
        if (!st.k && !st.opened && irun >= Ip) { st.k = true; st.closed = true; }
        if (st.k && irun < Id) { st.k = false; st.opened = true; st.nspd = Math.round(st.s * 100); }
        if (st.k || st.opened) st.s = Math.min(1, st.s + .015); else if (st.closed) st.s = Math.min(1, st.s + .015);
        st.irun = IM * (1 + 2 * Math.pow(1 - st.s, 2)); st.itot = st.irun * (st.k ? 1.3 : 1) + (st.k && st.s > .9 ? .2 : 0);
        draw();
        if (!st.closed && st.t > 25) { clearInterval(tm); end(name, 'big'); }
        else if (st.s >= 1) { clearInterval(tm); end(name, st.k ? 'small' : 'ok'); }
      }, 100);
    };
    function end(name, r) {
      const v = $('#sV', root);
      if (r === 'ok') { v.className = 'verdict ok'; v.innerHTML = `✓ Rơle ${name}: K đóng lúc đầu, <b>nhả khi block đạt khoảng ${Math.round(st.nspd || 70)}% tốc độ</b>, dòng về ≈ ${IM} A (định mức). Khởi động thành công.`; }
      else if (r === 'small') { v.className = 'verdict bad'; st.itot = IM * 1.35; draw(); v.innerHTML = `✗ Rơle ${name} <b>nhỏ hơn block</b>: dòng chạy bình thường vẫn đủ giữ lõi nên <b>tiếp điểm không nhả</b>. Block chạy nhưng dòng cao ≈ ${st.itot.toFixed(2)} A, cuộn đề nóng — nếu rơle bảo vệ không ngắt kịp sẽ <b>cháy cuộn đề</b>.`; }
      else { v.className = 'verdict bad'; v.innerHTML = `✗ Rơle ${name} <b>lớn hơn block</b>: dòng khởi động (${(3 * IM).toFixed(2)} A) không đủ hút lõi → tiếp điểm không đóng → cuộn đề không có điện. Block <b>đứng yên (ù), dòng cao</b>.`; }
    }
    $('#sRs', root).onclick = reset; $('#sRel', root).onchange = reset; reset();
    // thực hành đo
    let T;
    const mk = () => { T = { st: ['good', 'good', 'coil', 'core', 'weld'][Math.floor(Math.random() * 5)], type: $('#tType', root).value, rd: {} }; btns(); $('#tOut', root).textContent = 'Bấm các phép đo.'; $('#tRes', root).innerHTML = ''; $('#tAns', root).value = ''; };
    const meas = k => {
      const s = T.st, ohm = 1 + Math.random() * 2;
      if (k === 'coil') return s === 'coil' ? 'OL (∞) — kim không lên' : ohm.toFixed(1) + ' Ω — kim lên, R rất nhỏ';
      if (k === 'norm') return s === 'weld' ? '0 Ω — kim lên (bất thường: lẽ ra phải hở)' : 'OL (∞) — kim không lên';
      if (k === 'flip') return s === 'core' ? 'OL (∞) — kim không lên khi lật' : '0 Ω — kim lên khi lật';
    };
    function btns() {
      const four = T.type === '4', a = four ? 'V1' : 'vào', c = four ? 'V2' : 'vào';
      $('#tBtns', root).innerHTML = `<button class="btn sm" data-m="coil">Đo ${a} – M (cuộn)</button><button class="btn sm" data-m="norm">Đo ${c} – S (thường mở)</button><button class="btn sm" data-m="flip">Lật ngược rơle, đo ${c} – S</button>`;
      $$('#tBtns [data-m]', root).forEach(b => b.onclick = () => { T.rd[b.dataset.m] = meas(b.dataset.m); $('#tOut', root).innerHTML = ['coil', 'norm', 'flip'].map(k => `${{ coil: 'Cuộn', norm: 'Thường mở', flip: 'Lật ngược' }[k]}: ${T.rd[k] ? '<b>' + T.rd[k] + '</b>' : '…'}`).join('<br>'); });
    }
    $('#tType', root).onchange = mk; $('#tNew', root).onclick = mk; mk();
    $('#tChk', root).onclick = () => {
      const v = $('#tAns', root).value, why = { good: 'Cuộn thông, thường mở hở, lật ngược thông → rơle <b>tốt</b>.', coil: 'Đo vào – M không lên → <b>đứt cuộn dây</b>.', core: 'Cuộn tốt nhưng lật ngược mà vẫn hở → <b>kẹt lõi / tiếp điểm không đóng</b>.', weld: 'Ở vị trí thường mở mà đã thông → <b>tiếp điểm dính</b>.' };
      $('#tRes', root).innerHTML = !v ? '<div class="why">Hãy chọn kết luận.</div>' : `<div class="why" style="border-color:var(--${v === T.st ? 'ok' : 'bad'})"><b>${v === T.st ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> ${why[T.st]}</div>`;
    };
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Rơle khởi động đóng vai trò gì trong sơ đồ?', b: 'Là <b>công tắc K</b> điều khiển nguồn cho <b>cuộn đề</b>.', tag: 'Công dụng' },
    { f: 'K mở thì block ra sao?', b: 'Chỉ cuộn chạy có điện → <b>không có từ trường quay</b> → block đứng yên, dòng cao.', tag: 'Công dụng' },
    { f: 'K đóng thì block ra sao?', b: 'Cả hai cuộn có điện → từ trường lệch pha → rô-to quay.', tag: 'Công dụng' },
    { f: 'K ngắt khi nào? Vì sao?', b: 'Khi block đạt <b>70–75%</b> tốc độ; để <b>bảo vệ cuộn đề</b> (dây nhỏ, ít vòng).', tag: 'Công dụng' },
    { f: 'Có mấy loại rơle khởi động?', b: '2: <b>rơle dòng</b> (điện từ, cơ khí) và <b>rơle bán dẫn</b> (điện tử).', tag: 'Phân loại' },
    { f: 'Rơle dòng gồm các phần nào?', b: '<b>Cuộn dây, lõi sắt từ, tiếp điểm</b> (thường mở).', tag: 'Cấu tạo' },
    { f: 'Rơle dòng 3 chân là loại nào?', b: '1 chân vào – 2 chân ra (M, S), <b>không tụ</b>.', tag: 'Cấu tạo' },
    { f: 'Rơle dòng 4 chân là loại nào?', b: '2 chân vào – 2 chân ra, <b>có tụ khởi động</b>.', tag: 'Cấu tạo' },
    { f: 'Tiếp điểm rơle dòng ban đầu ở trạng thái nào?', b: '<b>Thường mở</b> (NO).', tag: 'Cấu tạo' },
    { f: 'Vì sao rơle dòng phải lắp đúng chiều?', b: 'Lõi rơi xuống nhờ trọng lực để tiếp điểm <b>luôn mở</b> lúc đầu.', tag: 'Cấu tạo' },
    { f: 'Cuộn rơle nối thế nào với cuộn chạy?', b: '<b>Nối tiếp</b>.', tag: 'Nguyên lý' },
    { f: 'Lúc khởi động, vì sao lõi bị hút?', b: 'Dòng lớn nhất → từ trường (B ~ I) mạnh nhất → hút lõi đóng tiếp điểm.', tag: 'Nguyên lý' },
    { f: 'Vì sao tiếp điểm nhả khi block quay nhanh?', b: 'Dòng giảm → từ trường yếu → lõi rơi, tiếp điểm mở.', tag: 'Nguyên lý' },
    { f: 'Tụ khởi động trong rơle 4 chân có tác dụng?', b: 'Điện áp xả cộng nối tiếp với nguồn → dòng qua cuộn đề lớn → <b>mô-men khởi động lớn</b>.', tag: 'Nguyên lý' },
    { f: 'Cuộn dây rơle đứt thì block thế nào?', b: 'Không có dòng → <b>block không chạy, dòng = 0</b>.', tag: 'Hư hỏng' },
    { f: 'Kẹt lõi / tiếp điểm không chạm: biểu hiện?', b: 'Cuộn đề không có điện → block <b>không chạy, dòng RẤT CAO</b>.', tag: 'Hư hỏng' },
    { f: 'Tiếp điểm dính không nhả: biểu hiện?', b: 'Block <b>chạy nhưng dòng cao</b>; cuộn đề nóng, có thể cháy.', tag: 'Hư hỏng' },
    { f: 'Kìm kẹp dòng của block bình thường?', b: 'Nhảy lên giá trị lớn rồi tụt nhanh về ≤ định mức.', tag: 'Kiểm tra' },
    { f: 'Kiểm tra rơle 3 chân: đo vào – M thấy gì?', b: 'Kim lên, R rất nhỏ → cuộn không đứt.', tag: 'Kiểm tra' },
    { f: 'Đo vào – S ở vị trí thường mở thấy gì?', b: 'Kim <b>không lên</b> (đúng); lật ngược rơle thì <b>lên</b>.', tag: 'Kiểm tra' },
    { f: 'Lật rơle mà kim không lên thì?', b: 'Lõi kẹt hoặc tiếp điểm hỏng → rơle hỏng.', tag: 'Kiểm tra' },
    { f: 'Cách đo rơle 4 chân nhanh?', b: 'Nối tắt hai chân vào thành loại 3 chân rồi đo như thường.', tag: 'Kiểm tra' },
    { f: 'Thang đo cho rơle dòng?', b: 'Thang <b>x1 Ω</b>, chỉnh kim về 0.', tag: 'Kiểm tra' },
    { f: 'Rơle nhỏ hơn block gây gì?', b: 'Tiếp điểm <b>không nhả</b> → block chạy dòng cao, có thể cháy cuộn đề.', tag: 'Thay thế' },
    { f: 'Rơle lớn hơn block gây gì?', b: 'Không hút được lõi → <b>không khởi động</b>, dòng cao.', tag: 'Thay thế' },
    { f: 'Rơle 4 chân thay cho block không dùng tụ: làm gì?', b: '<b>Nối tắt</b> hai chân vào (chân tụ).', tag: 'Thay thế' },
    { f: 'Tụ khởi động hỏng hở mạch thì?', b: 'Block <b>không khởi động</b> được.', tag: 'Thay thế' },
    { f: 'Thử rơle: kim kẹp dòng lên cao và đứng yên?', b: 'Rơle <b>lớn hơn</b> block (không đóng/ cuộn đề không có điện... dòng không tụt).', tag: 'Thay thế' },
    { f: 'Thử rơle: lên cao rồi tụt nhưng vẫn cao hơn định mức?', b: 'Rơle <b>nhỏ hơn</b> block (không nhả).', tag: 'Thay thế' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Rơle khởi động điều khiển nguồn cho?', ['Cuộn chạy', 'Cuộn đề', 'Quạt', 'Đèn'], 1, 'Cuộn đề S.'),
    Q('K mở thì?', ['Có từ trường quay', 'Block không quay, dòng cao', 'Block quay nhanh', 'Tủ lạnh sâu'], 1, 'Chỉ có cuộn chạy.'),
    Q('K ngắt khi rô-to đạt khoảng?', ['10%', '30%', '70 – 75%', '100%'], 2, 'Bảo vệ cuộn đề.'),
    Q('Vì sao phải ngắt cuộn đề?', ['Tiết kiệm điện', 'Dây nhỏ, ít vòng, chỉ chịu được thời gian ngắn', 'Giảm tiếng ồn', 'Không cần'], 1, 'Tránh cháy.'),
    Q('Rơle dòng còn gọi là?', ['Rơle điện tử', 'Rơle cuộn dây / điện từ', 'Rơle nhiệt', 'Rơle thời gian'], 1, 'Dựa trên cuộn dây điện từ.'),
    Q('Rơle dòng gồm?', ['Cuộn dây, lõi sắt, tiếp điểm', 'Lưỡng kim, dây nung', 'Động cơ, bánh răng', 'Điện trở nhiệt'], 0, 'Ba phần chính.'),
    Q('Tiếp điểm rơle dòng ban đầu?', ['Đóng', 'Mở (thường mở)', 'Tùy ý', 'Hỏng'], 1, 'Chờ dòng lớn để đóng.'),
    Q('Cuộn rơle dòng nối với cuộn chạy thế nào?', ['Song song', 'Nối tiếp', 'Không nối', 'Qua tụ'], 1, 'Mang dòng chạy của block.'),
    Q('Khi mới cấp điện, dòng qua cuộn rơle?', ['Nhỏ nhất', 'Lớn nhất', 'Bằng 0', 'Không đổi'], 1, 'Rô-to chưa quay.'),
    Q('Vì sao tiếp điểm nhả khi block quay nhanh?', ['Dòng giảm, từ trường yếu, lõi rơi', 'Điện áp tăng', 'Tụ đầy', 'Lò xo hỏng'], 0, 'Hết lực hút.'),
    Q('Rơle 4 chân có thêm?', ['Quạt', 'Tụ khởi động', 'Điện trở sấy', 'Cầu chì'], 1, 'Nối tiếp với K.'),
    Q('Tụ khởi động giúp?', ['Tăng mô-men khởi động', 'Giảm điện áp', 'Làm mát', 'Giảm tốc độ'], 0, 'Điện áp xả cộng với nguồn.'),
    Q('Cuộn rơle đứt → ?', ['Block chạy mạnh', 'Block không chạy, dòng = 0', 'Block chạy dòng cao', 'Tủ lạnh sâu'], 1, 'Mạch hở.'),
    Q('Kẹt lõi, tiếp điểm không chạm → ?', ['Block không chạy, dòng rất cao', 'Chạy bình thường', 'Dòng bằng 0', 'Chạy rất êm'], 0, 'Chỉ có cuộn chạy có điện.'),
    Q('Tiếp điểm dính → ?', ['Block chạy nhưng dòng cao', 'Block không chạy', 'Dòng bằng 0', 'Tụ nổ'], 0, 'Hai cuộn cùng làm việc.'),
    Q('Đo rơle dùng thang?', ['x10k', 'x1 Ω', 'ACV 220', 'DCmA'], 1, 'Đo thông mạch.'),
    Q('Vào – M có điện trở rất nhỏ nghĩa là?', ['Cuộn dây không đứt', 'Cuộn dây đứt', 'Tiếp điểm dính', 'Rơle lớn'], 0, 'Cuộn thông.'),
    Q('Rơle ở vị trí thường mở, đo vào – S kim không lên: ?', ['Bình thường', 'Hỏng', 'Chập', 'Cháy'], 0, 'Tiếp điểm đang mở.'),
    Q('Lật ngược rơle, vào – S kim lên nghĩa là?', ['Lõi và tiếp điểm tốt', 'Hỏng', 'Đứt cuộn', 'Dính vĩnh viễn'], 0, 'Lõi rơi đóng tiếp điểm.'),
    Q('Lật ngược mà kim không lên:', ['Rơle tốt', 'Kẹt lõi hoặc tiếp điểm hỏng', 'Cuộn chạy hỏng', 'Tụ yếu'], 1, 'Không đóng được.'),
    Q('Rơle nhỏ hơn block gây?', ['Tiếp điểm không nhả, dòng cao', 'Không khởi động', 'Block mát', 'Không ảnh hưởng'], 0, 'Dòng chạy vẫn đủ giữ lõi.'),
    Q('Rơle lớn hơn block gây?', ['Không đóng được, block không khởi động', 'Block chạy nhanh', 'Tiết kiệm điện', 'Nhả sớm'], 0, 'Dòng khởi động không đủ hút.'),
    Q('Kìm kẹp dòng lên cao và đứng yên: ?', ['Rơle lớn hơn block', 'Rơle phù hợp', 'Rơle nhỏ hơn block', 'Block rất tốt'], 0, 'Cuộn đề không có điện nên dòng không giảm.'),
    Q('Kim lên cao rồi tụt nhưng vẫn cao hơn định mức: ?', ['Rơle nhỏ hơn block', 'Rơle lớn hơn block', 'Phù hợp', 'Rơle bảo vệ hỏng'], 0, 'Tiếp điểm không nhả.'),
    Q('Rơle 4 chân không dùng tụ thì?', ['Nối tắt hai chân vào', 'Bỏ chân S', 'Tăng điện áp', 'Tháo cuộn rơle'], 0, 'Thành loại 3 chân.'),
    Q('Tụ khởi động hỏng hở mạch thì?', ['Block không khởi động', 'Block chạy tốt hơn', 'Dòng giảm', 'Không đổi'], 0, 'Mạch cuộn đề bị hở.')
  ];
  const sort = {
    title: 'Hiện tượng này ứng với hỏng gì?',
    buckets: [{ id: 'coil', name: 'Đứt cuộn dây rơle' }, { id: 'core', name: 'Kẹt lõi / tiếp điểm không đóng' }, { id: 'weld', name: 'Tiếp điểm dính' }],
    items: [
      { t: 'Block không chạy, dòng = 0', b: 'coil' }, { t: 'Đo vào – M kim không lên', b: 'coil' }, { t: 'Không có từ trường hút lõi', b: 'coil' }, { t: 'Cuộn dây cháy đen', b: 'coil' },
      { t: 'Block đứng yên (ù), dòng rất cao', b: 'core' }, { t: 'Lật ngược rơle, vào – S kim không lên', b: 'core' }, { t: 'Cuộn đề không có điện', b: 'core' }, { t: 'Chỉ cuộn chạy hoạt động', b: 'core' },
      { t: 'Block chạy nhưng dòng cao', b: 'weld' }, { t: 'Ở vị trí thường mở mà kim đã lên', b: 'weld' }, { t: 'Cuộn đề luôn có điện, nóng', b: 'weld' }, { t: 'Nguy cơ cháy cuộn đề', b: 'weld' }
    ]
  };
  const order = [
    { title: 'Khởi động với rơle dòng', intro: 'Sắp xếp diễn biến khởi động.', steps: ['Cấp điện, tiếp điểm K đang mở', 'Dòng chạy qua cuộn rơle và cuộn chạy, cực đại', 'Từ trường hút lõi sắt, tiếp điểm K đóng', 'Cuộn đề có điện, từ trường quay làm rô-to quay', 'Rô-to quay nhanh, dòng giảm, từ trường yếu', 'Đạt 70–75% tốc độ, lõi rơi, K mở, cuộn đề ngắt'] },
    { title: 'Kiểm tra rơle 3 chân', intro: 'Sắp xếp các bước đo.', steps: ['Quan sát màu cuộn dây, hình dáng', 'Đặt rơle ở vị trí thường mở', 'Chọn thang x1 Ω, chỉnh kim về 0', 'Đo vào – M: kim lên (cuộn tốt)', 'Đo vào – S: kim không lên', 'Lật ngược rơle, đo vào – S: kim lên thì tốt'] },
    { title: 'Thử rơle thay thế bằng kìm kẹp dòng', intro: 'Không có thông số công suất.', steps: ['Lắp rơle cùng hình dạng, kích thước', 'Kẹp ampe kìm vào dây nguồn', 'Cấp điện cho block', 'Quan sát kim: lên cao rồi tụt về', 'So sánh với dòng định mức ghi trên thân', 'Kết luận rơle phù hợp, nhỏ hay lớn'] }
  ];
  DL.register({
    id: 7, ready: true, title: 'Rơle khởi động (rơle dòng)', sub: 'Công dụng, cấu tạo, nguyên lý, kiểm tra, thay thế', minutes: 25,
    lead: 'Rơle khởi động là “công tắc tự động” của cuộn đề. Bài này giải thích rơle dòng điện từ hút – nhả theo dòng khởi động, cách đo kiểm tra và hậu quả khi lắp sai công suất.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
