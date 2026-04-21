import React, { useState, useEffect } from 'react';

const Process = () => {
  // Tạm thời dùng Mock Data, sau này sẽ thay bằng State fetch từ API: 
  // const [processSteps, setProcessSteps] = useState([]);
  
  const processSteps = [
    {
      stepNumber: '01',
      title: 'Tư Vấn & Khảo Sát',
      description: 'Tiếp nhận yêu cầu, khảo sát mặt bằng thực tế và tư vấn sơ bộ về giải pháp không gian, phong thủy, và chi phí dự kiến.',
    },
    {
      stepNumber: '02',
      title: 'Thiết Kế Kiến Trúc',
      description: 'Lên ý tưởng thiết kế 2D, 3D chi tiết. Thống nhất bản vẽ phối cảnh, công năng sử dụng và vật liệu với chủ đầu tư.',
    },
    {
      stepNumber: '03',
      title: 'Báo Giá & Ký Kết',
      description: 'Lập bảng dự toán chi tiết, minh bạch từng hạng mục vật tư. Tiến hành ký kết hợp đồng thi công cam kết tiến độ.',
    },
    {
      stepNumber: '04',
      title: 'Thi Công & Bàn Giao',
      description: 'Triển khai thi công dưới sự giám sát chặt chẽ. Nghiệm thu, vệ sinh công nghiệp và bàn giao công trình hoàn thiện.',
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ SECTION */}
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Quy Trình Làm Việc
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tại Trường Thành Phát, chúng tôi áp dụng quy trình làm việc chuẩn mực và minh bạch, giúp tối ưu thời gian, chi phí và mang lại sự an tâm tuyệt đối.
          </p>
        </div>

        {/* LƯỚI QUY TRÌNH */}
        <div className="relative">
          {/* Đường line đứt nét chạy ngang kết nối các bước (Chỉ hiện trên PC) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col items-center text-center p-6 bg-white rounded-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-100"
              >
                {/* Số thứ tự lớn (Chìm phía sau) */}
                <span className="absolute -top-6 right-2 text-8xl font-black text-gray-50 opacity-60 group-hover:text-green-50 group-hover:-translate-y-3 transition-all duration-500 pointer-events-none z-0">
                  {step.stepNumber}
                </span>

                {/* Vòng tròn hiển thị số thứ tự nổi */}
                <div className="w-24 h-24 bg-black text-white group-hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/40 transition-all duration-500 mb-6 z-10 transform group-hover:scale-110 border-4 border-white">
                  <span className="text-2xl font-bold">{step.stepNumber}</span>
                </div>

                {/* Nội dung */}
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-green-500 transition-colors duration-300 z-10">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed z-10">
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