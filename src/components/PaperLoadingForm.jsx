import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

function PaperLoadingForm({ arxivId, setArxivId, loading, handleSubmit, handlePdfUpload, handleAddPaper, isLoadingPaper }) {
  const [newPaperId, setNewPaperId] = useState('');

  return (
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
            className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
            disabled={isLoadingPaper}
          >
            {isLoadingPaper ? 'Loading...' : <PlusIcon className="h-5 w-5" />}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-medium mb-2">Upload PDFs / Add by arXiv ID</h3>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => handlePdfUpload(Array.from(e.target.files))}
            className="mb-2 lg:mb-0"
          />
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddPaper(newPaperId);
            setNewPaperId('');
          }} className="flex">
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
      </div>
    </div>
  );
}

export default PaperLoadingForm;