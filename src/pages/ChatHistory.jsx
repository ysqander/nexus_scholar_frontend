import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import ChatModal from '../components/ChatModal'
import RawCacheModal from '../components/RawCacheModal'

function ChatHistory() {
  const [chatSessions, setChatSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isRawCacheModalOpen, setIsRawCacheModalOpen] = useState(false)
  const [currentRawCacheSessionId, setCurrentRawCacheSessionId] = useState(null)
  const { getAccessTokenSilently } = useAuth0()
  const hasChatSessions = chatSessions && chatSessions.length > 0

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = await getAccessTokenSilently()
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setChatSessions(response.data.chat_history)
      } catch (error) {
        setError('Failed to load chat history. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchChatHistory()
  }, [getAccessTokenSilently])

  const handleSessionClick = (session) => {
    // Ensure all required properties are present before setting the selected session
    if (session && session.session_id && session.messages) {
      setSelectedSession(session)
    } else {
      console.error('Invalid session data:', session)
      // Optionally, show an error message to the user
      setError('Unable to load chat session. Please try again.')
    }
  }

  const handleRawCacheClick = (sessionId, e) => {
    e.stopPropagation() // Prevent triggering handleSessionClick
    setCurrentRawCacheSessionId(sessionId)
    setIsRawCacheModalOpen(true)
  }

  const truncateMessage = (message, maxLength = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength - 3) + '...'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number') return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <div className="p-4">Loading chat history...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 retro-font">Chat History</h1>
      <div className="bg-mac-platinum rounded-lg shadow-inner p-4">
        {!hasChatSessions ? (
          <p className="text-center py-4 retro-text">
            You haven&apos;t started any chat sessions yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatSessions.map((session) => (
              <li
                key={session.session_id}
                className="bg-white border-2 border-gray-300 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-mac-beige transition-colors duration-200"
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex flex-col h-full">
                  <h3 className="font-semibold text-xs retro-font mb-2">
                    {truncateMessage(
                      session.messages[0]?.content || 'No messages'
                    )}
                  </h3>
                  <div className="text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1 mb-2 retro-text-light">
                    <p>ID: {session.session_id.slice(0, 8)}...</p>
                    <p>Messages: {session.messages.length}</p>
                    <p>Duration: {formatDuration(session.chat_duration)}</p>
                    <p>Date: {formatDate(session.termination_time)}</p>
                  </div>
                  <button
                    onClick={(e) => handleRawCacheClick(session.session_id, e)}
                    className="bg-mac-gray text-white px-3 py-1 rounded hover:bg-mac-cool-gray transition-colors duration-200 mt-auto self-start retro-text"
                  >
                    Raw Cache
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedSession && (
        <ChatModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      <RawCacheModal
        sessionId={currentRawCacheSessionId}
        isOpen={isRawCacheModalOpen}
        onClose={() => setIsRawCacheModalOpen(false)}
      />
    </div>
  )
}

export default ChatHistory
