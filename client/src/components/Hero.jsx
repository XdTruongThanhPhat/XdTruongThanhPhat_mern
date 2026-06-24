import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const Hero = () => {
  // Dữ liệu mặc định đề phòng Backend chưa có data
  const defaultSlides = [
    {
      imageUrl: assets.demo1,
      title: 'Kiến Tạo Không Gian Sống Đẳng Cấp',
      subtitle: 'Trường Thành Phát đồng hành cùng bạn xây dựng ngôi nhà mơ ước với chất lượng vượt trội.'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2071',
      title: 'Thiết Kế Đột Phá, Thi Công Chuyên Nghiệp',
      subtitle: 'Mang đến giải pháp tối ưu, tiết kiệm chi phí cho mọi công trình của bạn.'
    }
  ];

  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch Banners từ MongoDB
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/banners`);
        const data = await res.json();
        
        if (data.success && data.banners.length > 0) {
          setSlides(data.banners);
        } else {
          setSlides(defaultSlides); // Nếu DB trống thì dùng mặc định
        }
      } catch (error) {
        console.error("Lỗi khi tải Banner:", error);
        setSlides(defaultSlides);
      }
    };
    fetchBanners();
  }, []);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (slides.length > 1) {
      const slideInterval = setInterval(() => {
        nextSlide();
      }, 8000); // Thay đổi sau mỗi 8 giây
      return () => clearInterval(slideInterval);
    }
  }, [currentIndex, slides.length]);

  if (slides.length === 0) return null;

  return (
    // TỐI ƯU: Đổi h-[85vh] thành h-[60vh] trên mobile, màn hình to giữ nguyên h-screen
    <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-screen group bg-black" role="region" aria-label="Banner quảng cáo">
      
      {/* KHU VỰC HIỂN THỊ ẢNH */}
      <div className="w-full h-full relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== currentIndex}
          >
            {/* SEO FIX: Đổi background-image → thẻ <img> thật để Google index được */}
            <img
              src={optimizeCloudinaryUrl(slide.imageUrl, 1920)}
              alt={slide.title || 'Trường Thành Phát - Banner'}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              fetchpriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Nội dung chữ */}
            {/* SEO FIX: Đổi <h1> → <p> styled để tránh duplicate H1 với trang Home */}
            {/* TỐI ƯU: Thêm padding ngang px-4 sm:px-8 để chữ không sát lề điện thoại */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-8 pt-[60px] md:pt-[104px]">
              
              {/* TỐI ƯU TITLE: Giảm text xuống text-2xl cho mobile, thêm leading-snug để khoảng cách dòng đẹp hơn */}
              <p className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 uppercase tracking-wide drop-shadow-lg leading-snug md:leading-tight ${index === currentIndex ? 'animate-fade-in-up' : 'opacity-0'}`}>
                {slide.title}
              </p>
              
              {/* TỐI ƯU SUBTITLE: Giảm text xuống text-sm cho mobile, giới hạn chiều rộng max-w-[95%] */}
              <p className={`text-sm sm:text-base md:text-xl text-gray-200 mb-6 md:mb-8 max-w-[95%] md:max-w-2xl drop-shadow-md ${index === currentIndex ? 'animate-fade-in-up [animation-delay:300ms]' : 'opacity-0'}`}>
                {slide.subtitle}
              </p>
              
            </div>
          </div>
        ))}
      </div>

      {/* MŨI TÊN TRÁI */}
      {/* TỐI ƯU: Ép sát lề left-2 trên mobile, thu nhỏ icon w-5 h-5 */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-2 md:left-5 text-xl md:text-2xl rounded-full p-1.5 md:p-2 bg-black/30 text-white cursor-pointer hover:bg-black/70 transition-all z-20">
        <button onClick={prevSlide} className="outline-none flex items-center justify-center" aria-label="Slide trước">
          <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* MŨI TÊN PHẢI */}
      {/* TỐI ƯU: Ép sát lề right-2 trên mobile, thu nhỏ icon w-5 h-5 */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-2 md:right-5 text-xl md:text-2xl rounded-full p-1.5 md:p-2 bg-black/30 text-white cursor-pointer hover:bg-black/70 transition-all z-20">
        <button onClick={nextSlide} className="outline-none flex items-center justify-center" aria-label="Slide tiếp theo">
          <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* DẤU CHẤM ĐIỀU HƯỚNG */}
      {/* TỐI ƯU: Thu nhỏ kích thước chấm w-2 h-2 trên mobile để tinh tế hơn */}
      <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center py-2 z-20 gap-2 md:gap-3" role="tablist" aria-label="Chọn slide">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            role="tab"
            aria-selected={slideIndex === currentIndex}
            aria-label={`Slide ${slideIndex + 1}`}
            className={`cursor-pointer h-2 md:h-3 rounded-full transition-all duration-300 shadow-md ${
              slideIndex === currentIndex ? 'bg-green-500 w-6 md:w-8' : 'bg-white/50 hover:bg-white w-2 md:w-3'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;