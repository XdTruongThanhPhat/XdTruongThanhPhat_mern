import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { generateSlug } from '../utils/slugify';
import Breadcrumb from '../components/Breadcrumb';
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

const News = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Kinh nghiệm xây nhà", "Phong thủy nhà ở", "Xu hướng thiết kế"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
        const data = await res.json();
        if (data.success) {
          // Format lại ngày tháng
          const formattedBlogs = data.blogs.map(b => ({
            ...b,
            date: new Date(b.createdAt).toLocaleDateString('vi-VN', {
              year: 'numeric', month: '2-digit', day: '2-digit'
            })
          }));
          setBlogs(formattedBlogs);
        }
      } catch (error) {
        console.error("Lỗi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Lọc bài viết
  const filteredBlogs = activeCategory === "Tất cả"
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  if (loading) {
    return <div className="pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center"><p className="animate-pulse text-green-600 font-bold text-sm md:text-base">Đang tải bài viết...</p></div>;
  }

  return (
    // TỐI ƯU: Giảm padding Top/Bottom trên mobile (pt-24 pb-10)
    <section className="pt-24 md:pt-32 pb-10 md:pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Tin Tức & Kiến Thức Xây Dựng | Trường Thành Phát</title>
        <meta name="description" content="Cập nhật xu hướng kiến trúc, kiến thức xây dựng và phong thủy nhà ở từ các chuyên gia của Trường Thành Phát" />
        <link rel="canonical" href="https://truongthanhphatdn.vn/tin-tuc" />
        {/* OG Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tin Tức & Kiến Thức Xây Dựng | Trường Thành Phát" />
        <meta property="og:description" content="Cập nhật xu hướng kiến trúc, kiến thức xây dựng và phong thủy nhà ở" />
        <meta property="og:url" content="https://truongthanhphatdn.vn/tin-tuc" />
        <meta property="og:image" content="https://truongthanhphatdn.vn/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tin Tức & Kiến Thức Xây Dựng | Trường Thành Phát" />
        <meta name="twitter:description" content="Cập nhật xu hướng kiến trúc, kiến thức xây dựng và phong thủy" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb SEO */}
        <Breadcrumb items={[{ label: 'Tin tức' }]} />

        {/* TIÊU ĐỀ */}
        <div className="text-center mb-8 md:mb-12">
          {/* TỐI ƯU: Thu nhỏ text tiêu đề */}
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-black mb-2 md:mb-4">Tin tức & Kiến thức</h1>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto"></div>
          {/* TỐI ƯU: Thu nhỏ chữ mô tả */}
          <p className="mt-3 md:mt-4 text-[11px] md:text-base text-gray-600 max-w-2xl mx-auto px-2">Cập nhật những xu hướng kiến trúc mới nhất, kiến thức xây dựng và phong thủy nhà ở.</p>
        </div>

        {/* BỘ LỌC DANH MỤC */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              // TỐI ƯU: Nút bộ lọc nhỏ hơn trên mobile
              className={`px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border rounded-full ${activeCategory === cat
                ? 'bg-black text-white border-black shadow-lg'
                : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LƯỚI BÀI VIẾT */}
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-xs md:text-sm text-gray-400 italic py-10">Chưa có bài viết nào trong chuyên mục này.</p>
        ) : (
          // TỐI ƯU: Ép 2 cột trên mobile (grid-cols-2), 3 cột trên PC (lg:grid-cols-3)
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {filteredBlogs.map(blog => (
              <Link
                to={`/tin-tuc/${generateSlug(blog.title)}-${blog._id}`}
                key={blog._id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
              >
                <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                  <img src={optimizeCloudinaryUrl(blog.imageUrl, 400)} alt={blog.title || "Tin tức Trường Thành Phát"} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  {/* TỐI ƯU: Tag danh mục nhỏ hơn */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-green-500 text-white text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-sm shadow-md">
                    {blog.category}
                  </div>
                </div>

                {/* TỐI ƯU: Giảm padding bên trong box bài viết (p-3 thay vì p-6) */}
                <div className="p-3 md:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* TỐI ƯU: Thu nhỏ ngày tháng và tác giả */}
                    <p className="text-[9px] md:text-xs text-gray-400 mb-1.5 md:mb-2 italic font-medium">
                      {blog.date} <span className="hidden sm:inline">• Bởi {blog.author}</span>
                    </p>
                    {/* TỐI ƯU: Thu nhỏ Tiêu đề */}
                    <h3 className="text-xs md:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 md:line-clamp-2 leading-snug mb-1.5 md:mb-3">
                      {blog.title}
                    </h3>

                    {/* ĐÃ FIX: Sử dụng hàm stripHtml để hiển thị văn bản thường, loại bỏ mã code HTML */}
                    <p className="text-gray-600 text-[10px] md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {blog.content ? stripHtml(blog.content) : ""}
                    </p>
                  </div>

                  {/* TỐI ƯU: Thu nhỏ nút Đọc tiếp */}
                  <div className="mt-3 md:mt-5 pt-2 md:pt-4 border-t border-gray-50 shrink-0">
                    <span className="text-[10px] md:text-sm font-bold text-black uppercase tracking-wider group-hover:text-green-500 transition-colors flex items-center gap-1 md:gap-2">
                      Đọc tiếp <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;