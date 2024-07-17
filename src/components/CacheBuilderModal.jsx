import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function CacheBuilderModal({ isOpen, onClose, arxivId, selectedReferences, additionalPapers, uploadedPdfs }) {
  const [isBuildingCache, setIsBuildingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('');
  const [cachedContentName, setCachedContentName] = useState('');
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleBuildCache = async () => {
    setIsBuildingCache(true);
    setCacheStatus('Starting cache build...');
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const selectedArxivIds = Object.keys(selectedReferences).filter(id => selectedReferences[id]);
      const additionalArxivIds = additionalPapers.map(paper => paper.id);
      const allArxivIds = [arxivId, ...selectedArxivIds, ...additionalArxivIds];

      const formData = new FormData();
      formData.append('arxiv_ids', JSON.stringify(allArxivIds));

      uploadedPdfs.forEach((pdf, index) => {
        formData.append(`pdf_${index}`, pdf);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-cache`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setCacheStatus(`Uploading files: ${percentCompleted}%`);
          },
        }
      );

      setCachedContentName(response.data.cached_content_name);
      setCacheStatus('Cache built successfully!');

      // Start a new chat session
      const chatSessionResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/start`,
        { cached_content_name: response.data.cached_content_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessionId(chatSessionResponse.data.session_id);
    } catch (error) {
      console.error('Error building cache:', error);
      setError('Failed to build cache. Please try again.');
      setCacheStatus('');
    } finally {
      setIsBuildingCache(false);
    }
  };

  const handleStartChat = () => {
    if (sessionId) {
      navigate(`/chat/${sessionId}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Build Cache</h3>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Build a cache with the selected papers and uploaded PDFs to start a chat session.
            </p>
            {!isBuildingCache && !cachedContentName && (
              <button
                onClick={handleBuildCache}
                className="mt-4 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Build Cache
              </button>
            )}
            {isBuildingCache && (
              <div className="mt-4">
                <p className="font-semibold">{cacheStatus}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            )}
            {sessionId && (
              <div className="mt-4">
                <p className="font-semibold">Cache built successfully!</p>
                <button
                  onClick={handleStartChat}
                  className="mt-4 bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Start Chat Session
                </button>
              </div>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CacheBuilderModal;