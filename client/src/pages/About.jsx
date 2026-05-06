import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    // TỐI ƯU: Giảm padding Top/Bottom trên mobile (pt-24 pb-10)
    <section className="pt-24 md:pt-32 pb-10 md:pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER ẢNH TẬP THỂ */}
        {/* TỐI ƯU: Giảm margin-bottom trên mobile (mb-8) */}
        <div className="mb-8 md:mb-16">
          {/* TỐI ƯU: Giảm chiều cao ảnh trên mobile (h-[25vh]) */}
          <div className="w-full h-[25vh] sm:h-[40vh] md:h-[60vh] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <img 
              src="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png" 
              alt="Về TTP Architect" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TIÊU ĐỀ */}
        {/* TỐI ƯU: Giảm margin-bottom trên mobile (mb-8) */}
        <div className="text-center mb-8 md:mb-16">
          {/* TỐI ƯU: Thu nhỏ font chữ tiêu đề trên mobile (text-2xl) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            TẦM NHÌN <span className="text-green-500">–</span> SỨ MỆNH
          </h1>
          {/* TỐI ƯU: Thu nhỏ thanh line xanh trên mobile */}
          <div className="w-16 md:w-24 h-1 bg-green-500 mx-auto mt-2 md:mt-4 mb-3 md:mb-6"></div>
        </div>

        {/* NỘI DUNG */}
        {/* TỐI ƯU: Giảm khoảng cách giữa các phần nội dung trên mobile (space-y-8) và thu nhỏ font (text-sm) */}
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 text-gray-700 leading-relaxed text-sm md:text-base text-justify md:text-left">
          
          {/* Tầm nhìn */}
          <div>
            {/* TỐI ƯU: Thu nhỏ font chữ H2 trên mobile (text-lg) và giảm margin-bottom */}
            <h2 className="text-lg md:text-xl font-bold text-black uppercase tracking-widest mb-3 md:mb-4 border-l-4 border-green-500 pl-3 md:pl-4">
              I. TẦM NHÌN ĐẾN NĂM 2030
            </h2>
            <ul className="list-disc list-outside space-y-2 md:space-y-3 pl-4 md:pl-6 ml-2">
              <li>Đến năm 2030, TTP Architect định hướng trở thành văn phòng kiến trúc hàng đầu trong lĩnh vực thiết kế nhà ở tại Việt Nam, với hệ thống chi nhánh hoạt động tại ba miền Bắc – Trung – Nam.</li>
              <li>TTP tiên phong theo đuổi kiến trúc xanh, đề cao giải pháp bền vững và thân thiện với môi trường, nhằm tạo ra những công trình có giá trị lâu dài cả về thẩm mỹ lẫn công năng sử dụng.</li>
              <li>Song song với phát triển chuyên môn, TTP tập trung xây dựng văn hóa doanh nghiệp vững mạnh và phát triển đội ngũ nhân sự từ nền tảng cốt lõi. Chúng tôi tin rằng con người chính là khởi nguồn của những sản phẩm chất lượng.</li>
            </ul>
          </div>

          {/* Sứ mệnh */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-black uppercase tracking-widest mb-3 md:mb-4 border-l-4 border-green-500 pl-3 md:pl-4">
              II. SỨ MỆNH
            </h2>
            
            <div className="space-y-4 md:space-y-6 pl-2 md:pl-4">
              <div>
                <h3 className="font-bold text-black mb-1 md:mb-2 text-base">1. Với khách hàng</h3>
                <p>Mang đến những công trình kiến trúc mang bản sắc riêng, được thiết kế phù hợp với nhu cầu sử dụng và ngân sách thực tế của từng gia đình. TTP không theo đuổi sự phô trương, mà đề cao tính ứng dụng, tính bền vững và giá trị sử dụng lâu dài.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-black mb-1 md:mb-2 text-base">2. Với xã hội</h3>
                <p>Đóng góp vào sự phát triển của đô thị bằng những công trình xanh, thân thiện với môi trường. Tạo ra không gian sống chất lượng, nâng tầm chuẩn mực kiến trúc nhà ở tại Việt Nam.</p>
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          {/* TỐI ƯU: Đổi sang flex-col trên mobile nhỏ để 2 nút không bị bóp nghẹt, từ màn hình sm mới xếp ngang */}
          <div className="pt-6 md:pt-10 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
             <Link to="/ve-ttp/doi-ngu-nhan-su" className="bg-black hover:bg-green-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-sm font-bold uppercase tracking-widest text-xs md:text-sm transition-colors shadow-md text-center">
               Xem Đội Ngũ TTP
             </Link>
             <Link to="/lien-he" className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-6 md:px-8 py-2.5 md:py-3 rounded-sm font-bold uppercase tracking-widest text-xs md:text-sm transition-colors shadow-md text-center">
               Liên Hệ Ngay
             </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;