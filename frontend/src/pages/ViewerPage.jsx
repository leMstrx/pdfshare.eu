import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../styles/ViewerPage.css';

// Set the worker source to use the CDN-hosted worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

function ViewerPage() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the local PDF file
  const pdfUrl = '/pdfs/test.pdf';
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };
  
  const onDocumentLoadError = (err) => {
    console.error('Error loading PDF:', err);
    setError(`Failed to load the document: ${err.message}`);
    setIsLoading(false);
  };
  
  function goToPrevPage() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }
  
  function goToNextPage() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }
  
  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
  }
  
  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
  }
  
  return (
    <div className="viewer-page">
      <div className="viewer-container">
        <h2>PDF Viewer</h2>
        
        <div className="viewer-controls">
          <div className="page-navigation">
            <button 
              onClick={goToPrevPage} 
              disabled={pageNumber <= 1}
              className="nav-button"
            >
              &lt; Previous
            </button>
            
            <p className="page-display">
              Page {pageNumber} of {numPages || '...'}
            </p>
            
            <button 
              onClick={goToNextPage} 
              disabled={pageNumber >= numPages}
              className="nav-button"
            >
              Next &gt;
            </button>
          </div>
          
          <div className="zoom-controls">
            <button 
              onClick={zoomOut} 
              className="zoom-button"
              disabled={scale <= 0.6}
            >
              -
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button 
              onClick={zoomIn} 
              className="zoom-button"
              disabled={scale >= 2.0}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="pdf-container">
          {error ? (
            <div className="pdf-error">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="pdf-loading">Loading document...</div>
              )}
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
                className="pdf-document"
                options={{
                  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                  cMapPacked: true,
                  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/'
                }}
              >
                <Page 
                  pageNumber={pageNumber}
                  scale={scale}
                  className="pdf-page"
                  loading={<div className="pdf-loading">Loading page...</div>}
                  error={<div>Error loading page {pageNumber}</div>}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </Document>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewerPage;