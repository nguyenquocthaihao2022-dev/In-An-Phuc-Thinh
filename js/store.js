import { PRODUCTS, FLYERS, NEWS } from './data.js';

const DATA = { products: PRODUCTS, flyers: FLYERS, news: NEWS };
const DB = {
  products: ['san_pham', (r) => ({ id: r.slug, name: r.ten, img: r.anh })],
  news: ['kien_thuc', (r) => ({ name: r.ten, img: r.anh, desc: r.mo_ta })],
};

export async function items(key) {
  if (DB[key]) {
    try {
      const { Supabase } = await import('./supabase.js');
      const { data } = await Supabase.from(DB[key][0]).select('*').eq('hien', true).order('thu_tu').order('created_at');
      if (data?.length) return data.map(DB[key][1]);
    } catch {}
  }
  return DATA[key];
}