import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import ManageProject from './pages/ManageProject';
import Content from './pages/Content'; // <-- 1. Import Content vào đây
import ManageMember from './pages/ManageMember';
import ManageTestimonial from './pages/ManageTestimonial'
import ManageBlog from './pages/ManageBlog';
import ManageBanner from './pages/ManageBanner';


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="/add-project" replace />} />
          
          <Route path="add-project" element={<AddProject />} />
          <Route path="manage-projects" element={<ManageProject />} />
          <Route path="content" element={<Content />} /> {/* <-- 2. Thêm Route này */}
          <Route path="manage-member" element={<ManageMember />} />
          <Route path="manage-testimonial" element={<ManageTestimonial/>} />
          <Route path="manage-blog" element={<ManageBlog/>} />
          <Route path="manage-banner" element={<ManageBanner/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;