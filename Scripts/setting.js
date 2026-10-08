import { Supabase } from "./supabase.js"
const { data: { session }, error } = await supabase.auth.getSession();
if (error) {
    alert('Error fetching session:', error);
    console.error('Error fetching session:', error);
}
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