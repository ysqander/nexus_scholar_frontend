import React from 'react';
import { Link } from 'react-router-dom';

const LowCreditWarningModal = ({ isOpen, onClose}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-4 p-4 border shadow-lg rounded-md bg-white z-50">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Low Credit Warning</h3>
      <p className="mb-2">
        Your remaining credit is low.
        Please add more credit to continue using the chat.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
        >
          Dismiss
        </button>
        <Link
          to="/account"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Add Credit
        </Link>
      </div>
    </div>
  );
};

export default LowCreditWarningModal;