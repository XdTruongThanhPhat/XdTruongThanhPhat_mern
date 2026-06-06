import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Breadcrumb = ({ items }) => {
  // Tạo dữ liệu cho BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://truongthanhphatdn.vn/"
      },
      ...items.map((item, index) => {
        const entry = {
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
        };
        // Chỉ thêm "item" (URL) nếu đây KHÔNG phải trang hiện tại
        if (item.link) {
          entry.item = `https://truongthanhphatdn.vn${item.link}`;
        }
        return entry;
      })
    ]
  };

  return (
    <>
      {/* Inject BreadcrumbList Schema cho Google Rich Results */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <nav className="flex text-xs md:text-sm text-gray-500 mb-5 md:mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
          {/* Nút Trang chủ mặc định */}
          <li className="inline-flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/" className="inline-flex items-center hover:text-green-600 transition-colors font-medium" itemProp="item">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-1.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span itemProp="name">Trang chủ</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {/* Lặp qua các trang con */}
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {/* Dấu phân cách chevron */}
              <svg className="w-3 h-3 md:w-4 md:h-4 mx-1.5 md:mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              
              {item.link ? (
                <Link to={item.link} className="hover:text-green-600 transition-colors font-medium" itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                // Trang hiện tại: in đậm, không có Link
                <span className="text-green-600 font-bold line-clamp-1" itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;