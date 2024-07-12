import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { PlusIcon, MinusIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function PaperLoader() {
  const [arxivId, setArxivId] = useState('');
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const [selectedReferences, setSelectedReferences] = useState({});
  const [additionalPapers, setAdditionalPapers] = useState([]);
  const [isLoadingPaper, setIsLoadingPaper] = useState(false);
  const [newPaperId, setNewPaperId] = useState('');
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [showArxivRefs, setShowArxivRefs] = useState(true);
  const [showNonArxivRefs, setShowNonArxivRefs] = useState(false);

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
      if (response.data) {
        setPaper(response.data);
        // Initialize all arXiv references as selected
        const initialSelectedRefs = {};
        response.data.references.forEach(ref => {
          if (ref.is_available_on_arxiv) {
            initialSelectedRefs[ref.arxiv_id] = true;
          }
        });
        setSelectedReferences(initialSelectedRefs);
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

  const handleReferenceToggle = (arxivId) => {
    setSelectedReferences(prev => ({
      ...prev,
      [arxivId]: !prev[arxivId]
    }));
  };

  const handleAddPaper = async (e) => {
    e.preventDefault();
    if (newPaperId && !additionalPapers.some(paper => paper.id === newPaperId)) {
      setIsLoadingPaper(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/papers/${newPaperId}/title`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAdditionalPapers([...additionalPapers, { id: newPaperId, title: response.data.title }]);
        setNewPaperId('');
      } catch (error) {
        console.error('Error fetching paper title:', error);
        setError('Failed to fetch paper title. Please check the arXiv ID and try again.');
      } finally {
        setIsLoadingPaper(false);
      }
    }
  };

  const handleRemoveAdditionalPaper = (paperId) => {
    setAdditionalPapers(additionalPapers.filter(paper => paper.id !== paperId));
  };

  const handlePdfUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedPdfs(prevPdfs => [...prevPdfs, ...files.map(file => ({ name: file.name, size: file.size }))]);
  };

  const handleRemovePdf = (index) => {
    setUploadedPdfs(prevPdfs => prevPdfs.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Paper Context Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Paper Loading Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Load Main Paper</h2>
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={arxivId}
                  onChange={(e) => setArxivId(e.target.value)}
                  placeholder="Enter arXiv ID"
                  className="flex-grow p-2 border rounded-l"
                />
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                  disabled={loading || !arxivId}
                >
                  {loading ? 'Loading...' : 'Load Paper'}
                </button>
              </div>
            </form>

            {/* PDF Upload and Add to Context Section */}
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-2">Upload PDFs / Add by arXiv ID</h3>
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="mb-2 lg:mb-0"
                />
                <form onSubmit={handleAddPaper} className="flex">
                  <input
                    type="text"
                    value={newPaperId}
                    onChange={(e) => setNewPaperId(e.target.value)}
                    placeholder="Enter arXiv ID"
                    className="flex-grow p-2 border rounded-l"
                  />
                  <button 
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
                    disabled={isLoadingPaper}
                  >
                    {isLoadingPaper ? 'Loading...' : <PlusIcon className="h-5 w-5" />}
                  </button>
                </form>
              </div>
              {uploadedPdfs.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {uploadedPdfs.map((pdf, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button
                        onClick={() => handleRemovePdf(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Main Paper Display */}
          {paper && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">Main Paper</h2>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-md font-medium mb-2">{paper.title}</h3>
                {paper.pdf_url && (
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <DocumentTextIcon className="h-6 w-6" />
                  </a>
                )}
              </div>
              {paper.authors && (
                <p className="mb-4">
                  <strong>Authors:</strong> {
                    Array.isArray(paper.authors) 
                      ? paper.authors.join(', ')
                      : paper.authors
                  }
                </p>
              )}
              {paper.abstract && (
                <details>
                  <summary className="text-lg font-medium cursor-pointer">Abstract</summary>
                  <p className="mt-2">{paper.abstract}</p>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Context Papers Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Context Papers 
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({Object.values(selectedReferences).filter(Boolean).length + additionalPapers.length + uploadedPdfs.length} papers)
              </span>
            </h2>
            
            {/* ArXiv References */}
            {paper && paper.references && (
              <div className="mb-6">
                <button
                  onClick={() => setShowArxivRefs(!showArxivRefs)}
                  className="flex items-center justify-between w-full text-left text-xl font-medium mb-2"
                >
                  <span>ArXiv References found</span>
                  {showArxivRefs ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </button>
                {showArxivRefs && (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Check or uncheck to include or exclude papers from the context.
                    </p>
                    <div className="max-h-60 overflow-y-auto pr-2">
                      <ul className="space-y-2">
                        {paper.references.filter(ref => ref.is_available_on_arxiv).map((ref, index) => (
                          <React.Fragment key={index}>
                            <li className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedReferences[ref.arxiv_id] || false}
                                onChange={() => handleReferenceToggle(ref.arxiv_id)}
                                className="mr-2"
                              />
                              <span className={selectedReferences[ref.arxiv_id] ? 'text-black' : 'text-gray-500'}>
                                {ref.text}
                              </span>
                            </li>
                            <hr className="my-2" />
                          </React.Fragment>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

           

            {additionalPapers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Papers added by user</h3>
                <ul className="space-y-2">
                  {additionalPapers.map((paper) => (
                    <React.Fragment key={paper.id}>
                      <li className="flex items-center justify-between">
                        <span>{paper.id} - {paper.title}</span>
                        <button
                          onClick={() => handleRemoveAdditionalPaper(paper.id)}
                          className="text-red-700 font-extrabold hover:text-red-900"
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      </li>
                      <hr className="my-2" />
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )}
             {/* Non-ArXiv References */}
             {paper && paper.references && (
              <div className="mb-6">
                <button
                  onClick={() => setShowNonArxivRefs(!showNonArxivRefs)}
                  className="flex items-center justify-between w-full text-left text-xl font-medium mb-2"
                >
                  <span>Non-ArXiv References (not in context) </span>
                  {showNonArxivRefs ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </button>
                {showNonArxivRefs && (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      These papers are not available on ArXiv. Consider adding them manually if needed.
                    </p>
                    <div className="max-h-60 overflow-y-auto pr-2">
                      <ul className="space-y-2">
                        {paper.references.filter(ref => !ref.is_available_on_arxiv).map((ref, index) => (
                          <React.Fragment key={index}>
                            <li className="text-gray-700">
                              {ref.text}
                            </li>
                            <hr className="my-2" />
                          </React.Fragment>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Uploaded PDFs */}
            {uploadedPdfs.length > 0 && (
              <div>
                <h3 className="text-xl font-medium mb-2">Uploaded PDFs</h3>
                <ul className="space-y-2">
                  {uploadedPdfs.map((pdf, index) => (
                    <React.Fragment key={index}>
                      <li className="flex items-center justify-between">
                        <span>{pdf.name}</span>
                        <button
                          onClick={() => handleRemovePdf(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      </li>
                      <hr className="my-2" />
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
export default PaperLoader;
