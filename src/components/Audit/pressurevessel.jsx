import React, { useState } from "react";
// import "./PressureVesselChecklistForm.css";

const checklistData = [
  {
    id: 1,
    vessel: "New air receiver",
    location: "Near main compressor",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 2,
    vessel: "Old air receiver",
    location: "Near main compressor",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 3,
    vessel: "Air receiver",
    location: "NCTL/Flying shear",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 4,
    vessel: "Air receiver",
    location: "Nailer compressor",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 5,
    vessel: "Air receiver",
    location: "WCTL/Flying shear",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 6,
    vessel: "Air receiver",
    location: "WCTL/Stacker",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 7,
    vessel: "GAS CUTTER",
    location: "New shade",
    qty: 1,
    points: ["Leakages", "Torch condition", "Hose pipe condition", "Regulator", "Back pressure valve"],
  },
  {
    id: 8,
    vessel: "LPG Cylinder",
    location: "Canteen",
    qty: 5,
    points: ["Hose pipe condition", "Regulator", "Service Requirement", "Leakages"],
  },
  {
    id: 9,
    vessel: "Air receiver",
    location: "Slitting-2/Power panel",
    qty: 1,
    points: ["Safety valve working", "Leakages", "Pressure gauge condition", "Physical condition"],
  },
  {
    id: 10,
    vessel: "Oxygen cylinder",
    location: "Store",
    qty: 2,
    points: ["Leakages", "Physical condition"],
  },
  {
    id: 11,
    vessel: "D.A Cylinder",
    location: "Store",
    qty: 2,
    points: ["Leakages", "Physical condition"],
  },
  {
    id: 12,
    vessel: "LPG Cylinder",
    location: "Store",
    qty: 5,
    points: ["Leakages", "Physical condition"],
  },
];

const PressureVesselChecklistForm = () => {
  const [formData, setFormData] = useState(
    checklistData.map((item) => ({
      lastInspectionDate: "",
      points: item.points.map(() => ({
        status: "OK",
        remarks: "",
      })),
    }))
  );

  const handleInputChange = (itemIndex, pointIndex, field, value) => {
    const updatedData = [...formData];
    updatedData[itemIndex].points[pointIndex][field] = value;
    setFormData(updatedData);
  };

  const handleDateChange = (itemIndex, date) => {
    const updatedData = [...formData];
    updatedData[itemIndex].lastInspectionDate = date;
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    // Combine checklist info + user input
    const combinedData = checklistData.map((item, i) => ({
      id: item.id,
      vessel: item.vessel,
      location: item.location,
      qty: item.qty,
      lastInspectionDate: formData[i].lastInspectionDate,
      points: item.points.map((point, j) => ({
        checkPoint: point,
        status: formData[i].points[j].status,
        remarks: formData[i].points[j].remarks,
      })),
    }));

    try {
      const res = await fetch("http://localhost:5000/save-pressure-vessel-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ combinedData }),
      });

      if (res.ok) {
        alert("✅ Checklist submitted successfully!");
      } else {
        alert("❌ Submission failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error submitting checklist.");
    }
  };

  return (
    <form className="pv-checklist-form" onSubmit={handleSubmit}>
      <h2>🧪 Pressure Vessels Audit Checklist</h2>
      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>P. Vessel</th>
            <th>Location</th>
            <th>Qty</th>
            <th>Last Inspection Date</th>
            <th>Check Point</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {checklistData.map((item, itemIndex) =>
            item.points.map((point, pointIndex) => (
              <tr key={`${item.id}-${pointIndex}`}>
                {pointIndex === 0 && (
                  <>
                    <td rowSpan={item.points.length}>{item.id}</td>
                    <td rowSpan={item.points.length}>{item.vessel}</td>
                    <td rowSpan={item.points.length}>{item.location}</td>
                    <td rowSpan={item.points.length}>{item.qty}</td>
                    <td rowSpan={item.points.length}>
                      <input
                        type="date"
                        value={formData[itemIndex].lastInspectionDate}
                        onChange={(e) => handleDateChange(itemIndex, e.target.value)}
                      />
                    </td>
                  </>
                )}
                <td>{point}</td>
                <td>
                  <select
                    value={formData[itemIndex].points[pointIndex].status}
                    onChange={(e) =>
                      handleInputChange(itemIndex, pointIndex, "status", e.target.value)
                    }
                  >
                    <option value="OK">OK</option>
                    <option value="Not OK">Not OK</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={formData[itemIndex].points[pointIndex].remarks}
                    onChange={(e) =>
                      handleInputChange(itemIndex, pointIndex, "remarks", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button type="submit">✅ Submit Checklist</button>
    </form>
  );
};

export default PressureVesselChecklistForm;