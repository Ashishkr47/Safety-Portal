import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ForkliftAuditForm.css";

const ForkliftAuditForm = () => {
  const [forkliftNumber, setForkliftNumber] = useState("");
  const [responses, setResponses] = useState({});
  const [responsiblePersons, setResponsiblePersons] = useState({});
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  const checklist = [
    "Check tyre condition of forklift",
    "Check hydraulic oil leakage from forklift",
    "Check forks condition. Like sharp edges, damages",
    "Check condition of Forklift brakes",
    "Check fork self-starting working or not. Battery condition",
    "Check forkdriver License availability",
    "Check fork Horn and Back movement horn",
    "Check mirror availability",
    "Front, Rear Light and indicator is working or not",
    "Running hour meter available or not",
    "Check Oil level meter working or not",
    "Tilting cylinder working condition(Not tilt itself during load)",
    "Load pickup cylinder condition",
    "Forklift Insurance available with validity date",
    "Forklift fitness certificate available with validity date",
  ];

  const handleResponseChange = (q, status) => {
    setResponses({ ...responses, [q]: status });
  };

  const handleResponsibleChange = (q, field, value) => {
    setResponsiblePersons({
      ...responsiblePersons,
      [q]: { ...responsiblePersons[q], [field]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      forkliftNumber,
      checklist: checklist.map((q) => ({
        question: q,
        response: responses[q] || "",
        responsiblePerson: responses[q] === "Not OK" ? responsiblePersons[q] : null,
      })),
    };

    fetch("http://localhost:5000/submit-audit1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Forklift Audit Submitted Successfully!");
        navigate("/"); // Redirect to home page after submission
      })
      .catch((err) => {
        console.error("Submit error:", err);
        alert("Submission failed.");
      });
  };

  return (
    <div className="forklift-audit-container">
      <h2>Forklift Audit Checklist</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Forklift Number:
          <select
            value={forkliftNumber}
            onChange={(e) => setForkliftNumber(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>

        {checklist.map((q, idx) => (
          <div key={idx} className="audit-question">
            <label>
              {idx + 1}. {q}
            </label>
            <select
              value={responses[q] || ""}
              onChange={(e) => handleResponseChange(q, e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="OK">OK</option>
              <option value="Not OK">Not OK</option>
            </select>

            {responses[q] === "Not OK" && (
              <div className="responsible-info">
                <input
                  type="text"
                  placeholder="Responsible Person Name"
                  value={responsiblePersons[q]?.name || ""}
                  onChange={(e) =>
                    handleResponsibleChange(q, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Responsible Person Email"
                  value={responsiblePersons[q]?.email || ""}
                  onChange={(e) =>
                    handleResponsibleChange(q, "email", e.target.value)
                  }
                  required
                />
              </div>
            )}
          </div>
        ))}
        <button type="submit">Submit Audit</button>
      </form>
    </div>
  );
};

export default ForkliftAuditForm;
