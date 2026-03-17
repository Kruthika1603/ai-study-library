# ai_routes.py

from flask import Blueprint, request, jsonify
from transformers import pipeline

ai_bp = Blueprint("ai", __name__)

# GPT-2 for text generation (both summaries and answers)
generator = pipeline(
    "text-generation",
    model="gpt2",
    pad_token_id=None  # avoids warning when generating shorter text
)


@ai_bp.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text", "")

    # Create a clear prompt for bullet-point style summary
    prompt = f"""
Summarize the following notes in 3-5 short bullet points.
Keep it concise, clear, and avoid repeating sentences.

Notes:
{text}
"""

    # Use sampling to reduce repetition and improve variety
    result = generator(
        prompt,
        max_length=120,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        num_return_sequences=1
    )

    summary = result[0]["generated_text"].strip()

    # Optional: remove the original prompt from the output if it repeats
    summary = summary.replace(prompt, "").strip()

    return jsonify({"summary": summary})


@ai_bp.route("/ask", methods=["POST"])
def ask_question():
    data = request.json
    notes = data.get("notes", "")
    question = data.get("question", "")

    prompt = f"""
Based on the following notes, answer the question concisely.

Notes:
{notes}

Question:
{question}
"""

    result = generator(
        prompt,
        max_length=150,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        num_return_sequences=1
    )

    answer = result[0]["generated_text"].strip()
    answer = answer.replace(prompt, "").strip()

    return jsonify({"answer": answer})
