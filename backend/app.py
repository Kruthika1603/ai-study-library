from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

from routes.auth_routes import auth_bp
from routes.ai_routes import ai_bp
from database import db
from routes.notes_routes import notes_bp


app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"

# DATABASE CONFIG
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///study_assistant.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(ai_bp, url_prefix="/ai")
app.register_blueprint(notes_bp, url_prefix="/notes")


@app.route("/")
def home():
    return {"message": "AI Study Assistant API running"}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()   # create tables

    app.run(debug=True)
