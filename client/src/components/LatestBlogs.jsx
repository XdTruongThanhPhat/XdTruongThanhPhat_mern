import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateSlug } from '../utils/slugify';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

// HÀM LÀM SẠCH MÃ HTML TỪ DATABASE THÀNH TEXT THƯỜNG
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '') // Xóa tất cả các thẻ HTML (<p>, <img>, <strong>...)
    .replace(/&nbsp;/gi, ' ')  // Biến &nbsp; thành khoảng trắng bình thường
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .trim();
};

const LatestBlogs = () => {
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
        const data = await res.json();

        if (data.success && data.blogs.length > 0) {
          // 1. Tìm bài nổi bật (Có isFeatured = true)
          const featured = data.blogs.find(b => b.isFeatured === true) || data.blogs[0];
          if (featured) {
            featured.date = new Date(featured.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
            setFeaturedBlog(featured);
          }

          // 2. Tìm 4 bài mới nhất (Loại trừ bài nổi bật ra để không bị lặp)
          const recents = data.blogs
            .filter(b => b._id !== (featured ? featured._id : null))
            .slice(0, 4)
            .map(b => ({
              ...b,
              date: new Date(b.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
            }));
          setRecentBlogs(recents);
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức mới nhất:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (!loading && !featuredBlog && recentBlogs.length === 0) return null;

  return (
    <section className="py-8 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* TIÊU ĐỀ SECTION */}
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Tin Tức & Kiến Thức
          </h2>
          <div className="w-12 sm:w-16 md:w-24 h-1 bg-green-500 mx-auto mt-2 md:mt-4 mb-3 md:mb-6"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2">
            Cập nhật những xu hướng thiết kế mới nhất, kinh nghiệm xây nhà và phong thủy giúp bạn kiến tạo không gian sống hoàn hảo.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-green-600 font-bold text-sm md:text-base animate-pulse">Đang tải bài viết...</p>
          </div>
        ) : (
          <>
            {/* GRID LAYOUT: Giữ nguyên 3 cột trên cả mobile và PC */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 lg:gap-12">

              {/* BÊN TRÁI: BÀI VIẾT NỔI BẬT NHẤT - CHIẾM 2 CỘT */}
              {featuredBlog && (
                <div className="col-span-2 flex flex-col h-full bg-white rounded-md md:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  {/* PHẦN ẢNH */}
                  <Link to={`/tin-tuc/${generateSlug(featuredBlog.title)}-${featuredBlog._id}`} className="block relative aspect-[4/3] md:aspect-[16/10] overflow-hidden shrink-0">
                    <img
                      src={optimizeCloudinaryUrl(featuredBlog.imageUrl, 800)}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-green-500 text-white text-[8px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 md:px-3 md:py-1.5 rounded-sm shadow-md">
                      {featuredBlog.category}
                    </div>
                  </Link>

                  {/* PHẦN NỘI DUNG */}
                  <div className="p-3 md:p-6 lg:p-8 flex-1 flex flex-col">
                    {/* Ngày tháng */}
                    <p className="text-[10px] md:text-sm text-gray-400 mb-1 md:mb-3 italic font-medium shrink-0">
                      {featuredBlog.date} <span className="hidden sm:inline">• Bởi {featuredBlog.author}</span>
                    </p>

                    {/* Tiêu đề */}
                    <Link to={`/tin-tuc/${generateSlug(featuredBlog.title)}-${featuredBlog._id}`} className="shrink-0">
                      <h3 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 leading-snug md:mb-3">
                        {featuredBlog.title}
                      </h3>
                    </Link>

                    {/* MÔ TẢ (ĐÃ FIX): Sử dụng hàm stripHtml để lọc sạch mã code */}
                    <div className="flex-1 overflow-hidden mt-2 md:mt-0">
                      <p className="text-gray-600 text-[11px] sm:text-xs md:text-base line-clamp-4 md:line-clamp-[10] lg:line-clamp-[12] leading-relaxed">
                        {featuredBlog.content
                          ? stripHtml(featuredBlog.content)
                          : "Đang cập nhật nội dung chi tiết cho bài viết này..."}
                      </p>
                    </div>

                    {/* Nút Đọc tiếp */}
                    <div className="mt-4 pt-3 md:pt-4 border-t border-gray-100 flex shrink-0">
                      <Link
                        to={`/tin-tuc/${generateSlug(featuredBlog.title)}-${featuredBlog._id}`}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold text-green-600 uppercase tracking-widest hover:text-green-700 transition-colors"
                      >
                        Đọc tiếp
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* BÊN PHẢI: BÀI VIẾT LIÊN QUAN (MỚI NHẤT) - CHIẾM 1 CỘT */}
              {recentBlogs.length > 0 && (
                <div className="col-span-1 flex flex-col h-full">
                  <h3 className="text-[10px] sm:text-sm md:text-xl font-bold text-black uppercase tracking-tight md:tracking-widest mb-2 md:mb-6 border-b-2 border-green-500 inline-block pb-1 md:pb-2 self-start shrink-0">
                    Bài liên quan
                  </h3>

                  {/* Danh sách các bài viết nhỏ */}
                  <div className="flex flex-col gap-2 md:gap-4 flex-1">
                    {recentBlogs.map(blog => (
                      <Link
                        to={`/tin-tuc/${generateSlug(blog.title)}-${blog._id}`}
                        key={blog._id}
                        className="group flex flex-col sm:flex-row gap-1.5 md:gap-3 lg:gap-4 bg-white rounded md:rounded-lg p-1.5 sm:p-2 md:p-3 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full"
                      >
                        {/* Ảnh thu nhỏ */}
                        <div className="w-full sm:w-2/5 aspect-[4/3] rounded overflow-hidden shrink-0 relative">
                          <img
                            src={optimizeCloudinaryUrl(blog.imageUrl, 400)}
                            alt={blog.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Chữ */}
                        <div className="flex-1 flex flex-col justify-center sm:justify-start">
                          <span className="hidden sm:block text-[8px] md:text-[10px] font-bold text-green-600 uppercase tracking-wider mb-0.5 md:mb-1">
                            {blog.category}
                          </span>
                          <h4 className="text-[9px] sm:text-[10px] md:text-sm lg:text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-3 sm:line-clamp-2 leading-snug">
                            {blog.title}
                          </h4>
                          <p className="hidden md:block text-[10px] lg:text-xs text-gray-400 italic font-medium mt-1">
                            {blog.date}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* NÚT XEM TẤT CẢ */}
            <div className="mt-8 md:mt-16 flex justify-center">
              <Link
                to="/tin-tuc"
                className="px-5 py-2.5 md:px-8 md:py-4 bg-transparent border-2 border-black text-black text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors duration-300 rounded-sm"
              >
                Xem Thêm
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;