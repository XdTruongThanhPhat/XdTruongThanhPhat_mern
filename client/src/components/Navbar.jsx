import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    {
      name: 'Hạng mục công trình',
      path: '/hang-muc-cong-trinh',
      submenu: [
        { name: 'Nội thất', path: '/hang-muc-cong-trinh/noi-that' },
        { name: 'Biệt thự', path: '/hang-muc-cong-trinh/biet-thu' },
        { name: 'Căn hộ', path: '/hang-muc-cong-trinh/can-ho' },
        { name: 'Nhà phố', path: '/hang-muc-cong-trinh/nha-pho' },
        { name: 'Công trình thực tế', path: '/hang-muc-cong-trinh/cong-trinh-thuc-te' },
      ]
    },
    { name: 'Báo giá', path: '/bao-gia' },
    {
      name: 'Về TTP',
      path: '/ve-ttp',
      submenu: [
        { name: 'Giới thiệu', path: '/ve-ttp' },
        { name: 'Đội ngũ nhân sự', path: '/ve-ttp/doi-ngu-nhan-su' },
      ]
    },
    { name: 'Tin tức', path: '/tin-tuc' },
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  return (
    // THAY ĐỔI: Sử dụng nền Xanh Ngọc Lục Bảo đậm (emerald-900) kết hợp Kính mờ
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled 
        ? 'bg-emerald-900/95 backdrop-blur-md py-1 shadow-lg border-b border-emerald-800' 
        : 'bg-emerald-800 py-3 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* LOGO BADGE: Bọc Logo trong một chiếc "Thẻ trắng" bo góc để nó nổi bật 100% trên nền Xanh */}
          <div className="flex-shrink-0 flex items-center h-full py-1">
            <Link to="/" className="block">
              <div className="bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] border-b-2 border-red-500">
                <img
                  className="h-10 md:h-14 w-auto object-contain"
                  src={assets.TTP}
                  alt="Trường Thành Phát"
                />
              </div>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4 ml-4">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group px-2 py-2">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    // THAY ĐỔI: Chữ màu Trắng, Hover sang Đỏ Ruby (red-400), Gạch chân màu Đỏ (red-500)
                    `relative text-[14px] lg:text-[15px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 py-1 ${
                      isActive ? 'text-white' : 'text-emerald-50 hover:text-red-400'
                    } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 ${
                      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {link.name}
                  {link.submenu && (
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </NavLink>

                {/* Dropdown Menu */}
                {link.submenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-50 border-t-4 border-red-500 rounded-b-md overflow-hidden">
                    <div className="py-1">
                      {link.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          // Menu con thả xuống có nền trắng chữ xanh đậm, hover sang màu đỏ
                          className="block px-6 py-3.5 text-[13px] font-bold text-emerald-950 hover:bg-red-50 hover:text-red-600 transition-colors border-b border-gray-100 last:border-0"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden flex items-center">
            {/* THAY ĐỔI: Icon menu màu Trắng, Hover sang Đỏ */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-white hover:text-red-400 transition-colors outline-none">
              {isMobileOpen ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden bg-emerald-950 border-t border-emerald-800 overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileOpen ? 'max-h-[800px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link, index) => (
            <div key={index} className="space-y-4">
              <NavLink
                to={link.path}
                onClick={() => !link.submenu && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  // THAY ĐỔI: Chữ trên mobile đổi sang Trắng và Đỏ
                  `relative inline-block text-base font-bold uppercase tracking-widest pb-1 transition-colors ${
                    isActive ? 'text-white' : 'text-emerald-200'
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 ${
                    isActive ? 'after:w-full' : 'after:w-0'
                  }`
                }
              >
                {link.name}
              </NavLink>
              {link.submenu && (
                <div className="pl-5 space-y-4 border-l border-emerald-800 mt-2">
                  {link.submenu.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      to={sub.path}
                      onClick={() => setIsMobileOpen(false)}
                      className="block text-sm font-medium text-emerald-300 hover:text-red-400 transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;