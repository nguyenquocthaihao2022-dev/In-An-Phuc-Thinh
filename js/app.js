import { SITE as S, PRODUCTS, FLYERS, NEWS } from './data.js';
import { Supabase as sb } from './supabase.js';
import { items } from './store.js';

const $ = (s) => document.querySelector(s);
const page = location.pathname.split('/').pop() || 'index.html';
const NAV = [['index.html', 'Trang chủ'], ['index.html#san-pham', 'Sản phẩm'], ['gioi-thieu.html', 'Giới thiệu'], ['tin-tuc.html', 'Kiến thức in ấn']];
const link = ([h, t]) => `<a href="${h}"${h === page ? ' class="on"' : ''}>${t}</a>`;
// Supabase lưu phiên đăng nhập trong localStorage → không cần tải thư viện ở mọi trang.
const logged = (() => { try { return Object.keys(localStorage).some((k) => /^sb-.+-auth-token$/.test(k)); } catch { return false; } })();
const { data: { user } } = await sb.auth.getUser();
const AUTH = logged
  ? `<a href="tai-khoan.html"${page === 'tai-khoan.html' ? ' class="on"' : ''}>Tài khoản</a><a href="#" id="auth">Đăng xuất</a>`
  : '<a href="dang-nhap.html" id="auth">Đăng nhập</a>';

document.body.insertAdjacentHTML('afterbegin', `
<div class="top"><div class="wrap">
  <a href="${S.map}" target="_blank" rel="noopener">📍 ${S.addr}</a>
  <span><a href="tel:${S.phone}">📞 ${S.phoneText}</a> &nbsp;·&nbsp; <a href="mailto:${S.email}">✉️ ${S.email}</a></span>
</div></div>
<nav class="bar"><div class="wrap"><nav class="bar"><div class="wrap">
  <a href="index.html" class="logo"><img src="Assets/icons/Logo Phuc Thinh.jpg" alt="${S.name}"></a>
  <div class="menu">
    <div class="links">${NAV.map(link).join('')}${AUTH}<input type="text" placeholder="Tìm kiếm..." class="search" /></div>
    <div class="more" hidden><button type="button" aria-expanded="false">Thêm ▾</button><div class="drop"></div></div>
    <a href="bao-gia.html" class="btn">Nhận báo giá</a>
    ${user?.app_metadata?.app_role === 'admin' ? '<a href="admin.html" class="btn alt">Quản trị</a>' : ''}
  </div>
  <button class="burger" aria-label="Mở menu" aria-expanded="false">☰</button>
</div></nav>`);

document.body.insertAdjacentHTML('beforeend', `
<footer><div class="wrap fgrid">
  <div><img src="Assets/icons/Logo-Phuc-Thinh.jpg" alt="" class="flogo"><h3>${S.company}</h3><p>${S.addr}</p></div>
  <div><h3>Liên kết</h3>${NAV.map(link).join('')}<a href="bao-gia.html">Nhận báo giá</a></div>
  <div><h3>Liên hệ</h3><a href="tel:${S.phone}">📞 ${S.phoneText}</a><a href="mailto:${S.email}">✉️ ${S.email}</a><a>⏰ Giờ làm việc: ${S.hours}</a></div>
</div><p class="copy">© ${new Date().getFullYear()} ${S.name}. Bảo lưu mọi quyền.</p></footer>
<div class="float">
  <a href="https://zalo.me/${S.phone}" target="_blank" rel="noopener" class="zalo">Zalo</a>
  <a href="tel:${S.phone}" class="call">📞 Gọi ngay</a>
  <button id="up" aria-label="Lên đầu trang" hidden>↑</button>
</div>`);

const MOBILE = '(max-width:640px)'; // phải trùng với @media trong CSS
const burger = $('.burger'), menu = $('.menu'), up = $('#up');
const links = $('.links'), more = $('.more'), drop = $('.drop'), moreBtn = $('.more > button');
const items = [...links.children];

burger.onclick = () => burger.setAttribute('aria-expanded', menu.classList.toggle('open'));
const closeMore = () => { more.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); };
moreBtn.onclick = () => moreBtn.setAttribute('aria-expanded', more.classList.toggle('open'));
document.addEventListener('click', (e) => { if (!more.contains(e.target)) closeMore(); });
addEventListener('keydown', (e) => e.key === 'Escape' && closeMore());

// Thu gọn dần: mục đứng cuối được đưa vào "Thêm" trước
const fit = () => {
  links.append(...items);
  more.hidden = true;
  if (matchMedia(MOBILE).matches) return; // chế độ burger: hiện tất cả trong menu dọc
  let n = items.length;
  while (n > 0 && links.scrollWidth - links.clientWidth > 1) { more.hidden = false; drop.prepend(items[--n]); }
};
new ResizeObserver(() => requestAnimationFrame(fit)).observe($('.bar .wrap'));
document.fonts?.ready.then(fit); // đo lại khi font chữ tải xong
addEventListener('scroll', () => (up.hidden = scrollY < 500), { passive: true });
up.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
$('#auth').onclick = async (e) => {
  if (!logged) return;
  e.preventDefault();
  await sb.auth.signOut();
  location.href = 'index.html';
};
search.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
});

// Thẻ sản phẩm / bài viết: có liên kết thì thành <a>, không thì <article>.
const card = (p) => {
  const href = p.href ?? (p.id || p.sp ? `bao-gia.html?${new URLSearchParams({ sp: p.sp || p.id, ...(p.nd && { nd: p.nd }) })}` : '');
  const body = `<img src="${p.img}" alt="${p.name}" loading="lazy"><div class="cb"><h3>${p.name}</h3>${p.desc ? `<p>${p.desc}</p>` : ''}${href ? `<span class="more">${p.cta || 'Nhận báo giá'} →</span>` : ''}</div>`;
  return href ? `<a class="card" href="${href}">${body}</a>` : `<article class="card">${body}</article>`;
};
document.querySelectorAll('[data-list]').forEach(async (el) => (el.innerHTML = (await items(el.dataset.list)).map(card).join('')));
document.querySelectorAll('[data-cta]').forEach((el) => (el.innerHTML = `<div class="band"><div><h2>Cần in gấp hoặc chưa biết chọn loại nào?</h2><p>Gọi ${S.phoneText} hoặc gửi yêu cầu để được tư vấn.</p></div><div class="cta"><a class="btn" href="tel:${S.phone}">Gọi ngay</a><a class="btn alt" href="bao-gia.html">Gửi yêu cầu</a></div></div>`));
