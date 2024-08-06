import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

function PurchaseForm() {
  const [tokenHours, setTokenHours] = useState(1);
  const [plan, setPlan] = useState('base');

  const handlePurchase = async () => {
    try {
      const response = await axios.post('/api/purchase-cache-volume', {
        price_tier: plan,
        token_hours: tokenHours.toString(),
      });
      const { session_id } = response.data;
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      stripe.redirectToCheckout({ sessionId: session_id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Purchase Token Hours</h2>
      <div className="flex space-x-4 mb-4">
        <div className="border p-4 rounded-lg w-1/2">
          <h3 className="text-xl font-semibold mb-2">Base Plan</h3>
          <p className="mb-2">$1.2 per token hour</p>
          <p className="mb-4">Plan details to be filled out later</p>
          <button
            className={`px-4 py-2 rounded ${plan === 'base' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setPlan('base')}
          >
            Select Base Plan
          </button>
        </div>
        <div className="border p-4 rounded-lg w-1/2">
          <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
          <p className="mb-2">$5 per token hour</p>
          <p className="mb-4">Plan details to be filled out later</p>
          <button
            className={`px-4 py-2 rounded ${plan === 'pro' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setPlan('pro')}
          >
            Select Pro Plan
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="tokenHours" className="block mb-2">Token Hours (1-20):</label>
        <input
          type="number"
          id="tokenHours"
          min="1"
          max="20"
          value={tokenHours}
          onChange={(e) => setTokenHours(Math.min(20, Math.max(1, parseInt(e.target.value))))}
          className="border rounded px-2 py-1"
        />
      </div>

      <button
        onClick={handlePurchase}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Purchase {tokenHours} Token Hours
      </button>
    </div>
  );
}

export default PurchaseForm;