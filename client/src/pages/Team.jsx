import React, { useState } from 'react';

const Team = () => {
  // 1. Dữ liệu Banner (Sau này admin có thể thay đổi link ảnh)
  const bannerUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000";

  // 2. State cho Đội ngũ quản lý (Tên + Chức vụ)
  const [management, setManagement] = useState([
    { id: 1, name: 'KTS. Lê Thạc Khoát', role: 'Founder / Giám đốc TTP', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'KTS. Hà Thái Chiến', role: 'Giám đốc TTP Miền Nam', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'KTS. Nguyễn Cảnh Trường', role: 'Giám đốc Kỹ thuật', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800' }
  ]);

  // 3. State cho Nhân viên văn phòng (Chỉ ảnh)
  const [officeStaff, setOfficeStaff] = useState([
    { id: 101, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' },
    { id: 102, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800' },
    { id: 103, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
    { id: 104, imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800' },
    { id: 105, imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800' },
    { id: 106, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
    { id: 107, imageUrl: 'https://images.unsplash.com/photo-1517070208541-6d8f859fb7f8?auto=format&fit=crop&q=80&w=800' },
    { id: 108, imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800' },
  ]);

  return (
    <section className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PHẦN 1: BANNER TẬP THỂ */}
        <div className="mb-20 overflow-hidden rounded-xl shadow-2xl">
          <div className="relative h-[40vh] md:h-[65vh]">
            <img 
              src={bannerUrl} 
              alt="TTP Team Group" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* PHẦN 2: ĐỘI NGŨ QUẢN LÝ (Có Tên & Chức vụ) */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-px bg-gray-200 grow"></div>
             <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-black text-center px-4">
               Đội Ngũ Quản Lý
             </h2>
             <div className="h-px bg-gray-200 grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {management.map((leader) => (
              <div key={leader.id} className="text-center group">
                <div className="aspect-3/4 overflow-hidden rounded-sm mb-6 bg-gray-50 border border-gray-100 shadow-sm relative">
                  <img 
                    src={leader.imageUrl} 
                    alt={leader.name} 
                    // Đã xóa grayscale
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  {/* Đường kẻ trang trí */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
                <h3 className="text-lg font-bold text-black uppercase tracking-wide group-hover:text-green-500 transition-colors">
                  {leader.name}
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest italic border-t border-gray-100 pt-2 inline-block">
                  {leader.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PHẦN 3: NHÂN VIÊN VĂN PHÒNG (Chỉ Ảnh - Grid 4 cột) */}
        <div className="bg-gray-50 py-16 px-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-black text-center mb-16">
            Nhân viên tại văn phòng TTP
          </h2>
          
          {/* Grid 4 cột chuẩn xác */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {officeStaff.map((staff) => (
              <div key={staff.id} className="aspect-3/4 overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-500 group">
                <img 
                  src={staff.imageUrl} 
                  alt="TTP Staff" 
                  // Đã xóa grayscale
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Team;