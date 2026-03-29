import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import LabAnalysis from "./pages/LabAnalysis.jsx";
import LabAnalysisV2 from "./pages/LabAnalysisV2.jsx";
import S3Landing from "./pages/S3Landing.jsx";
import S3ABioLibrary from "./pages/S3ABioLibrary.jsx";
import S1Index from "./pages/S1Index.jsx";
import S1CapexOpex from "./pages/S1CapexOpex.jsx";
import S1EfbAscii from "./pages/S1EfbAscii.jsx";
import S1OpdcAscii from "./pages/S1OpdcAscii.jsx";
import S1PosAscii from "./pages/S1PosAscii.jsx";
import CFI_AG_Management_Planning_Calculator from "./CFI_AG_Management_Planning_Calculator.jsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/lab" element={<LabAnalysis />} />
      <Route path="/lab-analysis" element={<LabAnalysisV2 />} />
      <Route path="/s3" element={<S3Landing />} />
      <Route path="/s3/a-bio-library" element={<S3ABioLibrary />} />
      <Route path="/s1-index" element={<S1Index />} />
      <Route path="/S1-index" element={<S1Index />} />
      <Route path="/s1-capex-opex" element={<S1CapexOpex />} />
      <Route path="/s1-efb-ascii" element={<S1EfbAscii />} />
      <Route path="/s1-opdc-ascii" element={<S1OpdcAscii />} />
      <Route path="/s1-pos-ascii" element={<S1PosAscii />} />
    </Routes>
  </BrowserRouter>
);
