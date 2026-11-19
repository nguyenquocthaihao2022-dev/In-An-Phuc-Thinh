import { Supabase as sb } from './supabase.js';
import { upload } from './anh.js';

const $ = (s) => document.querySelector(s);
const FALLBACK = 'Assets/icons/user.png';
const say = (form, t, cls = '') => { const p = form.querySelector('.msg'); p.textContent = t; p.className = 'msg ' + cls; };
const vi = (m) => /different from the old/i.test(m) ? 'Mật khẩu mới phải khác mật khẩu cũ.'
  : /at least/i.test(m) ? 'Mật khẩu cần tối thiểu 6 ký tự.'
  : /reauth/i.test(m) ? 'Vì lý do bảo mật, hãy đăng xuất rồi đăng nhập lại trước khi đổi mật khẩu.' : m;
const rm = (url) => { const p = url?.split('/object/public/anh/')[1]; if (p) sb.storage.from('anh').remove([p]); };

const { data: { user } } = await sb.auth.getUser();
if (!user) location.replace('dang-nhap.html');
else {
  const form = $('#info'), pic = $('#pic');
  const { data: p } = await sb.from('profiles').select('name,phone,address,picture').eq('id', user.id).maybeSingle();
  let picture = p?.picture ?? null, newFile = null;

  $('#email').value = user.email;
  ['name', 'phone', 'address'].forEach((k) => (form.elements[k].value = p?.[k] ?? ''));
  pic.onerror = () => { pic.onerror = null; pic.src = FALLBACK; };
  pic.src = picture || FALLBACK;

  $('#pick').onclick = () => $('#file').click();
  $('#file').onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return say(form, 'Vui lòng chọn một tệp ảnh.', 'err');
    newFile = f;
    pic.src = URL.createObjectURL(f); // xem trước, chưa tải lên
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    btn.disabled = true;
    try {
      const old = picture;
      if (newFile) picture = await upload(newFile, `avatar/${user.id}`, 400);
      const { error } = await sb.from('profiles').upsert({
        id: user.id, ...Object.fromEntries(new FormData(form)), picture, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      if (newFile) rm(old); // xóa ảnh cũ trong Storage (bỏ qua nếu là ảnh Google)
      newFile = null;
      try { localStorage.pt_avatar = picture ?? ''; } catch {}
      say(form, 'Đã lưu thông tin.', 'ok');
    } catch (err) {
      say(form, err.message, 'err');
    } finally {
      btn.disabled = false;
    }
  };

  $('#pw').onsubmit = async (e) => {
    e.preventDefault();
    const { password, again } = Object.fromEntries(new FormData(e.target));
    if (password !== again) return say(e.target, 'Hai mật khẩu chưa khớp.', 'err');
    const { error } = await sb.auth.updateUser({ password });
    if (error) return say(e.target, vi(error.message), 'err');
    e.target.reset();
    say(e.target, 'Đã đổi mật khẩu.', 'ok');
  };
}