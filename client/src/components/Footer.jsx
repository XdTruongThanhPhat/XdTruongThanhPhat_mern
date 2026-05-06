import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // TỐI ƯU: Giảm padding top/bottom trên mobile (pt-10, pb-6)
    <footer className="bg-black text-white pt-10 md:pt-16 pb-6 md:pb-8 border-t-4 border-green-500 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID LAYOUT - 4 CỘT TRÊN PC */}
        {/* TỐI ƯU: Giảm gap và margin bottom trên mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12">
          
          {/* CỘT 1: GIỚI THIỆU */}
          <div className="space-y-3 md:space-y-4">
            {/* TỐI ƯU: Thu nhỏ text tiêu đề trên mobile (text-base) */}
            <h3 className="text-red-400 text-base md:text-lg font-bold uppercase tracking-widest mb-2 md:mb-4">
              Trường Thành Phát
            </h3>
            <div className="w-10 md:w-12 h-1 bg-green-500 mb-3 md:mb-4"></div>
            {/* TỐI ƯU: Thu nhỏ text nội dung (text-xs) */}
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Chúng tôi tự hào là đơn vị hàng đầu trong lĩnh vực tư vấn thiết kế và thi công xây dựng. Kiến tạo không gian sống đẳng cấp, bền vững với thời gian và tối ưu chi phí cho mọi khách hàng.
            </p>
            {/* Mạng xã hội */}
            <div className="flex space-x-3 md:space-x-4 pt-2">
              {/* Facebook */}
              {/* TỐI ƯU: Thu nhỏ nút tròn (w-8 h-8) và icon (w-4 h-4) */}
              <a 
                href="https://www.facebook.com/XDTRUONGTHANHPHAT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors duration-300"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>

              {/* Zalo */}
              <a 
                href="https://zalo.me/0912877908" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors duration-300"
              >
                <span className="font-bold text-[10px] md:text-xs">Zalo</span>
              </a>
            </div>
          </div>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <div>
            <h4 className="text-base md:text-lg font-bold uppercase tracking-widest mb-2 md:mb-4">Liên Kết Nhanh</h4>
            <div className="w-6 md:w-8 h-1 bg-green-500 mb-4 md:mb-6"></div>
            {/* TỐI ƯU: Giảm khoảng cách dòng (space-y-2) và text-xs trên mobile */}
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <li><Link to="/" className="hover:text-green-500 transition-colors flex items-center gap-2"><span className="text-green-500">›</span> Trang chủ</Link></li>
              <li><Link to="/hang-muc-cong-trinh" className="hover:text-green-500 transition-colors flex items-center gap-2"><span className="text-green-500">›</span> Hạng mục công trình</Link></li>
              <li><Link to="/bao-gia" className="hover:text-green-500 transition-colors flex items-center gap-2"><span className="text-green-500">›</span> Báo giá thi công</Link></li>
              <li><Link to="/ve-ttp" className="hover:text-green-500 transition-colors flex items-center gap-2"><span className="text-green-500">›</span> Về Trường Thành Phát</Link></li>
              <li><Link to="/lien-he" className="hover:text-green-500 transition-colors flex items-center gap-2"><span className="text-green-500">›</span> Liên hệ & Tư vấn</Link></li>
            </ul>
          </div>

          {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
          <div>
            <h4 className="text-base md:text-lg font-bold uppercase tracking-widest mb-2 md:mb-4">Thông Tin Liên Hệ</h4>
            <div className="w-6 md:w-8 h-1 bg-green-500 mb-4 md:mb-6"></div>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-400">
              <li className="flex items-start gap-2 md:gap-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>256 Diên Hồng, Hòa Xuân, TP. Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Hotline: 0912877908</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email: Xdtruongthanhphat@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* CỘT 4: BẢN ĐỒ GOOGLE MAP */}
          <div className="h-full">
            <h4 className="text-base md:text-lg font-bold uppercase tracking-widest mb-2 md:mb-4">Trụ sở văn phòng</h4>
            <div className="w-6 md:w-8 h-1 bg-green-500 mb-4 md:mb-6"></div>
            {/* TỐI ƯU: Giảm chiều cao bản đồ trên mobile (h-40) */}
            <div className="w-full h-40 md:h-56 rounded-md overflow-hidden border border-gray-800 shadow-sm relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d338.9732422958237!2d108.22584900910367!3d16.01120131272239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421b1469409ea3%3A0xa0dc072d6c67fbdf!2zQ8O0bmcgVHkgS2nhur9uIFRyw7pjIC0gWMOieSBE4buxbmcgLSBO4buZaSBUaOG6pXQgVHLGsOG7nW5nIFRow6BuaCBQaMOhdA!5e0!3m2!1svi!2s!4v1776498577228!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
          </div>

        </div>

        {/* PHẦN BẢN QUYỀN */}
        <div className="border-t border-gray-800 pt-6 md:pt-8 flex flex-col justify-center items-center text-center text-xs md:text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Trường Thành Phát Architect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;