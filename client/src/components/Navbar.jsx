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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

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
        { name: 'Công trình thi công', path: '/hang-muc-cong-trinh/cong-trinh-thuc-te' },
      ]
    },
    { name: 'Video', path: '/video' },
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
    <>
      {/* MAIN NAVBAR */}
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
          scrolled 
          ? 'bg-emerald-900/95 backdrop-blur-md py-1 shadow-lg border-b border-emerald-800' 
          : 'bg-emerald-800 py-3 shadow-md'
        }`}
        aria-label="Điều hướng chính"
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
              <button 
                onClick={() => setIsMobileOpen(true)} 
                className="p-2 text-white hover:text-red-400 transition-colors outline-none" 
                aria-label="Mở menu"
                aria-expanded={isMobileOpen}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER & BACKDROP */}
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 bottom-0 z-[70] w-2/3 h-full bg-emerald-950 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ left: 'auto', right: 0 }}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-800/50">
          <span className="text-white font-bold uppercase tracking-wider text-base">Menu</span>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="p-2 -mr-2 text-emerald-200 hover:text-red-400 transition-colors duration-200 outline-none" 
            aria-label="Đóng menu"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer content (navigation links) */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {navLinks.map((link, index) => (
            <div key={index} className="space-y-4">
              <NavLink
                to={link.path}
                onClick={() => !link.submenu && setIsMobileOpen(false)}
                className={({ isActive }) =>
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
    </>
  );
};

export default Navbar;