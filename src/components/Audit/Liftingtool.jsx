import React, { useState } from "react";
// import "./LiftingToolsAuditForm.css";

const initialData = [
  { name: "Chain Block", capacity: "05 MT", location: "BC Bay" },
  { name: "C-Hook", capacity: "23MT/27MT", location: "Crane No 1 WMI 25 MT" },
  { name: "C-Hook", capacity: "23MT", location: "Crane No 2 UNICON 30 MT" },
  { name: "C-Hook", capacity: "30MT", location: "Crane No 5 UNICON 25 MT" },
  { name: "C-Hook Container coil loading", capacity: "10 MT", location: "AB Bay" },
  { name: "C-Hook Container Sheet loading", capacity: "", location: "" },
  { name: "Nylon Sling 4.5mtr", capacity: "05 MT", location: "BC Bay" },
  { name: "Nylon Sling 4.5mtr", capacity: "05 MT", location: "Crane No 3 Unicon 10 MT" },
  { name: "Nylon Sling (5.5mtr & 4.5mtr)", capacity: "05 MT", location: "Crane No 4 Alpha 10 MT" },
  { name: "Nylon Sling (5.5mtr & 4.5mtr)", capacity: "05 MT", location: "Crane No 1 WMI / Crane No 2 UNICON" },
  { name: "Nylon Belt (2.5 mtr)", capacity: "500 KG", location: "Paper Line, WCTL, SB, Slitting 1 & Cutter Grinder" },
  { name: "Wire rope sling 25mt", capacity: "25 MT", location: "Crane No 2 UNICON 30 MT" },
  { name: "D-Shackle used with sling 25mt", capacity: "25 MT", location: "Crane No 2 UNICON 30 MT" },
  { name: "Packet Lifter 3 Mtr", capacity: "05 MT", location: "Loading Point 1" },
  { name: "Packet Lifter 3 Mtr", capacity: "05 MT", location: "Loading Point 1" },
  { name: "Packet Lifter 6 Mtr", capacity: "7.5 MT", location: "Loading Point 1" },
];

const LiftingToolsAuditForm = () => {
  const [formData, setFormData] = useState(
    initialData.map((item, index) => ({
      ...item,
      serial: index + 1,
      status: "OK",
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

    try {
      const response = await fetch("http://localhost:5000/save-lifting-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Lifting tools audit submitted successfully!");
      } else {
        alert("Failed to submit audit.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <form className="lifting-audit-form" onSubmit={handleSubmit}>
      <h1>🪝 Lifting Tools & Tackles Checklist</h1>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => (
            <tr key={index}>
              <td>{item.serial}</td>
              <td>{item.name}</td>
              <td>{item.capacity}</td>
              <td>{item.location}</td>
              <td>
                <select
                  value={item.status}
                  onChange={(e) => handleChange(index, "status", e.target.value)}
                >
                  <option value="OK">OK</option>
                  <option value="Not OK">Not OK</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={item.remarks}
                  onChange={(e) => handleChange(index, "remarks", e.target.value)}
                  placeholder="Optional"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">✅ Submit Audit</button>
    </form>
  );
};

export default LiftingToolsAuditForm;
