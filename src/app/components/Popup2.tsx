import React from 'react';
import { ExclamationIcon } from '@heroicons/react/solid'; // Pastikan ikon ini sudah ada di proyek Anda

interface Popup2Props {
  message: string;
  subMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Popup2: React.FC<Popup2Props> = ({ message, subMessage, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-3 rounded shadow-lg relative w-96">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <ExclamationIcon className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#0B3B49]">{message}</p>
            {subMessage && <p className="text-gray-500">{subMessage}</p>}
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md">
            Tidak
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#0B3B49] text-white rounded-md">
            Yakin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup2;
