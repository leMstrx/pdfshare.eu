import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} PDFShare.eu - All rights reserved
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;