import React from 'react';

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 h-16 shrink-0 shadow-sm'>
        <div className='text-xl font-bold text-green-600 tracking-wider'>
            TTP ARCHITECT <span className='text-gray-800 font-medium'>ADMIN</span>
        </div>
        <div className='flex items-center gap-4'>
            <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow'>
                A
            </div>
            <span className="font-medium text-gray-700 hidden sm:block">Admin</span>
        </div>
    </div>
  );
};

export default Navbar;