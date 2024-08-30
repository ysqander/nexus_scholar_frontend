import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function CacheBuilderModal({
  isOpen,
  onClose,
  mainPaper,
  selectedReferences,
  additionalPapers,
  uploadedPdfs,
  priceTier,
}) {
  const [isBuildingCache, setIsBuildingCache] = useState(false)
  const [error, setError] = useState(null)

  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      handleBuildCache()
    }
  }, [isOpen])

  const handleBuildCache = async () => {
    setIsBuildingCache(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently()
      const selectedArxivIds = Object.keys(selectedReferences).filter(
        (id) => selectedReferences[id]
      )
      const additionalArxivIds = additionalPapers.map((paper) => paper.id)
      const allArxivIds = mainPaper
        ? [mainPaper.id, ...selectedArxivIds, ...additionalArxivIds]
        : [...selectedArxivIds, ...additionalArxivIds]

      const formData = new FormData()
      formData.append('arxiv_ids', JSON.stringify(allArxivIds))
      formData.append('price_tier', priceTier)
      uploadedPdfs.forEach((pdf, index) => {
        formData.append('pdfs', pdf, pdf.name)
      })

      // Creating a research session
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-research-session`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Navigate to the chat page
      navigate(`/chat/${response.data.session_id}`)
    } catch (error) {
      console.error('Error creating a research session:', error)
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else if (error.message) {
        setError(error.message)
      } else {
        setError('Failed to create a research session. Please try again.')
      }
    } finally {
      setIsBuildingCache(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="bg-gray-100 p-6 rounded-lg border-4 border-gray-700 shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold retro-font">Building Cache</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-white p-4 rounded border border-gray-300">
          {isBuildingCache ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-xs text-gray-500 retro-text">
                Building your paper context...
              </p>
              <p className="mt-2 text-xs text-gray-400 retro-text-light">
                This may take a few moments
              </p>
            </div>
          ) : error ? (
            <p className="text-red-500 retro-font">{error.toString()}</p>
          ) : (
            <p className="text-sm text-gray-500 retro-font">
              Ready to build your cache
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-black font-bold py-2 px-4 rounded border-2 border-gray-700 hover:bg-gray-300 retro-font mr-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CacheBuilderModal
