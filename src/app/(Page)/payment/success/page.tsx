import React from 'react';

const SuccessPagePayment = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-green-500 mb-4">Payment Successful!</h1>
                <p className="text-lg mb-6">Thank you for your purchase. Your payment was processed successfully.</p>
                <div className="flex justify-center space-x-4">
                    <a href="http://localhost:3000/" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Go to Home</a>
                    <a href="http://localhost:3000/product" className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Buy another</a>
                </div>
            </div>
        </div>
    );
}

export default SuccessPagePayment;
