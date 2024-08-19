import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axiosWithRetry from '../utils/axiosConfig'
import PaperLoader from '../components/PaperLoader'

function ContextBuilder() {
  const { getAccessTokenSilently, user, isLoading, isAuthenticated } =
    useAuth0()
  const [message, setMessage] = useState('')
  const [isApiLoading, setIsApiLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProtectedMessage = async () => {
      if (!isAuthenticated) return

      setIsApiLoading(true)
      setError(null)
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        })
        const response = await axiosWithRetry.get(`/api/private`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setMessage(response.data.message)
      } catch (error) {
        console.error('Error fetching protected message:', error)
        setError('Failed to fetch protected message. Please try again later.')
      } finally {
        setIsApiLoading(false)
      }
    }

    fetchProtectedMessage()
  }, [getAccessTokenSilently, isAuthenticated])

  if (isLoading) {
    return <div>Loading user information...</div>
  }

  if (!isAuthenticated) {
    return <div>Please log in to view the context builder.</div>
  }

  return (
    <>
      <div className="w-full mt-4  px-4">
        <h1 className="text-3xl font-bold mb-4 px-4">Context Builder</h1>
        {user && (
          <div className="mb-4 px-4">
            <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
          </div>
        )}
        {/* {isApiLoading && <p>Loading protected message...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>Protected Message: {message}</p>} */}
      </div>
      <div className="w-full">
        <PaperLoader />
      </div>
    </>
  )
}
export default ContextBuilder
