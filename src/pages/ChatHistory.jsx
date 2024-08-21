import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import ChatDisplay from '../components/ChatDisplay'
import RawCacheModal from '../components/RawCacheModal' // Import the RawCacheModal component
import axios from 'axios'

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
    setSelectedSession(session)
  }

  const handleRawCacheClick = (sessionId, e) => {
    e.stopPropagation() // Prevent triggering handleSessionClick
    setCurrentRawCacheSessionId(sessionId)
    setIsRawCacheModalOpen(true)
  }

  if (loading) {
    return <div>Loading chat history...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toISOString().split('T')[0]
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat History</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          {!hasChatSessions ? (
            <p>You haven't started any chat sessions yet.</p>
          ) : (
            <ul className="space-y-4">
              {chatSessions.map((session) => (
                <li
                  key={session.session_id}
                  className={`border p-4 rounded-lg shadow-sm cursor-pointer ${
                    selectedSession &&
                    selectedSession.session_id === session.session_id
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Chat Session {session.session_id.slice(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        Messages: {session.messages.length}
                      </p>
                      {/* New details */}
                      <p className="text-sm text-gray-500">
                        Duration (minutes):{' '}
                        {formatDuration(session.chat_duration)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tokens Used: {session.token_count_used.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price Tier: {session.price_tier}
                      </p>
                      <p className="text-sm text-gray-500">
                        Token millions per Hour:{' '}
                        {session.token_hours_used.toFixed(4)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date recorded (End of chat):{' '}
                        {formatDate(session.termination_time)}
                      </p>
                    </div>
                    <button
                      onClick={(e) =>
                        handleRawCacheClick(session.session_id, e)
                      }
                      className="text-blue-500 hover:underline"
                    >
                      Raw Cache
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-2/3 pl-4">
          {hasChatSessions ? (
            selectedSession ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Chat Session {selectedSession.session_id.slice(0, 8)}...
                </h2>
                {/* New details for selected session */}
                <div className="mb-4 text-sm text-gray-600">
                  Duration: {formatDuration(selectedSession.chat_duration)} |
                  Tokens Used:{' '}
                  {selectedSession.token_count_used.toLocaleString()} | Price
                  Tier: {selectedSession.price_tier} | Token Hours:{' '}
                  {selectedSession.token_hours_used.toFixed(4)}
                </div>
                <div className="bg-white rounded-lg shadow">
                  <ChatDisplay
                    messages={selectedSession.messages}
                    onRawCacheClick={(e) =>
                      handleRawCacheClick(selectedSession.session_id, e)
                    }
                  />
                </div>
              </div>
            ) : (
              <p>Select a chat session to view the conversation.</p>
            )
          ) : null}
        </div>
      </div>

      <RawCacheModal
        sessionId={currentRawCacheSessionId}
        isOpen={isRawCacheModalOpen}
        onClose={() => setIsRawCacheModalOpen(false)}
      />
    </div>
  )
}

export default ChatHistory
