import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadPage.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Calculate minimum date for expiry (1 day from now)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Calculate default expiry date (30 days from now)
  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 30);
  const defaultExpiryString = defaultExpiry.toISOString().split('T')[0];

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check if file is a PDF
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setExpiryDate(defaultExpiryString);
    setError('');
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setLoading(true);
    
    try {
      // This is a placeholder for actual upload logic
      // We'll implement the real upload with Supabase later
      console.log('File to upload:', file);
      console.log('File name:', fileName);
      console.log('Expiry date:', expiryDate);
      console.log('Is public:', isPublic);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard after successful upload
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload PDF Document</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <div className="upload-content">
          <div className="upload-dropzone-container">
            <div 
              className={`upload-dropzone ${file ? 'has-file' : ''}`}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                accept="application/pdf"
                onChange={handleFileChange}
                className="upload-input"
              />
              
              {!file ? (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V16M16 8L12 4M12 4L8 8M12 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="upload-text">Drag & drop a PDF file here, or click to browse</p>
                  <p className="upload-subtext">PDF files only, max 10MB</p>
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="file-name">{fileName}</p>
                  <button 
                    className="file-change-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview(null);
                      setFileName('');
                    }}
                  >
                    Change file
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="filename" className="form-label">Document Name</label>
              <input
                type="text"
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="input"
                placeholder="Enter document name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expiry-date" className="form-label">Expiry Date</label>
              <input
                type="date"
                id="expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="input"
                min={minDate}
                required
              />
              <p className="form-hint">Document will be automatically deleted after this date</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Visibility</label>
              <div className="visibility-options">
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                  />
                  <div className="visibility-option-content">
                    <span className="visibility-option-title">Public</span>
                    <span className="visibility-option-description">
                      Anyone with the link can view the document
                    </span>
                  </div>
                </label>
                
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                  />
                  <div className="visibility-option-content">
                    <span className="visibility-option-title">Private</span>
                    <span className="visibility-option-description">
                      Only people you specifically allow can view the document
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="upload-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !file}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;