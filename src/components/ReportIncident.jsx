import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportIncident.css";

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    issuedBy: "",
    issuedTo: "",
    observedDate: "",
    area: "",
    observationType: "",
    personInvolved: "",
    hazardDescription: "",
    imageLink: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("msalToken");

    try {
      const response = await fetch("http://localhost:5000/report-incident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Incident reported successfully!");
        navigate("/dashboard");
      } else {
        setError(result.error || "Failed to submit the incident.");
      }
    } catch (error) {
      setError("Error connecting to the server.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <h2>Report an Incident</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Issued by (Your Name):</label>
        <input type="text" name="issuedBy" value={formData.issuedBy} onChange={handleChange} required />

        <label>Issued to (Responsible Person):</label>
        <select name="issuedTo" value={formData.issuedTo} onChange={handleChange} required>
          <option value="">Select a person</option>
          <option value="ashishkumar12.ak50@gmail.com">Ashish Kumar</option>
        </select>

        <label>When you observed (Date):</label>
        <input type="date" name="observedDate" value={formData.observedDate} onChange={handleChange} required />

        <label>Area / Location:</label>
        <input type="text" name="area" value={formData.area} onChange={handleChange} required />

        <label>Observation related to:</label>
        <select name="observationType" value={formData.observationType} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Unsafe Act">Unsafe Act</option>
          <option value="Unsafe Condition">Unsafe Condition</option>
        </select>

        <label>Name of person (in case of Unsafe Act):</label>
        <input type="text" name="personInvolved" value={formData.personInvolved} onChange={handleChange} />

        <label>Describe the potential hazard:</label>
        <textarea name="hazardDescription" value={formData.hazardDescription} onChange={handleChange} required />

        <label>Attach supporting photographs (Google Drive/Link):</label>
        <input type="url" name="imageLink" value={formData.imageLink} onChange={handleChange} />

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default ReportIncident;
