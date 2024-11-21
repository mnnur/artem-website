'use client';
import React, { useState } from 'react';
import Popup from '@/app/components/Popup';
import Link from 'next/link';
import Popup2 from '@/app/components/Popup2';

export default function RequestFormPage() {
    const [formData, setFormData] = useState({
        request_name: '',
        category: '',
        color: '',
        size: '',
        quantity: '',
        design_user: null,
        description: '',
        product_needed_time: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            const file = files[0];
            const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validExtensions.includes(file.type)) {
                setError('Harap upload gambar dengan ekstensi jpeg,png,jpg');
                return;
            }
            setFormData({
                ...formData,
                [name]: file
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentDate = new Date();
        const selectedDate = new Date(formData.product_needed_time);
        const minDate = new Date(currentDate);
        minDate.setDate(minDate.getDate() + 3);

        if (selectedDate < minDate) {
            setError('Harap pilih waktu minimal 3 hari setelah sekarang.');
            return;
        }

        setShowPopup(true);
    };

    const handleConfirmSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setShowPopup(false);

        const data = new FormData();
        const formDataCopy = { ...formData };

        if (formData.product_needed_time) {
            const isoDate = new Date(formData.product_needed_time).toISOString();
            formDataCopy.product_needed_time = isoDate;
        }

        if (formData.design_user) {
            data.append('image', formData.design_user);
            formDataCopy.design_user = null;
        }
        data.append('data', JSON.stringify(formDataCopy));

        console.log('Form Data:', Object.fromEntries(data.entries()));

        try {
            const response = await fetch('/api/request', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                console.log(response);

                if (result.code === 200) {
                    console.log('Request berhasil dikirim');
                    setShowConfirmationPopup(true);
                } else {
                    console.error('Error:', result.message);
                }
            } else {
                const errorResult = await response.json();
                console.error('Error submitting request:', errorResult.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0B3B49] text-[#FFECD1] min-h-screen flex flex-col justify-between">
            <title>Request Form</title>
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
                        <span className="mx-5 text-[#FFECD1]">&gt;</span>
                        <Link href="/request/form">
                            <span className="hover:text-blue-500 cursor-pointer">Request Form</span>
                        </Link>
                    </p>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center bg-white">
                <div className="bg-[#001524] p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8 mt-8 flex flex-col md:flex-row">
                    <div className="md:w-2/3">
                        <h2 className="text-3xl font-bold mb-6 text-[#FFECD1]">Desain Produk Impianmu</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && <div className="text-red-500">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="request_name">Namakan request produk ini untuk memudahkan kamu kalau mau mencarinya</label>
                                <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="request_name" name="request_name" value={formData.request_name} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="category">Spesifikasi Produk</label>
                                    <select className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" id="category" name="category" value={formData.category} onChange={handleChange}>
                                        <option value="">Produk</option>
                                        <option value="lukisan">Lukisan</option>
                                        <option value="cangkir">Cangkir</option>
                                        <option value="baju">Baju</option>
                                        <option value="celana">Celana</option>
                                        <option value="topi">Topi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="color">Warna</label>
                                    <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="color" name="color" value={formData.color} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="size">Ukuran</label>
                                    <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="size" name="size" value={formData.size} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="quantity">Jumlah produk request yang kamu inginkan</label>
                                <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="design_user">Upload gambar yang relevan dengan desain kamu</label>
                                <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="file" id="design_user" name="design_user" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="description">Detail lain yang ingin disampaikan</label>
                                <textarea className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" id="description" name="description" rows={4} value={formData.description} onChange={handleChange}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="product_needed_time">Kapan membutuhkan produk ini</label>
                                <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="datetime-local" id="product_needed_time" name="product_needed_time" value={formData.product_needed_time} onChange={handleChange} />
                                {error && <div className="text-red-500">{error}</div>}
                            </div>
                            <div className="text-center">
                                <button className="w-full bg-[#0B3B49] text-[#FFECD1] border-none py-2 px-4 text-lg cursor-pointer rounded mt-4" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Kirim'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="md:w-1/3 mt-8 md:mt-0 md:ml-8 flex items-center justify-center relative">
                        <img src="/artem.jpg" alt="Desain Produk" className="rounded-lg shadow-lg w-full" />
                        <div className="absolute bottom-0 w-full flex items-center justify-center pb-32">
                            <p className="text-[#FFECD1] text-md font-serrif">Jangan ragu untuk mengekspresikan perasaanmu akan sesuatu, keluarkan dan realisasikan</p>
                        </div>
                    </div>
                </div>
            </main>
            {showPopup && (
                <Popup2
                    message="Pengingat"
                    subMessage="Saat kamu mengirim request ini, maka tidak akan bisa dibatalkan jika request ini diterima. Yakin ingin melanjutkan?"
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowPopup(false)}
                />
            )}
            {showConfirmationPopup && (
                <Popup
                    message="Yay! Request berhasil ditambahkan"
                    subMessage="Sambil nunggu disetujui, yuk cari produk lainnya"
                    onClose={() => {
                        setShowConfirmationPopup(false);
                        window.location.href = '/request';
                    }}
                />
            )}
        </div>
    )
}