# TÀI LIỆU YÊU CẦU KỸ THUẬT: MODULE VIDEO

---

## 1. Bối cảnh & Vị trí hiển thị (Context & Placement)
* [cite_start]**Vị trí:** Thêm một module Video mới trên thanh Navbar[cite: 1, 2]. [cite_start]Vị trí chính xác là đứng ngay **sau** phần "Hạng mục công trình"[cite: 3].
* [cite_start]**Mục tiêu:** Tạo một trang/khu vực hiển thị video kèm bài viết chi tiết, hỗ trợ cả định dạng ngang (YouTube) và dọc (TikTok) một cách linh hoạt[cite: 4].

---

## 2. Cấu trúc cấu hình Admin & Database (Backend Requirement)
[cite_start]Hệ thống Admin cần cho phép người quản trị cấu hình các trường dữ liệu sau[cite: 5, 6]:
* [cite_start]**Tiêu đề Video:** Dạng text[cite: 7].
* [cite_start]**Đường dẫn (Video URL/ID):** Link embed hoặc ID của video từ YouTube/TikTok[cite: 8].
* [cite_start]**Loại nền tảng (Platform Type):** Chọn một trong hai giá trị (**YouTube** hoặc **TikTok**)[cite: 9].
* [cite_start]**Nội dung bài viết:** Trình soạn thảo văn bản (tương tự như cấu trúc bài viết của phần Blog)[cite: 10].

---

## 3. Cấu trúc giao diện & Xử lý hiển thị (Frontend Layout & Logic)
[cite_start]Giao diện Client được chia làm các phần chính trên một trang[cite: 11, 12]:
* [cite_start]**Tiêu đề video**[cite: 13].
* [cite_start]**Khung chứa Video (Video Container):** Cố định khung hình theo tỷ lệ **16:9**[cite: 14].
* [cite_start]**Phần nội dung:** Hiển thị Tiêu đề video và Bài viết chi tiết (sử dụng chung style/layout với trang Blog hiện tại)[cite: 15].
* [cite_start]Thêm phần hiển thị gợi ý video như hiển thị gợi ý bài viết[cite: 16].

---

## 4. Logic xử lý hiển thị Video (Quan trọng)
[cite_start]Client phải tự động nhận diện loại nền tảng được cấu hình từ Admin để render layout phù hợp bằng phương pháp **iframe embed trực tiếp**[cite: 17, 18]:

### Trường hợp YouTube (Tỷ lệ 16:9)
* [cite_start]Hiển thị iframe full khung hình 16:9 ngang chuẩn[cite: 19, 20].
* Chỉ hiển thị video và các bộ điều khiển (controls) cơ bản. [cite_start]Không xử lý hiệu ứng nền[cite: 21].

### Trường hợp TikTok (Tỷ lệ 9:16)
* [cite_start]Video dọc (9:16) phải được căn giữa khung hình[cite: 22, 23].
* [cite_start]Hai bên khoảng trống của khung 16:9 phải được lấp đầy bằng hiệu ứng **nền mờ (blur background)** trích xuất từ chính video hoặc dùng lớp phủ mờ tạo chiều sâu[cite: 24].
* [cite_start]Đảm bảo tổng thể khung hình vẫn giữ đúng tỷ lệ 16:9 để không bị vỡ layout chung[cite: 24].

---

## 5. Ở Trang danh sách video (Pages video)
* Các video được hiển thị mỗi hàng 4 video, mỗi trang tối đa 8 video. [cite_start]Thiết kế có phân trang cho trang[cite: 25, 26].
* [cite_start]Hiển thị hình ảnh video đầu tiên, ở dưới là Tiêu đề và ngày đăng[cite: 27].

---

## 6. Ở Trang xem video chi tiết (Pages xem video chi tiết)
* [cite_start]Hiển thị tuân thủ theo đúng cấu trúc tại **Mục 3: Cấu trúc giao diện & Xử lý hiển thị (Frontend Layout & Logic)**[cite: 28, 29].

---

## 7. Nguyên tắc kỹ thuật & Ràng buộc (Technical Constraints & Rules)
* [cite_start]**Phương án triển khai:** Sử dụng **iframe embed trực tiếp** để tối ưu dung lượng tải trang, dễ kiểm soát kích thước và đồng bộ layout giữa hai nền tảng[cite: 30, 31].
* [cite_start]**Hiệu năng:** Tối ưu tốc độ tải (Lazy load iframe nếu cần thiết), không làm block tiến trình render của trang chính[cite: 32].
* [cite_start]**Tính an toàn:** Việc tích hợp module mới tuyệt đối **không làm ảnh hưởng** đến bất kỳ chức năng hoặc logic hiện có nào của hệ thống[cite: 33].