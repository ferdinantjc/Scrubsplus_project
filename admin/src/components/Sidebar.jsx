import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Download } from 'lucide-react'; // ✅ Lucide icon

const Sidebar = () => {
  const [showToast, setShowToast] = useState(false);

  const handleDownloadClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // hide after 3s
  };

  return (
    <div className='w-[18%] min-h-screen border-r-2 relative'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
          to="/add"
        >
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
          to="/list"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>List Items</p>
        </NavLink>

        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
          to="/orders"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Orders</p>
        </NavLink>

        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
          to="/upload"
        >
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Upload CSV</p>
        </NavLink>

        {/* ✅ NEW Download Subscribers Button with Lucide Icon */}
        <a
          href="http://localhost:4000/api/newsletter/export"
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
          onClick={handleDownloadClick}
          download
        >
          <Download className='w-5 h-5' />
          <p className='hidden md:block'>Download Subscribers</p>
        </a>
      </div>

      {/* ✅ TOAST */}
      {showToast && (
        <div className="absolute bottom-4 left-[20%] bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
          Subscribers CSV downloaded!
        </div>
      )}
    </div>
  );
};

export default Sidebar;
