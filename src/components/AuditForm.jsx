import React from "react";
import { useParams } from "react-router-dom";

const AuditForm = () => {
  const { auditId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Form {auditId}</h2>
      <p>This is where the form for Audit {auditId} will go.</p>
      {/* Add your actual form fields here */}
    </div>
  );
};

export default AuditForm;
