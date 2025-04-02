import { useParams } from 'react-router-dom';
import '../styles/AnalyticsPage.css';

function AnalyticsPage() {
  const { documentId } = useParams();
  
  // Mock data - will be replaced with real data from Supabase
  const mockDocument = {
    id: documentId,
    filename: 'Annual Report 2023.pdf',
    uploadDate: '2023-07-15T09:30:00Z',
    totalViews: 28,
    uniqueViewers: 12,
    totalPages: 8,
    averageViewTime: 145, // seconds
  };
  
  const mockViewersData = [
    { name: 'John Smith', pageViews: 8, totalTime: '12m 30s', lastView: '2023-08-10T14:30:00Z' },
    { name: 'Sarah Johnson', pageViews: 3, totalTime: '5m 15s', lastView: '2023-08-09T11:45:00Z' },
    { name: 'Michael Brown', pageViews: 12, totalTime: '18m 20s', lastView: '2023-08-08T16:20:00Z' },
    { name: 'Emily Davis', pageViews: 5, totalTime: '7m 40s', lastView: '2023-08-07T09:15:00Z' },
    { name: 'David Wilson', pageViews: 2, totalTime: '3m 10s', lastView: '2023-08-06T13:50:00Z' }
  ];
  
  const mockPageData = [
    { pageNumber: 1, views: 28, avgTime: '1m 45s' },
    { pageNumber: 2, views: 24, avgTime: '2m 10s' },
    { pageNumber: 3, views: 20, avgTime: '2m 30s' },
    { pageNumber: 4, views: 18, avgTime: '1m 55s' },
    { pageNumber: 5, views: 15, avgTime: '1m 20s' },
    { pageNumber: 6, views: 12, avgTime: '1m 05s' },
    { pageNumber: 7, views: 10, avgTime: '0m 45s' },
    { pageNumber: 8, views: 8, avgTime: '0m 30s' }
  ];
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Document Analytics</h1>
        <h2>{mockDocument.filename}</h2>
        <p className="document-upload-date">
          Uploaded on {formatDate(mockDocument.uploadDate)}
        </p>
      </div>
      
      <div className="analytics-overview">
        <div className="analytics-stat-card">
          <div className="analytics-stat-value">{mockDocument.totalViews}</div>
          <div className="analytics-stat-label">Total Views</div>
        </div>
        
        <div className="analytics-stat-card">
          <div className="analytics-stat-value">{mockDocument.uniqueViewers}</div>
          <div className="analytics-stat-label">Unique Viewers</div>
        </div>
        
        <div className="analytics-stat-card">
          <div className="analytics-stat-value">{mockDocument.totalPages}</div>
          <div className="analytics-stat-label">Total Pages</div>
        </div>
        
        <div className="analytics-stat-card">
          <div className="analytics-stat-value">
            {Math.floor(mockDocument.averageViewTime / 60)}m {mockDocument.averageViewTime % 60}s
          </div>
          <div className="analytics-stat-label">Avg. View Time</div>
        </div>
      </div>
      
      <div className="analytics-detailed-section">
        <div className="analytics-section page-analytics">
          <h3>Page Analytics</h3>
          <div className="analytics-table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {mockPageData.map(page => (
                  <tr key={page.pageNumber}>
                    <td>Page {page.pageNumber}</td>
                    <td>{page.views}</td>
                    <td>{page.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="analytics-section viewer-analytics">
          <h3>Viewer Analytics</h3>
          <div className="analytics-table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Viewer</th>
                  <th>Pages Viewed</th>
                  <th>Total Time</th>
                  <th>Last View</th>
                </tr>
              </thead>
              <tbody>
                {mockViewersData.map((viewer, index) => (
                  <tr key={index}>
                    <td>{viewer.name}</td>
                    <td>{viewer.pageViews}</td>
                    <td>{viewer.totalTime}</td>
                    <td>{formatDate(viewer.lastView)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;