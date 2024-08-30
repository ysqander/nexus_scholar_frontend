import React from 'react'
import ChatDisplay from './ChatDisplay'

function ChatModal({ session, onClose }) {
  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number') return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-mac-platinum w-11/12 max-w-4xl h-5/6 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-stripes h-8 flex items-center justify-between px-4">
          <h2 className="text-lg font-bold retro-font">
            Chat Session {session.session_id?.slice(0, 8) || 'Unknown'}...
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>
        <div className="p-4 h-full overflow-y-auto">
          <div className="mb-4 text-sm retro-text-light text-gray-600 grid grid-cols-2 gap-4">
            <p>Duration: {formatDuration(session.chat_duration)}</p>
            <p>
              Tokens Used: {session.token_count_used?.toLocaleString() || 'N/A'}
            </p>
            <p>Price Tier: {session.price_tier || 'N/A'}</p>
            <p>Token Hours: {session.token_hours_used?.toFixed(4) || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <ChatDisplay messages={session.messages || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatModal
