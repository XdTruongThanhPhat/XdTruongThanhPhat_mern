import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const menuItems = [
    { name: 'Thêm dự án mới', path: '/add-project', icon: '➕' },
    { name: 'Quản lý dự án', path: '/manage-projects', icon: '📁' },
    { name: 'Nội dung dự án', path: '/content', icon: '📁' },
    { name: 'Quản lý nhân sự', path: '/manage-member', icon: '👥' },
    { name: 'Phản hồi', path: '/manage-testimonial', icon: '👥' },
  ];

  return (
    <div className='flex flex-col h-screen bg-gray-50 overflow-hidden'>
      <Navbar />
      <div className='flex h-[calc(100vh-4rem)]'>
        {/* SIDEBAR TÍCH HỢP TRỰC TIẾP VÀO DASHBOARD */}
        <div className='w-64 bg-white border-r border-gray-200 h-full flex flex-col pt-6 shrink-0 shadow-sm'>
          {menuItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors
                ${isActive ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <span className='text-lg'>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* KHU VỰC HIỂN THỊ TRANG CON */}
        <div className='flex-1 p-6 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;