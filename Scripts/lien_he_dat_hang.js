const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('name');
const phone_number = urlParams.get('phone_number');
if (username && phone_number) {
    localStorage.setItem("name", JSON.stringify(username));
    localStorage.setItem("phone_number", JSON.stringify(phone_number));
}
if (localStorage.getItem("name") && localStorage.getItem("phone_number")) {
    document.getElementById("name_input").value = localStorage.getItem("name")
    document.getElementById("phone_number_input").value = localStorage.getItem("phone_number");
}