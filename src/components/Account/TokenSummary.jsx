import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function TokenSummary() {
  const [cacheUsage, setCacheUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchCacheUsage();
  }, []);

  const fetchCacheUsage = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cache-usage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCacheUsage(response.data);
    } catch (error) {
      console.error('Error fetching cache usage:', error);
      setError('Failed to fetch available tokens. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading available Token Hours...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!cacheUsage) return null;

  return (
    <div className="mb-8 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold">Available Token Hours </h2>
      <small className="text-gray-600 mb-2">(in million tokens per hour)</small>
      <p>Base model: {cacheUsage.base_net_tokens.toFixed(2)}</p>
      <p>Pro model: {cacheUsage.pro_net_tokens.toFixed(2)}</p>
    </div>
  );
}

export default TokenSummary;