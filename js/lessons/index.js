/* Danh sách bài chưa làm (chỉ có tiêu đề) để hiện "Sắp có" ở thanh bên và trang chủ.
   Khi làm xong bài N: tạo lesson-N.js với DL.register({id:N, ready:true, ...}) và thêm <script> vào index.html;
   thông tin ở đây sẽ được gộp theo id. Hiện Bài 1–5 đã có đủ nội dung. Thêm bài mới = thêm một dòng vào mảng dưới. */
[
  // { id: 6, title: 'Tên bài', sub: 'Mô tả ngắn', minutes: 20 }
].forEach(l => { if (!DL.lessons.some(x => x.id === l.id)) DL.register(Object.assign({ ready: false }, l)); });
