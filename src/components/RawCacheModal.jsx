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
      if (!isOpen) return

      try {
        setIsLoading(true)
        const token = await getAccessTokenSilently()
        const response = await axios.get(
          `/api/raw-cache?session_id=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setContent(response.data.content)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching raw cache:', err)
        setError('Failed to load content. Please try again later.')
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
          <h2 className="text-xl font-bold">Raw Cache Content</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="border p-4 h-96 overflow-y-auto whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

export default RawCacheModal
