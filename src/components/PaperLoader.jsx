import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function PaperLoader() {
  const [arxivId, setArxivId] = useState('');
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      console.log(`Fetching paper with arXiv ID: ${arxivId}`);
      console.log(`API URL: ${import.meta.env.VITE_API_BASE_URL}/api/papers/${arxivId}`);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/papers/${arxivId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data) {
        setPaper(response.data);
      } else {
        setError('Received empty response from server');
      }
    } catch (error) {
      setError('Failed to load paper. Please check your input and try again.');
      console.error('Error loading paper:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl text-left mt-8 ml-8">
      <h1 className="text-xl font-bold mb-4">Type the arxiv ID of the paper</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4 max-w-sm">
          <input
            type="text"
            value={arxivId}
            onChange={(e) => setArxivId(e.target.value)}
            placeholder="Enter arXiv ID"
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || !arxivId}
        >
          {loading ? 'Loading...' : 'Load Paper'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {paper && (
        <div>
          <h2 className="text-xl font-bold">{paper.title}</h2>
          {paper.authors && (
            <p>
              <strong>Authors:</strong> {
                Array.isArray(paper.authors) 
                  ? paper.authors.join(', ')
                  : paper.authors // If it's not an array, just render it as is
              }
            </p>
          )}
          {paper.abstract && (
            <details>
              <summary><strong>Abstract:</strong></summary>
              <p>{paper.abstract}</p>
            </details>
          )}
          {paper.pdf_url && (
            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View PDF
            </a>
          )}
          {paper.references && paper.references.length > 0 && (
            <div>
              <h3 className="mt-4 font-bold">References:</h3>
              <div className="max-h-64 overflow-y-auto">
                <ul className="list-none pl-0">
                  {paper.references.map((ref, index) => (
                    <li key={index} className="flex items-start mb-2">
                      {ref.is_available_on_arxiv ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                      )}
                      <span>
                        {ref.text}
                        {ref.is_available_on_arxiv && (
                          <span className="ml-2 text-sm text-green-600">
                            (arXiv: {ref.arxiv_id})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaperLoader;
