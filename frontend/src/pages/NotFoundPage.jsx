import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary not-found-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;