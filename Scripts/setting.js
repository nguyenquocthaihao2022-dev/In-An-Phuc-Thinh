import {Supabase} from "./supabase.js"
document.getElementById("logout_btn").addEventListener("click", async function(e) {
    e.preventDefault();
    await Supabase.auth.signOut();
});