import { Supabase } from "./supabase.js"

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
    const { data: { session }, error } = await Supabase.auth.getSession();
    if (error) {
        alert('Error fetching session:', error);
        console.error('Error fetching session:', error);
    }
    if (session) {
        const btnToSignin = document.getElementById('btn_to_signin');
        const btnToOrders = document.getElementById('btn_to_orders');
        const logoutBtn = document.getElementById('logout_btn');

        if (btnToSignin && btnToOrders && logoutBtn) {
            btnToSignin.hidden=true;
            btnToOrders.hidden=false;
            logoutBtn.hidden=false;
        }
    }
    const news_menu = document.querySelector('ul');
    document.querySelector('p').addEventListener('click', () => {
        news_menu.hidden = !news_menu.hidden;
    })
    document.querySelector('.news_menu_wrapper').addEventListener('mouseleave', () => {
        news_menu.hidden = true;
    })
    document.getElementById('logout_btn').addEventListener('click', async () => {
        const { error } = await Supabase.auth.signOut();
        if (error) {
            alert('Error signing out:', error);
            console.error('Error signing out:', error);
        } else {
            window.location.href = 'index.html';
        }
    });
})