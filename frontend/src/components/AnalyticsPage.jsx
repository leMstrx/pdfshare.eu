import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function AnalyticsPage() {
  const { documentId } = useParams()
  const [documentInfo, setDocumentInfo] = useState(null)
  const [analyticsData, setAnalyticsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch document info
        const docResponse = await fetch(`http://localhost:5000/view/${documentId}`)
        const docData = await docResponse.json()
        
        if (!docResponse.ok) {
          throw new Error(docData.error || 'Failed to fetch document info')
        }
        
        setDocumentInfo(docData)
        
        // Fetch analytics data
        const analyticsResponse = await fetch(`http://localhost:5000/analytics/${documentId}`)
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json()
          setAnalyticsData(analyticsData)
        }
        
        // Create share URL
        const baseUrl = window.location.origin
        setShareUrl(`${baseUrl}/view/${documentId}`)
        
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [documentId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Share link copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  if (isLoading) {
    return <div className="loading">Loading analytics data...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  // Process analytics data for better display
  const viewerStats = {}
  analyticsData.forEach(view => {
    if (!viewerStats[view.viewer_name]) {
      viewerStats[view.viewer_name] = {
        name: view.viewer_name,
        totalDuration: 0,
        pageViews: {},
        firstView: new Date(view.timestamp),
        lastView: new Date(view.timestamp)
      }
    }
    
    const stats = viewerStats[view.viewer_name]
    stats.totalDuration += view.duration
    
    if (!stats.pageViews[view.page_number]) {
      stats.pageViews[view.page_number] = 0
    }
    stats.pageViews[view.page_number] += view.duration
    
    const viewTime = new Date(view.timestamp)
    if (viewTime < stats.firstView) stats.firstView = viewTime
    if (viewTime > stats.lastView) stats.lastView = viewTime
  })

  return (
    <div className="analytics-container">
      <h2>Analytics for {documentInfo.filename}</h2>
      
      <div className="share-section">
        <h3>Share Document</h3>
        <div className="share-url-container">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="share-url-input"
          />
          <button onClick={copyToClipboard}>Copy Link</button>
        </div>
        <p className="note">Share this link with people you want to view your document.</p>
      </div>
      
      <div className="analytics-section">
        <h3>Viewer Insights</h3>
        
        {Object.keys(viewerStats).length === 0 ? (
          <p>No one has viewed your document yet.</p>
        ) : (
          <div className="viewers-list">
            {Object.values(viewerStats).map(viewer => (
              <div key={viewer.name} className="viewer-card">
                <h4>{viewer.name}</h4>
                <p><strong>First viewed:</strong> {viewer.firstView.toLocaleString()}</p>
                <p><strong>Last activity:</strong> {viewer.lastView.toLocaleString()}</p>
                <p><strong>Total time spent:</strong> {Math.round(viewer.totalDuration / 60)} minutes</p>
                
                <h5>Page Activity</h5>
                <div className="page-activity">
                  {Object.entries(viewer.pageViews).map(([page, duration]) => (
                    <div key={page} className="page-stat">
                      <span>Page {page}:</span>
                      <span>{Math.round(duration)} seconds</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage