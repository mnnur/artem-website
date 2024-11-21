'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Popup from '@/app/components/Popup';
import Link from 'next/link';
import { convertToWIB } from '@/utils/convertToWIB';

interface Request {
    id: string;
    request_name: string;
    description: string;
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
    user: {
        name: string;
    };
    design_admin?: string[];
    design_user?: string;
    category?: string;
    product_needed_time?: string;
}

const RequestDetail = () => {
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputTotalPrice, setInputTotalPrice] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [confirmationshowPopup, setConfirmationShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string>('');
    const [popupOnClick, setPopupOnClick] = useState(() => () => { });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImages(Array.from(event.target.files));
        }
    };

    const fetchRequestData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/admin/request/${id}`);
            if (response.ok) {
                const result = await response.json();
                setRequest(result.dataRequest);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
            }
        } catch (error) {
            console.error('Error fetching request:', error);
            setError('Error fetching request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (status: 'ACCEPTED' | 'REJECTED') => {
        if (request) {
            try {
                const totalPrice = parseInt(inputTotalPrice, 10);

                const formData = new FormData();
                formData.append('data', JSON.stringify({ status, total_price: totalPrice }));
                images.forEach((image, index) => {
                    formData.append(`image_${index}`, image);
                });

                const response = await fetch(`http://localhost:3000/api/admin/request/${id}`, {
                    method: 'PATCH',
                    body: formData,
                });

                console.log(response)
                console.log(status)
                if (response.ok) {
                    const updatedRequest = await response.json();
                    console.log(updatedRequest)
                    if (updatedRequest.status === 201) {
                        setPopupMessage('Request Berhasil di update')
                        setPopupOnClick(() => () => router.push('/admin/request'));
                        setConfirmationShowPopup(true);
                        setRequest(updatedRequest.dataRequest);
                        setInputTotalPrice('');
                        setImages([]);
                    }
                    else if (updatedRequest.code === 400) {
                        setPopupMessage('Request gagal, membutuhkan File Gambar')
                        setPopupOnClick(() => () => setConfirmationShowPopup(false));
                        setConfirmationShowPopup(true);
                        console.error('Error:', updatedRequest.message);
                        setError(updatedRequest.message || 'Failed to update request');
                    }
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.message || 'Failed to update request');
                }
            } catch (error) {
                console.error('Error updating request:', error);
                setError('Error updating request');
            }
        }
    };

    useEffect(() => {
        if (id) {
            fetchRequestData();
        }
    }, [id]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            {isLoading ? (
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
            ) : (
                <div className="bg-[#001524] p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8 mt-8 flex flex-col md:flex-row">
                    <div className="md:w-2/3">
                        <h2 className="text-3xl font-bold mb-6 text-[#FFECD1]">Desain Produk Impianmu</h2>
                        <form className="space-y-4">
                            {error && <div className="text-red-500">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="request_name">
                                    Nama Request
                                </label>
                                <input
                                    className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                    type="text"
                                    id="request_name"
                                    name="request_name"
                                    value={request?.request_name || ''}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="category">
                                        Spesifikasi Produk
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={request?.category || ''}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="color">
                                        Warna
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                        type="text"
                                        id="color"
                                        name="color"
                                        value={request?.color || ''}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="size">
                                        Ukuran
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                        type="text"
                                        id="size"
                                        name="size"
                                        value={request?.size || ''}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="quantity">
                                    Jumlah produk request yang kamu inginkan
                                </label>
                                <input
                                    className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={request?.quantity || ''}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]">
                                    Gambar yang kamu upload
                                </label>
                                {request?.design_user ? (
                                    <img
                                        src={request.design_user}
                                        alt="Desain Produk"
                                        className="w-full h-64 object-cover mb-4 mt-4 rounded-lg"
                                    />
                                ) : (
                                    <p className="text-[#FFECD1]">Tidak ada gambar yang diunggah</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="description">
                                    Detail lain yang ingin disampaikan
                                </label>
                                <div className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded">
                                    {request?.description}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="product_needed_time">
                                    Kapan membutuhkan produk ini
                                </label>
                                <input
                                    className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                    type="text"
                                    id="product_needed_time"
                                    name="product_needed_time"
                                    value={convertToWIB(request?.product_needed_time!) || ''}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="total_price">
                                    Harga Penawaran
                                </label>
                                <input
                                    className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded"
                                    type="text"
                                    id="total_price"
                                    name="total_price"
                                    value={inputTotalPrice}
                                    onChange={(e) => setInputTotalPrice(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-2/3">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus('ACCEPTED')}
                                        className="w-full sm:w-1/2 bg-green-600 text-[#FFECD1] text-center py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus('REJECTED')}
                                        className="w-full sm:w-1/2 bg-red-600 text-[#FFECD1] text-center py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]">
                                        Upload Gambar
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        className="text-[#001524] bg-[#8EAEBD] px-4 py-2 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {confirmationshowPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => {
                        setConfirmationShowPopup(false);
                        popupOnClick();
                    }}
                    buttonText='Confirm'
                />
            )}
        </div>

    );
};

export default RequestDetail;
