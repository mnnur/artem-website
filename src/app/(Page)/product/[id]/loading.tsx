import React from 'react';

const Loading = () => {
  return (
    <div className="relative bg-white text-[#001524]">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row animate-pulse">
          <div className="lg:w-1/2">
            <div className="w-full h-64 sm:w-full md:w-full lg:w-5/6 bg-gray-300 rounded mb-4 mt-8 lg:ml-16 lg:mb-0"></div>
          </div>
          <div className="lg:w-1/2 lg:pl-8">
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="flex space-x-2 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex space-x-2 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-16 h-8 bg-gray-300 rounded mr-4"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="h-1 bg-gray-300 rounded mb-8"></div>
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
          </div>
        </div>
        <div className="mt-8">
          <div className="h-10 bg-gray-300 rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-[#FFECD1] text-[#001524] p-4 rounded-lg animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="h-10 bg-gray-300 rounded inline-block w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
