# Kế Hoạch Sửa Lỗi Mức Độ Cao

Chỉ thêm code mới, **không thay đổi** cấu trúc, logic, giao diện hiện tại.

> [!NOTE]
> Sau khi kiểm tra lại, **B1** (Quotation & Team thiếu Helmet) và **B7** (thiếu robots.txt) đã được bạn xử lý rồi → bỏ qua.

---

## 1. C1: Thêm Global Error Handler cho Server

#### [MODIFY] [server.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/server.js)

Thêm middleware error handler **ở cuối file**, sau tất cả routes. Không ảnh hưởng bất kỳ route nào đang hoạt động.

```diff
 app.get("/", (req, res) => res.send("Server is running"));
 
+// Global Error Handler - Bắt mọi lỗi không được xử lý trong controller
+app.use((err, req, res, next) => {
+  console.error("❌ Server Error:", err.stack);
+  res.status(500).json({ success: false, message: "Internal Server Error" });
+});
+
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 2. C2: Bảo vệ API Routes bằng Auth Middleware

Middleware `protectRoute` **đã có sẵn** ở `middleware/authMiddleware.js` nhưng chưa được gắn vào routes mutation. Tôi sẽ thêm `protectRoute` vào **chỉ các route POST/PUT/DELETE/PATCH** (route GET giữ nguyên public).

> [!IMPORTANT]
> Yêu cầu: Admin panel phải gửi header `Authorization: Bearer <token>` khi gọi API mutation. Nếu admin panel chưa gửi token thì **các thao tác thêm/sửa/xóa sẽ bị chặn**. Hãy xác nhận admin panel đã gửi token trước khi tôi triển khai.

#### [MODIFY] [blogRoutes.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/routes/blogRoutes.js)
- Thêm `import { protectRoute }` + gắn vào POST, PUT, DELETE, PATCH

#### [MODIFY] [bannerRoutes.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/routes/bannerRoutes.js)
- Thêm `protectRoute` vào POST, DELETE

#### [MODIFY] [teamRoutes.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/routes/teamRoutes.js)
- Thêm `protectRoute` vào PUT, POST, DELETE

#### [MODIFY] [testimonialRoutes.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/routes/testimonialRoutes.js)
- Thêm `protectRoute` vào POST, PUT, DELETE

#### [MODIFY] [projectRoutes.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/routes/projectRoutes.js)
- Thêm `protectRoute` vào POST, PUT, DELETE, PATCH

> [!NOTE]
> Route `contactRoutes.js` (POST `/api/contact`) **KHÔNG** thêm auth vì đây là form từ khách hàng gửi, không cần đăng nhập.

---

## 3. B4: Đồng Bộ Hàm `generateSlug` Server ↔ Client

#### [MODIFY] [sitemapRoute.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/server/routes/sitemapRoute.js)

Thay thế hàm `generateSlug` ở server bằng **chính xác** hàm từ client ([slugify.js](file:///c:/Users/OS/Desktop/Mern-TTP/Mern-TTP/client/src/utils/slugify.js)) để đảm bảo URL trong sitemap.xml khớp 100% với URL trên trình duyệt.

**Khác biệt hiện tại:**
- Client: `.replace(/[^\w\-]+/g, '')` – giữ lại chữ, số, gạch ngang, gạch dưới
- Server: `.replace(/([^0-9a-z-\s])/g, '')` – giữ lại chữ, số, gạch ngang, khoảng trắng  

→ Có thể tạo ra slug khác nhau cho cùng 1 tiêu đề → Google crawl URL sai.

---

## Xác Minh

- Server khởi động bình thường sau khi thay đổi
- Trang web client **không bị ảnh hưởng** (không sửa bất kỳ file client nào ngoài việc đồng bộ logic slug)
- API GET vẫn hoạt động công khai
- API mutation yêu cầu token (nếu admin panel đã gửi token)
