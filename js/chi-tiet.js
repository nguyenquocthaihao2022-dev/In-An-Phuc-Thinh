import { Supabase as sb } from './supabase.js';

const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const q = new URLSearchParams(location.search), t = q.get('t');

const { data: r } = ['san_pham', 'kien_thuc'].includes(t)
  ? await sb.from(t).select('*').eq('id', q.get('id')).maybeSingle() : {};

if (!r) $('#ct').innerHTML = '<p>Không tìm thấy nội dung.</p>';
else {
  document.title = `${r.ten} – Phúc Thịnh Labels`;
  $('#ct').innerHTML = `<h1>${esc(r.ten)}</h1><img src="${esc(r.anh)}" alt="${esc(r.ten)}">`
    + DOMPurify.sanitize(r.noi_dung || '<p>Nội dung đang được cập nhật.</p>')
    + (t === 'san_pham' ? `<p><a class="btn" href="bao-gia.html?sp=${encodeURIComponent(r.slug)}">Nhận báo giá sản phẩm này</a></p>` : '')
    + `<p><a href="${t === 'san_pham' ? 'index.html#san-pham' : 'tin-tuc.html'}">← Quay lại</a></p>`;
}