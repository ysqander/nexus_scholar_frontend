// src/components/MainPaperDisplay.jsx
import React from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

function MainPaperDisplay({ paper }) {
  if (!paper) return null

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg border-2 border-gray-400 shadow-inner">
      <h2 className="text- font-bold mb-2 retro-font">Main Paper</h2>
      <div className="bg-white p-4 rounded border border-gray-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-medium retro-font">{paper.title}</h3>
          {paper.pdf_url && (
            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <DocumentTextIcon className="h-6 w-6" />
            </a>
          )}
        </div>
        {paper.authors && (
          <p className="mb-4 text-xs">
            <span className="font-semibold retro-font">Authors:</span>{' '}
            {Array.isArray(paper.authors)
              ? paper.authors.join(', ')
              : paper.authors}
          </p>
        )}
        {paper.abstract && (
          <details className="mt-4">
            <summary className="text-xs font-medium cursor-pointer retro-font">
              Abstract
            </summary>
            <p className="mt-2 retro-text-light text-sm bg-gray-50 p-3 rounded border border-gray-200">
              {paper.abstract}
            </p>
          </details>
        )}
      </div>
    </div>
  )
}

export default MainPaperDisplay
