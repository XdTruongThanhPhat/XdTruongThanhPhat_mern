import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ManageMember = () => {
  const [teamData, setTeamData] = useState({ bannerUrl: '', management: [], officeStaff: [] });
  const [loading, setLoading] = useState(true);

  // Form State
  const [managerForm, setManagerForm] = useState({ name: '', role: '', file: null });

  // 1. Fetch Dữ liệu
  const fetchTeamData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/team');
      const data = await res.json();
      if (data.success) setTeamData(data.team);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchTeamData(); }, []);

  // 2. Cập nhật Banner
  const handleUpdateBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const toastId = toast.loading("Đang tải banner lên...");
    try {
      const formData = new FormData();
      formData.append('banner', file);
      const res = await fetch('http://localhost:5000/api/team/banner', { method: 'PUT', body: formData });
      const data = await res.json();
      if (data.success) {
          setTeamData(data.team);
          toast.success("Cập nhật Banner thành công!", { id: toastId });
      }
    } catch (error) { toast.error("Lỗi upload", { id: toastId }); }
  };

  // 3. Thêm Quản lý
  const handleAddManager = async (e) => {
    e.preventDefault();
    if (!managerForm.file) return toast.error("Vui lòng chọn ảnh!");
    const toastId = toast.loading("Đang thêm quản lý...");
    
    try {
      const formData = new FormData();
      formData.append('name', managerForm.name);
      formData.append('role', managerForm.role);
      formData.append('image', managerForm.file);

      const res = await fetch('http://localhost:5000/api/team/management', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
          setTeamData(data.team);
          setManagerForm({ name: '', role: '', file: null }); // Reset form
          toast.success("Thêm thành công!", { id: toastId });
      }
    } catch (error) { toast.error("Lỗi thêm quản lý", { id: toastId }); }
  };

  // 4. Thêm ảnh Nhân viên
  const handleAddStaff = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const toastId = toast.loading("Đang tải ảnh nhân viên lên...");
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const res = await fetch('http://localhost:5000/api/team/staff', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
          setTeamData(data.team);
          toast.success("Thêm ảnh thành công!", { id: toastId });
      }
    } catch (error) { toast.error("Lỗi upload ảnh", { id: toastId }); }
  };

  // 5. Hàm Xóa chung (Dùng cho cả Manager và Staff)
  const handleDelete = async (type, id) => {
    if(!window.confirm("Xóa nhân sự này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/team/${type}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if(data.success) setTeamData(data.team);
    } catch (error) { toast.error("Lỗi khi xóa"); }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đội ngũ nhân sự</h2>

        {/* --- BLOCK 1: BANNER --- */}
        <div className="mb-8 border-b pb-8">
            <h3 className="font-semibold text-lg text-gray-700 mb-3">1. Ảnh Banner Tập Thể</h3>
            {teamData.bannerUrl && (
                <img src={teamData.bannerUrl} alt="Banner" className="w-full h-48 object-cover rounded-lg border mb-3" />
            )}
            <label className="bg-gray-100 px-4 py-2 rounded border border-gray-300 cursor-pointer hover:bg-gray-200 text-sm font-medium">
                Chọn ảnh Banner thay thế
                <input type="file" accept="image/*" onChange={handleUpdateBanner} className="hidden" />
            </label>
        </div>

        {/* --- BLOCK 2: ĐỘI NGŨ QUẢN LÝ --- */}
        <div className="mb-8 border-b pb-8">
            <h3 className="font-semibold text-lg text-gray-700 mb-3">2. Đội ngũ Quản lý</h3>
            {/* Form Thêm */}
            <form onSubmit={handleAddManager} className="flex gap-3 mb-6 bg-green-50 p-4 rounded-lg border border-green-100 items-end">
                <div className="flex-1">
                    <label className="text-xs font-bold text-green-700">Tên Quản Lý</label>
                    <input required type="text" value={managerForm.name} onChange={e => setManagerForm({...managerForm, name: e.target.value})} className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500" />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-green-700">Chức vụ</label>
                    <input required type="text" value={managerForm.role} onChange={e => setManagerForm({...managerForm, role: e.target.value})} className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500" />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-green-700">Ảnh chân dung</label>
                    <input required type="file" accept="image/*" onChange={e => setManagerForm({...managerForm, file: e.target.files[0]})} className="w-full mt-1 p-1.5 border rounded bg-white text-sm" />
                </div>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 h-[42px]">Thêm</button>
            </form>

            {/* List Quản lý */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {teamData.management.map(mgr => (
                    <div key={mgr._id} className="relative border rounded p-3 text-center group">
                        <img src={mgr.imageUrl} alt={mgr.name} className="w-full h-32 object-cover rounded mb-2" />
                        <h4 className="font-bold text-sm text-gray-800">{mgr.name}</h4>
                        <p className="text-xs text-green-600 font-medium">{mgr.role}</p>
                        <button onClick={() => handleDelete('management', mgr._id)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition shadow">×</button>
                    </div>
                ))}
            </div>
        </div>

        {/* --- BLOCK 3: NHÂN VIÊN VĂN PHÒNG --- */}
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-700">3. Ảnh Nhân viên Văn phòng</h3>
                <label className="bg-green-100 text-green-700 px-4 py-2 rounded font-bold cursor-pointer hover:bg-green-200 text-sm">
                    + Upload nhiều ảnh
                    <input type="file" multiple accept="image/*" onChange={handleAddStaff} className="hidden" />
                </label>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {teamData.officeStaff.map(staff => (
                    <div key={staff._id} className="relative group">
                        <img src={staff.imageUrl} alt="Staff" className="w-full h-24 object-cover rounded border" />
                        <button onClick={() => handleDelete('staff', staff._id)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition shadow">×</button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ManageMember;