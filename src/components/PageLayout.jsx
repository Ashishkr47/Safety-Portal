// components/PageLayout.jsx
import React from "react";
import "./PageLayout.css";

const PageLayout = ({ children }) => {
  return (
    <div className="page-wrapper">
      {/* Top bar with both logos */}
      <div className="page-header">
        <img src="/jssl.png" alt="JSL Logo" className="logo left-logo" />
        <img src="/jsl.png" alt="JSSL Logo" className="logo right-logo" />
      </div>

      {/* Main content */}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
