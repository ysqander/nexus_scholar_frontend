import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

function UploadedPDFs({ uploadedPdfs, handleRemovePdf }) {
  if (uploadedPdfs.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">Uploaded PDFs</h3>
      <ul className="space-y-2">
        {uploadedPdfs.map((pdf, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>{pdf.name}</span>
            <button
              onClick={() => handleRemovePdf(index)}
              className="text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UploadedPDFs
