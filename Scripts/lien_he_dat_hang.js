let contact= document.getElementsByClassName("submit_btn")[0]
if (localStorage.key("name") && localStorage.key("phone_number")) {
    document.getElementById("name_input").value = JSON.parse(localStorage.getItem("name"));
    document.getElementById("phone_number_input").value = JSON.parse(localStorage.getItem("phone_number"));
}
contact.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("yes")
    let name = document.getElementById("name_input").value;
    let phone_number = document.getElementById("phone_number_input").value;
    localStorage.setItem("name", JSON.stringify(name));
    localStorage.setItem("phone_number", JSON.stringify(phone_number));
})