import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function UploadPage() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
    } else {
      setFile(null)
      setError('Please select a valid PDF file')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a PDF file first')
      return
    }
  
    setIsUploading(true)
    setError(null)
  
    try {
      console.log('Attempting to upload file:', file.name)
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`
      
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('pdf')
        .upload(filePath, file)
      
      if (uploadError) {
        throw new Error(uploadError.message || 'Error uploading file')
      }
      
      console.log('File uploaded successfully:', fileData.path)
      
      // Calculate expiry date (60 days from now)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 60)
      
      // Insert record into documents table
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert([
          { 
            filename: file.name,
            expiry_date: expiryDate.toISOString(),
            storage_path: fileData.path
          }
        ])
        .select()
        .single()
      
      if (dbError) {
        throw new Error(dbError.message || 'Error saving document information')
      }
      
      console.log('Document record created:', documentData)
      
      // Navigate to analytics page
      navigate(`/analytics/${documentData.id}`)
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload PDF Document</h2>
      <p>Share your PDF and track when and how viewers interact with it.</p>
      
      <form onSubmit={handleUpload}>
        <div className="file-input-container">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {file ? file.name : 'Choose PDF file'}
          </label>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button 
          type="submit" 
          disabled={!file || isUploading}
          className="upload-button"
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
      
      <div className="info-box">
        <h3>How it works</h3>
        <ol>
          <li>Upload your PDF document</li>
          <li>Share the viewing link with your audience</li>
          <li>Viewers enter only their name to access the document</li>
          <li>Track detailed insights: viewing time, pages viewed, and more</li>
        </ol>
        <p className="note">Documents are automatically deleted after 60 days.</p>
      </div>
    </div>
  )
}

export default UploadPage