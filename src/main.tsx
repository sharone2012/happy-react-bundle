import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MillProvider } from "./contexts/MillContext";
import App from "./App.jsx";
import LabAnalysisV2 from "./pages/LabAnalysisV2.jsx";
import S3Landing from "./pages/S3Landing.jsx";
import S3ABioLibrary from "./pages/S3ABioLibrary.jsx";
import S1Hub from "./pages/S1Hub.jsx";
import S1Efb from "./pages/S1Efb.jsx";
import S1Opdc from "./pages/S1Opdc.jsx";
import S1Pos from "./pages/S1Pos.jsx";
import S1Combined from "./pages/S1Combined.jsx";
import S1Engineering from "./pages/S1Engineering";
import S1EngineeringPrint from "./pages/S1EngineeringPrint.jsx";
import S1Financials from "./pages/S1Financials";
import S0ResidueSelector from "./pages/S0ResidueSelector.jsx";
import CFI_AG_Management_Planning_Calculator from "./CFI_AG_Management_Planning_Calculator.jsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MillProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/lab" element={<LabAnalysisV2 />} />
        <Route path="/s3" element={<S3Landing />} />
        <Route path="/s3/a-bio-library" element={<S3ABioLibrary />} />

        {/* S1 new routes */}
        <Route path="/s1" element={<S1Hub />} />
        <Route path="/s1/efb" element={<S1Efb />} />
        <Route path="/s1/opdc" element={<S1Opdc />} />
        <Route path="/s1/pos" element={<S1Pos />} />
        <Route path="/s1-combined" element={<S1Combined />} />
        <Route path="/s1-engineering" element={<S1Engineering />} />
        <Route path="/s1-engineering-print" element={<S1EngineeringPrint />} />
        <Route path="/s0-residue-select" element={<S0ResidueSelector />} />

        {/* S1 redirects from old paths */}
        <Route path="/s1-index" element={<Navigate to="/s1" replace />} />
        <Route path="/S1-index" element={<Navigate to="/s1" replace />} />
        <Route path="/s1-capex-opex" element={<S1Financials />} />
        <Route path="/s1-efb-ascii" element={<Navigate to="/s1/efb" replace />} />
        <Route path="/s1-efb-spec" element={<Navigate to="/s1/efb" replace />} />
        <Route path="/s1-floor-efb" element={<Navigate to="/s1/efb" replace />} />
        <Route path="/s1-opdc-ascii" element={<Navigate to="/s1/opdc" replace />} />
        <Route path="/s1-opdc-spec" element={<Navigate to="/s1/opdc" replace />} />
        <Route path="/s1-floor-opdc" element={<Navigate to="/s1/opdc" replace />} />
        <Route path="/s1-pos-ascii" element={<Navigate to="/s1/pos" replace />} />
        <Route path="/s1-pos-spec" element={<Navigate to="/s1/pos" replace />} />
        <Route path="/s1-floor-pos" element={<Navigate to="/s1/pos" replace />} />

        <Route path="/CFI_AG_Management_Planning_Calculator" element={<CFI_AG_Management_Planning_Calculator />} />
      </Routes>
    </MillProvider>
  </BrowserRouter>
);
