import React, { useState, useEffect, useRef } from 'react';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const Testimonial = () => {
  // 1. Dùng state rỗng thay cho dữ liệu mẫu
  const [testimonials, setTestimonials] = useState([]);

  // Fetch dữ liệu thật từ MongoDB
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/testimonials`);
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.testimonials);
        }
      } catch (error) {
        console.error("Lỗi khi tải phản hồi:", error);
      }
    };
    fetchTestimonials();
  }, []);

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ==========================================
  // LOGIC KÉO TRƯỢT (DRAG TO SCROLL) - Giữ nguyên
  // ==========================================
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPos = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth / (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1);
      const newIndex = Math.round(scrollPos / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1);
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  if (testimonials.length === 0) return null; // Ẩn component nếu chưa có dữ liệu

  return (
    // TỐI ƯU: Giảm padding trục Y trên mobile (py-10)
    <section className="bg-[#151515] py-10 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ */}
        {/* TỐI ƯU: Thu nhỏ Text tiêu đề trên mobile */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide text-green-500 px-2">
            Khách hàng nói gì về TRƯỜNG THÀNH PHÁT
          </h2>
          <div className="w-16 md:w-24 h-[1px] bg-gray-500 mx-auto mt-3 md:mt-4"></div>
        </div>

        {/* SLIDER CONTAINER */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 md:pb-12 hide-scrollbar scroll-smooth cursor-grab active:cursor-grabbing ${isDragging ? 'select-none' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>

          {testimonials.map((item) => (
            <div 
              key={item._id} 
              // TỐI ƯU: Giảm khoảng trừ gap trên mobile để khít hơn
              className="min-w-full sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-16px)] snap-start flex flex-col pointer-events-none"
            >
              {/* TỐI ƯU: Giảm padding hộp thoại trên mobile (p-5) */}
              <div className="bg-white p-5 md:p-8 relative rounded-sm shadow-lg flex-grow flex flex-col justify-between pointer-events-auto">
                <div>
                  <div className="text-green-500 text-3xl md:text-5xl font-serif leading-none mb-1 md:mb-2">“</div>
                  {/* TỐI ƯU: Giảm kích thước chữ bên trong feedback */}
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-justify line-clamp-5 md:line-clamp-4">
                    {item.content}
                  </p>
                </div>

                <div className="absolute -bottom-3 md:-bottom-4 left-0 w-0 h-0 border-t-[12px] md:border-t-[16px] border-t-white border-r-[16px] md:border-r-[20px] border-r-transparent"></div>
              </div>

              {/* TỐI ƯU: Thu nhỏ avatar và khoảng cách trên mobile */}
              <div className="flex items-center gap-3 md:gap-4 mt-6 md:mt-8 pl-3 md:pl-4 pointer-events-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                  <img src={optimizeCloudinaryUrl(item.avatar, 100)} alt={item.name} className="w-full h-full object-cover" loading="lazy" draggable="false" />
                </div>
                <div>
                  <h4 className="text-green-500 font-bold text-xs md:text-sm">{item.name}</h4>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* DOTS (Phân trang) */}
        <div className="flex justify-center items-center gap-1.5 md:gap-2 mt-2 md:mt-4">
          {testimonials.map((_, idx) => {
            const isDesktop = window.innerWidth > 1024;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            const maxDots = isDesktop ? testimonials.length - 2 : isTablet ? testimonials.length - 1 : testimonials.length;

            if (idx >= maxDots) return null;

            return (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                // TỐI ƯU: Thu nhỏ chấm trên mobile
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'bg-green-500 scale-125' : 'bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Testimonial;