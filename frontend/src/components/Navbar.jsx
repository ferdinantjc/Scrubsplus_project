import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [currency, setCurrency] = useState('AUD');
  const [tryOnDropdownOpen, setTryOnDropdownOpen] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const toggleTryOnDropdown = () => {
    setTryOnDropdownOpen(!tryOnDropdownOpen);
  };

  const closeAllMenus = () => {
    setVisible(false);
    setTryOnDropdownOpen(false);
  };

  return (
    <div className='flex items-center justify-between py-5 font-medium relative z-50'>
      <Link to='/'>
        <img src={assets.logo} className='w-36' alt="logo" />
      </Link>

      <ul className='hidden sm:flex justify-start gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>SHOP ALL</p>
        </NavLink>

        {/* ✅ Try It On Dropdown with Click Toggle */}
        <li className='relative cursor-pointer'>
          <p onClick={toggleTryOnDropdown} className='flex flex-col items-center gap-1'>
            TRY IT ON ⌄
          </p>
          {tryOnDropdownOpen && (
            <ul className='absolute top-full left-0 mt-2 bg-white border rounded shadow-lg z-50 w-56'>
              <Link to='/tryon' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => setTryOnDropdownOpen(false)}>
                📷 Live Camera Try-On
              </Link>
              <Link to='/tryon-photo' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => setTryOnDropdownOpen(false)}>
                🖼️ Photo Upload Try-On
              </Link>
            </ul>
          )}
        </li>

        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        {/* Currency Selector */}
        <div className='flex items-center gap-2'>
          <label htmlFor="currency" className='text-gray-700'>Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={handleCurrencyChange}
            className='px-2 py-1 rounded-md bg-gray-100'
          >
            <option value="AUD">AUD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <img
          onClick={() => { setShowSearch(true); navigate('/collection'); }}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt="search"
        />

        {/* Profile Icon with Dropdown */}
        <div className='relative group'>
          <img
            onClick={() => token ? null : navigate('/login')}
            className='w-5 cursor-pointer'
            src={assets.profile_icon}
            alt="profile"
          />
          {token && (
            <div className='absolute right-0 pt-4 hidden group-hover:block z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        {/* Admin Login (Desktop Only) */}
        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 transition hidden sm:block"
        >
          Admin Login
        </a>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt="menu"
        />
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={closeAllMenus} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="back" />
            <p>Back</p>
          </div>
          <NavLink onClick={closeAllMenus} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={closeAllMenus} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={closeAllMenus} className='py-2 pl-6 border' to='/tryon'>LIVE CAMERA TRY-ON</NavLink>
          <NavLink onClick={closeAllMenus} className='py-2 pl-6 border' to='/tryon-photo'>PHOTO UPLOAD TRY-ON</NavLink>
          <NavLink onClick={closeAllMenus} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            className='py-2 pl-6 border'
          >
            ADMIN LOGIN
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
