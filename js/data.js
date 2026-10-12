// Dữ liệu website: chỉnh sửa thông tin, sản phẩm, bài viết tại đây.
export const SITE = {
  name: 'Phúc Thịnh Labels',
  company: 'CÔNG TY TNHH IN ẤN TEM NHÃN PHÚC THỊNH',
  addr: '22 QL1A, Tân Thới Nhất, Quận 12, TP. Hồ Chí Minh',
  phone: '0917331363', phoneText: '0917 331 363',
  email: 'ngx.thinh2011@gmail.com',
  hours: '08h – 17h30',
  map: 'https://www.google.com/maps?q=10.825998,106.6060612',
};
const I = 'Assets/images/', D = I + 'Danh_Muc_In_An/', T = I + 'An_Pham_To_Roi/', N = I + 'Tin_Tuc/';

export const PRODUCTS = [
  { id: 'tem-nhan', name: 'Tem nhãn – Decal', img: N + 'decal-giay-fasson-30.webp' },
  { id: 'to-roi', name: 'Tờ rơi', img: D + 'an-pham-to-roi-1-1024x1024.webp' },
  { id: 'name-card', name: 'Name card', img: D + 'an-pham-name-card-01-1024x1024.webp' },
  { id: 'catalogue', name: 'Catalogue – Brochure', img: D + 'an-pham-catalogue-1-1024x1024.webp' },
  { id: 'hop-giay', name: 'Hộp giấy', img: D + 'an-pham-hop-giay-1-1024x1024.webp' },
  { id: 'tui-giay', name: 'Túi giấy', img: D + 'an-pham-tui-giay-1-1024x1024.webp' },
  { id: 'phong-bi', name: 'Phong bì', img: I + 'Bao_Gia/bang-bao-gia-in-phong-bi-1-1920x930.webp' },
  { id: 'lich-tet', name: 'Lịch Tết – Bao lì xì', img: N + 'in-lich-tet-31.webp' },
];

// href: trang có sẵn · sp/nd: mở form báo giá với sản phẩm và ghi chú điền sẵn
export const FLYERS = [
  { name: 'Tờ rơi Karaoke', img: T + 'to-roi-karaoke-1.webp', href: 'to-roi-karaoke.html', cta: 'Xem bài viết' },
  { name: 'Tờ rơi Lễ hội', img: T + 'to-roi-le-hoi.webp', sp: 'to-roi', nd: 'Tờ rơi chủ đề lễ hội' },
  { name: 'Tờ rơi Noel', img: T + 'to-roi-noel-1.webp', sp: 'to-roi', nd: 'Tờ rơi chủ đề Noel' },
  { name: 'Tờ rơi Thuốc', img: T + 'to-roi-thuoc-4.webp', sp: 'to-roi', nd: 'Tờ rơi ngành thuốc' },
  { name: 'Tờ rơi Tuyên truyền', img: T + 'to-roi-tuyen-truyen-phong-chong-sot-xuat-huyet-2-1.webp', sp: 'to-roi', nd: 'Tờ rơi tuyên truyền' },
];

export const NEWS = [
  { name: 'Ép kim là gì?', img: N + 'ep-kim-la-gi-11-1920x930.webp', desc: 'Kỹ thuật dùng nhiệt và áp lực ép lớp kim loại mỏng lên giấy, tạo điểm nhấn ánh kim sang trọng cho logo, danh thiếp, vỏ hộp.' },
  { name: 'Decal giấy Fasson', img: N + 'decal-giay-fasson-30.webp', desc: 'Decal tự dính thương hiệu Fasson được dùng nhiều làm tem nhãn nhờ bề mặt in đẹp, dễ dán và có nhiều loại chất liệu.' },
  { name: 'Giấy Duplex là gì?', img: N + 'giay-duplex-la-gi-30.webp', desc: 'Giấy có một mặt trắng, mặt còn lại màu xám, độ cứng tốt, thường dùng làm hộp giấy và bao bì sản phẩm.' },
  { name: 'Lên kế hoạch in lịch Tết', img: N + 'in-lich-tet-31.webp', desc: 'Chọn loại lịch, chất liệu và gia công từ sớm để kịp giao hàng trước Tết, tránh cao điểm đặt in cuối năm.' },
  { name: 'Chuẩn bị file name card', img: N + 'thiet-ke-name-card-30.webp', desc: 'Kích thước phổ biến 90 × 54 mm, chừa bleed 2–3 mm, ảnh 300 dpi và hệ màu CMYK để bản in đúng như thiết kế.' },
  { name: 'Chuẩn bị đặt in tem nhãn', img: N + 'thiet-ke-tem-nhan-30.webp', desc: 'Xác định kích thước, hình dạng bế, chất liệu decal (giấy, nhựa) và thông tin bắt buộc trên nhãn trước khi báo giá.' },
];
