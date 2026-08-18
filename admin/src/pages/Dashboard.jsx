import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const adminUser = localStorage.getItem('adminUser') || 'Admin';

  // Danh sách các mục trong Menu
  const menuItems = [
    { name: 'Thêm dự án mới', path: '/add-project', icon: '➕' },
    { name: 'Quản lý dự án', path: '/manage-projects', icon: '📁' },
    { name: 'Nội dung dự án', path: '/content', icon: '📝' },
    { name: 'Quản lý Slide Banner', path: '/manage-banner', icon: '🖼️' },
    { name: 'Quản lý Tin tức (Blog)', path: '/manage-blog', icon: '📰' },
    { name: 'Quản lý Video', path: '/manage-video', icon: '🎬' },
    { name: 'Quản lý Nhân sự', path: '/manage-member', icon: '👥' },
    { name: 'Quản lý Phản hồi', path: '/manage-testimonial', icon: '💬' },
    { name: 'Cài đặt Tài khoản', path: '/account-settings', icon: '⚙️' },
  ];

  // Hàm Đăng xuất
  const handleLogout = () => {
    if(window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR - MENU BÊN TRÁI */}
      <div className="w-72 bg-black text-white flex flex-col shadow-2xl z-20">
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-widest text-green-500 uppercase">TTP ARCHITECT</h1>
        </div>
        
        {/* MENU ITEMS */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 translate-x-2' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-center text-xs text-gray-500">© 2026 TTP CMS System</p>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG BÊN PHẢI */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-200 z-10">
          <h2 className="text-xl font-bold text-gray-800">Hệ thống Quản trị</h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border-2 border-green-500">
                {adminUser.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">Xin chào, {adminUser}</p>
                <p className="text-xs text-green-600 font-medium">Quản trị viên</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-sm font-bold transition-colors border border-red-100"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* MAIN CONTENT NƠI RENDER CÁC TRANG CON */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;