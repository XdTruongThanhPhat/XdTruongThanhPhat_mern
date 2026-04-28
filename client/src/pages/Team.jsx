import React, { useState, useEffect } from 'react';

const Team = () => {
  // Thay dữ liệu cứng bằng State rỗng chờ API
  const [teamData, setTeamData] = useState({
      bannerUrl: '',
      management: [],
      officeStaff: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch API khi trang vừa load
  useEffect(() => {
      const fetchTeam = async () => {
          try {
              const res = await fetch('http://localhost:5000/api/team');
              const data = await res.json();
              if (data.success && data.team) {
                  setTeamData(data.team);
              }
          } catch (error) {
              console.error("Lỗi khi tải dữ liệu Team:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchTeam();
  }, []);

  if (loading) return <div className="pt-32 text-center min-h-screen">Đang tải dữ liệu...</div>;

  return (
    <section className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PHẦN 1: BANNER TẬP THỂ */}
        {teamData.bannerUrl && (
          <div className="mb-20 overflow-hidden rounded-xl shadow-2xl">
            <div className="relative h-[40vh] md:h-[65vh]">
              <img 
                src={teamData.bannerUrl} 
                alt="TTP Team Group" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* PHẦN 2: ĐỘI NGŨ QUẢN LÝ */}
        {teamData.management.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
               <div className="h-px bg-gray-200 grow"></div>
               <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-black text-center px-4">
                 Đội Ngũ Quản Lý
               </h2>
               <div className="h-px bg-gray-200 grow"></div>
            </div>
            
            {/* Tự động chia cột và canh giữa dựa vào số lượng Quản lý */}
            <div className={`grid ${
                teamData.management.length === 1 ? "grid-cols-1 max-w-sm mx-auto" :
                teamData.management.length === 2 ? "grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto" :
                teamData.management.length === 3 ? "grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto" :
                "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            }`}>
              {teamData.management.map((leader) => (
                <div key={leader._id} className="text-center group">
                  <div className="aspect-3/4 overflow-hidden rounded-sm mb-6 bg-gray-50 border border-gray-100 shadow-sm relative">
                    <img 
                      src={leader.imageUrl} 
                      alt={leader.name} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
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
        )}

        {/* PHẦN 3: NHÂN VIÊN VĂN PHÒNG */}
        {teamData.officeStaff.length > 0 && (
          <div className="bg-gray-50 py-16 px-6 rounded-2xl border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-black text-center mb-16">
              Nhân viên tại văn phòng TTP
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {teamData.officeStaff.map((staff) => (
                <div key={staff._id} className="aspect-3/4 overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-500 group">
                  <img 
                    src={staff.imageUrl} 
                    alt="TTP Staff" 
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Team;