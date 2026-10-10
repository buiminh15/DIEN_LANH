/* BÀI 9 — RƠLE KHỐNG CHẾ NHIỆT ĐỘ (THERMOSTAT) (biên soạn từ docs/Bai_9.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const PARTS = {
    bulb: ['Bầu cảm biến + ống dẫn', 'Đặt trong ngăn tủ để <b>cảm nhận nhiệt độ</b>. Bên trong chứa <b>môi chất (gas) hoặc dầu</b>; nóng thì giãn nở, áp suất tăng.'],
    bell: ['Hộp xếp (ống xếp)', 'Nhận áp suất từ ống dẫn: nở ra khi nóng, xẹp xuống khi lạnh → <b>đẩy/kéo cơ cấu lật</b>.'],
    spring: ['Lò xo phản lực', 'Ngược chiều với hộp xếp. <b>Núm điều chỉnh</b> thay đổi độ nén của lò xo → đổi <b>nhiệt độ ngắt</b>.'],
    snap: ['Cơ cấu lật + tiếp điểm', 'Chuyển nhanh trạng thái <b>đóng – ngắt</b> cặp tiếp điểm động – tĩnh (cấp / cắt nguồn cho block).'],
    knob: ['Núm điều chỉnh', 'Vặn <b>số lớn</b> → lò xo nén mạnh, tủ <b>lạnh sâu</b>, block chạy lâu. Vặn <b>số nhỏ</b> → tủ ấm hơn, block chạy ngắn.']
  };

  function mechSVG(on, hot) {
    const k = on ? 'var(--ok)' : 'var(--bad)';
    return `<svg viewBox="0 0 560 190" role="img" aria-label="Rơle khống chế nhiệt độ kiểu áp lực: tiếp điểm ${on ? 'đóng' : 'mở'}">
      <rect x="10" y="40" width="110" height="110" rx="12" fill="var(--cold-tint)" stroke="var(--cold)" stroke-width="3"/><text class="sub" x="65" y="100" text-anchor="middle" style="fill:var(--ink)">trong ngăn tủ</text>
      <circle cx="40" cy="120" r="22" fill="${hot ? 'var(--hot)' : 'var(--cold-l)'}" stroke="var(--ink)" stroke-width="2.5"/><text class="fl" x="40" y="163" text-anchor="middle">bầu cảm biến</text>
      <path d="M62 120H210" stroke="var(--ink)" stroke-width="3" fill="none"/>
      <rect x="210" y="85" width="${hot ? 80 : 56}" height="70" rx="6" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/><text class="fl" x="${hot ? 250 : 238}" y="125" text-anchor="middle">hộp xếp</text>
      <path d="M${hot ? 290 : 266} 120H340" stroke="var(--ink)" stroke-width="5"/>
      <path d="M380 140q15-10 0-20t0-20t0-20" fill="none" stroke="var(--muted)" stroke-width="3"/><text class="fl" x="400" y="115">lò xo</text>
      <path d="M340 70H460" stroke="var(--ink)" stroke-width="5"/><circle cx="340" cy="70" r="4" fill="var(--ink)"/>
      <path d="M460 70${on ? 'H500' : 'L488 40'}" stroke="var(--ink)" stroke-width="5"/><circle cx="500" cy="70" r="5" fill="${k}"/>
      <text class="lbl" x="420" y="30" style="fill:${k}">${on ? 'TIẾP ĐIỂM ĐÓNG → block chạy' : 'TIẾP ĐIỂM MỞ → block dừng'}</text>
      <text class="fl" x="330" y="175">núm điều chỉnh (đổi lực lò xo)</text></svg>`;
  }

  function chartSVG(pts, tOn, tOff) {
    const W = 560, H = 180, lo = -12, hi = 34, X = i => 40 + i / 299 * (W - 60), Y = t => 10 + (hi - t) / (hi - lo) * (H - 30);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p).toFixed(1)}`).join('');
    return `<svg viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Đồ thị nhiệt độ trong tủ theo thời gian">
      <path d="M40 10V${H - 20}H${W - 10}" stroke="var(--ink)" fill="none" stroke-width="2"/>
      ${[-10, 0, 10, 20, 30].map(t => `<path d="M36 ${Y(t)}H${W - 10}" stroke="var(--line)"/><text class="fl" x="34" y="${Y(t) + 4}" text-anchor="end">${t}°</text>`).join('')}
      <path d="M40 ${Y(tOn)}H${W - 10}" stroke="var(--hot)" stroke-dasharray="6 4"/><path d="M40 ${Y(tOff)}H${W - 10}" stroke="var(--cold)" stroke-dasharray="6 4"/>
      <text class="fl" x="${W - 12}" y="${Y(tOn) - 4}" text-anchor="end" style="fill:var(--hot)">đóng (chạy) ${tOn.toFixed(1)}°C</text><text class="fl" x="${W - 12}" y="${Y(tOff) + 14}" text-anchor="end" style="fill:var(--cold)">ngắt (dừng) ${tOff.toFixed(1)}°C</text>
      <path d="${d}" fill="none" stroke="var(--ink)" stroke-width="3"/></svg>`;
  }

  /* điện trở nhiệt âm (kΩ) theo nhiệt độ — số liệu minh họa theo bài giảng */
  const ntc = T => T >= 12 ? 5 + (32 - T) * .5 : 15 + (12 - T) * (2.5 / 6);

  function learn() {
    return `
<section class="sec" id="s-role" data-toc="1 · Công dụng">
  <div class="sec-n">Phần 1</div><h2>Rơle khống chế nhiệt độ (thermostat)</h2>
  <p>Trong tủ lạnh có <b>1 – 2 núm</b> điều chỉnh; núm nối với thermostat quyết định tủ <b>lạnh nhiều hay ít</b>. Muốn tủ lạnh được, hệ thống phải có đủ 4 điều kiện: đủ 4 bộ phận chính nối kín – nạp đủ gas – <b>block chạy</b> – vỏ cách nhiệt tốt. Thermostat <b>cắt điều kiện “block chạy”</b> khi tủ đủ lạnh.</p>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Công dụng</b><p><b>Đóng – ngắt nguồn cho block</b> để giữ nhiệt độ trong ngăn tủ ở mức mong muốn. Vặn <b>số nhỏ</b> (mùa đông, bảo quản ở nhiệt độ cao): block chạy ít. Vặn <b>số lớn</b>: tủ <b>lạnh sâu</b>, chạy nhiều.</p></div></div>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Loại cơ (áp lực)</h4><p style="margin:6px 0 0">Dùng trong tủ lạnh điều khiển cơ. Bài này học trước.</p></div><div class="panel warm" style="margin:0"><h4>Loại điện tử</h4><p style="margin:6px 0 0">Dùng trong tủ lạnh có bo mạch điện tử (cảm biến NTC + vi xử lý).</p></div></div>
</section>

<section class="sec" id="s-mech" data-toc="2 · Loại cơ">
  <div class="sec-n">Phần 2</div><h2>Thermostat cơ (kiểu áp lực)</h2>
  <p>Gồm: bầu cảm biến + ống dẫn, hộp xếp, tiếp điểm động – tĩnh, lò xo phản lực, núm điều chỉnh, cơ cấu lật, vỏ. Bấm từng bộ phận:</p>
  <div id="pTabs"></div><article class="panel" id="pPanel" aria-live="polite"></article>
  <h3 style="margin-top:24px">🔬 Mô phỏng tủ chạy – dừng theo thermostat</h3>
  <p>Chọn số núm và thử các lỗi. Đường đứt nét đỏ: nhiệt độ <b>đóng</b> (block chạy); xanh: nhiệt độ <b>ngắt</b> (block dừng).</p>
  <div class="stage"><div id="mSvg"></div><div id="mChart"></div>
    <div class="controls"><label>Núm số <input id="knob" type="range" min="1" max="7" value="3" style="width:140px"> <b id="knobV"></b></label>
      <label>Tình trạng <select id="mFault" class="btn sm" style="min-height:36px"><option value="ok">Tốt</option><option value="nosense">Mất kín bầu cảm biến (hết môi chất)</option><option value="stuck">Tiếp điểm dính / lò xo yếu</option></select></label>
      <button class="btn sm" id="mRs">↺ Làm lại</button></div>
    <div class="verdict" id="mV" style="margin:0 14px 12px"></div></div>
</section>

<section class="sec" id="s-fault" data-toc="3 · Hư hỏng, kiểm tra">
  <div class="sec-n">Phần 3</div><h2>Hư hỏng và kiểm tra</h2>
  <div class="grid2"><div class="panel hotc" style="margin:0"><h4>Mất môi chất ở bầu/ống/hộp xếp</h4><p style="margin:6px 0 0">Không còn áp suất để đẩy → lò xo luôn đẩy tiếp điểm <b>mở</b> (hoặc tiếp điểm tiếp xúc kém) → <b>block không chạy, dòng = 0, đèn vẫn sáng</b>.</p></div>
    <div class="panel hotc" style="margin:0"><h4>Tiếp điểm dính / lò xo phản lực yếu</h4><p style="margin:6px 0 0">Không ngắt được → <b>tủ chạy liên tục</b>, ngăn mát xuống rất thấp (có thể <b>đóng đá</b>), tốn điện. Hoặc ngắt không đúng nhiệt độ.</p></div></div>
  <p style="margin-top:12px">Dòng = 0 còn rất nhiều nguyên nhân khác (chưa có nguồn, đứt dây, hỏng cuộn dây block, rơle bảo vệ, rơle khởi động...). Nghi thermostat thì đo trực tiếp.</p>
  <h3 style="margin-top:22px">Quy trình đo</h3>
  ${U.steps([['Tủ không chạy, dòng = 0 → đo hai chân thermostat (x1 Ω)', 'Kim <b>không lên</b> (khi nhiệt độ cao đã đủ đóng) → thermostat <b>hỏng</b>. Kim lên → thermostat tốt, hỏng ở thiết bị khác.'], ['Tủ chạy liên tục → vặn núm từ <b>số lớn về số nhỏ</b>', 'Block <b>ngắt được</b> → thermostat tốt (có thể chỉ do vặn quá lớn / cảm biến nằm ở nhiệt độ thấp). <b>Không ngắt</b> → hỏng tiếp điểm hoặc thermostat.'], ['Thermostat tháo rời: đo thông mạch', 'Hai chân phải <b>thông</b> khi đã đóng.'], ['Kiểm tra ngắt khi lạnh', 'Đặt bầu cảm biến vào chỗ lạnh (ngăn tủ lạnh) hoặc xịt <b>gas lạnh lỏng</b> (đeo găng bảo hộ!) → tiếp điểm phải <b>ngắt</b>; để ấm lại → <b>đóng</b>.']])}
  <div class="callout danger"><span class="ic">🧤</span><div><b class="t">An toàn</b><p>Khi xịt gas lạnh vào bầu cảm biến phải <b>đeo găng, kính bảo hộ</b> — gas lỏng chạm da gây <b>bỏng lạnh</b>.</p></div></div>
</section>

<section class="sec" id="s-swap" data-toc="4 · Thay thế">
  <div class="sec-n">Phần 4</div><h2>Thay thế thermostat</h2>
  <div class="tabs"><div class="tab" style="cursor:default"><b>1</b><span><strong>Đúng vị trí lắp</strong><br><small class="muted">Thermostat <b>ngăn đông (âm)</b> khác thermostat <b>ngăn mát (dương)</b>. Phải thay đúng loại.</small></span></div>
    <div class="tab" style="cursor:default"><b>2</b><span><strong>Đúng khoảng nhiệt độ</strong><br><small class="muted">Thay xong phải <b>đóng ngắt hợp lý</b> trong phạm vi nhiệt độ yêu cầu, để tủ không chạy liên tục.</small></span></div>
    <div class="tab" style="cursor:default"><b>3</b><span><strong>Đúng số chân</strong><br><small class="muted">Tủ 2 cánh trực tiếp thường dùng loại <b>3 chân</b> (có thêm tiếp điểm đóng mở bằng tay / sấy). Xác định chân đúng rồi đấu theo sơ đồ.</small></span></div></div>
  <h3 style="margin-top:22px">Phân biệt thermostat âm và dương (khi mất thông số)</h3>
  ${U.steps([['Vặn núm về số nhỏ (theo chiều ngược kim đồng hồ), đo tiếp điểm', 'Kim lên (thông) rồi mới thử tiếp.'], ['Đặt thermostat vào <b>ngăn mát</b> tủ đang chạy; núm ở số lớn hơn', 'Sau một thời gian tiếp điểm <b>ngắt</b> → đó là loại <b>dương</b> (ngăn mát).'], ['Không ngắt → chuyển vào <b>ngăn đông</b> thử tiếp', 'Ngắt ở ngăn đông → loại <b>âm</b>. Vẫn không ngắt → đang <b>dính tiếp điểm</b> (hỏng).']])}
  <div class="callout"><span class="ic">🌬️</span><div><b class="t">Tủ gián tiếp (quạt gió)</b><p>Thường có <b>2 bộ điều chỉnh</b>: một là <b>thermostat</b> (đóng – ngắt nguồn theo nhiệt độ), còn lại là <b>núm điều chỉnh lưu lượng gió</b> giữa ngăn đông và ngăn mát — <b>không điều khiển nguồn</b>. Cách phân biệt: vặn từ số lớn về số nhỏ, <b>block ngắt được</b> thì là thermostat.</p></div></div>
</section>

<section class="sec" id="s-elec" data-toc="5 · Loại điện tử">
  <div class="sec-n">Phần 5</div><h2>Thermostat điện tử</h2>
  <p>Dùng trong tủ lạnh điều khiển bằng <b>bo mạch</b>. Có 3 thành phần:</p>
  <dl class="kv"><dt>① Cảm biến nhiệt</dt><dd><b>Điện trở nhiệt âm (NTC)</b>: nhiệt độ <b>giảm</b> → điện trở <b>tăng</b>.</dd><dt>② Bộ chỉnh nhiệt</dt><dd><b>Biến trở VR</b>: núm xoay đổi giá trị trở.</dd><dt>③ Mạch điều khiển</dt><dd>Gồm <b>vi xử lý (IC)</b> đã được nhà sản xuất cài ngưỡng, cùng transistor và <b>rơle</b> 12 V để đóng ngắt block.</dd></dl>
  <h3 style="margin-top:22px">Cách hoạt động</h3>
  <p>NTC và VR nối nối tiếp; 5 V qua hai điện trở này tạo ra <b>điện áp báo về</b> cho IC. Ví dụ bài giảng: điện áp báo về <b>&gt; 2 V</b> → IC cấp tín hiệu cho transistor dẫn → cuộn rơle 12 V có điện → hút tiếp điểm → <b>block chạy</b>. Điện áp báo về <b>≤ 2 V</b> → IC ngắt tín hiệu → transistor tắt → tiếp điểm mở → <b>block dừng</b>. (Mạch thật có thêm độ trễ để không đóng ngắt liên tục.)</p>
  <h3>🔬 Mô phỏng</h3>
  <div class="panel" style="border-left-color:var(--cold)">
    <div class="row"><label>Nhiệt độ trong tủ <input id="eT" type="range" min="-4" max="34" value="30" style="width:220px"> <b id="eTV"></b></label>
    <label>Núm VR <select id="eVR" class="btn sm" style="min-height:36px"><option value="5">Số 1 (5 kΩ)</option><option value="2.5">Số giữa (2,5 kΩ)</option><option value="0">Số lớn nhất (0 kΩ)</option></select></label></div>
    <dl class="kv" style="margin:12px 0 4px"><dt>Điện trở NTC</dt><dd id="eN"></dd><dt>Tổng NTC + VR</dt><dd id="eS"></dd><dt>Điện áp báo về</dt><dd id="eV"></dd></dl>
    <div class="verdict" id="eOut"></div></div>
  <p class="muted" style="font-size:14px;margin-top:8px">Số liệu NTC minh họa theo bài giảng (VD ở 32 °C ≈ 5 kΩ, ở 12 °C ≈ 15 kΩ). Điện áp = 40/R(kΩ) V để khớp ví dụ: tổng 20 kΩ → 2 V.</p>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Thermostat đóng – ngắt block để khống chế nhiệt độ ngăn tủ.</b></div></li>
    <li class="done"><div><b>Loại cơ: bầu cảm biến → hộp xếp ↔ lò xo phản lực → cơ cấu lật → tiếp điểm.</b></div></li>
    <li class="done"><div><b>Nóng: áp suất tăng, hộp xếp thắng lò xo, tiếp điểm đóng.</b><span>Lạnh: lò xo thắng, tiếp điểm mở.</span></div></li>
    <li class="done"><div><b>Mất môi chất → block không chạy, đèn sáng. Dính tiếp điểm → chạy liên tục.</b></div></li>
    <li class="done"><div><b>Kiểm tra: đo x1 Ω; vặn số lớn → nhỏ; làm lạnh bầu cảm biến.</b></div></li>
    <li class="done"><div><b>Thay đúng loại âm / dương; loại điện tử dùng NTC + VR + IC.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/9/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    U.tabset($('#pTabs', root), Object.entries(PARTS).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#pPanel', root).innerHTML = `<h3>${PARTS[id][0]}</h3><p style="margin:0">${PARTS[id][1]}</p>`; });
    // mô phỏng cơ
    const kn = $('#knob', root); let T, on, pts, tm;
    const tOffOf = () => 9 - 1.5 * +kn.value, set = () => { $('#knobV', root).textContent = kn.value; };
    function reset() { clearInterval(tm); T = 20; on = true; pts = Array(300).fill(T); set(); tm = setInterval(tick, 60); tick(); }
    function tick() {
      if (!document.body.contains($('#mSvg', root))) { clearInterval(tm); return; }
      const f = $('#mFault', root).value, off = tOffOf(), onT = off + 3;
      if (f === 'nosense') on = false; else if (f === 'stuck') on = true; else if (T <= off) on = false; else if (T >= onT) on = true;
      T += on ? -0.13 : (32 - T) * .004 + .02; T = Math.max(-14, Math.min(32, T));
      pts.push(T); pts.shift();
      $('#mSvg', root).innerHTML = mechSVG(on, T > onT - 1.5);
      $('#mChart', root).innerHTML = chartSVG(pts, onT, off);
      const v = $('#mV', root);
      const m = f === 'ok' ? `Nhiệt độ ngăn tủ ≈ <b>${T.toFixed(1)} °C</b> · block <b>${on ? 'CHẠY' : 'DỪNG'}</b>. Núm số ${kn.value}: ngắt ở ${off.toFixed(1)} °C, chạy lại ở ${onT.toFixed(1)} °C.` : f === 'nosense' ? `✗ Tiếp điểm không đóng được: block <b>không chạy</b>, nhiệt độ tăng lên ${T.toFixed(1)} °C — <b>đèn vẫn sáng, dòng = 0</b>.` : `✗ Không ngắt được: block <b>chạy liên tục</b>, nhiệt độ rơi xuống ${T.toFixed(1)} °C ${T < 0 ? '(<b>ngăn mát đóng đá!</b>)' : ''}.`;
      v.className = 'verdict ' + (f === 'ok' ? '' : 'bad'); v.innerHTML = m;
    }
    kn.oninput = set; $('#mFault', root).onchange = reset; $('#mRs', root).onclick = reset; reset();
    // điện tử
    const eT = $('#eT', root), eVR = $('#eVR', root); let eon = true;
    const el = () => {
      const T0 = +eT.value, n = ntc(T0), s = n + +eVR.value, V = 40 / s;
      if (V <= 2) eon = false; else if (V > 2.3) eon = true;
      $('#eTV', root).textContent = T0 + ' °C'; $('#eN', root).textContent = n.toFixed(1) + ' kΩ'; $('#eS', root).textContent = s.toFixed(1) + ' kΩ'; $('#eV', root).innerHTML = `<b>${V.toFixed(2)} V</b> (ngưỡng 2 V)`;
      const o = $('#eOut', root); o.className = 'verdict ' + (eon ? 'ok' : 'bad');
      o.innerHTML = eon ? `Điện áp báo về <b>&gt; 2 V</b> → IC cấp tín hiệu → transistor dẫn → rơle hút → <b>BLOCK CHẠY</b> (tủ còn nóng).` : `Điện áp báo về <b>≤ 2 V</b> → IC ngắt tín hiệu → transistor tắt → rơle nhả → <b>BLOCK DỪNG</b> (tủ đã đủ lạnh).`;
    };
    eT.oninput = el; eVR.onchange = el; el();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Công dụng của thermostat trong tủ lạnh?', b: '<b>Đóng – ngắt nguồn cho block</b> để khống chế nhiệt độ trong ngăn tủ.', tag: 'Công dụng' },
    { f: 'Vặn núm số lớn thì sao?', b: 'Tủ <b>lạnh sâu</b>, block chạy lâu.', tag: 'Công dụng' },
    { f: 'Vặn núm số nhỏ thì sao?', b: 'Nhiệt độ cao hơn, block chạy ít (mùa đông).', tag: 'Công dụng' },
    { f: 'Thermostat cắt điều kiện nào của hệ thống lạnh?', b: 'Điều kiện <b>“block hoạt động”</b>.', tag: 'Công dụng' },
    { f: 'Có mấy loại thermostat trong tủ lạnh?', b: '2: <b>cơ</b> (áp lực) và <b>điện tử</b>.', tag: 'Phân loại' },
    { f: 'Kể các bộ phận thermostat cơ.', b: 'Bầu cảm biến + ống dẫn, hộp xếp, tiếp điểm động/tĩnh, lò xo phản lực, núm điều chỉnh, cơ cấu lật, vỏ.', tag: 'Cấu tạo' },
    { f: 'Bầu cảm biến chứa gì?', b: 'Môi chất (gas) hoặc <b>dầu</b>, giãn nở khi đổi nhiệt độ.', tag: 'Cấu tạo' },
    { f: 'Núm điều chỉnh làm thay đổi gì?', b: 'Độ nén của <b>lò xo phản lực</b> → đổi nhiệt độ ngắt.', tag: 'Cấu tạo' },
    { f: 'Nhiệt độ cao thì thermostat cơ làm gì?', b: 'Áp suất trong bầu tăng, hộp xếp nở thắng lò xo → <b>đóng</b> tiếp điểm → block chạy.', tag: 'Nguyên lý' },
    { f: 'Đủ lạnh thì thermostat làm gì?', b: 'Áp suất giảm, lò xo thắng → <b>mở</b> tiếp điểm → block dừng.', tag: 'Nguyên lý' },
    { f: 'Mất môi chất ở bầu cảm biến → ?', b: 'Tiếp điểm không đóng: <b>block không chạy, đèn sáng, dòng = 0</b>.', tag: 'Hư hỏng' },
    { f: 'Tiếp điểm dính / lò xo yếu → ?', b: 'Không ngắt: tủ <b>chạy liên tục</b>, ngăn mát xuống rất thấp, đóng đá.', tag: 'Hư hỏng' },
    { f: 'Tủ không chạy, nghi thermostat: đo sao?', b: 'Thang x1 Ω đo hai chân: kim không lên = hỏng.', tag: 'Kiểm tra' },
    { f: 'Tủ chạy liên tục: thử gì trước?', b: 'Vặn núm từ <b>số lớn về số nhỏ</b>; nếu block ngắt được thì thermostat còn tốt.', tag: 'Kiểm tra' },
    { f: 'Kiểm tra thermostat rời ngoài mạch?', b: 'Đo thông mạch; làm lạnh bầu cảm biến (gas lạnh / ngăn lạnh) xem có <b>ngắt</b> không.', tag: 'Kiểm tra' },
    { f: 'Phải bảo hộ gì khi xịt gas lạnh?', b: 'Găng tay, kính — tránh <b>bỏng lạnh</b>.', tag: 'Kiểm tra' },
    { f: 'Phân biệt thermostat âm và dương?', b: 'Thử trong <b>ngăn mát</b> (núm số nhỏ): ngắt → dương; không ngắt → thử ngăn đông: ngắt → âm.', tag: 'Thay thế' },
    { f: 'Thermostat âm đặt ở ngăn nào?', b: '<b>Ngăn đông</b>.', tag: 'Thay thế' },
    { f: 'Thermostat dương đặt ở ngăn nào?', b: '<b>Ngăn mát</b>.', tag: 'Thay thế' },
    { f: 'Tủ trực tiếp 2 cánh dùng thermostat mấy chân?', b: '<b>3 chân</b> (có tiếp điểm đóng mở bằng tay cho sấy).', tag: 'Thay thế' },
    { f: 'Tủ gián tiếp có mấy bộ điều chỉnh? Phân biệt?', b: '2: thermostat (đóng ngắt block) và núm chỉnh <b>lưu lượng gió</b>. Vặn lớn→nhỏ mà block ngắt = thermostat.', tag: 'Thay thế' },
    { f: 'Thermostat điện tử gồm các phần nào?', b: 'Cảm biến nhiệt (NTC), biến trở VR, mạch điều khiển (IC vi xử lý + transistor + rơle).', tag: 'Điện tử' },
    { f: 'NTC là gì?', b: 'Điện trở nhiệt <b>âm</b>: nhiệt độ giảm → điện trở <b>tăng</b>.', tag: 'Điện tử' },
    { f: 'Biến trở VR dùng để?', b: 'Đặt nhiệt độ mong muốn (núm xoay).', tag: 'Điện tử' },
    { f: 'IC vi xử lý làm gì?', b: 'So sánh <b>điện áp báo về</b> với ngưỡng cài sẵn để điều khiển transistor/rơle.', tag: 'Điện tử' },
    { f: 'Ví dụ: điện áp báo về lớn hơn 2 V thì?', b: 'IC cấp tín hiệu → rơle hút → <b>block chạy</b>.', tag: 'Điện tử' },
    { f: 'Ví dụ: điện áp báo về ≤ 2 V thì?', b: 'IC ngắt → rơle nhả → <b>block dừng</b>.', tag: 'Điện tử' },
    { f: 'Tủ nguội đi thì điện trở NTC sao?', b: 'Điện trở NTC <b>tăng</b>.', tag: 'Điện tử' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Thermostat dùng để?', ['Khởi động block', 'Đóng ngắt block để giữ nhiệt độ', 'Bảo vệ quá tải', 'Xả tuyết'], 1, 'Khống chế nhiệt độ.'),
    Q('Vặn núm số lớn?', ['Tủ lạnh sâu hơn', 'Tủ ấm hơn', 'Không đổi', 'Tắt tủ'], 0, 'Block chạy lâu hơn.'),
    Q('Thermostat cơ còn gọi là kiểu?', ['Áp lực', 'Điện từ', 'Bán dẫn', 'Quang'], 0, 'Dựa trên áp suất môi chất.'),
    Q('Núm điều chỉnh thay đổi?', ['Lực lò xo phản lực', 'Điện áp', 'Lượng gas', 'Dầu'], 0, 'Đổi nhiệt độ ngắt.'),
    Q('Khi nhiệt độ tăng, hộp xếp?', ['Nở ra, đóng tiếp điểm', 'Xẹp, mở tiếp điểm', 'Không đổi', 'Hỏng'], 0, 'Thắng lò xo.'),
    Q('Khi tủ đủ lạnh, tiếp điểm?', ['Mở', 'Đóng', 'Cháy', 'Dính'], 0, 'Lò xo thắng hộp xếp.'),
    Q('Mất môi chất ở bầu cảm biến → ?', ['Block không chạy, đèn sáng', 'Tủ chạy liên tục', 'Tủ lạnh sâu', 'Dòng cao'], 0, 'Tiếp điểm không đóng.'),
    Q('Tiếp điểm dính → ?', ['Block chạy liên tục', 'Block không chạy', 'Dòng bằng 0', 'Đèn tắt'], 0, 'Không ngắt được.'),
    Q('Dòng bằng 0, nghi thermostat: đo hai chân thấy kim không lên là?', ['Thermostat hỏng', 'Thermostat tốt', 'Tụ yếu', 'Block tốt'], 0, 'Hở mạch.'),
    Q('Tủ chạy liên tục: thử gì?', ['Vặn núm từ số lớn về nhỏ', 'Thay block', 'Nạp gas', 'Thay dàn'], 0, 'Xem block có ngắt được không.'),
    Q('Làm lạnh bầu cảm biến để kiểm tra, cần?', ['Găng, kính bảo hộ', 'Không cần', 'Nước nóng', 'Dầu'], 0, 'Tránh bỏng lạnh.'),
    Q('Thermostat âm đặt ở?', ['Ngăn đông', 'Ngăn mát', 'Cửa', 'Dàn nóng'], 0, 'Nhiệt độ thấp hơn.'),
    Q('Thermostat dương đặt ở?', ['Ngăn mát', 'Ngăn đông', 'Dưới đáy', 'Cạnh block'], 0, 'Nhiệt độ dương.'),
    Q('Thử thermostat ở ngăn mát (núm số nhỏ), ngắt được → ?', ['Loại dương', 'Loại âm', 'Hỏng', 'Điện tử'], 0, 'Đúng loại ngăn mát.'),
    Q('Tủ 2 cánh trực tiếp thường dùng thermostat?', ['3 chân', '1 chân', '5 chân', 'Không có'], 0, 'Có tiếp điểm tay cho sấy.'),
    Q('Tủ gián tiếp có hai bộ điều chỉnh: bộ nào KHÔNG điều khiển nguồn?', ['Núm chỉnh lưu lượng gió', 'Thermostat', 'Rơle bảo vệ', 'Công tắc cửa'], 0, 'Chỉ chỉnh gió.'),
    Q('Thermostat điện tử dùng cảm biến?', ['NTC', 'Lưỡng kim', 'Hộp xếp', 'Cuộn dây'], 0, 'Điện trở nhiệt âm.'),
    Q('NTC: nhiệt độ giảm thì điện trở?', ['Tăng', 'Giảm', 'Không đổi', 'Bằng 0'], 0, 'Hệ số nhiệt âm.'),
    Q('Biến trở VR trong mạch dùng để?', ['Đặt nhiệt độ mong muốn', 'Nén gas', 'Đo dòng', 'Chiếu sáng'], 0, 'Núm xoay.'),
    Q('Linh kiện cài sẵn ngưỡng điện áp là?', ['IC vi xử lý', 'Tụ', 'Điốt', 'Điện trở'], 0, 'Nhà sản xuất lập trình.'),
    Q('Điện áp báo về lớn hơn ngưỡng 2 V → ?', ['Block chạy', 'Block dừng', 'Tắt đèn', 'Xả tuyết'], 0, 'Tủ còn nóng.'),
    Q('Điện áp báo về ≤ 2 V → ?', ['Block dừng', 'Block chạy', 'Cháy IC', 'Xả tuyết'], 0, 'Tủ đủ lạnh.'),
    Q('Tủ nguội dần, điện áp báo về sẽ?', ['Giảm', 'Tăng', 'Không đổi', 'Bằng 0'], 0, 'Điện trở tăng → điện áp giảm.'),
    Q('Rơle trong mạch điện tử thường dùng nguồn?', ['12 V DC', '220 V AC', '5 V AC', '1 V'], 0, 'Cuộn rơle 12 V.'),
    Q('Thay thermostat xong cần?', ['Đóng ngắt hợp lý trong dải nhiệt', 'Không cần kiểm tra', 'Tăng gas', 'Bỏ núm'], 0, 'Tránh tủ chạy liên tục.')
  ];
  const sort = {
    title: 'Hiện tượng này ứng với tình huống nào?',
    buckets: [{ id: 'sense', name: 'Mất môi chất / không đóng' }, { id: 'stuck', name: 'Dính / không ngắt' }, { id: 'ok', name: 'Thermostat tốt' }],
    items: [
      { t: 'Block không chạy, đèn vẫn sáng', b: 'sense' }, { t: 'Dòng = 0 và đo hai chân kim không lên', b: 'sense' }, { t: 'Hộp xếp không phản ứng', b: 'sense' }, { t: 'Nhiệt độ ngăn tủ tăng dần', b: 'sense' },
      { t: 'Tủ chạy liên tục nhiều giờ', b: 'stuck' }, { t: 'Ngăn mát đóng đá', b: 'stuck' }, { t: 'Vặn núm số nhỏ vẫn không ngắt', b: 'stuck' }, { t: 'Tốn điện, block nóng', b: 'stuck' },
      { t: 'Vặn từ số lớn về số nhỏ block ngắt được', b: 'ok' }, { t: 'Xịt lạnh bầu cảm biến tiếp điểm ngắt', b: 'ok' }, { t: 'Tủ chạy – dừng theo chu kỳ', b: 'ok' }, { t: 'Đo hai chân thấy thông khi nóng', b: 'ok' }
    ]
  };
  const order = [
    { title: 'Thermostat cơ làm việc', intro: 'Sắp xếp một chu kỳ.', steps: ['Nhiệt độ ngăn tủ tăng', 'Gas/dầu trong bầu cảm biến nở, áp suất tăng', 'Hộp xếp nở thắng lò xo phản lực', 'Cơ cấu lật đóng tiếp điểm, block chạy', 'Tủ lạnh dần, áp suất giảm', 'Lò xo đẩy tiếp điểm mở, block dừng'] },
    { title: 'Kiểm tra thermostat', intro: 'Tủ chạy liên tục. Sắp xếp các bước.', steps: ['Quan sát hiện tượng: tủ chạy liên tục, ngăn mát đóng đá', 'Vặn núm từ số lớn về số nhỏ', 'Block ngắt được: thermostat tốt', 'Không ngắt: tháo thermostat ra', 'Đo thông mạch, làm lạnh bầu cảm biến', 'Không ngắt khi lạnh: thay thermostat đúng loại'] },
    { title: 'Thermostat điện tử', intro: 'Sắp xếp chuỗi điều khiển.', steps: ['Nhiệt độ tủ cao, điện trở NTC nhỏ', 'Điện áp báo về lớn hơn 2 V', 'IC cấp tín hiệu cho transistor', 'Transistor dẫn, cuộn rơle 12 V có điện', 'Tiếp điểm đóng, block chạy', 'Tủ lạnh, NTC tăng, điện áp ≤ 2 V, IC ngắt, block dừng'] }
  ];
  DL.register({
    id: 9, ready: true, title: 'Rơle khống chế nhiệt độ', sub: 'Thermostat cơ và điện tử, hư hỏng, kiểm tra', minutes: 30,
    lead: 'Thermostat quyết định tủ lạnh nhiều hay ít bằng cách đóng – ngắt block. Bài này mô phỏng chu kỳ chạy – dừng, các lỗi phổ biến và mạch điện tử NTC + IC.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
