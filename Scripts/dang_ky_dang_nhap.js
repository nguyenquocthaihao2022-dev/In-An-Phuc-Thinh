import { Supabase } from "./supabase.js"

async function dang_ky(name, email, phone, password, event) {
    event.preventDefault();
    console.alert(name, email, phone, password);

    try {
        const { data, error } = await Supabase.auth.signUp({
            email: email,
            password: password,
            options: {

                data: {
                    name: name,
                    phone: phone
                }
            }
        });

        if (error) {
            console.error('Lỗi đăng ký:', error.message);
            alert('Đăng ký thất bại: ' + error.message);
        } else {
            console.log('Đăng ký thành công!', data);
            alert('Đăng ký thành công! Hãy kiểm tra email.');
        }
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        alert('Đăng ký thất bại: ' + err.message);
    }
}

const form = document.getElementById('signup-form');
console.log(form);
if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const jsonString = JSON.stringify(data);
        // Extract values from the data object
        const { name, email, phone, password } = JSON.parse(jsonString);
        await dang_ky(name, email, phone, password, event);
    });
}