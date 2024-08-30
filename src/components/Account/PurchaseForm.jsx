import React, { useState } from 'react'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth0 } from '@auth0/auth0-react'

function PurchaseForm() {
  const [tokenHours, setTokenHours] = useState(1)
  const [plan, setPlan] = useState('base')
  const { getAccessTokenSilently } = useAuth0()

  const handlePurchase = async () => {
    const token = await getAccessTokenSilently()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/purchase-cache-volume`,
        {
          price_tier: plan,
          token_hours: tokenHours.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const { session_id } = response.data
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      stripe.redirectToCheckout({ sessionId: session_id })
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300">
      <h2 className="text-xl font-bold mb-4 retro-font">
        Purchase Token Hours
      </h2>
      <p className="mb-4 text-sm text-gray-700 retro-text">
        Prices are based on underlying pricing by the LLM provider plus a markup
        for our context building service.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-gray-300 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 retro-font">Base Plan</h3>
          <p className="mb-2 retro-text text-gray-700">
            $1.2 per 1M token hour
          </p>
          <p className="mb-4 text-sm text-gray-700 retro-text-light">
            Currently Google Gemini 1.5 Flash model. Good for single item
            retrieval and summarization.
          </p>
          <button
            className={`px-4 py-2 rounded retro-text ${
              plan === 'base'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPlan('base')}
          >
            Select Base Plan
          </button>
        </div>
        <div className="border-2 border-gray-300 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 retro-font">Pro Plan</h3>
          <p className="mb-2 retro-text text-gray-700">$5 per 1M token hour</p>
          <p className="mb-4 text-sm text-gray-700 retro-text-light">
            Currently Google Gemini 1.5 Pro model. Good for complex questions.
          </p>
          <button
            className={`px-4 py-2 rounded retro-text ${
              plan === 'pro'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPlan('pro')}
          >
            Select Pro Plan
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="tokenHours"
          className="block mb-2 text-gray-700 retro-text"
        >
          Token Hours (1-20):
        </label>
        <input
          type="number"
          id="tokenHours"
          min="1"
          max="20"
          value={tokenHours}
          onChange={(e) =>
            setTokenHours(Math.min(20, Math.max(1, parseInt(e.target.value))))
          }
          className="border-2 border-gray-300 rounded px-2 py-1 w-16 text-gray-700 retro-text"
        />
      </div>
      <button
        onClick={handlePurchase}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors retro-text"
      >
        Purchase {tokenHours} {plan === 'base' ? 'Base' : 'Pro'} Token Hours
      </button>
    </div>
  )
}

export default PurchaseForm
