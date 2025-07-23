import React, { useState } from "react";
import axios from "axios";
import "./NearMissReport.css"; // Optional: add styles here
import { useNavigate } from "react-router-dom";

const NearMissReport = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    witness: "",
    location: "",
    date: "",
    time: "",
    description: "",
    attachment: "",
    unsafeReason: "",
    recommendation: "",
    email: "",
    rootCause: "",
    preventiveAction: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/near-miss-report", formData);
      alert("✅ Near Miss Report submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit report");
    }
  };

  return (
    <div className="form-container">
      <h2>🚨 Near Miss Report</h2>
      <form onSubmit={handleSubmit} className="near-miss-form">
        <input type="text" name="name" placeholder="Name of Reporting Person" required onChange={handleChange} />
        <input type="text" name="witness" placeholder="Name of Witness (if any)" onChange={handleChange} />
        <input type="text" name="location" placeholder="Location of Incident" required onChange={handleChange} />
        <input type="date" name="date" required onChange={handleChange} />
        <input type="time" name="time" required onChange={handleChange} />
        <textarea name="description" placeholder="Describe the potential incident/hazard/concern" required onChange={handleChange}></textarea>
        <input type="text" name="attachment" placeholder="Attachment URL (Image/Video/Document)" onChange={handleChange} />
        <textarea name="unsafeReason" placeholder="Why was unsafe act committed or unsafe condition present?" required onChange={handleChange}></textarea>
        <textarea name="recommendation" placeholder="Recommendations to prevent similar incident" required onChange={handleChange}></textarea>
        <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
        <textarea name="rootCause" placeholder="Root Cause" required onChange={handleChange}></textarea>
        <textarea name="preventiveAction" placeholder="Preventive Action" required onChange={handleChange}></textarea>

        <button type="submit" className="submit-btn">Submit Report</button>
      </form>
    </div>
  );
};

export default NearMissReport;
