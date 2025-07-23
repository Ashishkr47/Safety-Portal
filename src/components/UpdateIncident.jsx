import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import "./UpdateIncident.css";

const UpdateIncident = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recommendations: "",
    status: "Closed",
    actionTakenOn: "",
    actionDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`http://localhost:5000/update-incident/${incidentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg("Incident updated successfully!");
        setTimeout(() => navigate("/thank-you"), 2000); // Optional thank-you route
      } else {
        setErrorMsg(result.error || "Failed to update incident.");
      }
    } catch (error) {
      console.error("Error updating incident:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-incident-container">
      <h2>Update Safety Incident</h2>
      {successMsg && <p className="success">{successMsg}</p>}
      {errorMsg && <p className="error">{errorMsg}</p>}

      <form onSubmit={handleSubmit}>
        <label>Recommendations for future prevention:</label>
        <textarea
          name="recommendations"
          value={formData.recommendations}
          onChange={handleChange}
          required
        />

        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>

        <label>Action taken on:</label>
        <input
          type="date"
          name="actionTakenOn"
          value={formData.actionTakenOn}
          onChange={handleChange}
          required
        />

        <label>Describe action taken:</label>
        <textarea
          name="actionDescription"
          value={formData.actionDescription}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Submit Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateIncident;
