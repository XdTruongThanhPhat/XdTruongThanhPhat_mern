import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Quotation = () => {
  // Quản lý Tab đang hiển thị
  const [activeTab, setActiveTab] = useState('thiet-ke');

  const tabs = [
    { id: 'thiet-ke', label: 'Đơn Giá Thiết Kế' },
    { id: 'thi-cong-tho', label: 'Thi Công Phần Thô' },
    { id: 'thi-cong-tron-goi', label: 'Thi Công Trọn Gói' }
  ];

  // Dữ liệu mẫu cho từng Tab
  const designPrices = [
    {
      title: 'Nhà Phố',
      price: '150.000',
      unit: 'VNĐ/m2',
      features: [
        'Bản vẽ kiến trúc 2D',
        'Bản vẽ kết cấu, điện nước (M&E)',
        'Phối cảnh 3D ngoại thất',
        'Khái toán chi phí thi công',
      ]
    },
    {
      title: 'Căn hộ',
      price: '180.000',
      unit: 'VNĐ/m2',
      isPopular: true,
      features: [
        'Bản vẽ kiến trúc 2D chi tiết',
        'Bản vẽ kết cấu',
        'Phối cảnh 3D ngoại thất',
        'Phối cảnh 3D nội thất cơ bản',
      ]
    },
    {
      title: 'Biệt Thự ',
      price: '200.000',
      unit: 'VNĐ/m2',
      features: [
        'Bản vẽ kiến trúc',
        'Bản vẽ kết cấu',
        'Phối cảnh 3D ngoại thất',
        'Phối cảnh 3D nội thất cơ bản',
        'Bóc tách dự toán chi tiết',
      ]
    }
  ];

  const rawConstructionMaterials = [
    { name: 'Thép xây dựng', desc: 'Hòa Phát / Việt Nhật / Pomina' },
    { name: 'Xi măng', desc: 'Insee (Holcim) / Hà Tiên đa dụng' },
    { name: 'Gạch tuynel', desc: 'Gạch Tuynel Bình Dương / Đồng Nai (Kích thước 8x8x18)' },
    { name: 'Đá chẻ / Đá 1x2', desc: 'Đá Bình Điền, Hóa An (Sạch, không lẫn tạp chất)' },
    { name: 'Cát xây tô', desc: 'Cát vàng hạt lớn, hạt trung (Sạch, sàn kỹ)' },
    { name: 'Ống nước', desc: 'Bình Minh (PVC quy cách chuẩn)' },
    { name: 'Dây điện', desc: 'Cadivi (Cáp lõi đồng, tiêu chuẩn quốc gia)' },
    { name: 'Ống luồn dây điện', desc: 'Nano / Sino (Chống cháy)' },
    { name: 'Chống thấm', desc: 'Sika Latex, Kova CT11A cao cấp' },
  ];

  const fullConstructionPackages = [
    {
      title: 'Gói Tiêu Chuẩn',
      price: '5.500.000',
      unit: 'VNĐ/m2',
      desc: 'Phù hợp nhà phố cho thuê, kinh doanh, hoặc đầu tư tiết kiệm chi phí.',
    },
    {
      title: 'Gói Nâng Cao',
      price: '6.200.000',
      unit: 'VNĐ/m2',
      isPopular: true,
      desc: 'Sử dụng vật tư hoàn thiện thương hiệu uy tín, không gian sang trọng.',
    },
    {
      title: 'Gói Cao Cấp',
      price: '7.500.000',
      unit: 'VNĐ/m2',
      desc: 'Trang bị nội thất liền tường thông minh, thiết bị vệ sinh nhập khẩu.',
    }
  ];

  return (
    <section className="pt-32 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Bảng Báo Giá <span className="text-green-500">Xây Dựng</span>
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trường Thành Phát cam kết minh bạch vật tư, báo giá chính xác, không phát sinh chi phí trong suốt quá trình thi công.
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 rounded-full border-2 ${
                activeTab === tab.id 
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NỘI DUNG TỪNG TAB */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
          
          {/* ==================================
              TAB 1: THIẾT KẾ KIẾN TRÚC 
          ================================== */}
          {activeTab === 'thiet-ke' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold uppercase text-center mb-8 tracking-widest">Đơn Giá Thiết Kế Kiến Trúc & Nội Thất</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {designPrices.map((item, idx) => (
                  <div key={idx} className={`relative flex flex-col p-6 rounded-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${item.isPopular ? 'border-green-500' : 'border-gray-100 hover:border-gray-300'}`}>
                    {item.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Được chọn nhiều nhất
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-black uppercase tracking-wider text-center mb-2">{item.title}</h3>
                    <div className="text-center mb-6 border-b border-gray-100 pb-6">
                      <span className="text-3xl font-black text-green-500">{item.price}</span>
                      <span className="text-gray-500 text-sm ml-1">{item.unit}</span>
                    </div>
                    <ul className="flex-1 space-y-3 mb-8">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-600">
                          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/lien-he" className={`block text-center py-3 w-full font-bold uppercase tracking-widest text-sm transition-colors rounded-sm ${item.isPopular ? 'bg-green-500 text-white hover:bg-black' : 'bg-gray-100 text-black hover:bg-green-500 hover:text-white'}`}>
                      Nhận tư vấn
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================
              TAB 2: THI CÔNG PHẦN THÔ 
          ================================== */}
          {activeTab === 'thi-cong-tho' && (
            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-widest">Báo Giá Thi Công Phần Thô</h2>
                  <p className="text-gray-500 mt-2">Áp dụng cho nhà phố tiêu chuẩn có tổng diện tích thi công {'>'} 250m2</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Đơn giá tham khảo từ</p>
                  <p className="text-3xl font-black text-green-500">3.900.000-4.400.000 <span className="text-base text-black font-normal">VNĐ/m2</span></p>
                </div>
              </div>

              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span> Chi tiết vật tư sử dụng
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-black text-white uppercase tracking-wider text-sm">
                      <th className="p-4 rounded-tl-md">STT</th>
                      <th className="p-4">Chủng loại vật tư</th>
                      <th className="p-4 rounded-tr-md">Thương hiệu / Xuất xứ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rawConstructionMaterials.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-500 font-bold">0{idx + 1}</td>
                        <td className="p-4 font-bold text-gray-800">{item.name}</td>
                        <td className="p-4 text-gray-600">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

         {/* ==================================
              TAB 3: THI CÔNG TRỌN GÓI 
          ================================== */}
          {activeTab === 'thi-cong-tron-goi' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold uppercase text-center mb-4 tracking-widest">Đơn Giá Thi Công Trọn Gói (Chìa Khóa Trao Tay)</h2>
              <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
                Cam kết sử dụng đúng vật tư cam kết theo hợp đồng. Cung cấp báo giá dự toán chi tiết từng hạng mục bóc tách rành mạch trước khi thi công.
              </p>

              {/* Sử dụng flex và căn giữa để hiển thị 1 khung duy nhất */}
              <div className="flex justify-center">
                <div className="border-2 p-8 md:p-10 rounded-lg border-green-500 bg-green-50/30 w-full max-w-md shadow-lg transition-transform hover:-translate-y-1">
                  <div className="text-center">
                    <span className="inline-block bg-green-500 text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                      Phổ biến nhất
                    </span>
                    <h3 className="text-2xl font-bold text-black uppercase tracking-wider mb-3">Gói Tiêu Chuẩn</h3>
                    <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                      Phù hợp với hầu hết các nhu cầu xây dựng nhà phố, tối ưu chi phí nhưng vẫn đảm bảo chất lượng, không gian sang trọng và tiện nghi.
                    </p>
                    <div className="mb-8 flex items-baseline justify-center">
                      <span className="text-4xl font-black text-green-500">9.000.000-12.000.000</span>
                      <span className="text-gray-500 ml-2 font-medium text-sm">VNĐ/m2</span>
                    </div>
                    <Link to="/lien-he" className="block text-center py-4 w-full font-bold uppercase tracking-widest text-sm transition-colors rounded-sm bg-green-500 text-white hover:bg-black shadow-md hover:shadow-xl">
                      Nhận tư vấn
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-200">
                 <h4 className="font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Lưu ý quan trọng
                 </h4>
                 <ul className="list-disc list-inside text-sm text-gray-600 space-y-3 leading-relaxed">
                    <li>Đơn giá trên áp dụng cho công trình tiêu chuẩn, điều kiện thi công thuận lợi.</li>
                    <li>Đối với nhà trong hẻm nhỏ, biệt thự, nhà có phong cách thiết kế đặc biệt (Tân cổ điển, Cổ điển), công ty sẽ khảo sát thực tế và báo giá dự toán chi tiết.</li>
                 </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Quotation;