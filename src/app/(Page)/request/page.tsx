'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Request {
  id: string;
  request_name: string;
  description: string;
  category: string;
  design: string;
  request_purpose?: string;
  quantity: number;
  total_price: number;
  response_needed: string;
  date: string;
  status: string;
  userId: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  color: string;
  size: string;
}

export default function RequestPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch('/api/request');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setRequests(data.data);
        console.log(data);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRequests();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="text-[#FFECD1] min-h-screen flex flex-col justify-between">
      <title>Request</title>
      <header className="py-8 bg-[#0B3B49]">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Request</h1>
          <p className="text-lg mt-2">
            <Link href="/home">
              <span className="hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
            <span className="mx-5 text-[#FFECD1]">&gt;</span>
            <Link href="/request">
              <span className="hover:text-blue-500 cursor-pointer">Request</span>
            </Link>
          </p>
        </div>
      </header>
      <main className="flex-grow w-full py-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="shadow-md overflow-hidden mx-auto p-5 px-4 md:px-32">
            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
              <thead className="rounded-lg">
                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Nama</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Warna</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Ukuran</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Jumlah</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="bg-[#FFECD1] text-[#0B3B49] cursor-pointer hover:bg-[#0B3B49] hover:text-[#FFECD1]"
                    onClick={() => window.location.href = `/request/${request.id}`}
                  >
                    <td className="px-2 md:px-5 py-5 text-center text-sm rounded-l-lg">{request.request_name}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.category}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.color}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.size}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{request.quantity}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm rounded-r-lg">{request.status === "PAYMENT_PENDING" ? "PAYMENT PENDING" : request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center">
              <Link href="/request/form">
                <button className="bg-[#FFECD1] text-[#0B3B49] border-none py-2 px-4 text-lg cursor-pointer rounded mt-4">
                  +
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center text-center items-center min-h-screen text-[#0B3B49]">
            <h2 className='mb-2 text-2xl font-bold'>Belum ada apa apa nih</h2>
            <p className='mb-4 text-lg'>buat produk request kamu yuk</p>
            <Link href="/request/form">
              <button className="bg-[#FFECD1] text-[#0B3B49] border-none py-2 px-4 text-lg cursor-pointer rounded mt-4">
                +
              </button>
            </Link>
          </div>
        )}
      </main>
      <footer className="bg-[#FFECD1] py-4">
        <div className="container mx-auto text-center">
          <Link href="/request/snk">
            <div className="text-[#0B3B49] text-lg cursor-pointer font-bold">
              Syarat dan Ketentuan
            </div>
          </Link>
        </div>
      </footer>
    </div>
  );
}
