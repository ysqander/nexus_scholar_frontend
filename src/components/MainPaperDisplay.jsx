// src/components/MainPaperDisplay.jsx
import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

function MainPaperDisplay({ paper }) {
  if (!paper) return null;

  return (
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
  );
}

export default MainPaperDisplay;