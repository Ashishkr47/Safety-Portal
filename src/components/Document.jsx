// src/components/Documents.jsx
import React from "react";
import "./documents.css";

const documents = [
  { name: "Quality Hira", file: "/docs/Quality_Updated_HIRA.xlsx" },
  { name: "Aspect Impact Analysis", file: "/docs/Aspect-Impact Analysis Sheet Of JSSL.xlsx" },
  
  { name: "Procedure For Emergency Prepardness", file: "/docs/Procedure For Emergency Prepardness.doc" },
  { name: "HIRA For Electrical Maintenance", file: "/docs/Updated HIRA For Electrical Maintenance Activity.xlsx" },
  { name: "HIRA Of Admin Activities", file: "/docs/Updated HIRA Of Admin Activities.xlsx" },
  { name: "HIRA Operation", file: "/docs/Updated HIRA Operation (1)(NEW).xlsx" },
  { name: "HIRA Warehouse", file: "/docs/Updated Mechanical Maintenance HIRA.xlsx" },
  { name: "Employee Satisfaction Survey", file: "/docs/Employee satisfaction survey.xlsx" },
];

const Documents = () => {
  return (
    <div className="documents-container">
      <h2>📄 Available Documents</h2>
      <ul className="document-list">
        {documents.map((doc, index) => (
          <li key={index}>
            <a href={doc.file} download target="_blank" rel="noopener noreferrer">
              {doc.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Documents;
