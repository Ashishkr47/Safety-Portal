import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";  // Import Link
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Dashboard.css";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-section">
          <h1 className="dashboard-heading">Welcome to Safety Portal</h1>

          {user ? (
            <div className="user-profile">
              <h2 className="user-profile-title">User Profile</h2>
              <div className="user-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          ) : (
            <p className="loading-text">Loading user info...</p>
          )}

<div className="dashboard-buttons-grid">
  <button className="dashboard-btn" onClick={() => navigate("/report-incident")}>
    📝 Safety Memo
  </button>
  <button className="dashboard-btn" onClick={() => navigate("/near-miss-report")}>
    ⚠️ Near Miss Report
  </button>
  <button className="dashboard-btn" onClick={() => navigate("/audit-selection")}>
    🧾 Audit
  </button>
  <button className ="dashboard-btn" onClick={() => navigate("/training")}>📘 Training</button>
  <Link to="/documents" className="dashboard-btn"style={{ marginBottom: "15px" }}>
    📄 Documents
  </Link>

  <Link to="/master-dashboard" className="dashboard-btn">
    📈 Audit, Near-Miss and Safety Memo Dashboard
  </Link>
</div>    
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
