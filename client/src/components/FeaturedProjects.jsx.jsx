import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ MongoDB
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/list`);
        const data = await res.json();
        
        if (data.success) {
          // Chỉ lọc lấy những dự án được đánh dấu là Tiêu biểu (isFeatured === true)
          // Và giới hạn lấy tối đa 8 bài để không làm vỡ layout 2 hàng 4 cột
          const featured = data.projects
            .filter(p => p.isFeatured === true)
            .slice(0, 8)
            .map(p => ({
              id: p._id,
              title: p.title,
              category: p.category,
              imageUrl: p.mainImage,
              description: p.description || 'Đang cập nhật mô tả chi tiết cho công trình này...'
            }));
            
          setProjects(featured);
        }
      } catch (error) {
        console.error("Lỗi khi tải dự án tiêu biểu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return <div className="py-10 md:py-20 text-center text-sm md:text-base text-gray-500">Đang tải dự án tiêu biểu...</div>;
  }

  return (
    // TỐI ƯU: Giảm padding trục Y trên mobile (py-10) và giữ nguyên trên PC (md:py-20)
    <section className="py-10 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ SECTION */}
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-black">
            Dự Án Tiêu Biểu
          </h2>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto mt-3 md:mt-4 mb-4 md:mb-6"></div>
          <p className="text-xs md:text-base text-gray-600 max-w-2xl mx-auto px-2 md:px-0">
            Chiêm ngưỡng các công trình kiến trúc đẳng cấp do Trường Thành Phát thiết kế và thi công, mang đến không gian sống hoàn mỹ và tiện nghi.
          </p>
        </div>

        {/* GRID CÔNG TRÌNH */}
        {projects.length === 0 ? (
           <p className="text-center text-xs md:text-sm text-gray-400 italic py-5 md:py-10">Admin chưa chọn dự án tiêu biểu nào.</p>
        ) : (
          // TỐI ƯU: Mobile hiển thị 2 cột (grid-cols-2), khoảng cách nhỏ (gap-3). PC hiển thị 4 cột (lg:grid-cols-4), gap-6.
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full"
              >
                {/* PHẦN HÌNH ẢNH */}
                {/* TỐI ƯU: Giảm chiều cao ảnh trên Mobile (h-32 = 128px), PC giữ nguyên (md:h-64 = 256px) */}
                <div className="relative h-32 sm:h-48 md:h-64 overflow-hidden shrink-0">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                {/* PHẦN NỘI DUNG */}
                {/* TỐI ƯU: Giảm padding bên trong thẻ (p-3 trên mobile) */}
                <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* TỐI ƯU: Cỡ chữ title và description nhỏ lại trên mobile */}
                    <h3 className="text-sm md:text-lg font-bold text-black group-hover:text-green-500 transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 md:mt-3 text-[11px] md:text-sm text-gray-500 line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* TỐI ƯU: Nút Khám phá thu nhỏ trên mobile */}
                  <div className="mt-3 md:mt-5 pt-2 md:pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                    <Link 
                      to={`/hang-muc/cong-trinh-chi-tiet/${project.id}`} 
                      className="text-[10px] md:text-sm font-semibold text-gray-500 group-hover:text-green-500 flex items-center gap-1 md:gap-2 transition-colors uppercase tracking-wide"
                    >
                      Khám phá
                      <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NÚT XEM TẤT CẢ */}
        <div className="mt-8 md:mt-16 flex justify-center">
          <Link 
            to="/hang-muc-cong-trinh" 
            className="px-5 py-2.5 md:px-8 md:py-4 bg-black text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-green-500 transition-colors duration-300 rounded-sm shadow-lg hover:shadow-green-500/30"
          >
            Xem Tất Cả Công Trình
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;