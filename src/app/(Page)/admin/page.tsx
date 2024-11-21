'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { capitalize } from '@mui/material';

interface Order {
  id: string;
  date: Date;
  products: {
    image: string;
    name: string;
    price: number;
  };
  user: {
    name: string;
  };
  total_price: number;
  status: string;
}

interface Request {
  id: string;
  status: string;
  date: string;
  request_name: string;
  design_user: string;
  requests: {
    quantity: number;
    design_admin: string;
  };
  user: {
    name: string;
  };
}

const History = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/admin/transaction/history');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data.dataOrder || []);
      setRequests(data.dataRequest || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const groupedOrders = orders.reduce((acc: { [key: string]: Order[] }, order: Order) => {
    if (!acc[order.user.name]) {
      acc[order.user.name] = [];
    }
    acc[order.user.name].push(order);
    return acc;
  }, {});

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center justify-center">
      <title>History Admin</title>
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
          <h2 className="text-2xl font-bold text-[#0B3B49] mb-4 mt-8">Order</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
              <thead className="rounded-lg">
                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Nama User</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Tanggal</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedOrders).map((userName) => {
                  const userOrders = groupedOrders[userName];
                  const concatenatedProducts = userOrders.map(order => order.products.name).join(', ');

                  return (
                    <React.Fragment key={userName}>
                      <tr className={`bg-[#FFECD1] transition-opacity duration-200`}>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{userName}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{concatenatedProducts}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{new Date(userOrders[0].date).toLocaleDateString('id')}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">
                          <div>
                            {capitalize(userOrders[0].status)}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h2 className="text-2xl font-bold text-[#0B3B49] mb-4 mt-8">Request</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
              <thead className="rounded-lg">
                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Nama User</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Tanggal</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={index} className={`bg-[#FFECD1] transition-opacity duration-200`}>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.user.name}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.request_name}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{new Date(request.date).toLocaleDateString('id')}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.status === "PAYMENT_PENDING" ? "PAYMENT PENDING" : request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <div id="snap-container"></div>
    </div>
  );
};

export default History;
