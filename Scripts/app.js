let autoSlideTimer;
const gap = 20; // Khoảng cách gap trong CSS của bạn
const speed = 5000; // Tốc độ tự động chạy (2 giây)

// Hàm xử lý trượt tiến (Next)
function slideNext(index) {
    if (index != -1) {
        const container = document.querySelectorAll('.container')[index];
        const firstItem = container.querySelector('.item_div');
        if (!firstItem) return;

        const itemWidth = firstItem.offsetWidth;
        const moveDistance = itemWidth + gap;

        // 1. Tạo hiệu ứng trượt mượt mà sang trái
        container.style.transition = "transform 0.5s ease-in-out";
        container.style.transform = `translateX(-${moveDistance}px)`;

        // 2. Chờ hiệu ứng trượt chạy xong (0.5s = 500ms) thì đưa phần tử đầu xuống cuối
        setTimeout(() => {
            container.style.transition = "none"; // Tắt transition để reset không bị giật
            container.appendChild(firstItem);    // Đưa phần tử đầu tiên xuống cuối hàng
            container.style.transform = "translateX(0)"; // Reset vị trí container về ban đầu
        }, 500);
    }
    else {
        const containers = document.querySelectorAll('.container');

        const itemWidth = containers[0].querySelector('.item_div').offsetWidth;
        const moveDistance = itemWidth + gap;

        // 1. Tạo hiệu ứng trượt mượt mà sang trái
        containers.forEach(container => {
            container.style.transition = "transform 0.5s ease-in-out";
            container.style.transform = `translateX(-${moveDistance}px)`;
        });

        // 2. Chờ hiệu ứng trượt chạy xong (0.5s = 500ms) thì đưa phần tử đầu xuống cuối
        setTimeout(() => {
            containers.forEach(container => {
                container.style.transition = "none"; // Tắt transition để reset không bị giật
                container.appendChild(container.querySelector('.item_div'));    // Đưa phần tử đầu tiên xuống cuối hàng
                container.style.transform = "translateX(0)"; // Reset vị trí container về ban đầu
            });
        }, 500);
    }
}

// Hàm xử lý trượt lùi (Prev)
function slidePrev(index) {
    const container = document.querySelectorAll('.container')[index];
    const items = container.querySelectorAll('.item_div');
    if (items.length === 0) return;

    const lastItem = items[items.length - 1];
    const itemWidth = lastItem.offsetWidth;
    const moveDistance = itemWidth + gap;

    // 1. Đưa ngay lập tức phần tử cuối cùng lên đầu hàng (tắt hiệu ứng trước)
    container.style.transition = "none";
    container.insertBefore(lastItem, container.firstChild);

    // 2. Dịch container sang trái một khoảng để bù vào phần tử vừa chèn vào đầu
    container.style.transform = `translateX(-${moveDistance}px)`;

    // 3. Ép trình duyệt render lại (vượt qua cơ chế tối ưu của trình duyệt)
    container.offsetHeight;

    // 4. Bật lại hiệu ứng trượt về vị trí 0 ban đầu
    container.style.transition = "transform 0.5s ease-in-out";
    container.style.transform = "translateX(0)";
}

// Hàm điều khiển tự động chạy
function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
        slideNext(-1);
    }, speed);
}

// Hàm xử lý khi người dùng nhấn nút thủ công
function manualSlide(direction, index) {
    // Dừng tự động chạy để tránh xung đột
    clearInterval(autoSlideTimer);

    if (direction === 1) {
        slideNext(index - 1);
    } else if (direction === -1) {
        slidePrev(index - 1);
    }

    // Khởi động lại bộ đếm tự động chạy mới
    startAutoSlide();
}

// Kích hoạt tự động chạy khi trang web tải xong
startAutoSlide();