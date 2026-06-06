import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ManageProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phục vụ Edit
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', category: '', info: {}, 
    existingMainImage: '', existingImages: [],
    newMainFile: null, newImageFiles: [],
    createdAt: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/list`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách dự án");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác!")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if(data.success) {
            toast.success("Xóa dự án thành công!");
            setProjects(projects.filter(p => p._id !== id));
        } else {
            toast.error(data.message);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa dự án");
      }
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setEditForm({
      title: project.title,
      category: project.category, // Backend trả về sao thì hứng vậy
      info: project.info || {},
      existingMainImage: project.mainImage,
      existingImages: project.projectImages || [],
      newMainFile: null,
      newImageFiles: [],
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString().split('T')[0] : ''
    });
  };

  const handleChangeMainImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditForm({ ...editForm, newMainFile: e.target.files[0] });
    }
  };

  const handleRemoveExistingImage = (index) => {
    const updatedImages = editForm.existingImages.filter((_, i) => i !== index);
    setEditForm({ ...editForm, existingImages: updatedImages });
  };

  const handleAddNewImages = (e) => {
    const files = Array.from(e.target.files);
    setEditForm({ ...editForm, newImageFiles: [...editForm.newImageFiles, ...files] });
    e.target.value = null; 
  };

  const handleRemoveNewImage = (index) => {
    const updatedNewFiles = editForm.newImageFiles.filter((_, i) => i !== index);
    setEditForm({ ...editForm, newImageFiles: updatedNewFiles });
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('category', editForm.category);
      formData.append('info', JSON.stringify(editForm.info));
      
      formData.append('existingMainImage', editForm.existingMainImage);
      formData.append('existingImages', JSON.stringify(editForm.existingImages));

      if (editForm.createdAt) {
        formData.append('createdAt', editForm.createdAt);
      }

      if (editForm.newMainFile) {
        formData.append('mainImage', editForm.newMainFile);
      }
      editForm.newImageFiles.forEach((file) => {
        formData.append('projectImages', file);
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
        method: 'PUT',
        body: formData 
      });
      
      const data = await res.json();
      if(data.success) {
          toast.success("Cập nhật dự án thành công!");
          setProjects(projects.map(p => p._id === id ? data.project : p));
          setEditingId(null);
      } else {
          toast.error(data.message);
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}/feature`, { method: 'PATCH' });
      const data = await res.json();
      
      if(data.success) {
        setProjects(projects.map(p => p._id === id ? { ...p, isFeatured: data.isFeatured } : p));
        toast.success(data.isFeatured ? "Đã ghim lên Dự án tiêu biểu!" : "Đã gỡ khỏi Dự án tiêu biểu!");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý dự án</h2>
        <p className="text-gray-500 text-sm mt-1">Xem, chỉnh sửa hoặc xóa các dự án kiến trúc hiện có</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700 text-sm">Hình ảnh</th>
              <th className="p-4 font-semibold text-gray-700 text-sm">Tên dự án</th>
              <th className="p-4 font-semibold text-gray-700 text-sm">Loại hình</th>
              <th className="p-4 font-semibold text-gray-700 text-sm">Vị trí</th>
              <th className="p-4 font-semibold text-gray-700 text-sm text-center">Tiêu biểu</th> 
              <th className="p-4 font-semibold text-gray-700 text-sm text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chưa có dự án nào</td></tr> // Đổi colspan thành 6 vì có 6 cột
            ) : (
              projects.map(proj => (
                <React.Fragment key={proj._id}>
                  {editingId === proj._id ? (
                    // ================= KHU VỰC ĐANG CHỈNH SỰA =================
                    <tr className="bg-green-50/30">
                      <td colSpan="6" className="p-6 border-2 border-green-400 rounded-lg">
                        <div className="space-y-6">
                          <h3 className="font-bold text-green-700 text-lg border-b border-green-200 pb-2">Đang chỉnh sửa: {proj.title}</h3>
                          
                          {/* 1. Form Sửa Text */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tên dự án</label>
                                <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Loại hình</label>
                                {/* SỬA LỖI Ở ĐÂY: Thêm đầy đủ 5 option */}
                                <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white">
                                    <option value="Nội thất">Nội thất</option>
                                    <option value="Biệt thự">Biệt thự</option>
                                    <option value="Căn hộ">Căn hộ</option>
                                    <option value="Nhà phố">Nhà phố</option>
                                    <option value="Công trình thực tế">Công trình thực tế</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Vị trí</label>
                                <input type="text" value={editForm.info?.location || ''} onChange={(e) => setEditForm({...editForm, info: {...editForm.info, location: e.target.value}})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Chi phí XD</label>
                                <input type="text" value={editForm.info?.cost || ''} onChange={(e) => setEditForm({...editForm, info: {...editForm.info, cost: e.target.value}})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Số tầng</label>
                                <input type="text" value={editForm.info?.floors || ''} onChange={(e) => setEditForm({...editForm, info: {...editForm.info, floors: e.target.value}})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Diện tích xây dựng</label>
                                <input type="text" value={editForm.info?.buildArea || ''} onChange={(e) => setEditForm({...editForm, info: {...editForm.info, buildArea: e.target.value}})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ngày đăng bài</label>
                                <input type="date" value={editForm.createdAt} onChange={(e) => setEditForm({...editForm, createdAt: e.target.value})} className="border rounded p-2 w-full text-sm outline-none focus:border-green-500 mt-1 bg-white" />
                            </div>
                          </div>

                          {/* 2. Form Sửa Ảnh */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">Ảnh Bìa (Main Image)</label>
                                <div className="relative group">
                                    <img 
                                      src={editForm.newMainFile ? URL.createObjectURL(editForm.newMainFile) : editForm.existingMainImage} 
                                      alt="Main" className="w-full h-32 object-cover rounded border-2 border-green-500" 
                                    />
                                </div>
                                <label className="mt-3 block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-1.5 rounded cursor-pointer transition">
                                    Thay đổi ảnh bìa
                                    <input type="file" accept="image/*" className="hidden" onChange={handleChangeMainImage} />
                                </label>
                            </div>

                            <div className="md:col-span-2 bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-gray-700">Album Công Trình</label>
                                    <label className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded cursor-pointer transition">
                                        + Thêm ảnh mới
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddNewImages} />
                                    </label>
                                </div>
                                
                                <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
                                    {editForm.existingImages.map((imgUrl, index) => (
                                        <div key={`old-${index}`} className="relative group">
                                            <img src={imgUrl} alt="Old" className="w-full h-16 object-cover rounded border border-gray-300" />
                                            <button type="button" onClick={() => handleRemoveExistingImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow">×</button>
                                        </div>
                                    ))}
                                    
                                    {editForm.newImageFiles.map((file, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                            <img src={URL.createObjectURL(file)} alt="New" className="w-full h-16 object-cover rounded border-2 border-blue-400" />
                                            <span className="absolute bottom-0 bg-blue-500 text-white text-[9px] px-1 w-full text-center">Mới</span>
                                            <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                              <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-6 py-2 rounded font-medium hover:bg-gray-500 transition">Hủy bỏ</button>
                              <button onClick={() => handleSave(proj._id)} className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 transition shadow-lg">LƯU CẬP NHẬT</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // ================= CHẾ ĐỘ XEM BÌNH THƯỜNG =================
                    <tr className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <img src={proj.mainImage} alt="Main" className="w-16 h-12 object-cover rounded border border-gray-200" />
                      </td>
                      <td className="p-4 text-gray-800 font-medium">{proj.title}</td>
                      <td className="p-4 text-gray-600">{proj.category}</td>
                      <td className="p-4 text-gray-600">{proj.info?.location || '-'}</td>
                      <td className="p-4 text-center">
                        {/* SỬA LỖI Ở ĐÂY: Xóa bớt thẻ <td> thừa */}
                        <button 
                          onClick={() => handleToggleFeature(proj._id)}
                          className={`text-2xl transition-transform hover:scale-125 ${proj.isFeatured ? 'text-yellow-400 drop-shadow-md' : 'text-gray-300 hover:text-yellow-200'}`}
                          title={proj.isFeatured ? "Bỏ ghim tiêu biểu" : "Ghim làm tiêu biểu"}
                        >
                          ★
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(proj)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 text-sm font-medium">Sửa</button>
                          <button onClick={() => handleDelete(proj._id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 text-sm font-medium">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProject;