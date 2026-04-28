import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

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
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  // Xác định Tab đang active dựa vào URL hiện tại
  const currentCategory = categoryMap.find(cat => cat.slug === categorySlug) || categoryMap[0];
  const activeTab = currentCategory.name;

  // 3. State quản lý dữ liệu từ MongoDB
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DỮ LIỆU TỪ BACKEND
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects/list');
        const data = await response.json();
        
        if (data.success) {
          setAllProjects(data.projects);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách công trình:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Cấu hình phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8; 

  // Xử lý chuyển URL khi nhấn vào nút hạng mục
  const handleTabClick = (slug) => {
    if (slug === "") {
      navigate('/hang-muc-cong-trinh');
    } else {
      navigate(`/hang-muc-cong-trinh/${slug}`);
    }
  };

  // 4. Lọc dữ liệu dựa trên hạng mục đang chọn
  const filteredProjects = activeTab === "Tất cả" 
    ? allProjects 
    : allProjects.filter(p => p.category === activeTab);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Đặt lại về trang 1 mỗi khi đổi hạng mục
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
              onClick={() => handleTabClick(cat.slug)}
              className={`px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border rounded-full ${
                activeTab === cat.name 
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* XỬ LÝ GIAO DIỆN KHI ĐANG TẢI */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 font-medium animate-pulse">Đang tải danh sách công trình...</p>
          </div>
        ) : (
          <>
            {/* LƯỚI CÔNG TRÌNH */}
            {currentProjects.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Chưa có công trình nào trong hạng mục này.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
                {currentProjects.map((project) => (
                    <Link 
                    to={`/hang-muc/cong-trinh-chi-tiet/${project._id}`} // Dùng _id của MongoDB
                    key={project._id}
                    className="group bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full rounded-sm"
                    >
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                        src={project.mainImage} // Dùng mainImage của MongoDB
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
                            {/* Định dạng lại ngày tháng từ createdAt */}
                            <span className="text-[10px] text-gray-400 italic">
                                {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="text-[10px] font-bold text-black group-hover:text-green-500 transition-colors uppercase">Xem thêm</span>
                        </div>
                    </div>
                    </Link>
                ))}
                </div>
            )}

            {/* PHÂN TRANG */}
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
          </>
        )}

      </div>
    </section>
  );
};

export default CategoryProject;