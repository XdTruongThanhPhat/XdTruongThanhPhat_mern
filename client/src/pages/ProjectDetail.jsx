import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Bổ sung thư viện thông báo
import { Helmet } from 'react-helmet-async';
import { generateSlug } from '../utils/slugify';

const ProjectDetail = () => {
  const { id } = useParams(); // Lấy ID công trình từ URL

  // Trích xuất MongoDB ObjectId thật từ slug (vd: "ten-ct-69fb0b..." → "69fb0b...")
  const realId = (() => {
    const match = id?.match(/([a-f0-9]{24})$/i);
    return match ? match[1] : id;
  })();

  // ==========================================
  // STATE LƯU TRỮ DỮ LIỆU TỪ BACKEND
  // ==========================================
  const [projectData, setProjectData] = useState(null);
  const [projectContent, setProjectContent] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState(null);
  const [allImages, setAllImages] = useState([]); // Gộp ảnh bìa và album ảnh lại

  // ==========================================
  // FETCH DỮ LIỆU KHI TRANG ĐƯỢC LOAD
  // ==========================================
  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        // 1. Fetch danh sách dự án để lấy thông tin cơ bản & dự án liên quan
        const projRes = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/list`);
        const projData = await projRes.json();

        if (projData.success) {
          // Tìm dự án hiện tại dùng realId (ObjectId thuần)
          const currentProject = projData.projects.find(p => p._id === realId);
          if (currentProject) {
            setProjectData(currentProject);
            setMainImage(currentProject.mainImage);
            
            // Gộp ảnh bìa và các ảnh dự án vào 1 mảng để đưa vào Gallery
            const imagesArray = [currentProject.mainImage, ...(currentProject.projectImages || [])];
            setAllImages(imagesArray);
          }

          // Lọc ra các dự án liên quan (Khác ID hiện tại, lấy tối đa 4-8 cái)
          const related = projData.projects.filter(p => p._id !== realId).slice(0, 8);
          setRelatedProjects(related);
        }

        // 2. Fetch bài viết chi tiết (Content) của dự án này
        const contentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/content/${realId}`);
        const contentData = await contentRes.json();

        if (contentData.success && contentData.content) {
          setProjectContent(contentData.content.sections);
        } else {
          setProjectContent([]); // Nếu chưa có bài viết thì mảng rỗng
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu công trình:", error);
      } finally {
        setLoading(false);
      }
    };

    if (realId) {
      fetchProjectDetails();
      // Scroll lên đầu trang khi chuyển đổi giữa các dự án
      window.scrollTo(0, 0); 
    }
  }, [id]);

  // Logic xử lý Gallery (Dùng biến allImages lấy từ Database)
  const maxThumbnails = 5;
  const visibleThumbnails = allImages.slice(0, maxThumbnails);
  const remainingCount = allImages.length - maxThumbnails;

  // State & Logic cho Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = () => setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  // ==========================================
  // STATE VÀ LOGIC GỬI FORM TƯ VẤN (BÁO GIÁ)
  // ==========================================
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', area: '', location: '', type: 'Nhà phố', budget: '1.8 - 2.3 tỷ', details: ''
  });
  
  // State vô hiệu hóa nút bấm trong lúc đợi phản hồi
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi yêu cầu báo giá...");

    try {
      // Bắn dữ liệu về đúng API /project-details
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/project-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (data.success) {
        toast.success("Gửi yêu cầu thành công! Kiến trúc sư sẽ liên hệ lại sớm nhất.", { id: toastId });
        // Xóa trắng dữ liệu trên form
        setFormData({ 
          name: '', phone: '', email: '', area: '', location: '', type: 'Nhà phố', budget: '1.8 - 2.3 tỷ', details: ''
        });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu báo giá:", error);
      toast.error("Lỗi kết nối máy chủ!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Màn hình Loading trong lúc chờ gọi API
  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-green-600 animate-pulse">Đang tải dữ liệu công trình...</p>
      </div>
    );
  }

  // Nếu ID sai hoặc dự án bị xóa
  if (!projectData) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-red-500">Không tìm thấy công trình này!</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{projectData.title} | Trường Thành Phát</title>
        <meta name="description" content={`Dự án: ${projectData.title} tại ${projectData.info?.location || 'đang cập nhật'}. Khám phá thiết kế và quá trình thi công chi tiết.`} />
        <meta property="og:title" content={projectData.title} />
        {mainImage && <meta property="og:image" content={mainImage} />}
      </Helmet>
      <section className="pt-32 pb-16 bg-gray-50 min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* TIÊU ĐỀ TRANG CHI TIẾT */}
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-black">
              {projectData.title}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative items-start">
            
            {/* CỘT TRÁI: NỘI DUNG CÔNG TRÌNH */}
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-10">
              
              {/* 1. GALLERY HÌNH ẢNH */}
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <div 
                  className="w-full rounded-md overflow-hidden mb-4 relative group cursor-pointer bg-gray-100 flex items-center justify-center"
                  onClick={() => openLightbox(allImages.indexOf(mainImage))}
                >
                  <img 
                    src={mainImage} 
                    alt="Main Project" 
                    style={{ maxWidth: '100%', maxHeight: '70vh', width: 'auto', height: 'auto', display: 'block', margin: '0 auto' }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  </div>
                </div>
                
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {visibleThumbnails.map((img, idx) => {
                      const isLast = idx === maxThumbnails - 1;
                      const hasMore = remainingCount > 0;

                      return (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (isLast && hasMore) openLightbox(idx);
                            else setMainImage(img);
                          }}
                          className={`relative cursor-pointer aspect-video rounded-sm overflow-hidden border-2 transition-all ${
                            mainImage === img && (!isLast || !hasMore) ? 'border-green-500 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                          
                          {isLast && hasMore && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold hover:bg-black/80 transition-colors">
                              +{remainingCount}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 2. BOX THÔNG TIN CÔNG TRÌNH */}
              <div className="rounded-md overflow-hidden shadow-sm">
                <div className="bg-[#1A1A1A] text-center py-4 px-2 border-b border-green-500">
                  <p className="text-green-500 text-sm uppercase tracking-widest font-semibold mb-1">Thông tin công trình</p>
                  <h3 className="text-white text-lg font-medium">{projectData.title}</h3>
                </div>
                {/* Thay đổi md:grid-cols-5 thành md:grid-cols-4 và bỏ các col-span thừa */}
                <div className="bg-green-500 grid grid-cols-2 md:grid-cols-4 divide-x divide-green-600 divide-y md:divide-y-0 text-white">
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Vị trí</span>
                    <span className="text-sm text-green-50">{projectData.info?.location || "Đang cập nhật"}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Số tầng</span>
                    <span className="text-sm text-green-50">{projectData.info?.floors || "-"}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Diện tích XD</span>
                    <span className="text-sm text-green-50">{projectData.info?.buildArea || "-"}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Chi phí XD</span>
                    <span className="text-sm text-green-50">{projectData.info?.cost || "Liên hệ"}</span>
                  </div>
                </div>
              </div>

              {/* 3. NỘI DUNG BÀI VIẾT (Render theo mảng sections từ DB) */}
              <div className="bg-white p-6 md:p-8 rounded-md shadow-sm border border-gray-100 text-gray-700 leading-relaxed">
                {projectContent.length > 0 ? (
                  projectContent.map((section, index) => (
                    <div key={index}>
                      {/* Render Heading nếu có */}
                      {section.heading && (
                        <h2 className="text-xl md:text-2xl font-bold text-black mt-8 mb-4 first:mt-0">
                          {section.heading}
                        </h2>
                      )}
                      
                      {/* Render Paragraph nếu có */}
                      {section.paragraph && (
                        <p className="text-justify text-base mb-6 text-gray-600 whitespace-pre-line">
                          {section.paragraph}
                        </p>
                      )}
                      
                      {/* Render Image & Caption nếu có */}
                      {section.imageUrl && (
                        <div className="my-8">
                          <img src={section.imageUrl} alt="Project content" className="w-full rounded-sm object-cover" />
                          {section.caption && (
                            <div className="bg-gray-100 text-gray-500 text-center py-2 text-sm italic font-medium mt-1">
                              {section.caption}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center italic text-gray-500">Nội dung chi tiết đang được cập nhật...</p>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: FORM TƯ VẤN */}
            <div className="lg:w-1/3 xl:w-1/4 sticky top-28 z-10 w-full">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-[#1A1A1A] text-center py-3 border-b-2 border-green-500">
                  <h3 className="text-green-500 text-lg font-bold uppercase tracking-wider">Nhận tư vấn ngay</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                  <input required type="text" placeholder="Họ và tên (*)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm"/>
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="tel" placeholder="SĐT (*)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"/>
                    <input required type="email" placeholder="Email (*)" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"/>
                  </div>
                  <input required type="text" placeholder="Diện tích sàn & số tầng (*)" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"/>
                  <input required type="text" placeholder="Địa phương muốn xây (*)" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"/>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-600">
                    <option>Loại hình xây dựng (*)</option>
                    <option>Nhà phố</option>
                    <option>Biệt thự</option>
                    <option>Căn hộ</option>
                  </select>
                  <div className="bg-gray-50 p-2 border border-gray-100 rounded-sm">
                    <p className="font-bold text-gray-700 mb-2 text-xs">Ngân sách dự kiến (*)</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="1.8 - 2.3 tỷ" checked={formData.budget === '1.8 - 2.3 tỷ'} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="accent-green-500" /> 1.8 - 2.3 tỷ</label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="2.4 - 2.9 tỷ" checked={formData.budget === '2.4 - 2.9 tỷ'} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="accent-green-500" /> 2.4 - 2.9 tỷ</label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="3 - 3.5 tỷ" checked={formData.budget === '3 - 3.5 tỷ'} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="accent-green-500" /> 3 - 3.5 tỷ</label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="budget" value="> 3.5 tỷ" checked={formData.budget === '> 3.5 tỷ'} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="accent-green-500" /> {`> 3.5 tỷ`}</label>
                    </div>
                  </div>
                  <textarea rows="2" placeholder="Yêu cầu chi tiết nếu có!" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm resize-none"></textarea>
                  <div className="pt-1">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full text-white font-bold uppercase tracking-widest py-2.5 rounded-sm shadow-md transition-colors text-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* 4. CÔNG TRÌNH LIÊN QUAN (Sử dụng dữ liệu fetch từ DB) */}
          {relatedProjects.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-10">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-black mb-6">
                Công trình liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProjects.map((item) => (
                  <Link 
                    to={`/hang-muc/cong-trinh-chi-tiet/${generateSlug(item.title)}-${item._id}`} // Dùng slug + _id để SEO
                    key={item._id}
                    className="group block rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-4/3 w-full overflow-hidden relative">
                      <img 
                        src={item.mainImage} // Ảnh bìa của công trình
                        alt={item.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <span className="text-white border border-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-black/20 backdrop-blur-sm">
                           Xem chi tiết
                         </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================
          LIGHTBOX MODAL (Toàn màn hình) - Giữ nguyên logic
      ========================================= */}
      {isLightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center select-none backdrop-blur-sm">
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-gray-400 hover:text-green-500 z-50 p-2 transition-colors">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="absolute top-5 left-5 text-white text-lg font-bold tracking-widest z-50 bg-black/50 px-4 py-1 rounded-full">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          <button onClick={prevImage} className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-green-500 z-50 p-2 md:p-4 bg-black/50 hover:bg-black/80 rounded-full transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div className="w-full max-w-6xl px-4 md:px-20 flex items-center justify-center h-[70vh]">
            <img 
              src={allImages[lightboxIndex]} 
              alt={`Gallery ${lightboxIndex}`} 
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>

          <button onClick={nextImage} className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-green-500 z-50 p-2 md:p-4 bg-black/50 hover:bg-black/80 rounded-full transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4">
             {allImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  onClick={() => setLightboxIndex(idx)}
                  className={`h-16 md:h-20 w-auto object-cover cursor-pointer border-2 transition-all rounded-sm ${lightboxIndex === idx ? 'border-green-500 opacity-100 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                />
             ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;