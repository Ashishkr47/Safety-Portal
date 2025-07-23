import React, { useState } from "react";
import "./Crane.css"

const checklist = {
  "Long Travel Platform": [
    "Gear Box Leakage",
    "Electrical Panel Door",
    "Shaft Coupling Cover",
    "Wheel Condition",
    "Rail Line Condition",
    "LT Track Railing",
    "LT Drive Coupling Guard",
    "LT Motor End Cover",
    "LT Motor Terminal Box Cover",
    "Distribution Board Cover",
    "Stair Railing from Shop Floor to LT Platform",
    "Working Condition of Brake",
    "Proper Working of Limit Switch",
    "Buffer Stopper Working",
  ],
  "Cross Travel Platform": [
    "Gear Box Leakage",
    "Electrical Panel Door",
    "Shaft Coupling Cover",
    "Wheel Condition",
    "Rail Line Condition",
    "CT Track Railing",
    "CT Drive Coupling Guard",
    "CT Motor End Cover",
    "CT Motor Terminal Box Cover",
    "Distribution Board Cover",
    "Working Condition of Brake",
    "Proper Working of Buzzer",
    "Proper Working of Limit Switch",
  ],
  "Main Hoist": [
    "Rotary Limit Switch Working",
    "Gravity Switch Working",
    "Wire Rope Condition",
    "Drum Condition & Clamping",
  ],
  "Aux. Hoist": [
    "Rotary Limit Switch Working",
    "Gravity Switch Working",
    "Wire Rope Condition",
    "Drum Condition & Clamping",
  ],
  "Others": [
    "Festoon Trolley Condition",
    "Remote Condition",
    "Corner Switch Working",
    "Crane Level Girder Condition",
    "UB Lights Working",
  ],
};

const EOTCraneAuditForm = () => {
  const initialData = Object.entries(checklist).flatMap(([section, items], sectionIndex) =>
    items.map((item, itemIndex) => ({
      srNo: sectionIndex * 100 + itemIndex + 1,
      section,
      parameter: item,
      status: "OK",
      remarks: "",
    }))
  );

  const [formData, setFormData] = useState(initialData);

  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/submit-eot-crane-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("EOT Crane Checklist submitted successfully!");
      } else {
        alert("Failed to submit audit.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>🛠️ EOT Crane Checklist Audit</h1>
      {Object.keys(checklist).map((section) => (
        <div key={section}>
          <h2>{section}</h2>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Parameter</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData
                .filter((item) => item.section === section)
                .map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.srNo}</td>
                    <td>{item.parameter}</td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => handleChange(formData.indexOf(item), "status", e.target.value)}
                      >
                        <option value="OK">OK</option>
                        <option value="Not OK">Not OK</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleChange(formData.indexOf(item), "remarks", e.target.value)}
                        placeholder="Optional"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
        </div>
      ))}
      <button type="submit">✅ Submit Audit</button>
    </form>
  );
};

export default EOTCraneAuditForm;
