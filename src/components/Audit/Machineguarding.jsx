import React, { useState } from "react";
// import "./MachineGuardingChecklistForm.css";

const checkpoints = [
  "Are the safeguards firmly secured and not easily removable?",
  "Do the safeguards ensure that no object will fall into the moving parts?",
  "Do the safeguards permit safe, comfortable, and relatively easy operation of the machine?",
  "Do the safeguards prevent worker’s hands, arms, and other body parts from making contact with dangerous moving parts?",
  "Are starting and stopping controls in place and reachable?",
  "Procedures established to ensure machine is shut down before guard is removed",
  "Is the operator dressed safely for the job? (i.e., no loose-fitting clothing or jewelry?)",
  "Do operators and maintenance workers have the necessary training in how to use the safeguards and why?",
  "Have operators and maintenance workers been trained in how and under what circumstances guards can be removed?",
  "Are all gears, sprockets, pulleys, and flywheels properly guarded?",
  "Are all belts, chains, screws, keyways, and collars safely enclosed or guarded?",
  "Are safeguards provided for all hazardous moving parts?",
];

const MachineGuardingChecklistForm = () => {
  const [formData, setFormData] = useState(
    checkpoints.map(() => ({
      status: "",
      remarks: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const timestamp = new Date().toISOString();

  const auditData = formData.map((item, index) => ({
    checkpoint: checkpoints[index],
    status: item.status,
    remarks: item.remarks,
  }));

  try {
    const response = await fetch("http://localhost:5000/save-machine-guarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp, auditData }),
    });

    if (response.ok) {
      alert("✅ Machine Guarding Checklist submitted successfully!");
    } else {
      alert("❌ Submission failed. Please try again.");
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("🚨 Error submitting the checklist.");
  }
};



  return (
    <form className="machine-checklist-form" onSubmit={handleSubmit}>
      <h2>🛠️ Machine Safety Guarding Checklist</h2>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Checkpoint</th>
            <th>Yes</th>
            <th>No</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {checkpoints.map((checkpoint, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{checkpoint}</td>
              <td>
                <input
                  type="radio"
                  name={`status-${index}`}
                  value="Yes"
                  checked={formData[index].status === "Yes"}
                  onChange={() => handleChange(index, "status", "Yes")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`status-${index}`}
                  value="No"
                  checked={formData[index].status === "No"}
                  onChange={() => handleChange(index, "status", "No")}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[index].remarks}
                  onChange={(e) => handleChange(index, "remarks", e.target.value)}
                  placeholder="Remarks (optional)"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">✅ Submit Checklist</button>
    </form>
  );
};

export default MachineGuardingChecklistForm;
