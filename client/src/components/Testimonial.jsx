import React, { useState, useEffect, useRef } from 'react';

const Testimonial = () => {
  // 1. Dùng state rỗng thay cho dữ liệu mẫu
  const [testimonials, setTestimonials] = useState([]);

  // Fetch dữ liệu thật từ MongoDB
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/testimonials');
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
    <section className="bg-[#151515] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-green-500">
            Khách hàng nói gì về TRƯỜNG THÀNH PHÁT
          </h2>
          <div className="w-24 h-[1px] bg-gray-500 mx-auto mt-4"></div>
        </div>

        {/* SLIDER CONTAINER */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 hide-scrollbar scroll-smooth cursor-grab active:cursor-grabbing ${isDragging ? 'select-none' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>

          {testimonials.map((item) => (
            <div 
              key={item._id} 
              className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start flex flex-col pointer-events-none"
            >
              <div className="bg-white p-8 relative rounded-sm shadow-lg flex-grow flex flex-col justify-between pointer-events-auto">
                <div>
                  <div className="text-green-500 text-5xl font-serif leading-none mb-2">“</div>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify line-clamp-4">
                    {item.content}
                  </p>
                </div>

                <div className="absolute -bottom-4 left-0 w-0 h-0 border-t-[16px] border-t-white border-r-[20px] border-r-transparent"></div>
              </div>

              <div className="flex items-center gap-4 mt-8 pl-4 pointer-events-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" draggable="false" />
                </div>
                <div>
                  <h4 className="text-green-500 font-bold text-sm">{item.name}</h4>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* DOTS (Phân trang) */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {testimonials.map((_, idx) => {
            const isDesktop = window.innerWidth > 1024;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            const maxDots = isDesktop ? testimonials.length - 2 : isTablet ? testimonials.length - 1 : testimonials.length;

            if (idx >= maxDots) return null;

            return (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
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