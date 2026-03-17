import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function History() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:5000/notes/history", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      console.log("History response:", data);

      setNotes(data.notes);
    };

    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>📚 Notes History</h2>
<p>Your previously saved study notes.</p>


        {notes.length === 0 ? (
          <p>No saved notes yet.</p>
        ) : (
          <div className="notes-list">
            {notes.map((note, index) => (
              <div key={index} className="note-card">
                {note.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default History;
