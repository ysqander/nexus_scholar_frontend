import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

function Success() {
  const { getAccessTokenSilently } = useAuth0()
  const [loading, setLoading] = useState(true)
  const [accountInfo, setAccountInfo] = useState(null)

  useEffect(() => {
    const fetchUpdatedAccountInfo = async () => {
      try {
        const token = await getAccessTokenSilently()
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/cache-usage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setAccountInfo(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching account info:', error)
        setLoading(false)
      }
    }

    fetchUpdatedAccountInfo()
  }, [getAccessTokenSilently])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
      <p className="text-lg mb-4">
        Your payment has been processed successfully.
      </p>
      {accountInfo && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="text-xl font-semibold mb-2">
            Your updated account information:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Base Net Tokens: {accountInfo.base_net_tokens}</li>
            <li>Pro Net Tokens: {accountInfo.pro_net_tokens}</li>
          </ul>
        </div>
      )}
      <p className="text-lg mb-4">
        Your account has been updated with the purchased token hours.
      </p>
      <Link
        to="/account"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Account
      </Link>
    </div>
  )
}

export default Success
