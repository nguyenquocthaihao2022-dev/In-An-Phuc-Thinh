import { SITE as S } from './data.js';
import { items } from './store.js';
import { Supabase } from './supabase.js';

const f = document.getElementById('quote'), msg = document.getElementById('msg'), q = new URLSearchParams(location.search);
const say = (t, cls = '') => { msg.textContent = t; msg.className = cls; };
const PRODUCTS = await items('products');

f.sp.innerHTML = '<option value="">Chọn loại ấn phẩm…</option>' + [...PRODUCTS.map((p) => p.name), 'Khác'].map((n) => `<option>${n}</option>`).join('');
f.sp.value = PRODUCTS.find((p) => p.id === q.get('sp'))?.name ?? '';
f.nd.value = q.get('nd') ?? '';
try { const m = JSON.parse(localStorage.pt_kh || '{}'); f.ten.value = m.ten ?? ''; f.sdt.value = m.sdt ?? ''; } catch {}

document.getElementById('side').innerHTML = `<img src="Assets/icons/Logo Phuc Thinh.jpg" alt="${S.name}"><h3>Liên hệ trực tiếp</h3>
<p>⏰ Giờ làm việc: ${S.hours}</p><p>📞 <a href="tel:${S.phone}"><b>${S.phoneText}</b></a></p>
<p>✉️ <a href="mailto:${S.email}">${S.email}</a></p><p>📍 <a href="${S.map}" target="_blank" rel="noopener">${S.addr}</a></p>
<a class="btn alt" href="https://zalo.me/${S.phone}" target="_blank" rel="noopener">Chat Zalo</a>`;

f.onsubmit = async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f)), btn = f.querySelector('button');
  btn.disabled = true; say('Đang gửi…');
  const information = [`Sản phẩm: ${d.sp}`, d.sl && `Số lượng: ${d.sl}`, d.nd].filter(Boolean).join('\n');
  const { error } = await Supabase.from('lien_he').insert({ name: d.ten, phone_number: d.sdt, information });
  btn.disabled = false;
  if (error) { console.error(error); return say(`Chưa gửi được. Vui lòng gọi ${S.phoneText} để được hỗ trợ ngay.`, 'err'); }
  try { localStorage.pt_kh = JSON.stringify({ ten: d.ten, sdt: d.sdt }); } catch {}
  f.reset(); f.nd.value = '';
  say(`Đã nhận yêu cầu! Chúng tôi sẽ gọi lại cho bạn sớm nhất (giờ làm việc ${S.hours}).`, 'ok');
};
