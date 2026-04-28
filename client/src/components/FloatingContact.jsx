import React from 'react';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 items-end">
      
      {/* Nút Messenger */}
      <a href="https://www.facebook.com/XDTRUONGTHANHPHAT" target="_blank" rel="noreferrer" className="relative group flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-lg hover:scale-110 transition-transform">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.865 1.424 5.433 3.638 7.085v3.493l3.32-1.825c.974.27 1.99.418 3.042.418 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm1.08 12.35l-2.73-2.91-5.34 2.91 5.86-6.22 2.76 2.9 5.31-2.9-5.86 6.22z"/></svg>
        <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Messenger</span>
      </a>

      {/* Nút Zalo */}
      <a href="https://zalo.me/0912877908" target="_blank" rel="noreferrer" className="relative group flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform">
        <span className="text-white font-bold text-xl">Z</span>
        <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Zalo Chat</span>
      </a>

      {/* Nút Gọi Điện (Có hiệu ứng rung và sóng âm) */}
      <div className="relative">
        {/* Vòng sóng âm tỏa ra */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <a href="tel:0912877908" className="relative group flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-xl hover:bg-green-600 transition-colors animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <span className="absolute right-16 bg-green-600 text-white font-bold text-sm px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            0912877908
          </span>
        </a>
      </div>

    </div>
  );
};

export default FloatingContact;