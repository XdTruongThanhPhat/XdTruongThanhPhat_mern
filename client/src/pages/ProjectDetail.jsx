import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();

  // ==========================================
  // DỮ LIỆU MẪU (MOCK DATA)
  // ==========================================
  const project = {
    id: id,
    title: "L's House – Nhà đẹp hiện đại, thông thoáng tại Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=2000"
    ],
    info: {
      location: "An Sơn, Hòa Ninh, Hòa Vang, Đà Nẵng",
      floors: "02",
      landArea: "14x24m",
      buildArea: "12x15m",
      cost: "3.5 tỷ (2019)"
    },
    content: [
      { type: "heading", value: "Yêu cầu thiết kế từ gia chủ" },
      { type: "text", value: "Nội thất của L's House sở hữu một cá tính riêng phù hợp với yêu cầu thẩm mỹ và công năng của gia chủ. Là một người yêu thích phong cách sống tối giản, chị L đã yêu cầu TTP Architect thiết kế nội thất hiện đại song không quá cầu kỳ và rườm rà." },
      { type: "image", value: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000", caption: "Với sự tối ưu của công năng trong thiết kế, sang trọng trong nội thất." },
      { type: "heading", value: "Giải pháp không gian bếp hiện đại" },
      { type: "text", value: "Các KTS giàu kinh nghiệm của TTP Architect đã hướng thiết kế phòng bếp tới sự hiện đại, thoải mái, nhiều ánh sáng. Bộ bàn ăn chân cao, gam màu xanh lá điểm xuyết của ốp tường... đã góp phần tạo nên không gian bếp ấm áp. Nơi gia đình có những bữa ăn tràn ngập yêu thương." },
      { type: "image", value: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070", caption: "Phòng bếp ấp áp với điểm nhấn bừng sáng không gian" }
    ]
  };

  // Dữ liệu cho các công trình liên quan
  const relatedProjects = [
    { id: 2, title: 'Nội Thất Căn Hộ Penthouse', imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Thiết Kế Kiến Trúc Cao Ốc', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Nhà Phố Liền Kề Khang Điền', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Căn Hộ Centana Thủ Thiêm', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Nhà Ở Xã Hội Hòa Khánh', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'Thi công thực tế Biệt thự A', imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'Nội Thất Nhà Phố Tân Cổ', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800' },
    { id: 9, title: 'Dự án Kiến Trúc Xanh', imageUrl: 'https://images.unsplash.com/photo-1518005020251-58296d87ea0b?auto=format&fit=crop&q=80&w=800' },
  ];

  const [mainImage, setMainImage] = useState(project.images[0]);
  
  // Logic xử lý Gallery
  const maxThumbnails = 5;
  const visibleThumbnails = project.images.slice(0, maxThumbnails);
  const remainingCount = project.images.length - maxThumbnails;

  // State & Logic cho Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = () => setLightboxIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));

  // State form tư vấn
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', area: '', location: '', type: 'Nhà phố', budget: '1.8 - 2.3 tỷ', details: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu gửi đi:", formData);
    alert("Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
    setFormData({ name: '', phone: '', email: '', area: '', location: '', type: 'Nhà phố', budget: '1.8 - 2.3 tỷ', details: ''});
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-gray-50 min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* TIÊU ĐỀ TRANG CHI TIẾT */}
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-black">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative items-start">
            
            {/* CỘT TRÁI: NỘI DUNG CÔNG TRÌNH */}
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-10">
              
              {/* 1. GALLERY HÌNH ẢNH */}
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <div 
                  className="w-full aspect-video rounded-md overflow-hidden mb-4 relative group cursor-pointer"
                  onClick={() => openLightbox(project.images.indexOf(mainImage))}
                >
                  <img 
                    src={mainImage} 
                    alt="Main Project" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  </div>
                </div>
                
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
              </div>

              {/* 2. BOX THÔNG TIN CÔNG TRÌNH */}
              <div className="rounded-md overflow-hidden shadow-sm">
                <div className="bg-[#1A1A1A] text-center py-4 px-2 border-b border-green-500">
                  <p className="text-green-500 text-sm uppercase tracking-widest font-semibold mb-1">Thông tin công trình</p>
                  <h3 className="text-white text-lg font-medium">{project.title}</h3>
                </div>
                <div className="bg-green-500 grid grid-cols-2 md:grid-cols-5 divide-x divide-green-600 divide-y md:divide-y-0 text-white">
                  <div className="p-4 flex flex-col items-center text-center col-span-2 md:col-span-1">
                    <span className="font-bold mb-1">Vị trí</span>
                    <span className="text-sm text-green-50">{project.info.location}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Số tầng</span>
                    <span className="text-sm text-green-50">{project.info.floors}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Diện tích đất</span>
                    <span className="text-sm text-green-50">{project.info.landArea}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <span className="font-bold mb-1">Diện tích XD</span>
                    <span className="text-sm text-green-50">{project.info.buildArea}</span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center col-span-2 md:col-span-1">
                    <span className="font-bold mb-1">Chi phí XD</span>
                    <span className="text-sm text-green-50">{project.info.cost}</span>
                  </div>
                </div>
              </div>

              {/* 3. NỘI DUNG BÀI VIẾT */}
              <div className="bg-white p-6 md:p-8 rounded-md shadow-sm border border-gray-100 text-gray-700 leading-relaxed">
                {project.content.map((block, index) => {
                  if (block.type === 'heading') {
                    return <h2 key={index} className="text-xl md:text-2xl font-bold text-black mt-8 mb-4 first:mt-0">{block.value}</h2>;
                  } else if (block.type === 'text') {
                    return <p key={index} className="text-justify text-base mb-6 text-gray-600">{block.value}</p>;
                  } else if (block.type === 'image') {
                    return (
                      <div key={index} className="my-8">
                        <img src={block.value} alt="Project content" className="w-full rounded-sm object-cover" />
                        {block.caption && <div className="bg-gray-100 text-gray-500 text-center py-2 text-sm italic font-medium mt-1">{block.caption}</div>}
                      </div>
                    );
                  }
                  return null;
                })}
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
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest py-2.5 rounded-sm shadow-md transition-colors text-sm">Gửi yêu cầu ngay</button>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* 4. CÔNG TRÌNH LIÊN QUAN */}
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-black mb-6">
              Công trình liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProjects.map((item) => (
                <Link 
                  to={`/hang-muc/cong-trinh-chi-tiet/${item.id}`} 
                  key={item.id}
                  className="group block rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-4/3 w-full overflow-hidden relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    {/* Lớp phủ mờ khi di chuột */}
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

        </div>
      </section>

      {/* =========================================
          LIGHTBOX MODAL (Toàn màn hình)
      ========================================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-100 bg-black/95 flex flex-col items-center justify-center select-none backdrop-blur-sm">
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-gray-400 hover:text-green-500 z-50 p-2 transition-colors">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="absolute top-5 left-5 text-white text-lg font-bold tracking-widest z-50 bg-black/50 px-4 py-1 rounded-full">
            {lightboxIndex + 1} / {project.images.length}
          </div>

          <button onClick={prevImage} className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-green-500 z-50 p-2 md:p-4 bg-black/50 hover:bg-black/80 rounded-full transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div className="w-full max-w-6xl px-4 md:px-20 flex items-center justify-center h-[70vh]">
            <img 
              src={project.images[lightboxIndex]} 
              alt={`Gallery ${lightboxIndex}`} 
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>

          <button onClick={nextImage} className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-green-500 z-50 p-2 md:p-4 bg-black/50 hover:bg-black/80 rounded-full transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4">
             {project.images.map((img, idx) => (
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