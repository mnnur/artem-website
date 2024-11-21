'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: session, status } = useSession();

  return (
    <div className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-10 bg-[#0B3B49] p-4 flex flex-col space-y-4 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between">
        <button className="text-[#FFECD1] hover:text-white" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        {isOpen && (
          <Link href="/">
            <span className="self-center text-l font-semibold whitespace-nowrap text-[#FFECD1]">ARTEM</span>
          </Link>
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col space-y-4">
          <Link href="/admin">
            <span className="text-[#FFECD1] text-l hover:text-white">History</span>
          </Link>
          <Link href="/admin/order">
            <span className="text-[#FFECD1] text-l hover:text-white">Order</span>
          </Link>
          <Link href="/admin/request">
            <span className="text-[#FFECD1] text-l hover:text-white">Request</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
