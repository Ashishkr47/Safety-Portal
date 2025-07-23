import React, { useState } from "react";
import "./FirstAidAuditForm.css"; // Optional CSS file for styling

const locations = [
  "Admin Office",
  "Production Office",
  "Dispatch Office",
  "Security Office",
];

const items = [
  "Dettol",
  "Betadine",
  "Cotton",
  "Bandage",
  "Scissor",
  "Safety pin",
  "Band Aid",
  "Burnol",
  "Soframycin",
];

const FirstAidAuditForm = () => {
  const [formData, setFormData] = useState(() =>
    locations.reduce((acc, location) => {
      acc[location] = items.map((item, index) => ({
        serial: index + 1,
        itemName: item,
        quantity: "",
        availability: "Yes",
        remarks: "",
      }));
      return acc;
    }, {})
  );

  const handleChange = (location, index, field, value) => {
    const updatedLocationData = [...formData[location]];
    updatedLocationData[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      [location]: updatedLocationData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/submit-firstaid-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Audit form submitted successfully!");
        console.log("Submitted Data:", formData);
      } else {
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="first-aid-form">
      <h1>🩹 First Aid Box Audit Checklist</h1>
      {locations.map((location) => (
        <div key={location} className="location-section">
          <h2>{location}</h2>
          <table className="audit-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Availability</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData[location].map((item, index) => (
                <tr key={index}>
                  <td>{item.serial}</td>
                  <td>{item.itemName}</td>
                  <td>
                    <input
                      type="text"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(location, index, "quantity", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <select
                      value={item.availability}
                      onChange={(e) =>
                        handleChange(location, index, "availability", e.target.value)
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) =>
                        handleChange(location, index, "remarks", e.target.value)
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
      <button type="submit" className="submit-btn">✅ Submit Audit</button>
    </form>
  );
};

export default FirstAidAuditForm;
