import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ MongoDB
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects/list');
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
    return <div className="py-20 text-center text-gray-500">Đang tải dự án tiêu biểu...</div>;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TIÊU ĐỀ SECTION */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Dự Án Tiêu Biểu
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chiêm ngưỡng các công trình kiến trúc đẳng cấp do Trường Thành Phát thiết kế và thi công, mang đến không gian sống hoàn mỹ và tiện nghi.
          </p>
        </div>

        {/* GRID CÔNG TRÌNH - 2 HÀNG x 4 CỘT */}
        {projects.length === 0 ? (
           <p className="text-center text-gray-400 italic py-10">Admin chưa chọn dự án tiêu biểu nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full"
              >
                {/* PHẦN HÌNH ẢNH */}
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  {/* Badge Category */}
                  <div className="absolute top-4 left-4 z-10">
                    {/* <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                      {project.category}
                    </span> */}
                  </div>
                </div>

                {/* PHẦN NỘI DUNG */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-black group-hover:text-green-500 transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                    <Link 
                      to={`/hang-muc/cong-trinh-chi-tiet/${project.id}`} 
                      className="text-sm font-semibold text-gray-500 group-hover:text-green-500 flex items-center gap-2 transition-colors uppercase tracking-wide"
                    >
                      Khám phá
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-16 flex justify-center">
          <Link 
            to="/hang-muc-cong-trinh" 
            className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-green-500 transition-colors duration-300 rounded-sm shadow-lg hover:shadow-green-500/30"
          >
            Xem Tất Cả Công Trình
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;