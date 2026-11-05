import { PRODUCTS, FLYERS, NEWS } from "./data.js";

const DATA = { products: PRODUCTS, flyers: FLYERS, news: NEWS };
const DB = {
  products: ['san_pham', 'id,slug,ten,anh', (r) => ({ id: r.slug, name: r.ten, img: r.anh, href: `chi-tiet.html?t=san_pham&id=${r.id}`, cta: 'Xem chi tiết' })],
  news: ['kien_thuc', 'id,ten,anh,mo_ta', (r) => ({ name: r.ten, img: r.anh, desc: r.mo_ta, href: `chi-tiet.html?t=kien_thuc&id=${r.id}`, cta: 'Đọc tiếp' })],
};

export async function items(key) {
  if (DB[key]) {
    try {
      const [table, cols, map] = DB[key];
      const { Supabase } = await import('./supabase.js');
      const { data } = await Supabase.from(table).select(cols).eq('hien', true).order('thu_tu').order('created_at');
      if (data?.length) return data.map(map);
    } catch {}
  }
  return DATA[key];
}