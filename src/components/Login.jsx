import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useNavigate } from "react-router-dom"; 
import "./Login.css";

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate(); 

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then((response) => {
        localStorage.setItem("msalToken", response.accessToken);
        const userInfo = {
          name: response.account.name || "User",
          email: response.account.username || "",
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-info">
        {/* 🚀 Add Logos */}
        <div className="logo-container">
          <img src="/jsl.png" alt="JSL Logo" className="company-logo" />
          <img src="/jssl.png" alt="JSSL Logo" className="company-logo" />
        </div>

        <h1 className="login-title">Welcome to Safety Portal</h1>
        <p className="login-description">
          Stay informed. Stay safe. Report and manage incidents with ease.
        </p>
        <ul className="login-features">
          <li>✅ Secure Microsoft Login</li>
          <li>✅ Easy Incident Reporting</li>
          <li>✅ Track & Manage Cases</li>
          <li>✅ Access Important Safety Documents</li>
        </ul>
      </div>

      <div className="login-card">
        <h2 className="login-heading">Sign In</h2>
        <p className="login-subtext">Use your Microsoft account to continue.</p>
        <button className="login-button" onClick={handleLogin}>
          🔑 Login with Microsoft
        </button>
        <div className="login-footer">
          <p>Need help? <span className="help-link" onClick={() => navigate("/help")}>Click here</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
