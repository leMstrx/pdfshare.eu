import { Outlet } from 'react-router-dom'; 
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;