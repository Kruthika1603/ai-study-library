import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data); // Debug

      if (!res.ok) {
        setMessage(data.message || data.error || "Login failed.");
        setLoading(false);
        return;
      }

      // Make sure token exists
      if (!data.access_token) {
        setMessage("Login succeeded but no token received.");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", data.access_token);

      console.log("Stored token:", data.access_token);

      setMessage("Login successful!");

      // Redirect to notes page
      setTimeout(() => {
        navigate("/notes");
      }, 800);

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Please try again.");
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
        backgroundColor: "#f2f2f2"
      }}
    >
      <h2>Login</h2>

      {message && (
        <p style={{ color: message.includes("successful") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "8px", padding: "8px", width: "250px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "8px", padding: "8px", width: "250px" }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "8px 16px",
          marginTop: "10px",
          cursor: "pointer"
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
