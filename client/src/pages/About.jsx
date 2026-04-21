import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER ẢNH TẬP THỂ */}
        <div className="mb-16">
          <div className="w-full h-[40vh] md:h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png" 
              alt="Về TTP Architect" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TIÊU ĐỀ */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">
            TẦM NHÌN <span className="text-green-500">–</span> SỨ MỆNH
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4 mb-6"></div>
        </div>

        {/* NỘI DUNG */}
        <div className="max-w-4xl mx-auto space-y-12 text-gray-700 leading-relaxed">
          
          {/* Tầm nhìn */}
          <div>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-l-4 border-green-500 pl-4">
              I. TẦM NHÌN ĐẾN NĂM 2030
            </h2>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li>Đến năm 2030, TTP Architect định hướng trở thành văn phòng kiến trúc hàng đầu trong lĩnh vực thiết kế nhà ở tại Việt Nam, với hệ thống chi nhánh hoạt động tại ba miền Bắc – Trung – Nam.</li>
              <li>TTP tiên phong theo đuổi kiến trúc xanh, đề cao giải pháp bền vững và thân thiện với môi trường, nhằm tạo ra những công trình có giá trị lâu dài cả về thẩm mỹ lẫn công năng sử dụng.</li>
              <li>Song song với phát triển chuyên môn, TTP tập trung xây dựng văn hóa doanh nghiệp vững mạnh và phát triển đội ngũ nhân sự từ nền tảng cốt lõi. Chúng tôi tin rằng con người chính là khởi nguồn của những sản phẩm chất lượng.</li>
            </ul>
          </div>

          {/* Sứ mệnh */}
          <div>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4 border-l-4 border-green-500 pl-4">
              II. SỨ MỆNH
            </h2>
            
            <div className="space-y-6 pl-2">
              <div>
                <h3 className="font-bold text-black mb-2">1. Với khách hàng</h3>
                <p>Mang đến những công trình kiến trúc mang bản sắc riêng, được thiết kế phù hợp với nhu cầu sử dụng và ngân sách thực tế của từng gia đình. TTP không theo đuổi sự phô trương, mà đề cao tính ứng dụng, tính bền vững và giá trị sử dụng lâu dài.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-black mb-2">2. Với xã hội</h3>
                <p>Đóng góp vào sự phát triển của đô thị bằng những công trình xanh, thân thiện với môi trường. Tạo ra không gian sống chất lượng, nâng tầm chuẩn mực kiến trúc nhà ở tại Việt Nam.</p>
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          <div className="pt-10 flex justify-center gap-4">
             <Link to="/ve-ttp/doi-ngu" className="bg-black hover:bg-green-500 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-colors shadow-md">
               Xem Đội Ngũ TTP
             </Link>
             <Link to="/lien-he" className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-colors shadow-md">
               Liên Hệ Ngay
             </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;