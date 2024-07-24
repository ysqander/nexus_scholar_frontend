import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function AdditionalPapers({ additionalPapers, handleRemoveAdditionalPaper }) {
  if (additionalPapers.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">Additional Papers</h3>
      <ul className="space-y-2">
        {additionalPapers.map((paper, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>{paper.title}</span>
            <button
              onClick={() => handleRemoveAdditionalPaper(paper.id)}
              className="text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdditionalPapers;