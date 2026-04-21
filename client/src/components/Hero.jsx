import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  const slides = [
    {
      url: assets.demo1,
      title: 'Kiến Tạo Không Gian Sống Đẳng Cấp',
      subtitle: 'Trường Thành Phát đồng hành cùng bạn xây dựng ngôi nhà mơ ước với chất lượng vượt trội.'
    },
    {
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2071',
      title: 'Thiết Kế Đột Phá, Thi Công Chuyên Nghiệp',
      subtitle: 'Mang đến giải pháp tối ưu, tiết kiệm chi phí cho mọi công trình của bạn.'
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070',
      title: 'Uy Tín - Chất Lượng - Tận Tâm',
      subtitle: 'Bảo hành dài hạn, cam kết tiến độ và minh bạch trong từng vật tư.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 10000); 
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    // Đã XÓA mt-[64px] và TĂNG chiều cao lên full màn hình (h-screen)
    <div className="relative w-full h-[85vh] md:h-screen group bg-black">
      
      {/* KHU VỰC HIỂN THỊ ẢNH - Nằm sát mép trên cùng top-0 */}
      <div className="w-full h-full relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Ảnh nền */}
            <div
              className="w-full h-full bg-center bg-cover transition-transform duration-1000"
              style={{ backgroundImage: `url(${slide.url})` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Nội dung chữ - ĐÃ THÊM pt-[80px] md:pt-[104px] để chữ bị đẩy xuống dưới Navbar */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-[80px] md:pt-[104px]">
              <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wide drop-shadow-lg ${index === currentIndex ? 'animate-fade-in-up' : 'opacity-0'}`}>
                {slide.title}
              </h1>
              
              <p className={`text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-md ${index === currentIndex ? 'animate-fade-in-up [animation-delay:300ms]' : 'opacity-0'}`}>
                {slide.subtitle}
              </p>
              
              <div className={`flex gap-4 ${index === currentIndex ? 'animate-fade-in-up [animation-delay:600ms]' : 'opacity-0'}`}>
                <Link to="/bao-gia" className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-sm font-bold text-lg transition-colors shadow-lg uppercase">
                  Nhận Báo Giá
                </Link>
                <Link to="/hang-muc-cong-trinh" className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-sm font-bold text-lg transition-colors shadow-lg uppercase">
                  Xem Dự Án
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MŨI TÊN TRÁI */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/70 transition-all z-20">
        <button onClick={prevSlide} className="outline-none flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* MŨI TÊN PHẢI */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/70 transition-all z-20">
        <button onClick={nextSlide} className="outline-none flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* DẤU CHẤM ĐIỀU HƯỚNG */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center py-2 z-20 gap-3">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
              slideIndex === currentIndex ? 'bg-green-500 w-8' : 'bg-white/50 hover:bg-white'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;