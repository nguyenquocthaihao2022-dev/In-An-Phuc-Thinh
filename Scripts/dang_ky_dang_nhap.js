import { Supabase } from "./supabase.js"

async function dang_ky(name, email, phone, password) {
    try {
        const { data, error } = await Supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    phone: phone,
                    name: name
                }
            }
        });

        if (error) {
            console.error('Lỗi đăng ký:', error.message);
            alert('Đăng ký thất bại: ' + error.message);
        } else {
            alert('Đăng ký thành công!');
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
            console.log(data.user);
        }
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        alert('Đăng nhập thất bại: ' + err.message);
    }
}

const signupForm = document.querySelector('#signup_form');
if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const name = formData.get('signup_name');
        const email = formData.get('signup_email');
        const phone = formData.get('signup_phone');
        const password = formData.get('signup_password');
        dang_ky(name, email, phone, password);
    });
}
const loginForm = document.querySelector('#login_form');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get('login_email');
        const password = formData.get('login_password');
        console.log(email, password);
        dang_nhap(email, password);
    });
}