import React, { useState } from 'react'
import CacheBuilderModal from './CacheBuilderModal'
import PaperLoadingForm from './PaperLoadingForm'
import MainPaperDisplay from './MainPaperDisplay'
import ContextPapersSection from './ContextPapersSection'
import usePaperLoader from '../hooks/usePaperLoader'

function PaperLoader() {
  const {
    arxivId,
    setArxivId,
    paper,
    loading,
    error,
    selectedReferences,
    additionalPapers,
    uploadedPdfs,
    isModalOpen,
    isLoadingPaper,
    handleSubmit,
    handleReferenceToggle,
    handleAddPaper,
    handleRemoveAdditionalPaper,
    handlePdfUpload,
    handleRemovePdf,
    setIsModalOpen,
  } = usePaperLoader()

  const [priceTier, setPriceTier] = useState('base')

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="bg-mac-muted-green p-4 rounded-lg shadow-md border-2 border-gray-300">
          <PaperLoadingForm
            arxivId={arxivId}
            setArxivId={setArxivId}
            loading={loading}
            isLoadingPaper={isLoadingPaper}
            handleSubmit={handleSubmit}
            handlePdfUpload={handlePdfUpload}
            handleAddPaper={handleAddPaper}
          />
          <MainPaperDisplay paper={paper} />
        </div>

        {/* Right Column */}
        <div className="bg-mac-muted-green p-4 rounded-lg shadow-md border-gray-300">
          <ContextPapersSection
            paper={paper}
            selectedReferences={selectedReferences}
            additionalPapers={additionalPapers}
            uploadedPdfs={uploadedPdfs}
            handleReferenceToggle={handleReferenceToggle}
            handleRemoveAdditionalPaper={handleRemoveAdditionalPaper}
            handleRemovePdf={handleRemovePdf}
            setIsModalOpen={setIsModalOpen}
            priceTier={priceTier}
            setPriceTier={setPriceTier}
          />
        </div>
      </div>

      <CacheBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mainPaper={paper ? { id: arxivId, title: paper.title } : null}
        selectedReferences={selectedReferences}
        additionalPapers={additionalPapers}
        uploadedPdfs={uploadedPdfs}
        priceTier={priceTier}
      />

      {error && <p className="mt-4 text-red-500 retro-font">{error}</p>}
    </div>
  )
}

export default PaperLoader
