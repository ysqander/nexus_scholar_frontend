import React from 'react';
import CacheBuilderModal from './CacheBuilderModal';
import PaperLoadingForm from './PaperLoadingForm';
import MainPaperDisplay from './MainPaperDisplay';
import ContextPapersSection from './ContextPapersSection';
import usePaperLoader from '../hooks/usePaperLoader';

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
  } = usePaperLoader();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Paper Context Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
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
        <ContextPapersSection
          paper={paper}
          selectedReferences={selectedReferences}
          additionalPapers={additionalPapers}
          uploadedPdfs={uploadedPdfs}
          handleReferenceToggle={handleReferenceToggle}
          handleRemoveAdditionalPaper={handleRemoveAdditionalPaper}
          handleRemovePdf={handleRemovePdf}
          setIsModalOpen={setIsModalOpen}
        />
      </div>

      <CacheBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mainPaper={paper ? { id: arxivId, title: paper.title } : null}
        selectedReferences={selectedReferences}
        additionalPapers={additionalPapers}
        uploadedPdfs={uploadedPdfs}
      />

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default PaperLoader;
