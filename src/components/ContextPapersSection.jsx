// src/components/ContextPapersSection.jsx
import React, { useState } from 'react';
import ArxivReferences from './ArxivReferences';
import NonArxivReferences from './NonArxivReferences';
import AdditionalPapers from './AdditionalPapers';
import UploadedPDFs from './UploadedPDFs';

function ContextPapersSection({
  paper,
  selectedReferences,
  additionalPapers,
  uploadedPdfs,
  handleReferenceToggle,
  handleRemoveAdditionalPaper,
  handleRemovePdf,
  setIsModalOpen
}) {
  const [showArxivRefs, setShowArxivRefs] = useState(true);
  const [showNonArxivRefs, setShowNonArxivRefs] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Context Papers 
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({Object.values(selectedReferences).filter(Boolean).length + additionalPapers.length + uploadedPdfs.length} papers)
        </span>
      </h2>
      
      <ArxivReferences
        paper={paper}
        selectedReferences={selectedReferences}
        handleReferenceToggle={handleReferenceToggle}
        showArxivRefs={showArxivRefs}
        setShowArxivRefs={setShowArxivRefs}
      />

      <NonArxivReferences
        paper={paper}
        showNonArxivRefs={showNonArxivRefs}
        setShowNonArxivRefs={setShowNonArxivRefs}
      />

      <AdditionalPapers
        additionalPapers={additionalPapers}
        handleRemoveAdditionalPaper={handleRemoveAdditionalPaper}
      />

      <UploadedPDFs
        uploadedPdfs={uploadedPdfs}
        handleRemovePdf={handleRemovePdf}
      />

      <div className="mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!paper && additionalPapers.length === 0 && uploadedPdfs.length === 0}
        >
          Build Cache and Start Chat
        </button>
      </div>
    </div>
  );
}

export default ContextPapersSection;