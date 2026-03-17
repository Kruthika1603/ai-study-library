from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt

from database import db
from models.user_model import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # check if user already exists
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user = User(
        email=email,
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=email)

    return jsonify({
        "access_token": token
    })
