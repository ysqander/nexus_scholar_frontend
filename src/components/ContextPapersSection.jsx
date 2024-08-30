// src/components/ContextPapersSection.jsx
import React, { useState } from 'react'
import ArxivReferences from './ArxivReferences'
import NonArxivReferences from './NonArxivReferences'
import AdditionalPapers from './AdditionalPapers'
import UploadedPDFs from './UploadedPDFs'

function ContextPapersSection({
  paper,
  selectedReferences,
  additionalPapers,
  uploadedPdfs,
  handleReferenceToggle,
  handleRemoveAdditionalPaper,
  handleRemovePdf,
  setIsModalOpen,
  priceTier,
  setPriceTier,
}) {
  const [showArxivRefs, setShowArxivRefs] = useState(true)
  const [showNonArxivRefs, setShowNonArxivRefs] = useState(false)

  const hasReferences =
    paper || additionalPapers.length > 0 || uploadedPdfs.length > 0

  return (
    // <div className="bg-mac-platinum p-4 rounded-lg shadow-inner">
    <>
      <h2 className="text-lg font-bold mb-2 retro-font">
        Context Papers
        <span className="ml-2 text-xs font-normal text-gray-500 retro-text-light">
          (
          {Object.values(selectedReferences).filter(Boolean).length +
            additionalPapers.length +
            uploadedPdfs.length}{' '}
          papers)
        </span>
      </h2>

      {hasReferences ? (
        <>
          <div className="bg-white p-4 rounded border border-gray-400 mb-4">
            {paper && (
              <ArxivReferences
                paper={paper}
                selectedReferences={selectedReferences}
                handleReferenceToggle={handleReferenceToggle}
                showArxivRefs={showArxivRefs}
                setShowArxivRefs={setShowArxivRefs}
              />
            )}

            {paper && (
              <NonArxivReferences
                paper={paper}
                showNonArxivRefs={showNonArxivRefs}
                setShowNonArxivRefs={setShowNonArxivRefs}
              />
            )}

            {additionalPapers.length > 0 && (
              <AdditionalPapers
                additionalPapers={additionalPapers}
                handleRemoveAdditionalPaper={handleRemoveAdditionalPaper}
              />
            )}

            {uploadedPdfs.length > 0 && (
              <UploadedPDFs
                uploadedPdfs={uploadedPdfs}
                handleRemovePdf={handleRemovePdf}
              />
            )}
          </div>

          <div className="bg-white p-4 rounded border border-gray-400">
            <div className="mb-2">
              <p className="text-xs text-gray-700 mb-1 retro-font">
                Select a model type:
              </p>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="priceTier"
                    value="base"
                    checked={priceTier === 'base'}
                    onChange={() => setPriceTier('base')}
                  />
                  <span className="ml-2 text-xs retro-font">Base</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="priceTier"
                    value="pro"
                    checked={priceTier === 'pro'}
                    onChange={() => setPriceTier('pro')}
                  />
                  <span className="ml-2 text-xs retro-font">Pro</span>
                </label>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white font-bold py-1 px-3 rounded border-2 border-gray-700 hover:bg-gray-800 retro-font text-xs"
            >
              Build Cache and Start Chat
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-700 retro-text-light font-semibold text-xs">
          Load the references of a paper first on the left side
        </p>
      )}
    </>
    // </div>
  )
}

export default ContextPapersSection
