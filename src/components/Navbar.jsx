// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LogoIcon = () => <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 18c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 0a9.004 9.004 0 00-4.5 1.6C5.171 5.072 3 7.828 3 11c0 3.172 2.17 5.928 4.5 6.4.5.087.918.421 1.05.934.132.512.21.974.21 1.366 0 .406-.095.79-.26 1.123" /></svg>;
const CartIcon = () => <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;

// New Props: currentAddress, onLocationClick
const Navbar = ({ onCartClick, onLogout, cartCount, currentAddress, onLocationClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT: Logo + Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <LogoIcon />
              <span className="hidden md:block text-xl font-bold text-gray-800">BR Fresh</span>
            </Link>

            {/* --- NEW LOCATION SECTION --- */}
            <div 
              onClick={onLocationClick}
              className="flex flex-col cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-gray-900">Delivery in 25 mins</span>
              <div className="flex items-center text-gray-600">
                <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">
                  {currentAddress || 'Select Location'}
                </span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          
          {/* RIGHT: Account, Cart, Logout */}
          <div className="flex items-center space-x-4">
            <Link to="/my-orders" className="hidden sm:flex items-center text-gray-600 hover:text-green-600">
              <UserIcon />
            </Link>

            <button onClick={onCartClick} className="relative rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={onLogout} className="text-sm font-medium text-gray-600 hover:text-green-600">
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;