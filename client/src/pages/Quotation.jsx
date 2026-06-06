import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../components/Breadcrumb';

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

  return (
    // TỐI ƯU: Giảm padding Top/Bottom trên mobile
    <section className="pt-24 md:pt-32 pb-10 md:pb-16 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Báo Giá Xây Dựng | Trường Thành Phát</title>
        <meta name="description" content="Nhận báo giá thiết kế và thi công xây dựng nhà phố, biệt thự chi tiết, chính xác từ Trường Thành Phát" />
        <link rel="canonical" href="https://truongthanhphatdn.vn/bao-gia" />
        {/* OG Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Báo Giá Xây Dựng | Trường Thành Phát" />
        <meta property="og:description" content="Nhận báo giá thiết kế và thi công xây dựng nhà phố, biệt thự chi tiết, chính xác từ Trường Thành Phát" />
        <meta property="og:url" content="https://truongthanhphatdn.vn/bao-gia" />
        <meta property="og:image" content="https://truongthanhphatdn.vn/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Báo Giá Xây Dựng | Trường Thành Phát" />
        <meta name="twitter:description" content="Nhận báo giá thiết kế và thi công xây dựng nhà phố, biệt thự" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb SEO */}
        <Breadcrumb items={[{ label: 'Báo giá thi công' }]} />
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center mb-8 md:mb-14">
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-black">
            Bảng Báo Giá <span className="text-green-500">Xây Dựng</span>
          </h1>
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto mt-2 md:mt-4 mb-3 md:mb-6"></div>
          <p className="text-xs md:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Trường Thành Phát cam kết minh bạch vật tư, báo giá chính xác, không phát sinh chi phí trong suốt quá trình thi công.
          </p>
        </div>

        {/* TAB NAVIGATION */}
        {/* TỐI ƯU: Thu nhỏ nút Tab, giảm padding và text size trên mobile */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 md:px-6 md:py-3 text-[10px] sm:text-xs md:text-base font-bold uppercase tracking-widest transition-all duration-300 rounded-full border md:border-2 ${
                activeTab === tab.id 
                ? 'bg-black text-white border-black shadow-md md:shadow-lg' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NỘI DUNG TỪNG TAB */}
        {/* TỐI ƯU: Giảm padding khối trắng chứa nội dung */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-10">
          
          {/* ==================================
              TAB 1: THIẾT KẾ KIẾN TRÚC 
          ================================== */}
          {activeTab === 'thiet-ke' && (
            <div className="animate-fade-in">
              <h2 className="text-lg md:text-2xl font-bold uppercase text-center mb-6 md:mb-8 tracking-wide md:tracking-widest">Đơn Giá Thiết Kế Kiến Trúc & Nội Thất</h2>
              {/* TỐI ƯU: Gap nhỏ hơn trên mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {designPrices.map((item, idx) => (
                  <div key={idx} className={`relative flex flex-col p-4 md:p-6 rounded-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${item.isPopular ? 'border-green-500 mt-4 md:mt-0' : 'border-gray-100 hover:border-gray-300'}`}>
                    {item.isPopular && (
                      // TỐI ƯU: Huy hiệu "Được chọn nhiều nhất" nhỏ lại
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                        Được chọn nhiều nhất
                      </span>
                    )}
                    <h3 className="text-base md:text-lg font-bold text-black uppercase tracking-wider text-center mb-2">{item.title}</h3>
                    <div className="text-center mb-4 md:mb-6 border-b border-gray-100 pb-4 md:pb-6">
                      <span className="text-xl md:text-3xl font-black text-green-500">{item.price}</span>
                      <span className="text-gray-500 text-xs md:text-sm ml-1">{item.unit}</span>
                    </div>
                    <ul className="flex-1 space-y-2 md:space-y-3 mb-6 md:mb-8">
                      {item.features.map((feat, fIdx) => (
                        // TỐI ƯU: Font chữ tính năng nhỏ lại (text-xs)
                        <li key={fIdx} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/lien-he" className={`block text-center py-2 md:py-3 w-full font-bold uppercase tracking-widest text-[10px] md:text-sm transition-colors rounded-sm ${item.isPopular ? 'bg-green-500 text-white hover:bg-black' : 'bg-gray-100 text-black hover:bg-green-500 hover:text-white'}`}>
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
              {/* TỐI ƯU: Đổi layout thành cột (flex-col) trên mobile, và hàng (md:flex-row) trên máy tính */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-3 md:gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide md:tracking-widest">Báo Giá Thi Công Phần Thô</h2>
                  <p className="text-xs md:text-base text-gray-500 mt-1 md:mt-2">Áp dụng cho nhà phố tiêu chuẩn có tổng diện tích thi công {'>'} 250m2</p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded md:rounded-none">
                  <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-widest mb-0.5 md:mb-1">Đơn giá tham khảo từ</p>
                  <p className="text-xl md:text-3xl font-black text-green-500">3.900.000 - 4.400.000 <span className="text-xs md:text-base text-black font-normal">VNĐ/m2</span></p>
                </div>
              </div>

              <h3 className="text-sm md:text-lg font-bold uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500"></span> Chi tiết vật tư sử dụng
              </h3>
              
              {/* TỐI ƯU: Đã có overflow-x-auto, chỉ tinh chỉnh font-size bên trong bảng */}
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-black text-white uppercase tracking-wider text-[10px] md:text-sm">
                      <th className="p-3 md:p-4">STT</th>
                      <th className="p-3 md:p-4">Chủng loại vật tư</th>
                      <th className="p-3 md:p-4">Thương hiệu / Xuất xứ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rawConstructionMaterials.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors text-xs md:text-sm">
                        <td className="p-3 md:p-4 text-gray-500 font-bold">0{idx + 1}</td>
                        <td className="p-3 md:p-4 font-bold text-gray-800">{item.name}</td>
                        <td className="p-3 md:p-4 text-gray-600">{item.desc}</td>
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
              <h2 className="text-lg md:text-2xl font-bold uppercase text-center mb-2 md:mb-4 tracking-wide md:tracking-widest">Đơn Giá Thi Công Trọn Gói</h2>
              <p className="text-center text-xs md:text-base text-gray-500 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                Cam kết sử dụng đúng vật tư theo hợp đồng. Cung cấp báo giá dự toán chi tiết từng hạng mục bóc tách rành mạch trước khi thi công.
              </p>

              {/* TỐI ƯU: Thu nhỏ padding và text size của Box Gói tiêu chuẩn */}
              <div className="flex justify-center">
                <div className="border-2 p-5 md:p-10 rounded-lg border-green-500 bg-green-50/30 w-full max-w-md shadow-lg transition-transform hover:-translate-y-1">
                  <div className="text-center">
                    <span className="inline-block bg-green-500 text-white px-3 py-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 md:mb-4">
                      Phổ biến nhất
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-black uppercase tracking-wider mb-2 md:mb-3">Gói Tiêu Chuẩn</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed">
                      Phù hợp với hầu hết các nhu cầu xây dựng nhà phố, tối ưu chi phí nhưng vẫn đảm bảo chất lượng, không gian sang trọng và tiện nghi.
                    </p>
                    <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-center gap-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-green-500">9.000.000 - 12.000.000</span>
                      <span className="text-gray-500 font-medium text-[10px] md:text-sm">VNĐ/m2</span>
                    </div>
                    <Link to="/lien-he" className="block text-center py-3 md:py-4 w-full font-bold uppercase tracking-widest text-[10px] md:text-sm transition-colors rounded-sm bg-green-500 text-white hover:bg-black shadow-md hover:shadow-xl">
                      Nhận tư vấn
                    </Link>
                  </div>
                </div>
              </div>

              {/* TỐI ƯU: Thu nhỏ khoảng cách của phần lưu ý */}
              <div className="mt-8 md:mt-12 bg-gray-50 p-4 md:p-8 rounded-lg border border-gray-200">
                 <h4 className="text-sm md:text-base font-bold text-black uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Lưu ý quan trọng
                 </h4>
                 <ul className="list-disc list-inside text-xs md:text-sm text-gray-600 space-y-2 md:space-y-3 leading-relaxed pl-1">
                    <li>Đơn giá trên áp dụng cho công trình tiêu chuẩn, điều kiện thi công thuận lợi.</li>
                    <li>Đối với nhà trong hẻm nhỏ, biệt thự, nhà có phong cách thiết kế đặc biệt, công ty sẽ khảo sát và báo giá dự toán chi tiết.</li>
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