/**
 * Cloudinary URL Optimization Utility
 * Tự động thêm f_auto (WebP/AVIF), q_auto (quality), dpr_auto (Retina) vào URL Cloudinary
 * Giảm ~25-35% dung lượng ảnh → cải thiện Core Web Vitals (LCP)
 */

/**
 * Chuyển đổi URL Cloudinary sang format tối ưu (WebP/AVIF tự động)
 * @param {string} url - URL ảnh gốc từ Cloudinary
 * @param {number} [width] - Chiều rộng resize (px), bỏ trống = giữ nguyên kích thước
 * @returns {string} URL đã tối ưu hoặc URL gốc nếu không phải Cloudinary
 */
export const optimizeCloudinaryUrl = (url, width) => {
  if (!url || typeof url !== 'string') return url;
  
  // Chỉ xử lý URL từ Cloudinary
  if (!url.includes('res.cloudinary.com')) return url;

  // Nếu URL đã có f_auto rồi thì bỏ qua (tránh transform trùng lặp)
  if (url.includes('f_auto')) return url;

  // Xây dựng chuỗi transform
  const transforms = ['f_auto', 'q_auto'];
  if (width) {
    transforms.push(`w_${width}`);
    // Lưu ý: Đã loại bỏ dpr_auto vì nó khiến ảnh phình gấp 2-3x trên màn hình Retina
    // (ví dụ: request w_600 → Cloudinary trả ảnh 1200-1800px → tải chậm gấp đôi)
    // Kích thước w_ đã đủ rõ nét cho mọi thiết bị (600px cho thumbnail, 1200px cho ảnh chính)
  }
  
  const transformStr = transforms.join(',');

  // Chèn transform vào sau /upload/
  return url.replace('/upload/', `/upload/${transformStr}/`);
};

/**
 * Tạo chuỗi srcSet cho responsive images
 * Cloudinary sẽ tự động trả ảnh đúng kích thước mà trình duyệt cần
 * @param {string} url - URL ảnh gốc từ Cloudinary
 * @param {number[]} [widths] - Mảng các chiều rộng (px) cần tạo. Mặc định: [400, 600, 800, 1200, 1600]
 * @returns {string} Chuỗi srcset hoàn chỉnh hoặc '' nếu không phải Cloudinary URL
 */
export const generateSrcSet = (url, widths = [400, 600, 800, 1200, 1600]) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return '';

  return widths
    .map(w => `${optimizeCloudinaryUrl(url, w)} ${w}w`)
    .join(', ');
};

/**
 * Tạo chuỗi sizes phù hợp cho từng loại ảnh
 * @param {'hero'|'card'|'thumbnail'|'article'} type - Loại ảnh
 * @returns {string} Chuỗi sizes cho thuộc tính sizes của thẻ img
 */
export const generateSizes = (type) => {
  switch (type) {
    // Ảnh chính trang chi tiết: chiếm ~66% viewport trên desktop, 100% trên mobile
    case 'hero':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw';
    // Ảnh card trong grid 2-4 cột
    case 'card':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';
    // Ảnh thumbnail nhỏ (sidebar, lightbox)
    case 'thumbnail':
      return '(max-width: 640px) 20vw, 150px';
    // Ảnh trong bài viết: chiếm ~66% viewport trên desktop
    case 'article':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw';
    default:
      return '100vw';
  }
};
