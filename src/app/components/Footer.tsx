import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
    <footer className="bg-[#0B3B49] p-4 bottom-full">
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-between">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
                    <p className="text-[#FFECD1] font-bold text-lg">ARTEM</p>
                    <div className="flex flex-col space-y-2 pt-4">
                        <p className="text-[#FFECD1] opacity-90">Universitas Padjadjaran</p>
                        <p className="text-[#FFECD1] opacity-90">FMIPA - Teknik Informatika</p>
                        <p className="text-[#FFECD1] opacity-90">Proyek Perangkat Lunak I</p>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
                    <p className="text-[#FFECD1] font-bold text-lg">Link</p>
                    <div className="flex flex-col space-y-4 pt-4">
                        <Link href="/home" className="text-[#FFECD1] opacity-90">
                            Home
                        </Link>
                        <Link href="/product" className="text-[#FFECD1] opacity-90">
                            Product
                        </Link>
                        <Link href="/about" className="text-[#FFECD1] opacity-90">
                            About
                        </Link>
                        <Link href="/history" className="text-[#FFECD1] opacity-90">
                            History
                        </Link>
                    </div>
                </div>
                <div className="w-full sm:w-full md:w-1/3 lg:w-1/4 mb-4">
                    <p className="text-[#FFECD1] font-bold text-lg">Help</p>
                    <div className="flex flex-col space-y-4 pt-4">
                        <Link href="/policy" className="text-[#FFECD1] opacity-90">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    );
};

export default Footer;
