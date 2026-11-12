import { Supabase as sb } from './supabase.js';
import { upload } from './anh.js';

const $ = (s) => document.querySelector(s);
const q = new URLSearchParams(location.search), t = q.get('t'), id = q.get('id');
const say = (m, c = '') => { $('#msg').textContent = m; $('#msg').className = c; };

async function start() {
  const { data: row, error } = await sb.from(t).select('ten,noi_dung').eq('id', id).single();
  if (error) return say(error.message, 'err');
  $('#tt').textContent = 'Soạn nội dung: ' + row.ten;
  $('#xem').href = `chi-tiet.html?t=${t}&id=${id}`;

  const editor = SUNEDITOR.create('ed', {
    height: 'auto',
    minHeight: '360px',
    defaultTag: 'p',
    formats: ['p', 'h2', 'h3', 'blockquote'],
    buttonList: [
      ['undo', 'redo'],
      ['formatBlock', 'bold', 'italic', 'underline', 'removeFormat'],
      ['align', 'list', 'link', 'image'],
      ['fullScreen', 'codeView'],
    ],
  });
  editor.setContents(row.noi_dung ?? '');

  // Ảnh: nén, tải lên Storage rồi chèn URL (không nhúng base64 vào database)
  editor.onImageUploadBefore = (files, info, core, uploadHandler) => {
    Promise.all([...files].map(async (f) => ({ url: await upload(f, 'noi_dung'), name: f.name, size: f.size })))
      .then((result) => uploadHandler({ result }))
      .catch((e) => uploadHandler({ errorMessage: 'Tải ảnh lỗi: ' + e.message, result: [] }));
    // Không return gì: việc chèn ảnh do uploadHandler đảm nhiệm
  };

  $('#save').onclick = async () => {
    const html = editor.getContents(true);
    if (/src=["']data:/i.test(html)) return say('Có ảnh chưa được tải lên Storage. Hãy xóa và chèn lại bằng nút ảnh.', 'err');
    const { error } = await sb.from(t).update({ noi_dung: html }).eq('id', id);
    if (error) return say(error.message, 'err');
    say('Đã lưu. Trang công khai sẽ cập nhật sau khoảng 1–2 phút.', 'ok');
    sb.functions.invoke('publish');
  };
}

// Chỉ để ẩn/hiện giao diện; bảo mật thật nằm ở RLS.
await sb.auth.refreshSession();
const { data: { user } } = await sb.auth.getUser();
if (user?.app_metadata?.app_role === 'admin' && ['san_pham', 'kien_thuc'].includes(t)) start();
else $('main').innerHTML = '<div class="wrap sec"><p>Bạn không có quyền hoặc đường dẫn không hợp lệ.</p></div>';