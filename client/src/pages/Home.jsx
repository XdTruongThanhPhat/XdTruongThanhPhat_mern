// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import FeaturedProjects from '../components/FeaturedProjects.jsx';
import Process from '../components/Process';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedProjects />
      <Process />
    </div>
  );
};

export default Home;