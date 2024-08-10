import React from 'react';

const ExtendSessionModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Extend Session</h3>
        <p className="mb-4">
          Your session is about to expire. Would you like to extend it?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtendSessionModal;