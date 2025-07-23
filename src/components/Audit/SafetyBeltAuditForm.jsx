import React, { useState } from "react";


const checkpoints = [
  "Hardware: Inspect for damage, distortion, sharp edges, burrs, cracks, and corrosion.",
  "Webbing: Inspect for cuts, burns, tears, frays, or discoloration.",
  "Stitching: Check for pulled or cut stitches.",
  "Lanyard Rope: Inspect for yarn pulls, abrasion, or soiling.",
  "Energy Absorbing Component: Look for elongation or tears.",
  "Hook: Check for cracks, deformities, and locking mechanism.",
];

const SafetyBeltAuditForm = () => {
  const [formData, setFormData] = useState(
    [1, 2, 3].map((beltNo) => ({
      beltNo,
      location: "Store",
      results: checkpoints.map(() => ({
        status: "",
        remark: "",
      })),
    }))
  );

  const handleStatusChange = (beltIndex, cpIndex, value) => {
    const updated = [...formData];
    updated[beltIndex].results[cpIndex].status = value;
    setFormData(updated);
  };

  const handleRemarkChange = (beltIndex, cpIndex, value) => {
    const updated = [...formData];
    updated[beltIndex].results[cpIndex].remark = value;
    setFormData(updated);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/save-safety-belt-audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData }),
    });

    if (res.ok) {
      alert("✅ Safety belt audit submitted successfully!");
    } else {
      alert("❌ Failed to submit audit.");
    }
  } catch (err) {
    console.error("Error submitting audit:", err);
    alert("❌ Error submitting audit.");
  }
};


  return (
    <form className="safety-belt-audit-form" onSubmit={handleSubmit}>
      <h2>🛡️ Safety Belt / Fall Protection Audit</h2>
      {formData.map((belt, beltIndex) => (
        <div key={beltIndex} className="belt-section">
          <h3>
            Belt No: {belt.beltNo} | Location: {belt.location}
          </h3>
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Check Point</th>
                <th>Status</th>
                <th>Remarks (Optional)</th>
              </tr>
            </thead>
            <tbody>
              {checkpoints.map((cp, cpIndex) => (
                <tr key={cpIndex}>
                  <td>{cpIndex + 1}</td>
                  <td>{cp}</td>
                  <td>
                    <select
                      value={belt.results[cpIndex].status}
                      onChange={(e) =>
                        handleStatusChange(beltIndex, cpIndex, e.target.value)
                      }
                      required
                    >
                      <option value="">Select</option>
                      <option value="OK">OK</option>
                      <option value="Not OK">Not OK</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter remark"
                      value={belt.results[cpIndex].remark}
                      onChange={(e) =>
                        handleRemarkChange(beltIndex, cpIndex, e.target.value)
                      }
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

export default SafetyBeltAuditForm;
