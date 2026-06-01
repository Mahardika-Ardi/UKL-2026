'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown-menu {
    animation: slideDown 0.3s ease-out forwards;
  }

  .menu-item {
    transition: all 0.2s ease;
  }

  .menu-item:hover {
    background-color: #f3f4f6;
    transform: translateX(4px);
  }
`

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Logout logic here
    router.push('/login');
  };
  const handleYourStore = () => {
    router.push('/owner/store_detail');
  };
  const handleProfile = () => {
    router.push('/owner/profile');
  };
  const handleSettings = () => {
    router.push('/owner/Setting');
  };
  const handleOrders = () => {
    router.push('/owner/order');
  };
  const handleMenu = () => {
    router.push('/');
  };
  return (
    <>
      <style>{styles}</style>
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 border-b bg-white  shadow-md z-50">

        <Link href="/owner/store_detail" className="text-2xl font-bold flex items-center gap-2">
          <Image
            src="/img/Atributo.png"
            alt="Atributo Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-black">Atributo.</span>
        </Link>

        <div className="flex-1 mx-80">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-300">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent flex-1 outline-none text-gray-700"
            />
            <button className="ml-2 text-gray-500">
              🔍
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">

          <Link href="/user/cart" className="cursor-pointer text-xl hover:scale-110 transition-transform">
            🛒
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
            >
              <span className="text-xl">👤</span>
              <span className="text-xl">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50 dropdown-menu">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 menu-item rounded-t-lg text-black">
                  Store Profile
                </button>
                <button
                  onClick={handleYourStore}
                  className="w-full text-left px-4 py-2 menu-item text-black">
                  Your Store
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2 menu-item text-black">
                  Settings
                </button>
                <button
                  onClick={handleOrders}
                  className="w-full text-left px-4 py-2 menu-item text-black">
                  Orders Received
                </button>
                <button
                  onClick={handleMenu}
                  className="w-full text-left px-4 py-2 menu-item border-t rounded-b-lg text-black">
                  Main Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}