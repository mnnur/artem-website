import React from 'react';
import Link from 'next/link';

export default function RequestSnkPage() {
    return (
        <div className="bg-[#0B3B49] text-[#FFECD1] min-h-screen flex flex-col justify-between">
            <title>Request SNK</title>
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
                        <Link href="/request/snk">
                            <span className="hover:text-blue-500 cursor-pointer">Syarat dan Ketentuan</span>
                        </Link>
                    </p>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center bg-white">
                <div className="bg-[#0B3B49] p-8 rounded-lg shadow-lg w-full mb-8 mt-8">
                    <h2 className="text-3xl font-bold mb-6 text-[#FFECD1]">Aturan Dasar</h2>
                    <ul className="list-disc list-inside text-[#FFECD1] space-y-2">
                        <li>Pengguna berhak untuk request produk namun dengan batas maksimal memiliki status request yang sedang pending sebanyak 5 buah</li>
                        <li>Pengguna tidak dapat mencancel request yang sudah diterima oleh admin</li>
                        <li>Pengguna harus membayar nominal sebesar 10 ribu rupiah jika request desain sebelumnya sudah diterima walaupun pengguna tidak jadi mengambil hasil desain dari yang diberikan admin</li>
                        <li>Harga yang diberikan oleh admin sudah merupakan harga yang final dan tidak dapat dinego</li>
                    </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="bg-[#0B3B49] p-8 rounded-lg shadow-lg flex items-center">
                        <div className="flex-grow">
                            <h3 className="text-4xl font-bold mb-4 text-[#FFECD1] text-center pb-18">Lukisan</h3>
                            <ul className="list-disc list-inside text-[#FFECD1] space-y-2 pb-32">
                                <li>Lukisan dibuat dengan menggunakan kanvas dan cat merk ARTEMS</li>
                                <li>Pengguna dapat memilih jenis ukuran yang telah disediakan (tidak dapat request ukuran lainnya)</li>
                                <li>Harga: Rp. 100.000 (menyesuaikan seniman dan tingkat kesulitan request)</li>
                            </ul>
                        </div>
                        <div className="relative">
                            <img src="https://images.tokopedia.net/img/cache/500-square/product-1/2020/8/6/9308311/9308311_fbaae4f3-f75f-44ad-aff4-7e2dbfb36f12_1548_1548.jpg" alt="Lukisan" className="rounded-lg shadow-lg w-80 h-50 ml-4 transition-opacity duration-300 ease-in-out hover:opacity-0" />
                            <img src="https://img.ws.mms.shopee.co.id/182262175f30fd6c4aece2a53f67181c" alt="Lukisan Hover" className="rounded-lg shadow-lg w-80 h-50 ml-4 absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" />
                        </div>
                    </div>
                    <div className="bg-[#0B3B49] p-8 rounded-lg shadow-lg flex items-center">
                        <div className="flex-grow">
                            <h3 className="text-4xl font-bold mb-4 text-[#FFECD1] text-center pb-18">Cangkir</h3>
                            <ul className="list-disc list-inside text-[#FFECD1] space-y-2 pb-32">
                                <li>Cangkir merupakan jenis MUG</li>
                                <li>Pengguna dapat memilih warna sesuai yang ada namun juga bisa merequest warna dengan menyertakan spesifikasi warna</li>
                                <li>Pengguna dapat memilih jenis ukuran yang telah disediakan (tidak dapat request ukuran lainnya)</li>
                                <li>Harga: Rp. 50.000 (bertambah 2.500 setiap kenaikan ukuran)</li>
                            </ul>
                        </div>
                        <div className="relative">
                            <img src="https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/111/0711123_PE727991_S5.jpg" alt="Cangkir" className="rounded-lg shadow-lg w-80 h-50 ml-4 transition-opacity duration-300 ease-in-out hover:opacity-0" />
                            <img src="https://img.lazcdn.com/g/p/167cdd454a2732f2ff7b3245237eed55.png_960x960q80.png_.jpg" alt="Cangkir Hover" className="rounded-lg shadow-lg w-80 h-50 ml-4 absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" />
                        </div>
                    </div>
                    <div className="bg-[#0B3B49] p-8 rounded-lg shadow-lg flex items-center">
                        <div className="flex-grow">
                            <h3 className="text-4xl font-bold mb-4 text-[#FFECD1] text-center pb-18">Baju</h3>
                            <ul className="list-disc list-inside text-[#FFECD1] space-y-2 pb-32">
                                <li>Baju berbahan dasar katun</li>
                                <li>Pengguna dapat memilih warna sesuai yang ada namun juga bisa merequest warna dengan menyertakan spesifikasi warna</li>
                                <li>Pengguna dapat memilih jenis ukuran yang telah disediakan (tidak dapat request ukuran lainnya)</li>
                                <li>Harga: Rp. 50.000 (bertambah 2.500 setiap kenaikan ukuran)</li>
                            </ul>
                        </div>
                        <div className="relative">
                            <img src="https://img.ws.mms.shopee.co.id/bb50fa65e49a3534328aaffeef351adf" alt="Baju" className="rounded-lg shadow-lg w-80 h-50 ml-4 transition-opacity duration-300 ease-in-out hover:opacity-0" />
                            <img src="https://img.ws.mms.shopee.co.id/fe9460f2a829a3db4ce47c48b85aeb7b" alt="Baju Hover" className="rounded-lg shadow-lg w-80 h-50 ml-4 absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" />
                        </div>
                    </div>
                    <div className="bg-[#0B3B49] p-8 rounded-lg shadow-lg flex items-center">
                        <div className="flex-grow">
                            <h3 className="text-4xl font-bold mb-4 text-[#FFECD1] text-center pb-18">Celana</h3>
                            <ul className="list-disc list-inside text-[#FFECD1] space-y-2 pb-32">
                                <li>Celana berbahan dasar katun</li>
                                <li>Pengguna dapat memilih warna sesuai yang ada namun juga bisa merequest warna dengan menyertakan spesifikasi warna</li>
                                <li>Pengguna dapat memilih jenis ukuran yang telah disediakan (tidak dapat request ukuran lainnya)</li>
                                <li>Harga: Rp. 50.000 (bertambah 2.500 setiap kenaikan ukuran)</li>
                            </ul>
                        </div>
                        <div className="relative">
                            <img src="https://hikenrun.com/cdn/shop/products/A1_8456cb28-c3d2-425d-a4a9-5487d0307369.png?v=1677666734" alt="Celana" className="rounded-lg shadow-lg w-80 h-50 ml-4 transition-opacity duration-300 ease-in-out hover:opacity-0" />
                            <img src="https://cdn.eurekabookhouse.co.id/ebh/product/all/celana_panjang_smp2.jpeg" alt="Celana Hover" className="rounded-lg shadow-lg w-80 h-80 ml-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" />
                        </div>
                    </div>
                    <div className="bg-[#0B3B49] p-8 rounded-lg shadow-lg flex items-center mb-8">
                        <div className="flex-grow">
                            <h3 className="text-4xl font-bold mb-4 text-[#FFECD1] text-center pb-18">Topi</h3>
                            <ul className="list-disc list-inside text-[#FFECD1] space-y-2 pb-32">
                                <li>Topi berbahan dasar polyester</li>
                                <li>Pengguna dapat memilih warna sesuai yang ada namun juga bisa merequest warna dengan menyertakan spesifikasi warna</li>
                                <li>Pengguna dapat memilih jenis ukuran yang telah disediakan (tidak dapat request ukuran lainnya)</li>
                                <li>Harga: Rp. 50.000 (bertambah 2.500 setiap kenaikan ukuran)</li>
                            </ul>
                        </div>
                        <div className="relative">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKYv-3R_1bQn-jvassSjT01pY4dm5xXCVYg&s" alt="Topi" className="rounded-lg shadow-lg w-80 h-50 ml-4 transition-opacity duration-300 ease-in-out hover:opacity-0" />
                            <img src="https://konveksitopi.id/wp-content/uploads/2022/02/size-chart-ukuran-topi.jpg" alt="Topi Hover" className="rounded-lg shadow-lg w-80 h-80 ml-4 absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}