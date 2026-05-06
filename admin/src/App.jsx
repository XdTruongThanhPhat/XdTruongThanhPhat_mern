import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// IMPORT CÁC TRANG (PAGES)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import ManageProject from './pages/ManageProject';
import Content from './pages/Content';
import ManageMember from './pages/ManageMember';
import ManageTestimonial from './pages/ManageTestimonial';
import ManageBanner from './pages/ManageBanner';
import ManageBlog from './pages/ManageBlog';
import AccountSettings from './pages/AccountSettings';

// COMPONENT BẢO VỆ ROUTE (Chỉ cho phép Admin đã đăng nhập)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  // Nếu có token thì cho truy cập, nếu không thì đá văng ra trang Login
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Thông báo Toast toàn cục */}
      <Toaster position="top-right" />
      
      <Routes>
        {/* TRANG ĐĂNG NHẬP (Không cần bảo vệ) */}
        <Route path="/login" element={<Login />} />

        {/* KHU VỰC QUẢN TRỊ (Đã bị khóa bảo vệ) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Mặc định khi vào '/' sẽ chuyển hướng sang trang Quản lý dự án */}
          <Route index element={<Navigate to="/manage-projects" replace />} />
          
          <Route path="add-project" element={<AddProject />} />
          <Route path="manage-projects" element={<ManageProject />} />
          <Route path="content" element={<Content />} />
          
          <Route path="manage-member" element={<ManageMember />} />
          <Route path="manage-testimonial" element={<ManageTestimonial />} />
          
          <Route path="manage-banner" element={<ManageBanner />} />
          <Route path="manage-blog" element={<ManageBlog />} />

          <Route path="account-settings" element={<AccountSettings />} />
        </Route>

        {/* Bắt lỗi đường dẫn sai: Trả về trang Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;