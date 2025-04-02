import { Link } from 'react-router-dom';
import '../styles/DashboardPage.css';

function DashboardPage() {
  // This is a placeholder dashboard for now
  // We'll implement actual data fetching when we integrate with Supabase
  
  const mockDocuments = [
    {
      id: '1',
      filename: 'Business Proposal.pdf',
      uploadDate: '2023-05-15T10:30:00Z',
      expiryDate: '2024-05-15T10:30:00Z',
      public: true,
      views: 24
    },
    {
      id: '2',
      filename: 'Project Timeline.pdf',
      uploadDate: '2023-06-22T14:45:00Z',
      expiryDate: '2023-12-22T14:45:00Z',
      public: true,
      views: 12
    },
    {
      id: '3',
      filename: 'Annual Report 2022.pdf',
      uploadDate: '2023-07-10T09:15:00Z',
      expiryDate: '2024-07-10T09:15:00Z',
      public: false,
      views: 8
    }
  ];
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const isExpiringSoon = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };
  
  const isExpired = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return expiry < now;
  };
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Your Documents</h1>
        <Link to="/upload" className="btn btn-primary">
          Upload New PDF
        </Link>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{mockDocuments.length}</div>
          <div className="stat-label">Total Documents</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {mockDocuments.reduce((total, doc) => total + doc.views, 0)}
          </div>
          <div className="stat-label">Total Views</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {mockDocuments.filter(doc => !isExpired(doc.expiryDate)).length}
          </div>
          <div className="stat-label">Active Documents</div>
        </div>
      </div>
      
      <div className="documents-list">
        <div className="documents-header">
          <h2>Recent Documents</h2>
          <div className="documents-filters">
            <select className="documents-filter">
              <option value="all">All Documents</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
            </select>
            <select className="documents-sort">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-viewed">Most Viewed</option>
            </select>
          </div>
        </div>
        
        <div className="documents-grid">
          {mockDocuments.map(doc => (
            <div key={doc.id} className="document-card">
              <div className="document-header">
                <div className="document-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="document-title" title={doc.filename}>
                  {doc.filename}
                </div>
                {doc.public ? (
                  <div className="document-badge public">Public</div>
                ) : (
                  <div className="document-badge private">Private</div>
                )}
              </div>
              
              <div className="document-info">
                <div className="document-date">
                  <span className="document-label">Uploaded:</span>
                  <span className="document-value">{formatDate(doc.uploadDate)}</span>
                </div>
                <div className="document-date">
                  <span className="document-label">Expires:</span>
                  <span className={`document-value ${
                    isExpired(doc.expiryDate) 
                      ? 'expired' 
                      : isExpiringSoon(doc.expiryDate) 
                        ? 'expiring-soon' 
                        : ''
                  }`}>
                    {formatDate(doc.expiryDate)}
                    {isExpired(doc.expiryDate) && ' (Expired)'}
                    {!isExpired(doc.expiryDate) && isExpiringSoon(doc.expiryDate) && ' (Soon)'}
                  </span>
                </div>
                <div className="document-views">
                  <span className="document-label">Views:</span>
                  <span className="document-value">{doc.views}</span>
                </div>
              </div>
              
              <div className="document-actions">
                <Link to={`/view/${doc.id}`} className="document-action view" target="_blank">
                  View
                </Link>
                <Link to={`/analytics/${doc.id}`} className="document-action analytics">
                  Analytics
                </Link>
                <button className="document-action delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;