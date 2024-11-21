'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';

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
  quantity: number;
  total_price: number;
  size: string;
  color: string;
  status: string;
}

const Order = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const toggleDropdown = (userName: string) => {
    if (selectedUserName === userName) {
      setSelectedUserName(null);
    } else {
      setSelectedUserName(userName);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/order');
      const data = await response.json();
      console.log(data.data);

      if (Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        console.error(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
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
      <title>Order Admin</title>
      <main className="flex-grow w-full py-10 px-2 md:px-10 lg:px-32">
        <div className="shadow-md overflow-hidden mx-auto p-5">
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
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Status</th>
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Detail</th>     
                <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg"></th>
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
                      <td className="px-2 md:px-5 py-5 text-center text-sm">
                        {userOrders[0].status === 'DONE' ? (
                          <input type="checkbox" checked disabled />
                        ) : (
                          <input type="checkbox" disabled />
                        )}
                        <div>
                          {capitalize(userOrders[0].status)}
                        </div>
                      </td>
                      <td className="px-2 md:px-5 py-5 text-center text-lg font-semibold">
                        <button onClick={() => toggleDropdown(userName)} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">Detail</button>
                      </td>
                    </tr>
                    {selectedUserName === userName && (
                      <tr className="bg-white">
                        <td colSpan={6} className="px-2 md:px-5 py-5">
                          <div className="shadow-md overflow-hidden mx-auto p-5">
                            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
                              <thead className="rounded-lg">
                                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Gambar Produk</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Ukuran</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Warna</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Tanggal</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Harga</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Jumlah</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Subtotal</th>
                                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {userOrders.map((order) => (
                                  <tr key={order.id} className={`bg-[#FFECD1] transition-opacity duration-200`}>
                                    <td className="px-2 md:px-5 py-5 text-sm rounded-l-lg">
                                      <div className="flex justify-center">
                                        {order.products && order.products.image && (
                                          <img src={order.products.image} alt={order.products.name} className="w-32 h-32 p-2 object-cover border-4 border-[#0B3B49] rounded-lg" />
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">{order.products.name}</td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">{order.size}</td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">{capitalize(order.color)}</td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">{new Date(userOrders[0].date).toLocaleDateString('id')}</td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">Rp. {order.products.price.toLocaleString('id')}</td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">{order.quantity}</td>
                                    <td className="px-2 md:px-5 py-5 text-center text-sm">Rp. {(order.products.price * order.quantity).toLocaleString('id')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="flex justify-end items-center mt-5">
                              <div className="text-right">
                                <div className="text-lg font-semibold">Total:<span className="ml-5 text-lg font-semibold">
                                  Rp. {userOrders.reduce((acc, order) => acc + order.total_price, 0).toLocaleString('id')}
                                </span></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <div id="snap-container"></div>
    </div>
  );
};

export default Order;
