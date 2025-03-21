import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function ViewerPage() {
  const { documentId } = useParams()
  const [documentInfo, setDocumentInfo] = useState(null)
  const [viewerName, setViewerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageStart, setPageStart] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)

  // Fetch document info
  useEffect(() => {
    async function fetchDocumentInfo() {
      try {
        // Get document information from Supabase
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single()
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch document')
        }
        
        if (!data) {
          throw new Error('Document not found')
        }
        
        setDocumentInfo(data)
        
        // Get public URL for the PDF
        const { data: publicUrlData } = supabase
          .storage
          .from('pdf')
          .getPublicUrl(data.storage_path)
        
        if (publicUrlData?.publicUrl) {
          setPdfUrl(publicUrlData.publicUrl)
        } else {
          throw new Error('Failed to get public PDF URL')
        }
      } catch (err) {
        console.error('Error in fetchDocumentInfo:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDocumentInfo()
  }, [documentId])

  // Track page viewing time
  useEffect(() => {
    if (!isRegistered || !pageStart || !documentId) return
    return () => {
      const duration = Math.round((new Date() - pageStart) / 1000)
      if (duration > 1 && !isTracking) {
        setIsTracking(true)
        supabase
          .from('views')
          .insert([
            {
              document_id: documentId,
              viewer_name: viewerName,
              page_number: pageNumber,
              duration: duration
            }
          ])
          .then(() => setIsTracking(false))
          .catch((error) => {
            console.error('Error tracking view:', error)
            setIsTracking(false)
          })
      }
    }
  }, [documentId, pageNumber, pageStart, viewerName, isRegistered, isTracking])

  useEffect(() => {
    if (isRegistered) setPageStart(new Date())
  }, [pageNumber, isRegistered])

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (viewerName.trim()) {
      setIsRegistered(true)
      setPageStart(new Date())
    }
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

  // Display PDF in an iframe
  return (
    <div className="pdf-viewer">
      <h2>Viewing: {documentInfo.filename}</h2>
      <div className="document-container" style={{ height: '80vh' }}>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title={documentInfo.filename}
          />
        )}
      </div>
      <div className="controls">
        <p>Viewing as: {viewerName}</p>
      </div>
    </div>
  )
}

export default ViewerPage