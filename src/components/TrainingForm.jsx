import React, { useState } from "react";
import axios from "axios";
import "./Trainingform.css";

const TrainingForm = () => {
  const [onRollCount, setOnRollCount] = useState(0);
  const [offRollCount, setOffRollCount] = useState(0);
  const [onRollDetails, setOnRollDetails] = useState([]);
  const [offRollDetails, setOffRollDetails] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalHours, setTotalHours] = useState(0);

  const handleGenerateFields = () => {
    setOnRollDetails(Array.from({ length: Number(onRollCount) }, () => ({ name: "", department: "" })));
    setOffRollDetails(Array.from({ length: Number(offRollCount) }, () => ({ name: "", department: "" })));
  };

  const handleDetailChange = (type, index, key, value) => {
    const update = [...(type === "on" ? onRollDetails : offRollDetails)];
    update[index][key] = value;
    type === "on" ? setOnRollDetails(update) : setOffRollDetails(update);
  };

  const calculateTrainingHours = () => {
    if (!startTime || !endTime) return 0;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    if (end <= start) return 0;

    const durationInHours = (end - start) / 60;
    const totalParticipants = Number(onRollCount) + Number(offRollCount);
    const totalTrainingHours = durationInHours * totalParticipants;

    return totalTrainingHours.toFixed(2); // 2 decimal places
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trainingDuration = calculateTrainingHours();

    const formData = {
      trainingName: e.target.trainingName.value,
      date: e.target.date.value,
      trainerName: e.target.trainerName.value,
      onRoll: onRollDetails,
      offRoll: offRollDetails,
      startTime,
      endTime,
      totalParticipants: Number(onRollCount) + Number(offRollCount),
      trainingDuration,
    };

  axios.post("http://localhost:5000/api/training", formData)
    .then(res => alert("✅ Training data saved to Excel."))
    .catch(err => {
      console.error(err);
      alert("❌ Failed to save training data.");
    });
  };

  return (
    <div className="form-container">
      <h2>📝 Fill Training Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Training Name</label>
          <input type="text" name="trainingName" placeholder="e.g. Fire Safety Training" required />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" required />
        </div>

        <div className="form-group">
          <label>Trainer Name</label>
          <input type="text" name="trainerName" placeholder="Enter trainer's name" required />
        </div>

        <div className="form-group">
          <label>Total On-Roll Participants</label>
          <input
            type="number"
            min="0"
            value={onRollCount}
            onChange={(e) => setOnRollCount(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>

        <div className="form-group">
          <label>Total Off-Roll Participants</label>
          <input
            type="number"
            min="0"
            value={offRollCount}
            onChange={(e) => setOffRollCount(e.target.value)}
            placeholder="e.g. 3"
          />
        </div>

        <button type="button" className="generate-btn" onClick={handleGenerateFields}>
          ➕ Generate Participant Fields
        </button>

        {onRollDetails.length > 0 && (
          <div className="participant-section">
            <h3>👥 On-Roll Participants</h3>
            {onRollDetails.map((person, idx) => (
              <div className="participant-entry" key={idx}>
                <input
                  type="text"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) => handleDetailChange("on", idx, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={person.department}
                  onChange={(e) => handleDetailChange("on", idx, "department", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        {offRollDetails.length > 0 && (
          <div className="participant-section">
            <h3>👥 Off-Roll Participants</h3>
            {offRollDetails.map((person, idx) => (
              <div className="participant-entry" key={idx}>
                <input
                  type="text"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) => handleDetailChange("off", idx, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={person.department}
                  onChange={(e) => handleDetailChange("off", idx, "department", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Start Time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>📈 Total Training Hours:</label>
          <input type="text" readOnly value={calculateTrainingHours()} />
        </div>

        <button type="submit" className="submit-btn">✅ Submit</button>
      </form>
    </div>
  );
};

export default TrainingForm;
