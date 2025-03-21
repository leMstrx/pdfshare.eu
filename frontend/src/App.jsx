import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UploadPage from './components/UploadPage.jsx'
import ViewerPage from './components/ViewerPage.jsx'
import AnalyticsPage from './components/AnalyticsPage.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>PDFShare.eu</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/view/:documentId" element={<ViewerPage />} />
            <Route path="/analytics/:documentId" element={<AnalyticsPage />} />
          </Routes>
        </main>
        <footer>
          <p>© {new Date().getFullYear()} PDFShare.eu</p>
        </footer>
      </div>
    </Router>
  )
}

export default App