import React, { useState } from "react";
import "./FireExtin.css"; // Optional styling

const FireExtin = () => {
  const [formData, setFormData] = useState({
    location: "",
    type: "",
    capacity: "",
    dischargeHose: "",
    dischargeNozzle: "",
    safetyPinClip: "",
    identTag: "",
    properMountClean: "",
    remarks: "",
  });

  const [statusFields, setStatusFields] = useState({
    dischargeHose: "",
    dischargeNozzle: "",
    safetyPinClip: "",
    identTag: "",
    properMountClean: "",
  });

  const [remarks, setRemarks] = useState({
    dischargeHose: "",
    dischargeNozzle: "",
    safetyPinClip: "",
    identTag: "",
    properMountClean: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (name, value) => {
    setStatusFields({ ...statusFields, [name]: value });
  };

  const handleRemarksChange = (name, value) => {
    setRemarks({ ...remarks, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const auditEntries = [
      {
        ...formData,
        dischargeHose: statusFields.dischargeHose,
        dischargeNozzle: statusFields.dischargeNozzle,
        safetyPinClip: statusFields.safetyPinClip,
        identTag: statusFields.identTag,
        properMountClean: statusFields.properMountClean,
        remarks:
          remarks.dischargeHose +
          " " +
          remarks.dischargeNozzle +
          " " +
          remarks.safetyPinClip +
          " " +
          remarks.identTag +
          " " +
          remarks.properMountClean,
      },
    ];

    fetch("http://localhost:5000/submit-audit2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auditEntries), // ✅ wrap in array
    })
      .then((res) => res.json())
      .then(() => alert("✅ Fire Extinguisher Audit Submitted Successfully!"))
      .catch((err) => {
        console.error("Submit error:", err);
        alert("❌ Submission failed!");
      });
  };

  return (
    <div className="audit2-container">
      <h2>Audit 2 - Fire Extinguisher Inspection</h2>
      <form onSubmit={handleSubmit} className="audit2-form">
        {/* Static fields */}
        {[
          ["Location of Extinguisher", "location"],
          ["Type of Extg", "type"],
          ["Capacity", "capacity"],
        ].map(([label, name]) => (
          <div key={name} className="form-group">
            <label>{label}:</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* OK / Not OK dropdown fields */}
        {[
          ["Discharge Hose", "dischargeHose"],
          ["Discharge Nozzle", "dischargeNozzle"],
          ["Safety Pin/Clip", "safetyPinClip"],
          ["Ident. Tag", "identTag"],
          ["Proper Mount/Clean", "properMountClean"],
        ].map(([label, name]) => (
          <div key={name} className="form-group">
            <label>{label}:</label>
            <select
              value={statusFields[name]}
              onChange={(e) => handleStatusChange(name, e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="OK">OK</option>
              <option value="Not OK">Not OK</option>
            </select>

            {statusFields[name] === "Not OK" && (
              <input
                type="text"
                placeholder="Remarks (optional)"
                value={remarks[name]}
                onChange={(e) => handleRemarksChange(name, e.target.value)}
              />
            )}
          </div>
        ))}

        <button type="submit">Submit Audit</button>
      </form>
    </div>
  );
};

export default FireExtin;
