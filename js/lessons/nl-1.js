/* NGUYÊN LÝ LÀM LẠNH — BÀI 1: NGUYÊN LÝ LÀM LẠNH (biên soạn từ docs/nguyen_ly_lam_lanh/Bai_1.txt)
   Thiết kế trực quan: mỗi khái niệm đi kèm một hình động có thể bấm/điều khiển. */
(function () {
  const { $, $$ } = DL, U = DL.ui;
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  const DEV = {
    all: ['Cả vòng tuần hoàn', 'Gas đi một vòng kín: <b>máy nén → ngưng tụ → tiết lưu → bay hơi → về máy nén</b>. Vòng tròn rỗng là gas ở thể hơi, chấm đặc là gas ở thể lỏng. Chọn từng thiết bị để xem nó làm gì.', '', ''],
    comp: ['① Máy nén', 'Hút hơi môi chất <b>áp suất thấp, nhiệt độ thấp</b> từ thiết bị bay hơi, nén lên <b>áp suất cao, nhiệt độ cao</b> rồi đẩy vào thiết bị ngưng tụ. Đồng thời tuần hoàn môi chất và giữ áp suất sôi ổn định.', 'Vào: hơi p thấp, t thấp → Ra: hơi p cao, t cao', 'Quá trình 4 → 1: hút và nén'],
    cond: ['② Thiết bị ngưng tụ', 'Hơi áp suất cao <b>tỏa nhiệt</b> ra môi trường làm mát và ngưng tụ từ hơi thành lỏng. Nhiệt tỏa ra (Q<sub>k</sub>) có thể tận dụng để sưởi ấm.', 'Vào: hơi p cao, t cao → Ra: lỏng p cao', 'Quá trình 1 → 2: tỏa nhiệt, ngưng tụ'],
    exp: ['③ Thiết bị tiết lưu', 'Tiết diện nhỏ, trở lực lớn nên <b>tạo chênh lệch áp suất</b>: trước tiết lưu là áp suất cao (p<sub>k</sub>), sau tiết lưu là áp suất thấp (p<sub>0</sub>). Điều chỉnh lưu lượng môi chất vào dàn bay hơi.', 'Vào: lỏng p cao → Ra: lỏng p thấp', 'Quá trình 2 → 3: tiết lưu, hạ áp'],
    evap: ['④ Thiết bị bay hơi', 'Lỏng ở áp suất thấp <b>sôi ở nhiệt độ thấp</b>, thu nhiệt (Q<sub>0</sub>) của sản phẩm hoặc môi trường cần làm lạnh → sản phẩm mất nhiệt nên lạnh đi. Hơi tạo ra lại được máy nén hút về.', 'Vào: lỏng p thấp → Ra: hơi p thấp, t thấp', 'Quá trình 3 → 4: thu nhiệt, bay hơi']
  };

  /* Hạt chạy theo đường dẫn; mỗi "trạng thái" là một vòng tròn có độ mờ đổi theo vị trí (chuyển màu mượt, không dùng CSS var trong animate). */
  const flow = (pid, n, dur, bps, states) => Array.from({ length: n }, (_, i) => {
    const b = (-dur * i / n).toFixed(2) + 's';
    return `<g><animateMotion dur="${dur}s" begin="${b}" repeatCount="indefinite"><mpath href="#${pid}"/></animateMotion>${states.map(s =>
      `<circle class="${s.c}" r="${s.r || 5}" opacity="0"><animate attributeName="opacity" dur="${dur}s" begin="${b}" repeatCount="indefinite" keyTimes="${bps.join(';')}" values="${s.w.join(';')}"/></circle>`).join('')}</g>`;
  }).join('');

  /* ---------- hình ba cách truyền nhiệt ---------- */
  const svgCond = () => `<svg viewBox="0 0 240 150" role="img" aria-label="Thanh kim loại nóng dần từ đầu có lửa, đoạn tay cầm tre nóng chậm hơn">
    <text x="4" y="104" font-size="30">🔥</text>
    ${Array.from({ length: 8 }, (_, i) => `<rect class="nl1-seg ${i > 5 ? 'w' : 'm'}" style="animation-delay:${(i * .5).toFixed(1)}s" x="${36 + i * 25}" y="52" width="24" height="26" rx="3"/>`).join('')}
    <path d="M36 52H236" class="nl1-edge"/><path d="M36 78H236" class="nl1-edge"/>
    <text class="nl1-s" x="36" y="108">Kim loại: nhanh</text>
    <text class="nl1-s" x="236" y="132" text-anchor="end">Tay cầm tre: chậm</text>
    <path d="M186 86V120" class="nl1-edge" stroke-dasharray="3 3"/>
    <text class="nl1-t" x="36" y="34">Nóng →  →  → lạnh</text></svg>`;

  const svgConv = () => `<svg viewBox="0 0 240 150" role="img" aria-label="Nước nóng nổi lên bên phải, nước nguội chìm xuống bên trái, tạo vòng tuần hoàn">
    <path id="nl1cv" d="M160 108V58Q160 48 150 48H90Q80 48 80 58V108Q80 116 90 116H150Q160 116 160 108Z" fill="none"/>
    <path d="M50 30V112Q50 128 66 128H174Q190 128 190 112V30" class="nl1-pot"/>
    <path d="M52 40H188V112Q188 126 174 126H66Q52 126 52 112Z" class="nl1-water"/>
    ${flow('nl1cv', 7, 6, [0, .2, .45, .7, 1], [{ c: 'nl1-p-hot', r: 5, w: [1, 1, 0, 0, 1] }, { c: 'nl1-p-cold', r: 5, w: [0, 0, 1, 1, 0] }])}
    <text x="100" y="146" font-size="22">🔥</text><text x="132" y="146" font-size="22">🔥</text>
    <text class="nl1-s" x="196" y="84">nóng ↑</text><text class="nl1-s" x="6" y="84">↓ nguội</text></svg>`;

  const svgRad = () => `<svg viewBox="0 0 240 150" role="img" aria-label="Tia bức xạ từ đèn sưởi truyền tới người ở xa, không cần chạm">
    <text x="6" y="58" font-size="36">🔥</text>
    ${[0, 1, 2].map(i => `<path class="nl1-ray" style="animation-delay:${i * .25}s" d="M56 ${52 + i * 18}q22 -12 44 0t44 0t44 0"/>`).join('')}
    <text x="196" y="82" font-size="40">🧑</text>
    <text class="nl1-s" x="6" y="130">Không cần chạm vào</text>
    <text class="nl1-s" x="6" y="146">Vật hấp thụ tia → thành nhiệt</text></svg>`;

  const HEAT = [
    ['Dẫn nhiệt', svgCond(), 'Các vật <b>tiếp xúc trực tiếp</b>, chủ yếu ở thể <b>rắn</b>.', 'Cán thìa kim loại nóng lên khi xào nấu. Kim loại (vàng, bạc, nhôm, đồng, sắt) dẫn nhiệt tốt; tre, nhựa dẫn kém nên làm tay cầm.'],
    ['Đối lưu nhiệt', svgConv(), 'Các khối <b>chất lỏng hoặc chất khí dịch chuyển</b> mang nhiệt từ vùng này sang vùng khác.', 'Nước sôi tuần hoàn trong nồi. Ngồi trước quạt thấy mát vì quạt đưa khí nóng quanh người đi. Dàn ngưng tụ có quạt là <b>đối lưu cưỡng bức</b>.'],
    ['Bức xạ nhiệt', svgRad(), 'Truyền nhiệt bằng <b>tia bức xạ</b>; vật hấp thụ tia rồi biến thành nhiệt.', 'Ngồi cạnh đám cháy thấy nóng dù không chạm. Ứng dụng: đèn sưởi, quạt sưởi.']
  ];

  /* ---------- sơ đồ vòng tuần hoàn ---------- */
  function svgCycle() {
    const bps = [0, .17, .33, .49, .51, .67, .83, .956, 1];
    const st = [
      { c: 'nl1-p-hg', r: 6, w: [1, 1, 0, 0, 0, 0, 0, 0, 1] },
      { c: 'nl1-p-hl', r: 4.5, w: [0, 0, 1, 1, 0, 0, 0, 0, 0] },
      { c: 'nl1-p-cl', r: 4.5, w: [0, 0, 0, 0, 1, 1, 0, 0, 0] },
      { c: 'nl1-p-cg', r: 6, w: [0, 0, 0, 0, 0, 0, 1, 1, 0] }
    ];
    const arrows = (xs, y1, y2, cls) => xs.map(x => `<path class="nl1-q ${cls}" d="M${x} ${y1}V${y2}" marker-end="url(#nl1ar${cls})"/>`).join('');
    return `<svg viewBox="0 0 680 390" role="img" aria-label="Vòng tuần hoàn gas: máy nén, ngưng tụ, tiết lưu, bay hơi">
    <defs>
      <linearGradient id="nl1gC" gradientUnits="userSpaceOnUse" x1="410" x2="230" y1="0" y2="0"><stop offset="0" style="stop-color:var(--hot)"/><stop offset="1" style="stop-color:var(--warm)"/></linearGradient>
      <linearGradient id="nl1gE" gradientUnits="userSpaceOnUse" x1="230" x2="410" y1="0" y2="0"><stop offset="0" style="stop-color:var(--cold)"/><stop offset="1" style="stop-color:var(--cold-l)"/></linearGradient>
      <marker id="nl1arhot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--hot)"/></marker>
      <marker id="nl1arcold" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--cold)"/></marker>
    </defs>
    <rect x="196" y="6" width="248" height="150" rx="14" class="nl1-zone hz"/><text class="nl1-s" x="206" y="24">Phòng</text>
    <rect x="196" y="228" width="248" height="156" rx="14" class="nl1-zone cz"/><text class="nl1-s" x="206" y="376">Buồng lạnh</text>
    <g class="nl1-pipes" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M530 190V85H410" stroke="var(--hot)"/><path d="M230 85H110V190" stroke="var(--warm)"/>
      <path d="M110 190V295H230" stroke="var(--cold)"/><path d="M410 295H530V190" stroke="var(--cold-l)"/></g>
    <path id="nl1loop" d="M530 190V85H110V295H530V190" fill="none"/>

    <g class="dev" data-k="cond"><rect x="226" y="48" width="188" height="74" rx="10" class="nl1-box"/>
      <path d="M410 85L395 63L371 107L347 63L323 107L299 63L275 107L251 63L230 85" fill="none" stroke="url(#nl1gC)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
      <text class="nl1-t" x="320" y="144" text-anchor="middle">② Ngưng tụ</text>
      ${arrows([300, 330, 360], 46, 20, 'hot')}<text class="nl1-q-t hot" x="376" y="36">Q<tspan font-size="10" dy="3">k</tspan><tspan dy="-3"> tỏa ra</tspan></text></g>
    <g class="dev" data-k="evap"><rect x="226" y="258" width="188" height="74" rx="10" class="nl1-box"/>
      <path d="M230 295L245 273L269 317L293 273L317 317L341 273L365 317L389 273L410 295" fill="none" stroke="url(#nl1gE)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
      <text class="nl1-t" x="320" y="248" text-anchor="middle">④ Bay hơi</text>
      ${arrows([300, 330, 360], 366, 338, 'cold')}<text class="nl1-q-t cold" x="376" y="358">Q<tspan font-size="10" dy="3">0</tspan><tspan dy="-3"> thu vào</tspan></text></g>
    <g class="dev" data-k="exp"><path d="M94 166H126L117 183V197L126 214H94L103 197V183Z" class="nl1-box" stroke-linejoin="round"/>
      <text class="nl1-t" x="136" y="194">③ Tiết lưu</text></g>
    <g class="dev" data-k="comp"><circle cx="530" cy="190" r="30" class="nl1-box"/>
      <g stroke="var(--ink)" stroke-width="3" stroke-linecap="round"><path d="M530 168V212M508 190H552"/>
        <animateTransform attributeName="transform" type="rotate" from="0 530 190" to="360 530 190" dur="3s" repeatCount="indefinite"/></g>
      <circle cx="530" cy="190" r="5" fill="var(--ink)"/>
      <text class="nl1-t" x="496" y="195" text-anchor="end">① Máy nén</text></g>

    <text class="nl1-s tag" x="98" y="138" text-anchor="end">lỏng, p cao</text><text class="nl1-s tag" x="98" y="252" text-anchor="end">lỏng, p thấp</text>
    <text class="nl1-s tag" x="548" y="130">hơi, p cao, t cao</text><text class="nl1-s tag" x="548" y="262">hơi, p thấp, t thấp</text>
    ${flow('nl1loop', 11, 16, bps, st)}
  </svg>`;
  }

  const svgPH = () => `<svg viewBox="0 0 280 212" role="img" aria-label="Đồ thị p-h đơn giản của chu trình, đánh số 1 đến 4">
    <path d="M30 8V182H272" class="nl1-axis"/><text class="nl1-s" x="14" y="16">p</text><text class="nl1-s" x="262" y="198">h</text>
    <path d="M40 175C45 90 90 40 125 40C160 40 190 100 205 175" class="nl1-dome"/>
    <path d="M30 75H270M30 150H270" class="nl1-grid"/><text class="nl1-s" x="6" y="79">p<tspan font-size="9" dy="3">k</tspan></text><text class="nl1-s" x="6" y="154">p<tspan font-size="9" dy="3">0</tspan></text>
    <path class="ph" data-k="comp" d="M198 150L235 75" stroke="var(--hot)"/><path class="ph" data-k="cond" d="M235 75H66" stroke="var(--warm)"/>
    <path class="ph" data-k="exp" d="M66 75V150" stroke="var(--cold)"/><path class="ph" data-k="evap" d="M66 150H198" stroke="var(--cold-l)"/>
    ${[[1, 235, 75, 8, -8], [2, 66, 75, -8, -8], [3, 66, 150, -8, 16], [4, 198, 150, 8, 16]].map(p => `<circle cx="${p[1]}" cy="${p[2]}" r="4.5" fill="var(--ink)"/><text class="nl1-t" x="${p[1] + p[3]}" y="${p[2] + p[4]}" text-anchor="middle">${p[0]}</text>`).join('')}
  </svg>`;

  /* ---------- hình thí nghiệm sôi / ngưng tụ ---------- */
  const svgBoil = () => `<svg id="bsvg" viewBox="0 0 380 250" role="img" aria-label="Hộp chứa gas có pít-tông; hạt gas chuyển giữa thể lỏng và thể hơi">
    <defs><marker id="nl1arb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker></defs>
    <rect x="40" y="30" width="180" height="180" class="nl1-vessel"/>
    <rect id="bLiq" x="41" y="150" width="178" height="59" class="nl1-liq"/>
    <g id="bPart"></g>
    <g id="bPist"><rect x="42" y="30" width="176" height="9" rx="2" class="nl1-pist"/><path d="M130 30V6M110 6H150" class="nl1-axis" stroke-width="5" stroke-linecap="round"/></g>
    <rect x="40" y="30" width="180" height="180" fill="none" class="nl1-vesselb"/>
    <text class="nl1-s" x="130" y="232" text-anchor="middle">Bình kín chứa gas</text>
    <g id="oObj"><rect x="262" y="70" width="104" height="100" rx="12" class="nl1-obj"/><rect id="oHot" x="262" y="70" width="104" height="100" rx="12" fill="var(--hot-tint)" opacity="0"/><rect id="oCold" x="262" y="70" width="104" height="100" rx="12" fill="var(--cold-tint)" opacity="0"/>
      <rect x="262" y="70" width="104" height="100" rx="12" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <text class="nl1-s" x="314" y="96" text-anchor="middle" id="oName">Vật xung quanh</text>
      <text class="nl1-big" x="314" y="140" text-anchor="middle" id="oTemp">30 °C</text></g>
    <path id="bAin" d="M258 120H226" stroke="var(--ink)" stroke-width="4" fill="none" marker-end="url(#nl1arb)" opacity="0"/>
    <path id="bAout" d="M226 120H258" stroke="var(--ink)" stroke-width="4" fill="none" marker-end="url(#nl1arb)" opacity="0"/>
    <text class="nl1-t" id="bAtxt" x="242" y="108" text-anchor="middle"></text>
  </svg>`;

  function learn() {
    return `
<div class="nl1-idea">
  <p class="nl1-idea-t">Máy lạnh không “sinh ra lạnh”. Nó <b>lấy nhiệt</b> ở chỗ cần lạnh rồi <b>vứt nhiệt</b> ra chỗ khác.</p>
  <div class="nl1-flow" aria-label="Nhiệt đi từ buồng lạnh, qua gas, ra ngoài phòng">
    <div class="nl1-fb cold"><b>Buồng lạnh</b><span>mất nhiệt → lạnh đi</span></div><i aria-hidden="true">→</i>
    <div class="nl1-fb mid"><b>Gas trong ống</b><span>chở nhiệt đi</span></div><i aria-hidden="true">→</i>
    <div class="nl1-fb hot"><b>Ngoài phòng</b><span>nhận nhiệt → ấm lên</span></div>
  </div>
</div>

<section class="sec" id="s-heat" data-toc="1 · Truyền nhiệt">
  <div class="sec-n">Phần 1</div><h2>Nhiệt chạy từ nóng sang lạnh</h2>
  <p><b>Truyền nhiệt</b> là trao đổi nhiệt giữa các vật có nhiệt độ khác nhau. Nhiệt <b>chỉ chạy từ nơi nóng sang nơi lạnh</b>, đến khi hai vật <b>cân bằng nhiệt</b> thì dừng. Có 3 cách:</p>
  <div class="nl1-3">${HEAT.map(h => `<article class="nl1-card"><div class="nl1-fig">${h[1]}</div><h3>${h[0]}</h3><p class="nl1-def">${h[2]}</p><p class="nl1-ex">${h[3]}</p></article>`).join('')}</div>
  <div class="stage nl1-lab" style="padding:16px">
    <h3>Thử: thả đá vào cốc trà nóng</h3>
    <p class="muted" style="margin:0 0 10px">Trà mất nhiệt nên nguội, đá nhận nhiệt nên ấm. Đây cũng chính là cách vật được “làm lạnh”.</p>
    <div class="nl1-tea"><svg viewBox="0 0 330 190" role="img" aria-label="Cốc trà và đồ thị nhiệt độ trà và đá tiến về cân bằng">
      <defs><clipPath id="nl1gl"><path d="M28 34H112L102 164Q101 172 93 172H47Q39 172 38 164Z"/></clipPath></defs>
      <g clip-path="url(#nl1gl)"><rect x="20" y="52" width="100" height="130" fill="var(--cold-tint)"/><rect id="gTea" x="20" y="52" width="100" height="130" fill="var(--hot)" opacity=".85"/></g>
      <path d="M28 34H112L102 164Q101 172 93 172H47Q39 172 38 164Z" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
      <g id="gIce" style="transition:transform .6s"><rect x="50" y="62" width="26" height="26" rx="5" class="nl1-ice"/><rect x="72" y="76" width="22" height="22" rx="4" class="nl1-ice" transform="rotate(12 83 87)"/></g>
      <text class="nl1-s" x="70" y="188" text-anchor="middle">Cốc trà</text>
      <path d="M160 14V150H320" class="nl1-axis"/><text class="nl1-s" x="164" y="12">°C</text><text class="nl1-s" x="318" y="166" text-anchor="end">thời gian →</text>
      <path d="M160 82H320" class="nl1-grid"/><text class="nl1-s" x="156" y="86" text-anchor="end">30</text>
      <text class="nl1-s" x="156" y="30" text-anchor="end">60</text><text class="nl1-s" x="156" y="150" text-anchor="end">0</text>
      <polyline id="lTea" fill="none" stroke="var(--hot)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
      <polyline id="lIce" fill="none" stroke="var(--cold)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
      <text class="nl1-t" id="tTea" x="316" y="30" text-anchor="end" fill="var(--hot)" style="fill:var(--hot)"></text>
      <text class="nl1-t" id="tIce" x="316" y="140" text-anchor="end" style="fill:var(--cold)"></text></svg></div>
    <div class="row" style="margin-top:8px"><button class="btn pri sm" id="iceGo">🧊 Thả đá</button><button class="btn sm" id="iceRst">Làm lại</button><span class="muted" style="font-size:13px">(giả sử lượng trà và đá bằng nhau nên cân bằng ở 30 °C)</span></div>
    <div class="verdict" id="iceV" style="margin-top:10px"></div></div>
</section>

<section class="sec" id="s-def" data-toc="2 · Làm lạnh">
  <div class="sec-n">Phần 2</div><h2>Làm lạnh là làm vật mất nhiệt</h2>
  <p><b>Làm lạnh</b> là làm giảm và giữ nhiệt độ của một vật <b>thấp hơn môi trường xung quanh</b>. Muốn vậy, vật phải <b>mất nhiệt</b> cho một chỗ trung gian lạnh hơn.</p>
  <div class="grid2">
    <div class="panel nl1-nat"><div class="nl1-em" aria-hidden="true">⛰️🧊</div><h3>Làm lạnh tự nhiên</h3><p style="margin:0">Cất băng đá mùa đông trong hang sâu; ngâm chai nước trong giếng khơi. Không tốn năng lượng nhưng khó chủ động và không lạnh sâu.</p></div>
    <div class="panel warm nl1-art"><div class="nl1-em" aria-hidden="true">🔌❄️</div><h3>Làm lạnh nhân tạo</h3><p style="margin:0">Tốn một dạng năng lượng khác (điện): tủ lạnh, điều hòa, máy làm kem, máy làm đá…</p></div>
  </div>
  <h3 style="margin-top:22px">Các phương pháp nhân tạo</h3>
  <ul class="nl1-methods" aria-label="Các phương pháp làm lạnh nhân tạo">
    <li class="star"><b>Bay hơi chất lỏng</b><span>máy nén hơi: tủ lạnh, điều hòa. Lạnh sâu nhất, hiệu quả cao.</span></li>
    <li class="small"><b>Hiệu ứng nhiệt điện</b><span>chỉ ở thiết bị nhỏ (tủ mini khách sạn, bình nước nóng lạnh), năng suất thấp.</span></li>
    <li><b>Hòa trộn lạnh</b></li><li><b>Giãn nở có sinh ngoại công</b></li><li><b>Tiết lưu không sinh công</b></li><li><b>Giãn nở trong ống xoáy</b></li><li><b>Khử từ đoạn nhiệt</b></li><li><b>Hóa lỏng / thăng hoa vật rắn</b></li>
  </ul>
  <div class="callout mem"><span class="ic">💡</span><div><b class="t">Bài này (và cả khóa) học phương pháp nào?</b><p>Bay hơi chất lỏng bằng máy nén hơi, vì đây là cách đang chạy trong tủ lạnh, điều hòa và kho lạnh.</p></div></div>
</section>

<section class="sec" id="s-boil" data-toc="3 · Sôi và ngưng tụ">
  <div class="sec-n">Phần 3</div><h2>Vì sao bay hơi lại sinh ra lạnh?</h2>
  <p>Chất lỏng muốn <b>sôi (bay hơi)</b> phải <b>hút nhiệt</b>. Hút từ đâu? Từ vật xung quanh, nên vật đó nguội đi. Cồn hay xăng dính tay thấy mát cũng vì vậy. Ngược lại, hơi muốn <b>ngưng tụ</b> phải <b>nén lên áp suất cao</b> và <b>tỏa nhiệt</b>.</p>
  <div class="stage nl1-lab" style="padding:16px">
    <div class="row" role="group" aria-label="Chế độ thí nghiệm"><button class="btn pri sm" id="bBoil" aria-pressed="false">🔥 Cho sôi</button><button class="btn sm" id="bCond" aria-pressed="false">⬇ Nén và làm mát</button><button class="btn sm" id="bRst">Làm lại</button></div>
    <div class="nl1-split2"><div>${svgBoil()}</div>
      <div class="panel" aria-live="polite" id="bInfo"><h3 id="bH">Chọn một chế độ</h3><p id="bP" style="margin:0"></p></div></div>
    <div class="nl1-legend"><span><i class="liq"></i> phân tử gas ở thể lỏng</span><span><i class="gas"></i> phân tử gas ở thể hơi</span></div>
  </div>
  <div class="grid2" style="margin-top:16px">
    <div class="panel hotc"><h3>Ngưng tụ (hơi → lỏng)</h3><p style="margin:0">Cần <b>hai điều kiện</b>: ① nén lên <b>áp suất cao</b>; ② <b>tỏa nhiệt</b> ra môi trường. Ví dụ: hơi nước đọng trên vung nồi, sương đọng ngoài cốc trà đá.</p></div>
    <div class="panel"><h3>Sôi / bay hơi (lỏng → hơi)</h3><p style="margin:0">Phải <b>thu nhiệt</b> của môi trường. Gas sôi ở nhiệt độ thấp nên hút nhiệt rất nhanh, tạo ra lạnh.</p></div>
  </div>
  <div class="callout danger"><span class="ic">⚠️</span><div><b class="t">An toàn</b><p>Không để gas lỏng hay CO₂ lỏng (bình chữa cháy) dính vào da hoặc cầm vào loa phun: lỏng sôi rất nhanh, hút nhiệt của tay gây <b>bỏng lạnh</b>.</p></div></div>
</section>

<section class="sec" id="s-cycle" data-toc="4 · Vòng tuần hoàn">
  <div class="sec-n">Phần 4</div><h2>Vòng tuần hoàn kín của gas</h2>
  <p>Để không hao hụt môi chất, hệ thống là <b>một vòng kín</b> với 4 thiết bị. Mỗi thiết bị tạo một điều kiện ở phần 3: <b>tiết lưu</b> hạ áp để gas <b>sôi</b> ở bay hơi (thu nhiệt, sinh lạnh); <b>máy nén</b> nén lên áp cao để gas <b>ngưng tụ</b> ở ngưng tụ (tỏa nhiệt).</p>
  <div class="stage nl1-cyc" id="cycBox" data-sel="all">
    <div class="row nl1-bar"><div id="dTabs" style="flex:1"></div><button class="btn sm" id="cycPlay" aria-pressed="true">⏸ Dừng</button></div>
    <div class="nl1-split"><div class="nl1-cycsvg"><div class="nl1-scroll">${svgCycle()}</div><p class="nl1-swipe muted">Vuốt ngang để xem hết sơ đồ ↔</p></div>
      <div class="nl1-phbox">${svgPH()}<p class="muted" style="font-size:13px;margin:4px 0 0">Đồ thị p–h (sơ đồ minh họa), đánh số theo bài giảng: <b>4→1</b> nén, <b>1→2</b> ngưng tụ, <b>2→3</b> tiết lưu, <b>3→4</b> bay hơi.</p></div></div>
    <div class="nl1-legend"><span><i class="liq"></i> gas thể lỏng</span><span><i class="gas"></i> gas thể hơi</span><span class="muted">Bấm vào thiết bị trên hình để xem chi tiết</span></div>
    <article class="panel" id="dPanel" aria-live="polite"></article>
  </div>
  <p style="margin-top:14px">p<sub>k</sub>, t<sub>k</sub> là áp suất, nhiệt độ ở dàn ngưng tụ (cao); p<sub>0</sub>, t<sub>0</sub> ở dàn bay hơi (thấp). Q<sub>k</sub> là nhiệt tỏa ra ở ngưng tụ, Q<sub>0</sub> là nhiệt thu vào ở bay hơi.</p>
  <div class="callout"><span class="ic">🔧</span><div><b class="t">Ba điều kiện để hệ thống có lạnh</b><p>① Có đủ 4 thiết bị chính (và thiết bị phụ) nối bằng ống kín. ② Được <b>nạp đủ gas</b>. ③ <b>Máy nén hoạt động</b>.</p></div></div>
</section>

<section class="sec" id="s-recap" data-toc="5 · Tóm tắt">
  <div class="sec-n">Phần 5</div><h2>Tóm tắt bài — 6 điều cần nhớ</h2>
  <ol class="steps recap">
    <li class="done"><div><b>Ba cách truyền nhiệt: dẫn nhiệt, đối lưu, bức xạ.</b></div></li>
    <li class="done"><div><b>Nhiệt chỉ truyền từ cao sang thấp, đến khi cân bằng.</b></div></li>
    <li class="done"><div><b>Làm lạnh = làm vật mất nhiệt; phổ biến nhất là bay hơi chất lỏng.</b></div></li>
    <li class="done"><div><b>Ngưng tụ: nén áp cao + tỏa nhiệt. Sôi: thu nhiệt.</b></div></li>
    <li class="done"><div><b>4 thiết bị: máy nén → ngưng tụ → tiết lưu → bay hơi.</b></div></li>
    <li class="done"><div><b>Tiết lưu tạo chênh áp để gas sôi ở nhiệt độ thấp tại dàn bay hơi.</b></div></li>
  </ol>
  <div class="row" style="margin-top:22px"><a class="btn pri" href="#/nguyen-ly/1/flashcard" style="text-decoration:none;display:inline-flex;align-items:center">Sang ôn luyện: Flashcard →</a></div>
</section>`;
  }

  /* ---------- thí nghiệm thả đá ---------- */
  function mountIce(root) {
    let tea = 60, ice = 0, tm, hist = [[60, 0]];
    const MAXN = 48, X = i => 160 + i / MAXN * 160, Y = t => 150 - t / 60 * 120;
    const pts = k => hist.map((h, i) => `${X(i).toFixed(1)},${Y(h[k]).toFixed(1)}`).join(' ');
    const draw = () => {
      $('#lTea', root).setAttribute('points', pts(0)); $('#lIce', root).setAttribute('points', pts(1));
      $('#gTea', root).setAttribute('opacity', (.2 + .75 * (tea - 30) / 30).toFixed(2)); $('#gTea', root).style.fill = tea > 40 ? 'var(--hot)' : 'var(--warm)';
      $('#tTea', root).textContent = 'Trà ' + tea.toFixed(0) + ' °C'; $('#tIce', root).textContent = 'Đá ' + ice.toFixed(0) + ' °C';
      const eq = Math.abs(tea - ice) < 1, v = $('#iceV', root);
      v.className = 'verdict ' + (eq ? 'ok' : '');
      v.textContent = eq ? 'Cân bằng nhiệt: hai vật cùng nhiệt độ, không còn truyền nhiệt. Trà đã nguội đi (mất nhiệt) còn đá nóng lên.' : tea === 60 && ice === 0 ? 'Trà nóng hơn đá nên nhiệt truyền từ trà sang đá.' : 'Trà mất nhiệt (lạnh dần), đá nhận nhiệt (ấm dần)…';
    };
    const step = () => { const d = (tea - ice) * .12; tea -= d; ice += d; if (tea - ice < 1) { tea = ice = (tea + ice) / 2; clearInterval(tm); } hist.push([tea, ice]); if (hist.length > MAXN + 1) hist.shift(); draw(); };
    $('#iceGo', root).onclick = () => {
      clearInterval(tm);
      if (RM) { while (tea - ice >= 1) { const d = (tea - ice) * .12; tea -= d; ice += d; hist.push([tea, ice]); } tea = ice = (tea + ice) / 2; hist.push([tea, ice]); hist = hist.slice(-MAXN - 1); draw(); return; }
      tm = setInterval(() => { if (!document.body.contains($('#iceV', root))) { clearInterval(tm); return; } step(); }, 120);
    };
    $('#iceRst', root).onclick = () => { clearInterval(tm); tea = 60; ice = 0; hist = [[60, 0]]; draw(); };
    draw();
  }

  /* ---------- thí nghiệm sôi / ngưng tụ ---------- */
  function mountBoil(root) {
    const g = $('#bPart', root), N = 30, x0 = 40, x1 = 220, yB = 210;
    const P = Array.from({ length: N }, (_, i) => {
      const el = document.createElementNS(NS, 'circle'); el.setAttribute('r', 5); g.appendChild(el);
      const hx = x0 + 16 + (i % 7) * 24, hy = yB - 12 - Math.floor(i / 7) * 14;
      return { el, hx, hy, x: hx, y: hy, vx: 0, vy: 0, gas: false, ph: Math.random() * 6 };
    });
    let f = 0, T = 30, mode = 'idle', py = 30, last = 0, raf = 0, vis = true;
    const TXT = {
      idle: ['Chọn một chế độ', 'Bấm <b>Cho sôi</b> để xem lỏng hóa hơi, rồi <b>Nén và làm mát</b> để xem hơi trở lại thành lỏng.'],
      boil: ['Sôi: lỏng → hơi, phải hút nhiệt', 'Hạt gas lấy năng lượng từ vật xung quanh để bứt ra thành hơi. Vật mất nhiệt nên <b>nguội đi</b>. Đây là chỗ sinh ra lạnh, và là việc của <b>thiết bị bay hơi</b>.'],
      cond: ['Ngưng tụ: hơi → lỏng, phải nén và tỏa nhiệt', 'Pít-tông nén hơi lên <b>áp suất cao</b>, hơi <b>tỏa nhiệt</b> ra ngoài nên chậm lại và dồn thành lỏng. Môi trường <b>ấm lên</b>. Đây là việc của <b>máy nén và thiết bị ngưng tụ</b>.'],
      none: ['Chưa có hơi để ngưng tụ', 'Hãy bấm <b>Cho sôi</b> trước để tạo hơi.']
    };
    const info = k => { $('#bH', root).textContent = TXT[k][0]; $('#bP', root).innerHTML = TXT[k][1]; };
    const lay = () => {
      const nGas = Math.round(f * N);
      P.forEach((p, i) => {
        const gas = i >= N - nGas;
        if (gas && !p.gas) { const a = Math.random() * 6.28, s = 55 + Math.random() * 35; p.vx = Math.cos(a) * s; p.vy = -Math.abs(Math.sin(a)) * s - 30; p.el.setAttribute('class', 'nl1-gas'); }
        if (!gas && p.gas) p.el.setAttribute('class', 'nl1-lq');
        p.gas = gas; if (!p.el.getAttribute('class')) p.el.setAttribute('class', gas ? 'nl1-gas' : 'nl1-lq');
      });
    };
    const render = (t, dt) => {
      const top = py + 9 + 6, sp = mode === 'cond' ? .55 : 1;
      P.forEach((p, i) => {
        if (p.gas) {
          p.x += p.vx * dt * sp; p.y += p.vy * dt * sp;
          if (p.x < x0 + 6) { p.x = x0 + 6; p.vx = Math.abs(p.vx); } if (p.x > x1 - 6) { p.x = x1 - 6; p.vx = -Math.abs(p.vx); }
          if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy); } if (p.y > yB - 6) { p.y = yB - 6; p.vy = -Math.abs(p.vy); }
        } else { p.x += (p.hx + Math.sin(t * 3 + p.ph) * 2 - p.x) * Math.min(1, dt * 6); p.y += (p.hy + Math.cos(t * 3.3 + p.ph) * 2 - p.y) * Math.min(1, dt * 6); }
        p.el.setAttribute('cx', p.x.toFixed(1)); p.el.setAttribute('cy', p.y.toFixed(1));
      });
      const h = 6 + 56 * (1 - f); $('#bLiq', root).setAttribute('y', yB - h); $('#bLiq', root).setAttribute('height', h);
      $('#bPist', root).setAttribute('transform', `translate(0 ${(py - 30).toFixed(1)})`);
      $('#oTemp', root).textContent = T.toFixed(0) + ' °C';
      $('#oCold', root).setAttribute('opacity', Math.max(0, Math.min(1, (28 - T) / 20)).toFixed(2));
      $('#oHot', root).setAttribute('opacity', Math.max(0, Math.min(1, (T - 32) / 14)).toFixed(2));
    };
    const arrows = () => {
      $('#bAin', root).setAttribute('opacity', mode === 'boil' ? 1 : 0); $('#bAout', root).setAttribute('opacity', mode === 'cond' ? 1 : 0);
      $('#bAtxt', root).textContent = mode === 'boil' ? 'nhiệt vào' : mode === 'cond' ? 'nhiệt ra' : '';
      $('#oName', root).textContent = mode === 'cond' ? 'Môi trường' : 'Vật xung quanh';
      $('#bBoil', root).setAttribute('aria-pressed', mode === 'boil'); $('#bCond', root).setAttribute('aria-pressed', mode === 'cond');
      $('#bBoil', root).classList.toggle('pri', mode === 'boil'); $('#bCond', root).classList.toggle('pri', mode === 'cond');
    };
    const adv = dt => {
      if (mode === 'boil') { f = Math.min(1, f + .2 * dt); T = Math.max(6, T - 2.6 * dt); py += (30 - py) * Math.min(1, dt * 4); }
      if (mode === 'cond') { f = Math.max(0, f - .24 * dt); T = Math.min(46, T + 2.6 * dt); py += (92 - py) * Math.min(1, dt * 4); }
    };
    const tick = ts => {
      raf = 0; if (!root.isConnected && !document.body.contains($('#bsvg', root))) return;
      const t = ts / 1000, dt = Math.min(.05, last ? t - last : .016); last = t;
      adv(dt); lay(); render(t, dt); if (vis) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!RM && !raf && vis) { last = 0; raf = requestAnimationFrame(tick); } };
    const settle = () => { for (let k = 0; k < 400; k++) adv(.05); lay(); P.forEach(p => { if (p.gas) { p.x = x0 + 10 + Math.random() * 160; p.y = 50 + Math.random() * 150; } }); render(0, .016); };
    const setMode = m => {
      if (m === 'cond' && f < .05) { mode = 'idle'; arrows(); info('none'); return; }
      mode = m; arrows(); info(m); if (RM) { settle(); } else start();
    };
    $('#bBoil', root).onclick = () => setMode('boil'); $('#bCond', root).onclick = () => setMode('cond');
    $('#bRst', root).onclick = () => { mode = 'idle'; f = 0; T = 30; py = 30; P.forEach(p => { p.gas = false; p.x = p.hx; p.y = p.hy; p.el.setAttribute('class', 'nl1-lq'); }); arrows(); info('idle'); render(0, .016); };
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) start(); }).observe($('#bsvg', root));
    lay(); arrows(); info('idle'); render(0, .016); start();
  }

  /* ---------- vòng tuần hoàn ---------- */
  function mountCycle(root) {
    const box = $('#cycBox', root), svg = $('svg', $('.nl1-cycsvg', box)), play = $('#cycPlay', root);
    let on = !RM;
    const apply = () => { try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) { } play.textContent = on ? '⏸ Dừng' : '▶ Chạy'; play.setAttribute('aria-pressed', on); };
    play.onclick = () => { on = !on; apply(); };
    U.tabset($('#dTabs', root), Object.entries(DEV).map(([id, p], i) => ({ id, n: id === 'all' ? '↻' : i, name: id === 'all' ? 'Cả vòng' : p[0].replace(/^[①②③④] /, '') })), id => {
      box.dataset.sel = id; const d = DEV[id];
      $('#dPanel', root).innerHTML = `<h3>${d[0]}</h3><p>${d[1]}</p>${d[2] ? `<p style="margin:0"><b>${d[2]}</b><br><span class="muted">${d[3]}</span></p>` : ''}`;
    });
    $$('.dev', box).forEach(el => { el.style.cursor = 'pointer'; el.addEventListener('click', () => { const b = $(`.tab[data-id="${el.dataset.k}"]`, root); if (b) b.click(); }); });
    $$('.ph', box).forEach(el => el.addEventListener('click', () => { const b = $(`.tab[data-id="${el.dataset.k}"]`, root); if (b) b.click(); }));
    apply();
  }

  function mount(root) {
    mountIce(root); mountBoil(root); mountCycle(root);
  }

  const flashcards = [
    { f: 'Nhiệt truyền theo chiều nào?', b: 'Chỉ từ nơi nhiệt độ cao sang nơi nhiệt độ thấp.', tag: 'Truyền nhiệt' },
    { f: 'Khi nào ngừng truyền nhiệt?', b: 'Khi hai vật cân bằng nhiệt (cùng nhiệt độ).', tag: 'Truyền nhiệt' },
    { f: 'Ba phương pháp truyền nhiệt?', b: 'Dẫn nhiệt, đối lưu nhiệt, bức xạ nhiệt.', tag: 'Truyền nhiệt' },
    { f: 'Dẫn nhiệt là gì?', b: 'Truyền nhiệt khi các vật tiếp xúc trực tiếp, chủ yếu ở thể rắn.', tag: 'Truyền nhiệt' },
    { f: 'Đối lưu nhiệt là gì?', b: 'Truyền nhiệt nhờ dịch chuyển khối chất lỏng hoặc khí giữa các vùng nhiệt độ khác nhau.', tag: 'Truyền nhiệt' },
    { f: 'Bức xạ nhiệt là gì?', b: 'Truyền nhiệt bằng tia bức xạ mang năng lượng; vật hấp thụ tia rồi thành nhiệt.', tag: 'Truyền nhiệt' },
    { f: 'Vì sao ngồi trước quạt thấy mát?', b: 'Quạt đối lưu, đưa khí nóng quanh người đi, đưa khí mát tới, tăng chênh lệch nhiệt độ.', tag: 'Truyền nhiệt' },
    { f: 'Định nghĩa làm lạnh?', b: 'Làm giảm và duy trì nhiệt độ của vật trong giới hạn thấp hơn nhiệt độ môi trường.', tag: 'Làm lạnh' },
    { f: 'Làm lạnh tự nhiên ví dụ?', b: 'Cất băng đá trong hang sâu; ngâm chai nước trong giếng khơi.', tag: 'Làm lạnh' },
    { f: 'Làm lạnh nhân tạo ví dụ?', b: 'Tủ lạnh, điều hòa, máy làm kem, máy làm đá (tốn năng lượng điện).', tag: 'Làm lạnh' },
    { f: 'Phương pháp làm lạnh nhân tạo hiệu quả nhất?', b: 'Bay hơi chất lỏng (máy nén hơi).', tag: 'Làm lạnh' },
    { f: 'Hiệu ứng nhiệt điện dùng ở đâu?', b: 'Thiết bị nhỏ: tủ lạnh mini khách sạn, bình nước nóng lạnh; năng suất thấp.', tag: 'Làm lạnh' },
    { f: 'Hai điều kiện để ngưng tụ?', b: 'Nén lên áp suất cao và tỏa nhiệt ra môi trường.', tag: 'Ngưng tụ / sôi' },
    { f: 'Điều kiện để sôi?', b: 'Phải thu nhiệt của môi trường xung quanh.', tag: 'Ngưng tụ / sôi' },
    { f: 'Vì sao cồn, xăng dính tay thấy mát?', b: 'Sôi ở nhiệt độ thấp, hút nhiệt ngay tại da.', tag: 'Ngưng tụ / sôi' },
    { f: 'Vì sao không để gas lỏng dính tay?', b: 'Sôi hút nhiệt rất nhanh gây bỏng lạnh.', tag: 'An toàn' },
    { f: '4 thiết bị chính của hệ thống lạnh?', b: 'Máy nén, thiết bị ngưng tụ, thiết bị tiết lưu, thiết bị bay hơi.', tag: 'Sơ đồ khối' },
    { f: 'Máy nén làm nhiệm vụ gì?', b: 'Hút hơi p thấp, t thấp; nén thành p cao, t cao đẩy sang ngưng tụ.', tag: 'Sơ đồ khối' },
    { f: 'Thiết bị ngưng tụ làm gì?', b: 'Cho hơi tỏa nhiệt ra môi trường, ngưng thành lỏng.', tag: 'Sơ đồ khối' },
    { f: 'Thiết bị tiết lưu làm gì?', b: 'Tạo chênh lệch áp suất (hạ áp) và điều chỉnh lưu lượng môi chất.', tag: 'Sơ đồ khối' },
    { f: 'Thiết bị bay hơi làm gì?', b: 'Lỏng sôi ở t thấp, thu nhiệt của sản phẩm/môi trường làm nó lạnh.', tag: 'Sơ đồ khối' },
    { f: 'p<sub>k</sub> và p<sub>0</sub> là gì?', b: 'p<sub>k</sub>: áp suất cao ở ngưng tụ; p<sub>0</sub>: áp suất thấp ở bay hơi.', tag: 'Sơ đồ khối' },
    { f: 'Q<sub>k</sub> và Q<sub>0</sub> là gì?', b: 'Q<sub>k</sub>: nhiệt tỏa ra ở ngưng tụ; Q<sub>0</sub>: nhiệt thu vào ở bay hơi.', tag: 'Sơ đồ khối' },
    { f: 'Ba điều kiện để hệ thống có lạnh?', b: 'Đủ thiết bị nối kín; nạp đủ gas; máy nén hoạt động.', tag: 'Sơ đồ khối' }
  ];
  const Q = (q, o, a, why) => ({ q, o, a, why });
  const quiz = [
    Q('Nhiệt truyền theo chiều nào?', ['Từ cao sang thấp', 'Từ thấp sang cao', 'Cả hai chiều như nhau', 'Không có chiều'], 0, 'Nhiệt chỉ truyền từ nơi nhiệt độ cao sang nơi thấp.'),
    Q('Khi hai vật cân bằng nhiệt thì?', ['Không còn truyền nhiệt', 'Truyền nhiệt mạnh hơn', 'Vật nóng nóng thêm', 'Vật lạnh lạnh thêm'], 0, 'Cùng nhiệt độ thì ngừng truyền.'),
    Q('Cán thìa kim loại nóng lên là do?', ['Dẫn nhiệt', 'Đối lưu', 'Bức xạ', 'Ngưng tụ'], 0, 'Tiếp xúc trực tiếp ở thể rắn.'),
    Q('Nước sôi tuần hoàn trong nồi là?', ['Đối lưu', 'Dẫn nhiệt', 'Bức xạ', 'Khử từ'], 0, 'Khối lỏng dịch chuyển.'),
    Q('Ngồi gần đám cháy thấy nóng chủ yếu do?', ['Bức xạ nhiệt', 'Dẫn nhiệt', 'Ngưng tụ', 'Tiết lưu'], 0, 'Tia bức xạ truyền nhiệt qua không khí.'),
    Q('Vật liệu làm tay cầm để tránh nóng nên là?', ['Cách nhiệt (tre, nhựa)', 'Đồng', 'Nhôm', 'Bạc'], 0, 'Kim loại dẫn nhiệt tốt nên không dùng làm tay cầm.'),
    Q('Muốn vật được làm lạnh thì vật đó phải?', ['Mất nhiệt cho môi trường lạnh hơn', 'Nhận nhiệt', 'Được nén', 'Được đun'], 0, 'Làm lạnh là làm vật mất nhiệt.'),
    Q('Cất băng đá trong hang sâu là kiểu làm lạnh?', ['Tự nhiên', 'Nhân tạo bằng máy nén', 'Nhiệt điện', 'Hòa trộn'], 0, 'Không tốn năng lượng nhân tạo.'),
    Q('Phương pháp nhân tạo đạt nhiệt độ thấp nhất, hiệu quả cao?', ['Bay hơi chất lỏng', 'Nhiệt điện', 'Phơi nắng', 'Quạt gió'], 0, 'Dùng máy nén hơi.'),
    Q('Hiệu ứng nhiệt điện thích hợp cho?', ['Thiết bị nhỏ, năng suất thấp', 'Kho lạnh lớn', 'Chiller trung tâm', 'Máy nén công nghiệp'], 0, 'Tủ mini, bình nước nóng lạnh.'),
    Q('Điều kiện ngưng tụ gồm?', ['Áp suất cao và tỏa nhiệt', 'Áp suất thấp và thu nhiệt', 'Áp suất thấp và tỏa nhiệt', 'Chỉ cần thu nhiệt'], 0, 'Nén cao và tỏa nhiệt.'),
    Q('Quá trình sôi cần?', ['Thu nhiệt', 'Tỏa nhiệt', 'Nén áp cao', 'Không cần gì'], 0, 'Sôi phải hấp thụ nhiệt.'),
    Q('Gas lỏng dính tay gây?', ['Bỏng lạnh', 'Bỏng nóng', 'Điện giật', 'Không sao'], 0, 'Sôi nhanh, hút nhiệt của da.'),
    Q('Thứ tự dòng môi chất đúng?', ['Máy nén → ngưng tụ → tiết lưu → bay hơi', 'Máy nén → bay hơi → tiết lưu → ngưng tụ', 'Ngưng tụ → máy nén → tiết lưu → bay hơi', 'Tiết lưu → ngưng tụ → máy nén → bay hơi'], 0, 'Vòng tuần hoàn kín.'),
    Q('Máy nén đẩy vào ngưng tụ hơi ở trạng thái?', ['Áp suất cao, nhiệt độ cao', 'Áp suất thấp, nhiệt độ thấp', 'Áp suất cao, nhiệt độ thấp', 'Thể lỏng'], 0, 'Nén làm tăng p và t.'),
    Q('Thiết bị tiết lưu có tiết diện nhỏ để?', ['Tạo chênh lệch áp suất', 'Tăng nhiệt độ', 'Nén hơi', 'Lọc cặn'], 0, 'Trở lực lớn tạo chênh áp.'),
    Q('Lạnh được tạo ra ở thiết bị nào?', ['Bay hơi', 'Ngưng tụ', 'Máy nén', 'Ống nối'], 0, 'Lỏng sôi thu nhiệt môi trường.'),
    Q('Nhiệt Q<sub>k</sub> tỏa ra ở?', ['Thiết bị ngưng tụ', 'Thiết bị bay hơi', 'Tiết lưu', 'Ống hút'], 0, 'Tỏa nhiệt ở dàn nóng.'),
    Q('p<sub>0</sub> là áp suất ở?', ['Thiết bị bay hơi', 'Thiết bị ngưng tụ', 'Đầu đẩy máy nén', 'Trước tiết lưu'], 0, 'p thấp ở dàn lạnh.'),
    Q('Điều nào KHÔNG phải điều kiện để hệ thống có lạnh?', ['Nạp thật nhiều dầu', 'Nạp đủ gas', 'Máy nén hoạt động', 'Có đủ thiết bị nối kín'], 0, 'Ba điều kiện là thiết bị, gas, máy nén.'),
    Q('Quạt gió ở dàn ngưng tụ tạo ra truyền nhiệt kiểu?', ['Đối lưu cưỡng bức', 'Dẫn nhiệt', 'Bức xạ', 'Đối lưu tự nhiên'], 0, 'Có quạt là cưỡng bức.'),
    Q('Tận dụng nhiệt tỏa ở ngưng tụ có thể để?', ['Sưởi ấm', 'Làm đá', 'Hút chân không', 'Hạ áp suất'], 0, 'Nhiệt tỏa làm tăng nhiệt độ môi trường.')
  ];
  const sort = {
    title: 'Phân loại thiết bị và quá trình',
    buckets: [{ id: 'hot', name: 'Phía áp suất cao (nóng)' }, { id: 'cold', name: 'Phía áp suất thấp (lạnh)' }, { id: 'ht', name: 'Cách truyền nhiệt' }],
    items: [
      { t: 'Đầu đẩy máy nén', b: 'hot' }, { t: 'Thiết bị ngưng tụ', b: 'hot' }, { t: 'Hơi tỏa nhiệt ra môi trường', b: 'hot' },
      { t: 'Thiết bị bay hơi', b: 'cold' }, { t: 'Sau tiết lưu', b: 'cold' }, { t: 'Lỏng sôi thu nhiệt', b: 'cold' },
      { t: 'Thìa kim loại nóng lên', b: 'ht' }, { t: 'Quạt thổi mát người', b: 'ht' }, { t: 'Đèn sưởi ấm', b: 'ht' }
    ]
  };
  const order = [
    { title: 'Vòng tuần hoàn môi chất', intro: 'Sắp xếp theo thứ tự.', steps: ['Máy nén hút hơi áp thấp từ dàn bay hơi', 'Nén thành hơi áp cao, nhiệt độ cao', 'Hơi tỏa nhiệt, ngưng tụ thành lỏng', 'Lỏng đi qua thiết bị tiết lưu, giảm áp', 'Lỏng sôi ở dàn bay hơi, thu nhiệt', 'Hơi lại được máy nén hút về'] },
    { title: 'Làm lạnh vật cần lạnh', intro: 'Từ nhiệt của sản phẩm đến lạnh.', steps: ['Gas lỏng áp thấp vào dàn bay hơi', 'Gas thu nhiệt của sản phẩm để sôi', 'Sản phẩm mất nhiệt', 'Sản phẩm lạnh dần', 'Hơi gas được máy nén hút về'] },
    { title: 'Thả đá vào cốc trà nóng', intro: 'Quá trình truyền nhiệt.', steps: ['Trà nóng hơn đá', 'Nhiệt truyền từ trà sang đá', 'Trà mất nhiệt, nguội dần', 'Đá nhận nhiệt, ấm dần', 'Hai bên cân bằng nhiệt, ngừng truyền'] }
  ];
  DL.register({
    cat: 'nguyen-ly', id: 1, ready: true, title: 'Nguyên lý làm lạnh', sub: 'Truyền nhiệt, làm lạnh, sơ đồ khối 4 thiết bị', minutes: 25,
    lead: 'Nền tảng của mọi hệ thống lạnh: ba cách truyền nhiệt, làm lạnh là gì, vì sao bay hơi chất lỏng sinh ra lạnh và vòng tuần hoàn của 4 thiết bị chính.',
    learn, mount, flashcards, quiz, sort, order
  });
})();
