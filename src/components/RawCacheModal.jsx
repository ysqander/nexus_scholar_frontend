import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

const RawCacheModal = ({ sessionId, isOpen, onClose }) => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const fetchRawCache = async () => {
      if (!isOpen || !sessionId) return

      try {
        setIsLoading(true)
        setError(null)
        const token = await getAccessTokenSilently()
        console.log('Fetching raw cache for session:', sessionId)
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/raw-cache?session_id=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        console.log('Raw cache response:', response.data)
        if (response.data && response.data.content) {
          setContent(response.data.content)
        } else {
          setError('Received empty content from the server')
        }
      } catch (err) {
        console.error('Error fetching raw cache:', err)
        setError(`Failed to load content: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRawCache()
  }, [sessionId, getAccessTokenSilently, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold retro-font">Raw Cache Content</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-4 retro-text">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4 retro-text">
            {error}
          </div>
        ) : content ? (
          <div className="border p-4 h-96 overflow-y-auto whitespace-pre-wrap retro-text-light">
            {content}
          </div>
        ) : (
          <div className="text-center py-4 retro-text-light">
            No content available
          </div>
        )}
      </div>
    </div>
  )
}

export default RawCacheModal
