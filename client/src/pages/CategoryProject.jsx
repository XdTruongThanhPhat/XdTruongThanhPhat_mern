import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Thay useSearchParams bằng useParams & useNavigate

const CategoryProject = () => {
  // 1. Tạo bản đồ ánh xạ (Mapping) giữa Tên hiển thị và Đường dẫn URL (slug)
  const categoryMap = [
    { name: "Tất cả", slug: "" },
    { name: "Nội thất", slug: "noi-that" },
    { name: "Nhà ở", slug: "nha-o" },
    { name: "Căn hộ", slug: "can-ho" },
    { name: "Nhà phố", slug: "nha-pho" },
    { name: "Công trình thực tế", slug: "cong-trinh-thuc-te" }
  ];

  // 2. Lấy thông tin đường dẫn từ URL
  const { categorySlug } = useParams(); // Lấy chữ "nha-o", "noi-that" từ URL
  const navigate = useNavigate(); // Dùng để chuyển trang

  // Xác định Tab đang active dựa vào URL hiện tại (nếu sai hoặc trống thì về "Tất cả")
  const currentCategory = categoryMap.find(cat => cat.slug === categorySlug) || categoryMap[0];
  const activeTab = currentCategory.name;

  // 3. Dữ liệu mẫu (Giữ nguyên)
  const [allProjects, setAllProjects] = useState([
    { id: 1, title: 'Biệt Thự Vườn Sinh Thái', category: 'Nhà ở', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800', date: '2024-03-20' },
    { id: 2, title: 'Nội Thất Căn Hộ Penthouse', category: 'Nội thất', imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800', date: '2024-03-18' },
    { id: 3, title: 'Thiết Kế Kiến Trúc Cao Ốc TTP', category: 'Kiến trúc', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', date: '2024-03-15' },
    { id: 4, title: 'Nhà Phố Liền Kề Khang Điền', category: 'Nhà phố', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', date: '2024-03-12' },
    { id: 5, title: 'Căn Hộ Centana Thủ Thiêm', category: 'Căn hộ', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', date: '2024-03-10' },
    { id: 6, title: 'Nhà Ở Xã Hội Hòa Khánh', category: 'Nhà ở', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800', date: '2024-03-08' },
    { id: 7, title: 'Thi công thực tế Biệt thự A', category: 'Công trình thực tế', imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800', date: '2024-03-05' },
    { id: 8, title: 'Nội Thất Nhà Phố Tân Cổ Điển', category: 'Nội thất', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', date: '2024-03-01' },
    { id: 9, title: 'Dự án Kiến Trúc Xanh', category: 'Kiến trúc', imageUrl: 'https://images.unsplash.com/photo-1518005020251-58296d87ea0b?auto=format&fit=crop&q=80&w=800', date: '2024-02-25' },
    { id: 10, title: 'Căn Hộ Studio Quận 1', category: 'Căn hộ', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800', date: '2024-02-20' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8; 

  // Xử lý chuyển URL khi nhấn vào nút hạng mục
  const handleTabClick = (slug) => {
    if (slug === "") {
      navigate('/hang-muc-cong-trinh'); // Nếu "Tất cả" thì đưa về gốc cho sạch
    } else {
      navigate(`/hang-muc-cong-trinh/${slug}`); // Nếu chọn mục khác, thêm slug vào URL
    }
  };

  // 4. Lọc dữ liệu dựa trên Tên Tiếng Việt của hạng mục
  const filteredProjects = activeTab === "Tất cả" 
    ? allProjects 
    : allProjects.filter(p => p.category === activeTab);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <section className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* THANH CHỌN HẠNG MỤC */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-16 relative z-10">
          {categoryMap.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleTabClick(cat.slug)} // Chạy hàm đẩy URL
              className={`px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border rounded-full ${
                activeTab === cat.name // So sánh để làm nổi bật nút đang chọn
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LƯỚI CÔNG TRÌNH VÀ PHÂN TRANG GIỮ NGUYÊN 100% CẤU TRÚC HTML */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
          {currentProjects.map((project) => (
            <Link 
              to={`/hang-muc/cong-trinh-chi-tiet/${project.id}`} 
              key={project.id}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full rounded-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                   </div>
                </div>
              </div>

              <div className="p-5 border border-t-0 border-gray-100 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{project.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-green-500 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                   <span className="text-[10px] text-gray-400 italic">{project.date}</span>
                   <span className="text-[10px] font-bold text-black group-hover:text-green-500 transition-colors uppercase">Xem thêm</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 border rounded-sm transition-colors ${currentPage === 1 ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-black border-gray-300 hover:bg-black hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 text-xs font-bold transition-all duration-300 rounded-sm border ${
                  currentPage === index + 1 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded-sm transition-colors ${currentPage === totalPages ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-black border-gray-300 hover:bg-black hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default CategoryProject;