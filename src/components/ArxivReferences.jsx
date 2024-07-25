import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function ArxivReferences({ paper, selectedReferences, handleReferenceToggle, showArxivRefs, setShowArxivRefs }) {
  if (!paper || !paper.references) return null;

  const arxivRefs = paper.references.filter(ref => ref.is_available_on_arxiv);

  return (
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
              {arxivRefs.map((ref, index) => {
                return (
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
              );
            })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ArxivReferences;