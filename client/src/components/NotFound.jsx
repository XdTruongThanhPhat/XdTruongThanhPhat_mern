import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Khối hiển thị Lỗi */}
        <main className="sm:flex sm:items-center sm:justify-center">
          <p className="text-6xl md:text-8xl font-extrabold text-green-600 tracking-tighter">
            404
          </p>
          <div className="sm:ml-6 sm:border-l sm:border-gray-300 sm:pl-6 text-left mt-6 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black uppercase tracking-wide mb-2">
              Không tìm thấy trang!
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Có vẻ như đường dẫn bạn đang tìm kiếm không tồn tại, đã bị dời đi hoặc tạm thời không thể truy cập.
            </p>
          </div>
        </main>

        {/* Cụm nút điều hướng */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-sm font-bold rounded-sm text-white bg-green-600 hover:bg-black transition-colors duration-300 uppercase tracking-widest shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
          
          <Link
            to="/lien-he"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border-2 border-green-600 text-sm font-bold rounded-sm text-green-700 bg-transparent hover:bg-green-50 transition-colors duration-300 uppercase tracking-widest"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>

        {/* Thêm một chút họa tiết trang trí góc dưới */}
        <div className="mt-16 flex justify-center opacity-30">
           <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" opacity="0.2"/>
              <path d="M12 5.5l-6 6V19h4v-6h4v6h4v-7.5l-6-6z" />
           </svg>
        </div>
        
      </div>
    </section>
  );
};

export default NotFound;