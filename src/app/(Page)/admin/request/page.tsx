'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Request {
  id: string;
  request_name: string;
  date: string;
  status: string;
  user: {
    name: string;
  };
}

const Requests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/request');
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        console.error(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center justify-center">
      <title>Request Admin</title>
      <main className="flex-grow w-full py-10">
        <div className="shadow-md overflow-hidden mx-auto p-5 px-4 md:px-32">
          <div className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-10 bg-[#0B3B49] p-4 flex flex-col space-y-4 ${isOpen ? 'w-32' : 'w-16'}`}>
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
          <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
            <thead className="rounded-lg">
              <tr className="bg-[#0B3B49] text-[#FFECD1]">
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Nama User</th>
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Tanggal</th>
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Status</th>
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className={`bg-[#FFECD1] transition-opacity duration-200`}>
                  <td className="px-2 md:px-5 py-5 text-center text-sm">{request.user.name}</td>
                  <td className="px-2 md:px-5 py-5 text-center text-sm">{request.request_name}</td>
                  <td className="px-2 md:px-5 py-5 text-center text-sm">{new Date(request.date).toLocaleDateString('id')}</td>
                  <td className="px-2 md:px-5 py-5 text-center text-sm">{request.status}</td>
                  <td className="px-2 md:px-5 py-5 text-center text-lg font-semibold">
                    <Link href={`/admin/request/${request.id}`}>
                      <button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">Detail</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <div id="snap-container"></div>
    </div>
  );
};

export default Requests;
