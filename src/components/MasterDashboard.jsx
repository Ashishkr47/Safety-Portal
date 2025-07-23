import React, { useEffect, useState } from "react";
import axios from "axios";

const MasterDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [nearMisses, setNearMisses] = useState([]);

  const [issueAuditType, setIssueAuditType] = useState("All");
  const [issueMonth, setIssueMonth] = useState("All");
  const [issueYear, setIssueYear] = useState("All");
  const [issueStatus, setIssueStatus] = useState("All");

  const [incidentMonths, setIncidentMonths] = useState(["All"]);
  const [incidentYear, setIncidentYear] = useState("All");
  const [incidentStatus, setIncidentStatus] = useState("All");
  const [incidentObsType, setIncidentObsType] = useState("All");

  const [nearMissMonth, setNearMissMonth] = useState("All");
  const [nearMissYear, setNearMissYear] = useState("All");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    axios.get("http://localhost:5000/api/not-ok-items")
      .then(res => setIssues(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/api/incident-data")
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/api/near-miss-data")
      .then(res => setNearMisses(res.data))
      .catch(err => console.error(err));
  }, []);

  const matchDate = (dateString, month, year) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const matchMonth = month === "All" || date.getMonth() + 1 === parseInt(month);
    const matchYear = year === "All" || date.getFullYear() === parseInt(year);
    return matchMonth && matchYear;
  };

  // ✅ Centralized Status Logic
const deriveStatus = (issue) => {
  const statusValues = [
    issue.Status,
    issue.Response,
    issue.Value,
    issue.Answer,
    issue.Remarks,
    issue["Describe action taken"],
    issue["Action description"]
  ]
    .map((v) => (v || "").toString().trim().toLowerCase());

  if (statusValues.some((v) => v === "not ok" || v === "no")) return "Open";
  if (statusValues.some((v) => v === "closed")) return "Closed";

  return "Unknown";
};


  const filteredIssues = issues.filter(issue => {
    const date = new Date(issue.AuditDate);

    const matchType = issueAuditType === "All" || issue.AuditType === issueAuditType;
    const matchStatus = issueStatus === "All" || deriveStatus(issue) === issueStatus;
    const matchMonth = issueMonth === "All" || date.getMonth() + 1 === parseInt(issueMonth);
    const matchYear = issueYear === "All" || date.getFullYear() === parseInt(issueYear);

    return matchType && matchStatus && matchMonth && matchYear;
  });

  // ✅ Corrected Closed Issue Count using deriveStatus
  const closedIssues = filteredIssues.filter(issue => deriveStatus(issue) === "Closed").length;

  const isMonthMatch = (date, selectedMonths) => {
    if (selectedMonths.includes("All")) return true;
    const month = date.getMonth() + 1;
    return selectedMonths.map(Number).includes(month);
  };

  const filteredIncidents = incidents.filter(item => {
    const date = new Date(item.Timestamp);
    const matchMonth = isMonthMatch(date, incidentMonths);
    const matchYear = incidentYear === "All" || date.getFullYear() === parseInt(incidentYear);
    const matchStatus = incidentStatus === "All" || item.Status === incidentStatus;
    const matchObsType = incidentObsType === "All" || item["Observation related to"] === incidentObsType;
    return matchMonth && matchYear && matchStatus && matchObsType;
  });

  const raisedCount = incidents.filter(item => {
    const date = new Date(item.Timestamp);
    return isMonthMatch(date, incidentMonths) &&
      (incidentYear === "All" || date.getFullYear() === parseInt(incidentYear));
  }).length;

  const closedCount = incidents.filter(item => {
    const date = new Date(item.Timestamp);
    return isMonthMatch(date, incidentMonths) &&
      (incidentYear === "All" || date.getFullYear() === parseInt(incidentYear)) &&
      item.Status === "Closed";
  }).length;

  const compliancePercent = raisedCount > 0 ? ((closedCount / raisedCount) * 100).toFixed(1) : "0.0";

  const filteredNearMisses = nearMisses.filter(item =>
    matchDate(item.Timestamp, nearMissMonth, nearMissYear)
  );

  const rowColor = (status) => {
    const val = (status || "").toLowerCase();
    return val === "closed" ? "#d4edda" : "#f8d7da";
  };  




  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Safety Master Dashboard</h2>
      {/* 🚨 Not OK Audit Section */}
      <h3>🚨 Audit Issues (Not OK / No)</h3>
      <div style={{ marginBottom: 10 }}>
        <label>Audit Type: </label>
        <select value={issueAuditType} onChange={(e) => setIssueAuditType(e.target.value)}>
          <option value="All">All</option>
          {[...new Set(issues.map(item => item.AuditType).filter(Boolean))].map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Status: </label>
        <select value={issueStatus} onChange={(e) => setIssueStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <label style={{ marginLeft: 20 }}>Month: </label>
        <select value={issueMonth} onChange={(e) => setIssueMonth(e.target.value)}>
          <option value="All">All</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Year: </label>
        <select value={issueYear} onChange={(e) => setIssueYear(e.target.value)}>
          <option value="All">All</option>
          {[...Array(5)].map((_, i) => {
            const year = currentYear - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      {/* ✅ Compliance Summary Box */}
      <div style={{
        padding: "10px",
        marginBottom: "10px",
        background: "#eaf7ea",
        border: "1px solid #b2d8b2",
        borderRadius: "8px",
        display: "inline-block"
      }}>
        <h4>✅ Audit Compliance Summary</h4>
        <p><strong>Total Issues:</strong> {filteredIssues.length}</p>
        <p><strong>Closed:</strong> {closedIssues}</p>
        <p><strong>Compliance:</strong> {filteredIssues.length > 0 ? ((closedIssues / filteredIssues.length) * 100).toFixed(1) + "%" : "0.0%"}</p>
      </div>

      {/* 🚨 Issues Table */}
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "40px" }}>
        <thead>
          <tr>
            <th>Audit Type</th>
            <th>Question / Parameter</th>
            <th>Location / Equipment</th>
            <th>Status</th>
            <th>Responsible</th>
            <th>Audit Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.length === 0 ? (
            <tr><td colSpan="6">✅ No issues found.</td></tr>
          ) : (
            filteredIssues.map((issue, index) => {
              const derivedStatus = deriveStatus(issue);
              return (
                <tr key={index} style={{ backgroundColor: status === "Closed" ? "#d4edda" : "#f8d7da" }}>
                  <td>{issue.AuditType || "Unknown"}</td>
                  <td>{issue.Question || issue.Parameter || issue.Checkpoint || "Unknown"}</td>
                  <td>{issue.Location || issue.Equipment || "N/A"}</td>
                  <td>{derivedStatus}</td>
                  <td>{issue.Responsible || ""}</td>
                  <td>{issue.AuditDate}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>


      {/* 📋 Safety Memo (Incident) */}
      <h3>📋 Safety Memos</h3>
      <div style={{ marginBottom: 10 }}>
        <label>Months: </label>
        <select multiple value={incidentMonths} onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          setIncidentMonths(selected.length === 0 ? ["All"] : selected);
        }} style={{ height: 100, verticalAlign: "top" }}>
          <option value="All">All</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Year: </label>
        <select value={incidentYear} onChange={(e) => setIncidentYear(e.target.value)}>
          <option value="All">All</option>
          {[...Array(5)].map((_, i) => {
            const year = currentYear - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>

        <label style={{ marginLeft: 20 }}>Status: </label>
        <select value={incidentStatus} onChange={(e) => setIncidentStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>

        <label style={{ marginLeft: 20 }}>Observation Type: </label>
        <select value={incidentObsType} onChange={(e) => setIncidentObsType(e.target.value)}>
          <option value="All">All</option>
          <option value="Unsafe Act">Unsafe Act</option>
          <option value="Unsafe Condition">Unsafe Condition</option>
        </select>
      </div>

      <div style={{
        padding: "10px",
        marginBottom: "10px",
        background: "#f3f3f3",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "inline-block"
      }}>
        <h4>✅ Safety Memo Compliance Summary</h4>
        <p><strong>Raised:</strong> {raisedCount}</p>
        <p><strong>Closed:</strong> {closedCount}</p>
        <p><strong>Compliance:</strong> {compliancePercent}%</p>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Issued By</th>
            <th>Area</th>
            <th>Observation Type</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncidents.length === 0 ? (
            <tr><td colSpan="6">No safety memos found.</td></tr>
          ) : (
            filteredIncidents.map((item, idx) => (
              <tr key={idx} style={{ backgroundColor: rowColor(item.Status) }}>
                <td>{item.Timestamp}</td>
                <td>{item["Issued by"]}</td>
                <td>{item["Area/ Location"]}</td>
                <td>{item["Observation related to"]}</td>
                <td>{item["Describe the potential hazard or concern and potential outcome"]}</td>
                <td>{item.Status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ⚠️ Near Miss Section */}
      <h3 style={{ marginTop: 40 }}>⚠️ Near Miss Reports</h3>
      <div style={{ marginBottom: 10 }}>
        <label>Month: </label>
        <select value={nearMissMonth} onChange={(e) => setNearMissMonth(e.target.value)}>
          <option value="All">All</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Year: </label>
        <select value={nearMissYear} onChange={(e) => setNearMissYear(e.target.value)}>
          <option value="All">All</option>
          {[...Array(5)].map((_, i) => {
            const year = currentYear - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Reported By</th>
            <th>Location</th>
            <th>Description</th>
            <th>Unsafe Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredNearMisses.length === 0 ? (
            <tr><td colSpan="5">No near miss reports found.</td></tr>
          ) : (
            filteredNearMisses.map((miss, idx) => (
              <tr key={idx}>
                <td>{miss.Timestamp}</td>
                <td>{miss["Name of reporting person"]}</td>
                <td>{miss["Location of incident"]}</td>
                <td>{miss["Description of potential hazard"]}</td>
                <td>{miss["Unsafe Act/Condition Reason"]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MasterDashboard;
