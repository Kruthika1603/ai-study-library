from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db
from models.note_model import Note
from models.user_model import User

notes_bp = Blueprint("notes", __name__)


@notes_bp.route("/save", methods=["POST"])
@jwt_required()
def save_notes():

    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"message": "No text provided"}), 400

    user_email = get_jwt_identity()

    # find user in database
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # create new note
    note = Note(
        content=text,
        user_id=user.id
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({"message": "Notes saved successfully!"}), 200


@notes_bp.route("/history", methods=["GET"])
@jwt_required()
def notes_history():

    user_email = get_jwt_identity()

    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"notes": []})

    notes = Note.query.filter_by(user_id=user.id).all()

    notes_list = []

    for note in notes:
        notes_list.append({
            "text": note.content
        })

    return jsonify({"notes": notes_list})
