import { Supabase } from "./supabase.js"
Supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        document.getElementById("logout_btn").addEventListener("click", async function (e) {
            e.preventDefault();
            await Supabase.auth.signOut();
            window.location.href = "./index.html";
        })
    }
    else {
        document.getElementById("logout_btn").hidden = true;
    }
})