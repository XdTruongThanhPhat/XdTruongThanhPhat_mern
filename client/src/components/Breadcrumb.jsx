import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex text-xs md:text-sm text-gray-500 mb-5 md:mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center flex-wrap">
        {/* Nút Trang chủ mặc định */}
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-green-600 transition-colors font-medium">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Trang chủ
          </Link>
        </li>

        {/* Lặp qua các trang con (Tin tức, Dự án...) */}
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {/* Dấu phân cách '-' theo yêu cầu */}
            <span className="mx-2 text-gray-400 font-bold">-</span>
            
            {item.link ? (
              <Link to={item.link} className="hover:text-green-600 transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              // Trang hiện tại đang đứng sẽ in đậm, không có Link và áp dụng line-clamp để chống tràn
              <span className="text-green-600 font-bold line-clamp-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;