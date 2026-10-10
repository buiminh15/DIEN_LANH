/* BÀI 6 — RƠLE BẢO VỆ (biên soạn từ docs/Bai_6.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const DEVICES = [
    ['Rơle bảo vệ', 'Ngắt điện khi block quá tải. Đi kèm block.'],
    ['Rơle khởi động', 'Điều khiển nguồn cho cuộn đề (Bài 7, 8).'],
    ['Rơle khống chế nhiệt độ', 'Đóng ngắt block để giữ nhiệt độ trong tủ (Bài 9).'],
    ['Rơle thời gian', 'Đồng hồ xả tuyết, điều khiển block/quạt và sấy (Bài 10).'],
    ['Sò lạnh & cầu chì nhiệt', 'Điều khiển và bảo vệ mạch xả tuyết (Bài 11).'],
    ['Tụ điện, công tắc cửa', 'Tụ hỗ trợ khởi động/chạy; công tắc bật đèn khi mở cửa.']
  ];
  const KIND = {
    cur: ['Rơle bảo vệ DÒNG', 'Phản ứng khi <b>dòng điện</b> qua cuộn dây vượt định mức. Dây nung (điện trở) nối tiếp với mạch → nóng lên theo dòng → làm cong lưỡng kim.', 'Nối tiếp ở bên ngoài vỏ block (thường cắm vào chân chung C).'],
    heat: ['Rơle bảo vệ NHIỆT', 'Phản ứng khi <b>nhiệt độ</b> block cao (do ma sát, thiếu dầu, môi trường nóng...). Chỉ có lưỡng kim, không có dây nung; được bó sát cuộn dây.', 'Nằm <b>bên trong</b> vỏ block, bó vào cuộn dây và nối ở chân chạy.'],
    both: ['Rơle bảo vệ vừa DÒNG vừa NHIỆT', 'Có <b>cả dây nung và lưỡng kim</b> áp sát vỏ block: nhạy với dòng và cả nhiệt độ vỏ. Loại phổ biến nhất.', 'Gắn <b>bên ngoài</b> vỏ block, cắm vào chân chung C.']
  };

  function relaySVG(h, open) {
    const bend = Math.min(h, 1.4) * 26;
    const x1 = 70, y1 = 130, x2 = 250, y2 = 130 - bend;
    const wire = open ? 'var(--muted)' : 'var(--ok)';
    return `<svg viewBox="0 0 400 220" role="img" aria-label="Rơle bảo vệ: lưỡng kim ${open ? 'đã cong, tiếp điểm mở' : 'thẳng, tiếp điểm đóng'}">
      <rect x="50" y="125" width="30" height="40" fill="var(--ink)"/><text class="fl" x="40" y="190">đế cố định</text>
      <path d="M${x1} ${y1}Q${(x1 + x2) / 2} ${y1 - bend * .15} ${x2} ${y2}" fill="none" stroke="var(--brass)" stroke-width="9" stroke-linecap="round"/>
      <path d="M${x1} ${y1 - 14}Q${(x1 + x2) / 2} ${y1 - 14 - bend * .15} ${x2} ${y2 - 14}" fill="none" stroke="var(--muted)" stroke-width="5" stroke-linecap="round"/>
      <path d="M90 ${y1 - 26}h20l5-10l10 20l10-20l10 20l10-20l10 20l5-10h20" fill="none" stroke="${h > .7 ? 'var(--hot)' : 'var(--warm)'}" stroke-width="3.5"/>
      <circle cx="${x2}" cy="${y2 - 4}" r="8" fill="${wire}"/>
      <rect x="236" y="62" width="30" height="10" fill="var(--ink)"/><circle cx="251" cy="78" r="8" fill="${wire}"/>
      <path d="M20 118H50" stroke="${wire}" stroke-width="4"/><path d="M251 62V30H370" stroke="${wire}" stroke-width="4" fill="none"/>
      <text class="fl" x="10" y="108">vào</text><text class="fl" x="330" y="22">ra → block</text>
      <text class="sub" x="135" y="60">dây nung</text><text class="sub" x="160" y="165">thanh lưỡng kim</text>
      <text class="lbl" x="200" y="205" text-anchor="middle" style="fill:${open ? 'var(--bad)' : 'var(--ok)'}">${open ? 'TIẾP ĐIỂM MỞ — block mất điện' : 'tiếp điểm ĐÓNG — block có điện'}</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-overview" data-toc="1 · Thiết bị điện tủ lạnh">
  <div class="sec-n">Phần 1</div><h2>Mạch điện tủ lạnh có những gì?</h2>
  <p>Mạch điện gồm <b>thiết bị điện</b> (điều khiển nguồn cho tải) và <b>phụ tải điện</b> (nơi tiêu thụ điện, thực hiện công việc). Chương này (Bài 6 – 11) học các thiết bị điện:</p>
  <div class="tabs">${DEVICES.map((d, i) => `<div class="tab" style="cursor:default"><b>${i + 1}</b><span>${d[0]}<br><small class="muted">${d[1]}</small></span></div>`).join('')}</div>
  <div class="grid2" style="margin-top:14px"><div class="panel" style="margin:0"><h4>Phụ tải điện</h4><p style="margin:6px 0 0">Block (máy nén), quạt gió, điện trở sấy xả tuyết, đèn chiếu sáng.</p></div>
    <div class="panel warm" style="margin:0"><h4>Công tắc cửa</h4><p style="margin:6px 0 0">Đặt ở mép cửa: mở cửa → đèn sáng, đóng cửa → đèn tắt; ở tủ có quạt còn có công tắc ngắt quạt khi mở cửa.</p></div></div>
</section>

<section class="sec" id="s-purpose" data-toc="2 · Công dụng, phân loại">
  <div class="sec-n">Phần 2</div><h2>Rơle bảo vệ: để làm gì?</h2>
  <p>Block làm việc liên tục trong môi trường khắc nghiệt: <b>nóng</b> ở dàn nóng, <b>áp suất cao</b>. Để bảo vệ “trái tim” này, đi kèm block luôn có <b>rơle bảo vệ</b>: khi block <b>quá tải</b> (dòng cao hoặc nhiệt độ cao) nó <b>ngắt nguồn</b> cho block; nguội rồi thì <b>đóng lại</b> tự động.</p>
  <h3 style="margin-top:22px">3 loại rơle bảo vệ</h3>
  <div id="kindTabs"></div><article class="panel" id="kindPanel" aria-live="polite"></article>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Ví dụ đời thường</b><p>Rơle bảo vệ giống <b>ấm siêu tốc</b> tự ngắt khi sôi/khô nước, hoặc <b>cầu dao tự động</b> trong nhà: cứ quá mức an toàn là cắt.</p></div></div>
</section>

<section class="sec" id="s-build" data-toc="3 · Cấu tạo, nguyên lý">
  <div class="sec-n">Phần 3</div><h2>Cấu tạo và nguyên lý</h2>
  <dl class="kv"><dt>① Dây nung</dt><dd>Dây điện trở bằng kim loại <b>nóng chảy cao</b> (thường là vonfram), tiết diện chọn <b>vừa với dòng định mức</b> của block. Giống dây tóc bóng đèn, dây bếp điện.</dd>
  <dt>② Thanh lưỡng kim</dt><dd>Hai kim loại <b>giãn nở vì nhiệt khác nhau</b> dán vào nhau: nóng lên thì <b>cong về một phía</b>.</dd>
  <dt>③ Tiếp điểm</dt><dd>Gồm tiếp điểm động (trên thanh lưỡng kim) và tiếp điểm tĩnh. Bình thường <b>luôn đóng</b> để cấp điện cho block; chỉ <b>mở khi block quá tải</b>.</dd></dl>
  <div class="callout"><span class="ic">🔬</span><div><b class="t">Hiểu bằng ví dụ mỏ hàn xung</b><p>Mỏ hàn xung có cuộn thứ cấp chỉ 2 vòng dây đồng to, nối đầu mỏ hàn. Đầu mỏ <b>nhỏ</b> thì nóng rất nhanh; đầu mỏ <b>to</b> nóng chậm. Dây nung rơle cũng vậy: <b>dây càng nhỏ</b> thì cùng một dòng sẽ <b>nóng nhanh hơn</b>. Vì thế mỗi block phải có rơle đúng công suất.</p></div></div>
  <h3 style="margin-top:26px">🔬 Mô phỏng: rơle ngắt như thế nào?</h3>
  <p>Chọn loại rơle, công suất rơle và tình huống của block (block 1/6 HP, dòng định mức <b>0,95 A</b>), rồi bấm <b>Chạy</b>. 1 giây thật = 10 giây mô phỏng.</p>
  <div class="stage"><div id="relSvg"></div>
    <div class="controls">
      <label>Loại <select id="rType" class="btn sm" style="min-height:36px"><option value="both">vừa dòng vừa nhiệt</option><option value="cur">chỉ dòng</option><option value="heat">chỉ nhiệt</option></select></label>
      <label>Rơle <select id="rRate" class="btn sm" style="min-height:36px"><option value="0.5">0,5 A (1/12 HP) – nhỏ</option><option value="1" selected>1,0 A (1/6 HP) – đúng</option><option value="2">2,0 A (1/3 HP) – lớn</option></select></label>
      <label>Tình huống <select id="rSce" class="btn sm" style="min-height:36px"><option value="norm">Block chạy bình thường</option><option value="start">Vừa khởi động (dòng 3 lần, 0,15 s)</option><option value="lock">Kẹt cơ (dòng 3,3 A)</option><option value="hot">Quá nóng (thiếu dầu, môi trường nóng)</option></select></label></div>
    <div class="controls"><button class="btn pri sm" id="rGo">▶ Chạy</button><button class="btn sm" id="rRs">↺ Làm lại</button></div>
    <div style="padding:0 16px 6px"><div class="muted" style="font-size:14px">Mức nóng của lưỡng kim (≥ 100% thì cong, ngắt)</div><div class="bar" style="height:14px;margin:6px 0"><i id="rHeat" style="width:0;background:var(--warm)"></i></div><div class="muted" id="rInfo" style="font-size:14px"></div></div>
    <div class="verdict" id="rV" style="margin:6px 14px 12px">Chọn tình huống rồi bấm “Chạy”.</div></div>
  <div class="grid2" style="margin-top:14px"><div class="panel" style="margin:0"><h4>Dòng khởi động ≠ quá tải</h4><p style="margin:6px 0 0">Khi khởi động, dòng gấp <b>3–4 lần</b> định mức nhưng chỉ kéo dài <b>0,1 – 0,2 giây</b>. Thời gian quá ngắn để dây nung kịp nóng nên rơle <b>không ngắt</b>.</p></div>
    <div class="panel hotc" style="margin:0"><h4>Quá tải thật sự</h4><p style="margin:6px 0 0">Dòng lớn kéo dài → rơle phải ngắt trong khoảng <b>5 – 30 giây</b>. Tốt nhất <b>10 – 20 giây</b>; trên 30 giây là quá chậm, hại cuộn dây.</p></div></div>
</section>

<section class="sec" id="s-fault" data-toc="4 · Hư hỏng, kiểm tra">
  <div class="sec-n">Phần 4</div><h2>Hư hỏng, kiểm tra</h2>
  <div id="fTabs"></div><article class="panel hotc" id="fPanel" aria-live="polite"></article>
  <h3 style="margin-top:26px">Cách kiểm tra</h3>
  ${U.steps([['Block không chạy, dòng = 0 → đo rơle bằng đồng hồ vạn năng thang x1 Ω', 'Đo hai chân <b>vào – ra</b> của rơle: kim lên (R rất nhỏ) → rơle <b>tốt</b>; kim không lên (∞) → rơle <b>hỏng</b>.'], ['Tủ chạy rồi ngắt liên tục → kẹp dòng + đo nhiệt vỏ block', 'Dòng <b>nhỏ hơn định mức</b> và nhiệt vỏ thấp mà rơle vẫn ngắt → rơle <b>hỏng (ngắt sai)</b>. Dòng và nhiệt đều <b>cao</b> mà rơle ngắt → rơle <b>tốt</b>, hỏng ở block hoặc hệ thống.'], ['Tìm nguyên nhân quá tải', 'Dòng cao: kẹt cơ, rô-to chạm stato, điện áp yếu, tắc một phần phía đẩy, nạp thừa gas, môi trường nóng. Nhiệt cao: ma sát, dầu kém/thiếu, tản nhiệt kém.']])}
  <div class="callout danger"><span class="ic">⛔</span><div><b class="t">Rơle bảo vệ hỏng thì thay, không dùng lại</b><p>Công dụng của rơle là bảo vệ. Đã hỏng mà đem lắp cho block khác thì <b>block mới cũng dễ hỏng theo</b>.</p></div></div>
</section>

<section class="sec" id="s-swap" data-toc="5 · Thay thế">
  <div class="sec-n">Phần 5</div><h2>Thay rơle bảo vệ</h2>
  <p>Chọn rơle đúng <b>hình dạng</b> (lắp vừa), đúng <b>chủng loại</b> và đặc biệt đúng <b>công suất</b>. Công suất ghi trên thân rơle (VD 1/6 HP, 220 V, 50/60 Hz) phải khớp với block.</p>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Rơle so với block</th><th>Hậu quả</th></tr></thead><tbody>
    <tr><th>Đúng công suất</th><td><span class="pill ok">Bảo vệ đúng, ngắt trong 5 – 30 s khi quá tải</span></td></tr>
    <tr><th>Nhỏ hơn block</th><td><span class="pill bad">Nóng lên ngay cả khi block chạy bình thường → <b>ngắt liên tục</b>, tủ kém lạnh</span></td></tr>
    <tr><th>Lớn hơn block</th><td><span class="pill bad"><b>Không ngắt</b> khi quá tải (hoặc ngắt quá chậm) → có thể <b>cháy block</b></span></td></tr></tbody></table></div>
  <h3 style="margin-top:26px">Không có thông số công suất? Thử bằng đồng hồ kẹp dòng</h3>
  ${U.steps([['Lắp rơle cùng hình dạng, kích thước', 'Ngắt rơle khởi động hoặc thay bằng rơle khởi động tốt để chắc chắn khởi động bình thường.'], ['Cho block chạy bình thường', 'Nếu rơle <b>ngắt liên tục</b> → công suất rơle <b>nhỏ hơn</b> block.'], ['Gây quá tải: tắt rồi cấp điện lại ngay khi block còn nóng áp (không khởi động được) và kẹp dòng', 'Dòng cao kéo dài: đếm thời gian rơle ngắt.'], ['Đánh giá', 'Ngắt <b>≤ 30 giây</b> (tốt nhất 10–20 s) → công suất <b>phù hợp</b>. Không ngắt → rơle <b>lớn hơn</b> block, phải ngắt nguồn ngay để tránh cháy.']])}
  <div class="callout"><span class="ic">🔁</span><div><b class="t">Tìm nguyên nhân trước khi thay</b><p>Rơle chỉ đóng mở được một số lần nhất định (VD ~1000 lần). Nếu cứ quá tải liên tục, rơle mới cũng hỏng nhanh. Phải khắc phục nguyên nhân: <b>dòng cao</b> (kẹt cơ, điện yếu, môi trường nóng, thừa gas, tắc một phần) và <b>nhiệt cao</b> (ma sát, thiếu dầu, không thoát nhiệt, thiếu hơi gas lạnh về làm mát).</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Rơle bảo vệ ngắt điện khi block quá tải (dòng hoặc nhiệt).</b><span>3 loại: dòng, nhiệt, vừa dòng vừa nhiệt.</span></div></li>
    <li class="done"><div><b>Cấu tạo: dây nung + thanh lưỡng kim + tiếp điểm thường đóng.</b><span>Nóng → lưỡng kim cong → tiếp điểm mở → block dừng.</span></div></li>
    <li class="done"><div><b>Dòng khởi động 3–4 lần nhưng chỉ 0,1–0,2 s → không làm rơle ngắt.</b><span>Quá tải thật phải ngắt trong 5–30 s.</span></div></li>
    <li class="done"><div><b>Hỏng: tiếp điểm hở → dòng 0; ngắt sớm → chạy ngắt liên tục; tiếp điểm dính → không bảo vệ.</b></div></li>
    <li class="done"><div><b>Kiểm tra bằng x1 Ω: vào – ra thông mạch là tốt.</b><span>Hỏng thì thay, không dùng lại.</span></div></li>
    <li class="done"><div><b>Thay đúng công suất: nhỏ → ngắt liên tục; lớn → không bảo vệ.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/6/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const FAULTS = {
    open: ['Đứt dây nung / tiếp điểm không tiếp xúc', 'Mạch bị hở → <b>block không chạy, dòng = 0</b>. (Dòng bằng 0 còn có thể do chưa có nguồn, đứt dây, hỏng cuộn dây block, hỏng rơle khống chế nhiệt độ...)'],
    early: ['Lưỡng kim sai lệch → ngắt sớm', 'Dùng lâu, kim loại bị mỏi, ngắt khi block chưa quá tải → <b>block chạy rồi ngắt liên tục</b>, tủ kém lạnh. (Giống ấm siêu tốc chưa sôi đã ngắt.)'],
    stuck: ['Tiếp điểm dính (không mở được)', '<b>Nguy hiểm nhất</b>: block có quá tải cũng không ngắt → có thể <b>cháy block</b>. Tuyệt đối không dùng lại rơle này.']
  };

  function mount(root) {
    U.tabset($('#kindTabs', root), Object.entries(KIND).map(([id, k], i) => ({ id, n: i + 1, name: k[0] })), id => { const k = KIND[id]; $('#kindPanel', root).innerHTML = `<h3>${k[0]}</h3><p>${k[1]}</p><p class="muted" style="margin:0"><b>Vị trí:</b> ${k[2]}</p>`; }, 'both');
    // mô phỏng
    let st, tm;
    const reset = () => { clearInterval(tm); tm = null; st = { h: 0, t: 0, open: false, trips: 0, tripT: null, on: false }; draw(); $('#rV', root).className = 'verdict'; $('#rV', root).textContent = 'Chọn tình huống rồi bấm “Chạy”.'; $('#rInfo', root).textContent = ''; };
    const draw = () => { $('#relSvg', root).innerHTML = relaySVG(st.h, st.open); $('#rHeat', root).style.width = Math.min(100, st.h * 100) + '%'; $('#rHeat', root).style.background = st.h >= 1 ? 'var(--bad)' : 'var(--warm)'; };
    function step() {
      const type = $('#rType', root).value, rate = +$('#rRate', root).value, sce = $('#rSce', root).value, a = .02, b = .04, dt = .05;
      for (let k = 0; k < 20; k++) {
        const I = st.open ? 0 : (sce === 'lock' ? 3.3 : sce === 'start' && st.t < .15 ? 2.9 : .95), r = I / rate, q = sce === 'hot' ? .03 : 0;
        const src = type === 'cur' ? a * r * r : type === 'heat' ? q + .4 * a * r * r : a * r * r + q;
        st.h = Math.max(0, st.h + (src - b * st.h) * dt); st.t += dt;
        if (!st.open && st.h >= 1) { st.open = true; st.trips++; if (st.tripT === null) st.tripT = st.t; }
        else if (st.open && st.h < .35) st.open = false;
      }
      draw();
      $('#rInfo', root).textContent = `Thời gian mô phỏng: ${Math.round(st.t)} s · số lần rơle ngắt: ${st.trips}`;
      if (st.t >= 120 || st.trips >= 3) { clearInterval(tm); tm = null; finish(); }
    }
    function finish() {
      const rate = +$('#rRate', root).value, sce = $('#rSce', root).value, type = $('#rType', root).value, v = $('#rV', root); let c = 'ok', m;
      if (st.trips === 0) {
        if (sce === 'lock') { c = 'bad'; m = '✗ Block <b>kẹt mà rơle không ngắt</b> sau 2 phút → rơle công suất quá lớn (hoặc hỏng): <b>block sẽ cháy</b>.'; }
        else if (sce === 'hot') { c = 'bad'; m = type === 'cur' ? '✗ Rơle chỉ bảo vệ <b>dòng</b> nên <b>không cảm nhận được nhiệt độ cao</b> (dòng vẫn bình thường).' : '✗ Rơle quá lớn / không đủ nhạy: không ngắt dù block quá nóng.'; }
        else m = '✓ Rơle <b>không ngắt</b>: block chạy bình thường' + (sce === 'start' ? ', dòng khởi động quá ngắn nên không ảnh hưởng.' : '.');
      } else if (sce === 'norm' || sce === 'start') { c = 'bad'; m = `✗ Block chạy bình thường mà rơle ngắt (${st.trips} lần) → rơle <b>công suất nhỏ hơn block</b>: chạy ngắt liên tục, tủ kém lạnh.`; }
      else { const t = Math.round(st.tripT); c = t <= 30 ? 'ok' : 'bad'; m = t <= 30 ? `✓ Rơle ngắt sau <b>${t} giây</b> (trong 5–30 s): bảo vệ đúng. Nguội rồi tự đóng lại; nếu nguyên nhân còn thì lại ngắt (${st.trips} lần).` : `⚠️ Rơle ngắt sau ${t} giây: <b>quá chậm</b> (> 30 s), cuộn dây phải chịu nóng lâu.`; }
      v.className = 'verdict ' + (c === 'ok' ? 'ok' : 'bad'); v.innerHTML = m;
    }
    $('#rGo', root).onclick = () => { reset(); st.on = true; tm = setInterval(() => { if (!document.body.contains($('#relSvg', root))) { clearInterval(tm); return; } step(); }, 100); };
    $('#rRs', root).onclick = reset;
    ['#rType', '#rRate', '#rSce'].forEach(s => $(s, root).onchange = reset);
    reset();
    // hư hỏng
    U.tabset($('#fTabs', root), Object.entries(FAULTS).map(([id, f], i) => ({ id, n: i + 1, name: f[0] })), id => { $('#fPanel', root).innerHTML = `<h3>${FAULTS[id][0]}</h3><p style="margin:0">${FAULTS[id][1]}</p>`; });
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Phân biệt thiết bị điện và phụ tải điện?', b: '<b>Thiết bị điện</b> điều khiển nguồn cho tải; <b>phụ tải điện</b> tiêu thụ điện làm việc (block, quạt, sấy, đèn).', tag: 'Tổng quan' },
    { f: 'Kể các thiết bị điện trong tủ lạnh (chương này).', b: 'Rơle bảo vệ, rơle khởi động, rơle khống chế nhiệt độ, rơle thời gian, sò lạnh, cầu chì nhiệt, tụ, công tắc cửa.', tag: 'Tổng quan' },
    { f: 'Công tắc cửa dùng để làm gì?', b: 'Mở cửa thì <b>bật đèn</b>, đóng cửa thì tắt (tủ quạt còn ngắt quạt khi mở cửa).', tag: 'Tổng quan' },
    { f: 'Rơle bảo vệ có công dụng gì?', b: '<b>Ngắt nguồn</b> cho block khi block bị quá tải (dòng hoặc nhiệt cao).', tag: 'Công dụng' },
    { f: 'Vì sao block cần được bảo vệ?', b: 'Làm việc liên tục, môi trường khắc nghiệt (nóng, áp suất cao); là “trái tim” của hệ thống.', tag: 'Công dụng' },
    { f: 'Có mấy loại rơle bảo vệ?', b: '3 loại: bảo vệ <b>dòng</b>, bảo vệ <b>nhiệt</b>, vừa <b>dòng vừa nhiệt</b>.', tag: 'Phân loại' },
    { f: 'Rơle bảo vệ nhiệt đặt ở đâu?', b: '<b>Bên trong</b> vỏ block, bó vào cuộn dây (nối chân chạy).', tag: 'Phân loại' },
    { f: 'Rơle vừa dòng vừa nhiệt đặt ở đâu?', b: '<b>Bên ngoài</b> vỏ block, cắm vào chân chung C. Loại phổ biến nhất.', tag: 'Phân loại' },
    { f: 'Rơle bảo vệ gồm những bộ phận nào?', b: '<b>Dây nung</b>, <b>thanh lưỡng kim</b>, <b>tiếp điểm</b>.', tag: 'Cấu tạo' },
    { f: 'Dây nung làm bằng gì?', b: 'Kim loại nhiệt độ nóng chảy cao như <b>vonfram</b>; tiết diện chọn theo dòng định mức block.', tag: 'Cấu tạo' },
    { f: 'Thanh lưỡng kim là gì?', b: 'Hai kim loại <b>giãn nở vì nhiệt khác nhau</b>; nóng thì <b>cong</b> về một phía để mở tiếp điểm.', tag: 'Cấu tạo' },
    { f: 'Tiếp điểm rơle bảo vệ bình thường ở trạng thái nào?', b: 'Luôn <b>đóng</b> để cấp điện; chỉ <b>mở khi quá tải</b>.', tag: 'Cấu tạo' },
    { f: 'Nguyên lý ngắt của rơle bảo vệ?', b: 'Quá tải → dây nung/vỏ nóng → lưỡng kim cong → tiếp điểm mở → block dừng; nguội thì đóng lại.', tag: 'Nguyên lý' },
    { f: 'Dòng khởi động bao nhiêu lần định mức, kéo dài bao lâu?', b: 'Khoảng <b>3–4 lần</b>, chỉ <b>0,1–0,2 giây</b> nên rơle không ngắt.', tag: 'Nguyên lý' },
    { f: 'Khi quá tải thật, rơle phải ngắt sau bao lâu?', b: '<b>5–30 giây</b> (tốt nhất 10–20 s); không quá 30 s.', tag: 'Nguyên lý' },
    { f: 'Block không chạy, dòng = 0: rơle hỏng kiểu nào?', b: '<b>Đứt dây nung</b> hoặc <b>tiếp điểm không tiếp xúc</b> (hở mạch).', tag: 'Hư hỏng' },
    { f: 'Tủ chạy rồi ngắt liên tục: rơle có thể sao?', b: 'Lưỡng kim sai lệch → <b>ngắt sớm</b> (hoặc block quá tải thật).', tag: 'Hư hỏng' },
    { f: 'Hư hỏng nguy hiểm nhất của rơle bảo vệ?', b: '<b>Tiếp điểm dính</b>: không ngắt khi quá tải → cháy block.', tag: 'Hư hỏng' },
    { f: 'Cách kiểm tra rơle bảo vệ tốt/xấu?', b: 'Thang <b>x1 Ω</b> đo hai chân vào – ra: kim lên (R nhỏ) = tốt; không lên = hỏng.', tag: 'Kiểm tra' },
    { f: 'Rơle ngắt khi dòng thấp và vỏ nguội: kết luận?', b: 'Rơle <b>hỏng (ngắt sai)</b>.', tag: 'Kiểm tra' },
    { f: 'Rơle ngắt khi dòng và nhiệt đều cao: kết luận?', b: 'Rơle <b>tốt</b>; tìm nguyên nhân quá tải ở block / hệ thống.', tag: 'Kiểm tra' },
    { f: 'Rơle hỏng có dùng lại cho block khác không?', b: '<b>Không</b>. Rơle hỏng không bảo vệ được, block mới dễ hỏng theo.', tag: 'Thay thế' },
    { f: 'Chọn rơle thay thế dựa vào đâu?', b: '<b>Hình dạng, chủng loại, công suất</b> (ghi trên thân).', tag: 'Thay thế' },
    { f: 'Rơle nhỏ hơn công suất block gây gì?', b: 'Ngắt <b>liên tục</b> dù block bình thường → tủ kém lạnh.', tag: 'Thay thế' },
    { f: 'Rơle lớn hơn công suất block gây gì?', b: '<b>Không ngắt</b> khi quá tải (hoặc rất chậm) → có thể cháy block.', tag: 'Thay thế' },
    { f: 'Thử công suất rơle: kết luận khi ngắt ≤ 30 s?', b: 'Công suất rơle <b>phù hợp</b>.', tag: 'Thay thế' },
    { f: 'Vì sao phải tìm nguyên nhân quá tải trước khi thay rơle?', b: 'Rơle chỉ đóng mở được số lần nhất định (~1000); quá tải liên tục sẽ làm rơle mới hỏng nhanh.', tag: 'Thay thế' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Thiết bị điện trong tủ lạnh có chức năng?', ['Tiêu thụ điện để làm việc', 'Điều khiển nguồn cho phụ tải', 'Chỉ chiếu sáng', 'Làm lạnh'], 1, 'Phụ tải mới là nơi tiêu thụ điện.'),
    Q('Đâu KHÔNG phải phụ tải điện?', ['Block', 'Quạt gió', 'Điện trở sấy', 'Rơle bảo vệ'], 3, 'Rơle bảo vệ là thiết bị điện (điều khiển).'),
    Q('Công dụng của rơle bảo vệ?', ['Khởi động block', 'Ngắt nguồn khi block quá tải', 'Giữ nhiệt độ tủ', 'Xả tuyết'], 1, 'Bảo vệ cho block.'),
    Q('Có mấy loại rơle bảo vệ trong tủ lạnh?', ['1', '2', '3', '5'], 2, 'Dòng, nhiệt và vừa dòng vừa nhiệt.'),
    Q('Rơle vừa dòng vừa nhiệt thường lắp?', ['Trong vỏ block', 'Ngoài vỏ block, cắm vào chân chung', 'Ở dàn lạnh', 'Ở cửa'], 1, 'Bên ngoài vỏ, cắm chân chung C.'),
    Q('Rơle bảo vệ nhiệt đặt ở đâu?', ['Trong vỏ block, bó vào cuộn dây', 'Trên dàn nóng', 'Ở cửa tủ', 'Cạnh phin lọc'], 0, 'Cảm nhận nhiệt độ cuộn dây.'),
    Q('Dây nung của rơle làm từ?', ['Chì', 'Kim loại nóng chảy cao như vonfram', 'Nhôm', 'Nhựa'], 1, 'Chịu nhiệt tốt như dây tóc bóng đèn.'),
    Q('Thanh lưỡng kim gồm?', ['Hai kim loại giãn nở nhiệt khác nhau', 'Hai dây đồng', 'Một thanh nam châm', 'Hai tụ'], 0, 'Nóng thì cong.'),
    Q('Tiếp điểm rơle bảo vệ bình thường?', ['Mở', 'Đóng', 'Lúc đóng lúc mở', 'Không có'], 1, 'Chỉ mở khi quá tải.'),
    Q('Dây nung nhỏ hơn thì với cùng dòng sẽ?', ['Nóng nhanh hơn', 'Nguội hơn', 'Không đổi', 'Tắt'], 0, 'Điện trở lớn hơn → sinh nhiệt nhiều hơn.'),
    Q('Dòng khởi động của block khoảng?', ['Bằng định mức', '3 – 4 lần định mức', '10 lần', 'Bằng 0'], 1, 'Chỉ trong 0,1 – 0,2 s.'),
    Q('Vì sao rơle không ngắt khi block khởi động?', ['Rơle hỏng', 'Dòng cao nhưng quá ngắn, dây nung chưa kịp nóng', 'Block yếu', 'Do tụ'], 1, 'Thời gian chưa đủ làm cong lưỡng kim.'),
    Q('Khi quá tải thật, rơle phải ngắt trong?', ['0,1 s', '5 – 30 s', '5 phút', '1 giờ'], 1, 'Tốt nhất 10 – 20 s.'),
    Q('Block không chạy, dòng = 0 do rơle: nguyên nhân?', ['Dính tiếp điểm', 'Đứt dây nung hoặc tiếp điểm hở', 'Thừa dầu', 'Dàn bẩn'], 1, 'Mạch hở.'),
    Q('Tủ chạy rồi ngắt liên tục có thể do?', ['Rơle ngắt sớm hoặc block quá tải thật', 'Dây điện quá dài', 'Phin tốt', 'Dàn lạnh sạch'], 0, 'Cần kẹp dòng, đo nhiệt vỏ để phân biệt.'),
    Q('Hỏng nguy hiểm nhất của rơle bảo vệ?', ['Tiếp điểm dính', 'Đứt dây nung', 'Bám bụi', 'Sai màu'], 0, 'Không bảo vệ được → cháy block.'),
    Q('Kiểm tra rơle bảo vệ bằng thang?', ['x10k', 'x1 Ω', 'DCV 12 V', 'ACV 220 V'], 1, 'Đo thông mạch hai chân.'),
    Q('Đo hai chân rơle, kim không lên. Kết luận?', ['Rơle tốt', 'Rơle hỏng', 'Block hỏng', 'Dây tốt'], 1, 'Hở mạch.'),
    Q('Rơle ngắt khi dòng thấp, vỏ nguội. Kết luận?', ['Rơle tốt', 'Rơle ngắt sai (hỏng)', 'Thiếu gas', 'Tụ yếu'], 1, 'Không có quá tải mà vẫn ngắt.'),
    Q('Rơle hỏng cần?', ['Sửa lại dùng tiếp', 'Thay mới, không dùng lại', 'Bỏ không dùng rơle', 'Thay bằng dây đồng'], 1, 'Dùng lại rơle hỏng nguy hiểm.'),
    Q('Rơle nhỏ hơn công suất block thì?', ['Ngắt liên tục', 'Không ngắt', 'Block mát hơn', 'Khởi động mạnh hơn'], 0, 'Nóng quá mức dù bình thường.'),
    Q('Rơle lớn hơn công suất block thì?', ['Ngắt sớm', 'Không bảo vệ được block quá tải', 'Tốt hơn', 'Không khác'], 1, 'Có thể cháy block.'),
    Q('Rơle thay thế ngắt trong 20 giây khi quá tải. Kết luận?', ['Công suất phù hợp', 'Quá nhỏ', 'Quá lớn', 'Hỏng'], 0, 'Dưới 30 s là phù hợp.'),
    Q('Rơle thay thế không ngắt khi block kẹt. Cần?', ['Ngắt nguồn ngay, rơle lớn hơn block', 'Cứ để chạy', 'Tăng điện áp', 'Đổi tụ'], 0, 'Tránh cháy block.'),
    Q('Rơle ghi 1/6 HP, 220 V nên dùng cho block?', ['1/6 HP', '1/2 HP', '1/12 HP', 'Bất kỳ'], 0, 'Công suất phải khớp.'),
    Q('Nên làm gì trước khi thay rơle mới?', ['Tìm và khắc phục nguyên nhân gây quá tải', 'Bỏ qua', 'Tăng gas', 'Thay dàn nóng'], 0, 'Nếu không, rơle mới cũng hỏng.')
  ];
  const sort = {
    title: 'Biểu hiện / đặc điểm này ứng với trường hợp nào?',
    buckets: [{ id: 'good', name: 'Rơle ĐÚNG' }, { id: 'small', name: 'Rơle NHỎ hơn block' }, { id: 'big', name: 'Rơle LỚN hơn block' }],
    items: [
      { t: 'Block chạy bình thường, quá tải thì ngắt trong 10–20 s', b: 'good' }, { t: 'Bảo vệ đúng, không ngắt oan', b: 'good' }, { t: 'Dòng khởi động 0,15 s không làm rơle nhảy', b: 'good' }, { t: 'Nguội rồi tự đóng lại', b: 'good' },
      { t: 'Tủ chạy rồi ngắt liên tục', b: 'small' }, { t: 'Dây nung quá nhỏ nên nóng nhanh', b: 'small' }, { t: 'Ngắt dù dòng đo bình thường', b: 'small' }, { t: 'Tủ kém lạnh vì thời gian chạy ngắn', b: 'small' },
      { t: 'Block kẹt mà không ngắt', b: 'big' }, { t: 'Ngắt sau hơn 30 s', b: 'big' }, { t: 'Nguy cơ cháy cuộn dây block', b: 'big' }, { t: 'Phải ngắt nguồn tay khi thử quá tải', b: 'big' }
    ]
  };
  const order = [
    { title: 'Rơle bảo vệ ngắt điện', intro: 'Sắp xếp diễn biến khi block bị quá tải.', steps: ['Block bị kẹt cơ, dòng tăng cao kéo dài', 'Dòng qua dây nung lớn, dây nóng lên', 'Nhiệt làm thanh lưỡng kim cong', 'Tiếp điểm động rời tiếp điểm tĩnh, mạch hở', 'Block mất điện, dừng chạy', 'Lưỡng kim nguội, tiếp điểm đóng lại'] },
    { title: 'Kiểm tra rơle bảo vệ', intro: 'Block không chạy, dòng = 0. Sắp xếp các bước kiểm tra.', steps: ['Kiểm tra nguồn cấp và dây dẫn', 'Tháo rơle bảo vệ ra khỏi block', 'Đặt đồng hồ vạn năng thang x1 Ω, chỉnh kim về 0', 'Đo hai chân vào – ra của rơle', 'Kim lên: rơle tốt, tìm hỏng hóc nơi khác', 'Kim không lên: thay rơle mới đúng công suất'] },
    { title: 'Thử công suất rơle thay thế', intro: 'Không có thông số: sắp xếp quy trình thử.', steps: ['Lắp rơle cùng hình dạng, kích thước', 'Cấp nguồn, cho block chạy bình thường', 'Rơle ngắt liên tục → nhỏ hơn block', 'Gây quá tải (cấp điện lại ngay khi áp suất còn cao)', 'Đếm thời gian rơle ngắt, kẹp dòng', 'Ngắt ≤ 30 s thì phù hợp, không ngắt thì rơle quá lớn'] }
  ];
  DL.register({
    id: 6, ready: true, title: 'Rơle bảo vệ', sub: 'Công dụng, cấu tạo, hư hỏng, thay thế', minutes: 25,
    lead: 'Rơle bảo vệ là “cầu dao tự động” của block. Bài này giải thích 3 loại rơle, cách lưỡng kim và dây nung phối hợp ngắt điện, cách kiểm tra và vì sao phải thay đúng công suất.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
