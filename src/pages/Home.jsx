import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Nexus Scholar</h1>
      <p className="mb-4">Explore and analyze Arxiv research papers with ease.</p>
      {!isAuthenticated && (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </button>
      )}
    </div>
  );
}

export default Home;
