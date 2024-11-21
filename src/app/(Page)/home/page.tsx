'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatToRupiah } from '@/utils/rupiah';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from "next-auth";
import { Description } from '@radix-ui/react-toast';
import { toast } from '@/components/ui/use-toast';
import { Session } from 'inspector';
interface Product {
  id: string;
  name: string;
  author: string;
  price: number;
  image: string;
  category: string;
  model: string;
  description: string;
  rating: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const session = useSession();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/product');
        const data = await response.json();
        console.log(data);

        setProducts(data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  const currentImage = products[currentImageIndex] || {};

  return (
    <main className="flex flex-col justify-between p-24 bg-white">
      <title>Home</title>
      <div className="container mx-auto">
        <div className="relative mb-8 h-96">
          <img
            src={currentImage.image}
            alt={currentImage.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-end p-8">
            <div className="bg-[#FFECD1] bg-opacity-90 p-6 rounded-lg max-w-xs">
              <p className="text-sm font-bold text-[#001524]">{currentImage.name}</p>
              <h2 className="text-2xl font-bold text-[#15616D]">Yuk Cari Tau Tentang Produk ini</h2>
              <p className="text-sm font-semibold text-[#001524] mb-4">
                {currentImage && currentImage.description ? (
                  currentImage.description.length > 100
                    ? `${currentImage.description.substring(0, 100)}...`
                    : currentImage.description
                ) : (
                  "Description not available"
                )}
              </p>
              <Link href={`/product/${currentImage.id}`}>
                <button className="bg-[#15616D] hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded text-center">
                  Beli Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-001524 mb-4">Cari Apa?</h2>
          <p className="text-sm text-0B3B49 mb-4">Kategori Produk Yang Tersedia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 grid-rows-1 gap-4">
            <Link href="/product?category=lukisan">
              <div className="text-center cursor-pointer">
                <img src="https://images.tokopedia.net/img/cache/500-square/product-1/2020/8/6/9308311/9308311_fbaae4f3-f75f-44ad-aff4-7e2dbfb36f12_1548_1548.jpg" alt="Lukisan" className="mx-auto mb-2 w-full h-auto object-cover rounded-lg border-2 border-gray-300" />
                <p className="font-bold text-001524">Lukisan</p>
              </div>
            </Link>
            <Link href="/product?category=cangkir">
              <div className="text-center cursor-pointer">
                <img src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/111/0711123_PE727991_S5.jpg" alt="Cangkir" className="mx-auto mb-2 w-full h-auto object-cover rounded-lg border-2 border-gray-300" />
                <p className="font-bold text-001524">Cangkir</p>
              </div>
            </Link>
            <Link href="/product?category=baju">
              <div className="text-center cursor-pointer">
                <img src="https://img.ws.mms.shopee.co.id/bb50fa65e49a3534328aaffeef351adf" alt="Baju" className="mx-auto mb-2 w-full h-auto object-cover rounded-lg border-2 border-gray-300" />
                <p className="font-bold text-001524">Baju</p>
              </div>
            </Link>
            <Link href="/product?category=celana">
              <div className="text-center cursor-pointer">
                <img src="https://hikenrun.com/cdn/shop/products/A1_8456cb28-c3d2-425d-a4a9-5487d0307369.png?v=1677666734" alt="Celana" className="mx-auto mb-2 w-full h-auto object-cover rounded-lg border-2 border-gray-300" />
                <p className="font-bold text-001524">Celana</p>
              </div>
            </Link>
            <Link href="/product?category=topi">
              <div className="text-center cursor-pointer">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKYv-3R_1bQn-jvassSjT01pY4dm5xXCVYg&s" alt="Topi" className="mx-auto mb-2 w-full h-auto object-cover rounded-lg border-2 border-gray-300" />
                <p className="font-bold text-001524">Topi</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-[#001524] mb-4">Produk Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
              <Link key={index} href={`/product/${product.id}`}>
                <div className="bg-[#FFECD1] text-[#001524] p-4 rounded-lg shadow-lg flex flex-col justify-between h-full">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-sm text-[#0B3B49]">{product.author}</p>
                    <p className="text-lg font-semibold">{formatToRupiah(product.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/product">
              <button className="bg-[#15616D] hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded">
                Tampilkan Lebih
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}