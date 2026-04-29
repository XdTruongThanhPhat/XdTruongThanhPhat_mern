import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/blogs');
        const data = await res.json();
        
        if (data.success) {
          // Tìm bài viết hiện tại
          const current = data.blogs.find(b => b._id === id);
          if (current) {
            current.date = new Date(current.createdAt).toLocaleDateString('vi-VN');
            setBlog(current);
          }
          
          // Lấy 5 bài viết mới nhất (trừ bài hiện tại) cho Sidebar
          const recents = data.blogs
            .filter(b => b._id !== id)
            .slice(0, 5)
            .map(b => ({
              ...b,
              date: new Date(b.createdAt).toLocaleDateString('vi-VN')
            }));
          setRecentBlogs(recents);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
      window.scrollTo(0, 0); // Tự động cuộn lên đầu trang khi đổi bài
    }
  }, [id]);

  if (loading) return <div className="pt-32 pb-16 min-h-screen flex justify-center items-center"><p className="animate-pulse text-green-600 font-bold">Đang tải bài viết...</p></div>;
  if (!blog) return <div className="pt-32 pb-16 min-h-screen flex justify-center items-center"><p className="text-red-500 font-bold text-xl">Không tìm thấy bài viết!</p></div>;

  return (
    <section className="pt-32 pb-20 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT */}
          <div className="lg:w-2/3 xl:w-3/4 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
            {/* Header bài viết */}
            <div className="mb-8 border-b border-gray-100 pb-6">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm mb-4">
                {blog.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-black leading-tight mb-4">
                {blog.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> {blog.date}</span>
                <span className="mx-3">•</span>
                <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> {blog.author}</span>
              </div>
            </div>

            {/* Ảnh bìa */}
            <div className="w-full aspect-video rounded-lg overflow-hidden mb-8">
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            {/* Nội dung chi tiết */}
            <div className="prose max-w-none text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line text-justify">
              {blog.content}
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
               <span className="font-bold text-black">Chia sẻ bài viết:</span>
            </div>
          </div>

          {/* CỘT PHẢI: BÀI VIẾT MỚI NHẤT (SIDEBAR) */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              <div className="bg-[#1A1A1A] text-center py-4 border-b-2 border-green-500">
                <h3 className="text-white text-lg font-bold uppercase tracking-wider">Bài viết mới nhất</h3>
              </div>
              <div className="p-5 flex flex-col gap-6">
                {recentBlogs.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center">Chưa có bài viết khác.</p>
                ) : (
                  recentBlogs.map(item => (
                    <Link to={`/tin-tuc/${item._id}`} key={item._id} className="group flex gap-4 items-start">
                      <div className="w-24 h-20 shrink-0 overflow-hidden rounded border border-gray-100">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors mb-1">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-gray-400 italic">{item.date}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NewsDetail;