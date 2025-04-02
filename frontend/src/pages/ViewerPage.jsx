import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ViewerPage.css';

function ViewerPage() {
  const { documentId } = useParams();
  const [viewerName, setViewerName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  
  // Mock document data (will be fetched from Supabase later)
  const mockDocument = {
    id: documentId,
    filename: 'Sample Document.pdf',
    totalPages: 5,
    // This is a base64 PDF for demonstration only
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  };
  
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (viewerName.trim()) {
      setIsRegistered(true);
    }
  };
  
  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };
  
  const goToNextPage = () => {
    if (pageNumber < mockDocument.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };
  
  if (!isRegistered) {
    return (
      <div className="viewer-page">
        <div className="viewer-registration card">
          <h2>View Document: {mockDocument.filename}</h2>
          <p className="viewer-instruction">
            Enter your name to view this document:
          </p>
          
          <form onSubmit={handleNameSubmit} className="viewer-form">
            <input
              type="text"
              value={viewerName}
              onChange={(e) => setViewerName(e.target.value)}
              placeholder="Your Name"
              required
              className="input"
            />
            <button type="submit" className="btn btn-primary">
              View Document
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="viewer-page">
      <div className="viewer-container">
        <h2>Viewing: {mockDocument.filename}</h2>
        
        <div className="viewer-controls">
          <div className="page-navigation">
            <button 
              onClick={goToPreviousPage} 
              disabled={pageNumber <= 1}
              className="nav-button"
            >
              &lt; Previous
            </button>
            
            <span className="page-display">
              Page {pageNumber} of {mockDocument.totalPages}
            </span>
            
            <button 
              onClick={goToNextPage} 
              disabled={pageNumber >= mockDocument.totalPages}
              className="nav-button"
            >
              Next &gt;
            </button>
          </div>
        </div>
        
        <div className="pdf-container">
          {/* For the placeholder UI, just use an iframe to display the PDF */}
          <iframe 
            src={mockDocument.pdfUrl} 
            title={mockDocument.filename}
            className="pdf-iframe"
          />
        </div>
        
        <div className="viewer-info">
          <p>Viewing as: <strong>{viewerName}</strong></p>
        </div>
      </div>
    </div>
  );
}

export default ViewerPage;