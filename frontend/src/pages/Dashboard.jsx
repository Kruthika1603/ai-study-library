import { useState } from "react";

function Dashboard() {

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {

    const response = await fetch("http://127.0.0.1:5000/ai/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });

    const data = await response.json();
    setSummary(data.summary);

  };

  return (
    <div style={{padding:"40px", fontFamily:"Arial"}}>

      <h1>AI Study Assistant</h1>

      <textarea
        rows="6"
        cols="60"
        placeholder="Paste your notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSummarize}>
        Summarize Notes
      </button>

      <h3>Summary</h3>
      <p>{summary}</p>

    </div>
  );
}

export default Dashboard;
