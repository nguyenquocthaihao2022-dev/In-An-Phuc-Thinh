import { Supabase } from "./supabase.js"

async function dang_ky(email, password) {
    try {
        const { data, error } = await Supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            console.error('Lỗi đăng ký:', error.message);
            alert('Đăng ký thất bại: ' + error.message);
        } else {
            alert('Đăng ký thành công!');
            window.location.href = "./index.html"
        }
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        alert('Đăng ký thất bại: ' + err.message);
    }
}
async function dang_nhap(email, password) {
    try {
        const { data, error } = await Supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Lỗi đăng nhập:', error.message);
            alert('Đăng nhập thất bại: ' + error.message);
        } else {
            alert('Đăng nhập thành công!');
            window.location.href = "./index.html"
        }
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        alert('Đăng nhập thất bại: ' + err.message);
    }
}

const signupForm = document.querySelector('#signup_form');
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const email = formData.get('signup_email');
        const password = formData.get('signup_password');
        await dang_ky(email, password);
    });
}
const loginForm = document.querySelector('#login_form');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get('login_email');
        const password = formData.get('login_password');
        console.log(email, password);
        await dang_nhap(email, password);
    });
}