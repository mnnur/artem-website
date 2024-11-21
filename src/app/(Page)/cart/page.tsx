'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';
import { TrashIcon } from '@heroicons/react/solid';

interface Order {
  id: string;
  products: {
    image: string;
    name: string;
    price: number;
  };
  quantity: number;
  total_price: number;
  size: string;
  color: string;
}

const CartPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [deletingOrderIds, setDeletingOrderIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();

    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';  // For sandbox environment
    // script.src = 'https://app.midtrans.com/snap/snap.js';  // For production environment
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_CLIENT_KEY || '');

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };

  }, []);

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tokenizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds: orders.map(order => order.id) }),
      });

      const data = await response.json();

      (window as any).snap.pay(data.data.token, {
        onSuccess: (result: any) => {
          console.log('success', result);
        },
        onPending: (result: any) => {
          alert("Loading")
        },
        onError: (result: any) => {
          console.error('error', result);
        },
        onClose: () => {
          console.log('customer closed the popup without finishing the payment');
        },
      });
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/order/all-order');
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setOrders(data.data);
        const totalPrice = data.data.reduce((acc: number, order: Order) => acc + order.total_price, 0);
        setTotal(totalPrice);
      } else {
        console.error(data.data);
      }
    } catch (err) {
      setError('Error fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingOrderIds((prev) => [...prev, id]);
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/order/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
        if (data.status === 201) {
          await fetchOrders();
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }, 200);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center justify-center">
      <title>Cart</title>
      <header className="bg-[#0B3B49] w-full py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#FFECD1]">Keranjang</h1>
          <p className="text-lg mt-2 text-[#FFECD1]">
            <Link href="/">
              <span className="hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
            <span className="mx-5 text-[#FFECD1]">&gt;</span>
            <Link href="/cart">
              <span className="hover:text-blue-500 cursor-pointer">Keranjang</span>
            </Link>
          </p>
        </div>
      </header>
      <main className="flex-grow w-full py-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-screen text-center">
            <h2 className="text-2xl font-bold text-[#0B3B49] mb-4">Belum ada apa apa nih</h2>
            <p className="text-lg text-[#0B3B49] mb-8">checkout produk kamu yuk</p>
            <Link href="/product">
              <button className="bg-[#FFECD1] text-[#0B3B49] py-2 px-4 rounded-lg shadow-md hover:bg-[#FFDAB9]">
                Product
              </button>
            </Link>
          </div>
        ) : (
          <div className="shadow-md overflow-hidden mx-auto p-5 px-4 md:px-32">
            <table className="min-w-full leading-normal rounded-lg border-separate border-spacing-y-4">
              <thead className="rounded-lg">
                <tr className="bg-[#0B3B49] text-[#FFECD1]">
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-l-lg">Gambar Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Produk</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Ukuran</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Warna</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Harga</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Jumlah</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold">Sub Total</th>
                  <th className="px-2 md:px-5 py-5 text-center text-lg font-semibold rounded-r-lg">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`bg-[#FFECD1] hover:bg-[#0B3B49] hover:text-[#FFECD1] hover:border-[#FFECD1] transition-opacity duration-200 ${deletingOrderIds.includes(order.id) ? 'opacity-0' : ''}`}
                  >
                    <td className="px-2 md:px-5 py-5 text-sm rounded-l-lg">
                      <div className="flex justify-center">
                        {order.products && order.products.image && (
                          <img src={order.products.image} alt={order.products.name} className="w-32 h-32 p-2 object-cover border-4 border-[#0B3B49] hover:border-[#FFECD1] rounded-lg" />
                        )}
                      </div>
                    </td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{order.products.name}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{order.size}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{capitalize(order.color)}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">Rp. {order.products.price.toLocaleString('id')}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">{order.quantity}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm">Rp. {(order.products.price * order.quantity).toLocaleString('id')}</td>
                    <td className="px-2 md:px-5 py-5 text-center text-sm rounded-r-lg">
                      <button className="text-gray-600 hover:text-red-600 hover:font-bold" onClick={() => handleDelete(order.id)}>
                        <TrashIcon className="w-6 h-6 hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center mt-5">
              <div className="text-right">
                <div className="text-lg font-semibold">Total:<span className="ml-5 text-lg font-semibold">Rp. {total.toLocaleString('id')}</span></div>
                <button
                  className="bg-[#0B3B49] text-white px-4 py-2 rounded hover:bg-[#FFECD1] hover:text-[#0B3B49] mt-2"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <div id="snap-container"></div>
    </div>
  );
};

export default CartPage;
