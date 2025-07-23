import React from "react";
import { useNavigate } from "react-router-dom";
import "./Help.css";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <h1 className="help-title">Need Help?</h1>
      <p className="help-description">Find answers to common questions and troubleshooting steps below.</p>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li><strong>1. I can't log in?</strong> - Ensure you're using a valid Microsoft account.</li>
          <li><strong>2. My login request keeps failing?</strong> - Check your internet connection or try again later.</li>
          <li><strong>3. Where can I report an issue?</strong> - Contact support using the details below.</li>
        </ul>
      </div>

      <div className="contact-section">
        <h2>Contact Support</h2>
        <p>Email: <a href="mailto:support@safetyportal.com">support@safetyportal.com</a></p>
        <p>Phone: +91 98765 43210</p>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>🔙 Back to Login</button>
    </div>
  );
};

export default Help;
