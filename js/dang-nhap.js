import { Supabase as sb } from './supabase.js';

const $ = (s) => document.querySelector(s), tabs = document.querySelectorAll('[data-mode]');
let mode = 'in';
const say = (t, cls = '') => { $('#msg').textContent = t; $('#msg').className = cls; };
const vi = (m) => /invalid login/i.test(m) ? 'Email hoặc mật khẩu không đúng.' : /already/i.test(m) ? 'Email này đã được đăng ký.' : /password/i.test(m) ? 'Mật khẩu cần tối thiểu 6 ký tự.' : m;

tabs.forEach((b) => (b.onclick = () => {
  mode = b.dataset.mode;
  tabs.forEach((x) => x.classList.toggle('on', x === b));
  $('#go').textContent = mode === 'in' ? 'Đăng nhập' : 'Tạo tài khoản';
  say('');
}));

$('#auth-form').onsubmit = async (e) => {
  e.preventDefault();
  const { email, password } = Object.fromEntries(new FormData(e.target));
  const { data, error } = await (mode === 'in' ? sb.auth.signInWithPassword({ email, password }) : sb.auth.signUp({ email, password }));
  if (error) return say(vi(error.message), 'err');
  if (!data.session) return say('Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư của bạn.', 'ok');
  location.href = 'index.html';
};

$('#google').onclick = () => sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: new URL('index.html', location.href).href } });
