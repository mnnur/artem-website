import React from 'react';

interface PopupProps {
  message: string;
  subMessage?: string;
  onClose: () => void;
  children?: React.ReactNode;
  buttonText?: string;
}

const Popup: React.FC<PopupProps> = ({ message, subMessage, onClose, children, buttonText = "OK" }) => { // Default to "OK" if not provided
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg relative w-256">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <div className="flex items-center mb-4">
          <div className="bg-gray-200 p-2 rounded-full mr-3">
            <svg
              className="w-6 h-6 text-green-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7">
              </path>
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-[#0B3B49]">{message}</p>
            {subMessage && <p className="text-gray-500">{subMessage}</p>}
          </div>
        </div>
        {children}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-[#0B3B49] text-white px-4 py-2 rounded">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Popup;
