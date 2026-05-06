import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Đang xác thực...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.username);
        toast.success("Đăng nhập thành công!", { id: toastId });
        window.location.href = '/'; // Reload trang để vào Dashboard
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) { toast.error("Lỗi máy chủ", { id: toastId }); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">TTP ARCHITECT</h2>
          <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest font-bold">Hệ thống quản trị</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập</label>
            <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-gray-50" placeholder="Nhập tài khoản" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-gray-50" placeholder="Nhập mật khẩu" />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-colors shadow-md">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;