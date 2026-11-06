/* MÁY GIẶT — BÀI 11: PAN BỆNH THƯỜNG GẶP & CÁCH SỬA (biên soạn từ docs/may_giat/Bai_11.txt) */
(function () {
  const { $, $$ } = DL, U = DL.ui;

  const TOP = {
    t1: ['Nước vào liên tục, không ngắt khi đủ mực', ['Van cấp nước hỏng (màng, lõi kẹt)', 'Bo mạch luôn cấp điện cho van (bóng bán dẫn/ triac chập)'], 'Rút điện mà nước VẪN chảy → hỏng van cấp. Rút điện mà nước ngừng → hỏng bo (triac/ bóng bán dẫn).'],
    t2: ['Nước vào liên tục, không giặt', ['Van xả hút/ van xả kéo luôn có điện hoặc kẹt nấm xả', 'Thùng chứa bị thủng', 'Ống dẫn áp hở/ van áp lực hỏng, bo điều khiển'], 'Nước 2–3 phút phải đầy. Không đầy → tháo tấm tôn sau, kiểm tra van xả (có nguồn cấp liên tục? kẹt vật lạ?). Thổi vào ống dẫn áp: nếu máy nhận → ống hở hoặc van áp lực hỏng; nếu không → thay van áp lực mới; vẫn không → kiểm tra tín hiệu cảm biến và IC giải mã phao.'],
    t3: ['Giặt bình thường, vắt không xả nước', ['Hỏng van xả', 'Ống thoát để quá cao hoặc tắc', 'Hỏng bo (không cấp điện cho van xả)', 'Kẹt nấm xả, tắc cổ thoát'], 'Chuyển sang xả/ vắt, nhìn tấm tôn sau: van xả có làm việc không? Có → kiểm tra cơ khí, ống; không → đo điện áp tại giắc, rồi tới bo.'],
    t4: ['Nước đủ mức nhưng không giặt, không vắt', ['Động cơ hỏng hoặc kẹt', 'Trục trung gian dưới hỏng, tuột dây curoa', 'Công tắc cửa hỏng', 'Van áp lực hỏng', 'Bo mạch hỏng'], 'Dùng ampe kìm: có dòng mà không quay → cơ khí (tuột curoa, kẹt động cơ, trục trung gian). Không có dòng → kiểm tra nguồn tại giắc động cơ (C → chạy/ đề): có điện → hỏng động cơ; không có → bo. Trước khi đào sâu bo, kiểm tra công tắc cửa và van áp lực (tín hiệu báo về).'],
    t5: ['Xả được nước nhưng không vắt', ['Kẹt thùng', 'Hỏng ly hợp: lò xo, vòng bi một chiều, mỏ cò, bánh răng khế, van xả kéo không hết', 'Bo, van áp lực hoặc công tắc cửa không cho phép chạy'], 'Có dòng mà lồng không quay: kẹt thùng hoặc ly hợp. Vắt chỉ mâm quay, lồng đứng → lò xo ly hợp/ mỏ cò/ van xả kéo thiếu hành trình. Không có dòng → bo, van áp lực (sai số 5 – 10%) hoặc công tắc cửa.'],
    t6: ['Cấp đủ nước nhưng không giặt, vắt bình thường', ['Hỏng mâm giặt/ bánh răng số', 'Hỏng trục trung gian dưới', 'Bo hỏng làm động cơ chỉ quay một chiều', 'Van áp lực cơ'], 'Nếu có vết dầu dưới máy → bánh răng số/ trục trung gian. Mâm quay một chiều → hỏng triac một phía của bo, đồ không được đảo.'],
    t7: ['Giặt bình thường, VẮT thì kêu/ rung', ['Kẹt thùng chứa/ lồng', 'Hỏng 2 vòng bi', 'Đồ giặt không đều', 'Mất vành nước muối', 'Lò xo treo hỏng'], 'Kê lại cho cân (chân đỡ), kiểm tra mực nước phẳng trên bề mặt lồng; giặt cùng loại vải; kiểm tra vành nước muối (ốc lỏng, rò), 4 lò xo treo.'],
    t8: ['Hoạt động nhưng khi GIẶT thì kêu', ['Bánh răng số mòn/ kẹt', 'Hỏng trục trung gian', 'Dây curoa trơn (kêu mỗi lần đảo chiều)'], 'Ban đầu giặt tốt rồi mới kêu → bộ số. Đa phần kèm mất dầu.']
  };
  // bổ sung theo tài liệu tham khảo
  TOP.t1[1].push('Phao cảm biến mực nước (van áp lực) hỏng: máy tự cấp nước dù không cần');
  TOP.t1[2] += ' Nếu van cấp và bo đều tốt, kiểm tra phao cảm biến mực nước; phao hỏng thì thay mới.';
  TOP.t2[1].push('Lồng giặt bẩn bít vị trí thông hơi bên trong');
  TOP.t2[2] += ' Ống dẫn hơi xì: quấn kín bằng keo điện, hoặc cắt nối lại bằng ống 6, hoặc thay ống mới. Lồng bẩn: tháo lồng, vệ sinh bên trong, nhất là chỗ nối với ống hơi.';
  TOP.t5[2] += ' Máy xả hết nước mà không vắt: kiểm tra công tắc cửa trước để loại trừ, rồi mới tháo bo.';
  TOP.t7[1].push('Ly hợp (nhông) hao mòn', 'Máy đặt không cân bằng (nền dốc)');
  TOP.t7[2] += ' Ly hợp mòn thì thay ly hợp. Nền dốc thì chỉnh chân cho máy cân bằng và chắc chắn. Ty treo lồng hỏng thì thay mới.';
  TOP.t9 = ['Cấp nước tràn lồng, hoặc quá ít/ quá nhiều so với lượng đồ', ['Ống dẫn hơi áp lực bị hở, xì hơi (hay gặp)', 'Phao cảm biến mực nước hỏng', 'Mạch cảm biến mực nước trên bo có vấn đề', 'Lồng giặt bẩn bít vị trí thông hơi bên trong', 'Chế độ tự động cấp sai nước dù chọn mực nước thủ công vẫn bình thường: hỏng mạch cân đồ'], 'Kiểm tra ống dẫn hơi: xì thì quấn kín bằng keo điện, cắt nối lại bằng ống 6 hoặc thay ống mới. Phao: đo điện áp có thay đổi khi có nước và khi thổi hơi vào ống không; thường thay mới cho chắc chắn. Ống và phao đều bình thường: tháo lồng vệ sinh bên trong, rồi tháo bo kiểm tra mạch cảm biến mực nước. Chọn mực nước thủ công bình thường mà chế độ tự động sai → hỏng mạch cân đồ trên bo, tháo bo sửa.'];
  TOP.t10 = ['Vắt lúc có lúc không (chạy không tải vẫn vắt bình thường)', ['Tụ động cơ yếu', 'Dây curoa bị chùng', 'Động cơ yếu (cuộn dây có vấn đề)', 'Mạch công tắc cửa chập chờn'], 'Đo điện dung tụ, thay nếu giá trị giảm. Căng lại dây curoa (không căng quá mức). Tháo dây curoa, bật chế độ vắt: động cơ quay mà dùng vật hãm lại được thì động cơ yếu, thay động cơ. Kiểm tra công tắc cửa trước khi tháo bo.'];
  TOP.t11 = ['Bấm nguồn máy không lên', ['Không có điện vào máy (nguồn vào không có)', 'Khối nguồn trên bo bị lỗi'], 'Dùng đồng hồ đo điện áp cấp vào xem có 220 V không. Có 220 V mà bấm vẫn không lên: mở bo, đo hai chân nguồn vào trên bo; có 220 V mà không lên thì tháo bo đem sửa khối nguồn.'];
  TOP.t12 = ['Mâm giặt quay trái, quay phải rồi dừng, không cấp nước', ['Mạch hồi tiếp cấp nước trên bo bị hỏng'], 'Tháo bo ra sửa, kiểm tra vị trí hồi tiếp trên mô tơ.'];
  const FRONT = {
    f1: ['Đèn nguồn sáng nhưng máy không làm việc', ['Cửa chưa khóa (nguồn cấp trước đi qua công tắc cơ)', 'Công tắc cửa hỏng', 'Chưa cấp nước: hết nước, van cấp hỏng', 'Bo mạch'], 'Bấm Start xem đèn khóa cửa có sáng không. Mở cửa kiểm tra công tắc. Thử chuyển sang chế độ vắt: nếu vắt bình thường → lỗi nằm ở cấp nước.'],
    f2: ['Máy hoạt động nhưng kêu', ['Kẹt thùng chứa/ vật lạ', 'Hỏng 2 vòng bi, trục cơ mòn/ cong', 'Động cơ hỏng vòng bi'], 'Tháo dây curoa: hết kêu → phần cơ; vẫn kêu → động cơ. Sửa như quy trình bảo dưỡng thay vòng bi.'],
    f3: ['Nước cấp liên tục nhưng không giặt', ['Ống xả để quá thấp (bơm hút ra liên tục, dưới 60 – 90 cm)', 'Bơm xả luôn làm việc (bo)', 'Thùng thủng', 'Van áp lực'], 'Ống thoát phải cao hơn sàn khoảng <b>60 – 90 cm</b> để không bị xi-phông. Ống ren mềm dài, kéo xa cũng gây xi-phông, nước chảy ra liên tục.'],
    f4: ['Giặt tốt nhưng không vắt', ['Bơm xả hỏng/ tắc lọc', 'Động cơ vắt hỏng (2-in-1, vành góp)', 'Van áp lực sai số', 'Ống xả'], 'Nếu vắt được thì chắc chắn van áp lực tốt. Mở nắp trước, vệ sinh cốc lọc bơm xả (có thể vướng đồng xu, xơ).'],
    f5: ['VẮT thì kêu', ['Mất cân bằng, quá tải', 'Khối bê tông lỏng', 'Đồ không đều'], 'Máy phải đủ nặng (đối trọng) mới êm. Vắt tốc độ rất cao (~1000 – 1200 vòng/ phút) nên rất nhạy với mất cân bằng.'],
    f6: ['Giặt nước lạnh được, nước nóng thì không', ['Sợi đốt đứt', 'Khống chế nhiệt độ hỏng'], 'Máy chỉ hoạt động khi nước đã đủ ấm theo chương trình → kiểm tra sợi đốt (x1 Ω / x10k) và cảm biến nhiệt.']
  };
  const FLOW = [
    ['Quan sát hiện tượng & phân loại: cấp nước, xả, giặt, vắt, kêu', 'Xác định máy đang ở bước nào của chu trình.'],
    ['Đo dòng điện động cơ (ampe kìm)', 'Có dòng/ không có dòng → cơ khí hay điện.'],
    ['Kiểm tra tín hiệu báo về: công tắc cửa, van áp lực', 'Dễ thử và hay hỏng; kiểm tra trước khi sửa bo.'],
    ['Kiểm tra nguồn tại giắc phụ tải', 'Có điện mà không chạy → phụ tải hỏng; không có → bo.'],
    ['Kiểm tra cơ khí: dây curoa, trục, bộ số, vòng bi', 'Dựa vào tiếng kêu, vết dầu.'],
    ['Thay linh kiện, chạy thử đủ chu trình', 'Xác nhận hết lỗi.']
  ];

  function learn() {
    return `
<section class="sec" id="s-method" data-toc="1 · Phương pháp">
  <div class="sec-n">Phần 1</div><h2>Phương pháp chẩn đoán</h2>
  <p>Khi máy hư, <b>không đoán mò</b>. Dựa vào chu trình: <b>cấp nước → giặt → xả → vắt</b>, mỗi bước có một bộ phận chịu trách nhiệm. Tìm “bước nào hỏng” sẽ khoanh vùng nguyên nhân.</p>
  <div class="stage mgx-cyc" id="cyc11" aria-label="Chu trình giặt và các bộ phận chịu trách nhiệm"></div>
  <ol class="steps recap">${FLOW.map(f => `<li class="done"><div><b>${f[0]}</b><span>${f[1]}</span></div></li>`).join('')}</ol>
  <div class="callout"><span class="ic">⚡</span><div><b class="t">Mẹo dùng ampe kìm</b><p>Động cơ làm việc thì có dòng; đổi chiều quay vẫn có dòng. <b>Có dòng mà không quay</b> → hỏng cơ khí (tuột curoa, kẹt động cơ, bộ số). <b>Không có dòng</b> → chưa được cấp lệnh: kiểm tra bo, công tắc cửa, van áp lực.</p></div></div>
</section>

<section class="sec" id="s-top" data-toc="2 · Máy cửa trên">
  <div class="sec-n">Phần 2</div><h2>🩺 Máy cửa trên: 12 hiện tượng hay gặp</h2>
  <div id="tTabs"></div><article class="panel" id="tP" aria-live="polite" style="border-left-color:var(--bad)"></article>
</section>

<section class="sec" id="s-sim" data-toc="3 · Thực hành">
  <div class="sec-n">Phần 3</div><h2>🔬 Thực hành: cô lập lỗi cấp nước</h2>
  <p>Máy cấp nước liên tục. Bạn <b>rút điện</b> và quan sát:</p>
  <div class="stage" style="padding:14px"><div class="row"><label>Lỗi thực tế <select id="sf" class="btn sm" style="min-height:36px"><option value="valve">Van cấp hỏng</option><option value="board">Bo (triac/ bóng) chập</option></select></label><button class="btn pri sm" id="sUn">🔌 Rút điện máy</button></div><div id="sO" class="verdict" style="margin-top:12px">Bấm “Rút điện máy” để xem.</div></div>
</section>

<section class="sec" id="s-front" data-toc="4 · Máy cửa trước">
  <div class="sec-n">Phần 4</div><h2>🩺 Máy cửa trước</h2>
  <div id="fTabs"></div><article class="panel warm" id="fP" aria-live="polite"></article>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 7 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Chẩn đoán theo bước chu trình: cấp nước – giặt – xả – vắt.</b></div></li>
    <li class="done"><div><b>Nước vào liên tục: rút điện, vẫn chảy → van; ngừng → bo.</b></div></li>
    <li class="done"><div><b>Vào nước không giặt: van xả luôn mở, thùng thủng, ống áp/ van áp lực.</b></div></li>
    <li class="done"><div><b>Có dòng mà không quay: cơ khí. Không có dòng: bo, công tắc cửa, van áp lực.</b></div></li>
    <li class="done"><div><b>Giặt tốt, vắt không được: ly hợp (lò xo, vòng bi, mỏ cò, van xả kéo).</b></div></li>
    <li class="done"><div><b>Vắt kêu/ rung: cân bằng, vòng bi, vành nước muối, lò xo treo.</b></div></li>
    <li class="done"><div><b>Cửa trước: ống xả cao 60–90 cm; nước nóng không chạy → sợi đốt, khống chế nhiệt.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/may-giat/11/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  function mount(root) {
    const tab = (box, panel, data) => U.tabset($(box, root), Object.entries(data).map(([id, p], i) => ({ id, n: i + 1, name: p[0] })), id => { const f = data[id]; $(panel, root).innerHTML = `<h3>${f[0]}</h3><p><b>Nguyên nhân có thể:</b></p><ul>${f[1].map(x => `<li>${x}</li>`).join('')}</ul><p style="margin:0"><b>Cách kiểm tra:</b> ${f[2]}</p>`; });
    tab('#tTabs', '#tP', TOP); tab('#fTabs', '#fP', FRONT);
    // chu trình → bộ phận → hiện tượng
    const STG = [['⚡', 'Cấp nguồn', ['Nguồn 220 V vào bo', 'Khối nguồn trên bo'], ['t11']], ['💧', 'Cấp nước', ['Van cấp nước', 'Van áp lực (mực nước)', 'Bo mạch'], ['t1', 't9', 't12', 't2']], ['🌀', 'Giặt', ['Động cơ', 'Dây curoa', 'Bộ số, trục trung gian', 'Mâm giặt'], ['t4', 't6', 't8']], ['⬇️', 'Xả nước', ['Van xả', 'Ống xả', 'Nấm xả, cổ thoát'], ['t3', 't2']], ['🌪️', 'Vắt', ['Ly hợp', 'Thùng chứa, vòng bi', 'Lò xo treo, cân bằng'], ['t5', 't7', 't10']]];
    const cy = $('#cyc11', root); let cs = 0;
    const cdraw = () => {
      const g = STG[cs];
      cy.innerHTML = '<p class="muted" style="margin:0 0 8px">Bấm một bước của chu trình để xem bộ phận phụ trách và các hiện tượng thường gặp:</p><div class="mgx-steps" role="group" aria-label="Các bước chu trình">' + STG.map((x, i) => '<button type="button" class="mgx-stp' + (i === cs ? ' on' : '') + '" data-i="' + i + '" aria-pressed="' + (i === cs) + '"><span>' + x[0] + '</span><b>' + (i + 1) + '. ' + x[1] + '</b></button>' + (i < STG.length - 1 ? '<i aria-hidden="true">→</i>' : '')).join('') + '</div>' +
        '<div class="mgx-det"><div><h4>Bộ phận phụ trách</h4><ul>' + g[2].map(p => '<li>' + p + '</li>').join('') + '</ul></div><div><h4>Hiện tượng liên quan (bấm để xem)</h4><div class="mgx-sym">' + g[3].map(t => '<button type="button" class="btn sm" data-t="' + t + '">' + TOP[t][0] + '</button>').join('') + '</div></div></div>';
      $$('.mgx-stp', cy).forEach(b => b.onclick = () => { cs = +b.dataset.i; cdraw(); });
      $$('[data-t]', cy).forEach(b => b.onclick = () => { const tb = $('#tTabs .tab[data-id="' + b.dataset.t + '"]', root); if (tb) { tb.click(); const sec = $('#s-top', root); if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
    };
    cdraw();
    $('#sUn', root).onclick = () => { const v = $('#sf', root).value, o = $('#sO', root); o.className = 'verdict ' + (v === 'valve' ? 'bad' : 'ok'); o.innerHTML = v === 'valve' ? 'Đã rút điện nhưng nước <b>vẫn chảy</b> → <b>hỏng van cấp nước</b> (màng/ lõi kẹt).' : 'Rút điện, nước <b>ngừng</b> → van tốt, lỗi ở <b>bo mạch</b> (bóng bán dẫn/ triac luôn cấp điện cho van).'; };
  }

  const flashcards = [
    { f: 'Bấm nguồn máy không lên: kiểm tra gì trước?', b: 'Điện áp 220 V vào máy. Có 220 V mà vẫn không lên thì sửa khối nguồn trên bo.', tag: 'Cửa trên' },
    { f: 'Máy tự cấp nước dù không cần: nghi gì ngoài van cấp và bo?', b: 'Phao cảm biến mực nước (van áp lực) hỏng.', tag: 'Cửa trên' },
    { f: 'Cấp nước tràn lồng, quá ít hoặc quá nhiều: nguyên nhân hay gặp nhất?', b: 'Ống dẫn hơi áp lực bị hở, xì hơi. Quấn keo điện, nối lại bằng ống 6 hoặc thay ống.', tag: 'Cửa trên' },
    { f: 'Vắt lúc có lúc không, chạy không tải vẫn vắt bình thường: nghi gì?', b: 'Tụ yếu, dây curoa chùng, động cơ yếu, hoặc công tắc cửa chập chờn.', tag: 'Cửa trên' },
    { f: 'Mâm giặt quay trái, phải rồi dừng, không cấp nước: lỗi ở đâu?', b: 'Mạch hồi tiếp cấp nước trên bo bị hỏng.', tag: 'Cửa trên' },
    { f: 'Nước vào liên tục, không ngắt?', b: 'Van cấp hỏng hoặc bo luôn cấp điện.', tag: 'Cửa trên' },
    { f: 'Phân biệt van cấp và bo?', b: 'Rút điện, vẫn chảy → van; ngừng → bo.', tag: 'Cửa trên' },
    { f: 'Nước vào, không giặt?', b: 'Van xả, thùng thủng, ống áp/ van áp lực.', tag: 'Cửa trên' },
    { f: 'Nước phải đầy sau?', b: '2 – 3 phút.', tag: 'Cửa trên' },
    { f: 'Thổi ống dẫn áp để?', b: 'Kiểm tra ống hở hay van áp lực hỏng.', tag: 'Cửa trên' },
    { f: 'Giặt tốt, vắt không xả?', b: 'Van xả, ống cao/ tắc, bo, kẹt nấm.', tag: 'Cửa trên' },
    { f: 'Nước đủ nhưng không giặt không vắt?', b: 'Động cơ, trục dưới, curoa, công tắc cửa, van áp lực, bo.', tag: 'Cửa trên' },
    { f: 'Có dòng mà không quay?', b: 'Cơ khí: tuột curoa, kẹt motor, trục.', tag: 'Chẩn đoán' },
    { f: 'Không có dòng động cơ?', b: 'Bo, công tắc cửa, van áp lực.', tag: 'Chẩn đoán' },
    { f: 'Có điện tại giắc động cơ mà không chạy?', b: 'Động cơ hỏng.', tag: 'Chẩn đoán' },
    { f: 'Không có điện tại giắc?', b: 'Hỏng bo.', tag: 'Chẩn đoán' },
    { f: 'Xả được, không vắt?', b: 'Kẹt thùng, ly hợp, hoặc không cho phép chạy.', tag: 'Cửa trên' },
    { f: 'Vắt chỉ mâm quay, lồng đứng?', b: 'Lò xo ly hợp, mỏ cò, van xả kéo thiếu.', tag: 'Cửa trên' },
    { f: 'Van áp lực điện tử sai số?', b: '5–10%: chạy mà không vắt.', tag: 'Cửa trên' },
    { f: 'Giặt không đảo, vắt bình thường?', b: 'Bo hỏng một phía/ bộ số.', tag: 'Cửa trên' },
    { f: 'Vết dầu dưới máy?', b: 'Bánh răng số / trục trung gian mất dầu.', tag: 'Cửa trên' },
    { f: 'Vắt kêu, giặt bình thường?', b: 'Mất cân bằng, vòng bi, vành nước muối, lò xo.', tag: 'Cửa trên' },
    { f: 'Cách kê cân?', b: 'Nước phẳng trên mặt lồng.', tag: 'Cửa trên' },
    { f: 'Đồ giặt nên?', b: 'Cùng loại vải để đều.', tag: 'Cửa trên' },
    { f: 'Giặt kêu?', b: 'Bánh răng số, trục trung gian.', tag: 'Cửa trên' },
    { f: 'Đảo chiều kêu quỳnh?', b: 'Dây curoa.', tag: 'Cửa trên' },
    { f: 'Cửa trước không làm việc dù đèn nguồn sáng?', b: 'Cửa chưa khóa, công tắc cửa, chưa có nước, bo.', tag: 'Cửa trước' },
    { f: 'Cửa trước kêu: tháo curoa hết kêu?', b: 'Phần cơ (vòng bi, trục, thùng).', tag: 'Cửa trước' },
    { f: 'Ống xả cửa trước cao bao nhiêu?', b: 'Khoảng 60 – 90 cm.', tag: 'Cửa trước' },
    { f: 'Ống xả quá thấp gây?', b: 'Xi-phông: nước chảy liên tục, không giặt.', tag: 'Cửa trước' },
    { f: 'Cửa trước giặt tốt, không vắt?', b: 'Bơm xả, động cơ vắt, van áp lực, ống.', tag: 'Cửa trước' },
    { f: 'Vệ sinh lọc bơm xả ở?', b: 'Nắp phía trước.', tag: 'Cửa trước' },
    { f: 'Nước nóng không chạy, nước lạnh bình thường?', b: 'Sợi đốt hoặc khống chế nhiệt độ.', tag: 'Cửa trước' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Nước vào liên tục, rút điện nước vẫn chảy?', ['Hỏng van cấp', 'Hỏng bo', 'Hỏng bơm', 'Bình thường'], 0, 'Van kẹt mở.'),
    Q('Rút điện nước ngừng chảy?', ['Hỏng bo', 'Hỏng van', 'Hết nước', 'Tốt'], 0, 'Bo luôn cấp điện.'),
    Q('Nước phải đầy sau?', ['2–3 phút', '1 giờ', '10 giây', '30 phút'], 0, 'Bình thường.'),
    Q('Thổi ống dẫn áp để?', ['Thử van áp lực/ ống', 'Làm sạch', 'Xả nước', 'Cấp nước'], 0, 'Chẩn đoán.'),
    Q('Có dòng điện mà không quay?', ['Cơ khí', 'Bo', 'Nguồn', 'Cảm biến'], 0, 'Tuột curoa…'),
    Q('Không có dòng?', ['Không cấp lệnh', 'Cơ khí', 'Thùng bẩn', 'Hết dầu'], 0, 'Bo/cửa/van áp lực.'),
    Q('Có điện tại giắc nhưng không chạy?', ['Động cơ hỏng', 'Bo hỏng', 'Công tắc', 'Van'], 0, 'Phụ tải.'),
    Q('Vắt chỉ mâm quay, lồng đứng?', ['Ly hợp', 'Bo', 'Van cấp', 'Phao'], 0, 'Lò xo, mỏ cò.'),
    Q('Sai số van áp lực 5–10%?', ['Chạy nhưng không vắt', 'Báo lỗi ngay', 'Không ảnh hưởng', 'Cháy máy'], 0, 'Theo bài.'),
    Q('Vết dầu dưới máy?', ['Bộ số mất dầu', 'Nước xả', 'Bột giặt', 'Bình thường'], 0, 'Phốt hỏng.'),
    Q('Vắt kêu, giặt bình thường?', ['Mất cân bằng', 'Bo hỏng', 'Hết nước', 'Van cấp'], 0, 'Kiểm tra cân.'),
    Q('Kê cân: kiểm tra bằng?', ['Nước phẳng trong lồng', 'Mắt thường', 'Nhiệt độ', 'Áp suất'], 0, 'Dễ quan sát.'),
    Q('Đảo chiều kêu “quỳnh” là?', ['Dây curoa', 'Phao', 'Van cấp', 'Bơm'], 0, 'Trơn.'),
    Q('Ống xả cửa trước cao?', ['60–90 cm', '5 cm', '3 m', '0'], 0, 'Chống xi-phông.'),
    Q('Ống xả thấp gây?', ['Nước chảy liên tục', 'Tiết kiệm', 'Không sao', 'Giặt sạch'], 0, 'Xi-phông.'),
    Q('Cửa trước nguồn sáng nhưng không chạy?', ['Chưa khóa cửa', 'Hết bột', 'Quá tải', 'Nước nóng'], 0, 'Công tắc cơ.'),
    Q('Tháo curoa hết kêu?', ['Phần cơ', 'Động cơ', 'Bo', 'Van'], 0, 'Vòng bi, trục.'),
    Q('Cửa trước giặt tốt không vắt có thể do?', ['Bơm xả tắc', 'Sợi đốt', 'Nước lạnh', 'Hết bột'], 0, 'Mở nắp vệ sinh.'),
    Q('Nước nóng không chạy, lạnh bình thường?', ['Sợi đốt/ khống chế nhiệt', 'Bo', 'Bơm', 'Van'], 0, 'Phần nóng.'),
    Q('Van áp lực điện tử còn dùng được nếu?', ['Vắt được bình thường', 'Không vắt', 'Báo lỗi', 'Rò nước'], 0, 'Vắt được là tốt.'),
    Q('Trước khi đào sâu bo, kiểm tra?', ['Công tắc cửa, van áp lực', 'Tụ', 'Biến áp', 'Quạt'], 0, 'Dễ thử.'),
    Q('Giặt không đảo?', ['Bo hỏng 1 phía', 'Van cấp', 'Bơm', 'Phao'], 0, 'Quay 1 chiều.'),
    Q('Bước đầu chẩn đoán?', ['Xác định bước hỏng trong chu trình', 'Thay bo', 'Thay động cơ', 'Đổ keo'], 0, 'Khoanh vùng.'),
    Q('Cuối cùng cần?', ['Chạy thử đủ chu trình', 'Cất dụng cụ', 'Bỏ máy', 'Thay hết'], 0, 'Xác nhận.')
  ];
  const sort = {
    title: 'Hiện tượng thuộc nhóm lỗi nào?',
    buckets: [{ id: 'water', name: 'Cấp/ xả nước' }, { id: 'mech', name: 'Cơ khí' }, { id: 'elec', name: 'Điện/ điều khiển' }],
    items: [
      { t: 'Nước vào liên tục', b: 'water' }, { t: 'Không xả nước khi vắt', b: 'water' }, { t: 'Ống xả đặt quá thấp', b: 'water' },
      { t: 'Tuột dây curoa', b: 'mech' }, { t: 'Hỏng vòng bi, kêu', b: 'mech' }, { t: 'Lò xo ly hợp hỏng', b: 'mech' }, { t: 'Mất dầu bộ số', b: 'mech' },
      { t: 'Triac chập → van luôn có điện', b: 'elec' }, { t: 'Công tắc cửa hỏng', b: 'elec' }, { t: 'Van áp lực sai số', b: 'elec' }, { t: 'Sợi đốt đứt', b: 'elec' }
    ]
  };
  const order = [
    { title: 'Máy có nguồn nhưng không giặt không vắt', intro: 'Sắp xếp các bước.', steps: ['Xác định nước đã đủ mức', 'Kẹp ampe kìm vào dây động cơ', 'Có dòng không quay → kiểm tra cơ khí', 'Không dòng → kiểm tra công tắc cửa và van áp lực', 'Đo điện tại giắc động cơ', 'Có điện → thay động cơ; không → sửa bo'] },
    { title: 'Phân biệt van cấp và bo', intro: 'Nước vào liên tục.', steps: ['Quan sát nước vào không ngắt', 'Rút điện máy', 'Nước vẫn chảy → thay van cấp', 'Nước ngừng → vấn đề bo', 'Kiểm tra triac/ bóng bán dẫn', 'Thay linh kiện, chạy thử'] },
    { title: 'Máy vắt kêu rung', intro: 'Quy trình xử lý.', steps: ['Dừng máy, kiểm tra đồ giặt phân bố', 'Kiểm tra chân đỡ và cân bằng', 'Kiểm tra vành nước muối', 'Kiểm tra 4 lò xo treo', 'Kiểm tra vòng bi', 'Chạy thử'] }
  ];
  DL.register({
    cat: 'may-giat', id: 11, ready: true, title: 'Pan bệnh thường gặp và cách sửa', sub: 'Cửa trên, cửa trước, chẩn đoán theo chu trình', minutes: 30,
    lead: 'Tổng hợp các hiện tượng hư hỏng hay gặp ở máy giặt cửa trên và cửa trước và quy trình khoanh vùng: từ hiện tượng → bước hỏng trong chu trình → phép đo → bộ phận.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
