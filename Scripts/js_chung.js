document.addEventListener('DOMContentLoaded', async () => {
    await fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML = data + document.body.innerHTML;
        })
        .catch(error => {
            console.error('Error fetching header:', error);
        });
    await fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML += data;
        })
        .catch(error => {
            console.error('Error fetching footer:', error);
        });
    document.getElementById('btt_btn').addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});