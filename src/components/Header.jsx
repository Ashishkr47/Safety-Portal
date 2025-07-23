import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleAbout = () => {
    navigate("/about");
  };

  const handleHelp = () => {
    navigate("/help");
  };

  return (
    <header className="header">
      <h1 className="header-title">Safety Portal</h1>
      <nav className="header-nav">
        <button className="nav-btn" onClick={handleHelp}>❓ Help</button>
        <button className="nav-btn" onClick={handleAbout}>ℹ️ About</button>
        <button className="nav-btn logout-btn" onClick={handleLogout}>🚪 Log Out</button>
      </nav>
    </header>
  );
};

export default Header;
