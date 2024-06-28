import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function PaperLoader() {
  const [arxivId, setArxivId] = useState('');
  const [file, setFile] = useState(null);
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
      let response;
      if (arxivId) {
        console.log(`Fetching paper with arXiv ID: ${arxivId}`);
        console.log(`API URL: ${import.meta.env.VITE_API_BASE_URL}/api/papers/${arxivId}`);
        response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/papers/${arxivId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
      } 
      // else if (file) {
      //   const formData = new FormData();
      //   formData.append('file', file);
      //   response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/papers/upload`, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       Authorization: `Bearer ${token}`
      //     }
      //   });
      // } 
      else {
        throw new Error('Please provide either an arXiv ID');
      }
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

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile && selectedFile.type === 'application/pdf') {
  //     setFile(selectedFile);
  //     setArxivId(''); // Clear arXiv ID when a file is selected
  //   } else {
  //     setError('Please select a valid PDF file');
  //   }
  // };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Paper Loader</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={arxivId}
            onChange={(e) => {
              setArxivId(e.target.value);
              setFile(null); // Clear file when arXiv ID is entered
            }}
            placeholder="Enter arXiv ID"
            className="w-full p-2 border rounded"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block mb-2">Or upload a PDF file:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div> */}
        <button 
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || (!arxivId && !file)}
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
              <strong>Authors:</strong> {paper.authors.join(', ')}
            </p>
          )}
          {paper.abstract && (
            <p>
              <strong>Abstract:</strong> {paper.abstract}
            </p>
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
              <ol className="list-decimal pl-5">
                {paper.references.map((ref, index) => (
                  <li key={index}>{ref}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaperLoader;

