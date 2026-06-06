import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../components/Breadcrumb';

const About = () => {
  return (
    // TỐI ƯU: Giảm padding Top/Bottom trên mobile (pt-24 pb-10)
    <section className="pt-24 md:pt-32 pb-10 md:pb-16 bg-white min-h-screen">
      <Helmet>
        <title>Về Trường Thành Phát | Kiến Trúc &amp; Xây Dựng</title>
        <meta name="description" content="Tìm hiểu về Trường Thành Phát - đơn vị thiết kế kiến trúc và xây dựng uy tín chuyên nghiệp tại Đà Nẵng" />
        <link rel="canonical" href="https://truongthanhphatdn.vn/ve-ttp" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Về Trường Thành Phát | Kiến Trúc &amp; Xây Dựng" />
        <meta property="og:description" content="Tìm hiểu về Trường Thành Phát - đơn vị thiết kế kiến trúc và xây dựng uy tín chuyên nghiệp tại Đà Nẵng" />
        <meta property="og:url" content="https://truongthanhphatdn.vn/ve-ttp" />
        <meta property="og:image" content="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Về Trường Thành Phát | Kiến Trúc &amp; Xây Dựng" />
        <meta name="twitter:description" content="Tìm hiểu về Trường Thành Phát - đơn vị thiết kế kiến trúc và xây dựng uy tín chuyên nghiệp tại Đà Nẵng" />
        <meta name="twitter:image" content="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png" />

        {/* Dữ liệu cấu trúc Schema JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Giới thiệu về Trường Thành Phát",
            "description": "Tìm hiểu về Trường Thành Phát - đơn vị thiết kế kiến trúc và xây dựng uy tín chuyên nghiệp tại Đà Nẵng",
            "publisher": {
              "@type": "Organization",
              "name": "Trường Thành Phát",
              "logo": {
                "@type": "ImageObject",
                "url": "https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png"
              }
            }
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb SEO */}
        <Breadcrumb items={[{ label: 'Về Trường Thành Phát' }]} />

        {/* BANNER ẢNH TẬP THỂ */}
        {/* TỐI ƯU: Giảm margin-bottom trên mobile (mb-8) */}
        <div className="mb-8 md:mb-16">
          {/* TỐI ƯU: Giảm chiều cao ảnh trên mobile (h-[25vh]) */}
          <div className="w-full h-[25vh] sm:h-[40vh] md:h-[60vh] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <img
              src="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png"
              alt="Về Trường Thành Phát"
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
              <li>Đến năm 2030, Trường Thành Phát định hướng trở thành thương hiệu Thiết kế và Thi công trọn gói được tin chọn hàng đầu, phát triển vững chắc từ nền tảng khu vực miền Trung và mở rộng mạng lưới phục vụ trên toàn quốc.</li>
              <li>Chúng tôi không chạy theo những xu hướng phô trương nhất thời, mà tập trung vào kiến trúc thực dụng, tối ưu hóa không gian sống để kiến tạo nên những công trình bền bỉ, thích ứng tốt với điều kiện khí hậu và ngân sách.</li>
              <li>TRƯỜNG THÀNH PHÁT hướng đến việc hoàn thiện chuỗi cung ứng khép kín từ khâu tư vấn, thiết kế, đến thi công và nội thất, đảm bảo chất lượng được kiểm soát nghiêm ngặt và hạn chế tối đa chi phí phát sinh cho gia chủ.</li>
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
                <p>Không vẽ nên những bản thiết kế xa rời thực tế, TRƯỜNG THÀNH PHÁT cam kết mang đến các giải pháp dung hòa giữa tính thẩm mỹ, nhu cầu sinh hoạt kết nối các thế hệ và khả năng tài chính của từng gia đình. Chúng tôi xây nhà để bạn sống thoải mái, chứ không chỉ để trưng bày.</p>
              </div>

              <div>
                <h3 className="font-bold text-black mb-1 md:mb-2 text-base">2. Với xã hội</h3>
                <p>Góp phần kiến tạo diện mạo đô thị và nông thôn bằng những công trình chuẩn mực, an toàn. Đề cao các giải pháp thông gió, chiếu sáng tự nhiên nhằm tiết kiệm năng lượng và thân thiện với môi trường.</p>
              </div>

              <div>
                <h3 className="font-bold text-black mb-1 md:mb-2 text-base">3. Với đội ngũ nhân sự</h3>
                <p>Xây dựng một môi trường làm việc thực chiến, minh bạch. Tạo không gian để các kỹ sư, kiến trúc sư cọ xát thực địa, nâng cao tay nghề và có thu nhập xứng đáng để gắn bó đường dài.</p>
              </div>
            </div>
          </div>

          {/* Giá trị thực tiễn */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-black uppercase tracking-widest mb-3 md:mb-4 border-l-4 border-green-500 pl-3 md:pl-4">
              III. GIÁ TRỊ THỰC TIỄN
            </h2>
            <ul className="list-none space-y-3 md:space-y-4 pl-2 md:pl-4">
              <li><strong className="text-black">Thực tế & Tối ưu:</strong> Mọi nét vẽ đều phải thi công được. Ưu tiên công năng sử dụng, loại bỏ các chi tiết rườm rà gây lãng phí.</li>
              <li><strong className="text-black">Thấu hiểu:</strong> Mỗi ngôi nhà là thành quả tích lũy và là nơi gắn kết gia đình. TRƯỜNG THÀNH PHÁT thiết kế dựa trên thói quen sinh hoạt và câu chuyện riêng của từng chủ đầu tư.</li>
              <li><strong className="text-black">Trách nhiệm:</strong> Đồng hành cùng gia chủ từ nét vẽ đầu tiên cho đến khi công trình hoàn thiện. Làm việc với tinh thần: "Tư vấn chân thành - Thi công trách nhiệm".</li>
              <li><strong className="text-black">Công nghệ:</strong> Ứng dụng công nghệ 3D, phần mềm mô phỏng vào quá trình tư vấn để khách hàng hình dung trực quan nhất không gian sống trước khi đặt viên gạch đầu tiên.</li>
            </ul>
          </div>

          {/* Nút điều hướng */}
          {/* TỐI ƯU: Đổi sang flex-col trên mobile nhỏ để 2 nút không bị bóp nghẹt, từ màn hình sm mới xếp ngang */}
          <div className="pt-6 md:pt-10 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link to="/ve-ttp/doi-ngu-nhan-su" className="bg-black hover:bg-green-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-sm font-bold uppercase tracking-widest text-xs md:text-sm transition-colors shadow-md text-center">
              Xem Đội Ngũ TRƯỜNG THÀNH PHÁT
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