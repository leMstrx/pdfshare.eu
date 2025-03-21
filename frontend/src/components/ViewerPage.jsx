import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'

// Set workerSrc for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function ViewerPage() {
  const { documentId } = useParams()
  const [documentInfo, setDocumentInfo] = useState(null)
  const [viewerName, setViewerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageStart, setPageStart] = useState(null)
  const [isTracking, setIsTracking] = useState(false)

  // Fetch document info
  useEffect(() => {
    async function fetchDocumentInfo() {
      try {
        const response = await fetch(`http://localhost:5000/view/${documentId}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch document')
        }
        
        setDocumentInfo(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDocumentInfo()
  }, [documentId])

  // Track page viewing time
  useEffect(() => {
    if (!isRegistered || !pageStart) return
    
    // Track when component unmounts or page changes
    return () => {
      const duration = Math.round((new Date() - pageStart) / 1000) // duration in seconds
      
      if (duration > 1 && !isTracking) { // Only track if user spent more than 1 second on the page
        setIsTracking(true)
        
        fetch('http://localhost:5000/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_id: documentId,
            viewer_name: viewerName,
            page_number: pageNumber,
            duration: duration,
          }),
        })
          .finally(() => {
            setIsTracking(false)
          })
      }
    }
  }, [documentId, pageNumber, pageStart, viewerName, isRegistered, isTracking])

  // Set page start time when page changes
  useEffect(() => {
    if (isRegistered) {
      setPageStart(new Date())
    }
  }, [pageNumber, isRegistered])

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (viewerName.trim()) {
      setIsRegistered(true)
      setPageStart(new Date()) // Start tracking first page
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const changePage = (offset) => {
    setPageNumber(prevPage => {
      const newPage = prevPage + offset
      return Math.min(Math.max(1, newPage), numPages || 1)
    })
  }

  if (isLoading) {
    return <div className="loading">Loading document information...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!isRegistered) {
    return (
      <div className="viewer-registration">
        <h2>View Document: {documentInfo.filename}</h2>
        <p>Enter your name to view this document:</p>
        
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={viewerName}
            onChange={(e) => setViewerName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <button type="submit">View Document</button>
        </form>
      </div>
    )
  }

  return (
    <div className="pdf-viewer">
      <h2>Viewing: {documentInfo.filename}</h2>
      
      <div className="document-container">
        <Document
          file={`http://localhost:5000/view/${documentId}/pdf`}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div>Loading PDF...</div>}
          error={<div>Failed to load PDF</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      
      <div className="controls">
        <button 
          onClick={() => changePage(-1)} 
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        
        <span>
          Page {pageNumber} of {numPages}
        </span>
        
        <button 
          onClick={() => changePage(1)} 
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ViewerPage