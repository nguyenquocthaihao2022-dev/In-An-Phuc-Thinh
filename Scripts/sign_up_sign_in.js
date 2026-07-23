const form = document.querySelector("#signup-form");

if (form) {
    form.addEventListener("submit", async (event) => {
        // Dòng này BẮT BUỘC phải chạy đầu tiên để chặn trình duyệt gửi form và gây lỗi 405
        event.preventDefault(); 
        
        try {
            const formdata = new FormData(event.target); 
            
            // Lưu vào localStorage
            for (let [key, value] of formdata.entries()) {
                localStorage.setItem(key, value);
            }
            
            // Trích xuất dữ liệu từ form
            const name = formdata.get("name");
            const email = formdata.get("email");
            const phone = formdata.get("phone");
            const password = formdata.get("password");
            
            // Gọi hàm Supabase
            await sign_up(name, email, phone, password);
            
            alert("Đăng ký thành công!");
        } catch (error) {
            console.error("Lỗi xử lý form:", error);
        }
    });
}
