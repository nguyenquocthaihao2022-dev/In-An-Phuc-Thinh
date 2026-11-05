import { Supabase as sb } from './supabase.js';
import { upload } from './upload-anh.js';

const $ = (s) => document.querySelector(s);
const q = new URLSearchParams(location.search), t = q.get('t'), id = q.get('id');
const say = (m, c = '') => { $('#msg').textContent = m; $('#msg').className = c; };

async function start() {
  const { data: row, error } = await sb.from(t).select('ten,noi_dung').eq('id', id).single();
  if (error) return say(error.message, 'err');
  $('#tt').textContent = 'Soạn nội dung: ' + row.ten;
  $('#xem').href = `chi-tiet.html?t=${t}&id=${id}`;

  const quill = new Quill('#ed', { theme: 'snow', modules: { toolbar: {
    container: [[{ header: [2, 3, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image'], ['clean']],
    handlers: { image: pickImage },
  } } });
  quill.clipboard.dangerouslyPasteHTML(row.noi_dung ?? '');

  function pickImage() {
    const inp = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*' });
    inp.onchange = async () => {
      try { quill.insertEmbed(quill.getSelection(true).index, 'image', await upload(inp.files[0], 'noi_dung')); }
      catch (e) { say('Tải ảnh lỗi: ' + e.message, 'err'); }
    };
    inp.click();
  }

  $('#save').onclick = async () => {
    const { error } = await sb.from(t).update({ noi_dung: quill.getSemanticHTML() }).eq('id', id);
    error ? say(error.message, 'err') : say('Đã lưu.', 'ok');
  };
}

// Chỉ để ẩn/hiện giao diện; bảo mật thật nằm ở RLS.
await sb.auth.refreshSession();
const { data: { user } } = await sb.auth.getUser();
if (user?.app_metadata?.app_role === 'admin' && ['san_pham', 'kien_thuc'].includes(t)) start();
else $('main').innerHTML = '<div class="wrap sec"><p>Bạn không có quyền hoặc đường dẫn không hợp lệ.</p></div>';