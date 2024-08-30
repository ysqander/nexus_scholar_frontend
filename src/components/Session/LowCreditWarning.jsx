import React from 'react'
import { Link } from 'react-router-dom'

const LowCreditWarningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed top-4 left-4 p-4 border shadow-lg rounded-md bg-white z-50">
      <h3 className="text-lg font-medium text-gray-900 mb-2 retro-font">
        Low Credit Warning
      </h3>
      <p className="mb-2 retro-text-light">
        Your remaining credit is low. Please add more credit on the Account page
        to continue using the chat. You have at least 5 minutes to do so.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="bg-mac-gray text-gray-800 px-2 py-1 rounded hover:bg-mac-cool-gray retro-text"
        >
          Dismiss
        </button>
        <Link
          to="/account"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-mac-purple text-white px-2 py-1 rounded hover:bg-mac-purple-dark retro-text"
        >
          Add Credit
        </Link>
      </div>
    </div>
  )
}

export default LowCreditWarningModal
