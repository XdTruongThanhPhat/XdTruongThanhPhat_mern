import React, { useState, useEffect } from 'react';

const Process = () => {
  // Tạm thời dùng Mock Data, sau này sẽ thay bằng State fetch từ API: 
  // const [processSteps, setProcessSteps] = useState([]);
  
  const processSteps = [
    {
      stepNumber: '01',
      title: 'TRAO ĐỔI TƯ VẤN',
      description: 'Trao đổi yêu cầu, tư vấn định hướng ý tường, phong cách và mức đầu tư.',
    },
    {
      stepNumber: '02',
      title: 'BÁO GIÁ QUY TRÌNH',
      description: 'Gửi khách hàng báo giá theo đúng gói thiết kế mà Khách Hàng đang đề cập, kèm quy trình làm việc cụ thể, chi tiết.',
    },
    {
      stepNumber: '03',
      title: 'KÝ HỢP ĐỒNG',
      description: 'Thực hiện các thủ tục hành chính và bắt đầu triển khai các công việc theo tiến độ thống nhất.',
    },
    {
      stepNumber: '04',
      title: 'BÀN GIAO & QUYẾT TOÁN',
      description: 'Sau khi thống nhất hồ sơ báo cáo tiến độ, khách hàng thanh toán lần cuối giá trị HĐ còn lại trước khi nhận hồ sơ hoàn chỉnh.',
    }
  ];

  return (
    <section className="py-10 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ SECTION */}
        <div className="text-center mb-10 md:mb-16 relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Quy Trình Làm Việc
          </h2>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto mt-2 md:mt-4 mb-3 md:mb-6"></div>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Tại Trường Thành Phát, chúng tôi áp dụng quy trình làm việc chuẩn mực và minh bạch, giúp tối ưu thời gian, chi phí và mang lại sự an tâm tuyệt đối.
          </p>
        </div>

        {/* LƯỚI QUY TRÌNH */}
        <div className="relative">
          {/* Đường line đứt nét chạy ngang kết nối các bước (Chỉ hiện trên PC) */}
          <div className="hidden lg:block absolute top-10 xl:top-12 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-gray-200 z-0"></div>

          {/* TỐI ƯU: Đưa về grid 2 cột trên điện thoại (grid-cols-2), 4 cột trên PC (lg:grid-cols-4), giảm gap */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-12 relative z-10">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col items-center text-center p-3 sm:p-4 md:p-6 bg-white rounded-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-100"
              >
                {/* Số thứ tự lớn (Chìm phía sau) */}
                {/* TỐI ƯU: Giảm kích thước số mờ phía sau trên điện thoại */}
                <span className="absolute -top-3 md:-top-6 right-1 md:right-2 text-5xl sm:text-6xl md:text-8xl font-black text-gray-50 opacity-60 group-hover:text-green-50 group-hover:-translate-y-2 md:group-hover:-translate-y-3 transition-all duration-500 pointer-events-none z-0">
                  {step.stepNumber}
                </span>

                {/* Vòng tròn hiển thị số thứ tự nổi */}
                {/* TỐI ƯU: Thu nhỏ vòng tròn trên điện thoại (w-12 h-12) so với PC (md:w-24 md:h-24) */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black text-white group-hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/40 transition-all duration-500 mb-3 md:mb-6 z-10 transform group-hover:scale-110 border-2 md:border-4 border-white">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold">{step.stepNumber}</span>
                </div>

                {/* Nội dung */}
                {/* TỐI ƯU: Thu nhỏ cỡ chữ tiêu đề và mô tả trên điện thoại */}
                <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-black mb-1.5 md:mb-3 group-hover:text-green-500 transition-colors duration-300 z-10 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 leading-snug md:leading-relaxed z-10">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Process;