import React, { useState } from "react";
import "./HoseReelAuditForm.css";

const auditItems = [
  "Is the hose reel easily visible?",
  "If not easily visible, is there a sign indicating its location?",
  "Is it clear from obstructions e.g. fixtures, fittings, storage of goods?",
  "Is the hose properly wound up to the rim? (Up to the rim indicates adequate length)",
  "Is the hose in good condition and secured to the nozzle and shell?",
  "It is not corroded, damaged or dented.",
  "Is the hand wheel/lever to operate the hose reel intact?",
  "Is the hose reel drum able to swing smoothly?",
  "There is no water leakage from the hose reel.",
  "Is the discharge nozzle free from blockage?",
  "Is the water throw more than 20 feet?",
];

const hosePoints = Array.from({ length: 17 }, (_, i) => `Point ${i + 1}`);

const HoseReelAuditForm = () => {
  const [formData, setFormData] = useState(() =>
    auditItems.map((item) =>
      hosePoints.map(() => ({
        status: "OK",
        remarks: "",
      }))
    )
  );

  const handleChange = (itemIdx, pointIdx, field, value) => {
    const updated = [...formData];
    updated[itemIdx][pointIdx][field] = value;
    setFormData(updated);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Flatten 2D formData into 1D array with proper keys
  const flattenedData = [];

  auditItems.forEach((checkpoint, itemIdx) => {
    hosePoints.forEach((point, pointIdx) => {
      flattenedData.push({
        Checkpoint: checkpoint,                // e.g. "Is the hose reel easily visible?"
        Point: point,                          // optional: e.g. "Point 1"
        Status: formData[itemIdx][pointIdx].status,
        Remarks: formData[itemIdx][pointIdx].remarks,
      });
    });
  });

  try {
    const timestamp = new Date().toISOString();
    const response = await fetch("http://localhost:5000/api/hose-reel-audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auditData: flattenedData, timestamp }),
    });

    if (response.ok) {
      alert("✅ Audit submitted successfully!");
    } else {
      alert("❌ Submission failed. Please try again.");
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("🚨 Error submitting the audit.");
  }
};


  return (
    <form className="hose-reel-form" onSubmit={handleSubmit}>
      <h1>🧯 Hose Reel Audit Checklist</h1>
      <div className="scrollable-table">
        <table>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Items to Check</th>
              {hosePoints.map((point, idx) => (
                <th key={idx}>{point}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditItems.map((item, itemIdx) => (
              <tr key={itemIdx}>
                <td>{itemIdx + 1}</td>
                <td className="question">{item}</td>
                {hosePoints.map((_, pointIdx) => (
                  <td key={pointIdx}>
                    <select
                      value={formData[itemIdx][pointIdx].status}
                      onChange={(e) =>
                        handleChange(itemIdx, pointIdx, "status", e.target.value)
                      }
                    >
                      <option value="OK">OK</option>
                      <option value="Not OK">Not OK</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Remarks"
                      value={formData[itemIdx][pointIdx].remarks}
                      onChange={(e) =>
                        handleChange(itemIdx, pointIdx, "remarks", e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="submit">✅ Submit Audit</button>
    </form>
  );
};

export default HoseReelAuditForm;
