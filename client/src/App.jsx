import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// IMPORT COMPONENTS
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// IMPORT PAGES
import Home from './pages/Home'; 
import CategoryProject from './pages/CategoryProject'; 
import ProjectDetail from './pages/ProjectDetail';
import Quotation from './pages/Quotation';
import Contact from './pages/Contact';
import About from './pages/About';
import Team from './pages/Team';
import FloatingContact from './components/FloatingContact';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import NotFound from './components/NotFound';




// TÍNH NĂNG MỞ RỘNG: Tự động cuộn lên đầu trang mỗi khi chuyển link
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      {/* ScrollToTop đảm bảo khi chuyển trang sẽ không bị kẹt ở giữa hoặc cuối màn hình */}
      <ScrollToTop /> 

      <div className="flex flex-col min-h-screen bg-white">
        
        {/* NAVBAR - Luôn cố định ở trên */}
        <Navbar />
        
        {/* MAIN CONTENT - Thay đổi theo Route */}
        <main className="flex-grow">
          <Routes>
            {/* 1. Trang chủ */}
            <Route path="/" element={<Home />} />
            
            {/* 2. Trang danh sách tất cả hạng mục */}
            <Route path="/hang-muc-cong-trinh" element={<CategoryProject />} />
            
            {/* 3. Trang danh sách có LỌC theo hạng mục (Dynamic Routing) */}
            <Route path="/hang-muc-cong-trinh/:categorySlug" element={<CategoryProject />} />
            
            <Route path="/hang-muc/cong-trinh-chi-tiet/:id" element={<ProjectDetail />} />

            <Route path="/bao-gia" element={<Quotation />} />

            <Route path="/lien-he" element={<Contact />} />

            <Route path="/ve-ttp" element={<About />} />

            <Route path="/ve-ttp/doi-ngu-nhan-su" element={<Team />} />

            <Route path="/tin-tuc" element={<News />} />
            <Route path="/tin-tuc/:id" element={<NewsDetail />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </Router>
  );
}

export default App;