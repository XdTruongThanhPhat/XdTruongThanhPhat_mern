// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import FeaturedProjects from '../components/FeaturedProjects.jsx';
import Process from '../components/Process';
import Testimonial from '../components/Testimonial';
import LatestBlogs from '../components/LatestBlogs';


const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedProjects />
      <LatestBlogs />
      <Process />
      <Testimonial />
    </div>
  );
};

export default Home;