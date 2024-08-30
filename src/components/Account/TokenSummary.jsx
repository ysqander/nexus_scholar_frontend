import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

function TokenSummary() {
  const [cacheUsage, setCacheUsage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getAccessTokenSilently } = useAuth0()

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toISOString().split('T')[0]
  }

  useEffect(() => {
    fetchCacheUsage()
  }, [])

  // ... existing fetchCacheUsage function ...
  const fetchCacheUsage = async () => {
    try {
      setIsLoading(true)
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      })
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/cache-usage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log('Raw response data:', JSON.stringify(response.data, null, 2))
      setCacheUsage(response.data)
    } catch (error) {
      console.error('Error fetching cache usage:', error)
      console.error('Error response:', error.response)
      setError('Failed to fetch available tokens. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <p>Loading available Token Hours...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!cacheUsage) return null

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderChatHistory = () => {
    return Object.entries(cacheUsage.chat_history).map(([month, tiers]) => (
      <React.Fragment key={month}>
        <tr className="bg-gray-200">
          <td
            colSpan="6"
            className="font-bold py-2 px-4 retro-font text-gray-800"
          >
            {month}
          </td>
        </tr>
        {Object.entries(tiers).flatMap(([tier, chats]) =>
          chats.map((chat, index) => (
            <tr key={`${month}-${tier}-${index}`} className="border-b">
              <td className="py-2 px-4 retro-text-light text-gray-700">
                {chat.session_id}
              </td>
              <td className="py-2 px-4 retro-text-light text-gray-700">
                {formatDuration(chat.duration)}
              </td>
              <td className="py-2 px-4 retro-text-light text-gray-700">
                {chat.tokens_used.toLocaleString()}
              </td>
              <td className="py-2 px-4 retro-text-light text-gray-700">
                {formatDate(chat.termination_time)}
              </td>
              <td className="py-2 px-4 retro-text-light text-gray-700">
                {tier === 'pro' ? chat.token_hours_used.toFixed(4) : '-'}
              </td>
              <td className="py-2 px-4 retro-text-light text-gray-700">
                {tier === 'base' ? chat.token_hours_used.toFixed(4) : '-'}
              </td>
            </tr>
          ))
        )}
        {/* ... existing monthly total row ... */}
      </React.Fragment>
    ))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300">
      <h2 className="text-xl font-bold retro-font">Available Token Hours</h2>
      <small className="text-gray-600 block retro-text">
        (in million tokens per hour)
      </small>
      <div className="flex mt-4 mb-4">
        <p className="mr-4 text-gray-700 retro-text">
          Base model:{' '}
          <span className="retro-font">
            {cacheUsage.base_net_tokens.toFixed(2)}
          </span>
        </p>
        <p className="text-gray-700 retro-text">
          Pro model:{' '}
          <span className="retro-font">
            {cacheUsage.pro_net_tokens.toFixed(2)}
          </span>
        </p>
      </div>

      <h3 className="text-lg font-bold mt-6 mb-4 retro-font">
        Cache Usage by Chat
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left retro-text">Session ID</th>
              <th className="py-2 px-4 text-left retro-text">Duration</th>
              <th className="py-2 px-4 text-left retro-text">Tokens Used</th>
              <th className="py-2 px-4 text-left retro-text">
                Termination Date
              </th>
              <th className="py-2 px-4 text-left retro-text">
                Token Hours (Pro)
              </th>
              <th className="py-2 px-4 text-left retro-text">
                Token Hours (Base)
              </th>
            </tr>
          </thead>
          <tbody>{renderChatHistory()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default TokenSummary
