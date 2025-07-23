import React, { useState } from "react";
import "./DieselStorageAuditForm.css";

const initialData = [
  "Area is properly labeled with signage",
  "Emergency dike/bund wall available & in good condition",
  "Oil leakage collection tray provided",
  "Fire extinguisher installed and maintained",
  '"No Smoking" signage clearly visible',
  "Nearest fire hydrant is within accessible range",
  "Area is clean, dry and free from flammable materials",
  "MSDS (Material Safety Data Sheet) available",
  "Proper lighting and ventilation in the area",
  "Access restricted to authorized personnel only",
  "Diesel storage tanks checked for leaks or corrosion",
  "Spill response kit available near diesel storage",
  "Electrical fittings in the diesel storage area are explosion-proof",
  "Safety signage for diesel hazard (flammable material) clearly visible",
];

const DieselStorageAuditForm = () => {
  const [auditData, setAuditData] = useState(
    initialData.map((checkpoint) => ({
      checkpoint,
      status: "",
      remarks: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...auditData];
    updated[index][field] = value;
    setAuditData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/save-diesel-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auditData,
        timestamp: new Date().toLocaleString(),
      }),
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <form className="diesel-audit-form" onSubmit={handleSubmit}>
      <h2>🛢️ Diesel Storage Area Safety Audit</h2>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Audit Checkpoint</th>
            <th>Yes</th>
            <th>No</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {auditData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.checkpoint}</td>
              <td>
                <input
                  type="radio"
                  name={`status-${index}`}
                  checked={item.status === "Yes"}
                  onChange={() => handleChange(index, "status", "Yes")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`status-${index}`}
                  checked={item.status === "No"}
                  onChange={() => handleChange(index, "status", "No")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Optional remarks"
                  value={item.remarks}
                  onChange={(e) => handleChange(index, "remarks", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">✅ Submit</button>
    </form>
  );
};

export default DieselStorageAuditForm;
