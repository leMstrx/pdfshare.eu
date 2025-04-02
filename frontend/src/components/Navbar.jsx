import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleSignOut = () => {
    signOut();
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          PDFShare.eu
        </Link>
        
        {/* Desktop Menu */}
        <div className="navbar-links desktop-menu">
          <Link to="/" className="navbar-link">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/upload" className="navbar-link">Upload</Link>
            </>
          ) : (
            <Link to="/auth" className="navbar-link">Login</Link>
          )}
        </div>
        
        {/* User Section (Desktop) */}
        <div className="navbar-user desktop-menu">
          {user ? (
            <div className="navbar-user-info">
              <span className="navbar-user-email">{user.email}</span>
              <button onClick={handleSignOut} className="btn btn-secondary navbar-signout">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Sign Up
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="navbar-mobile-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="navbar-mobile-toggle-icon"></span>
        </button>
        
        {/* Mobile Menu */}
        <div className={`navbar-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-mobile-links">
            <Link to="/" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="navbar-mobile-link" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/upload" 
                  className="navbar-mobile-link" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Upload
                </Link>
                <button onClick={handleSignOut} className="navbar-mobile-link navbar-mobile-signout">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="navbar-mobile-link" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth" 
                  className="navbar-mobile-link navbar-mobile-signup" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;