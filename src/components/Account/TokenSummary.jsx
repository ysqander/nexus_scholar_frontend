import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axiosWithRetry from '../../utils/axiosConfig'

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
      const response = await axiosWithRetry.get(`/api/cache-usage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Raw response data:', JSON.stringify(response.data, null, 2))
      setCacheUsage(response.data)
    } catch (error) {
      console.error('Error fetching cache usage:', error)
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
          <td colSpan="6" className="font-bold py-2 px-4">
            {month}
          </td>
        </tr>
        {Object.entries(tiers).flatMap(([tier, chats]) =>
          chats.map((chat, index) => (
            <tr key={`${month}-${tier}-${index}`} className="border-b">
              <td className="py-2 px-4">{chat.session_id}</td>
              <td className="py-2 px-4">{formatDuration(chat.duration)}</td>
              <td className="py-2 px-4">{chat.tokens_used.toLocaleString()}</td>
              <td className="py-2 px-4">{formatDate(chat.termination_time)}</td>
              <td className="py-2 px-4">
                {tier === 'pro' ? chat.token_hours_used.toFixed(4) : '-'}
              </td>
              <td className="py-2 px-4">
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
    <div className="mb-8 bg-gray-100 rounded-lg p-4">
      <h2 className="text-2xl font-bold">Available Token Hours</h2>
      <small className="text-gray-600 mb-2">(in million tokens per hour)</small>
      <p>Base model: {cacheUsage.base_net_tokens.toFixed(2)}</p>
      <p>Pro model: {cacheUsage.pro_net_tokens.toFixed(2)}</p>

      <h3 className="text-xl font-bold mt-4 mb-2">Cache Usage by Chat</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Session ID</th>
              <th className="py-2 px-4">Duration</th>
              <th className="py-2 px-4">Tokens Used</th>
              <th className="py-2 px-4">Termination Date</th>
              <th className="py-2 px-4">Token Hours Used (Pro)</th>
              <th className="py-2 px-4">Token Hours Used (Base)</th>
            </tr>
          </thead>
          <tbody>{renderChatHistory()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default TokenSummary
