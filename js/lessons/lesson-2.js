/* BÀI 2 — ĐỘNG CƠ (BLOCK) TỦ LẠNH: kiểm tra, thay dầu, hư hỏng (biên soạn từ docs/Bai_2.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const SYMPTOMS = [
    { id: 's1', name: 'Block không chạy', sub: 'dòng = 0', cur: 'Kẹp dòng chỉ <b>0 A</b>', cause: ['Đứt cuộn dây động cơ', 'Rơi giắc cắm khỏi 3 chân (do va đập mạnh)'], fix: 'Đo cuộn dây, cắm lại giắc / thay cuộn dây hoặc thay block.' },
    { id: 's2', name: 'Block chạy, dòng cao', sub: 'dòng > định mức', cur: 'Dòng <b>lớn hơn định mức</b> ghi trên thân', cause: ['Kẹt cơ: pit-tông – xi-lanh, ổ đỡ', 'Cuộn dây chạm chập', 'Tắc toàn phần phía đẩy'], fix: 'Thêm tụ kích (> 100 µF) nếu chỉ khó khởi động; kẹt cơ → mở block vệ sinh/thay chi tiết.' },
    { id: 's3', name: 'Chạy nhưng không hút / không đẩy', sub: 'hỏng van', cur: 'Dòng bình thường hoặc hơi thấp, áp đẩy rất thấp', cause: ['Hỏng lá van hút / van đẩy', 'Gãy, vỡ chi tiết cơ bên trong'], fix: 'Mở block thay/đánh bóng lá van; không được thì thay block.' },
    { id: 's4', name: 'Chạy, hút đẩy kém', sub: 'tủ kém lạnh', cur: 'Áp đẩy thấp hơn chuẩn (< 450 psi)', cause: ['Van hút – đẩy bị mòn, hở', 'Pit-tông, xi-lanh mòn', 'Dầu bôi trơn kém chất lượng', 'Tắc một phần ống hút'], fix: 'Thay dầu đúng loại; mở block đánh van; thay block nếu mòn nhiều.' },
    { id: 's5', name: 'Block kêu ồn', sub: 'tiếng lạ', cur: 'Tiếng gõ, rung, kêu to khi chạy', cause: ['Dầu bôi trơn kém, thiếu dầu', 'Hỏng lò xo chống rung bên trong', 'Rô-to chạm stato / kẹt nhẹ'], fix: 'Bổ sung/thay dầu; mở block thay lò xo, căn lại rô-to – stato.' },
    { id: 's6', name: 'Block rò điện ra vỏ', sub: 'giật khi chạm', cur: 'Đo chân → vỏ < 10 MΩ', cause: ['Cách điện cuộn dây kém (ẩm, cháy lớp sơn)', 'Hỏng sứ cách điện ở chân'], fix: 'Thay cuộn dây / thay block (nguy hiểm — không dùng tiếp).' },
    { id: 's7', name: 'Chạy nhưng dòng hơi cao', sub: 'hơn định mức nhẹ', cur: 'Dòng cao hơn định mức một chút', cause: ['Tắc một phần ống đẩy', 'Kẹt cơ nhẹ'], fix: 'Với động cơ mới chưa lắp tụ chạy: thêm tụ ngậm giúp giảm dòng; kiểm tra tắc ống đẩy.' }
  ];

  const HP = [['1/12 HP', '≈ 60 W', '0,4 – 0,5 A', 'tủ nhỏ'], ['1/10 HP', '≈ 75 W', '0,7 – 0,8 A', 'tủ ~ 125 – 200 L'], ['1/8 HP', '≈ 92 W', '0,8 – 0,9 A', 'tủ ~ 160 – 250 L'], ['1/6 HP', '≈ 120 W', '0,9 – 1,0 A', 'tủ ~ 180 – 250 L'], ['1/5 HP', '≈ 147 W', '1,1 – 1,2 A', 'tủ ~ 200 – 280 L']];

  function learn() {
    return `
<section class="sec" id="s-over" data-toc="1 · Kiểm tra gì?">
  <div class="sec-n">Phần 1</div><h2>Block tốt hay xấu? Kiểm tra 3 phần</h2>
  <p>Block (máy nén kín) được ví như <b>trái tim</b> của tủ lạnh. Block yếu thì tủ kém lạnh, tốn điện, giảm tuổi thọ. Block gồm 3 phần nên ta kiểm tra theo 3 phần: <b>vỏ → điện → cơ</b>.</p>
  <div class="tabs" id="chkTabs"></div><article class="panel" id="chkPanel" aria-live="polite"></article>
  <div class="callout mem"><span class="ic">🧠</span><div><b class="t">Mẹo nhớ: “Vỏ – Điện – Cơ”</b><p>Kiểm tra từ <b>ngoài vào trong</b>, từ <b>dễ đến khó</b>: nhìn vỏ (miễn phí) → đo điện bằng đồng hồ vạn năng → thử cơ bằng đồng hồ áp suất.</p></div></div>
  <div class="callout"><span class="ic">📚</span><div><b class="t">Nên học trước</b><p>Cấu tạo, nguyên lý và cách xác định chân C – R – S của block nằm ở <a href="#/tu-lanh/5">Bài 5</a>. Nếu chưa vững, hãy xem Bài 5 trước.</p></div></div>
</section>

<section class="sec" id="s-elec" data-toc="2 · Kiểm tra điện">
  <div class="sec-n">Phần 2</div><h2>Kiểm tra phần điện</h2>
  <p>Có <b>3 phép kiểm tra</b>: (1) điện trở cuộn dây, (2) cách điện cuộn dây – vỏ, (3) dòng làm việc.</p>
  <dl class="kv"><dt>① Cuộn dây</dt><dd>Thang <b>x1 Ω</b>, đo 3 cặp chân. Lần đo lớn nhất = R + S (tổng 2 cuộn). Kim <b>không lên</b> (∞) → <b class="hot-t">đứt</b>. Kim <b>= 0</b> → chập hoàn toàn. Giá trị <b>nhỏ bất thường</b> → chập một số vòng. Block 220 V công suất nhỏ: điện trở cuộn chạy thường <b>≥ 10 Ω</b>.</dd>
  <dt>② Cách điện</dt><dd>Thang <b>x10k</b>: một que vào 1 chân, que kia chạm vào vỏ (chỗ kim loại trần, không sơn). Kim <b>không lên</b> hoặc ≥ <b>10 MΩ</b> → an toàn. Nhỏ hơn 10 MΩ → <b>rò điện</b>.</dd>
  <dt>③ Dòng làm việc</dt><dd>Cấp nguồn qua rơle khởi động + rơle bảo vệ, dùng đồng hồ <b>kẹp dòng</b>: lúc đầu dòng <b>lớn</b> (khởi động), rồi hạ xuống và phải <b>≤ dòng định mức</b> (VD 0,6 A &lt; định mức) → phần điện tốt.</dd></dl>
  <h3 style="margin-top:26px">🔬 Thực hành: đo và kết luận</h3>
  <p>Mỗi lần bấm “Động cơ mới” bạn nhận một block ngẫu nhiên (tốt, đứt, chập vòng hoặc rò vỏ). Hãy đo đủ rồi kết luận.</p>
  <div id="lab"></div>
</section>

<section class="sec" id="s-mech" data-toc="3 · Kiểm tra cơ">
  <div class="sec-n">Phần 3</div><h2>Kiểm tra phần cơ (thử bằng áp suất)</h2>
  <p>Hàn ống công nghệ vào ống đẩy, nối đồng hồ áp suất cao (đỏ). Có <b>3 bước</b>: áp suất đẩy → độ kín van → sức khởi động.</p>
  <h3>① Áp suất đẩy</h3>
  <div class="gauge-wrap"><div class="stage" style="margin:0"><div id="g1"></div></div>
    <div><div class="opts-r" id="qOpts"></div>
      <div class="row"><button class="btn pri" id="gOn">⚡ Cấp nguồn</button><button class="btn" id="gOff">⏹ Ngắt nguồn</button><button class="btn" id="gRs">↺ Làm lại</button></div>
      <div class="verdict" id="gV" style="margin-top:12px">Chọn chất lượng block rồi bấm “Cấp nguồn”.</div></div></div>
  <table class="cmp"><thead><tr><th>Áp suất đẩy</th><th>Đánh giá</th></tr></thead><tbody>
    <tr><td><b>≥ 450 psi</b></td><td><span class="pill ok">Sức đẩy tốt</span></td></tr>
    <tr><td>350 – 450 psi</td><td><span class="pill cold">Trung bình</span></td></tr>
    <tr><td>100 – 350 psi</td><td><span class="pill bad">Yếu</span></td></tr>
    <tr><td>≤ 100 psi</td><td><span class="pill bad">Hỏng, không đẩy được</span></td></tr></tbody></table>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">Bảo vệ đồng hồ</b><p>Đồng hồ áp suất cao chỉ tối đa khoảng <b>500 psi</b>. Nếu kim lên quá <b>450 psi</b> mà vẫn đang tăng → <b>ngắt nguồn ngay</b>. Block khỏe nhiều khi vượt 500 psi. Kim vừa lên vừa <b>rung giật</b> → thường do van đẩy hở.</p></div></div>
  <h3 style="margin-top:28px">② Độ kín của van (sức hút &amp; sức đẩy)</h3>
  <p>Cho block chạy tới khi áp suất đẩy tối đa, <b>ngắt nguồn</b>, bôi bọt xà phòng kiểm tra đầu nối rồi quan sát kim:</p>
  <div class="grid2"><div class="panel okc" style="margin:0"><h4>Van đẩy kín</h4><p style="margin:6px 0 0">Kim đứng yên ở giá trị ban đầu.</p></div><div class="panel hotc" style="margin:0"><h4>Van đẩy hở / mòn pit-tông – xi-lanh</h4><p style="margin:6px 0 0">Kim <b>giảm dần</b>.</p></div></div>
  <p style="margin-top:14px"><b>Thử sức hút:</b> hàn kín ống đẩy, nối đồng hồ (xanh) vào ống hút. Block tốt hút được chân không tới <b>−30 inHg (−76 cmHg)</b>. Ngắt nguồn, nếu kim <b>trở dần về 0</b> → van hút bị hở.</p>
  <div class="gauge-wrap"><div class="stage" style="margin:0"><div id="g2"></div></div>
    <div><div class="opts-r" id="vOpts"><label><input type="radio" name="vv" value="ok" checked><span><b>Van hút kín</b></span></label><label><input type="radio" name="vv" value="bad"><span><b>Van hút hở</b></span></label></div>
      <div class="row"><button class="btn pri" id="vOn">⚡ Cấp nguồn (hút chân không)</button><button class="btn" id="vOff">⏹ Ngắt nguồn &amp; theo dõi</button></div>
      <div class="verdict" id="vV" style="margin-top:12px">Bấm “Cấp nguồn” để block hút chân không.</div></div></div>
  <h3 style="margin-top:28px">③ Sức khởi động</h3>
  <p>Khi block nằm trong hệ thống đã nạp gas, áp suất cân bằng khá cao nên block phải đủ khỏe để <b>khởi động lại ngay</b>. Cách thử: cho chạy lên khoảng <b>200 psi</b>, ngắt nguồn rồi cấp lại ngay, quan sát dòng bằng ampe kìm. Nếu block <b>không khởi động được</b> khi áp suất còn cao thì rất dễ <b>cháy động cơ</b> → không dùng.</p>
</section>

<section class="sec" id="s-oil" data-toc="4 · Thay dầu">
  <div class="sec-n">Phần 4</div><h2>Thay dầu cho block</h2>
  <p>Bình thường <b>không cần</b> thay dầu (dầu nhớt cao, hao ít). Chỉ thay khi: <b>sửa dàn lạnh/hệ thống</b> làm dầu nhiễm bẩn, <b>dầu bị ẩm sinh axit</b>, hoặc <b>đổi loại gas</b> (phải đổi dầu tương ứng).</p>
  <h3>Quy trình</h3>
  ${U.steps([['Xả dầu cũ', 'Block piston hút gián tiếp – đẩy trực tiếp nên ống hút và ống công nghệ <b>thông với khoang dầu</b>. Nghiêng block, đổ dầu ra theo ống hút vào hộp đựng.'], ['Thổi sạch', 'Bơm khí nén nhẹ vào để đẩy hết dầu và cặn bẩn còn lại (giống tháo ốc xả dầu xe máy).'], ['Chuẩn bị dầu mới', 'Đúng loại với gas đang dùng (VD gas R134a → dầu tương ứng). Dầu phải sạch.'], ['Hút dầu vào', 'Nối ống nhựa từ <b>ống hút</b> xuống hộp dầu, <b>lấy tay bịt ống công nghệ</b>, cho block chạy để tự hút dầu vào (dầu nặng hơn không khí, không bịt thì chỉ hút khí).'], ['Kiểm tra lượng dầu', 'Đủ lượng thì ngắt nguồn. Thừa dầu: tràn sang dàn lạnh làm giảm năng suất. Thiếu dầu: bôi trơn và làm mát kém.']])}
  <h3 style="margin-top:28px">🧮 Tính lượng dầu cần nạp</h3>
  <div class="panel" style="border-left-color:var(--cold)"><p><b>Thay dầu nhưng giữ block cũ:</b> nạp = lượng dầu đã xả + <b>1/6</b> (bù lượng hao trong quá trình chạy).</p>
    <label class="row" style="gap:10px">Dầu đã xả ra: <input id="oilIn" type="number" min="50" max="500" value="240" class="btn sm" style="width:100px;min-height:40px;text-align:center"> ml</label>
    <div class="verdict" id="oilOut" style="margin-top:10px"></div>
    <p class="muted" style="margin:10px 0 0;font-size:14px"><b>Thay block mới:</b> nạp theo nhà sản xuất, thường trong khoảng <b>200 – 350 ml</b> (block lớn nạp nhiều hơn, block nhỏ nạp ít hơn).</p></div>
</section>

<section class="sec" id="s-fault" data-toc="5 · 7 hư hỏng">
  <div class="sec-n">Phần 5</div><h2>7 hiện tượng hỏng của block</h2>
  <p>Khách hàng thường chỉ thấy: <b>không chạy</b>, <b>kém lạnh</b>, <b>chạy không hút</b>, <b>ồn</b> hoặc <b>rò điện</b>. Bấm từng hiện tượng để xem cách đo và nguyên nhân.</p>
  <div id="symTabs"></div><article class="panel hotc" id="symPanel" aria-live="polite"></article>
  <div class="callout"><span class="ic">💡</span><div><b class="t">Vì sao khó sửa?</b><p>Block là máy nén kín: vỏ thép được <b>hàn kín</b> bao bọc cả phần điện lẫn phần cơ nên việc mở ra sửa rất khó. Vì vậy nhiều trường hợp thợ chọn <b>thay cả block</b>.</p></div></div>
</section>

<section class="sec" id="s-fix" data-toc="6 · Sửa &amp; thay thế">
  <div class="sec-n">Phần 6</div><h2>Sửa chữa và thay thế block</h2>
  <h3>Sửa nhanh bằng linh kiện phụ</h3>
  <div class="grid2"><div class="panel" style="margin:0"><h4>Khó khởi động / dòng cao</h4><p style="margin:6px 0 0">Thêm <b>tụ kích</b> (tụ khởi động) điện dung khoảng <b>&gt; 100 µF</b> theo sơ đồ đấu điện (xem Bài 5).</p></div><div class="panel warm" style="margin:0"><h4>Chạy hơi cao dòng</h4><p style="margin:6px 0 0">Block chưa có tụ chạy: thêm <b>tụ ngậm</b> (tụ làm việc) để giảm dòng. Block đã có tụ rồi thì thêm vào không có tác dụng.</p></div></div>
  <h3 style="margin-top:28px">Mở block để sửa</h3>
  ${U.steps([['Xả hết dầu ra khỏi block', ''], ['Cưa lớp vỏ ngoài tại điểm tiếp giáp mối hàn', 'Chỉ cưa lớp vỏ ngoài; cưa quá sâu vào trong sẽ cắt phải chi tiết bên trong. Dùng búa cao su gõ nhẹ để tách vỏ.'], ['Tháo các chi tiết, tìm hư hỏng', ''], ['Sửa: thay cuộn dây / vệ sinh / căn lại rô-to', '<b>Cuộn dây:</b> dây mới phải cùng tiết diện, cùng số vòng; quấn xong chỉ buộc gọn bằng dây dù, <b>không tẩm sơn cách điện</b> (block chạy trong môi trường dầu-gas). <b>Rô-to chạm stato:</b> tháo bu-lông, vệ sinh, dùng lá nhôm mỏng căn khoảng cách đều rồi siết lại. <b>Chi tiết cơ:</b> ngâm dầu hỏa hoặc nước tẩy chuyên dụng, chải, đánh nhẹ bằng giấy nhám mịn, lau khô rồi ngâm lại trong dầu.'], ['Lắp lại, hàn kín vỏ', 'Hàn xong phải <b>thử kín vỏ</b> trước khi nạp dầu, hút chân không, nạp gas.']])}
  <h3 style="margin-top:28px">Chọn block thay thế</h3>
  <p>Phải thoả 3 điều kiện: ① <b>điện áp</b> giống block cũ (tránh đổi nguồn phức tạp); ② <b>kích thước</b> lắp vừa chỗ phía sau tủ; ③ <b>công suất tương đương</b> với dàn nóng, dàn lạnh. Thông số ghi trên vỏ block hoặc trên rơle bảo vệ đi kèm.</p>
  <div class="tscroll"><table class="cmp"><thead><tr><th>Mã lực</th><th>Công suất</th><th>Dòng</th><th>Tủ phù hợp (tham khảo)</th></tr></thead><tbody>${HP.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="muted" style="font-size:14px;margin-top:8px">1 HP ≈ 736 W. Bảng chỉ để tham khảo: mỗi loại gas, mỗi hãng có năng suất lạnh khác nhau nên cùng một block có thể lắp cho nhiều dung tích.</p>
  <h3 style="margin-top:24px">🧮 Tính công suất khi mất thông số</h3>
  <div class="panel" style="border-left-color:var(--cold)"><p><b>P = U × I × cosφ</b>, với block tủ lạnh lấy <b>cosφ ≈ 0,85</b> (động cơ thường 0,85 – 0,95). Lõi stato ghép lỏng thì từ tính kém nên cosφ không thể bằng 1.</p>
    <div class="row"><label>U <input id="pu" type="number" value="220" class="btn sm" style="width:84px;min-height:40px;text-align:center"> V</label><label>I <input id="pi" type="number" step="0.05" value="0.6" class="btn sm" style="width:84px;min-height:40px;text-align:center"> A</label><b id="pp" style="font:700 30px var(--head)"></b></div></div>
</section>

<section class="sec" id="s-recap" data-toc="7 · Tóm tắt">
  <div class="sec-n">Phần 7</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Kiểm tra theo thứ tự Vỏ → Điện → Cơ.</b><span>Vỏ: không bẹp, 3 ống nguyên, 3 chân mạ sáng, còn thông số.</span></div></li>
    <li class="done"><div><b>Điện: x1Ω đo cuộn dây, x10k đo cách điện (≥ 10 MΩ).</b><span>∞ = đứt, nhỏ bất thường = chập vòng, &lt; 10 MΩ = rò vỏ.</span></div></li>
    <li class="done"><div><b>Dòng làm việc ≤ dòng định mức.</b><span>Dòng 0 = không chạy; dòng cao = kẹt hoặc hỏng điện/cơ.</span></div></li>
    <li class="done"><div><b>Cơ: áp đẩy ≥ 450 psi là tốt; ngắt nguồn thấy kim tụt là hở van.</b><span>Hút tốt đạt −30 inHg. Vượt 450 psi vẫn tăng thì ngắt để bảo vệ đồng hồ.</span></div></li>
    <li class="done"><div><b>Thay dầu: giữ block thì nạp = xả + 1/6; block mới 200–350 ml.</b><span>Thừa dầu hại dàn lạnh, thiếu dầu hại bôi trơn.</span></div></li>
    <li class="done"><div><b>Thay block phải đúng điện áp, kích thước, công suất.</b><span>P = U·I·cosφ (cosφ ≈ 0,85).</span></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/tu-lanh/2/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    // Phần 1: 3 phần kiểm tra
    const CHK = {
      shell: ['① Phần vỏ', `<ul><li>Hình dạng, kích thước: <b>không bẹp, méo</b> (méo làm lò xo chống rung lệch, block kêu to).</li><li>Nước sơn không bong tróc (sơn giúp chống gỉ, <b>tỏa nhiệt</b> tốt).</li><li>3 ống nối còn nguyên: <b>nếu ống đẩy bị bẹp</b> thì áp suất đẩy tăng, block quá tải; <b>ống hút bẹp</b> thì hút kém, P0 cao, tủ kém lạnh. Ống gãy rất khó hàn lại.</li><li>3 chân đấu điện <b>mạ crôm, sáng sạch</b>, nguyên trạng; chân han gỉ dễ tiếp xúc kém.</li><li>Còn đủ <b>thông số kỹ thuật</b> trên thân.</li></ul>`],
      elec: ['② Phần điện', '<ul><li>Đo điện trở cuộn dây (x1 Ω).</li><li>Đo cách điện cuộn dây – vỏ (x10k).</li><li>Cấp nguồn, kẹp dòng làm việc.</li></ul>'],
      mech: ['③ Phần cơ', '<ul><li>Áp suất đẩy (và sức hút).</li><li>Độ kín của lá van.</li><li>Sức khởi động khi có tải.</li></ul>']
    };
    U.tabset($('#chkTabs', root), [{ id: 'shell', n: '①', name: 'Vỏ' }, { id: 'elec', n: '②', name: 'Điện' }, { id: 'mech', n: '③', name: 'Cơ' }], id => { $('#chkPanel', root).innerHTML = `<h3>${CHK[id][0]}</h3>${CHK[id][1]}`; });
    // Phần 2: phòng đo điện
    U.motorLab($('#lab', root), 'diagnose');
    // Phần 3: áp suất đẩy
    const Q = { good: ['Tốt', 480], mid: ['Trung bình', 400], weak: ['Yếu', 250], bad: ['Hỏng', 80] };
    $('#qOpts', root).innerHTML = Object.entries(Q).map(([k, v], i) => `<label><input type="radio" name="q" value="${k}" ${i ? '' : 'checked'}><span><b>Block ${v[0].toLowerCase()}</b></span></label>`).join('');
    const g1 = $('#g1', root), gV = $('#gV', root);
    const G1 = { min: 0, max: 500, step: 50, unit: 'psi', good: [450, 500] };
    let v1 = 0, t1 = null;
    const draw1 = () => g1.innerHTML = U.gauge(v1, G1);
    const stop1 = () => { clearInterval(t1); t1 = null; };
    draw1();
    $('#gOn', root).onclick = () => {
      stop1(); const tgt = Q[$('input[name=q]:checked', root).value][1]; gV.className = 'verdict'; gV.textContent = 'Block đang chạy, kim đang lên…';
      t1 = setInterval(() => { v1 += (tgt - v1) * .08 + 2; if (v1 >= tgt - 1) { v1 = tgt; stop1(); gV.className = 'verdict ' + (tgt >= 450 ? 'ok' : 'bad'); gV.innerHTML = tgt >= 450 ? '✓ ≥ 450 psi: <b>sức đẩy tốt</b>. Nhớ ngắt nguồn để bảo vệ đồng hồ.' : tgt >= 350 ? 'Áp đẩy <b>trung bình</b> (350–450 psi).' : tgt > 100 ? '✗ Áp đẩy thấp: block <b>yếu</b>, nên kiểm tra thêm độ kín van.' : '✗ ≤ 100 psi: block <b>hỏng, không đẩy được</b>.'; } draw1(); }, 40);
    };
    $('#gOff', root).onclick = () => { stop1(); const v0 = v1; if (v0 < 5) return; gV.textContent = 'Đã ngắt nguồn. Đang theo dõi kim…'; t1 = setInterval(() => { v1 = Math.max(0, v1 - (Q[$('input[name=q]:checked', root).value][1] < 300 ? 5 : 1.2)); if (v1 <= 0) stop1(); draw1(); }, 120); setTimeout(() => { if (v1 >= v0 - 3) { gV.className = 'verdict ok'; gV.textContent = '✓ Kim đứng yên → van kín.'; } else { gV.className = 'verdict bad'; gV.textContent = '✗ Kim giảm dần → van hở hoặc pit-tông/xi-lanh mòn.'; } }, 3000); };
    $('#gRs', root).onclick = () => { stop1(); v1 = 0; draw1(); gV.className = 'verdict'; gV.textContent = 'Chọn chất lượng block rồi bấm “Cấp nguồn”.'; };
    // chân không
    const g2 = $('#g2', root), vV = $('#vV', root), G2 = { min: -30, max: 0, step: 5, unit: 'inHg', good: [-30, -26] };
    let v2 = 0, t2 = null; const draw2 = () => g2.innerHTML = U.gauge(v2, G2); draw2();
    $('#vOn', root).onclick = () => { clearInterval(t2); t2 = setInterval(() => { v2 = Math.max(-30, v2 - 1); if (v2 <= -30) { clearInterval(t2); vV.className = 'verdict ok'; vV.textContent = 'Kim về −30 inHg (−76 cmHg): block hút rất tốt. Giờ bấm “Ngắt nguồn & theo dõi”.'; } draw2(); }, 60); };
    $('#vOff', root).onclick = () => { clearInterval(t2); const bad = $('input[name=vv]:checked', root).value === 'bad'; t2 = setInterval(() => { v2 = Math.min(0, v2 + (bad ? .5 : 0)); draw2(); if (v2 >= 0) clearInterval(t2); }, 100); setTimeout(() => { vV.className = 'verdict ' + (bad ? 'bad' : 'ok'); vV.innerHTML = bad ? '✗ Kim quay dần về 0 → <b>van hút bị hở</b>.' : '✓ Kim đứng yên ở −30 inHg → <b>van hút kín</b>.'; }, 2500); };
    // Phần 4: máy tính dầu
    const oi = $('#oilIn', root), oo = $('#oilOut', root), calc = () => { const x = +oi.value || 0; oo.innerHTML = `Lượng dầu nạp lại ≈ <b>${Math.round(x * 7 / 6)} ml</b> (= ${x} + ${Math.round(x / 6)}).`; }; oi.oninput = calc; calc();
    U.bindSteps(root);
    // Phần 5: 7 hiện tượng
    U.tabset($('#symTabs', root), SYMPTOMS.map((s, i) => ({ id: s.id, n: i + 1, name: s.name, sub: s.sub })), id => {
      const s = SYMPTOMS.find(x => x.id === id);
      $('#symPanel', root).innerHTML = `<h3>${s.name}</h3><dl class="kv"><dt>Đo được</dt><dd>${s.cur}</dd><dt>Nguyên nhân</dt><dd>${s.cause.map(c => `<span class="pill bad">${c}</span>`).join('')}</dd><dt>Khắc phục</dt><dd>${s.fix}</dd></dl>`;
    });
    // Phần 6: công suất
    const pu = $('#pu', root), pi = $('#pi', root), pp = $('#pp', root), cp = () => { pp.textContent = '≈ ' + Math.round((+pu.value || 0) * (+pi.value || 0) * .85) + ' W'; }; pu.oninput = pi.oninput = cp; cp();
  }

  const flashcards = [
    { f: 'Block được kiểm tra qua mấy phần? Gồm gì?', b: '<b>3 phần</b>: phần <b>vỏ</b>, phần <b>điện</b>, phần <b>cơ</b>.', tag: 'Tổng quan' },
    { f: 'Vì sao ống đẩy bị bẹp làm block yếu?', b: 'Áp suất đẩy tăng cao → block bị <b>quá tải</b>.', tag: 'Vỏ' },
    { f: 'Ống hút bị bẹp gây hậu quả gì?', b: 'Hút kém, áp suất P0 cao, nhiệt độ sôi cao → tủ <b>kém lạnh</b>.', tag: 'Vỏ' },
    { f: '3 chân đấu điện của block phải như thế nào?', b: '<b>Mạ crôm, sáng sạch</b>, còn nguyên để tiếp xúc tốt.', tag: 'Vỏ' },
    { f: 'Cách đo điện trở cuộn dây block?', b: 'Thang <b>x1 Ω</b>, đo 3 cặp chân; lần đo lớn nhất = R + S.', tag: 'Điện' },
    { f: 'Đo cuộn dây: kim không lên (∞) nghĩa là gì?', b: 'Cuộn dây bị <b>đứt</b>.', tag: 'Điện' },
    { f: 'Đo cuộn dây: giá trị nhỏ bất thường hoặc bằng 0?', b: 'Nhỏ: <b>chập một số vòng</b>. Bằng 0: <b>chập hoàn toàn</b>.', tag: 'Điện' },
    { f: 'Đo cách điện cuộn dây – vỏ dùng thang nào? Chuẩn?', b: 'Thang <b>x10k</b>. Kim không lên hoặc <b>≥ 10 MΩ</b> là an toàn; &lt; 10 MΩ là <b>rò điện</b>.', tag: 'Điện' },
    { f: 'Dòng làm việc của block phải thế nào?', b: 'Lúc đầu lớn (khởi động), sau đó <b>≤ dòng định mức</b>.', tag: 'Điện' },
    { f: 'Áp suất đẩy ≥ ? psi thì block đẩy tốt?', b: '<b>≥ 450 psi</b>. 350–450 trung bình; 100–350 yếu; ≤ 100 hỏng.', tag: 'Cơ' },
    { f: 'Khi nào phải ngắt nguồn để bảo vệ đồng hồ áp suất?', b: 'Kim lên quá <b>450 psi</b> mà vẫn tăng (đồng hồ chỉ tối đa ~500 psi).', tag: 'Cơ' },
    { f: 'Ngắt nguồn mà kim áp đẩy giảm dần nghĩa là gì?', b: 'Van đẩy <b>hở</b> hoặc pit-tông – xi-lanh <b>mòn</b>.', tag: 'Cơ' },
    { f: 'Chân không tối đa block hút được?', b: '<b>−30 inHg</b> (≈ −76 cmHg). Kim trở dần về 0 khi ngắt → van hút hở.', tag: 'Cơ' },
    { f: 'Vì sao phải thử sức khởi động?', b: 'Trong hệ thống áp suất cân bằng cao; block yếu <b>không khởi động được</b> sẽ <b>cháy động cơ</b>.', tag: 'Cơ' },
    { f: 'Khi nào cần thay dầu block?', b: 'Sửa hệ thống làm dầu bẩn / dầu ẩm sinh axit / <b>đổi loại gas</b>.', tag: 'Thay dầu' },
    { f: 'Xả dầu block qua ống nào?', b: 'Qua <b>ống hút</b> (hoặc ống công nghệ) vì thông với khoang dầu; sau đó thổi khí nén đẩy sạch.', tag: 'Thay dầu' },
    { f: 'Khi nạp dầu bằng cách hút, vì sao phải bịt ống công nghệ?', b: 'Nếu không bịt, block <b>hút không khí</b> chứ không hút dầu.', tag: 'Thay dầu' },
    { f: 'Giữ block, thay dầu: nạp bao nhiêu?', b: 'Lượng dầu đã xả <b>+ 1/6</b> (VD 240 ml → 280 ml).', tag: 'Thay dầu' },
    { f: 'Block mới nạp dầu bao nhiêu?', b: 'Khoảng <b>200 – 350 ml</b> tùy block.', tag: 'Thay dầu' },
    { f: 'Thừa dầu / thiếu dầu gây hại gì?', b: 'Thừa: tràn sang dàn lạnh → giảm năng suất. Thiếu: bôi trơn & làm mát kém.', tag: 'Thay dầu' },
    { f: 'Kể 7 hiện tượng hỏng của block.', b: 'Không chạy · chạy dòng cao · không hút/đẩy · hút đẩy kém · kêu ồn · rò điện ra vỏ · hơi cao dòng.', tag: 'Hư hỏng' },
    { f: 'Block không chạy, dòng = 0: nguyên nhân?', b: '<b>Đứt cuộn dây</b> hoặc <b>rơi giắc cắm</b> khỏi chân.', tag: 'Hư hỏng' },
    { f: 'Block chạy dòng cao: nguyên nhân?', b: '<b>Kẹt cơ</b>, cuộn dây chạm chập, tắc toàn phần phía đẩy.', tag: 'Hư hỏng' },
    { f: 'Chạy nhưng không hút/đẩy: nguyên nhân?', b: 'Hỏng <b>lá van</b> hút/đẩy hoặc hỏng chi tiết cơ.', tag: 'Hư hỏng' },
    { f: 'Khi mở block để sửa, cưa chỗ nào?', b: 'Cưa <b>lớp vỏ ngoài tại điểm tiếp giáp mối hàn</b>, không cưa quá sâu.', tag: 'Sửa chữa' },
    { f: 'Quấn lại cuộn dây: lưu ý gì?', b: 'Cùng <b>tiết diện, số vòng, chất lượng</b>; chỉ buộc dây dù, <b>không tẩm sơn cách điện</b>.', tag: 'Sửa chữa' },
    { f: 'Thêm tụ nào khi block khó khởi động?', b: '<b>Tụ kích</b> (tụ khởi động) &gt; 100 µF.', tag: 'Sửa chữa' },
    { f: 'Chọn block thay thế cần đúng 3 yếu tố nào?', b: '<b>Điện áp</b>, <b>kích thước lắp</b>, <b>công suất</b> tương đương.', tag: 'Thay thế' },
    { f: 'Công thức công suất block? cosφ bao nhiêu?', b: '<b>P = U·I·cosφ</b>, cosφ ≈ <b>0,85</b>.', tag: 'Thay thế' },
    { f: '1 mã lực (HP) bằng bao nhiêu W?', b: 'Khoảng <b>736 W</b> (1/10 HP ≈ 75 W).', tag: 'Thay thế' }
  ];

  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Block được kiểm tra theo thứ tự nào?', ['Cơ → điện → vỏ', 'Vỏ → điện → cơ', 'Điện → cơ → vỏ', 'Chỉ cần kiểm tra điện'], 1, 'Đi từ ngoài vào trong, từ dễ đến khó: vỏ → điện → cơ.'),
    Q('Ống đẩy của block bị bẹp sẽ dẫn đến?', ['Block quá tải do áp suất đẩy tăng', 'Tủ lạnh sâu hơn', 'Dàn lạnh đóng tuyết', 'Không ảnh hưởng'], 0, 'Cản đường đẩy → áp suất cao → block nặng tải.'),
    Q('Ống hút bị bẹp thì áp suất P0 thế nào?', ['Thấp hơn', 'Cao hơn bình thường', 'Không đổi', 'Bằng 0'], 1, 'Hút kém nên áp suất bay hơi P0 cao, nhiệt độ sôi cao hơn → kém lạnh.'),
    Q('Đo cuộn dây block dùng thang nào?', ['x10k', 'x1 Ω', 'DCV', 'ACV'], 1, 'Cuộn dây có điện trở nhỏ nên dùng thang x1 Ω.'),
    Q('Ba lần đo cuộn dây được 14 Ω, 16 Ω và 30 Ω. Lần đo nào chứa chân chung C?', ['Lần 14 Ω và 16 Ω', 'Chỉ lần 30 Ω', 'Lần 30 Ω không chứa C', 'Không xác định được'], 0, 'Lần lớn nhất (30 Ω = R+S) loại ra chân C; C nằm trong hai lần đo còn lại.'),
    Q('Khi đo cuộn dây thấy kim không lên (∞) thì kết luận?', ['Cuộn dây tốt', 'Cuộn dây bị đứt', 'Chập vòng', 'Rò điện'], 1, 'Mạch hở → đứt cuộn dây.'),
    Q('Điện trở cuộn dây nhỏ bất thường (block 220 V công suất nhỏ, < 10 Ω nhiều) nghĩa là?', ['Tốt', 'Đứt', 'Chập một số vòng dây', 'Dầu bẩn'], 2, 'Số vòng giảm → điện trở giảm.'),
    Q('Đo cách điện cuộn dây với vỏ dùng thang nào?', ['x1 Ω', 'x10 Ω', 'x10k', 'DCmA'], 2, 'Cách điện cần thang đo cao x10k.'),
    Q('Điện trở cuộn dây – vỏ bao nhiêu thì xem là an toàn?', ['Dưới 1 MΩ', '≥ 10 MΩ hoặc kim không lên', 'Đúng 0 Ω', 'Khoảng 100 Ω'], 1, '< 10 MΩ là rò điện.'),
    Q('Đồng hồ kẹp dòng đo block đang chạy chỉ lớn hơn dòng định mức. Có thể do?', ['Kẹt cơ hoặc hỏng cuộn dây', 'Dầu quá mới', 'Tủ quá nhiều đồ lạnh', 'Dàn nóng quá mát'], 0, 'Dòng cao thường do kẹt cơ, chạm chập hoặc tắc phía đẩy.'),
    Q('Áp suất đẩy bao nhiêu thì block được xem là đẩy tốt?', ['≥ 450 psi', '200 psi', '100 psi', '< 50 psi'], 0, '≥ 450 psi: tốt; ≤ 100 psi: hỏng.'),
    Q('Đồng hồ áp suất cao chỉ tối đa khoảng bao nhiêu? Xử lý khi lên > 450 psi vẫn tăng?', ['500 psi — ngắt nguồn', '1000 psi — để chạy', '100 psi — để chạy', '500 psi — tăng ga'], 0, 'Ngắt nguồn để không hỏng đồng hồ.'),
    Q('Ngắt nguồn, kim áp suất đẩy giảm dần. Nguyên nhân?', ['Van kín', 'Van đẩy hở hoặc mòn pit-tông – xi-lanh', 'Dầu quá nhiều', 'Điện áp cao'], 1, 'Không giữ được áp → có chỗ hở.'),
    Q('Khi thử sức hút, block tốt hút chân không được tới?', ['−30 inHg', '−5 inHg', '0 inHg', '+30 inHg'], 0, '−30 inHg ≈ −76 cmHg.'),
    Q('Ngắt nguồn, kim chân không trở dần về 0. Kết luận?', ['Van hút kín', 'Van hút bị hở', 'Tốt', 'Dầu thiếu'], 1, 'Chân không không giữ được → hở van hút.'),
    Q('Vì sao phải thử sức khởi động?', ['Để biết nhãn hiệu', 'Khi lắp vào hệ thống áp suất cao, block yếu không khởi động được sẽ cháy', 'Để thay dầu', 'Để đo điện trở'], 1, 'Áp suất cân bằng trong hệ thống làm cản trở khởi động.'),
    Q('Dầu nặng hơn không khí. Khi hút dầu vào block bằng ống nhựa, cần?', ['Bịt ống công nghệ bằng tay', 'Để hở cả hai ống', 'Hàn kín ống hút', 'Mở van xả'], 0, 'Không bịt thì block hút khí chứ không hút dầu.'),
    Q('Thay dầu nhưng giữ block cũ: xả 240 ml thì nạp khoảng?', ['240 ml', '280 ml', '360 ml', '120 ml'], 1, '240 + 1/6 (40) = 280 ml.'),
    Q('Lượng dầu nạp cho block mới thường trong khoảng?', ['20 – 50 ml', '200 – 350 ml', '1 – 2 lít', '500 – 800 ml'], 1, 'Tùy block, thường 200 – 350 ml.'),
    Q('Thừa dầu trong block có hại gì?', ['Tràn sang dàn lạnh, giảm năng suất làm lạnh', 'Tủ lạnh sâu hơn', 'Block êm hơn', 'Không có hại'], 0, 'Dầu theo gas sang dàn lạnh làm giảm trao đổi nhiệt.'),
    Q('Block chạy nhưng không hút đẩy thường do?', ['Hỏng lá van', 'Cuộn dây đứt', 'Rò điện', 'Tụ yếu'], 0, 'Van không đóng mở đúng thì không hút/đẩy được.'),
    Q('Block kêu ồn có thể do?', ['Dầu kém, hỏng lò xo chống rung, rô-to chạm stato', 'Dàn lạnh thủng', 'Tuyết bám', 'Điện áp thấp'], 0, 'Các nguyên nhân cơ khí/bôi trơn.'),
    Q('Khi mở block để sửa, cưa vỏ như thế nào?', ['Cưa sâu hết vỏ', 'Chỉ cưa lớp vỏ ngoài tại điểm tiếp giáp mối hàn', 'Cắt theo chiều dọc', 'Dùng mỏ hàn cắt'], 1, 'Cưa sâu sẽ làm hỏng chi tiết bên trong và rơi mạt sắt.'),
    Q('Quấn lại cuộn dây block, cần lưu ý?', ['Dùng dây tiết diện nhỏ hơn', 'Cùng tiết diện, số vòng; không tẩm sơn cách điện', 'Tẩm sơn dày', 'Không cần đúng số vòng'], 1, 'Block chạy trong dầu – gas nên không sơn thêm.'),
    Q('Điều kiện chọn block thay thế gồm?', ['Chỉ cần cùng màu', 'Điện áp, kích thước, công suất tương đương', 'Chỉ cùng hãng', 'Chỉ cùng giá'], 1, 'Nếu lệch sẽ làm hệ thống mất cân đối.'),
    Q('Công suất block có U = 220 V, I = 0,6 A, cosφ = 0,85 là khoảng?', ['112 W', '50 W', '300 W', '500 W'], 0, '220 × 0,6 × 0,85 ≈ 112 W.')
  ];

  const sort = {
    title: 'Kiểm tra này thuộc phần nào của block?',
    buckets: [{ id: 'shell', name: '① Phần vỏ' }, { id: 'elec', name: '② Phần điện' }, { id: 'mech', name: '③ Phần cơ' }],
    items: [
      { t: 'Kiểm tra hình dạng, không bẹp méo', b: 'shell' }, { t: 'Ống nối còn nguyên, không gãy', b: 'shell' }, { t: 'Chân đấu điện mạ crôm sáng sạch', b: 'shell' }, { t: 'Còn thông số kỹ thuật trên thân', b: 'shell' },
      { t: 'Đo điện trở cuộn dây thang x1 Ω', b: 'elec' }, { t: 'Đo cách điện chân – vỏ thang x10k', b: 'elec' }, { t: 'Kẹp dòng làm việc ≤ dòng định mức', b: 'elec' }, { t: 'Kim không lên → cuộn dây đứt', b: 'elec' },
      { t: 'Đo áp suất đẩy ≥ 450 psi', b: 'mech' }, { t: 'Ngắt nguồn, kim tụt → van hở', b: 'mech' }, { t: 'Hút chân không −30 inHg', b: 'mech' }, { t: 'Thử sức khởi động khi áp suất cao', b: 'mech' }
    ]
  };

  const order = [
    { title: 'Thay dầu block', intro: 'Sắp xếp các bước thay dầu cho block (giữ block cũ).',
      steps: ['Nghiêng block, xả dầu cũ ra theo ống hút', 'Thổi khí nén đẩy hết dầu và cặn bẩn', 'Chuẩn bị dầu mới đúng loại, đủ lượng (xả + 1/6)', 'Nối ống nhựa từ ống hút xuống hộp dầu, bịt ống công nghệ', 'Cho block chạy để hút dầu vào', 'Ngắt nguồn, kiểm tra lượng dầu đã đủ'] },
    { title: 'Mở block sửa chữa', intro: 'Sắp xếp quy trình mở block và sửa.',
      steps: ['Xả hết dầu ra khỏi block', 'Cưa lớp vỏ ngoài tại điểm tiếp giáp mối hàn', 'Tháo các chi tiết liên quan, xác định hư hỏng', 'Sửa chữa hoặc thay chi tiết hỏng', 'Lắp lại và hàn kín vỏ', 'Thử kín vỏ, nạp dầu, hút chân không, nạp gas'] },
    { title: 'Thử cơ block', intro: 'Sắp xếp các bước thử phần cơ.',
      steps: ['Hàn ống công nghệ vào ống đẩy, nối đồng hồ áp suất cao', 'Cấp nguồn, quan sát áp suất đẩy tăng', 'Ngắt nguồn khi kim lên trên 450 psi', 'Bôi xà phòng đầu nối, theo dõi kim có tụt không', 'Hàn kín ống đẩy, nối đồng hồ vào ống hút, thử chân không', 'Thử sức khởi động khi áp suất còn cao'] }
  ];

  DL.register({
    id: 2, ready: true, title: 'Động cơ (block) tủ lạnh', sub: 'Kiểm tra, thay dầu, hư hỏng, thay thế', minutes: 30,
    lead: 'Block là “trái tim” của tủ lạnh. Bài này dạy cách đánh giá block tốt hay xấu qua 3 phần (vỏ, điện, cơ), thay dầu đúng lượng, nhận biết 7 hiện tượng hỏng và chọn block thay thế.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
