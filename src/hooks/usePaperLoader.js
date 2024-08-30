// src/hooks/usePaperLoader.js
import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

function usePaperLoader() {
  const [arxivId, setArxivId] = useState('')
  const [paper, setPaper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getAccessTokenSilently } = useAuth0()
  const [selectedReferences, setSelectedReferences] = useState({})
  const [additionalPapers, setAdditionalPapers] = useState([])
  const [uploadedPdfs, setUploadedPdfs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingPaper, setIsLoadingPaper] = useState(false)
  const [newPaperId, setNewPaperId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = await getAccessTokenSilently()
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/papers/${arxivId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data) {
        setPaper(response.data)
        console.log('response.data:', response.data)
        const initialSelectedRefs = {}
        response.data.references.forEach((ref) => {
          if (ref.is_available_on_arxiv) {
            initialSelectedRefs[ref.arxiv_id] = true
          }
        })
        console.log('initialSelectedRefs:', initialSelectedRefs)
        setSelectedReferences(initialSelectedRefs)
      } else {
        setError('Received empty response from server')
      }
    } catch (error) {
      setError('Failed to load paper. Please check your input and try again.')
      console.error('Error loading paper:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReferenceToggle = (arxivId) => {
    setSelectedReferences((prev) => ({
      ...prev,
      [arxivId]: !prev[arxivId],
    }))
  }

  const handleAddPaper = async (newPaperId, parentPaperId) => {
    if (
      newPaperId &&
      !additionalPapers.some((paper) => paper.id === newPaperId)
    ) {
      setIsLoadingPaper(true)
      setError(null)
      try {
        const token = await getAccessTokenSilently()
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/papers/${newPaperId}/title`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { parent_arxiv_id: parentPaperId },
          }
        )
        setAdditionalPapers((prevPapers) => [
          ...prevPapers,
          { id: newPaperId, title: response.data.title },
        ])
      } catch (error) {
        console.error('Error fetching paper title:', error)
        setError(
          'Failed to fetch paper title. Please check the arXiv ID and try again.'
        )
      } finally {
        setIsLoadingPaper(false)
      }
    }
  }

  const handleRemoveAdditionalPaper = (paperId) => {
    setAdditionalPapers(
      additionalPapers.filter((paper) => paper.id !== paperId)
    )
  }

  const handlePdfUpload = (files) => {
    setUploadedPdfs((prevPdfs) => [...prevPdfs, ...files])
  }

  const handleRemovePdf = (index) => {
    setUploadedPdfs((prevPdfs) => prevPdfs.filter((_, i) => i !== index))
  }

  return {
    arxivId,
    setArxivId,
    paper,
    loading,
    error,
    selectedReferences,
    additionalPapers,
    uploadedPdfs,
    isModalOpen,
    handleSubmit,
    handleReferenceToggle,
    handleAddPaper,
    handleRemoveAdditionalPaper,
    handlePdfUpload,
    handleRemovePdf,
    setIsModalOpen,
    isLoadingPaper,
    newPaperId,
    setNewPaperId,
  }
}

export default usePaperLoader
