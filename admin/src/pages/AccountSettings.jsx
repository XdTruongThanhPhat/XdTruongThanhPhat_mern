import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AccountSettings = () => {
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  const token = localStorage.getItem('adminToken');

  // Hàm tạo Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();
      if(data.success) {
          toast.success("Tạo tài khoản thành công!");
          setNewAdmin({username: '', password: ''});
      } else toast.error(data.message);
    } catch (error) { toast.error("Lỗi máy chủ"); }
  };

  // Hàm đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if(passwords.newPassword !== passwords.confirmPassword) return toast.error("Mật khẩu xác nhận không khớp!");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword })
      });
      const data = await res.json();
      if(data.success) {
          toast.success("Đổi mật khẩu thành công!");
          setPasswords({oldPassword: '', newPassword: '', confirmPassword: ''});
      } else toast.error(data.message);
    } catch (error) { toast.error("Lỗi máy chủ"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-5xl space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Cài đặt Tài khoản</h2>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-100">Đăng xuất</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form tạo tài khoản */}
            <form onSubmit={handleCreateAdmin} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100">Tạo tài khoản Admin mới</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập</label>
                        <input required type="text" value={newAdmin.username} onChange={e=>setNewAdmin({...newAdmin, username: e.target.value})} className="w-full border p-2.5 rounded bg-gray-50 focus:border-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                        <input required type="password" value={newAdmin.password} onChange={e=>setNewAdmin({...newAdmin, password: e.target.value})} className="w-full border p-2.5 rounded bg-gray-50 focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-black text-white font-bold py-2.5 rounded hover:bg-gray-800">Tạo Tài Khoản</button>
                </div>
            </form>

            {/* Form đổi mật khẩu */}
            <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100">Đổi mật khẩu của bạn</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu hiện tại</label>
                        <input required type="password" value={passwords.oldPassword} onChange={e=>setPasswords({...passwords, oldPassword: e.target.value})} className="w-full border p-2.5 rounded bg-gray-50 focus:border-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu mới</label>
                        <input required type="password" value={passwords.newPassword} onChange={e=>setPasswords({...passwords, newPassword: e.target.value})} className="w-full border p-2.5 rounded bg-gray-50 focus:border-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                        <input required type="password" value={passwords.confirmPassword} onChange={e=>setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full border p-2.5 rounded bg-gray-50 focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2.5 rounded hover:bg-green-700">Lưu Mật Khẩu</button>
                </div>
            </form>
        </div>
    </div>
  );
};
export default AccountSettings;