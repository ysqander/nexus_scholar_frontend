import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to NexusScholar</h1>
      <p className="text-xl mb-6">Explore and analyze research papers with ease.</p>
      <div className="space-x-4">
        <Link to="/papers" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Browse Papers
        </Link>
        <Link to="/analysis" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Start Analysis
        </Link>
      </div>
    </div>
  );
}

export default Home;
