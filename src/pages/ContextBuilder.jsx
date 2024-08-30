import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import PaperLoader from '../components/PaperLoader'

function ContextBuilder() {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0()

  useEffect(() => {
    const fetchProtectedMessage = async () => {
      if (!isAuthenticated) return

      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        })
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/private`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Error fetching protected message:', error)
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
    <div className="w-full mt-4">
      <h1 className="text-3xl font-bold mb-4 retro-font px-4">
        Context Builder
      </h1>
      <PaperLoader />
    </div>
  )
}

export default ContextBuilder
