import React from 'react';

const ExtendSessionModal = ({ isOpen, onClose, onConfirm, timeRemaining }) => {
  
  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const formatTimeRemaining = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds.toString().padStart(2, '0')} sec`;
  };

  console.log('Rendering ExtendSessionModal content');
  return (
    <div className="fixed top-4 right-4 p-4 border shadow-lg rounded-md bg-white z-50">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Extend Session</h3>
      <p className="mb-2">
        Your session will expire in {formatTimeRemaining(timeRemaining)}. Would you like to extend it?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleClose}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Extend Session
        </button>
      </div>
    </div>
  );
};

export default ExtendSessionModal;