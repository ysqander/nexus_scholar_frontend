import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function StripeSuccess() {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId) {
      verifyPurchase(sessionId);
    }
  }, [location]);

  const verifyPurchase = async (sessionId) => {
    try {
      const response = await axios.get(`/api/verify-purchase?session_id=${sessionId}`);
      if (response.data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error verifying purchase:', error);
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return <div>Verifying your purchase...</div>;
  }

  if (status === 'error') {
    return <div>There was an error verifying your purchase. Please contact support.</div>;
  }

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Your token hours have been added to your account.</p>
    </div>
  );
}

export default StripeSuccess;