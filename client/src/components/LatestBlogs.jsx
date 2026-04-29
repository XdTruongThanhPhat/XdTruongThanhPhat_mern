import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LatestBlogs = () => {
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs');
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
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ SECTION */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Tin Tức & Kiến Thức
          </h2>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto mt-3 md:mt-4 mb-4 md:mb-6"></div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto px-2">
            Cập nhật những xu hướng thiết kế mới nhất, kinh nghiệm xây nhà và phong thủy giúp bạn kiến tạo không gian sống hoàn hảo.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-green-600 font-bold animate-pulse">Đang tải bài viết...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 md:gap-8 lg:gap-12">
              
              {/* BÊN TRÁI: BÀI VIẾT NỔI BẬT NHẤT - CHIẾM 2 CỘT */}
              {featuredBlog && (
                <div className="col-span-2 flex flex-col h-full bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <Link to={`/tin-tuc/${featuredBlog._id}`} className="block relative aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                    <img 
                      src={featuredBlog.imageUrl} 
                      alt={featuredBlog.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                    />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-green-500 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-1 md:px-3 md:py-1.5 rounded-sm shadow-md">
                      {featuredBlog.category}
                    </div>
                  </Link>
                  
                  <div className="p-3 md:p-6 lg:p-8 flex-1 flex flex-col">
                    <p className="text-[9px] md:text-xs text-gray-400 mb-1 md:mb-3 italic font-medium">
                      {featuredBlog.date} <span className="hidden md:inline">• Bởi {featuredBlog.author}</span>
                    </p>
                    <Link to={`/tin-tuc/${featuredBlog._id}`}>
                      <h3 className="text-sm sm:text-lg md:text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 leading-snug md:mb-4">
                        {featuredBlog.title}
                      </h3>
                    </Link>
                    
                    {/* KHU VỰC RÚT GỌN NỘI DUNG (1-2 DÒNG) */}
                    <div className="hidden md:block mb-4 mt-auto">
                      <p className="text-gray-600 text-sm md:text-base line-clamp-2 leading-relaxed">
                        {featuredBlog.content}
                      </p>
                      <Link to={`/tin-tuc/${featuredBlog._id}`} className="inline-block mt-2 text-green-600 font-bold text-sm hover:underline">
                        Đọc tiếp...
                      </Link>
                    </div>
                    
                    {/* Nút đọc tiếp (Trên mobile sẽ hiển thị kiểu khác) */}
                    <div className="block md:hidden mt-auto pt-3 border-t border-gray-50">
                      <Link to={`/tin-tuc/${featuredBlog._id}`} className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                        Đọc tiếp 
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </Link>
                    </div>

                  </div>
                </div>
              )}

              {/* BÊN PHẢI: BÀI VIẾT LIÊN QUAN (MỚI NHẤT) */}
              {recentBlogs.length > 0 && (
                <div className="col-span-1 flex flex-col">
                  <h3 className="text-[11px] sm:text-sm md:text-xl font-bold text-black uppercase tracking-tight md:tracking-widest mb-3 md:mb-6 border-b-2 border-green-500 inline-block pb-1 md:pb-2 self-start">
                    Bài liên quan
                  </h3>
                  
                  <div className="flex flex-col gap-3 md:gap-6">
                    {recentBlogs.map(blog => (
                      <Link 
                        to={`/tin-tuc/${blog._id}`} 
                        key={blog._id} 
                        className="group flex flex-col xl:flex-row gap-2 md:gap-4 bg-white rounded-md md:rounded-lg p-1.5 md:p-3 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                      >
                        <div className="w-full xl:w-1/3 aspect-[4/3] rounded overflow-hidden shrink-0 relative">
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="hidden md:block text-[9px] md:text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1 md:mb-2">
                            {blog.category}
                          </span>
                          <h4 className="text-[10px] sm:text-xs md:text-base font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-3 md:line-clamp-2 leading-snug">
                            {blog.title}
                          </h4>
                          <p className="hidden md:block text-xs text-gray-400 italic font-medium mt-1 md:mt-2">
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
            <div className="mt-10 md:mt-16 flex justify-center">
              <Link 
                to="/tin-tuc" 
                className="px-6 py-3 md:px-8 md:py-4 bg-transparent border-1 border-black text-green-600  text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-green-600  hover:text-white transition-colors duration-300 rounded-sm"
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