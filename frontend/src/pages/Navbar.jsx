import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="nav-title">AI Study Assistant</div>

      <div className="nav-links">
        <button onClick={() => navigate("/notes")}>Notes</button>
        <button onClick={() => navigate("/history")}>History</button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
