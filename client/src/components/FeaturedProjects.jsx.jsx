import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProjects = () => {
  // Dữ liệu mẫu (8 bài) - Đã bổ sung thêm trường description
  const projects = [
    {
      id: 1,
      title: 'Biệt Thự Vườn Sinh Thái',
      category: 'Nhà ở',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075',
      description: 'Không gian sống xanh mát, hòa hợp với thiên nhiên cùng thiết kế mở hiện đại mang lại cảm giác thư thái tuyệt đối cho gia chủ.'
    },
    {
      id: 2,
      title: 'Khu Căn Hộ Cao Cấp',
      category: 'Căn hộ',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000',
      description: 'Dự án căn hộ trung tâm với đầy đủ tiện ích 5 sao, nội thất sang trọng và tầm nhìn tuyệt đẹp bao quát toàn thành phố.'
    },
    {
      id: 3,
      title: 'Nhà Phố Liền Kề Hiện Đại',
      category: 'Nhà phố',
      imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000',
      description: 'Thiết kế tối ưu công năng, mặt tiền ấn tượng với các vật liệu thân thiện môi trường, giải pháp hoàn hảo cho gia đình trẻ.'
    },
    {
      id: 4,
      title: 'Penthouse Tiêu Chuẩn 5 Sao',
      category: 'Căn hộ',
      imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=2000',
      description: 'Đỉnh cao của sự xa hoa với không gian rộng lớn, hồ bơi vô cực riêng và hệ thống smarthome tiên tiến nhất hiện nay.'
    },
    {
      id: 5,
      title: 'Biệt Thự Nghỉ Dưỡng Biển',
      category: 'Nhà ở',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
      description: 'Tận hưởng làn gió biển mỗi ngày với thiết kế mang đậm phong cách nhiệt đới, kết hợp cảnh quan sân vườn rộng rãi.'
    },
    {
      id: 6,
      title: 'Nhà Phố Thương Mại (Shophouse)',
      category: 'Nhà phố',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070',
      description: 'Giải pháp hoàn hảo vừa ở vừa kinh doanh với mặt tiền rộng rãi, tọa lạc trên trục đường sầm uất nhất khu vực.'
    },
    {
      id: 7,
      title: 'Căn Hộ Duplex Triệu Đô',
      category: 'Căn hộ',
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000',
      description: 'Căn hộ thông tầng đẳng cấp với trần cao vượt trội, vách kính toàn cảnh đón trọn vẹn ánh sáng tự nhiên mỗi ngày.'
    },
    {
      id: 8,
      title: 'Vinhomes Riverside Phân Khu Mới',
      category: 'Công trình thực tế',
      imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=2000',
      description: 'Tuyệt tác kiến trúc tân cổ điển bên sông, mang đến không gian sống thượng lưu, riêng tư và hệ thống an ninh tuyệt đối.'
    }
  ];

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
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* PHẦN NỘI DUNG */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black group-hover:text-green-500 transition-colors duration-300 line-clamp-2">
                    {project.title}
                  </h3>
                  {/* PHẦN GIỚI THIỆU THÊM VÀO ĐÂY */}
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