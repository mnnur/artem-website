'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatToRupiah } from '@/utils/rupiah';
import Popup from '@/app/components/Popup';
import Loading from './loading';

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
  color: string[];
  size: string[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [similiarProducts, setSimiliarProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:3000/api/product/${id}`);
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    async function fetchSimiliarProducts() {
      if (!product) return;
      try {
        const response = await fetch(`http://localhost:3000/api/product?category=${product.category}`);
        const data = await response.json();
        setSimiliarProducts(data.data);
      } catch (err) {
        console.error('Error fetching similiar products:', err);
      }
    }
    fetchSimiliarProducts();
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!selectedSize) {
      setError('Silakan pilih ukuran terlebih dahulu.');
      return;
    }
    if (!selectedColor) {
      setError('Silakan pilih warna terlebih dahulu.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productsId: product.id,
          size: selectedSize,
          color: selectedColor,
          quantity,
          total_price: product.price * quantity,
        }),
      });
      const data = await response.json();
      console.log(data);
      setShowPopup(true);
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > 100) {
      setError('Jumlah harus antara 1 dan 100');
    } else {
      setError(null);
      setQuantity(value);
    }
  };

  if (!product) {
    return <Loading />;
  }

  return (
    <div className="relative bg-white text-[#001524]">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <img src={product.image} alt={product.name} className="w-full h-64 sm:w-full md:w-full lg:w-5/6 object-cover mb-4 mt-8 lg:ml-16 lg:mb-0" />
          </div>
          <div className="lg:w-1/2 lg:pl-8">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-[#15616D] mb-4">{formatToRupiah(product.price)}</p>
            <p className="text-md font-semibold mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="font-bold text-[#15616D] mr-4">Ukuran:</span>
              <div className="flex space-x-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold">Warna: </span>
              <div className="flex space-x-2 mt-2 mb-2">
                {[
                  { label: 'Merah', value: 'red' },
                  { label: 'Kuning', value: 'yellow' },
                  { label: 'Hijau', value: 'green' },
                  { label: 'Biru', value: 'blue' }
                ].map((color) => (
                  <button 
                    key={color.value} 
                    onClick={() => setSelectedColor(color.value)} 
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-blue-500' : 'border-gray-300'}`} 
                    style={{ backgroundColor: color.value }}
                  >
                    {selectedColor === color.value && <span className="block w-full h-full rounded-full border-4 border-white"></span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <span className="font-bold text-[#15616D] mr-4">Jumlah:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="border text-center rounded px-2 py-1 w-16"
                  min="1"
                  max="100"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handleAddToCart}
              className="bg-[#15616D] hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded"
            >
              Tambah ke Keranjang
            </button>
            <hr className="my-8 border-t border-[#15616D]" />
            <div className="flex space-x-4">
              <span className="font-bold text-[#15616D] mr-8">Kategori</span>
              <p className="font-bold text-[#15616D]">{product.category}</p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-3xl text-center font-bold mb-8">Produk Serupa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similiarProducts
              .filter((similiarProduct) => similiarProduct.category === product.category)
              .slice(0, 8)
              .map((similiarProduct) => (
                <div key={similiarProduct.id} className="bg-[#FFECD1] text-[#001524] p-4 rounded-lg">
                  <img src={similiarProduct.image} alt={similiarProduct.name} className="w-full h-48 object-cover mb-4" />
                  <h2 className="text-xl font-bold">{similiarProduct.name}</h2>
                  <p className="text-sm text-[#0B3B49]">{similiarProduct.author}</p>
                  <p className="text-lg font-semibold">{formatToRupiah(similiarProduct.price)}</p>
                  <Link href={`/product/${similiarProduct.id}`}>
                    <button className="bg-[#15616D] hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded mt-2 w-full">
                      Lihat Produk
                    </button>
                  </Link>
                </div>
              ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={`/product?category=${product.category}`}>
              <button className="bg-[#15616D] hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded">
                Tampilkan Lebih
              </button>
            </Link>
          </div>
        </div>
      </div>
      {showPopup && <Popup message="Yay! Produk berhasil ditambahkan" subMessage="ayo checkout atau cari produk lainnya" onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ProductDetail;