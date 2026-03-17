import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");
    if (!email || !password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.message || "Registration failed.");
      } else {
        setMessage("Registration successful! Please login.");
        setTimeout(() => navigate("/login"), 1500); // redirect to login
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        background: "#f0f0f0",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Register</h2>

      {message && (
        <p
          style={{
            marginBottom: "1rem",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          cursor: "pointer",
          marginTop: "0.5rem",
        }}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
