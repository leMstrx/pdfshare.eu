import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
  };
  
  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!validateForm()) return;
    
    if (isLogin) {
      // Handle login
      const { error, user } = await signIn(email, password);
      if (error) {
        setError(error);
      } else if (user) {
        navigate('/dashboard');
      }
    } else {
      // Handle signup
      const { error, message } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setMessage(message || 'Account created successfully! Please check your email for confirmation.');
        setTimeout(() => {
          setIsLogin(true);
        }, 3000);
      }
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <h2 className="auth-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <div className="auth-mode-toggle">
              <button 
                className={`auth-mode-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button 
                className={`auth-mode-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            {isLogin && (
              <div className="auth-options">
                <div className="remember-me">
                  <input
                    id="remember"
                    type="checkbox"
                    className="checkbox"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Remember me
                  </label>
                </div>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>
            )}
            
            {!isLogin && (
              <div className="form-group terms-checkbox">
                <input
                  id="terms"
                  type="checkbox"
                  className="checkbox"
                  required
                />
                <label htmlFor="terms" className="checkbox-label">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-alternate">
            <p>
              {isLogin 
                ? "Don't have an account?" 
                : "Already have an account?"}
              <button 
                onClick={toggleAuthMode}
                className="auth-alternate-link"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;