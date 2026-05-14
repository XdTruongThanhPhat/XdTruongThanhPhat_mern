import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { generateSlug } from '../utils/slugify';

const CategoryProject = () => {
  // 1. CHUẨN HÓA BẢN ĐỒ ÁNH XẠ ĐÚNG 5 MỤC
  const categoryMap = [
    { name: "Tất cả", slug: "" },
    { name: "Nội thất", slug: "noi-that" },
    { name: "Biệt thự", slug: "biet-thu" },
    { name: "Căn hộ", slug: "can-ho" },
    { name: "Nhà phố", slug: "nha-pho" },
    { name: "Công trình thực tế", slug: "cong-trinh-thuc-te" }
  ];

  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const currentCategory = categoryMap.find(cat => cat.slug === categorySlug) || categoryMap[0];
  const activeTab = currentCategory.name;

  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/list`);
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

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8; 

  const handleTabClick = (slug) => {
    if (slug === "") {
      navigate('/hang-muc-cong-trinh');
    } else {
      navigate(`/hang-muc-cong-trinh/${slug}`);
    }
  };

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeTab]);

  return (
    <section className="pt-24 md:pt-32 pb-10 md:pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* THANH CHỌN HẠNG MỤC */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6 mb-8 md:mb-16 relative z-10">
          {categoryMap.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleTabClick(cat.slug)}
              className={`px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border rounded-full ${
                activeTab === cat.name 
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10 md:py-20">
            <p className="text-gray-500 text-sm md:text-base font-medium animate-pulse">Đang tải danh sách công trình...</p>
          </div>
        ) : (
          <>
            {currentProjects.length === 0 ? (
                <div className="text-center py-10 text-xs md:text-sm text-gray-500">Chưa có công trình nào trong hạng mục này.</div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-0">
                {currentProjects.map((project) => (
                    // CẬP NHẬT LẠI URL BAO GỒM SLUG VÀ ID ĐỂ TỐI ƯU SEO
                    <Link 
                      to={`/hang-muc/cong-trinh-chi-tiet/${generateSlug(project.title)}-${project._id}`} 
                      key={project._id}
                      className="group bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full rounded-sm"
                    >
                    <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                        <img
                        src={project.mainImage} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="p-2.5 md:p-5 border border-t-0 border-gray-100 flex-1 flex flex-col justify-between">
                        <div>
                        <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></span>
                            <span className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider line-clamp-1">{project.category}</span>
                        </div>
                        <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-black uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-green-500 transition-colors">
                            {project.title}
                        </h3>
                        </div>
                        
                        <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-50 flex justify-between items-center shrink-0">
                            <span className="text-[8px] md:text-[10px] text-gray-400 italic">
                                {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="text-[8px] md:text-[10px] font-bold text-black group-hover:text-green-500 transition-colors uppercase">Xem thêm</span>
                        </div>
                    </div>
                    </Link>
                ))}
                </div>
            )}

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
            <div className="mt-8 md:mt-16 flex justify-center items-center gap-1 md:gap-2">
                <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1.5 md:p-2 border rounded-sm transition-colors ${currentPage === 1 ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-black border-gray-300 hover:bg-black hover:text-white'}`}
                >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-7 h-7 md:w-10 md:h-10 text-[10px] md:text-xs font-bold transition-all duration-300 rounded-sm border ${
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
                className={`p-1.5 md:p-2 border rounded-sm transition-colors ${currentPage === totalPages ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-black border-gray-300 hover:bg-black hover:text-white'}`}
                >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
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