import React from "react";
import { useNavigate } from "react-router-dom";

const FormLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Go to dashboard
  };

  return (
    <div style={{ padding: "20px", position: "relative", minHeight: "100vh" }}>
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        Log Out
      </button>
      <div style={{ marginTop: "60px" }}>{children}</div>
    </div>
  );
};

export default FormLayout;
