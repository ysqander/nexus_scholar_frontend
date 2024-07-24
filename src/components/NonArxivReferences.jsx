import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function NonArxivReferences({ paper, showNonArxivRefs, setShowNonArxivRefs }) {
  if (!paper || !paper.references) return null;

  const nonArxivRefs = paper.references.filter(ref => !ref.is_available_on_arxiv);

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowNonArxivRefs(!showNonArxivRefs)}
        className="flex items-center justify-between w-full text-left text-xl font-medium mb-2"
      >
        <span>Non-ArXiv References found</span>
        {showNonArxivRefs ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>
      {showNonArxivRefs && (
        <div className="max-h-60 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {nonArxivRefs.map((ref, index) => (
              <React.Fragment key={index}>
                <li className="text-gray-500">{ref.text}</li>
                <hr className="my-2" />
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NonArxivReferences;