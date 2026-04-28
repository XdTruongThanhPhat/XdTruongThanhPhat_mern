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
        { name: 'Nhà ở', path: '/hang-muc-cong-trinh/nha-o' },
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
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  return (
    // Nền chuyển sang màu Đen (bg-black)
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 bg-[#6dc3de] ${
      scrolled ? 'py-1 shadow-2xl border-b border-gray-800' : 'py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img 
                className="h-12 md:h-24 w-auto transition-transform duration-300 hover:scale-105" 
                src={assets.TTP} 
                alt="Trường Thành Phát" 
              />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group px-2 py-2">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `relative text-[14px] lg:text-[15px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 py-1 text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-green-500 after:transition-all after:duration-300 ${
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

                {/* Dropdown Menu (Về TTP & Hạng mục) */}
                {link.submenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-50 border-t-4 border-green-500">
                    <div className="py-1">
                      {link.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          className="block px-6 py-3.5 text-[13px] font-bold text-black hover:bg-gray-50 hover:text-green-600 transition-colors border-b border-gray-100 last:border-0"
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
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-white outline-none">
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
      <div className={`md:hidden bg-black border-t border-gray-800 overflow-hidden transition-all duration-500 ease-in-out ${
        isMobileOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link, index) => (
            <div key={index} className="space-y-4">
              <NavLink
                to={link.path}
                onClick={() => !link.submenu && setIsMobileOpen(false)}
                className={({ isActive }) => 
                  `relative inline-block text-base font-bold uppercase tracking-widest text-white pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-green-500 after:transition-all after:duration-300 ${
                    isActive ? 'after:w-full' : 'after:w-0'
                  }`
                }
              >
                {link.name}
              </NavLink>
              {link.submenu && (
                <div className="pl-5 space-y-4 border-l border-gray-800">
                  {link.submenu.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      to={sub.path}
                      onClick={() => setIsMobileOpen(false)}
                      className="block text-sm font-medium text-gray-400 hover:text-green-500"
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