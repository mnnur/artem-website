import React from 'react';

const ErrorPagePayment = () => {
    const whatsappLink = `https://wa.me/${'+6281326021382'}`
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Failed!</h1>
                <p className="text-lg mb-6">We&apos;re sorry, but your payment could not be processed. Please try again or contact our customer support for help.</p>
                <div className="flex justify-center space-x-4">
                    <a href="http://localhost:3000/" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Go to Home</a>
                    <a href="http://localhost:3000/cart" className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Back to cart</a>
                    <a href={whatsappLink} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600" target="_blank" rel="noopener noreferrer">
                        Contact via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ErrorPagePayment;
