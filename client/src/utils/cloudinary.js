/**
 * Cloudinary URL Optimization Utility
 * Tự động thêm f_auto (WebP/AVIF), q_auto (quality) vào URL Cloudinary
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
  if (width) transforms.push(`w_${width}`);
  
  const transformStr = transforms.join(',');

  // Chèn transform vào sau /upload/
  return url.replace('/upload/', `/upload/${transformStr}/`);
};
