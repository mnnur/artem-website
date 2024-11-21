'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  price: number;
  status: string;
  date: string;
  orders: {
    name: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
  }[];
}
interface Request {
  id: string;
  requestId: string;
  color: string;
  size: string;
  price: number;
  status: string;
  date: string;
  request_name: string;
  design_user: string;
  quantity: number;
  design_admin: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DONE':
    case 'ACCEPTED':
      return 'text-green-500';
    case 'PENDING':
      return 'text-yellow-500';
    case 'REJECTED':
    case 'CANCELED':
    case 'PAYMENT_PENDING':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export default function HistoryPage() {
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [requestHistory, setRequestHistory] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/transaction/history');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setOrderHistory(data.dataOrder);
        setRequestHistory(data.dataRequest);
        console.log(data.dataOrder);
        console.log(data.dataRequest);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center justify-center">
      <title>History</title>
      <header className="bg-[#0B3B49] w-full py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#FFECD1]">History</h1>
          <p className="text-lg mt-2 text-[#FFECD1]">
            <Link href="/">
              <span className="hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
            <span className="mx-5 text-[#FFECD1]">&gt;</span>
            <Link href="/history">
              <span className="hover:text-blue-500 cursor-pointer">History</span>
            </Link>
          </p>
        </div>
      </header>
      <main className="flex-grow w-full py-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : orderHistory.length === 0 && requestHistory.length === 0 ? (
          <div className="flex flex-col justify-center text-center min-h-screen items-center">
            <h2 className="text-2xl font-bold text-[#0B3B49] mb-4">Belum ada apa apa nih</h2>
            <p className="text-lg text-[#0B3B49] mb-8">checkout keranjang kamu yuk</p>
            <Link href="/cart">
              <button className="bg-[#FFECD1] text-[#0B3B49] py-2 px-4 rounded-lg shadow-md hover:bg-[#FFDAB9]">
                Keranjang
              </button>
            </Link>
          </div>
        ) : (
          <div className="shadow-md overflow-hidden mx-auto p-5 px-4 md:px-32">
            <h2 className="text-2xl font-bold text-[#0B3B49] mb-4">Produk</h2>
            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
              <thead className="rounded-lg">
                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Nama Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Gambar Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Jumlah</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Total Harga</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Status</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory
                  .filter(order => order.orders.length > 0)
                  .map((order, index) => {
                    const productNames = order.orders
                      .filter(o => o)
                      .map(o => o.name)
                      .join(', ');
                    const firstProductImage = order.orders[0]?.image;
                    const additionalProductsCount = order.orders.length - 1;

                    return (
                      <tr
                        key={order.id}
                        className="bg-[#FFECD1] text-[#0B3B49] cursor-pointer hover:bg-[#0B3B49] hover:text-[#FFECD1]"
                        onClick={() => window.location.href = `/history/${order.id}`}
                      >
                        <td className="px-2 md:px-5 py-5 text-center text-sm rounded-l-lg">{productNames}</td>
                        <td className="px-2 md:px-5 py-5 text-sm mx-auto">
                          <div className="relative flex justify-center">
                            {firstProductImage && (
                              <img
                                src={firstProductImage}
                                alt={productNames}
                                className="w-32 h-32 p-2 object-cover border-4 border-[#0B3B49] rounded-lg"
                              />
                            )}
                            {additionalProductsCount > 0 && (
                              <div className="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-2 py-1">
                                +{additionalProductsCount}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm font-semibold">{order.orders.reduce((total, order) => total + order.quantity, 0)}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm font-semibold">Rp. {order.price.toLocaleString('id')}</td>
                        <td className={`px-2 md:px-5 py-5 text-center text-sm font-semibold ${getStatusColor(order.status)}`}>{order.status}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm rounded-r-lg font-semibold">{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <h2 className="text-2xl font-bold text-[#0B3B49] mb-4 mt-8">Request</h2>
            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
              <thead className="rounded-lg">
                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Nama Request</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Desain User</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Ukuran</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Warna</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Jumlah</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Harga</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Status</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {requestHistory.map((request) => (
                  <tr
                    key={request.id}
                    className="bg-[#FFECD1] text-[#0B3B49] cursor-pointer hover:bg-[#0B3B49] hover:text-[#FFECD1]"
                    onClick={() => window.location.href = `/request/${request.requestId}`}
                  >
                    <td className="px-2 md:px-5 py-5 text-center text-sm rounded-l-lg">{request.request_name}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">
                      <div className="flex justify-center">
                        {request.design_user && (
                          <img
                            src={request.design_user}
                            alt={request.request_name}
                            className="w-32 h-32 p-2 object-cover border-4 border-[#0B3B49] rounded-lg"
                          />
                        )}
                      </div>
                    </td>
                    {/* <td className="px-2 md:px-5 py-5 text-center text-sm rounded-l-lg">
                      <div className="flex justify-center">
                        {request.design_user && (
                          <img
                            src={request.design_admin}
                            alt={request.request_name}
                            className="w-32 h-32 p-2 object-cover border-4 border-[#0B3B49] rounded-lg"
                          />
                        )}
                      </div>
                    </td> */}
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.size}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.color}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.quantity}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.price}</td>
                    <td className={`px-2 md:px-5 py-5 text-center text-sm ${getStatusColor(request.status)}`}>{request.status}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm rounded-r-lg">{new Date(request.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}