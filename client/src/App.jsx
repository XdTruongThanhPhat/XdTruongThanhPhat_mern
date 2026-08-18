import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// IMPORT COMPONENTS (Luôn cần, không lazy)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import NotFound from './components/NotFound';

// IMPORT PAGES — Trang chủ giữ import tĩnh (tương thích prerender)
import Home from './pages/Home';

// LAZY IMPORT — Các trang khác chỉ tải JS khi user truy cập (Code Splitting)
const CategoryProject = lazy(() => import('./pages/CategoryProject'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Quotation = lazy(() => import('./pages/Quotation'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Team = lazy(() => import('./pages/Team'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Videos = lazy(() => import('./pages/Videos'));
const VideoDetail = lazy(() => import('./pages/VideoDetail'));




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
        
        {/* Skip to content – Accessibility: screen reader có thể bỏ qua Navbar */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:bg-green-600 focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
          Bỏ qua điều hướng
        </a>

        {/* NAVBAR - Luôn cố định ở trên */}
        <Navbar />
        
        {/* MAIN CONTENT - Thay đổi theo Route */}
        <main id="main-content" className="flex-grow">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-green-600 font-bold animate-pulse">Đang tải trang...</p>
            </div>
          }>
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

            <Route path="/video" element={<Videos />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </Router>
  );
}

export default App;