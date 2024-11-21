'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  date: string;
  price: number;
  total_price: number;
  orders: {
    name: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}

interface Request {
  id: string;
  category: string;
  color: string;
  size: string;
  price: number;
  status: string;
  date: string;
  request_name: string;
  design_user: string;
  quantity: number;
  design_admin: string[];
}

export default function HistoryDetailPage() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [requestDetail, setRequestDetail] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await fetch(`/api/transaction/history/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setOrderDetail(data.dataOrder);
        setRequestDetail(data.dataRequest);
        console.log(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center justify-center">
      <title>History Detail</title>
      <header className="bg-[#0B3B49] w-full py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#FFECD1]">History Detail</h1>
          <p className="text-lg mt-2 text-[#FFECD1]">
            <Link href="/">
              <span className="hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
            <span className="mx-5 text-[#FFECD1]">&gt;</span>
            <Link href="/history">
              <span className="hover:text-blue-500 cursor-pointer">History</span>
            </Link>
            <span className="mx-5 text-[#FFECD1]">&gt;</span>
            <span className="text-[#FFECD1]">Detail</span>
          </p>
        </div>
      </header>
      <main className="flex-grow w-full py-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : (
          <div className="shadow-md overflow-hidden mx-auto p-5 px-4 md:px-32">
            {orderDetail ? (
              <div>
                <h2 className="text-2xl font-bold text-[#0B3B49] mb-4">Produk</h2>
                <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
                  <thead className="rounded-lg">
                    <tr className="bg-[#0B3B49] text-[#FFECD1]">
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Gambar Produk</th>
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Ukuran</th>
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Warna</th>
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Jumlah</th>
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Harga</th>
                      <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.orders.map((order, index) => (
                      <tr key={index} className="bg-[#FFECD1]">
                        <td className="px-2 md:px-5 py-5 text-sm rounded-l-lg">
                          <div className="flex justify-center">
                            {order.image && (
                              <img src={order.image} alt={order.name} className="w-32 h-32 p-2 object-cover border-4 border-[#0B3B49] rounded-lg" />
                            )}
                          </div>
                        </td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{order.name}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{order.size}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{order.color}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">{order.quantity}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm">Rp. {order.price}</td>
                        <td className="px-2 md:px-5 py-5 text-center text-sm rounded-r-lg">Rp. {(order.price * order.quantity).toLocaleString('id')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : requestDetail ? (
              <div>
                <h2 className="text-2xl font-bold text-[#0B3B49] mb-4">Request</h2>
                <div className="bg-[#001524] p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8 mt-8 flex flex-col md:flex-row">
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold mb-6 text-[#FFECD1]">Desain Produk Impianmu</h2>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="request_name">Nama Request</label>
                        <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="request_name" name="request_name" value={requestDetail.request_name} disabled />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="category">Spesifikasi Produk</label>
                          <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="category" name="category" value={requestDetail.category} disabled />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="color">Warna</label>
                          <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="color" name="color" value={requestDetail.color} disabled />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="size">Ukuran</label>
                          <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="size" name="size" value={requestDetail.size} disabled />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="quantity">Jumlah produk request yang kamu inginkan</label>
                        <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="number" id="quantity" name="quantity" value={requestDetail.quantity} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="design_user">Gambar yang kamu upload</label>
                        {requestDetail.design_user ? (
                          <img src={requestDetail.design_user} alt="Desain Produk" className="w-full h-64 object-cover mb-4 mt-4 rounded-lg" />
                        ) : (
                          <p className="text-[#FFECD1]">Tidak ada gambar yang diupload</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="design_admin">Desain Admin</label>
                        {requestDetail.design_admin.map((design, index) => (
                          <div key={index} className="mb-4">
                            <img src={design} alt={`Desain Admin ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
                          </div>
                        ))}
                      </div>
                    </form>
                  </div>
                  <div className="md:w-1/3 ml-4">
                    <h2 className="text-2xl font-bold mb-4 text-[#FFECD1]">Detail Request</h2>
                    <div className="bg-[#0B3B49] p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold mb-2 text-[#FFECD1]">Status</h3>
                      <p className="text-[#FFECD1]">{requestDetail.status}</p>
                      <h3 className="text-lg font-bold mb-2 mt-4 text-[#FFECD1]">Harga</h3>
                      <p className="text-[#FFECD1]">Rp. {requestDetail.price.toLocaleString('id')}</p>
                      <h3 className="text-lg font-bold mb-2 mt-4 text-[#FFECD1]">Tanggal</h3>
                      <p className="text-[#FFECD1]">{requestDetail.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>Error: Data tidak ditemukan</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
