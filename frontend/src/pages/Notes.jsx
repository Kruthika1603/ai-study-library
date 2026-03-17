import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Notes() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = async () => {
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    if (!text.trim()) {
      setMessage("Please write a note first.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/notes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Server response:", data);
        setMessage(data.message || data.error || "Failed to save note.");
        return;
      }

      setMessage("Note saved successfully!");
      setText("");
    } catch (error) {
      console.error(error);
      setMessage("Server error. Check backend terminal.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>🧠 AI Study Notes Dashboard</h2>
<p>Write and save your study notes easily.</p>


        {message && <p className="message">{message}</p>}

        <textarea
          placeholder="Write your notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="button-group">
          <button onClick={handleSave}>Save Notes</button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/history")}
          >
            View Notes History
          </button>
        </div>
      </div>
    </>
  );
}

export default Notes;
