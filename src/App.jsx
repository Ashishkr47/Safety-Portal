import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Help from "./components/Help";
import ReportIncident from "./components/ReportIncident";
import UpdateIncident from "./components/UpdateIncident";
import NearMissReport from "./components/NearMissReport";
import AuditSelection from "./components/AuditSelection";
import AuditForm from "./components/AuditForm";
import ForkliftAuditForm from "./components/Audit/ForkliftAuditForm";
import FireExtin from "./components/Audit/FireExtin";
import NearMissDashboard from "./components/NearMissDashboard";
import FirstAidAuditForm from "./components/Audit/FirstAidAuditForm";
import FireAlarmPumpHouseForm from "./components/Audit/FireAlarmPumpHouseForm";
import CraneAuditForm from "./components/Audit/Cranecheck";
import LiftingToolsAuditForm from "./components/Audit/Liftingtool";
import PortableToolsAuditForm from "./components/Audit/Portabletool";
import HoseReelAuditForm from "./components/Audit/Hosereel";
import DieselStorageAuditForm from "./components/Audit/DieselStorageAuditForm";
import MachineGuardingChecklistForm from "./components/Audit/Machineguarding";
import PPESpotSurveyForm from "./components/Audit/PPESpotSurveyForm";
import PressureVesselChecklistForm from "./components/Audit/pressurevessel";
import SafetyBeltAuditForm from "./components/Audit/SafetyBeltAuditForm";
import MasterDashboard from "./components/MasterDashboard";
import Documents from "./components/Document";

import PageLayout from "./components/PageLayout";
import FormLayout from "./components/Formlayout";

import TrainingPage from "./components/TrainingPage";
import TrainingForm from "./components/TrainingForm";
import TrainingDashboard from "./components/TrainingDashboard";
// import TrainingDashboard from "./components/TrainingDashboard";

import About from "./components/About";

// 🔁 Layout Wrapper: applies PageLayout to all pages except `/`
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const noLayoutPaths = ["/"]; // exclude login
  if (noLayoutPaths.includes(location.pathname)) {
    return <>{children}</>;
  }
  return <PageLayout>{children}</PageLayout>;
};

const AppRoutes = () => (
  <LayoutWrapper>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/help" element={<Help />} />
      <Route path="/report-incident" element={<FormLayout><ReportIncident /></FormLayout>} />
      <Route path="/update-incident/:incidentId" element={<FormLayout><UpdateIncident /></FormLayout>} />
      <Route path="/near-miss-report" element={<FormLayout><NearMissReport /></FormLayout>} />
      <Route path="/audit-selection" element={<FormLayout><AuditSelection /></FormLayout>} />
      <Route path="/audit-form/:auditId" element={<FormLayout><AuditForm /></FormLayout>} />
      <Route path="/forklift-check" element={<FormLayout><ForkliftAuditForm /></FormLayout>} />
      <Route path="/fire-extin" element={<FormLayout><FireExtin /></FormLayout>} />
      <Route path="/first-aid" element={<FormLayout><FirstAidAuditForm /></FormLayout>} />
      <Route path="/fire-alarm" element={<FormLayout><FireAlarmPumpHouseForm /></FormLayout>} />
      <Route path="/crane-check" element={<FormLayout><CraneAuditForm /></FormLayout>} />
      <Route path="/lifting-tool" element={<FormLayout><LiftingToolsAuditForm /></FormLayout>} />
      <Route path="/portable-tool" element={<FormLayout><PortableToolsAuditForm /></FormLayout>} />
      <Route path="/hose-reel" element={<FormLayout><HoseReelAuditForm /></FormLayout>} />
      <Route path="/diesel-storage" element={<FormLayout><DieselStorageAuditForm /></FormLayout>} />
      <Route path="/machine" element={<FormLayout><MachineGuardingChecklistForm /></FormLayout>} />
      <Route path="/ppe" element={<FormLayout><PPESpotSurveyForm /></FormLayout>} />
      <Route path="/vessel" element={<FormLayout><PressureVesselChecklistForm /></FormLayout>} />
      <Route path="/safety-belt" element={<FormLayout><SafetyBeltAuditForm /></FormLayout>} />
      <Route path="/near-miss-dashboard" element={<FormLayout><NearMissDashboard /></FormLayout>} />
      <Route path="/master-dashboard" element={<FormLayout><MasterDashboard /></FormLayout>} />
      <Route path="/documents" element={<FormLayout><Documents /></FormLayout>} />
      <Route path="/about" element={<FormLayout><About /></FormLayout>} />

      
<Route path="/training" element={<TrainingPage />} />
<Route path="/training-form" element={<FormLayout><TrainingForm /></FormLayout>} />
<Route path="/training-dashboard" element={<FormLayout><TrainingDashboard /></FormLayout>} />
{/* <Route path="/training-dashboard" element={<FormLayout><TrainingDashboard /></FormLayout>} /> */}
    </Routes>
  </LayoutWrapper>
);



const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
