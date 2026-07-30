import {Supabase} from "./supabase.js"
document.addEventListener('DOMContentLoaded', async () => {
    await fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => {
            console.error('Error fetching header:', error);
        });
    await fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => {
            console.error('Error fetching footer:', error);
        });
    const bttBtn = document.getElementById('btt_btn');
    if (bttBtn) {
        bttBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    Supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // Có session = user đang đăng nhập (hoặc vừa được tự động đăng nhập lại)
        console.log("Trạng thái hiện tại:", event, session.user)
        const btnToSignin = document.getElementById('btn_to_signin');
        const btnToSignup = document.getElementById('btn_to_signup');
        const btnToOrders = document.getElementById('btn_to_orders');
        if (btnToSignin && btnToSignup) {
            btnToSignin.hidden=true;
            btnToSignup.hidden=true;
            btnToOrders.hidden=false;
        }
    }
    })
});