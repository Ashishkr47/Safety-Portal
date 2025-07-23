import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./TrainingDashboard.css";

const TrainingDashboard = () => {
  const [trainings, setTrainings] = useState([]);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trainings");
      setTrainings(res.data);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN");
    } catch {
      return dateStr;
    }
  };

  const filteredData = trainings.filter((item) => {
    const matchSearch =
      item.trainingName?.toLowerCase().includes(search.toLowerCase()) ||
      item.trainerName?.toLowerCase().includes(search.toLowerCase());

    const dateObj = new Date(item.date);
    const matchMonth =
      monthFilter === "All" || dateObj.getMonth() + 1 === parseInt(monthFilter);
    const matchYear =
      yearFilter === "All" || dateObj.getFullYear() === parseInt(yearFilter);

    return matchSearch && matchMonth && matchYear;
  });

  const totalTrainings = filteredData.length;
  const totalParticipants = filteredData.reduce(
    (acc, item) => acc + Number(item.totalParticipants || 0),
    0
  );
  const totalHours = filteredData.reduce(
    (acc, item) => acc + Number(item.totalTrainingHours || 0),
    0
  );

  // Generate monthly training count for chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("default", { month: "short" });
    const count = trainings.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === i && date.getFullYear() === currentYear;
    }).length;
    return { month, count };
  });

  return (
    <div className="training-dashboard" style={{ padding: "20px" }}>
      <h2>📊 Training Dashboard</h2>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search by Training or Trainer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "250px" }}
        />

        <label>Month: </label>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{ marginRight: "20px" }}
        >
          <option value="All">All</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <label>Year: </label>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="All">All</option>
          {[...Array(5)].map((_, i) => {
            const year = currentYear - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        <div className="card">
          <h4>Total Trainings</h4>
          <p>{totalTrainings}</p>
        </div>
        <div className="card">
          <h4>Total Participants</h4>
          <p>{totalParticipants}</p>
        </div>
        <div className="card">
          <h4>Total Training Hours</h4>
          <p>{totalHours}</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 300, marginBottom: "30px" }}>
        <ResponsiveContainer>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Trainings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Training Name</th>
            <th>Date</th>
            <th>Trainer</th>
            <th>Start</th>
            <th>End</th>
            <th>Total Participants</th>
            <th>Total Training Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="7">No training records found.</td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.trainingName}</td>
                <td>{formatDate(item.date)}</td>
                <td>{item.trainerName}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
                <td>{item.totalParticipants}</td>
                <td>{item.totalTrainingHours}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingDashboard;
