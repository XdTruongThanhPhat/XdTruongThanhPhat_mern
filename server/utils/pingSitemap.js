/**
 * Tiện ích SEO: Thông báo Search Engines khi nội dung thay đổi
 * 
 * KHI CÓ BÀI VIẾT/DỰ ÁN MỚI HOẶC CẬP NHẬT:
 * 1. Ping Google sitemap endpoint (yêu cầu re-crawl sitemap)
 * 2. Ping IndexNow (Bing, Yandex) cho URL cụ thể
 * 3. Ghi log để theo dõi
 * 
 * LƯU Ý: Các ping chạy async, không block response trả về client.
 * Nếu ping thất bại cũng không ảnh hưởng chức năng chính.
 */

const SITEMAP_URL = 'https://truongthanhphatdn.vn/sitemap.xml';
const BASE_URL = 'https://truongthanhphatdn.vn';

/**
 * Ping Google để thông báo sitemap đã thay đổi (Đã deprecated từ 12/2023)
 * Google khuyên dùng Robots.txt declaration hoặc gửi thủ công qua Search Console.
 */
const pingGoogle = async () => {
    // try {
    //     const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    //     const response = await fetch(pingUrl);
    //     console.log(`[SEO] 🔍 Google ping: ${response.ok ? 'OK' : response.status}`);
    // } catch (error) {
    //     console.error('[SEO] ❌ Google ping thất bại:', error.message);
    // }
    console.log(`[SEO] 🔍 Google ping: Bỏ qua (Google đã đóng API ping từ 12/2023)`);
};

/**
 * Ping Bing qua IndexNow protocol
 * IndexNow thông báo tức thì cho Bing, Yandex, và các search engines hỗ trợ
 */
const pingBing = async () => {
    try {
        const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
        const response = await fetch(pingUrl);
        console.log(`[SEO] 🔍 Bing ping: ${response.ok ? 'OK' : response.status}`);
    } catch (error) {
        console.error('[SEO] ❌ Bing ping thất bại:', error.message);
    }
};

/**
 * Thông báo các search engines khi nội dung website thay đổi.
 * Giữ nguyên interface (reason param) để tương thích với controllers hiện tại.
 * 
 * Chạy async trong background, không block response.
 * 
 * @param {string} [reason] - Mô tả ngắn lý do (để log)
 */
export const pingSitemap = (reason = '') => {
    const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    console.log(`[SEO] 📝 Nội dung thay đổi (${timestamp})${reason ? ` — ${reason}` : ''}`);

    // Chạy ping trong background, delay 2 giây để DB commit xong
    setTimeout(async () => {
        console.log(`[SEO] 📡 Đang thông báo search engines...`);
        await Promise.allSettled([
            pingGoogle(), // Sẽ chỉ log thông báo bỏ qua
            pingBing()
        ]);
        console.log(`[SEO] ✅ Đã thông báo xong cho search engines`);
    }, 2000);
};

export default pingSitemap;
