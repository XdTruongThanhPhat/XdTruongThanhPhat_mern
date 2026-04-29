import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const News = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Kinh nghiệm xây nhà", "Phong thủy nhà ở", "Xu hướng thiết kế"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs');
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
    return <div className="pt-32 pb-16 min-h-screen flex justify-center items-center"><p className="animate-pulse text-green-600 font-bold">Đang tải bài viết...</p></div>;
  }

  return (
    <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black mb-4">Tin tức & Kiến thức</h1>
          <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Cập nhật những xu hướng kiến trúc mới nhất, kiến thức xây dựng và phong thủy nhà ở.</p>
        </div>

        {/* BỘ LỌC DANH MỤC */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 border rounded-full ${
                activeCategory === cat 
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
          <p className="text-center text-gray-400 italic py-10">Chưa có bài viết nào trong chuyên mục này.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(blog => (
              <Link to={`/tin-tuc/${blog._id}`} key={blog._id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-sm shadow-md">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-2 italic font-medium">{blog.date} • Bởi {blog.author}</p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-snug mb-3">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {blog.content}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <span className="text-sm font-bold text-black uppercase tracking-wider group-hover:text-green-500 transition-colors flex items-center gap-2">
                      Đọc tiếp <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
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