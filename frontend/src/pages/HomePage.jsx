import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Share PDFs with <span>detailed analytics</span>
          </h1>
          <p className="hero-description">
            Upload your PDF documents, share them securely, and track exactly how they're being viewed - page by page, minute by minute.
          </p>
          <div className="hero-buttons">
            <Link to="/auth" className="btn btn-primary hero-button">
              Get Started
            </Link>
            <Link to="/auth" className="btn btn-secondary hero-button">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">How It Works</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V16M16 8L12 4M12 4L8 8M12 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Upload</h3>
            <p className="feature-description">
              Upload your PDF documents securely to our platform with just a few clicks.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12C9 11.518 8.886 11.062 8.684 10.658M8.684 13.342C8.404 13.918 7.898 14.354 7.274 14.493C6.649 14.633 5.992 14.459 5.512 14.022C5.032 13.586 4.78 12.937 4.824 12.274C4.867 11.611 5.201 11.003 5.73 10.633C6.259 10.263 6.916 10.16 7.535 10.352C8.153 10.543 8.677 11.012 8.944 11.618M8.684 13.342L15.316 16.658M8.684 10.658L15.316 7.342M15.316 7.342C15.034 6.766 15.077 6.099 15.434 5.561C15.791 5.023 16.426 4.682 17.132 4.652C17.838 4.622 18.505 4.906 18.919 5.41C19.332 5.914 19.441 6.566 19.209 7.152C18.978 7.738 18.433 8.184 17.777 8.336C17.121 8.488 16.428 8.331 15.925 7.912C15.422 7.493 15.174 6.858 15.256 6.224C15.338 5.59 15.741 5.029 16.316 4.749M15.316 7.342C15.034 7.918 15.077 8.585 15.434 9.123C15.791 9.661 16.426 10.002 17.132 10.032C17.838 10.062 18.505 9.778 18.919 9.274C19.332 8.77 19.441 8.118 19.209 7.532C18.978 6.946 18.433 6.5 17.777 6.348C17.121 6.196 16.428 6.353 15.925 6.772C15.422 7.191 15.174 7.826 15.256 8.46C15.338 9.094 15.741 9.655 16.316 9.935M15.316 16.658C15.597 17.234 15.554 17.901 15.197 18.439C14.84 18.977 14.205 19.318 13.499 19.348C12.793 19.378 12.126 19.094 11.713 18.59C11.299 18.086 11.191 17.434 11.422 16.848C11.654 16.262 12.198 15.816 12.854 15.664C13.51 15.512 14.203 15.669 14.706 16.088C15.209 16.507 15.458 17.142 15.375 17.776C15.293 18.41 14.89 18.971 14.316 19.251M15.316 16.658C15.597 16.082 15.554 15.415 15.197 14.877C14.84 14.339 14.205 13.998 13.499 13.968C12.793 13.938 12.126 14.222 11.713 14.726C11.299 15.23 11.191 15.882 11.422 16.468C11.654 17.054 12.198 17.5 12.854 17.652C13.51 17.804 14.203 17.647 14.706 17.228C15.209 16.809 15.458 16.174 15.375 15.54C15.293 14.906 14.89 14.345 14.316 14.065" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Share</h3>
            <p className="feature-description">
              Generate a unique sharing link that you can send to anyone you want to view your document.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19V13C9 11.8954 8.10457 11 7 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H7C8.10457 21 9 20.1046 9 19ZM9 19V9C9 7.89543 9.89543 7 11 7H13C14.1046 7 15 7.89543 15 9V19M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19M15 19V5C15 3.89543 15.8954 3 17 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H17C15.8954 21 15 20.1046 15 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Track</h3>
            <p className="feature-description">
              Get detailed insights on who viewed your documents, when, and how they interacted with each page.
            </p>
          </div>
        </div>
      </section>
      
      <section className="benefits">
        <h2 className="section-title">Why Choose PDFShare.eu</h2>
        <div className="benefits-list">
          <div className="benefit">
            <h3 className="benefit-title">Detailed Analytics</h3>
            <p className="benefit-description">
              Track exactly which pages are viewed and for how long, giving you valuable insights about your content.
            </p>
          </div>
          
          <div className="benefit">
            <h3 className="benefit-title">Secure Sharing</h3>
            <p className="benefit-description">
              Your documents are stored securely and can only be accessed by people you share them with.
            </p>
          </div>
          
          <div className="benefit">
            <h3 className="benefit-title">Easy to Use</h3>
            <p className="benefit-description">
              Our intuitive interface makes it simple to upload, share, and monitor your PDF documents.
            </p>
          </div>
          
          <div className="benefit">
            <h3 className="benefit-title">No Software Required</h3>
            <p className="benefit-description">
              Recipients don't need to install anything - documents can be viewed directly in the browser.
            </p>
          </div>
        </div>
      </section>
      
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-description">
            Join thousands of users who are already sharing their PDFs with detailed analytics.
          </p>
          <Link to="/auth" className="btn btn-primary cta-button">
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;