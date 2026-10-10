/* BÀI 3 — DÀN NÓNG TỦ LẠNH (biên soạn từ docs/Bai_3.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const KINDS = {
    out: { name: 'Dàn nổi', pos: 'Nằm <b>nổi</b> phía sau hoặc dưới đáy tủ — nhìn thấy được.', mat: 'Ống <b>sắt</b> phi 5 – 6 mm, bề mặt có rất nhiều <b>sợi thép nhỏ</b> (cánh) để tăng diện tích tỏa nhiệt. Có dàn tấm hoặc dàn khối, đối lưu tự nhiên hoặc bằng quạt gió.', pros: ['Tỏa nhiệt, làm mát tốt', 'Dễ quan sát, dễ sửa chữa'], cons: ['Dễ bị bẹp, gãy, ăn mòn do tiếp xúc không khí', 'Dùng lâu bị bám bụi bẩn → cần bảo dưỡng định kỳ (giống điều hòa)'] },
    in: { name: 'Dàn chìm', pos: 'Nằm <b>ẩn trong lớp vỏ</b> tủ: hai bên sườn, phía sau, một phần ở phía trước (<b>sấy ron cửa</b>).', mat: 'Ống <b>đồng hoặc sắt</b> phi 4 – 5 mm; bề mặt dẫn nhiệt là <b>băng dính bạc</b> dán dàn vào vỏ tôn để tăng diện tích trao đổi nhiệt.', pros: ['Đẹp, gọn, ít va chạm', 'Phần ở cửa sấy nóng ron cao su, chống ron dính cửa và đọng sương'], cons: ['Rất khó gia công, sửa chữa vì nằm sau lớp vỏ tôn, xốp'] }
  };

  function backSVG(k) {
    const frame = `<rect x="40" y="14" width="240" height="372" rx="14" fill="var(--surface2)" stroke="var(--ink)" stroke-width="3"/>`;
    if (k === 'out') {
      let p = 'M90 50'; for (let i = 0; i < 9; i++) { p += `H${i % 2 ? 90 : 250}V${50 + (i + 1) * 36}`; }
      return `<svg viewBox="0 0 320 400" role="img" aria-label="Mặt sau tủ: dàn nóng nổi">${frame}
        <path d="${p}" fill="none" stroke="var(--hot)" stroke-width="5" stroke-linejoin="round" opacity=".9"/>
        <path class="flow" d="${p}" stroke="#fff" stroke-width="2"/>
        ${[...Array(9)].map((_, i) => `<path d="M${95 + i * 18} 46V372" stroke="var(--muted)" stroke-width="1" opacity=".45"/>`).join('')}
        <text class="lbl" x="160" y="396" text-anchor="middle">Dàn nổi: lộ ngoài mặt sau</text></svg>`;
    }
    return `<svg viewBox="0 0 320 400" role="img" aria-label="Mặt sau tủ: dàn nóng chìm trong vỏ">${frame}
      <rect x="40" y="14" width="240" height="372" rx="14" fill="var(--casing)" opacity=".5"/>
      <g fill="none" stroke="var(--hot)" stroke-width="4" stroke-dasharray="1 0" opacity=".8" stroke-linejoin="round">
        <path d="M58 40V360M76 360V40"/><path d="M262 40V360M244 360V40"/><path d="M96 40H224M224 40V60H96V80H224V100H96"/></g>
      <path class="flow" d="M58 40V360M76 360V40M262 40V360M244 360V40M96 40H224V60H96V80H224V100H96" stroke="#fff" stroke-width="2"/>
      <rect x="100" y="140" width="120" height="150" rx="8" fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <text class="sub" x="160" y="205" text-anchor="middle">Tấm tôn vỏ tủ</text><text class="fl" x="160" y="225" text-anchor="middle">(dàn ẩn phía sau)</text>
      <text class="lbl" x="160" y="396" text-anchor="middle">Dàn chìm: hai sườn + sau + ron cửa</text></svg>`;
  }

  function learn() {
    return `
<section class="sec" id="s-role" data-toc="1 · Vai trò">
  <div class="sec-n">Phần 1</div><h2>Dàn nóng làm nhiệm vụ gì?</h2>
  <p>Block nén hơi gas lên <b>áp suất cao, nhiệt độ cao</b> rồi đẩy vào dàn nóng. Ở đây gas <b>tỏa nhiệt ra môi trường</b> và <b>ngưng tụ từ hơi sang lỏng</b>. Gas lỏng đi tiếp qua phin lọc → ống mao → dàn lạnh.</p>
  <h3 style="margin-top:20px">Kéo thanh trượt để đi dọc dàn nóng</h3>
  <div class="stage"><div id="condSvg"></div>
    <div class="controls"><label>Vị trí dọc dàn <input id="condPos" type="range" min="0" max="100" value="0" aria-label="Vị trí dọc dàn nóng"></label></div>
    <div class="verdict" id="condV" style="margin:0 14px 12px"></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ</b><p>Dàn nóng: <b>vào = hơi nóng</b>, <b>ra = lỏng ấm</b>. Muốn biết dàn nóng nằm đâu trong tủ thì <b>sờ tay xung quanh tủ</b>: chỗ nào nóng ấm đều là dàn nóng.</p></div></div>
</section>

<section class="sec" id="s-types" data-toc="2 · Phân loại">
  <div class="sec-n">Phần 2</div><h2>Phân loại theo vị trí lắp đặt</h2>
  <div id="kindTabs"></div>
  <div class="grid2" style="margin-top:14px;align-items:start"><div class="stage" style="margin:0" id="kindSvg"></div><article class="panel" id="kindPanel" aria-live="polite"></article></div>
  <div class="callout"><span class="ic">🧊</span><div><b class="t">Vì sao sấy ron cửa?</b><p>Ngăn đông rất lạnh: ron cao su dễ <b>dính chặt vào thân tủ</b> (như tay ướt chạm viên đá) khiến mở cửa bị rách ron. Ngoài ra ron lạnh sẽ <b>đọng sương</b>. Một đoạn dàn nóng chạy quanh khung cửa giữ cho ron luôn ấm khô, đóng kín và hạn chế nhiệt từ ngoài lọt vào.</p></div></div>
</section>

<section class="sec" id="s-fault" data-toc="3 · Hư hỏng">
  <div class="sec-n">Phần 3</div><h2>Dàn nóng hỏng ở dạng nào?</h2>
  <p>Dàn nóng thường hỏng theo <b>3 dạng</b>. Bấm để xem biểu hiện:</p>
  <div id="fTabs"></div><article class="panel hotc" id="fPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">🌡️</span><div><b class="t">Nhiệt độ bình thường dọc dàn</b><p>Đầu dàn rất nóng (có thể khoảng <b>90 – 100 °C</b>), càng về cuối càng nguội dần, cuối dàn còn <b>ấm khoảng 40 – 50 °C</b>. Nếu cuối dàn <b>lạnh, đổ mồ hôi hoặc bám tuyết</b> → có điểm tắc một phần ngay phía trước đó (chỗ tắc hoạt động như một van tiết lưu).</p></div></div>
</section>

<section class="sec" id="s-test" data-toc="4 · Chẩn đoán">
  <div class="sec-n">Phần 4</div><h2>Thực hành chẩn đoán bằng cách cắt ống</h2>
  <p>Tủ chạy nhưng <b>không lạnh</b>. Mỗi lần bấm “Ca bệnh mới” bạn nhận một dàn nóng bị lỗi ngẫu nhiên. Hãy thực hiện các thao tác và kết luận.</p>
  <div class="panel"><div class="row" id="cutBtns"><button class="btn sm" data-a="touch">✋ Sờ dàn từ đầu đến cuối</button><button class="btn sm" data-a="end">✂ Cắt CUỐI dàn nóng (chỗ nối phin)</button><button class="btn sm" data-a="start">✂ Cắt ĐẦU dàn nóng (chỗ nối ống đẩy)</button><button class="btn sm" id="cutNew">🔄 Ca bệnh mới</button></div>
    <div class="verdict" id="cutOut" style="margin-top:12px;min-height:5em">Bấm một thao tác để xem hiện tượng.</div>
    <div class="row" style="margin-top:12px"><b>Kết luận:</b><select id="cutAns" class="btn sm" style="min-height:40px"><option value="">— chọn —</option><option value="block">Dàn nóng tắc toàn phần</option><option value="part">Dàn nóng tắc một phần</option><option value="leak">Hệ thống thủng / hết gas (thủng dàn nóng hoặc nơi khác)</option></select><button class="btn pri sm" id="cutChk">Kiểm tra</button></div>
    <div id="cutRes" style="margin-top:10px"></div></div>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Cách suy luận</b><p>Block hút gas phía thấp rồi nén sang dàn nóng. Nếu <b>dàn nóng tắc toàn phần</b>: gas bị dồn ở <b>đầu dàn</b> (xì mạnh khi cắt) nhưng <b>cuối dàn trống</b> (không có gì xì ra). Nếu cả hai đầu <b>đều không có gas</b> thì hệ thống đã <b>mất gas</b> (thủng / hết gas) — chưa chắc thủng ngay dàn nóng, còn có thể ở block hoặc dàn lạnh.</p></div></div>
</section>

<section class="sec" id="s-fix" data-toc="5 · Sửa chữa">
  <div class="sec-n">Phần 5</div><h2>Sửa chữa dàn nóng</h2>
  <div id="fixTabs"></div><div id="fixBody"></div>
  <div class="callout danger"><span class="ic">💥</span><div><b class="t">TUYỆT ĐỐI không dùng khí oxy để thử kín!</b><p>Oxy gặp dầu/gas có thể gây <b>cháy nổ</b> rất nguy hiểm. Chỉ dùng khí <b>nitơ</b> và dụng cụ phải kín.</p></div></div>
</section>

<section class="sec" id="s-swap" data-toc="6 · Thay dàn">
  <div class="sec-n">Phần 6</div><h2>Chọn và thay dàn nóng mới</h2>
  <p>Khi sửa không được hoặc dàn thủng nhiều chỗ thì thay. Dàn thay phải có <b>chiều dài và tiết diện tương đương</b>. Dàn chìm không thể “nhét” lại vào vỏ, nên thường lắp <b>“đeo ba lô”</b> — dàn mới gắn phía sau tủ.</p>
  <h3>Chiều dài dàn ảnh hưởng thế nào?</h3>
  <div id="lenTabs"></div><article class="panel warm" id="lenPanel" aria-live="polite"></article>
  <h3 style="margin-top:30px">🧮 Chọn số đốt dàn theo dung tích tủ</h3>
  <div class="panel" style="border-left-color:var(--cold)"><p>Dàn bán sẵn tính theo <b>đốt</b> (một lượt uốn). Theo bài giảng, thường chọn khoảng <b>1 đốt ứng với ~12 lít</b> (có thể ± 1 – 2 đốt). Chỉ để tham khảo.</p>
    <div class="row"><label>Dung tích tủ <input id="vol" type="number" min="50" max="600" value="250" class="btn sm" style="width:100px;min-height:40px;text-align:center"> lít</label><b id="volOut" style="font:700 28px var(--head)"></b></div>
    <p class="muted" style="font-size:14px;margin:8px 0 0">VD tủ 250 L ≈ 21 đốt: mua 1 dàn 14 đốt + 1 dàn 6 – 7 đốt hoặc 2 dàn ~10 – 11 đốt <b>mắc song song</b>.</p></div>
  <h3 style="margin-top:26px">Lắp đúng chiều</h3>
  ${U.steps([['Dàn đặt đứng: đầu vào ở trên', 'Đầu <b>B</b> (ống thẳng lên trên) nối ống đẩy block; đầu <b>A</b> ở dưới là cuối dàn, nối phin lọc. Hơi nóng đi từ trên xuống, gas lỏng chảy từ cao xuống thấp nên đỡ tải cho block.'], ['Lắp ngược sẽ làm sao?', 'Gas lỏng phải bị đẩy ngược lên cao rồi mới quay xuống → block nặng tải. Nên phải lắp đúng chiều.'], ['Dàn đặt nằm ngang', 'Không cần quan tâm đâu là đầu, đâu là cuối.'], ['Ghép 2 dàn song song', 'Cách nhau khoảng <b>1,5 – 2 cm</b> ở phía sau tủ; gom hai đầu vào chung một đường vào, hai đầu ra gom lại nối phin.'], ['Trước khi thay dàn tắc', 'Phải <b>súc rửa dầu và cặn bẩn</b> trong block và hệ thống, nếu không cặn còn lại sẽ tiếp tục gây tắc.']])}
</section>

<section class="sec" id="s-recap" data-toc="7 · Tóm tắt">
  <div class="sec-n">Phần 7</div><h2>Tóm tắt bài — 5 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Dàn nóng: gas hơi nóng vào, tỏa nhiệt, ngưng thành lỏng.</b><span>Đầu dàn nóng nhất, cuối dàn ấm 40–50 °C.</span></div></li>
    <li class="done"><div><b>2 loại: dàn nổi và dàn chìm.</b><span>Nổi: dễ sửa nhưng dễ bẩn, gãy. Chìm: gọn, sấy ron cửa nhưng khó sửa.</span></div></li>
    <li class="done"><div><b>3 dạng hỏng: tắc một phần, tắc toàn phần, thủng.</b><span>Tắc một phần: cuối dàn lạnh / đổ mồ hôi.</span></div></li>
    <li class="done"><div><b>Cắt cuối rồi cắt đầu dàn: cuối trống – đầu xì = tắc toàn phần; cả hai trống = mất gas.</b><span>Thổi tắc từ <b>cuối</b> dàn, không quá 400 psi, dùng nitơ.</span></div></li>
    <li class="done"><div><b>Thay dàn đúng chiều dài, tiết diện, đúng chiều lắp.</b><span>Dàn ngắn → nóng, quá tải; dàn dài → hồi gas chậm, block nóng.</span></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/3/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  const FAULTS = {
    part: ['Tắc một phần', 'warm', 'Gas vẫn đi qua được nhưng chậm. Điểm tắc hoạt động như <b>van tiết lưu</b>: sau điểm tắc gas lỏng bắt đầu sôi nên chỗ đó <b>lạnh, đổ mồ hôi hoặc bám tuyết</b>, trong khi đầu dàn vẫn rất nóng. Tủ <b>kém lạnh</b>.'],
    full: ['Tắc toàn phần', 'hotc', 'Gas không đi qua được → không tuần hoàn → tủ <b>không lạnh</b>. Gas dồn ở đầu dàn, cuối dàn trống. Nguyên nhân: cặn bẩn, dầu đóng cặn bám trên bề mặt trong.'],
    leak: ['Thủng (xì gas)', 'hotc', 'Hệ thống <b>mất gas và dầu</b> → tủ không lạnh. Dàn nổi: nhìn thấy <b>vết dầu loang</b> dính bụi bẩn trên bề mặt (dầu theo gas rò ra gặp bụi tạo vết). Dàn chìm: không nhìn thấy, phải thử kín bằng nitơ.']
  };
  const FIX = {
    clog: [['Tắc do cặn bẩn / dầu', 'Thổi sạch bằng nitơ'], ['<b>Bơm nitơ vào CUỐI dàn nóng</b> qua bộ đồng hồ, <b>đầu dàn để hở</b>', 'Bơm từ cuối vì block đã nén theo chiều từ đầu → cuối; chỗ tắc đã chịu áp lực lớn mà không thông, nên cần đẩy ngược chiều để cặn bật ra.'], ['Giữ áp suất <b>không quá 400 psi</b>', 'Nếu tắc rất lớn và dàn đã cũ, nén quá mạnh có thể làm <b>nổ dàn / phá vỏ tủ</b>.'], ['Cặn dầu ra ngoài đầu dàn', 'Có thể kết hợp nước súc rửa chuyên dụng để cặn bám trôi đi.'], ['Hàn nối lại, hút chân không, nạp gas', '']],
    out: [['Dàn nổi bị thủng', 'Tìm chỗ thủng và hàn'], ['Quan sát vết dầu loang trên bề mặt dàn', 'Có vết dầu loang → đó là vị trí thủng.'], ['Không thấy → tháo dàn, hàn kín một đầu', 'Dàn nổi dễ tháo lắp.'], ['Bơm khí cao áp, nhúng dàn xuống nước', 'Chỗ nổi bọt khí là chỗ thủng.'], ['Vệ sinh lớp oxit sắt, hàn lại', 'Cạo bỏ vài sợi thép nhỏ gần vị trí thủng để dễ hàn. Thủng trên 2 chỗ thì nên thay dàn mới.']],
    inn: [['Dàn chìm bị thủng', 'Phải thử kín mới biết'], ['Tách dàn khỏi hệ thống', 'Hàn kín một đầu (cuối dàn), đầu kia gắn ống công nghệ nối đồng hồ.'], ['Bơm nitơ <b>300 – 400 psi</b>', 'Dàn nóng làm việc ở áp cao nên thử áp cao. <b>Không dùng oxy.</b>'], ['Quét xà phòng mối nối dây đồng hồ, theo dõi kim', 'Kim tụt so với ban đầu → dàn thủng. Kim đứng yên → dàn nóng kín, thủng nằm chỗ khác (VD dàn lạnh).'], ['Tìm đoạn thủng', 'Dàn chìm chia nhiều đoạn (sườn trái, sườn phải, phía sau, sấy ron cửa). Bơm khí nóng hoặc lạnh để biết đoạn nào, rồi thử kín từng đoạn. Sửa khó nên thường chọn <b>đeo ba lô dàn mới</b>.']]
  };
  const LEN = {
    short: ['Dàn QUÁ NGẮN', '<ul><li>Không tỏa đủ nhiệt, cuối dàn <b>không ngưng tụ hết</b> thành lỏng: gas ra là <b>lỏng lẫn hơi</b>.</li><li>Phần hơi đi qua ống mao không sôi hút nhiệt → dàn lạnh <b>kém lạnh</b>; phần hơi nóng sang dàn lạnh còn làm P0 tăng.</li><li>Áp suất đẩy <b>Pk cao</b> → block quá tải. Tủ kém lạnh nên chạy lâu → dòng cao, dễ <b>chết máy</b>.</li></ul>'],
    ok: ['Dàn ĐÚNG', '<ul><li>Ngưng tụ đủ: gas ra là lỏng, cuối dàn ấm <b>40 – 50 °C</b>.</li><li>Pk bình thường, block chạy đúng chu kỳ, tủ đủ lạnh.</li></ul>'],
    long: ['Dàn QUÁ DÀI', '<ul><li>Trở lực đường ống lớn, áp suất <b>Pk giảm dần</b> dọc đường; lưu lượng gas hồi về chậm.</li><li>Gas hồi về mang ít hơi lạnh làm mát block nên <b>block nóng</b> → hại cuộn dây và chi tiết cơ khi chạy lâu.</li><li>Một phần gas có thể bốc hơi lại, năng suất làm lạnh thấp hơn mong muốn.</li></ul>']
  };

  function mount(root) {
    // 1. Dàn nóng theo vị trí
    const sv = $('#condSvg', root), cp = $('#condPos', root), cv = $('#condV', root);
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    function cond() {
      const p = +cp.value / 100, T = lerp(95, 45, p);
      let path = 'M50 110H90'; for (let i = 0; i < 6; i++) path += `V${i % 2 ? 50 : 170}H${90 + (i + 1) * 80}`; path += 'V110H600';
      const state = p < .2 ? ['hơi quá nhiệt (rất nóng)', 'var(--hot)'] : p < .72 ? ['hơi + lỏng (đang ngưng tụ)', 'var(--warm)'] : ['lỏng ấm', 'var(--brass)'];
      sv.innerHTML = `<svg viewBox="0 0 660 220" role="img" aria-label="Dàn nóng, điểm đánh dấu ở ${Math.round(p * 100)}%"><defs><linearGradient id="gc" x1="0" x2="1"><stop offset="0" stop-color="var(--hot)"/><stop offset=".6" stop-color="var(--warm)"/><stop offset="1" stop-color="var(--brass)"/></linearGradient></defs>
        <path d="${path}" fill="none" stroke="url(#gc)" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/><path class="flow" d="${path}" stroke="#fff" stroke-width="2.5"/>
        <text class="sub" x="50" y="205">Vào từ block (đầu dàn)</text><text class="sub" x="610" y="205" text-anchor="end">Ra phin lọc (cuối dàn)</text>
        <circle id="mk" r="13" fill="var(--ink)" stroke="var(--surface)" stroke-width="4"/>
        <g class="heat-g"><path class="heat" d="M180 30V10" marker-end="url(#ah3)"/><path class="heat" d="M340 30V10" marker-end="url(#ah3)"/><path class="heat" d="M500 30V10" marker-end="url(#ah3)"/></g>
        <defs><marker id="ah3" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="heat-h"/></marker></defs></svg>`;
      const el = $('#mk', sv), pathEl = $('path', sv), L = pathEl.getTotalLength ? pathEl.getTotalLength() : 0;
      if (L) { const pt = pathEl.getPointAtLength(p * L); el.setAttribute('cx', pt.x); el.setAttribute('cy', pt.y); }
      cv.innerHTML = `Nhiệt độ ≈ <b style="color:${state[1]}">${T} °C</b> · trạng thái: <b>${state[0]}</b> · áp suất ≈ <b>8 bar</b> (cao). Gas đang <b>tỏa nhiệt</b> ra môi trường.`;
    }
    cp.oninput = cond; cond();
    // 2. Phân loại
    U.tabset($('#kindTabs', root), [{ id: 'out', name: 'Dàn nổi', sub: 'lộ phía sau tủ' }, { id: 'in', name: 'Dàn chìm', sub: 'ẩn trong vỏ tủ' }], id => {
      const k = KINDS[id]; $('#kindSvg', root).innerHTML = backSVG(id);
      $('#kindPanel', root).innerHTML = `<h3>${k.name}</h3><dl class="kv"><dt>Vị trí</dt><dd>${k.pos}</dd><dt>Cấu tạo</dt><dd>${k.mat}</dd><dt>Ưu điểm</dt><dd>${k.pros.map(p => `<span class="pill ok">${p}</span>`).join('')}</dd><dt>Nhược điểm</dt><dd>${k.cons.map(p => `<span class="pill bad">${p}</span>`).join('')}</dd></dl>`;
    });
    // 3. Hư hỏng
    U.tabset($('#fTabs', root), [{ id: 'part', n: 1, name: 'Tắc một phần' }, { id: 'full', n: 2, name: 'Tắc toàn phần' }, { id: 'leak', n: 3, name: 'Thủng' }], id => { const f = FAULTS[id]; $('#fPanel', root).className = 'panel ' + f[1]; $('#fPanel', root).innerHTML = `<h3>${f[0]}</h3><p style="margin:0">${f[2]}</p>`; });
    // 4. Ca bệnh
    let ca;
    const newCa = () => { ca = ['block', 'part', 'leak'][Math.floor(Math.random() * 3)]; $('#cutOut', root).className = 'verdict'; $('#cutOut', root).textContent = 'Bấm một thao tác để xem hiện tượng.'; $('#cutRes', root).innerHTML = ''; $('#cutAns', root).value = ''; };
    newCa();
    $('#cutNew', root).onclick = newCa;
    $$('#cutBtns [data-a]', root).forEach(b => b.onclick = () => {
      const a = b.dataset.a, o = $('#cutOut', root);
      const T = {
        touch: { block: 'Cả đầu dàn và cuối dàn đều <b>không nóng rõ</b>.', leak: 'Cả đầu dàn và cuối dàn đều <b>không nóng rõ</b>.', part: 'Đầu dàn <b>rất nóng</b>, nhưng một đoạn về cuối <b>lạnh, đổ mồ hôi / bám tuyết</b> (ngay sau điểm tắc).' },
        end: { block: 'Cắt cuối dàn: <b>KHÔNG có gas</b> xì ra.', leak: 'Cắt cuối dàn: <b>KHÔNG có gas</b> xì ra.', part: 'Cắt cuối dàn: có <b>ít gas</b>, xì yếu, lẫn hơi lạnh.' },
        start: { block: 'Cắt đầu dàn: gas <b>xì ra mạnh</b>.', leak: 'Cắt đầu dàn: <b>KHÔNG có gas</b> xì ra.', part: 'Cắt đầu dàn: gas xì ra <b>khá mạnh</b> (hơi nóng).' }
      };
      o.className = 'verdict'; o.innerHTML = T[a][ca];
    });
    $('#cutChk', root).onclick = () => {
      const v = $('#cutAns', root).value, m = { block: 'block', part: 'part', leak: 'leak' }, r = $('#cutRes', root);
      if (!v) { r.innerHTML = '<div class="why">Hãy chọn kết luận.</div>'; return; }
      const why = { block: 'Cuối dàn trống nhưng đầu dàn xì mạnh → gas bị dồn ở đầu → <b>tắc toàn phần dàn nóng</b>.', leak: 'Cả hai đầu đều không có gas → <b>mất gas</b> (thủng hoặc hết gas). Cần thử kín từng bộ phận để tìm chỗ thủng.', part: 'Đầu rất nóng, cuối lạnh/đổ mồ hôi, còn có gas → <b>tắc một phần</b>, tại điểm đổ mồ hôi/bám tuyết.' };
      r.innerHTML = `<div class="why" style="border-color:var(--${v === ca ? 'ok' : 'bad'})"><b>${v === ca ? '✓ Chính xác!' : '✗ Chưa đúng.'}</b> ${why[ca]}</div>`;
    };
    // 5. Sửa chữa
    const FT = [{ id: 'clog', name: 'Tắc bẩn', sub: 'thổi sạch' }, { id: 'out', name: 'Dàn nổi thủng', sub: 'hàn' }, { id: 'inn', name: 'Dàn chìm thủng', sub: 'thử kín' }];
    U.tabset($('#fixTabs', root), FT, id => { const f = FIX[id]; $('#fixBody', root).innerHTML = `<article class="panel warm"><h3>${f[0][0]}</h3><p style="margin:0">${f[0][1]}</p></article>${U.steps(f.slice(1))}`; U.bindSteps($('#fixBody', root)); });
    // 6. Thay dàn
    U.tabset($('#lenTabs', root), [{ id: 'short', name: 'Quá ngắn' }, { id: 'ok', name: 'Đúng chiều dài' }, { id: 'long', name: 'Quá dài' }], id => { $('#lenPanel', root).innerHTML = `<h3>${LEN[id][0]}</h3>${LEN[id][1]}`; }, 'ok');
    const vol = $('#vol', root), vo = $('#volOut', root), cv2 = () => { const n = Math.round((+vol.value || 0) / 12); vo.textContent = `≈ ${n} đốt (${Math.max(1, n - 2)}–${n + 2})`; }; vol.oninput = cv2; cv2();
    U.bindSteps(root);
  }

  const flashcards = [
    { f: 'Dàn nóng làm nhiệm vụ gì?', b: 'Gas <b>tỏa nhiệt ra môi trường</b> và <b>ngưng tụ</b> từ hơi thành lỏng.', tag: 'Vai trò' },
    { f: 'Gas vào dàn nóng ở trạng thái nào?', b: 'Hơi, <b>áp suất cao, nhiệt độ cao</b> (đầu dàn có thể ~90–100 °C).', tag: 'Vai trò' },
    { f: 'Nhiệt độ cuối dàn nóng bình thường?', b: 'Khoảng <b>40 – 50 °C</b> (ấm).', tag: 'Vai trò' },
    { f: 'Làm sao biết dàn nóng nằm đâu trong tủ?', b: '<b>Sờ tay xung quanh tủ</b>: chỗ nóng ấm đều là dàn nóng.', tag: 'Vai trò' },
    { f: 'Phân loại dàn nóng theo vị trí?', b: '<b>Dàn nổi</b> và <b>dàn chìm</b>.', tag: 'Phân loại' },
    { f: 'Cấu tạo dàn nổi?', b: 'Ống <b>sắt phi 5–6 mm</b> có nhiều sợi thép nhỏ tăng diện tích tỏa nhiệt; đối lưu tự nhiên hoặc bằng quạt.', tag: 'Phân loại' },
    { f: 'Ưu – nhược điểm của dàn nổi?', b: 'Ưu: tỏa nhiệt tốt, dễ sửa. Nhược: dễ bẹp, gãy, ăn mòn, bám bẩn nên phải bảo dưỡng.', tag: 'Phân loại' },
    { f: 'Dàn chìm nằm ở đâu?', b: 'Trong lớp vỏ: <b>hai sườn, phía sau</b>, một phần phía trước <b>sấy ron cửa</b>.', tag: 'Phân loại' },
    { f: 'Cấu tạo dàn chìm?', b: 'Ống đồng hoặc sắt <b>phi 4–5 mm</b>, dán <b>băng dính bạc</b> vào vỏ tôn.', tag: 'Phân loại' },
    { f: 'Vì sao có đoạn dàn nóng sấy ron cửa?', b: 'Chống ron <b>dính</b> vào tủ (ngăn đông lạnh), chống <b>đọng sương</b>, giữ ron đóng kín.', tag: 'Phân loại' },
    { f: 'Nhược điểm lớn nhất của dàn chìm?', b: '<b>Khó gia công, sửa chữa</b> vì nằm sau vỏ tôn, lớp xốp.', tag: 'Phân loại' },
    { f: 'Dàn nóng hỏng ở những dạng nào?', b: 'Tắc một phần · tắc toàn phần · thủng.', tag: 'Hư hỏng' },
    { f: 'Tắc một phần: biểu hiện?', b: 'Tủ <b>kém lạnh</b>; cuối dàn <b>lạnh, đổ mồ hôi, bám tuyết</b> tại điểm tắc.', tag: 'Hư hỏng' },
    { f: 'Vì sao điểm tắc lại đổ mồ hôi?', b: 'Điểm tắc hoạt động như <b>van tiết lưu</b>: gas lỏng qua đó giảm áp và <b>sôi</b>, hút nhiệt.', tag: 'Hư hỏng' },
    { f: 'Dấu hiệu dàn nổi bị thủng?', b: '<b>Vết dầu loang</b> dính bụi bẩn trên bề mặt dàn.', tag: 'Hư hỏng' },
    { f: 'Cắt cuối dàn không có gas, cắt đầu dàn gas xì mạnh. Kết luận?', b: '<b>Tắc toàn phần dàn nóng</b>.', tag: 'Chẩn đoán' },
    { f: 'Cắt cuối và đầu dàn đều không có gas. Kết luận?', b: '<b>Mất gas</b> (thủng hoặc hết gas) ở đâu đó trong hệ thống.', tag: 'Chẩn đoán' },
    { f: 'Thổi tắc dàn nóng: bơm từ đầu nào? Áp tối đa?', b: 'Bơm nitơ từ <b>cuối dàn</b>, đầu dàn để hở; <b>không quá 400 psi</b>.', tag: 'Sửa chữa' },
    { f: 'Vì sao không bơm áp quá lớn khi thổi tắc?', b: 'Dàn đã cũ, nén quá mạnh có thể gây <b>nổ, phá vỏ tủ</b>.', tag: 'Sửa chữa' },
    { f: 'Thử kín dàn chìm dùng khí gì? Áp suất?', b: '<b>Nitơ</b> khoảng <b>300 – 400 psi</b>; tuyệt đối <b>không dùng oxy</b>.', tag: 'Sửa chữa' },
    { f: 'Vì sao cấm dùng oxy thử kín?', b: 'Oxy + dầu/gas có thể <b>cháy nổ</b>.', tag: 'An toàn' },
    { f: 'Thay dàn nóng cần đảm bảo điều gì?', b: '<b>Chiều dài và tiết diện</b> tương đương dàn cũ.', tag: 'Thay thế' },
    { f: 'Dàn nóng quá ngắn gây hậu quả gì?', b: 'Không ngưng tụ hết, <b>Pk cao</b>, block quá tải, tủ kém lạnh.', tag: 'Thay thế' },
    { f: 'Dàn nóng quá dài gây hậu quả gì?', b: 'Trở lực lớn, hồi gas chậm → <b>block nóng</b>, năng suất thấp.', tag: 'Thay thế' },
    { f: '“Đeo ba lô” dàn nóng nghĩa là gì?', b: 'Lắp dàn mới <b>phía sau tủ</b> thay cho dàn chìm hỏng.', tag: 'Thay thế' },
    { f: 'Dàn đặt đứng: đầu nào nối block?', b: 'Đầu <b>trên</b> (ống thẳng lên) nối block; đầu <b>dưới</b> nối phin lọc.', tag: 'Thay thế' },
    { f: 'Ghép 2 dàn song song, khoảng cách?', b: 'Khoảng <b>1,5 – 2 cm</b>.', tag: 'Thay thế' },
    { f: 'Trước khi thay dàn tắc cần làm gì?', b: '<b>Súc rửa</b> dầu, cặn bẩn trong block/hệ thống để tránh tắc lại.', tag: 'Thay thế' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Dàn nóng làm nhiệm vụ gì?', ['Hút nhiệt trong tủ', 'Tỏa nhiệt ra môi trường và ngưng tụ gas', 'Nén gas', 'Lọc ẩm'], 1, 'Gas áp cao tỏa nhiệt rồi ngưng thành lỏng.'),
    Q('Cuối dàn nóng bình thường có nhiệt độ khoảng?', ['Dưới 0 °C', '40 – 50 °C', '90 – 100 °C', '150 °C'], 1, 'Gas đã ngưng, nguội dần nên ấm.'),
    Q('Cách đơn giản xác định vị trí dàn chìm?', ['Nhìn bằng mắt', 'Sờ xung quanh tủ để tìm chỗ nóng ấm', 'Nghe âm thanh', 'Đo điện trở'], 1, 'Dàn nóng tỏa nhiệt nên chỗ có dàn sẽ nóng.'),
    Q('Dàn nóng nổi có bề mặt tăng nhiệt là?', ['Băng dính bạc', 'Các sợi thép nhỏ', 'Lá nhôm', 'Tấm đồng'], 1, 'Sợi thép nhỏ tăng diện tích tỏa nhiệt.'),
    Q('Dàn chìm dùng gì để dẫn nhiệt vào vỏ tủ?', ['Băng dính bạc', 'Keo xốp', 'Mỡ bò', 'Giấy'], 0, 'Băng dính bạc dán dàn vào vỏ tôn.'),
    Q('Vì sao có đoạn dàn nóng chạy quanh khung cửa?', ['Trang trí', 'Sấy ron, chống dính và đọng sương', 'Làm lạnh cửa', 'Giảm tiếng ồn'], 1, 'Ron cao su ở ngăn đông dễ dính vào thân tủ.'),
    Q('Nhược điểm của dàn nổi là?', ['Khó sửa', 'Dễ bẹp, gãy, bám bẩn', 'Không tỏa nhiệt', 'Nhỏ gọn quá'], 1, 'Tiếp xúc không khí nên dễ bám bụi, ăn mòn.'),
    Q('Dàn nóng thường hỏng ở dạng nào?', ['Tắc một phần, tắc toàn phần, thủng', 'Cháy cuộn dây', 'Mòn pit-tông', 'Hở van'], 0, 'Ba dạng hỏng của dàn nóng.'),
    Q('Cuối dàn nóng lạnh, đổ mồ hôi/bám tuyết cho biết?', ['Tắc một phần ngay trước đó', 'Thủng', 'Dàn quá lớn', 'Block yếu'], 0, 'Điểm tắc như van tiết lưu, gas sôi hút nhiệt.'),
    Q('Dàn nổi thủng, nhận ra bằng?', ['Mùi gas', 'Vết dầu loang dính bụi', 'Tiếng rít', 'Tuyết bám'], 1, 'Dầu theo gas rò rỉ ra bám bụi trên bề mặt.'),
    Q('Cắt cuối dàn nóng không gas, cắt đầu dàn gas xì mạnh. Kết luận?', ['Thủng', 'Tắc toàn phần dàn nóng', 'Block hỏng', 'Phin tắc'], 1, 'Gas bị chặn ở dàn nóng: dồn về phía đầu.'),
    Q('Cả hai đầu dàn nóng khi cắt đều không có gas. Kết luận?', ['Tắc toàn phần', 'Mất gas, thủng hoặc hết gas', 'Dàn tốt', 'Tắc một phần'], 1, 'Hệ thống đã mất gas.'),
    Q('Khi thổi tắc dàn nóng, bơm khí nitơ từ đâu?', ['Từ đầu dàn', 'Từ cuối dàn', 'Từ block', 'Từ phin'], 1, 'Bơm ngược chiều để đẩy cặn bật ra.'),
    Q('Áp suất tối đa khi thổi tắc dàn nóng?', ['100 psi', 'Không quá 400 psi', '800 psi', 'Không giới hạn'], 1, 'Quá cao có thể phá dàn, vỏ tủ.'),
    Q('Khí nào TUYỆT ĐỐI không dùng để thử kín?', ['Nitơ', 'Oxy', 'Khí nén khô', 'Không khí'], 1, 'Oxy + dầu/gas dễ cháy nổ.'),
    Q('Áp suất thử kín dàn nóng thường?', ['300 – 400 psi', '30 – 40 psi', '3 – 4 psi', '3000 psi'], 0, 'Dàn nóng làm việc áp cao nên thử 300–400 psi.'),
    Q('Dàn thay thế quá ngắn thì?', ['Pk cao, block quá tải, tủ kém lạnh', 'Tủ lạnh sâu', 'Block mát', 'Không đổi'], 0, 'Không ngưng tụ hết gas.'),
    Q('Dàn thay thế quá dài thì?', ['Hồi gas chậm, block nóng, năng suất thấp', 'Block mát hơn', 'Tủ lạnh sâu hơn', 'Không khác'], 0, 'Trở lực lớn, ít hơi lạnh làm mát block.'),
    Q('Lắp dàn nóng đứng, đầu nào nối với block?', ['Đầu dưới', 'Đầu trên', 'Bất kỳ', 'Cả hai'], 1, 'Hơi nóng đi từ trên xuống, lỏng chảy xuống dưới nên nhẹ tải cho block.'),
    Q('Khi ghép 2 dàn song song cách nhau khoảng?', ['0 cm', '1,5 – 2 cm', '10 cm', '30 cm'], 1, 'Để có không gian tỏa nhiệt.'),
    Q('Chọn số đốt dàn theo dung tích: khoảng bao nhiêu lít/đốt (theo bài)?', ['~12 lít', '~1 lít', '~100 lít', '~500 lít'], 0, 'Tủ 250 L ≈ 21 đốt.'),
    Q('Trước khi thay dàn tắc cần?', ['Không cần làm gì', 'Súc rửa dầu, cặn bẩn trong hệ thống', 'Tăng áp', 'Thay tụ'], 1, 'Nếu không cặn còn lại sẽ gây tắc tiếp.')
  ];
  const sort = {
    title: 'Đặc điểm này thuộc loại dàn nóng nào?',
    buckets: [{ id: 'out', name: 'Dàn NỔI' }, { id: 'in', name: 'Dàn CHÌM' }, { id: 'both', name: 'Cả hai loại' }],
    items: [
      { t: 'Nằm lộ phía sau tủ, nhìn thấy được', b: 'out' }, { t: 'Có nhiều sợi thép nhỏ tăng diện tích tỏa nhiệt', b: 'out' }, { t: 'Dễ bám bụi, cần bảo dưỡng định kỳ', b: 'out' }, { t: 'Dễ sửa, nhìn thấy vết dầu loang', b: 'out' },
      { t: 'Ẩn trong vỏ, hai sườn và phía sau', b: 'in' }, { t: 'Có đoạn sấy ron cửa', b: 'in' }, { t: 'Dán băng dính bạc vào tôn vỏ tủ', b: 'in' }, { t: 'Khó gia công, sửa chữa', b: 'in' },
      { t: 'Gas vào là hơi nóng, ra là lỏng', b: 'both' }, { t: 'Có thể bị tắc một phần, tắc toàn phần, thủng', b: 'both' }, { t: 'Thử kín bằng nitơ 300–400 psi', b: 'both' }, { t: 'Thay mới phải đúng chiều dài, tiết diện', b: 'both' }
    ]
  };
  const order = [
    { title: 'Thổi tắc dàn nóng', intro: 'Sắp xếp các bước thổi tắc do cặn bẩn.', steps: ['Cắt tách dàn nóng khỏi hệ thống', 'Nối đồng hồ + bình nitơ vào cuối dàn nóng', 'Để hở đầu dàn nóng', 'Bơm nitơ, giữ áp suất không quá 400 psi', 'Cặn và dầu bật ra ở đầu dàn, kiểm tra thông', 'Hàn nối lại, hút chân không, nạp gas'] },
    { title: 'Chẩn đoán dàn nóng', intro: 'Sắp xếp quy trình chẩn đoán không lạnh liên quan dàn nóng.', steps: ['Sờ dàn: đầu nóng, cuối có lạnh/đổ mồ hôi không?', 'Dàn nổi: tìm vết dầu loang', 'Cắt cuối dàn nóng, xem có gas không', 'Cắt tiếp đầu dàn nóng, xem có gas không', 'Kết luận: tắc toàn phần hay mất gas', 'Chọn phương án: thổi tắc, hàn hoặc thay dàn'] },
    { title: 'Thử kín dàn chìm', intro: 'Sắp xếp các bước thử kín dàn chìm.', steps: ['Tách dàn khỏi hệ thống', 'Hàn kín một đầu, đầu kia gắn ống công nghệ', 'Nối bộ đồng hồ và bình nitơ', 'Bơm nitơ 300–400 psi', 'Quét xà phòng mối nối rồi theo dõi kim', 'Kim tụt → xác định đoạn thủng, sửa hoặc đeo ba lô dàn mới'] }
  ];
  DL.register({
    id: 3, ready: true, title: 'Dàn nóng tủ lạnh', sub: 'Phân loại, hư hỏng, chẩn đoán, thay thế', minutes: 25,
    lead: 'Dàn nóng là nơi gas nhả nhiệt và ngưng tụ. Bài này giúp bạn phân biệt dàn nổi – dàn chìm, nhận biết tắc – thủng bằng cách cắt ống, sửa chữa và chọn dàn thay thế.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
