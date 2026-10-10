/* NGUYÊN LÝ LÀM LẠNH — BÀI 6: ĐƠN VỊ ĐO, DỤNG CỤ ĐO (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_6.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const f1 = x => (Math.round(x * 100) / 100).toString().replace('.', ',');

  // Bộ đổi đơn vị: mỗi nhóm có hàm đổi về đơn vị chuẩn (to) và từ chuẩn (from)
  const CONV = {
    temp: { name: 'Nhiệt độ', units: { 'C': ['°C', x => x, x => x], 'F': ['°F', x => (x - 32) * 5 / 9, x => x * 9 / 5 + 32] }, def: 25, note: '°F = 9/5 × °C + 32;  °C = 5/9 × (°F − 32)' },
    pres: { name: 'Áp suất', units: { bar: ['bar', x => x, x => x], at: ['kg/cm² (at)', x => x / 1.02, x => x * 1.02], psi: ['psi', x => x / 14.5, x => x * 14.5], mpa: ['MPa', x => x * 10, x => x / 10] }, def: 1, note: '1 MPa = 10 bar ≈ 10,2 kg/cm²;  1 bar ≈ 1,02 kg/cm²;  1 kg/cm² ≈ 14,2 psi' },
    pow: { name: 'Công suất lạnh', units: { kw: ['kW', x => x, x => x], kcal: ['kcal/h', x => x / 860, x => x * 860], btu: ['BTU/h', x => x / 3440, x => x * 3440], hp: ['HP (ngựa)', x => x * .736, x => x / .736] }, def: 1, note: '1 kW = 860 kcal/h = 3.440 BTU/h;  1 HP = 736 W' },
    len: { name: 'Chiều dài', units: { mm: ['mm', x => x, x => x], cm: ['cm', x => x * 10, x => x / 10], inch: ['inch (in)', x => x * 25.4, x => x / 25.4] }, def: .5, note: '1 inch = 25,4 mm' }
  };

  const INST = {
    dmm: ['Đồng hồ vạn năng', 'Đo điện áp một chiều (DC V), xoay chiều (AC V), điện trở (Ω), dòng một chiều (DC mA), thông mạch, kiểm tra linh kiện (điện trở, tụ, điốt…). Hai loại: <b>đồng hồ cơ</b> (kim, xử lý nhanh, độ chính xác không cao) và <b>đồng hồ số</b> (chính xác, nhiều tính năng, khó sửa).'],
    clamp: ['Đồng hồ ampe kìm', 'Đo <b>cường độ dòng điện xoay chiều</b> bằng cách kẹp <b>một</b> dây, nguyên lý biến áp (dây là cuộn sơ cấp, cuộn trong đồng hồ là thứ cấp). Cũng đo được điện áp, điện trở như đồng hồ vạn năng. Rất quan trọng với thợ lạnh để biết tình trạng máy.'],
    gauge: ['Đồng hồ áp suất', 'Đồng hồ <b>đơn</b> (1 đồng hồ) hoặc <b>ghép</b> (2 đồng hồ, 2 khóa, 3 dây). <b>Đỏ = Hi</b> (áp cao, đến ~500 psi), <b>xanh = Lo</b> (áp thấp + chân không, đến −30 inHg), <b>vàng</b> = dây giữa nối bơm chân không/ bình gas. Mặt đồng hồ có vạch nhiệt độ sôi ứng với từng loại gas.'],
    other: ['Dụng cụ đo khác', '<b>Nhiệt kế</b> (điện tử/ hồng ngoại): đo nhiệt độ bề mặt dàn, vỏ block. <b>Máy dò gas</b>: tìm rò rỉ, đèn xanh – vàng – đỏ tương ứng mức rò tăng dần. Thợ lạnh còn dùng cân gas, đồng hồ chân không…']
  };

  function learn() {
    return `
<section class="sec" id="s-unit" data-toc="1 · Đơn vị đo">
  <div class="sec-n">Phần 1</div><h2>Các đơn vị đo thường gặp</h2>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Đại lượng</th><th>Ký hiệu</th><th>Đơn vị</th></tr></thead><tbody>
    <tr><td>Hiệu điện thế</td><td>U</td><td>Vôn (V)</td></tr>
    <tr><td>Cường độ dòng điện</td><td>I</td><td>Ampe (A), miliampe (mA)</td></tr>
    <tr><td>Công suất điện</td><td>P</td><td>Oát (W), kW; 1 số điện = 1 kWh</td></tr>
    <tr><td>Điện trở</td><td>R</td><td>Ôm (Ω)</td></tr>
    <tr><td>Điện dung</td><td>C</td><td>Micro-fara (µF)</td></tr>
    <tr><td>Tần số</td><td>f</td><td>Héc (Hz)</td></tr>
    <tr><td>Nhiệt độ</td><td>t</td><td>°C, °F</td></tr>
    <tr><td>Áp suất</td><td>p</td><td>bar, kg/cm², psi, MPa; chân không: cmHg, inHg</td></tr>
    <tr><td>Công suất lạnh</td><td>Q</td><td>kW, kcal/h, BTU/h</td></tr>
    <tr><td>Công suất cơ</td><td>P</td><td>HP (mã lực, ngựa), W</td></tr>
    <tr><td>Chiều dài</td><td>L</td><td>m, cm, mm, inch</td></tr></tbody></table></div>
  <p style="margin-top:14px">Công suất điện: <b>P = U × I</b>. Một máy điều hòa 9.000 BTU ≈ 1 HP, 12.000 BTU ≈ 1,5 HP, 18.000 BTU ≈ 2 HP. Chân không: −30 inHg ≈ −76 cmHg (chân không gần tuyệt đối).</p>
  <div class="stage" style="padding:14px"><b>Bộ đổi đơn vị</b>
    <div id="cTabs" style="margin-top:10px"></div>
    <div class="row" style="margin-top:12px"><input id="cV" type="number" step="any" style="width:130px;padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)"><select id="cU" style="padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)"></select></div>
    <div id="cOut" class="verdict" style="margin-top:10px"></div><p class="muted" id="cNote" style="margin:8px 0 0;font-size:13.5px"></p></div>
</section>

<section class="sec" id="s-inst" data-toc="2 · Dụng cụ đo">
  <div class="sec-n">Phần 2</div><h2>Ba dụng cụ đo không thể thiếu</h2>
  <div id="iTabs"></div><article class="panel" id="iPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-read" data-toc="3 · Đọc thang đo">
  <div class="sec-n">Phần 3</div><h2>Đọc đồng hồ kim theo thang đo</h2>
  <p>Mặt đồng hồ chỉ có vài vạch chia (ví dụ 10, 50, 250). Chọn thang nào thì <b>giá trị tối đa của vạch bằng đúng thang đó</b>. Nếu vạch chia lớn hơn/ nhỏ hơn thang đã chọn thì phải <b>nhân hoặc chia cho hệ số</b>: <b>giá trị thật = số đọc × (thang chọn ÷ giá trị tối đa của vạch)</b>.</p>
  <div class="stage" style="padding:14px"><b>Thử: kim chỉ số, chọn thang → giá trị thật?</b>
    <div class="row" style="margin-top:10px"><label>Đọc trên vạch 0–<b id="rMax">250</b>: <b id="rVal"></b></label></div>
    <div class="row" style="margin-top:8px"><label>Thang đã chọn: <select id="rRange" style="padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)"><option>10</option><option>50</option><option>250</option><option>1000</option></select></label>
      <label>Đáp án của bạn <input id="rAns" type="number" step="any" style="width:100px;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)"></label>
      <button class="btn pri sm" id="rChk">Kiểm tra</button><button class="btn sm" id="rNew">Đề mới</button></div>
    <div class="verdict" id="rV" style="margin-top:10px">Chọn thang rồi nhập giá trị thật.</div></div>
  <div class="callout"><span class="ic">📏</span><div><b class="t">Quy tắc an toàn khi đo</b><p>Không biết giá trị cần đo thì <b>chọn thang cao nhất rồi giảm dần</b>. Đo DC: que đỏ vào cực dương, que đen vào cực âm. Đo điện trở: chập hai que chỉnh kim về 0 mỗi lần đổi thang; đọc rồi nhân hệ số (×1, ×10, ×100, ×1k, ×10k); <b>không chạm tay</b> vào que khi đo; đo linh kiện nên tháo một chân.</p></div></div>
</section>

<section class="sec" id="s-clamp" data-toc="4 · Chẩn đoán bằng ampe kìm">
  <div class="sec-n">Phần 4</div><h2>Dùng ampe kìm để biết tình trạng máy</h2>
  <p>Kẹp <b>một</b> dây cấp nguồn cho phụ tải (động cơ, block), cấp điện và quan sát kim. Chọn thang lớn gấp 3 – 5 lần dòng định mức để đo được cả dòng khởi động rồi giảm dần. Chọn một tình huống:</p>
  <div id="kTabs"></div><div class="stage" style="padding:10px"><div id="kSvg"></div></div><article class="panel warm" id="kPanel" aria-live="polite"></article>
</section>

<section class="sec" id="s-gauge" data-toc="5 · Đồng hồ áp suất">
  <div class="sec-n">Phần 5</div><h2>Đồng hồ áp suất (manifold)</h2>
  <dl class="kv"><dt>Đồng hồ đỏ (Hi)</dt><dd>Đo áp suất cao: thử kín hệ thống, thử áp suất đẩy của block. Thang đến khoảng 500 psi (≈ 35 kg/cm²).</dd>
  <dt>Đồng hồ xanh (Lo)</dt><dd>Đo áp suất thấp và chân không: hút chân không, nạp gas, cân áp. Vạch xanh lá bên dưới số 0 là phần chân không.</dd>
  <dt>Dây vàng</dt><dd>Dây giữa, nối bình gas hoặc bơm chân không.</dd>
  <dt>Mắt kính gas</dt><dd>Quan sát dòng gas tuần hoàn, độ khô khi hút chân không.</dd>
  <dt>Vạch nhiệt độ sôi</dt><dd>Mỗi loại gas (R12, R22, R502, R134a…) có vạch riêng; <b>phải dùng đồng hồ đúng loại gas</b> mới quy đổi chính xác áp suất ↔ nhiệt độ sôi.</dd>
  <dt>Đầu dây</dt><dd>Một đầu có chốt ấn mở van một chiều, cần chọn đúng kiểu đầu (ren) của máy. Dùng xong nên cuộn gọn, tránh bụi bẩn lọt vào dây.</dd>
  <dt>Chỉnh sai số</dt><dd>Khi không có áp, kim phải chỉ 0; nếu lệch, mở nắp kính, dùng tua-vít dẹt chỉnh về 0.</dd></dl>
</section>

<section class="sec" id="s-recap" data-toc="6 · Tóm tắt">
  <div class="sec-n">Phần 6</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>°F = 9/5 °C + 32; 1 inch = 25,4 mm; 1 kW = 860 kcal/h = 3.440 BTU/h.</b></div></li>
    <li class="done"><div><b>Đồng hồ vạn năng: đo V, Ω, thông mạch; nhân hệ số khi đọc thang khác vạch.</b></div></li>
    <li class="done"><div><b>Ampe kìm đo dòng AC bằng cách kẹp một dây.</b></div></li>
    <li class="done"><div><b>Dòng khởi động lớn rồi về ≤ định mức = bình thường.</b></div></li>
    <li class="done"><div><b>Đồng hồ áp suất: đỏ Hi, xanh Lo + chân không, vàng ở giữa.</b></div></li>
    <li class="done"><div><b>Không biết giá trị thì chọn thang lớn nhất rồi giảm dần.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/6/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  /* các tình huống ampe kìm: dòng định mức 1,1 A. series = dòng theo thời gian (0..1 -> A) */
  const CL = {
    ok: { n: 'Chạy bình thường', pts: [0, 5.5, 3, 1.4, 1.1, 1.0, 1.0, 1.0], txt: 'Kim <b>vọt lên cao</b> (dòng khởi động) rồi <b>quay về ≤ dòng định mức</b> ghi trên thân (ở đây 1,1 A). Phụ tải làm việc bình thường.', cls: 'ok' },
    open: { n: 'Dòng bằng 0', pts: [0, 0, 0, 0, 0, 0, 0, 0], txt: 'Kim <b>không lên</b>: mạch hở, không có dòng. Kiểm tra dây dẫn (thông mạch), rơle khởi động/ bảo vệ, tụ, cuộn dây có đứt không.', cls: 'bad' },
    lock: { n: 'Dòng cao, không về (kẹt)', pts: [0, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5], txt: 'Kim vọt lên cao <b>và không quay về</b>: block không chạy, dòng rất cao, thường do kẹt cơ, chạm cuộn dây. Phải ngắt điện ngay vì dễ cháy cuộn dây.', cls: 'bad' },
    high: { n: 'Chạy nhưng dòng cao', pts: [0, 5.5, 3.5, 2.3, 1.9, 1.8, 1.8, 1.8], txt: 'Kim vọt lên rồi về <b>nhưng vẫn lớn hơn dòng định mức</b>: động cơ chạy mà bị “ăn dòng”, thường do tải nặng, thiếu dầu, gas thừa, chạm vòng dây. Cần tìm nguyên nhân.', cls: 'bad' }
  };
  function clampSvg(pts, max) {
    const W = 520, H = 170, px = i => 40 + i * (W - 60) / (pts.length - 1), py = v => H - 25 - v / max * (H - 45);
    const d = pts.map((v, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(v).toFixed(1)).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Đồ thị dòng điện theo thời gian"><path d="M40 10V${H - 25}H${W - 15}" stroke="var(--ink)" fill="none" stroke-width="2"/>
      <path d="M40 ${py(1.1).toFixed(1)}H${W - 15}" stroke="var(--ok)" stroke-dasharray="6 5" stroke-width="2"/><text class="fl" x="${W - 18}" y="${py(1.1) - 6}" text-anchor="end">dòng định mức 1,1 A</text>
      <path d="${d}" stroke="var(--hot)" stroke-width="4" fill="none" stroke-linejoin="round"/><text class="fl" x="${W - 18}" y="${H - 6}" text-anchor="end">thời gian →</text><text class="fl" x="8" y="20">A</text></svg>`;
  }

  function mount(root) {
    // đổi đơn vị
    let grp = 'temp';
    const calc = () => {
      const g = CONV[grp], v = parseFloat($('#cV', root).value), u = $('#cU', root).value;
      if (isNaN(v)) { $('#cOut', root).textContent = 'Nhập một số.'; return; }
      const base = g.units[u][1](v);
      $('#cOut', root).innerHTML = Object.entries(g.units).filter(([k]) => k !== u).map(([k, x]) => `<b>${f1(x[2](base))}</b> ${x[0]}`).join(' &nbsp;·&nbsp; ');
    };
    U.tabset($('#cTabs', root), Object.entries(CONV).map(([id, g], i) => ({ id, n: i + 1, name: g.name })), id => {
      grp = id; const g = CONV[id];
      $('#cU', root).innerHTML = Object.entries(g.units).map(([k, x]) => `<option value="${k}">${x[0]}</option>`).join('');
      $('#cV', root).value = g.def; $('#cNote', root).textContent = g.note; calc();
    });
    $('#cV', root).oninput = calc; $('#cU', root).onchange = calc;

    U.tabset($('#iTabs', root), Object.entries(INST).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { $('#iPanel', root).innerHTML = `<h3>${INST[id][0]}</h3><p style="margin:0">${INST[id][1]}</p>`; });

    // luyện đọc thang
    let R;
    const newQ = () => {
      const max = DL.shuffle([50, 250])[0], val = Math.round(Math.random() * (max / 5 - 2) + 2) * 5;
      R = { max, val }; $('#rMax', root).textContent = max; $('#rVal', root).textContent = val; $('#rAns', root).value = '';
      $('#rV', root).className = 'verdict'; $('#rV', root).textContent = 'Chọn thang rồi nhập giá trị thật.';
    };
    $('#rNew', root).onclick = newQ; newQ();
    $('#rChk', root).onclick = () => {
      const rg = +$('#rRange', root).value, truth = R.val * rg / R.max, a = parseFloat($('#rAns', root).value), v = $('#rV', root);
      const ok = Math.abs(a - truth) < .01; v.className = 'verdict ' + (ok ? 'ok' : 'bad');
      v.innerHTML = ok ? `✓ Đúng: ${R.val} × (${rg} ÷ ${R.max}) = <b>${f1(truth)}</b>.` : `✗ Chưa đúng. Công thức: ${R.val} × (${rg} ÷ ${R.max}) = <b>${f1(truth)}</b>.`;
    };

    // ampe kìm
    U.tabset($('#kTabs', root), Object.entries(CL).map(([id, p], i) => ({ id, n: i + 1, name: p.n })), id => {
      $('#kSvg', root).innerHTML = clampSvg(CL[id].pts, 8);
      $('#kPanel', root).innerHTML = `<h3>${CL[id].n} <span class="pill ${CL[id].cls}">${CL[id].cls === 'ok' ? 'Tốt' : 'Có sự cố'}</span></h3><p style="margin:0">${CL[id].txt}</p>`;
    });
  }

  const flashcards = [
    { f: 'Công thức đổi °C sang °F?', b: '°F = 9/5 × °C + 32.', tag: 'Đơn vị' },
    { f: '1 inch bằng bao nhiêu mm?', b: '25,4 mm.', tag: 'Đơn vị' },
    { f: '1 kg/cm² xấp xỉ bao nhiêu psi?', b: '≈ 14,2 psi.', tag: 'Đơn vị' },
    { f: '1 bar xấp xỉ bao nhiêu kg/cm²?', b: '≈ 1,02 kg/cm².', tag: 'Đơn vị' },
    { f: '1 MPa bằng?', b: '10 bar ≈ 10,2 kg/cm².', tag: 'Đơn vị' },
    { f: '1 kW bằng bao nhiêu kcal/h và BTU/h?', b: '860 kcal/h và 3.440 BTU/h.', tag: 'Đơn vị' },
    { f: '1 HP bằng?', b: '≈ 736 W (theo bài).', tag: 'Đơn vị' },
    { f: 'Điều hòa 9.000 BTU tương ứng?', b: '1 HP (12.000 BTU ≈ 1,5 HP, 18.000 BTU ≈ 2 HP).', tag: 'Đơn vị' },
    { f: '1 số điện là?', b: '1 kWh.', tag: 'Đơn vị' },
    { f: 'Công suất điện tính thế nào?', b: 'P = U × I.', tag: 'Đơn vị' },
    { f: 'Chân không −30 inHg bằng?', b: '≈ −76 cmHg.', tag: 'Đơn vị' },
    { f: 'Đồng hồ vạn năng đo được gì?', b: 'V (DC/AC), điện trở, thông mạch, dòng DC nhỏ, kiểm tra linh kiện.', tag: 'Vạn năng' },
    { f: 'Ưu – nhược đồng hồ cơ?', b: 'Xử lý nhanh; độ chính xác không cao.', tag: 'Vạn năng' },
    { f: 'Ưu – nhược đồng hồ số?', b: 'Chính xác, nhiều tính năng; khó sửa chữa.', tag: 'Vạn năng' },
    { f: 'Đo DC cần chú ý?', b: 'Que đỏ vào cực dương, que đen vào cực âm.', tag: 'Vạn năng' },
    { f: 'Không biết điện áp cần đo thì?', b: 'Để thang cao nhất rồi giảm dần.', tag: 'Vạn năng' },
    { f: 'Đo điện trở: trước khi đo cần?', b: 'Chập 2 que, chỉnh kim về 0; mỗi lần đổi thang chỉnh lại.', tag: 'Vạn năng' },
    { f: 'Khi đo điện trở có được chạm tay vào que không?', b: 'Không, làm sai kết quả.', tag: 'Vạn năng' },
    { f: 'Ampe kìm đo gì?', b: 'Cường độ dòng điện xoay chiều.', tag: 'Ampe kìm' },
    { f: 'Ampe kìm kẹp mấy dây?', b: 'Chỉ một dây (kẹp cả hai dây sẽ triệt tiêu, kim không lên).', tag: 'Ampe kìm' },
    { f: 'Nguyên lý ampe kìm?', b: 'Như máy biến áp: dây là sơ cấp, cuộn trong đồng hồ là thứ cấp.', tag: 'Ampe kìm' },
    { f: 'Dòng khởi động thường gấp mấy lần định mức?', b: 'Khoảng 3 – 6 lần.', tag: 'Ampe kìm' },
    { f: 'Kim vọt lên rồi về ≤ định mức nghĩa là?', b: 'Phụ tải hoạt động bình thường.', tag: 'Ampe kìm' },
    { f: 'Kim không lên (0 A) nghĩa là?', b: 'Mạch hở, không có dòng chạy.', tag: 'Ampe kìm' },
    { f: 'Kim vọt cao không về nghĩa là?', b: 'Phụ tải kẹt/ chạm, dòng cao, không chạy.', tag: 'Ampe kìm' },
    { f: 'Kim về nhưng vẫn lớn hơn định mức?', b: 'Chạy bị “dòng cao”.', tag: 'Ampe kìm' },
    { f: 'Đồng hồ áp đỏ là?', b: 'Hi – áp suất cao (đến khoảng 500 psi).', tag: 'Đồng hồ áp' },
    { f: 'Đồng hồ áp xanh là?', b: 'Lo – áp suất thấp và chân không (xuống −30 inHg).', tag: 'Đồng hồ áp' },
    { f: 'Dây vàng của bộ đồng hồ dùng để?', b: 'Nối bình gas hoặc bơm chân không.', tag: 'Đồng hồ áp' },
    { f: 'Vì sao đồng hồ áp phải đúng loại gas?', b: 'Vạch nhiệt độ sôi khác nhau theo từng loại gas.', tag: 'Đồng hồ áp' },
    { f: 'Kim đồng hồ lệch 0 khi không có áp thì sao?', b: 'Mở nắp kính, chỉnh vít về 0.', tag: 'Đồng hồ áp' },
    { f: 'Máy dò gas dùng để?', b: 'Tìm chỗ rò rỉ; đèn xanh – vàng – đỏ tương ứng mức rò tăng dần.', tag: 'Khác' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('25 °C bằng bao nhiêu °F?', ['77 °F', '45 °F', '57 °F', '95 °F'], 0, '25 × 9/5 + 32 = 77.'),
    Q('1 inch bằng?', ['25,4 mm', '10 mm', '30 mm', '2,54 mm'], 0, 'Theo quy đổi chuẩn.'),
    Q('Ống 1/2 inch xấp xỉ?', ['12,7 mm', '6,4 mm', '9,5 mm', '19 mm'], 0, '25,4 ÷ 2.'),
    Q('1 kW bằng?', ['3.440 BTU/h', '860 BTU/h', '34 BTU/h', '9.000 BTU/h'], 0, 'Và 860 kcal/h.'),
    Q('Điều hòa 9.000 BTU thường tương ứng?', ['1 HP', '2 HP', '3 HP', '0,5 HP'], 0, 'Theo bài.'),
    Q('Công suất điện P bằng?', ['U × I', 'U + I', 'U ÷ I', 'I ÷ U'], 0, 'Định luật cơ bản.'),
    Q('1 số điện là?', ['1 kWh', '1 kW', '1 kVA', '1 A'], 0, 'Điện năng tiêu thụ.'),
    Q('Đơn vị điện dung là?', ['µF', 'Ω', 'Hz', 'psi'], 0, 'Micro-fara.'),
    Q('Đo điện áp một chiều dùng thang?', ['DC V', 'AC V', 'Ω', 'mA AC'], 0, 'Có cực tính.'),
    Q('Không biết điện áp cần đo thì?', ['Để thang cao nhất rồi giảm dần', 'Để thang thấp nhất', 'Đo luôn thang bất kỳ', 'Không đo'], 0, 'Tránh hỏng đồng hồ.'),
    Q('Đo DC que đỏ cắm vào?', ['Cực dương', 'Cực âm', 'Vỏ', 'Đất'], 0, 'Dòng đi từ dương sang âm.'),
    Q('Chọn thang 10 mà đọc trên vạch 0–50 thì giá trị thật bằng?', ['Số đọc ÷ 5', 'Số đọc × 5', 'Số đọc', 'Số đọc + 5'], 0, 'Hệ số 10 ÷ 50 = 1/5.'),
    Q('Kim chỉ 20 trên vạch 0–250, thang chọn 50 thì giá trị thật?', ['4', '20', '100', '40'], 0, '20 × 50 ÷ 250 = 4.'),
    Q('Trước khi đo điện trở phải?', ['Chập 2 que, chỉnh kim về 0', 'Chạm tay vào que', 'Đo khi có điện', 'Để thang DC'], 0, 'Chỉnh 0 mỗi lần đổi thang.'),
    Q('Đồng hồ ampe kìm đo?', ['Dòng điện xoay chiều', 'Áp suất', 'Nhiệt độ', 'Độ ẩm'], 0, 'Kẹp một dây.'),
    Q('Kẹp ampe kìm vào?', ['Một dây', 'Cả hai dây', 'Vỏ nhựa', 'Đường ống'], 0, 'Kẹp hai dây từ trường triệt tiêu.'),
    Q('Dòng khởi động động cơ lớn hơn định mức khoảng?', ['3 – 6 lần', '0,5 lần', 'Bằng', '100 lần'], 0, 'Theo bài.'),
    Q('Kim vọt rồi về dưới định mức?', ['Bình thường', 'Hỏng', 'Chạm vỏ', 'Hở mạch'], 0, 'Dòng khởi động rồi dòng làm việc.'),
    Q('Kim không lên khi kẹp là?', ['Mạch hở, không có dòng', 'Dòng quá cao', 'Tốt', 'Chạm vỏ'], 0, 'Kiểm tra dây, rơle, cuộn.'),
    Q('Kim lên cao không về thường do?', ['Kẹt, dòng cao', 'Hở mạch', 'Tốt', 'Thiếu điện'], 0, 'Block không chạy.'),
    Q('Đồng hồ áp suất màu đỏ đo?', ['Áp suất cao (Hi)', 'Áp suất thấp', 'Nhiệt độ', 'Độ ẩm'], 0, 'Hi.'),
    Q('Chân không đo bằng đồng hồ?', ['Xanh (Lo)', 'Đỏ (Hi)', 'Vàng', 'Ampe kìm'], 0, 'Có vạch xanh lá dưới 0.'),
    Q('Dây vàng của đồng hồ nối với?', ['Bình gas/ bơm chân không', 'Dàn nóng', 'Dàn lạnh', 'Nguồn điện'], 0, 'Dây giữa.'),
    Q('Đồng hồ áp suất phải?', ['Đúng loại gas', 'Cùng màu với gas', 'Lớn nhất', 'Không cần'], 0, 'Vạch nhiệt độ sôi riêng.'),
    Q('Dụng cụ phát hiện rò gas là?', ['Máy dò gas', 'Ampe kìm', 'Thước kẹp', 'Dao cắt ống'], 0, 'Đèn báo mức rò.')
  ];
  const sort = {
    title: 'Dụng cụ nào đo gì?',
    buckets: [{ id: 'dmm', name: 'Đồng hồ vạn năng' }, { id: 'clamp', name: 'Ampe kìm' }, { id: 'gauge', name: 'Đồng hồ áp suất' }, { id: 'other', name: 'Dụng cụ khác' }],
    items: [
      { t: 'Đo thông mạch', b: 'dmm' }, { t: 'Đo điện trở cuộn dây', b: 'dmm' }, { t: 'Đo điện áp DC/ AC', b: 'dmm' },
      { t: 'Đo dòng khởi động của block', b: 'clamp' }, { t: 'Kẹp một dây cấp nguồn', b: 'clamp' },
      { t: 'Vạch xanh lá = chân không', b: 'gauge' }, { t: 'Đỏ Hi, xanh Lo', b: 'gauge' }, { t: 'Dây vàng ở giữa', b: 'gauge' },
      { t: 'Nhiệt kế hồng ngoại', b: 'other' }, { t: 'Máy dò gas', b: 'other' }
    ]
  };
  const order = [
    { title: 'Đo dòng của block bằng ampe kìm', intro: 'Quy trình đo.', steps: ['Chỉnh kim đồng hồ về 0', 'Chọn thang lớn gấp 3–5 lần dòng định mức', 'Mở gọng, kẹp một dây cấp nguồn', 'Cấp điện cho block', 'Quan sát kim vọt lên (dòng khởi động) rồi về', 'Đọc và so với dòng định mức'] },
    { title: 'Đo điện trở bằng đồng hồ kim', intro: 'Từng bước.', steps: ['Chọn thang Ω phù hợp (×1, ×10…)', 'Chập hai que', 'Chỉnh kim về 0', 'Đặt que vào hai đầu cần đo (không chạm tay)', 'Đọc số trên vạch Ω', 'Nhân với hệ số thang'] },
    { title: 'Phân tích sự cố bằng ampe kìm', intro: 'Từ hiện tượng đến hướng xử lý.', steps: ['Cấp điện cho phụ tải', 'Quan sát kim ampe kìm', 'Kim không lên → kiểm tra dây, rơle, cuộn dây', 'Kim lên cao không về → kiểm tra kẹt cơ, chạm cuộn', 'Kim về nhưng cao → tìm nguyên nhân quá tải', 'Sửa chữa và đo lại'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 6, ready: true, title: 'Đơn vị đo và dụng cụ đo', sub: 'Đổi đơn vị, vạn năng, ampe kìm, đồng hồ áp suất', minutes: 30,
    lead: 'Các đơn vị đo trong nghề lạnh, cách đọc đồng hồ vạn năng, dùng ampe kìm để chẩn đoán dòng khởi động, và đọc đồng hồ áp suất (Hi, Lo, chân không).',
    learn, mount, flashcards, quiz, sort, order
  });
})();
