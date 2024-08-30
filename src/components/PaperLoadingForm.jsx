import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

function PaperLoadingForm({
  arxivId,
  setArxivId,
  loading,
  handleSubmit,
  handlePdfUpload,
  handleAddPaper,
  isLoadingPaper,
}) {
  const [newPaperId, setNewPaperId] = useState('')

  const onAddPaper = (e) => {
    e.preventDefault()
    if (newPaperId.trim()) {
      handleAddPaper(newPaperId.trim(), arxivId)
      setNewPaperId('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium mb-2 retro-font">
          Add Main Paper References
        </h3>
        <div className="flex">
          <input
            type="text"
            id="arxivId"
            value={arxivId}
            placeholder="Enter arXiv ID"
            onChange={(e) => setArxivId(e.target.value)}
            className="flex-grow border-2 border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:border-gray-500 bg-white shadow-inner retro-font retro-text text-xs"
          />
          <button
            type="submit"
            disabled={loading || isLoadingPaper}
            className="bg-gray-200 text-black font-bold py-1 px-3 rounded-r border-2 border-l-0 border-gray-300 hover:bg-gray-300 retro-font text-xs"
          >
            {isLoadingPaper ? 'Loading...' : 'Load Refs.'}
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-2 retro-font">
          Add additional papers to context
        </h3>
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => handlePdfUpload(Array.from(e.target.files))}
            className="w-full retro-font text-xs"
          />
          <div className="flex w-full">
            <input
              type="text"
              value={newPaperId}
              onChange={(e) => setNewPaperId(e.target.value)}
              placeholder="Enter arXiv ID"
              className="flex-grow border-2 border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:border-gray-500 bg-white shadow-inner retro-text text-xs"
            />
            <button
              type="button"
              onClick={onAddPaper}
              className="bg-gray-200 text-black px-3 py-1 rounded-r border-2 border-l-0 border-gray-300 hover:bg-gray-300 retro-font text-xs"
              disabled={isLoadingPaper}
            >
              {isLoadingPaper ? '...' : <PlusIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PaperLoadingForm
