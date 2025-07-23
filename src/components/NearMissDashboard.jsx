import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import axios from "axios";

const NearMissDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/near-miss-data")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // Prepare data for visualizations
  const locationCounts = data.reduce((acc, curr) => {
    const loc = curr["Location of incident"];
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});
  const locationChartData = Object.entries(locationCounts).map(([key, val]) => ({ name: key, value: val }));

  return (  
    <div>
      <h2>Near Miss Dashboard</h2>

      <h3>Reports by Location</h3>
      <BarChart width={500} height={300} data={locationChartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#007bff" />
      </BarChart>

      {/* Add pie charts, trend line, and detailed table similarly */}
    </div>
  );
};

export default NearMissDashboard;
