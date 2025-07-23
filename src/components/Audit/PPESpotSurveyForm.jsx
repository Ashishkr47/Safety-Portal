import React, { useState } from "react";
import "./PPESpotSurveyForm.css";

const initialLocations = [
  "WCTL",
  "NCT",
  "Slitting - 1",
  "Slitting - 2",
  "Scotch Bright",
  "Loading area",
  "Wood Cutting Area",
];

const PPESpotSurveyForm = () => {
  const [data, setData] = useState(
    initialLocations.map((location) => ({
      location,
      total: "",
      correct: "",
      incorrect: "",
      percentage: "0.00",
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;

    const total = parseInt(updated[index].total) || 0;
    const correct = parseInt(updated[index].correct) || 0;

    updated[index].percentage =
      total > 0 ? ((correct / total) * 100).toFixed(2) : "0.00";

    setData(updated);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/save-ppe-spot-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("✅ PPE audit submitted successfully!");
    } else {
      alert("❌ Failed to submit PPE audit.");
    }
  } catch (err) {
    console.error("Error submitting:", err);
    alert("❌ Error submitting PPE audit.");
  }
};


  return (
    <form className="ppe-form" onSubmit={handleSubmit}>
      <h2>👷 PPE Spot Survey Audit</h2>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>No. of Persons Worked</th>
            <th>No. Wearing PPEs Correctly</th>
            <th>No. Not Wearing/Incorrect PPE</th>
            <th>% PPE Compliance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.location}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={row.total}
                  onChange={(e) => handleChange(index, "total", e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={row.correct}
                  onChange={(e) =>
                    handleChange(index, "correct", e.target.value)
                  }
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={
                    row.total && row.correct
                      ? Math.max(0, row.total - row.correct)
                      : ""
                  }
                  readOnly
                />
              </td>
              <td>{row.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">✅ Submit</button>
    </form>
  );
};

export default PPESpotSurveyForm;
