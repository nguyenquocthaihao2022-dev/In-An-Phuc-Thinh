import {Supabase} from "./supabase.js"
if (localStorage.getItem("name") && localStorage.getItem("phone_number")) {
    document.getElementById("name_input").value = localStorage.getItem("name");
    document.getElementById("phone_number_input").value = localStorage.getItem("phone_number");
}
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const name = formdata.get("name");
    const phone_number = formdata.get("phone_number");
    const information = formdata.get("information");

    try {
        const { data, error } = await Supabase
            .from('lien_he')
            .insert([
                {
                    name: name,
                    phone_number: phone_number,
                    information: information
                }
            ]);
        localStorage.setItem("name", name);
        localStorage.setItem("phone_number", phone_number);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully:', data);
            alert('Thông tin đã được gửi thành công!');
            document.querySelector("form").reset();
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
});