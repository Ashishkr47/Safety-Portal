import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./audit.css";

const AuditSelection = () => {
  const navigate = useNavigate();

  // ✅ Get the logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ List of allowed email addresses
  const allowedEmails = [
    "ashish.kumar3@jindalstainless.com",
    "admin@yourcompany.com",
    "audit.head@yourcompany.com"
  ];

  // ❌ If user is not logged in or not authorized, show access denied
  if (!user || !allowedEmails.includes(user.email)) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content">
          <Sidebar />
          <main className="main-section">
            <h2>Unauthorized Access</h2>
            <p style={{ color: "red", fontSize: "16px", marginTop: "20px" }}>
              ❌ You do not have permission to view this section.
            </p>
          </main>
        </div>
      </div>
    );
  }

  // ✅ Authorized view
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-section">
          <h2>Select an Audit</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate("/forklift-check")}>Forklift Check</button>
            <button onClick={() => navigate("/fire-extin")}>Fire Extinguisher</button>
            <button onClick={() => navigate("/first-aid")}>First Aid</button>
            <button onClick={() => navigate("/fire-alarm")}>Fire Alarm and Pump House checklist</button>
            <button onClick={() => navigate("/crane-check")}>Crane check List</button>
            <button onClick={() => navigate("/lifting-tool")}>Lifting Tool</button>
            <button onClick={() => navigate("/portable-tool")}>Portable Tool</button>
            <button onClick={() => navigate("/hose-reel")}>HoseReel</button>
            <button onClick={() => navigate("/diesel-storage")}>Diesel and Oil</button>
            <button onClick={() => navigate("/machine")}>Machine Guarding</button>
            <button onClick={() => navigate("/ppe")}>PPE Spot Survey</button>
            <button onClick={() => navigate("/vessel")}>Pressure Vessel</button>
            <button onClick={() => navigate("/safety-belt")}>Safety Belt</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditSelection;
