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
  
  const submitBtn = e.target.querySelector('[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const { email, password } = Object.fromEntries(new FormData(e.target));

    // CHỈ KIỂM TRA KHI ĐANG Ở CHẾ ĐỘ ĐĂNG KÝ (SIGN UP)
    if (mode !== 'in') {
      // Gọi hàm SQL vừa tạo qua RPC
      const { data: isEmailTaken, error: rpcError } = await sb.rpc('check_email_exists', { 
        user_email: email 
      });

      if (rpcError) {
        console.error(rpcError);
      } else if (isEmailTaken) {
        // Nếu email đã tồn tại, chặn lại ngay lập tức và báo lỗi
        say('Email này đã được liên kết với một tài khoản khác.', 'err');
        if (submitBtn) submitBtn.disabled = false;
        return; 
      }
    }

    // Nếu email chưa tồn tại hoặc đang ở chế độ đăng nhập -> Chạy tiếp luồng cũ
    const { data, error } = await (mode === 'in' 
      ? sb.auth.signInWithPassword({ email, password }) 
      : sb.auth.signUp({ email, password })
    );

    if (error) return say(vi(error.message), 'err');
    if (!data.session) return say('Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư.', 'ok');
    
    location.replace('index.html');

  } catch (err) {
    console.error(err);
    say('Đã xảy ra lỗi hệ thống.', 'err');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
};


$('#google').onclick = () => sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: new URL('index.html', location.href).href } });
