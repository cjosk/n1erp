'use client';

import { signOut } from 'firebase/auth';
import { FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

const TopBar = () => {
  const [search, setSearch] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Çıkış başarısız', error);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white/60 backdrop-blur-lg border-b border-white/40">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Sipariş veya müşteri ara"
            className="w-full rounded-xl border border-white/40 bg-white/60 py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full bg-white/70 p-2 text-gray-600 hover:text-[#ff7a00]">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#ff7a00]"></span>
        </button>
        <div className="hidden md:flex flex-col text-sm text-right">
          <span className="font-semibold text-gray-700">Neonbir Ekibi</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-xl bg-[#ff7a00]/10 px-4 py-2 text-sm font-medium text-[#ff7a00] hover:bg-[#ff7a00]/20"
        >
          <FiLogOut />
          Çıkış
        </button>
      </div>
    </header>
  );
};

export default TopBar;
