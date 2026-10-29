import { Supabase as sb } from './supabase.js';

const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const TABLES = {
  lien_he: { label: 'Liên hệ', cols: ['name', 'phone_number', 'information'],
    fields: [['name', 'Họ tên'], ['phone_number', 'Số điện thoại'], ['information', 'Nội dung', 'textarea']] },
  san_pham: { label: 'Sản phẩm', cols: ['ten', 'slug', 'thu_tu', 'hien'],
    fields: [['ten', 'Tên'], ['slug', 'Mã (không dấu, vd: tem-nhan)'], ['anh', 'Đường dẫn ảnh'], ['thu_tu', 'Thứ tự', 'number'], ['hien', 'Hiển thị', 'checkbox']] },
  kien_thuc: { label: 'Kiến thức', cols: ['ten', 'mo_ta', 'hien'],
    fields: [['ten', 'Tiêu đề'], ['anh', 'Đường dẫn ảnh'], ['mo_ta', 'Mô tả', 'textarea'], ['thu_tu', 'Thứ tự', 'number'], ['hien', 'Hiển thị', 'checkbox']] },
};
let tab = 'lien_he', editing = null;

const form = () => {
  $('#f').innerHTML = TABLES[tab].fields.map(([k, l, type = 'text']) =>
    type === 'textarea' ? `<label>${l}<textarea name="${k}" rows="4"></textarea></label>`
    : type === 'checkbox' ? `<label><input type="checkbox" name="${k}" checked>${l}</label>`
    : `<label>${l}<input name="${k}" type="${type}"${type === 'number' ? ' value="0"' : ''}></label>`).join('')
    + '<button class="btn">Lưu</button> <button type="button" class="btn alt" id="cancel">Hủy</button>';
  $('#cancel').onclick = () => { editing = null; form(); };
};

const render = async () => {
  const t = TABLES[tab];
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.t === tab));
  const { data = [], error } = await sb.from(tab).select('*').order('created_at', { ascending: false });
  $('#list').innerHTML = error ? `<p id="msg" class="err">${esc(error.message)}</p>` :
    `<table class="tbl"><tr>${t.cols.map((c) => `<th>${c}</th>`).join('')}<th></th></tr>${data.map((r) =>
      `<tr>${t.cols.map((c) => `<td>${esc(r[c])}</td>`).join('')}<td><button data-e="${r.id}">Sửa</button> <button data-d="${r.id}">Xóa</button></td></tr>`).join('')}</table>`;
};

$('#tabs').innerHTML = Object.entries(TABLES).map(([k, t]) => `<button data-t="${k}">${t.label}</button>`).join('');
$('#tabs').onclick = (e) => { if (e.target.dataset.t) { tab = e.target.dataset.t; editing = null; form(); render(); } };

$('#list').onclick = async (e) => {
  const { e: eid, d: did } = e.target.dataset;
  if (did && confirm('Xóa mục này?')) { await sb.from(tab).delete().eq('id', did); render(); }
  if (eid) {
    const { data: row } = await sb.from(tab).select('*').eq('id', eid).single();
    editing = eid;
    TABLES[tab].fields.forEach(([k, , type]) => {
      const el = $('#f').elements[k];
      type === 'checkbox' ? (el.checked = row[k]) : (el.value = row[k] ?? '');
    });
    scrollTo({ top: 0, behavior: 'smooth' });
  }
};

$('#f').onsubmit = async (e) => {
  e.preventDefault();
  const row = {};
  TABLES[tab].fields.forEach(([k, , type]) => {
    const el = e.target.elements[k];
    row[k] = type === 'checkbox' ? el.checked : type === 'number' ? Number(el.value) : el.value;
  });
  const { error } = await (editing ? sb.from(tab).update(row).eq('id', editing) : sb.from(tab).insert(row));
  if (error) return alert(error.message);
  editing = null; form(); render();
};

// Chỉ để ẩn/hiện giao diện; bảo mật thật nằm ở RLS.
await sb.auth.refreshSession();
const { data: { user } } = await sb.auth.getUser();
if (user?.app_metadata?.app_role === 'admin') { form(); render(); }
else document.querySelector('main').innerHTML = '<div class="wrap sec"><p>Bạn không có quyền truy cập trang này.</p></div>';