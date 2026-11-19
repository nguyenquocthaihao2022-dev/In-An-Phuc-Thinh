import { Supabase as sb } from './supabase.js';

const $ = (s) => document.querySelector(s);
const FALLBACK = 'Assets/icons/user.png';

const { data: { user } } = await sb.auth.getUser();
if (!user) location.replace('dang-nhap.html');
else {
  const { data: p } = await sb.from('profiles').select('name,phone,address,picture').eq('id', user.id).maybeSingle();
  $('#name').textContent = p?.name || user.email; // chưa có tên thì hiện email
  $('#phone').textContent = p?.phone ?? '';
  $('#address').textContent = p?.address ?? '';
  const pic = $('#pic');
  pic.onerror = () => { pic.onerror = null; pic.src = FALLBACK; };
  pic.src = p?.picture || FALLBACK;
}