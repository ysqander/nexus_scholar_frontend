import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TokenSummary() {
  const [cacheUsage, setCacheUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCacheUsage();
  }, []);

  const fetchCacheUsage = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/cache-usage');
      setCacheUsage(response.data);
    } catch (error) {
      console.error('Error fetching cache usage:', error);
      setError('Failed to fetch available tokens. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading available tokens...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!cacheUsage) return null;

  return (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Available Tokens</h2>
      <p>Base Tokens: {cacheUsage.base_net_tokens}</p>
      <p>Pro Tokens: {cacheUsage.pro_net_tokens}</p>
    </div>
  );
}

export default TokenSummary;