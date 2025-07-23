import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const TrainingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-section">
          <h2>Training Section</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate("/training-form")}>📝 Fill Training Details</button>
            <button onClick={() => navigate("/training-dashboard")}>📊 View Training Dashboard</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainingPage;
