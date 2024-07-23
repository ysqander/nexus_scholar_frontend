import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function CacheBuilderModal({ isOpen, onClose, mainPaper, selectedReferences, additionalPapers, uploadedPdfs }) {
  const [isBuildingCache, setIsBuildingCache] = useState(false);
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
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const selectedArxivIds = Object.keys(selectedReferences).filter(id => selectedReferences[id]);
      const additionalArxivIds = additionalPapers.map(paper => paper.id);
      const allArxivIds = mainPaper ? [mainPaper.id, ...selectedArxivIds, ...additionalArxivIds] : [...selectedArxivIds, ...additionalArxivIds];

      const formData = new FormData();
      formData.append('arxiv_ids', JSON.stringify(allArxivIds));

      uploadedPdfs.forEach((pdf, index) => {
        formData.append('pdfs', pdf, pdf.name); 
      });

     
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-cache`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      // Navigate to the chat page
      navigate(`/chat/${chatSessionResponse.data.session_id}`);
    } catch (error) {
      console.error('Error building cache:', error);
      setError('Failed to build cache. Please try again.');
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
            {isBuildingCache ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-sm text-gray-500">Building your paper context...</p>
                <p className="mt-2 text-xs text-gray-400">This may take a few moments</p>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-sm text-gray-500">Ready to build your cache</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CacheBuilderModal;