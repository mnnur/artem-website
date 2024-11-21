'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import Popup2 from '@/app/components/Popup2';
import Popup from '@/app/components/Popup';

export default function RequestDetailPage() {
    const { id } = useParams();
    const [transactionId, setTransactionId] = useState("")
    const { configurationId } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        request_name: '',
        category: '',
        color: '',
        size: '',
        quantity: '',
        design_user: null,
        design_admin: [],
        description: '',
        product_needed_time: '',
        total_price: '',
        status: 'PENDING',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

    useEffect(() => {
        if (id) {
            fetchRequestData(id as string);
        }

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';  // For sandbox environment
        // script.src = 'https://app.midtrans.com/snap/snap.js';  // For production environment
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_CLIENT_KEY || '');

        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [id]);

    const fetchRequestData = async (requestId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/request/${requestId}`);
            if (response.ok) {
                const result = await response.json();
                setTransactionId(result.data.transactionId)
                setFormData(result.data);
                console.log(result.data);
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

    const handlePayment = async () => {
        try {
            const response = await fetch('/api/tokenizer-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId: id, transactionId }),
            });

            const data = await response.json();
            console.log(data);
            (window as any).snap.pay(data.data.token, {
                onSuccess: (result: any) => {
                    console.log('success', result);
                },
                onPending: (result: any) => {
                    alert("Loading");
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

    const handleCancelRequest = async () => {
        try {
            const response = await fetch('/api/request/cancel', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status: 'CANCELED' }),
            });

            const data = await response.json();
            if (data.status === 200) {
                setFormData((prevData) => ({ ...prevData, status: 'CANCELED' }));
                setShowConfirmationPopup(true);
            } else {
                console.error('Error canceling request:', data.message);
            }
        } catch (error) {
            console.error('Error canceling request:', error);
        }
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? formData.design_admin.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === formData.design_admin.length - 1 ? 0 : prevIndex + 1));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
            case 'DONE':
                return 'text-green-500';
            case 'PENDING':
                return 'text-yellow-500';
            case 'REJECTED':
            case 'PAYMENT_PENDING':
            case 'CANCELED':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="bg-[#0B3B49] text-[#FFECD1] min-h-screen flex flex-col justify-between">
            <title>Request Detail</title>
            <header className="py-8 bg-[#0B3B49]">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Request Detail</h1>
                    <p className="text-lg mt-2">
                        <Link href="/home">
                            <span className="hover:text-blue-500 cursor-pointer">Home</span>
                        </Link>
                        <span className="mx-5 text-[#FFECD1]">&gt;</span>
                        <Link href="/request">
                            <span className="hover:text-blue-500 cursor-pointer">Request</span>
                        </Link>
                        <span className="mx-5 text-[#FFECD1]">&gt;</span>
                        <Link href={`/request/${id}`}>
                            <span className="hover:text-blue-500 cursor-pointer">Request Detail dari {formData.request_name}</span>
                        </Link>
                    </p>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center bg-white">
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                    </div>
                ) : (
                    <div className="bg-[#001524] p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8 mt-8 flex flex-col md:flex-row">
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-bold mb-6 text-[#FFECD1]">Desain Produk Impianmu</h2>
                            <form className="space-y-4">
                                {error && <div className="text-red-500">{error}</div>}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="request_name">Nama Request</label>
                                    <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="request_name" name="request_name" value={formData.request_name} disabled />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="category">Spesifikasi Produk</label>
                                        <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="category" name="category" value={formData.category} disabled />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="color">Warna</label>
                                        <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="color" name="color" value={formData.color} disabled />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="size">Ukuran</label>
                                        <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="size" name="size" value={formData.size} disabled />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="quantity">Jumlah produk request yang kamu inginkan</label>
                                    <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="number" id="quantity" name="quantity" value={formData.quantity} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="design_user">Gambar yang kamu upload</label>
                                    {formData.design_user ? (
                                        <img src={formData.design_user as unknown as string} alt="Desain Produk" className="w-full h-64 object-cover mb-4 mt-4 rounded-lg" />
                                    ) : (
                                        <p className="text-[#FFECD1]">Tidak ada gambar yang diunggah</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="description">Detail lain yang ingin disampaikan</label>
                                    <div className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded">{formData.description}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="product_needed_time">Kapan membutuhkan produk ini</label>
                                    <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="product_needed_time" name="product_needed_time" value={new Date(formData.product_needed_time).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} disabled />
                                </div>
                                {/* <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="status">Status</label>
                                <p className={`w-full px-3 py-2 rounded-md shadow-sm text-center text-3xl font-bold ${getStatusColor(formData.status)}`}>{formData.status}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="total_price">Total Harga</label>
                            </div> */}
                                {(formData.status === "REJECTED" || formData.status === "CANCELED" || formData.design_admin.length === 0) ? (
                                    <div>
                                        <p className={`w-full px-3 py-2 rounded-md shadow-sm text-center text-3xl font-bold ${getStatusColor(formData.status)}`}> {formData.status}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="total_price">Total Harga</label>
                                            <input className="w-full px-3 py-2 bg-[#0B3B49] text-[#FFECD1] border border-[#FFECD1] rounded" type="text" id="total_price" name="total_price" value={formData.total_price} disabled />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-[#FFECD1]" htmlFor="status">Status</label>
                                            <p className={`w-full px-3 py-2 rounded-md shadow-sm text-center text-3xl font-bold ${getStatusColor(formData.status)}`}>{formData.status === "PAYMENT_PENDING" ? "PAYMENT PENDING" : formData.status}</p>
                                        </div>
                                    </>
                                )}
                                <div className="flex flex-row space-x-4">
                                    {
                                        !(
                                            formData.status === "REJECTED" ||
                                            formData.status === "CANCELED" ||
                                            formData.status === "DONE") ?
                                            <button
                                                type="button"
                                                onClick={() => setShowPopup(true)}
                                                disabled={['ACCEPTED', 'REJECTED', 'PAYMENT_PENDING'].includes(formData.status)}
                                                className="w-full px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-gray-400"
                                            >
                                                Cancel Request
                                            </button>
                                            :
                                            null
                                    }
                                    {
                                        !(
                                            formData.status === "REJECTED" ||
                                            formData.status === "CANCELED" ||
                                            formData.status === "DONE") ?
                                            <button
                                                type="button"
                                                onClick={handlePayment}
                                                disabled={formData.status !== 'ACCEPTED' && formData.status !== 'REJECTED' && formData.status !== 'PAYMENT_PENDING'}
                                                className="w-full px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400"
                                            >
                                                Bayar
                                            </button>
                                            :
                                            null
                                    }
                                </div>
                            </form>
                        </div>
                        <div className="md:w-1/3 mt-8 md:mt-0 md:ml-8 flex items-center justify-center relative">
                            {
                                formData.design_admin.length !== 0 ?
                                    <div className="flex items-center justify-center">
                                        <Button className="cursor-pointer" onClick={handlePrevImage}>
                                            <ChevronLeftIcon className="w-8 h-8" />
                                        </Button>
                                        <img src={formData.design_admin[currentImageIndex]} alt="Desain Request Admin" className="rounded-lg shadow-lg w-64 h-64 object-cover mx-4 text-center max-h-screen flex justify-center items-center" />
                                        <Button className="cursor-pointer" onClick={handleNextImage}>
                                            <ChevronRightIcon className="w-8 h-8" />
                                        </Button>
                                    </div>
                                    :
                                    null
                            }
                            {
                                formData.design_admin.length !== 0 ?
                                    <div className="absolute bottom-0 w-full flex items-center justify-center pb-32">
                                        <p className="text-[#FFECD1] text-md font-serrif">Jangan ragu untuk mengekspresikan perasaanmu akan sesuatu, keluarkan dan realisasikan</p>
                                    </div>
                                    :
                                    null
                            }

                        </div>
                    </div>
                )}
            </main>
            {showPopup && (
                <Popup2
                    message="Pengingat"
                    subMessage="Saat kamu membatalkan request ini, kamu akan kehilangan yang sudah kamu input sebelumnya. Yakin ingin melanjutkan?"
                    onConfirm={() => {
                        handleCancelRequest();
                        setShowPopup(false);
                    }}
                    onCancel={() => setShowPopup(false)}
                />
            )}
            {showConfirmationPopup && (
                <Popup
                    message="Request berhasil dibatalkan"
                    subMessage="Kalau kamu mau, buat request yang lain yuk"
                    onClose={() => {
                        setShowConfirmationPopup(false);
                        router.push('/request');
                    }}
                />
            )}
        </div>
    )
}