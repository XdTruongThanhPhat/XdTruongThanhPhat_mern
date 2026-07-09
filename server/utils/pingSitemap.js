/**
 * Tiện ích SEO: Ghi log khi nội dung thay đổi
 * 
 * THAY ĐỔI: Endpoint Google ping (google.com/ping?sitemap=) đã bị Google
 * ngừng hỗ trợ từ 2023. Hàm cũ tuy trả về 200 nhưng KHÔNG có tác dụng.
 * 
 * PHƯƠNG ÁN HIỆN TẠI:
 * - Sitemap động (/sitemap.xml) tự động cập nhật từ database
 * - Google Search Console crawl sitemap định kỳ → phát hiện URL mới
 * - Hàm này chỉ ghi log để theo dõi, không gọi API bên ngoài
 * 
 * HƯỚNG DẪN SUBMIT SITEMAP QUA SEARCH CONSOLE:
 * 1. Truy cập https://search.google.com/search-console
 * 2. Chọn property truongthanhphatdn.vn
 * 3. Vào "Sitemaps" → Nhập "sitemap.xml" → Submit
 * 4. Google sẽ tự động kiểm tra sitemap định kỳ (thường 1-2 lần/ngày)
 * 
 * Khi bạn thêm/sửa/xóa bài viết, sitemap.xml động đã tự động cập nhật
 * (route /api/sitemap.xml fetch data real-time từ MongoDB).
 * Google sẽ phát hiện URL mới khi crawl lại sitemap.
 */

/**
 * Ghi log khi nội dung website thay đổi.
 * Giữ lại interface cũ để không cần sửa các controller đang gọi.
 * 
 * @param {string} [reason] - Mô tả ngắn lý do (để log)
 */
export const pingSitemap = (reason = '') => {
    const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    console.log(`[SEO] 📝 Sitemap đã cập nhật (${timestamp})${reason ? ` — ${reason}` : ''}`);
    console.log(`[SEO] ℹ️  Google sẽ phát hiện thay đổi khi crawl lại sitemap.xml`);
};

export default pingSitemap;
