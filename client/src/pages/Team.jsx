import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../components/Breadcrumb';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const Team = () => {
  // Thay dữ liệu cứng bằng State rỗng chờ API
  const [teamData, setTeamData] = useState({
      bannerUrl: '',
      management: [],
      officeStaff: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch API khi trang vừa load
  useEffect(() => {
      const fetchTeam = async () => {
          try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
              const data = await res.json();
              if (data.success && data.team) {
                  setTeamData(data.team);
              }
          } catch (error) {
              console.error("Lỗi khi tải dữ liệu Team:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchTeam();
  }, []);

  if (loading) return <div className="pt-24 md:pt-32 text-center min-h-screen text-sm md:text-base text-gray-500">Đang tải dữ liệu...</div>;

  return (
    // TỐI ƯU: Giảm padding trên và dưới cho mobile
    <section className="pt-24 md:pt-32 pb-10 md:pb-20 bg-white min-h-screen">
      <Helmet>
        <title>Đội Ngũ Nhân Sự | Trường Thành Phát</title>
        <meta name="description" content="Đội ngũ kiến trúc sư và kỹ sư xây dựng chuyên nghiệp tại Trường Thành Phát" />
        <link rel="canonical" href="https://truongthanhphatdn.vn/ve-ttp/doi-ngu-nhan-su" />
        {/* OG Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Đội Ngũ Nhân Sự | Trường Thành Phát" />
        <meta property="og:description" content="Đội ngũ kiến trúc sư và kỹ sư xây dựng chuyên nghiệp tại Trường Thành Phát" />
        <meta property="og:url" content="https://truongthanhphatdn.vn/ve-ttp/doi-ngu-nhan-su" />
        <meta property="og:image" content="https://truongthanhphatdn.vn/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Đội Ngũ Nhân Sự | Trường Thành Phát" />
        <meta name="twitter:description" content="Đội ngũ kiến trúc sư và kỹ sư xây dựng chuyên nghiệp tại Trường Thành Phát" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb SEO */}
        <Breadcrumb items={[
          { label: 'Về TTP', link: '/ve-ttp' },
          { label: 'Đội ngũ nhân sự' }
        ]} />
        
        {/* PHẦN 1: BANNER TẬP THỂ */}
        {teamData.bannerUrl && (
          // TỐI ƯU: Giảm margin-bottom và bo góc nhỏ lại trên mobile
          <div className="mb-10 md:mb-20 overflow-hidden rounded-lg md:rounded-xl shadow-md md:shadow-2xl">
            {/* TỐI ƯU: Giảm chiều cao của Banner trên mobile (h-[25vh]) để không chiếm hết màn hình */}
            <div className="relative h-[25vh] sm:h-[40vh] md:h-[65vh]">
              <img 
                src={optimizeCloudinaryUrl(teamData.bannerUrl, 1920)} 
                alt="TTP Team Group" 
                className="w-full h-full object-cover"
                fetchpriority="high"
              />
            </div>
          </div>
        )}

        {/* PHẦN 2: ĐỘI NGŨ QUẢN LÝ */}
        {teamData.management.length > 0 && (
          <div className="mb-14 md:mb-24">
            <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-12">
               <div className="h-px bg-gray-200 grow"></div>
               {/* TỐI ƯU: Thu nhỏ chữ tiêu đề */}
               <h2 className="text-base md:text-2xl font-bold uppercase tracking-widest text-black text-center px-2 md:px-4">
                 Đội Ngũ Quản Lý
               </h2>
               <div className="h-px bg-gray-200 grow"></div>
            </div>
            
            {/* TỐI ƯU GRID: ÉP DUY TRÌ BỐ CỤC NHƯ MÁY TÍNH TRÊN MOBILE.
                - Nếu 1 người: Giữ 1 cột, thu nhỏ chiều rộng.
                - Nếu 2 người: Ép 2 cột (grid-cols-2) ngay cả trên mobile.
                - Nếu 3 người: Ép 3 cột (grid-cols-3) ngay cả trên mobile.
                - Nếu >= 4 người: Ép 2 cột trên mobile và 4 cột trên PC (để ảnh không bị mỏng như sợi chỉ).
            */}
            <div className={`grid ${
                teamData.management.length === 1 ? "grid-cols-1 max-w-[50%] md:max-w-sm mx-auto" :
                teamData.management.length === 2 ? "grid-cols-2 gap-3 md:gap-12 max-w-full md:max-w-3xl mx-auto" :
                teamData.management.length === 3 ? "grid-cols-3 gap-2 md:gap-10 max-w-full md:max-w-5xl mx-auto" :
                "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-8"
            }`}>
              {teamData.management.map((leader) => (
                <div key={leader._id} className="text-center group">
                  {/* TỐI ƯU: Giảm margin-bottom của ảnh */}
                  <div className="aspect-3/4 overflow-hidden rounded-sm mb-2 md:mb-6 bg-gray-50 border border-gray-100 shadow-sm relative">
                    <img 
                      src={optimizeCloudinaryUrl(leader.imageUrl, 500)} 
                      alt={leader.name} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                  {/* TỐI ƯU: Thu nhỏ cỡ chữ Tên và Chức vụ để nhét vừa bố cục ép cột */}
                  <h3 className="text-[11px] sm:text-sm md:text-lg font-bold text-black uppercase tracking-tight md:tracking-wide group-hover:text-green-500 transition-colors">
                    {leader.name}
                  </h3>
                  <p className="text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-400 mt-0.5 md:mt-1 uppercase tracking-widest italic border-t border-gray-100 pt-1 md:pt-2 inline-block">
                    {leader.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHẦN 3: NHÂN VIÊN VĂN PHÒNG */}
        {teamData.officeStaff.length > 0 && (
          // TỐI ƯU: Giảm padding Box xám trên mobile
          <div className="bg-gray-50 py-8 px-3 md:py-16 md:px-6 rounded-lg md:rounded-2xl border border-gray-100">
            {/* TỐI ƯU: Thu nhỏ tiêu đề */}
            <h2 className="text-sm md:text-2xl font-bold uppercase tracking-widest text-black text-center mb-6 md:mb-16">
              Nhân viên tại văn phòng TTP
            </h2>
            
            {/* TỐI ƯU: Vẫn giữ 2 cột trên Mobile (như cũ) nhưng giảm gap xuống gap-2 để gọn gàng hơn */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
              {teamData.officeStaff.map((staff) => (
                <div key={staff._id} className="aspect-3/4 overflow-hidden rounded-sm shadow-sm md:shadow-md hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 group">
                  <img 
                    src={optimizeCloudinaryUrl(staff.imageUrl, 400)} 
                    alt="TTP Staff" 
                    className="w-full h-full object-cover transition-all duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Team;