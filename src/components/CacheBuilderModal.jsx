import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function CacheBuilderModal({ isOpen, onClose, arxivId, selectedReferences, additionalPapers, uploadedPdfs }) {
  const [isBuildingCache, setIsBuildingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('');
  const [error, setError] = useState(null);

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      handleBuildCache();
    }
  }, [isOpen]);

  const handleBuildCache = async () => {
    setIsBuildingCache(true);
    setCacheStatus('Preparing documents...');
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

      setCacheStatus('Uploading documents...');
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
            setCacheStatus(`Uploading documents: ${percentCompleted}%`);
          },
        }
      );

      setCacheStatus('Processing documents and building cache...');
      // Simulate progress for cache building (since we don't have real-time updates)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress <= 95) {
          setCacheStatus(`Processing documents and building cache: ${progress}%`);
        } else {
          clearInterval(interval);
        }
      }, 1000);

      // Start a new chat session
      setCacheStatus('Starting chat session...');
      const chatSessionResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/start`,
        { cached_content_name: response.data.cached_content_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearInterval(interval);
      setCacheStatus('Cache built successfully! Redirecting to chat...');

      // Navigate to the chat page
      navigate(`/chat/${chatSessionResponse.data.session_id}`);
    } catch (error) {
      console.error('Error building cache:', error);
      setError('Failed to build cache. Please try again.');
      setCacheStatus('');
    } finally {
      setIsBuildingCache(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Building Cache</h3>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {cacheStatus}
            </p>
            {isBuildingCache && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-full animate-pulse"></div>
                </div>
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