from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Flask!"

if __name__ == "__main__":
    # For development only; in production use a WSGI server like gunicorn/uwsgi
    app.run(debug=True)
