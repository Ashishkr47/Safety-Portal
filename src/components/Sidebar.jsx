import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/report-incident">📢 Safety Memo</Link></li>
        <li><Link to="/near-miss-report">🔄 Near-Miss Report</Link></li>
        <li><Link to="/training">🚨 Training</Link></li>
        <li><Link to="/documents">📄 Documents</Link></li>
        
      </ul>
    </aside>
  );
};

export default Sidebar;
