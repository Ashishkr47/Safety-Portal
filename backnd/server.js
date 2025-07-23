const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const XLSX = require("xlsx");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json());
const excelFilePath = "incidents.xlsx";
const sheetName = "Incidents";
const nearMissExcelPath = "near_miss_reports.xlsx";
const nearMissSheet = "NearMisses";
const auditExcelPath = "audit_data.xlsx";

// app.get("/api/audit-counts", (req, res) => {
//   const filePath = path.join(__dirname, "audit_data.xlsx");

//   if (!fs.existsSync(filePath)) {
//     return res.json({});
//   }

//   const workbook = XLSX.readFile(filePath);
//   const sheets = workbook.SheetNames;

//   const auditCounts = {};

//   sheets.forEach((sheet) => {
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

//     const uniqueMap = new Map();

//     data.forEach((row) => {
//       const id = row.AuditID || row.ID || row["ForkliftNumber"] || row["Location"];
//       const date = row.AuditDate || row.Timestamp || "";

//       if (id) {
//         if (!uniqueMap.has(id)) {
//           uniqueMap.set(id, { AuditID: id, AuditDate: date });
//         }
//       }
//     });

//     auditCounts[sheet] = Array.from(uniqueMap.values());
//   });

//   res.json(auditCounts);
// });


// ========= Training Form Submission =========
app.get("/api/trainings", (req, res) => {
  const trainingFile = path.join(__dirname, "training_data.xlsx");

  if (!fs.existsSync(trainingFile)) {
    return res.json([]);
  }

  const workbook = XLSX.readFile(trainingFile);
  const result = [];

  workbook.SheetNames.forEach(sheetName => {
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    const flat = (label) => {
      const row = sheet.find(r => r[0] && r[0].toString().toLowerCase().includes(label.toLowerCase()));
      return row ? row[1] : "";
    };

    const totalParticipants = flat("Total Participants");
    const totalTrainingHours = flat("Total Training Hours");

    result.push({
      trainingName: flat("Training Name"),
      date: flat("Date"),
      trainerName: flat("Trainer Name"),
      startTime: flat("Start Time"),
      endTime: flat("End Time"),
      totalParticipants,
      totalTrainingHours,
    });
  });

  res.json(result);
});


app.get("/api/not-ok-items", (req, res) => {
  const filePath = path.join(__dirname, "audit_data.xlsx");
  if (!fs.existsSync(filePath)) return res.json([]);

  const workbook = XLSX.readFile(filePath);
  const result = [];

  workbook.SheetNames.forEach(sheet => {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    data.forEach(row => {
      const statusValue = row.Status || row.Response || row["Audit Status"] || "";
      const lowerStatus = statusValue.toString().toLowerCase();

      if (lowerStatus.includes("not ok") || lowerStatus === "no") {
        result.push({
          AuditType: sheet,
          Question: row.Question || row.Parameter || row.Checkpoint || "Unknown",
          Location: row.Location || row.ForkliftNumber || row.CraneID || row.Equipment || "Unknown",
          Responsible: row.Responsible || "",
          AuditDate: row.AuditDate || "",
          Status: statusValue,
        });
      }
    });
  });

  res.json(result);
});











// Optional: Save last audit date function
const lastAuditDatesFile = path.join(__dirname, "lastAuditDates.json");

function saveLastAuditDate(auditName) {
  let lastAuditDates = {};
  if (fs.existsSync(lastAuditDatesFile)) {
    lastAuditDates = JSON.parse(fs.readFileSync(lastAuditDatesFile));
  }
  lastAuditDates[auditName] = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(lastAuditDatesFile, JSON.stringify(lastAuditDates, null, 2));
}

///for audit
function saveAuditToSheet(sheetName, newDataRows) {
  const filePath = path.join(__dirname, "audit_data.xlsx");

  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const existingData = workbook.Sheets[sheetName]
    ? XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    : [];

  // Convert 2D array (with headers as first row) to objects
  const [headers, ...rows] = newDataRows;
  const newObjects = rows.map((row) =>
    headers.reduce((obj, key, index) => {
      obj[key] = row[index];
      return obj;
    }, {})
  );

  const combinedData = [...existingData, ...newObjects];
  const worksheet = XLSX.utils.json_to_sheet(combinedData);

  workbook.Sheets[sheetName] = worksheet;
  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
}

///forklift
////forklift
app.post("/submit-audit1", (req, res) => {
  try {
    const data = req.body;

    const auditId = uuidv4(); // ✅ Unique ID per submission
    const auditDate = new Date().toISOString().split("T")[0]; // ✅ YYYY-MM-DD

    const checklistEntries = data.checklist.map((item) => ({
      AuditID: auditId,
      AuditDate: auditDate,
      ForkliftNumber: data.forkliftNumber,
      Question: item.question,
      Response: item.response,
      ResponsiblePersonName:
        item.response === "Not OK" ? item.responsiblePerson?.name || "" : "",
      ResponsiblePersonEmail:
        item.response === "Not OK" ? item.responsiblePerson?.email || "" : "",
    }));

    const filePath = path.join(__dirname, "audit_data.xlsx");
    let workbook;

    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
    } else {
      workbook = XLSX.utils.book_new();
    }

    const sheetName = "Forklift Audit";
    const existingData = workbook.Sheets[sheetName]
      ? XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
      : [];

    const updatedData = [...existingData, ...checklistEntries];

    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets[sheetName] = worksheet;

    if (!workbook.SheetNames.includes(sheetName)) {
      workbook.SheetNames.push(sheetName);
    }

    XLSX.writeFile(workbook, filePath);

    saveLastAuditDate("Forklift");

    res.json({ message: "✅ Forklift audit saved successfully" });
  } catch (error) {
    console.error("❌ Error saving forklift audit:", error);
    res.status(500).json({ error: "Failed to save forklift audit" });
  }
});

  
  
  // POST: Fire Extinguisher Audit
app.post("/submit-audit2", (req, res) => {
  try {
    const raw = req.body;
    const data = Array.isArray(raw) ? raw : [raw]; // ✅ handle both array or single object

    const auditId = uuidv4();
    const auditDate = new Date().toISOString().split("T")[0];

    const formattedData = data.map((item) => ({
      AuditID: auditId,
      AuditDate: auditDate,
      Location: item.location || "",
      Type: item.type || "",
      Capacity: item.capacity || "",
      DischargeHose: item.dischargeHose || "",
      DischargeNozzle: item.dischargeNozzle || "",
      SafetyPinClip: item.safetyPinClip || "",
      IdentTag: item.identTag || "",
      ProperMountClean: item.properMountClean || "",
      Remarks: item.remarks || "",
    }));

    const headers = [
      "AuditID",
      "AuditDate",
      "Location",
      "Type",
      "Capacity",
      "DischargeHose",
      "DischargeNozzle",
      "SafetyPinClip",
      "IdentTag",
      "ProperMountClean",
      "Remarks",
    ];

    const dataWithHeaders = [
      headers,
      ...formattedData.map((item) => [
        item.AuditID,
        item.AuditDate,
        item.Location,
        item.Type,
        item.Capacity,
        item.DischargeHose,
        item.DischargeNozzle,
        item.SafetyPinClip,
        item.IdentTag,
        item.ProperMountClean,
        item.Remarks,
      ]),
    ];

    saveAuditToSheet("Fire Extinguisher Audit", dataWithHeaders);

    res.json({ message: "✅ Fire extinguisher audit saved successfully." });
  } catch (error) {
    console.error("❌ Error saving fire extinguisher audit:", error);
    res.status(500).json({ error: "Failed to save fire extinguisher audit" });
  }
});





  /// first Aid

app.post("/submit-firstaid-audit", (req, res) => {
  try {
    const data = req.body;
    const auditId = uuidv4(); // 🔐 Unique ID
    const auditDate = new Date().toISOString().split("T")[0]; // 📅 Date as YYYY-MM-DD

    const flattenedData = [];

    for (const location in data) {
      data[location].forEach((item) => {
        flattenedData.push({
          AuditID: auditId,
          AuditDate: auditDate,
          Location: location,
          "S.No": item.serial,
          "Item Name": item.itemName,
          Quantity: item.quantity,
          Availability: item.availability,
          Remarks: item.remarks || "",
        });
      });
    }

    // Save to Excel
    saveAuditToSheet("First Aid Box Audit", flattenedData);

    // Update last audit date
    saveLastAuditDate("FirstAidBoxes");

    res.json({ message: "✅ First aid audit saved successfully" });
  } catch (error) {
    console.error("❌ Error saving First Aid audit:", error);
    res.status(500).json({ error: "Failed to save first aid audit" });
  }
});


  


// POST: EOT Crane Checklist Audit
app.post("/submit-eot-crane-audit", (req, res) => {
  try {
    const data = req.body;
    const auditId = uuidv4();
    const auditDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const flattenedData = data.map((item) => ({
      AuditID: auditId,
      AuditDate: auditDate,
      Section: item.section,
      Parameter: item.parameter,
      Status: item.status,
      Remarks: item.remarks || "",
    }));

    // Save to Excel
    saveAuditToSheet("EOT Crane Checklist", flattenedData);

    // Update last audit date
    saveLastAuditDate("EOTCraneInspection");

    res.json({ message: "✅ EOT Crane audit saved successfully" });
  } catch (error) {
    console.error("❌ Error saving EOT Crane audit:", error);
    res.status(500).json({ error: "Failed to save EOT Crane audit" });
  }
});




// 🚨 Diesel Storage Audit - Save to 'DieselStorage' sheet
app.post("/api/save-diesel-audit", (req, res) => {
  const { auditData, timestamp } = req.body;
  const auditId = uuidv4();
  const auditDate = new Date().toISOString().split("T")[0];

  const formattedData = auditData.map((item, index) => ({
    AuditID: auditId,
    AuditDate: auditDate,
    Timestamp: timestamp,
    SNo: index + 1,
    Checkpoint: item.checkpoint,
    Status: item.status,
    Remarks: item.remarks,
  }));

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "DieselStorage";
  let sheetData = [];
  if (workbook.Sheets[sheetName]) {
    const existing = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheetData = [...existing, ...formattedData];
  } else {
    sheetData = formattedData;
  }

  const newSheet = XLSX.utils.json_to_sheet(sheetData);
  workbook.Sheets[sheetName] = newSheet;
  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
  saveLastAuditDate("DieselandOilStorage");

  res.json({ message: "✅ Diesel Storage Audit saved successfully." });
});



// 🚨 Hose Reel Audit - Save to 'HoseReel' sheet
app.post("/api/hose-reel-audit", (req, res) => {
  const { auditData, timestamp } = req.body;

  const auditId = uuidv4(); // Unique ID for this submission
  const auditDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const formattedData = auditData.map((item, index) => ({
    AuditID: auditId,
    AuditDate: auditDate,
    Timestamp: timestamp,
    SNo: index + 1,
    Checkpoint: item.Checkpoint,
    Status: item.Status,
    Remarks: item.Remarks || "",
  }));

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "HoseReel";
  let sheetData = [];

  if (workbook.Sheets[sheetName]) {
    const existing = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheetData = [...existing, ...formattedData];
  } else {
    sheetData = formattedData;
  }

  const newSheet = XLSX.utils.json_to_sheet(sheetData);
  workbook.Sheets[sheetName] = newSheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
  saveLastAuditDate("HoseReel&FireHydrant");

  res.json({ message: "✅ Hose Reel Audit saved successfully." });
});




////Lifting tool
app.post("/save-lifting-audit", (req, res) => {
  const auditData = req.body;
  const timestamp = new Date().toISOString();
  const auditDate = timestamp.split("T")[0];
  const auditId = uuidv4(); // Generate unique audit ID

  const formattedData = auditData.map((item, index) => ({
    AuditID: auditId,
    AuditDate: auditDate,
    Timestamp: timestamp,
    SNo: item.serial,
    Name: item.name,
    Capacity: item.capacity,
    Location: item.location,
    Status: item.status,
    Remarks: item.remarks || "",
  }));

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  // Read or create workbook
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "LiftingTools";
  let sheetData = [];

  if (workbook.Sheets[sheetName]) {
    const existing = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheetData = [...existing, ...formattedData];
  } else {
    sheetData = formattedData;
  }

  const newSheet = XLSX.utils.json_to_sheet(sheetData);
  workbook.Sheets[sheetName] = newSheet;
  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
  saveLastAuditDate("LiftingTools");

  res.json({ message: "✅ Lifting Tools Audit saved successfully." });
});





////MACHINEGUARDINg

app.post("/save-machine-guarding", (req, res) => {
  const { timestamp, auditData } = req.body;

  if (!Array.isArray(auditData)) {
    return res.status(400).json({ error: "Invalid audit data" });
  }

  const auditId = uuidv4();
  const auditDate = new Date().toISOString().split("T")[0];

  const formattedData = auditData.map((item, index) => ({
    AuditID: auditId,
    AuditDate: auditDate,
    Timestamp: timestamp,
    SNo: index + 1,
    Checkpoint: item.checkpoint,
    Status: item.status || "Not Filled",
    Remarks: item.remarks || "",
  }));

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "MachineGuarding";
  let sheetData = [];

  if (workbook.Sheets[sheetName]) {
    const existingData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheetData = [...existingData, ...formattedData];
  } else {
    sheetData = formattedData;
  }

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  workbook.Sheets[sheetName] = worksheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);

  saveLastAuditDate("MachineGuarding");

  res.json({ message: "✅ Machine Guarding Checklist saved successfully." });
});




///////PORTABLE tool
app.post("/save-portable-tools-audit", (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString();
  const auditDate = timestamp.split("T")[0];
  const auditId = uuidv4();

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  const flattenedData = [];

  data.forEach((tool) => {
    tool.checklist.forEach((item) => {
      flattenedData.push({
        AuditID: auditId,
        AuditDate: auditDate,
        Timestamp: timestamp,
        SNo: tool.serial,
        Tool: tool.name,
        Qty: tool.qty,
        Location: tool.location,
        Parameter: item.parameter,
        Status: item.status || "Not Filled",
        Remarks: item.remarks || "",
      });
    });
  });

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "PortableTools";
  let sheetData = [];

  if (workbook.Sheets[sheetName]) {
    const existing = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheetData = [...existing, ...flattenedData];
  } else {
    sheetData = flattenedData;
  }

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  workbook.Sheets[sheetName] = worksheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
  saveLastAuditDate("PortableTools");
  saveLastAuditDate("PortableElectricTools");

  res.json({ message: "✅ Portable Tools Audit saved successfully." });
});




//////PPE
app.post("/save-ppe-spot-survey", (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString();
  const auditDate = timestamp.split("T")[0];
  const auditId = uuidv4();

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  const formattedData = data.map((entry) => ({
    AuditID: auditId,
    AuditDate: auditDate,
    Timestamp: timestamp,
    Location: entry.location,
    TotalPersons: entry.total || 0,
    CorrectlyWorn: entry.correct || 0,
    IncorrectlyWorn: (entry.total || 0) - (entry.correct || 0),
    CompliancePercentage: `${entry.percentage || 0}%`,
  }));

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "PPEAudit";
  let sheetData = [];

  if (workbook.Sheets[sheetName]) {
    const existing = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    sheetData = [...existing, ...formattedData];
  } else {
    sheetData = formattedData;
  }

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  workbook.Sheets[sheetName] = worksheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
  saveLastAuditDate("PPESpotSurvey");

  res.json({ message: "✅ PPE Spot Survey saved successfully." });
});



///////pressurevess

app.post("/save-pressure-vessel-checklist", (req, res) => {
  const combinedData = req.body.combinedData;
  if (!Array.isArray(combinedData)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  const auditId = uuidv4();
  const timestamp = new Date().toISOString();
  const auditDate = timestamp.split("T")[0];

  const rows = [];

  combinedData.forEach((item) => {
    item.points.forEach((point) => {
      rows.push({
        AuditID: auditId,
        AuditDate: auditDate,
        Timestamp: timestamp,
        "Sr No.": item.id,
        "P. Vessel": item.vessel,
        Location: item.location,
        Qty: item.qty,
        "Last Inspection Date": item.lastInspectionDate || "",
        "Check Point": point.checkPoint,
        Status: point.status,
        Remarks: point.remarks || "",
      });
    });
  });

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "PressureVesselChecklist";
  let existingData = [];

  if (workbook.Sheets[sheetName]) {
    existingData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  const updatedData = [...existingData, ...rows];
  const worksheet = XLSX.utils.json_to_sheet(updatedData);
  workbook.Sheets[sheetName] = worksheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);
  saveLastAuditDate("PressureVessel");

  res.json({ message: "✅ Pressure Vessel Checklist saved successfully!" });
});




////////safetyBElT
app.post("/save-safety-belt-audit", (req, res) => {
  const data = req.body.formData;

  const checkpoints = [
    "Hardware: Inspect for damage, distortion, sharp edges, burrs, cracks, and corrosion.",
    "Webbing: Inspect for cuts, burns, tears, frays, or discoloration.",
    "Stitching: Check for pulled or cut stitches.",
    "Lanyard Rope: Inspect for yarn pulls, abrasion, or soiling.",
    "Energy Absorbing Component: Look for elongation or tears.",
    "Hook: Check for cracks, deformities, and locking mechanism.",
  ];

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid form data" });
  }

  const auditId = uuidv4();
  const timestamp = new Date().toISOString();
  const auditDate = timestamp.split("T")[0];
  const rows = [];

  data.forEach((belt) => {
    belt.results.forEach((result, index) => {
      rows.push({
        AuditID: auditId,
        AuditDate: auditDate,
        Timestamp: timestamp,
        "Belt No": belt.beltNo,
        Location: belt.location,
        "Check Point": checkpoints[index],
        Status: result.status,
        Remarks: result.remark,
      });
    });
  });

  const filePath = path.join(__dirname, "audit_data.xlsx");
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "SafetyBeltAudit";
  let existingData = [];

  if (workbook.Sheets[sheetName]) {
    existingData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  const updatedData = [...existingData, ...rows];
  const worksheet = XLSX.utils.json_to_sheet(updatedData);
  workbook.Sheets[sheetName] = worksheet;

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, filePath);

  saveLastAuditDate("SafetyBelt/FallProtection");

  res.json({ message: "✅ Safety Belt Audit saved successfully!" });
});


///firelarm
app.post("/submit-fire-audit", (req, res) => {
  try {
    const data = req.body;

    const auditId = uuidv4(); // Unique ID for this submission
    const timestamp = new Date().toISOString();
    const auditDate = timestamp.split("T")[0];

    const formattedData = data.map((item) => ({
      AuditID: auditId,
      AuditDate: auditDate,
      Timestamp: timestamp,
      "Sr No": item.srNo,
      "Equipment Name": item.name,
      Quantity: item.quantity,
      Location: item.location,
      Status: item.status,
      Remarks: item.remarks || "",
    }));

    const filePath = path.join(__dirname, "audit_data.xlsx");
    let workbook;

    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
    } else {
      workbook = XLSX.utils.book_new();
    }

    const sheetName = "FireAlarmPumpHouse";
    let existingData = [];

    if (workbook.Sheets[sheetName]) {
      existingData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    const combinedData = [...existingData, ...formattedData];
    const worksheet = XLSX.utils.json_to_sheet(combinedData);

    workbook.Sheets[sheetName] = worksheet;

    if (!workbook.SheetNames.includes(sheetName)) {
      workbook.SheetNames.push(sheetName);
    }

    XLSX.writeFile(workbook, filePath);

    // ✅ Save the last audit date
    saveLastAuditDate("FirePumpHouse,Alarm&SmokeDetectors");

    res.json({ message: "✅ Fire Alarm & Pump House Audit saved successfully." });
  } catch (error) {
    console.error("❌ Error saving Fire Alarm audit:", error);
    res.status(500).json({ error: "Failed to save Fire Alarm audit" });
  }
});






 

// Send email using Microsoft Graph API
const sendEmailViaGraph = async(userToken, incidentId, incident) => {
    const updateLink = `http://localhost:3000/update-incident/${incidentId}`;

    try {
        const emailData = {
            message: {
                subject: "New Safety Incident Reported",
                body: {
                    contentType: "Text",
                    content: `Hello,

A new safety incident has been reported.

Reported By: ${incident["Issued by"]}
Area: ${incident["Area/ Location"]}
Description: ${incident["Describe the potential hazard or concern and potential outcome"]}
Observation Date: ${incident["When you observed"]}

Please review and take necessary action using the following link:
${updateLink}

Regards,
Safety Portal`,
                },
                toRecipients: [{
                    emailAddress: {
                        address: incident["Issued to"],
                    },
                }, ],
            },
            saveToSentItems: true,
        };

        await axios.post("https://graph.microsoft.com/v1.0/me/sendMail", emailData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Error sending email via Microsoft Graph:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
};

// Read existing Excel
const readExcelData = () => {
    if (fs.existsSync(excelFilePath)) {
        const workbook = XLSX.readFile(excelFilePath);
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet);
    }
    return [];
};

// Write Excel
const writeExcelData = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, excelFilePath);
};

// Report Incident API
app.post("/report-incident", async(req, res) => {
    try {
        const {
            issuedBy,
            issuedTo,
            observedDate,
            area,
            observationType,
            personInvolved,
            hazardDescription,
            imageLink,
        } = req.body;

        const userToken = req.headers.authorization ?.split(" ")[1];
        if (!userToken) return res.status(401).json({ error: "Unauthorized. No token." });

        const now = new Date();
        const incidentId = uuidv4();

        const incident = {
            incidentId,
            Timestamp: now.toLocaleString(),
            "Issued by": issuedBy,
            "Issued to": issuedTo,
            "When you observed": observedDate,
            "Area/ Location": area,
            "Observation related to": observationType,
            "Name of person in case Unsafe Act reporting": personInvolved,
            "Describe the potential hazard or concern and potential outcome": hazardDescription,
            "Attach supporting photographs if any": imageLink,
            "Recommendations for future prevention": "",
            Status: "Pending",
            "Action taken on": "",
            "Describe action taken": "",
        };

        const data = readExcelData();
        data.push(incident);
        writeExcelData(data);

        await sendEmailViaGraph(userToken, incidentId, incident);

        res.json({ message: "Incident reported and email sent successfully." });
    } catch (error) {
        console.error("❌ Error in /report-incident:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Get Incident Report Data from incidents.xlsx
app.get("/api/incident-data", (req, res) => {
  try {
    const filePath = path.join(__dirname, "incidents.xlsx");  // Note the different file name
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Usually the first sheet if you don't know the name
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    res.json(data);
  } catch (error) {
    console.error("Error reading incidents.xlsx:", error);
    res.status(500).json({ error: "Failed to load incident data" });
  }
});


// API to submit Near Miss Report
app.post("/near-miss-report", (req, res) => {
    try {
        const {
            name,
            witness,
            location,
            date,
            time,
            description,
            attachment,
            unsafeReason,
            recommendation,
            email,
            rootCause,
            preventiveAction
        } = req.body;

        const timestamp = new Date().toLocaleString();

        const report = {
            Timestamp: timestamp,
            "Name of reporting person": name,
            "Name of Witness": witness,
            "Location of incident": location,
            "Date of Incident": date,
            "Time of Incident": time,
            "Description of potential hazard": description,
            "Attachment": attachment,
            "Unsafe Act/Condition Reason": unsafeReason,
            "Recommendations": recommendation,
            "Email Address": email,
            "Root cause": rootCause,
            "Preventive action": preventiveAction,
        };

        let data = [];
        if (fs.existsSync(nearMissExcelPath)) {
            const workbook = XLSX.readFile(nearMissExcelPath);
            const worksheet = workbook.Sheets[nearMissSheet];
            data = XLSX.utils.sheet_to_json(worksheet);
        }

        data.push(report);

        const newSheet = XLSX.utils.json_to_sheet(data);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, nearMissSheet);
        XLSX.writeFile(newWorkbook, nearMissExcelPath);

        res.json({ message: "Near Miss Report submitted successfully." });
    } catch (error) {
        console.error("Error in near-miss-report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/api/near-miss-data", (req, res) => {
  try {
      if (!fs.existsSync(nearMissExcelPath)) {
          return res.json([]);
      }

      const workbook = XLSX.readFile(nearMissExcelPath);
      const worksheet = workbook.Sheets[nearMissSheet];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      res.json(data);
  } catch (error) {
      console.error("Error fetching near miss data:", error);
      res.status(500).json({ error: "Failed to fetch near miss data" });
  }
});



// Update Incident API
app.post("/update-incident/:incidentId", (req, res) => {
    try {
        const { incidentId } = req.params;
        const { recommendations, status, actionTakenOn, actionDescription } = req.body;

        const data = readExcelData();
        const index = data.findIndex((row) => row.incidentId === incidentId);

        if (index === -1) return res.status(404).json({ error: "Incident not found." });

        data[index]["Recommendations for future prevention"] = recommendations;
        data[index].Status = status;
        data[index]["Action taken on"] = actionTakenOn;
        data[index]["Describe action taken"] = actionDescription;

        writeExcelData(data);

        res.json({ message: "Incident updated successfully." });
    } catch (error) {
        console.error("❌ Error in /update-incident:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 

// Health check
app.get("/api/check-status", (req, res) => {
    res.json({ status: "OK" });
});

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});