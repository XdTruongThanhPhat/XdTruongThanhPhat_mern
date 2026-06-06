// src/pages/Home.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import FeaturedProjects from '../components/FeaturedProjects.jsx';
import Process from '../components/Process';
import Testimonial from '../components/Testimonial';
import LatestBlogs from '../components/LatestBlogs';


const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Trường Thành Phát - Thiết Kế & Thi Công Xây Dựng Đà Nẵng</title>
        <meta name="description" content="Công ty Trường Thành Phát chuyên tư vấn thiết kế kiến trúc, thi công xây dựng nhà phố, biệt thự tại Đà Nẵng. Chất lượng cam kết, đúng tiến độ." />
        <link rel="canonical" href="https://truongthanhphatdn.vn/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Trường Thành Phát - Thiết Kế & Thi Công Xây Dựng Đà Nẵng" />
        <meta property="og:description" content="Công ty Trường Thành Phát chuyên tư vấn thiết kế kiến trúc, thi công xây dựng nhà phố, biệt thự tại Đà Nẵng" />
        <meta property="og:url" content="https://truongthanhphatdn.vn/" />
        <meta property="og:image" content="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trường Thành Phát - Thiết Kế & Thi Công Xây Dựng Đà Nẵng" />
        <meta name="twitter:description" content="Công ty Trường Thành Phát chuyên tư vấn thiết kế kiến trúc, thi công xây dựng nhà phố, biệt thự tại Đà Nẵng" />
        <meta name="twitter:image" content="https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png" />

        {/* Schema: LocalBusiness */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Trường Thành Phát",
            "image": "https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png",
            "@id": "https://truongthanhphatdn.vn/#localbusiness",
            "url": "https://truongthanhphatdn.vn/",
            "telephone": "0387176793",
            "priceRange": "$$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "256 Diên Hồng, Hòa Xuân",
              "addressLocality": "Hòa Xuân, Cẩm Lệ",
              "addressRegion": "Đà Nẵng",
              "addressCountry": "VN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 16.0112,
              "longitude": 108.2258
            },
            "sameAs": [
              "https://www.facebook.com/XDTRUONGTHANHPHAT"
            ]
          })}
        </script>

        {/* Schema: WebSite (giúp Google hiển thị Sitelinks Searchbox) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Trường Thành Phát",
            "url": "https://truongthanhphatdn.vn/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://truongthanhphatdn.vn/tin-tuc?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* Schema: Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Trường Thành Phát",
            "url": "https://truongthanhphatdn.vn/",
            "logo": "https://truongthanhphatdn.vn/Logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+84387176793",
              "contactType": "customer service",
              "availableLanguage": "Vietnamese"
            },
            "sameAs": [
              "https://www.facebook.com/XDTRUONGTHANHPHAT"
            ]
          })}
        </script>
      </Helmet>
      <Hero />
      <FeaturedProjects />
      <LatestBlogs />
      <Process />
      <Testimonial />
    </div>
  );
};

export default Home;