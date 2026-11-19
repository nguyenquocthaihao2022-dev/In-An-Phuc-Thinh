import { Supabase as sb } from './supabase.js';

const $ = (s) => document.querySelector(s);
const say = (form, t, cls = '') => { const p = form.querySelector('.msg'); p.textContent = t; p.className = 'msg ' + cls; };
const vi = (m) => /different from the old/i.test(m) ? 'Mật khẩu mới phải khác mật khẩu cũ.'
  : /at least/i.test(m) ? 'Mật khẩu cần tối thiểu 6 ký tự.'
  : /reauth/i.test(m) ? 'Vì lý do bảo mật, hãy đăng xuất rồi đăng nhập lại trước khi đổi mật khẩu.' : m;

const { data: { user } } = await sb.auth.getUser();
if (!user) location.replace('dang-nhap.html');
else {
  const m = user.user_metadata ?? {};
  $('#email').value = user.email;
  ['ho_ten', 'so_dien_thoai', 'dia_chi'].forEach((k) => ($('#info').elements[k].value = m[k] ?? ''));

  $('#info').onsubmit = async (e) => {
    e.preventDefault();
    // Gộp với dữ liệu cũ để không mất các trường khác (vd: ảnh đại diện khi đăng nhập Google)
    const data = { ...m, ...Object.fromEntries(new FormData(e.target)) };
    const { error } = await sb.auth.updateUser({ data });
    error ? say(e.target, error.message, 'err') : say(e.target, 'Đã lưu thông tin.', 'ok');
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