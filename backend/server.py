from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import datetime
import sqlite3
import json
import logging

app = Flask(__name__)
# More comprehensive CORS setup
CORS(app, resources={r"/*": {
    "origins": "*", 
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure upload folder - use absolute path
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database setup
def get_db_connection():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        upload_date TIMESTAMP NOT NULL,
        expiry_date TIMESTAMP NOT NULL
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        viewer_name TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        page_number INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (id)
    )
    ''')
    conn.commit()
    conn.close()

# Initialize database
init_db()

@app.route("/")
def hello():
    return "PDFShare.eu API"

@app.route("/upload", methods=["POST"])
def upload_pdf():
    logger.debug("Upload request received")
    logger.debug(f"Request files: {request.files}")
    
    if 'file' not in request.files:
        logger.debug("No file part in request")
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        logger.debug("Empty filename")
        return jsonify({"error": "No file selected"}), 400
    
    logger.debug(f"File name: {file.filename}")
    
    if file and file.filename.endswith('.pdf'):
        # Generate unique ID for document
        doc_id = str(uuid.uuid4())
        logger.debug(f"Generated document ID: {doc_id}")
        
        # Save file
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{doc_id}.pdf")
        logger.debug(f"Saving file to: {file_path}")
        file.save(file_path)
        
        # Store in database with 60-day expiry
        try:
            conn = get_db_connection()
            upload_date = datetime.datetime.now()
            expiry_date = upload_date + datetime.timedelta(days=60)
            
            conn.execute(
                "INSERT INTO documents (id, filename, upload_date, expiry_date) VALUES (?, ?, ?, ?)",
                (doc_id, filename, upload_date, expiry_date)
            )
            conn.commit()
            conn.close()
            logger.debug("Database record created successfully")
            
            return jsonify({
                "document_id": doc_id,
                "share_url": f"/view/{doc_id}"
            }), 201
        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
    
    logger.debug("File is not a PDF")
    return jsonify({"error": "File must be a PDF"}), 400

@app.route("/view/<doc_id>", methods=["GET"])
def get_document_info(doc_id):
    conn = get_db_connection()
    document = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    conn.close()
    
    if not document:
        return jsonify({"error": "Document not found"}), 404
    
    return jsonify({
        "document_id": document['id'],
        "filename": document['filename']
    })

@app.route("/view/<doc_id>/pdf", methods=["GET"])
def get_pdf(doc_id):
    # Check if document exists in database
    conn = get_db_connection()
    document = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    conn.close()
    
    if not document:
        return jsonify({"error": "Document not found"}), 404
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{doc_id}.pdf")
    if not os.path.exists(file_path):
        return jsonify({"error": "PDF file not found"}), 404
    
    return send_file(file_path, mimetype='application/pdf')

@app.route("/track", methods=["POST"])
def track_view():
    data = request.json
    if not data or not all(k in data for k in ('document_id', 'viewer_name', 'page_number', 'duration')):
        return jsonify({"error": "Missing required tracking data"}), 400
    
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO views (document_id, viewer_name, timestamp, page_number, duration) VALUES (?, ?, ?, ?, ?)",
        (data['document_id'], data['viewer_name'], datetime.datetime.now(), data['page_number'], data['duration'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success"}), 200

@app.route("/analytics/<doc_id>", methods=["GET"])
def get_analytics(doc_id):
    conn = get_db_connection()
    views = conn.execute(
        "SELECT viewer_name, timestamp, page_number, duration FROM views WHERE document_id = ? ORDER BY timestamp",
        (doc_id,)
    ).fetchall()
    conn.close()
    
    if not views:
        return jsonify({"error": "No views found for this document"}), 404
    
    results = []
    for view in views:
        results.append({
            "viewer_name": view['viewer_name'],
            "timestamp": view['timestamp'],
            "page_number": view['page_number'],
            "duration": view['duration']
        })
    
    return jsonify(results)

if __name__ == "__main__":
    # For development only; in production use a WSGI server like gunicorn/uwsgi
    app.run(debug=True, port=5000)