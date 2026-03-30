import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MillProvider } from "./contexts/MillContext";
import App from "./App.jsx";
import LabAnalysisV2 from "./pages/LabAnalysisV2.jsx";
import S3Landing from "./pages/S3Landing.jsx";
import S3ABioLibrary from "./pages/S3ABioLibrary.jsx";
import S1Index from "./pages/S1Index.jsx";
import S1CapexOpex from "./pages/S1CapexOpex.jsx";
import S1EfbAscii from "./pages/S1EfbAscii.jsx";
import S1OpdcAscii from "./pages/S1OpdcAscii.jsx";
import S1PosAscii from "./pages/S1PosAscii.jsx";
import S1EfbSpec from "./pages/S1EfbSpec.jsx";
import S1OpdcSpec from "./pages/S1OpdcSpec.jsx";
import S1PosSpec from "./pages/S1PosSpec.jsx";
import S1Combined from "./pages/S1Combined.jsx";
import S1Engineering from "./pages/S1Engineering";
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
        <Route path="/s1-index" element={<S1CapexOpex />} />
        <Route path="/S1-index" element={<S1CapexOpex />} />
        <Route path="/s1-capex-opex" element={<S1CapexOpex />} />
        <Route path="/s1-efb-ascii" element={<S1EfbAscii />} />
        <Route path="/s1-opdc-ascii" element={<S1OpdcAscii />} />
        <Route path="/s1-pos-ascii" element={<S1PosAscii />} />
        <Route path="/s1-efb-spec" element={<S1EfbSpec />} />
        <Route path="/s1-opdc-spec" element={<S1OpdcSpec />} />
        <Route path="/s1-pos-spec" element={<S1PosSpec />} />
        <Route path="/s1-combined" element={<S1Combined />} />
        <Route path="/s1-engineering" element={<S1Engineering />} />
        <Route path="/CFI_AG_Management_Planning_Calculator" element={<CFI_AG_Management_Planning_Calculator />} />
      </Routes>
    </MillProvider>
  </BrowserRouter>
);
