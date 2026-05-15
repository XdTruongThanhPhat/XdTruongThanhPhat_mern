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
        <title>Trường Thành Phát - Thiết Kế &amp; Thi Công Xây Dựng Đà Nẵng</title>
        <meta name="description" content="Công ty Trường Thành Phát chuyên tư vấn thiết kế kiến trúc, thi công xây dựng nhà phố, biệt thự tại Đà Nẵng" />
        <link rel="canonical" href="https://truongthanhphatdn.vn/" />
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