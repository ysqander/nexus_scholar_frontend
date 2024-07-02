import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import PaperLoader from '../components/PaperLoader';

function Dashboard() {
  const { getAccessTokenSilently, user, isLoading, isAuthenticated } = useAuth0();
  const [message, setMessage] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProtectedMessage = async () => {
      if (!isAuthenticated) return;
      
      setIsApiLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/private`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching protected message:', error);
        setError('Failed to fetch protected message. Please try again later.');
      } finally {
        setIsApiLoading(false);
      }
    };

    fetchProtectedMessage();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <>
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {user && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
        </div>
      )}
      {/* {isApiLoading && <p>Loading protected message...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>Protected Message: {message}</p>} */}
    </div>
    <PaperLoader />
    </>
  );
}

export default Dashboard;