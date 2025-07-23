import React, { useState } from "react";
//import "./FireAlarmPumpHouseForm.css"; // You can style nicely

const equipmentList = [
  { srNo: 1, name: "Smoke Detector Z1", quantity: 4, location: "Admin" },
  { srNo: 2, name: "Smoke Detector Z1", quantity: 1, location: "VP Office" },
  { srNo: 3, name: "Smoke Detector Z1", quantity: 1, location: "Maint Office" },
  { srNo: 4, name: "Smoke Detector Z1", quantity: 1, location: "Plant Head Office" },
  { srNo: 5, name: "Smoke Detector Z1", quantity: 1, location: "PPC Office" },
  { srNo: 6, name: "Smoke Detector Z1", quantity: 1, location: "Server Room" },
  { srNo: 7, name: "Smoke Detector Z2", quantity: 1, location: "LT Panel" },
  { srNo: 8, name: "Smoke Detector Z2", quantity: 1, location: "WCTL Panel" },
  { srNo: 9, name: "Smoke Detector Z2", quantity: 1, location: "Slitting 1 Panel" },
  { srNo: 10, name: "Smoke Detector Z3", quantity: 1, location: "Polishing Panel" },
  { srNo: 11, name: "Smoke Detector Z3", quantity: 1, location: "NCTL Panel" },
  { srNo: 12, name: "Smoke Detector Z1", quantity: 1, location: "Reception" },
  { srNo: 13, name: "Smoke Detector", quantity: 1, location: "Solar Panel" },
  { srNo: 14, name: "Smoke Detector", quantity: 2, location: "Store" },
  { srNo: 15, name: "Smoke Detector", quantity: 1, location: "Store Office" },
  { srNo: 16, name: "Smoke Detector", quantity: 1, location: "Production Office" },
  { srNo: 17, name: "Smoke Detector", quantity: 1, location: "Logistic Office" },
  { srNo: 18, name: "Smoke Detector", quantity: 1, location: "Dispatch Office" },
  { srNo: 19, name: "Smoke Detector", quantity: 2, location: "Slitting 2 Panel" },
  { srNo: 20, name: "Fire Alarm Z1", quantity: 1, location: "Reception" },
  { srNo: 21, name: "Fire Alarm Z2", quantity: 1, location: "Plant Entry Gate" },
  { srNo: 22, name: "Fire Alarm Z3", quantity: 1, location: "Near RO Plant" },
  { srNo: 23, name: "Fire Alarm Z4", quantity: 1, location: "Slitting 2 Packing Area" },
  { srNo: 24, name: "Fire Alarm 25", quantity: 1, location: "Near Cooling Tower SLT2" },
  { srNo: 25, name: "Fire Alarm Z6", quantity: 1, location: "Coil Loading Point 1" },
  { srNo: 26, name: "Jockey Pump 15 HP", quantity: 1, location: "Fire Pump House" },
  { srNo: 27, name: "Main Pump 60 HP", quantity: 1, location: "Fire Pump House" },
  { srNo: 28, name: "DG Set Pump", quantity: 1, location: "Fire Pump House" },
  { srNo: 29, name: "Pressure Guage", quantity: 3, location: "Fire Pump House" },
  { srNo: 30, name: "Diesel Tank Level", quantity: 1, location: "Fire Pump House" },
  { srNo: 31, name: "Auto & Manual Mode", quantity: 1, location: "Fire Pump House" },
  { srNo: 32, name: "Pressure Switch", quantity: 2, location: "Fire Pump House" },
  { srNo: 33, name: "Pressure Release Valve", quantity: 1, location: "Fire Pump House" },
  { srNo: 34, name: "Electrical Panel", quantity: 1, location: "Fire Pump House" },
  { srNo: 35, name: "Tank Water Level Gauge", quantity: 1, location: "Fire Pump House" },
  { srNo: 36, name: "Emengency Light", quantity: 1, location: "Fire Pump House" },
  { srNo: 37, name: "Pump House Shed", quantity: 1, location: "Fire Pump House" },
  { srNo: 38, name: "Pump House Cleaning", quantity: 1, location: "Fire Pump House" },
];

const FireAlarmPumpHouseForm = () => {
  const [formData, setFormData] = useState(
    equipmentList.map((item) => ({
      ...item,
      status: "OK",
      remarks: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedData = [...formData];
    updatedData[index][field] = value;
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/submit-fire-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Fire Alarm & Pump House Audit submitted successfully!");
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fire-alarm-form">
      <h1>🔥 Fire Alarm & Pump House Checklist</h1>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Equipment Name</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status (OK/Not OK)</th>
            <th>Remarks (Optional)</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => (
            <tr key={index}>
              <td>{item.srNo}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
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
      <button type="submit" className="submit-btn">✅ Submit Audit</button>
    </form>
  );
};

export default FireAlarmPumpHouseForm;
