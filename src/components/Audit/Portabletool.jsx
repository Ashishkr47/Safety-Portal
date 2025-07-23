import React, { useState } from "react";
import "./Portabletool.css";

const toolData = [
  {
    name: "Hand Grinder 4\"",
    qty: 1,
    location: "Maintenance",
    checks: [
      "Guard",
      "Working condition",
      "Cable condition",
      "Carbon brush condition",
      "Power socket",
      "Handle",
      "Wheel size",
    ],
  },
  {
    name: "Hand Grinder 6\"",
    qty: 1,
    location: "Maintenance",
    checks: [
      "Guard",
      "Working condition",
      "Cable condition",
      "Carbon brush condition",
      "Power socket",
      "Handle",
      "Wheel size",
    ],
  },
  {
    name: "Welding Set",
    qty: 1,
    location: "Maintenance",
    checks: [
      "Electrode cable condition",
      "Socket condition",
      "Supply cable condition",
      "Working condition",
      "Electrode handle condition",
    ],
  },
  {
    name: "Drill Machine",
    qty: 2,
    location: "Carpentry",
    checks: [
      "Guard",
      "Working condition",
      "Cable condition",
      "Carbon brush condition",
      "Power socket",
      "Handle",
      "Chuck",
    ],
  },
  {
    name: "Hand wood cutter",
    qty: 1,
    location: "Carpentry",
    checks: [
      "Guard",
      "Working condition",
      "Cable condition",
      "Carbon brush condition",
      "Wood cutter size",
    ],
  },
  {
    name: "Chuck saw",
    qty: 1,
    location: "Dispatch",
    checks: [
      "Guard",
      "Working condition",
      "Cable condition",
      "Carbon brush condition",
      "Wood cutter size",
    ],
  },
];

const PortableToolsAuditForm = () => {
  const [formData, setFormData] = useState(() =>
    toolData.map((tool, toolIndex) => ({
      ...tool,
      serial: toolIndex + 1,
      checklist: tool.checks.map((check) => ({
        parameter: check,
        status: "OK",
        remarks: "",
      })),
    }))
  );

  const handleChange = (toolIndex, checkIndex, field, value) => {
    const updated = [...formData];
    updated[toolIndex].checklist[checkIndex][field] = value;
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/save-portable-tools-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Portable tools audit submitted successfully!");
      } else {
        alert("Failed to submit audit");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Error submitting audit");
    }
  };

  return (
    <form className="portable-tools-form" onSubmit={handleSubmit}>
      <h1>🔧 Portable Tools Checklist</h1>
      {formData.map((tool, toolIndex) => (
        <div key={toolIndex} className="tool-section">
          <h2>
            {tool.serial}. {tool.name} – Qty: {tool.qty} | Location: {tool.location}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {tool.checklist.map((item, checkIndex) => (
                <tr key={checkIndex}>
                  <td>{item.parameter}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleChange(toolIndex, checkIndex, "status", e.target.value)
                      }
                    >
                      <option value="OK">OK</option>
                      <option value="Not OK">Not OK</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) =>
                        handleChange(toolIndex, checkIndex, "remarks", e.target.value)
                      }
                      placeholder="Optional"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <button type="submit">✅ Submit Audit</button>
    </form>
  );
};

export default PortableToolsAuditForm;
