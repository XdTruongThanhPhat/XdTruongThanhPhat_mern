import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddProject = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Biệt thự', location: '', floors: '', landArea: '', buildArea: '', cost: ''
  });
  
  // State lưu danh sách ảnh đã chọn
  const [images, setImages] = useState([]);

  // Hàm chọn ảnh: Cộng dồn ảnh mới vào danh sách ảnh cũ
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = null; // Reset input để có thể chọn lại file vừa xóa nếu đổi ý
  };

  // Hàm xóa ảnh khỏi danh sách dựa theo vị trí (index)
  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Vui lòng chọn ít nhất 1 hình ảnh!");
    
    setLoading(true);
    try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('info', JSON.stringify({
            location: formData.location, floors: formData.floors, landArea: formData.landArea, buildArea: formData.buildArea, cost: formData.cost
        }));

        // ẢNH ĐẦU TIÊN LÀM ẢNH BÌA (mainImage)
        data.append('mainImage', images[0]);
        
        // CÁC ẢNH CÒN LẠI LÀM ALBUM (projectImages)
        if (images.length > 1) {
            for (let i = 1; i < images.length; i++) {
                data.append('projectImages', images[i]);
            }
        }

        const response = await fetch('http://localhost:5000/api/projects/add', {
            method: 'POST',
            body: data
        });
        const result = await response.json();

        if (result.success) {
            toast.success("Thêm dự án thành công!");
            setFormData({ title: '', category: 'Biệt thự', location: '', floors: '', landArea: '', buildArea: '', cost: '' });
            setImages([]);
        } else {
            toast.error(result.message);
        }
    } catch (error) {
        toast.error("Lỗi kết nối Server");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thêm Dự Án Mới</h2>
        <p className="text-gray-500 text-sm mt-1">Ảnh đầu tiên bạn chọn sẽ tự động được làm ảnh bìa.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT THÔNG TIN (Giữ nguyên như cũ) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên công trình</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500">
                <option value="Nội thất">Nội thất</option>
                <option value="Nhà ở">Nhà ở</option>
                <option value="Căn hộ">Căn hộ</option>
                <option value="Nhà phố">Nhà phố</option>
                <option value="Công trình thực tế">Công trình thực tế</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Chi phí XD</label><input type="text" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Số tầng</label><input type="text" value={formData.floors} onChange={e => setFormData({...formData, floors: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Diện tích xây dựng</label><input type="text" value={formData.buildArea} onChange={e => setFormData({...formData, buildArea: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500" /></div>
          </div>
        </div>

        {/* CỘT ẢNH MỚI: TÍCH LŨY VÀ XÓA ẢNH */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh công trình ({images.length})</label>
          
          {/* Nút giả làm Input File để thiết kế đẹp hơn */}
          <label className="flex items-center justify-center w-full h-10 border-2 border-dashed border-green-400 rounded-lg cursor-pointer hover:bg-green-100 transition-colors mb-4 bg-green-50 text-green-600 font-medium text-sm">
            + Chọn thêm ảnh
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          
          {/* Hiển thị Preview Ảnh */}
          {images.length > 0 && (
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <p className="text-xs font-bold text-green-600">★ Ảnh bìa (Main):</p>
                <div className="relative group">
                    <img src={URL.createObjectURL(images[0])} alt="Cover" className="w-full h-32 object-cover rounded-lg border-2 border-green-500 shadow-sm" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(0)} 
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      ×
                    </button>
                </div>
                
                {images.length > 1 && (
                    <>
                        <p className="text-xs font-bold text-gray-600 mt-3">Các ảnh nội dung ({images.length - 1}):</p>
                        <div className="grid grid-cols-3 gap-2">
                            {images.slice(1).map((img, idx) => {
                                const realIndex = idx + 1; // Cân bằng lại index vì mảng đã bị slice
                                return (
                                  <div key={realIndex} className="relative group">
                                      <img src={URL.createObjectURL(img)} alt="Gallery" className="w-full h-16 object-cover rounded border border-gray-300" />
                                      <button 
                                        type="button" 
                                        onClick={() => removeImage(realIndex)} 
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                      >
                                        ×
                                      </button>
                                  </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 w-full md:w-auto">
            {loading ? 'Đang tải lên...' : 'Lưu dự án'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;