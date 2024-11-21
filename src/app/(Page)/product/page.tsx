'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatToRupiah } from '@/utils/rupiah';

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

const PRODUCTS_PER_PAGE = 16;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/product?query=&filter=&sort=&size=20&page=');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setIsLoading(false);
      }
    }
    getProducts();
  }, []);

  const filteredProducts = (products || []).filter((product) => {
    const productName = product.name.toLowerCase();
    const searchTermLowercase = searchTerm.toLowerCase();
    const isNameMatch = productName.includes(searchTermLowercase);
    const isPriceInRange = (!minPrice || product.price >= parseInt(minPrice)) && (!maxPrice || product.price <= parseInt(maxPrice));
    const isCategoryMatch = !category || product.category.toLowerCase() === category?.toString().toLowerCase();

    return isNameMatch && isPriceInRange && isCategoryMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(PRODUCTS_PER_PAGE)].map((_, index) => (
            <div key={index} className="bg-[#FFECD1] text-[#001524] p-4 rounded-lg animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#001524]">
      <title>Product</title>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Product</h1>
        <div className="text-center mb-8">
          <span>Menampilkan {productsToDisplay.length} dari {filteredProducts.length} hasil</span>
          <div className="flex justify-center mt-4">
            <input
              type="text"
              placeholder="Cari Produk"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-l-md border border-gray-300"
            />
            <input
              type="number"
              placeholder="Harga Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="p-2 border border-gray-300"
            />
            <input
              type="number"
              placeholder="Harga Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-2 border border-gray-300"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {productsToDisplay.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="bg-[#FFECD1] text-[#001524] p-4 rounded-lg hover:bg-[#0B3B49] hover:text-[#FFECD1]">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-sm">{product.author}</p>
                <p className="text-lg font-semibold">{formatToRupiah(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-l-md ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#0B3B49] text-white'}`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-300' : 'bg-[#0B3B49] text-white'}`}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-[#0B3B49] text-white' : 'bg-[#FFECD1] text-[#001524]'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#0B3B49] text-white'}`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-r-md ${currentPage === totalPages ? 'bg-gray-300' : 'bg-[#0B3B49] text-white'}`}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}